-- Phase23: add the missing JP matchup-card guide section.
-- This is an index into the 30 reviewed/draft JP matchup parents and their five detail counters.
-- It does not verify or publish any matchup result.

with ctx as (
  select
    (select id from characters where slug='jp') as character_id,
    (select id from patches where is_current=true order by released_at desc limit 1) as patch_id
)
update character_guide_sections gs
set
  title='対戦前30秒キャラ対策',
  summary='30対面を5項目で確認するための索引。',
  body='相手キャラを選び、①接近阻止 ②確反候補 ③対空・特殊軌道 ④画面端防御 ⑤弾・設置の5項目を確認する。JP側は全30対面について親Counter1件＋詳細Counter5件をreviewed/draftで整備済み。距離、連携間隔、DI、弾相互作用、アーマー/反射、ODアムネジア後状況など実機依存項目は未verifiedのまま管理し、トレーニング再現後のみ昇格する。',
  difficulty_level='intermediate',
  display_order=45,
  valid_from_patch_id=ctx.patch_id,
  valid_to_patch_id=null,
  verification_status='reviewed',
  content_kind='strategy',
  status='draft',
  updated_at=now()
from ctx
where gs.character_id=ctx.character_id
  and gs.section_type='matchup_card';

with ctx as (
  select
    (select id from characters where slug='jp') as character_id,
    (select id from patches where is_current=true order by released_at desc limit 1) as patch_id
)
insert into character_guide_sections(
  character_id,section_type,title,body,summary,difficulty_level,display_order,
  valid_from_patch_id,valid_to_patch_id,verification_status,content_kind,status
)
select
  ctx.character_id,
  'matchup_card',
  '対戦前30秒キャラ対策',
  '相手キャラを選び、①接近阻止 ②確反候補 ③対空・特殊軌道 ④画面端防御 ⑤弾・設置の5項目を確認する。JP側は全30対面について親Counter1件＋詳細Counter5件をreviewed/draftで整備済み。距離、連携間隔、DI、弾相互作用、アーマー/反射、ODアムネジア後状況など実機依存項目は未verifiedのまま管理し、トレーニング再現後のみ昇格する。',
  '30対面を5項目で確認するための索引。',
  'intermediate',
  45,
  ctx.patch_id,
  null,
  'reviewed',
  'strategy',
  'draft'
from ctx
where not exists (
  select 1
  from character_guide_sections gs
  where gs.character_id=ctx.character_id
    and gs.section_type='matchup_card'
);

with section_row as (
  select gs.id
  from character_guide_sections gs
  join characters c on c.id=gs.character_id
  where c.slug='jp'
    and gs.section_type='matchup_card'
    and gs.status='draft'
    and gs.verification_status='reviewed'
), evidence as (
  select id,url
  from sources
  where url in (
    'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jp',
    'https://ultimateframedata.com/sf6/jp'
  )
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select
  'character_guide_section',
  sr.id,
  e.id,
  case when e.url like '%battle_change/20260803/jp' then 'patch_baseline' else 'corroborating' end,
  'JP current 2026.08.03+ baseline for the matchup-card index.'
from section_row sr
cross join evidence e
on conflict(entity_type,entity_id,source_id) do update set
  relationship=excluded.relationship,
  note=excluded.note;
