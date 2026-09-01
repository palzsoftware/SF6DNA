-- Complete Juri text/image-only strategy collection for the 2026-08-03 baseline.
-- Community recipes and frame claims remain draft/unverified until device capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('ジュリ バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/juri','official','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'primary','Current patch compatibility context.'),
 ('ジュリ コマンドリスト','https://www.streetfighter.com/6/ja-jp/character/juri/movelist','official','CAPCOM',null::timestamptz,now(),'primary','Official Classic/Modern command reference.'),
 ('ジュリ簡単攻略 2026','https://momiageryo.com/2026/05/22/sf6_juri/','community_guide','もみあげRYO','2026-05-22 00:00:00+00'::timestamptz,now(),'community','Current written combos, punish routes and oki.'),
 ('ジュリの強い起き攻め','https://note.com/savava/n/ne5c05c78ea6a','community_guide','さばば',null::timestamptz,now(),'community','Written meaty, trade and frame-kill claims.'),
 ('ジュリ起き攻めまとめ','https://note.com/mizen5/n/n8993d5ab5449','community_guide','mizen',null::timestamptz,now(),'community','Detailed written setplay reference.'),
 ('ジュリ最低限使い方メモ','https://note.com/kch_/n/n17ca2198da74','community_guide','kch_',null::timestamptz,now(),'community','Written beginner Classic routes.'),
 ('ジュリマスター到達メモ','https://note.com/darashie/n/n1cdbbc70461b','community_guide','darashie',null::timestamptz,now(),'community','Written corner, light and drive routes.'),
 ('2026年3月ジュリ調整攻略','https://delaymania.com/202603/entame/sf6-20260317-update-juri-best/','community_guide','でぃれいマニア','2026-03-17 00:00:00+00'::timestamptz,now(),'community','Written +42 setup and current-era route claims.'),
 ('モダンジュリ初心者向け','https://note.com/terry631/n/n7f37f29d6b69','community_guide','terry631',null::timestamptz,now(),'community','Written Modern notation mapping and basics.'),
 ('モダンジュリ起き攻め 2026','https://note.com/sf6_modern_juri/n/n5c6c883a7f90','community_guide','モダンジュリ','2026-06-27 00:00:00+00'::timestamptz,now(),'community','Current Modern oki distinctions.'),
 ('Street Fighter 6 Juri Combos','https://wiki.supercombo.gg/w/Street_Fighter_6/Juri/Combos','community_wiki','SuperCombo Wiki','2025-08-14 00:00:00+00'::timestamptz,now(),'community','Broad written recipe cross-check; legacy claims isolated.'),
 ('Street Fighter 6 Juri Guide Featuring JAK','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847','community_guide','DashFight','2026-08-31 00:00:00+00'::timestamptz,now(),'community','Current written pressure and combo transcription; no video playback used.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

with ctx as(select (select id from characters where slug='juri') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),
r(slug,name,typ,notation,starter,pos,diff,purpose,conditions,src) as(values
 ('juri-y4-light-fuha','小技刻み中風破刃','basic','2LP x2-3 > M風破刃','2LP','any',2,'小技確認・風破ストック','距離で刻み数を変更','https://note.com/kch_/n/n17ca2198da74'),
 ('juri-y4-mp-fuha','中P中P中風破刃','basic','5MP > 2MP > M風破刃','5MP','any',2,'基本確認・風破ストック','SA3キャンセル候補','https://note.com/kch_/n/n17ca2198da74'),
 ('juri-y4-mp-goohsatsu','中P中P五黄殺','stock','5MP > 2MP > 五黄殺','5MP','any',2,'起き攻め','風破ストック1','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-y4-2mk-chain','中足風破連係コンボ','stock','2MK > 五黄殺 > 歳破衝 > 暗剣殺 > 6MP > M風破刃','2MK','any',5,'風破連係・運び','必要な風破ストック数と距離を確認','https://note.com/kch_/n/n17ca2198da74'),
 ('juri-y4-hp-juggle','強P風破対空締め','juggle','5HP > H風破刃 > H天穿輪','5HP','any',3,'基本高火力','SA1/SA3締めへ分岐可','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-y4-2hp-juggle','しゃがみ強P風破対空締め','juggle','2HP > H風破刃 > H天穿輪','2HP','any',3,'対空・DI反撃','SA1締め候補','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-y4-od-divekick','OD疾空閃追撃','air','OD疾空閃 > H天穿輪 or SA1 or 五黄殺','OD疾空閃','any',4,'空中奇襲追撃','最低空・高さ・距離を確認','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-y4-5mp-punish','Dリバ反撃中P強P','punish','5MP > 5HP > H風破刃 > H天穿輪','5MP punish','any',3,'Dリバ・JP技反撃','反撃可能技と距離を確認','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-y4-5hk-pc','強Kパニカン天穿輪','punish_counter','5HK(PC) > H天穿輪 or SA1','5HK punish counter','any',3,'遠距離確反','持続・距離で追撃可否確認','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-y4-dr-overhead','DR中段基本','overhead','DR 6MK > 5MP > 2MP > M風破刃 or 五黄殺','DR 6MK','any',3,'中段択','風破有無で締め分岐','https://wiki.supercombo.gg/w/Street_Fighter_6/Juri/Combos'),
 ('juri-y4-light-cdr','小技ラッシュ伸長','drive_rush','2LP x2 > CDR 2LK > 5MP > 2MP > M風破刃','2LP','any',4,'小技火力・運び','距離と補正確認','https://note.com/darashie/n/n1cdbbc70461b'),
 ('juri-y4-corner-mp','端中Pラッシュ強風破','drive_rush','5MP > 2MP or 2MK > CDR 5MP > 2HP > H風破刃 > M天穿輪','5MP','corner',4,'端運び・起き攻め','中P/中足分岐、天穿輪強度確認','https://note.com/darashie/n/n1cdbbc70461b'),
 ('juri-y4-max-punish','最大反撃ダブルラッシュSA3','super','DR 6HP(PC) > 2HP > CDR 2HP > 5MP > 2MP > CDR 2HP > 5MP > 2MP > M風破刃 or 五黄殺 > SA3','DR 6HP punish counter','any',5,'最大反撃候補','Drive 5本程度・SA3、補正と距離を確認','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-y4-di-wall','DI壁やられ強P風破','wall_splat','DI wall splat > 6HP > 暗剣殺 > 2MP > 天穿輪','DI wall splat','corner',4,'壁反撃','風破ストックと距離確認','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847'),
 ('juri-y4-di-stun','端スタン風破SA3','stun','DI stun > 2HP > H風破刃 > L天穿輪 > SA3','corner stun','corner',4,'スタンSA3','現行補正・天穿輪強度を確認','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847'),
 ('juri-y4-pp','ジャストパリィ反撃','punish','Perfect Parry > 5MP > 5HP > H風破刃 > 天穿輪','Perfect Parry','any',3,'ジャストパリィ反撃','補正込みダメージ確認','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847'),
 ('juri-y4-jumpin-dr','飛び込みラッシュ運び','drive_rush','j.HK > 5HP > 暗剣殺 > 5MP > CDR 5MP > 2HP > H風破刃 > H天穿輪','j.HK','any',5,'飛び込み最大候補','風破ストック・距離確認','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847'),
 ('juri-y4-od-ankensatsu','OD暗剣殺伸長SA3','super','5HP > OD暗剣殺 > 5HK > 5MP > CDR 2HP > 5MP > 2MP > CDR 2HP > 5MP > 2MP > 五黄殺 > SA3','5HP','any',5,'Drive/SA最大候補','風破ストック・補正・位置確認','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847'),
 ('juri-y4-2mp-pc-od','中PパニカンOD風破','punish_counter','2MP(PC) > 6MP > OD風破刃 > 4HK > 五黄殺 > delayed 暗剣殺','2MP punish counter','mid',5,'現行調整ルート','暗剣殺2F遅らせで+42との記事主張','https://delaymania.com/202603/entame/sf6-20260317-update-juri-best/'),
 ('juri-modern-m-basic','モダン中アシスト基本','modern_only','M > Assist M > M風破刃','Modern M','any',1,'モダン基本・ストック','Classic 5MP > 2MP相当','https://note.com/terry631/n/n7f37f29d6b69'),
 ('juri-modern-low','モダンしゃがみ中風破','modern_only','2M > M風破刃','Modern 2M','any',1,'モダン中足確認','Classic 2MK相当','https://note.com/terry631/n/n7f37f29d6b69'),
 ('juri-modern-low-cdr','モダン中足ラッシュ','modern_only','2M > CDR M > Assist M > M風破刃','Modern 2M','any',3,'モダン中足火力','アシスト押下順と距離を確認','https://note.com/terry631/n/n7f37f29d6b69'),
 ('juri-modern-dr-m','モダン生DR中攻撃','modern_only','DR M > M > Assist M > M風破刃','Modern DR M','any',2,'モダン接近','入力割当を現行確認','https://note.com/terry631/n/n7f37f29d6b69'),
 ('juri-modern-hp-juggle','モダン強攻撃風破追撃','modern_only','H > H風破刃 > H天穿輪 or one-button SA1','Modern H','any',3,'モダン高火力','欠落通常技と手動入力差を確認','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-modern-od-divekick','モダンOD疾空閃追撃','modern_only','OD疾空閃 > H天穿輪 or one-button SA1','Modern OD疾空閃','any',3,'モダン空中奇襲','アシスト＋必殺入力を撮影確認','https://momiageryo.com/2026/05/22/sf6_juri/')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.cid,r.slug,r.name,r.typ,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,'Written/image-confirmed route; no video playback. Current-device capture required.',ctx.pid,'unverified',case when r.typ='modern_only' then 'modern_only' else 'strategy' end,'draft' from ctx cross join r on conflict(slug) do nothing;

with ctx as(select (select id from characters where slug='juri') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),
r(slug,name,typ,starter,seq,adv,pos,description,src) as(values
 ('juri-oki-mfuhajin','中風破刃後前ステ三択','oki','M風破刃 hit','dash > micro-walk > 5MP / throw / shimmy','close claim','any','通常・後方受け身と投げ間合いを確認','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-oki-goohsatsu','五黄殺後前ステ三択','oki','五黄殺 hit','dash > micro-walk > 5MP / throw / shimmy','close claim','any','風破消費締めの基本起き攻め','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-oki-ankensatsu','暗剣殺後前ステ三択','oki','暗剣殺 hit','dash > micro-walk > 5MP / throw / shimmy','close claim','any','追撃締め後の受け身別確認','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-oki-hdp','強天穿輪後生DR打撃','oki','H天穿輪 hit','raw DR > 5MP / 5MK','strike-only claim','any','投げは届かないというモダン記事主張','https://note.com/sf6_modern_juri/n/n5c6c883a7f90'),
 ('juri-oki-sa1','SA1後生DR中攻撃','oki','SA1 hit','dash > raw DR 5MP or 5MK','unknown','any','SA1後の継続攻め','https://momiageryo.com/2026/05/22/sf6_juri/'),
 ('juri-oki-mfuhajin-5mp','中風破刃後中P重ね','meaty','M風破刃 hit','dash > timed 5MP','meaty claim','any','持続・4F相打ち・受け身を確認','https://note.com/savava/n/ne5c05c78ea6a'),
 ('juri-oki-corner-whiff-2mk','端中風破後中足空振り重ね','frame_kill','corner M風破刃 hit','2MK whiff > max-meaty 5MP','max-meaty claim','corner','記事は6MP/2MK割込みを潰すと主張','https://note.com/savava/n/ne5c05c78ea6a'),
 ('juri-oki-hfuha-hdp-lp','強風破強天穿輪後小P','frame_kill','H風破刃 > H天穿輪','dash > 2LP','meaty claim','any','無敵技ガード可という記事主張','https://note.com/savava/n/ne5c05c78ea6a'),
 ('juri-oki-mfuhajin-double-lp','中風破後小P二回','frame_kill','M風破刃 hit','dash > 2LP x2','meaty claim','any','暴れ・無敵・受け身確認','https://note.com/savava/n/ne5c05c78ea6a'),
 ('juri-oki-5mk-lfuha','中K一段弱風破重ね','meaty','5MK(1) > L風破刃','5MP / 5HP / 暗剣殺 on hit; trade > 5HP','trade +10 claim','any','一段止め、相打ち、距離を確認','https://note.com/savava/n/ne5c05c78ea6a'),
 ('juri-oki-plus42','五黄殺遅らせ暗剣殺+42','safe_jump','五黄殺 juggle','delay 暗剣殺 by 2F > forward jump attack','+42 claim','any','通常は+43との記事主張、詐欺飛び成立確認','https://delaymania.com/202603/entame/sf6-20260317-update-juri-best/'),
 ('juri-oki-saihasho-dr','歳破衝追走ラッシュ','fireball','stocked 歳破衝','walk/DR behind projectile > strike / throw / low','projectile cover','mid','弾と本体の間隔、DI、パリィを確認','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847'),
 ('juri-oki-dr-overhead-low','DR中下段択','mixup','raw DR','DR 6MK / DR 2MK / DR 5MP throw','unknown','any','中段・下段・投げの到達フレームを分離','https://wiki.supercombo.gg/w/Street_Fighter_6/Juri/Combos'),
 ('juri-oki-divekick','疾空閃低め当て継続','spacing','疾空閃 low hit/block','5MP / throw / backwalk based on spacing','-5 to -7 legacy claim','any','足元当て時の反撃差を現行確認','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847'),
 ('juri-oki-sa2-fengshui','SA2風水エンジン起点','super_setup','SA2 activation','light/medium chain > overhead/low/throw/reset branches','timer dependent','any','チェーン、補正、タイマー、割込みを撮影で確定','https://www.streetfighter.com/6/ja-jp/character/juri/movelist')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.cid,r.slug,r.name,r.typ,r.starter,r.seq,r.adv,r.pos,r.description,'Verify normal/back rise, 4F, jump, backdash, parry, D-reversal and invincible options.',ctx.pid,'unverified','strategy','draft' from ctx cross join r on conflict(slug) do nothing;

with ctx as(select (select id from characters where slug='juri') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),
r(slug,name,seq,notes,src) as(values
 ('juri-seq-stock-choice','風破ストック取得と消費','M風破刃 stock > 歳破衝 / 暗剣殺 / 五黄殺 based on range','在庫数と相手位置で分岐。','https://www.streetfighter.com/6/ja-jp/character/juri/movelist'),
 ('juri-seq-saihasho-follow','歳破衝追走攻め','stocked 歳破衝 > DR/walk > strike / throw / low','弾抜け、DI、パリィとの読み合い。','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847'),
 ('juri-seq-mp-rps','立ち中P有利三択','5MP blocked > 2MP frame trap / walk throw / shimmy','確定連携ではなく投げ打撃の読み合い。','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847'),
 ('juri-seq-light-di','小技刻みDI確認','2LP x1-3 > hit confirm special / react DI / stop','刻み数と距離で安全性を確認。','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847'),
 ('juri-seq-fuha-branches','風破連係三派生','五黄殺 > 歳破衝 > 暗剣殺 / stop / throw','ストック消費順と割込み箇所を記録。','https://note.com/kch_/n/n17ca2198da74'),
 ('juri-seq-divekick-rps','疾空閃高度別読み合い','疾空閃 block > punish / continue / OD follow based on height','最低空・胴・足元当てを分離。','https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847'),
 ('juri-seq-sa2-chain','風水エンジン基本チェーン','SA2 > light-to-heavy chain > overhead/low/reset > ender','各通常技キャンセル規則とタイマーを確認。','https://www.streetfighter.com/6/ja-jp/character/juri/movelist'),
 ('juri-seq-sa2-resource','風水エンジン使用判断','SA2 available > activate for pressure or save SA3','体力、Drive、残りラウンドで選択。','https://www.streetfighter.com/6/ja-jp/character/juri/movelist'),
 ('juri-seq-modern-defense','モダン無敵技とSA切返し','wake-up one-button DP/SA > punish on block','簡易入力と手動入力のダメージ差を確認。','https://www.streetfighter.com/6/ja-jp/character/juri/movelist'),
 ('juri-seq-corner-strike-throw','端5MP投げ打撃シミー','knockdown > meaty 5MP / throw / backwalk 5HP','受け身、投げ間合い、無敵を分離。','https://note.com/savava/n/ne5c05c78ea6a')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.cid,r.slug,r.name,'pressure',r.seq,false,'4F check','throw branch','backwalk branch','jump check','parry check','D-reversal check','invincible check',r.notes,ctx.pid,'unverified','strategy','draft' from ctx cross join r on conflict(slug) do nothing;

-- Link each newly collected item to its written source.
with e as(
 select 'combo' typ,id,slug,case when slug like 'juri-modern-%' then 'https://note.com/terry631/n/n7f37f29d6b69' when slug in('juri-y4-di-wall','juri-y4-di-stun','juri-y4-pp','juri-y4-jumpin-dr','juri-y4-od-ankensatsu') then 'https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847' when slug in('juri-y4-light-fuha','juri-y4-mp-fuha','juri-y4-2mk-chain') then 'https://note.com/kch_/n/n17ca2198da74' when slug in('juri-y4-light-cdr','juri-y4-corner-mp') then 'https://note.com/darashie/n/n1cdbbc70461b' when slug='juri-y4-2mp-pc-od' then 'https://delaymania.com/202603/entame/sf6-20260317-update-juri-best/' when slug='juri-y4-dr-overhead' then 'https://wiki.supercombo.gg/w/Street_Fighter_6/Juri/Combos' else 'https://momiageryo.com/2026/05/22/sf6_juri/' end url from combos where slug like 'juri-y4-%' or slug like 'juri-modern-%'
 union all select 'setup',id,slug,case when slug in('juri-oki-mfuhajin-5mp','juri-oki-corner-whiff-2mk','juri-oki-hfuha-hdp-lp','juri-oki-mfuhajin-double-lp','juri-oki-5mk-lfuha') then 'https://note.com/savava/n/ne5c05c78ea6a' when slug='juri-oki-plus42' then 'https://delaymania.com/202603/entame/sf6-20260317-update-juri-best/' when slug='juri-oki-hdp' then 'https://note.com/sf6_modern_juri/n/n5c6c883a7f90' when slug='juri-oki-sa2-fengshui' then 'https://www.streetfighter.com/6/ja-jp/character/juri/movelist' when slug in('juri-oki-saihasho-dr','juri-oki-divekick') then 'https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847' when slug='juri-oki-dr-overhead-low' then 'https://wiki.supercombo.gg/w/Street_Fighter_6/Juri/Combos' else 'https://momiageryo.com/2026/05/22/sf6_juri/' end from setups where slug like 'juri-oki-%'
 union all select 'sequence',id,slug,case when slug in('juri-seq-stock-choice','juri-seq-sa2-chain','juri-seq-sa2-resource','juri-seq-modern-defense') then 'https://www.streetfighter.com/6/ja-jp/character/juri/movelist' when slug in('juri-seq-fuha-branches') then 'https://note.com/kch_/n/n17ca2198da74' when slug='juri-seq-corner-strike-throw' then 'https://note.com/savava/n/ne5c05c78ea6a' else 'https://dashfight.com/news/street-fighter-6-juri-guide-featuring-jak-2847' end from sequences where slug like 'juri-seq-%'
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select e.typ,e.id,s.id,'supporting','Written/image claim; current capture required.' from e join sources s on s.url=e.url on conflict(entity_type,entity_id,source_id) do nothing;

-- Create or reuse one verification training for every active strategy item.
with ctx as(select (select id from characters where slug='juri') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),e as(
 select 'combo' typ,id,slug,name,notation method from combos where character_id=(select cid from ctx) and status<>'archived'
 union all select 'setup',id,slug,name,starter_condition||' > '||sequence_text from setups where character_id=(select cid from ctx) and status<>'archived'
 union all select 'sequence',id,slug,name,sequence_text from sequences where character_id=(select cid from ctx) and status<>'archived')
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【ジュリ撮影待ち】'||e.name,case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,'文章・画像から収集した攻略を現行版で確定する。','advanced',15,ctx.cid,'入力履歴・フレーム・ダメージ・Drive/SA・風破ストックを表示。Classic/Modern、位置、始動状態、受け身を指定。','4F、ジャンプ、バクステ、パリィ、Dリバ、無敵を必要時に録画。','CPU OFF。',e.method,'左右各10回で成立、数値、位置、受け身、ストック、キャラ条件を記録。',20,'成立ならverified候補。不成立ならarchived。',ctx.pid,'unverified','strategy','draft' from ctx cross join e where not exists(select 1 from trainings t where t.slug='training-'||e.slug) on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(select 'combo' typ,id,slug from combos where character_id=(select id from characters where slug='juri') and status<>'archived' union all select 'setup',id,slug from setups where character_id=(select id from characters where slug='juri') and status<>'archived' union all select 'sequence',id,slug from sequences where character_id=(select id from characters where slug='juri') and status<>'archived')e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related Juri strategy.' from trainings t join training_relations tr on tr.training_id=t.id join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id where t.player_character_id=(select id from characters where slug='juri') on conflict(entity_type,entity_id,source_id) do nothing;

-- Reusable beginner-page captures, separate from strategy verification.
with ctx as(select (select id from characters where slug='juri') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),r(slug,name,purpose,method) as(values
 ('juri-media-fuha-stock','【初心者素材】風破ストックの取得と表示','風破刃でストックが増える仕組みを説明する。','入力履歴とストック表示ON。弱中強風破刃の成立、ヒット／空振り時を短尺比較。'),
 ('juri-media-fuha-branches','【初心者素材】風破三派生','歳破衝・暗剣殺・五黄殺の入力と用途を説明する。','同じ距離・ストック数から3派生を個別撮影し、消費数と軌道を表示。'),
 ('juri-media-tensenrin','【初心者素材】天穿輪の対空入力','DPコマンド、先行入力、モダン簡易入力を説明する。','前歩き中、しゃがみ中、ガード硬直後からの成功／失敗例を入力履歴付き撮影。'),
 ('juri-media-divekick','【初心者素材】疾空閃の高さと反撃差','最低空・胴・足元当ての見た目を説明する。','固定距離から高度別に通常／OD疾空閃を撮影し、ガード後フレームを表示。'),
 ('juri-media-sa2-chain','【初心者素材】風水エンジンのチェーン','SA2中だけ可能な通常技チェーンを説明する。','同じ始動から通常時失敗例、SA2中成功例、中下段・締めを短尺撮影。'),
 ('juri-media-dr-pressure','【初心者素材】弾追走とキャンセルラッシュ','歳破衝追走と中足キャンセルDRを説明する。','入力履歴・Drive表示ON。生DR、キャンセルDR、弾追走を別テイクで撮影。') )
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select r.slug,r.name,'instructional_media',r.purpose,'beginner',10,ctx.cid,'720p60fps以上。入力履歴・フレーム・ダメージ・風破ストック表示ON。成功例と必要な失敗例を分ける。','必要なダミー動作だけ個別再生。','CPU OFF。',r.method,'入力と結果が短尺で判別できること。',5,'1～2秒ループと10～20秒説明クリップへ分割。',ctx.pid,'unverified','training','draft' from ctx cross join r on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Official command reference for instructional capture.' from trainings t join sources s on s.url='https://www.streetfighter.com/6/ja-jp/character/juri/movelist' where t.slug like 'juri-media-%' on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.training_type='instructional_media' then 10 when t.name ilike '%最大%' or t.name ilike '%SA2%' or t.name ilike '%SA3%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,case when t.training_type='instructional_media' then '初心者ページ兼ジュリページ用。短尺再利用を前提に撮影。' else '現行成立、入力、数値、位置、受け身、風破ストック、キャラ条件を確認。' end from trainings t where t.player_character_id=(select id from characters where slug='juri') and (exists(select 1 from training_relations tr where tr.training_id=t.id and tr.related_type in('combo','setup','sequence')) or t.slug like 'juri-media-%') on conflict(training_id) do nothing;

update character_content_packages ccp set rollout_status='complete',notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Juri text/image-only strategy collection complete. Classic/Modern, Fuha stocks, Feng Shui Engine, divekick and reusable beginner media tracked; video playback excluded.'),updated_at=now() from characters c where c.id=ccp.character_id and c.slug='juri';
