-- Backfill the exact 2026-08-03 official character change page as patch context.
--
-- The official page establishes patch context only. It does not prove that a
-- combo, setup, sequence, or training recipe is valid. Existing source
-- relationships are preserved, and no review/publication state is changed.

begin;

create temporary table phase36_patch_context_candidates on commit drop as
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
),
active_strategy as (
  select
    'combo'::text as entity_type,
    id as entity_id,
    character_id,
    valid_from_patch_id
  from public.combos
  where status <> 'archived'

  union all

  select 'setup', id, character_id, valid_from_patch_id
  from public.setups
  where status <> 'archived'

  union all

  select 'sequence', id, character_id, valid_from_patch_id
  from public.sequences
  where status <> 'archived'
)
select
  a.entity_type,
  a.entity_id,
  a.character_id,
  o.source_id
from active_strategy a
join official_sources o using (character_id)
cross join current_patch p
where a.valid_from_patch_id = p.id
  and not exists (
    select 1
    from public.entity_sources es
    where es.entity_type = a.entity_type
      and es.entity_id = a.entity_id
      and es.source_id = o.source_id
  );

do $$
declare
  mapped_character_count integer;
begin
  select count(distinct character_id)
  into mapped_character_count
  from phase36_patch_context_candidates;

  if mapped_character_count > 31 then
    raise exception 'phase36 character-source mapping exceeded 31 characters';
  end if;
end
$$;

insert into public.entity_sources (
  entity_type,
  entity_id,
  source_id,
  relationship,
  note
)
select
  entity_type,
  entity_id,
  source_id,
  'patch_context',
  '2026-08-03 official character change page. Patch context only; this does not verify the combo, setup, or sequence.'
from phase36_patch_context_candidates
on conflict (entity_type, entity_id, source_id) do nothing;

insert into public.entity_sources (
  entity_type,
  entity_id,
  source_id,
  relationship,
  note
)
select distinct
  'training',
  tr.training_id,
  c.source_id,
  'patch_context',
  '2026-08-03 official character change page for the related strategy. Patch context only; this does not verify the training result.'
from phase36_patch_context_candidates c
join public.training_relations tr
  on tr.related_type = c.entity_type
  and tr.related_id = c.entity_id
on conflict (entity_type, entity_id, source_id) do nothing;

commit;
