-- Zangief written/image-only strategy collection for the 2026-08-03 patch.
-- No video playback was used. Community claims remain draft/unverified until capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
 ('ZANGIEF バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/zangief','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current-patch change list.'),
 ('ザンギエフ コンボとセットアップ 2026.08.03 update','https://note.com/good_lion2040/n/n95791feb0a8b','community_guide','キノコ灯','2026-08-25 00:00:00+00'::timestamptz,now(),'community','Current-patch written routes and frame claims.'),
 ('ザンギエフ つかいかた かんたん','https://note.com/bonmoko_3/n/nc4bad58533ad','community_guide','ボンモコ',null::timestamptz,now(),'community','Written basic combos and Lariat oki.'),
 ('強いうちにザンギで遊ぶための起き攻めとかコンボとか','https://note.com/lilililily/n/n9496928c9223','community_guide','ろきそ','2024-06-02 00:00:00+00'::timestamptz,now(),'community','Legacy detailed routes; capture required after later patches.'),
 ('SF6 ザンギエフコンボ表','https://note.com/kichipa_/n/n0b430978c306','community_guide','キチパ',null::timestamptz,now(),'community','Written combo branches and SA2 follow-ups.'),
 ('モダンザンギエフ 極楽マスター講座','https://note.com/blotzky_apex/n/n78f4cec38d38','community_guide','ブロツキー','2026-07-01 00:00:00+00'::timestamptz,now(),'community','Modern written pressure and oki; predates current patch by one month.'),
 ('モダンザンギエフの評価とコンボ','https://kamigame.jp/streetfighter6/page/315303624941027951.html','community_guide','神ゲー攻略','2026-02-21 00:00:00+00'::timestamptz,now(),'community','Modern assist routes with images and damage claims.'),
 ('モダンザンギエフを考えよう コンボ編','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525','community_guide','よしみつ速報','2024-05-03 00:00:00+00'::timestamptz,now(),'community','Legacy Modern combo list; capture required.'),
 ('vsザンギエフ キャラ対メモ S4','https://note.com/emesirna/n/n08d1cd10fe88','community_guide','さーな','2026-08-13 00:00:00+00'::timestamptz,now(),'community','Current-patch defensive observations used to classify false strings.'),
 ('ザンギでマスターを目指すの巻','https://note.com/mochimochi_sf/n/nf0bcf03e3f3b','community_guide','もちもち',null::timestamptz,now(),'community','Written beginner routes.'),
 ('わからないときに見るザンギエフ攻略ガイド','https://note.com/konpiragobo/n/n9d76f80b1439','community_guide','こんぴらごぼう',null::timestamptz,now(),'community','Written knockdown and defensive interaction notes.'),
 ('脱・雰囲気ザンギ SAとコンボ選択','https://note.com/konpiragobo/n/n3128a074f8de','community_guide','こんぴらごぼう',null::timestamptz,now(),'community','Written SA choice guidance; current capture required.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p26_combo(
 slug text,name text,cat text,notation text,starter text,pos text,diff int,purpose text,conditions text,ck text,src text
) on commit drop;
insert into p26_combo values
('zangief-y4-2lk-lp-lariat','小足小Pノーマルラリアット','light','2LK > 5LP > Double Lariat','2LK','any',2,'小技ノーゲージ','Source +27 claim; hold forward during Lariat.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-2lk-lp-od-lariat','小足小P ODラリアット','light','2LK > 5LP > OD Double Lariat','2LK','any',2,'小技起き攻め','Drive2; Source +38 claim.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-2lp2-lariat','しゃがみ小P2回ラリアット','light','2LP x2 > Double Lariat','2LP','any',2,'4F暴れ確認','Spacing-sensitive.','strategy','https://note.com/kichipa_/n/n0b430978c306'),
('zangief-y4-light-cdr-lariat','小技CDRヘルスタブラリアット','light','2LK > 5LP > CDR 2LP > 3MP > Double Lariat','2LK','any',4,'小技運び','Drive3; Source +27 claim.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-light-cdr-od-lariat','小技CDRヘルスタブODラリアット','light','2LK > 5LP > CDR 2LP > 3MP > OD Double Lariat','2LK','any',4,'小技起き攻め','Drive5.','strategy','https://note.com/bonmoko_3/n/nc4bad58533ad'),
('zangief-y4-light-cdr-sa2','小技CDRヘルスタブSA2','sa','2LK > 5LP > CDR 2LP > 3MP > SA2','2LK','any',4,'小技SA2','Drive3 + SA2.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-light-double-cdr-lariat','小技ダブルCDRラリアット','drive','2LK > 5LP > CDR 2LP > 3MP > CDR 2MP > 3MP > Double Lariat','2LK','any',5,'小技最大ノーSA','Drive6; Source +27 claim.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-light-double-cdr-sa2','小技ダブルCDR SA2','sa','2LK > 5LP > CDR 2LP > 3MP > CDR 2MP > 3MP > SA2','2LK','any',5,'小技最大SA2','Drive6 + SA2.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-light-od-lariat-sa2','小技ODラリアットSA2','sa','2LK > 5LP > OD Double Lariat > SA2','2LK','any',3,'小技SA2簡易','Drive2 + SA2.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-light-od-lariat-sa3','小技ODラリアットSA3','sa','2LK > 5LP > OD Double Lariat > SA3','2LK','any',3,'小技SA3','Drive2 + SA3.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-5lk-ch-cdr','立小K CHラッシュ','counter','5LK(CH/PC) > CDR 2MP > 3MP > Double Lariat','5LK counter','any',4,'ラッシュ止め反撃','Drive3; Source +27 claim.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-5mp-ch-target','立中PカウンターTC','counter','5MP(CH) > 5MP > 5MP','5MP counter','any',2,'カウンター確認','Source +27 claim; second hit may whiff at tip.','strategy','https://note.com/bonmoko_3/n/nc4bad58533ad'),
('zangief-y4-dr-2mk-lariat','DR中足ヘルスタブラリアット','drive','DR 2MK > 3MP > Double Lariat','DR 2MK','any',3,'ラッシュ下段','2MK source hit +7 claim.','strategy','https://note.com/bonmoko_3/n/nc4bad58533ad'),
('zangief-y4-dr-2mk-od-lariat','DR中足ヘルスタブODラリアット','drive','DR 2MK > 3MP > OD Double Lariat','DR 2MK','any',3,'ラッシュ下段起き攻め','Drive3 total.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-headbutt-lariat','ヘッドバットヘルスタブラリアット','heavy','6HP(meaty/CH/DR) > 3MP > Double Lariat','6HP meaty/counter/Drive Rush','any',3,'主力打撃','Normal raw hit may not link; condition mandatory.','strategy','https://note.com/bonmoko_3/n/nc4bad58533ad'),
('zangief-y4-headbutt-od-lariat','ヘッドバットODラリアット','heavy','6HP(meaty/CH/DR) > 3MP > OD Double Lariat','6HP meaty/counter/Drive Rush','any',3,'主力起き攻め','Drive2; Source 2700 claim is not treated as current fact.','strategy','https://note.com/bonmoko_3/n/nc4bad58533ad'),
('zangief-y4-headbutt-od-sa3','ヘッドバットODラリアットSA3','sa','6HP(meaty/CH/DR) > 3MP > OD Double Lariat > SA3','6HP meaty/counter/Drive Rush','any',4,'主力SA3','Drive2 + SA3.','strategy','https://note.com/kichipa_/n/n0b430978c306'),
('zangief-y4-jmk-lariat','J中Kヘルスタブラリアット','jump','j.MK > 3MP > Double Lariat','j.MK','any',3,'飛び基本','Deep-hit requirement.','strategy','https://note.com/mochimochi_sf/n/nf0bcf03e3f3b'),
('zangief-y4-jmk-cdr-lariat','J中Kラッシュ伸ばし','jump','j.MK > 3MP > CDR 2MP > 3MP > Double Lariat','j.MK','any',4,'飛びDrive','Drive3.','strategy','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-jmk-cdr-sa2','J中KラッシュSA2','sa','j.MK > 3MP > CDR 2MP > 3MP > SA2','j.MK','any',4,'飛びSA2','Drive3 + SA2.','strategy','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-jmk-sa2-sa1','J中K SA2からSA1','sa','j.MK > 3MP > CDR 2MP > 3MP > SA2(hold) > dash > 3MP > SA1','j.MK','any',5,'飛びSA3相当','Drive3 + SA3 total; hold timing required.','strategy','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-jmk-od-sa3','J中K ODラリアットSA3','sa','j.MK > 3MP > OD Double Lariat > SA3','j.MK','any',4,'飛びSA3','Drive2 + SA3.','strategy','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-bodypress-light-lariat','ボディプレス小技ラリアット','jump','j.2HP > 6HP > 2LP > 5LP > Double Lariat','j.2HP body press','any',4,'めくり基本','Legacy route; depth and current headbutt advantage require capture.','strategy','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-bodypress-cdr-lariat','ボディプレスラッシュ伸ばし','jump','j.2HP > 6HP > CDR 6HP > 3MP > Double Lariat','j.2HP body press','any',5,'めくりDrive','Legacy route; Drive3.','strategy','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-di-russian','中央DIロシアンスープレックス','impact','DI(PC) > Russian Suplex','DI punish counter','midscreen',2,'中央DI起き攻め','Source damage and gauge-gain claims require capture.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-di-max-sa3','中央DI最大SA3','impact','DI(PC) > 6HP > 3MP > CDR 2MP > 3MP > OD Double Lariat > SA3','DI punish counter','midscreen',5,'中央DIリーサル','Drive5 + SA3.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-di-sa2-borscht','中央DI SA2ボルシチ','impact','DI(PC) > 6HP > 3MP > SA2(hold) > dash > 3MP > OD Borscht Dynamite','DI punish counter','midscreen',5,'中央DI SA2','SA2 + Drive2.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-di-double-cdr','中央DIダブルラッシュラリアット','impact','DI(PC) > 6HP > 3MP > CDR 2MP > 3MP > CDR 2MP > 3MP > Double Lariat','DI punish counter','midscreen',5,'中央DIノーSA最大候補','Drive6.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-di-dash-stab-lariat','中央DI前ステヘルスタブ','impact','DI(PC) > dash > 3MP > Double Lariat','DI punish counter','midscreen',3,'中央DI状況重視','No Drive used in combo; oki via DR.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-di-jhp-dr-stab','中央DI垂直入れ替え維持','impact','DI(PC) > neutral j.HP > DR 3MP > Double Lariat','DI punish counter','midscreen',5,'中央DI位置維持','Legacy spacing route.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-wall-3hk-6hp','端DIドロップキック','impact','DI wall splat > 3HK > 6HP > Double Lariat','DI wall splat','corner',4,'端壁コンボ','3HK spacing and follow-up require capture.','strategy','https://note.com/kichipa_/n/n0b430978c306'),
('zangief-y4-punish-russian','無敵技確反ロシアン','punish','blocked invincible reversal > Russian Suplex','reversal punish counter','any',2,'確反起き攻め','Use when side switch is acceptable.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-punish-6hk-lariat','無敵技確反前強K','punish','6HK(PC) > 3MP > Double Lariat','reversal punish counter','any',4,'確反打撃','Range-dependent.','strategy','https://note.com/kichipa_/n/n0b430978c306'),
('zangief-y4-punish-6hk-od-borscht','無敵技確反前強K ODボルシチ','punish','6HK(PC) > 3MP > OD Double Lariat > OD Borscht Dynamite','reversal punish counter','any',5,'確反最大候補','Drive4.','strategy','https://note.com/kichipa_/n/n0b430978c306'),
('zangief-y4-aa-2hp-close','近距離屈強P対空PC','anti_air','2HP(air PC close) > dash > OD Borscht Dynamite','2HP anti-air punish counter','any',4,'対空近距離','Height and range dependent.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-aa-2hp-far','遠距離屈強P対空PC','anti_air','2HP(air PC far) > DR 6MK > 3MP > Double Lariat','2HP anti-air punish counter','any',5,'対空遠距離','Height and range dependent.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-dr-2lp-ch-2hk','DR屈小Pカウンター大足','counter','DR 2LP(CH) > 2HK','DR 2LP counter','any',3,'ラッシュ暴れ潰し','Range-dependent hard knockdown.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-dr-2lp-pc-headbutt','DR屈小Pパニカン頭突き','counter','DR 2LP(PC close) > 6HP > 3MP > OD Double Lariat','DR 2LP punish counter','any',4,'ラッシュPC','Close only; Drive3 total.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-stun-sa3','スタンSA3','stun','stun > j.HP > 6HP > 3MP > OD Double Lariat > SA3','opponent stun','corner',4,'スタンリーサル','Current damage and timing require capture.','strategy','https://note.com/kichipa_/n/n0b430978c306'),
('zangief-y4-sa2-hold-borscht','SA2ホールドODボルシチ','sa','OD Double Lariat > SA2(hold) > OD Borscht Dynamite','OD Double Lariat','any',5,'SA2対空追撃','Drive4 + SA2; height dependent.','strategy','https://note.com/kichipa_/n/n0b430978c306'),
-- Modern-only routes.
('zangief-y4-modern-assist-light','M弱アシストラリアット','assist','Assist L: 2LK > 5LP > Double/OD Double Lariat','Modern Assist L','any',1,'モダン小技','Auto selects OD when Drive is available; manual ender conserves Drive.','modern_only','https://kamigame.jp/streetfighter6/page/315303624941027951.html'),
('zangief-y4-modern-light-manual','M小技手動ラリアット','light','2L > 5L > manual Double Lariat','Modern 2L','any',2,'モダン省エネ','Manual Lariat avoids automatic OD spend.','modern_only','https://kamigame.jp/streetfighter6/page/315303624941027951.html'),
('zangief-y4-modern-light-od','M小技ODラリアット','light','2L x2 > 5L > OD Double Lariat','Modern 2L','any',2,'モダン起き攻め','Drive2; legacy 1890 claim.','modern_only','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-modern-assist-medium-sa2','M中アシストSA2','assist','Assist M: 2MP > OD Double Lariat > SA2','Modern Assist M','any',2,'モダン入れ替え','SA2 auto branch when meter available.','modern_only','https://kamigame.jp/streetfighter6/page/315303624941027951.html'),
('zangief-y4-modern-medium-manual','M屈中Pラリアット','medium','2MP > manual Double Lariat','Modern 2MP','any',2,'モダン中技','Manual no-Drive branch.','modern_only','https://kamigame.jp/streetfighter6/page/315303624941027951.html'),
('zangief-y4-modern-assist-heavy-sa3','M強アシストSA3','assist','Assist H: 6HP > OD Double Lariat > SA3','Modern Assist H','any',2,'モダン強攻撃','Stop on block; finish on confirmed hit.','modern_only','https://kamigame.jp/streetfighter6/page/315303624941027951.html'),
('zangief-y4-modern-heavy-manual','M頭突き手動ラリアット','heavy','6HP(meaty/CH/DR) > manual Double Lariat','Modern 6HP','any',3,'モダン省エネ','Exact current link/condition requires capture.','modern_only','https://kamigame.jp/streetfighter6/page/315303624941027951.html'),
('zangief-y4-modern-jm-lariat','Mジャンプ中ヘルスタブ','jump','j.M > 3M > Double Lariat','Modern j.M','any',3,'モダン飛び','Legacy 2260 claim.','modern_only','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-modern-jm-cdr','Mジャンプ中ラッシュ伸ばし','jump','j.M > 3M > CDR 2M > 3M > Double Lariat','Modern j.M','any',4,'モダン飛びDrive','Drive3; legacy 2860 claim.','modern_only','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-modern-bodypress-light','Mボディプレス小技','jump','j.2H > 6H > 2L > 5L > Double Lariat','Modern body press','any',4,'モダンめくり','Legacy route; depth required.','modern_only','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-modern-bodypress-cdr','Mボディプレスラッシュ','jump','j.2H > 6H > CDR 6H > 3M > Double Lariat','Modern body press','any',5,'モダンめくりDrive','Legacy route; Drive3.','modern_only','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-modern-light-sa2','M小技ODラリアットSA2','sa','2L x2 > OD Double Lariat > SA2','Modern 2L','any',3,'モダンSA2','Drive2 + SA2.','modern_only','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-modern-light-sa3','M小技ODラリアットSA3','sa','2L x2 > OD Double Lariat > SA3','Modern 2L','any',3,'モダンSA3','Drive2 + SA3.','modern_only','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-modern-jm-sa2','Mジャンプ中SA2','sa','j.M > 3M > CDR 2M > 3M > SA2','Modern j.M','any',4,'モダン飛びSA2','Drive3 + SA2.','modern_only','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-modern-jm-sa2-sa1','Mジャンプ中SA2 SA1','sa','j.M > 3M > CDR 2M > 3M > SA2(hold) > dash > 3M > SA1','Modern j.M','any',5,'モダン飛びSA3相当','Drive3 + SA3 total.','modern_only','https://yosimitudx.hatenablog.com/entry/2024/05/03/214525'),
('zangief-y4-modern-di-spd','M中央DIワンボタンスクリュー','impact','DI(PC) > one-button SPD / manual H SPD','DI punish counter','midscreen',2,'モダンDI簡易','One-button and manual damage/range must be separated.','modern_only','https://kamigame.jp/streetfighter6/page/315303624941027951.html');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.cat,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,
 'Written/image-only collection. No video playback; capture required for current-device confirmation.',p.id,'unverified',r.ck,'draft'
