
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
    'recent_activity', coalesce((
      select jsonb_agg(to_jsonb(a) order by a.occurred_at desc)
      from public.get_activity_timeline(20, null, null) a
    ), '[]'::jsonb),
    'activity_summary', coalesce((
      select jsonb_agg(to_jsonb(s) order by s.period_start)
      from public.get_activity_summary('week', 4, 'Asia/Tokyo') s
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

revoke all on function public.get_ai_coach_context(integer, integer)
  from public, anon, authenticated;
grant execute on function public.get_ai_coach_context(integer, integer)
  to authenticated;

create or replace function public.get_ai_coach_session_context(
  p_session_id uuid,
  p_message_limit integer default 20
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with session_row as (
    select
      s.id,
      s.title,
      s.coach_tone,
      s.character_id,
      c.name_ja as character_name,
      s.diagnosis_result_id,
      s.status,
      s.summary,
      s.created_at,
      s.updated_at
    from public.ai_coach_sessions s
    left join public.characters c on c.id = s.character_id
    where s.id = p_session_id
      and s.user_id = (select auth.uid())
  ),
  recent_messages as (
    select m.*
    from public.ai_coach_messages m
    join session_row s on s.id = m.session_id
    order by m.created_at desc, m.id desc
    limit least(greatest(coalesce(p_message_limit, 20), 1), 50)
  ),
  quick_help as (
    select i.id, i.topic_key, i.context, i.started_at, i.completed_at
    from public.coach_quick_help_intakes i
    join session_row s on s.id = i.ai_coach_session_id
    where i.user_id = (select auth.uid())
  )
  select jsonb_build_object(
    'session', to_jsonb(s),
    'messages', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'role', m.role,
          'content', m.content,
          'grounding_refs', m.grounding_refs,
          'created_at', m.created_at
        )
        order by m.created_at, m.id
      )
      from recent_messages m
    ), '[]'::jsonb),
    'quick_help', (
      select jsonb_build_object(
        'intake_id', q.id,
        'topic_key', q.topic_key,
        'context', q.context,
        'started_at', q.started_at,
        'completed_at', q.completed_at,
        'grounding', public.get_quick_help_grounding(q.id, 5)
      )
      from quick_help q
      limit 1
    ),
    'recent_activity', coalesce((
      select jsonb_agg(to_jsonb(a) order by a.occurred_at desc)
      from public.get_activity_timeline(12, null, null) a
    ), '[]'::jsonb),
    'activity_summary', coalesce((
      select jsonb_agg(to_jsonb(a) order by a.period_start)
      from public.get_activity_summary('week', 4, 'Asia/Tokyo') a
    ), '[]'::jsonb),
    'diagnosis_priorities', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.priority_order)
      from public.get_improvement_priorities(s.diagnosis_result_id, 3) p
    ), '[]'::jsonb),
    'latest_10_matchups', coalesce((
      select jsonb_agg(
        to_jsonb(m)
        order by m.win_rate asc nulls last, m.matches desc, m.opponent_character_name
      )
      from public.get_matchup_performance(10, s.character_id) m
    ), '[]'::jsonb),
    'issue_trends', coalesce((
      select jsonb_agg(to_jsonb(i) order by i.recent_issue_count desc, i.issue_key)
      from public.get_issue_trends(10, s.character_id, 10) i
    ), '[]'::jsonb),
    'training_progress', coalesce((
      select jsonb_agg(to_jsonb(tp) order by tp.last_practiced_at desc, tp.training_name)
      from public.get_training_progress(10, s.character_id) tp
    ), '[]'::jsonb),
    'today_training', coalesce((
      select jsonb_agg(to_jsonb(tt) order by tt.recommendation_order)
      from public.get_today_training_recommendations(s.character_id, null, 3) tt
    ), '[]'::jsonb),
    'weekly_review', public.get_weekly_progress_review(null, s.character_id)
  )
  from session_row s;
$$;

revoke all on function public.get_ai_coach_session_context(uuid, integer)
  from public, anon, authenticated;
grant execute on function public.get_ai_coach_session_context(uuid, integer)
  to authenticated;
