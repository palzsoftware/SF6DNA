-- Cross-character coverage repair discovered by the phase25 audit.
-- 1. Complete the Manon written expansion to the same practical granularity.
-- 2. Repair missing Training/capture links for active Ryu and Luke strategies.
-- 3. Stop reporting unanalysed, archived-placeholder-only packages as complete.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
 ('マノン起き攻めまとめ','https://note.com/hairanndo/n/n10a75497b160','community_guide','hairanndo','2024-08-25 00:00:00+00'::timestamptz,now(),'community','Written knockdown-specific Manon oki. Imported as legacy candidates pending current capture.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p25g_manon_combo(
 slug text,name text,typ text,notation text,starter text,pos text,diff int,purpose text,conditions text,kind text,src text
) on commit drop;

insert into p25g_manon_combo values
('manon-p25g-medium-double-dr-sa3','中攻撃ダブルラッシュSA3','super','5MP / 5MK / 2MP > CDR 2MP > レベランス > CDR レベランス > 2MP > Lロン・ポワン > SA3','medium normal','any',5,'中攻撃始動リーサル','legacy candidate; Drive6 + SA3; Medal level and spacing required.','legacy_candidate','https://mntone.hateblo.jp/entry/sf6_manon'),
('manon-p25g-medium-switch-sa1','中攻撃入れ替えSA1','side_switch','5MP / 5MK / 2MP > CDR 2MP > アン・オー > SA1','medium normal','any',4,'SA1入れ替え','legacy candidate; Drive3 + SA1.','legacy_candidate','https://mntone.hateblo.jp/entry/sf6_manon'),
('manon-p25g-jhk-od-rond-sa2','飛び込みODグランSA2','jump_in','j.HK > レベランス > ODグラン・フェッテ > レベランス > Hロン・ポワン > DR レベランス > Hロン・ポワン > SA2','j.HK','any',5,'飛び込みSA2火力','legacy candidate; height, Drive and Medal level required.','legacy_candidate','https://mntone.hateblo.jp/entry/sf6_manon'),
('manon-p25g-4hp-od-rond-mdegage','引き強P運び中デガジェ','drive','4HP > ODグラン・フェッテ > 4HP > Hロン・ポワン > Mデガジェ','4HP','any',4,'運びと端起き攻め','legacy candidate; Drive2; end position required.','legacy_candidate','https://note.com/hairanndo/n/n10a75497b160'),
('manon-p25g-4hp-od-mrond','引き強P中ロン詐欺飛び','safe_jump','4HP > ODグラン・フェッテ > 4HP > Mロン・ポワン','4HP','any',4,'詐欺飛び移行','legacy candidate; Source +6 safe-jump claim.','legacy_candidate','https://note.com/hairanndo/n/n10a75497b160'),
('manon-p25g-modern-enhaut-cdr','モダンアン・オーDR弱デガジェ','modern_only','4M~M > CDR Assist H > M > Lデガジェ','Modern 4M~M','any',4,'モダン中段確認','legacy candidate; Modern only; Drive3.','modern_only','https://kamigame.jp/streetfighter6/page/302016678814828204.html');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.typ,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,
 'Written/image-only claim. No video playback; current-device capture required.',p.id,'unverified',r.kind,'draft'
from p25g_manon_combo r join characters c on c.slug='manon'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Written route; current-device capture required.'
from p25g_manon_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25g_manon_setup(
 slug text,name text,typ text,starter text,seq text,adv text,pos text,descr text,kind text,src text
) on commit drop;

