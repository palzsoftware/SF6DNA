-- A.K.I. written/image-only strategy collection for the 2026-08-03 patch.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
 ('A.K.I. バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/aki','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current patch; pokes, whiff punishes and underused specials revised.'),
 ('A.K.I.研究室 コンボ','https://st6-aki-laboratory.com/combo.html','community_guide','A.K.I.研究室',null::timestamptz,now(),'community','Written/image situational combos, damage and oki destinations.'),
 ('A.K.I.研究室 起き攻め・セットプレイ','https://st6-aki-laboratory.com/setplay.html','community_guide','A.K.I.研究室',null::timestamptz,now(),'community','Written frame families: +19/+27/+32/+38/+40/+42/+44 and SA.'),
 ('C:A.K.I. ハイマスタッチ','https://note.com/terry631/n/nb3327f900fcd','community_guide','ムサイ',null::timestamptz,now(),'community','Detailed medium-whip poison-burst route choices.'),
 ('C:A.K.I. act11 コンボ更新','https://note.com/terry631/n/ne20915912f66','community_guide','ムサイ','2026-05-01 00:00:00+00'::timestamptz,now(),'community','2026 written lethal and corner poison routes.'),
 ('C:A.K.I. act10 OD紫煙砲コンボ','https://note.com/terry631/n/n116cd91dff09','community_guide','ムサイ',null::timestamptz,now(),'community','Written OD bubble, SA and corner routes.'),
 ('10日でマスター簡単A.K.I.','https://note.com/takasin667/n/n69b37c49a845','community_guide','Takasin',null::timestamptz,now(),'community','Written core route, +44 oki and corner puddle loop.'),
 ('A.K.I.基本的な使い方','https://takukakugamer.com/sf6-aki-howtouse/','community_guide','格ゲーブロガー拓','2026-03-01 00:00:00+00'::timestamptz,now(),'community','Classic written/image poison, rush and pressure guide.'),
 ('モダンA.K.I.コンボ','https://kamigame.jp/streetfighter6/page/308029992095199818.html','community_guide','神ゲー攻略','2025-06-07 00:00:00+00'::timestamptz,now(),'community','Modern starter/resource tables.'),
 ('モダンA.K.I. 2026コンボ集','https://giyuki.net/archives/6080','community_guide','giyuki','2026-07-26 00:00:00+00'::timestamptz,now(),'community','Recent Modern assist and burnout route notes.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p30_combo(slug text,name text,cat text,notation text,starter text,pos text,diff int,purpose text,conditions text,ck text,src text) on commit drop;
insert into p30_combo values
('aki-y4-2lp-lights-hwhip','小技刻み強蛇頭鞭','light','2LP > 2LP > 5LK > H Serpent Lash','2LP','any',2,'毒付与基本','距離で弱攻撃数を調整。','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-5mp-5lk-hwhip','中P小K強蛇頭鞭','medium','5MP > 5LK > H Serpent Lash','5MP','any',2,'6F確反候補','距離を確認。','strategy','https://st6-aki-laboratory.com/combo.html'),
('aki-y4-5mk-5mp-hwhip','中K中P強蛇頭鞭','medium','5MK > 5MP > H Serpent Lash','5MK close hit','any',3,'中K近距離確認','記事記載44F起き攻め。','strategy','https://st6-aki-laboratory.com/combo.html'),
('aki-y4-2mk-5lk-hwhip','中足小K強蛇頭鞭','medium','2MK > 5LK > H Serpent Lash','2MK close hit','any',2,'下段基本','NH+5記事記載。','strategy','https://takukakugamer.com/sf6-aki-howtouse/'),
('aki-y4-dr-2mk-hk-chain','ラッシュ中足強K蛇連咬','drive','DR 2MK > 5HK > Sinister Slide~Venomous Fang > lights > H Serpent Lash','DR 2MK','any',4,'主力毒付与','弱攻撃数は距離／毒で変更。','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-hk-chain-lights-hwhip','強K蛇連咬強鞭','heavy','5HK > Sinister Slide~Venomous Fang > 2LP x1-2 > 5LK > H Serpent Lash','5HK','any',4,'主力基本','ガード時入れ込み不可。','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-hp-target-poison','強PTC毒付与','heavy','5HP~HP > H Serpent Lash / follow-up','5HP','any',3,'毒付与TC','2段目の毒付与と距離。','strategy','https://takukakugamer.com/sf6-aki-howtouse/'),
('aki-y4-2hk-pc-dr-lk-hwhip','屈強K PCラッシュ強鞭','punish','2HK(PC) > DR 5LK > H Serpent Lash','2HK punish counter','any',3,'差し返し浮かせ','記事記載追撃。','strategy','https://takukakugamer.com/sf6-aki-howtouse/'),
('aki-y4-hk-pc-hdive-lights','強K PC強凶襲突','punish','5HK(PC) > H Cruel Fate > 2LP x1-2 > 5LK > H Serpent Lash','5HK punish counter','any',4,'シミー反撃','強凶襲突ガード-4記事記載。','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-2hp-pc-poison','屈強P PC毒付与','punish','2HP(PC) > DR follow-up > H Serpent Lash','2HP punish counter','any',4,'新毒付与候補','現行PC挙動。','strategy','https://note.com/emesirna/n/nf0ef76289f94'),
('aki-y4-di-hk-chain-hwhip','中央DI主力','impact','DI(PC) > 5HK > Venomous Fang > lights > H Serpent Lash','DI punish counter','midscreen',4,'中央DI','弱攻撃数。','strategy','https://st6-aki-laboratory.com/combo.html'),
('aki-y4-wall-hk-odbubble','端DI OD紫煙砲','impact','DI wall splat > 5HK > Venomous Fang > 5LK > OD Orchid Spring','DI wall splat','corner',4,'端DI毒付与','端専用追撃へ。','strategy','https://note.com/terry631/n/n116cd91dff09'),
('aki-y4-aa-hwhip','強蛇頭鞭対空','anti_air','H Serpent Lash anti-air > poison/knockdown','opponent jump','any',2,'対空','高さと毒状態。','strategy','https://note.com/terry631/n/ne20915912f66'),
('aki-y4-aa-mwhip','中蛇頭鞭対空','anti_air','M Serpent Lash anti-air > poison burst follow-up','diagonal jump/air special','any',3,'斜め対空','毒あり破裂時を分離。','strategy','https://note.com/terry631/n/ne20915912f66'),
('aki-y4-od-cruelfate-hkd','OD凶襲突毒付与','special','OD Cruel Fate ground hit > hard knockdown','OD Cruel Fate','any',2,'奇襲毒付与','方向入力による飛距離。','strategy','https://takukakugamer.com/sf6-aki-howtouse/'),
('aki-y4-poison-hwhip-dr-hwhip','強鞭毒破裂ラッシュ強鞭','poison','H Serpent Lash(poison burst) > DR 2MP > H Serpent Lash','poisoned opponent','any',4,'毒破裂ループ','同じ+44へ戻る候補。','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-poison-mwhip-walk-mp','中鞭破裂歩き中P強鞭','poison','M Serpent Lash(poison burst) > walk 5MP > H Serpent Lash','poisoned opponent','midscreen',4,'無Drive毒破裂','記事記載3040候補。','strategy','https://note.com/terry631/n/nb3327f900fcd'),
('aki-y4-poison-mwhip-dash-chain','中鞭破裂前ステ蛇連咬','poison','M Lash burst > dash > 5LK > Venomous Fang(delayed) > L Serpent Lash','poisoned opponent','near corner',5,'端到達+35','遅らせ量。','strategy','https://note.com/terry631/n/nb3327f900fcd'),
('aki-y4-poison-mwhip-sa','中鞭破裂SA','sa','M Lash burst > 6HP/2HK > SA1/SA2/SA3','poisoned opponent','any',3,'無Drive SA','各SAを撮影。','strategy','https://note.com/terry631/n/nb3327f900fcd'),
('aki-y4-poison-mwhip-odwhip','中鞭破裂OD鞭再破裂','poison','M Lash burst > 5HK > OD Serpent Lash > M Lash burst > L Lash/SA','poisoned opponent','any',5,'Drive2毒破裂','記事記載3440候補。','strategy','https://note.com/terry631/n/nb3327f900fcd'),
('aki-y4-corner-burst-bubble-fang','端毒破裂紫泡撒猛毒牙','corner','H/M Lash burst > Orchid Spring > DR 5HK > Toxic Blossom > poison puddle/SA','poisoned opponent','corner',5,'端毒沼設置','設置技の強度と順番。','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-corner-od-bubble-whips','端OD紫煙砲強鞭弱鞭','corner','5HK > Venomous Fang > lights > 5LK > OD Nightshade Pulse > H Lash burst > L Lash poison','5HK','corner',5,'端毒再付与','記事記載端限定。','strategy','https://note.com/terry631/n/n116cd91dff09'),
('aki-y4-od-bubble-sa2','OD紫煙砲SA2','sa','5HK > Venomous Fang > 2LP > 5LK > OD Nightshade Pulse > SA2','5HK','any',4,'中央SA2','距離でOD弾不成立。','strategy','https://note.com/terry631/n/n116cd91dff09'),
('aki-y4-corner-lethal-sa12','端毒リーサルSA1/2','sa','M Lash burst > 5HK > CDR 5HK > M Lash poison > DR 5MP > CDR 5HK > Toxic Blossom burst > SA1/SA2','poisoned opponent','corner',5,'端リーサル','Drive6候補。','strategy','https://note.com/terry631/n/ne20915912f66'),
('aki-y4-corner-lethal-sa3','端毒リーサルSA3','sa','M Lash burst > 5HK > CDR 5HK > M Lash poison > DR 5MP > CDR 5HK > Toxic Blossom burst > L Lash > SA3','poisoned opponent','corner',5,'端SA3','Drive6+SA3。','strategy','https://note.com/terry631/n/ne20915912f66'),
('aki-y4-central-lethal-cruelfate-sa','中央毒リーサル凶襲突','sa','M Lash burst > DR 5HK > Venomous Fang > CDR 5HK > OD Cruel Fate > SA1/SA2/SA3','poisoned opponent','midscreen',5,'中央リーサル','Drive6。','strategy','https://note.com/terry631/n/ne20915912f66'),
('aki-y4-stun-no-poison','スタン毒なし','stun','stun > j.HK > 5HK > Venomous Fang > lights > H Lash > SA3 option','opponent stun, no poison','corner',5,'スタン基本','毒付与順とSA。','strategy','https://st6-aki-laboratory.com/combo.html'),
('aki-y4-stun-poison-corner','スタン毒あり端最大','stun','stun > poison setup > 5HK loops > Toxic Blossom burst > SA','opponent stun, poisoned','corner',5,'スタン毒最大','Drive/SA/毒沼別。','strategy','https://st6-aki-laboratory.com/combo.html'),
('aki-y4-drev-punish-mp','Dリバ反撃中P','punish','blocked Drive Reversal > 5MP > CDR/5LK > H Lash','Drive Reversal punish','any',3,'Dリバ確反','現行PC状態。','strategy','https://st6-aki-laboratory.com/combo.html'),
('aki-y4-modern-assist-l','M弱アシスト毒付与','assist','Assist L automatic route > H Serpent Lash','Modern Assist L','any',1,'モダン小技','自動締めと停止。','modern_only','https://kamigame.jp/streetfighter6/page/308029992095199818.html'),
('aki-y4-modern-assist-m','M中アシストOD弾','assist','Assist M > OD Nightshade Pulse route','Modern Assist M','any',2,'モダン中技','BO時通常弾分岐。','modern_only','https://giyuki.net/archives/6080'),
('aki-y4-modern-assist-h','M強アシスト毒コンボ','assist','Assist H > Venomous Fang > H Serpent Lash/SA','Modern Assist H','any',2,'モダン強技','自動リソース分岐。','modern_only','https://kamigame.jp/streetfighter6/page/308029992095199818.html'),
('aki-y4-modern-2m-basic','M中足小K強鞭','medium','2M > 5L > H Serpent Lash','Modern 2M','any',2,'モダン下段','近距離。','modern_only','https://kamigame.jp/streetfighter6/page/308029992095199818.html'),
('aki-y4-modern-dr-overhead','Mラッシュ中段毒コンボ','drive','DR 3M > 2M/5M > H Serpent Lash','Modern DR overhead','any',3,'モダン中段','記事記載ヒット有利を確認。','modern_only','https://www.sukoreru.com/sf6-modern-aki'),
('aki-y4-modern-hk-pc','M強攻撃PC凶襲突','punish','Modern H(PC) > H Cruel Fate > lights > H Lash','Modern H punish counter','any',4,'モダン反撃','簡易入力補正。','modern_only','https://kamigame.jp/streetfighter6/page/308029992095199818.html'),
('aki-y4-modern-di-corner','M端DI毒コンボ','impact','DI wall splat > Assist H > OD bubble > H Lash burst > SA','DI wall splat','corner',5,'モダン端DI','Drive/SA分岐。','modern_only','https://kamigame.jp/streetfighter6/page/308029992095199818.html'),
('aki-y4-modern-stun','Mスタン毒コンボ','stun','stun > Assist H route > poison burst > SA3','opponent stun','corner',4,'モダンスタン','自動SA消費。','modern_only','https://kamigame.jp/streetfighter6/page/308029992095199818.html'),
('aki-y4-modern-bo-assistm','Mバーンアウト中アシスト','assist','Assist M in burnout > normal projectile branch > knockdown','Modern Assist M, burnout','any',2,'モダンBO','距離で連続／反撃可否。','modern_only','https://giyuki.net/archives/6080');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.cat,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,'Written/image-only collection; current capture required.',p.id,'unverified',r.ck,'draft' from p30_combo r join characters c on c.slug='aki' cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

create temporary table p30_setup(slug text,name text,starter text,seq text,adv text,pos text,descr text,ck text,src text) on commit drop;
insert into p30_setup values
('aki-y4-hwhip44-slither','強鞭+44中蛇軽功','H Serpent Lash knockdown','M Snake Step > throw / 5HK / shimmy','Source +44 then +5 claim','any','標準打撃投げ。コンボ経路で距離差。','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-hwhip44-dr-low','強鞭+44ラッシュ中足','H Serpent Lash knockdown','DR 2MK(meaty) > 5LK/5MP route','Source guard +5 claim','any','下段重ね。','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-hwhip44-dr-overhead','強鞭+44ラッシュ中段','H Serpent Lash knockdown','DR 3MP(meaty) > combo','Source hit +7 claim','any','中段重ね。','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-hwhip44-whiff-chiwen','強鞭螭吻空振り+5','H Serpent Lash knockdown','whiff Chi Wen > throw / 2MK / 5HK / shimmy','Source +5 claim','any','ノーゲージフレーム消費。','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-hwhip44-dash-overhead','強鞭前ステ持続中段','H Serpent Lash knockdown','dash > 3MP(meaty) > 5LK/H Lash','Meaty +5 claim','any','最速持続中段。','strategy','https://note.com/terry631/n/n5f5eab88b9c7'),
('aki-y4-hwhip44-double-dash','強鞭前ステ2回','H Serpent Lash knockdown','dash x2 > 5MP / throw / shimmy','Source +6 claim','any','距離と投げ間合い。','strategy','https://note.com/terry631/n/n5f5eab88b9c7'),
('aki-y4-hwhip44-corner-safejump','端強鞭詐欺飛び','corner H Serpent Lash','forward jump attack / empty jump throw','Safe-jump claim','corner','受け身で表裏が変わらない端。','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-forwardthrow19-dr','前投げ+19ラッシュ','forward throw','DR 5MP/5MK / throw on normal rise','Source +19 family','any','後方受け身は距離外候補。','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-backthrow27','後ろ投げ+27','back throw','Chi Wen/Qiu Niu meaty / throw-shimmy on normal rise','Source +27 family','any','受け身別に大きく異なる。','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-2hp27','屈強P+27','2HP knockdown','DR 5MP/5MK only on normal rise','Source +27 family','any','後方受け身不可候補を確認。','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-puddle38','紫泡泉+38起き攻め','Orchid Spring/puddle setup','DR 5MP / 2MK / 3MP / throw / shimmy','Source +38 family','any','毒沼位置と受け身。','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-spray40','紫泡撒+40起き攻め','Orchid Spring spray ender','DR 5MP / 2MK / 3MP / throw / shimmy','Source +40 family','corner','毒付与・毒沼を分ける。','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-od-cruelfate42','OD凶襲突+42詐欺飛び','OD Cruel Fate ground hit','forward jump attack / empty jump / grounded meaty','Source +42 family','any','5F詐欺と方向入力距離。','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-spray-2hp32','紫泡撒屈強P+32','spray > 2HP ender','DR strike / throw / poison cover','Source +32 family','corner','受け身別。','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-poisonburst35','毒破裂+35端持続中P','delayed Fang > L Lash ender +35','whiff 2LK > DR 5MP latest active','Source +35 claim','corner','最持続と投げ距離。','strategy','https://note.com/terry631/n/nb3327f900fcd'),
('aki-y4-corner-puddle-hk-framekill','端毒沼強K消費','corner puddle setup','5HK frame kill > DR 2MK / 3MP / shimmy','Source +7 claim','corner','投げ間合い外のシミー。','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-sa1-oki','SA1後起き攻め','SA1 hit','DR/step > strike / throw / poison reapply','SA1 family','any','毒状態と位置。','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-sa2-oki','SA2後起き攻め','SA2 hit','poison state > DR mid/overhead / puddle / bait','SA2 family','any','毒付与と追撃。','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-sa3-oki','SA3後起き攻め','SA3 hit','DR/step > strike / throw / projectile cover','SA3 family','any','CA差も確認。','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-bubble-dr-shield','紫煙砲ラッシュ盾','Nightshade Pulse','DR behind projectile > 5MP / 2MK / 3MP / throw','Projectile cover','midscreen','弾と打撃の連続性。','strategy','https://takukakugamer.com/sf6-aki-howtouse/'),
('aki-y4-od-cruelfate-plus2','OD凶襲突ガード+2','OD Cruel Fate guard','5LP/throw/block','Source +2 claim','any','高度・方向別。','strategy','https://takukakugamer.com/sf6-aki-howtouse/'),
('aki-y4-modern-hwhip44','M強鞭後アシスト択','Modern H Lash knockdown','M Snake Step > Assist L/H / throw / shimmy','Source +44 family','any','手動とワンボタンの差。','modern_only','https://www.sukoreru.com/sf6-modern-aki'),
('aki-y4-modern-dr-overhead','Mラッシュ中段起き攻め','Modern knockdown','DR 3M > Assist M/H route','Meaty claim','any','入力解除タイミング。','modern_only','https://www.sukoreru.com/sf6-modern-aki'),
('aki-y4-modern-puddle','M毒沼起き攻め','Modern puddle setup','Assist H frame kill > DR low/overhead / throw','Position-dependent','corner','アシスト自動消費。','modern_only','https://giyuki.net/archives/6080'),
('aki-y4-modern-od-cruelfate','MワンボタンOD凶襲突','Modern OD Cruel Fate','one-button direction branch > safe jump/pressure','Input-dependent','any','簡易入力補正。','modern_only','https://www.sukoreru.com/sf6-modern-aki'),
('aki-y4-modern-sa-oki','MワンボタンSA後','Modern SA1/2/3','DR strike/throw/poison branch','SA-specific','any','SA別・簡易補正別。','modern_only','https://giyuki.net/archives/6080');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'oki',r.starter,r.seq,r.adv,r.pos,r.descr,'Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',p.id,'unverified',r.ck,'draft' from p30_setup r join characters c on c.slug='aki' cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

create temporary table p30_seq(slug text,name text,seq text,notes text,ck text,src text) on commit drop;
insert into p30_seq values
('aki-y4-poison-state-cycle','毒状態循環','no poison > poison application > poison pressure > burst combo > reapply poison','Track exactly where poison starts, bursts and ends.','strategy','https://note.com/emesirna/n/nf0ef76289f94'),
('aki-y4-hk-slide-tree','強K悪鬼蛇行分岐','5HK > no cancel / L Snake Step / Venomous Fang / Entrapment / L Lash','Fang is -3 on guard source claim; DI/fuzzy jump answers.','strategy','https://note.com/terry631/n/ne20915912f66'),
('aki-y4-rush-tree','高速ラッシュ択','DR > 5MP / 2MK low / 3MP overhead / 6HK / L Lash / throw','Record hit/guard plus and ranges.','strategy','https://takukakugamer.com/sf6-aki-howtouse/'),
('aki-y4-bubble-shield-tree','紫煙砲盾分岐','Nightshade Pulse > DR approach / OD Snake Step cancel against jump/projectile answer','Projectile is not a guaranteed shield.','strategy','https://takukakugamer.com/sf6-aki-howtouse/'),
('aki-y4-od-cruelfate-tree','OD凶襲突方向分岐','OD Cruel Fate neutral/back/forward > hit hard knockdown / guard +2 / whiff punish risk','Record all distances.','strategy','https://takukakugamer.com/sf6-aki-howtouse/'),
('aki-y4-hwhip44-tree','強鞭+44全分岐','H Lash knockdown > M Snake Step / whiff Chi Wen / dash overhead / DR low / DR overhead / safe jump','Path-dependent spacing must stay distinct.','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-frame-family-tree','ダウンフレーム別管理','+19 throw / +27 back throw-2HP / +32 spray-2HP / +38 puddle / +40 spray / +42 OD dive / +44 H Lash','Do not merge rise behavior.','strategy','https://st6-aki-laboratory.com/setplay.html'),
('aki-y4-poisonburst-choice','毒破裂後締め選択','burst > H Lash oki / delayed L Lash +35 / puddle corner / SA / Drive extension','Choose by corner, Drive, SA and poison reapplication.','strategy','https://note.com/terry631/n/nb3327f900fcd'),
('aki-y4-corner-puddle-tree','端毒沼鳥籠','puddle active > 5HK frame kill > low / overhead / throw-space shimmy / poison burst','Record true blockstrings and jump windows.','strategy','https://note.com/takasin667/n/n69b37c49a845'),
('aki-y4-6hk-pressure','囚牛有利連携','6HK/DR 6HK > 5LK L Lash / 6HK chain / throw / shimmy','Guard advantage and DI windows.','strategy','https://takukakugamer.com/sf6-aki-howtouse/'),
('aki-y4-2mk-counter-tree','屈中K NH/CH分岐','2MK > NH 5LK / CH 5MP > poison route / guard +1 pressure','Official current frames required.','strategy','https://takukakugamer.com/sf6-aki-howtouse/'),
('aki-y4-resource-choice','毒とゲージ判断','hit > no-Drive H Lash / Drive2 OD bubble-whip / Drive6 lethal / SA-specific ender','Track poison and Drive recovery interaction.','strategy','https://note.com/terry631/n/ne20915912f66'),
('aki-y4-modern-assist-stop','Mアシスト確認停止','Assist L/M/H > stop on block / poison ender / automatic OD-SA route','BO Assist M projectile substitution.','modern_only','https://giyuki.net/archives/6080'),
('aki-y4-modern-poison-cycle','M毒循環','Assist/one-button poison > strike-throw > burst > reapply','Simple-input scaling separate.','modern_only','https://www.sukoreru.com/sf6-modern-aki'),
('aki-y4-modern-onebutton-defense','Mワンボタン防御','jump/pressure read > one-button anti-air Lash / OD Cruel Fate / SA','Invulnerability and scaling required.','modern_only','https://giyuki.net/archives/6080'),
('aki-y4-modern-bo-tree','Mバーンアウト分岐','Assist M in BO > normal projectile / manual safe ender / SA defense','Record gaps and punish ranges.','modern_only','https://giyuki.net/archives/6080');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,false,'record 4F gaps','record throw point','record shimmy spacing','record jump escape','record parry answer','record D-reversal','record reversal',r.notes,p.id,'unverified',r.ck,'draft' from p30_seq r join characters c on c.slug='aki' cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note) select 'combo',x.id,s.id,'supporting','Written/image claim; capture required.' from p30_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note) select 'setup',x.id,s.id,'supporting','Written/image claim; capture required.' from p30_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note) select 'sequence',x.id,s.id,'supporting','Written decision tree; capture required.' from p30_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select e.typ,e.id,s.id,'patch_context','2026-08-03 official A.K.I. baseline.' from(select 'combo' typ,x.id from p30_combo r join combos x on x.slug=r.slug union all select 'setup',x.id from p30_setup r join setups x on x.slug=r.slug union all select 'sequence',x.id from p30_seq r join sequences x on x.slug=r.slug)e cross join sources s where s.url='https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/aki' on conflict(entity_type,entity_id,source_id) do nothing;

