-- Phase14 P2-01: add the one directly confirmed missing Modern command.
-- Evidence: CAPCOM Dee Jay command list, Modern tab, checked 2026-08-28.
-- This seed is intentionally limited to Flying Party and is idempotent.

begin;

with target_move as (
  select m.id
  from public.moves m
  join public.characters c on c.id = m.character_id
  where c.slug = 'dee-jay'
    and m.slug = 'dee-jay-capcom-frame-029'
    and m.name_ja = 'フライングパーティー'
), inserted_command as (
  insert into public.move_commands (
    move_id,
    control_scheme,
    command_text,
    numeric_notation,
    button_notation,
    sort_order
  )
  select id, 'modern', '中攻撃 > 中攻撃', 'M>M', 'M>M', 10
  from target_move
  where not exists (
    select 1
    from public.move_commands existing
    where existing.move_id = target_move.id
      and existing.control_scheme = 'modern'
  )
  returning id
), target_command as (
  select id from inserted_command
  union all
  select mc.id
  from target_move tm
  join public.move_commands mc
    on mc.move_id = tm.id
   and mc.control_scheme = 'modern'
), official_source as (
  select id
  from public.sources
  where url = 'https://www.streetfighter.com/6/ja-jp/character/deejay/movelist'
    and reliability_level = 'official'
  order by created_at
  limit 1
)
insert into public.entity_sources (
  entity_type,
  entity_id,
  source_id,
  relationship,
  note
)
select
  'move_command',
  tc.id,
  os.id,
  'official',
  'CAPCOM official command list Modern tab; direct M>M mapping checked 2026-08-28.'
from target_command tc
cross join official_source os
on conflict (entity_type, entity_id, source_id) do nothing;

commit;