insert into p25g_manon_setup values
('manon-p25g-oki-2hk-dash','大足後前ステ弱コマ投げ','command_throw','2HK hit','dash > Lマネージュ・ドレ / strike / guard','Source +8 claim','any','大足後のコマ投げ・打撃・無敵釣り。','legacy_candidate','https://note.com/hairanndo/n/n10a75497b160'),
('manon-p25g-oki-2hk-pc-dash2','大足PC後前ステ二回','command_throw','2HK punish counter','dash x2 > Hマネージュ・ドレ / strike / guard','Source +2 claim','any','大足PC後の強コマ投げ択。','legacy_candidate','https://note.com/hairanndo/n/n10a75497b160'),
('manon-p25g-oki-throw-dr-command','通常投げ後DR中コマ投げ','throw_oki','normal throw','DR > Mマネージュ・ドレ / strike / stop','Source about +5 claim','any','通常投げ後のDRコマ投げ択。','legacy_candidate','https://note.com/hairanndo/n/n10a75497b160'),
('manon-p25g-oki-ldegage-lk','弱デガジェ後弱K消費','frame_kill','Lデガジェ hit','5LK > Hマネージュ・ドレ / レベランス / guard','Source +3 claim','any','弱Kフレーム消費後の三択。','legacy_candidate','https://note.com/hairanndo/n/n10a75497b160'),
('manon-p25g-oki-mdegage-mp','中デガジェ後中P消費','frame_kill','Mデガジェ hit','5MP > Lマネージュ・ドレ / strike / shimmy','Source +9 claim','corner','中P消費後のコマ投げと打撃。','legacy_candidate','https://note.com/hairanndo/n/n10a75497b160'),
('manon-p25g-oki-hrond-mk','強ロン後中K消費','frame_kill','Hロン・ポワン hit','5MK > Lマネージュ・ドレ / strike / guard','Source +7 claim','any','中K消費後のコマ投げ択。','legacy_candidate','https://note.com/hairanndo/n/n10a75497b160'),
('manon-p25g-oki-hrond-safejump','強ロン後詐欺飛びコマ投げ','safe_jump','4HP > ODグラン・フェッテ > 4HP > Hロン・ポワン','forward jump attack > Lマネージュ・ドレ / SA3 / guard','Source +7 after jump claim','any','安全飛び後のコマ投げ・SA3。','legacy_candidate','https://note.com/hairanndo/n/n10a75497b160'),
('manon-p25g-oki-corner-sa2-mp','端SA2後中P消費','super_setup','corner SA2 hit','5MP > Lマネージュ・ドレ / strike / shimmy','Source +9 claim','corner','端SA2後のコマ投げ択。','legacy_candidate','https://note.com/hairanndo/n/n10a75497b160');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.typ,r.starter,r.seq,r.adv,r.pos,r.descr,
 'Legacy written claim. Verify both recoveries, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',
 p.id,'unverified',r.kind,'draft'
from p25g_manon_setup r join characters c on c.slug='manon'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Written setup; current-device capture required.'
from p25g_manon_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25g_manon_seq(slug text,name text,seq text,notes text,kind text,src text) on commit drop;
insert into p25g_manon_seq values
('manon-p25g-seq-cdr-defense-tree','中攻撃ラッシュ防御分岐','5MP > CDR 2MP > immediate/delayed 2MP / guard / 2F backwalk / 5LP > レベランス','4F、通常投げ、ジャンプ、Dリバ、無敵への勝敗を別記録する。','legacy_candidate','https://mntone.hateblo.jp/entry/sf6_manon'),
('manon-p25g-seq-ldegage-21','弱デガジェ+21分岐','Lデガジェ > DR レベランス / DRマネージュ・ドレ / DR guard > Hマネージュ・ドレ','暴れ、ガード、Dリバ・無敵読みを混ぜずに確認する。','legacy_candidate','https://mntone.hateblo.jp/entry/sf6_manon'),
('manon-p25g-seq-2hk-framekill','大足フレーム消費読み合い','2HK > 2MP whiff > Mマネージュ・ドレ / レベランス / guard / uncancelled Lデガジェ','バクステ、ジャンプ、無敵への分岐を個別確認する。','legacy_candidate','https://mntone.hateblo.jp/entry/sf6_manon'),
('manon-p25g-seq-medal45-setplay','メダル4・5セットプレイ','medium confirm > L/Mデガジェ ender > レベランス / Mランヴェルセ / command throw / SA3','メダル4・5、中央・端、締め強度を分けて記録する。','legacy_candidate','https://mntone.hateblo.jp/entry/sf6_manon');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,false,'4F check','command/normal throw branch','2F backwalk or guard branch','jump check','parry check','D-reversal check','OD/SA reversal check',r.notes,p.id,'unverified',r.kind,'draft'
from p25g_manon_seq r join characters c on c.slug='manon'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Written decision tree; current-device capture required.'
from p25g_manon_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;

-- Manon verification Training and capture rows for the 18 additions.
with e as(
 select 'combo' typ,x.id,x.slug,x.name,x.notation method,x.content_kind from p25g_manon_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind from p25g_manon_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind from p25g_manon_seq r join sequences x on x.slug=r.slug
),p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【マノン撮影待ち】'||e.name,
 case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,
 '文章・画像から収集したマノン攻略の現行成立を確定する。','advanced',15,c.id,
 '入力履歴・フレーム・ダメージ・Drive/SA・メダルLvを表示。操作方式、位置、受け身を指定。',
 '4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,
 '左右各10回で成立、数値、位置、受け身、メダルLv、キャラ条件を記録。',20,
 '成立ならverified候補。不成立ならarchived。',p.id,'unverified',e.content_kind,'draft'
