-- Phase13 batch integrity audit: Jamie / Chun-Li / Guile / Kimberly
-- Read-only. Source of truth: SF6DNAPro production database.
-- Baseline patch: 2026.08.03. Checked 2026-08-27 JST.

with target as (
  select id, slug, name_ja
  from public.characters
  where slug in ('jamie', 'chun-li', 'guile', 'kimberly')
),
entities as (
  select 'combo'::text entity_type, id, character_id, slug,
         valid_from_patch_id, verification_status, status
  from public.combos where character_id in (select id from target)
  union all
  select 'setup', id, character_id, slug,
         valid_from_patch_id, verification_status, status
  from public.setups where character_id in (select id from target)
  union all
  select 'sequence', id, character_id, slug,
         valid_from_patch_id, verification_status, status
  from public.sequences where character_id in (select id from target)
  union all
  select 'counter', id, defender_character_id, slug,
         valid_from_patch_id, verification_status, status
  from public.counters where defender_character_id in (select id from target)
  union all
  select 'training', id, player_character_id, slug,
         valid_from_patch_id, verification_status, status
  from public.trainings where player_character_id in (select id from target)
)
select
  t.slug as character_slug,
  e.entity_type,
  count(*) as total,
  count(*) filter (where p.version_label = '2026.08.03') as current_patch,
  count(*) filter (where p.id is null) as missing_patch,
  count(*) filter (
    where exists (
      select 1 from public.entity_sources es
      where es.entity_type = e.entity_type and es.entity_id = e.id
    )
  ) as sourced,
  count(*) filter (
    where not exists (
      select 1 from public.entity_sources es
      where es.entity_type = e.entity_type and es.entity_id = e.id
    )
  ) as missing_source,
  count(*) filter (
    where e.status <> 'draft' or e.verification_status <> 'unverified'
  ) as unsafe_state,
  count(*) - count(distinct e.slug) as duplicate_slugs
from entities e
join target t on t.id = e.character_id
left join public.patches p on p.id = e.valid_from_patch_id
group by t.slug, e.entity_type
order by t.slug, e.entity_type;

-- Move / Frame / Command parity and command duplication.
with target as (
  select id, slug from public.characters
  where slug in ('jamie', 'chun-li', 'guile', 'kimberly')
)
select
  t.slug,
  count(distinct m.id) as move_count,
  count(distinct f.id) as frame_count,
  count(distinct mc.id) filter (where lower(mc.control_scheme) = 'classic') as classic_count,
  count(distinct mc.id) filter (where lower(mc.control_scheme) = 'modern') as modern_count,
  count(distinct m.id) filter (where f.id is null) as moves_without_frame,
  count(distinct m.id) filter (
    where not exists (
      select 1 from public.move_commands c
      where c.move_id = m.id and lower(c.control_scheme) = 'classic'
    )
  ) as moves_without_classic
from target t
join public.moves m on m.character_id = t.id
left join public.move_frame_data f on f.move_id = m.id
left join public.move_commands mc on mc.move_id = m.id
group by t.slug
order by t.slug;

select m.slug as move_slug, lower(mc.control_scheme) as control_scheme, count(*) as duplicate_count
from public.move_commands mc
join public.moves m on m.id = mc.move_id
join public.characters c on c.id = m.character_id
where c.slug in ('jamie', 'chun-li', 'guile', 'kimberly')
group by m.slug, lower(mc.control_scheme)
having count(*) > 1
order by m.slug, lower(mc.control_scheme);
