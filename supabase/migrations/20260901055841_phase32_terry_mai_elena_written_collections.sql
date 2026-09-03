-- Terry, Mai and Elena written/image-only strategy collections.
-- 2026-08-03 patch baseline. No video-derived inputs. All rows remain draft/unverified.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
('TERRY バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/terry','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current Terry patch baseline.'),
('テリー コンボ・起き攻めまとめ','https://note.com/dos236236/n/n6b48ac883e1c','community_guide','ドス','2024-09-26 00:00:00+00'::timestamptz,now(),'community','Detailed written starter, meter and oki table; current capture required.'),
('Cテリー初心者コンボ・起き攻め','https://one-days.org/sf6-terry1/','community_guide','one-days','2026-06-24 00:00:00+00'::timestamptz,now(),'community','Current-year written/image Classic routes.'),
('モダンテリー Year4対応','https://www.sukoreru.com/sf6-modern-terry','community_guide','スコれる','2026-08-26 00:00:00+00'::timestamptz,now(),'community','Post-patch Modern command, combo, oki and resource guide.'),
('モダンテリー攻略','https://note.com/aoinatu5/n/n836b7e71deeb','community_guide','aoinatu5',null::timestamptz,now(),'community','Written Modern Assist H oki and pressure branches.'),
('MAI バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/mai','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current Mai patch baseline.'),
('不知火舞 コンボ・起き攻めまとめ','https://note.com/dos236236/n/n42ac0d684926','community_guide','ドス','2025-03-29 00:00:00+00'::timestamptz,now(),'community','Detailed written Classic route and flame-stock table.'),
('不知火舞セットプレイ','https://takukakugamer.com/sf6-mai-setup/','community_guide','格ゲーブロガー拓','2026-03-01 00:00:00+00'::timestamptz,now(),'community','Written/image knockdown-specific oki catalog.'),
('モダン不知火舞 Year4対応','https://www.sukoreru.com/sf6-modern-mai','community_guide','スコれる','2026-08-05 00:00:00+00'::timestamptz,now(),'community','Post-patch Modern guide including OD Ryuenbu changes.'),
('モダン不知火舞起き攻めメモ','https://note.com/emesirna/n/nd3209e778527','community_guide','emesirna','2026-04-02 00:00:00+00'::timestamptz,now(),'community','Written Modern frame-kill and oki table.'),
('ELENA バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/elena','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current Elena patch baseline.'),
('エレナ コンボ・起き攻めまとめ','https://note.com/dos236236/n/nce65d6199ac4','community_guide','ドス','2025-06-12 00:00:00+00'::timestamptz,now(),'community','Detailed Classic starter, Lynx and oki table.'),
('エレナYear4セットプレイ','https://tatsujin.blog/sf6/elena/setplay/','community_guide','格ゲーの達人','2026-08-18 00:00:00+00'::timestamptz,now(),'community','Current-patch written/image oki guide.'),
('モダンエレナ完全攻略2026','https://note.com/nikotarosun/n/n2f263e8f2ef8','community_guide','にこ太郎',null::timestamptz,now(),'community','Modern commands, Lynx branches, Healing and assists.'),
('クラシックエレナ 2026.08.03対応','https://note.com/tigrex/n/ndc46a9f98883','community_guide','tigrex','2026-08-03 00:00:00+00'::timestamptz,now(),'community','Post-patch Classic confirmation and pressure notes.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p32_combo(char_slug text,slug text,name text,cat text,notation text,starter text,pos text,diff int,purpose text,conditions text,ck text,src text) on commit drop;
create temporary table p32_setup(char_slug text,slug text,name text,starter text,seq text,adv text,pos text,descr text,ck text,src text) on commit drop;
create temporary table p32_seq(char_slug text,slug text,name text,seq text,notes text,ck text,src text) on commit drop;

insert into p32_combo values
('terry','terry-y4-2lp-mburn','小P中バーン','light','2LP > 2LP > M Burn Knuckle','2LP','any',2,'小技基本','距離で刻み数。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-lights-hrising','小技強ライジング','light','2LP > 2LK > 5LP > H Rising Tackle','2LP','any',3,'小技火力','溜めと距離。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-5lp-ch-lcharge','弱P CHチャージ','counter','5LP(CH) > 5LK > L Power Charge > 2LP > 5LP > H Rising Tackle','5LP counter','any',4,'CH確認','先端距離。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-5lk-pc-mburn','弱K PC中バーン','punish','5LK(PC) > M Burn Knuckle','5LK punish counter','any',2,'5F確反','距離。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-5lk-pc-odcharge','弱K PC ODチャージ','punish','5LK(PC) > OD Power Charge > H Burn Knuckle','5LK punish counter','any',3,'5F Drive反撃','Drive2。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-2mp-mburn','屈中P中バーン','medium','2MP > M Burn Knuckle','2MP','any',2,'中技基本','間合い。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-2mp-odcharge-hburn','屈中P ODチャージ','drive','2MP > OD Power Charge > H Burn Knuckle','2MP','any',3,'Drive2運び','位置。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-2mp-cdr-hp-burn','屈中Pラッシュ強P','drive','2MP > CDR 5MK > 5HP(1) > H Power Charge > H Burn Knuckle','2MP','any',4,'主力Drive','強P一段。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-2mk-cdr-cmp','中足ラッシュ強ナックル','drive','2MK > CDR 2MP > 5HP(1) > H Power Charge > H Burn Knuckle','2MK','midscreen',4,'中足運び','距離で屈強P。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-firekick-hburn','ファイヤーキック強バーン','medium','2MK~2HK > H Burn Knuckle','Fire Kick target','any',2,'TC確認','ガード時分岐。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-firekick-odcrack-rising','ファイヤーキックODクラック','drive','2MK~2HK > OD Crack Shoot > H Rising Tackle','Fire Kick target','any',4,'TC Drive火力','高さ。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-2mp-ch-hrising','屈中P CH強ライジング','counter','2MP(CH) > H Rising Tackle','2MP counter','any',3,'置きCH','溜め。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-2mp-pc-charge-crack','屈中P PC端運び','punish','2MP(PC) > H Power Charge > H Crack Shoot > H Rising Tackle','2MP punish counter','any',4,'シミー反撃','クラック段数。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-5mp-ch-target','中P CHパワーダンク','counter','5MP(CH) > 5HP~HK~HK Power Dunk','5MP counter','any',3,'ラッシュ止め','TC確認。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-hp-charge-burn','強Pチャージバーン','heavy','5HP(1) > H Power Charge > H Burn Knuckle','5HP','any',3,'強攻撃基本','一段キャンセル。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-hp-charge-crack-rising','強Pチャージ端火力','heavy','5HP(1) > H Power Charge > delayed H Crack Shoot > H Rising Tackle','5HP','near corner',5,'端火力','クラック2/3hit。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-hp-charge-wave-dr','強P弾ラッシュ','drive','5HP(1) > H Power Charge > L Power Wave > DR 5MP > H Burn Knuckle','5HP','midscreen',5,'弾追撃','弾距離。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-hk-pc-dunk','強K PCパワーダンク','punish','5HK(PC) > DR 5MP~HK~HK Power Dunk','5HK punish counter','any',4,'差し返し','生ラッシュ。','strategy','https://one-days.org/sf6-terry1/'),
('terry','terry-y4-di-central','中央DI強Pバーン','impact','DI(PC) > 5HP(1) > H Power Charge > H Burn Knuckle','DI punish counter','midscreen',4,'中央DI','距離。','strategy','https://one-days.org/sf6-terry1/'),
('terry','terry-y4-di-wall-crack-rising','端DIクラック昇龍','impact','DI wall splat > 2HP > M Crack Shoot > H Rising Tackle','DI wall splat','corner',4,'端DI','壁高さ。','strategy','https://one-days.org/sf6-terry1/'),
('terry','terry-y4-di-side-switch','端背負いDI入れ替え','impact','DI(PC) > DR 5MP~MK~MK side switch','DI punish counter, corner back','corner',4,'入れ替え','記事+35候補。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-aa-hrising','強ライジング対空','anti_air','H Rising Tackle anti-air','opponent jump','any',2,'基本対空','溜めとめくり。','strategy','https://one-days.org/sf6-terry1/'),
('terry','terry-y4-aa-5mp-dunk','中P対空ダンク','anti_air','5MP anti-air > Power Dunk target','forward jump','any',3,'ラッシュ止め兼対空','高さ。','strategy','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-sa1-light','小技SA1','sa','2LP x2 > CDR 2LP > 2HP > M Power Charge > SA1','2LP','any',4,'SA1リーサル','Drive3。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-sa2-triple','トリプルゲイザー','sa','2LP > OD Quick Burn > Power Geyser > Twin Geyser > Triple Geyser','light confirm, SA2 full','any',5,'SA2最低保証','追加入力。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-sa3-max','二回ラッシュSA3','sa','2MP > CDR 5MK > 5HP > CDR 5MK > 5HP(1) > H Charge > H Crack > H Rising(1) > SA3','2MP','any',5,'SA3最大候補','Drive6。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-stun-basic','スタン端基本','stun','stun > j.HP > 2HP > H Power Charge > H Crack Shoot > H Rising Tackle','opponent stun','corner',5,'スタン火力','Drive別。','strategy','https://one-days.org/sf6-terry1/'),
('terry','terry-y4-stun-sa2','スタンSA2','stun','stun > j.HP > 5HP > OD Burn Knuckle > Triple Geyser','opponent stun, SA2','corner',5,'スタンSA2','追加入力と補正。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-drev-punish','Dリバ反撃','punish','blocked Drive Reversal > 2MP(PC) > H Charge > H Crack > H Rising','Drive Reversal punish','any',4,'Dリバ確反','PC状態。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-modern-assist-l','M弱アシスト','assist','Assist L automatic hit-confirm > H Rising Tackle','Modern Assist L','any',1,'M小技','自動確認。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-assist-m','M中アシスト','assist','Assist M > Power Charge route > SA','Modern Assist M','any',2,'M中技','ゲージ別。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-assist-h','M強アシスト','assist','Assist H > H Power Charge > H Crack/H Rising > automatic SA3','Modern Assist H','any',3,'M強技','初段・二段ヒット別。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-2m-firekick','M中足TC','medium','Modern 2M~H Fire Kick > H Burn Knuckle','Modern 2M','any',2,'M中足','ヒット確認。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-hk-pc','M強K PC','punish','Modern 5H kick(PC) > DR Assist M > Power Dunk','Modern 5H punish counter','any',4,'M差し返し','簡易補正。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-di-wall','M端DI','impact','DI wall splat > 2H > manual M Crack > one-button H Rising','DI wall splat','corner',4,'M端DI','手動強度。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-aa-onebutton','Mワンボタン対空','anti_air','one-button L Rising Tackle anti-air','opponent jump','any',2,'M対空','補正とめくり。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-sa2','MワンボタンSA2','sa','Assist confirm > manual/one-button SA2 > Twin/Triple follow-up','Modern confirm','any',4,'M SA2','簡易補正と追加入力。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-sa3','MワンボタンSA3','sa','Assist H confirm > one-button SA3/CA','Modern Assist H','any',3,'Mリーサル','自動消費。','modern_only','https://www.sukoreru.com/sf6-modern-terry');

insert into p32_setup values
('terry','terry-y4-throw22-drhp','中央前投げラッシュ強P','forward throw +22','DR 5HP(meaty) > hit-confirm / block throw-space check','Source guard +3 hit +6 claim','midscreen','後方受け身では投げが埋まらない。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-throw22-step','その場受け身前ステ+3','forward throw +22','dash > throw / lights / shimmy','Source +3','any','中央はその場受け身限定、端は密着。','strategy','https://one-days.org/sf6-terry1/'),
('terry','terry-y4-corner-throw-walk','端前投げ歩き択','corner forward throw','walk throw / 5HP / block / shimmy','Manual timing','corner','4Fを潰す投げはビタ押し主張。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-corner-throw-crack','端前投げ弱クラック','corner forward throw','dash > L Crack Shoot to catch tech/jump','Source +3 route','corner','投げ抜け・ジャンプ狩り。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-sweep-pc47-double-dash','大足PC前ステ2回','2HK punish counter +47','dash x2 > strike / throw / shimmy','Source +9','any','距離別。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-sweep-pc-roundwave','大足PCラウンドウェイブ','2HK punish counter +47','dash > Round Wave > strike / throw','Source +5','any','無敵・DI回答。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-sweep-pc-burn-meaty','大足PC強バーン持続','2HK punish counter +47','whiff 5LP > H Burn Knuckle meaty','Source +4 guard claim','any','先端・持続段階。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-rising27-dr','強ライジング後ラッシュ','H Rising Tackle +27','extended DR 5LP/5HP > strike-throw','Route-specific','any','受け身別。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-burn30-dash','バーン+30前ステ択','M Burn/H Burn air hit +30','dash > micro-walk throw / strike / shimmy','Source +12 after dash','any','空中ヒット差を分離。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-burn30-dr-overhead','バーン+30ラッシュ中段','M Burn/H Burn air hit +30','DR overhead > combo / throw feint','Meaty claim','any','4F・投げへの結果。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-dunk25-dash','パワーダンク+25','Power Dunk +25','dash > strike / throw / backwalk by rise','Source +6','any','その場と後方受け身でシミー差。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-odwave-shield','ODウェイブ弾重ね','H Charge > OD Power Wave route','DR behind projectile > 5MP / throw / shimmy','Projectile cover','midscreen','弾と打撃の隙間。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-side-switch35-burn','入れ替え強バーン持続','corner-back DI side-switch +35','H Burn Knuckle meaty','Source guard +5 claim','corner','持続位置。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-sa1-air-burn','SA1空中ヒット強バーン','SA1 air hit +33~34','H Burn Knuckle meaty / DR overhead','Source +3~4 guard claim','near corner','高度差。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-sa3-corner-di','端SA3インパクト連携','corner SA3 +22','extended DR 2MP > DI / DR 5HP(meaty) > 5HP(1) > DI','Source 3F parry-gap claim','corner','連ガ・当身・DIを分離。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-ca-corner-di','端CAインパクト連携','corner CA +37','dash > extended DR 2MP > DI','Source +18 after dash','corner','3F当身と無敵。','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-burn-spaced-plus','バーン先端有利','spaced M/H Burn Knuckle guard','5MP / throw-range check / whiff punish bait','Distance-dependent','any','密着不利と先端有利を分離。','strategy','https://one-days.org/sf6-terry1/'),
('terry','terry-y4-modern-assisth-oki','M強アシスト起き攻め','Modern Burn/Power Dunk ender','DR Assist H > Assist M / 5M / throw','Route-specific','any','自動確認。','modern_only','https://note.com/aoinatu5/n/n836b7e71deeb'),
('terry','terry-y4-modern-throw-drhp','M前投げラッシュ強','Modern forward throw','DR Assist H/5H > Assist confirm / throw','+22 family','any','後方受け身。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-burn30','Mバーン後択','Modern Burn ender','dash > Assist M / throw / shimmy','+30 family','any','手動強度別。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-wave-shield','M弾追い','Modern Power Wave','DR behind wave > Assist M / throw / anti-air ready','Projectile cover','midscreen','簡易弾とOD版。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-onebutton-bait','Mワンボタン無敵待ち','Modern knockdown','Assist L meaty / block reversal / punish','Bait branch','any','操作余裕。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-sa2-oki','M SA2後','Modern SA2/Twin/Triple hit','DR strike / throw / wave cover','Follow-up-specific','any','追加ゲイザー段数別。','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-corner-throw','M端投げ択','Modern corner forward throw','dash > throw / Assist L / weak Crack substitute','Manual timing','corner','弱クラック欠落を考慮。','modern_only','https://www.sukoreru.com/sf6-modern-terry');

insert into p32_seq values
('terry','terry-y4-firekick-tree','ファイヤーキック分岐','2MK~2HK > hit H Burn / OD Crack / CDR; guard L Burn / H Crack / CDR / stop','Record punish and DI gaps.','strategy','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-powerwave-tree','パワーウェイブ分岐','L/M/H/OD Power Wave > walk / DR shield / anti-jump wait / Round Wave pressure','Projectile recovery and DI risk.','strategy','https://one-days.org/sf6-terry1/'),
('terry','terry-y4-burn-tree','バーンナックル距離分岐','M/H Burn Knuckle > combo end / spaced plus / meaty / whiff-punish risk','Do not merge close and tip frames.','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-charge-tree','パワーチャージ締め選択','Power Charge > H Burn oki / Crack-Rising damage / Wave-DR / SA','Position and resources.','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-dunk-tree','パワーダンク運用','5MP target > Power Dunk > +25 oki / SA gain versus alternate ender','Track just timing and SA gain.','strategy','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-throw-tree','前投げ受け身分岐','forward throw +22 > normal-rise dash / back-rise DR / corner walk-dash choices','Normal and back rise differ.','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-dr-tree','ラッシュ択','DR > 5HP meaty / 2MK low / overhead / throw / guard bait','Record hit/guard plus and range.','strategy','https://one-days.org/sf6-terry1/'),
('terry','terry-y4-aa-tree','対空選択','H Rising / 5MP Power Dunk / air-to-air / SA1','Charge, height and cross-up.','strategy','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-sa2-tree','SA2追加入力判断','Power Geyser > stop / Twin > Triple based on confirm, SA and lethal','Record fixed follow-up damage claims.','strategy','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-resource-tree','ゲージ別締め','no Drive Burn / Drive2 Charge-Crack / Drive3 CDR / SA1 / SA2 Triple / SA3','Damage, corner and oki tradeoff.','strategy','https://note.com/dos236236/n/n6b48ac883e1c'),
('terry','terry-y4-modern-assist-stop','Mアシスト停止','Assist L/M/H > stop on block / manual ender / automatic SA','Automatic resource use.','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-firekick-tree','Mファイヤーキック分岐','2M target > hit Burn / guard H Crack / CDR / stop','Missing weak-medium Crack affects options.','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-defense-tree','Mワンボタン防御','jump/pressure read > L Rising / SA1 / guard','Scaling and invulnerability.','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-sa2-tree','Mゲイザー分岐','one-button/manual SA2 > stop / Twin / Triple / oki','Input scaling and extra commands.','modern_only','https://www.sukoreru.com/sf6-modern-terry'),
('terry','terry-y4-modern-resource-tree','Mゲージ判断','Assist hit > basic / OD route / SA2 / automatic SA3 / BO safe ender','Record automation and BO behavior.','modern_only','https://www.sukoreru.com/sf6-modern-terry');

insert into p32_combo values
('mai','mai-y4-2lp-lhissatsu','小P弱忍蜂','light','2LP > 2LP > L Hissatsu Shinobi Bachi','2LP','any',2,'小技基本','記事+27。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-lights-odshinobi-air','小技OD忍蜂空中追撃','drive','2LP > 5LP > OD Shinobi Bachi > j.MP > Musasabi no Mai','2LP','any',4,'小技Drive','記事+32~33。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-lktc-musasabi','弱KTCムササビ','light','5LK~LK~LK > Musasabi no Mai','5LK','any',3,'+41~42締め','距離・焔強化別。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-lktc-odmusasabi-shoryu','弱KTC ODムササビ昇竜','drive','5LK~LK~LK > OD Musasabi > H Hissho Ryuuenjin','5LK','any',4,'小技火力','高さ。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-lp-ch-2mk-hshinobi','弱P CH中足強忍蜂','counter','5LP(CH) > 2MK > H Shinobi Bachi','5LP counter','any',3,'CH確認','記事+22。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-mp-hshinobi','中P強忍蜂','medium','5MP > H Shinobi Bachi','5MP','any',2,'中技基本','記事+22。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-mp-odshinobi-air','中P OD忍蜂空中','drive','5MP > OD Shinobi Bachi > j.MP > Musasabi/H Ryuuenjin','5MP','any',4,'中技Drive','締め別。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-2mk-cdr-4hk','中足ラッシュ引強K','drive','2MK > CDR 4HK > 2MP > H Ryuuenbu > L Shinobi Bachi','2MK','any',4,'中足基本','記事+30。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-2mk-cdr-lktc','中足ラッシュ弱KTC','drive','2MK > CDR 4HK > 5LK~LK~LK > Musasabi','2MK','any',4,'中足+42締め','立ち確認。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-2mp-ch-2mk','屈中P CH中足','counter','2MP(CH) > 2MK > H Shinobi Bachi','2MP counter','any',3,'置きCH','距離。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-2mp-pc-hp','屈中P PC強P','punish','2MP(PC) > 5HP > H Ryuuenbu > L Shinobi Bachi','2MP punish counter','any',4,'シミー反撃','記事+30。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-2mp-pc-odryuen-sa','屈中P PC OD龍炎舞','punish','2MP(PC) > 5HP > OD Ryuuenbu > M Shinobi/SA','2MP punish counter','any',5,'PC火力','Year4中央制限を撮影。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-jhp-2mp-ryuen','飛び強P龍炎舞','jump','j.HP > 2MP > H Ryuuenbu > L Shinobi Bachi','j.HP','any',3,'飛び基本','記事+30。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-hp-pc-odfan-corner','端強P PC溜めOD扇','punish','5HP(PC) > charged OD Kachousen~forward > j.HP > 5HP > flame route','5HP punish counter, corner','corner',5,'端シミー最大','焔数別。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-hk-pc-dr-hp','強K PCラッシュ','punish','5HK(PC) > DR 5HP > H Ryuuenbu > L Shinobi Bachi','5HK punish counter','any',4,'差し返し','位置。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-dr-overhead-lktc','ラッシュ中段+42','drive','DR 6MP > 5LK~LK~LK > Musasabi','DR 6MP','any',4,'中段始動','記事+42。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-dr-overhead-odryuen','ラッシュ中段SA択','drive','DR 6MP > 2MP > OD Ryuuenbu > SA1/SA2/SA3','DR 6MP','any',5,'中段リーサル','Year4位置制限。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-di-central','中央DI龍炎舞','impact','DI(PC) > 5HP > H Ryuuenbu > L Shinobi Bachi','DI punish counter','midscreen',4,'中央DI','記事+30。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-di-air-musasabi','DI OD龍炎空中追撃','impact','DI(PC) > 5HP > OD Ryuuenbu > j.MP > Musasabi','DI punish counter','any',5,'DI運び','有利位置変動。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-di-wall-target-shoryu','端DI星孔雀昇竜','impact','DI wall splat > 4HK~HK > M Hissho Ryuuenjin','DI wall splat','corner',4,'端DI','記事+30。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-aa-hshoryu','強飛翔龍炎陣対空','anti_air','H Hissho Ryuuenjin anti-air','opponent jump','any',2,'基本対空','高さ。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-air-mp-odmusasabi-sa2','空対空ODムササビSA2','anti_air','j.MP > OD Musasabi > SA2','air-to-air j.MP','any',5,'空対空最大候補','記事4040候補。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-kachousen-fall-drhp','花蝶扇下りラッシュ','projectile','falling Kachousen air hit > DR 5HP > H Ryuuenbu > L Shinobi','falling fan air hit','any',4,'弾ヒット確認','落下位置。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-sa1-basic','SA1焔獲得','sa','2MP(PC) > 5HP > OD Ryuuenbu > SA1','2MP punish counter','any',4,'SA1・焔獲得','Year4中央可否。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-sa2-carry','SA2端運び','sa','5HP > OD Ryuuenbu > SA2 > corner H Ryuuenjin','5HP','any',5,'SA2運び','端到達距離。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-sa3-basic','SA3締め','sa','2MK > CDR 4HK > 2MP > H Ryuuenbu > L Shinobi > SA3','2MK','any',5,'SA3リーサル','補正。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-flame3-corner','焔3端強化コンボ','flame','5HP(PC) > enhanced charged OD Kachousen > j.HP > 5HP > enhanced H Ryuuenbu > enhanced M Ryuuenbu > H Ryuuenjin','flame stock 3, corner','corner',5,'焔3火力','ストック消費順。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-flame5-max','焔5端最大候補','flame','5HP(PC) > enhanced charged OD Fan > j.HK > 5HP > CDR 5HP > enhanced OD Fan > j.HK > enhanced H Ryuuenbu > enhanced M Fan > enhanced L Shinobi > SA3','flame stock 5, Drive5, corner','corner',5,'焔最大','記事6307候補。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-stun-basic','スタン昇竜','stun','stun > j.HP > 4HK~HK > M Hissho Ryuuenjin','opponent stun','corner',4,'スタン基本','記事+30。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-stun-sa2','スタンSA2','stun','stun > j.HP > 5HP > OD Ryuuenbu > SA2 > H Ryuuenjin','opponent stun, SA2','corner',5,'スタンSA2','Drive別。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-drev-punish','Dリバ反撃','punish','blocked Drive Reversal > 2MP(PC) > 5HP > H Ryuuenbu > L Shinobi','Drive Reversal punish','any',4,'Dリバ確反','PC状態。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-modern-assist-l','M弱アシスト','assist','Assist L automatic route > L Shinobi/Musasabi','Modern Assist L','any',1,'M小技','自動確認。','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-assist-m','M中アシストYear4','assist','Assist M > OD Shinobi > air follow-up > SA2 option','Modern Assist M','any',3,'M中技','Year4中央OD龍炎舞削除後。','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-assist-h','M強アシスト','assist','Assist H > H Ryuuenbu > L Shinobi / automatic SA','Modern Assist H','any',3,'M強技','焔有無。','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-2m-cdr','M中足ラッシュ','drive','Modern 2M > CDR 4H > Assist M > H Ryuuenbu > L Shinobi','Modern 2M','any',4,'M中足','中P欠落の代替。','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-dr-overhead','Mラッシュ中段','drive','DR 6M > L target > Musasabi','Modern DR overhead','any',4,'M+42締め','簡易表記。','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-di-wall','M端DI','impact','DI wall splat > 4H target > M Ryuuenjin/SA1','DI wall splat','corner',4,'M端DI','焔獲得分岐。','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-aa-onebutton','Mワンボタン対空','anti_air','one-button OD Ryuuenjin / SA1 anti-air','opponent jump','any',2,'M対空','SA1は対空無敵のみ。','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-flame-sa2','M焔強化SA2','sa','Assist confirm > enhanced route > one-button/manual SA2','Modern, flame stock','any',5,'M焔リーサル','簡易補正。','modern_only','https://www.sukoreru.com/sf6-modern-mai');

insert into p32_setup values
('mai','mai-y4-lshinobi27-4hk','弱忍蜂+27引強K持続','L Shinobi ground hit +27','dash > 4HK(meaty) > target confirm','Source hit +5 guard +1 claim','any','単発確認。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-lshinobi27-throw','弱忍蜂+27歩き投げ','L Shinobi ground hit +27','dash > micro-walk throw / shimmy','Source +9 after dash','any','体感調整。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-lshinobi27-dr-overhead','弱忍蜂ラッシュ中段','L Shinobi ground hit +27','DR 6MP meaty/trade > 5HP conversion','4F trade claim','any','相打ち後有利。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-lshinobi-air30','空中弱忍蜂+30','H Ryuuenbu > L Shinobi air hit','dash > walk throw / strike / shimmy','Source +12 after dash','any','ラッシュ中段も分離。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-mshinobi23','中忍蜂前ステ+5','M Shinobi ground hit','dash > throw / 2LP(meaty) / shimmy','Source +5','any','屈弱P hit+6 guard+1 claim。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-hshinobi22','強忍蜂前ステ+4','H Shinobi ground hit','dash > throw / 4HK trade / shimmy','Source +4','any','3F以上遅らせ投げへシミー。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-hshinobi-dr4hk','強忍蜂ラッシュ引強K','H Shinobi ground hit','DR 4HK last-active > 5HP combo','Source hit +11 guard +7 claim','any','強制立ち。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-hshinobi-di','強忍蜂インパクト重ね','H Shinobi ground hit','Drive Impact meaty','Covered claim','any','無敵・SA回答。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-musasabi41-safejump','ムササビ+41詐欺飛び','L target > Musasabi +41','forward jump attack / empty jump guard','6F safe-jump claim','any','5F対空無敵に負ける。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-enhanced-musasabi42','強化ムササビ+42詐欺飛び','enhanced Musasabi +42','forward jump attack / empty jump guard','5F safe-jump claim','any','焔ストック消費。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-musasabi-double-dash','ムササビ前ステ2回','Musasabi +41~42','dash x2 > throw / strike / shimmy','Source +5~6','any','位置差。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-forwardthrow-corner','端前投げ+21','corner forward throw','dash > throw / 2MP / 5LK / shimmy','Source +3','corner','柔道。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-backthrow-dr-low','端背負い後投げ','corner-back back throw +17','DR 2LK(meaty) > throw / 2MP','Source hit +8 guard +4 claim','corner','ラッシュ見て無敵可。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-odshinobi-musasabi33','OD忍蜂空中+33','OD Shinobi > j.MP > Musasabi','dash > walk throw / charged fan / DR overhead','Source +32~33','any','端で中足空振り。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-ryuen-shinobi30','龍炎舞弱忍蜂+30','H Ryuuenbu > L Shinobi','dash > walk throw / DR overhead / charged fan','Source +30','any','端は屈中P空振り+4~5。','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-corner-mryuen35','端中龍炎舞+35','corner M Ryuuenbu hit','whiff 5LK > 6MP meaty','Source hit +4 claim','corner','持続中段。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-corner-airshoryu30','端空中昇竜+30','corner M/H Ryuuenjin air hit','whiff 2MP > throw / shimmy; whiff light > L Ryuuenbu meaty','Source +4~5 / +17','corner','弱龍炎舞 hit+7 guard0 claim。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-corner-musasabi33','端ムササビ+33','corner j.MP > Musasabi','whiff 2MK > throw / 2LP meaty','Source +5','corner','屈中P消費別。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-corner-target48','端星孔雀+48','corner 4HK~HK','whiff 5MK > L Ryuuenbu last-active','Source hit +9 guard +2 claim','corner','重要有利連携。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-corner-hryuen43','端強龍炎舞+43','corner H Ryuuenbu','whiff 5LP x2 > 6MP meaty','Meaty overhead','corner','弱KTCへ。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-held-fan-rps','ホールド花蝶扇択','held Kachousen guard','throw before falling fan / 2LK low / stand guard bait / micro-charge throw','Source initial -1','any','ジャスパ時-20主張。','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-modern-lshinobi30','M弱忍蜂+30系','Modern H Ryuuenbu > L Shinobi','dash > Assist M / throw / shimmy','Source +30~31 family','any','アシスト強締め差。','modern_only','https://note.com/emesirna/n/nd3209e778527'),
('mai','mai-y4-modern-flame-safejump','M強化ムササビ詐欺飛び','Modern enhanced Musasabi +42','forward jump H / empty jump guard','+42 family','any','ワンボタン無敵。','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-held-fan','Mホールド扇択','Modern held Kachousen guard','2L / throw / Assist M / parry bait','Strength-specific','any','簡易強度と焔。','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-corner-throw','M端柔道','Modern corner forward throw','dash > throw / Assist L / 2M / shimmy','Source +3','corner','中P欠落。','modern_only','https://www.sukoreru.com/sf6-modern-mai');

insert into p32_seq values
('mai','mai-y4-flame-cycle','焔ストック循環','SA1/route gain > enhanced fan-Ryuuenbu-Ryuuenjin-SA2 spend > regain decision','Track stock before and after every hit.','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-kachousen-tree','花蝶扇強度分岐','L/M/H/OD/held/enhanced Kachousen > zoning / falling cover / approach / throw-low RPS','Strength changes fall timing.','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-shinobi-tree','忍蜂締め分岐','L +27 / M dash+5 / H dash+4 / OD air route > damage or oki','Ground and air hit separate.','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-musasabi-tree','ムササビ分岐','Musasabi +41/42 > safe jump / dash x2 strike-throw / OD follow-up / SA2','Enhanced state changes safe-jump.','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-ryuenbu-tree','龍炎舞強度分岐','L poke / M-H combo and oki / OD corner-only Year4 / enhanced extensions','Central OD restriction is current-patch critical.','strategy','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-dr-tree','ラッシュ択','DR > 6MP overhead / 2LK low / 4HK meaty / throw / shimmy','Record true strings and trade conversions.','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-corner-tree','端焔鳥籠','corner knockdown > throw / 2MP / held fan / Ryuuenbu meaty / flame conversion','Record jump, parry, D-reversal and SA.','strategy','https://takukakugamer.com/sf6-mai-setup/'),
('mai','mai-y4-sa-defense-tree','SA防御選択','jump > SA1 anti-air; grounded reversal > OD Ryuuenjin; SA2 projectile/confirm','SA1 no longer full invincible.','strategy','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-resource-tree','ゲージ・焔判断','no Drive Shinobi / Drive2 OD air route / Drive3 CDR / SA1 stock / SA2 carry / SA3 lethal','Track flame and corner together.','strategy','https://note.com/dos236236/n/n42ac0d684926'),
('mai','mai-y4-modern-assist-stop','Mアシスト停止','Assist L/M/H > stop on block / manual stock ender / automatic SA','Year4 Assist M ender changed.','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-fan-tree','M花蝶扇分岐','one-button/manual fan > tap / hold / OD / enhanced / approach','Input scaling and strength.','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-flame-tree','M焔消費','stock > enhanced Ryuuenbu / fan / Ryuuenjin / SA2 > preserve or spend','Automatic routes may spend resources.','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-defense-tree','Mワンボタン防御','jump read > SA1/OD Ryuuenjin; ground pressure > OD Ryuuenjin / block','SA1 anti-air-only invulnerability.','modern_only','https://www.sukoreru.com/sf6-modern-mai'),
('mai','mai-y4-modern-oki-tree','Mダウン別起き攻め','+27/+30/+31/+33/+41/+42 > dash / frame kill / safe jump / held fan','Do not merge frame families.','modern_only','https://note.com/emesirna/n/nd3209e778527'),
('mai','mai-y4-modern-resource-tree','Mゲージ判断','Assist hit > basic / OD Shinobi air / flame SA1 / SA2 / automatic SA3','Record scaling, stock and BO.','modern_only','https://www.sukoreru.com/sf6-modern-mai');

insert into p32_combo values
('elena','elena-y4-2lp-lspin','小P弱スピン','light','2LP > 2LP > 5LP > L Spin Scythe','2LP','any',2,'小技基本','派生／出し切り。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-lights-hrising','小技強昇竜','light','2LP > 2LP > 5LK > H Scratch Wheel','2LP','any',3,'小技火力','溜め不要。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-lights-lrhino','小技立ち確認弱ライノ','light','2LP x2(standing) > 5LK > L Rhino Horn','2LP, standing opponent','any',3,'+39締め','しゃがみ不成立。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-lp-ch-mktc','弱P CH中KTC','counter','2LP(CH) > 5MK~HK > M Spin Scythe','2LP counter','any',3,'CH確認','記事+43。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-lk-pc-mrhino','弱K PC中ライノ','punish','5LK(PC) > M Rhino Horn','5LK punish counter','any',2,'5F確反','記事+39。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-mktc-mspin','中KTC中スピン','medium','5MK~HK > M Spin Scythe','5MK','any',2,'中技基本','記事+43。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-mktc-odspin-harvest','中KTC強化ハーベスト','drive','5MK~HK > OD Spin~Lynx > enhanced Harvest Circle(M) > L Rhino','5MK','any',5,'主力Drive','記事+40。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-mktc-odspin-sa1','中KTC SA1昇竜','sa','5MK~HK > OD Spin~Lynx > enhanced Harvest(M) > SA1 > H Scratch Wheel','5MK','any',5,'SA1火力','位置。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-2mp-lmoonglide','屈中P弱ムーン','medium','2MP > L Moon Glide','2MP','any',2,'置き入れ込み','記事+39。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-2mp-odmoon-sa2','屈中P ODムーンSA2','sa','2MP > OD Moon Glide > SA2','2MP','any',4,'4000候補','補正。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-2mp-cdr-mk-hp','屈中Pラッシュ強スピン','drive','2MP > CDR 5MK > 2HP > H Spin Scythe > L Rhino','2MP','any',4,'置きDrive','記事+38~39。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-6hp-target','前強PTC','heavy','6HP~HP~HP','6HP','any',2,'差し込み','記事+40。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-hk-pc-odrhino-sa2','強K PC ODライノSA2','punish','5HK(PC) > OD Rhino Horn > SA2','5HK punish counter','any',4,'差し返し','位置と段数。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-hptc-pc-dr','強PTC PCラッシュ','punish','5HP~HP(PC) > DR 2MP > M Spin~Lynx > enhanced Harvest(M) > L Rhino','5HP target punish counter','any',5,'PC基本','記事+39~40。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-2mp-pc-hspin','屈中P PC強スピン','punish','2MP(PC) > H Spin Scythe > L Rhino','2MP punish counter','any',4,'シミー安定','位置。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-dr-overhead-mktc','ラッシュ中段中KTC','drive','DR 6MK > 5MK~HK > OD Spin route','DR 6MK','any',4,'中段始動','持続段階。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-dr-low-mktc','ラッシュ中足中KTC','drive','DR 2MK > 5MK~HK > M Spin Scythe','DR 2MK','any',3,'下段始動','現行中足調整。','strategy','https://note.com/tigrex/n/ndc46a9f98883'),
('elena','elena-y4-di-central','中央DI強化ハーベスト','impact','DI(PC) > 2MP > M Spin~Lynx > enhanced Harvest(M) > L Rhino','DI punish counter','midscreen',5,'中央DI','記事+39。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-di-wall-rhino-shoryu','端DIライノ昇竜','impact','DI wall splat > 2MP > M Spin~Lynx > enhanced Harvest(M) > L Rhino > M Scratch Wheel','DI wall splat','corner',5,'端DI','記事+25。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-aa-lwheel','弱昇竜対空','anti_air','L Scratch Wheel anti-air','opponent jump','any',2,'基本対空','記事+37以上。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-aa-2hp-lynx','屈強P対空リンクス','anti_air','2HP anti-air > Lynx Song > landing pressure','opponent jump','any',3,'通常対空攻め','高さ。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-air-mp-hp-wheel','空対空TC強昇竜','anti_air','j.MP~HP > H Scratch Wheel','air-to-air','any',4,'空対空火力','近め限定。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-air-mp-odrhino-sa2','空対空ODライノSA2','anti_air','j.MP~HP > OD Rhino Horn > SA2','air-to-air','any',5,'空対空最大候補','高度。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-lynx-harvest-rhino','強化ハーベスト弱ライノ','special','OD Spin > Lynx Song > enhanced Harvest Circle(M) > L Rhino','OD Spin hit','any',5,'固有派生基本','リンクス方向。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-enhanced-mallet','強化マレット小技','special','enhanced Mallet Smash > 2LP x3 > L Spin Scythe','enhanced Mallet hit','any',4,'中段始動','記事+34。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-enhanced-leopard','強化レオパードODライノ','special','enhanced Leopard Snap > OD Rhino Horn > SA2/SA3','enhanced Leopard hit','any',5,'派生大火力','端昇竜分岐。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-sa1-wheel','SA1強昇竜','sa','M Spin~Lynx > enhanced Harvest(M) > SA1 > H Scratch Wheel','medium confirm','any',5,'SA1追撃','地上／空中。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-sa2-healing','SA2ヒーリング','sa','2MP > OD Moon Glide > SA2 > Healing follow-up','2MP, health recoverable','any',4,'回復選択','記事回復値は現行確認。','strategy','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-sa3-rhino','SA3ライノ締め','sa','5MK~HK > OD Spin~Lynx > enhanced Harvest(M) > M Rhino > SA3','5MK','any',5,'SA3リーサル','CA差。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-stun-basic','スタン強スピン','stun','stun > j.HP > 2HP > H Spin > L Rhino > H Scratch Wheel','opponent stun','corner',5,'スタン基本','昇竜強度別。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-stun-sa2','スタンSA2','stun','stun > j.HP > 2HP > H Spin > delayed OD Rhino(3) > SA2','opponent stun, SA2','corner',5,'スタンSA2','2/3hit差。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-drev-punish','Dリバ反撃','punish','blocked Drive Reversal > 5MK(PC) > 2MK~HK > L Moon Glide','Drive Reversal punish','any',4,'Dリバ確反','記事+39。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-modern-assist-l','M弱アシスト','assist','Assist L automatic hit-confirm > L Spin Scythe','Modern Assist L','any',1,'M小技','自動確認。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-assist-m','M中アシスト','assist','Assist M > Spin/Lynx enhanced route > SA','Modern Assist M','any',3,'M中技','ゲージ別。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-assist-h','M強アシスト','assist','Assist H > OD Spin > enhanced Harvest > automatic SA','Modern Assist H','any',3,'M強技','自動Drive/SA。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-2m-cdr','M中足ラッシュ','drive','Modern 2M > CDR Assist M > 2H > H Spin > L Rhino','Modern 2M','any',4,'M中足','大K欠落。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-dr-overhead','Mラッシュ中段','drive','DR 6M > Assist M > enhanced route','Modern DR overhead','any',4,'M中段','簡易表記。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-odlynx-projectile','MワンボタンODコロ弾抜け','punish','one-button OD Lynx Song projectile bypass > enhanced Harvest(M) > H Scratch/SA','opponent projectile','any',4,'M弾抜け','反応距離。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-di-wall','M端DI','impact','DI wall splat > Assist M/H > enhanced Harvest > L Rhino > Scratch Wheel','DI wall splat','corner',5,'M端DI','自動SA分岐。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-aa-onebutton','Mワンボタン対空','anti_air','one-button M Scratch Wheel / SA1 anti-air','opponent jump','any',2,'M対空','補正。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-sa2-heal','MワンボタンSA2回復','sa','one-button SA2 projectile punish > Healing','Modern SA2, recoverable health','any',3,'M回復','簡易補正でも回復値別管理。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8');

insert into p32_setup values
('elena','elena-y4-throw24-drmk','中央前投げラッシュ中K','forward throw +24','extended DR 5MK(meaty) > 2HP / throw / shimmy','Source guard +5 hit +9 claim','midscreen','後方受け身は攻めなし。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-throw24-drhp','前投げラッシュ強P','forward throw +24','DR 5HP(meaty) > 2MP on hit / shimmy','Source guard +4 hit +8 claim','any','投げ間合い外。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-corner-throw-dash','端前投げ前ステ','corner forward throw +24','dash(+4) > 5MK~HK / throw timing / shimmy','Source +4','corner','ガード時ムーン分岐。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-corner-throw-overhead','端前投げラッシュ中段','corner forward throw','DR 6MK late hit > combo','Source wake-up 7F hit claim','corner','遅らせ投げ耐性。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-lspin34-dash6hp','弱スピン+34前ステ前強P','L Spin Scythe +34','dash > 6HP meaty','Source +14 after dash','any','TC確認。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-lspin34-dr','弱スピン+34ラッシュ中下','L Spin Scythe +34','extended DR 6MK / 2MK / throw','Frame-specific','any','端は中足空振り+5。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-rhino39-mallet','ライノ+39強化マレット','L/M Rhino ground hit +39','L Lynx > enhanced Mallet meaty > 2LP combo','Source hit +4 guard -1 claim','any','ライノから歩き投げ不可主張。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-moon39-mallet','弱ムーン+39強化マレット','L Moon Glide +39','L Lynx > enhanced Mallet meaty > 2LP combo','Source hit +4 guard -1 claim','any','前ステ歩き投げ分岐。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-plus40-lynx','+40リンクス派生重ね','6HP target / L Rhino route +40','L Lynx > Lynx Swirl > enhanced light follow-up meaty','Source overlap claim','any','停止-4/-5分岐。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-plus40-dr-low','+40前ステラッシュ中足','+40 knockdown','dash > DR 2MK(meaty) > combo','Source hit +9 guard +1 claim','any','距離。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-mspin42-safejump','中スピン+42詐欺飛び','M Spin Scythe +42','forward jump attack / empty jump guard','5F safe-jump claim','corner','中央派生別。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-mspin42-lynx','中スピン+42強リンクス','M Spin Scythe +42','H Lynx > Lynx Swirl > enhanced branch','Route-specific','any','中段・下段・停止。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-mspin43-double-dash','中KTC中スピン+43','5MK~HK > M Spin +43','dash x2(+3) > throw / 5MK / shimmy by rise','Source +3','any','後方受け身のみシミー可主張。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-corner-plus25-framekill','端+25弱K空振り','corner M Scratch ender +25','whiff 5LK(+7) > 5MK(meaty)','Source guard +3 hit +7 claim','corner','投げ間合い外。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-corner-plus36-lynx','端+36弱リンク消費','corner L Scratch/Rhino ender +36','L Lynx(+8) > 5MK(meaty)','Source guard +4 hit +8 claim','corner','投げ間合い・シミー。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-corner-plus39-hpwhiff','端+39強P空振り','corner route +39','whiff 5HP > throw / 5MK / shimmy','Source +4','corner','投げ間合い。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-corner-plus42-framekill','端+42前ステ屈弱P空振り','corner +42 knockdown','dash > whiff 2LP(+8) > 5MK(meaty)','Source guard +4 hit +8 claim','corner','シミー可。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-sweep-pc46','大足PC+46','2HK punish counter +46','dash x2 / Lynx / DR strike-throw','Frame family','any','正確な消費は撮影。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-sa1-plus42','SA1+42','SA1 ground hit +42','safe jump / H Lynx branch / dash frame kill','+42 family','any','強昇竜追撃有無別。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-sa2-healing-plus1','SA2ヒーリング後+1','SA2 > Healing','block / 4F / OD reversal / backstep','Source +1 claim','any','回復量と反撃。','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-lynx-pressure','リンクシング強化択','L/OD Lynx entry','enhanced light low / medium Harvest / heavy Mallet / stop / throw','Branch-specific','any','真の連携と択を分離。','strategy','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-throw-dr','M前投げラッシュ','Modern forward throw','DR Assist M/5M / 6M / throw / shimmy','+24 family','any','後方受け身。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-rhino39','Mライノ+39','Modern Rhino ender','L Lynx > enhanced Mallet / Assist pressure','+39 family','any','簡易入力差。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-plus42','M+42詐欺飛び','Modern M Spin/OD Moon ender +42','forward jump H / empty jump / H Lynx branch','+42 family','corner','ワンボタン無敵。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-odlynx-plus1','M ODコロ弱派生+1','OD Lynx > enhanced light branch guard','2L frame trap / throw / block','Source +1 claim','any','弾抜け後距離。','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8');

insert into p32_seq values
('elena','elena-y4-lynx-tree','リンクシング全派生','L/M/H/OD Lynx > stop / light / medium / heavy > Lynx Swirl enhanced branches','Record projectile, throw and low invulnerability.','strategy','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-spin-tree','スピンサイズ分岐','L/M/H/OD Spin > finish / Lynx cancel / enhanced Harvest / oki ender','Strength changes +34/+42/+43 families.','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-rhino-tree','ライノ締め分岐','L/M/H/OD Rhino > +39/+40 oki / side switch / corner Scratch follow-up / SA','Standing and hit-count conditions.','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-moon-tree','ムーングライド分岐','L Moon safe-ish ender / OD Moon launch +42 / SA2-SA3 cancel / M-H spacing','Current command availability by control type.','strategy','https://note.com/tigrex/n/ndc46a9f98883'),
('elena','elena-y4-healing-tree','ヒーリング判断','SA2 hit > damage follow-up / Healing recover / accept +1 defense / lethal skip','Track recoverable health and opponent resources.','strategy','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-frame-family','ダウンF別管理','+24 throw / +34 L Spin / +36 corner / +39 Rhino-Moon / +40 target / +42 M Spin-SA1 / +43 M Spin target','Do not merge frame kills.','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-dr-tree','ラッシュ択','DR > 5MK plus / 6MK overhead / 2MK low / 5HP spacing / throw','Record hit, guard and rise behavior.','strategy','https://tatsujin.blog/sf6/elena/setplay/'),
('elena','elena-y4-aa-tree','対空選択','L-M-H Scratch / 2HP Lynx / air target / SA1 / OD Rhino SA2','Height and cross-up.','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-corner-tree','端起き攻め循環','corner Rhino-Scratch > frame kill 5MK / throw / shimmy / Lynx mix / safe jump','Record rise and reversal options.','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-resource-tree','ゲージ・回復判断','no Drive Spin/Rhino / Drive2 OD Lynx / Drive3 CDR / SA1 damage / SA2 heal / SA3 lethal','Damage, oki and health tradeoff.','strategy','https://note.com/dos236236/n/nce65d6199ac4'),
('elena','elena-y4-modern-assist-stop','Mアシスト停止','Assist L/M/H > stop on block / manual Lynx ender / automatic SA','Resource automation.','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-lynx-tree','Mワンボタンコロ','one-button/manual Lynx > projectile bypass / low / Harvest / Mallet / stop','Input and scaling.','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-defense-tree','Mワンボタン防御','jump > M Scratch/SA1; projectile > OD Lynx/SA2; pressure > OD Scratch','Invulnerability and scaling.','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-heal-tree','M SA2回復判断','one-button/manual SA2 > Healing / damage follow-up / accept +1 / lethal skip','Healing remains separate from combo damage.','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8'),
('elena','elena-y4-modern-resource-tree','Mゲージ判断','Assist hit > basic / OD Lynx / automatic SA / SA2 heal / BO safe route','Record missing normals and manual alternatives.','modern_only','https://note.com/nikotarosun/n/n2f263e8f2ef8');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.cat,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,'Written/image-only collection; current capture required.',p.id,'unverified',r.ck,'draft'
from p32_combo r join characters c on c.slug=r.char_slug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'oki',r.starter,r.seq,r.adv,r.pos,r.descr,'Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',p.id,'unverified',r.ck,'draft'
from p32_setup r join characters c on c.slug=r.char_slug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,false,'record 4F gaps','record throw point','record shimmy spacing','record jump escape','record parry answer','record D-reversal','record reversal',r.notes,p.id,'unverified',r.ck,'draft'
from p32_seq r join characters c on c.slug=r.char_slug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Written/image claim; capture required.' from p32_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Written/image claim; capture required.' from p32_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Written decision tree; capture required.' from p32_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select e.typ,e.id,s.id,'patch_context','2026-08-03 official character baseline.'
from(
 select 'combo' typ,x.id,r.char_slug from p32_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,r.char_slug from p32_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,r.char_slug from p32_seq r join sequences x on x.slug=r.slug
)e join sources s on s.url=case e.char_slug
 when 'terry' then 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/terry'
 when 'mai' then 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/mai'
 when 'elena' then 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/elena' end
on conflict(entity_type,entity_id,source_id) do nothing;

with e as(
 select 'combo' typ,x.id,x.slug,x.name,x.notation method,x.content_kind,r.char_slug from p32_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind,r.char_slug from p32_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind,r.char_slug from p32_seq r join sequences x on x.slug=r.slug
),p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【'||c.name_ja||'撮影待ち】'||e.name,case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,
'文章・画像から収集した攻略の現行成立を確定する。','advanced',15,c.id,
'入力履歴・フレーム・ダメージ・Drive/SA・固有状態を表示。操作、位置、受け身、CH/PC、技強度を指定。',
'4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,
'左右各10回で成立、数値、位置、受け身、固有条件、簡易補正、キャラ条件を記録。',20,
'成立ならverified候補。不成立ならarchived。',p.id,'unverified',e.content_kind,'draft'
from e join characters c on c.slug=e.char_slug cross join p on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(
 select 'combo' typ,x.id,x.slug from p32_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug from p32_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug from p32_seq r join sequences x on x.slug=r.slug
)e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related strategy.'
from trainings t join training_relations tr on tr.training_id=t.id join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.slug in(select 'training-'||slug from p32_combo union all select 'training-'||slug from p32_setup union all select 'training-'||slug from p32_seq)
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' or t.name ilike '%焔%' or t.name ilike '%ヒーリング%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,
'2026-08-03版の成立、入力、数値、位置、受け身、固有状態、技強度、簡易補正、Classic/Modern差を確認。'
from trainings t where t.slug in(select 'training-'||slug from p32_combo union all select 'training-'||slug from p32_setup union all select 'training-'||slug from p32_seq)
on conflict(training_id) do nothing;

update character_content_packages p set rollout_status='complete',combo_status='complete',setup_status='complete',sequence_status='complete',training_status='complete',source_status='complete',patch_status='complete',verification_status='review',
notes=concat_ws(E'\n',nullif(p.notes,''),'2026-09-01 phase32: written/image-only Classic and Modern collection completed; character-specific resource and frame families separated; all draft/unverified.'),updated_at=now()
where p.character_id in(select id from characters where slug in('terry','mai','elena'));
