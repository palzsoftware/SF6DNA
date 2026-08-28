-- JP air-normal candidate import.
-- Secondary source: https://frame-search.com/?character_name=JP&lang=ja-jp
-- IMPORTANT: source snapshots around 2026-08-26 report Ver.2.0401.000/.001 inconsistently.
-- Keep every row draft + unverified until direct CAPCOM or in-game verification.

with source_row as (
  select id from public.sources
  where url='https://frame-search.com/?character_name=JP&lang=ja-jp'
  order by created_at desc
  limit 1
), ctx as (
  select c.id character_id, p.id patch_id, s.id source_id
  from public.characters c
  cross join public.patches p
  cross join source_row s
  where c.slug='jp' and p.is_current=true
), vals(slug,name_ja,command_text,numeric_notation,display_order,startup,active,damage) as (
  values
  ('jp-jump-lp','ジャンプ弱P（ルイースイ）','（ジャンプ中に）弱P','j.LP',150,'5','5-14',300),
  ('jp-jump-lk','ジャンプ弱K（ヴァローナ）','（ジャンプ中に）弱K','j.LK',160,'6','6-13',300),
  ('jp-jump-mp','ジャンプ中P（ローシャッチ）','（ジャンプ中に）中P','j.MP',170,'12','12-14',700),
  ('jp-jump-mk','ジャンプ中K（コンダ）','（ジャンプ中に）中K','j.MK',180,'7','7-12',600),
  ('jp-jump-hp','ジャンプ強P（イディナローク）','（ジャンプ中に）強P','j.HP',190,'9','9-13',800),
  ('jp-jump-hk','ジャンプ強K（ジャール・プチーツァ）','（ジャンプ中に）強K','j.HK',200,'11','11-16',800)
), upserted as (
  insert into public.moves (character_id,slug,name_ja,move_type,display_order,status,description,usage_summary)
  select ctx.character_id,v.slug,v.name_ja,'normal',v.display_order,'draft',
    'Imported as a secondary-source candidate.',
    'Air normal candidate. Awaiting direct CAPCOM or in-game verification before publication.'
  from vals v cross join ctx
  on conflict (slug) do update set
    name_ja=excluded.name_ja,
    display_order=excluded.display_order,
    status='draft',
    updated_at=now()
  returning id,slug
), cmds as (
  insert into public.move_commands (move_id,control_scheme,command_text,numeric_notation,sort_order)
  select m.id,'classic',v.command_text,v.numeric_notation,0
  from vals v join upserted m using(slug)
  where not exists (
    select 1 from public.move_commands mc
    where mc.move_id=m.id and mc.control_scheme='classic' and mc.command_text=v.command_text
  )
  returning move_id
), frames as (
  insert into public.move_frame_data (
    move_id,startup,active,recovery,on_hit,on_block,damage,hit_level,cancel_type,
    valid_from_patch_id,verification_status,notes
  )
  select m.id,v.startup,v.active,null,null,null,v.damage,'mid','-',ctx.patch_id,'unverified',
    'Secondary frame-search candidate. Air recovery/hit/block vary by jump timing and are intentionally not populated. Snapshot version display was inconsistent between 2.0401.000 and 2.0401.001; direct verification required.'
  from vals v join upserted m using(slug) cross join ctx
  where not exists (
    select 1 from public.move_frame_data f
    where f.move_id=m.id and f.valid_from_patch_id=ctx.patch_id
  )
  returning move_id
), links as (
  insert into public.entity_sources (entity_type,entity_id,source_id,relationship,note)
  select 'move',m.id,ctx.source_id,'candidate','Secondary aggregator candidate; direct official/in-game verification pending.'
  from upserted m cross join ctx
  where not exists (
    select 1 from public.entity_sources es
    where es.entity_type='move' and es.entity_id=m.id and es.source_id=ctx.source_id
  )
  returning entity_id
)
select
  (select count(*) from upserted) as moves_touched,
  (select count(*) from cmds) as commands_added,
  (select count(*) from frames) as frames_added,
  (select count(*) from links) as source_links_added;
