
create or replace function public.start_ai_coach_session(
  p_title text default null,
  p_coach_tone text default null,
  p_character_id uuid default null,
  p_diagnosis_result_id uuid default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_coach_tone text;
  v_character_id uuid;
  v_diagnosis_result_id uuid;
  v_session_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  select
    coalesce(p_coach_tone, gp.coach_tone, 'analytical'),
    coalesce(p_character_id, gp.main_character_id)
  into v_coach_tone, v_character_id
  from (select 1) seed
  left join public.user_game_profiles gp
    on gp.user_id = v_user_id;

  if v_coach_tone not in ('gentle', 'strict', 'analytical') then
    raise exception using
      errcode = '22023',
      message = 'The selected coach tone is not available.';
  end if;

  if v_character_id is not null and not exists (
    select 1
    from public.characters c
    where c.id = v_character_id
      and c.is_playable = true
      and c.status = 'published'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected character is not available.';
  end if;

  if p_diagnosis_result_id is not null then
    select r.id
    into v_diagnosis_result_id
    from public.diagnosis_results r
    where r.id = p_diagnosis_result_id
      and r.user_id = v_user_id;

    if v_diagnosis_result_id is null then
      raise exception using
        errcode = '22023',
        message = 'The selected diagnosis result is not available.';
    end if;
  else
    select r.id
    into v_diagnosis_result_id
    from public.diagnosis_results r
    join public.diagnoses d
      on d.id = r.diagnosis_id
     and d.diagnosis_type = 'improvement'
    where r.user_id = v_user_id
    order by r.created_at desc, r.id desc
    limit 1;
  end if;

  insert into public.ai_coach_sessions (
    user_id,
    title,
    coach_tone,
    character_id,
    diagnosis_result_id,
    status
  )
  values (
    v_user_id,
    coalesce(
      nullif(btrim(p_title), ''),
      '振り返り ' || to_char(current_date, 'YYYY/MM/DD')
    ),
    v_coach_tone,
    v_character_id,
    v_diagnosis_result_id,
    'active'
  )
  returning id into v_session_id;

  return v_session_id;
end;
$$;

comment on function public.start_ai_coach_session(text, text, uuid, uuid) is
  'Starts an authenticated user AI coach session. Tone and character default to the game profile; diagnosis defaults to the latest improvement result.';

revoke all on function public.start_ai_coach_session(text, text, uuid, uuid) from public;
revoke all on function public.start_ai_coach_session(text, text, uuid, uuid) from anon;
grant execute on function public.start_ai_coach_session(text, text, uuid, uuid) to authenticated;
grant execute on function public.start_ai_coach_session(text, text, uuid, uuid) to service_role;


create or replace function public.append_ai_coach_user_message(
  p_session_id uuid,
  p_content text
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_content text := nullif(btrim(p_content), '');
  v_message_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  if v_content is null then
    raise exception using
      errcode = '22023',
      message = 'A message is required.';
  end if;

  if char_length(v_content) > 20000 then
    raise exception using
      errcode = '22023',
      message = 'The message is too long.';
  end if;

  if not exists (
    select 1
    from public.ai_coach_sessions s
    where s.id = p_session_id
      and s.user_id = v_user_id
      and s.status = 'active'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected AI coach session is not active.';
  end if;

  insert into public.ai_coach_messages (
    session_id,
    user_id,
    role,
    content,
    grounding_refs
  )
  values (
    p_session_id,
    v_user_id,
    'user',
    v_content,
    '[]'::jsonb
  )
  returning id into v_message_id;

  update public.ai_coach_sessions
  set updated_at = now()
  where id = p_session_id
    and user_id = v_user_id;

  return v_message_id;
end;
$$;

comment on function public.append_ai_coach_user_message(uuid, text) is
  'Appends a user-authored message to an owned active AI coach session. Assistant messages remain server-only.';

revoke all on function public.append_ai_coach_user_message(uuid, text) from public;
revoke all on function public.append_ai_coach_user_message(uuid, text) from anon;
grant execute on function public.append_ai_coach_user_message(uuid, text) to authenticated;
grant execute on function public.append_ai_coach_user_message(uuid, text) to service_role;


create or replace function public.archive_ai_coach_session(
  p_session_id uuid,
  p_summary text default null
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_updated integer;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  if p_summary is not null and char_length(btrim(p_summary)) > 4000 then
    raise exception using
      errcode = '22023',
      message = 'The summary is too long.';
  end if;

  update public.ai_coach_sessions
  set
    status = 'archived',
    summary = coalesce(nullif(btrim(p_summary), ''), summary),
    updated_at = now()
  where id = p_session_id
    and user_id = v_user_id
    and status = 'active';

  get diagnostics v_updated = row_count;
  return v_updated = 1;
end;
$$;

comment on function public.archive_ai_coach_session(uuid, text) is
  'Archives an owned AI coach session and optionally stores a summary.';

revoke all on function public.archive_ai_coach_session(uuid, text) from public;
revoke all on function public.archive_ai_coach_session(uuid, text) from anon;
grant execute on function public.archive_ai_coach_session(uuid, text) to authenticated;
grant execute on function public.archive_ai_coach_session(uuid, text) to service_role;


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
  'Returns an owned AI coach session with recent conversation and grounded diagnosis, match, training, and weekly-review context.';

revoke all on function public.get_ai_coach_session_context(uuid, integer) from public;
revoke all on function public.get_ai_coach_session_context(uuid, integer) from anon;
grant execute on function public.get_ai_coach_session_context(uuid, integer) to authenticated;
grant execute on function public.get_ai_coach_session_context(uuid, integer) to service_role;
