alter table public.diagnosis_results
  add column request_id uuid;

create unique index diagnosis_results_user_diagnosis_request_key
  on public.diagnosis_results (user_id, diagnosis_id, request_id)
  where request_id is not null;

comment on column public.diagnosis_results.request_id is
  'Client-generated idempotency key. Reusing the same key for the same user and diagnosis returns the existing result.';

drop function public.save_diagnosis_result_with_answers(uuid, jsonb, jsonb);

create function public.save_diagnosis_result_with_answers(
  p_diagnosis_id uuid,
  p_result_payload jsonb,
  p_answers jsonb,
  p_request_id uuid default null
)
returns uuid
language plpgsql
set search_path = ''
as $function$
declare
  v_user_id uuid := (select auth.uid());
  v_expected_count integer;
  v_answer_count integer;
  v_valid_count integer;
  v_result_id uuid;
  v_existing_payload jsonb;
  v_existing_answers_match boolean;
begin
  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  if jsonb_typeof(p_answers) <> 'array' then
    raise exception 'answers_must_be_array';
  end if;

  select count(*)
    into v_expected_count
  from public.diagnosis_questions q
  where q.diagnosis_id = p_diagnosis_id
    and q.status = 'published';

  if v_expected_count = 0 then
    raise exception 'diagnosis_not_available';
  end if;

  select count(*)
    into v_answer_count
  from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid);

  if v_answer_count <> v_expected_count then
    raise exception 'answer_count_mismatch';
  end if;

  select count(*)
    into v_valid_count
  from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid)
  join public.diagnosis_questions q
    on q.id = a.question_id
   and q.diagnosis_id = p_diagnosis_id
   and q.status = 'published'
  join public.diagnosis_options o
    on o.id = a.option_id
   and o.question_id = a.question_id;

  if v_valid_count <> v_expected_count then
    raise exception 'invalid_question_or_option';
  end if;

  if (
    select count(distinct a.question_id)
    from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid)
  ) <> v_expected_count then
    raise exception 'duplicate_question_answer';
  end if;

  insert into public.diagnosis_results(
    user_id,
    diagnosis_id,
    result_payload,
    request_id
  )
  values (
    v_user_id,
    p_diagnosis_id,
    coalesce(p_result_payload, '{}'::jsonb),
    p_request_id
  )
  on conflict (user_id, diagnosis_id, request_id)
    where request_id is not null
  do nothing
  returning id into v_result_id;

  if v_result_id is null then
    select r.id, r.result_payload
      into v_result_id, v_existing_payload
    from public.diagnosis_results r
    where r.user_id = v_user_id
      and r.diagnosis_id = p_diagnosis_id
      and r.request_id = p_request_id
    for update;

    if v_result_id is null then
      raise exception 'idempotency_conflict_without_result';
    end if;

    select
      count(*) = v_expected_count
      and not exists (
        select a.question_id, a.option_id
        from public.diagnosis_answers a
        where a.diagnosis_result_id = v_result_id
        except
        select j.question_id, j.option_id
        from jsonb_to_recordset(p_answers) as j(question_id uuid, option_id uuid)
      )
      and not exists (
        select j.question_id, j.option_id
        from jsonb_to_recordset(p_answers) as j(question_id uuid, option_id uuid)
        except
        select a.question_id, a.option_id
        from public.diagnosis_answers a
        where a.diagnosis_result_id = v_result_id
      )
      into v_existing_answers_match
    from public.diagnosis_answers a
    where a.diagnosis_result_id = v_result_id;

    if v_existing_payload is distinct from coalesce(p_result_payload, '{}'::jsonb)
       or not coalesce(v_existing_answers_match, false) then
      raise exception 'idempotency_key_reused_with_different_payload';
    end if;

    return v_result_id;
  end if;

  insert into public.diagnosis_answers(
    diagnosis_result_id,
    diagnosis_id,
    question_id,
    option_id
  )
  select
    v_result_id,
    p_diagnosis_id,
    a.question_id,
    a.option_id
  from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid);

  return v_result_id;
end;
$function$;

revoke all on function public.save_diagnosis_result_with_answers(uuid, jsonb, jsonb, uuid)
  from public, anon;
grant execute on function public.save_diagnosis_result_with_answers(uuid, jsonb, jsonb, uuid)
  to authenticated, service_role;
