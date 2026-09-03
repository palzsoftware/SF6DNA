
create or replace function private.validate_quick_help_answer_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_auth_user_id uuid := (select auth.uid());
  v_intake_user_id uuid;
  v_flow_id uuid;
  v_current_node_id uuid;
  v_intake_status text;
  v_context jsonb;
  v_input_type text;
  v_answer_key text;
  v_next_node_id uuid;
  v_payload jsonb;
  v_reference_id uuid;
begin
  if tg_op <> 'INSERT' then
    raise exception using
      errcode = '42501',
      message = 'Quick-help answers are immutable.';
  end if;

  select
    i.user_id,
    i.flow_id,
    i.current_node_id,
    i.status,
    i.context,
    n.input_type,
    n.answer_key
  into
    v_intake_user_id,
    v_flow_id,
    v_current_node_id,
    v_intake_status,
    v_context,
    v_input_type,
    v_answer_key
  from public.coach_quick_help_intakes i
  join public.coach_quick_help_nodes n
    on n.id = i.current_node_id
   and n.flow_id = i.flow_id
   and n.node_type = 'question'
  where i.id = new.intake_id
  for update of i;

  if not found
     or v_intake_status <> 'active'
     or new.node_id is distinct from v_current_node_id then
    raise exception using
      errcode = '22023',
      message = 'The answer must belong to the active current quick-help question.';
  end if;

  if new.user_id is distinct from v_intake_user_id then
    raise exception using
      errcode = '42501',
      message = 'The answer user does not match the quick-help intake owner.';
  end if;

  if v_auth_user_id is not null and new.user_id is distinct from v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A quick-help answer can only be written for the authenticated user.';
  end if;

  if v_answer_key is null then
    raise exception using
      errcode = '22023',
      message = 'The current quick-help step does not accept an answer.';
  end if;

  if v_input_type = 'static' then
    if new.option_id is null
       or new.selected_character_id is not null
       or new.selected_move_id is not null
       or new.free_text is not null then
      raise exception using
        errcode = '22023',
        message = 'Select exactly one option for this quick-help question.';
    end if;

    select
      o.id,
      o.next_node_id,
      jsonb_build_object(
        'value', o.option_value,
        'label', o.label,
        'metadata', o.metadata
      )
    into
      v_reference_id,
      v_next_node_id,
      v_payload
    from public.coach_quick_help_options o
    where o.id = new.option_id
      and o.node_id = v_current_node_id;

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The selected option does not belong to the current quick-help question.';
    end if;

  elsif v_input_type = 'character' then
    if new.selected_character_id is null
       or new.option_id is not null
       or new.selected_move_id is not null
       or new.free_text is not null then
      raise exception using
        errcode = '22023',
        message = 'Select exactly one character for this quick-help question.';
    end if;

    select
      c.id,
      jsonb_build_object(
        'value', c.id,
        'label', c.name_ja,
        'slug', c.slug
      )
    into
      v_reference_id,
      v_payload
    from public.characters c
    where c.id = new.selected_character_id
      and c.status = 'published'
      and c.is_playable = true;

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The selected character is not available.';
    end if;

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_current_node_id;

  elsif v_input_type = 'move' then
    if new.selected_move_id is null
       or new.option_id is not null
       or new.selected_character_id is not null
       or new.free_text is not null then
      raise exception using
        errcode = '22023',
        message = 'Select exactly one move for this quick-help question.';
    end if;

    select
      m.id,
      jsonb_build_object(
        'value', m.id,
        'label', m.name_ja,
        'slug', m.slug,
        'move_type', m.move_type,
        'strength_variant', m.strength_variant
      )
    into
      v_reference_id,
      v_payload
    from public.moves m
    where m.id = new.selected_move_id
      and m.status = 'published'
      and m.character_id::text = v_context #>> '{opponent_character_id,value}';

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The selected move does not belong to the selected character.';
    end if;

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_current_node_id;

  elsif v_input_type = 'free_text' then
    new.free_text := nullif(btrim(new.free_text), '');

    if new.free_text is null
       or char_length(new.free_text) > 2000
       or new.option_id is not null
       or new.selected_character_id is not null
       or new.selected_move_id is not null then
      raise exception using
        errcode = '22023',
        message = 'Enter one quick-help question in 1 to 2000 characters.';
    end if;

    v_payload := jsonb_build_object(
      'value', new.free_text,
      'label', new.free_text
    );

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_current_node_id;

  else
    raise exception using
      errcode = '22023',
      message = 'The current quick-help step cannot be answered.';
  end if;

  if v_next_node_id is null
     or not exists (
       select 1
       from public.coach_quick_help_nodes next_node
       where next_node.id = v_next_node_id
         and next_node.flow_id = v_flow_id
     ) then
    raise exception using
      errcode = '22023',
      message = 'The next quick-help step is not valid for this flow.';
  end if;

  new.answer_payload := v_payload;

  if v_auth_user_id is not null then
    new.created_at := now();
  end if;

  return new;
