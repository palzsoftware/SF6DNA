
create or replace function public.get_matchup_performance(
  p_recent_match_count integer default 10,
  p_player_character_id uuid default null
)
returns table (
  player_character_id uuid,
  player_character_name text,
  opponent_character_id uuid,
  opponent_character_name text,
  matches integer,
  wins integer,
  losses integer,
  draws integer,
  win_rate numeric,
  rounds_won integer,
  rounds_lost integer,
  round_win_rate numeric,
  mr_change integer,
  window_start timestamptz,
  window_end timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  with recent as (
    select
      m.*,
      row_number() over (
        order by m.played_at desc, m.created_at desc, m.id desc
      ) as recent_order
    from public.user_match_logs m
    where m.user_id = (select auth.uid())
      and (
        p_player_character_id is null
        or m.player_character_id = p_player_character_id
      )
  ),
  sample as (
    select *
    from recent
    where recent_order <= least(greatest(coalesce(p_recent_match_count, 10), 1), 100)
  )
  select
    s.player_character_id,
    pc.name_ja as player_character_name,
    s.opponent_character_id,
    oc.name_ja as opponent_character_name,
    count(*)::integer as matches,
    count(*) filter (where s.result = 'win')::integer as wins,
    count(*) filter (where s.result = 'loss')::integer as losses,
    count(*) filter (where s.result = 'draw')::integer as draws,
    round(
      100.0 * count(*) filter (where s.result = 'win') / nullif(count(*), 0),
      1
    ) as win_rate,
    coalesce(sum(s.rounds_won), 0)::integer as rounds_won,
    coalesce(sum(s.rounds_lost), 0)::integer as rounds_lost,
    round(
      100.0 * coalesce(sum(s.rounds_won), 0)
      / nullif(coalesce(sum(s.rounds_won), 0) + coalesce(sum(s.rounds_lost), 0), 0),
      1
    ) as round_win_rate,
    coalesce(
      (
        array_agg(s.mr_after order by s.played_at desc, s.created_at desc)
        filter (where s.mr_after is not null)
      )[1]
      -
      (
        array_agg(s.mr_before order by s.played_at asc, s.created_at asc)
        filter (where s.mr_before is not null)
      )[1],
      0
    )::integer as mr_change,
    min(s.played_at) as window_start,
    max(s.played_at) as window_end
  from sample s
  join public.characters pc on pc.id = s.player_character_id
  join public.characters oc on oc.id = s.opponent_character_id
  group by
    s.player_character_id,
    pc.name_ja,
    s.opponent_character_id,
    oc.name_ja
  order by win_rate asc, matches desc, opponent_character_name;
$$;

comment on function public.get_matchup_performance(integer, uuid) is
  'Authenticated user''s latest N matches, grouped by player and opponent character. Default N is 10.';

revoke all on function public.get_matchup_performance(integer, uuid) from public;
revoke all on function public.get_matchup_performance(integer, uuid) from anon;
grant execute on function public.get_matchup_performance(integer, uuid) to authenticated;
grant execute on function public.get_matchup_performance(integer, uuid) to service_role;


create or replace function public.get_issue_trends(
  p_recent_match_count integer default 10,
  p_player_character_id uuid default null,
  p_change_threshold_points numeric default 10
)
returns table (
  issue_key text,
  issue_label text,
  recent_matches integer,
  recent_issue_count integer,
  recent_issue_rate numeric,
  previous_matches integer,
  previous_issue_count integer,
  previous_issue_rate numeric,
  change_points numeric,
  trend text
)
language sql
stable
security invoker
set search_path = ''
as $$
  with params as (
    select
      least(greatest(coalesce(p_recent_match_count, 10), 1), 100) as sample_size,
      least(greatest(coalesce(p_change_threshold_points, 10), 0), 100) as threshold_points
  ),
  issue_types(issue_key, issue_label, display_order) as (
    values
      ('knowledge'::text, '知識不足'::text, 1),
      ('execution'::text, '操作・コンボのミス'::text, 2),
      ('decision'::text, '判断ミス'::text, 3),
      ('habit'::text, '行動の癖'::text, 4),
      ('matchup'::text, 'キャラクター対策不足'::text, 5),
      ('unknown'::text, '未分類'::text, 6)
  ),
  ordered as (
    select
      m.primary_issue,
      row_number() over (
        order by m.played_at desc, m.created_at desc, m.id desc
      ) as recent_order
    from public.user_match_logs m
    where m.user_id = (select auth.uid())
      and (
        p_player_character_id is null
        or m.player_character_id = p_player_character_id
      )
  ),
  totals as (
    select
      count(*) filter (where o.recent_order <= p.sample_size)::integer as recent_matches,
      count(*) filter (
        where o.recent_order > p.sample_size
          and o.recent_order <= p.sample_size * 2
      )::integer as previous_matches
    from ordered o
    cross join params p
  ),
  counts as (
    select
      i.issue_key,
      i.issue_label,
      i.display_order,
      count(*) filter (
        where o.primary_issue = i.issue_key
          and o.recent_order <= p.sample_size
      )::integer as recent_issue_count,
      count(*) filter (
        where o.primary_issue = i.issue_key
          and o.recent_order > p.sample_size
          and o.recent_order <= p.sample_size * 2
      )::integer as previous_issue_count
    from issue_types i
    cross join params p
    left join ordered o on true
    group by i.issue_key, i.issue_label, i.display_order, p.sample_size
  ),
  rates as (
    select
      c.*,
      t.recent_matches,
      t.previous_matches,
      round(100.0 * c.recent_issue_count / nullif(t.recent_matches, 0), 1) as recent_issue_rate,
      round(100.0 * c.previous_issue_count / nullif(t.previous_matches, 0), 1) as previous_issue_rate
    from counts c
    cross join totals t
  )
  select
    r.issue_key,
    r.issue_label,
    r.recent_matches,
    r.recent_issue_count,
    r.recent_issue_rate,
    r.previous_matches,
    r.previous_issue_count,
    r.previous_issue_rate,
    round(r.recent_issue_rate - r.previous_issue_rate, 1) as change_points,
    case
      when r.recent_matches < p.sample_size or r.previous_matches < p.sample_size
        then 'insufficient'
      when r.recent_issue_rate - r.previous_issue_rate >= p.threshold_points
        then 'increasing'
      when r.recent_issue_rate - r.previous_issue_rate <= -p.threshold_points
        then 'decreasing'
      else 'stable'
    end as trend
  from rates r
  cross join params p
  order by r.display_order;
$$;

comment on function public.get_issue_trends(integer, uuid, numeric) is
  'Compares issue rates in the latest N matches with the preceding N matches. Default N=10 and trend threshold=10 percentage points.';

revoke all on function public.get_issue_trends(integer, uuid, numeric) from public;
revoke all on function public.get_issue_trends(integer, uuid, numeric) from anon;
grant execute on function public.get_issue_trends(integer, uuid, numeric) to authenticated;
grant execute on function public.get_issue_trends(integer, uuid, numeric) to service_role;


create or replace function public.get_training_progress(
  p_recent_session_count integer default 10,
  p_player_character_id uuid default null
)
returns table (
  training_id uuid,
  training_name text,
  sessions integer,
  total_minutes integer,
  total_attempts integer,
  total_successes integer,
  success_rate numeric,
  initial_self_rating smallint,
  latest_self_rating smallint,
  self_rating_change integer,
  first_practiced_at timestamptz,
  last_practiced_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  with ordered as (
    select
      l.*,
      t.name as catalog_training_name,
      t.player_character_id,
      row_number() over (
        order by l.practiced_at desc, l.created_at desc, l.id desc
      ) as recent_order
    from public.user_training_logs l
    left join public.trainings t on t.id = l.training_id
    where l.user_id = (select auth.uid())
      and (
        p_player_character_id is null
        or t.player_character_id = p_player_character_id
      )
  ),
  sample as (
    select *
    from ordered
    where recent_order <= least(greatest(coalesce(p_recent_session_count, 10), 1), 100)
  ),
  grouped as (
    select
      s.training_id,
      coalesce(s.catalog_training_name, s.custom_title, '自由練習') as training_name,
      count(*)::integer as sessions,
      coalesce(sum(s.duration_minutes), 0)::integer as total_minutes,
      coalesce(sum(s.attempts), 0)::integer as total_attempts,
      coalesce(sum(s.successes), 0)::integer as total_successes,
      round(
        100.0 * coalesce(sum(s.successes), 0)
        / nullif(coalesce(sum(s.attempts), 0), 0),
        1
      ) as success_rate,
      (
        array_agg(s.self_rating order by s.practiced_at asc, s.created_at asc)
        filter (where s.self_rating is not null)
      )[1]::smallint as initial_self_rating,
      (
        array_agg(s.self_rating order by s.practiced_at desc, s.created_at desc)
        filter (where s.self_rating is not null)
      )[1]::smallint as latest_self_rating,
      min(s.practiced_at) as first_practiced_at,
      max(s.practiced_at) as last_practiced_at
    from sample s
    group by
      s.training_id,
      coalesce(s.catalog_training_name, s.custom_title, '自由練習')
  )
  select
    g.training_id,
    g.training_name,
    g.sessions,
    g.total_minutes,
    g.total_attempts,
    g.total_successes,
    g.success_rate,
    g.initial_self_rating,
    g.latest_self_rating,
    case
      when g.initial_self_rating is null or g.latest_self_rating is null then null
      else g.latest_self_rating::integer - g.initial_self_rating::integer
    end as self_rating_change,
    g.first_practiced_at,
    g.last_practiced_at
  from grouped g
  order by g.last_practiced_at desc, g.training_name;
$$;

comment on function public.get_training_progress(integer, uuid) is
  'Summarizes the authenticated user''s latest N training sessions and shows measured success rate and self-rating change without inferring causality.';

revoke all on function public.get_training_progress(integer, uuid) from public;
revoke all on function public.get_training_progress(integer, uuid) from anon;
grant execute on function public.get_training_progress(integer, uuid) to authenticated;
grant execute on function public.get_training_progress(integer, uuid) to service_role;


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
    select r.id
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
      rec_row.recommendation_order::integer as sort_priority,
      r.created_at as source_created_at,
      'diagnosis'::text as source_type,
      null::uuid as training_plan_id,
      rec_row.focus_key,
      rec_row.focus_label,
      rec_row.training_id,
      rec_row.training_name,
      rec_row.training_type,
      rec_row.purpose,
      rec_row.duration_minutes,
      rec_row.method,
      rec_row.success_criteria,
      rec_row.recommended_reps,
      ('診断結果の優先課題「' || rec_row.focus_label || '」に対応')::text as rationale
    from latest_improvement_result latest
    join public.diagnosis_results r on r.id = latest.id
    cross join lateral (
      select
        row_number() over () as recommendation_order,
        rec.*
      from public.get_training_recommendations_for_result(
        latest.id,
        p_player_character_id,
        p_opponent_character_id,
        least(greatest(coalesce(p_limit, 3), 1), 12)
      ) rec
    ) rec_row
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
        order by c.source_rank, c.sort_priority, c.source_created_at desc
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

comment on function public.get_today_training_recommendations(uuid, uuid, integer) is
  'Returns up to three due active plans, then fills remaining slots from the authenticated user''s latest improvement diagnosis. Read only.';

revoke all on function public.get_today_training_recommendations(uuid, uuid, integer) from public;
revoke all on function public.get_today_training_recommendations(uuid, uuid, integer) from anon;
grant execute on function public.get_today_training_recommendations(uuid, uuid, integer) to authenticated;
grant execute on function public.get_today_training_recommendations(uuid, uuid, integer) to service_role;


create or replace function public.get_weekly_progress_review(
  p_week_start date default null,
  p_player_character_id uuid default null
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with bounds as (
    select
      coalesce(p_week_start, date_trunc('week', current_date)::date) as week_start
  ),
  periods as (
    select
      b.week_start,
      (b.week_start + 7) as week_end,
      (b.week_start - 7) as previous_week_start
    from bounds b
  ),
  current_matches as (
    select m.*
    from public.user_match_logs m
    cross join periods p
    where m.user_id = (select auth.uid())
      and m.played_at >= p.week_start::timestamptz
      and m.played_at < p.week_end::timestamptz
      and (
        p_player_character_id is null
        or m.player_character_id = p_player_character_id
      )
  ),
  previous_matches as (
    select m.*
    from public.user_match_logs m
    cross join periods p
    where m.user_id = (select auth.uid())
      and m.played_at >= p.previous_week_start::timestamptz
      and m.played_at < p.week_start::timestamptz
      and (
        p_player_character_id is null
        or m.player_character_id = p_player_character_id
      )
  ),
  current_match_summary as (
    select
      count(*)::integer as matches,
      count(*) filter (where result = 'win')::integer as wins,
      count(*) filter (where result = 'loss')::integer as losses,
      count(*) filter (where result = 'draw')::integer as draws,
      round(100.0 * count(*) filter (where result = 'win') / nullif(count(*), 0), 1) as win_rate,
      coalesce(
        (
          array_agg(mr_after order by played_at desc, created_at desc)
          filter (where mr_after is not null)
        )[1]
        -
        (
          array_agg(mr_before order by played_at asc, created_at asc)
          filter (where mr_before is not null)
        )[1],
        0
      )::integer as mr_change
    from current_matches
  ),
  previous_match_summary as (
    select
      count(*)::integer as matches,
      count(*) filter (where result = 'win')::integer as wins,
      count(*) filter (where result = 'loss')::integer as losses,
      count(*) filter (where result = 'draw')::integer as draws,
      round(100.0 * count(*) filter (where result = 'win') / nullif(count(*), 0), 1) as win_rate,
      coalesce(
        (
          array_agg(mr_after order by played_at desc, created_at desc)
          filter (where mr_after is not null)
        )[1]
        -
        (
          array_agg(mr_before order by played_at asc, created_at asc)
          filter (where mr_before is not null)
        )[1],
        0
      )::integer as mr_change
    from previous_matches
  ),
  matchup_rows as (
    select
      m.player_character_id,
      pc.name_ja as player_character_name,
      m.opponent_character_id,
      oc.name_ja as opponent_character_name,
      count(*)::integer as matches,
      count(*) filter (where m.result = 'win')::integer as wins,
      count(*) filter (where m.result = 'loss')::integer as losses,
      round(100.0 * count(*) filter (where m.result = 'win') / nullif(count(*), 0), 1) as win_rate
    from current_matches m
    join public.characters pc on pc.id = m.player_character_id
    join public.characters oc on oc.id = m.opponent_character_id
    group by m.player_character_id, pc.name_ja, m.opponent_character_id, oc.name_ja
  ),
  issue_rows as (
    select
      m.primary_issue as issue_key,
      case m.primary_issue
        when 'knowledge' then '知識不足'
        when 'execution' then '操作・コンボのミス'
        when 'decision' then '判断ミス'
        when 'habit' then '行動の癖'
        when 'matchup' then 'キャラクター対策不足'
        else '未分類'
      end as issue_label,
      count(*)::integer as issue_count,
      round(
        100.0 * count(*) / nullif((select count(*) from current_matches), 0),
        1
      ) as issue_rate
    from current_matches m
    group by m.primary_issue
  ),
  current_training as (
    select l.*, t.name as training_name, t.player_character_id
    from public.user_training_logs l
    left join public.trainings t on t.id = l.training_id
    cross join periods p
    where l.user_id = (select auth.uid())
      and l.practiced_at >= p.week_start::timestamptz
      and l.practiced_at < p.week_end::timestamptz
      and (
        p_player_character_id is null
        or t.player_character_id = p_player_character_id
      )
  ),
  previous_training as (
    select l.*, t.player_character_id
    from public.user_training_logs l
    left join public.trainings t on t.id = l.training_id
    cross join periods p
    where l.user_id = (select auth.uid())
      and l.practiced_at >= p.previous_week_start::timestamptz
      and l.practiced_at < p.week_start::timestamptz
      and (
        p_player_character_id is null
        or t.player_character_id = p_player_character_id
      )
  ),
  current_training_summary as (
    select
      count(*)::integer as sessions,
      coalesce(sum(duration_minutes), 0)::integer as minutes,
      coalesce(sum(attempts), 0)::integer as attempts,
      coalesce(sum(successes), 0)::integer as successes,
      round(
        100.0 * coalesce(sum(successes), 0)
        / nullif(coalesce(sum(attempts), 0), 0),
        1
      ) as success_rate,
      round(avg(self_rating), 1) as average_self_rating
    from current_training
  ),
  previous_training_summary as (
    select
      count(*)::integer as sessions,
      coalesce(sum(duration_minutes), 0)::integer as minutes,
      coalesce(sum(attempts), 0)::integer as attempts,
      coalesce(sum(successes), 0)::integer as successes,
      round(
        100.0 * coalesce(sum(successes), 0)
        / nullif(coalesce(sum(attempts), 0), 0),
        1
      ) as success_rate,
      round(avg(self_rating), 1) as average_self_rating
    from previous_training
  ),
  training_rows as (
    select
      l.training_id,
      coalesce(l.training_name, l.custom_title, '自由練習') as training_name,
      count(*)::integer as sessions,
      coalesce(sum(l.duration_minutes), 0)::integer as minutes,
      round(
        100.0 * coalesce(sum(l.successes), 0)
        / nullif(coalesce(sum(l.attempts), 0), 0),
        1
      ) as success_rate,
      round(avg(l.self_rating), 1) as average_self_rating
    from current_training l
    group by l.training_id, coalesce(l.training_name, l.custom_title, '自由練習')
  ),
  completed_plans as (
    select count(*)::integer as completed
    from public.user_training_plans plan
    cross join periods p
    where plan.user_id = (select auth.uid())
      and plan.status = 'completed'
      and plan.completed_at >= p.week_start::timestamptz
      and plan.completed_at < p.week_end::timestamptz
  )
  select jsonb_build_object(
    'week_start', p.week_start,
    'week_end', p.week_end - 1,
    'player_character_id', p_player_character_id,
    'matches', to_jsonb(cms),
    'previous_week_matches', to_jsonb(pms),
    'matchups', coalesce((
      select jsonb_agg(to_jsonb(mr) order by mr.win_rate asc, mr.matches desc, mr.opponent_character_name)
      from matchup_rows mr
    ), '[]'::jsonb),
    'issues', coalesce((
      select jsonb_agg(to_jsonb(ir) order by ir.issue_count desc, ir.issue_key)
      from issue_rows ir
    ), '[]'::jsonb),
    'training', to_jsonb(cts) || jsonb_build_object('completed_plans', cp.completed),
    'previous_week_training', to_jsonb(pts),
    'training_items', coalesce((
      select jsonb_agg(to_jsonb(tr) order by tr.minutes desc, tr.training_name)
      from training_rows tr
    ), '[]'::jsonb)
  )
  from periods p
  cross join current_match_summary cms
  cross join previous_match_summary pms
  cross join current_training_summary cts
  cross join previous_training_summary pts
  cross join completed_plans cp;
$$;

comment on function public.get_weekly_progress_review(date, uuid) is
  'Returns a read-only weekly review context for the authenticated user, including prior-week comparison, matchups, issues, training, and completed plans.';

revoke all on function public.get_weekly_progress_review(date, uuid) from public;
revoke all on function public.get_weekly_progress_review(date, uuid) from anon;
grant execute on function public.get_weekly_progress_review(date, uuid) to authenticated;
grant execute on function public.get_weekly_progress_review(date, uuid) to service_role;
