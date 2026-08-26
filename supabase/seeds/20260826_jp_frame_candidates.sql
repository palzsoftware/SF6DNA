-- JP frame-data pilot import
-- Secondary source: https://frame-search.com/?character_name=JP&lang=ja-jp
-- Snapshot version reported by source: Ver.2.0401.001
-- IMPORTANT: rows remain draft + unverified until direct CAPCOM cross-check.

with src as (
  insert into public.sources (title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
  select
    'JP frame data snapshot - frame-search Ver.2.0401.001',
    'https://frame-search.com/?character_name=JP&lang=ja-jp',
    'community_aggregator',
    'frame-search.com',
    null,
    now(),
    'community',
    'Secondary frame-data aggregator. Snapshot reports SF6 Ver.2.0401.001 and links to official CAPCOM. Imported rows remain draft/unverified until direct official cross-check.'
  where not exists (
    select 1 from public.sources where url='https://frame-search.com/?character_name=JP&lang=ja-jp'
  )
  returning id
), source_row as (
  select id from src
  union all
  select id from public.sources where url='https://frame-search.com/?character_name=JP&lang=ja-jp'
  limit 1
), ctx as (
  select c.id character_id, p.id patch_id, s.id source_id
  from public.characters c
  cross join public.patches p
  cross join source_row s
  where c.slug='jp' and p.is_current=true
), vals(slug,name_ja,move_type,command_text,numeric_notation,display_order,startup,active,recovery,on_hit,on_block,damage,hit_level,cancel_type) as (
  values
  ('jp-standing-lp','立ち弱P（ノーシ）','normal','弱P','5LP',10,'6','6-8','10','+4','-2',300,'high','C'),
  ('jp-standing-lk','立ち弱K（ニージニイ・ウダール）','normal','弱K','5LK',20,'5','5-7','11','+3','-2',300,'high','C'),
  ('jp-standing-mp','立ち中P（シュトゥールム）','normal','中P','5MP',30,'12','12-14','21','+1','-6',700,'high','※'),
  ('jp-standing-mk','立ち中K（ウームヌィ・ウダール）','normal','中K','5MK',40,'8','8-10','19','+3','-3',600,'high','C'),
  ('jp-standing-hp','立ち強P（キンターヴル）','normal','強P','5HP',50,'12','12-13','22','+3','-3',800,'high','C'),
  ('jp-standing-hk','立ち強K（オボロートニ）','normal','強K','5HK',60,'12','12-15','17','+7','+2',800,'high','-'),
  ('jp-crouching-lp','しゃがみ弱P（ブィストルイ・ウダール）','normal','↓ + 弱P','2LP',70,'4','4-5','11','+4','-1',300,'high','C'),
  ('jp-crouching-lk','しゃがみ弱K（リョーフキー・ウダール）','normal','↓ + 弱K','2LK',80,'6','6-7','10','+2','-2',200,'low','-'),
  ('jp-crouching-mp','しゃがみ中P（ズミヤー）','normal','↓ + 中P','2MP',90,'7','7-10','14','+6','-2',600,'high','C'),
  ('jp-crouching-mk','しゃがみ中K（ズローバ）','normal','↓ + 中K','2MK',100,'9','9-11','17','+3','-3',700,'low','-'),
  ('jp-crouching-hp','しゃがみ強P（マリートヴァ）','normal','↓ + 強P','2HP',110,'9','9-14','20','+1','-6',800,'high','C'),
  ('jp-crouching-hk','しゃがみ強K（ジョーキル）','normal','↓ + 強K','2HK',120,'10','10-12','21','D','-6',900,'low','-'),
  ('jp-guillotine','ギリオチーナ','unique','→ + 中K','6MK',130,'22','22-23','19','+3','-3',700,'mid','-'),
  ('jp-shalosti','シャーロスチ','unique','→ + 強P','6HP',140,'16','16-18','31','D','-14',900,'low','-')
), upserted as (
  insert into public.moves (
    character_id,slug,name_ja,move_type,display_order,status,description,usage_summary
  )
  select
    ctx.character_id,
    v.slug,
    v.name_ja,
    v.move_type,
    v.display_order,
    'draft',
    'Imported as a secondary-source candidate.',
    'Awaiting direct CAPCOM verification before publication.'
  from vals v cross join ctx
  on conflict (slug) do update set
    name_ja=excluded.name_ja,
    move_type=excluded.move_type,
    display_order=excluded.display_order,
    status='draft',
    updated_at=now()
  returning id,slug
), cmds as (
  insert into public.move_commands (
    move_id,control_scheme,command_text,numeric_notation,sort_order
  )
  select m.id,'classic',v.command_text,v.numeric_notation,0
  from vals v
  join upserted m using(slug)
  where not exists (
    select 1 from public.move_commands mc
    where mc.move_id=m.id
      and mc.control_scheme='classic'
      and mc.command_text=v.command_text
  )
  returning move_id
), frames as (
  insert into public.move_frame_data (
    move_id,startup,active,recovery,on_hit,on_block,damage,hit_level,cancel_type,
    valid_from_patch_id,verification_status,notes
  )
  select
    m.id,
    v.startup,
    v.active,
    v.recovery,
    v.on_hit,
    v.on_block,
    v.damage,
    v.hit_level,
    v.cancel_type,
    ctx.patch_id,
    'unverified',
    'Secondary snapshot: frame-search Ver.2.0401.001. Do not publish until official CAPCOM cross-check.'
  from vals v
  join upserted m using(slug)
  cross join ctx
  where not exists (
    select 1 from public.move_frame_data f
    where f.move_id=m.id and f.valid_from_patch_id=ctx.patch_id
  )
  returning move_id
), links as (
  insert into public.entity_sources (
    entity_type,entity_id,source_id,relationship,note
  )
  select
    'move',
    m.id,
    ctx.source_id,
    'candidate',
    'Secondary aggregator snapshot; direct official verification pending.'
  from upserted m cross join ctx
  where not exists (
    select 1 from public.entity_sources es
    where es.entity_type='move'
      and es.entity_id=m.id
      and es.source_id=ctx.source_id
  )
  returning entity_id
)
select
  (select count(*) from upserted) as moves_touched,
  (select count(*) from cmds) as commands_added,
  (select count(*) from frames) as frames_added,
  (select count(*) from links) as source_links_added;
