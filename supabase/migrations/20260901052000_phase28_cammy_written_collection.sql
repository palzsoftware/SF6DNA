-- Cammy written/image-only strategy collection for the 2026-08-03 patch.
-- Community claims stay draft/unverified until current-device capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
 ('CAMMY バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/cammy','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current patch: ground pokes, close pressure and approach tools adjusted.'),
 ('Cキャミィ マスターまでのコンボ 26年4月','https://note.com/matsunoki709/n/nd514588a2312','community_guide','松/じぎーも','2026-04-01 00:00:00+00'::timestamptz,now(),'community','Written Classic starter, ender and oki choices.'),
 ('キャミィ 強化アロー空中当てセットプレイ','https://note.com/finalmmin/n/nd2591c899510','community_guide','下限',null::timestamptz,now(),'community','Written +51 through +54 enhanced Arrow setup families.'),
 ('今日から始めるキャミィの起き攻め','https://note.com/finalmmin/n/ne02959b3c31e','community_guide','下限',null::timestamptz,now(),'community','Written rise-specific meaty, throw, shimmy and corner Hooligan trees.'),
 ('モダンキャミィのコンボ 基本からSA3','https://kamigame.jp/streetfighter6/page/270448875146349440.html','community_guide','神ゲー攻略','2026-03-01 00:00:00+00'::timestamptz,now(),'community','Modern assist and resource routes with images.'),
 ('キャミィの使い方 コンボ・起き攻め','https://takukakugamer.com/sf6-cammy-howtouse/','community_guide','格ゲーブロガー拓','2025-06-08 00:00:00+00'::timestamptz,now(),'community','Classic written/image neutral, punish and projectile-punish routes.'),
 ('キャミィ初心者Wiki コンボと起き攻め','https://w.atwiki.jp/sf6begin/pages/38.html','community_guide','SF6初心者Wiki','2024-07-27 00:00:00+00'::timestamptz,now(),'community','Written medium/heavy Arrow meaty timing table; legacy candidate.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p28c_combo(slug text,name text,cat text,notation text,starter text,pos text,diff int,purpose text,conditions text,ck text,src text) on commit drop;
insert into p28c_combo values
('cammy-y4-2lk-lights-marrow','小足刻み中アロー','light','2LK > 2LP > 5LP/5LK > M Spiral Arrow','2LK','any',2,'小技ダウン','弱攻撃回数で距離と起き攻めが変化。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-5lp-5lk-marrow','小P小K中アロー','light','5LP > 5LK > M Spiral Arrow','5LP','any',2,'4F確認','先端時の中アロー到達確認。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-strike-light-marrow','ストライク小技中アロー','jump','Cannon Strike > 5LP > 5LK > M Spiral Arrow','Cannon Strike hit','any',2,'ストライク基本','ヒット高度で弱攻撃数を調整。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-light-cdr-hp-hspike','小技ラッシュ溜め強スパイク','drive','5LP/5LK > CDR 5LP > 5HP > charged H Cannon Spike','light hit','any',4,'小技リーサル','Drive3。溜め成立と距離を確認。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-light-cdr-target-sa3','小技ラッシュTC SA3','sa','5LP/5LK > CDR 5LP > 5HP > 4MP~HK > SA3','light hit','any',4,'小技SA3','Drive3+SA3。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-5mp-5lp-marrow','立中P小P中アロー','medium','5MP > 5LP > M Spiral Arrow','5MP','any',2,'中P基本','距離で5LKへ変更。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-5mp-ch-hp-harrow','立中P CH強P強アロー','counter','5MP(CH) > 5HP > H Spiral Arrow','5MP counter','any',3,'暴れ潰し確認','CH確認とアロー距離。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-2mp-5lk-marrow','屈中P小K中アロー','medium','2MP > 5LK > M Spiral Arrow','2MP','any',2,'置き中P基本','先端では不成立候補。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-2mp-cdr-hp-harrow','屈中Pラッシュ強アロー','drive','2MP > CDR 5HP > 2MP > H Spiral Arrow','2MP','any',3,'中技Drive','Drive3。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-2mk-cdr-hp-harrow','中足ラッシュ強アロー','drive','2MK > CDR 5HP > 2MP > H Spiral Arrow','2MK','any',3,'主力下段Drive','Drive3。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-2mk-cdr-lift-hspike','中足ラッシュリフト強スパイク','drive','2MK > CDR 5HP > 4HK > H Cannon Spike','2MK','any',4,'立ち確認Drive','4HKのしゃがみ非対応を確認。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-5hp-2mp-harrow','強P屈中P強アロー','heavy','5HP > 2MP > H Spiral Arrow','5HP','any',3,'強P確認候補','距離とCH要否を確認。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-2hp-2mp-harrow','屈強P屈中P強アロー','heavy','2HP > 2MP > H Spiral Arrow','2HP','any',2,'持続重ね基本','記事記載2100。現行値は撮影。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-corner-2hp-cdr-lift','端屈強Pラッシュリフト','corner','2HP > 2MP > CDR 4HK > 4HK > M Spiral Arrow > H Cannon Spike','2HP','corner',5,'端火力','Drive3。立ち状態限定。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-corner-2hp-cdr-sa1','端屈強PラッシュSA1','sa','2HP > 2MP > CDR 4HK > 4HK > M Spiral Arrow > SA1','2HP','corner',5,'端SA1','Drive3+SA1。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-corner-2hp-cdr-sa3','端屈強PラッシュSA3','sa','2HP > 2MP > CDR 4HK > 4HK > M Spiral Arrow > SA3','2HP','corner',5,'端SA3','Drive3+SA3。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-hk-pc-hp-harrow','立強K PC強P強アロー','punish','5HK(PC) > 5HP > H Spiral Arrow','5HK punish counter','any',3,'差し返し','距離別成立を確認。','strategy','https://takukakugamer.com/sf6-cammy-howtouse/'),
('cammy-y4-mknuckle-pc-light','中ナックル弾抜け小技','punish','M Spin Knuckle(PC) > 5LP/5LK > M Spiral Arrow','M Knuckle projectile punish','any',3,'弾抜け+7候補','記事記載+7。','strategy','https://takukakugamer.com/sf6-cammy-howtouse/'),
('cammy-y4-hknuckle-pc-hp','強ナックル弾抜け強P','punish','H Spin Knuckle(PC) > 5HP > H Spiral Arrow','H Knuckle projectile punish','any',3,'弾抜け+9候補','記事記載+9。','strategy','https://takukakugamer.com/sf6-cammy-howtouse/'),
('cammy-y4-di-pc-jhp-hp','中央DI最大','impact','DI(PC) > j.HP > 5HP > 4MP~HK > j.MP > H Cannon Strike','DI punish counter','midscreen',5,'中央DI運び','ジャンプ方向・高さを確認。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-wall-hp-arrow-spike','端DI強アロースパイク','impact','DI wall splat > 5HP > H Spiral Arrow > H Cannon Spike','DI wall splat','corner',3,'端DI','アロー強度と追撃高度。','strategy','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-wall-hp-arrow-sa1','端DI SA1','impact','DI wall splat > 5HP > H Spiral Arrow > SA1','DI wall splat','corner',4,'端DI SA1','SA1。','strategy','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-target-air-strike','リフト空中ストライク','anti_air','4MP~HK > j.MP > H Cannon Strike','4MP','any',4,'対空・浮かせ','高度依存。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-air-mp-strike','空対空中Pストライク','anti_air','j.MP > H Cannon Strike','air-to-air j.MP','any',3,'空対空','着地状況を確認。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-corner-od-hooligan-throw','端ODフーリ投げ追撃','corner','OD Hooligan > Fatal Leg Twister > M Spiral Arrow > H Cannon Spike','OD Hooligan throw','corner',5,'フーリ投げ','コンボトライアル由来の文字レシピ。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-corner-od-arrow-spike','端ODアロー強スパイク','corner','OD Spiral Arrow > H Cannon Spike','OD Spiral Arrow','corner',3,'入れ替え・追撃','位置と向きを確認。','strategy','https://note.com/finalmmin/n/nd2591c899510'),
('cammy-y4-od-strike-lift','ODストライクリフト','jump','OD Cannon Strike > 4MP~HK > H Cannon Spike','OD Cannon Strike','any',4,'ODストライク追撃','ヒット高度依存。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-punish-hp-cdr-lift','無敵反撃最大','punish','5HP(PC) > CDR 4HK > 4HK > M Spiral Arrow > H Cannon Spike','blocked invincible move','corner',5,'無敵技反撃','Drive3。立ち限定。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-drev-punish-hp','Dリバ反撃強P','punish','blocked Drive Reversal > 5HP > H Spiral Arrow','Drive Reversal punish','any',3,'Dリバ確反','現行PC状態を確認。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-stun-jhk-max','スタン最大','stun','stun > j.HK > 5HP > CDR 4HK > 4HK > M Spiral Arrow > H Cannon Spike/SA3','opponent stun','corner',5,'スタン','Drive/SA別に撮影。','strategy','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-sa2-air-enhanced-arrow','SA2空中強化アロー','sa','airborne hit > SA2 > 4HK/5LK frame kill > 4HK > enhanced Spiral Arrow','airborne opponent','any',5,'SA2セットプレイ','記事記載+52/+53分岐。','strategy','https://note.com/finalmmin/n/nd2591c899510'),
('cammy-y4-dr-lift-enhanced-arrow','ラッシュリフト強化アロー','drive','DR 4HK > micro-walk 4HK > enhanced Spiral Arrow','standing opponent','any',5,'強化アローセット','当てる高さで+53/+54。','strategy','https://note.com/finalmmin/n/nd2591c899510'),
('cammy-y4-target-od-arrow','強PTC ODアロー','drive','5HP > 4MP~HK > OD Spiral Arrow','5HP target route','any',4,'強化アロー+54始動','記事記載+54。','strategy','https://note.com/finalmmin/n/nd2591c899510'),
('cammy-y4-modern-assist-l','M弱アシスト中アロー','assist','Assist L > automatic M Spiral Arrow','Modern Assist L','any',1,'モダン小技','自動分岐と手動停止を確認。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-assist-m-arrow','M中アシスト中アロー','assist','Assist M > manual M Spiral Arrow','Modern Assist M','any',2,'モダン中技','端維持の手動締め。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-assist-h-spike','M強アシスト強スパイク','assist','Assist H route > H Spiral Arrow > H Cannon Spike','Modern Assist H','corner',2,'モダン強確反','自動SA消費前の停止も確認。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-2m-cdr-assisth','M中足ラッシュ強アシスト','drive','2M > CDR > Assist H > H Spiral Arrow','Modern 2M','any',3,'モダン下段Drive','Drive3。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-strike-assistl','Mストライク弱アシスト','jump','one-button Cannon Strike > Assist L','Modern Cannon Strike hit','any',2,'モダンストライク','簡易入力補正と高さを記録。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-onebutton-aa','Mワンボタン対空スパイク','anti_air','one-button Cannon Spike anti-air','opponent jump','any',1,'モダン対空','簡易入力補正と強度。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-di-corner','M端DIアロー追撃','impact','DI wall splat > Assist H > H Spiral Arrow > one-button Cannon Spike','DI wall splat','corner',3,'モダン端DI','手動必殺との差。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-punish-sa3','M強アシストSA3','assist','Assist H punish route > automatic SA3','Modern punish counter','any',2,'モダンSA3','自動消費条件。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.cat,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,'Written/image-only collection; current-device capture required.',p.id,'unverified',r.ck,'draft'
from p28c_combo r join characters c on c.slug='cammy' cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

create temporary table p28c_setup(slug text,name text,starter text,seq text,adv text,pos text,descr text,ck text,src text) on commit drop;
insert into p28c_setup values
('cammy-y4-marrow-one-light','中アロー小技1回後三択','M Arrow after one light','dash > meaty 5MP / throw / shimmy','Source timing claim','any','弱攻撃1回からの中アローは前ステ中Pと投げが狙える。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-marrow-three-light','中アロー小技3回後起き攻め','M Arrow after three lights','dash > 2HP / walk throw','Spacing-specific','any','刻み数増加時の代替。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-harrow-dash-2hp','強アロー前ステ屈強P','H Spiral Arrow','dash > 2HP(meaty) > 5HP on hit','Source guard +3 claim','any','持続屈強P。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-corner-marrow-whiff-2lk','端中アロー小足空振り屈強P','corner M Spiral Arrow','whiff 2LK > 2HP(meaty)','Source guard +4 claim','corner','端専用フレーム消費。','strategy','https://w.atwiki.jp/sf6begin/pages/38.html'),
('cammy-y4-strike-ender-2hp','空中ストライク締め屈強P','j.MP > H Cannon Strike ender','dash > 2HP(meaty) > 5HP on hit','Meaty claim','any','通常／後方受け身を分離。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-harrow-backrise-hp','強アロー後方受け身強P','H Spiral Arrow, back rise','dash > 2HP guard > micro-back 5HP / immediate 5HP','Mash-trap claim','any','弱暴れ／中暴れへの差を確認。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-harrow-normalrise-mp','強アロー通常受け身中P','H Spiral Arrow, normal rise','dash > 2HP guard > 5MP > hit-confirm 5HP','Frame-trap claim','any','通常受け身用。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-harrow-low-throw','強アロー後の下段投げ','H Spiral Arrow','dash > 2HP guard > walk 2LK~LP / walk throw','Mixup','any','後ろ下がりとパリィへの択。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-corner-forwardthrow-loop','端前投げ柔道','corner forward throw','micro-walk > throw / 5MP / shimmy','Manual timing','corner','通常投げ後の三択。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-corner-forwardthrow-mp','端前投げ中P暴れ潰し','corner forward throw','micro-walk > 5MP > 5LK > M Arrow','Strike branch','corner','ジャンプ・バクステ狩り。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-backthrow-dr','後ろ投げラッシュ択','back throw','parry DR > strike / throw / shimmy','Rise-dependent','midscreen','後方受け身を含む距離確認。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-hknuckle-plus3','強ナックル+3連携','H Spin Knuckle guard','5MP/throw/block','Official frame must be checked','any','打撃投げと無敵待ち。','strategy','https://takukakugamer.com/sf6-cammy-howtouse/'),
('cammy-y4-strike-plus','低空ストライク有利択','low Cannon Strike guard','5LP/throw/shimmy','Height-dependent','any','高度ごとの有利不利。','strategy','https://takukakugamer.com/sf6-cammy-howtouse/'),
('cammy-y4-od-strike-plus','ODストライク後三択','OD Cannon Strike guard','5LP / throw / block','Height-dependent','any','ガード後の実フレームを記録。','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-hooligan-throw-tree','フーリガン投げ択','Hooligan approach','Fatal Leg Twister / Divekick / Razor Edge Slicer / feint','Reaction tree','any','投げ・中段・下段・フェイント。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-corner-od-hooligan-tree','端ODフーリリーサル択','corner 5HP guard','DI / OD L Hooligan throw / OD H Hooligan overhead','Source option table','corner','ガード・立ち／屈ガード・パリィ別。','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-enhanced-arrow54','強化アロー+54','DR 4HK high > enhanced Arrow / 5HP TC > OD Arrow','frame kill > meaty / safe jump / throw','Source +54 claim','any','+54群を個別撮影。','strategy','https://note.com/finalmmin/n/nd2591c899510'),
('cammy-y4-enhanced-arrow53','強化アロー+53','DR 4HK low > enhanced Arrow / SA2 frame kill route','frame kill > meaty / safe jump / throw','Source +53 claim','any','+53群。','strategy','https://note.com/finalmmin/n/nd2591c899510'),
('cammy-y4-enhanced-arrow52','強化アロー+52','air SA2 > enhanced Arrow','frame kill > meaty / safe jump / throw','Source +52 claim','any','+52群。','strategy','https://note.com/finalmmin/n/nd2591c899510'),
('cammy-y4-enhanced-arrow51','強化アロー+51','4MP~HK > DR 4HK > enhanced Arrow','frame kill > meaty','Source +51 claim','any','低頻度群も欠落させない。','strategy','https://note.com/finalmmin/n/nd2591c899510'),
('cammy-y4-enhanced-arrow-safejump','強化アロー詐欺飛び','enhanced Arrow air hit +52~54','forward jump attack / empty jump throw','5F/6F reversal timing check','any','フレーム別詐欺飛び可否。','strategy','https://note.com/finalmmin/n/nd2591c899510'),
('cammy-y4-modern-arrow-oki','M中アロー後起き攻め','Modern M Spiral Arrow','dash > Assist L/M / throw / block','Spacing-dependent','any','アシスト停止を含む。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-corner-throw','M端前投げ択','Modern corner forward throw','walk > Assist L / throw / shimmy','Manual timing','corner','ワンボタン対空を残す操作も確認。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-hooligan','Mワンボタンフーリ分岐','Modern Hooligan','throw / overhead / low / feint','Input/strength dependent','any','簡易入力と手動入力を分離。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-knuckle-plus','Mナックル後アシスト択','Modern H Spin Knuckle guard','Assist L / throw / block','Source frame claim','any','簡易入力補正と間合い。','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'oki',r.starter,r.seq,r.adv,r.pos,r.descr,'Verify both rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',p.id,'unverified',r.ck,'draft'
from p28c_setup r join characters c on c.slug='cammy' cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

create temporary table p28c_seq(slug text,name text,seq text,notes text,ck text,src text) on commit drop;
insert into p28c_seq values
('cammy-y4-mp-strike-throw','中P打撃投げ','5MP > hit: 5LP/5LK > Arrow / guard: throw / 5LP / shimmy','NH/CH branches must be separate.','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-cdr-hp-tree','中足ラッシュ強P分岐','2MK > CDR 5HP > hit: 2MP route / guard: throw, 2LP, shimmy','Standing check before 4HK route.','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-cdr-2hp-tree','ラッシュ屈強P分岐','CDR 2HP > hit: 5HP route / guard: strike, throw, shimmy','Gap before CDR 2HP must be recorded.','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-hp-cancel-tree','強Pキャンセル攻防','5HP guard > DI / H Spin Knuckle / OD Hooligan throw / overhead','Corner and midscreen branches differ.','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-arrow-oki-tree','アロー後受け身別分岐','Arrow knockdown > normal rise MP/throw / back rise HP/low/throw / shimmy','Do not merge rise timing.','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-corner-throw-tree','端柔道分岐','corner throw > throw / 5MP > Arrow / shimmy 5HP','Record throw-range character exceptions.','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-strike-height-tree','ストライク高度別分岐','Cannon Strike > hit confirm lights / guard advantage by height / punish if too high','Every height remains unverified.','strategy','https://takukakugamer.com/sf6-cammy-howtouse/'),
('cammy-y4-knuckle-projectile-tree','ナックル弾抜け分岐','M/H Spin Knuckle projectile punish > +7/+9 claim routes / guard pressure','Projectile timing and spacing required.','strategy','https://takukakugamer.com/sf6-cammy-howtouse/'),
('cammy-y4-hooligan-option-tree','フーリガン全派生','Hooligan > throw / Divekick / Slicer low / feint / delayed branch','Opponent can interrupt raw entry; record gaps.','strategy','https://note.com/finalmmin/n/ne02959b3c31e'),
('cammy-y4-enhanced-arrow-tree','強化アロー+51～54分岐','enhanced Arrow air hit > frame-specific safe jump / meaty / throw / bait','Preserve +51/+52/+53/+54 as separate setups.','strategy','https://note.com/finalmmin/n/nd2591c899510'),
('cammy-y4-resource-choice','ゲージ別締め選択','hit confirm > Arrow oki / Spike damage / SA1 corner / SA3 lethal / OD Arrow side switch','Record Drive/SA before and after.','strategy','https://note.com/matsunoki709/n/nd514588a2312'),
('cammy-y4-modern-assist-stop','Mアシスト確認停止','Assist L/M/H > stop on block / manual Arrow for oki / automatic SA on lethal','Automatic resource rules need capture.','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-onebutton-defense','Mワンボタン防御','jump/pressure read > one-button Cannon Spike / SA1 / SA3','Simple-input scaling and invulnerability.','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-hooligan-tree','Mフーリガン全派生','one-button/manual Hooligan > throw / overhead / low / feint','Input access and scaling differ.','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html'),
('cammy-y4-modern-drive-tree','Mゲージ別アシスト','2M CDR > Assist H / no Drive Assist L / SA3 auto route','Capture BO and full-resource branches.','modern_only','https://kamigame.jp/streetfighter6/page/270448875146349440.html');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,false,'record 4F gaps','record throw point','record shimmy spacing','record jump escape','record parry answer','record D-reversal','record reversal',r.notes,p.id,'unverified',r.ck,'draft'
from p28c_seq r join characters c on c.slug='cammy' cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Written/image claim; capture required.' from p28c_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Written/image claim; capture required.' from p28c_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Written decision tree; capture required.' from p28c_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select e.typ,e.id,s.id,'patch_context','2026-08-03 official Cammy baseline.' from(
 select 'combo' typ,x.id from p28c_combo r join combos x on x.slug=r.slug union all
 select 'setup',x.id from p28c_setup r join setups x on x.slug=r.slug union all
 select 'sequence',x.id from p28c_seq r join sequences x on x.slug=r.slug
)e cross join sources s where s.url='https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/cammy' on conflict(entity_type,entity_id,source_id) do nothing;

with e as(
 select 'combo' typ,x.id,x.slug,x.name,x.notation method,x.content_kind from p28c_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind from p28c_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind from p28c_seq r join sequences x on x.slug=r.slug
),p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【キャミィ撮影待ち】'||e.name,case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,'文章・画像から収集した攻略の現行成立を確定する。','advanced',15,c.id,'入力履歴・フレーム・ダメージ・Drive/SAを表示。操作、位置、受け身、CH/PC、技強度を指定。','4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,'左右各10回で成立、数値、位置、受け身、技強度、簡易補正、キャラ条件を記録。',20,'成立ならverified候補。不成立ならarchived。',p.id,'unverified',e.content_kind,'draft'
from e join characters c on c.slug='cammy' cross join p on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(
 select 'combo' typ,x.id,x.slug from p28c_combo r join combos x on x.slug=r.slug union all
 select 'setup',x.id,x.slug from p28c_setup r join setups x on x.slug=r.slug union all
 select 'sequence',x.id,x.slug from p28c_seq r join sequences x on x.slug=r.slug
)e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related strategy.' from trainings t join training_relations tr on tr.training_id=t.id join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id where t.player_character_id=(select id from characters where slug='cammy') on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,'2026-08-03版の成立、入力、数値、位置、受け身、技強度、簡易補正、Classic/Modern差を確認。' from trainings t where t.slug in(select 'training-'||slug from p28c_combo union all select 'training-'||slug from p28c_setup union all select 'training-'||slug from p28c_seq) on conflict(training_id) do nothing;

update character_content_packages p set rollout_status='complete',combo_status='complete',setup_status='complete',sequence_status='complete',training_status='complete',source_status='complete',patch_status='complete',verification_status='review',notes=concat_ws(E'\n',nullif(p.notes,''),'2026-09-01 phase28: Cammy written/image-only Classic and Modern collection completed; all remain draft/unverified with capture backlog.'),updated_at=now() where p.character_id=(select id from characters where slug='cammy');
