-- Phase14 P2-01: add the directly confirmed JP crouching MP Modern input.
-- Evidence: CAPCOM JP frame data, Modern tab, checked 2026-08-28.
-- This seed does not change Move status or Frame verification_status.

begin;

with target_move as (
  select m.id
  from public.moves m
  join public.characters c on c.id = m.character_id
  where c.slug = 'jp'
    and m.slug = 'jp-crouching-mp'
    and m.name_ja = 'しゃがみ中P（ズミヤー）'
    and m.status = 'draft'
), target_frame as (
  select f.id
  from public.move_frame_data f
  join target_move m on m.id = f.move_id
  where f.valid_to_patch_id is null
    and f.verification_status = 'reviewed'
    and f.startup = '7'
    and f.active = '7-10'
    and f.recovery = '14'
    and f.on_hit = '+6'
    and f.on_block = '-2'
), inserted_source as (
  insert into public.sources (
    title,
    url,
    source_type,
    publisher,
    accessed_at,
    reliability_level,
    notes
  )
  select
    'JP 公式フレームデータ',
    'https://www.streetfighter.com/6/ja-jp/character/jp/frame',
    'official_frame_data',
    'CAPCOM',
    now(),
    'official',
    'Modern tab directly checked on 2026-08-28. Crouching MP is listed with the Medium button.'
  where exists (select 1 from target_frame)
    and not exists (
      select 1 from public.sources existing
      where existing.url = 'https://www.streetfighter.com/6/ja-jp/character/jp/frame'
        and existing.reliability_level = 'official'
    )
  returning id
), official_source as (
  select id from inserted_source
  union all
  select id
  from public.sources
  where url = 'https://www.streetfighter.com/6/ja-jp/character/jp/frame'
    and reliability_level = 'official'
  order by id
  limit 1
), inserted_command as (
  insert into public.move_commands (
    move_id,
    control_scheme,
    command_text,
    numeric_notation,
    button_notation,
    condition_text,
    sort_order
  )
  select
    m.id,
    'modern',
    '↓ + 中攻撃',
    '2M',
    '2+M',
    'CAPCOM official Modern frame-table row; checked 2026-08-28.',
    7
  from target_move m
  where exists (select 1 from target_frame)
    and exists (select 1 from official_source)
    and not exists (
      select 1 from public.move_commands existing
      where existing.move_id = m.id
        and existing.control_scheme = 'modern'
    )
  returning id, move_id
), target_command as (
  select id, move_id from inserted_command
  union all
  select c.id, c.move_id
  from public.move_commands c
  join target_move m on m.id = c.move_id
  where c.control_scheme = 'modern'
    and c.numeric_notation = '2M'
    and c.command_text = '↓ + 中攻撃'
), source_targets as (
  select 'move'::text entity_type, m.id entity_id from target_move m
  union all
  select 'move_frame_data', f.id from target_frame f
  union all
  select 'move_command', c.id from target_command c
)
insert into public.entity_sources (
  entity_type,
  entity_id,
  source_id,
  relationship,
  note
)
select
  target.entity_type,
  target.entity_id,
  source.id,
  'official',
  'CAPCOM JP frame data Modern tab; directly checked 2026-08-28.'
from source_targets target
cross join official_source source
on conflict (entity_type, entity_id, source_id) do nothing;

commit;
