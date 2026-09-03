
create or replace function public.get_today_training_recommendations(
  p_player_character_id uuid default null,
  p_opponent_character_id uuid default null,
  p_limit integer default 3
)
returns table (
  recommendation_order bigint,
  source_type text,
  training_plan_id uuid,
  focus_key text,
  focus_label text,
  training_id uuid,
  training_name text,
  training_type text,
  purpose text,
  duration_minutes integer,
  method text,
  success_criteria text,
  recommended_reps integer,
  rationale text
)
language sql
stable
security invoker
set search_path = ''
as $$
  with active_plans as (
    select
      0 as source_rank,
      p.priority::integer as sort_priority,
      p.created_at as source_created_at,
      'active_plan'::text as source_type,
      p.id as training_plan_id,
      p.focus_key,
      case p.focus_key
        when 'anti_air' then '対空'
        when 'drive_rush_defense' then 'ドライブラッシュへの対応'
        when 'impact_response' then 'ドライブインパクトへの対応'
        when 'punish' then '確定反撃'
        when 'defense' then '防御の使い分け'
        when 'offense' then '攻めの組み立て'
        when 'meter' then 'ゲージ管理'
        when 'matchup' then 'キャラクター対策'
        when 'execution' then 'コンボと操作の安定'
        when 'neutral' then '中距離と差し合い'
        when 'corner_defense' then '画面端からの脱出'
        when 'decision' then '観察と判断'
        else p.focus_key
      end as focus_label,
      t.id as training_id,
      t.name as training_name,
      t.training_type,
      t.purpose,
      t.duration_minutes,
      t.method,
      t.success_criteria,
      t.recommended_reps,
      p.rationale
    from public.user_training_plans p
    join public.trainings t on t.id = p.training_id
    where p.user_id = (select auth.uid())
      and p.status in ('planned', 'in_progress')
      and (p.scheduled_for is null or p.scheduled_for <= current_date)
      and (
        p_player_character_id is null
        or t.player_character_id is null
        or t.player_character_id = p_player_character_id
      )
      and (
        p_opponent_character_id is null
        or t.dummy_character_id is null
        or t.dummy_character_id = p_opponent_character_id
      )
  ),
  latest_improvement_result as (
    select r.id, r.created_at
    from public.diagnosis_results r
    join public.diagnoses d
      on d.id = r.diagnosis_id
     and d.diagnosis_type = 'improvement'
    where r.user_id = (select auth.uid())
    order by r.created_at desc, r.id desc
    limit 1
  ),
  diagnosis_recommendations as (
    select
      1 as source_rank,
      priority.priority_order::integer as sort_priority,
      latest.created_at as source_created_at,
      'diagnosis'::text as source_type,
      null::uuid as training_plan_id,
      rec.focus_key,
      rec.focus_label,
      rec.training_id,
      rec.training_name,
      rec.training_type,
      rec.purpose,
      rec.duration_minutes,
      rec.method,
      rec.success_criteria,
      rec.recommended_reps,
      ('診断結果の優先課題「' || rec.focus_label || '」に対応')::text as rationale
    from latest_improvement_result latest
    cross join lateral public.get_training_recommendations_for_result(
      latest.id,
      p_player_character_id,
      p_opponent_character_id,
      least(greatest(coalesce(p_limit, 3), 1), 12)
    ) rec
    join lateral public.get_improvement_priorities(latest.id, 3) priority
      on priority.focus_key = rec.focus_key
  ),
  candidates as (
    select * from active_plans
    union all
    select * from diagnosis_recommendations
  ),
  deduplicated as (
    select
      c.*,
      row_number() over (
        partition by c.training_id
        order by c.source_rank, c.sort_priority, c.source_created_at desc, c.training_id
      ) as duplicate_order
    from candidates c
  ),
  selected as (
    select *
    from deduplicated
    where duplicate_order = 1
    order by source_rank, sort_priority, source_created_at desc, training_id
    limit least(greatest(coalesce(p_limit, 3), 1), 12)
  )
  select
    row_number() over (
      order by s.source_rank, s.sort_priority, s.source_created_at desc, s.training_id
    ) as recommendation_order,
    s.source_type,
    s.training_plan_id,
    s.focus_key,
    s.focus_label,
    s.training_id,
    s.training_name,
    s.training_type,
    s.purpose,
    s.duration_minutes,
    s.method,
    s.success_criteria,
    s.recommended_reps,
    s.rationale
  from selected s
  order by recommendation_order;
