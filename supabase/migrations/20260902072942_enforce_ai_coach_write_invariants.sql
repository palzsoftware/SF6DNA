
create or replace function private.validate_ai_coach_session_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_auth_user_id uuid := (select auth.uid());
begin
  if v_auth_user_id is null then
    return new;
  end if;

  if new.user_id <> v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'An AI coach session can only be written for the authenticated user.';
  end if;

  if new.character_id is not null and not exists (
    select 1
    from public.characters c
    where c.id = new.character_id
      and c.is_playable = true
      and c.status = 'published'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected character is not available.';
  end if;

  if new.diagnosis_result_id is not null and not exists (
    select 1
    from public.diagnosis_results r
    where r.id = new.diagnosis_result_id
      and r.user_id = v_auth_user_id
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected diagnosis result is not available.';
  end if;

  if tg_op = 'INSERT' then
    if new.status <> 'active' then
      raise exception using
        errcode = '22023',
        message = 'A new AI coach session must be active.';
    end if;

    if new.summary is not null then
      raise exception using
        errcode = '42501',
        message = 'A session summary can only be written by the server.';
    end if;
  else
    if new.user_id is distinct from old.user_id
       or new.created_at is distinct from old.created_at then
      raise exception using
        errcode = '42501',
        message = 'AI coach session ownership and creation time are immutable.';
    end if;

    if new.summary is distinct from old.summary then
      raise exception using
        errcode = '42501',
        message = 'A session summary can only be written by the server.';
    end if;

    if old.status = 'archived' and new.status <> 'archived' then
      raise exception using
        errcode = '22023',
        message = 'An archived AI coach session cannot be reactivated.';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.validate_ai_coach_session_write() from public;
revoke all on function private.validate_ai_coach_session_write() from anon;
revoke all on function private.validate_ai_coach_session_write() from authenticated;

create trigger validate_ai_coach_session_write
before insert or update on public.ai_coach_sessions
for each row execute function private.validate_ai_coach_session_write();

create or replace function private.validate_ai_coach_user_message_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_auth_user_id uuid := (select auth.uid());
begin
  if v_auth_user_id is null then
    return new;
  end if;

  if new.user_id <> v_auth_user_id or new.role <> 'user' then
    raise exception using
      errcode = '42501',
      message = 'Only the authenticated user message can be written.';
  end if;

  if not exists (
    select 1
    from public.ai_coach_sessions s
    where s.id = new.session_id
      and s.user_id = v_auth_user_id
      and s.status = 'active'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected AI coach session is not active.';
  end if;

  if new.grounding_refs <> '[]'::jsonb then
    raise exception using
      errcode = '42501',
      message = 'Grounding references can only be written by the server.';
  end if;

  if tg_op = 'UPDATE' then
    if new.user_id is distinct from old.user_id
       or new.session_id is distinct from old.session_id
       or new.role is distinct from old.role
       or new.created_at is distinct from old.created_at then
      raise exception using
        errcode = '42501',
        message = 'AI coach message ownership and identity fields are immutable.';
    end if;

    if new.content is distinct from old.content and exists (
      select 1
      from public.ai_coach_generations g
      where g.user_message_id = old.id
    ) then
      raise exception using
        errcode = '55000',
        message = 'A message cannot be edited after generation has started.';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.validate_ai_coach_user_message_write() from public;
revoke all on function private.validate_ai_coach_user_message_write() from anon;
revoke all on function private.validate_ai_coach_user_message_write() from authenticated;

create trigger validate_ai_coach_user_message_write
before insert or update on public.ai_coach_messages
for each row execute function private.validate_ai_coach_user_message_write();
