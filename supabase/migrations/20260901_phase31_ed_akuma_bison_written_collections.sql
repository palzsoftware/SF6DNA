-- Ed, Akuma and M. Bison written/image-only strategy collections.
-- 2026-08-03 patch baseline. All community claims remain draft/unverified.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
 ('ED バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ed','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current Ed patch baseline.'),
 ('エド最低限使い方メモ','https://note.com/kch_/n/nfa8e04b21d20','community_guide','kch_',null::timestamptz,now(),'community','Written combo, Flicker and Kill Step oki claims.'),
 ('2000MRエド攻略','https://note.com/nikotarosun/n/n99fbf1d58191','community_guide','にこ太郎',null::timestamptz,now(),'community','Written practical routes, SA2 and pressure.'),
 ('エド起き攻め打撃択 前編','https://note.com/daigoro_pso2/n/ned4ab96caff9','community_guide','大五郎',null::timestamptz,now(),'community','Written meaty frame and defensive interaction table.'),
 ('エド起き攻め打撃択 後編','https://note.com/daigoro_pso2/n/n0068ee747d32','community_guide','大五郎',null::timestamptz,now(),'community','Written +42 route families.'),
 ('Mエド攻略 SA2セットプレイ','https://note.com/nikotarosun/n/n65ed70bb4ad7','community_guide','にこ太郎',null::timestamptz,now(),'community','Modern routes and SA2 sets.'),
 ('モダンエド簡単コンボと起き攻め','https://note.com/denndenn/n/n3880e5e71ef1','community_guide','でんのすけ','2024-05-28 00:00:00+00'::timestamptz,now(),'community','Written Modern punish, SA2 and safe-jump routes.'),
 ('AKUMA バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/gouki_akuma','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current Akuma patch baseline.'),
 ('豪鬼コンボと起き攻めまとめ','https://note.com/lilililily/n/nee3ea8cec5fc','community_guide','ろきそ',null::timestamptz,now(),'community','Written Classic combo and meaty branches.'),
 ('豪鬼使い方セットプレイ','https://note.com/kch_/n/n965d5daa6103','community_guide','kch_',null::timestamptz,now(),'community','Written Demon Raid and rush route families.'),
 ('豪鬼コンボ 2026年1月','https://note.com/quirky_chimp9568/n/n9473b9d60c12','community_guide','焼鳥','2026-01-15 00:00:00+00'::timestamptz,now(),'community','Current-year written Classic routes.'),
 ('豪鬼攻略 2026年8月更新','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/','community_guide','もみあげリョウ','2026-08-05 00:00:00+00'::timestamptz,now(),'community','Current-patch beginner through corner plan.'),
 ('モダン豪鬼コンボ','https://kamigame.jp/streetfighter6/page/317199723331067429.html','community_guide','神ゲー攻略','2025-06-07 00:00:00+00'::timestamptz,now(),'community','Modern assist and resource routes.'),
 ('M豪鬼完全攻略2026','https://note.com/nikotarosun/n/n3675cb3bdf9b','community_guide','にこ太郎',null::timestamptz,now(),'community','Modern 2026 routes and oki claims.'),
 ('VEGA バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/vega_mbison','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current M. Bison patch baseline.'),
 ('ベガ様コンボ編 2026追記','https://note.com/bonmoko_3/n/nedc754b80241','community_guide','bonmoko','2026-01-28 00:00:00+00'::timestamptz,now(),'community','Written mine enders and meaty setups.'),
 ('ベガセットプレイまとめ','https://note.com/rokujokazuma/n/nec7bb5fffcf1','community_guide','六畳一間',null::timestamptz,now(),'community','Written mine pressure and Nozaki route.'),
 ('ベガコンボ起き攻め集','https://note.com/991357/m/md7d3e6e41597','community_guide','サム',null::timestamptz,now(),'community','Written weak/medium/heavy mine and throw sets.'),
 ('ベガコンボ起き攻めまとめ','https://note.com/dos236236/n/n7f6658e1fefe','community_guide','ドス',null::timestamptz,now(),'community','Written starter and resource routes.'),
 ('モダンベガ基礎コンボ','https://sorehododemonai-gamer-a.hatenablog.com/entry/2025/08/16/165946','community_guide','それ程でもないゲーマー','2025-08-16 00:00:00+00'::timestamptz,now(),'community','Year3 Modern commands and routes.'),
 ('モダンベガ評価2026','https://kamigame.jp/streetfighter6/page/322662586657036042.html','community_guide','神ゲー攻略','2026-06-20 00:00:00+00'::timestamptz,now(),'community','Recent Modern pressure and mine overview.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p31_combo(char_slug text,slug text,name text,cat text,notation text,starter text,pos text,diff int,purpose text,conditions text,ck text,src text) on commit drop;
create temporary table p31_setup(char_slug text,slug text,name text,starter text,seq text,adv text,pos text,descr text,ck text,src text) on commit drop;
create temporary table p31_seq(char_slug text,slug text,name text,seq text,notes text,ck text,src text) on commit drop;

insert into p31_combo values
('ed','ed-y4-2lp-5lp-mblitz','小P中ブリッツ','light','2LP > 5LP > M Psycho Blitz','2LP','any',2,'小技基本','距離で5LP追加。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-lights-mblitz','小P3回中ブリッツ','light','5LP x3 > M Psycho Blitz','5LP','any',2,'小技確認','キルステ+8候補。','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-2lk-mupper','小足中アッパー','light','2LK > 5LP > M Psycho Upper','2LK','any',2,'下段基本','立ち／しゃがみ距離。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-5mk-target','立中Kタゲコン','medium','5MK > 5MK > 5HP target','5MK','any',2,'中距離基本','記事記載+35。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-2mk-target-hblitz','屈中KTC強ブリッツ','medium','2MK > 5MP > 5HP target > H Psycho Blitz','2MK','any',3,'中技起き攻め','+42候補。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-5mp-killbreak-mupper','中Pキルブレイク','medium','5MP > 5HP > Kill Step~Break > M Psycho Upper','5MP','any',4,'中技火力','目押し。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-2mp-hblitz','屈中P強ブリッツ','medium','2MP > H Psycho Blitz','2MP','any',2,'中P基本','距離確認。','strategy','https://note.com/elleair104/n/n80787a22aae0'),
('ed','ed-y4-2mp-cdr-target','屈中PラッシュTC','drive','2MP > CDR 5HP > 5MP~5HP > H Blitz','2MP','any',4,'中技Drive','Drive3。','strategy','https://note.com/elleair104/n/n80787a22aae0'),
('ed','ed-y4-5hp-lflicker','強P弱フリッカー','heavy','5HP > L Psycho Flicker','5HP','any',2,'安全締め','連続ガード距離も確認。','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-5hp-odflicker-lupper-hblitz','強P OD紐強ブリッツ','drive','5HP > OD Flicker > L Psycho Upper > H Psycho Blitz','5HP','any',4,'主力Drive','Drive2。+41候補。','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-5hp-killchase-hblitz','強Pキルチェイス強ブリッツ','heavy','5HP > Kill Step~Chase > H Psycho Blitz','5HP','any',5,'ノーゲージ火力','チェイス目押し。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-5hk-mp-hp-hblitz','強K中P強ブリッツ','heavy','5HK > 5MP > 5HP > H Psycho Blitz','5HK','any',3,'強K確認','+42候補。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-2hk-odblitz-sa2','大足ODブリッツSA2','sa','2HK > OD Psycho Blitz > SA2 route','2HK','any',5,'長距離SA2','始動補正と距離。','strategy','https://note.com/babapiero/n/nee9bbc650b3d'),
('ed','ed-y4-dr-lp-mp-hblitz','ラッシュ小P中P強ブリッツ','drive','DR 5LP > 5MP > 5HP > H Blitz','DR 5LP','any',3,'生ラ基本','Drive1。','strategy','https://note.com/babapiero/n/nee9bbc650b3d'),
('ed','ed-y4-2mk-ch-hp','屈中K CH強P','counter','2MK(CH) > 5HP > OD Flicker/H Blitz','2MK counter','any',4,'カウンター確認','立ち強K派生も確認。','strategy','https://note.com/babapiero/n/nee9bbc650b3d'),
('ed','ed-y4-flicker-pc-dr-medium','フリッカーPCラッシュ','punish','M Flicker(PC) > DR 5MP > Kill Step~Chase > H Blitz','Flicker punish counter','any',5,'紐PC運び','距離と強度。','strategy','https://note.com/kind_daphne909/n/nee65b46bc501'),
('ed','ed-y4-flicker-pc-assisth-sa1','フリッカーPC SA1','sa','M Flicker(PC) > 5HP > OD Flicker > Kill Chase > SA1','Flicker punish counter','any',5,'効率SA1','Drive2+SA1。','strategy','https://note.com/kind_daphne909/n/nee65b46bc501'),
('ed','ed-y4-di-target-hblitz','中央DI強ブリッツ','impact','DI(PC) > 5HP > 5MP~5HP > H Blitz','DI punish counter','midscreen',4,'中央DI','距離確認。','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-wall-odflicker-hflicker','端DI OD紐','impact','DI wall splat > 5HP > OD Flicker > H Flicker > L Upper > L Blitz','DI wall splat','corner',5,'端DI','高度別締め。','strategy','https://tatsujin.blog/sf6/characters/ed/ed-basic-combo/'),
('ed','ed-y4-corner-odflicker-mupper','端OD紐詐欺飛び','corner','5HP > OD Flicker > H Flicker > M Psycho Upper','5HP','corner',5,'端詐欺飛び','強紐距離で追撃変更。','strategy','https://tatsujin.blog/sf6/characters/ed/ed-basic-combo/'),
('ed','ed-y4-aa-lupper-hblitz','弱アッパー対空追撃','anti_air','L Psycho Upper high hit > H Psycho Blitz','opponent jump','any',4,'対空追撃','高さ依存。','strategy','https://www.sukoreru.com/sf6-ed'),
('ed','ed-y4-aa-5hk-flicker','強K対空フリッカー','anti_air','5HK anti-air > Flicker/DR follow-up','opponent jump','any',4,'遠対空','距離依存。','strategy','https://www.sukoreru.com/sf6-ed'),
('ed','ed-y4-air-mp-target','空対空中P追撃','anti_air','j.MP > follow-up / landing pressure','air-to-air','any',3,'空対空','高さと着地。','strategy','https://note.com/babapiero/n/nee9bbc650b3d'),
('ed','ed-y4-sa2-central','中央SA2基礎','sa','OD Blitz > SA2 > H Upper > 6HP > H Upper','OD Blitz hit','midscreen',5,'中央SA2','球の当て方と+42。','strategy','https://note.com/denndenn/n/n3880e5e71ef1'),
('ed','ed-y4-sa2-corner','端SA2基礎','sa','OD Blitz(early cancel) > SA2 > 6HP > L Upper > M Blitz','OD Blitz hit','corner',5,'端SA2','キャンセル段数。','strategy','https://note.com/denndenn/n/n3880e5e71ef1'),
('ed','ed-y4-sa2-flicker-rehit','SA2紐再接触','sa','OD Blitz > SA2 > H Upper > dash > charged H Flicker > Kill Break > H Upper','OD Blitz hit','any',5,'SA2高火力','球の再ヒット。','strategy','https://www.syogepixiv.work/2024/04/02/%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6-%E6%94%BB%E7%95%A5-%E7%AC%AC5%E5%9B%9E%E3%82%A8%E3%83%89-%E5%9F%BA%E7%A4%8E%E3%82%B3%E3%83%B3%E3%83%9C/'),
('ed','ed-y4-punish-pc-sa2','無敵反撃SA2','punish','5HP(PC) > OD Blitz > SA2 > H Upper > 6HP > M Upper','blocked invincible move','any',5,'無敵反撃SA2','位置別。','strategy','https://note.com/denndenn/n/n3880e5e71ef1'),
('ed','ed-y4-punish-double-cdr-sa3','無敵反撃SA3最大','punish','5HP(PC) > CDR 5HP > CDR 5HP > target > H Blitz > SA3','blocked invincible move','any',5,'Drive6 SA3','補正と端距離。','strategy','https://note.com/denndenn/n/n3880e5e71ef1'),
('ed','ed-y4-stun-sa2','スタンSA2','stun','stun > j.HP > 5HP > OD Blitz > SA2 route','opponent stun','corner',5,'スタン最大','Drive/SA別。','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-drev-punish','Dリバ反撃','punish','blocked Drive Reversal > 5MP/5HP > H Blitz','Drive Reversal punish','any',3,'Dリバ確反','PC状態。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-modern-assistl','M弱アシスト中ブリッツ','assist','Assist L > M Psycho Blitz','Modern Assist L','any',1,'モダン小技','自動停止。','modern_only','https://note.com/nikotarosun/n/n65ed70bb4ad7'),
('ed','ed-y4-modern-assistm','M中アシスト強ブリッツ','assist','Assist M > H Psycho Blitz/SA','Modern Assist M','any',2,'モダン中技','ゲージ分岐。','modern_only','https://note.com/nikotarosun/n/n65ed70bb4ad7'),
('ed','ed-y4-modern-assisth','M強アシスト起き攻め','assist','Assist H route > Kill Step oki','Modern Assist H','any',2,'モダン強技','安全飛び候補。','modern_only','https://note.com/denndenn/n/n3880e5e71ef1'),
('ed','ed-y4-modern-2m-cdr','M中攻撃ラッシュ','drive','2M > CDR > Assist H > H Blitz','Modern 2M','any',3,'モダンDrive','Drive3。','modern_only','https://note.com/nikotarosun/n/n65ed70bb4ad7'),
('ed','ed-y4-modern-flicker-pc','M紐PC運び','punish','one-button Flicker(PC) > DR M > Kill Chase > H Blitz','Modern Flicker PC','any',4,'モダン紐PC','簡易補正。','modern_only','https://note.com/kind_daphne909/n/nee65b46bc501'),
('ed','ed-y4-modern-sa2-central','M中央SA2','sa','Assist H/OD Blitz > one-button SA2 > H Upper > 6H > M Upper','Modern SA2','midscreen',5,'モダンSA2','簡易／手動SA2差。','modern_only','https://note.com/denndenn/n/n3880e5e71ef1'),
('ed','ed-y4-modern-sa2-corner','M端SA2','sa','OD Blitz > SA2 > 6H > L Upper > M Blitz','Modern SA2','corner',5,'モダン端SA2','位置。','modern_only','https://note.com/denndenn/n/n3880e5e71ef1'),
('ed','ed-y4-modern-onebutton-aa','Mワンボタン対空','anti_air','one-button L Psycho Upper > high-hit follow-up','opponent jump','any',2,'モダン対空','早出し高度。','modern_only','https://www.sukoreru.com/sf6-ed'),
('ed','ed-y4-modern-di','M中央DI','impact','DI(PC) > Assist H > H Blitz/SA3','DI punish counter','any',3,'モダンDI','自動SA分岐。','modern_only','https://note.com/denndenn/n/n3880e5e71ef1');

insert into p31_setup values
('ed','ed-y4-mblitz-kill8','中ブリッツ後+8','M Psycho Blitz','immediate Kill Step > 5HP / walk throw / shimmy','Source +8','any','投げは微歩き。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-hblitz-kill11','強ブリッツ後+11','H Psycho Blitz route','Kill Step > 5HP(meaty) > 5MP on hit','Source +11','any','強Pループ。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-killchase-kill9','キルチェイス後+9','Kill Chase > H Blitz','Kill Step > 2MK/5HP / throw / shimmy','Source +9','any','屈中K最速空振れ注意。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-odflicker-kill10','OD紐後+10','OD Flicker > L Upper > H Blitz','Kill Step > 2MK / throw / shimmy','Source +10','any','距離。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-plus42-hp','+42キルステ強P持続','combo end +42','Kill Step > 5HP(meaty) > 5MP','Hit +7 / guard 0 claim','midscreen','強制立ち。','strategy','https://note.com/denndenn/n/n394ad03c26cd'),
('ed','ed-y4-plus42-safejump','+42詐欺飛び','combo end +42','forward jump attack / empty jump throw','5F safe-jump claim','corner','リリー風4F等例外確認。','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-plus41-safejump','+41詐欺飛び','combo end +41','forward jump attack / empty jump','6F safe-jump claim','any','無敵発生別。','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-plus42-spark','+42サイコスパーク持続','close +42 knockdown','dash > Psycho Spark(meaty) > shoot/strike/throw','Position-specific','corner','中央遠距離不可。','strategy','https://note.com/denndenn/n/n394ad03c26cd'),
('ed','ed-y4-meaty-2mk','屈中K持続重ね','specified knockdown','2MK(meaty) > 2MK / 5HP(CH)','Hit +9 / guard 0 claim','any','Dリバ詐欺候補。','strategy','https://note.com/daigoro_pso2/n/ned4ab96caff9'),
('ed','ed-y4-charged-flicker-plus4','溜めフリッカー+4','charged Flicker guard','throw / 5MP / 2LP / backstep shimmy','Source +4','any','密着読み合い。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-odflicker-plus4','ODフリッカー+4','OD Flicker guard','throw / 5MP / 2LP / backstep','Source +4','any','弾抜けとガード時。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-flicker-feint','フリッカーフェイント','Flicker charge','release / feint > whiff punish / DI return / block','Mindgame','any','溜め中断と反応。','strategy','https://note.com/babapiero/n/nee9bbc650b3d'),
('ed','ed-y4-corner-throw','端前投げ択','corner forward throw','walk throw / 5MP / shimmy','Manual timing','corner','柔道可否。','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-sa2-ball-pressure','SA2球固め','SA2 active','walk/DR behind ball > strike / throw / shimmy / Flicker','Projectile cover','any','連ガ・割込みを分離。','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-sa2-corner-loop','端SA2セットプレイ','corner SA2 route','ball rehit > meaty 5HP / throw / safe jump','Position-specific','corner','球接触回数。','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-spark-shoot-walk','弾追い接近','Psycho Spark > L Shoot','walk behind projectile > 5MK/Flicker/throw','Projectile cover','midscreen','飛びとOD弾回答。','strategy','https://note.com/babapiero/n/nee9bbc650b3d'),
('ed','ed-y4-killstep-throw-shimmy','キルステ打撃投げ','knockdown +8~11','Kill Step > 5HP / micro-walk throw / backstep shimmy','Variable','any','有利F別。','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-modern-assisth-oki','M強アシスト後起き攻め','Modern Assist H ender','Kill Step > Assist H/L / throw / shimmy','Route-specific','any','自動ヒット確認。','modern_only','https://note.com/buredon/n/nbbacdeac052c'),
('ed','ed-y4-modern-plus42','M+42詐欺飛び','Modern combo end +42','forward jump / Kill Step 5H / Spark meaty','+42 family','any','位置別。','modern_only','https://note.com/denndenn/n/n3880e5e71ef1'),
('ed','ed-y4-modern-flicker-plus4','Mワンボタン紐+4','Modern charged/OD Flicker guard','Assist L/M / throw / block','Source +4','any','簡易入力差。','modern_only','https://note.com/nikotarosun/n/n65ed70bb4ad7'),
('ed','ed-y4-modern-sa2-pressure','M SA2球固め','Modern SA2 active','Assist pressure / throw / Flicker / bait','Projectile cover','any','簡易補正。','modern_only','https://note.com/nikotarosun/n/n65ed70bb4ad7'),
('ed','ed-y4-modern-onebutton-reversalbait','Mワンボタン無敵待ち','Kill Step oki','Assist L meaty / block one-button reversal / punish','Bait branch','any','操作余裕。','modern_only','https://note.com/buredon/n/nbbacdeac052c'),
('ed','ed-y4-modern-corner-throw','M端投げ択','Modern corner throw','walk throw / Assist L / shimmy Assist H','Manual timing','corner','自動確認。','modern_only','https://note.com/nikotarosun/n/n65ed70bb4ad7'),
('ed','ed-y4-modern-spark-walk','M弾追い','Modern Spark > Shoot','walk > Assist M / throw / one-button anti-air ready','Projectile cover','midscreen','対空待ち。','modern_only','https://www.sukoreru.com/sf6-ed');

insert into p31_seq values
('ed','ed-y4-flicker-tree','フリッカー溜め分岐','Flicker tap / charge pull +4 / feint / OD projectile bypass','Record strength, range, DI and jump answers.','strategy','https://note.com/babapiero/n/nee9bbc650b3d'),
('ed','ed-y4-flicker-plus4-tree','紐+4三択','charged/OD Flicker guard > throw / 5MP counter route / 2LP hit-confirm / backstep shimmy','Normal hit and counter routes differ.','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-killstep-tree','キルステップ全派生','Kill Step > stop / Break / Chase / strike / throw / shimmy','Frame family +8/+9/+10/+11.','strategy','https://note.com/kch_/n/nfa8e04b21d20'),
('ed','ed-y4-hp-flicker-string','強P弱フリッカー連携','5HP > L Flicker > safe spacing / DI risk / whiff punish','Source calls continuous guard; current capture required.','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-plus42-tree','+42攻め分岐','+42 > safe jump / Kill Step 5HP meaty / close Spark meaty','Position and reversal speed.','strategy','https://note.com/daigoro_pso2/n/n0068ee747d32'),
('ed','ed-y4-sa2-tree','SA2球運用','SA2 > combo rehit / walk-behind pressure / corner set / escape cover','Do not label all ball pressure true.','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-spark-tree','スパーク・シュート分岐','Spark > no shot / L-M-H Shoot / OD / walk-behind / anti-jump wait','Projectile wars and jump risk.','strategy','https://note.com/babapiero/n/nee9bbc650b3d'),
('ed','ed-y4-meaty-choice','持続重ね選択','knockdown > 5HP forced stand / 2MK D-reversal bait / light safe meaty','Record trade and hit-confirm.','strategy','https://note.com/daigoro_pso2/n/ned4ab96caff9'),
('ed','ed-y4-resource-choice','締めとゲージ判断','hit > M Blitz oki / H Blitz +42 / OD Flicker extension / SA2 route / SA3 lethal','Track Drive and corner distance.','strategy','https://note.com/nikotarosun/n/n99fbf1d58191'),
('ed','ed-y4-aa-choice','対空選択','near L Upper / far 5HK / air-to-air / SA1 / high-hit follow-up','Height and cross-up.','strategy','https://www.sukoreru.com/sf6-ed'),
('ed','ed-y4-modern-assist-stop','Mアシスト停止','Assist L/M/H > stop on block / manual oki ender / automatic SA','Record resource automation.','modern_only','https://note.com/nikotarosun/n/n65ed70bb4ad7'),
('ed','ed-y4-modern-flicker-tree','M紐入力分岐','one-button/manual Flicker > tap / charge / feint / OD','Scaling and available strengths.','modern_only','https://note.com/nikotarosun/n/n65ed70bb4ad7'),
('ed','ed-y4-modern-onebutton-defense','Mワンボタン防御','jump/pressure read > L Upper / SA1 / SA2 cover','Invulnerability and scaling.','modern_only','https://www.sukoreru.com/sf6-ed'),
('ed','ed-y4-modern-sa2-tree','M SA2運用','one-button/manual SA2 > central combo / corner combo / pressure','Input scaling and ball timing.','modern_only','https://note.com/denndenn/n/n3880e5e71ef1'),
('ed','ed-y4-modern-resource-tree','Mゲージ別選択','Assist hit > no-Drive Blitz / Drive2 Flicker / SA2 / SA3 automatic','BO branch included.','modern_only','https://note.com/nikotarosun/n/n65ed70bb4ad7');

-- Supplemental Ed sources used by the detailed rows.
insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
('エドまとめ','https://note.com/elleair104/n/n80787a22aae0','community_guide','elleair104',null::timestamptz,now(),'community','Written Ed combo and setup notes.'),
('エド基本コンボ','https://tatsujin.blog/sf6/characters/ed/ed-basic-combo/','community_guide','格ゲーの達人',null::timestamptz,now(),'community','Written Ed starter and resource routes.'),
('モダンエド攻略','https://note.com/buredon/n/nbbacdeac052c','community_guide','buredon',null::timestamptz,now(),'community','Modern Ed written guide.'),
('エド対空と起き攻め','https://note.com/kind_daphne909/n/nee65b46bc501','community_guide','kind_daphne909',null::timestamptz,now(),'community','Written Ed anti-air and oki notes.'),
('エド攻略まとめ','https://www.sukoreru.com/sf6-ed','community_guide','スコれる',null::timestamptz,now(),'community','Classic and Modern Ed reference.'),
('エドSA2コンボ','https://www.syogepixiv.work/2024/04/02/sf6-ed-sa2-combo/','community_guide','syogepixiv',null::timestamptz,now(),'community','Legacy written SA2 route; current capture required.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
('エド立ち回り攻略','https://note.com/babapiero/n/nee9bbc650b3d','community_guide','babapiero',null::timestamptz,now(),'community','Written Ed neutral, Flicker and route notes.'),
('エド+42セットプレイ','https://note.com/denndenn/n/n394ad03c26cd','community_guide','でんのすけ',null::timestamptz,now(),'community','Written Ed meaty and frame-kill claims.'),
('モダン豪鬼攻略','https://www.sukoreru.com/sf6-modern-akuma','community_guide','スコれる',null::timestamptz,now(),'community','Modern Akuma command, assist and route reference.'),
('エド基礎コンボ','https://www.syogepixiv.work/2024/04/02/%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6-%E6%94%BB%E7%95%A5-%E7%AC%AC5%E5%9B%9E%E3%82%A8%E3%83%89-%E5%9F%BA%E7%A4%8E%E3%82%B3%E3%83%B3%E3%83%9C/','community_guide','syogepixiv',null::timestamptz,now(),'community','Legacy written Ed SA2 combo; current capture required.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

-- Akuma / 豪鬼: Classic and Modern route matrix.
insert into p31_combo values
('akuma','akuma-y4-2lp-hdp','小技刻み強昇龍','light','2LP > 2LP > 5LK > H Gou Shoryuken','2LP','any',2,'小技確定','距離で刻み数。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-5lp-ltatsu-sweep','立弱P弱竜巻大足','light','5LP > 5LP > L Tatsumaki > 2HK','5LP, standing opponent','any',2,'+42締め','しゃがみには弱竜巻不成立。','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-2mp-madamant','屈中P中金剛灼火','medium','2MP > 2MP > M Adamant Flame','2MP','any',2,'ノーゲージ基本','距離で2段目。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-5mp-target-madamant','中PTC金剛灼火','medium','5MP~MP > M Adamant Flame','5MP','any',2,'中技確認','TCのガード確認。','strategy','https://kamigame.jp/streetfighter6/page/317199723331067429.html'),
('akuma','akuma-y4-2mk-lfireball','中足弱豪波動','medium','2MK > L Gou Hadoken','2MK','any',2,'中足確認','間合いと反撃。','strategy','https://note.com/quirky_chimp9568/n/n9473b9d60c12'),
('akuma','akuma-y4-cdr-2mp-2hp-mtatsu','中足ラッシュ中P強P中竜巻','drive','2MK > CDR 2MP > 2HP > M Tatsumaki','2MK','midscreen',4,'運びと起き攻め','距離別締め。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-dr-2lk-5mk-htatsu','ラッシュ下段強竜巻','drive','DR 2LK > 5MK > H Tatsumaki','DR 2LK','any',3,'下段始動','強竜巻の位置。','strategy','https://note.com/kch_/n/n965d5daa6103'),
('akuma','akuma-y4-dr-6hp-firsthit','ラッシュ頭蓋一段コンボ','drive','DR 6HP(1) > 2MP > M Adamant Flame','DR 6HP first hit','any',4,'持続中段','一段止めタイミング。','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-5hp-ltatsu-sweep','強P弱竜巻大足','heavy','5HP > L Tatsumaki > 2HK','5HP, standing opponent','any',3,'+42締め','立ち限定。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-5hk-target-hdp','強KTC強昇龍','heavy','5HK~HK > H Gou Shoryuken','5HK','any',3,'大技確定','距離としゃがみ。','strategy','https://kamigame.jp/streetfighter6/page/317199723331067429.html'),
('akuma','akuma-y4-hadamant-pc-5hp','強金剛PC追撃','punish','H Adamant Flame(PC) > 5HP > M Tatsumaki','H Adamant Flame punish counter','any',4,'差し返し','浮きと距離。','strategy','https://note.com/kch_/n/n965d5daa6103'),
('akuma','akuma-y4-5hk-pc-dr','強K PCラッシュ','punish','5HK(PC) > DR 5HP > L Tatsumaki > 2HK','5HK punish counter','any',4,'大技差し返し','立ち状態確認。','strategy','https://note.com/quirky_chimp9568/n/n9473b9d60c12'),
('akuma','akuma-y4-drev-punish','Dリバ反撃','punish','blocked Drive Reversal > 5HP > L Tatsumaki > 2HK','Drive Reversal punish','any',3,'Dリバ確反','現行PC挙動。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-di-central','中央DI強P竜巻','impact','DI(PC) > 5HP > M Tatsumaki','DI punish counter','midscreen',3,'中央DI','位置で大足締め。','strategy','https://kamigame.jp/streetfighter6/page/317199723331067429.html'),
('akuma','akuma-y4-di-wall-odadamant','端DI OD金剛','impact','DI wall splat > 5HP > OD Adamant Flame > H Gou Shoryuken','DI wall splat','corner',4,'端DI','壁張り付き高度。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-aa-hdp','強昇龍対空','anti_air','H Gou Shoryuken anti-air','opponent jump','any',2,'基本対空','距離とめくり。','strategy','https://note.com/quirky_chimp9568/n/n9473b9d60c12'),
('akuma','akuma-y4-aa-2hp-hdp','屈強P対空昇龍','anti_air','2HP anti-air > H Gou Shoryuken','deep jump','any',3,'近距離対空','高さ限定。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-air-mp-odfireball','空対空OD斬空','anti_air','j.MP > OD Zanku Hadoken > landing follow-up','air-to-air j.MP','any',4,'空対空伸ばし','高度と方向。','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-corner-odadamant-hdp','端OD金剛強昇龍','corner','5HP > OD Adamant Flame > H Gou Shoryuken','5HP','corner',4,'端火力','金剛強度と追撃。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-corner-odadamant-ltatsu','端OD金剛弱竜巻大足','corner','5HP > OD Adamant Flame > L Tatsumaki > 2HK','5HP','corner',5,'端+42再起','高さ調整。','strategy','https://note.com/kch_/n/n965d5daa6103'),
('akuma','akuma-y4-corner-fireball-loop','端豪波動追撃','corner','5HP > OD Gou Hadoken > 5HP > H Gou Shoryuken','5HP','corner',5,'端Drive火力','弾の強度。','strategy','https://note.com/quirky_chimp9568/n/n9473b9d60c12'),
('akuma','akuma-y4-sa1-basic','SA1締め','sa','2MP > 2MP > M Adamant Flame > SA1','2MP','any',3,'SA1リーサル','キャンセル可否。','strategy','https://kamigame.jp/streetfighter6/page/317199723331067429.html'),
('akuma','akuma-y4-sa2-basic','SA2締め','sa','5HP > OD Adamant Flame > SA2','5HP','any',4,'SA2火力','端・中央差。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-sa3-basic','SA3締め','sa','2MK > CDR 2MP > 2HP > M Adamant Flame > SA3','2MK','any',4,'SA3リーサル','CA差。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-stun-basic','スタン基本','stun','stun > j.HK > 5HP > OD Adamant Flame > H Shoryuken','opponent stun','corner',4,'スタン火力','Drive量。','strategy','https://kamigame.jp/streetfighter6/page/317199723331067429.html'),
('akuma','akuma-y4-stun-sa3','スタンSA3最大候補','stun','stun > charge Gou Hadoken > j.HK > 5HP > OD Adamant Flame > SA3','opponent stun, SA3','corner',5,'スタン最大','溜め弾と補正。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-demonraid-punch-hit','百鬼豪斬追撃','special','Demon Raid > Punch follow-up hit > 2LP > H Shoryuken','Demon Raid punch hit','any',3,'百鬼ヒット確認','当たり方。','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-demonraid-kick-hit','百鬼豪衝追撃','special','Demon Raid > Kick follow-up hit > 5LP > L Tatsumaki > 2HK','Demon Raid kick hit','any',4,'百鬼表裏','立ち限定。','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-modern-assist-l','M弱アシスト','assist','Assist L automatic route > H Shoryuken','Modern Assist L','any',1,'M小技','自動停止位置。','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-assist-m','M中アシスト','assist','Assist M automatic route > Tatsumaki/SA','Modern Assist M','any',2,'M中技','ゲージ別。','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-assist-h','M強アシスト','assist','Assist H automatic route > OD Adamant Flame > SA','Modern Assist H','any',3,'M大技','自動Drive/SA。','modern_only','https://kamigame.jp/streetfighter6/page/317199723331067429.html'),
('akuma','akuma-y4-modern-ltatsu-sweep','M弱竜巻大足','light','5L > L Tatsumaki > 2H sweep','Modern 5L, standing opponent','any',2,'M+42締め','簡易表記と立ち限定。','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-dr-overhead','Mラッシュ中段','drive','DR 6M(1) > 2M > M Adamant Flame','Modern DR overhead','any',4,'M中段','一段当て。','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-di-wall','M端DI','impact','DI wall splat > Assist H > OD Adamant Flame > H Shoryuken','DI wall splat','corner',4,'M端DI','簡易補正。','modern_only','https://kamigame.jp/streetfighter6/page/317199723331067429.html'),
('akuma','akuma-y4-modern-aa-onebutton','Mワンボタン昇龍','anti_air','one-button H Shoryuken anti-air > SA option','opponent jump','any',2,'M対空','補正と追撃。','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-sa3','MワンボタンSA3締め','sa','Assist hit > one-button SA3/CA','Modern Assist confirm','any',3,'Mリーサル','簡易入力補正。','modern_only','https://www.sukoreru.com/sf6-modern-akuma');

insert into p31_setup values
('akuma','akuma-y4-ltatsu-sweep-plus42','弱竜巻大足+42','L Tatsumaki > 2HK','dash x2 > 5MP / throw / shimmy','Source +42, dash x2 close +4','any','立ち限定始動から標準起き攻め。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-ltatsu-sweep-safejump','端弱竜巻大足詐欺飛び','corner L Tatsumaki > 2HK','forward jump attack / empty jump throw','+42 family','corner','4F/5F無敵を分離。','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-mtatsu-dash','中竜巻前ステ起き攻め','M Tatsumaki knockdown','dash x2 > 5MP / 2MK / throw','Route-specific','any','受け身・運び距離別。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-hadamant-raid-empty','強金剛百鬼空着地','H Adamant Flame knockdown','H Demon Raid > empty land > throw / 2MP','Source +2 claim','any','最速空着地。','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-hadamant-raid-punch','強金剛百鬼豪斬','H Adamant Flame knockdown','H Demon Raid > punch meaty > combo','Meaty claim','any','ガード有利とDI。','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-hadamant-raid-kick','強金剛百鬼豪衝','H Adamant Flame knockdown','H Demon Raid > kick / cross-up timing','Meaty/cross-up','any','表裏と対空。','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-hadamant-raid-slide','強金剛百鬼豪刃','H Adamant Flame knockdown','H Demon Raid > slide low > combo','Low branch','any','暴れ・投げ間合い。','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-hadamant-raid-fireball','強金剛百鬼豪波動','H Adamant Flame knockdown','H Demon Raid > projectile > approach','Projectile branch','any','弾抜けと前ジャンプ。','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-dr6hp-meaty','ラッシュ頭蓋持続','knockdown','DR 6HP first hit meaty > 2LP/2MP combo','Source +2 to +4 claim','any','持続段階別。','strategy','https://note.com/kch_/n/n965d5daa6103'),
('akuma','akuma-y4-forwardthrow-corner','端前投げ柔道','corner forward throw','walk throw / 5MP / shimmy','Manual timing','corner','投げ間合いとバクステ。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-backthrow-fireball','後ろ投げ弾重ね','back throw','Gou Hadoken / DR approach / anti-jump wait','Projectile cover','any','受け身と弾速度。','strategy','https://note.com/quirky_chimp9568/n/n9473b9d60c12'),
('akuma','akuma-y4-madamant-oki','中金剛起き攻め','M Adamant Flame knockdown','dash > 5MP / throw / shimmy','Route-specific','any','距離別。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-corner-odadamant-oki','端OD金剛起き攻め','corner OD Adamant Flame route','safe jump / DR meaty / throw','Ender-specific','corner','昇龍・大足締め別。','strategy','https://note.com/kch_/n/n965d5daa6103'),
('akuma','akuma-y4-airfireball-cover','斬空波動追い','air Zanku Hadoken','land > DR/step > strike / throw','Projectile cover','midscreen','高度と着地硬直。','strategy','https://note.com/quirky_chimp9568/n/n9473b9d60c12'),
('akuma','akuma-y4-sa1-oki','SA1後起き攻め','SA1 hit','DR/step > 5MP / throw / fireball','SA1-specific','any','位置と受け身。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-sa2-oki','SA2後起き攻め','SA2 hit','Demon Raid / DR strike-throw / fireball','SA2-specific','any','端中央差。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-sa3-oki','SA3後起き攻め','SA3/CA hit','DR meaty / projectile / bait','SA3/CA-specific','any','CA有利差。','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-modern-plus42','M弱竜巻大足+42','Modern L Tatsumaki > sweep','dash x2 > Assist M / throw / shimmy','+42 family','any','簡易入力と立ち限定。','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-safejump','M端+42詐欺飛び','Modern corner sweep ender','forward jump attack / empty jump','+42 family','corner','ワンボタン無敵への対応。','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-raid-mix','M百鬼択','Modern knockdown','Demon Raid > punch / kick / slide / empty throw','Branch-specific','any','使える派生と補正。','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-assist-oki','Mアシスト締め起き攻め','Modern Assist route ender','Assist M meaty / throw / shimmy','Ender-specific','any','自動SA消費別。','modern_only','https://kamigame.jp/streetfighter6/page/317199723331067429.html'),
('akuma','akuma-y4-modern-onebutton-bait','Mワンボタン無敵待ち','Modern knockdown','meaty Assist L / block reversal / punish','Bait branch','any','操作余裕と補正。','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-sa-oki','M SA後起き攻め','Modern SA1/2/3','DR strike / throw / projectile','SA-specific','any','簡易入力補正別。','modern_only','https://www.sukoreru.com/sf6-modern-akuma');

insert into p31_seq values
('akuma','akuma-y4-demonraid-tree','百鬼全派生','Demon Raid > empty / punch / kick / slide / projectile / delay','Record anti-air, DI, jump and fuzzy answers.','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-fireball-tree','豪波動分岐','L/M/H/charge Gou Hadoken > walk / DR / anti-jump wait / feint timing','Strength and charge alter spacing.','strategy','https://note.com/quirky_chimp9568/n/n9473b9d60c12'),
('akuma','akuma-y4-airfireball-tree','斬空波動分岐','neutral/back/forward jump Zanku > land pressure / retreat / anti-air bait','Height and trajectory.','strategy','https://note.com/quirky_chimp9568/n/n9473b9d60c12'),
('akuma','akuma-y4-adamant-tree','金剛灼火強度選択','L/M/H/OD Adamant Flame > damage / knockdown / Raid setup / corner extension','Guard safety and DI windows.','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-plus42-tree','+42全分岐','L Tatsumaki > sweep +42 > safe jump / dash x2 strike-throw / fireball','Standing-only entry must be preserved.','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-dr-tree','ラッシュ択','DR > 5MP / 2LK / 6HP first hit / throw / shimmy','Record hit and block frames.','strategy','https://note.com/kch_/n/n965d5daa6103'),
('akuma','akuma-y4-standconfirm-tree','立ち確認弱竜巻分岐','hit confirm standing > L Tatsumaki sweep / crouching > Shoryuken-Adamant ender','Do not merge crouching failure.','strategy','https://note.com/lilililily/n/nee3ea8cec5fc'),
('akuma','akuma-y4-aa-tree','対空選択','far H Shoryuken / near 2HP / air-to-air j.MP / air fireball route / SA','Height and cross-up.','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-resource-tree','ゲージ別締め','no Drive Adamant / Drive2 OD Adamant / Drive3 CDR / SA1-SA2-SA3 / +42 oki','Choose damage versus oki.','strategy','https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/'),
('akuma','akuma-y4-corner-tree','端攻め循環','corner hit > OD Adamant extension > safe jump / throw / shimmy > wall escape cover','Record reversal and side-switch.','strategy','https://note.com/kch_/n/n965d5daa6103'),
('akuma','akuma-y4-modern-assist-stop','Mアシスト停止','Assist L/M/H > stop on block / manual ender / automatic SA','Resource automation.','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-raid-tree','M百鬼全派生','one-button/manual Demon Raid > empty / punch / kick / slide / projectile','Available strength and scaling.','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-defense-tree','Mワンボタン防御','jump/pressure read > Shoryuken / SA1 / SA3','Invulnerability and scaling.','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-resource-tree','Mゲージ判断','Assist hit > basic / OD Adamant / automatic SA / manual +42 ender','BO behavior separate.','modern_only','https://www.sukoreru.com/sf6-modern-akuma'),
('akuma','akuma-y4-modern-plus42-tree','M+42攻め','sweep +42 > safe jump / dash x2 Assist M / throw / shimmy','Standing-only route and assist timing.','modern_only','https://www.sukoreru.com/sf6-modern-akuma');

-- M. Bison / ベガ: mine-off, mine-on, Classic and Modern matrices.
insert into p31_combo values
('m-bison','bison-y4-2lp-lk-lbackfist','小技弱バックフィスト','light','2LP > 2LP > 5LK > L Backfist Combo','2LP','any',2,'小技・マイン付与','距離で刻み数。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-5lp-mknee','立弱P中ニー','light','5LP > 5LP > M Double Knee Press','5LP','any',2,'小技運び','溜め不要入力と距離。','strategy','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-5lp-pc-mknee','弱P PC中ニー','punish','5LP(PC) > M Double Knee Press','5LP punish counter','any',2,'4F確反候補','現行PC有利。','strategy','https://note.com/rokujokazuma/n/nec7bb5fffcf1'),
('m-bison','bison-y4-2mp-odknee-hbackfist','屈中P ODニー強フィスト','medium','2MP > OD Double Knee Press > H Backfist Combo','2MP','any',4,'Drive2マイン付与','距離と強度。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-5mp-2mp-mknee','中P屈中P中ニー','medium','5MP > 2MP > M Double Knee Press','5MP','any',2,'中技基本','持続当てで有利差。','strategy','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-2mk-cdr-hp','中足ラッシュ強P','drive','2MK > CDR 5HP > H Backfist Combo','2MK','any',4,'中足マイン付与','現行強P接続。','strategy','https://note.com/dos236236/n/n7f6658e1fefe'),
('m-bison','bison-y4-dr-2lk-5mp','ラッシュ下段ニー','drive','DR 2LK > 5MP > 2MP > M Double Knee Press','DR 2LK','any',3,'下段始動','距離別。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-dr-6hp-2mp','ラッシュ中段ニー','drive','DR 6HP > 2MP > M Double Knee Press','DR 6HP','any',3,'中段始動','持続段階。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-5hp-hbackfist','強P強フィスト','heavy','5HP > H Backfist Combo','5HP','any',2,'マイン付与基本','間合い。','strategy','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-4hk-pc-dr','引強K PCラッシュ','punish','4HK(PC) > DR 5HP > H Backfist Combo','4HK punish counter','any',4,'シミー反撃','強制立ち等。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-3hk-pc-psycho','スライディングPC追撃','punish','3HK(PC) > M Psycho Crusher','3HK punish counter','any',4,'差し返し','溜め完成と距離。','strategy','https://note.com/rokujokazuma/n/nec7bb5fffcf1'),
('m-bison','bison-y4-drev-punish','Dリバ反撃マイン付与','punish','blocked Drive Reversal > 5HP > H Backfist Combo','Drive Reversal punish','any',3,'Dリバ確反','現行PC状態。','strategy','https://note.com/dos236236/n/n7f6658e1fefe'),
('m-bison','bison-y4-di-central','中央DIマイン付与','impact','DI(PC) > 5HP > H Backfist Combo','DI punish counter','midscreen',3,'中央DI','距離。','strategy','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-di-wall-odknee','端DI ODニー','impact','DI wall splat > 5HP > OD Double Knee Press > H Backfist Combo','DI wall splat','corner',4,'端DI','壁高度。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-aa-2hp','屈強P対空','anti_air','2HP anti-air > Psycho Mine oki','opponent jump','any',2,'基本対空','相打ち追撃。','strategy','https://note.com/rokujokazuma/n/nec7bb5fffcf1'),
('m-bison','bison-y4-aa-lpsycho','弱サイコ対空','anti_air','L Psycho Crusher anti-air > mine detonation follow-up','opponent jump, mine attached','any',4,'溜め対空','高さと溜め。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-air-mp-devil','空対空デビリバ','anti_air','j.MP air-to-air > Devil Reverse follow-up','air-to-air','any',4,'空対空','高度と方向。','strategy','https://note.com/dos236236/n/n7f6658e1fefe'),
('m-bison','bison-y4-mine-psycho-detonate','マインサイコ起爆','mine','5HP > H Backfist attach > setup hit > Psycho Crusher detonation > follow-up','opponent mined','any',5,'サイコ起爆コンボ','起爆高度と溜め。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-mine-backfist-detonate','マインフィスト起爆','mine','mine attached > H Backfist hit/guard detonation > DR follow-up','opponent mined','any',4,'フィスト起爆','ヒット・ガード別。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-mine-devil-detonate','マインデビリバ起爆','mine','mine attached > Devil Reverse hit detonation > landing combo','opponent mined','any',5,'空中起爆','当たり方。','strategy','https://note.com/dos236236/n/n7f6658e1fefe'),
('m-bison','bison-y4-mine-plus42-convert','マイン起爆+42追撃','mine','ground detonation > dash x2 > 5MP > combo','ground mine detonation','any',4,'起爆後再攻め','記事+42主張。','strategy','https://sorehododemonai-gamer-a.hatenablog.com/entry/2025/08/16/165946'),
('m-bison','bison-y4-corner-mine-loop','端マインループ','corner','H Backfist attach > corner pressure > detonate > 5HP > H Backfist reattach','opponent mined','corner',5,'端循環','再付与条件。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-corner-odpsycho','端ODサイコ追撃','corner','5HP > OD Psycho Crusher > 5MP > H Backfist Combo','5HP','corner',5,'端Drive火力','溜めと浮き。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-sa1-basic','SA1締め','sa','2MP > M Double Knee Press > SA1','2MP','any',3,'SA1リーサル','キャンセル窓。','strategy','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-sa2-basic','SA2締め','sa','5HP > H Backfist Combo > SA2','5HP','any',4,'SA2火力','マイン有無。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-sa3-mine','マインSA3','sa','mine detonation > DR 5HP > H Backfist Combo > SA3','opponent mined','any',5,'SA3最大候補','CA差。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-stun-no-mine','スタンマインなし','stun','stun > j.HK > 5HP > OD Knee > H Backfist > SA','opponent stun, no mine','corner',5,'スタン基本','Drive/SA別。','strategy','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-stun-mine','スタンマインあり最大','stun','stun > mine detonation route > OD Psycho > SA3','opponent stun, mined','corner',5,'スタン最大','起爆順と補正。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-modern-assist-l','M弱アシスト','assist','Assist L automatic route > Backfist','Modern Assist L','any',1,'M小技','マイン付与と停止。','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-assist-m','M中アシスト','assist','Assist M automatic route > Double Knee/SA','Modern Assist M','any',2,'M中技','ゲージ別。','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-assist-h','M強アシスト','assist','Assist H automatic route > OD Knee > Backfist/SA','Modern Assist H','any',3,'M大技','自動Drive/SA。','modern_only','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-modern-dr-low','Mラッシュ下段','drive','DR 2L > Assist M > Double Knee','Modern DR 2L','any',3,'M下段','簡易補正。','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-dr-overhead','Mラッシュ中段','drive','DR 6H > 2M > Double Knee','Modern DR overhead','any',3,'M中段','使用可能技確認。','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-mine-detonate','Mマイン起爆','mine','Assist H attach > one-button Psycho Crusher detonation > Assist follow-up','opponent mined','any',4,'M起爆','簡易補正。','modern_only','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-modern-di-wall','M端DI','impact','DI wall splat > Assist H > OD Knee > Backfist','DI wall splat','corner',4,'M端DI','技欠落の代替。','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-aa-psycho','Mワンボタンサイコ対空','anti_air','one-button Psycho Crusher anti-air/detonate','opponent jump','any',3,'M対空','溜め省略可否と補正。','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-sa3','MワンボタンSA3','sa','Assist hit or mine detonation > one-button SA3','Modern confirm','any',3,'Mリーサル','簡易補正。','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html');

insert into p31_setup values
('m-bison','bison-y4-lbackfist-whiff2lk','弱フィスト屈弱K消費','L Backfist Combo knockdown','whiff 2LK > 5MP / throw / shimmy','Source +5 claim','any','マイン付与後の標準消費。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-mbackfist-whiff5lk','中フィスト立弱K消費','M Backfist Combo knockdown','whiff 5LK > 5MP / throw / shimmy','Source +6 claim','any','距離と投げ間合い。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-backfist-overhead','フィスト後持続中段','L/M Backfist knockdown','6HP meaty > light/OD Psycho follow-up','Source +4/+5 on hit claim','any','フィスト強度別。','strategy','https://note.com/rokujokazuma/n/nec7bb5fffcf1'),
('m-bison','bison-y4-mine-plus42','マイン地上起爆+42','ground mine detonation','dash x2 > 5MP / throw / shimmy','Source +42, dash x2 close +4','any','起爆技別に距離差。','strategy','https://sorehododemonai-gamer-a.hatenablog.com/entry/2025/08/16/165946'),
('m-bison','bison-y4-mine-plus42-safejump','端マイン起爆詐欺飛び','corner ground mine detonation','forward jump attack / empty jump','+42 family','corner','無敵発生別。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-nozaki-overhead','ノザキ式中段','mine attached, H Backfist knockdown','DR 5MP frame kill > 6HP overhead > detonation','Source named setup','any','連続性と暴れ。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-nozaki-low','ノザキ式下段','mine attached, H Backfist knockdown','DR 5MP frame kill > 2LK low > detonation','Source named setup','any','中段との対。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-nozaki-throw','ノザキ式投げ','mine attached, H Backfist knockdown','DR 5MP stop > throw / shimmy > detonation punish','Manual branch','any','投げ間合い。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-mpsycho-dash','中サイコ前ステ','M Psycho Crusher knockdown','dash > 5MP / throw / shimmy','Source close +2 claim','any','現行有利を要撮影。','strategy','https://note.com/dos236236/n/n7f6658e1fefe'),
('m-bison','bison-y4-mknee-oki','中ニー後起き攻め','M Double Knee Press hit','step/DR > 5MP / 2MK / throw','Route-specific','any','距離別。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-forwardthrow-corner','端前投げ柔道','corner forward throw','walk throw / 5MP / 4HK shimmy','Manual timing','corner','投げ間合い。','strategy','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-backthrow-shadowrise','後ろ投げシャドウライズ','back throw','Shadow Rise > Head Press / Devil Reverse / empty land','Branch-specific','any','対空・前歩き回答。','strategy','https://note.com/dos236236/n/n7f6658e1fefe'),
('m-bison','bison-y4-devilreverse-plus','デビリバ有利攻め','Devil Reverse guard','5MP / throw / backstep bait','Height-dependent plus','any','高度別有利。','strategy','https://note.com/rokujokazuma/n/nec7bb5fffcf1'),
('m-bison','bison-y4-headpress-oki','ヘッドプレス後','Head Press hit','Devil Reverse follow-up / land strike-throw','Branch-specific','any','追加入力と位置。','strategy','https://note.com/dos236236/n/n7f6658e1fefe'),
('m-bison','bison-y4-mine-psycho-guard','マインサイコガード起爆','mine attached','Psycho Crusher guard detonation > strike / throw / shimmy','Detonation plus claim','any','連ガ・割込みを分離。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-mine-backfist-guard','マインフィストガード起爆','mine attached','Backfist guard detonation > strike / throw / bait','Detonation plus claim','any','DIと無敵。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-corner-mine-loop-oki','端マイン再付与循環','corner mined knockdown','detonate meaty > 5HP > Backfist reattach / throw','Position-specific','corner','受け身と再付与。','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-sa1-oki','SA1後起き攻め','SA1 hit','DR/step > strike / throw / mine attach','SA1-specific','any','位置別。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-sa2-oki','SA2後起き攻め','SA2 hit','mine state > Shadow Rise / DR strike-throw','SA2-specific','any','マイン有無。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-sa3-oki','SA3後起き攻め','SA3/CA hit','DR/step > 5MP / throw / mine pressure','SA3/CA-specific','any','CA差。','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-modern-mine-plus42','Mマイン起爆+42','Modern ground detonation','dash x2 > Assist M / throw / shimmy','+42 family','any','簡易入力起爆。','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-nozaki','Mノザキ式','Modern mined knockdown','DR Assist M stop > overhead / low / throw','Branch-specific','any','欠落通常技の代替。','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-assist-oki','Mアシスト締め起き攻め','Modern Assist ender','Assist M meaty / throw / shimmy','Ender-specific','any','自動SA分岐。','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-shadowrise','Mシャドウライズ択','Modern knockdown','one-button Shadow Rise > Head Press / Devil Reverse / empty','Branch-specific','any','簡易入力補正。','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html');

insert into p31_seq values
('m-bison','bison-y4-mine-cycle','サイコマイン循環','Backfist attach > mine pressure > Psycho/Backfist/Devil Reverse detonate > reattach','Track attach, timer, detonation and expiry.','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-mine-detonation-tree','マイン起爆技分岐','mine > Psycho Crusher / Backfist / Devil Reverse hit-or-guard detonation','Hit and guard advantage differ.','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-shadowrise-tree','シャドウライズ全派生','Shadow Rise > Head Press / Devil Reverse / empty land / direction change','Record anti-air and walk-under answers.','strategy','https://note.com/dos236236/n/n7f6658e1fefe'),
('m-bison','bison-y4-knee-tree','ダブルニー強度分岐','L/M/H/OD Double Knee > spacing trap / knockdown / Backfist extension','Punish range and spacing.','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-psycho-tree','サイコクラッシャー分岐','L/M/H/OD Psycho Crusher > neutral skip / mine detonate / combo / anti-air','Charge and mine state required.','strategy','https://note.com/rokujokazuma/n/nec7bb5fffcf1'),
('m-bison','bison-y4-charge-tree','溜め維持選択','down-back charge > normal pressure / Psycho Crusher / Shadow Rise while retaining charge','Record charge windows and input display.','strategy','https://note.com/dos236236/n/n7f6658e1fefe'),
('m-bison','bison-y4-nozaki-tree','ノザキ式全分岐','mined knockdown > DR 5MP stop > overhead / low / throw / shimmy / block','Separate true strings from mixups.','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-plus42-tree','起爆+42全分岐','ground detonation +42 > safe jump / dash x2 strike-throw / Shadow Rise','Detonation source changes spacing.','strategy','https://sorehododemonai-gamer-a.hatenablog.com/entry/2025/08/16/165946'),
('m-bison','bison-y4-aa-tree','対空選択','2HP / L Psycho / air-to-air j.MP / Shadow Rise escape / SA','Charge, height and cross-up.','strategy','https://note.com/rokujokazuma/n/nec7bb5fffcf1'),
('m-bison','bison-y4-resource-tree','ゲージとマイン判断','hit > no-Drive Knee / Drive2 OD Knee / mine attach / mine detonate / SA lethal','Damage versus mine pressure.','strategy','https://note.com/bonmoko_3/n/nedc754b80241'),
('m-bison','bison-y4-corner-tree','端マイン鳥籠','corner mine > strike / throw / overhead / detonation guard / reattach','Record jump, DI, D-reversal and invincible exits.','strategy','https://note.com/991357/m/md7d3e6e41597'),
('m-bison','bison-y4-modern-assist-stop','Mアシスト停止','Assist L/M/H > stop on block / mine attach / automatic SA','Resource automation.','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-mine-tree','Mマイン循環','Assist attach > one-button detonate > Assist pressure > reattach','Simple-input scaling separate.','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-defense-tree','Mワンボタン防御','jump/pressure read > Psycho Crusher / Shadow Rise / SA','Charge bypass and scaling.','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html'),
('m-bison','bison-y4-modern-resource-tree','Mゲージ判断','Assist hit > basic / OD Knee / mine detonation / automatic SA','BO branch and missing normals.','modern_only','https://kamigame.jp/streetfighter6/page/322662586657036042.html');

-- Materialize the three character collections. All entries remain draft/unverified.
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.cat,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,'Written/image-only collection; current capture required.',p.id,'unverified',r.ck,'draft'
from p31_combo r join characters c on c.slug=r.char_slug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'oki',r.starter,r.seq,r.adv,r.pos,r.descr,'Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',p.id,'unverified',r.ck,'draft'
from p31_setup r join characters c on c.slug=r.char_slug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,false,'record 4F gaps','record throw point','record shimmy spacing','record jump escape','record parry answer','record D-reversal','record reversal',r.notes,p.id,'unverified',r.ck,'draft'
from p31_seq r join characters c on c.slug=r.char_slug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note) select 'combo',x.id,s.id,'supporting','Written/image claim; capture required.' from p31_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note) select 'setup',x.id,s.id,'supporting','Written/image claim; capture required.' from p31_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note) select 'sequence',x.id,s.id,'supporting','Written decision tree; capture required.' from p31_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select e.typ,e.id,s.id,'patch_context','2026-08-03 official character baseline.'
from(select 'combo' typ,x.id,r.char_slug from p31_combo r join combos x on x.slug=r.slug union all select 'setup',x.id,r.char_slug from p31_setup r join setups x on x.slug=r.slug union all select 'sequence',x.id,r.char_slug from p31_seq r join sequences x on x.slug=r.slug)e
join sources s on s.url=case e.char_slug when 'ed' then 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ed' when 'akuma' then 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/gouki_akuma' when 'm-bison' then 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/vega_mbison' end
on conflict(entity_type,entity_id,source_id) do nothing;

