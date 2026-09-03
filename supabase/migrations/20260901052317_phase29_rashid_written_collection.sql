-- Rashid written/image-only strategy collection for the 2026-08-03 patch.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
 ('RASHID バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/rashid','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current patch; long-range normals and specials adjusted.'),
 ('ラシードコンボ選択','https://note.com/yubibiseth/n/nc4725e9f71a7','community_guide','ゆば','2024-01-26 00:00:00+00'::timestamptz,now(),'community','Detailed written route, resource, carry and safe-jump families.'),
 ('ラシードセットプレイ イーグルスパイク編','https://note.com/yubibiseth/n/n19ce3203f1f2','community_guide','ゆば',null::timestamptz,now(),'community','Detailed light/medium Eagle oki and rise branches.'),
 ('ラシード 中ミキサー・強ミキサー後の起き攻め','https://note.com/yubibiseth/n/ncfb9a6dcc050','community_guide','ゆば',null::timestamptz,now(),'community','Written Mixer knockdown and Ysaar setup branches.'),
 ('ラシード最低限使い方メモ','https://note.com/kch_/n/n73833af80a6d','community_guide','kch_',null::timestamptz,now(),'community','Compact Classic/Modern combo and safe-jump recipes.'),
 ('モダンラシードコンボまとめ','https://note.com/azusaki_channel/n/n12e4d30cc275','community_guide','東和正',null::timestamptz,now(),'community','Written Modern assist, DI, punish and resource routes.'),
 ('Mラシード 2026年8月操作見直し','https://note.com/mz45aqvdua/n/ne1753dd0c82a','community_guide','wix','2026-08-16 00:00:00+00'::timestamptz,now(),'community','Current-patch Modern move-access changes, including all Eagle strengths.'),
 ('モダンラシード起き攻め置き場','https://note.com/emesirna/n/n40e4af323a95','community_guide','さーな',null::timestamptz,now(),'community','Modern meaty/throw/shimmy decision rules.'),
 ('モダンラシード イウサール関連','https://note.com/emesirna/n/nbbb7857e4e46','community_guide','さーな',null::timestamptz,now(),'community','Ysaar setup, acceleration and Modern scaling notes.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p29_combo(slug text,name text,cat text,notation text,starter text,pos text,diff int,purpose text,conditions text,ck text,src text) on commit drop;
insert into p29_combo values
('rashid-y4-2lp-2lp-mmixer','小P刻み中ミキサー','light','2LP > 2LP > M Spinning Mixer','2LP','any',2,'小技基本','距離で弱イーグルへ変更。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-5lp-5lk-leagle','小P小K弱イーグル','light','5LP > 5LK > L Eagle Spike','5LP','any',2,'小技運び','距離と+30状況。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-2mp-5lk-leagle','屈中P小K弱イーグル','medium','2MP > 5LK > L Eagle Spike','2MP','any',2,'中技基本','密着／先端差。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-5mk-5mp-meagle','立中K中P中イーグル','medium','5MK > 5MP > M Eagle Spike','5MK','any',2,'中技運び','近距離限定。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-6mp-meagle','前中P中イーグル','medium','6MP > M Eagle Spike','6MP','any',2,'中段ヒット','距離を確認。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-5hp-meagle','強P中イーグル','heavy','5HP > M Eagle Spike','5HP','any',2,'強P運び','起き攻め優先。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-5hp-hcyclone-hmixer','強P強サイクロン強ミキサー','heavy','5HP > H Arabian Cyclone > Assault Roll > H Spinning Mixer','5HP','any',4,'ノーゲージ火力','ロール位置依存。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-5hp-hcyclone-sa1','強P強サイクロンSA1','sa','5HP > H Arabian Cyclone > Assault Roll > SA1','5HP','any',4,'省Drive SA1','SA1。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-2mk-cdr-5mk-hp-meagle','中足ラッシュ中イーグル','drive','2MK > CDR 5MK > 5HP > M Eagle Spike','2MK','any',3,'下段運び','Drive3。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-dr-2lk-2mk-leagle','ラッシュ小足弱イーグル','drive','DR 2LK > 2MK > L Eagle Spike','DR 2LK','any',2,'生ラ下段','Drive1。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-dr-6hp-hcyclone','ラッシュ中段強サイクロン','drive','DR 6HP > 5MP~5HK > H Arabian Cyclone > Assault Roll > H Mixer','DR 6HP','any',4,'生ラ中段','距離とTC成立。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-tc-odcyclone-run-mmixer','TC ODサイクロン中ミキサー','drive','5MP~5HK > OD Arabian Cyclone > Tempest Moon/Run K > M Mixer','5MP target','midscreen',4,'運びDrive','Drive2。派生名称と強度を確認。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-tc-odcyclone-run-hmixer','TC ODサイクロン強ミキサー','drive','5MP~5HK > OD Arabian Cyclone > Tempest Moon/Run K > H Mixer','5MP target','corner',4,'端運びDrive','端到達時。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-tc-odcyclone-roll-mmixer','TC ODサイクロンロール中ミキサー','drive','5MP~5HK > OD Arabian Cyclone > Assault Roll > micro-back > M Mixer','5MP target','midscreen',5,'端運び強化','微下がり量。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-corner-5mp-mcyclone-leagle','端中P中サイクロン弱イーグル','corner','5MP > M Arabian Cyclone > 5LK > L Eagle Spike','5MP','corner',3,'端ノーゲージ','位置限定。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-corner-tc-safejump','端TC詐欺飛び','corner','5MP~5HK > L Mixer > 6MP > L Cyclone > Wing Stroke > j.HK','5MP target','corner',5,'端詐欺飛び','+41/+42とジャンプ攻撃時期。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-corner-oikin-safejump','端オイキン詐欺飛び','corner','5MK > 5MP~5HK > M Cyclone > 6MP > L Mixer > 6MP > L Cyclone > Wing Stroke > j.HK','5MK','corner',5,'端最大起き攻め','密着時の中サイクロン不成立注意。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-hp-pc-hcyclone','強P PC強サイクロン','punish','5HP(PC) > H Cyclone > Assault Roll > H Mixer','5HP punish counter','any',4,'シミー反撃','距離で強イーグルへ変更。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-hk-pc-heagle','強K PC強イーグル','punish','5HK(PC) > H Eagle Spike','5HK punish counter','any',2,'差し返し','現行リーチ確認。','strategy','https://note.com/azusaki_channel/n/n12e4d30cc275'),
('rashid-y4-di-basic-tc','中央DI基本','impact','DI(PC) > 5MP~5HK > H Cyclone > Wing Stroke','DI punish counter','midscreen',4,'中央DI運び','距離依存。','strategy','https://note.com/azusaki_channel/n/n12e4d30cc275'),
('rashid-y4-di-jump-max','中央DI垂直最大','impact','DI(PC) > neutral j.HK > 5HP > 6MP(1) > M Cyclone > Assault Roll > H Mixer','DI punish counter','midscreen',5,'中央DI火力','微歩き・先端不可。','strategy','https://note.com/azusaki_channel/n/n12e4d30cc275'),
('rashid-y4-wall-mp-hk-mixers','端DIミキサー追撃','impact','DI wall splat > 5MP > 5HK > L Mixer > H Mixer','DI wall splat','corner',4,'端DI','追撃高度。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-aa-hmixer','強ミキサー対空','anti_air','H Spinning Mixer anti-air','opponent jump','any',2,'対空','気流あり／なし。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-air-skyhigh-route','空対空スカイハイ','anti_air','j.MP > M Sky High > j.2HP','air-to-air','any',4,'空対空','高度依存。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-corner-od-loop-sa3','端ODループSA3','sa','5MP > 5HP > OD Cyclone > down branch > OD Mixer > M Sky High > j.2HP > OD Cyclone > OD Mixer > M Sky High > j.2HP > SA3','5MP','corner',5,'端最大SA3','Drive全消費候補。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-stun-whirl-route','スタン溜めワール','stun','stun > charged Whirlwind Shot > OD Mixer > M Sky High > j.HP','opponent stun','corner',5,'スタン気流','溜め段階。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-stun-jump-route','スタン飛び込みルート','stun','stun > back jump charged H Whirl > neutral j.HK > 5MP > M Cyclone > 5LK > L Eagle','opponent stun','corner',5,'スタン風設置','位置と溜め。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-sa2-lspike-odmixer','イウサール弱スパイク追撃','sa','SA2 > delayed L Eagle Spike > OD Mixer > Sky High > j.HP','SA2 setup','any',5,'SA2追撃','竜巻位置と持続当て。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-corner-sa2-overhead','端イウサール中段','sa','6HP > M Mixer > frame kill 5MKx2 > enhanced OD Eagle > OD Cyclone > delayed enhanced OD Mixer > SA1','corner SA2/Ysaar','corner',5,'SA2中段最大','複雑な位置・気流条件。','strategy','https://note.com/nikotarosun/n/n582575ab1388'),
('rashid-y4-modern-assist-l','M弱アシスト基本','assist','Assist L automatic route','Modern Assist L','any',1,'モダン小技','自動停止と締め。','modern_only','https://note.com/azusaki_channel/n/n12e4d30cc275'),
('rashid-y4-modern-low-leagle','M小足弱イーグル','light','2L > 2L > L > L Eagle Spike','Modern 2L','any',2,'モダン下段','ダウンを取らない記事記載も現行確認。','modern_only','https://note.com/azusaki_channel/n/n12e4d30cc275'),
('rashid-y4-modern-assistm-oki','M中アシスト起き攻め','assist','Assist M > Assist M > H Cyclone > Wing Stroke','Modern Assist M','any',3,'モダン起き攻め','弱ミキサー／ワール重ね分岐。','modern_only','https://note.com/azusaki_channel/n/n12e4d30cc275'),
('rashid-y4-modern-assistm-damage','M中アシスト火力','assist','Assist M > Assist M > H Cyclone > Assault Roll > H Mixer','Modern Assist M','any',3,'モダン火力','ノーゲージ。','modern_only','https://note.com/azusaki_channel/n/n12e4d30cc275'),
('rashid-y4-modern-pc-heavy','M強PC強イーグル','punish','Modern H(PC) > H Eagle Spike','Modern H punish counter','any',2,'モダン差し返し','手動／斜めSP強度差。','modern_only','https://note.com/azusaki_channel/n/n12e4d30cc275'),
('rashid-y4-modern-di-sa3','M中央DI SA3','impact','DI(PC) > neutral j.H > H > 6M(1) > M Cyclone > Assault Roll > SA3','DI punish counter','midscreen',5,'モダンDI SA3','先端不可。','modern_only','https://note.com/azusaki_channel/n/n12e4d30cc275'),
('rashid-y4-modern-all-eagle-strengths','M全強度イーグル分岐','special','L/M/H Eagle Spike via directional SP/manual input','Modern special access','any',2,'2026モダン追加','各強度を独立確認。','modern_only','https://note.com/mz45aqvdua/n/ne1753dd0c82a'),
('rashid-y4-modern-onebutton-sa2','Mワンボタンイウサール','sa','one-button SA2 > Ysaar pressure/acceleration','Modern SA2','any',3,'モダンSA2','簡易入力は始動補正20%記事記載。','modern_only','https://note.com/emesirna/n/nbbb7857e4e46');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.cat,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,'Written/image-only collection; current capture required.',p.id,'unverified',r.ck,'draft' from p29_combo r join characters c on c.slug='rashid' cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

create temporary table p29_setup(slug text,name text,starter text,seq text,adv text,pos text,descr text,ck text,src text) on commit drop;
insert into p29_setup values
('rashid-y4-leagle30-run','弱イーグル+30ラン択','L Eagle Spike ground hit','dash > Run > 2MP(meaty) / throw','Source +30 claim','midscreen','持続屈中Pはガード+3～4候補。','strategy','https://note.com/yubibiseth/n/n19ce3203f1f2'),
('rashid-y4-leagle30-delay6hp','弱イーグル遅らせ中段','L Eagle Spike ground hit','DR > delayed 6HP','Timing claim','midscreen','中段重ね。','strategy','https://note.com/yubibiseth/n/n19ce3203f1f2'),
('rashid-y4-leagle30-flip-throw','弱イーグルフリップ投げ','L Eagle Spike ground hit','dash > Side Flip > throw','Manual timing','midscreen','投げ間合いと表裏。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-leagle30-flip-roll','弱イーグルフリップ派生','L Eagle Spike ground hit','dash > Side Flip > back/forward K branch','Branch timing','midscreen','打撃・移動・投げ対策。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-meagle52-whirl','中イーグル溜めワール','M Eagle Spike ground hit','partial-charge L Whirl to cover both rises > DR 5LK/5HP','Source +52 claim','midscreen','受け身別追撃を分ける。','strategy','https://note.com/yubibiseth/n/n19ce3203f1f2'),
('rashid-y4-meagle52-runmix','中イーグルラン五択','M Eagle Spike ground hit','dash > Run > 2LK / 2MP / 6HP / throw / shimmy','Source +52 claim','midscreen','基本五択。','strategy','https://note.com/yubibiseth/n/n19ce3203f1f2'),
('rashid-y4-meagle52-jump-framekill','中イーグル前飛び消費','M Eagle Spike ground hit','forward jump attack whiff/land > 2MP meaty','Frame-kill claim','midscreen','記事記載の密着有利を確認。','strategy','https://note.com/oldistrict77/n/n2d25c56f3255'),
('rashid-y4-meagle65-flip','中スパイク+65フリップ','M Eagle Spike claimed +65 route','2LP whiff > Side Flip > micro-walk throw / strike','Source +65 variant claim','any','別資料の+52との差はヒット状況差として保持。','strategy','https://note.com/shinakuma/n/n8ae9d6618c41'),
('rashid-y4-heagle56-backup','強イーグルバックアップ','H Eagle Spike ground hit','Run > Backup punch branch','Source +56 claim','any','+4候補。','strategy','https://note.com/shinakuma/n/n8ae9d6618c41'),
('rashid-y4-mmixer31-dr','中ミキサー+31ラッシュ択','M Mixer ground hit','DR 6HP / 6HK / delayed throw','Source +31 claim','any','4F暴れ可否を分離。','strategy','https://note.com/shinakuma/n/n8ae9d6618c41'),
('rashid-y4-hmixer33-dr','強ミキサー+33ラッシュ択','H Mixer ground hit','dash > DR 2MP / throw / 6HP','Source +33 claim','any','DR屈中Pガード+5候補。','strategy','https://note.com/yubibiseth/n/ncfb9a6dcc050'),
('rashid-y4-hmixer33-whiff-throw','強ミキサー空振り小P投げ','H Mixer ground hit','DR 5LP whiff > DR throw / re-DR throw','Parry bait','any','無敵・パリィ待ち。','strategy','https://note.com/yubibiseth/n/ncfb9a6dcc050'),
('rashid-y4-odmixer9','ODミキサー+9','OD Mixer ground hit','close strike / throw / SA2 timing','Source +9 post-nerf claim','any','旧版値の現行確認。','strategy','https://note.com/shinakuma/n/n8ae9d6618c41'),
('rashid-y4-safejump41','+41 6F詐欺飛び','combo end +41','forward jump attack / empty jump throw','6F safe-jump claim','corner','+41群。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-safejump42','+42 5F詐欺飛び','combo end +42','forward jump attack / empty jump low','5F safe-jump claim','corner','+42群。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-corner-throw-loop','端前投げ柔道','corner forward throw','dash > throw / 5LP / shimmy','Source +27 legacy claim','corner','現行投げ後フレームを確認。','strategy','https://note.com/emesirna/n/n684620436146'),
('rashid-y4-corner-tc-wing-mix','端TCウイング中下段','corner safe-jump combo','Wing Stroke > early j.HK / empty low / throw','Safe-jump/mix claim','corner','着地択。','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-charged-whirl-entry','最大ワール気流接近','max-charge Whirlwind Shot','forward jump / L Mixer / dash through airflow','Airflow-enhanced','any','3接近手段を分離。','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-ysaar-strike-throw','イウサール打撃投げ','SA2 Ysaar active','tornado cover > throw / shimmy / 6HP / 2LK','Projectile cover','any','保証連携と読み合いを区別。','strategy','https://note.com/emesirna/n/nbbb7857e4e46'),
('rashid-y4-ysaar-accelerate','イウサール加速サイクロン','SA2 Ysaar active','Arabian Cyclone touches tornado > accelerated five-hit projectile > follow-up','Special behavior claim','any','補正開始点を記録。','strategy','https://note.com/emesirna/n/nbbb7857e4e46'),
('rashid-y4-modern-corner-throw','M端前投げ択','Modern corner forward throw','dash > throw / Assist L / shimmy','Manual timing','corner','Modern基本。','modern_only','https://note.com/buredon/n/n1ef19d2dc009'),
('rashid-y4-modern-meagle','M中イーグル起き攻め','Modern M Eagle hit','jump frame kill / flip / Whirl / DR mix','Rise-dependent','any','2026強度選択対応。','modern_only','https://note.com/mz45aqvdua/n/ne1753dd0c82a'),
('rashid-y4-modern-assist-light-meaty','M密着+2～+5弱アシ重ね','Modern knockdown +2~+5','Assist L meaty > light-chain / throw / shimmy','Source range claim','any','生リバガード可否も確認。','modern_only','https://note.com/emesirna/n/n40e4af323a95'),
('rashid-y4-modern-ysaar','Mイウサール設置','Modern SA2 setup','tornado cover > throw / assist / overhead / bait','Simple-input scaling claim','any','ワンボタン始動補正20%記載。','modern_only','https://note.com/emesirna/n/nbbb7857e4e46');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'oki',r.starter,r.seq,r.adv,r.pos,r.descr,'Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',p.id,'unverified',r.ck,'draft' from p29_setup r join characters c on c.slug='rashid' cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

create temporary table p29_seq(slug text,name text,seq text,notes text,ck text,src text) on commit drop;
insert into p29_seq values
('rashid-y4-whirl-charge-tree','ワール溜め段階分岐','L/H Whirl tap / partial / max > anti-jump, cover both rises, airflow entry','Record each charge and spacing.','strategy','https://note.com/yubibiseth/n/n19ce3203f1f2'),
('rashid-y4-cyclone-branch-tree','サイクロン全派生','L/M/H/OD Cyclone > no branch / Assault Roll / Wing Stroke / Tempest Moon','Strength and hit/block change legal branch.','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-hcyclone-plus-tree','強サイクロン前派生+1択','5HP > H Cyclone > Assault Roll guard > strike / throw / shimmy','Source +1 claim; record interrupt points.','strategy','https://note.com/emesirna/n/n668f842a7bc4'),
('rashid-y4-run-tree','ラン攻防分岐','Run > stop / 2LK / 2MP / 6HP / throw / backstep bait','Separate guaranteed meaty from mix.','strategy','https://note.com/yubibiseth/n/n19ce3203f1f2'),
('rashid-y4-wing-tree','ウイング空中分岐','Wing Stroke > j.attack / Sky High / empty land low / throw','Height and side-switch required.','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-eagle-strength-rule','イーグル強度・位置選択','L Eagle +30 close oki / M Eagle carry and large advantage / H Eagle damage / airflow versions','Ground/air/persistent hits differ.','strategy','https://note.com/yubibiseth/n/n19ce3203f1f2'),
('rashid-y4-mixer-ender-rule','ミキサー締め選択','M Mixer carry/oki / H Mixer damage and SA2 timing / OD Mixer extension','Record +31/+33/+9 claims.','strategy','https://note.com/yubibiseth/n/ncfb9a6dcc050'),
('rashid-y4-safejump-tree','詐欺飛び中下段','+41/+42 ender > j.HK / early attack / empty 2LK / empty throw','5F and 6F reversals differ.','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-ysaar-tree','イウサール全分岐','SA2 > cover throw/shimmy/overhead/low / Cyclone acceleration / combo pickup','Never label all tornado pressure true.','strategy','https://note.com/emesirna/n/nbbb7857e4e46'),
('rashid-y4-resource-choice','運び・火力・起き攻め選択','hit > Eagle carry / Cyclone-Mixer damage / Wing safe-jump / Ysaar position','Track Drive, SA, airflow, corner distance.','strategy','https://note.com/yubibiseth/n/nc4725e9f71a7'),
('rashid-y4-airflow-choice','気流強化行動','airflow > enhanced jump / Mixer / Eagle / Cyclone interaction','Record stockless environmental timing.','strategy','https://note.com/kch_/n/n73833af80a6d'),
('rashid-y4-modern-assist-stop','Mアシスト確認停止','Assist M > stop / H Cyclone Wing oki / H Cyclone Roll damage / automatic SA','Resource automation requires capture.','modern_only','https://note.com/azusaki_channel/n/n12e4d30cc275'),
('rashid-y4-modern-eagle-input','Mイーグル入力分岐','directional SP/manual > L/M/H Eagle > distinct combo/oki','New 2026 access must not be merged.','modern_only','https://note.com/mz45aqvdua/n/ne1753dd0c82a'),
('rashid-y4-modern-onebutton-defense','Mワンボタン防御','jump/pressure read > one-button Mixer / SA1 / SA2','Scaling and invulnerability required.','modern_only','https://note.com/azusaki_channel/n/n12e4d30cc275'),
('rashid-y4-modern-ysaar-tree','Mイウサール管理','one-button/manual SA2 > pressure / acceleration / escape / combo','Simple-input start scaling separate.','modern_only','https://note.com/emesirna/n/nbbb7857e4e46');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,false,'record 4F gaps','record throw point','record shimmy spacing','record jump escape','record parry answer','record D-reversal','record reversal',r.notes,p.id,'unverified',r.ck,'draft' from p29_seq r join characters c on c.slug='rashid' cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note) select 'combo',x.id,s.id,'supporting','Written/image claim; capture required.' from p29_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note) select 'setup',x.id,s.id,'supporting','Written/image claim; capture required.' from p29_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note) select 'sequence',x.id,s.id,'supporting','Written decision tree; capture required.' from p29_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select e.typ,e.id,s.id,'patch_context','2026-08-03 official Rashid baseline.' from(select 'combo' typ,x.id from p29_combo r join combos x on x.slug=r.slug union all select 'setup',x.id from p29_setup r join setups x on x.slug=r.slug union all select 'sequence',x.id from p29_seq r join sequences x on x.slug=r.slug)e cross join sources s where s.url='https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/rashid' on conflict(entity_type,entity_id,source_id) do nothing;

