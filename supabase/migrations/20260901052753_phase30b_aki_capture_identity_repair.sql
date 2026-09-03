-- Split the Modern DR-overhead combo and oki capture identities.
update setups
set slug='aki-y4-modern-dr-overhead-oki'
where slug='aki-y4-modern-dr-overhead';

insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-aki-y4-modern-dr-overhead-oki','【A.K.I.撮影待ち】Mラッシュ中段起き攻め','oki_retest',
 '文章・画像から収集した攻略の現行成立を確定する。','advanced',15,c.id,
 '入力履歴・フレーム・ダメージ・Drive/SA・毒状態を表示。操作、位置、受け身、CH/PC、強度を指定。',
 '4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',
 'Modern knockdown > DR 3M > Assist M/H route',
 '左右各10回で成立、数値、位置、受け身、毒付与・破裂、簡易補正、キャラ条件を記録。',20,
 '成立ならverified候補。不成立ならarchived。',p.id,'unverified','modern_only','draft'
from characters c cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
where c.slug='aki' on conflict(slug) do nothing;

delete from training_relations
where training_id=(select id from trainings where slug='training-aki-y4-modern-dr-overhead')
and related_type='setup'
and related_id=(select id from setups where slug='aki-y4-modern-dr-overhead-oki');

insert into training_relations(training_id,related_type,related_id)
select t.id,'setup',s.id from trainings t cross join setups s
where t.slug='training-aki-y4-modern-dr-overhead-oki' and s.slug='aki-y4-modern-dr-overhead-oki'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related setup.'
from trainings t join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.slug='training-aki-y4-modern-dr-overhead-oki'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',30,
 '2026-08-03版の成立、入力、数値、位置、受け身、毒付与・破裂、技強度、簡易補正、Classic/Modern差を確認。'
from trainings t where t.slug='training-aki-y4-modern-dr-overhead-oki'
on conflict(training_id) do nothing;
