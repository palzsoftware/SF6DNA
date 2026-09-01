-- JP SA2 / Amnesia / specialist setplay chapter audit.
-- Videos without captions or actionable chapters are kept as analysis backlog.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('JP SA2中央限定運び・起き攻め','https://www.youtube.com/watch?v=TppoRqFmaVE','video','JP攻略動画',null::timestamptz,now(),'secondary','No captions or chapters. Title confirms a midscreen SA2 carry/oki topic; exact recipe not inferred.'),
 ('JP SA2補正切り5000ダメージ','https://www.youtube.com/watch?v=3hHac9ko9nY','video','JP攻略動画',null::timestamptz,now(),'secondary','No captions or chapters. Title claims a 5000-damage SA2 reset; input and damage are not treated as verified.'),
 ('JP アムネジア後のとりこれ','https://www.youtube.com/watch?v=LqRP3AUT8Dw','video','ぽてんす',null::timestamptz,now(),'secondary','No captions or chapters; description recommends pausing. Exact on-screen route requires pixel/device review, especially after 2026-08-03 Amnesia recovery change.'),
 ('JP SA2確定ガー不連携の再評価','https://www.youtube.com/watch?v=hXb9uM0bOco','video','りゅうせい',null::timestamptz,now(),'secondary','No captions. Chapters: SA2 guard-unblockable discussion 0:30; issue/limitation 4:41; light starter 5:52; medium starter test 8:57; Drive recovery 10:58. Exact route and current-patch validity require visual/device review.'),
 ('JP 墓場連携の実戦検証','https://www.youtube.com/watch?v=ClMfY6szcUc','video','JP攻略動画',null::timestamptz,now(),'secondary','No captions or chapters. Description names 墓場連携 but gives no actionable recipe; no input inferred.'),
 ('JP 武器商人新セットプレイ・投げ抜け注意','https://www.youtube.com/watch?v=zfoUNpRa20Y','video','りゅうせい',null::timestamptz,now(),'secondary','No captions. Chapters: new sequence 0:17; throw-tech-whiff case and cautions 5:09. Exact input/outcome require visual/device review.'),
 ('JP システム対抗セットプレイ・ジャスパ分岐','https://www.youtube.com/watch?v=RPQg5ZnqTqo','video','りゅうせい',null::timestamptz,now(),'secondary','No captions. Chapters: setup 0:27; perfect-parry branch research 4:04. Exact input/outcome require visual/device review.'),
 ('JP 武器商人お年玉セットプレイ・派生コンボ','https://www.youtube.com/watch?v=6EvRH7Su0Wg','video','りゅうせい',null::timestamptz,now(),'secondary','No captions. Chapters: setup 0:19; extended combo 10:17. Exact input/damage require visual/device review.'),
 ('JP 武器商人の実戦連携','https://www.youtube.com/watch?v=GgrWC9HkRPk','video','りゅうせい',null::timestamptz,now(),'secondary','No captions or chapters. Title only; no input inferred.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

insert into videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
select v.slug,'youtube',v.external_id,v.title,'https://www.youtube.com/watch?v='||v.external_id,null::timestamptz,v.description,v.video_type,'draft'
from (values
 ('jp-video-sa2-midscreen-carry','TppoRqFmaVE','JP SA2中央限定運び・起き攻め','No captions/chapters; displayed recipe pending.','combo'),
 ('jp-video-sa2-reset-5000','3hHac9ko9nY','JP SA2補正切り5000ダメージ','No captions/chapters; damage/input unverified.','combo'),
 ('jp-video-amnesia-torikore','LqRP3AUT8Dw','JP アムネジア後のとりこれ','No captions/chapters; current-patch visual/device retest required.','guide'),
 ('jp-video-sa2-unblockable','hXb9uM0bOco','JP SA2確定ガー不連携の再評価','Starter-specific and Drive-recovery chapters reviewed; exact route pending.','guide'),
 ('jp-video-graveyard-practical','ClMfY6szcUc','JP 墓場連携の実戦検証','No captions/chapters; no recipe inferred.','guide'),
 ('jp-video-merchant-throwtech','zfoUNpRa20Y','JP 武器商人新セットプレイ・投げ抜け注意','Two technical chapter blocks reviewed; exact input pending.','guide'),
 ('jp-video-system-setplay-parry','RPQg5ZnqTqo','JP システム対抗セットプレイ・ジャスパ分岐','Setup and perfect-parry chapter blocks reviewed; exact input pending.','guide'),
 ('jp-video-newyear-setplay','6EvRH7Su0Wg','JP 武器商人お年玉セットプレイ・派生コンボ','Setup and extended-combo chapter blocks reviewed; exact input pending.','guide'),
 ('jp-video-merchant-practical-link','GgrWC9HkRPk','JP 武器商人の実戦連携','No captions/chapters; no recipe inferred.','guide')
) v(slug,external_id,title,description,video_type)
where not exists(select 1 from videos x where x.external_id=v.external_id);

insert into entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,
 case when v.external_id in ('hXb9uM0bOco','zfoUNpRa20Y','RPQg5ZnqTqo','6EvRH7Su0Wg') then 'chapter_analyzed' else 'analysis_backlog' end,
 130,'JP specialist-video audit. No pixel or device verification.'
from characters c cross join videos v
where c.slug='jp' and v.external_id in ('TppoRqFmaVE','3hHac9ko9nY','LqRP3AUT8Dw','hXb9uM0bOco','ClMfY6szcUc','zfoUNpRa20Y','RPQg5ZnqTqo','6EvRH7Su0Wg','GgrWC9HkRPk')
and not exists(select 1 from entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);

with ctx as (
 select (select id from characters where slug='jp') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,'jp-video-sa2-unblockable-starters','SA2後ガード困難連携・始動別候補','sa2_sequence',
 '小技または中攻撃始動 ＞ SA2 ラヴーシュカ ＞ ガード困難連携候補',false,
 'チャプター0:30、5:52、8:57、10:58。小技/中攻撃で成立条件が異なる可能性とDrive回収分岐。字幕では内容を確認できたが、入力は映像確認が必要。現行版で連ガ・補正切り・防御手段を再検証する。',
 ctx.patch_id,'unverified','legacy_candidate','draft'
from ctx on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',q.id,s.id,'supporting','Chapter timestamp evidence only; exact input and current-patch result require visual/device verification.'
from sequences q cross join sources s
where q.slug='jp-video-sa2-unblockable-starters' and s.url='https://www.youtube.com/watch?v=hXb9uM0bOco'
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='jp') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-jp-video-sa2-unblockable-starters','【動画チャプター候補確認】SA2後ガード困難連携・始動別','video_candidate_retest','小技/中攻撃始動ごとのSA2連携を現行版で分離検証する。','advanced',20,ctx.character_id,
 '小技始動と中攻撃始動を別スロットに記録し、通常ガード、パリィ、ジャスパ、DI、Dリバ、無敵、SAを設定する。','入力履歴・フレーム・Drive/SA・ダメージON。中央/端を分ける。','CPU OFF。',q.sequence_text,
 '各始動で左右10回。連ガ、補正切り、回避可能方向、Drive回収、確定反撃を記録する。',20,'成立条件と入力が確定した場合だけ個別レシピへ分割する。',ctx.patch_id,'unverified','legacy_candidate','draft'
from sequences q cross join ctx where q.slug='jp-video-sa2-unblockable-starters'
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,'sequence',q.id from trainings t join sequences q on q.slug='jp-video-sa2-unblockable-starters'
where t.slug='training-jp-video-sa2-unblockable-starters'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Chapter timestamp evidence; current-patch reproduction pending.'
from trainings t cross join sources s
where t.slug='training-jp-video-sa2-unblockable-starters' and s.url='https://www.youtube.com/watch?v=hXb9uM0bOco'
on conflict(entity_type,entity_id,source_id) do nothing;