from p26_combo r join characters c on c.slug='zangief'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Written/image route; current-device capture required.'
from p26_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;

-- Every route is also tied to the current official patch baseline.
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'patch_context','2026-08-03 official Zangief change baseline.'
from p26_combo r join combos x on x.slug=r.slug
join sources s on s.url='https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/zangief'
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p26_setup(
 slug text,name text,starter text,seq text,adv text,pos text,descr text,ck text,src text
) on commit drop;
insert into p26_setup values
('zangief-y4-lariat27-dr-mp','ラリアット+27 DR中PTC','Double Lariat +27','DR 5MP > 5MP > 5MP','Source +27 claim','any','近距離なら中PTC、遠距離は大足へ分岐。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-lariat27-dr-sweep','ラリアット+27 DR大足','Double Lariat +27','DR 2HK','Source +27 claim','any','距離が遠い時のハードダウン狙い。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-lariat27-dr-lspd','ラリアット+27 DR弱スクリュー','Double Lariat +27','DR L SPD','Not a true meaty','midscreen','厳密には重ならない読み合い。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-lariat27-corner-headbutt','端ラリアット歩き頭突き','Double Lariat +27','walk > 6HP > 3MP > Double Lariat','Meaty claim','corner','端で歩いて頭突きを重ねる。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-lariat27-corner-spd','端ラリアット歩き強スクリュー','Double Lariat +27','walk > H SPD','Throw branch','corner','端で投げ間合いまで歩く。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-lariat27-corner-shimmy','端ラリアットシミー','Double Lariat +27','walk back > punish throw whiff','Shimmy branch','corner','頭突き／投げを見せた後の投げ抜け狩り。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-od-lariat38-dr-headbutt','ODラリアット+38 DR持続頭突き','OD Double Lariat +38','DR 6HP(meaty) > hit: 6HP > 3MP > Lariat / guard: strike-throw','Source +38; guard +8 claim','any','持続頭突きから打撃／遅らせ投げ。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-od-lariat38-delay-spd','ODラリアット+38 遅らせ中スクリュー','OD Double Lariat +38','DR 6HP guard > delay M SPD','Delay required','any','最速投げが空振るため遅らせる。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-od-lariat38-dr-low','ODラリアット+38 DR中足','OD Double Lariat +38','DR 2MK > 3MP > Double Lariat','Meaty low claim','any','下段打撃の起き攻め。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-od-lariat38-safe-jmp','ODラリアット+38 J中P','OD Double Lariat +38','j.MP > 3MP > Double Lariat','Can guard 10F+ reversal claim','any','発生10F以上の無敵技に対する詐欺飛び候補。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-od-lariat38-dr-spd','ODラリアット+38 DR中スクリュー','OD Double Lariat +38','DR M SPD','Command throw meaty claim','any','DRコマ投げ択。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-od-lariat38-dr-normal-throw','ODラリアット+38 DR通常投げ','OD Double Lariat +38','DR forward throw','Normal throw meaty claim','any','通常投げ後の位置と状況も記録。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-od-lariat38-dr-guard','ODラリアット+38 DRガード','OD Double Lariat +38','DR guard > punish invincible reversal','Reversal bait','any','無敵技読みの停止。','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-russian-dr-spd','ロシアン後DR中スクリュー','Russian Suplex hit','DR M/OD SPD','Meaty claim','any','コマ投げからコマ投げを重ねる分岐。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-russian-dr-knee','ロシアン後DR膝','Russian Suplex hit','DR 6MK > 3MP confirm / SPD','Guard +4 claim','any','膝ガード後に打撃／投げ。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-od-russian-dr-knee','ODロシアン後DR膝','OD Russian Suplex hit','DR 6MK > 3MP confirm / SPD','Guard +7 claim','any','生Dリバ詐欺候補を含む。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-sweep-pc-whiff-knee','大足CH/PC空振り膝','2HK CH/PC','whiff 6MK > 6HP / throw','Frame-kill claim','any','頭突き重ねと投げの分岐。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-sweep-pc-walk-jump','大足CH/PC微歩き前飛び','2HK CH/PC','micro-walk > forward jump','Jump setup claim','any','表裏・持続・無敵技への勝敗を確認。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-sweep-pc-whiff-lk-dr','大足CH/PC小足空振りDR膝','2HK CH/PC','whiff 2LK > DR 6MK','Guard +4 and reversal-safe claim','any','小足消費から膝を重ねる候補。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-aa-lariat-dash','対空ラリアット前ステ択','anti-air Double Lariat, hold forward','dash > M SPD / 3MP','Source +4/+5 claim','any','近め対空時だけ密着択。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-aa-2hp-close-oki','屈強P対空近距離追撃','2HP air PC close','dash > OD Borscht / 3MP > Lariat','Range-dependent','any','近距離パニカン用。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-aa-2hp-far-oki','屈強P対空遠距離DR膝','2HP air PC far','DR 6MK > 3MP > Lariat','Range-dependent','any','遠距離パニカン用。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-mp-tc-corner-dash','中PTC端前ステ択','5MP x3 near corner','dash > 3MP / normal throw / SPD','Source +5 claim','corner','端付近でのみ密着択。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-spd30-dr-sweep','弱スクリュー+30 DR大足','L SPD +30','DR 2HK / delayed 2MK / approach 6MK','Not a true throw meaty','any','強度別距離を分離して確認。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-spd28-dr-sweep','中強ODスクリュー+28 DR大足','M/H/OD SPD +28','DR 2HK / delayed 2MK / approach 6MK','Not a true throw meaty','any','弱版と距離が異なる。','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-borscht19-dr-bait','ボルシチ+19 DR投げ空振り','Borscht Dynamite +19','DR throw whiff > block / punish reversal','Fake oki; reversal can win','any','起き攻めではなく無敵技誘い。','strategy','https://note.com/konpiragobo/n/n9d76f80b1439'),
('zangief-y4-modern-od-lariat-head','M ODラリアットDR頭突き','Modern OD Double Lariat','DR 6H > strike / one-button SPD','Guard +8 claim','any','モダンの打撃／ワンボタン投げ。','modern_only','https://note.com/blotzky_apex/n/n78f4cec38d38'),
('zangief-y4-modern-od-lariat-spd','M ODラリアットDRワンボタンスクリュー','Modern OD Double Lariat','DR one-button SPD','Meaty claim','any','早出し空振りと手動強度差を確認。','modern_only','https://note.com/blotzky_apex/n/n78f4cec38d38'),
('zangief-y4-modern-russian-knee','Mロシアン後ラッシュ膝','Modern Russian Suplex','DR 6M > one-button SPD / 3M','Guard +4 claim','any','モダン投げ／打撃ループ候補。','modern_only','https://note.com/blotzky_apex/n/n78f4cec38d38');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'oki',r.starter,r.seq,r.adv,r.pos,r.descr,
 'Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',p.id,'unverified',r.ck,'draft'
