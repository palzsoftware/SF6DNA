-- Lily written/image-only strategy collection for the 2026-08-03 patch.
-- No video playback was used. All community routes remain draft/unverified until capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
 ('LILY バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/lily','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current-patch change list; includes light Condor Wind strike/charge input branch.'),
 ('リリー実戦用コンボまとめ 2026.8','https://note.com/hanahino/n/nd35fc00acbb6','community_guide','日野ハナ','2026-08-01 00:00:00+00'::timestamptz,now(),'community','Current-month written Classic routes and setup claims.'),
 ('Mリリー 初心者が本当に知りたい立ち回り','https://note.com/gokuri_/n/ndd07350c2dff','community_guide','ごくり','2025-03-11 00:00:00+00'::timestamptz,now(),'community','Article explicitly updated for 2026-08-03 Modern Lily behavior.'),
 ('リリーの基本的な使い方 コンボ・起き攻め・セットプレイ','https://takukakugamer.com/sf6-lily-howtouse/','community_guide','格ゲーブロガー拓','2026-03-01 00:00:00+00'::timestamptz,now(),'community','Written/image Classic routes and detailed frame setup table; pre-current-patch claims require capture.'),
 ('アルマスリリー完全ガイド 26年更新版','https://momiageryo.com/2024/04/21/sf6_lilystrategy/','community_guide','もみあげリョウ',null::timestamptz,now(),'community','2026-updated written combos and oki; exact update point requires capture.'),
 ('リリーマスター最低限使い方メモ','https://note.com/kch_/n/ne17fb373f776','community_guide','kch_',null::timestamptz,now(),'community','Written wind-resource loops, DI routes and oki.'),
 ('モダンリリーの評価・コンボ','https://kamigame.jp/streetfighter6/page/350088999953554576.html','community_guide','神ゲー攻略','2026-02-22 00:00:00+00'::timestamptz,now(),'community','Modern assist routes with images and resource notes.'),
 ('モダンリリーでマスター到達メモ','https://note.com/ooookapia/n/n499fff0be9cf','community_guide','okapia',null::timestamptz,now(),'community','Modern strike/throw setup claims; legacy candidate.'),
 ('0から始めるリリー','https://note.com/lilililily/n/n5c569addea31','community_guide','ろきそ',null::timestamptz,now(),'community','Written Spire strength and pressure-selection rules.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p27_combo(
 slug text,name text,cat text,notation text,starter text,pos text,diff int,purpose text,conditions text,ck text,src text
) on commit drop;
insert into p27_combo values
-- Classic, no Windclad stock.
('lily-y4-2lk-2lp-m-tomahawk','小足小P中トマホーク','light','2LK > 2LP > M Tomahawk Buster','2LK','any',2,'風なし小技','At tip replace Tomahawk with OD Spire.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-5lk-2lk-5lp-tomahawk','立小K刻み中トマホーク','light','5LK > 2LK > 5LP > M Tomahawk Buster','5LK','any',3,'風なし4F始動','Current spacing must be confirmed.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-5lk-ch-5mk-spire','立小K CH中K弱スパイア','counter','5LK(CH) > 5MK > L Condor Spire','5LK counter','any',3,'Classic限定CH','Classic only; very close range.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-light-ch-2mp-sa1','小P CH屈中P SA1','counter','5LP/2LP(CH) > 2MP > SA1','light punch counter','any',4,'5F確反SA1候補','2MP is SA-cancel only.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-2mk-light-wind','中足弱ウインド打撃派生','medium','2MK > L Condor Wind quick release','2MK','any',3,'2026新下段確認','Large disadvantage on block; current input timing required.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-2mk-od-wind-sa2','中足ODウインドSA2','sa','2MK > OD Condor Wind > SA2','2MK','any',4,'下段SA2','Drive2 + SA2; reserve for BO/lethal.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-5mk-light-spire','立中K弱スパイア','medium','5MK > L Condor Spire','5MK','any',2,'風なし中技','Current range required.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-5mk-od-wind','立中K ODウインド','medium','5MK > OD Condor Wind','5MK','any',3,'風回収','Drive2 and stock gain.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-5mk-cdr-2hp-hwind','立中Kラッシュ強ウインド','drive','5MK > CDR 2HP > H Condor Wind','5MK','any',4,'中技Drive風回収','Drive3.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-2hp-mwind','屈強P中ウインド','heavy','2HP > M Condor Wind','2HP','any',2,'主力風回収','Two-hit confirm; DI can interrupt on block.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-2hp-mwind-sa3','屈強P中ウインドSA3','sa','2HP > M Condor Wind > SA3','2HP','any',3,'主力SA3','SA3.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-2hp-odwind-sa2','屈強P ODウインドSA2','sa','2HP > OD Condor Wind > SA2','2HP','any',3,'省エネSA2','Drive2 + SA2.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-2hp-double-cdr-sa3','屈強PダブルラッシュSA3','sa','2HP > CDR 4HP > 5MK > CDR 2HP > M Condor Wind > SA3','2HP','any',5,'風なし最大候補','Drive6 + SA3.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-4hp-cdr-2hp-wind','ホーンブレイクラッシュ風回収','drive','4HP > CDR 2HP > M Condor Wind','4HP','any',4,'差し返しDrive','Drive3.','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-4hp-hwind','ホーンブレイク強ウインド','heavy','4HP > H Condor Wind','4HP','any',2,'長距離風回収','H Wind link claim.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-5hp-pc-6hp-hwind','立強Pパニカン強ウインド','punish','5HP(PC) > 6HP > H Condor Wind','5HP punish counter','any',3,'無敵技反撃','Wind recovery ender.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-j2hp-2hp-wind','ボディプレス屈強Pウインド','jump','j.2HP > 2HP > M Condor Wind','j.2HP','any',3,'めくり風回収','Depth dependent.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-air-target-sa1','空対空ダブルアローSA1','anti_air','j.MP > j.MP target > SA1','air-to-air j.MP','any',4,'空対空SA1','Height dependent.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-air-target-l-tomahawk','空対空ダブルアロー弱トマホーク','anti_air','j.MP > delayed j.MP target > L Tomahawk Buster','air-to-air j.MP','any',4,'空対空着地追撃','Delay timing required.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-di-windless-recovery','中央DI風回収','impact','DI(PC) > neutral j.2HP > 6HP > H Condor Wind > L Condor Wind charge','DI punish counter','midscreen',4,'中央DI風回収','Final Wind is post-combo charge; separate combo/stock timing in capture.','strategy','https://momiageryo.com/2024/04/21/sf6_lilystrategy/'),
('lily-y4-wall-4hp-hwind','端DI強ウインド','impact','DI wall splat > 4HP > H Condor Wind','DI wall splat','corner',3,'端DI風回収','Choice prioritizes stock.','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-wall-4hp-odwind-sa2','端DI ODウインドSA2','impact','DI wall splat > 4HP > OD Condor Wind > SA2','DI wall splat','corner',4,'端DI SA2','Drive2 + SA2.','strategy','https://momiageryo.com/2024/04/21/sf6_lilystrategy/'),
('lily-y4-aa-2hp-mwind','屈強P対空中ウインド','anti_air','2HP anti-air > M Condor Wind','2HP anti-air','any',4,'対空風回収','Air-hit height and second-hit behavior required.','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-drev-punish-throw','Dリバ反撃強タイフーン','punish','blocked Drive Reversal > H Mexican Typhoon','Drive Reversal punish','any',2,'Dリバ確反','Throw range and punish state required.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
-- Classic, Windclad stock required.
('lily-y4-wind-light-mspire','風小技中スパイア','light','2LK > 2LP x1-2 > Windclad M Condor Spire','2LK','any',3,'風小技起き攻め','LP count depends on distance; consumes 1 Wind.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wind-light-tomahawk-sweep','風小技トマホーク大足','light','2LK > 2LP x2 > Windclad L Tomahawk Buster > 2HK','2LK','any',4,'風小技ダウン','Stock and height dependent.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wind-light-tomahawk-sa1','風小技トマホークSA1','sa','2LK > 2LP x2 > Windclad L Tomahawk Buster > SA1','2LK','any',4,'風小技SA1','Consumes Wind + SA1.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wind-5lk-5lp-spire','風立小K小P弱スパイア','light','5LK > 5LP > Windclad L Condor Spire','5LK','any',2,'風4F確認','Source +47 claim.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-wind-2mk-lspire','風中足弱スパイア','medium','2MK > Windclad L Condor Spire','2MK','any',2,'風下段連ガ候補','Strength/spacing must be captured.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wind-2mk-mspire','風中足中スパイア','medium','2MK > Windclad M Condor Spire','2MK','any',2,'風下段起き攻め','Source says L/M can form a blockstring.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wind-2hp-hspire','風屈強P強スパイア','heavy','2HP > Windclad H Condor Spire','2HP','any',3,'風主力起き攻め','Consumes 1 Wind.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wind-6hp-hspire','風前強P強スパイア','heavy','6HP > Windclad H Condor Spire','6HP','any',3,'風長距離起き攻め','Spacing dependent.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wind-di-sa1','風中央DI SA1','impact','DI(PC) > neutral j.2HP > 6HP > Windclad M Condor Spire > SA1','DI punish counter','midscreen',4,'風中央DI SA1','Consumes Wind + SA1.','strategy','https://momiageryo.com/2024/04/21/sf6_lilystrategy/'),
('lily-y4-wind-corner-2hp-max','風端屈強P全部乗せ','sa','2HP > Windclad H Condor Spire > Windclad OD Tomahawk Buster > Windclad OD Condor Dive > SA1/SA2','2HP','corner',5,'風端リーサル','Requires multiple Wind stocks and Drive4.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wind-corner-mspire-od-air','風端中スパイア空中追撃','corner','Windclad M Condor Spire(2 hits) > OD Tomahawk Buster > OD Condor Dive','Windclad M Spire two-hit state','corner',5,'風端特殊追撃','Requires at least two stocks; only on two-hit Spire state.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wind-air-max','風端空対空最大','anti_air','j.MP > delayed j.MP target > Windclad OD Tomahawk Buster > Windclad OD Condor Dive > SA1/SA2','air-to-air j.MP','corner',5,'風端空対空','Height, stocks and Drive4 required.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wind-wall-spire-tomahawk','風端DIスパイアトマホーク','impact','DI wall splat > 4HP > Windclad H Condor Spire > Windclad H Tomahawk Buster','DI wall splat','corner',4,'風端DI状況','Needs at least two stocks.','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-wind-wall-full-sa','風端DI全部乗せ','impact','DI wall splat > 4HP > Windclad H Spire > Windclad OD Tomahawk > Windclad OD Dive > SA1/SA2','DI wall splat','corner',5,'風端DIリーサル','Stocks and Drive4 required.','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-stun-zero-wind','風0スタン最大','stun','stun > max-charge L Condor Wind > 2HP > Windclad H Spire > OD Tomahawk > OD Dive > SA1/SA2','opponent stun, Wind 0','corner',5,'風0スタン','Exact charge and resource count required.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-stun-wind-stock','風ありスタン最大','stun','stun > back jump > backdash > j.HK > 4HP > Windclad H Tomahawk > OD Tomahawk > OD Dive > SA2','opponent stun, Wind 1+','corner',5,'風ありスタン','Complex timing; source notes damage scales with stocks.','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
-- Modern-only routes.
('lily-y4-modern-assist-light-odspire','M弱アシストODスパイア','assist','Assist L: 2LK > 2LP > OD Condor Spire','Modern Assist L','any',1,'モダン小技','Drive2; inefficient unless Drive is abundant.','modern_only','https://kamigame.jp/streetfighter6/page/350088999953554576.html'),
('lily-y4-modern-assist-light-tomahawk','M弱アシスト強トマホーク','assist','Assist L: 2LK > 2LP > H Tomahawk Buster','Modern Assist L, burnout/no Drive','any',1,'モダンBO小技','Automatic no-Drive branch.','modern_only','https://kamigame.jp/streetfighter6/page/350088999953554576.html'),
('lily-y4-modern-wind-light-spire','M風小技中スパイア','light','5L/2L > 2L > Windclad M Condor Spire','Modern light','any',2,'モダン風小技','Manual ender conserves Drive.','modern_only','https://note.com/gokuri_/n/ndd07350c2dff'),
('lily-y4-modern-assist-medium-sa2','M中アシストODウインドSA2','assist','Assist M: 2MK > OD Condor Wind > SA2','Modern Assist M','any',2,'モダン下段SA2','Drive2 + SA2.','modern_only','https://kamigame.jp/streetfighter6/page/350088999953554576.html'),
('lily-y4-modern-assist-medium-spire','M中アシスト弱スパイア','assist','Assist M: 2MK > L Condor Spire','Modern Assist M, no SA/BO','any',2,'モダン下段','Automatic fallback branch.','modern_only','https://kamigame.jp/streetfighter6/page/350088999953554576.html'),
('lily-y4-modern-assist-heavy-sa3','M強アシスト中ウインドSA3','assist','Assist H: 2HP > M Condor Wind > SA3','Modern Assist H','any',1,'モダン主力SA3','SA3 auto branch; Wind stock gained before super.','modern_only','https://kamigame.jp/streetfighter6/page/350088999953554576.html'),
('lily-y4-modern-assist-heavy-wind','M強アシスト中ウインド','assist','Assist H: 2HP > M Condor Wind','Modern Assist H, no SA3','any',1,'モダン風回収','Stop/fallback branch.','modern_only','https://kamigame.jp/streetfighter6/page/350088999953554576.html'),
('lily-y4-modern-hornbreak-cdr','Mホーンブレイクラッシュ中アシスト','drive','4H > CDR 4H > Assist M > H/one-button Tomahawk','Modern 4H','any',4,'モダン差し返し','Drive3; command/manual strength changes damage.','modern_only','https://kamigame.jp/streetfighter6/page/350088999953554576.html'),
('lily-y4-modern-air-sa2','M空対空ダブルアローSA2','anti_air','j.M > j.M target > one-button SA2','Modern air-to-air','any',3,'モダン空対空SA2','Height and Wind stock version required.','modern_only','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-modern-air-od-dive','M空対空ODトマホークダイブ','anti_air','j.M > j.M target > OD Tomahawk > OD Condor Dive','Modern air-to-air','corner',4,'モダン空対空Drive','Drive4; height dependent.','modern_only','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-modern-corner-air-sa1','M端空対空SA1','anti_air','j.M > j.M target > OD Tomahawk > OD Dive > SA1','Modern air-to-air','corner',5,'モダン端空対空','Drive4 + SA1.','modern_only','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-modern-di-spire-sa1','M風中央DI SA1','impact','DI(PC) > j.2H > 6H > Windclad M Spire > one-button SA1','DI punish counter','midscreen',4,'モダンDI SA1','Wind + SA1.','modern_only','https://momiageryo.com/2024/04/21/sf6_lilystrategy/');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.cat,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,
 'Written/image-only collection. No video playback; current-device capture required.',p.id,'unverified',r.ck,'draft'
from p27_combo r join characters c on c.slug='lily'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Written/image route; current-device capture required.'
from p27_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'patch_context','2026-08-03 official Lily change baseline.'
from p27_combo r join combos x on x.slug=r.slug
join sources s on s.url='https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/lily'
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p27_setup(
 slug text,name text,starter text,seq text,adv text,pos text,descr text,ck text,src text
) on commit drop;
insert into p27_setup values
('lily-y4-no-wind-tomahawk-charge','風なしトマホーク後風回収','M Tomahawk Buster +36~41','L Condor Wind charge / DR approach','Variable by hit position','any','起き攻めより風回収を優先。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-no-wind-lspire33','風なし弱スパイア+33','L Condor Spire +33','dash > micro-walk > 2HP / throw / block','Position-dependent','midscreen','間合いと受け身で重なり方を確認。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-no-wind-mspire37','風なし中スパイア+37','M Condor Spire +37','dash > dash/DR > 2HP / throw / Wind charge','Source +37 claim','midscreen','風回収との比較。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-no-wind-hspire37','風なし強スパイア+37','H Condor Spire +37','dash > dash/DR > 2HP / throw / Wind charge','Source +37 claim','midscreen','距離差を中版と分離。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-wind-lspire-double-dash','風弱スパイア前ステ2回','Windclad L Spire +47','dash > dash > throw / 2LK / 2LP / H Mexican Typhoon','Source +5 after two dashes','any','密着の打撃／投げ。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-wind-lspire-dr-meaty','風弱スパイアDR持続4強P','Windclad L Spire +47','dash > parry DR 4HP(meaty) > H Typhoon / hit confirm','Source hit +11 / guard +4 claim','any','4強P持続3F目重ね候補。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-wind-mspire-double-dash','風中スパイア前ステ2回','Windclad M Spire +49','dash x2 > 2HP / H Mexican Typhoon / block','Source +7 after two dashes','midscreen','中央密着択。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-wind-hspire-double-dash','風強スパイア前ステ2回','Windclad H Spire +52','dash x2 > 2HP / H Mexican Typhoon / block','Source +9 after two dashes','midscreen','中央密着択。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-wind-odspire56','風ODスパイア+56','Windclad OD Spire +56','dash x2 / forward jump > strike / throw / bait','Source +56 claim','any','弾抜け後を含む本命起き攻め。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-wind-spire-forward-jump-throw','風スパイア前飛び強タイフーン','Windclad M/H Spire hit','forward jump > H Mexican Typhoon','Oki claim','any','着地コマ投げ。','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-wind-spire-forward-jump-strike','風スパイア前飛び小技ループ','Windclad M/H Spire hit','forward jump > 2LP x2 > 5LP > Windclad M Spire','Oki claim','any','打撃択からスパイアループ。','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-wind-spire-double-dash-wind','風スパイア前ステ2回ウインド','Windclad M/H Spire hit','dash x2 > 2HP > M Condor Wind','Stock-recovery branch','any','打撃で風を回収。','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-wind-spire-delay-throw','風スパイア前ステ2回遅らせ投げ','Windclad M/H Spire hit','dash x2 > delayed H Mexican Typhoon','Throw branch','any','投げ間合いと遅らせ量を確認。','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-corner-mspire-light-wind','端風中スパイア弱ウインド+2','corner Windclad M Spire +49','L Condor Wind charge > throw / 2LK / 5LK / Mexican Typhoon','Source +2 after charge','corner','風再回収から密着択。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-corner-hspire-light-wind','端風強スパイア弱ウインド+5','corner Windclad H Spire +52','L Condor Wind charge > throw / 2LK / 2LP / Mexican Typhoon','Source +5 after charge','corner','風再回収から密着択。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-corner-forward-throw-4hp','端前投げ微歩き4強P','corner forward throw','micro-walk > 4HP(meaty)','Manual timing required','corner','打撃重ね。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-corner-forward-throw-dr','端前投げパリィDR','corner forward throw','parry DR stop > throw / 2HP','Source says fastest stop is -6','corner','6F無敵技には確定を取られる注意付き接近。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-command-throw-wind-charge','コマ投げ後弱ウインド','Mexican Typhoon hit','L Condor Wind charge','No guaranteed oki claim','any','距離を利用して風回収。','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-command-throw-dr-2hp','コマ投げ後DR屈強P','Mexican Typhoon hit','DR 2HP > Wind / CDR / throw branch','Manual approach','any','欲張る接近択として分離。','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-corner-command-odspire','端コマ投げ後風ODスパイア','corner Mexican Typhoon hit','immediate Windclad OD Spire(meaty) > hit: 6HP > H Wind / guard: 2HP or throw','Meaty/advantage claim','corner','持続スパイアを使うセットプレイ。','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wall-hwind-dash-2hp','端DI強ウインド前ステ屈強P','DI wall > 4HP > H Condor Wind','dash > 2HP > M/L Wind / throw','Oki claim','corner','風回収締めから打撃重ね。','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wall-hwind-whiff-2mp','端DI強ウインド屈中P空振り','DI wall > 4HP > H Condor Wind','whiff 2MP > throw / 2HP / SA1 bait','Source +3 after whiff','corner','バクステ反撃可否がキャラ差。','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-wall-wind-spire-safejump','端DI風強スパイア詐欺飛び','DI wall > 4HP > Windclad H Spire','whiff 5LK > forward jump attack / empty jump throw','Safe-jump claim','corner','詐欺飛びとジャストパリィ対策。','strategy','https://note.com/hanahino/n/nd35fc00acbb6'),
('lily-y4-midwind-hit-throw','中ウインドヒット後投げ','M Condor Wind hit +2','L/M Mexican Typhoon if close','Close-range only','any','距離で投げ強度を分離。','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-modern-wind-spire-jump-throw','M風スパイア後前飛びワンボタン投げ','Modern Windclad Spire hit','forward jump > one-button Mexican Typhoon','Oki claim','any','モダン着地投げ。','modern_only','https://note.com/gokuri_/n/ndd07350c2dff'),
('lily-y4-modern-corner-wind-charge-loop','M端スパイア弱ウインドループ','corner Modern Windclad Spire hit','L Condor Wind charge > Assist L x2 > Windclad Spire','Meaty claim','corner','4F暴れより先に打撃が出るという記事記載を確認。','modern_only','https://note.com/gokuri_/n/ndd07350c2dff'),
('lily-y4-modern-assist-h-od-throw','M強アシスト後ODタイフーン','Modern Assist H hit/pressure','OD Mexican Typhoon','Range-dependent','any','通常版では届かない距離向け投げ択。','modern_only','https://note.com/ooookapia/n/n499fff0be9cf'),
('lily-y4-modern-assist-h-light-spire','M強アシスト後弱アシスト風スパイア','Modern Assist H pressure','Assist L x2 > one-button Windclad Spire','Strike branch','any','下段打撃択。','modern_only','https://note.com/ooookapia/n/n499fff0be9cf');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'oki',r.starter,r.seq,r.adv,r.pos,r.descr,
 'Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',p.id,'unverified',r.ck,'draft'
from p27_setup r join characters c on c.slug='lily'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Written setup claim; current-device capture required.'
from p27_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'patch_context','2026-08-03 official Lily change baseline.'
from p27_setup r join setups x on x.slug=r.slug
join sources s on s.url='https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/lily'
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p27_seq(
 slug text,name text,seq text,trueblock boolean,mash text,throwp text,shimmy text,jumpopt text,parry text,drev text,inv text,notes text,ck text,src text
) on commit drop;
insert into p27_seq values
('lily-y4-light-wind-input-branch','2026弱ウインド短押し長押し','2HP/2MK > L Condor Wind: quick release strike / slight hold Wind charge',false,'strike timing check','after charge advantage','release/hold bait','jump check','parry check','D-reversal check','reversal check','New current-patch input branch; do not merge strike and stock-charge outcomes.','strategy','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/lily'),
('lily-y4-2hp-wind-cdr-tree','屈強P択分岐','2HP > L Wind DI-bait / M Wind stock / CDR 4HP pressure / stop',false,'4F after gaps','CDR throw','CDR stop','jump check','parry check','D-reversal check','invincible check','M Wind loses to DI; L Wind can recover to DI return depending timing.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-4hp-cdr-tree','ホーンブレイク仕込みラッシュ','4HP > on hit CDR 2HP > M Wind / on guard H Typhoon or 2LP/2HP',false,'2LP/2HP check','H Typhoon','CDR stop','jump escapes throw','parry loses to throw','D-reversal check','reversal bait','Separate hit-confirm route from guard pressure.','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-wind-spire-plus-tree','風スパイア+1打撃投げ','Windclad Condor Spire guard +1 > 5LK/2LP / Mexican Typhoon / block',false,'fast strike','Mexican Typhoon','block/backstep bait','jump escapes throw','parry loses to throw','D-reversal check','SA/OD reversal','Strength and spacing affect continuity; record each version.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-wind-odspire-plus2-tree','風ODスパイア+2打撃投げ','Windclad OD Spire guard +2 > throw / Mexican Typhoon / strike / block',false,'5LK/2LP','throw/H Typhoon','block','jump escapes throw','parry loses to throw','D-reversal check','reversal bait','Projectile-invulnerable entry; do not imply full strike invulnerability.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-mwind-hit-plus2-tree','中ウインドヒット+2投げ択','M Condor Wind hit +2 close > L/M Typhoon / 5LK confirm / block',false,'5LK','L/M Typhoon','block','jump escapes throw','parry loses to throw','D-reversal check','reversal check','Throw only reaches at close spacing.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-cdr-4hp-strike-throw','ラッシュ4強P打撃投げ','2HP/4HP > CDR 4HP > hit: 5MK/2MK route / guard: H Typhoon / strike / block',false,'4HP pressure','H Typhoon','CDR stop','jump check','parry loses to throw','D-reversal check','reversal bait','Meaty/normal hit advantage must be recorded separately.','strategy','https://takukakugamer.com/sf6-lily-howtouse/'),
('lily-y4-spire-strength-rule','風スパイア強度選択','raw Guillotine>L Spire / DR Guillotine>M Spire / two guarded Guillotines>H Spire / lightx3>OD only / lightx2>M / 2MK>H',false,'gap by strength','Typhoon after plus','stop','jump check','parry check','D-reversal check','reversal check','Written spacing rule; every branch needs current capture before verification.','strategy','https://note.com/lilililily/n/n5c569addea31'),
('lily-y4-wind-resource-cycle','風ストック循環','charge Wind > Windclad Spire > strike/throw > combo end in Wind > repeat',false,'strike branch','Typhoon branch','block','jump check','parry loses to throw','D-reversal check','reversal check','Track stock before/after; never label as guaranteed loop.','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-air-resource-choice','対空リソース選択','2HP>M Wind for stock / L Tomahawk for reliability / OD Tomahawk>OD Dive for lethal',false,'n/a','n/a','ground wait','air route','parry n/a','n/a','SA check','Choose by reaction time, Wind, Drive and lethal.','strategy','https://note.com/kch_/n/ne17fb373f776'),
('lily-y4-modern-assist-h-stop','M強アシスト確認停止','Assist H > stop on block / finish M Wind-SA3 on hit / L Wind quick release to answer DI',false,'4F check','one-button Typhoon','stop','jump check','parry loses to throw','D-reversal check','one-button reversal check','Current-patch L Wind input branch must be used, not old behavior.','modern_only','https://note.com/gokuri_/n/ndd07350c2dff'),
('lily-y4-modern-assist-h-dr-throw','M強アシストラッシュ投げ','Assist H guard > CDR > one-button/OD Mexican Typhoon',false,'CDR strike alternative','one-button/OD Typhoon','CDR stop','jump escapes throw','parry loses to throw','D-reversal check','reversal bait','DI interaction is source-claimed but needs current capture.','modern_only','https://note.com/gokuri_/n/ndd07350c2dff'),
('lily-y4-modern-dr-4hp-tree','Mラッシュ引き強P二択','Assist H/neutral > CDR 4H > strike route to Wind / one-button Typhoon',false,'strike branch','one-button Typhoon','block','jump escapes throw','parry loses to throw','D-reversal check','reversal bait','Record Modern scaling and manual-command variants separately.','modern_only','https://note.com/gokuri_/n/ndd07350c2dff'),
('lily-y4-modern-assist-resource','Mアシスト自動消費管理','Assist L/M/H > automatic OD/SA branch versus manual Spire/Wind/Tomahawk',false,'hit-confirm','throw after plus','stop','jump check','parry check','D-reversal check','one-button reversal','Separate BO, Drive available, SA available and Wind stock states.','modern_only','https://kamigame.jp/streetfighter6/page/350088999953554576.html'),
('lily-y4-modern-one-button-defense','Mワンボタン対空・SA防御','jump/pressure read > one-button Tomahawk / SA1 / SA2',false,'n/a','n/a','block','anti-air','parry option','D-reversal option','one-button SA','OD Tomahawk is not fully invincible; distinguish anti-air and throw invulnerability.','modern_only','https://takukakugamer.com/sf6-lily-howtouse/');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,r.trueblock,r.mash,r.throwp,r.shimmy,r.jumpopt,r.parry,r.drev,r.inv,r.notes,p.id,'unverified',r.ck,'draft'
from p27_seq r join characters c on c.slug='lily'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Written decision tree; current-device capture required.'
from p27_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'patch_context','2026-08-03 official Lily change baseline.'
from p27_seq r join sequences x on x.slug=r.slug
join sources s on s.url='https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/lily'
on conflict(entity_type,entity_id,source_id) do nothing;

with e as(
 select 'combo' typ,x.id,x.slug,x.name,x.notation method,x.content_kind from p27_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind from p27_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind from p27_seq r join sequences x on x.slug=r.slug
),p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【リリー撮影待ち】'||e.name,
 case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,
 '文章・画像から収集した攻略の2026-08-03版成立を確定する。','advanced',15,c.id,
 '入力履歴・フレーム・ダメージ・Drive/SA・風ストックを表示。Classic/Modern、位置、受け身、CH/PC、技強度を指定。',
 '4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,
 '左右各10回で成立、数値、位置、受け身、風消費、簡易補正、キャラ条件を記録。',20,
 '成立ならverified候補。不成立ならarchived。',p.id,'unverified',e.content_kind,'draft'
from e join characters c on c.slug='lily' cross join p
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(
 select 'combo' typ,x.id,x.slug from p27_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug from p27_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug from p27_seq r join sequences x on x.slug=r.slug
)e on t.slug='training-'||e.slug
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related strategy.'
from trainings t join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.player_character_id=(select id from characters where slug='lily')
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' or t.name ilike '%全部乗せ%' then 20
      when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,
 '2026-08-03版の成立、入力、数値、位置、受け身、風ストック、技強度、簡易補正、Classic/Modern差を確認。'
from trainings t
where t.slug in(
 select 'training-'||slug from p27_combo union all
 select 'training-'||slug from p27_setup union all
 select 'training-'||slug from p27_seq
)
on conflict(training_id) do nothing;

update character_content_packages p
set rollout_status='complete',combo_status='complete',setup_status='complete',sequence_status='complete',
    training_status='complete',source_status='complete',patch_status='complete',verification_status='review',
    notes=concat_ws(E'\n',nullif(p.notes,''),
      '2026-09-01 phase27: Lily written/image-only Classic and Modern collection completed. 2026 light Condor Wind input branch is separated; all strategies remain draft/unverified with capture backlog.'),
    updated_at=now()
where p.character_id=(select id from characters where slug='lily');
