-- Text/image-only strategy collection for Dee Jay, Manon and Marisa.
-- All community claims remain draft/unverified until current-device capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('ディージェイ 2026.08.03 公式バトル変更','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/deejay','official','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'primary','Current patch context.'),
 ('ディージェイ 公式ムーブリスト','https://www.streetfighter.com/6/ja-jp/character/deejay/movelist','official','CAPCOM',null::timestamptz,now(),'primary','Official commands.'),
 ('ディージェイ2026変更解説','https://hiyoko-lab.com/streetfighter6_hiyoko/sf6_2026-08-03-update_01/','community_guide','ひよこ研究所','2026-08-03 00:00:00+00'::timestamptz,now(),'community','Post-patch written claims.'),
 ('ディージェイ基本コンボ','https://note.com/crisismattsu/n/nf41c0eb44192','community_guide','community author',null::timestamptz,now(),'community','Written Classic routes.'),
 ('ディージェイコンボ・セットプレイ','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4','community_guide','community author',null::timestamptz,now(),'community','Detailed legacy routes; current capture required.'),
 ('ディージェイ起き攻め','https://note.com/crisismattsu/n/ne5a6d4382898','community_guide','community author',null::timestamptz,now(),'community','Written legacy oki.'),
 ('モダンディージェイコンボ','https://kamigame.jp/streetfighter6/page/350089989993852124.html','community_guide','神ゲー攻略',null::timestamptz,now(),'community','Written Modern routes; current capture required.'),
 ('マノン 2026.08.03 公式バトル変更','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/manon','official','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'primary','Current patch context.'),
 ('マノン 公式ムーブリスト','https://www.streetfighter.com/6/ja-jp/character/manon/movelist','official','CAPCOM',null::timestamptz,now(),'primary','Official commands and Medal system.'),
 ('Year4マノンコンボメモ','https://mntone.hateblo.jp/entry/sf6_manon','community_guide','mntone',null::timestamptz,now(),'community','Current/legacy written combos.'),
 ('マノンコンボ起き攻め','https://www.sukoreru.com/sf6-manon','community_guide','スコレル','2025-01-01 00:00:00+00'::timestamptz,now(),'community','Written combo and oki routes.'),
 ('マノン投げ後起き攻め','https://note.com/wantyandx/n/n015b948c6025','community_guide','community author',null::timestamptz,now(),'community','Written Renverse and command-throw oki.'),
 ('モダンマノンコンボ','https://kamigame.jp/streetfighter6/page/302016678814828204.html','community_guide','神ゲー攻略',null::timestamptz,now(),'community','Written Modern routes.'),
 ('マリーザ 2026.08.03 公式バトル変更','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/marisa','official','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'primary','Current patch context.'),
 ('マリーザ 公式ムーブリスト','https://www.streetfighter.com/6/ja-jp/character/marisa/movelist','official','CAPCOM',null::timestamptz,now(),'primary','Official Classic/Modern commands.'),
 ('マリーザ現行コンボ','https://takukakugamer.com/sf6-marisa-combo/','community_guide','たくかくゲーマー','2026-08-24 00:00:00+00'::timestamptz,now(),'community','Post-patch written Classic routes.'),
 ('マリーザ現行セットプレイ','https://takukakugamer.com/sf6-marisa-setup/','community_guide','たくかくゲーマー','2026-08-24 00:00:00+00'::timestamptz,now(),'community','Post-patch written setup claims.'),
 ('モダンマリーザYear4','https://www.sukoreru.com/sf6-modern-marisa','community_guide','スコレル','2026-08-11 00:00:00+00'::timestamptz,now(),'community','Post-patch Modern routes and input changes.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p25_combo(cslug text,slug text,name text,typ text,notation text,starter text,pos text,diff int,purpose text,conditions text,src text) on commit drop;
insert into p25_combo values
-- Dee Jay
('dee-jay','deejay-light-sobat','小技中ソバット','basic','2LP x3 > Mクイックローリングソバット','2LP','any',2,'小技確認','legacy candidate; SA3可','https://note.com/crisismattsu/n/nf41c0eb44192'),
('dee-jay','deejay-light-jackknife','小技強ジャック','basic','2LP x3 > Hジャックナイフマキシマム','2LP','any',3,'小技火力','立ち食らい限定','https://note.com/crisismattsu/n/nf41c0eb44192'),
('dee-jay','deejay-2hp-jackknife','しゃがみ強Pジャック','basic','2HP > optional 2MP > Hジャックナイフ','2HP','any',3,'基本確認','距離で2MP省略','https://note.com/crisismattsu/n/nf41c0eb44192'),
('dee-jay','deejay-2hp-pc-sa3','強PパニカンSA3','punish_counter','2HP(PC) > 5HP > Mマシンガンアッパー > SA3','2HP punish counter','any',4,'無敵反撃','legacy damage claim 5400','https://note.com/crisismattsu/n/nf41c0eb44192'),
('dee-jay','deejay-di-wall-sa3','DI壁マシンガンSA3','wall_splat','DI wall splat > 2MP > Hマシンガンアッパー > SA3','DI wall splat','corner',4,'壁反撃','legacy candidate','https://note.com/crisismattsu/n/nf41c0eb44192'),
('dee-jay','deejay-cdr-sa3','中PダブルラッシュSA3','super','2MP > CDR 5MP > 2HP > 2MP > CDR 2HP > 5HP > Mマシンガン > SA3','2MP','any',5,'リーサル','Drive6+SA3','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-pc-jackknife','密着強Pパニカン','punish_counter','2HP(PC) > 2HP > 2MP > Mジャック > Hジャック','2HP punish counter','any',4,'ノーゲージ確反','密着限定','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-od-jus-corner','端ODジョスクール','corner','ODジョスクール delayed H派生 > Mソバット > Hジャック','OD Jus Cool','corner',5,'端伸長','legacy candidate','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-di-pc-jackknife','DIパニカンジャック','punish_counter','DI(PC) > 2HP > 2MP > Mジャック > Hジャック','DI punish counter','any',3,'DI反撃','position check','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-dr-low','DR小足強ソバット','drive_rush','DR 2LK > 2MP > Hソバット','DR 2LK','any',3,'下段択','legacy candidate','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-od-machine-sa2-y4','現行ODマシンガンSA2','super','DR 2HP > 5HP > ODマシンガンアッパー > SA2','DR 2HP','any',5,'現行SA2候補','2026 post-patch claim','https://hiyoko-lab.com/streetfighter6_hiyoko/sf6_2026-08-03-update_01/'),
('dee-jay','deejay-od-machine-sa3-y4','現行ODマシンガンSA3','super','DR 2HP > 5HP > ODマシンガンアッパー > SA3','DR 2HP','any',5,'現行SA3候補','2026 post-patch claim','https://hiyoko-lab.com/streetfighter6_hiyoko/sf6_2026-08-03-update_01/'),
('dee-jay','deejay-modern-basic','モダン弱アシスト','modern_only','Assist L chain > Mソバット','Modern Assist L','any',1,'モダン小技','legacy candidate','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('dee-jay','deejay-modern-dr','モダンDR中攻撃','modern_only','DR M > Assist H x2 > ODジョスクール H派生 > Hジャック','Modern DR M','any',4,'モダン主力','legacy candidate','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('dee-jay','deejay-modern-di','モダンDI反撃','modern_only','DI(PC) > 2H > Assist M > Hジャック','DI punish counter','any',3,'モダンDI','legacy candidate','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('dee-jay','deejay-modern-stun','モダン端スタン','modern_only','corner stun > j.H > 2H > Assist M > Mジャック > Hジャック','corner stun','corner',4,'モダンスタン','legacy candidate','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
-- Manon
('manon','manon-lk-ch-renverse-y4','弱Kカウンター弱ランヴェルセ','counter','5LK(CH) > Lランヴェルセ','5LK counter','any',3,'現行メダル獲得','2026 official change','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/manon'),
('manon','manon-3hk-pc-sa1-y4','トモエPC SA1','punish_counter','3HK(PC) > SA1','3HK punish counter','any',3,'現行入れ替えSA1','fixed knockdown','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/manon'),
('manon','manon-3hk-pc-sa2-y4','トモエPC SA2','punish_counter','3HK(PC) > SA2','3HK punish counter','any',3,'現行入れ替えSA2','fixed knockdown','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/manon'),
('manon','manon-od-degage-y4','ODデガジェバウンド追撃','drive','4HP > ODグランフェッテ > 4HP > Hロンポワン > ODデガジェ > Lランヴェルセ','4HP','any',5,'現行Driveルート','D4; new air bounce','https://mntone.hateblo.jp/entry/sf6_manon'),
('manon','manon-od-max-y4','ODデガジェ最大候補','drive','4HP > ODグランフェッテ > 4HP > ODロンポワン > ODデガジェ > Lランヴェルセ','4HP','any',5,'現行最大候補','D6; capture priority','https://mntone.hateblo.jp/entry/sf6_manon'),
('manon','manon-basic-degage','レベランスデガジェ','basic','4HP > L/Mデガジェ','4HP','any',2,'基本確反','legacy candidate','https://mntone.hateblo.jp/entry/sf6_manon'),
('manon','manon-basic-renverse','レベランスランヴェルセ','basic','4HP > L/Mランヴェルセ','4HP','any',2,'メダル獲得','legacy candidate','https://mntone.hateblo.jp/entry/sf6_manon'),
('manon','manon-cdr-renverse','中攻撃ラッシュ投げ派生','drive_rush','5MP/5MK/2MP > CDR 2MP > 4HP > Mランヴェルセ','medium normal','any',4,'牽制確認','legacy candidate','https://www.sukoreru.com/sf6-manon'),
('manon','manon-light-sa3','小技SA3','super','2LP x2-3 > Hロンポワン > SA3','2LP','any',4,'小技リーサル','legacy candidate','https://www.sukoreru.com/sf6-manon'),
('manon','manon-hp-pc','強Pパニカンメダル','punish_counter','5HP(PC) > 5HP follow-up > ODロンポワン > DR 5LP > Mランヴェルセ','5HP punish counter','any',5,'差し返し','D3','https://www.sukoreru.com/sf6-manon'),
('manon','manon-di','DIパニカンメダル','punish_counter','DI(PC) > dash > 4HP > Mランヴェルセ','DI punish counter','any',3,'DI反撃','legacy candidate','https://www.sukoreru.com/sf6-manon'),
('manon','manon-di-wall','DI壁ランヴェルセ','wall_splat','DI wall splat > 4HP > Lランヴェルセ','DI wall splat','corner',3,'壁反撃・メダル','legacy candidate','https://www.sukoreru.com/sf6-manon'),
('manon','manon-corner-od','端ODロンポワン','corner','4HP > ODロンポワン x2 > Mランヴェルセ','4HP','corner',5,'端メダル火力','D4','https://mntone.hateblo.jp/entry/sf6_manon'),
('manon','manon-modern-light','モダン小技ロンポワン','modern_only','2L x2 > Mロンポワン','Modern 2L','any',2,'モダン小技','legacy candidate','https://kamigame.jp/streetfighter6/page/302016678814828204.html'),
('manon','manon-modern-cdr','モダン中攻撃ラッシュ','modern_only','M > CDR L > Assist H > Lランヴェルセ','Modern M','any',4,'モダン主力','legacy candidate','https://kamigame.jp/streetfighter6/page/302016678814828204.html'),
('manon','manon-modern-overhead','モダン中段TCラッシュ','modern_only','4M~M > CDR Assist H > M > Lデガジェ','Modern 4M','any',4,'モダン中段','legacy candidate','https://kamigame.jp/streetfighter6/page/302016678814828204.html'),
-- Marisa
('marisa','marisa-light-dimach','小技弱ディマカイルス','basic','2LK/2LP > 2LP > Lディマカイルス~6P','light','any',2,'小技起き攻め','current written','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-mptc-gladius','中PTC中グラディウス','basic','5MP~MP > Mグラディウス','5MP','any',2,'基本火力','current written','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-mptc-dimach','中PTC中ディマ','basic','5MP~MP > Mディマカイルス~6P','5MP','any',2,'基本起き攻め','current written','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-od-carry','中PTC ODディマ運び','drive','5MP~MP > ODディマ~6P > DR 6HK~HK > Lグラディウス','5MP','any',4,'Drive運び','D3','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-od-phalanx','中PTC ODディマファランクス','drive','5MP~MP > ODディマ~6P > DR 4HP > Hファランクス','5MP','any',4,'詐欺飛び移行','D3','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-2mp-cdr','中足ラッシュ火力','drive_rush','2MP > CDR 5MK > 4HP > Hディマ~6P > Hグラディウス','2MP','any',5,'牽制火力','current written','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-heavy-sa3','強攻撃SA3','super','6HK/4HP > Hディマ~6P > Hグラディウス > SA3','6HK/4HP','any',4,'SA3リーサル','current written','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-dr-overhead','DR中段弱ディマ','overhead','DR 3HP > 2LP x2 > Lディマ~6P','DR 3HP','any',3,'中段択','current written','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-charge-pc-max','溜め強Pパニカン最大','punish_counter','charged 5HP(PC) > 6HK > CDR 5MK > 4HP > CDR 5HP > 5MP~MP > Mグラディウス > SA3','charged 5HP PC','any',5,'最大反撃候補','current written','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-di-clean','DIクリーン溜め強P','punish_counter','DI clean hit > charged 4HP > 4HP > Hディマ~6P > DR 4HP > Hファランクス','DI clean hit','any',5,'DI最大候補','current written','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-corner-wall','端DI壁ファランクス','wall_splat','DI wall splat > Hディマ~6P > charged 4HP > Lファランクス','DI wall splat','corner',5,'壁反撃・詐欺飛び','current written','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-antiair','溜めしゃがみ強P対空','anti_air','charged 2HP anti-air > DR 4HP > Hグラディウス','anti-air 2HP','any',4,'対空追撃','高さ確認','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-modern-assist-h','モダン強アシストSA3','modern_only','Assist H chain > Hグラディウス > SA3','Modern Assist H','any',3,'モダン基本SA3','Year4 current','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa','marisa-modern-cdr','モダン中足ラッシュSA3','modern_only','2M > CDR M > 4H > Hディマ > Hグラディウス > SA3','Modern 2M','any',5,'モダン主力','Year4 current','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa','marisa-modern-di','モダンDI反撃SA3','modern_only','DI(PC) > charged 4H > 4H > Hディマ > Hグラディウス > SA3','DI punish counter','any',5,'モダンDI','Year4 current','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa','marisa-modern-od-phalanx','モダン端ODファランクス','modern_only','corner ODファランクス > charged 2H > Mグラディウス > SA3','OD Phalanx','corner',5,'モダン端火力','Year4 current','https://www.sukoreru.com/sf6-modern-marisa');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.typ,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,'Written/image-confirmed; no video playback. Current-device capture required.',p.id,'unverified',case when r.typ='modern_only' then 'modern_only' else 'strategy' end,'draft' from p25_combo r join characters c on c.slug=r.cslug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Written/image claim; current capture required.' from p25_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25_setup(cslug text,slug text,name text,typ text,starter text,seq text,adv text,pos text,descr text,src text) on commit drop;
insert into p25_setup values
-- Dee Jay
('dee-jay','deejay-oki-od-machine-y4','現行ODマシンガン後+14','oki','ODマシンガン hit +52','dash x2 > delayed 5MP / throw / shimmy','+14 claim','any','旧+23/+4セットプレイを置換','https://hiyoko-lab.com/streetfighter6_hiyoko/sf6_2026-08-03-update_01/'),
('dee-jay','deejay-oki-light-jack-y4','弱ジャック移動調整','side_switch','Lジャック hit','hold back or neutral > position-based strike/throw','current official','any','前進量を新仕様で調整','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/deejay'),
('dee-jay','deejay-oki-hjack','強ジャック前ステ2回','oki','Hジャック ground hit','dash x2 > strike / throw','+4 claim','any','先端距離確認','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-oki-hjack-safejump','強ジャック詐欺飛び','safe_jump','Hジャック hit','forward jump attack','+42 claim','any','無敵着地ガード確認','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-oki-corner-throw','端前投げ持続中段','throw_oki','corner forward throw','5LP whiff > 6MK meaty / throw / shimmy','+3 block claim','corner','legacy candidate','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-oki-sobat','中ソバット後DR択','oki','Mソバット hit','DR 6MK / DR 5MP / DR throw','+5 to +7 claims','mid','中央攻め継続','https://note.com/crisismattsu/n/ne5a6d4382898'),
('dee-jay','deejay-oki-sweep','大足持続サンライズ','frame_kill','2HK hit +33','5LP whiff > 6MK meaty','+2 block claim','any','legacy candidate','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-oki-jack-whiff','ジャック後空振り消費','frame_kill','Mジャック > Hジャック','4HK whiff > throw / shimmy','+5 claim','any','legacy candidate','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-oki-modern-hjack','モダン強ジャック後択','modern_oki','Modern Hジャック','dash x2 > Assist H / throw','+4 legacy claim','any','current capture','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('dee-jay','deejay-oki-modern-odair','モダンODエアスラ追走','modern_oki','ODエアスラ block/hit','DR > hit confirm / throw / pressure','unknown','any','legacy candidate','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
-- Manon
('manon','manon-oki-degage-throw-y4','中デガジェ弱コマ投げ','command_throw','Mデガジェ hit','dash > immediate Lマネージュドレ','current claim','corner','持続3F化で待ち不要候補','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/manon'),
('manon','manon-oki-ldegage-hp','弱デガジェDRレベランス','oki','Lデガジェ hit','DR 4HP > hit Renverse / block + pressure','+8 block claim','any','legacy candidate','https://www.sukoreru.com/sf6-manon'),
('manon','manon-oki-ldegage-low','弱デガジェDR下段','oki','Lデガジェ hit','DR 2MK > hit 4HP / block pressure','+5 block claim','any','legacy candidate','https://www.sukoreru.com/sf6-manon'),
('manon','manon-oki-h-rond-low','強ロンポワンDR下段','oki','Hロンポワン hit','delayed DR 2MK','timing dependent','any','最速は空振り','https://www.sukoreru.com/sf6-manon'),
('manon','manon-oki-renverse-mp','ランヴェルセ後DR中P','oki','ランヴェルセ hit','DR 5MP > Lランヴェルセ / command throw','unknown','any','メダル継続','https://note.com/wantyandx/n/n015b948c6025'),
('manon','manon-oki-renverse-low','ランヴェルセ後DR下段','oki','ランヴェルセ hit','DR 2MK > degage route','unknown','any','距離注意','https://note.com/wantyandx/n/n015b948c6025'),
('manon','manon-oki-renverse-throw','ランヴェルセ後DRコマ投げ','command_throw','ランヴェルセ hit','DR M/Hマネージュドレ / delayed normal throw','unknown','any','ジャスパ対策','https://note.com/wantyandx/n/n015b948c6025'),
('manon','manon-oki-command-hp','コマ投げ後DR強P','command_throw','マネージュドレ hit','DR 5HP meaty / command throw','unknown','any','打撃投げ二択','https://note.com/wantyandx/n/n015b948c6025'),
('manon','manon-oki-modern','モダン投げ後DR択','modern_oki','Modern command throw','DR M / DR low / command throw','unknown','any','メダル別記録','https://kamigame.jp/streetfighter6/page/302016678814828204.html'),
('manon','manon-oki-degage-bugwait','強デガジェ修正後確認','legacy','Hデガジェ/command throw','old oki claim; capture only','unknown','any','2026-08-12修正後の値不明','https://mntone.hateblo.jp/entry/sf6_manon'),
-- Marisa
('marisa','marisa-oki-ldimach','弱ディマ+31','frame_kill','Lディマ hit','5LP whiff > 6HK / immediate Enfold','+31 claim','any','打撃コマ投げ','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-oki-ldimach-dr','弱ディマDR択','oki','Lディマ hit','DR charged 4HP / throw / Enfold','unknown','any','太い二択','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-oki-mdimach','中ディマ+36','oki','Mディマ hit','DR charged 6HK / throw / Enfold','+36 claim','any','中央攻め','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-oki-phalanx-safejump','ファランクス+42詐欺飛び','safe_jump','Hファランクス hit','forward j.HP / j.HK','+42 claim','corner','着地+11候補','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-oki-corner-ldimach','端弱ディマ空振り消費','frame_kill','corner Lディマ','2MP whiff > 2LK / throw','unknown','corner','下段投げ','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-oki-corner-mdimach','端中ディマ溜め強P','frame_kill','corner Mディマ/Lグラディウス','5LP whiff > charged 4HP','+36 claim','corner','打撃重ね','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-oki-corner-enfold','端+36エンフォルド','frame_kill','corner Mディマ/Lグラディウス','2MP whiff > Scutum > Enfold','unknown','corner','コマ投げ択','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-oki-forwardthrow','端前投げ起き攻め','throw_oki','corner forward throw +23','dash > 2LP / normal throw','unknown','corner','柔道','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-oki-modern-ldimach','モダン弱ディマDR択','modern_oki','Modern Lディマ','DR max charged 5H / command throw / guard / DR M','unknown','any','Year4 input','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa','marisa-oki-modern-hdimach','モダン強ディマ詐欺飛び','modern_oki','corner Hディマ > charged H follow-up','forward jump safe-jump','unknown','corner','Year4 current','https://www.sukoreru.com/sf6-modern-marisa');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.typ,r.starter,r.seq,r.adv,r.pos,r.descr,'Verify rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',p.id,'unverified',case when r.typ like 'modern%' then 'modern_only' else 'strategy' end,'draft' from p25_setup r join characters c on c.slug=r.cslug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Written/image claim; current capture required.' from p25_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25_seq(cslug text,slug text,name text,seq text,notes text,src text) on commit drop;
insert into p25_seq values
('dee-jay','deejay-seq-light-y4','弱攻撃刻み現行確認','LP/2LP/LK chain > Mソバ or Hジャック','2026ヒットバック縮小後の刻み数を確認。','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/deejay'),
('dee-jay','deejay-seq-jack-y4','弱ジャック位置分岐','Lジャック hold back/neutral > front/back strike-throw','新仕様の前進量差。','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/deejay'),
('dee-jay','deejay-seq-jus','ジョスクール派生','Jus Cool > L low / M overhead / H combo / forward movement / stop','4F、DI、パリィ、無敵を分離。','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-seq-dr','DR中攻撃読み合い','DR 5MP > throw / delayed 5MP / 5HP air slasher / low','連ガと隙間を確認。','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-seq-sobat','強ソバット+2択','Hソバ block > throw / 2LK~2LP / backwalk 5HP','Source +2 claim。','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('dee-jay','deejay-seq-modern','モダン溜めと簡易入力','hold down-back > one-button air slasher/jackknife > manual strength route','強度・簡易補正を確認。','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('manon','manon-seq-cdr-throw','中Pラッシュコマ投げ','5MP > CDR 2MP block > Hマネージュドレ / 2MP / 4HP','4F・ジャンプ・バクステを分離。','https://www.sukoreru.com/sf6-manon'),
('manon','manon-seq-tc','中P中K TC二択','5MP~5MK > command throw / strike','Source +2 claim。','https://www.sukoreru.com/sf6-manon'),
('manon','manon-seq-lk','弱Kラッシュ二択','5LK > CDR > Hマネージュドレ or LP~4HP route','投げとジャンプ狩り。','https://www.sukoreru.com/sf6-manon'),
('manon','manon-seq-hp','強P引寄せ二択','5HP~HP hit > Hマネージュドレ / light strike','密着+3 claim。','https://www.sukoreru.com/sf6-manon'),
('manon','manon-seq-burnout','BO中グランフェッテ択','opponent BO > グランフェッテ block > 5MP / command throw','現行-3にBO加算。','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/manon'),
('manon','manon-seq-medal','メダル段階別判断','Medal 1-5 > strike/command throw/SA3 risk-reward','ダメージ固定値を使わない。','https://www.streetfighter.com/6/ja-jp/character/manon/movelist'),
('marisa','marisa-seq-phalanx','ファランクス後暴れ潰し','Phalanx block +3 > 5LP / throw / backwalk','4Fと無敵を確認。','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-seq-od-phalanx','ODファランクス相打ち','OD Phalanx +4 > 4HP trade > follow-up','相打ち後追撃を記録。','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-seq-cdr-overhead','中段ラッシュ分岐','6HK > CDR 6HK > hit 4HP / block Lファランクス','ヒットガード確認。','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa','marisa-seq-enfold','DR中段エンフォルド','DR 6HK +2 > Scutum~Enfold / strike','ジャンプと4Fを分離。','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-seq-burnout','BOクアドリガ固め','opponent BO > Hクアドリガ > 2MP > Hクアドリガ / light chain','連続ガードと隙間を確認。','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-seq-modern-input','モダンYear4方向入力','back+SP Phalanx / down+SP Quadriga strength / manual Dimachaerus','旧入力と混同しない。','https://www.sukoreru.com/sf6-modern-marisa');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,false,'4F check','throw branch','backwalk branch','jump check','parry check','D-reversal check','invincible check',r.notes,p.id,'unverified',case when r.slug like '%modern%' then 'modern_only' else 'strategy' end,'draft' from p25_seq r join characters c on c.slug=r.cslug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Written/image claim; current capture required.' from p25_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;

-- Verification Training for every active strategy item.
with cs as(select id,slug,name_ja from characters where slug in('dee-jay','manon','marisa')),p as(select id from patches where is_current=true order by released_at desc limit 1),e as(
 select c.slug cslug,c.name_ja cname,'combo' typ,x.id,x.slug,x.name,x.notation method from cs c join combos x on x.character_id=c.id and x.status<>'archived'
 union all select c.slug,c.name_ja,'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text from cs c join setups x on x.character_id=c.id and x.status<>'archived'
 union all select c.slug,c.name_ja,'sequence',x.id,x.slug,x.name,x.sequence_text from cs c join sequences x on x.character_id=c.id and x.status<>'archived')
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【'||e.cname||'撮影待ち】'||e.name,case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,'文章・画像から収集した攻略を現行版で確定する。','advanced',15,c.id,'入力履歴・フレーム・ダメージ・Drive/SA・固有資源表示。操作方式、位置、受け身を指定。','4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,'左右各10回で成立、数値、位置、受け身、キャラ条件を記録。',20,'成立ならverified候補。不成立ならarchived。',p.id,'unverified','strategy','draft' from e join cs c on c.slug=e.cslug cross join p where not exists(select 1 from trainings t where t.slug='training-'||e.slug) on conflict(slug) do nothing;
insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(select 'combo' typ,id,slug from combos where character_id in(select id from characters where slug in('dee-jay','manon','marisa')) and status<>'archived' union all select 'setup',id,slug from setups where character_id in(select id from characters where slug in('dee-jay','manon','marisa')) and status<>'archived' union all select 'sequence',id,slug from sequences where character_id in(select id from characters where slug in('dee-jay','manon','marisa')) and status<>'archived')e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related strategy.' from trainings t join training_relations tr on tr.training_id=t.id join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id where t.player_character_id in(select id from characters where slug in('dee-jay','manon','marisa')) on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25_media(cslug text,slug text,name text,method text,src text) on commit drop;
insert into p25_media values
('dee-jay','deejay-media-charge','【初心者素材】ディージェイ溜め共有','下後ろ溜め、通常技中の溜め、エアスラとジャックの出し分けを入力履歴付きで撮影。','https://www.streetfighter.com/6/ja-jp/character/deejay/movelist'),
('dee-jay','deejay-media-jus','【初心者素材】ジョスクール全派生','通常/ODの下段・中段・強派生・前移動・急停止を比較。','https://www.streetfighter.com/6/ja-jp/character/deejay/movelist'),
('dee-jay','deejay-media-y4','【初心者素材】現行ODマシンガン起き攻め','前ステ2回後+14と弱ジャック後ろ入力の有無を比較。','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/deejay'),
('manon','manon-media-medal','【初心者素材】メダルLv1～5','コマ投げ・ランヴェルセ・SA3の段階差を表示。','https://www.streetfighter.com/6/ja-jp/character/manon/movelist'),
('manon','manon-media-throws','【初心者素材】2種類のコマンド投げ','マネージュドレとランヴェルセの入力・用途・メダル増加を比較。','https://www.streetfighter.com/6/ja-jp/character/manon/movelist'),
('manon','manon-media-y4','【初心者素材】現行ODデガジェ追撃','空中ヒットバウンド、高度別弱ランヴェルセ追撃を撮影。','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/manon'),
('marisa','marisa-media-modern-input','【初心者素材】モダンYear4入力変更','後+SPファランクス、下+SPクアドリガ、手動ディマを表示。','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa','marisa-media-charge','【初心者素材】強攻撃溜め比較','通常・最大溜め・アーマー・DI割りを比較。','https://www.streetfighter.com/6/ja-jp/character/marisa/movelist'),
('marisa','marisa-media-safejump','【初心者素材】ファランクス詐欺飛び','+42の通常重ねと無敵技着地ガード、その後の打撃コマ投げを撮影。','https://takukakugamer.com/sf6-marisa-setup/');
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select r.slug,r.name,'instructional_media','初心者ページとキャラページで再利用する。','beginner',10,c.id,'720p60fps以上。入力履歴・フレーム・固有資源表示ON。','必要な動作だけ個別再生。','CPU OFF。',r.method,'入力と結果が短尺で判別できる。',5,'短尺ループと説明クリップへ分割。',p.id,'unverified','training','draft' from p25_media r join characters c on c.slug=r.cslug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Official/current written reference.' from p25_media r join trainings t on t.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.training_type='instructional_media' then 10 when t.name ilike '%現行%' or t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,case when t.training_type='instructional_media' then '初心者ページ兼キャラページ用の短尺素材。' else '現行成立、入力、数値、位置、受け身、固有資源、キャラ条件を確認。' end from trainings t where t.player_character_id in(select id from characters where slug in('dee-jay','manon','marisa')) and (exists(select 1 from training_relations tr where tr.training_id=t.id and tr.related_type in('combo','setup','sequence')) or t.slug in(select slug from p25_media)) on conflict(training_id) do nothing;

update character_content_packages ccp set rollout_status='complete',notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Text/image-only strategy collection complete. Classic/Modern and reusable beginner media tracked; video playback excluded.'),updated_at=now() from characters c where c.id=ccp.character_id and c.slug in('dee-jay','manon','marisa');