from e join characters c on c.slug='manon' cross join p
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(
 select 'combo' typ,x.id,x.slug from p25g_manon_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug from p25g_manon_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug from p25g_manon_seq r join sequences x on x.slug=r.slug
)e on t.slug='training-'||e.slug
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related Manon strategy.'
from trainings t join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.slug like 'training-manon-p25g-%'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.name ilike '%SA%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,
 '現行成立、入力、ダメージ、ゲージ、終了F、受け身、位置、メダルLv、キャラ条件を確認。'
from trainings t where t.slug like 'training-manon-p25g-%'
on conflict(training_id) do nothing;

-- Repair missing verification Training relations and capture rows for active Ryu/Luke strategy data.
with e as(
 select c.id cid,c.name_ja,'combo' typ,x.id,x.slug,x.name,x.notation method,x.content_kind
 from characters c join combos x on x.character_id=c.id and x.status<>'archived' where c.slug in('ryu','luke')
 union all
 select c.id,c.name_ja,'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind
 from characters c join setups x on x.character_id=c.id and x.status<>'archived' where c.slug in('ryu','luke')
 union all
 select c.id,c.name_ja,'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind
 from characters c join sequences x on x.character_id=c.id and x.status<>'archived' where c.slug in('ryu','luke')
),missing as(
 select e.* from e left join training_relations tr on tr.related_type=e.typ and tr.related_id=e.id where tr.training_id is null
),p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||m.slug,'【'||m.name_ja||'撮影待ち】'||m.name,
 case when m.typ='combo' then 'combo_retest' when m.typ='setup' then 'oki_retest' else 'pressure_retest' end,
 '既存の未検証攻略を現行版で確定する。','advanced',15,m.cid,
 '入力履歴・フレーム・ダメージ・Drive/SA表示。位置、受け身、CH/PCを指定。',
 '4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',m.method,
 '左右各10回で成立、数値、位置、受け身、キャラ条件を記録。',20,
 '成立ならverified候補。不成立ならarchived。',p.id,'unverified',m.content_kind,'draft'
from missing m cross join p
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id
from trainings t join(
 select 'combo' typ,x.id,x.slug from characters c join combos x on x.character_id=c.id and x.status<>'archived' where c.slug in('ryu','luke')
 union all select 'setup',x.id,x.slug from characters c join setups x on x.character_id=c.id and x.status<>'archived' where c.slug in('ryu','luke')
 union all select 'sequence',x.id,x.slug from characters c join sequences x on x.character_id=c.id and x.status<>'archived' where c.slug in('ryu','luke')
)e on t.slug='training-'||e.slug
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related Ryu/Luke strategy.'
from trainings t join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.player_character_id in(select id from characters where slug in('ryu','luke'))
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' then 20
      when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,
 '現行成立、入力、数値、位置、受け身、固有条件、キャラ条件を確認。'
from trainings t
where t.player_character_id in(select id from characters where slug in('ryu','luke'))
  and exists(select 1 from training_relations tr where tr.training_id=t.id and tr.related_type in('combo','setup','sequence'))
on conflict(training_id) do nothing;

-- Packages with no active Combo/Setup/Sequence were archived-placeholder templates only.
-- Keep their historical rows archived, but return the package to an honest unanalysed state.
update character_content_packages ccp
set rollout_status='not_started',combo_status='not_started',setup_status='not_started',
    sequence_status='not_started',training_status='not_started',
    notes=case when coalesce(ccp.notes,'') like '%2026-09-01 coverage audit: archived placeholders only%'
      then ccp.notes else concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01 coverage audit: archived placeholders only; character strategy collection has not started.') end,
    updated_at=now()
from characters c
where c.id=ccp.character_id and c.is_playable=true
  and not exists(select 1 from combos x where x.character_id=c.id and x.status<>'archived')
  and not exists(select 1 from setups x where x.character_id=c.id and x.status<>'archived')
  and not exists(select 1 from sequences x where x.character_id=c.id and x.status<>'archived');

update character_content_packages ccp
set notes=case when coalesce(ccp.notes,'') like '%2026-09-01 phase25g: Manon coverage expansion%'
  then ccp.notes else concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01 phase25g: Manon coverage expansion and cross-character Training/capture repair complete.') end,
 updated_at=now()
from characters c where c.id=ccp.character_id and c.slug in('manon','ryu','luke');
