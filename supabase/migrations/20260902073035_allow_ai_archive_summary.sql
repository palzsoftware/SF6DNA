
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
        message = 'A summary can only be saved when a session is archived.';
    end if;
  else
    if new.user_id is distinct from old.user_id
       or new.created_at is distinct from old.created_at then
      raise exception using
        errcode = '42501',
        message = 'AI coach session ownership and creation time are immutable.';
    end if;

    if new.summary is distinct from old.summary
       and not (old.status = 'active' and new.status = 'archived') then
      raise exception using
        errcode = '42501',
        message = 'A summary can only be saved when a session is archived.';
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