with e as(
 select 'combo' typ,x.id,x.slug,x.name,x.notation method,x.content_kind,r.char_slug from p31_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind,r.char_slug from p31_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind,r.char_slug from p31_seq r join sequences x on x.slug=r.slug
),p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【'||c.name_ja||'撮影待ち】'||e.name,case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,'文章・画像から収集した攻略の現行成立を確定する。','advanced',15,c.id,'入力履歴・フレーム・ダメージ・Drive/SA・固有状態を表示。操作、位置、受け身、CH/PC、技強度を指定。','4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,'左右各10回で成立、数値、位置、受け身、固有条件、簡易補正、キャラ条件を記録。',20,'成立ならverified候補。不成立ならarchived。',p.id,'unverified',e.content_kind,'draft'
from e join characters c on c.slug=e.char_slug cross join p on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(
 select 'combo' typ,x.id,x.slug from p31_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug from p31_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug from p31_seq r join sequences x on x.slug=r.slug
)e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related strategy.' from trainings t join training_relations tr on tr.training_id=t.id join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.slug in(select 'training-'||slug from p31_combo union all select 'training-'||slug from p31_setup union all select 'training-'||slug from p31_seq)
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' or t.name ilike '%マイン%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,'2026-08-03版の成立、入力、数値、位置、受け身、固有状態、技強度、簡易補正、Classic/Modern差を確認。'
from trainings t where t.slug in(select 'training-'||slug from p31_combo union all select 'training-'||slug from p31_setup union all select 'training-'||slug from p31_seq)
on conflict(training_id) do nothing;

update character_content_packages p set rollout_status='complete',combo_status='complete',setup_status='complete',sequence_status='complete',training_status='complete',source_status='complete',patch_status='complete',verification_status='review',notes=concat_ws(E'\n',nullif(p.notes,''),'2026-09-01 phase31: written/image-only Classic and Modern collection completed; condition families separated; all draft/unverified.'),updated_at=now()
where p.character_id in(select id from characters where slug in('ed','akuma','m-bison'));
