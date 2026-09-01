-- Read-only export for the internal SF6DNA capture queue.
-- Set requested_character_slug to a character slug when a specific character is requested.
-- Keep it NULL to select the highest-priority pending items across all characters.

with params as (
  select
    null::text as requested_character_slug,
    50::integer as max_items
),
strategy as (
  select
    'combo'::text as entity_type,
    x.id as entity_id,
    x.slug as entity_slug,
    x.name as entity_name,
    x.notation as route_text,
    x.starter_text as start_condition,
    x.position,
    concat_ws(' / ', nullif(x.conditions, ''),
      case when x.damage is not null then 'damage=' || x.damage::text end,
      case when x.drive_cost is not null then 'drive=' || x.drive_cost::text end,
      case when x.sa_cost is not null then 'sa=' || x.sa_cost::text end) as condition_summary,
    x.notes
  from combos x
  where x.status <> 'archived'

  union all

  select
    'setup', x.id, x.slug, x.name, x.sequence_text,
    x.starter_condition, x.position,
    concat_ws(' / ', nullif(x.meter_condition, ''),
      case when x.frame_advantage is not null then 'adv=' || x.frame_advantage::text end),
    concat_ws(E'\n', nullif(x.description, ''), nullif(x.counter_notes, ''))
  from setups x
  where x.status <> 'archived'

  union all

  select
    'sequence', x.id, x.slug, x.name, x.sequence_text,
    null, null,
    concat_ws(' / ',
      case when x.is_true_blockstring then 'true blockstring' end,
      nullif(x.mash_point, ''), nullif(x.throw_point, ''),
      nullif(x.shimmy_point, ''), nullif(x.jump_option, ''),
      nullif(x.parry_option, ''), nullif(x.drive_reversal_option, ''),
      nullif(x.invincible_option, '')),
    x.notes
  from sequences x
  where x.status <> 'archived'
),
queue as (
  select
    cb.id as backlog_id,
    cb.priority,
    c.slug as character_slug,
    c.name_ja as character_name,
    t.id as training_id,
    t.slug as training_slug,
    t.name as training_name,
    t.training_type,
    t.purpose,
    t.recording_instructions,
    t.playback_settings,
    t.cpu_settings,
    t.method,
    t.success_criteria,
    t.recommended_reps,
    cb.request_notes,
    s.entity_type,
    s.entity_id,
    s.entity_slug,
    s.entity_name,
    s.route_text,
    s.start_condition,
    s.position,
    s.condition_summary,
    s.notes as strategy_notes
  from capture_backlog cb
  join trainings t on t.id = cb.training_id
  join characters c on c.id = cb.character_id
  left join training_relations tr on tr.training_id = t.id
  left join strategy s
    on s.entity_type = tr.related_type
   and s.entity_id = tr.related_id
  cross join params p
  where cb.capture_status = 'pending'
    and cb.requested_at is null
    and (p.requested_character_slug is null or c.slug = p.requested_character_slug)
)
select *
from queue
order by priority, character_slug, training_name, backlog_id
limit (select max_items from params);