with e as(select 'combo' typ,x.id,x.slug,x.name,x.notation method,x.content_kind from p30_combo r join combos x on x.slug=r.slug union all select 'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind from p30_setup r join setups x on x.slug=r.slug union all select 'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind from p30_seq r join sequences x on x.slug=r.slug),p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【A.K.I.撮影待ち】'||e.name,case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,'文章・画像から収集した攻略の現行成立を確定する。','advanced',15,c.id,'入力履歴・フレーム・ダメージ・Drive/SA・毒状態を表示。操作、位置、受け身、CH/PC、強度を指定。','4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,'左右各10回で成立、数値、位置、受け身、毒付与・破裂、簡易補正、キャラ条件を記録。',20,'成立ならverified候補。不成立ならarchived。',p.id,'unverified',e.content_kind,'draft' from e join characters c on c.slug='aki' cross join p on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id) select t.id,e.typ,e.id from trainings t join(select 'combo' typ,x.id,x.slug from p30_combo r join combos x on x.slug=r.slug union all select 'setup',x.id,x.slug from p30_setup r join setups x on x.slug=r.slug union all select 'sequence',x.id,x.slug from p30_seq r join sequences x on x.slug=r.slug)e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note) select 'training',t.id,es.source_id,'supporting','Inherited from related strategy.' from trainings t join training_relations tr on tr.training_id=t.id join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id where t.player_character_id=(select id from characters where slug='aki') on conflict(entity_type,entity_id,source_id) do nothing;
insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes) select t.player_character_id,t.id,'pending',case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' or t.name ilike '%毒%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,'2026-08-03版の成立、入力、数値、位置、受け身、毒付与・破裂、技強度、簡易補正、Classic/Modern差を確認。' from trainings t where t.slug in(select 'training-'||slug from p30_combo union all select 'training-'||slug from p30_setup union all select 'training-'||slug from p30_seq) on conflict(training_id) do nothing;

update character_content_packages p set rollout_status='complete',combo_status='complete',setup_status='complete',sequence_status='complete',training_status='complete',source_status='complete',patch_status='complete',verification_status='review',notes=concat_ws(E'\n',nullif(p.notes,''),'2026-09-01 phase30: A.K.I. written/image-only Classic and Modern collection completed; poison state/burst and frame families separated; all draft/unverified.'),updated_at=now() where p.character_id=(select id from characters where slug='aki');
