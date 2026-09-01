-- Marisa text/image-only expansion after the initial Dee Jay / Manon / Marisa pass.
-- No video playback was used. Every strategy and frame/damage statement remains
-- draft/unverified until the linked capture backlog item is reproduced on the
-- current patch. Older recipes are isolated as legacy_candidate.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('マリーザ 2026.08.03 公式バトル変更','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/marisa','official','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'primary','Current-patch change context only; it does not verify community combo execution.'),
 ('マリーザ 公式ムーブリスト','https://www.streetfighter.com/6/ja-jp/character/marisa/movelist','official','CAPCOM',null::timestamptz,now(),'primary','Official Classic and Modern commands.'),
 ('マリーザ現行コンボ','https://takukakugamer.com/sf6-marisa-combo/','community_guide','たくかくゲーマー','2026-08-24 00:00:00+00'::timestamptz,now(),'community','Post-patch written Classic routes. Article values remain claims pending device capture.'),
 ('マリーザ現行セットプレイ','https://takukakugamer.com/sf6-marisa-setup/','community_guide','たくかくゲーマー','2026-08-24 00:00:00+00'::timestamptz,now(),'community','Post-patch written setup and pressure claims.'),
 ('モダンマリーザYear4','https://www.sukoreru.com/sf6-modern-marisa','community_guide','スコれる？','2026-08-11 00:00:00+00'::timestamptz,now(),'community','Updated 2026-08-11 with Year4 Modern routes, oki and input changes.'),
 ('マリーザ2026年8月調整後まとめ','https://note.com/ray_fgc/n/n4cc3d401115a','community_guide','レイ / Ray','2026-08-04 00:00:00+00'::timestamptz,now(),'community','Post-patch written combo, burnout and pressure claims.'),
 ('マリーザ2026年8月調整考察','https://note.com/tentamiko/n/nb3c8e9001d28','community_guide','community author','2026-08-04 00:00:00+00'::timestamptz,now(),'community','Post-patch Heavy One-Two and Quadriga pressure claims.'),
 ('マリーザ2026年3月調整考察','https://note.com/tentamiko/n/nb002773bb185','community_guide','community author','2026-03-20 00:00:00+00'::timestamptz,now(),'community','Pre-August written Phalanx pressure claims; current capture still required.'),
 ('マリーザ起き攻め考2026','https://hanhans.hatenablog.com/entry/2026/03/08/183555','community_guide','オタわむれ','2026-03-08 00:00:00+00'::timestamptz,now(),'community','Pre-August setup claims imported only as legacy candidates.'),
 ('マリーザ攻略 ver20250205','https://note.com/nikotarosun/n/nb893441eaca2','community_guide','にこ太郎','2025-03-24 00:00:00+00'::timestamptz,now(),'community','Older written combo and setup routes; legacy candidates only.'),
 ('マリーザ、始めました 起き攻め編','https://note.com/bonmoko_3/n/n2609bb89961e','community_guide','ボンモコ','2024-09-06 00:00:00+00'::timestamptz,now(),'community','Older setup article whose author warns that later hold-frame changes invalidated some recipes; legacy only.'),
 ('Mマリーザ2026年8月入力変更','https://www.komacha10800.com/mmariza-2026nenchousei/','community_guide','自由帳の女神','2026-08-15 00:00:00+00'::timestamptz,now(),'community','Post-patch written explanation of Modern Dimachaerus, Phalanx and Quadriga input changes.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p25d_marisa_combo(
 slug text,name text,combo_type text,notation text,starter text,position text,
 difficulty int,purpose text,conditions text,content_kind text,source_url text
) on commit drop;

insert into p25d_marisa_combo values
-- Missing current Classic routes from the 2026-08-24 written guide.
('marisa-p25d-light-sa3','小技SA3','super','2LK/2LP > 2LP > SA3','2LK / 2LP','any',4,'小技始動リーサル','SA3。記事記載2520のSA2分岐も撮影時に確認。','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-p25d-2lp-pc-mptc','しゃがみ弱Pパニカン中PTC','punish_counter','2LP(PC) > 5MP~MP > Mディマカイルス~6P','2LP punish counter','any',3,'4F確定反撃から起き攻め','Punish Counter required.','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-p25d-od-dimach-3hp-safejump','中PTC中央安全飛び','safe_jump','5MP~MP > ODディマカイルス~6P > 3HP(1 hit)','5MP','midscreen',4,'中央から安全飛び','Drive2。3HP一段止めと安全飛び成立を確認。','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-p25d-2mp-mgradius','しゃがみ中P中グラディウス','basic','2MP > Mグラディウス','2MP','any',2,'牽制ヒット時の簡易締め','No Drive or SA.','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-p25d-2mp-cdr-carry-phalanx','しゃがみ中Pラッシュ運び詐欺飛び','drive_rush','2MP > CDR 5MK > 4HP > Hディマカイルス~6P > DR 2HP > Hファランクス','2MP','any',5,'運びから端安全飛び','Drive4 claim。端到達時のみ安全飛び。','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-p25d-2mp-od-dimach-phalanx','しゃがみ中Pヒット確信ODディマ','drive','2MP > ODディマカイルス~6P > DR 4HP > Hファランクス','2MP hit confirm','any',4,'ヒット確信から運び','Drive3 claim。','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-p25d-heavy-dr-ender-choice','強攻撃1本伸ばし締め分岐','drive','6HK/4HP > Hディマカイルス~6P > DR 4HP > Hグラディウス / Hファランクス / Hクアドリガ','6HK / 4HP','any',4,'火力・運び・起き攻め選択','Drive1。締めごとの終了状況を分離記録。','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-p25d-6mp-ch-light','前中Pカウンター小技','counter','6MP(CH) > 2LP > Lディマカイルス~6P','6MP counter hit','any',3,'差し込みカウンター確認','Counter Hit required.','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-p25d-dr-overhead-sa3','生ラッシュ中段SA3','overhead','DR 3HP > 2LP > SA3','DR 3HP','any',4,'中段リーサル','Drive1 + SA3.','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-p25d-5hk-pc-carry','立ち強Kパニカン運び','punish_counter','5HK(PC) > DR 6HK~HK > Mディマカイルス~6P > 2HK','5HK punish counter','any',4,'差し返しから運び','Drive1 claim。','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-p25d-corner-mptc-charge-phalanx','端中PTC節約詐欺飛び','corner','5MP~MP > ODディマカイルス~6P > charged 4HP > Lファランクス','5MP','corner',4,'端Drive節約と安全飛び','Drive2。','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-p25d-corner-charge-pc-odquadriga','端溜め強PパニカンODクアドリガ','punish_counter','charged 5HP(PC) > 6HK > ODクアドリガ > 4HP > Hグラディウス','charged 5HP punish counter','corner',5,'端確定反撃','Drive2。','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
-- Missing current Modern routes. Keep separate even when the motion matches a Classic route.
('marisa-p25d-modern-4h-hdimach-sa3','モダン引き強始動SA3','modern_only','4H > Hディマカイルス > Hグラディウス > SA3','Modern 4H','any',3,'モダン基本SA3','Manual Dimachaerus required under Year4 inputs.','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-amtc-mdimach','モダン中アシストTC中ディマ','modern_only','Assist M~M > Mディマカイルス','Modern Assist M','any',2,'モダン基本起き攻め','Manual Dimachaerus required.','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-light-dimach','モダン小技弱ディマ','modern_only','2L xN > Lディマカイルス','Modern 2L','any',2,'モダン4F暴れ確認','SA3時は弱ディマ一段目キャンセル候補。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-astrong-pc-sa3','モダンアシスト強PC SA3','modern_only','Assist H(PC) > 4H > Hディマカイルス > Hグラディウス > SA3','Modern Assist H punish counter','any',4,'無敵技ガード反撃','Punish Counter required.','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-charge5h-pc-assist-sa3','モダン溜め強PCアシスト強SA3','modern_only','charged 5H(PC) > Assist H~H~H > Hグラディウス > SA3','Modern charged 5H punish counter','any',4,'Drive不要の確定反撃','Punish Counter required.','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-di-wall-hdimach','モダンDI壁強ディマ安全飛び','modern_only','DI wall splat > Hディマカイルス > charged 5H~H','DI wall splat','corner',4,'壁やられから安全飛び','Drive Impact cost only.','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-6m-ch','モダン前中CH弱ディマ','modern_only','6M(CH) > 2L > Lディマカイルス','Modern 6M counter hit','any',3,'差し込みカウンター確認','Counter Hit required.','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-6m-pc-sa1','モダン前中PCターゲットSA1','modern_only','6M(PC)~H > SA1','Modern 6M punish counter','any',3,'差し返しSA1','しゃがみヒット時はPC必須との記事claim。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-5h-pc-amtc','モダン立ち強PC中アシスト','modern_only','5H(PC) > Assist M~M > Mディマカイルス','Modern 5H punish counter','any',3,'差し返し起き攻め','Punish Counter required.','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-4h-pc-amtc','モダンシミー引き強PC','modern_only','4H(PC) > Assist M~M > Mディマカイルス','Modern 4H punish counter','any',3,'投げ抜け狩り','Punish Counter required.','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-od-phalanx-sa1','モダン端ODファランクス溜めSA1','modern_only','ODファランクス > charged 2H > max charged SA1','OD Phalanx','corner',4,'端SA1火力','Drive2 + SA1。記事記載4500はSource claim。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-2l-pc-sa3','モダンしゃがみ弱PC SA3','modern_only','2L(PC) > 4H > Hディマカイルス > Hグラディウス > SA3','Modern 2L punish counter','any',4,'Dリバ反撃と4F確反','Punish Counter required.','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-charge5h-od-dimach-sa2','モダン溜め強PC ODディマSA2','modern_only','charged 5H(PC) > Assist H > ODディマカイルス > DR 6H~H > SA2','Modern charged 5H punish counter','any',5,'SA2締め確定反撃','Drive3 claim + SA2。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-dr-h-corner-sa1','モダン端ラッシュ強SA1','modern_only','DR H > Assist M~M > ODディマカイルス > charged 2H > max charged SA1','Modern DR H','corner',5,'端SA1ルート','Drive3 + SA1 claim。','modern_only','https://www.komacha10800.com/mmariza-2026nenchousei/');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.combo_type,r.notation,r.starter,r.position,r.difficulty,r.purpose,r.conditions,
 'Written/image source only; no video playback. Current-device capture required.',p.id,'unverified',r.content_kind,'draft'
from p25d_marisa_combo r
join characters c on c.slug='marisa'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Written claim only; current-device reproduction remains pending.'
from p25d_marisa_combo r join combos x on x.slug=r.slug join sources s on s.url=r.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25d_marisa_setup(
 slug text,name text,setup_type text,starter text,sequence_text text,advantage text,
 position text,description text,counter_notes text,content_kind text,source_url text
) on commit drop;

insert into p25d_marisa_setup values
-- Missing current Classic setups.
('marisa-p25d-forwardthrow-dr5mk','端前投げラッシュ立ち中K持続','throw_oki','corner forward throw (+23 claim)','DR 5MK meaty','hit +10 / guard +4 claim','corner','打撃持続重ね。記事では投げ間合い外。','通常投げ、4F、無敵、Dリバ、後方受け身を確認。','strategy','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa-p25d-enfold-dr-scutum','端エンフォルド後スクトゥム遅らせ投げ','command_throw','corner Enfold hit (+18 claim)','DR > Scutum > delayed Enfold','unknown','corner','無敵技を受けてから遅らせエンフォルドを狙う。','一部無敵技の空中食らいとSA2追撃可否を確認。','strategy','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa-p25d-ldimach-whiff5lp-enfold','弱ディマ後弱P空振り最速エンフォルド','frame_kill','L Dimachaerus knockdown (+31 claim)','5LP whiff > immediate Scutum~Enfold','unknown','any','弱P空振りでコマンド投げを重ねる分岐。','通常/後方受け身、4F、ジャンプ、バクステ、無敵を確認。','strategy','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa-p25d-ldimach-dr-throw-scutum','弱ディマ後ラッシュ投げ分岐','oki','L Dimachaerus knockdown (+31 claim)','DR > normal throw / Scutum~Enfold','unknown','any','ラッシュ溜め4HPとは別に通常投げとコマンド投げを比較する。','DR 2LP後ろ歩きの無敵警戒も含め、投げ間合い、4F、ジャンプ、無敵を確認。','strategy','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa-p25d-ldimach-whiff2lp-6hk-meaty','弱ディマ後屈弱P空振り前強K持続','frame_kill','L Dimachaerus knockdown','2LP whiff > 6HK meaty','hit +7 / guard +1 claim','any','2026年8月記事の持続重ね。ヒット時2LP > 5LK > Lディマカイルス候補。','通常/後方受け身、4F、ジャンプ、DI、無敵とヒット時追撃を確認。','strategy','https://note.com/ray_fgc/n/n4cc3d401115a'),
('marisa-p25d-hquadriga-meaty','強クアドリガ持続重ね','meaty','L Dimachaerus knockdown or compatible knockdown','H Quadriga meaty','close +4 claim','any','2026-08-03強化後の持続当て。','ジャスパ、4F、ジャンプ、DI、無敵で分離。','strategy','https://note.com/tentamiko/n/nb3c8e9001d28'),
-- Current Modern setups kept modern_only even where a Classic analogue exists.
('marisa-p25d-modern-mdimach-dr','モダン中ディマ後ラッシュ四択','modern_oki','Modern M Dimachaerus','DR max charged 6H / command throw / guard / DR 5M','charged 6H guard +7 claim','any','モダン中ディマ後の打撃・投げ・無敵釣り。','Modern入力、通常/後方受け身、4F、ジャンプ、無敵を確認。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-hdimach-charge5h','モダン強ディマ溜め強追撃後省エネ起き攻め','modern_oki','H Dimachaerus > charged 5H','dash > max charged 6H / walk throw','unknown','any','Driveを温存しつつ削りを狙う。','溜め6Hのヒット・ガード状況と投げ重なりを確認。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-hdimach-phalanx-dr','モダン強ディマファランクス締めDR択','modern_oki','H Dimachaerus > DR 4H > H Phalanx','DR max charged 5H / max charged 6H / command throw / guard / DR 5M','unknown','any','ダメージ優先5HとSA回収優先6Hを分岐。','走行距離、受け身、4F、ジャンプ、無敵を確認。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-hdimach-no-followup','モダン強ディマ追撃なし前ジャンプ三択','modern_oki','H Dimachaerus with no follow-up','forward jump > immediate 5M / command throw / guard','5M guard +1 claim','any','全て最速入力の省エネ起き攻め。','5M持続、投げ重なり、投げ間合い外の記載を確認。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-sa1-counter-dr5m','モダン溜めSA1当身後ラッシュ中','modern_oki','max charged SA1 counter succeeds','DR 5M','unknown','any','当身成立後の打撃重ね。','コマ投げは端付近のみ届くとの記事claimを確認。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-max-gradius-dash-charge5h','モダン最大溜めグラ後溜め強','modern_oki','max charged Gradius hit','dash > max charged 5H','not fully meaty claim','any','最大溜めグラディウス後の削り継続。','記事は4Fに負け得ると注意。距離と持続を確認。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-corner-ldimach-charge4h','モダン端弱ディマ屈弱空振り溜め引き強','modern_frame_kill','corner L Dimachaerus','2L whiff > max charged 4H','guard +4 claim','corner','端のモダン専用表記で保存。','ヒット時4H追撃、ガード後4H、DI、無敵を確認。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-corner-mdimach-charge4h','モダン端中ディマ弱空振り溜め引き強','modern_frame_kill','corner M Dimachaerus or Gradius','5L whiff > max charged 4H','guard +4 claim','corner','端のモダン専用表記で保存。','通常/後方受け身と入力強度を確認。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-corner-throw-charge5h','モダン端通常投げ溜め強持続','modern_throw_oki','corner normal throw','max charged 5H meaty > 4H on hit / Assist M on block','unknown','corner','投げ後の持続重ね。','ヒット確認、4F、ジャンプ、無敵、DIを確認。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-phalanx-pc-charge6h','モダンファランクスPC空振り消費溜め膝','modern_frame_kill','Phalanx punish counter','5M whiff > max charged Assist H(6H)','hit +13 / guard +6 claim','corner','持続当てから4H追撃。','中央距離、端、4F、ジャンプ、DI、無敵を分離。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
-- Older written setups. All remain legacy candidates.
('marisa-legacy-forwardthrow-dr-charge5hp','旧端前投げラッシュ溜め強P','legacy','corner forward throw','DR charged 5HP > 4HP > L Gradius','hit +8 claim','corner','旧版前投げ起き攻め。','作者が後年の溜め技変更で一部不成立と警告。','legacy_candidate','https://note.com/bonmoko_3/n/n2609bb89961e'),
('marisa-legacy-backthrow-dash-6hk','旧端後ろ投げ前ステ前強K','legacy','corner back throw','dash > 6HK','unknown','corner','旧版後ろ投げ起き攻め。','2026現行成立を確認。','legacy_candidate','https://note.com/bonmoko_3/n/n2609bb89961e'),
('marisa-legacy-forwardthrow-pc-charge5hp','旧前投げPC溜め強P','legacy','forward throw punish counter','charged 5HP meaty','unknown','any','旧版のハードノックダウン主張。','現行投げPCダウンと重なりを確認。','legacy_candidate','https://note.com/bonmoko_3/n/n2609bb89961e'),
('marisa-legacy-mdimach-dr2mp-mix','旧中ディマ後ラッシュしゃがみ中P択','legacy','M Dimachaerus','DR 2MP > throw / 2LK > 2LP > L Dimachaerus / shimmy','unknown','any','旧版の打撃・投げ・シミー。','現行記事は溜め6HKを推奨するため隔離。','legacy_candidate','https://note.com/nikotarosun/n/nb893441eaca2'),
('marisa-legacy-2mp-cdr-hdimach-jump-mix','旧中Pラッシュ強ディマ前ジャンプ二択','legacy','2MP > CDR 5MK > 4HP > H Dimachaerus','forward jump > 6HK / Scutum~Enfold','unknown','any','旧版前ジャンプ二択。','無敵、4F、ジャンプ、受け身を確認。','legacy_candidate','https://note.com/nikotarosun/n/nb893441eaca2'),
('marisa-legacy-od-dimach-3hp-jlk-crossup','旧ODディマ中段締めJ弱K表裏','legacy','5MP~MP > OD Dimachaerus > 3HP','safe jump j.LK cross-up > strike / Enfold','unknown','any','中央安全飛び後の表裏派生。','ODディマ>3HP自体は現行候補だがJ弱K表裏は未確認。','legacy_candidate','https://note.com/nikotarosun/n/nb893441eaca2'),
('marisa-legacy-2hk-pc-framekill','旧大足PC空振り前ステ択','legacy','2HK punish counter','2LP whiff > dash > normal throw / 2HK / Enfold','approximately +44 claim','any','旧版大足PC起き攻め。','2026-08-03後のダウン時間を確認。','legacy_candidate','https://hanhans.hatenablog.com/entry/2026/03/08/183555'),
('marisa-legacy-procella-charge5hp','旧プロケッラ溜め強P択','legacy','Procella hit','charged 5HP / dash throw','+22 claim','any','旧版スクトゥムK派生起き攻め。','2026-08-03後の有利Fと距離を確認。','legacy_candidate','https://hanhans.hatenablog.com/entry/2026/03/08/183555'),
('marisa-legacy-tonitrus-dr-charge5hp','旧トニトルス二段目ラッシュ択','legacy','Tonitrus second hit','DR charged 5HP / throw','+31 claim','any','旧版スクトゥムP派生起き攻め。','8月調整後の派生猶予とダウン時間を確認。','legacy_candidate','https://hanhans.hatenablog.com/entry/2026/03/08/183555'),
('marisa-legacy-corner-od-dimach-dr5hp-safejump','旧端ODディマDR強P+42','legacy','corner OD Dimachaerus','DR 5HP > forward jump H','+42 claim','corner','旧版安全飛び候補。','現行記事の3HP/Hファランクス締めと比較。','legacy_candidate','https://hanhans.hatenablog.com/entry/2026/03/08/183555');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.setup_type,r.starter,r.sequence_text,r.advantage,r.position,r.description,r.counter_notes,
 p.id,'unverified',r.content_kind,'draft'
from p25d_marisa_setup r
join characters c on c.slug='marisa'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

-- The initial pass stored two independent branches in each row. Narrow those
-- rows so the three additions above remain one candidate per Setup.
update setups
set sequence_text='5LP whiff > 6HK',
    description='打撃持続重ね。コマンド投げ分岐はmarisa-p25d-ldimach-whiff5lp-enfoldで管理。',
    updated_at=now()
where slug='marisa-oki-ldimach'
  and (sequence_text is distinct from '5LP whiff > 6HK'
       or description is distinct from '打撃持続重ね。コマンド投げ分岐はmarisa-p25d-ldimach-whiff5lp-enfoldで管理。');

update setups
set sequence_text='DR charged 4HP',
    description='ラッシュ溜め4HP。通常投げ・エンフォルド分岐はmarisa-p25d-ldimach-dr-throw-scutumで管理。',
    updated_at=now()
where slug='marisa-oki-ldimach-dr'
  and (sequence_text is distinct from 'DR charged 4HP'
       or description is distinct from 'ラッシュ溜め4HP。通常投げ・エンフォルド分岐はmarisa-p25d-ldimach-dr-throw-scutumで管理。');

update trainings t
set method=s.starter_condition||' > '||s.sequence_text,
    updated_at=now()
from setups s
where t.slug='training-'||s.slug
  and s.slug in('marisa-oki-ldimach','marisa-oki-ldimach-dr')
  and t.method is distinct from s.starter_condition||' > '||s.sequence_text;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Written claim only; current-device reproduction remains pending.'
from p25d_marisa_setup r join setups x on x.slug=r.slug join sources s on s.url=r.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25d_marisa_sequence(
 slug text,name text,sequence_type text,sequence_text text,is_true boolean,mash_point text,
 throw_point text,shimmy_point text,jump_option text,notes text,content_kind text,source_url text
) on commit drop;

insert into p25d_marisa_sequence values
('marisa-p25d-bo-quadriga-full-chain','バーンアウト前強Kクアドリガ連続固め','burnout_pressure','opponent BO > 6HK > Hクアドリガ > 5LP~LP > Mクアドリガ > 2LP > 5LK',false,'全区間の4F割り込みを個別確認','Hクアドリガ後の投げ分岐を確認','強版を読んだ暴れと無敵釣り','クアドリガ中のジャンプ移行を確認','記事ではすべて暴れ潰し。連続ガードとは断定しない。','strategy','https://note.com/ray_fgc/n/n4cc3d401115a'),
('marisa-p25d-safejump-plus11-mix','安全飛び+11打撃コマ投げ','safe_jump_pressure','lowest j.HP/j.HK safe jump guard(+11) > 4HP / Enfold / 6HK',false,'4HPが連続ガードか確認','最速Enfold','着地後シミー','ワンガード無敵とジャンプを確認','端Hファランクス等からの安全飛び後の三択。','strategy','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa-p25d-maxjump-plus18-charge4hp','最大溜めJ強+18溜め引き強','safe_jump_pressure','max charged j.HP/j.HK safe jump guard(+18) > max charged 4HP / Enfold / guard',false,'最大溜め4HP重なりを確認','少し遅らせEnfold','ワンガード無敵をガード','ジャンプ逃げを打撃で確認','Drive削りと打撃・コマ投げ・無敵釣り。','strategy','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa-p25d-heavy-one-two-plus4','溜めヘビィーワンツー+4連携','pressure','charged 5HP~HP(block string, +4 claim) > 2MP / 4HP > Lグラディウス',true,'派生後4F暴れ不可claim','派生後の歩き投げを確認','無敵技・DI釣り','派生後ジャンプを確認','2026-08-03強化後の連続ガードと削り連携。','strategy','https://note.com/tentamiko/n/nb3c8e9001d28'),
('marisa-p25d-modern-astrong-cdr-threeway','モダンアシスト強ラッシュ三択','modern_pressure','Assist H(6H) > CDR > immediate command throw / guard / delayed 5M',false,'最速コマ投げが4F暴れを潰すclaim','最速コマ投げ','ガードで無敵技を釣る','遅らせ5Mでジャンプ狩り','5F無敵技にもガードが間に合うとの記事claim。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-2m-cdr-m-mix','モダンしゃがみ中ラッシュ中択','modern_pressure','2M > CDR > 5M(block +2 claim) > weak assist combo / normal throw / backwalk 4H',false,'弱アシスト打撃択','通常投げ','微後退4H','後ろ歩きとジャンプを確認','ヒット・ガード共通の入口。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-amtc-special-rps','モダン中アシストTC必殺技択','modern_pressure','Assist M~M > Lグラディウス / max charged Lグラディウス / ファランクス / corner ODファランクス',false,'通常Lグラは暴れ・ジャンプ読み','なし','最大溜めや様子見でDIを誘う','通常/最大溜め/ファランクスの勝敗を確認','暴れ、DI、ジャンプ、下段に対する必殺技分岐。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-p25d-modern-corner-reset','モダン端強ディマ通常強追撃補正切り','reset','corner H/OD Dimachaerus > normal 5H reset > command throw / Assist H > DI',false,'Assist Hは4Fと相打ちclaim','コマ投げ','ガードで無敵・DI釣り','前ジャンプとバクステを確認','真のコンボではない補正切り。相打ち時2M追撃候補。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-legacy-odphalanx-merry-go-round','旧ODファランクス裏回りDI','legacy_reset','ODファランクス > forward j.LK cross-up > 2MK > DI',false,'2MK前後の4F確認','なし','DI返し誘い','表裏とジャンプ方向を確認','旧版メリーゴーランド補正切り。','legacy_candidate','https://note.com/nikotarosun/n/nb893441eaca2');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.sequence_type,r.sequence_text,r.is_true,r.mash_point,r.throw_point,r.shimmy_point,r.jump_option,
 'パリィとジャストパリィを個別確認。','ドライブリバーサルを個別確認。','無敵技を個別確認。',r.notes,p.id,'unverified',r.content_kind,'draft'
from p25d_marisa_sequence r
join characters c on c.slug='marisa'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Written claim only; gaps and defensive branches require current-device capture.'
from p25d_marisa_sequence r join sequences x on x.slug=r.slug join sources s on s.url=r.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

-- Correct supporting sources for five initial-pass sequences whose first links
-- pointed only to broader compilation pages, not to the concrete claims.
with exact_source(slug,source_url) as (values
 ('marisa-seq-phalanx','https://note.com/tentamiko/n/nb002773bb185'),
 ('marisa-seq-od-phalanx','https://note.com/tentamiko/n/nb002773bb185'),
 ('marisa-seq-cdr-overhead','https://note.com/tentamiko/n/nb3c8e9001d28'),
 ('marisa-seq-enfold','https://note.com/tentamiko/n/nb3c8e9001d28'),
 ('marisa-seq-burnout','https://note.com/tentamiko/n/nb3c8e9001d28')
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',q.id,s.id,'supporting','Exact written source for the sequence claim; current-device capture remains pending.'
from exact_source e join sequences q on q.slug=e.slug join sources s on s.url=e.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

with exact_source(slug,source_url) as (values
 ('marisa-seq-phalanx','https://note.com/tentamiko/n/nb002773bb185'),
 ('marisa-seq-od-phalanx','https://note.com/tentamiko/n/nb002773bb185'),
 ('marisa-seq-cdr-overhead','https://note.com/tentamiko/n/nb3c8e9001d28'),
 ('marisa-seq-enfold','https://note.com/tentamiko/n/nb3c8e9001d28'),
 ('marisa-seq-burnout','https://note.com/tentamiko/n/nb3c8e9001d28')
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Exact source inherited from the related initial-pass Marisa sequence.'
from exact_source e
join sequences q on q.slug=e.slug
join trainings t on t.slug='training-'||q.slug
join sources s on s.url=e.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

-- One Training and one capture-backlog row for every newly added strategy.
with ctx as (
 select (select id from characters where slug='marisa') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), entities as (
 select 'combo' related_type,id,slug,name,notation method,content_kind from combos
 where slug like 'marisa-p25d-%' or slug like 'marisa-legacy-%'
 union all
 select 'setup',id,slug,name,starter_condition||' > '||sequence_text,content_kind from setups
 where slug like 'marisa-p25d-%' or slug like 'marisa-legacy-%'
 union all
 select 'sequence',id,slug,name,sequence_text,content_kind from sequences
 where slug like 'marisa-p25d-%' or slug like 'marisa-legacy-%'
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,
 case when e.content_kind='legacy_candidate' then '【マリーザ旧版撮影待ち】' else '【マリーザ文章情報確認】' end||e.name,
 case when e.related_type='combo' then 'combo_retest' when e.related_type='setup' then 'oki_retest' else 'pressure_retest' end,
 case when e.content_kind='legacy_candidate' then '旧版文章資料の候補を2026-08-03現行版で再現し、成立・不成立を確定する。' else '文章・画像から収集したマリーザ攻略を現行版で確定する。' end,
 'advanced',15,ctx.character_id,
 '入力履歴・フレーム・ダメージ・Drive/SAを表示。Classic/Modern、位置、通常/CH/PC、受け身を指定して撮影する。',
 '4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵技を必要に応じて個別再生。','CPU OFF。',e.method,
 '左右各10回で成立入力、ダメージ、ゲージ、終了F、位置、受け身、キャラ条件を記録する。',20,
 '成立ならverified候補。不成立ならrejectedまたはarchivedへ。',ctx.patch_id,'unverified',e.content_kind,'draft'
from ctx cross join entities e
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.related_type,e.id
from trainings t join (
 select 'combo' related_type,id,slug from combos
 union all select 'setup',id,slug from setups
 union all select 'sequence',id,slug from sequences
) e on t.slug='training-'||e.slug
where e.slug like 'marisa-p25d-%' or e.slug like 'marisa-legacy-%'
on conflict(training_id,related_type,related_id) do nothing;

-- Keep verification Training classification aligned with its related strategy,
-- including Modern rows created by the initial pass.
with related as (
 select id,slug,content_kind from combos where character_id=(select id from characters where slug='marisa')
 union all
 select id,slug,content_kind from setups where character_id=(select id from characters where slug='marisa')
 union all
 select id,slug,content_kind from sequences where character_id=(select id from characters where slug='marisa')
)
update trainings t
set content_kind=r.content_kind,
    updated_at=now()
from related r
where t.slug='training-'||r.slug
  and t.verification_status='unverified'
  and t.status='draft'
  and t.content_kind is distinct from r.content_kind;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Source inherited from the related Marisa strategy item.'
from trainings t
join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.slug like 'training-marisa-p25d-%' or t.slug like 'training-marisa-legacy-%'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.content_kind='legacy_candidate' then 55 when t.name ilike '%最大%' or t.name ilike '%SA%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,
 case when t.content_kind='legacy_candidate' then '旧版候補。2026-08-03現行版で成立・条件付き成立・不成立を判定する。' else '文章で入力・状況を確認済み。現行成立、数値、位置、受け身、操作方式を撮影で確定する。' end
from trainings t
where t.slug like 'training-marisa-p25d-%' or t.slug like 'training-marisa-legacy-%'
on conflict(training_id) do nothing;

-- Reusable beginner and character-page capture material not present in the initial pass.
create temporary table p25d_marisa_media(
 slug text,name text,method text,source_url text
) on commit drop;

insert into p25d_marisa_media values
('marisa-media-manual-dimach','【初心者素材】手動ディマカイルスと追加攻撃','Modernで弱・中・強・ODディマカイルスを手動入力し、各強度の一段目、6P追加攻撃、旧ワンボタン癖による失敗例を入力履歴付きで比較する。','https://www.komacha10800.com/mmariza-2026nenchousei/'),
('marisa-media-assist-manual-branch','【初心者素材】アシストコンボと手動分岐','弱・中・強アシストコンボ完走と、Assist M/Assist Hから手動ディマカイルス・グラディウス・SAへ切り替える例を比較する。','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-media-cdr-mix','【初心者素材】中攻撃キャンセルラッシュ二択','2中>CDR>5中とAssist H>CDRから、打撃・通常投げ・エンフォルド・シミー・無敵技ガードを入力履歴とフレーム表示付きで撮影する。','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-media-antiair-options','【初心者素材】マリーザ対空の使い分け','2強、J中TC、溜めグラディウス、手動ODディマカイルス、SA2を同じジャンプ設定に対して比較する。','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-media-od-special-position','【初心者素材】ODファランクス・ODクアドリガ位置条件','端・端付近・中央でODファランクスとODクアドリガの追撃可否、PC条件、必要Drive、画面ラインを比較する。','https://www.sukoreru.com/sf6-modern-marisa');

insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select r.slug,r.name,'instructional_media','初心者説明ページとマリーザページで再利用する。','beginner',12,c.id,
 '720p60fps以上。入力履歴・フレーム・ダメージ・Drive/SA表示ON。成功例と必要な失敗例を分ける。',
 '必要な動作だけ個別再生。','CPU OFF。',r.method,'入力・条件・結果が短尺で判別できる。',5,
 '1～2秒ループと10～20秒説明クリップへ分割。',p.id,'unverified','training','draft'
from p25d_marisa_media r
join characters c on c.slug='marisa'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Current written reference for reusable instructional capture.'
from p25d_marisa_media r join trainings t on t.slug=r.slug join sources s on s.url=r.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',10,'初心者ページ兼マリーザページ用。短尺再利用を前提に撮影する。'
from trainings t where t.slug in(select slug from p25d_marisa_media)
on conflict(training_id) do nothing;

-- Capture-only audits: do not create a Combo row until the ambiguity is resolved.
create temporary table p25d_marisa_capture_only(
 slug text,name text,method text,content_kind text,source_url text
) on commit drop;

insert into p25d_marisa_capture_only values
('marisa-capture-source-5667-typo-route','【入力誤記確認】5667ルートのディマカイルス派生','現行コンボ記事の5667候補にはHディマカイルス~6HKと読める箇所がある。公式ムーブリスト上の追加攻撃6Pと照合し、意図された入力を推測せず、再現できた場合だけ後日Combo化する。','strategy','https://takukakugamer.com/sf6-marisa-combo/'),
('marisa-capture-modern-odquadriga-drive-audit','【Drive消費監査】モダンODクアドリガ最大候補','charged 5H(PC) > Assist H > ODクアドリガ > 4H > CDR 4H > CDR 6H~H > charged 4H > Hグラディウス > SA3。記事表記のCR回数とDrive消費に疑義があるため、開始Drive、各ラッシュ種別、完走可否を確認し、成立時だけCombo化する。','modern_only','https://www.sukoreru.com/sf6-modern-marisa'),
('marisa-capture-legacy-stun-odquadriga-max','【旧版Drive消費監査】スタンODクアドリガ最大候補','stun > j.HK > 6HK > ODクアドリガ > 4HP > CDR 6HK~HK > DR 4HP > CDR 6HK~HK > Mグラディウス > SA3。表記どおりではDrive消費が上限を超えるように読めるため、各ラッシュ種別、開始Drive、完走可否を確認し、正しい入力が確定した場合だけCombo化する。','legacy_candidate','https://note.com/nikotarosun/n/nb893441eaca2');

insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select r.slug,r.name,'video_candidate_retest','文章Source内の入力・Drive消費の曖昧さを実機で解消する。','advanced',20,c.id,
 '入力履歴・フレーム・ダメージ・Drive/SAを表示し、開始ゲージから失敗または完走まで録画する。',
 'Modern/Classicと端位置をレシピどおり設定。','CPU OFF。',r.method,
 '推測なしで正しい入力、Drive消費、成立条件または不成立理由を記録できる。',20,
 '成立かつ入力確定時のみ新規Combo候補を作成。不成立・誤記ならcapture-onlyのまま解決。',p.id,'unverified',r.content_kind,'draft'
from p25d_marisa_capture_only r
join characters c on c.slug='marisa'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Capture-only written claim; no strategy row is created before the ambiguity is resolved.'
from p25d_marisa_capture_only r join trainings t on t.slug=r.slug join sources s on s.url=r.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',15,'入力誤記またはDrive消費疑義のためcapture-only。成立を推測せず、実機結果から後日判断する。'
from trainings t where t.slug in(select slug from p25d_marisa_capture_only)
on conflict(training_id) do nothing;

update character_content_packages ccp
set rollout_status='complete',
    notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01 phase25d: Marisa written expansion complete. Missing Classic/Modern, legacy, instructional and capture-only items added; no video playback.'),
    updated_at=now()
from characters c
where c.id=ccp.character_id and c.slug='marisa'
  and coalesce(ccp.notes,'') not like '%2026-09-01 phase25d: Marisa written expansion complete.%';
