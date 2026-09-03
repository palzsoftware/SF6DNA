
create or replace function public.begin_ai_coach_generation(
  p_session_id uuid,
  p_user_message_id uuid,
  p_model text,
  p_prompt_hash text default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_generation_id uuid;
begin
  if nullif(btrim(p_model), '') is null then
    raise exception using
      errcode = '22023',
      message = 'A model name is required.';
  end if;

  select s.user_id
  into v_user_id
  from public.ai_coach_sessions s
  where s.id = p_session_id
    and s.status = 'active';

  if v_user_id is null then
    raise exception using
      errcode = '22023',
      message = 'The selected AI coach session is not active.';
  end if;

  if not exists (
    select 1
    from public.ai_coach_messages m
    where m.id = p_user_message_id
      and m.session_id = p_session_id
      and m.user_id = v_user_id
      and m.role = 'user'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected user message is not available.';
  end if;

  insert into public.ai_coach_generations (
    session_id,
    user_id,
    user_message_id,
    model,
    status,
    prompt_hash,
    started_at
  )
  values (
    p_session_id,
    v_user_id,
    p_user_message_id,
    btrim(p_model),
    'pending',
    nullif(btrim(p_prompt_hash), ''),
    now()
  )
  returning id into v_generation_id;

  return v_generation_id;
end;
$$;

comment on function public.begin_ai_coach_generation(uuid, uuid, text, text) is
  'Service-only start of an AI coach generation linked to an owned user message.';

revoke all on function public.begin_ai_coach_generation(uuid, uuid, text, text) from public;
revoke all on function public.begin_ai_coach_generation(uuid, uuid, text, text) from anon;
revoke all on function public.begin_ai_coach_generation(uuid, uuid, text, text) from authenticated;
grant execute on function public.begin_ai_coach_generation(uuid, uuid, text, text) to service_role;


create or replace function public.complete_ai_coach_generation(
  p_generation_id uuid,
  p_content text,
  p_grounding_refs jsonb default '[]'::jsonb,
  p_input_tokens integer default null,
  p_output_tokens integer default null,
  p_estimated_cost_usd numeric default null,
  p_latency_ms integer default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_session_id uuid;
  v_user_id uuid;
  v_content text := nullif(btrim(p_content), '');
  v_assistant_message_id uuid;
  v_total_tokens integer;
begin
  if v_content is null then
    raise exception using
      errcode = '22023',
      message = 'An assistant response is required.';
  end if;

  if char_length(v_content) > 20000 then
    raise exception using
      errcode = '22023',
      message = 'The assistant response is too long.';
  end if;

  if coalesce(jsonb_typeof(p_grounding_refs), 'null') <> 'array' then
    raise exception using
      errcode = '22023',
      message = 'Grounding references must be a JSON array.';
  end if;

  select g.session_id, g.user_id
  into v_session_id, v_user_id
  from public.ai_coach_generations g
  where g.id = p_generation_id
    and g.status in ('pending', 'streaming');

  if v_session_id is null then
    raise exception using
      errcode = '22023',
      message = 'The selected generation is not pending.';
  end if;

  insert into public.ai_coach_messages (
    session_id,
    user_id,
    role,
    content,
    grounding_refs
  )
  values (
    v_session_id,
    v_user_id,
    'assistant',
    v_content,
    coalesce(p_grounding_refs, '[]'::jsonb)
  )
  returning id into v_assistant_message_id;

  v_total_tokens := case
    when p_input_tokens is null and p_output_tokens is null then null
    else coalesce(p_input_tokens, 0) + coalesce(p_output_tokens, 0)
  end;

  update public.ai_coach_generations
  set
    assistant_message_id = v_assistant_message_id,
    status = 'complete',
    input_tokens = p_input_tokens,
    output_tokens = p_output_tokens,
    total_tokens = v_total_tokens,
    estimated_cost_usd = p_estimated_cost_usd,
    latency_ms = p_latency_ms,
    error_code = null,
    error_message = null,
    completed_at = now()
  where id = p_generation_id;

  update public.ai_coach_sessions
  set updated_at = now()
  where id = v_session_id;

  return v_assistant_message_id;
end;
$$;

comment on function public.complete_ai_coach_generation(
  uuid, text, jsonb, integer, integer, numeric, integer
) is
  'Service-only atomic save of an AI coach answer and generation metrics.';

revoke all on function public.complete_ai_coach_generation(
  uuid, text, jsonb, integer, integer, numeric, integer
) from public;
revoke all on function public.complete_ai_coach_generation(
  uuid, text, jsonb, integer, integer, numeric, integer
) from anon;
revoke all on function public.complete_ai_coach_generation(
  uuid, text, jsonb, integer, integer, numeric, integer
) from authenticated;
grant execute on function public.complete_ai_coach_generation(
  uuid, text, jsonb, integer, integer, numeric, integer
) to service_role;


create or replace function public.fail_ai_coach_generation(
  p_generation_id uuid,
  p_error_code text,
  p_error_message text default null,
  p_latency_ms integer default null
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_updated integer;
begin
  update public.ai_coach_generations
  set
    status = 'error',
    error_code = left(coalesce(nullif(btrim(p_error_code), ''), 'generation_error'), 120),
    error_message = left(nullif(btrim(p_error_message), ''), 2000),
    latency_ms = p_latency_ms,
    completed_at = now()
  where id = p_generation_id
    and status in ('pending', 'streaming');

  get diagnostics v_updated = row_count;
  return v_updated = 1;
end;
$$;

comment on function public.fail_ai_coach_generation(uuid, text, text, integer) is
  'Service-only terminal error record for a pending AI coach generation.';

revoke all on function public.fail_ai_coach_generation(uuid, text, text, integer) from public;
revoke all on function public.fail_ai_coach_generation(uuid, text, text, integer) from anon;
revoke all on function public.fail_ai_coach_generation(uuid, text, text, integer) from authenticated;
grant execute on function public.fail_ai_coach_generation(uuid, text, text, integer) to service_role;
