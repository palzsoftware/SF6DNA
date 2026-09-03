
create or replace function public.start_ai_coach_session_from_quick_help(
  p_intake_id uuid,
  p_coach_tone text default null
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_context jsonb;
  v_topic_key text;
  v_player_character_id uuid;
  v_title text;
  v_problem_summary text;
  v_user_message text;
  v_session_id uuid;
  v_message_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  select i.context, i.topic_key
  into v_context, v_topic_key
  from public.coach_quick_help_intakes i
  where i.id = p_intake_id
    and i.user_id = v_user_id
    and i.status = 'ready'
    and i.ai_coach_session_id is null
  for update;

  if v_context is null then
    raise exception using
      errcode = '22023',
      message = 'The selected quick-help intake is not ready.';
  end if;

  v_player_character_id := case
    when v_context #>> '{player_character_id,value}' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      then (v_context #>> '{player_character_id,value}')::uuid
    else null::uuid
  end;

  v_problem_summary := concat_ws(
    ' / ',
    nullif(v_context #>> '{topic_key,label}', ''),
    case
      when nullif(v_context #>> '{opponent_character_id,label}', '') is not null
        then '相手：' || (v_context #>> '{opponent_character_id,label}')
      else null
    end,
    case
      when nullif(v_context #>> '{opponent_move_id,label}', '') is not null
        then '技：' || (v_context #>> '{opponent_move_id,label}')
      else null
    end,
    nullif(v_context #>> '{situation_key,label}', '')
  );

  v_title := left(
    'クイック相談：' ||
    coalesce(
      nullif(v_context #>> '{opponent_move_id,label}', ''),
      nullif(v_context #>> '{opponent_character_id,label}', ''),
      nullif(v_context #>> '{topic_key,label}', ''),
      '困りごと'
    ),
    120
  );

  if nullif(v_context #>> '{question_detail,value}', '') is not null then
    v_user_message :=
      'クイック相談です。' ||
      (v_context #>> '{question_detail,value}') ||
      '。対策と、今すぐ確認できるポイントを教えてください。';
  else
    v_user_message :=
      'クイック相談です。' ||
      coalesce(nullif(v_problem_summary, ''), '対戦中の困りごと') ||
      'について困っています。対策と、今すぐ確認できるポイントを教えてください。';
  end if;

  v_session_id := public.start_ai_coach_session(
    v_title,
    p_coach_tone,
    v_player_character_id,
    null
  );

  v_message_id := public.append_ai_coach_user_message(
    v_session_id,
    v_user_message
  );

  update public.coach_quick_help_intakes
  set
    ai_coach_session_id = v_session_id,
    status = 'linked'
  where id = p_intake_id
    and user_id = v_user_id;

  return jsonb_build_object(
    'intake_id', p_intake_id,
    'session_id', v_session_id,
    'user_message_id', v_message_id,
    'topic_key', v_topic_key,
    'context', v_context,
    'grounding', public.get_quick_help_grounding(p_intake_id, 5)
  );
end;
$$;

comment on function public.start_ai_coach_session_from_quick_help(uuid, text) is
  'Creates an AI coach session and initial user message from a completed quick-help branch, then links the two atomically.';

revoke all on function public.start_ai_coach_session_from_quick_help(uuid, text) from public;
revoke all on function public.start_ai_coach_session_from_quick_help(uuid, text) from anon;
grant execute on function public.start_ai_coach_session_from_quick_help(uuid, text) to authenticated;
grant execute on function public.start_ai_coach_session_from_quick_help(uuid, text) to service_role;


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

comment on function public.get_ai_coach_session_context(uuid, integer) is
  'Returns an owned AI coach session with conversation, quick-help branch, grounded SF6DNA records, diagnosis, match, training, and weekly-review context.';

revoke all on function public.get_ai_coach_session_context(uuid, integer) from public;
revoke all on function public.get_ai_coach_session_context(uuid, integer) from anon;
grant execute on function public.get_ai_coach_session_context(uuid, integer) to authenticated;
grant execute on function public.get_ai_coach_session_context(uuid, integer) to service_role;