from p26_setup r join characters c on c.slug='zangief'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Written setup claim; current-device capture required.'
from p26_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'patch_context','2026-08-03 official Zangief change baseline.'
from p26_setup r join setups x on x.slug=r.slug
join sources s on s.url='https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/zangief'
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p26_seq(
 slug text,name text,seq text,trueblock boolean,mash text,throwp text,shimmy text,jumpopt text,parry text,drev text,inv text,notes text,ck text,src text
) on commit drop;
insert into p26_seq values
('zangief-y4-light-stop-spd','小技止めスクリュー','2LK > 5LP > stop > SPD',false,'4F/backdash check','after 5LP','delay 6HP','forward jump escapes','parry loses to throw','D-reversal check','OD/SA reversal check','Hit-confirm Lariat and throw reset must not be labeled a true combo.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-cdr-light-headbutt','小技CDR頭突きダブルアップ','2LK > 5LP > CDR 2LP > 6HP > 3MP > Lariat',false,'6HP trades with mash claim','SPD after 2LP','block after 2LP','jump check','parry check','D-reversal check','reversal bait branch','Only through CDR 2LP is the confirmed combo before the reset.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-cdr-light-spd','小技CDRスクリューダブルアップ','2LK > 5LP > CDR 2LP > H SPD',false,'mash check','H SPD','6HP alternative','jump escapes','parry loses to throw','D-reversal check','reversal wins','Explicit reset, not a combo.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-cdr-light-bait','小技CDR無敵技様子見','2LK > 5LP > CDR 2LP > block',false,'stop','throw after hesitation','block','jump allowed','parry neutral','D-reversal bait','punish invincible','Reversal-read branch.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-cdr-light-sa1-jump','小技CDR SA1飛び狩り','2LK > 5LP > CDR 2LP > SA1 vs jump',false,'ground mash check','SPD threat','block','SA1 catches jump claim','parry/guard check','D-reversal check','reversal timing check','Record forward/back/neutral jump separately.','strategy','https://note.com/good_lion2040/n/n95791feb0a8b'),
('zangief-y4-od-lariat-head-tree','ODラリアット頭突き択','OD Lariat > DR 6HP > hit confirm / delayed SPD / Stomping',false,'Stomping frame trap','delay SPD','walk back','jump check','parry loses to throw','D-reversal check','DR guard bait','Headbutt guard +8 source claim means fastest SPD can whiff by spacing.','strategy','https://note.com/konpiragobo/n/n9d76f80b1439'),
('zangief-y4-russian-loop','ロシアン打撃投げループ','Russian Suplex > DR 6MK > 3MP confirm / SPD',false,'3MP checks jump/mash','M/OD SPD','DR stop','jump punished by strike','parry loses to throw','D-reversal interaction','OD/SA reversal','Track Drive cost before calling this a loop.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-dr-2lp-distance','DR屈小P距離別確認','DR 2LP > CH far: 2HK / PC close: 6HP > 3MP > OD Lariat',false,'counter check','SPD after guard','block','jump check','parry check','D-reversal bait','reversal bait','Distance and CH/PC decide route.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-mp-target-branches','立中PTC分岐','5MP > hit/CH: target combo / guard: stop at 1-2 hits',false,'9F contest','SPD after stop','delay/stop','jump check','parry check','D-reversal check','reversal check','Third hit on guard has punish risk; tip can drop second hit.','strategy','https://note.com/emesirna/n/n08d1cd10fe88'),
('zangief-y4-spd-post-oki','スクリュー後非確定接近','SPD > DR 2HK / delayed low / walk 6MK / stop',false,'DR sweep catches movement','delayed SPD only','DR stop','jump escapes throw','parry check','D-reversal check','reversal can challenge gaps','Do not label as guaranteed oki; strength changes +30/+28 and spacing.','strategy','https://note.com/lilililily/n/n9496928c9223'),
('zangief-y4-sa2-choice','SA2派生選択','SA2 > immediate throw end / hold strike > air follow-up / position switch',false,'strike follow-up','throw ender','hold timing','air follow-up','parry/guard check','D-reversal n/a','reversal n/a','Separate damage, oki, Drive drain and side-switch goals.','strategy','https://note.com/konpiragobo/n/n3128a074f8de'),
('zangief-y4-modern-assist-stop','Mアシスト確認停止','Assist L/M/H > stop on guard / finish on hit / manual Lariat to conserve Drive',false,'4F check after stop','one-button SPD','block','jump check','parry loses to throw','D-reversal check','one-button SA reversal check','Record automatic OD/SA spending separately from manual input.','modern_only','https://kamigame.jp/streetfighter6/page/315303624941027951.html'),
('zangief-y4-modern-head-mix','M頭突きワンボタン択','DR 6H guard > delayed one-button SPD / 3M confirm > OD Lariat',false,'3M strike','one-button SPD','DR stop','jump check','parry loses to throw','D-reversal check','one-button reversal check','Modern damage scaling and manual command versions must be separated.','modern_only','https://note.com/blotzky_apex/n/n78f4cec38d38'),
('zangief-y4-modern-air-control','M対空選択','jump read > OD Lariat anti-air / one-button Borscht / SA1',false,'n/a','n/a','ground wait','air throw/SA1','parry n/a','n/a','one-button SA1','Choose by jump arc and height; do not merge air-hit states.','modern_only','https://note.com/blotzky_apex/n/n78f4cec38d38');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,r.trueblock,r.mash,r.throwp,r.shimmy,r.jumpopt,r.parry,r.drev,r.inv,r.notes,p.id,'unverified',r.ck,'draft'
from p26_seq r join characters c on c.slug='zangief'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Written decision tree; current-device capture required.'
from p26_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'patch_context','2026-08-03 official Zangief change baseline.'
from p26_seq r join sequences x on x.slug=r.slug
join sources s on s.url='https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/zangief'
on conflict(entity_type,entity_id,source_id) do nothing;

