
with detail_metadata(node_key, option_key, metadata) as (
  values
    ('anti_air_situation','normal_jump','{"counter_types":["anti_air"],"training_types":["anti_air"]}'::jsonb),
    ('anti_air_situation','cross_up','{"counter_types":["anti_air","defense"],"training_types":["anti_air","defense"]}'::jsonb),
    ('anti_air_situation','trajectory_change','{"counter_types":["anti_air","reaction"],"training_types":["anti_air","reaction","zoning_anti_air"]}'::jsonb),
    ('anti_air_situation','trade_or_lose','{"counter_types":["anti_air"],"training_types":["anti_air","execution_timing"]}'::jsonb),
    ('anti_air_situation','low_reward','{"counter_types":["anti_air"],"training_types":["anti_air_conversion"]}'::jsonb),

    ('projectile_situation','cannot_avoid','{"counter_types":["projectile","defense"],"training_types":["projectile_response","defense"]}'::jsonb),
    ('projectile_situation','cannot_approach','{"counter_types":["approach","zoning","projectile"],"training_types":["approach","zoning","projectile_response"]}'::jsonb),
    ('projectile_situation','jump_punished','{"counter_types":["approach","projectile","zoning"],"training_types":["approach","projectile_response"]}'::jsonb),
    ('projectile_situation','bypass_unknown','{"counter_types":["projectile","approach"],"training_types":["projectile_response","approach"]}'::jsonb),
    ('projectile_situation','burnout','{"counter_types":["projectile","defense"],"training_types":["projectile_response","resource_management","resource_projectile"]}'::jsonb),

    ('drive_rush_situation','cannot_react','{"counter_types":["drive_rush","reaction"],"training_types":["reaction_dr","reaction"]}'::jsonb),
    ('drive_rush_situation','strike','{"counter_types":["drive_rush","defense"],"training_types":["reaction_dr","defense"]}'::jsonb),
    ('drive_rush_situation','throw_mix','{"counter_types":["drive_rush","defense"],"training_types":["defense_throw","defense"]}'::jsonb),
    ('drive_rush_situation','crouching_medium_kick','{"counter_types":["drive_rush","neutral_check","whiff_punish"],"training_types":["reaction_dr","footsies","whiff_punish"]}'::jsonb),
    ('drive_rush_situation','corner_carry','{"counter_types":["drive_rush","defense"],"training_types":["corner_escape","defense_corner"]}'::jsonb),

    ('drive_impact_situation','cannot_react','{"counter_types":["drive_impact","reaction"],"training_types":["reaction_di","reaction"]}'::jsonb),
    ('drive_impact_situation','corner','{"counter_types":["drive_impact","defense"],"training_types":["reaction_di","defense_corner"]}'::jsonb),
    ('drive_impact_situation','during_attack','{"counter_types":["drive_impact","reaction"],"training_types":["reaction_di","decision"]}'::jsonb),
    ('drive_impact_situation','armor_break_unknown','{"counter_types":["drive_impact","punish"],"training_types":["reaction_di","punish"]}'::jsonb),

    ('character_problem','neutral','{"counter_types":["matchup_plan","matchup_overview","neutral_check"],"training_types":["matchup","neutral","footsies"]}'::jsonb),
    ('character_problem','normal_moves','{"counter_types":["matchup_plan","punish","whiff_punish"],"training_types":["matchup","punish","whiff_punish"]}'::jsonb),
    ('character_problem','special_moves','{"counter_types":["matchup_plan","punish","defense"],"training_types":["matchup","punish","defense"]}'::jsonb),
    ('character_problem','air_approach','{"counter_types":["anti_air","matchup_plan"],"training_types":["anti_air","matchup"]}'::jsonb),
    ('character_problem','offense','{"counter_types":["defense","matchup_plan"],"training_types":["defense","matchup"]}'::jsonb),
    ('character_problem','how_to_attack','{"counter_types":["approach","matchup_plan"],"training_types":["approach","matchup"]}'::jsonb),
    ('character_problem','modern_controls','{"counter_types":["matchup_plan","reaction","system"],"training_types":["matchup","reaction","decision"]}'::jsonb),

    ('move_problem','avoid','{"counter_types":["defense","reaction"],"training_types":["defense","reaction"]}'::jsonb),
    ('move_problem','after_block','{"counter_types":["punish","defense"],"training_types":["punish","defense"]}'::jsonb),
    ('move_problem','punish','{"counter_types":["punish"],"training_types":["punish"]}'::jsonb),
    ('move_problem','spacing','{"counter_types":["whiff_punish","defense"],"training_types":["spacing","whiff_punish"]}'::jsonb),
    ('move_problem','counter_move','{"counter_types":["counter","punish"],"training_types":["punish","reaction"]}'::jsonb),

    ('corner_problem','cannot_escape','{"counter_types":["defense"],"training_types":["corner_escape","defense_corner"]}'::jsonb),
    ('corner_problem','throw_mix','{"counter_types":["defense"],"training_types":["defense_throw","defense_corner"]}'::jsonb),
    ('corner_problem','meaty','{"counter_types":["defense"],"training_types":["defense_corner","oki_meaty"]}'::jsonb),
    ('corner_problem','drive_impact','{"counter_types":["drive_impact","defense"],"training_types":["reaction_di","defense_corner"]}'::jsonb),
    ('corner_problem','reversal','{"counter_types":["defense","reaction"],"training_types":["defense_corner","reaction","decision"]}'::jsonb),

    ('execution_problem','combo_drop','{"counter_types":[],"training_types":["combo","execution"]}'::jsonb),
    ('execution_problem','hit_confirm','{"counter_types":[],"training_types":["hit_confirm","confirm"]}'::jsonb),
    ('execution_problem','cancel','{"counter_types":[],"training_types":["execution","execution_timing"]}'::jsonb),
    ('execution_problem','super_art','{"counter_types":[],"training_types":["combo","super","super_decision"]}'::jsonb),
    ('execution_problem','modern_input','{"counter_types":[],"training_types":["execution"]}'::jsonb)
)
update public.coach_quick_help_options o
set metadata = o.metadata || d.metadata,
    updated_at = now()
from detail_metadata d
join public.coach_quick_help_nodes n
  on n.node_key = d.node_key
join public.coach_quick_help_flows f
  on f.id = n.flow_id
 and f.slug = 'quick-help'
 and f.status = 'draft'
where o.node_id = n.id
  and o.option_key = d.option_key;

create or replace function public.get_quick_help_grounding(
  p_intake_id uuid,
  p_limit integer default 5
)
returns jsonb
language sql
stable
set search_path = ''
as $function$
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
      case
        when jsonb_array_length(coalesce(i.context #> '{situation_key,metadata,counter_types}', '[]'::jsonb)) > 0
          then array(
            select jsonb_array_elements_text(
              i.context #> '{situation_key,metadata,counter_types}'
            )
          )
        else array(
          select jsonb_array_elements_text(
            coalesce(i.context #> '{topic_key,metadata,counter_types}', '[]'::jsonb)
          )
        )
      end as counter_types,
      case
        when jsonb_array_length(coalesce(i.context #> '{situation_key,metadata,training_types}', '[]'::jsonb)) > 0
          then array(
            select jsonb_array_elements_text(
              i.context #> '{situation_key,metadata,training_types}'
            )
          )
        else array(
          select jsonb_array_elements_text(
            coalesce(i.context #> '{topic_key,metadata,training_types}', '[]'::jsonb)
          )
        )
      end as training_types
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
     and c.verification_status = 'verified'
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
     and t.verification_status = 'verified'
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
$function$;
