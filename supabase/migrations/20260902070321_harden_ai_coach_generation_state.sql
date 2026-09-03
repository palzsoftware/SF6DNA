
create unique index ai_coach_generations_one_active_per_user_idx
  on public.ai_coach_generations (user_id)
  where status in ('pending', 'streaming');

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
  v_status text;
  v_existing_assistant_message_id uuid;
  v_content text := nullif(btrim(p_content), '');
  v_assistant_message_id uuid;
  v_total_tokens integer;
  v_updated integer;
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

  select
    g.session_id,
    g.user_id,
    g.status,
    g.assistant_message_id
  into
    v_session_id,
    v_user_id,
    v_status,
    v_existing_assistant_message_id
  from public.ai_coach_generations g
  where g.id = p_generation_id
  for update;

  if not found then
    raise exception using
      errcode = '22023',
      message = 'The selected generation is not available.';
  end if;

  if v_status = 'complete' then
    if v_existing_assistant_message_id is null then
      raise exception using
        errcode = '55000',
        message = 'The completed generation has no assistant message.';
    end if;
    return v_existing_assistant_message_id;
  end if;

  if v_status = 'error' then
    raise exception using
      errcode = '22023',
      message = 'The selected generation has already failed.';
  end if;

  if v_status not in ('pending', 'streaming') then
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
  where id = p_generation_id
    and status in ('pending', 'streaming');

  get diagnostics v_updated = row_count;

  if v_updated <> 1 then
    raise exception using
      errcode = '40001',
      message = 'The generation state changed before completion.';
  end if;

  update public.ai_coach_sessions
  set updated_at = now()
  where id = v_session_id;

  return v_assistant_message_id;
end;
$$;

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
  v_status text;
  v_updated integer;
begin
  select g.status
  into v_status
  from public.ai_coach_generations g
  where g.id = p_generation_id
  for update;

  if not found then
    return false;
  end if;

  if v_status = 'error' then
    return true;
  end if;

  if v_status = 'complete' then
    return false;
  end if;

  if v_status not in ('pending', 'streaming') then
    return false;
  end if;

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
