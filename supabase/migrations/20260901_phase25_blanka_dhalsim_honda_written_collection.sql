-- Text/image-only strategy collection for Blanka, Dhalsim and E. Honda.
-- All community claims remain draft/unverified until current-device capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('ブランカ バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/blanka','official','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'primary','Current patch context.'),
 ('ブランカ コマンドリスト','https://www.streetfighter.com/6/ja-jp/character/blanka/movelist','official','CAPCOM',null::timestamptz,now(),'primary','Official commands.'),
 ('ブランカ基礎コンボ起き攻め','https://note.com/kch_/n/n8bb3b56378a6','community_guide','kch_',null::timestamptz,now(),'community','Written combo and oki routes.'),
 ('ブランカ起き攻めYear3版','https://note.com/genexcheeetaran/n/nc4cd14aa8480','community_guide','チータラ','2025-01-01 00:00:00+00'::timestamptz,now(),'community','Written oki claims; current capture required.'),
 ('ブランカコンボ起き攻め連携','https://note.com/denndenn/n/n13ec9aa7d9d8','community_guide','でんでん',null::timestamptz,now(),'community','Detailed written non-doll/SA2 routes.'),
 ('ブランカSA2人形コンボ','https://note.com/long_quail5230/n/n80d8c1f42f73','community_guide','さくね','2024-11-25 00:00:00+00'::timestamptz,now(),'community','Written SA2 doll routes.'),
 ('クラシックブランカ実戦メモ','https://note.com/nowchinko/n/n96cc98421fee','community_guide','なうち',null::timestamptz,now(),'community','Written Blanka oki and doll usage.'),
 ('Cブランカ完全攻略','https://note.com/nikotarosun/n/n6b33ebe43c74','community_guide','にこ太郎',null::timestamptz,now(),'community','Written Classic doll strategy.'),
 ('モダンブランカ実戦記','https://note.com/tokotokologlog/n/n6f4f5cb7ca90','community_guide','tokotoko',null::timestamptz,now(),'community','Written Modern Blanka experience.'),
 ('モダンブランカ コンボまとめ','https://kamigame.jp/streetfighter6/page/309118534259105537.html','community_guide','神ゲー攻略','2025-12-29 00:00:00+00'::timestamptz,now(),'community','Written Modern routes.'),
 ('ダルシム バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/dhalsim','official','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'primary','Current patch context.'),
 ('ダルシム コマンドリスト','https://www.streetfighter.com/6/ja-jp/character/dhalsim/movelist','official','CAPCOM',null::timestamptz,now(),'primary','Official commands.'),
 ('Cダルシム完全攻略','https://note.com/nikotarosun/n/n4de225c4e4a9','community_guide','にこ太郎',null::timestamptz,now(),'community','Written Classic combos, zoning and oki.'),
 ('ダルシム コンボ起き攻め立ち回り','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A','community_guide','ビーキョウ',null::timestamptz,now(),'community','Written pressure and oki.'),
 ('モダンダルシムのとりこれ','https://note.com/kuwana_fgc/n/ncf7a73b03a7f','community_guide','桑名',null::timestamptz,now(),'community','Written Modern combos.'),
 ('モダンダルシム攻略','https://goziline.com/archives/54059','community_guide','ゴジライン','2023-06-28 00:00:00+00'::timestamptz,now(),'community','Legacy Modern routes; current capture required.'),
 ('モダンダルシム起き攻め','https://gomokugenmai.digick.jp/2025/07/01/%E3%80%90%E3%83%A2%E3%83%80%E3%83%B3%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%E3%81%AE%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E6%8A%80/','community_guide','五目玄米','2025-07-01 00:00:00+00'::timestamptz,now(),'community','Written Modern teleport and float oki.'),
 ('E本田 バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ehonda','official','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'primary','Current patch context.'),
 ('E本田 コマンドリスト','https://www.streetfighter.com/6/ja-jp/character/ehonda/movelist','official','CAPCOM',null::timestamptz,now(),'primary','Official commands.'),
 ('E本田起き攻めコンボ 2026.08','https://note.com/bonmoko_3/n/n8257f7cd418f','community_guide','ぼんもこ','2026-08-01 00:00:00+00'::timestamptz,now(),'community','Current written routes and oki.'),
 ('本田コンボ起き攻めまとめ','https://note.com/denndenn/n/nc96680b2ff78','community_guide','でんでん',null::timestamptz,now(),'community','Detailed written pressure routes.'),
 ('モダン本田コンボまとめ','https://kamigame.jp/streetfighter6/page/349685318493964984.html','community_guide','神ゲー攻略','2026-01-09 00:00:00+00'::timestamptz,now(),'community','Written Modern routes.'),
 ('モダン本田MR2000メモ','https://note.com/namayuki7/n/ndf95c894f805','community_guide','namayuki7',null::timestamptz,now(),'community','Written Modern practical combo and oki.'),
 ('本田マスター使用コンボ','https://note.com/kt_west/n/nc39fdc2248fe','community_guide','KT',null::timestamptz,now(),'community','Written Classic routes and capture candidates.')
 ,('本田備忘録','https://note.com/fgdgdgh/n/n2febe8109954','community_guide','pta',null::timestamptz,now(),'community','Written Honda combos and oki.')
 ,('本田対策・百貫起き攻め','https://slice-of-life.ezguitar-ch.net/sf6-honda-taisaku/','community_guide','EZの日常','2025-07-11 00:00:00+00'::timestamptz,now(),'community','Written Honda meaty butt-slam counterplay used as setup evidence.')
 ,('今夜勝ちたいE本田攻略','https://goziline.com/archives/53149','community_guide','ゴジライン','2023-06-04 00:00:00+00'::timestamptz,now(),'community','Legacy Honda oki; current capture required.')
 ,('今夜勝ちたいモダンE本田攻略','https://goziline.com/archives/53999','community_guide','ゴジライン','2023-06-27 00:00:00+00'::timestamptz,now(),'community','Legacy Modern commands; current capture required.')
 ,('E本田マスター攻略メモ','https://note.com/nanatyuya/n/n22121584dc64','community_guide','nanatyuya',null::timestamptz,now(),'community','Written command-throw strength usage.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p25_combo(cslug text,slug text,name text,typ text,notation text,starter text,pos text,diff int,purpose text,conditions text,src text) on commit drop;
insert into p25_combo values
-- Blanka
('blanka','blanka-light-electric','小技電撃締め','basic','2LP x2 > 5LK > エレクトリックサンダー','2LP','any',2,'小技確認・起き攻め','距離確認','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-mp-electric','中P電撃締め','basic','5MP > 2MP > エレクトリックサンダー','5MP','any',2,'基本確認','現行キャンセル確認','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-dr-low','DR下段強K電撃','drive_rush','DR 2MK > 5HK > 2LP > Lバーチカルローリング','DR 2MK','any',4,'下段択','記事表記強度確認','https://note.com/denndenn/n/n13ec9aa7d9d8'),
('blanka','blanka-dr-overhead','DR中段強K電撃','overhead','DR 6MP > 5HK > 2LP > Lバーチカルローリング','DR 6MP','any',4,'中段択','クラシック限定中段','https://note.com/denndenn/n/n13ec9aa7d9d8'),
('blanka','blanka-5hp-lift','強Pワイルドリフト','basic','5HP > フィアーダウン > ワイルドリフト > Mバーチカルローリング > Mローリング','5HP','any',4,'人形設置移行','高さ確認','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-di-wall','DI壁リフト設置','wall_splat','DI wall splat > 5HP > ワイルドリフト > Hバーチカルローリング > doll setup','DI wall splat','corner',5,'端人形設置','人形強度確認','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-pc-river','リバランPC強P追撃','punish_counter','アマゾンリバーラン(PC) > 5HP > ワイルドリフト > ender','river run PC','any',4,'下段確反','先端時の追撃変更','https://note.com/genexcheeetaran/n/nc4cd14aa8480'),
('blanka','blanka-antiair-hk','強K対空リフト','anti_air','5HK anti-air > 5HP / ワイルドリフト > ender','anti-air 5HK','any',4,'対空高火力','高さ・CH確認','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-doll-loop','人形起爆リフト再設置','doll','normal > サンダー > doll hit > ワイルドリフト > doll setup','doll activation','corner',5,'人形ループ','人形強度・位置確認','https://note.com/long_quail5230/n/n80d8c1f42f73'),
('blanka','blanka-doll-safejump','人形起爆+42詐欺飛び','doll','normal > サンダー > doll hit > Hバックステップローリング > Hバーチカルローリング','doll activation','corner',5,'詐欺飛び','Source +42 claim','https://note.com/long_quail5230/n/n80d8c1f42f73'),
('blanka','blanka-sa2-od-electric','SA2人形OD電撃ループ','super','SA2 active doll > OD電撃 > ワイルドリフト > Hバクロリ > Hバチカ3派生 > doll setup','SA2 doll OD electric','corner',5,'SA2再設置','Source route/current capture','https://note.com/long_quail5230/n/n80d8c1f42f73'),
('blanka','blanka-sa2-od-airball','SA2人形ODエアロリ','super','SA2 active doll > ODエアローリング > ワイルドリフト > Hバクロリ > Hバチカ3派生 > doll setup','SA2 doll OD air ball','corner',5,'SA2崩し追撃','Source 4180 claim','https://note.com/long_quail5230/n/n80d8c1f42f73'),
('blanka','blanka-stun-sa3','端スタン人形SA3','stun','corner stun > doll activation route > SA3','corner stun','corner',5,'スタン最大候補','具体派生は撮影確定','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-modern-assist-l','モダン弱アシスト','modern_only','Assist L x confirm > electric/rolling ender','Modern Assist L','any',2,'モダン小技','現行アシスト内容確認','https://kamigame.jp/streetfighter6/page/309118534259105537.html'),
('blanka','blanka-modern-assist-m','モダン中アシストODロリ','modern_only','Assist M route > ODローリング > Mバチカ > Mローリング','Modern Assist M','any',3,'モダン基本','記事・現行入力確認','https://kamigame.jp/streetfighter6/page/309118534259105537.html'),
('blanka','blanka-modern-di','モダンDI壁追撃','modern_only','DI wall splat > Assist H route > doll/SA ender','DI wall splat','corner',4,'モダン壁反撃','入力は撮影確定','https://kamigame.jp/streetfighter6/page/309118534259105537.html'),
-- Dhalsim
('dhalsim','dhalsim-light-flame','小技ヨガフレイム','basic','2LP x2 > Lヨガフレイム','2LP','any',2,'小技確認','距離確認','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-4mk-flame','涅槃キック強フレイム','basic','4MK > Hヨガフレイム','4MK','any',2,'近距離基本','半回転入力確認','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-4mk-blast','涅槃キック強ブラスト','basic','4MK > Hヨガブラスト','4MK','any',3,'浮かせ・表裏','高さ確認','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-od-flame-slide','ODフレイム強スラ','drive','4MK > ODヨガフレイム > 3HP','4MK','any',3,'Drive追撃','距離確認','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('dhalsim','dhalsim-od-flame-sa1','ODフレイムSA1','super','4MK > ODヨガフレイム > command SA1','4MK','any',4,'SA1火力','簡易/手動差','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('dhalsim','dhalsim-jhp-assist','テレポJ強P中攻撃','teleport','air teleport > j.HP > 4MK > ODヨガフレイム > 3HP','teleport j.HP','any',4,'表裏','高度・表裏確認','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('dhalsim','dhalsim-arch-jmp','アーチ空中ヒット追撃','anti_air','ヨガアーチ air hit > j.MP > air teleport > j.HP > ground follow-up','arch air hit','any',5,'対空設置追撃','アーチ強度・位置確認','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-dr-hk-pc','弾相殺DR強Kパニカン','punish_counter','DR 5HK(PC) > back teleport > 4MK > Hヨガブラスト','DR 5HK PC','any',5,'弾戦差し込み','距離確認','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-di','DI膝崩れODフレイム','punish_counter','DI clean hit > 4MK > ODヨガフレイム > 3HP / SA1','DI punish counter','any',3,'DI反撃','距離・補正確認','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('dhalsim','dhalsim-corner-arch','端涅槃強アーチ','corner','4MK > Hヨガアーチ > pressure/throw','4MK','corner',3,'端攻め継続','Source block +2 claim','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-drill','低空ドリル近距離','air','low drill > 4MK > Hヨガフレイム','low drill','any',4,'空中接近','つま先当て有利確認','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-modern-assist-m','モダン中アシストODフレイム','modern_only','Assist M x2 > ODヨガフレイム > 3H','Modern Assist M','any',2,'モダン基本','主力記事記載','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('dhalsim','dhalsim-modern-sa1','モダン中アシストSA1','modern_only','Assist M x2 > ODヨガフレイム > command SA1','Modern Assist M','any',3,'モダンSA1','手動推奨','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('dhalsim','dhalsim-modern-hk-sa1','モダン強K簡易SA1','modern_only','Assist M x2 > Assist H > one-button SA1','Modern Assist M close','any',4,'簡易SA1','密着限定記事記載','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('dhalsim','dhalsim-modern-di','モダンDI基本','modern_only','DI clean hit > Assist M x2 > ODヨガフレイム > 3H','DI punish counter','any',3,'モダンDI','現行確認','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
-- E. Honda
('e-honda','honda-light-butt','小技百貫締め','basic','2LP x2 > Hスーパー百貫落とし','2LP','any',2,'小技起き攻め','立ちやられ限定候補','https://note.com/namayuki7/n/ndf95c894f805'),
('e-honda','honda-light-headbutt','小技中頭突き','basic','2LK > 2LP x2 > Mスーパー頭突き','2LK','any',2,'しゃがみ対応小技','距離確認','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-mp-cdr-butt','中Pラッシュ大砲百貫','drive_rush','5MP > CDR 5MP > 5HP > 相撲ステップ > 大砲 > H百貫','5MP','any',4,'火力・起き攻め','Source 3000+ claim','https://note.com/namayuki7/n/ndf95c894f805'),
('e-honda','honda-2mp-cdr-butt','しゃがみ中Pラッシュ百貫','drive_rush','2MP > CDR 5MP > 5HP > 相撲ステップ > 大砲 > H百貫','2MP','any',4,'差し返し','現行距離確認','https://note.com/kt_west/n/nc39fdc2248fe'),
('e-honda','honda-jump-hp-butt','飛び込み強P大砲百貫','jump_in','j.HP > 5HP > 相撲ステップ > 大砲 > H百貫','j.HP','any',3,'飛び込み','5HP近距離限定','https://note.com/kt_west/n/nc39fdc2248fe'),
('e-honda','honda-hp-pc','強Pパニカン百貫','punish_counter','5HP(PC) > DR 5HP > 相撲ステップ > 大砲 > H百貫','5HP punish counter','any',5,'無敵反撃','ゲージ確認','https://note.com/kt_west/n/nc39fdc2248fe'),
('e-honda','honda-kabuki','鉄砲一段詐欺飛び','safe_jump','大砲 > DR 5HP > 鉄砲 first hit low > forward j.HK','launcher','any',5,'詐欺飛び','低め当て必須','https://note.com/fgdgdgh/n/n2febe8109954'),
('e-honda','honda-stock-hands','肩屋入り強張り手','stock','2HP > powered H百裂張り手 > 2LP > M頭突き','2HP shoulder buff','any',4,'肩屋入り火力','強化状態必須','https://note.com/kt_west/n/nc39fdc2248fe'),
('e-honda','honda-di-wall','DI壁強張り手OD百貫','wall_splat','DI wall splat > 5HP > H百裂張り手 > OD百貫 / SA1','DI wall splat','corner',4,'壁反撃','約3000記事主張','https://note.com/fgdgdgh/n/n2febe8109954'),
('e-honda','honda-dr-mp-y4','DR中P持続大砲百貫','drive_rush','DR 5MP(meaty) > 5HP > 大砲 > H百貫','DR 5MP','any',4,'現行主力','Source +8 block/+13 hit claim','https://note.com/denndenn/n/nc96680b2ff78'),
('e-honda','honda-stun-sa3','端スタンSA3','stun','corner stun > 5HP > 大砲 > optimized route > SA3','corner stun','corner',5,'スタン最大候補','詳細撮影確定','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-modern-mp','モダン中攻撃ラッシュ百貫','modern_only','M > CDR M > H > 大砲 > H百貫','Modern M','any',4,'モダン主力','Source 3093 claim','https://kamigame.jp/streetfighter6/page/349685318493964984.html'),
('e-honda','honda-modern-light','モダン小技百貫','modern_only','2L x2 > manual H百貫','Modern 2L','any',2,'モダン小技','立ちやられ確認','https://note.com/namayuki7/n/ndf95c894f805'),
('e-honda','honda-modern-tc','モダンTC鉄砲詐欺飛び','modern_only','L > target combo > 鉄砲 first hit > forward jump attack','Modern L','any',4,'モダン詐欺飛び','ボタン割当確認','https://note.com/namayuki7/n/ndf95c894f805'),
('e-honda','honda-modern-di','モダンDI壁追撃','modern_only','DI wall splat > Assist H route > OD百貫 / SA1','DI wall splat','corner',4,'モダン壁反撃','現行入力確認','https://kamigame.jp/streetfighter6/page/349685318493964984.html');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.typ,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,'Written/image-confirmed; no video playback. Current capture required.',p.id,'unverified',case when r.typ='modern_only' then 'modern_only' else 'strategy' end,'draft' from p25_combo r join characters c on c.slug=r.cslug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Written/image claim; current capture required.' from p25_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25_setup(cslug text,slug text,name text,typ text,starter text,seq text,adv text,pos text,descr text,src text) on commit drop;
insert into p25_setup values
('blanka','blanka-oki-forward-throw','前投げ中央サプフォ','throw_oki','forward throw +30','サプライズフォワード > 5LK / walk throw / guard','+3 claim','mid','後方受け身投げ間合い外','https://note.com/denndenn/n/n13ec9aa7d9d8'),
('blanka','blanka-oki-forward-dr-high','前投げDR中段','throw_oki','forward throw','DR 6MP > 5HK > confirm','+1/+2 block claim','mid','中段択','https://note.com/denndenn/n/n13ec9aa7d9d8'),
('blanka','blanka-oki-forward-dr-low','前投げDR下段','throw_oki','forward throw','delayed DR 2MK > 5HK > confirm','unknown','mid','中段対の下段','https://note.com/denndenn/n/n13ec9aa7d9d8'),
('blanka','blanka-oki-corner-throw','端前投げ持続4MK','throw_oki','corner forward throw','dash > 4MK / walk throw / shimmy','+11 before action claim','corner','柔道・持続重ね','https://note.com/nowchinko/n/n96cc98421fee'),
('blanka','blanka-oki-electric','電撃後起き攻め','oki','electric hit','サプライズフォワード / dash x2 > 5LK / throw','unknown','any','中央攻め継続','https://note.com/nowchinko/n/n96cc98421fee'),
('blanka','blanka-oki-lift-doll','リフト後人形設置','doll','wild lift ender','doll placement > electric activation > strike/throw','unknown','corner','人形基本','https://note.com/long_quail5230/n/n80d8c1f42f73'),
('blanka','blanka-oki-doll-walk','人形追走攻め','doll','active doll','walk with doll > throw / shimmy / anti-air j.HP','projectile cover','mid','人形を盾に接近','https://note.com/nikotarosun/n/n6b33ebe43c74'),
('blanka','blanka-oki-river-dash','リバラン前ステ重ね','oki','river run hit','dash > 4MK / 5HK / 5HP / 6MK if far','+30 to +36 claim','any','距離別重ね','https://note.com/genexcheeetaran/n/nc4cd14aa8480'),
('blanka','blanka-oki-sa2','SA2ローリング分岐','super_setup','SA2 active','rolling route > stop/strike/command throw/doll','timer dependent','any','SA2固有セットプレイ','https://note.com/long_quail5230/n/n80d8c1f42f73'),
('blanka','blanka-oki-modern-forward','モダン前投げ起き攻め','modern_oki','Modern forward throw','サプフォ > Assist L / throw / guard','+3 claim','mid','中段欠落を考慮','https://note.com/tokotokologlog/n/n6f4f5cb7ca90'),
('dhalsim','dhalsim-oki-forward-dr-slide','前投げDR中スラ','throw_oki','forward throw','DR 2MK meaty > throw / 4MK','advantage claim','any','持続スラ','https://goziline.com/archives/54059'),
('dhalsim','dhalsim-oki-corner-throw','端前投げ弱P柔道','throw_oki','corner forward throw','2LP > forward throw / strike','unknown','corner','端投げ継続','https://goziline.com/archives/54059'),
('dhalsim','dhalsim-oki-blast-teleport','ブラスト後裏テレポ','teleport','4MK > Hヨガブラスト','air forward teleport > j.LK > 5LP','cross-up claim','mid','表裏・入力方向確認','https://goziline.com/archives/54059'),
('dhalsim','dhalsim-oki-odfire-teleport','ODファイア後裏テレポ','teleport','ODヨガファイア hit','air forward teleport > j.LK > 5LP','cross-up claim','mid','裏回り起き攻め','https://goziline.com/archives/54059'),
('dhalsim','dhalsim-oki-flame-teleport','強フレイム後テレポ','teleport','Hヨガフレイム hit','air teleport > j.LK / j.HP / empty throw','unknown','mid','表裏三択','https://gomokugenmai.digick.jp/2025/07/01/%E3%80%90%E3%83%A2%E3%83%80%E3%83%B3%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%E3%81%AE%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E6%8A%80/'),
('dhalsim','dhalsim-oki-arch-walk','アーチ追走投げ','fireball','M/Hヨガアーチ','walk/DR > long normal / slide / throw / anti-air','projectile cover','mid','設置弾追走','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-oki-drill','ドリル有利攻め','spacing','low drill block','4MK / throw / backwalk','spacing dependent','any','足元当て限定','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-float','浮遊J強P攻め','float','yoga float','j.HP/j.HK > throw / 4MK','height dependent','any','高度別有利確認','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-modern-teleport','モダン裏テレポ起き攻め','modern_oki','Modern flame/fire ender','air teleport > j.L > Assist M route / throw','unknown','mid','モダン入力確認','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('e-honda','honda-oki-butt','百貫後三択','oki','H百貫 hit','2LP frame kill > 5MP / throw / 大銀杏 / guard','unknown','any','本田の基本起き攻め','https://note.com/kt_west/n/nc39fdc2248fe'),
('e-honda','honda-oki-butt-meaty','百貫後中P持続','meaty','H百貫 hit','2LP whiff > 5MP meaty','+ block claim','any','打撃継続','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-butt-command','百貫後大銀杏','command_throw','H百貫 hit','2LP whiff > H/OD大銀杏投げ','throw range dependent','any','打撃対のコマ投げ','https://note.com/kt_west/n/nc39fdc2248fe'),
('e-honda','honda-oki-butt-drop','百貫後百貫重ね','meaty','H百貫 hit','2LP whiff / overhead kara > 百貫','unknown','any','無敵技スカし候補','https://slice-of-life.ezguitar-ch.net/sf6-honda-taisaku/'),
('e-honda','honda-oki-headbutt-dr','頭突き後DR中P','oki','M/H headbutt hit','DR 5MP > TC / command throw / shimmy','unknown','any','中央攻め継続','https://note.com/fgdgdgh/n/n2febe8109954'),
('e-honda','honda-oki-dr-mp','DR中P持続攻め','meaty','knockdown','DR 5MP > 5HP~H頭突き / throw / command throw / shimmy','+8 block claim','any','Dリバ詐欺主張','https://note.com/denndenn/n/nc96680b2ff78'),
('e-honda','honda-oki-iron-safejump','鉄砲一段詐欺飛び','safe_jump','low first-hit 鉄砲','forward j.HK > strike/empty throw','safe-jump claim','any','鉄砲高さ依存','https://note.com/fgdgdgh/n/n2febe8109954'),
('e-honda','honda-oki-corner-mp','端中P持続重ね','meaty','corner knockdown','meaty 5MP > OD大銀杏 / TC','up to +4 claim','corner','通常投げ距離外候補','https://goziline.com/archives/53149'),
('e-honda','honda-oki-corner-overhead','端中段持続重ね','meaty','corner knockdown','meaty 3HK > strike/throw','+2 claim','corner','モダン欠落技','https://goziline.com/archives/53149'),
('e-honda','honda-oki-modern-butt','モダン百貫後三択','modern_oki','Modern H百貫 hit','2L whiff > M / normal throw / command throw','unknown','any','中段欠落を考慮','https://note.com/namayuki7/n/ndf95c894f805');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.typ,r.starter,r.seq,r.adv,r.pos,r.descr,'Verify rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',p.id,'unverified',case when r.typ like 'modern%' then 'modern_only' else 'strategy' end,'draft' from p25_setup r join characters c on c.slug=r.cslug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Written/image claim; current capture required.' from p25_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25_seq(cslug text,slug text,name text,seq text,notes text,src text) on commit drop;
insert into p25_seq values
('blanka','blanka-seq-doll-rps','人形起爆読み合い','active doll > strike / throw / shimmy / anti-air / restand','人形強度と位置を記録。','https://note.com/long_quail5230/n/n80d8c1f42f73'),
('blanka','blanka-seq-sa2-tree','SA2ローリング分岐','SA2 > rolling direction/strength > stop / follow-up / doll','タイマーと派生数を記録。','https://note.com/long_quail5230/n/n80d8c1f42f73'),
('blanka','blanka-seq-forward-throw','中央前投げ分岐','forward throw > DR overhead / DR low / surprise forward strike-throw','中段はクラシック限定。','https://note.com/denndenn/n/n13ec9aa7d9d8'),
('blanka','blanka-seq-ball-spacing','ローリング間合い読み','rolling block/hit > punish spacing / retreat / surprise forward','確反距離をキャラ別確認。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-seq-command-throw','ワイルドハント択','advantage > strike / walk throw / command throw / bait','ジャンプとバクステを分離。','https://note.com/denndenn/n/n13ec9aa7d9d8'),
('blanka','blanka-seq-modern-resource','モダン資源選択','Assist confirm > no-meter oki / OD carry / SA2 doll / SA3 kill','簡易入力補正を確認。','https://kamigame.jp/streetfighter6/page/309118534259105537.html'),
('dhalsim','dhalsim-seq-fire-teleport','弾テレポ表裏','fire/arch > front/back air teleport > j.LK/j.HP/empty throw','弾到達とテレポ硬直を確認。','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-seq-zoning','遠距離弾通常技分岐','L fire > long normal / DR slide / anti-air / throw on parry','相手の飛び・パリィ・前進で分岐。','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-seq-arch-control','アーチ制圧','M/H arch > anti-air / teleport offense / retreat','アーチ強度と相手位置を記録。','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-seq-drill-rps','ドリル着地読み','low drill > throw / 4MK / backwalk / block','当てる高さで有利不利が変化。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-seq-corner-escape','端脱出テレポ','defense > jump teleport / OD arch teleport / D-reversal','相手の対空とテレポ狩りを確認。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-seq-modern-input','モダン簡易手動選択','Assist M > manual SA1/slide/auto SA based on range','簡易補正と距離を確認。','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('e-honda','honda-seq-butt-rps','百貫後三択','butt slam knockdown > meaty 5MP / normal throw / 大銀杏 / butt slam','ジャンプ、遅らせジャンプ、無敵を分離。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-seq-dr-mp','DR中Pガード分岐','DR 5MP > 5HP headbutt / 5MP chain / low / throw / command throw / shimmy','連ガと隙間を区別。','https://note.com/denndenn/n/nc96680b2ff78'),
('e-honda','honda-seq-headbutt','頭突き後攻め継続','headbutt hit > shoulder buff or DR 5MP strike-throw','位置とゲージで選択。','https://note.com/fgdgdgh/n/n2febe8109954'),
('e-honda','honda-seq-hands-stock','肩屋入り管理','knockdown > shoulder buff > powered hands combo or oki','強化状態消費条件を確認。','https://www.streetfighter.com/6/ja-jp/character/ehonda/movelist'),
('e-honda','honda-seq-command-throw','大銀杏強度選択','advantage > L/OD range or H damage > strike bait','強度別間合いと失敗硬直。','https://note.com/nanatyuya/n/n22121584dc64'),
('e-honda','honda-seq-modern-charge','モダン溜め簡易入力','hold back/down > one-button headbutt / manual fast version / butt slam','溜め成立と手動強度差を表示。','https://goziline.com/archives/53999');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,false,'4F check','throw branch','backwalk branch','jump check','parry check','D-reversal check','invincible check',r.notes,p.id,'unverified',case when r.slug like '%modern%' then 'modern_only' else 'strategy' end,'draft' from p25_seq r join characters c on c.slug=r.cslug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Written/image claim; current capture required.' from p25_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;

-- Verification training for every active strategy item in all three packages.
with cs as(select id,slug,name_ja from characters where slug in('blanka','dhalsim','e-honda')),p as(select id from patches where is_current=true order by released_at desc limit 1),e as(
 select c.slug cslug,c.name_ja cname,'combo' typ,x.id,x.slug,x.name,x.notation method from cs c join combos x on x.character_id=c.id and x.status<>'archived'
 union all select c.slug,c.name_ja,'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text from cs c join setups x on x.character_id=c.id and x.status<>'archived'
 union all select c.slug,c.name_ja,'sequence',x.id,x.slug,x.name,x.sequence_text from cs c join sequences x on x.character_id=c.id and x.status<>'archived')
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【'||e.cname||'撮影待ち】'||e.name,case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,'文章・画像から収集した攻略を現行版で確定する。','advanced',15,c.id,'入力履歴・フレーム・ダメージ・Drive/SA・固有資源表示。操作方式、位置、受け身を指定。','4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,'左右各10回で成立、数値、位置、受け身、キャラ条件を記録。',20,'成立ならverified候補。不成立ならarchived。',p.id,'unverified','strategy','draft' from e join cs c on c.slug=e.cslug cross join p where not exists(select 1 from trainings t where t.slug='training-'||e.slug) on conflict(slug) do nothing;
insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(select 'combo' typ,id,slug from combos where character_id in(select id from characters where slug in('blanka','dhalsim','e-honda')) and status<>'archived' union all select 'setup',id,slug from setups where character_id in(select id from characters where slug in('blanka','dhalsim','e-honda')) and status<>'archived' union all select 'sequence',id,slug from sequences where character_id in(select id from characters where slug in('blanka','dhalsim','e-honda')) and status<>'archived')e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related strategy.' from trainings t join training_relations tr on tr.training_id=t.id join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id where t.player_character_id in(select id from characters where slug in('blanka','dhalsim','e-honda')) on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25_media(cslug text,slug text,name text,method text,src text) on commit drop;
insert into p25_media values
('blanka','blanka-media-charge','【初心者素材】ローリング溜め入力','後ろ溜め時間、ニュートラル復帰、簡易入力を成功失敗で撮影。','https://www.streetfighter.com/6/ja-jp/character/blanka/movelist'),
('blanka','blanka-media-doll','【初心者素材】人形設置と起爆','弱中強設置位置、電撃起爆、残数を短尺比較。','https://www.streetfighter.com/6/ja-jp/character/blanka/movelist'),
('blanka','blanka-media-sa2','【初心者素材】SA2ローリング派生','SA2中の強度・方向・派生とタイマーを表示。','https://www.streetfighter.com/6/ja-jp/character/blanka/movelist'),
('dhalsim','dhalsim-media-flame-input','【初心者素材】ヨガフレイム半回転入力','ゆっくり正確な半回転、先行入力、失敗例を表示。','https://www.streetfighter.com/6/ja-jp/character/dhalsim/movelist'),
('dhalsim','dhalsim-media-teleport','【初心者素材】テレポート方向','地上・空中、前後、表裏の入力方向を個別撮影。','https://www.streetfighter.com/6/ja-jp/character/dhalsim/movelist'),
('dhalsim','dhalsim-media-float-drill','【初心者素材】浮遊とドリル高度','浮遊高度、ドリル足元当て、失敗高度を比較。','https://www.streetfighter.com/6/ja-jp/character/dhalsim/movelist'),
('e-honda','honda-media-charge','【初心者素材】頭突き下溜め入力','後ろ溜めと下溜め、歩き・しゃがみ・ガード中の保持を表示。','https://www.streetfighter.com/6/ja-jp/character/ehonda/movelist'),
('e-honda','honda-media-butt','【初心者素材】百貫の強度と位置','弱中強・OD百貫の上昇位置、落下位置、表裏を比較。','https://www.streetfighter.com/6/ja-jp/character/ehonda/movelist'),
('e-honda','honda-media-stock','【初心者素材】肩屋入りと強化張り手','強化前後の張り手、消費、追撃可否を比較。','https://www.streetfighter.com/6/ja-jp/character/ehonda/movelist');
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select r.slug,r.name,'instructional_media','初心者ページとキャラページで再利用する。','beginner',10,c.id,'720p60fps以上。入力履歴・フレーム・固有資源表示ON。','必要な動作だけ個別再生。','CPU OFF。',r.method,'入力と結果が短尺で判別できる。',5,'短尺ループと説明クリップへ分割。',p.id,'unverified','training','draft' from p25_media r join characters c on c.slug=r.cslug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Official command reference.' from p25_media r join trainings t on t.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.training_type='instructional_media' then 10 when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,case when t.training_type='instructional_media' then '初心者ページ兼キャラページ用の短尺素材。' else '現行成立、入力、数値、位置、受け身、固有資源、キャラ条件を確認。' end from trainings t where t.player_character_id in(select id from characters where slug in('blanka','dhalsim','e-honda')) and (exists(select 1 from training_relations tr where tr.training_id=t.id and tr.related_type in('combo','setup','sequence')) or t.slug in(select slug from p25_media)) on conflict(training_id) do nothing;

update character_content_packages ccp set rollout_status='complete',notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Text/image-only strategy collection complete. Classic/Modern and reusable beginner media tracked; video playback excluded.'),updated_at=now() from characters c where c.id=ccp.character_id and c.slug in('blanka','dhalsim','e-honda');
