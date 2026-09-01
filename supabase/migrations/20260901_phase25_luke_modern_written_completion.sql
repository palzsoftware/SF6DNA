-- Complete Luke's text/image-only collection pass with current Year4 Modern
-- written sources. No video playback was used. Article values stay reviewed,
-- draft, and unverified until the capture backlog is reproduced.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select 'モダンルーク立ち回り・コンボ・起き攻め Year4対応',
 'https://www.sukoreru.com/sf6-modern-luke','guide','スコれる？',
 '2026-08-05'::timestamptz,now(),'secondary',
 'Explicitly updated for Year4 on 2026-08-05. Written inputs and values are article claims pending device reproduction.'
where not exists(select 1 from sources where url='https://www.sukoreru.com/sf6-modern-luke');

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select 'ルーク セットプレイまとめ',
 'https://note.com/clever_zinnia698/n/n0e16d3063c0c','guide','魚喰らい',
 '2025-05-09'::timestamptz,now(),'secondary',
 'Older written setup catalogue. Imported as legacy candidates and rechecked against current Year4 descriptions before device reproduction.'
where not exists(select 1 from sources where url='https://note.com/clever_zinnia698/n/n0e16d3063c0c');

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,combo_type,notation,starter,damage,drive_cost,sa_cost,position,difficulty,purpose,conditions,notes) as (values
 ('luke-y4-modern-2hp-lcharge-mflash-sa3','M安定SA3：2強→弱最大溜め→中フラ','sa3','2HP > 214LP(max charge) > 214MP > SA3','2HP',null,0,3,'any',2,'ジャスト不要の安定SA3','Modern compatible.','Year4記事では全位置対応。'),
 ('luke-y4-modern-2hp-mcharge-hflash-sa3','M中央SA3：2強→中最大溜め→強フラ','sa3','2HP > 214MP(max charge) > 214HP > SA3','2HP',null,0,3,'midscreen',3,'中フラ失敗時のSA3回収','相手が端に近いと不成立。','距離限定。'),
 ('luke-y4-modern-corner-2hp-lcharge-msand-mupper','M端安定：2強→弱最大溜め→中弾→中昇竜','corner','2HP > 214LP(max charge) > 236MP > 623MP','2HP',null,0,0,'corner',3,'端ジャスト不要火力','Modern compatible.','端限定。'),
 ('luke-y4-modern-corner-lperfect-lflash-sa2','M端SA2：2強→弱ジャスト→弱フラ→SA2','sa2','2HP > 214LP(Perfect) > 214LP > SA2','2HP',null,0,2,'corner',4,'SA2後の密着起き攻め','Corner.','記事ではSA2後に密着+3。'),
 ('luke-y4-modern-2hp-mperfect-lperfect-hflash-sa3','Mジャスト二回SA3','sa3','2HP > 214MP(Perfect or max charge) > 214LP(Perfect) > 214HP > SA3','2HP',null,0,3,'midscreen',5,'中央高火力SA3','相手が端に近くないこと。','失敗時の回収分岐あり。'),
 ('luke-y4-modern-jhp-ah-odflash-ddt','M飛び強→A強→ODフラDDT','jump_in','j.HP > Assist HP > 214PP > PP','j.HP',3600,2,0,'any',2,'飛び込み安定火力','Modern only.','通常3600、ジャンプ強PC時3800と記事記載。'),
 ('luke-y4-modern-5mp-pc-tc-sa1','M立ち中P PC→スナップバック→SA1','punish_counter','5MP(PC) > MP > MP > MP > SA1','5MP punish counter',null,0,1,'any',2,'差し返しPC追撃','Year4 target combo change.','端ではSA2または強ライジングへ分岐可能。'),
 ('luke-y4-modern-5hk-pc-odflash-ddt','M立ち強K PC→ODフラDDT','punish_counter','5HK(PC) > 214PP(delay if meaty) > PP','5HK punish counter',3400,2,0,'any',3,'立ち強KPC高火力','持続当て時はODフラを遅らせる。','記事記載3400。'),
 ('luke-y4-modern-amp-lp-odflash-ddt','Mアシスト中→弱P→ODフラDDT','confirm','Assist MP > 2LP > 214PP > PP','Assist MP',2780,2,0,'any',2,'+1F打撃択のヒット確認','Modern only.','記事記載2780。'),
 ('luke-y4-modern-dr-overhead-ddt','Mラッシュ中段→A中→ODフラDDT','overhead','DR > 6MP > Assist MP > 214PP > PP','DR 6MP',3200,3,0,'any',3,'中段からDDT','Modern only.','記事記載3200。'),
 ('luke-y4-modern-suppressor-pc-amp-ddt','MサプレッサーPC→A中→ODフラDDT','punish_counter','4HP(PC) > Assist MP > 214PP > PP','4HP punish counter',3600,2,0,'any',3,'シミーPCの安定ルート','Modern only.','記事記載3600。'),
 ('luke-y4-modern-burnout-anywhere-sa3','M全Drive使用・全位置SA3','lethal','4HP or 214MP > 2HP > CDR > 4HP > 2HP > CDR > 4HP > 2HP > 214LP(Perfect) > 214HP > SA3','4HP / 214MP',null,6,3,'any',5,'全位置リーサル','Drive全消費。','弱ジャスト失敗時は中フラ→SA3へ。'),
 ('luke-y4-modern-burnout-center-sa3','M全Drive使用・中央最大候補','lethal','4HP or 214MP > 2HP > 214MP(Perfect or max) > DR > Assist HP(delay) > CDR > 4HP > CDR > 4HP > 214LP(Perfect) > 214HP > SA3','4HP / 214MP',null,6,3,'midscreen',5,'中央リーサル最大候補','Central only; delayed DR Assist HP.','タイミング確認必須。'),
 ('luke-y4-modern-burnout-corner-sa3','M全Drive使用・端最大候補','lethal','4HP or 214MP > 2HP > 214LP(Perfect or max) > DR > Assist HP > CDR > 4HP > CDR > Assist HP > 214HP > SA3','4HP / 214MP',null,6,3,'corner',5,'端リーサル最大候補','Corner / near-corner.','全て最速入力との記事記載。')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,damage,drive_cost,sa_cost,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.combo_type,r.notation,r.starter,r.damage,r.drive_cost,r.sa_cost,r.position,r.difficulty,r.purpose,r.conditions,r.notes,ctx.patch_id,'reviewed','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,setup_type,starter,sequence_text,advantage,position,description,counter_notes) as (values
 ('luke-legacy-lflash-corner-whiff-mp','弱フラ+32→端立ち中P空振り','frame_kill','2LP > 214LP(+32)','端 5MP空振り > 投げ / 2MP','+4 claim','corner','投げ・打撃のフレーム消費。','2025記事値。Year4実機確認待ち。'),
 ('luke-legacy-lflash-corner-whiff-mk','弱フラ+32→端しゃがみ中K空振り','frame_kill','2LP > 214LP(+32)','端 2MK空振り > 投げ / 4HP','+3 claim','corner','空振りで距離を作りサプレッサーで弱暴れを空かす。','2025記事値。Year4実機確認待ち。'),
 ('luke-legacy-lflash-corner-whiff-lk-hk','弱フラ+32→端弱K空振り→強K','meaty','2LP > 214LP(+32)','端 5LK空振り > 5HK','hit +7 / guard 0 claim','corner','+14Fから立ち強K持続重ね。','2025記事値。'),
 ('luke-legacy-mp-lp-end-knee-dash','中弱ジャスト締め→膝空振り→前ステ','frame_kill','214MP(Perfect) > 214LP(Perfect)','5HK空振り > 前ステ > 投げ / 打撃','+5 claim','midscreen','投げ間合い+5で後ろ受け身へのシミー候補。','その場受け身へのシミー不可との記事注意。'),
 ('luke-legacy-corner-hupper-whiff-lp-hk','端強ライジング+29→弱P空振り→強K','meaty','端 214LP(Perfect) > 236MP > 623HP(+29)','2LP空振り > 5HK','hit +7 / guard 0 claim','corner','+14F立ち強K持続。','2025記事値。'),
 ('luke-legacy-corner-hupper-whiff-mp','端強ライジング+29→中P空振り','frame_kill','端 214LP(Perfect) > 236MP > 623HP(+29)','2MP空振り > 投げ / 2MP','+5 claim','corner','投げ・打撃分岐。','シミー不可との記事注意。'),
 ('luke-legacy-corner-hupper-whiff-2lp','端強ライジング+29→弱P二回空振り','frame_kill','端 214LP(Perfect) > 236MP > 623HP(+29)','2LP空振り×2 > 投げ','+4 claim','corner','立ち強K持続重ねを見せた後の投げ分岐。','2025記事値。'),
 ('luke-legacy-airflash-plus34-whiff-mk','端エアフラ最大+34→中足空振り','frame_kill','端 214LP(Perfect) > j.MP > air 214P(max charge)(+34)','2MK空振り > 投げ / 2MP / シミー','+5 claim','corner','2F以上遅らせ投げをシミー可能との記事記載。','現行成立・投げ抜け猶予を確認。'),
 ('luke-legacy-airflash-plus34-whiff-5mk','端エアフラ最大+34→立ち中K空振り','frame_kill','端 214LP(Perfect) > j.MP > air 214P(max charge)(+34)','5MK空振り > シミー / 遅らせ打撃','+5 claim','corner','投げ間合い外から攻め直す。','現行の押し出し距離を確認。')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.setup_type,r.starter,r.sequence_text,r.advantage,r.position,r.description,r.counter_notes,ctx.patch_id,'reviewed','legacy_candidate','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,sequence_text,is_true,notes) as (values
 ('luke-y4-modern-cr-amp-plus5','MキャンセルDRアシスト中+5択','Assist HP / Assist MP / 2MK > CDR > Assist MP(block +5) > 投げ / Assist MP / シミー / 4HP',true,'A強・A中始動はDR A中まで連続ガードと記事記載。2中始動は別確認。'),
 ('luke-y4-modern-light-chain-hk','M弱弱→A中→立ち強K持続連携','Assist LP×2 > Assist MP > 5HK(meaty)',false,'4F暴れへの距離勝ちを利用する打撃連携。途中の歩き投げ分岐あり。'),
 ('luke-y4-modern-corner-sand-loop','M端サンドブラスト固め','Assist HP > 236HP > Assist MP > 236MP > Assist HP',false,'相手バーンアウト時はサンドブラストまで連続ガード、A強>強弾後+2 claim。ジャンプ・DI対策は読み合い。')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,'pressure',r.sequence_text,r.is_true,r.notes,ctx.patch_id,'reviewed','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with links(entity_type,entity_slug,source_url) as (
 select 'combo',slug,'https://www.sukoreru.com/sf6-modern-luke' from combos where slug like 'luke-y4-modern-%'
 union all select 'sequence',slug,'https://www.sukoreru.com/sf6-modern-luke' from sequences where slug like 'luke-y4-modern-%'
 union all select 'setup',slug,'https://note.com/clever_zinnia698/n/n0e16d3063c0c' from setups where slug like 'luke-legacy-%'
), entities as (
 select 'combo' entity_type,id,slug from combos
 union all select 'setup',id,slug from setups
 union all select 'sequence',id,slug from sequences
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select l.entity_type,e.id,s.id,'supporting','Written source only; current device reproduction remains pending.'
from links l join entities e on e.entity_type=l.entity_type and e.slug=l.entity_slug join sources s on s.url=l.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), entities as (
 select 'combo' related_type,id,slug,name,notation method from combos where slug like 'luke-y4-modern-%'
 union all select 'setup',id,slug,name,starter_condition||' > '||sequence_text from setups where slug like 'luke-legacy-%'
 union all select 'sequence',id,slug,name,sequence_text from sequences where slug like 'luke-y4-modern-%'
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【ルーク最終撮影待ち】'||e.name,
 case when e.related_type='combo' then 'combo_retest' when e.related_type='setup' then 'oki_retest' else 'pressure_retest' end,
 '文章で収集したルーク攻略の現行成立を撮影で確定する。','advanced',15,ctx.character_id,
 '入力履歴・フレーム・ダメージ・Drive/SAを表示し、指定条件と結果まで撮影する。','中央/端、Modern、通常/CH/PC、受け身を指定どおり設定。','CPU OFF。',e.method,
 '左右各10回で成立、ダメージ、ゲージ、終了F、距離・受け身条件を記録する。',20,'成立ならverified候補。不成立ならrejected/archivedへ。',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join entities e on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.related_type,e.id from trainings t join (
 select 'combo' related_type,id,slug from combos
 union all select 'setup',id,slug from setups
 union all select 'sequence',id,slug from sequences
) e on t.slug='training-'||e.slug
where e.slug like 'luke-y4-modern-%' or e.slug like 'luke-legacy-%'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Source inherited from the related Luke item.'
from trainings t join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.slug like 'training-luke-y4-modern-%' or t.slug like 'training-luke-legacy-%'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.name ilike '%全Drive%' or t.name ilike '%SA%' then 20 when t.training_type='oki_retest' then 35 else 45 end,
 'ルーク文章収集完了時の撮影対象。現行成立、入力、ダメージ、ゲージ、終了Fを確認する。'
from trainings t
where t.slug like 'training-luke-y4-modern-%' or t.slug like 'training-luke-legacy-%'
on conflict(training_id) do nothing;

update character_content_packages ccp
set notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Luke text/image-only strategy collection complete. Remaining strategy verification is tracked in capture_backlog; no video playback analysis.'),
    updated_at=now()
from characters c where c.id=ccp.character_id and c.slug='luke';
