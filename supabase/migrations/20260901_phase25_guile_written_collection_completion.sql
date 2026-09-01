-- Finish Guile written/image-only collection with Classic practical and SA2 routes.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('スト6ガイルとりこれコンボ解説','https://note.com/mochimochi_sf/n/nd761adb70a9a','community_guide','もちもち','2024-07-07 00:00:00+00'::timestamptz,now(),'community','Classic practical routes; article includes image/Short references, but only written notation is stored.'),
 ('ガイルのSA2コンボ構造','https://note.com/mochimochi_sf/n/n7ecfa62c2ae1','community_guide','もちもち','2024-06-23 00:00:00+00'::timestamptz,now(),'community','Written SA2 start, loop and ender recipes; legacy candidates pending current capture.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

with ctx as (
 select (select id from characters where slug='guile') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), r(slug,name,combo_type,notation,starter,position,difficulty,purpose,conditions,source_url) as (values
 ('guile-classic-5hp-triple-guilehigh','裏拳始動ノーゲージ二重DR','drive_rush','5HP > Guile High > CDR 5MP > Guile High > CDR 5MP > Guile High > Hサマーソルトキック','5HP punish counter','any',5,'SA温存最大候補','Classic written route; source damage claim 3686','https://note.com/mochimochi_sf/n/nd761adb70a9a'),
 ('guile-classic-di-full-sa1','DI返しフルゲージSA1','drive_rush','DI punish counter > 5HP > CDR 5HK > 5HP > CDR 6MK > 2MP > Lジャストソニック > 5HK > SA1','DI punish counter','any',5,'DI返しリーサル','Source damage claim 4025','https://note.com/mochimochi_sf/n/nd761adb70a9a'),
 ('guile-sa2-burnstraight-loop','SA2裏拳2ループ基本','super','DR Burn Straight > 5MP > 2MP > SA2 > Burn Straight > L Sonic > Sonic Break x3 > DR Burn Straight > 5MP > 2MP > L Sonic > Sonic Break x4 > DR Burn Straight > 5MP > 2MP x2 > Hサマーソルトキック','DR Burn Straight or Burn Straight PC','any',5,'SA2運び・回収','Distance-dependent; total Break limit claim 7','https://note.com/mochimochi_sf/n/n7ecfa62c2ae1'),
 ('guile-sa2-dr5mp-loop','SA2ラッシュ中P始動','super','DR 5MP > 5MP > 2MP > SA2 > Burn Straight > L Sonic > Sonic Break x3 > DR Burn Straight > 5MP > 2MP > L Sonic > Sonic Break x4 > ender','DR 5MP','any',5,'起き攻めSA2運び','Ender depends on wall distance','https://note.com/mochimochi_sf/n/n7ecfa62c2ae1'),
 ('guile-sa2-dr2mk-loop','SA2ラッシュ下段始動','super','DR 2MK > 5MP > 2MP > SA2 > Burn Straight > L Sonic > Sonic Break x3 > DR Burn Straight > 5MP > 2MP > L Sonic > Sonic Break x4 > ender','DR 2MK','any',5,'下段SA2運び','Damage/value and ender depend on wall distance','https://note.com/mochimochi_sf/n/n7ecfa62c2ae1'),
 ('guile-sa2-di-loop','SA2インパクト始動','super','DI hit > 5MP > 2MP > SA2 > Burn Straight > L Sonic > Sonic Break x3 > DR Burn Straight > 5MP > 2MP > L Sonic > Sonic Break x4 > ender','DI hit','any',5,'DI始動SA2運び','Ender depends on wall distance','https://note.com/mochimochi_sf/n/n7ecfa62c2ae1'),
 ('guile-sa2-heavy-near-loop','SA2強攻撃近距離ループ','super','heavy starter > SA2 > Burn Straight > 2LP x2 > L Sonic > Sonic Break x4 > second loop / ender','5HK / Burn Straight / 2MP PC > 5HP','any',5,'強攻撃始動SA2','Near/far start changes 4+3 versus 3+4 Break distribution','https://note.com/mochimochi_sf/n/n7ecfa62c2ae1')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.combo_type,r.notation,r.starter,r.position,r.difficulty,r.purpose,r.conditions,
 'Written route only; no video playback. Verify on 2026.08.03 build.',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join r on conflict(slug) do nothing;

with e as (
 select id,slug from combos where slug like 'guile-classic-%' or slug like 'guile-sa2-%'
), m as (
 select e.*,case when slug like 'guile-sa2-%' then 'https://note.com/mochimochi_sf/n/n7ecfa62c2ae1' else 'https://note.com/mochimochi_sf/n/nd761adb70a9a' end url from e
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',m.id,s.id,'supporting','Written recipe; current-device capture required.' from m join sources s on s.url=m.url
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='guile') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), e as (
 select id,slug,name,notation method from combos where character_id=(select character_id from ctx) and status<>'archived'
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【ガイル撮影待ち】'||e.name,'combo_retest','文章から収集したガイルコンボを現行版で確定する。','advanced',15,ctx.character_id,
 '入力履歴、フレーム、ダメージ、Drive/SAを表示。Classic/Modern、中央/端、始動状態、立ち/しゃがみを指定。','ガードOFF、必要時に立ち/しゃがみを切替。','CPU OFF。',e.method,
 '左右各10回で成立、入力、ダメージ、ゲージ、終了F、距離、キャラ条件を記録。',20,'成立ならverified候補。不成立ならarchived。',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join e where not exists(select 1 from trainings t where t.slug='training-'||e.slug)
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,'combo',c.id from trainings t join combos c on t.slug='training-'||c.slug
where c.character_id=(select id from characters where slug='guile')
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Source inherited from related Guile combo.'
from trainings t join training_relations tr on tr.training_id=t.id and tr.related_type='combo'
join entity_sources es on es.entity_type='combo' and es.entity_id=tr.related_id
where t.player_character_id=(select id from characters where slug='guile')
on conflict(entity_type,entity_id,source_id) do nothing;

-- Recipe is intentionally absent: the written search result confirms the topic but not exact inputs.
with ctx as (
 select (select id from characters where slug='guile') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'guile-capture-stun-max-current','【撮影待ち】ガイル現行スタン最大コンボ','combo_discovery','2026.08.03版のスタン最大候補を実機で特定する。','advanced',30,ctx.character_id,
 '相手バーンアウト・端スタン。入力履歴、ダメージ、Drive/SA、コンボ数ON。候補を比較し最大値と安定版を別撮影。','スタン開始時のゲージ条件を固定。','CPU OFF。',
 'レシピは文章から断定しない。現行版で候補を比較して初めてComboへ登録する。','最大候補と実戦安定版を各左右5回完走し、全数値を記録。',10,
 '確定したレシピを新規Comboとして登録する。',ctx.patch_id,'unverified','strategy','draft'
from ctx where not exists(select 1 from trainings where slug='guile-capture-stun-max-current');

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.slug='guile-capture-stun-max-current' then 5 else 20 end,
 'ガイル現行版の成立確認。入力履歴・ダメージ・Drive/SA・位置・立ち/しゃがみ条件を撮影。'
from trainings t where t.player_character_id=(select id from characters where slug='guile')
 and (t.slug like 'training-guile-%' or t.slug='guile-capture-stun-max-current')
on conflict(training_id) do nothing;

update character_content_packages ccp set rollout_status='complete',
 notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Guile text/image-only strategy collection complete. Classic, Modern, SA2 and reusable beginner media captures tracked; video playback excluded.'),updated_at=now()
from characters c where c.id=ccp.character_id and c.slug='guile';