end;
$$;

revoke all on function private.validate_quick_help_answer_write() from public;

drop trigger if exists validate_quick_help_answer_write
on public.coach_quick_help_answers;

create trigger validate_quick_help_answer_write
before insert or update on public.coach_quick_help_answers
for each row
execute function private.validate_quick_help_answer_write();

create or replace function private.validate_quick_help_intake_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_auth_user_id uuid := (select auth.uid());
  v_flow_status text;
  v_root_node_id uuid;
  v_node_type text;
  v_input_type text;
  v_answer_key text;
  v_answer_payload jsonb;
  v_option_id uuid;
  v_next_node_id uuid;
  v_next_node_type text;
  v_expected_context jsonb;
  v_expected_topic_key text;
  v_expected_status text;
  v_ai_session_status text;
begin
  if v_auth_user_id is not null and new.user_id is distinct from v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A quick-help intake can only be written for the authenticated user.';
  end if;

  if tg_op = 'INSERT' then
    select f.status, f.root_node_id, n.node_type
    into v_flow_status, v_root_node_id, v_node_type
    from public.coach_quick_help_flows f
    join public.coach_quick_help_nodes n
      on n.id = f.root_node_id
     and n.flow_id = f.id
    where f.id = new.flow_id;

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The selected quick-help flow has no valid root step.';
    end if;

    if v_auth_user_id is not null
       and not private.is_admin()
       and v_flow_status <> 'published' then
      raise exception using
        errcode = '22023',
        message = 'The selected quick-help flow is not available.';
    end if;

    if new.current_node_id is distinct from v_root_node_id
       or v_node_type <> 'question'
       or new.status <> 'active'
       or new.context <> '{}'::jsonb
       or new.topic_key is not null
       or new.ai_coach_session_id is not null
       or new.completed_at is not null then
      raise exception using
        errcode = '22023',
        message = 'A quick-help intake must start at the root question with empty context.';
    end if;

    if v_auth_user_id is not null then
      new.started_at := now();
    end if;

    return new;
  end if;

  if new.user_id is distinct from old.user_id
     or new.flow_id is distinct from old.flow_id
     or new.started_at is distinct from old.started_at then
    raise exception using
      errcode = '42501',
      message = 'Quick-help intake ownership, flow, and start time are immutable.';
  end if;

  select n.node_type
  into v_node_type
  from public.coach_quick_help_nodes n
  where n.id = new.current_node_id
    and n.flow_id = new.flow_id;

  if not found then
    raise exception using
      errcode = '22023',
      message = 'The current quick-help step does not belong to the selected flow.';
  end if;

  if new.ai_coach_session_id is not null then
    select s.status
    into v_ai_session_status
    from public.ai_coach_sessions s
    where s.id = new.ai_coach_session_id
      and s.user_id = new.user_id;

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The linked AI coach session does not belong to this user.';
    end if;
  end if;

  if old.status = 'linked'
     and old.ai_coach_session_id is not null
     and new.ai_coach_session_id is null then
    if new.current_node_id is distinct from old.current_node_id
       or new.context is distinct from old.context
       or new.topic_key is distinct from old.topic_key
       or new.completed_at is distinct from old.completed_at
       or new.status not in ('linked', 'ready') then
      raise exception using
        errcode = '22023',
        message = 'Removing an AI coach link cannot rewrite the quick-help result.';
    end if;

    new.status := 'ready';
    return new;
  end if;

  if new.status = 'abandoned' then
    if old.status not in ('active', 'ready', 'linked')
       or new.current_node_id is distinct from old.current_node_id
       or new.context is distinct from old.context
       or new.topic_key is distinct from old.topic_key
       or new.ai_coach_session_id is distinct from old.ai_coach_session_id then
      raise exception using
        errcode = '22023',
        message = 'Abandoning quick help cannot rewrite its answers or links.';
    end if;

    new.completed_at := coalesce(old.completed_at, now());
    return new;
  end if;

  if old.status = 'active' then
    if new.ai_coach_session_id is distinct from old.ai_coach_session_id then
      raise exception using
        errcode = '22023',
        message = 'An active quick-help intake cannot link an AI coach session.';
    end if;

    select
      n.input_type,
      n.answer_key,
      a.answer_payload,
      a.option_id,
      case
        when n.input_type = 'static' then o.next_node_id
        else n.default_next_node_id
      end
    into
      v_input_type,
      v_answer_key,
      v_answer_payload,
      v_option_id,
      v_next_node_id
    from public.coach_quick_help_nodes n
    join public.coach_quick_help_answers a
      on a.intake_id = new.id
     and a.node_id = n.id
     and a.user_id = new.user_id
    left join public.coach_quick_help_options o
      on o.id = a.option_id
     and o.node_id = n.id
    where n.id = old.current_node_id
      and n.flow_id = old.flow_id;

    if not found
       or v_answer_key is null
       or v_next_node_id is null then
      raise exception using
        errcode = '22023',
        message = 'Answer the current quick-help question before advancing.';
    end if;

    select n.node_type
    into v_next_node_type
    from public.coach_quick_help_nodes n
    where n.id = v_next_node_id
      and n.flow_id = old.flow_id;

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The next quick-help step does not belong to the selected flow.';
    end if;

    v_expected_context := jsonb_set(
      coalesce(old.context, '{}'::jsonb),
      array[v_answer_key],
      v_answer_payload,
      true
    );

    v_expected_topic_key := case
      when v_answer_key = 'topic_key'
        then v_answer_payload ->> 'value'
      else old.topic_key
    end;

    v_expected_status := case
      when v_next_node_type = 'handoff' then 'ready'
      else 'active'
    end;

    if new.current_node_id is distinct from v_next_node_id
       or new.context is distinct from v_expected_context
       or new.topic_key is distinct from v_expected_topic_key
       or new.status is distinct from v_expected_status then
      raise exception using
        errcode = '22023',
        message = 'The quick-help intake can only follow the configured answer branch.';
    end if;

    new.completed_at := case
      when v_expected_status = 'ready' then now()
      else null
    end;

    return new;
  end if;

  if old.status = 'ready' then
    if new.status <> 'linked'
       or old.ai_coach_session_id is not null
       or new.ai_coach_session_id is null
       or v_ai_session_status <> 'active'
       or new.current_node_id is distinct from old.current_node_id
       or new.context is distinct from old.context
       or new.topic_key is distinct from old.topic_key
       or new.completed_at is distinct from old.completed_at
       or v_node_type <> 'handoff' then
      raise exception using
        errcode = '22023',
        message = 'A ready quick-help intake may only link an active owned AI coach session.';
    end if;

    return new;
  end if;

  raise exception using
    errcode = '22023',
    message = 'The requested quick-help state transition is not allowed.';
end;
$$;

revoke all on function private.validate_quick_help_intake_write() from public;

drop trigger if exists validate_quick_help_intake_write
on public.coach_quick_help_intakes;

create trigger validate_quick_help_intake_write
before insert or update on public.coach_quick_help_intakes
for each row
execute function private.validate_quick_help_intake_write();