$$;

revoke all on function public.get_today_training_recommendations(uuid, uuid, integer) from public;
revoke all on function public.get_today_training_recommendations(uuid, uuid, integer) from anon;
grant execute on function public.get_today_training_recommendations(uuid, uuid, integer) to authenticated;
grant execute on function public.get_today_training_recommendations(uuid, uuid, integer) to service_role;


create or replace function public.get_ai_coach_context(
  p_recent_match_limit integer default 20,
  p_recent_training_limit integer default 20
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with profile as (
    select gp.*
    from public.user_game_profiles gp
    where gp.user_id = (select auth.uid())
  )
  select jsonb_build_object(
    'game_profile', (
      select to_jsonb(gp)
      from profile gp
    ),
    'latest_diagnosis', (
      select jsonb_build_object(
        'id', r.id,
        'diagnosis_id', r.diagnosis_id,
        'diagnosis_title', d.title,
        'diagnosis_type', d.diagnosis_type,
        'result_payload', r.result_payload,
        'created_at', r.created_at
      )
      from public.diagnosis_results r
      join public.diagnoses d on d.id = r.diagnosis_id
      where r.user_id = (select auth.uid())
      order by r.created_at desc
      limit 1
    ),
    'recent_matches', coalesce((
      select jsonb_agg(to_jsonb(m) order by m.played_at desc)
      from (
        select *
        from public.user_match_logs
        where user_id = (select auth.uid())
        order by played_at desc
        limit least(greatest(coalesce(p_recent_match_limit, 20), 1), 50)
      ) m
    ), '[]'::jsonb),
    'recent_training', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.practiced_at desc)
      from (
        select *
        from public.user_training_logs
        where user_id = (select auth.uid())
        order by practiced_at desc
        limit least(greatest(coalesce(p_recent_training_limit, 20), 1), 50)
      ) t
    ), '[]'::jsonb),
    'active_training_plans', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.priority, p.created_at desc)
      from (
        select *
        from public.user_training_plans
        where user_id = (select auth.uid())
          and status in ('planned', 'in_progress')
        order by priority, created_at desc
        limit 20
      ) p
    ), '[]'::jsonb),
    'latest_10_matchups', coalesce((
      select jsonb_agg(
        to_jsonb(m)
        order by m.win_rate asc nulls last, m.matches desc, m.opponent_character_name
      )
      from public.get_matchup_performance(
        10,
        (select gp.main_character_id from profile gp)
      ) m
    ), '[]'::jsonb),
    'issue_trends', coalesce((
      select jsonb_agg(to_jsonb(i) order by i.recent_issue_count desc, i.issue_key)
      from public.get_issue_trends(
        10,
        (select gp.main_character_id from profile gp),
        10
      ) i
    ), '[]'::jsonb),
    'training_progress', coalesce((
      select jsonb_agg(to_jsonb(tp) order by tp.last_practiced_at desc, tp.training_name)
      from public.get_training_progress(
        10,
        (select gp.main_character_id from profile gp)
      ) tp
    ), '[]'::jsonb),
    'today_training', coalesce((
      select jsonb_agg(to_jsonb(tt) order by tt.recommendation_order)
      from public.get_today_training_recommendations(
        (select gp.main_character_id from profile gp),
        null,
        3
      ) tt
    ), '[]'::jsonb),
    'weekly_review', public.get_weekly_progress_review(
      null,
      (select gp.main_character_id from profile gp)
    )
  );
$$;

comment on function public.get_ai_coach_context(integer, integer) is
  'Authenticated user context for AI coaching, including raw recent activity, latest-10 matchup and issue summaries, today''s training, and weekly review.';

revoke all on function public.get_ai_coach_context(integer, integer) from public;
revoke all on function public.get_ai_coach_context(integer, integer) from anon;
grant execute on function public.get_ai_coach_context(integer, integer) to authenticated;
grant execute on function public.get_ai_coach_context(integer, integer) to service_role;
