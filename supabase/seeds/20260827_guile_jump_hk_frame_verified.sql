-- Phase 13: Guile jump heavy kick frame completion (2026-08-27)
-- Official source:
-- https://www.streetfighter.com/6/ja-jp/character/guile/frame
-- Confirmed fields only: startup 10F, active 10-14F, landing recovery 3F,
-- damage 800. Unknown/unconfirmed numeric fields remain NULL.

begin;

with source_insert as (
  insert into public.sources
    (title,url,source_type,publisher,accessed_at,reliability_level,notes)
  select
    'ガイル 公式フレームデータ',
    'https://www.streetfighter.com/6/ja-jp/character/guile/frame',
    'official_frame_data',
    'CAPCOM',
    now(),
    'official',
    '2026-08-27確認。ジャンプ強K: 発生10F、持続10-14F、着地後硬直3F、ダメージ800。'
  where not exists (
    select 1 from public.sources
    where url='https://www.streetfighter.com/6/ja-jp/character/guile/frame'
  )
  returning id
),
source_row as (
  select id from source_insert
  union all
  select id from public.sources
  where url='https://www.streetfighter.com/6/ja-jp/character/guile/frame'
  limit 1
),
ctx as (
  select m.id move_id,p.id patch_id
  from public.moves m
  join public.characters c on c.id=m.character_id
  cross join public.patches p
  where c.slug='guile'
    and m.slug='guile-jump-hk'
    and p.is_current=true
),
frame_insert as (
  insert into public.move_frame_data
    (move_id,startup,active,recovery,on_hit,on_block,damage,drive_damage,
     super_gain,cancel_type,hit_level,invincibility,notes,
     valid_from_patch_id,verification_status)
  select
    ctx.move_id,'10','10-14','着地後3',null,null,800,null,
    null,'-','mid',null,
    'CAPCOM公式フレームデータを2026-08-27確認。未表示・未確認項目は補完していない。',
    ctx.patch_id,'verified'
  from ctx
  where not exists (
    select 1 from public.move_frame_data f where f.move_id=ctx.move_id
  )
  returning id
)
insert into public.entity_sources
  (entity_type,entity_id,source_id,relationship,note)
select
  'move',ctx.move_id,source_row.id,'official',
  'ジャンプ強Kの発生・持続・着地後硬直・ダメージを確認。'
from ctx cross join source_row
on conflict(entity_type,entity_id,source_id) do nothing;

-- Expected: move_count=18, frame_count=18, missing_frames=0.
select
 (select count(*) from public.moves m
  join public.characters c on c.id=m.character_id
  where c.slug='guile') move_count,
 (select count(*) from public.move_frame_data f
  join public.moves m on m.id=f.move_id
  join public.characters c on c.id=m.character_id
  where c.slug='guile') frame_count,
 (select count(*) from public.moves m
  join public.characters c on c.id=m.character_id
  left join public.move_frame_data f on f.move_id=m.id
  where c.slug='guile' and f.id is null) missing_frames;

commit;
