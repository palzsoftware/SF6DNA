
create or replace function public.get_quick_help_node(
  p_flow_slug text,
  p_node_key text,
  p_context jsonb default '{}'::jsonb
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with flow as (
    select f.id, f.slug, f.title, f.description, f.version, f.status
    from public.coach_quick_help_flows f
    where f.slug = p_flow_slug
      and (f.status = 'published' or (select private.is_admin()))
  ),
  node as (
    select n.*
    from public.coach_quick_help_nodes n
    join flow f on f.id = n.flow_id
    where n.node_key = p_node_key
  ),
  context_value as (
    select p_context #>> '{opponent_character_id,value}' as opponent_character_text
  ),
  parsed_context as (
    select case
      when opponent_character_text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        then opponent_character_text::uuid
      else null::uuid
    end as opponent_character_id
    from context_value
  ),
  static_options as (
    select jsonb_build_object(
      'selection_kind', 'option',
      'id', o.id,
      'key', o.option_key,
      'label', o.label,
      'value', o.option_value,
      'metadata', o.metadata,
      'next_node_key', next_node.node_key,
      'sort_order', o.sort_order
    ) as item,
    o.sort_order,
    o.option_key as stable_key
    from node n
    join public.coach_quick_help_options o on o.node_id = n.id
    join public.coach_quick_help_nodes next_node on next_node.id = o.next_node_id
    where n.input_type = 'static'
  ),
  character_options as (
    select jsonb_build_object(
      'selection_kind', 'character',
      'id', c.id,
      'key', c.slug,
      'label', c.name_ja,
      'value', c.id,
      'image_url', c.image_url,
      'next_node_key', next_node.node_key,
      'sort_order', coalesce(c.display_order, 9999)
    ) as item,
    coalesce(c.display_order, 9999) as sort_order,
    c.slug as stable_key
    from node n
    join public.characters c
      on n.input_type = 'character'
     and c.status = 'published'
     and c.is_playable = true
    left join public.coach_quick_help_nodes next_node
      on next_node.id = n.default_next_node_id
  ),
  move_options as (
    select jsonb_build_object(
      'selection_kind', 'move',
      'id', m.id,
      'key', m.slug,
      'label', m.name_ja,
      'value', m.id,
      'move_type', m.move_type,
      'strength_variant', m.strength_variant,
      'next_node_key', next_node.node_key,
      'sort_order', m.display_order
    ) as item,
    m.display_order as sort_order,
    m.slug as stable_key
    from node n
    cross join parsed_context ctx
    join public.moves m
      on n.input_type = 'move'
     and m.character_id = ctx.opponent_character_id
     and m.status = 'published'
    left join public.coach_quick_help_nodes next_node
      on next_node.id = n.default_next_node_id
  ),
  available_options as (
    select * from static_options
    union all
    select * from character_options
    union all
    select * from move_options
  )
  select jsonb_build_object(
    'flow', jsonb_build_object(
      'slug', f.slug,
      'title', f.title,
      'description', f.description,
      'version', f.version,
      'status', f.status
    ),
    'node', jsonb_build_object(
      'id', n.id,
      'key', n.node_key,
      'type', n.node_type,
      'prompt', n.prompt,
      'input_type', n.input_type,
      'answer_key', n.answer_key,
      'topic_key', n.topic_key,
      'help_text', n.help_text,
      'default_next_node_key', next_node.node_key
    ),
    'options', coalesce((
      select jsonb_agg(a.item order by a.sort_order, a.stable_key)
      from available_options a
    ), '[]'::jsonb)
  )
  from flow f
  join node n on true
  left join public.coach_quick_help_nodes next_node
    on next_node.id = n.default_next_node_id;
$$;

comment on function public.get_quick_help_node(text, text, jsonb) is
  'Returns one published quick-help step. Character and move choices are loaded dynamically from current visible SF6DNA data.';

revoke all on function public.get_quick_help_node(text, text, jsonb) from public;
grant execute on function public.get_quick_help_node(text, text, jsonb) to anon;
grant execute on function public.get_quick_help_node(text, text, jsonb) to authenticated;
grant execute on function public.get_quick_help_node(text, text, jsonb) to service_role;


create or replace function public.start_quick_help_intake(
  p_flow_slug text default 'quick-help'
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_flow_id uuid;
  v_root_node_id uuid;
  v_root_node_key text;
  v_intake_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required to save quick-help history.';
  end if;

  select f.id, f.root_node_id, n.node_key
  into v_flow_id, v_root_node_id, v_root_node_key
  from public.coach_quick_help_flows f
  join public.coach_quick_help_nodes n on n.id = f.root_node_id
  where f.slug = p_flow_slug
    and (f.status = 'published' or (select private.is_admin()));

  if v_flow_id is null or v_root_node_id is null then
    raise exception using
      errcode = '22023',
      message = 'The selected quick-help flow is not available.';
  end if;

  insert into public.coach_quick_help_intakes (
    user_id,
    flow_id,
    current_node_id,
    status,
    context
  )
  values (
    v_user_id,
    v_flow_id,
    v_root_node_id,
    'active',
    '{}'::jsonb
  )
  returning id into v_intake_id;

  return jsonb_build_object(
    'intake_id', v_intake_id,
    'status', 'active',
    'context', '{}'::jsonb,
    'step', public.get_quick_help_node(p_flow_slug, v_root_node_key, '{}'::jsonb)
  );
end;
$$;

comment on function public.start_quick_help_intake(text) is
  'Starts a saved quick-help intake for an authenticated user. Guest flows remain browser-local.';

revoke all on function public.start_quick_help_intake(text) from public;
revoke all on function public.start_quick_help_intake(text) from anon;
grant execute on function public.start_quick_help_intake(text) to authenticated;
grant execute on function public.start_quick_help_intake(text) to service_role;


create or replace function public.get_quick_help_intake_step(
  p_intake_id uuid
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'intake_id', i.id,
    'status', i.status,
    'topic_key', i.topic_key,
    'context', i.context,
    'step', public.get_quick_help_node(f.slug, n.node_key, i.context)
  )
  from public.coach_quick_help_intakes i
  join public.coach_quick_help_flows f on f.id = i.flow_id
  left join public.coach_quick_help_nodes n on n.id = i.current_node_id
  where i.id = p_intake_id
    and i.user_id = (select auth.uid());
$$;

comment on function public.get_quick_help_intake_step(uuid) is
  'Returns the current step and accumulated context for an owned quick-help intake.';

revoke all on function public.get_quick_help_intake_step(uuid) from public;
revoke all on function public.get_quick_help_intake_step(uuid) from anon;
grant execute on function public.get_quick_help_intake_step(uuid) to authenticated;
grant execute on function public.get_quick_help_intake_step(uuid) to service_role;


create or replace function public.answer_quick_help_intake(
  p_intake_id uuid,
  p_option_id uuid default null,
  p_character_id uuid default null,
  p_move_id uuid default null,
  p_free_text text default null
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_flow_id uuid;
  v_flow_slug text;
  v_node_id uuid;
  v_node_key text;
  v_input_type text;
  v_answer_key text;
  v_context jsonb;
  v_topic_key text;
  v_next_node_id uuid;
  v_next_node_key text;
  v_next_node_type text;
  v_answer_payload jsonb;
  v_selected_option_id uuid;
  v_selected_character_id uuid;
  v_selected_move_id uuid;
  v_free_text text;
  v_nonnull_count integer;
  v_new_status text;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  v_nonnull_count :=
    (p_option_id is not null)::integer
    + (p_character_id is not null)::integer
    + (p_move_id is not null)::integer
    + (nullif(btrim(p_free_text), '') is not null)::integer;

  if v_nonnull_count <> 1 then
    raise exception using
      errcode = '22023',
      message = 'Provide exactly one answer.';
  end if;

  select
    i.flow_id,
    f.slug,
    i.current_node_id,
    n.node_key,
    n.input_type,
    n.answer_key,
    i.context,
    i.topic_key
  into
    v_flow_id,
    v_flow_slug,
    v_node_id,
    v_node_key,
    v_input_type,
    v_answer_key,
    v_context,
    v_topic_key
  from public.coach_quick_help_intakes i
  join public.coach_quick_help_flows f on f.id = i.flow_id
  join public.coach_quick_help_nodes n on n.id = i.current_node_id
  where i.id = p_intake_id
    and i.user_id = v_user_id
    and i.status = 'active'
  for update of i;

  if v_node_id is null then
    raise exception using
      errcode = '22023',
      message = 'The selected quick-help intake is not active.';
  end if;

  if v_answer_key is null then
    raise exception using
      errcode = '22023',
      message = 'The current step does not accept an answer.';
  end if;

  if v_input_type = 'static' then
    if p_option_id is null then
      raise exception using
        errcode = '22023',
        message = 'Select one of the available options.';
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
      v_selected_option_id,
      v_next_node_id,
      v_answer_payload
    from public.coach_quick_help_options o
    where o.id = p_option_id
      and o.node_id = v_node_id;

    if v_selected_option_id is null then
      raise exception using
        errcode = '22023',
        message = 'The selected option does not belong to the current question.';
    end if;

  elsif v_input_type = 'character' then
    if p_character_id is null then
      raise exception using
        errcode = '22023',
        message = 'Select a character.';
    end if;

    select
      c.id,
      jsonb_build_object(
        'value', c.id,
        'label', c.name_ja,
        'slug', c.slug
      )
    into
      v_selected_character_id,
      v_answer_payload
    from public.characters c
    where c.id = p_character_id
      and c.status = 'published'
      and c.is_playable = true;

    if v_selected_character_id is null then
      raise exception using
        errcode = '22023',
        message = 'The selected character is not available.';
    end if;

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_node_id;

  elsif v_input_type = 'move' then
    if p_move_id is null then
      raise exception using
        errcode = '22023',
        message = 'Select a move.';
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
      v_selected_move_id,
      v_answer_payload
    from public.moves m
    where m.id = p_move_id
      and m.status = 'published'
      and m.character_id::text = v_context #>> '{opponent_character_id,value}';

    if v_selected_move_id is null then
      raise exception using
        errcode = '22023',
        message = 'The selected move does not belong to the selected character.';
    end if;

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_node_id;

  elsif v_input_type = 'free_text' then
    v_free_text := nullif(btrim(p_free_text), '');

    if v_free_text is null or char_length(v_free_text) > 2000 then
      raise exception using
        errcode = '22023',
        message = 'Enter the problem in 1 to 2000 characters.';
    end if;

    v_answer_payload := jsonb_build_object(
      'value', v_free_text,
      'label', v_free_text
    );

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_node_id;

  else
    raise exception using
      errcode = '22023',
      message = 'The current step cannot be answered.';
  end if;

  if v_next_node_id is null then
    raise exception using
      errcode = '22023',
      message = 'The next quick-help step is not configured.';
  end if;

  v_context := jsonb_set(
    coalesce(v_context, '{}'::jsonb),
    array[v_answer_key],
    v_answer_payload,
    true
  );

  if v_answer_key = 'topic_key' then
    v_topic_key := v_answer_payload ->> 'value';
  end if;

  insert into public.coach_quick_help_answers (
    intake_id,
    user_id,
    node_id,
    option_id,
    selected_character_id,
    selected_move_id,
    free_text,
    answer_payload
  )
  values (
    p_intake_id,
    v_user_id,
    v_node_id,
    v_selected_option_id,
    v_selected_character_id,
    v_selected_move_id,
    v_free_text,
    v_answer_payload
  );

  select n.node_key, n.node_type
  into v_next_node_key, v_next_node_type
  from public.coach_quick_help_nodes n
  where n.id = v_next_node_id
    and n.flow_id = v_flow_id;

  if v_next_node_key is null then
    raise exception using
      errcode = '22023',
      message = 'The next quick-help step is invalid.';
  end if;

  v_new_status := case
    when v_next_node_type = 'handoff' then 'ready'
    else 'active'
  end;

  update public.coach_quick_help_intakes
  set
    current_node_id = v_next_node_id,
    topic_key = v_topic_key,
    context = v_context,
    status = v_new_status,
    completed_at = case
      when v_new_status = 'ready' then now()
      else null
    end
  where id = p_intake_id
    and user_id = v_user_id;

  return jsonb_build_object(
    'intake_id', p_intake_id,
    'status', v_new_status,
    'topic_key', v_topic_key,
    'context', v_context,
    'step', public.get_quick_help_node(v_flow_slug, v_next_node_key, v_context)
  );
end;
$$;

comment on function public.answer_quick_help_intake(uuid, uuid, uuid, uuid, text) is
  'Validates one answer, stores it, updates structured context, and resolves the next branch atomically.';

revoke all on function public.answer_quick_help_intake(uuid, uuid, uuid, uuid, text) from public;
revoke all on function public.answer_quick_help_intake(uuid, uuid, uuid, uuid, text) from anon;
grant execute on function public.answer_quick_help_intake(uuid, uuid, uuid, uuid, text) to authenticated;
grant execute on function public.answer_quick_help_intake(uuid, uuid, uuid, uuid, text) to service_role;


create or replace function public.get_quick_help_grounding(
  p_intake_id uuid,
  p_limit integer default 5
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with intake as (
    select
      i.*,
      case
        when i.context #>> '{player_character_id,value}' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then (i.context #>> '{player_character_id,value}')::uuid
        else gp.main_character_id
      end as player_character_id,
      case
        when i.context #>> '{opponent_character_id,value}' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then (i.context #>> '{opponent_character_id,value}')::uuid
        else null::uuid
      end as opponent_character_id,
      case
        when i.context #>> '{opponent_move_id,value}' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then (i.context #>> '{opponent_move_id,value}')::uuid
        else null::uuid
      end as opponent_move_id,
      array(
        select jsonb_array_elements_text(
          coalesce(i.context #> '{topic_key,metadata,counter_types}', '[]'::jsonb)
        )
      ) as counter_types,
      array(
        select jsonb_array_elements_text(
          coalesce(i.context #> '{topic_key,metadata,training_types}', '[]'::jsonb)
        )
      ) as training_types
    from public.coach_quick_help_intakes i
    left join public.user_game_profiles gp on gp.user_id = i.user_id
    where i.id = p_intake_id
      and i.user_id = (select auth.uid())
      and i.status in ('ready', 'linked')
  ),
  selected_move as (
    select jsonb_build_object(
      'entity_type', 'move',
      'entity_id', m.id,
      'slug', m.slug,
      'title', m.name_ja,
      'description', coalesce(m.description_ja, m.description),
      'usage_summary', coalesce(m.usage_summary_ja, m.usage_summary),
      'character_id', m.character_id
    ) as item
    from intake i
    join public.moves m
      on m.id = i.opponent_move_id
     and m.status = 'published'
  ),
  counter_rows as (
    select jsonb_build_object(
      'entity_type', 'counter',
      'entity_id', c.id,
      'slug', c.slug,
      'title', c.title,
      'summary', c.summary,
      'method', c.method,
      'conditions', c.conditions,
      'opponent_character_id', c.opponent_character_id,
      'counter_type', c.counter_type
    ) as item,
    c.created_at,
    c.id
    from intake i
    join public.counters c
      on c.status = 'published'
     and cardinality(i.counter_types) > 0
     and c.counter_type = any(i.counter_types)
     and (
       i.player_character_id is null
       or c.defender_character_id is null
       or c.defender_character_id = i.player_character_id
     )
     and (
       i.opponent_character_id is null
       or c.opponent_character_id = i.opponent_character_id
     )
     and (
       i.opponent_move_id is null
       or c.target_id is null
       or c.target_id = i.opponent_move_id
     )
    order by
      case when c.target_id = i.opponent_move_id then 0 else 1 end,
      case when c.defender_character_id = i.player_character_id then 0 else 1 end,
      c.created_at desc,
      c.id
    limit least(greatest(coalesce(p_limit, 5), 1), 12)
  ),
  training_rows as (
    select jsonb_build_object(
      'entity_type', 'training',
      'entity_id', t.id,
      'slug', t.slug,
      'title', t.name,
      'purpose', t.purpose,
      'duration_minutes', t.duration_minutes,
      'method', t.method,
      'success_criteria', t.success_criteria,
      'recommended_reps', t.recommended_reps,
      'training_type', t.training_type
    ) as item,
    t.created_at,
    t.id
    from intake i
    join public.trainings t
      on t.status = 'published'
     and cardinality(i.training_types) > 0
     and t.training_type = any(i.training_types)
     and (
       i.player_character_id is null
       or t.player_character_id is null
       or t.player_character_id = i.player_character_id
     )
     and (
       i.opponent_character_id is null
       or t.dummy_character_id is null
       or t.dummy_character_id = i.opponent_character_id
     )
    order by
      case when t.player_character_id = i.player_character_id then 0 else 1 end,
      case when t.dummy_character_id = i.opponent_character_id then 0 else 1 end,
      t.created_at desc,
      t.id
    limit least(greatest(coalesce(p_limit, 5), 1), 12)
  ),
  free_text_search as (
    select jsonb_build_object(
      'entity_type', s.entity_type,
      'entity_id', s.entity_id,
      'slug', s.slug,
      'title', s.title,
      'subtitle', s.subtitle,
      'matched_by', s.matched_by,
      'score', s.score
    ) as item,
    s.score,
    s.entity_type,
    s.entity_id
    from intake i
    cross join lateral public.search_sf6dna(
      i.context #>> '{question_detail,value}',
      least(greatest(coalesce(p_limit, 5), 1), 12)
    ) s
    where nullif(i.context #>> '{question_detail,value}', '') is not null
  )
  select jsonb_build_object(
    'intake_id', i.id,
    'topic_key', i.topic_key,
    'context', i.context,
    'selected_move', (
      select sm.item from selected_move sm limit 1
    ),
    'counters', coalesce((
      select jsonb_agg(c.item order by c.created_at desc, c.id)
      from counter_rows c
    ), '[]'::jsonb),
    'trainings', coalesce((
      select jsonb_agg(t.item order by t.created_at desc, t.id)
      from training_rows t
    ), '[]'::jsonb),
    'search_results', coalesce((
      select jsonb_agg(s.item order by s.score desc, s.entity_type, s.entity_id)
      from free_text_search s
    ), '[]'::jsonb)
  )
  from intake i;
$$;

comment on function public.get_quick_help_grounding(uuid, integer) is
  'Returns only currently visible move, counter, training, and search results relevant to an owned completed quick-help intake.';

revoke all on function public.get_quick_help_grounding(uuid, integer) from public;
revoke all on function public.get_quick_help_grounding(uuid, integer) from anon;
grant execute on function public.get_quick_help_grounding(uuid, integer) to authenticated;
grant execute on function public.get_quick_help_grounding(uuid, integer) to service_role;
