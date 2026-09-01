-- Complete Ken text/image-only strategy collection for the 2026-08-03 baseline.
-- Current and legacy community claims stay draft/unverified until device capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('ケン バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ken','official','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'primary','Current patch compatibility context.'),
 ('ケン コマンドリスト','https://www.streetfighter.com/6/ja-jp/character/ken/movelist','official','CAPCOM',null::timestamptz,now(),'primary','Official Classic/Modern command reference.'),
 ('ケン フレームデータ','https://www.streetfighter.com/6/ja-jp/character/ken/frame','official','CAPCOM',null::timestamptz,now(),'primary','Official current frame reference.'),
 ('Year4調整 ケンの変更点まとめ','https://note.com/isseeeko/n/na5e817df921a','community_guide','いっせー_ケンらぼ','2026-08-03 00:00:00+00'::timestamptz,now(),'community','Current written adjustment analysis and DR MP branches.'),
 ('ケンのセットプレイガイド','https://www.syogepixiv.work/2026/06/26/%E3%80%90%E3%82%B9%E3%83%886%E3%80%91%E3%82%B1%E3%83%B3%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%83%97%E3%83%AC%E3%82%A4%E3%82%AC%E3%82%A4%E3%83%89/','community_guide','しょげブロ','2026-06-26 00:00:00+00'::timestamptz,now(),'community','Written practical setplay and frame-kill claims.'),
 ('ケン コンボまとめ','https://takukakugamer.com/sf6-ken-combo/','community_guide','たくかくゲーマー',null::timestamptz,now(),'community','Written Classic practical combo reference.'),
 ('ケン セットプレイまとめ','https://takukakugamer.com/sf6-ken-setup/','community_guide','たくかくゲーマー',null::timestamptz,now(),'community','Written setup reference.'),
 ('ケンのインパクト重ね起き攻め','https://note.com/brave_borage507/n/n50d9ca1f76ea','community_guide','community author',null::timestamptz,now(),'community','Written DI-meaty situations; current capture required.'),
 ('ケン起き攻めセットプレイ 2024','https://note.com/darashie/n/n830cb30d74c6','community_guide','だらしぃ','2024-06-14 00:00:00+00'::timestamptz,now(),'community','Legacy detailed frame claims, isolated pending current capture.'),
 ('Cケン マスター昇格までにやったこと','https://kasayasak.hatenablog.com/entry/2025/08/09/145233','community_guide','kasayasak','2025-08-09 00:00:00+00'::timestamptz,now(),'community','Written hit-confirm and punish routes.'),
 ('モダンケンのコンボまとめ','https://kamigame.jp/streetfighter6/page/320488861362870390.html','community_guide','神ゲー攻略','2025-12-31 00:00:00+00'::timestamptz,now(),'community','Written Modern recipes and damage claims.'),
 ('モダンケン攻略','https://goziline.com/archives/54015','community_guide','ゴジライン','2023-06-28 00:00:00+00'::timestamptz,now(),'community','Legacy Modern routes; current capture required.'),
 ('ケン攻略 1800MR','https://note.com/nikotarosun/n/nd025f50a5ce9','community_guide','にこ太郎','2025-04-21 00:00:00+00'::timestamptz,now(),'community','Written practical route selection and oki.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

with ctx as(select (select id from characters where slug='ken') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),
r(slug,name,typ,notation,starter,pos,diff,purpose,conditions,src) as(values
 ('ken-y4-light-dp','小技刻み強昇龍','basic','2LP x2 > 5LK > H昇龍拳','2LP','any',2,'小技確認','距離で2LP回数を調整','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-low-light-dp','小足小技強昇龍','basic','2LK > 2LP > 5LK > H昇龍拳','2LK','any',2,'下段確認','密着限定距離を確認','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-5hp-jinrai','強P迅雷弱派生','basic','5HP > M迅雷脚 > L派生','5HP','any',2,'基本確認','派生後状況を確認','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-mptc-run-tatsu','中P強PTC奮迅竜巻','carry','5MP~5HP > 奮迅脚 > 奮迅竜巻旋風脚','5MP','any',3,'画面運び・起き攻め','端到達有無でセットプレイ分岐','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-mptc-run-dp','中P強PTC奮迅昇龍','basic','5MP~5HP > 奮迅脚 > 奮迅昇龍拳','5MP','any',3,'火力・起き攻め','Source +25 claim','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-2mk-cdr-run-tatsu','中足ラッシュ奮迅竜巻','drive_rush','2MK > CDR 5LP > 5MP~5HP > 奮迅脚 > 奮迅竜巻旋風脚','2MK','any',4,'下段運び','ガード時分岐を別確認','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-2mk-cdr-2hp','中足ラッシュ強P確認','drive_rush','2MK > CDR 2HP > 奮迅急停止 > 2MP > L竜巻旋風脚 > M昇龍拳','2MK','any',5,'高火力・運び','ヒット時のみ2HP、ガード時弱攻撃','https://kasayasak.hatenablog.com/entry/2025/08/09/145233'),
 ('ken-y4-jumpin-run-dp','飛び込み奮迅昇龍','jump_in','j.HK > 5HP > 奮迅脚 > 奮迅昇龍拳','j.HK','any',3,'飛び込み','着地距離を確認','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-5mp-ch','中Pカウンター昇龍','counter','5MP(CH) > 5LK > H昇龍拳','5MP counter','any',3,'暴れ潰し確認','2026 DR中P択対応','https://note.com/isseeeko/n/na5e817df921a'),
 ('ken-y4-2hp-pc-stop','アッパーパニカン急停止','punish_counter','2HP(PC) > 奮迅脚 > 急停止 > 2MP > L竜巻旋風脚 > M昇龍拳','2HP punish counter','any',4,'シミー反撃','Source practical route','https://kasayasak.hatenablog.com/entry/2025/08/09/145233'),
 ('ken-y4-5hk-pc-run-dp','強Kパニカン奮迅昇龍','punish_counter','5HK(PC) > 奮迅脚 > 奮迅昇龍拳','5HK punish counter','any',3,'遠距離確反','距離と持続を確認','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-corner-light-jinrai','端小技迅雷昇龍','corner','2LP > 5MP~5HP > L迅雷脚 > H派生 > M昇龍拳','2LP','corner',4,'端小技','高さと派生遅延を確認','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-corner-tc-delay','端TC迅雷遅らせ昇龍','corner','5MP~5HP > M迅雷脚 > delayed H派生 > H昇龍拳','5MP','corner',4,'端基本','遅らせ幅を確認','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-di-wall','DI壁やられ迅雷昇龍','wall_splat','DI wall splat > 5HP > H迅雷脚 > H派生 > M昇龍拳','DI wall splat','corner',3,'壁反撃','Source +33 ender claim','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-di-clean','DIクリーン奮迅竜巻','punish_counter','DI clean hit > 5MP~5HP > 奮迅脚 > 奮迅竜巻旋風脚','DI punish counter','any',3,'DI反撃・運び','位置別確認','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-stun-sa3','端スタンSA3','stun','DI stun > j.HP > 2HP > CDR 2HP > 5MP~5HP > 奮迅脚 > 奮迅龍尾脚 > SA3','corner stun','corner',5,'スタン最大候補','補正・ゲージ・ルート現行確認','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-run-ryubi-sa3','奮迅龍尾SA3','super','5HP > 奮迅脚 > 奮迅龍尾脚 > SA3','5HP','any',3,'SA3確認','リーサル用','https://note.com/nikotarosun/n/nd025f50a5ce9'),
 ('ken-y4-corner-sa2','端迅雷SA2追撃','super','5MP~5HP > M迅雷脚 > H派生 > SA2 > follow-up','5MP','corner',5,'SA2端伸長','SA2後追撃・ダメージは撮影確認','https://takukakugamer.com/sf6-ken-combo/'),
 ('ken-y4-anti-air','対空強昇龍','anti_air','H昇龍拳 anti-air > raw DR oki','jump','any',2,'対空・起き攻め','距離でM/Hを使い分け','https://note.com/isseeeko/n/na5e817df921a'),
 ('ken-modern-light','モダン小足基本','modern_only','2L x2 > Assist L > manual H昇龍拳','Modern 2L','any',2,'モダン小技','簡易昇龍はM版で空振り得る記事記載','https://kamigame.jp/streetfighter6/page/320488861362870390.html'),
 ('ken-modern-light-cdr','モダン小技ラッシュ運び','modern_only','2L x2 > CDR L > Assist M x2 > 奮迅脚 > 奮迅竜巻旋風脚','Modern 2L','any',4,'モダン小技運び','Drive3本、記事damage1291 claim','https://kamigame.jp/streetfighter6/page/320488861362870390.html'),
 ('ken-modern-mid-cdr','モダン中足ラッシュ','modern_only','2M > CDR L > Assist M x2 > 奮迅脚 > 奮迅竜巻旋風脚','Modern 2M','any',4,'モダン下段運び','ボタン割当と距離確認','https://kamigame.jp/streetfighter6/page/320488861362870390.html'),
 ('ken-modern-heavy-run','モダン強攻撃奮迅昇龍','modern_only','H > 奮迅脚 > 奮迅昇龍拳','Modern H','any',2,'モダン基本','欠落通常技と入力を確認','https://kamigame.jp/streetfighter6/page/320488861362870390.html'),
 ('ken-modern-di-wall','モダンDI壁迅雷昇龍','modern_only','DI wall splat > H > H迅雷脚 > H派生 > manual M昇龍拳','DI wall splat','corner',4,'モダン壁反撃','手動必殺入力を撮影確認','https://kamigame.jp/streetfighter6/page/320488861362870390.html'),
 ('ken-modern-stun-sa3','モダン端スタンSA3','modern_only','DI stun > j.H > Assist H route > 奮迅龍尾脚 > one-button/manual SA3','corner stun','corner',5,'モダンスタン最大候補','記事画像の入力と補正を撮影確認','https://kamigame.jp/streetfighter6/page/320488861362870390.html')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.cid,r.slug,r.name,r.typ,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,'Written/image-confirmed route; no video playback. Current-device capture required.',ctx.pid,'unverified',case when r.typ='modern_only' then 'modern_only' else 'strategy' end,'draft' from ctx cross join r on conflict(slug) do nothing;

with ctx as(select (select id from characters where slug='ken') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),
r(slug,name,typ,starter,seq,adv,pos,description,src) as(values
 ('ken-oki-run-tatsu-double-dash','奮迅竜巻後前ステ2回','oki','奮迅竜巻 hit','dash x2 > throw / 2LP / backwalk / neutral jump','+5 claim','mid','中央密着択','https://note.com/darashie/n/n830cb30d74c6'),
 ('ken-oki-run-tatsu-corner-whiff','奮迅竜巻端空振り消費','frame_kill','corner-reaching 奮迅竜巻','5MP whiff > 5LK whiff > throw / shimmy / meaty','+3 outside throw range claim','corner','投げ打撃シミー','https://www.syogepixiv.work/2026/06/26/%E3%80%90%E3%82%B9%E3%83%886%E3%80%91%E3%82%B1%E3%83%B3%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%83%97%E3%83%AC%E3%82%A4%E3%82%AC%E3%82%A4%E3%83%89/'),
 ('ken-oki-run-tatsu-di','奮迅竜巻端DI重ね','impact','corner-reaching 奮迅竜巻','dash > DI','meaty claim','corner','無敵・SA・DI返しとの結果確認','https://note.com/darashie/n/n830cb30d74c6'),
 ('ken-oki-run-tatsu-safejump','奮迅竜巻端1F遅らせ詐欺飛び','safe_jump','corner-reaching 奮迅竜巻','delay 1F > forward j.HP / empty low / empty throw','safe-jump claim','corner','手動1F遅らせの再現性確認','https://note.com/darashie/n/n830cb30d74c6'),
 ('ken-oki-run-tatsu-jinrai','奮迅竜巻後迅雷空振り派生','frame_kill','corner-reaching 奮迅竜巻','H迅雷 whiff > L/M/no follow-up','meaty branch claim','corner','弱派生持続、投げ、無敵ガード','https://note.com/darashie/n/n830cb30d74c6'),
 ('ken-oki-run-dp-dash','奮迅昇龍後前ステ','oki','奮迅昇龍 hit','dash > micro-walk throw / 5MP / crouch guard','+6 claim','any','投げ・打撃・シミー','https://note.com/darashie/n/n830cb30d74c6'),
 ('ken-oki-run-dp-corner-lk','奮迅昇龍端弱K消費','frame_kill','corner 奮迅昇龍','5LK whiff > meaty 5MP / throw / backwalk','5MP +1 block claim','corner','Dリバガード可主張','https://note.com/darashie/n/n830cb30d74c6'),
 ('ken-oki-plus33-2mk','+33中足空振り三択','frame_kill','M昇龍/端迅雷/弱竜巻 route +33','2MK whiff > throw / backwalk 5MP / meaty','+5 after kill claim','corner','複数締めから共通化','https://www.syogepixiv.work/2026/06/26/%E3%80%90%E3%82%B9%E3%83%886%E3%80%91%E3%82%B1%E3%83%B3%E3%81%AE%E3%82%BB%E3%83%88%E3%83%97%E3%83%AC%E3%82%A4%E3%82%AC%E3%82%A4%E3%83%89/'),
 ('ken-oki-corner-hdp-whiff','端強昇龍後小P空振り強P','frame_kill','corner H昇龍 ground hit','5LP/2LP whiff based on height > meaty 5HP','+2 block/+5 hit claim','corner','昇龍ヒット高で空振り技変更','https://note.com/darashie/n/n830cb30d74c6'),
 ('ken-oki-forward-throw','端前投げ起き攻め','throw_oki','corner forward throw','micro-walk throw / 5HP / dash strike-throw','+20 claim','corner','柔道とシミー','https://takukakugamer.com/sf6-ken-setup/'),
 ('ken-oki-backthrow','後ろ投げ生DR起き攻め','throw_oki','back throw','raw DR 5LP / throw / neutral jump','unknown','any','位置入替え後の基本択','https://note.com/darashie/n/n830cb30d74c6'),
 ('ken-oki-sweep','大足前ステ2回','oki','2HK normal hit','dash x2 > throw / 2MP / backwalk','+2 claim','any','通常ヒット限定','https://takukakugamer.com/sf6-ken-setup/'),
 ('ken-oki-sweep-pc','大足PC前ジャンプ入替え','side_switch','2HK punish counter','forward jump side switch > strike / throw','+47 claim','own_corner','位置入替えと起き攻め','https://takukakugamer.com/sf6-ken-setup/'),
 ('ken-oki-run-tatsu-air-overhead','奮迅竜巻空中ヒット持続中段','meaty','奮迅竜巻 air hit','5LP whiff > 奮迅脚 > 中段派生','meaty claim','any','4F・無敵・パリィ確認','https://takukakugamer.com/sf6-ken-setup/'),
 ('ken-oki-od-dp','OD昇龍後前ステ','oki','OD昇龍 hit','dash > throw / 5MP / shimmy','+3 claim','any','Drive使用に見合う状況確認','https://takukakugamer.com/sf6-ken-setup/'),
 ('ken-oki-dr-mp-y4','Year4生DR中P六択','oki','knockdown with raw DR reach','DR 5MP > throw / 2LK~LP~HDP / backwalk 2HP / 5MP CH~5LK~HDP / 2MP / hit-confirm TC','block advantage claim','any','2026調整の中心。めり込み距離必須','https://note.com/isseeeko/n/na5e817df921a'),
 ('ken-oki-dr-2mp','生DRしゃがみ中P三択','oki','knockdown','DR 2MP > throw / backwalk 5MP / strike','+4 block claim','corner','密着でなければ投げ・5MPが届かない','https://www.syogepixiv.work/2026/06/26/%E3%80%90%E3%82%B9%E3%83%886%E3%80%91%E3%82%B1%E3%83%B3%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%83%97%E3%83%AC%E3%82%A4%E3%82%AC%E3%82%A4%E3%83%89/'),
 ('ken-oki-hdp-di','地上強昇龍後DI重ね','impact','H昇龍 ground hit','DI','+25 claim','corner','25F DI重ねの防御結果確認','https://note.com/brave_borage507/n/n50d9ca1f76ea'),
 ('ken-oki-run-tatsu-air-di','奮迅竜巻空中ヒットDI重ね','impact','奮迅竜巻 air hit','dash > DI','+24 after dash claim','any','端到達距離で密着度変化','https://note.com/brave_borage507/n/n50d9ca1f76ea'),
 ('ken-oki-modern-dr-mp','モダン生DR中P択','modern_oki','Modern knockdown','DR M > throw / 2L~L~manual H昇龍 / shimmy / M counter route','current Y4 claim','any','モダン対応分岐を個別撮影','https://note.com/isseeeko/n/na5e817df921a')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.cid,r.slug,r.name,r.typ,r.starter,r.seq,r.adv,r.pos,r.description,'Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',ctx.pid,'unverified',case when r.slug like 'ken-oki-modern-%' then 'modern_only' else 'strategy' end,'draft' from ctx cross join r on conflict(slug) do nothing;

with ctx as(select (select id from characters where slug='ken') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),
r(slug,name,seq,notes,src) as(values
 ('ken-seq-jinrai-tree','迅雷脚派生読み合い','M/H迅雷 > L/M/H follow-up / no follow-up throw / backwalk','派生間隔、4F、DI、パリィ、無敵を分離。','https://takukakugamer.com/sf6-ken-setup/'),
 ('ken-seq-run-tree','奮迅脚派生選択','奮迅脚 > stop / run DP / run tatsu / run overhead / run kick','位置、ヒット確認、SA資源で締めを選ぶ。','https://www.streetfighter.com/6/ja-jp/character/ken/movelist'),
 ('ken-seq-run-kick-y4','Year4奮迅前蹴り連係','5HP > 奮迅脚 > 前蹴り / stop / delayed branch','2026版は発生17F、CH追撃旧ルート廃止。','https://note.com/isseeeko/n/na5e817df921a'),
 ('ken-seq-dr-mp-rps','生DR中Pガード後分岐','DR 5MP > throw / low / shimmy / CH trap / backdash-jump catch / stop','めり込み距離と無敵停止を確認。','https://note.com/isseeeko/n/na5e817df921a'),
 ('ken-seq-crmk-confirm','中足ラッシュ確認','2MK > CDR > on hit 2HP route / on block LP true pressure','ラッシュ開始までにヒット・ガードを判別。','https://kasayasak.hatenablog.com/entry/2025/08/09/145233'),
 ('ken-seq-corner-throw','端投げ打撃シミー','corner knockdown > throw / meaty / backwalk punish','相手4F、投げ抜け、無敵、ジャンプを分離。','https://takukakugamer.com/sf6-ken-setup/'),
 ('ken-seq-safejump-low','詐欺飛び中下投げ','delayed forward jump > j.HP / empty 2LK / empty throw','1F遅らせ再現と無敵技着地ガードを確認。','https://note.com/darashie/n/n830cb30d74c6'),
 ('ken-seq-di-meaty-defense','DI重ね防御分岐','meaty DI > armor hit / counter DI / invincible / SA / parry','確定ではなく相手資源と選択で変化。','https://note.com/brave_borage507/n/n50d9ca1f76ea'),
 ('ken-seq-lethal-choice','運びとリーサル選択','hit confirm > run tatsu for corner / run ryubi SA3 for kill / DP oki','体力・位置・Drive・SAで判断。','https://note.com/nikotarosun/n/nd025f50a5ce9'),
 ('ken-seq-modern-input','モダン簡易・手動必殺使い分け','Modern combo > manual H/M DP when auto strength whiffs > one-button SA if needed','簡易入力補正と強度差を記録。','https://kamigame.jp/streetfighter6/page/320488861362870390.html')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.cid,r.slug,r.name,'pressure',r.seq,false,'4F check','throw branch','backwalk branch','jump check','parry check','D-reversal check','invincible check',r.notes,ctx.pid,'unverified',case when r.slug='ken-seq-modern-input' then 'modern_only' else 'strategy' end,'draft' from ctx cross join r on conflict(slug) do nothing;

-- Attach written sources to all new records.
with e as(
 select 'combo' typ,id,slug,case when slug like 'ken-modern-%' then 'https://kamigame.jp/streetfighter6/page/320488861362870390.html' when slug in('ken-y4-5mp-ch','ken-y4-anti-air') then 'https://note.com/isseeeko/n/na5e817df921a' when slug in('ken-y4-2mk-cdr-2hp','ken-y4-2hp-pc-stop') then 'https://kasayasak.hatenablog.com/entry/2025/08/09/145233' when slug in('ken-y4-run-ryubi-sa3') then 'https://note.com/nikotarosun/n/nd025f50a5ce9' else 'https://takukakugamer.com/sf6-ken-combo/' end url from combos where slug like 'ken-y4-%' or slug like 'ken-modern-%'
 union all select 'setup',id,slug,case when slug in('ken-oki-dr-mp-y4','ken-oki-modern-dr-mp') then 'https://note.com/isseeeko/n/na5e817df921a' when slug in('ken-oki-run-tatsu-corner-whiff','ken-oki-plus33-2mk','ken-oki-dr-2mp') then 'https://www.syogepixiv.work/2026/06/26/%E3%80%90%E3%82%B9%E3%83%886%E3%80%91%E3%82%B1%E3%83%B3%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%83%97%E3%83%AC%E3%82%A4%E3%82%AC%E3%82%A4%E3%83%89/' when slug in('ken-oki-hdp-di','ken-oki-run-tatsu-air-di') then 'https://note.com/brave_borage507/n/n50d9ca1f76ea' when slug in('ken-oki-forward-throw','ken-oki-sweep','ken-oki-sweep-pc','ken-oki-run-tatsu-air-overhead','ken-oki-od-dp') then 'https://takukakugamer.com/sf6-ken-setup/' else 'https://note.com/darashie/n/n830cb30d74c6' end from setups where slug like 'ken-oki-%'
 union all select 'sequence',id,slug,case when slug in('ken-seq-run-tree') then 'https://www.streetfighter.com/6/ja-jp/character/ken/movelist' when slug in('ken-seq-run-kick-y4','ken-seq-dr-mp-rps') then 'https://note.com/isseeeko/n/na5e817df921a' when slug='ken-seq-crmk-confirm' then 'https://kasayasak.hatenablog.com/entry/2025/08/09/145233' when slug='ken-seq-safejump-low' then 'https://note.com/darashie/n/n830cb30d74c6' when slug='ken-seq-di-meaty-defense' then 'https://note.com/brave_borage507/n/n50d9ca1f76ea' when slug='ken-seq-lethal-choice' then 'https://note.com/nikotarosun/n/nd025f50a5ce9' when slug='ken-seq-modern-input' then 'https://kamigame.jp/streetfighter6/page/320488861362870390.html' else 'https://takukakugamer.com/sf6-ken-setup/' end from sequences where slug like 'ken-seq-%'
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select e.typ,e.id,s.id,'supporting','Written/image claim; current capture required.' from e join sources s on s.url=e.url on conflict(entity_type,entity_id,source_id) do nothing;

-- Verification Training for every active Ken strategy, including pre-existing rows.
with ctx as(select (select id from characters where slug='ken') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),e as(
 select 'combo' typ,id,slug,name,notation method from combos where character_id=(select cid from ctx) and status<>'archived'
 union all select 'setup',id,slug,name,starter_condition||' > '||sequence_text from setups where character_id=(select cid from ctx) and status<>'archived'
 union all select 'sequence',id,slug,name,sequence_text from sequences where character_id=(select cid from ctx) and status<>'archived')
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【ケン撮影待ち】'||e.name,case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,'文章・画像から収集した攻略を現行版で確定する。','advanced',15,ctx.cid,'入力履歴・フレーム・ダメージ・Drive/SA表示。Classic/Modern、位置、始動状態、受け身を指定。','4F、ジャンプ、バクステ、パリィ、DI、Dリバ、無敵を必要時に録画。','CPU OFF。',e.method,'左右各10回で成立、数値、位置、受け身、キャラ条件を記録。',20,'成立ならverified候補。不成立ならarchived。',ctx.pid,'unverified','strategy','draft' from ctx cross join e where not exists(select 1 from trainings t where t.slug='training-'||e.slug) on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(select 'combo' typ,id,slug from combos where character_id=(select id from characters where slug='ken') and status<>'archived' union all select 'setup',id,slug from setups where character_id=(select id from characters where slug='ken') and status<>'archived' union all select 'sequence',id,slug from sequences where character_id=(select id from characters where slug='ken') and status<>'archived')e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related Ken strategy.' from trainings t join training_relations tr on tr.training_id=t.id join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id where t.player_character_id=(select id from characters where slug='ken') on conflict(entity_type,entity_id,source_id) do nothing;

-- Beginner media reusable on both the Ken and future tutorial pages.
with ctx as(select (select id from characters where slug='ken') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),r(slug,name,purpose,method) as(values
 ('ken-media-run-input','【初心者素材】奮迅脚と急停止','奮迅脚の同時押し・移動・急停止を説明する。','入力履歴ON。ニュートラル、通常技キャンセル、急停止の成功・失敗を別テイク撮影。'),
 ('ken-media-run-branches','【初心者素材】奮迅脚全派生','昇龍・竜巻・龍尾・前蹴りの用途を説明する。','同じ始動から各派生を個別撮影し、運びとダウン状況を表示。'),
 ('ken-media-jinrai','【初心者素材】迅雷脚と遅らせ派生','迅雷三派生、派生なし、遅らせ入力を説明する。','4F、DI、ガードを録画し、確定連携と読み合いを分ける。'),
 ('ken-media-dp-input','【初心者素材】昇龍拳の先行入力','歩き・しゃがみ・ガード硬直後の昇龍入力を説明する。','入力履歴付きで323/623入力、成功例・失敗例、モダン簡易入力を撮影。'),
 ('ken-media-crmk-rush','【初心者素材】中足キャンセルラッシュ確認','中足ヒット・ガード確認とラッシュ後の打ち分けを説明する。','ランダムガードでヒット時2HP、ガード時LPを短尺撮影。'),
 ('ken-media-corner-rps','【初心者素材】端の投げ打撃シミー','ケンの端起き攻めの基本三択を説明する。','同じダウンから投げ、打撃、後ろ歩き、無敵ガードを別テイク撮影。') )
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select r.slug,r.name,'instructional_media',r.purpose,'beginner',10,ctx.cid,'720p60fps以上。入力履歴・フレーム・ダメージ・Drive/SA表示ON。成功例と必要な失敗例を分ける。','必要なダミー動作だけ個別再生。','CPU OFF。',r.method,'入力と結果が短尺で判別できること。',5,'1～2秒ループと10～20秒説明クリップへ分割。',ctx.pid,'unverified','training','draft' from ctx cross join r on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Official command reference for instructional capture.' from trainings t join sources s on s.url='https://www.streetfighter.com/6/ja-jp/character/ken/movelist' where t.slug like 'ken-media-%' on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.training_type='instructional_media' then 10 when t.name ilike '%最大%' or t.name ilike '%SA2%' or t.name ilike '%SA3%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,case when t.training_type='instructional_media' then '初心者ページ兼ケンページ用。短尺再利用を前提に撮影。' else '現行成立、入力、数値、位置、受け身、キャラ条件を確認。' end from trainings t where t.player_character_id=(select id from characters where slug='ken') and (exists(select 1 from training_relations tr where tr.training_id=t.id and tr.related_type in('combo','setup','sequence')) or t.slug like 'ken-media-%') on conflict(training_id) do nothing;

update character_content_packages ccp set rollout_status='complete',notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Ken text/image-only strategy collection complete. Classic/Modern, Jinrai/run branches, current Y4 DR MP pressure and reusable beginner media tracked; video playback excluded.'),updated_at=now() from characters c where c.id=ccp.character_id and c.slug='ken';
