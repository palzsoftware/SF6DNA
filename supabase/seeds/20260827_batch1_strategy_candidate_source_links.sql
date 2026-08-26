-- Phase 13: source links for Jamie / Chun-Li / Guile / Kimberly
-- Setup, Sequence, and Counter rows remain unverified + draft.
-- These links identify review candidates only and do not verify the content.

begin;

with target as (
  select id,slug,name_ja
  from public.characters
  where slug in ('jamie','chun-li','guile','kimberly')
),
source_map as (
  select t.id character_id,t.slug character_slug,s.id source_id
  from target t
  join public.sources s
    on s.title='Season 4 現行変更解説候補 ' || t.name_ja
   and s.source_type='community_video'
),
items as (
  select 'setup'::text entity_type,s.id entity_id,s.character_id
  from public.setups s join target t on t.id=s.character_id
  union all
  select 'sequence',s.id,s.character_id
  from public.sequences s join target t on t.id=s.character_id
  union all
  select 'counter',s.id,s.defender_character_id
  from public.counters s join target t on t.id=s.defender_character_id
)
insert into public.entity_sources
  (entity_type,entity_id,source_id,relationship,note)
select
  i.entity_type,i.entity_id,sm.source_id,'candidate',
  'Season 4現行解説の確認候補。個別の数値・成立条件・確定性は未検証であり、この紐付け自体はverifiedを意味しない。'
from items i
join source_map sm on sm.character_id=i.character_id
on conflict(entity_type,entity_id,source_id) do nothing;

-- Expected for each character/category:
-- 6 rows, 6 unverified+draft, 6 patch-linked, 6 exact candidate-source links.
with t as (
 select id,slug,name_ja from public.characters
 where slug in ('jamie','chun-li','guile','kimberly')
),
items as (
 select t.slug,t.name_ja,'setup' kind,s.id,s.verification_status,s.status,s.valid_from_patch_id
 from t join public.setups s on s.character_id=t.id
 union all
 select t.slug,t.name_ja,'sequence',s.id,s.verification_status,s.status,s.valid_from_patch_id
 from t join public.sequences s on s.character_id=t.id
 union all
 select t.slug,t.name_ja,'counter',s.id,s.verification_status,s.status,s.valid_from_patch_id
 from t join public.counters s on s.defender_character_id=t.id
)
select slug,name_ja,kind,
 count(*) item_count,
 count(*) filter(where verification_status='unverified' and status='draft') safe_status_count,
 count(*) filter(where valid_from_patch_id is not null) patch_linked_count,
 count(*) filter(where exists(
   select 1 from public.entity_sources es
   join public.sources src on src.id=es.source_id
   where es.entity_type=items.kind
     and es.entity_id=items.id
     and es.relationship='candidate'
     and src.title='Season 4 現行変更解説候補 ' || items.name_ja
 )) exact_candidate_source_count
from items
group by slug,name_ja,kind
order by slug,kind;

commit;
