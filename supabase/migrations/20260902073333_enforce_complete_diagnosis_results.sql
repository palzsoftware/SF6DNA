
revoke all privileges on table public.diagnosis_results from anon;
revoke references, trigger, truncate, update
  on table public.diagnosis_results from authenticated;

alter table public.diagnosis_results
  add constraint diagnosis_results_payload_object_check
    check (jsonb_typeof(result_payload) = 'object');

create or replace function private.validate_diagnosis_result_write()
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
      message = 'A diagnosis result can only be written for the authenticated user.';
  end if;

  if not exists (
    select 1
    from public.diagnoses d
    where d.id = new.diagnosis_id
      and d.status = 'published'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected diagnosis is not available.';
  end if;

  if tg_op = 'UPDATE' and (
    new.user_id is distinct from old.user_id
    or new.diagnosis_id is distinct from old.diagnosis_id
    or new.result_payload is distinct from old.result_payload
    or new.created_at is distinct from old.created_at
  ) then
    raise exception using
      errcode = '55000',
      message = 'A completed diagnosis result is immutable.';
  end if;

  return new;
end;
$$;

revoke all on function private.validate_diagnosis_result_write() from public;
revoke all on function private.validate_diagnosis_result_write() from anon;
revoke all on function private.validate_diagnosis_result_write() from authenticated;

create trigger validate_diagnosis_result_write
before insert or update on public.diagnosis_results
for each row execute function private.validate_diagnosis_result_write();

create or replace function private.validate_diagnosis_result_completeness()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_result_id uuid;
  v_diagnosis_id uuid;
  v_expected_count integer;
  v_actual_count integer;
begin
  if tg_table_name = 'diagnosis_results' then
    v_result_id := case when tg_op = 'DELETE' then old.id else new.id end;
  else
    v_result_id := case
      when tg_op = 'DELETE' then old.diagnosis_result_id
      else new.diagnosis_result_id
    end;
  end if;

  select r.diagnosis_id
  into v_diagnosis_id
  from public.diagnosis_results r
  where r.id = v_result_id;

  if not found then
    return coalesce(new, old);
  end if;

  select count(*)
  into v_expected_count
  from public.diagnosis_questions q
  where q.diagnosis_id = v_diagnosis_id
    and q.status = 'published';

  select count(*)
  into v_actual_count
  from public.diagnosis_answers a
  where a.diagnosis_result_id = v_result_id
    and a.diagnosis_id = v_diagnosis_id;

  if v_expected_count = 0 or v_actual_count <> v_expected_count then
    raise exception using
      errcode = '23514',
      message = format(
        'Diagnosis result %s must contain exactly %s answers; found %s.',
        v_result_id,
        v_expected_count,
        v_actual_count
      );
  end if;

  return coalesce(new, old);
end;
$$;

revoke all on function private.validate_diagnosis_result_completeness() from public;
revoke all on function private.validate_diagnosis_result_completeness() from anon;
revoke all on function private.validate_diagnosis_result_completeness() from authenticated;

create constraint trigger diagnosis_result_must_be_complete
after insert or update on public.diagnosis_results
deferrable initially deferred
for each row execute function private.validate_diagnosis_result_completeness();

create constraint trigger diagnosis_answers_keep_result_complete
after insert or update or delete on public.diagnosis_answers
deferrable initially deferred
for each row execute function private.validate_diagnosis_result_completeness();
