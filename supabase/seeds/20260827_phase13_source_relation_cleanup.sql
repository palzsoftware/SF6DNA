-- Phase 13 source relation cleanup (2026-08-27)
-- Scope: character-level community video candidates.
-- Reason: bulk-imported character/source relations linked every source in a
-- video batch to every character in that batch. The correctly named relation
-- already existed for every affected source.
-- Safe/idempotent: removes a mismatched relation only when the exact
-- title-matched character and its correct relation both exist.

begin;

with deleted as (
  delete from public.entity_sources es
  using public.sources s, public.characters linked_character
  where es.source_id = s.id
    and es.entity_type = 'character'
    and es.entity_id = linked_character.id
    and s.source_type = 'community_video'
    and s.title like 'Season 4 現行変更解説候補 %'
    and linked_character.name_ja <> regexp_replace(
      s.title,
      '^Season 4 現行変更解説候補 ',
      ''
    )
    and exists (
      select 1
      from public.characters expected_character
      join public.entity_sources correct_es
        on correct_es.entity_type = 'character'
       and correct_es.entity_id = expected_character.id
       and correct_es.source_id = s.id
      where expected_character.name_ja = regexp_replace(
        s.title,
        '^Season 4 現行変更解説候補 ',
        ''
      )
    )
  returning es.id
)
select count(*) as deleted_mismatched_relations
from deleted;

-- Expected after cleanup: 30 candidate relations and 0 mismatches.
select
  count(*) as remaining_candidate_relations,
  count(*) filter (
    where linked_character.name_ja <> regexp_replace(
      s.title,
      '^Season 4 現行変更解説候補 ',
      ''
    )
  ) as remaining_mismatches
from public.entity_sources es
join public.sources s on s.id = es.source_id
join public.characters linked_character
  on linked_character.id = es.entity_id
 and es.entity_type = 'character'
where s.source_type = 'community_video'
  and s.title like 'Season 4 現行変更解説候補 %';

commit;
