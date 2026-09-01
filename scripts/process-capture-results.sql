-- Guarded batch updater for internal capture results.
-- Default is dry-run. Do not set dry_run=false until backlog IDs and transitions
-- have been reviewed against the dry-run output.

begin;

with params as (
  select true::boolean as dry_run
),
input(backlog_id, outcome, result_note) as (
  values
    (
      '00000000-0000-0000-0000-000000000000'::uuid,
      'provided'::text,
      'REPLACE WITH THE ACTUAL CAPTURE RESULT'::text
    )
),
valid_input as (
  select *
  from input
  where outcome in ('provided', 'confirmed', 'rejected', 'not_needed')
    and nullif(btrim(result_note), '') is not null
),
matched as (
  select
    cb.id,
    cb.capture_status as previous_status,
    v.outcome,
    v.result_note,
    c.slug as character_slug,
    t.slug as training_slug,
    t.name as training_name
  from valid_input v
  join capture_backlog cb on cb.id = v.backlog_id
  join trainings t on t.id = cb.training_id
  join characters c on c.id = cb.character_id
  where
    (v.outcome = 'provided' and cb.capture_status in ('pending', 'provided'))
    or
    (v.outcome in ('confirmed', 'rejected', 'not_needed')
      and cb.capture_status in ('pending', 'provided'))
),
updated as (
  update capture_backlog cb
  set
    capture_status = m.outcome,
    requested_at = coalesce(cb.requested_at, now()),
    provided_at = case
      when m.outcome in ('provided', 'confirmed', 'rejected')
        then coalesce(cb.provided_at, now())
      else cb.provided_at
    end,
    resolved_at = case
      when m.outcome in ('confirmed', 'rejected', 'not_needed') then now()
      else cb.resolved_at
    end,
    result_notes = concat_ws(
      E'\n',
      nullif(cb.result_notes, ''),
      to_char(now() at time zone 'Asia/Tokyo', 'YYYY-MM-DD HH24:MI') || ' JST'
        || ' [' || m.outcome || '] ' || m.result_note
    ),
    updated_at = now()
  from matched m
  cross join params p
  where cb.id = m.id
    and p.dry_run = false
  returning cb.id, cb.capture_status, cb.requested_at, cb.provided_at, cb.resolved_at
)
select jsonb_build_object(
  'dry_run', (select dry_run from params),
  'input_count', (select count(*) from input),
  'valid_input_count', (select count(*) from valid_input),
  'matched_count', (select count(*) from matched),
  'updated_count', (select count(*) from updated),
  'matched_items', coalesce(
    (select jsonb_agg(jsonb_build_object(
      'backlog_id', id,
      'character', character_slug,
      'training_slug', training_slug,
      'training_name', training_name,
      'previous_status', previous_status,
      'outcome', outcome
    ) order by character_slug, training_name) from matched),
    '[]'::jsonb
  )
) as capture_result;

commit;
