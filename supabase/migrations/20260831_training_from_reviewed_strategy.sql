-- Phase23: expose reviewed combo/setup/sequence content as concrete Training drills.
-- This migration does not publish or verify anything. It only mirrors existing reviewed draft strategy into draft/reviewed training rows.

insert into trainings (
  slug,name,training_type,purpose,level,duration_minutes,player_character_id,
  method,success_criteria,recommended_reps,next_step,
  valid_from_patch_id,verification_status,content_kind,status
)
select
  'practice-combo-' || cb.slug,
  '【コンボ】' || cb.name,
  case when coalesce(cb.position,'') ilike '%corner%' or coalesce(cb.combo_type,'') ilike '%corner%' then 'corner_combo' else 'combo' end,
  coalesce(nullif(cb.purpose,''),'既存reviewedコンボを同じ始動条件で安定して完走する'),
  case when coalesce(cb.difficulty,3) <= 2 then 'beginner' when coalesce(cb.difficulty,3) <= 4 then 'intermediate' else 'advanced' end,
  10,
  cb.character_id,
  cb.notation,
  '同じ始動・位置・ゲージ条件で10回中8回以上、最後まで完走する。',
  20,
  '安定後はヒット確認、位置違い、ゲージ量違いでも適切なルートへ切り替える。',
  cb.valid_from_patch_id,
  'reviewed','training','draft'
from combos cb
where cb.status='draft' and cb.verification_status='reviewed'
  and coalesce(cb.notation,'') <> ''
on conflict (slug) do nothing;

insert into trainings (
  slug,name,training_type,purpose,level,duration_minutes,player_character_id,
  method,success_criteria,recommended_reps,next_step,
  valid_from_patch_id,verification_status,content_kind,status
)
select
  'practice-setup-' || st.slug,
  '【セットプレイ】' || st.name,
  case when coalesce(st.setup_type,'') ilike '%safe%' then 'safe_jump'
       when coalesce(st.setup_type,'') ilike '%meaty%' then 'oki_meaty'
       else 'setup' end,
  coalesce(nullif(st.description,''),nullif(st.starter_condition,''),'既存reviewedセットプレイを同じダウン状況から再現する'),
  'intermediate',10,st.character_id,
  concat_ws(' / ',nullif(st.starter_condition,''),nullif(st.sequence_text,'')),
  '同じ開始条件から10回中8回以上、狙った重ね・位置・有利状況を再現する。',
  20,
  '安定後は相手の最速4F、投げ、無敵技、後方受け身を録画して成立条件を切り分ける。',
  st.valid_from_patch_id,
  'reviewed','training','draft'
from setups st
where st.status='draft' and st.verification_status='reviewed'
  and coalesce(st.sequence_text,'') <> ''
on conflict (slug) do nothing;

insert into trainings (
  slug,name,training_type,purpose,level,duration_minutes,player_character_id,
  recording_instructions,playback_settings,method,success_criteria,recommended_reps,next_step,
  valid_from_patch_id,verification_status,content_kind,status
)
select
  'practice-sequence-' || se.slug,
  '【連携】' || se.name,
  'pressure',
  '既存reviewed連携を、確定連携と読み合いを区別しながら反復する。',
  'intermediate',10,se.character_id,
  concat_ws(' / ',nullif(se.mash_point,''),nullif(se.throw_point,''),nullif(se.shimmy_point,'')),
  '通常ガード、4F暴れ、投げ、ジャンプ、パリィ、Dリバ、無敵技を必要に応じてランダム再生する。',
  se.sequence_text,
  '20回のランダム再生で、相手の防御行動に対して連携を出し切る場面と止める場面を区別する。',
  20,
  '成立しない相手行動が見つかった場合は、その行動専用の対策Trainingへ分離する。',
  se.valid_from_patch_id,
  'reviewed','training','draft'
from sequences se
where se.status='draft' and se.verification_status='reviewed'
  and coalesce(se.sequence_text,'') <> ''
on conflict (slug) do nothing;

-- Copy the original evidence links to each mirrored Training row.
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',tr.id,es.source_id,es.relationship,
       concat('Mirrored from combo: ',cb.slug,case when es.note is null then '' else ' / '||es.note end)
from combos cb
join trainings tr on tr.slug='practice-combo-'||cb.slug
join entity_sources es on es.entity_type='combo' and es.entity_id=cb.id
where cb.status='draft' and cb.verification_status='reviewed'
on conflict (entity_type,entity_id,source_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',tr.id,es.source_id,es.relationship,
       concat('Mirrored from setup: ',st.slug,case when es.note is null then '' else ' / '||es.note end)
from setups st
join trainings tr on tr.slug='practice-setup-'||st.slug
join entity_sources es on es.entity_type='setup' and es.entity_id=st.id
where st.status='draft' and st.verification_status='reviewed'
on conflict (entity_type,entity_id,source_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',tr.id,es.source_id,es.relationship,
       concat('Mirrored from sequence: ',se.slug,case when es.note is null then '' else ' / '||es.note end)
from sequences se
join trainings tr on tr.slug='practice-sequence-'||se.slug
join entity_sources es on es.entity_type='sequence' and es.entity_id=se.id
where se.status='draft' and se.verification_status='reviewed'
on conflict (entity_type,entity_id,source_id) do nothing;
