-- JP comprehensive objective-data candidate expansion.
-- Current corroborating source: Ultimate Frame Data, JP page, updated for August 2026.
-- All rows remain draft. Frames are reviewed, not verified, until direct CAPCOM cross-check.
with src as (
  insert into public.sources(title,url,source_type,publisher,accessed_at,reliability_level,notes)
  select 'JP - Ultimate Frame Data (August 2026 current)','https://ultimateframedata.com/sf6/jp','community_aggregator','Ultimate Frame Data',now(),'community',
         'UFD states JP was updated for the August 2026 patch. Used as current corroborating secondary source; not treated as CAPCOM-official verification.'
  where not exists (select 1 from public.sources where url='https://ultimateframedata.com/sf6/jp')
  returning id
), source_row as (
  select id from src union all
  select id from public.sources where url='https://ultimateframedata.com/sf6/jp' limit 1
), ctx as (
  select c.id character_id,p.id patch_id,s.id source_id
  from public.characters c cross join public.patches p cross join source_row s
  where c.slug='jp' and p.is_current=true
), vals(slug,name_ja,name_en,move_type,command_text,numeric_notation,display_order,startup,recovery,on_hit,on_block,damage,hit_level,invincibility,notes) as (
 values
('jp-back-mp','後ろ中P / Back + Medium Punch','Back + Medium Punch','unique','← + 中P','4MP','145','8','16','+5','-1','500','high',null,'UFD current Aug 2026.'),
('jp-forward-hk','前強K（Bylina）','Forward + Heavy Kick (Bylina)','unique','→ + 強K','6HK','150','11','24','KD +38','-5','900','high',null,'Two-hit total 300+600; second hit special/super cancellable.'),
('jp-grom-strelka','Grom Strelka','Grom Strelka','target_combo','← + 中P > 中P','4MP~MP','160','8,10','16,20','+5,+3','-1,-6','1000','high',null,'Target combo; UFD current Aug 2026.'),
('jp-zilant','Zilant','Zilant','target_combo','強K > 強P','HK~HP','170','12,20','17,20','+7,+3','+2,-3','1300','high',null,'Target combo.'),
('jp-zilant-mid','Zilant Mid','Zilant Mid','target_combo','強K > 強P > 強P','HK~HP~HP','180','12,20,21','17,20,22','+7,+3,+3','+2,-3,-4','2300','overhead',null,'Third hit does not combo; overhead.'),
('jp-zilant-low','Zilant Low','Zilant Low','target_combo','強K > 強P > 強K','HK~HP~HK','190','12,20,21','17,20,22','+7,+3,+3','+2,-3,-4','2300','low',null,'Third hit does not combo; low.'),
('jp-triglav','トリグラフ / Triglav','Triglav','special','↓ ↓ + P','22P','200','22','24 (33)','KD +44','-2','800','high',null,'Punch strength changes distance.'),
('jp-triglav-od','OD トリグラフ / Triglav','Triglav (Overdrive)','special','↓ ↓ + PP','22PP','210','20','14 (22)','KD +53','+3','1000','high',null,'Two hits 500+500; limited juggle.'),
('jp-stribog-l','弱 ストリボーグ / Stribog','Stribog (Light Punch)','special','↓↘→ + 弱P','236LP','220','16','28 (30)','KD +38','-10','1000','high',null,'First hit strike, second projectile.'),
('jp-stribog-m','中 ストリボーグ / Stribog','Stribog (Medium Punch)','special','↓↘→ + 中P','236MP','230','20','27 (29)','KD +42','-8','1200','high',null,'Limited juggle; first hit strike, second projectile.'),
('jp-stribog-h','強 ストリボーグ / Stribog','Stribog (Heavy Punch)','special','↓↘→ + 強P','236HP','240','28','19 (21)','KD +86','+4','800','high',null,'Limited juggle; first hit strike, second projectile.'),
('jp-stribog-od','OD ストリボーグ / Stribog','Stribog (Overdrive)','special','↓↘→ + PP','236PP','250','19','22 (24)','KD +69...','+2','1400','high',null,'Wall bounce; two hits 600+800.'),
('jp-departure','ヴィーハト / Departure','Departure','special','↓↙← + P','214P','260','**','**','KD +80','+31','800','high',null,'Portal; punch strength changes location. Relative advantage.'),
('jp-departure-od','OD ヴィーハト / Departure','Departure (Overdrive)','special','↓↙← + PP','214PP','270','**','**','KD +113','+60','1000','high',null,'Portal; two hits 500+500. Relative advantage.'),
('jp-departure-window','ヴィーハト・アクノ / Departure > Window','Departure > Window','special','ヴィーハト後 ↓↙← + 弱P/中P','214P>214LP/MP','280','5','19',null,null,null,null,null,'Invincible frames 6-20; teleport, jump attack possible.'),
('jp-departure-shadow','ヴィーハト・チェーニ / Departure > Shadow','Departure > Shadow','special','ヴィーハト後 ↓↙← + 強P','214P>214HP','290','20','21','KD +80','+31','800','high',null,'Manually triggers portal attack; full juggle.'),
('jp-amnesia','アムネジア / Amnesia','Amnesia','special','↓ ↓ + K','22K','300','3','35 / 17','KD +88','+28','800','parry','strike 3-18','Counters strikes; 17f recovery on successful parry.'),
('jp-amnesia-od','OD アムネジア / Amnesia','Amnesia (Overdrive)','special','↓ ↓ + KK','22KK','310','1','35 / 17','KD +131','+28','1200','parry','strike+throw 1-20','Counters strikes and throws; two hits 600+600.'),
('jp-torbalan-l','弱 トルバラン / Torbalan','Torbalan (Light Kick)','special','↓↘→ + 弱K','236LK','320','(13...)+9','28','KD +42...','-6...','800','high',null,'Hold to feint; projectile startup distance-dependent.'),
('jp-torbalan-m','中 トルバラン / Torbalan','Torbalan (Medium Kick)','special','↓↘→ + 中K','236MK','330','(13...)+13','24','+6...+27','-8...+13','1000','overhead',null,'Hold to feint; initial scaling 20%.'),
('jp-torbalan-h','強 トルバラン / Torbalan','Torbalan (Heavy Kick)','special','↓↘→ + 強K','236HK','340','(13...)+13','24','+6...+27','-8...+13','1000','low',null,'Hold to feint; initial scaling 20%.'),
('jp-torbalan-od','OD トルバラン / Torbalan','Torbalan (Overdrive)','special','↓↘→ + KK','236KK','350','(13...)+9,25','3','KD +65...','+24','800','high',null,'Two hits 400+400; limited juggle.'),
('jp-embrace','エンブレイス / Embrace','Embrace','special','↓↙← + K','214K','360','(25...)+1','44','KD +18',null,'1800','throw',null,'Projectile until grab activates; cannot use while Departure portal active.'),
('jp-embrace-od','OD エンブレイス / Embrace','Embrace (Overdrive)','special','↓↙← + KK','214KK','370','(25...)+1','44','KD +18',null,'2600','throw',null,'OD damage per UFD; command inferred as KK and remains reviewed, not verified.'),
('jp-sa1','チェルノボーグ / Chornobog（SA1）','Chornobog (Level 1)','super','↓↘→ ↓↘→ + P','236236P','400','7,15','62...52','KD +22...+32','-33...-23','2000','high','strike+throw 1-10','Armor break.'),
('jp-sa2','ラヴーシュカ / Lovushka（SA2）','Lovushka (Level 2)','super','↓↙← ↓↙← + P','214214P','410','13','**','**','**','2000','mixed',null,'Four hits 500x4; high/overhead/low/overhead; disables Torbalan/Embrace while active.'),
('jp-sa3','ザプリェット / Interdiction（SA3/CA）','Interdiction (Level 3)','super','↓↘→ ↓↘→ + K','236236K','420','18','62','KD +23','-50','4000','high','full 1-23','CA 4500; armor break.'),
('jp-forward-throw','前投げ','Forward Throw','throw','近距離で →/N + 弱P+弱K',null,'500','5','23','+23',null,'1200','throw',null,'UFD current Aug 2026.'),
('jp-back-throw','後ろ投げ','Back Throw','throw','近距離で ← + 弱P+弱K',null,'510','5','23','+36',null,'1200','throw',null,'UFD current Aug 2026.')
), upserted as (
 insert into public.moves(character_id,slug,name_ja,name_en,move_type,display_order,status,description,usage_summary)
 select ctx.character_id,v.slug,v.name_ja,v.name_en,v.move_type,v.display_order::integer,'draft',
        'Current August 2026 candidate from Ultimate Frame Data.',
        'Secondary-source reviewed candidate. Direct CAPCOM verification pending.'
 from vals v cross join ctx
 on conflict(slug) do update set
   name_ja=excluded.name_ja,name_en=excluded.name_en,move_type=excluded.move_type,
   display_order=excluded.display_order,status='draft',updated_at=now()
 returning id,slug
), cmds as (
 insert into public.move_commands(move_id,control_scheme,command_text,numeric_notation,sort_order)
 select m.id,'classic',v.command_text,v.numeric_notation,0 from vals v join upserted m using(slug)
 where not exists(select 1 from public.move_commands mc where mc.move_id=m.id and mc.control_scheme='classic' and mc.command_text=v.command_text)
 returning move_id
), frames as (
 insert into public.move_frame_data(move_id,startup,recovery,on_hit,on_block,damage,hit_level,invincibility,valid_from_patch_id,verification_status,notes)
 select m.id,v.startup,v.recovery,v.on_hit,v.on_block,v.damage::integer,v.hit_level,v.invincibility,ctx.patch_id,'reviewed',
        'Reviewed against Ultimate Frame Data current August 2026 JP page. '||coalesce(v.notes,'')
 from vals v join upserted m using(slug) cross join ctx
 where not exists(select 1 from public.move_frame_data f where f.move_id=m.id and f.valid_from_patch_id=ctx.patch_id and f.valid_to_patch_id is null)
 returning move_id
), links as (
 insert into public.entity_sources(entity_type,entity_id,source_id,relationship,note)
 select 'move',m.id,ctx.source_id,'corroborating','Current secondary source; August 2026. Direct CAPCOM verification pending.'
 from upserted m cross join ctx
 where not exists(select 1 from public.entity_sources es where es.entity_type='move' and es.entity_id=m.id and es.source_id=ctx.source_id)
 returning entity_id
)
select (select count(*) from upserted) moves_touched,(select count(*) from cmds) commands_added,(select count(*) from frames) frames_added,(select count(*) from links) source_links_added;
