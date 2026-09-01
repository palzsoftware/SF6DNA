-- JP short-form specialist videos. A two-second playback probe remained at
-- 0:00 with a black player, so no on-screen input is inferred.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('JP インパクト返し不可・しゃがみ対応セットプレイ','https://www.youtube.com/watch?v=A28Hs4CPas0','video','JP short guide',null::timestamptz,now(),'secondary','No captions/chapters. Title identifies the setup topic; exact starter/input/outcome require pixel/device review.'),
 ('JP 壁張り付き限定コンボ','https://www.youtube.com/watch?v=wLGt1cusFT0','video','JP short guide',null::timestamptz,now(),'secondary','No captions/chapters. Title identifies a wall-splat-specific combo; exact recipe requires pixel/device review.'),
 ('JP 画面端コンボ①','https://www.youtube.com/watch?v=6wwRIdUyDNM','video','JP short guide',null::timestamptz,now(),'secondary','No captions/chapters. Description claims a Triglav-to-2LP standing/crouching confirm idea with uncertainty; no recipe or fact inferred.'),
 ('JP ODアムネジア投げ取得・入れ替えコンボ','https://www.youtube.com/watch?v=OIQsvoI6WGc','video','inaGuile@攻めガイル',null::timestamptz,now(),'secondary','9-second video; no captions/chapters. Playback probe on 2026-09-01 stayed black at 0:00. Exact recipe requires pixel/device review and current-patch Amnesia retest.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

insert into videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
select v.slug,'youtube',v.external_id,v.title,'https://www.youtube.com/watch?v='||v.external_id,null::timestamptz,v.description,v.video_type,'draft'
from (values
 ('jp-video-di-proof-crouch-setplay','A28Hs4CPas0','JP インパクト返し不可・しゃがみ対応セットプレイ','No captions/chapters; displayed recipe pending pixel/device review.','guide'),
 ('jp-video-wall-splat-short','wLGt1cusFT0','JP 壁張り付き限定コンボ','No captions/chapters; displayed recipe pending pixel/device review.','combo'),
 ('jp-video-corner-combo-1','6wwRIdUyDNM','JP 画面端コンボ①','Description contains an uncertain confirm idea; no recipe inferred.','combo'),
 ('jp-video-amnesia-throw-side-switch','OIQsvoI6WGc','JP ODアムネジア投げ取得・入れ替えコンボ','Black player at 0:00 during short playback probe; current-patch recipe pending.','combo')
) v(slug,external_id,title,description,video_type)
where not exists(select 1 from videos x where x.external_id=v.external_id);

insert into entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,'analysis_backlog',140,
 'JP short-video backlog. No captions; exact on-screen input must not be inferred.'
from characters c cross join videos v
where c.slug='jp' and v.external_id in ('A28Hs4CPas0','wLGt1cusFT0','6wwRIdUyDNM','OIQsvoI6WGc')
and not exists(select 1 from entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);
