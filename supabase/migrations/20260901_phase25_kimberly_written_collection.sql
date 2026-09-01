-- Complete Kimberly text/image-only strategy collection for the 2026-08-03 baseline.
-- Community recipes and frame claims remain draft/unverified until device capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('キンバリー バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/kimberly','official','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'primary','Current patch compatibility context.'),
 ('キンバリー コマンドリスト','https://www.streetfighter.com/6/ja-jp/character/kimberly/movelist','official','CAPCOM',null::timestamptz,now(),'primary','Official Classic/Modern command reference.'),
 ('Cキンバリー コンボまとめ 2026年8月','https://note.com/matsunoki709/n/ncc6937837af7','community_guide','松/じぎーも','2026-08-12 00:00:00+00'::timestamptz,now(),'community','Current written Classic routes, damage claims and spray setup.'),
 ('キンバリー起き攻めネタ集','https://note.com/kirby0423/n/nef88e492c2d8','community_guide','なお',null::timestamptz,now(),'community','Detailed knockdown, frame-kill and setplay claims.'),
 ('キンバリーコンボ〆状況と起き攻め','https://note.com/morimoto1o/n/nb10f6651508e','community_guide','森本市夫','2023-06-09 00:00:00+00'::timestamptz,now(),'community','Legacy frame claims isolated pending current capture.'),
 ('モダンキンバリー攻略','https://goziline.com/archives/53950','community_guide','ゴジライン','2023-06-27 00:00:00+00'::timestamptz,now(),'community','Written Modern routes and spray setplay; legacy candidate.'),
 ('初心者がモダンキンバリーでマスターへ行く方法','https://note.com/oki428/n/n3e53ce83827f','community_guide','微々',null::timestamptz,now(),'community','Modern routes and input tips.'),
 ('キンバリー スプレー缶起き攻め','https://note.com/fancy_human558/n/nafc9a729d27b','community_guide','クロダ','2024-08-18 00:00:00+00'::timestamptz,now(),'community','Corner spray-can pressure and burnout setplay.'),
 ('キンバリー最低限使い方メモ','https://note.com/kch_/n/n3ca78331774a','community_guide','kch_',null::timestamptz,now(),'community','Written beginner and practical Classic routes.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

with ctx as(select (select id from characters where slug='kimberly') character_id,(select id from patches where is_current=true order by released_at desc limit 1) patch_id),
r(slug,name,typ,notation,starter,pos,diff,purpose,conditions,src) as(values
 ('kim-y4-light-ryuten','小足刻み弱流転','basic','2LK > 2LP > 2LP > L流転一文字','2LK','any',2,'小技起き攻め','Source damage 1071; +3 claim','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-light-senpukyaku','小足刻み強旋風脚','basic','2LK > 2LP x2 > H武神旋風脚','2LK','any',3,'運び','Source damage 1287','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-light-tc','小技TCダウン','basic','2LK > 2LP > 5LP~5MP~5HP~5HK','2LK','any',3,'起き攻め','Source damage 1229','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-dr-low-aranya','生DR中足強流転荒鵺','drive_rush','DR 2MK > 5HP > H流転一文字 > 荒鵺捻り','DR 2MK','any',4,'下段運び','Source damage 2286','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-5mk-cdr-runstop','中Kラッシュ急停止ルート','drive_rush','5MK > CDR 2HP > 疾駆け > 急停止 > 2MP x2 > 5MP~5HP > 疾駆け > 影すくい','5MK','any',5,'運び・設置移行','Source damage 2240','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-2mp-tc-run','中P確認TC影すくい','basic','2MP > 5MP~5HP > 疾駆け > 影すくい or 弧空K派生','2MP','any',3,'基本確認','Source damage 1832','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-heavy-run-vault','強P疾駆け弧空K','basic','5HP or 2HP > 疾駆け > 弧空 > K派生','5HP/2HP','any',2,'入れ込み確認','Source damage 1584','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-5hk-tc-shadow','強K中P TC影すくい','basic','5HK > 5MP~5HP > 疾駆け > 影すくい','5HK','any',3,'重ねヒット確認','Source damage 1962','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-overhead-light','中段小技旋風脚','overhead','4HK > 2LP > H武神旋風脚','4HK','any',3,'中段','Close hit only; source damage 1682','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-dr-overhead-tc','DR中段TC影すくい','drive_rush','DR 4HK > 5MP~5HP > 疾駆け > 影すくい','DR 4HK','any',4,'中段運び','Source damage 1755','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-di-pc-aranya','DIパニカン強流転荒鵺','punish_counter','DI(PC) > 2HP > H流転一文字 > 荒鵺捻り','DI punish counter','any',3,'DI反撃','Source damage 2682','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-di-side-switch','端背負いDI入れ替え','punish_counter','DI(PC) > dash > 2HP > 疾駆け急停止 > H武神旋風脚','DI punish counter','own_corner',4,'位置入れ替え','Source damage 2259','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-di-wall','DI壁やられ胴刎ね荒鵺','wall_splat','DI wall splat > 2HP > 疾駆け > 胴刎ね > 荒鵺捻り','DI wall splat','corner',3,'壁反撃','Source damage 2790','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-4f-punish','4F確反TC影すくい','punish','2LP(PC) > 5MP~5HP > 疾駆け > 影すくい','4F punish counter','any',3,'4F確反','Distance check','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-5f-punish','5F確反強P荒鵺','punish','5LP(PC) > 5HP > H流転一文字 > 荒鵺捻り','5F punish counter','any',3,'5F確反','Source +9 claim','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-6f-punish','6F確反中P強P荒鵺','punish','2MP > 5HP > H流転一文字 > 荒鵺捻り','6-8F punish','any',3,'Dリバ反撃','Source damage 2670','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-9f-punish','9F強P急停止荒鵺','punish','5HP(PC) > 疾駆け急停止 > 2HP > H流転一文字 > 荒鵺捻り','9F+ punish counter','any',4,'無敵反撃','Source damage 2916','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-corner-hp-pc-max','端強Pパニカン最大','super','5HP(PC) > delayed 5HK > 5HP > H流転 > OD荒鵺 > OD疾駆け胴刎ね > L流転 > SA3','5HP punish counter','corner',5,'端最大候補','Source damage 5483','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-hp-pc-sa3','強PパニカンSA3','super','5HP(PC) > 疾駆け急停止 > 2HP > H流転 > OD荒鵺 > 疾駆け胴刎ね > L流転 > SA3','5HP punish counter','any',5,'リーサル','Source damage 5312','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-dr-overhead-sa3','DR中段SA3','super','DR 4HK > 5MP~5HP > OD疾駆け弧空K > 疾駆け胴刎ね > L流転 > SA3','DR 4HK','corner',5,'中段リーサル','Source damage 4307','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-y4-dr-slide-sa3','DR持続スラSA3','super','DR 3MK(meaty) > 2HP > H流転 > OD荒鵺 > 疾駆け胴刎ね > L流転 > SA3','DR 3MK meaty','corner',5,'下段リーサル','Source damage 4740','https://note.com/matsunoki709/n/ncc6937837af7'),
 ('kim-modern-basic-light','モダン弱アシスト基本','modern_only','2L > Assist L x4','Modern 2L','any',1,'入門','Legacy Modern written route','https://goziline.com/archives/53950'),
 ('kim-modern-jh-assist','モダン飛び強アシスト','modern_only','j.H > Assist H x5','j.H','any',2,'飛び込み','SA availability changes endpoint','https://goziline.com/archives/53950'),
 ('kim-modern-medium-cdr','モダン中アシストラッシュ','modern_only','Assist M > CDR Assist H > Assist M x2 > 疾駆け > 影すくい > H細工手裏剣 setup','Modern Assist M','any',4,'運び・設置','Legacy route; current buttons require capture','https://goziline.com/archives/53950'),
 ('kim-modern-overhead','モダン中段旋風脚','modern_only','4H > 2L > H武神旋風脚','Modern 4H','any',3,'中段','Legacy route','https://goziline.com/archives/53950'),
 ('kim-modern-teleport','モダンOD彩隠形強アシスト','modern_only','OD彩隠形 > j.H > Assist H x5 > M武神旋風脚','OD彩隠形','any',3,'弾抜け奇襲','Legacy route','https://goziline.com/archives/53950'),
 ('kim-modern-di-wall','モダン端DI胴刎ね','modern_only','DI wall splat > 2H > 疾駆け胴刎ね > rising 荒鵺捻り','DI wall splat','corner',3,'壁反撃','Legacy route','https://goziline.com/archives/53950'),
 ('kim-modern-spray-sa3','モダンスプレー択SA3','modern_only','H細工手裏剣 > throw or 2Lx3 > L流転 > explosion > OD荒鵺 > 6H~9 > j.M > L流転 > SA3','spray setup hit','corner',5,'設置リーサル','Legacy route','https://goziline.com/archives/53950'),
 ('kim-modern-dr-low','モダン生DR下段OD荒鵺','modern_only','DR 2M > 5H > H流転 > OD荒鵺 > 6H~9 > j.H','DR 2M','any',4,'下段運び','Modern written route','https://note.com/oki428/n/n3e53ce83827f'),
 ('kim-modern-stun-candidate','モダン端スタン設置候補','modern_only','H細工手裏剣 setup > 2H > M流転 > OD荒鵺 > follow-up','corner stun','corner',5,'スタン最大候補','Article says probable maximum; exact completion requires capture','https://note.com/oki428/n/n3e53ce83827f')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.typ,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,'Written/image-confirmed route; no video playback. Current-device capture required.',ctx.patch_id,'unverified',case when r.typ='modern_only' then 'modern_only' else 'strategy' end,'draft' from ctx cross join r on conflict(slug) do nothing;

with ctx as(select (select id from characters where slug='kimberly') character_id,(select id from patches where is_current=true order by released_at desc limit 1) patch_id),
r(slug,name,typ,starter,seq,adv,pos,description) as(values
 ('kim-oki-tc-dash','立ち弱P TC前ステ起き攻め','frame_kill','5LP~5MP~5HP~5HK','5MP whiff > dash > throw / 2MP / 2MK','+5 claim','any','通常受け身密着・後方受け身シミー候補'),
 ('kim-oki-tc-run-overhead','TC後首狩り中段','frame_kill','5LP TC ender','2MP whiff > run > Neck Hunter','meaty claim','any','中段択'),
 ('kim-oki-tc-run-low','TC後急停止中足','frame_kill','5LP TC ender','2MP whiff > run stop > 2MK','+4 before low claim','any','下段択'),
 ('kim-oki-tc-run-throw','TC後急停止投げ','frame_kill','5LP TC ender','2MP whiff > run stop > throw','+4 claim','any','シミー不可記事記載'),
 ('kim-oki-tc-run-light','TC後胴刎ね','frame_kill','5LP TC ender','2MP whiff > run > Hop Slice','guard +1 claim','any','打撃継続'),
 ('kim-oki-light-ryuten','弱流転+3択','oki','L流転 hit','throw / 2MP / shimmy','+3 claim','mid','投げ・打撃・シミー'),
 ('kim-oki-corner-senpukyaku','端旋風脚後小P消費','frame_kill','corner H武神旋風脚','2LP whiff > 2MK / 5HK / throw','unknown','corner','中足持続・相打ち強K'),
 ('kim-oki-shadow-double-dash','影すくい前ステ2回','frame_kill','5MP TC > run Shadow Slide','dash x2 > 5HK / throw / shimmy','+11 claim','mid','中央起き攻め'),
 ('kim-oki-shadow-spray','影すくい強設置','spray','corner Shadow Slide hit','H細工手裏剣 > throw / low / shimmy','+3 to +5 claims','corner','爆弾起き攻め'),
 ('kim-oki-spray-throw','強設置投げ爆発追撃','spray','H spray setup','throw > explosion > 荒鵺 / OD荒鵺 route','unknown','corner','投げから追撃'),
 ('kim-oki-spray-low','強設置下段爆発追撃','spray','H spray setup','2LK > 2LP x2 > L流転 > explosion > 荒鵺','unknown','corner','ジャンプ・暴れ・バクステ狩り'),
 ('kim-oki-spray-shimmy','強設置シミー','spray','H spray setup','backdash > Assist M/5MP > L流転 > explosion','unknown','corner','遅らせグラ狩り'),
 ('kim-oki-od-aranya-nmix','OD荒鵺空中復帰4択','setplay','OD荒鵺 or OD疾駆け弧空K','6HK~9 > j.HK > DR 3MK / 4HK / throw / delay 2MK / stop','air recovery','corner','中下投げ・無敵ケア'),
 ('kim-oki-od-aranya-safejump','OD荒鵺J強P詐欺飛び','safe_jump','OD荒鵺 or OD疾駆け弧空K','6HK~9 > j.HP > forward j.HP / strike / throw','safe-jump claim','corner','J強P叩き落とし分岐'),
 ('kim-oki-aranya-dash','荒鵺後前ステ択','oki','H流転 > 荒鵺','dash > throw / 2MP / shimmy','+4 after dash claim','corner','端投げ・打撃'),
 ('kim-oki-od-aranya-whiffs','OD荒鵺弱P空振り消費','frame_kill','OD荒鵺 > 胴刎ね > L流転','2LP whiff > 5LP whiff > 2MK / 5HK / throw / shimmy','+8 claim','corner','持続下段・相打ち強K'),
 ('kim-oki-sa3-dr-low','SA3後DR中足','oki','SA3 hit','DR 2MK > 5HP / pressure','+16 claim','any','SA3後起き攻め'),
 ('kim-oki-bo-spray-safejump','BO端強設置詐欺飛び','burnout','opponent burnout; OD run vault K hit','H spray > forward j.HK > rising j.LK / 2MK','safe-jump claim','corner','中下段継続'),
 ('kim-oki-spray-blockstring','中設置連続ガード削り','burnout','M spray setup','5MP~5HP > L流転 > explosion > DR 5MP~5HP > CDR 2MK','true-blockstring claim','corner','Drive約2.8本削り記事記載')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.typ,r.starter,r.seq,r.adv,r.pos,r.description,'Verify normal/back rise, 4F, jump, backdash, parry, D-reversal and invincible options.',ctx.patch_id,'unverified','strategy','draft' from ctx cross join r on conflict(slug) do nothing;

with ctx as(select (select id from characters where slug='kimberly') character_id,(select id from patches where is_current=true order by released_at desc limit 1) patch_id),
r(slug,name,seq,notes) as(values
 ('kim-seq-run-branches','疾駆け派生選択','run > stop throw / Hop Slice / Shadow Slide / Neck Hunter / vault K','確定連携ではなく相手防御との読み合い。'),
 ('kim-seq-vault-defense','弧空後の防御読み','vault blocked > K / throw / stop / anti-backdash read','4F、バクステ、ジャンプ、無敵を分離。'),
 ('kim-seq-spray-rps','細工手裏剣の投げ打撃シミー','spray > throw / low / shimmy > explosion conversion','ジャスパ、バクステ、無敵、Dリバを記録。'),
 ('kim-seq-dr-high-low','OD荒鵺後の中下段','air recovery > DR 4HK / DR 3MK / delayed 2MK / throw','着地フレームとDリバ不可主張を確認。'),
 ('kim-seq-5hk-counter','5HK重ねCH確認','meaty 5HK > on CH 5HP; on block strike/throw/shimmy','通常ヒットとCHを区別。'),
 ('kim-seq-2mk-pressure','中足有利後の分岐','2MK blocked > 2HP trade trap / 5MP run / walk throw / shimmy','記事記載+1を現行確認。'),
 ('kim-seq-bo-spray','バーンアウト端スプレー攻め','safe jump > rising overhead / low > continued pressure','中下段双方ガード有利主張。'),
 ('kim-seq-sa3-buff','SA3自己強化後の方針','SA3 hit > DR oki > use permanent damage/walk-speed buff','自己強化のラウンド持越しを公式挙動確認。'),
 ('kim-seq-modern-flying-kick','モダン飛煎蹴表裏','6H > 9/7 follow > Assist L / land DR / return','入力方向と表裏、DI回避を撮影。'),
 ('kim-seq-resource-choice','確定ダメージと設置の選択','corner ender > damage ender or spray setup based on life/resources','設置は確定ダメージを捨てる判断。')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,'pressure',r.seq,false,'4F check','throw branch','backwalk branch','jump check','parry check','D-reversal check','invincible check',r.notes,ctx.patch_id,'unverified','strategy','draft' from ctx cross join r on conflict(slug) do nothing;

with e as(
 select 'combo' typ,id,slug from combos where slug like 'kim-y4-%' or slug like 'kim-modern-%'
 union all select 'setup',id,slug from setups where slug like 'kim-oki-%'
 union all select 'sequence',id,slug from sequences where slug like 'kim-seq-%'
), m as(select e.*,case when typ='combo' and slug like 'kim-modern-%' then case when slug='kim-modern-dr-low' or slug='kim-modern-stun-candidate' then 'https://note.com/oki428/n/n3e53ce83827f' else 'https://goziline.com/archives/53950' end when typ='combo' then 'https://note.com/matsunoki709/n/ncc6937837af7' when typ='setup' and slug like '%spray%' or slug like '%bo-%' then 'https://note.com/fancy_human558/n/nafc9a729d27b' when typ='setup' then 'https://note.com/kirby0423/n/nef88e492c2d8' else 'https://note.com/kirby0423/n/nef88e492c2d8' end url from e)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select m.typ,m.id,s.id,'supporting','Written/image claim; current capture required.' from m join sources s on s.url=m.url on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as(select (select id from characters where slug='kimberly') character_id,(select id from patches where is_current=true order by released_at desc limit 1) patch_id),e as(
 select 'combo' typ,id,slug,name,notation method from combos where character_id=(select character_id from ctx) and status<>'archived'
 union all select 'setup',id,slug,name,starter_condition||' > '||sequence_text from setups where character_id=(select character_id from ctx) and status<>'archived'
 union all select 'sequence',id,slug,name,sequence_text from sequences where character_id=(select character_id from ctx) and status<>'archived')
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【キンバリー撮影待ち】'||e.name,case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,'文章・画像から収集した攻略を現行版で確定する。','advanced',15,ctx.character_id,'入力履歴・フレーム・ダメージ・Drive/SA・細工手裏剣数を表示。Classic/Modern、位置、始動状態、受け身を指定。','4F、ジャンプ、バクステ、パリィ、Dリバ、無敵を必要時に録画。','CPU OFF。',e.method,'左右各10回で成立、数値、位置、受け身、キャラ条件を記録。',20,'成立ならverified候補。不成立ならarchived。',ctx.patch_id,'unverified','strategy','draft' from ctx cross join e where not exists(select 1 from trainings t where t.slug='training-'||e.slug) on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(select 'combo' typ,id,slug from combos where character_id=(select id from characters where slug='kimberly') and status<>'archived' union all select 'setup',id,slug from setups where character_id=(select id from characters where slug='kimberly') and status<>'archived' union all select 'sequence',id,slug from sequences where character_id=(select id from characters where slug='kimberly') and status<>'archived')e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related Kimberly strategy.' from trainings t join training_relations tr on tr.training_id=t.id join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id where t.player_character_id=(select id from characters where slug='kimberly') on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as(select (select id from characters where slug='kimberly') character_id,(select id from patches where is_current=true order by released_at desc limit 1) patch_id),r(slug,name,purpose,method) as(values
 ('kim-media-run-stop','【初心者素材】疾駆け急停止の入力','疾駆けから最速・遅らせ急停止を比較する。','入力履歴ON。生入力と通常技キャンセルから、Pずらし押し／押しっぱなしを成功例・失敗例で撮影。'),
 ('kim-media-run-branches','【初心者素材】疾駆け全派生','派生の見た目と用途を説明する。','急停止、胴刎ね、影すくい、首狩り、弧空K／投げ派生を個別撮影。'),
 ('kim-media-teleport','【初心者素材】彩隠形の方向と派生','通常／OD彩隠形と出現位置を説明する。','各強度・方向・空中攻撃派生を入力履歴付きで撮影。'),
 ('kim-media-spray-timing','【初心者素材】細工手裏剣の起爆時間','弱中強設置の起爆差を説明する。','同じダウンから弱・中・強を設置し、起爆までを比較撮影。'),
 ('kim-media-wall-jump','【初心者素材】飛煎蹴と矢来超え','壁蹴り・方向派生と表裏を説明する。','6HK後の7/8/9方向、攻撃、着地を個別撮影。'),
 ('kim-media-spray-rps','【初心者素材】爆弾中の投げ打撃シミー','設置後の基本三択を説明する。','同じ設置から投げ、下段、シミー、無敵ガード、Dリバ結果を別テイク撮影。') )
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select r.slug,r.name,'instructional_media',r.purpose,'beginner',10,ctx.character_id,'720p60fps以上。入力履歴・フレーム・ダメージ表示ON。成功例と必要な失敗例を分ける。','必要なダミー動作だけ個別再生。','CPU OFF。',r.method,'入力と結果が短尺で判別できること。',5,'1～2秒ループと10～20秒説明クリップへ分割。',ctx.patch_id,'unverified','training','draft' from ctx cross join r on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Official command reference for instructional capture.' from trainings t join sources s on s.url='https://www.streetfighter.com/6/ja-jp/character/kimberly/movelist' where t.slug like 'kim-media-%' on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.training_type='instructional_media' then 10 when t.name ilike '%最大%' or t.name ilike '%SA3%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,case when t.training_type='instructional_media' then '初心者ページ兼キンバリーページ用。短尺再利用を前提に撮影。' else '現行成立、入力、数値、位置、受け身、細工手裏剣数、キャラ条件を確認。' end from trainings t where t.player_character_id=(select id from characters where slug='kimberly') and (t.slug like 'training-kim-%' or t.slug like 'kim-media-%') on conflict(training_id) do nothing;

update character_content_packages ccp set rollout_status='complete',notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Kimberly text/image-only collection complete. Classic/Modern, spray/run setplay and reusable beginner media tracked; video playback excluded.'),updated_at=now() from characters c where c.id=ccp.character_id and c.slug='kimberly';
