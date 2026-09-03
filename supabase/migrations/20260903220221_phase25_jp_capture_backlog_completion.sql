-- Complete JP's text/image-only collection workflow by connecting every
-- concrete unverified Combo, Setup, and core Sequence to one capture task.
-- Existing video-topic tasks remain separate. No video playback is performed.

with ctx as (
 select (select id from characters where slug='jp') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), entities as (
 select 'combo' related_type,id,slug,name,notation method
 from combos where character_id=(select character_id from ctx)
 and slug not like 'jp-video-%'
 union all
 select 'setup',id,slug,name,starter_condition||' > '||sequence_text
 from setups where character_id=(select character_id from ctx)
 union all
 select 'sequence',id,slug,name,sequence_text
 from sequences where character_id=(select character_id from ctx)
 and slug not like 'jp-video-%'
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【JP最終撮影待ち】'||e.name,
 case when e.related_type='combo' then 'combo_retest' when e.related_type='setup' then 'oki_retest' else 'pressure_retest' end,
 '文章・画像から登録済みのJP攻略を現行版の撮影で確定する。','advanced',15,ctx.character_id,
 '入力履歴・フレーム・ダメージ・Drive/SAを表示し、中央/端、通常/CH/PC、受け身、設置状態を指定して撮影する。',
 '対象項目の条件を再現。SA2・ヴィーハトは設置前から結果まで収録。','CPU OFF。',e.method,
 '左右各10回で成立、ダメージ、ゲージ、終了F、距離、受け身、キャラ差を記録する。',20,
 '成立ならverified候補。不成立・旧版ならrejectedまたはarchivedへ。',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join entities e
where not exists(select 1 from trainings t where t.slug='training-'||e.slug)
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.related_type,e.id
from trainings t join (
 select 'combo' related_type,id,slug from combos where character_id=(select id from characters where slug='jp') and slug not like 'jp-video-%'
 union all
 select 'setup',id,slug from setups where character_id=(select id from characters where slug='jp')
 union all
 select 'sequence',id,slug from sequences where character_id=(select id from characters where slug='jp') and slug not like 'jp-video-%'
) e on t.slug='training-'||e.slug
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Source inherited from the related JP strategy entity.'
from trainings t
join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.player_character_id=(select id from characters where slug='jp')
and t.slug like 'training-jp-%'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case
  when t.name ilike '%SA2%' or t.name ilike '%SA3%' then 20
  when t.training_type='combo_retest' then 35
  when t.training_type='oki_retest' then 30
  else 45
 end,
 'JP文章・画像収集完了時の撮影対象。現行成立、入力、ダメージ、ゲージ、終了F、設置・受け身条件を確認する。'
from trainings t
where t.player_character_id=(select id from characters where slug='jp')
and t.slug like 'training-jp-%'
and t.training_type in ('combo_retest','oki_retest','pressure_retest')
on conflict(training_id) do nothing;

update character_content_packages ccp
set rollout_status='complete',
 notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: JP text/image-only strategy collection complete. All concrete unverified Combo/Setup/core Sequence items are linked to capture_backlog; video playback excluded.'),
 updated_at=now()
from characters c where c.id=ccp.character_id and c.slug='jp';
