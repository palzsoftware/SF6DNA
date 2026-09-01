-- Modern coverage repair for previously completed Ryu, JP and Luke packages.
-- Luke rows already existed but were misclassified as generic strategy.
-- Ryu/JP receive written/image-only Modern routes; all remain draft/unverified.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
 ('モダンリュウ コンボまとめ','https://kamigame.jp/streetfighter6/page/299835871639650448.html','community_guide','神ゲー攻略','2025-11-27 00:00:00+00'::timestamptz,now(),'community','Written Modern routes; pre-2026-08-03 claims require current capture.'),
 ('モダンリュウ立ち回り・コンボ・起き攻め','https://www.sukoreru.com/sf6-modern-ryu','community_guide','スコれる？','2024-06-16 00:00:00+00'::timestamptz,now(),'community','Written Modern combo parts and oki; current capture required.'),
 ('モダンJP コンボまとめ','https://kamigame.jp/streetfighter6/page/303760271556525911.html','community_guide','神ゲー攻略','2026-02-08 00:00:00+00'::timestamptz,now(),'community','Written Modern JP routes; pre-2026-08-03 claims require current capture.'),
 ('モダンJP コンボメモ','https://note.com/dos236236/n/n334dea2c51e8','community_guide','ドス',null::timestamptz,now(),'community','Written Modern JP combo branches; legacy candidate only.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

-- Reclassify Luke rows whose slug/name explicitly identifies Modern-only inputs.
update combos set content_kind='modern_only',updated_at=now()
where character_id=(select id from characters where slug='luke') and status<>'archived'
  and (slug like 'luke-y4-modern-%' or name ilike 'M%');
update setups set content_kind='modern_only',updated_at=now()
where character_id=(select id from characters where slug='luke') and status<>'archived'
  and (slug like 'luke-y4-modern-%' or name ilike '%モダン%');
update sequences set content_kind='modern_only',updated_at=now()
where character_id=(select id from characters where slug='luke') and status<>'archived'
  and (slug like 'luke-y4-modern-%' or name ilike 'M%');

create temporary table p25h_combo(
 cslug text,slug text,name text,typ text,notation text,starter text,pos text,diff int,purpose text,conditions text,src text
) on commit drop;
insert into p25h_combo values
-- Modern Ryu.
('ryu','ryu-modern-hasho-dr-3hp','M波掌撃DR前強締め','modern_only','H/Denjin波掌撃 > DR 5HP > L波掌撃 > 3HP','H/Denjin Hashogeki','any',4,'モダン中央省エネ','legacy candidate; Drive1; current patch capture required.','https://www.sukoreru.com/sf6-modern-ryu'),
('ryu','ryu-modern-hasho-corner-dp','M波掌撃端強昇龍','modern_only','H/Denjin波掌撃 > DR 5HP~HP > H昇龍拳','H/Denjin Hashogeki','corner',4,'モダン端火力','legacy candidate; corner only.','https://www.sukoreru.com/sf6-modern-ryu'),
('ryu','ryu-modern-hasho-dr-sa3','M波掌撃DR強昇龍SA3','modern_only','H/Denjin波掌撃 > DR 4HP > H昇龍拳 > SA3','H/Denjin Hashogeki','any',5,'モダンSA3','legacy candidate; spacing may require DR 5HP.','https://www.sukoreru.com/sf6-modern-ryu'),
('ryu','ryu-modern-di-denjin-tatsu','M DI電刃中竜巻','modern_only','DI(PC) > Assist H x2 > Denjin波掌撃 > M竜巻','DI punish counter','any',3,'モダンDI運び','legacy candidate; Denjin stock required.','https://kamigame.jp/streetfighter6/page/299835871639650448.html'),
('ryu','ryu-modern-di-od-blade-air-tatsu','M DI OD足刀空中竜巻','modern_only','DI(PC) > Assist H x2 > OD上段足刀 > 6HP > air竜巻','DI punish counter','any',5,'モダンDI状況重視','legacy candidate; Drive4; current air-tatsu trajectory required.','https://kamigame.jp/streetfighter6/page/299835871639650448.html'),
('ryu','ryu-modern-di-side-switch-dp','M DI足刀入れ替え弱昇龍','modern_only','DI(PC) > dash 5HP > OD上段足刀 > dash L昇龍','DI punish counter','any',5,'モダン入れ替え','legacy candidate; Source +37 claim.','https://kamigame.jp/streetfighter6/page/299835871639650448.html'),
('ryu','ryu-modern-di-double-dr-sa3','M DIダブルラッシュSA3','modern_only','DI(PC) > Assist H x2 > CDR 5HP > 5MP > CDR 5HP > 5MP > H昇龍 > SA3','DI punish counter','any',5,'モダン最大候補','legacy candidate; Drive6 + SA3.','https://kamigame.jp/streetfighter6/page/299835871639650448.html'),
('ryu','ryu-modern-m-l-dp','M中弱昇龍確認','modern_only','5M > 5L > H昇龍 / Assist L confirm','Modern 5M','any',2,'モダン基本確認','legacy candidate; exact assist/autocombo branch required.','https://goziline.com/archives/54017'),
-- Modern JP.
('jp','jp-modern-light-stribog','M小技弱ストリボーグ','modern_only','2L x2-3 > Lストリボーグ','Modern 2L','any',2,'モダン小技確認','legacy candidate; Source 1100 claim.','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-light-max-sa3','M小技最大SA3','modern_only','2L x2 > CDR 5L > グロームストレルカ > ODトルバラン > OD Hトリグラフ > Hトリグラフ > SA3','Modern 2L','any',5,'モダン小技リーサル','legacy candidate; Drive6 + SA3.','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-assist-h-pc-triglav','M強アシストPC中トリグラフ','modern_only','Assist H(PC) > DR 5H > 6H > Mトリグラフ','Modern Assist H punish counter','any',4,'モダン差し返し','legacy candidate; Source 2355-2443 claim.','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-assist-h-pc-sa3','M強アシストPC最大SA3','modern_only','Assist H(PC) > DR 5H > 2HP > CDR 5H > 6H > OD Hトリグラフ > Hトリグラフ > SA3','Modern Assist H punish counter','any',5,'モダン最大反撃','legacy candidate; Drive6 + SA3.','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-amnesia-corner-assist','M端アムネジア中アシスト','modern_only','corner ODアムネジア throw parry > Assist M > Hヴィーハト > Hトリグラフ','OD Amnesia vs throw','corner',4,'モダンアムネジア反撃','legacy candidate; exact Vihart/Triglav strengths require capture.','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-di-jh-triglav','M中央DI飛び強トリグラフ','modern_only','DI(PC) > j.H > Assist H > Mトリグラフ','DI punish counter','any',3,'モダンDI基本','legacy candidate; Source 2640 claim.','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-di-od-triglav','M中央DI ODトリグラフ','modern_only','DI(PC) > j.H > Assist H > OD Mトリグラフ > Hトリグラフ','DI punish counter','any',4,'モダンDI火力','legacy candidate; Drive3.','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-wall-torbalan-stribog','M端DIトルバラン弱ストリボーグ','modern_only','DI wall splat > 6H > ODトルバラン > Mトリグラフ > Lストリボーグ / SA3','DI wall splat','corner',5,'モダン壁反撃','legacy candidate; Drive3; SA3 branch.','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-punish-vihart-loop','M確反ODヴィーハト追撃','modern_only','Assist H(PC) > OD Hヴィーハト > Assist M > Lストリボーグ > dash x2 > Assist H > Lトリグラフ','Modern Assist H punish counter','any',5,'モダン確反火力','legacy candidate; close punish only.','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-stun-vihart','Mスタン弱ヴィーハト','modern_only','stun > Lヴィーハト > neutral jump frame kill > Assist H > Mトルバラン > 6H > Mトルバラン','opponent stun','corner',5,'モダンスタンノーゲージ','legacy candidate; Source 3238-3270 claim.','https://kamigame.jp/streetfighter6/page/303760271556525911.html');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.typ,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,
 'Modern written/image-only claim. No video playback; current-device capture required.',p.id,'unverified','modern_only','draft'
from p25h_combo r join characters c on c.slug=r.cslug
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Modern written route; current-device capture required.'
from p25h_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25h_setup(cslug text,slug text,name text,starter text,seq text,adv text,pos text,descr text,src text) on commit drop;
insert into p25h_setup values
('ryu','ryu-modern-corner-denjin-plus9','M端電刃錬気+9','H/Denjin波掌撃 > DR 5HP~HP','cancel target combo into Denjin charge > strike / throw / shimmy','Source +9 claim','corner','端コンボ後に電刃を取得して密着起き攻め。','https://www.sukoreru.com/sf6-modern-ryu'),
('ryu','ryu-modern-tatsu-dash-oki','M竜巻後前ステ起き攻め','M竜巻 hit','dash > Assist L / throw / guard','Legacy advantage claim','any','中竜巻締め後のモダン基本起き攻め。','https://www.sukoreru.com/sf6-modern-ryu'),
('jp','jp-modern-amnesia-switch-vihart','Mアムネジア入れ替え設置','ODアムネジア side-switch > Mトリグラフ +49','ODヴィーハト setup > strike / throw / portal','Source +9 after OD Vihart claim','corner','端アムネジア入れ替え後の設置。','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-wall-triglav-vihart','M壁DIトリグラフ設置','DI wall > Mトリグラフ +53','ODヴィーハト setup > 5MP / throw / portal','Source +3 after OD Vihart claim','corner','壁コンボ後の設置起き攻め。','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-stun-triglav-vihart','Mスタン中トリグラフ設置','stun combo > Mトリグラフ +44','ODヴィーハト setup > 5MP / throw / portal','Source +4 after OD Vihart claim','corner','スタンコンボ後の設置起き攻め。','https://kamigame.jp/streetfighter6/page/303760271556525911.html');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'modern_oki',r.starter,r.seq,r.adv,r.pos,r.descr,
 'Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',p.id,'unverified','modern_only','draft'
from p25h_setup r join characters c on c.slug=r.cslug
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Modern written setup; current-device capture required.'
from p25h_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25h_seq(cslug text,slug text,name text,seq text,notes text,src text) on commit drop;
insert into p25h_seq values
('ryu','ryu-modern-assist-h-manual','M強アシスト手動分岐','Assist H x2 > stop auto M波掌撃 > manual H/Denjin波掌撃 > tatsu / DR / SA3','自動コンボ完走と手動強度切替を分けて確認。','https://kamigame.jp/streetfighter6/page/299835871639650448.html'),
('ryu','ryu-modern-denjin-resource','M電刃資源分岐','Denjin stock > no-meter tatsu / DR damage / corner charge reset / SA3','電刃消費、Drive、位置で用途を分ける。','https://www.sukoreru.com/sf6-modern-ryu'),
('jp','jp-modern-assist-h-projectile','M強アシスト弾分岐','Assist H > ODトルバラン / トルバランfeint / DR punish-confirm','インパクト、パリィ、前飛びへの勝敗を確認。','https://kamigame.jp/streetfighter6/page/303760271556525911.html'),
('jp','jp-modern-vihart-oki-tree','Mヴィーハト起き攻め分岐','knockdown > ODヴィーハト > 5MP / throw / portal / triglav / bait','+3/+4/+9開始状況を混ぜずに記録。','https://kamigame.jp/streetfighter6/page/303760271556525911.html');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'modern_pressure',r.seq,false,'4F check','throw branch','guard/feint branch','jump check','parry check','D-reversal check','OD/SA reversal check',r.notes,p.id,'unverified','modern_only','draft'
from p25h_seq r join characters c on c.slug=r.cslug
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Modern written decision tree; current-device capture required.'
from p25h_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;

-- Verification Training and capture rows for the new Ryu/JP Modern items.
with e as(
 select r.cslug,'combo' typ,x.id,x.slug,x.name,x.notation method from p25h_combo r join combos x on x.slug=r.slug
 union all select r.cslug,'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text from p25h_setup r join setups x on x.slug=r.slug
 union all select r.cslug,'sequence',x.id,x.slug,x.name,x.sequence_text from p25h_seq r join sequences x on x.slug=r.slug
),p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【'||c.name_ja||'モダン撮影待ち】'||e.name,
 case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,
 '文章・画像から収集したModern攻略の現行成立を確定する。','advanced',15,c.id,
 'Modern。入力履歴・フレーム・ダメージ・Drive/SA・固有資源を表示。位置、受け身、CH/PCを指定。',
 '4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,
 '左右各10回で成立、数値、位置、受け身、簡易補正、キャラ条件を記録。',20,
 '成立ならverified候補。不成立ならarchived。',p.id,'unverified','modern_only','draft'
from e join characters c on c.slug=e.cslug cross join p
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(
 select 'combo' typ,x.id,x.slug from p25h_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug from p25h_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug from p25h_seq r join sequences x on x.slug=r.slug
)e on t.slug='training-'||e.slug
on conflict(training_id,related_type,related_id) do nothing;

-- Align every Luke Modern Training with its now-correct strategy classification.
update trainings t set content_kind='modern_only',updated_at=now()
from training_relations tr
join(
 select 'combo' typ,id from combos where character_id=(select id from characters where slug='luke') and content_kind='modern_only' and status<>'archived'
 union all select 'setup',id from setups where character_id=(select id from characters where slug='luke') and content_kind='modern_only' and status<>'archived'
 union all select 'sequence',id from sequences where character_id=(select id from characters where slug='luke') and content_kind='modern_only' and status<>'archived'
)e on e.typ=tr.related_type and e.id=tr.related_id
where tr.training_id=t.id;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related Modern strategy.'
from trainings t join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.player_character_id in(select id from characters where slug in('ryu','jp','luke'))
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' then 20
      when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,
 'Modern現行成立、入力、数値、位置、受け身、簡易補正、固有条件を確認。'
from trainings t
where t.slug in(
 select 'training-'||slug from p25h_combo union all
 select 'training-'||slug from p25h_setup union all
 select 'training-'||slug from p25h_seq
)
on conflict(training_id) do nothing;

update character_content_packages ccp
set notes=case when coalesce(ccp.notes,'') like '%2026-09-01 phase25h: Modern coverage repair%'
 then ccp.notes else concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01 phase25h: Modern coverage repair completed for Ryu, JP and Luke. Luke misclassification corrected; Ryu/JP written Modern candidates added.') end,
 updated_at=now()
from characters c where c.id=ccp.character_id and c.slug in('ryu','jp','luke');
