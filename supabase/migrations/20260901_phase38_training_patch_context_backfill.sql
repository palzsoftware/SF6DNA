-- Backfill exact character patch context for current-patch character-specific
-- Training rows not reached by the Strategy-linked Phase 36 repair.
-- This does not verify a Training result or publish content.

begin;

with character_source_map as (
  select
    c.id as character_id,
    case c.slug
      when 'akuma' then 'gouki_akuma'
      when 'c-viper' then 'cviper'
      when 'chun-li' then 'chunli'
      when 'dee-jay' then 'deejay'
      when 'e-honda' then 'honda'
      when 'm-bison' then 'vega_mbison'
      else c.slug
    end as official_key
  from public.characters c
  where c.is_playable = true
    and c.status = 'published'
),
official_sources as (
  select m.character_id, s.id as source_id
  from character_source_map m
  join public.sources s
    on s.url =
      'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/'
      || m.official_key
),
current_patch as (
  select id
  from public.patches
  where is_current = true
)
insert into public.entity_sources (
  entity_type,
  entity_id,
  source_id,
  relationship,
  note
)
select
  'training',
  t.id,
  o.source_id,
  'patch_context',
  '2026-08-03 official character change page. Patch context only; this does not verify the training method or result.'
from public.trainings t
join official_sources o
  on o.character_id = t.player_character_id
cross join current_patch p
where t.status <> 'archived'
  and t.valid_from_patch_id = p.id
  and not exists (
    select 1
    from public.entity_sources es
    where es.entity_type = 'training'
      and es.entity_id = t.id
      and es.source_id = o.source_id
  )
on conflict (entity_type, entity_id, source_id) do nothing;

commit;