-- Create one reproducible verification drill and one capture request per active strategy.
with e as(
 select 'combo' typ,x.id,x.slug,x.name,x.notation method,x.content_kind from p26_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind from p26_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind from p26_seq r join sequences x on x.slug=r.slug
),p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【ザンギエフ撮影待ち】'||e.name,
 case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,
 '文章・画像から収集した攻略の2026-08-03版成立を確定する。','advanced',15,c.id,
 '入力履歴・フレーム・ダメージ・Drive/SAを表示。Classic/Modern、位置、受け身、CH/PC、投げ強度を指定。',
 '4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,
 '左右各10回で成立、数値、位置、受け身、簡易補正、キャラ条件を記録。',20,
 '成立ならverified候補。不成立ならarchived。',p.id,'unverified',e.content_kind,'draft'
from e join characters c on c.slug='zangief' cross join p
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(
 select 'combo' typ,x.id,x.slug from p26_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug from p26_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug from p26_seq r join sequences x on x.slug=r.slug
)e on t.slug='training-'||e.slug
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related strategy.'
from trainings t join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.player_character_id=(select id from characters where slug='zangief')
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' then 20
      when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,
 '2026-08-03版の成立、入力、数値、位置、受け身、投げ強度、簡易補正、Classic/Modern差を確認。'
from trainings t
where t.slug in(
 select 'training-'||slug from p26_combo union all
 select 'training-'||slug from p26_setup union all
 select 'training-'||slug from p26_seq
)
on conflict(training_id) do nothing;

update character_content_packages p
set rollout_status='complete',combo_status='complete',setup_status='complete',sequence_status='complete',
    training_status='complete',source_status='complete',patch_status='complete',verification_status='review',
    notes=concat_ws(E'\n',nullif(p.notes,''),
      '2026-09-01 phase26: Zangief written/image-only Classic and Modern collection completed. Video playback not used; all strategies remain draft/unverified with capture backlog.'),
    updated_at=now()
where p.character_id=(select id from characters where slug='zangief');
