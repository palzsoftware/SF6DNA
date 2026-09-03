
create or replace function private.validate_user_training_plan()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_auth_user_id uuid := (select auth.uid());
begin
  if v_auth_user_id is not null and new.user_id <> v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A training plan can only be written for the authenticated user.';
  end if;

  if tg_op = 'UPDATE' and (
    new.user_id is distinct from old.user_id
    or new.created_at is distinct from old.created_at
  ) then
    raise exception using
      errcode = '42501',
      message = 'Training plan ownership and creation time are immutable.';
  end if;

  if tg_op = 'INSERT'
     or new.training_id is distinct from old.training_id then
    if not private.is_training_public_ready(new.training_id) then
      raise exception using
        errcode = '22023',
        message = 'The selected training is not publicly available.';
    end if;
  end if;

  case new.source_type
    when 'diagnosis' then
      if not exists (
        select 1
        from public.diagnosis_results r
        where r.id = new.source_diagnosis_result_id
          and r.user_id = new.user_id
      ) then
        raise exception using
          errcode = '22023',
          message = 'The diagnosis result does not belong to this user.';
      end if;

    when 'match_log' then
      if not exists (
        select 1
        from public.user_match_logs m
        where m.id = new.source_match_log_id
          and m.user_id = new.user_id
      ) then
        raise exception using
          errcode = '22023',
          message = 'The match log does not belong to this user.';
      end if;

    when 'ai_coach' then
      if not exists (
        select 1
        from public.ai_coach_sessions s
        where s.id = new.source_coach_session_id
          and s.user_id = new.user_id
      ) then
        raise exception using
          errcode = '22023',
          message = 'The AI coach session does not belong to this user.';
      end if;

    when 'manual' then
      null;

    else
      raise exception using
        errcode = '22023',
        message = 'The training-plan source is invalid.';
  end case;

  return new;
end;
$$;

revoke all on function private.validate_user_training_plan() from public;
revoke all on function private.validate_user_training_plan() from anon;
revoke all on function private.validate_user_training_plan() from authenticated;

create trigger validate_user_training_plan
before insert or update on public.user_training_plans
for each row execute function private.validate_user_training_plan();

create or replace function private.validate_user_training_log_plan()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_auth_user_id uuid := (select auth.uid());
  v_plan_training_id uuid;
begin
  if v_auth_user_id is not null and new.user_id <> v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A training log can only be written for the authenticated user.';
  end if;

  if tg_op = 'UPDATE' and (
    new.user_id is distinct from old.user_id
    or new.created_at is distinct from old.created_at
  ) then
    raise exception using
      errcode = '42501',
      message = 'Training log ownership and creation time are immutable.';
  end if;

  if new.training_plan_id is null then
    return new;
  end if;

  select p.training_id
  into v_plan_training_id
  from public.user_training_plans p
  where p.id = new.training_plan_id
    and p.user_id = new.user_id;

  if not found then
    raise exception using
      errcode = '22023',
      message = 'The selected training plan does not belong to this user.';
  end if;

  if new.training_id is distinct from v_plan_training_id then
    raise exception using
      errcode = '22023',
      message = 'The training does not match the selected plan.';
  end if;

  return new;
end;
$$;

revoke all on function private.validate_user_training_log_plan() from public;
revoke all on function private.validate_user_training_log_plan() from anon;
revoke all on function private.validate_user_training_log_plan() from authenticated;

create trigger guard_user_training_log_plan
before insert or update on public.user_training_logs
for each row execute function private.validate_user_training_log_plan();