with e as(select 'combo' typ,x.id,x.slug,x.name,x.notation method,x.content_kind from p29_combo r join combos x on x.slug=r.slug union all select 'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind from p29_setup r join setups x on x.slug=r.slug union all select 'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind from p29_seq r join sequences x on x.slug=r.slug),p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【ラシード撮影待ち】'||e.name,case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,'文章・画像から収集した攻略の現行成立を確定する。','advanced',15,c.id,'入力履歴・フレーム・ダメージ・Drive/SA・気流を表示。操作、位置、受け身、CH/PC、強度を指定。','4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,'左右各10回で成立、数値、位置、受け身、気流、簡易補正、キャラ条件を記録。',20,'成立ならverified候補。不成立ならarchived。',p.id,'unverified',e.content_kind,'draft' from e join characters c on c.slug='rashid' cross join p on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id) select t.id,e.typ,e.id from trainings t join(select 'combo' typ,x.id,x.slug from p29_combo r join combos x on x.slug=r.slug union all select 'setup',x.id,x.slug from p29_setup r join setups x on x.slug=r.slug union all select 'sequence',x.id,x.slug from p29_seq r join sequences x on x.slug=r.slug)e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note) select 'training',t.id,es.source_id,'supporting','Inherited from related strategy.' from trainings t join training_relations tr on tr.training_id=t.id join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id where t.player_character_id=(select id from characters where slug='rashid') on conflict(entity_type,entity_id,source_id) do nothing;
insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes) select t.player_character_id,t.id,'pending',case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' or t.name ilike '%イウサール%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,'2026-08-03版の成立、入力、数値、位置、受け身、気流、技強度、簡易補正、Classic/Modern差を確認。' from trainings t where t.slug in(select 'training-'||slug from p29_combo union all select 'training-'||slug from p29_setup union all select 'training-'||slug from p29_seq) on conflict(training_id) do nothing;

update character_content_packages p set rollout_status='complete',combo_status='complete',setup_status='complete',sequence_status='complete',training_status='complete',source_status='complete',patch_status='complete',verification_status='review',notes=concat_ws(E'\n',nullif(p.notes,''),'2026-09-01 phase29: Rashid written/image-only Classic and Modern collection completed; airflow, safe-jump and Ysaar branches separated; all draft/unverified.'),updated_at=now() where p.character_id=(select id from characters where slug='rashid');
