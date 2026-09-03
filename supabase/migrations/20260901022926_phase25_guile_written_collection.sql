-- Guile text/image-only strategy collection for the 2026-08-03 baseline.
-- Written community claims remain draft/unverified until current-device capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('ガイル バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/guile','official','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'primary','Current patch compatibility context.'),
 ('ガイル コマンドリスト','https://www.streetfighter.com/6/ja-jp/character/guile/movelist','official','CAPCOM',null::timestamptz,now(),'primary','Official Classic/Modern move and command reference.'),
 ('スト6ガイルの起き攻めまとめ','https://note.com/mochimochi_sf/n/n25e5ee23d718','community_guide','もちもち','2025-02-22 00:00:00+00'::timestamptz,now(),'community','Detailed written oki, frame-kill and combo claims.'),
 ('モダンガイル ゲージ回収や倒し切り用コンボ','https://note.com/sif_nephilim/n/n785c9d582fb6','community_guide','なぎ',null::timestamptz,now(),'community','Concrete Modern combo recipes, damage and resource claims.'),
 ('モダンガイル 起き攻め・セットプレイまとめ','https://note.com/sif_nephilim/n/n7c566cf691d6','community_guide','なぎ','2023-11-14 00:00:00+00'::timestamptz,now(),'community','Concrete Modern setup and safe-jump claims; legacy candidate.'),
 ('ガイル最低限使い方メモ','https://note.com/kch_/n/n7fc6850705e9','community_guide','kch_','2025-04-06 00:00:00+00'::timestamptz,now(),'community','Written beginner routes and neutral decision examples.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

with ctx as (
 select (select id from characters where slug='guile') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), r(slug,name,combo_type,notation,starter,position,difficulty,purpose,conditions,source_url) as (values
 ('guile-written-2mp-tc-summer','しゃがみ中P基本サマー','basic','2MP > 2MP(TC) > サマーソルトキック','2MP','any',2,'基本確認','Classic/Modern availability and strength require capture','https://note.com/kch_/n/n7fc6850705e9'),
 ('guile-written-light-summer','小技3発サマー','basic','2LP > 2LP > 2LP > サマーソルトキック','2LP','any',2,'小技確認','Charge timing and Modern button mapping require capture','https://note.com/kch_/n/n7fc6850705e9'),
 ('guile-written-2mp-cdr-summer','中Pキャンセルラッシュ基本','drive_rush','2MP > CDR > 2MP > 2MP > 2MP(TC) > サマーソルトキック','2MP','any',3,'中足圏内からの運び','Legacy written route; current connection requires capture','https://note.com/kch_/n/n7fc6850705e9'),
 ('guile-written-di-pc-dash-tc','DIパニカン前ステ大足TC','punish_counter','DI(PC) > 前ステップ > 2HK > 3HK(TC) > サマーソルトキック','DI punish counter','any',3,'DI反撃','Charge timing requires capture','https://note.com/kch_/n/n7fc6850705e9'),
 ('guile-written-di-wall-blade','DI壁やられブレイドサマー','wall_splat','DI壁やられ > 5HP > Lソニックブレイド > サマーソルトキック','DI wall splat','corner',3,'壁やられ反撃','Current patch connection requires capture','https://note.com/kch_/n/n7fc6850705e9'),
 ('guile-written-dr-overhead-crouch','生DR中段しゃがみ限定SA1','drive_rush','DR 6MP > 2MP > CDR > 2MP > 5HP > 5HK > 5MP > Lジャストソニック > 5HK > SA1','DR 6MP','any',5,'中段最大候補','Crouching hit only claim','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-2mp-double-cdr-sa3','中P起き攻め倒し切りSA3','super','2MP > CDR > 2MP > 5HP > CDR > 5HK > 2MP > Hサマーソルトキック > SA3','2MP','any',5,'倒し切り','Written simplified route; current damage unknown','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-5mp-hurricane-odsummer','中PハリケーンODサマー','meter','5MP > 4HP > Hソニックハリケーン > ODサマーソルトキック','5MP','any',3,'SA1火力と距離離し','Notation uses source naming; current input requires capture','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-modern-light-dr-gauge','モダン小技DRゲージ回収','modern_only','Assist L x3 > DR 2L > Assist H x2 > Hサマーソルトキック','Modern Assist L','any',3,'SAゲージ回収','Modern only; source damage claim 1921','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-di-pc-gauge','モダンDIパニカン回収','modern_only','DI(PC) > 4H > DR 5H > Assist H x2 > Hサマーソルトキック','DI punish counter','any',4,'SAゲージ回収','Modern only; source damage claim 3106','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-di-wall-gauge','モダンDI壁クラッシュ回収','modern_only','DI wall splat > Assist H x2 > DR 2H > Hサマーソルトキック','DI wall splat','corner',4,'SAゲージ回収','Modern only; source damage claim 2104','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-6h-pc-gauge','モダン6強PC回収','modern_only','6H(PC) > 4H > DR 5H > Assist H x2 > Hサマーソルトキック','6H punish counter','any',4,'PC火力・回収','Modern only; tight link claim','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-corner-sonic-loop','モダン端ソニックループ','modern_only','6H or j.H(PC) > 4H > DR 6M > Assist H > Assist M > simple Sonic > 4H > simple Sonic > 3H','heavy punish counter','corner',5,'端運び・回収','Character/standing restrictions in source','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-light-sa1-odsummer','モダン小技SA1歩きODサマー','modern_only','Assist L x3 > DR 2L > 4H > SA1 > walk > ODサマーソルトキック','Modern Assist L','any',4,'SA1倒し切り','Charge partition and clean-hit require capture','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-light-sa3','モダン小技SA3','modern_only','Assist L x3 > DR 2L > 4H > DR 5H > Assist M > Hサマーソルトキック > simple SA3','Modern Assist L','any',4,'SA3倒し切り','Source damage 4185/CA4435','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-corner-light-sa3','モダン端小技SA3','modern_only','Assist L x3 > DR 2L > 4H > DR 5H > Assist H x2 > simple Blade > Hサマーソルトキック > simple SA3','Modern Assist L','corner',5,'端SA3倒し切り','Source damage 4149/CA4399','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-di-pc-sa1','モダンDIパニカンSA1','modern_only','DI(PC) > Assist H x2 > SA1 > ODサマーソルトキック','DI punish counter','any',3,'DI反撃SA1','Source damage 3740','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-di-pc-sa3','モダンDIパニカンSA3','modern_only','DI(PC) > 4H > DR 5H > Assist H > DR 5H > Assist M > Hサマーソルトキック > simple SA3','DI punish counter','any',5,'DI反撃SA3','Source damage 5268','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-di-wall-sa3','モダンDI壁クラッシュSA3','modern_only','DI wall splat > Assist H x2 > DR 4H > DR 2H > Hサマーソルトキック > simple SA3','DI wall splat','corner',5,'壁やられSA3','Source damage 4375/CA4625','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-3h-pc-sa1','モダン大足PC SA1','modern_only','3H(PC) > 3H > Hサマーソルトキック > simple SA1','3H punish counter','any',3,'シミー・確反','Source damage 2680','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-3h-pc-sa3','モダン大足PC SA3','modern_only','3H(PC) > 3H > DR 4H > DR 2H > Hサマーソルトキック > simple SA3','3H punish counter','any',5,'シミー最大候補','Source damage 4539','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-2l-pc-sa1','モダン2弱PC SA1','modern_only','2L(PC) > 4H > DR 5H > Assist H x2 > SA1 > walk > ODサマーソルトキック','2L punish counter','any',5,'小技確反SA1','Source damage 3584','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-4h-pc-sa3','モダン4強PC SA3','modern_only','4H(PC) > DR 5H > Assist H > DR 5H > Assist M > Hサマーソルトキック > simple SA3','4H punish counter','any',5,'無敵反撃SA3','Source damage 5414','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-6h-pc-sa3','モダン6強PC SA3','modern_only','6H(PC) > 4H > DR 5H > Assist H > DR 5H > Assist M > Hサマーソルトキック > simple SA3','6H punish counter','any',5,'無敵反撃SA3','Source damage 5794','https://note.com/sif_nephilim/n/n785c9d582fb6'),
 ('guile-modern-corner-odblade-sa3','モダン端ODブレイドSA3','modern_only','6H or j.H > Assist H x2 > OD Blade > OD Cross > Hサマーソルトキック > simple SA3','heavy punish','corner',5,'端最大候補','Source damage 5970','https://note.com/sif_nephilim/n/n785c9d582fb6')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.combo_type,r.notation,r.starter,r.position,r.difficulty,r.purpose,r.conditions,
 'Written route collected without video playback; verify on 2026.08.03 build.',ctx.patch_id,'unverified',case when r.combo_type='modern_only' then 'modern_only' else 'strategy' end,'draft'
from ctx cross join r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='guile') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), r(slug,name,setup_type,starter,sequence_text,advantage,position,description,source_url) as (values
 ('guile-written-lsummer-plus36','中央弱サマー+36起き攻め','oki','Lサマーソルトキック地上ヒット','前ステップ > DR打撃 / 投げ / 中段 / 下段 / シミー','+36 claim','mid','通常・後方受け身を分けて確認','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-2hk-plus34','大足+34起き攻め','oki','2HK hit','DR打撃 / 投げ / 6MP / 2MK / シミー','+34 claim','any','ハードノックダウン記事記載','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-fthrow-pc-plus15','前投げPC+15ラッシュ投げ','oki','forward throw punish counter','DR投げ / 2LP / 5MP / 2MP','+15 claim','mid','シミー・無敵ガード不可との記事記載','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-bthrow-pc-plus18','後ろ投げPC+18起き攻め','oki','back throw punish counter','DR投げ / 2LP / 5MP / 2MP / 2MK','+18 claim','mid','シミー・無敵ガード不可との記事記載','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-corner-hsummer-guilehigh','端強サマー→ガイルハイ消費','frame_kill','corner Hサマーソルトキック','ガイルハイ空振り > 投げ / 5MP / 微下がり2MP','+39 then +4 claim','corner','シミー間合い候補','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-corner-hsummer-sonic','端強サマー→中P空振り中ソニック','meaty_projectile','corner Hサマーソルトキック','5MP空振り > Mソニック重ね > hit confirm 5HP','+39; guard +3 claim','corner','弾重ねとDrive削り','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-corner-hsummer-overhead','端強サマー→弱K消費持続中段','frame_kill','corner Hサマーソルトキック','5LK空振り > 6MP持続 > 2LP','+39; +21 consumption claim','corner','通常ヒット追撃候補','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-corner-hsummer-backdash','端強サマー→バクステDR弱P','safe_meaty','corner Hサマーソルトキック','backdash > DR 2LP','+39; +15 consumption claim','corner','遅い無敵技への詐欺重ね候補','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-corner-throw-sonic','端前投げ後ソニック重ね','meaty_projectile','corner forward throw','Sonic Boom meaty > hit confirm / pressure','unknown','corner','ジャンプ・バクステ・ガード分岐','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-modern-corner-blade-safe','モダン端強サマー後弱ブレイド','modern_only','corner Hサマーソルトキック','L Blade meaty > backwalk crouch guard > throw / strike / shimmy / DI','about +20 claim','corner','OD無敵ガード候補。+36状況は除外記事記載','https://note.com/sif_nephilim/n/n7c566cf691d6'),
 ('guile-modern-safejump-di-crush','モダンDI壁クラッシュ5F詐欺飛び','modern_only','DI wall splat','Assist H x2 > Mサマー > forward jump H','+42 claim','corner','5F safe-jump legacy candidate','https://note.com/sif_nephilim/n/n7c566cf691d6'),
 ('guile-modern-safejump-sa1-whiff','モダンSA1投げ空振り詐欺飛び','modern_only','Assist H x2 > SA1','throw whiff > forward jump H','+42 claim','corner','5F safe-jump legacy candidate','https://note.com/sif_nephilim/n/n7c566cf691d6'),
 ('guile-modern-safejump-3h','モダン大足締め詐欺飛び','modern_only','Assist H x3 > 3H','forward jump H / empty low / throw','+42 claim','corner','5F safe-jump legacy candidate','https://note.com/sif_nephilim/n/n7c566cf691d6'),
 ('guile-modern-plus41-matchup','モダン+41キャラ限定詐欺飛び','modern_only','Assist H or M x2 > Hサマー','forward jump H','+41 claim','corner','Named-character restriction requires current roster verification','https://note.com/sif_nephilim/n/n7c566cf691d6'),
 ('guile-modern-sonic-loop-safe-meaty','モダン端大足後弱ソニック詐欺重ね','modern_only','corner Sonic loop > 3H','L Sonic meaty > DR Assist H','unknown','corner','Opponent reversal matchup restriction','https://note.com/sif_nephilim/n/n7c566cf691d6')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.setup_type,r.starter,r.sequence_text,r.advantage,r.position,r.description,
 'Verify normal/back rise, 4F, 5F/6F reversal, jump, backdash, parry and Drive Reversal.',ctx.patch_id,'unverified',case when r.setup_type='modern_only' then 'modern_only' else 'strategy' end,'draft'
from ctx cross join r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='guile') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), r(slug,name,sequence_text,notes,source_url) as (values
 ('guile-written-blade-advance-tree','ブレイド→弱ソニック追走','Sonic Blade > L Sonic > walk/DR > anti-air / throw / 2MP / shimmy','弾を盾に接近し、飛びは対空へ。','https://note.com/kch_/n/n7fc6850705e9'),
 ('guile-written-oki-high-low-throw','起き攻め中下投げ3択','meaty 6MP / 2MK / throw > hit confirm / pressure','中段・下段・投げ。確定連携ではない。','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-plus-pressure','有利技後のDrive削り分岐','meaty 5MP or 2MP > 5MP~4HP / 2MP > L Sonic / shimmy','記事記載の+4/+2を現行実機確認。','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-minus-low-defense','2MKガード後の防御分岐','2MK blocked > crouch guard / parry read / disengage','記事記載-1。暴れ潰しと誤記しない。','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-delayed-dr-low','遅らせDR下段','delayed DR 2MK > hit confirm / block disengage','遅らせグラ・ファジー立ち・早いパリィずらし候補。','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-shimmy-crouchguard','微下がりしゃがみガードシミー','micro backwalk > crouch guard > throw whiff 5HP / invincible punish','投げ抜けと無敵技を見分ける。','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-written-corner-backthrow-dr','端脱出DR後ろ投げ','own corner DR back throw > immediate DR 5MP or 5LK','位置入れ替え後の4F・ジャンプ確認。','https://note.com/mochimochi_sf/n/n25e5ee23d718'),
 ('guile-modern-dr-light-throw','モダンDR弱P投げ分岐','DR 5L or 2L > throw / Assist L / Assist M / anti-jump Summer','弱Pの遅らせ方と距離で分岐。','https://note.com/sif_nephilim/n/n7c566cf691d6'),
 ('guile-modern-blade-4h-control','モダン簡易ブレイド4強制圧','simple Blade > 4H / Sonic / parry read','中足系暴れの前進判定を抑える記事主張。','https://note.com/sif_nephilim/n/n7c566cf691d6'),
 ('guile-written-resource-stop','Drive2本以下の起き攻め中止','knockdown > check own Drive > stop DR and recover with Sonic/anti-air','攻める／回復する判断を攻略項目として分離。','https://note.com/mochimochi_sf/n/n25e5ee23d718')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,'pressure',r.sequence_text,false,'4F check','throw branch','walk-back branch','jump check','parry check','D-reversal check','invincible check',r.notes,ctx.patch_id,'unverified','strategy','draft'
from ctx cross join r on conflict(slug) do nothing;

-- Link each new strategy row to the written source named in its CTE by URL patterns.
with e as (
 select 'combo' entity_type,id,slug from combos where slug like 'guile-written-%' or slug like 'guile-modern-%'
 union all select 'setup',id,slug from setups where slug like 'guile-written-%' or slug like 'guile-modern-%'
 union all select 'sequence',id,slug from sequences where slug like 'guile-written-%' or slug like 'guile-modern-%'
), mapping as (
 select e.*, case
  when slug like 'guile-modern-%' and (slug like '%safejump%' or slug like '%blade-safe%' or slug like '%sonic-loop%' or entity_type='sequence') then 'https://note.com/sif_nephilim/n/n7c566cf691d6'
  when slug like 'guile-modern-%' then 'https://note.com/sif_nephilim/n/n785c9d582fb6'
  when slug in ('guile-written-2mp-tc-summer','guile-written-light-summer','guile-written-2mp-cdr-summer','guile-written-di-pc-dash-tc','guile-written-di-wall-blade','guile-written-blade-advance-tree') then 'https://note.com/kch_/n/n7fc6850705e9'
  else 'https://note.com/mochimochi_sf/n/n25e5ee23d718' end source_url
 from e
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select m.entity_type,m.id,s.id,'supporting','Written claim; current-device capture required.'
from mapping m join sources s on s.url=m.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='guile') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), e as (
 select 'combo' related_type,id,slug,name,notation method from combos where character_id=(select character_id from ctx) and status<>'archived'
 union all select 'setup',id,slug,name,starter_condition||' > '||sequence_text from setups where character_id=(select character_id from ctx) and status<>'archived'
 union all select 'sequence',id,slug,name,sequence_text from sequences where character_id=(select character_id from ctx) and status<>'archived'
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【ガイル撮影待ち】'||e.name,
 case when e.related_type='combo' then 'combo_retest' when e.related_type='setup' then 'oki_retest' else 'pressure_retest' end,
 '文章・画像から収集したガイル攻略を現行版で確定する。','advanced',15,ctx.character_id,
 '入力履歴、フレーム、ダメージ、Drive/SAを表示。Classic/Modern、中央/端、通常/CH/PC、立ち/しゃがみ、受け身を指定して撮影する。',
 '4F、5F/6F無敵、ジャンプ、バクステ、パリィ、Dリバを必要に応じて録画。','CPU OFF。',e.method,
 '左右各10回で成立、入力、ダメージ、ゲージ、終了F、距離、受け身、キャラ条件を記録。',20,
 '成立ならverified候補。不成立ならrejectedまたはarchived。',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join e where not exists(select 1 from trainings t where t.slug='training-'||e.slug)
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.related_type,e.id from trainings t join (
 select 'combo' related_type,id,slug from combos where character_id=(select id from characters where slug='guile') and status<>'archived'
 union all select 'setup',id,slug from setups where character_id=(select id from characters where slug='guile') and status<>'archived'
 union all select 'sequence',id,slug from sequences where character_id=(select id from characters where slug='guile') and status<>'archived'
) e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Source inherited from related Guile strategy.'
from trainings t join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.player_character_id=(select id from characters where slug='guile')
on conflict(entity_type,entity_id,source_id) do nothing;

-- Beginner media captures: reusable for the tutorial page and Guile pages.
with ctx as (
 select (select id from characters where slug='guile') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), r(slug,name,purpose,method,criteria) as (values
 ('guile-media-charge-basics','【初心者素材】後ろ溜め・下溜めの作り方','溜め入力の基本を短尺映像で説明する。','入力履歴ON。立ちガード中の後ろ溜め、しゃがみガード中の下溜め、斜め後ろ下で両方を兼ねる例を順に撮影。','入力履歴と技成立が読み取れること。'),
 ('guile-media-charge-during-normal','【初心者素材】通常技中に溜めを作る','コンボ中の先行溜めを説明する。','2MP等の通常技を押した直後から下溜めし、サマー締めまでを成功例・失敗例で撮影。','溜め開始のタイミング差が見えること。'),
 ('guile-media-sonic-recharge','【初心者素材】ソニック後すぐ次の溜め','ソニック連射の再溜めを説明する。','ソニックのボタンを押した直後に後ろへ戻す入力と、戻しが遅い失敗例を撮影。','入力履歴で再溜め開始が比較できること。'),
 ('guile-media-perfect-charge','【初心者素材】ジャストソニック・サマー','方向と攻撃ボタンの同時押しを説明する。','通常版とジャスト版を入力履歴・ダメージ表示付きで並べて撮影。','通常／ジャストの表示と結果差を確認できること。'),
 ('guile-media-cancel-rush-charge','【初心者素材】溜めキャラのキャンセルラッシュ','キャンセルラッシュ中も次の溜めを準備する考え方を説明する。','キャンセル可能技>DR後、移動中から下溜めしてサマー締めする成功例と遅い失敗例を撮影。','DR入力と下溜め開始位置が入力履歴で分かること。'),
 ('guile-media-anti-air-choice','【初心者素材】溜め有無による対空選択','サマーと通常技対空の使い分けを説明する。','下溜め有りはサマー、溜め無し近距離は2HP、遠距離は5MK、前進中は空投げ候補を個別撮影。','距離と選択理由を字幕化できる素材であること。')
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select r.slug,r.name,'instructional_media',r.purpose,'beginner',10,ctx.character_id,
 '720p60fps以上、入力履歴・フレーム・ダメージ表示ON。成功例と必要な失敗例を別テイクで撮影。','必要なダミー動作だけ個別再生。','CPU OFF。',r.method,r.criteria,5,
 '1～2秒のMP4/WebMループと説明用10～20秒クリップへ分割する。',ctx.patch_id,'unverified','training','draft'
from ctx cross join r on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Official command/move reference for beginner instructional capture.'
from trainings t join sources s on s.url='https://www.streetfighter.com/6/ja-jp/character/guile/movelist'
where t.slug like 'guile-media-%' on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.training_type='instructional_media' then 10 when t.name ilike '%SA%' or t.name ilike '%最大%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,
 case when t.training_type='instructional_media'
  then '初心者ページ兼ガイルページ用。成功例・失敗例・入力履歴を撮影し、短尺MP4/WebMへ分割する。'
  else 'ガイル攻略検証用。現行成立、操作方式、入力、ダメージ、ゲージ、終了F、距離・受け身・キャラ条件を確認する。' end
from trainings t where t.player_character_id=(select id from characters where slug='guile')
 and (t.slug like 'training-guile-%' or t.slug like 'guile-media-%')
on conflict(training_id) do nothing;

update character_content_packages ccp set rollout_status='in_progress',
 notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Guile text/image-only strategy collection started. Beginner reusable media capture is tracked with gameplay verification; video playback excluded.'),updated_at=now()
from characters c where c.id=ccp.character_id and c.slug='guile';
