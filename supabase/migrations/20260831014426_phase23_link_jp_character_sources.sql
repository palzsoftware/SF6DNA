-- Keep JP character-level source coverage aligned with the rest of the roster.
-- Uses stable semantic keys (character slug + Source URL/type), not generated IDs.

insert into public.entity_sources (
  entity_type,
  entity_id,
  source_id,
  relationship,
  note
)
select
  'character',
  c.id,
  s.id,
  'official',
  'Phase23 30-character data audit: official character reference'
from public.characters c
join public.sources s on (
  s.reliability_level = 'official'
  and (
    (s.source_type = 'official_movelist' and s.url = 'https://www.streetfighter.com/6/ja-jp/character/jp/movelist')
    or
    (s.source_type = 'official_patch' and s.url = 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jp')
  )
)
where c.slug = 'jp'
  and not exists (
    select 1
    from public.entity_sources es
    where es.entity_type = 'character'
      and es.entity_id = c.id
      and es.source_id = s.id
  );
