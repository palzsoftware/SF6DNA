-- Official current-patch JP match backlog from CEO / Capcom Pro Tour 2026.
-- The cloud player exposed readyState=0 and zero video dimensions, so no
-- combo, setup or sequence is inferred from titles or descriptions.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('CEO 2026 Grand Final Booce_Lee Terry vs Tokido JP','https://www.youtube.com/watch?v=WEsKeYBCqc4','video','Capcom Fighters','2026-08-17'::timestamptz,now(),'primary','Official Capcom Pro Tour match. No creator chapters. Playback unavailable in cloud session; round-level combo/setplay extraction pending.'),
 ('CEO 2026 Top 8 Tokido JP vs Micky Mai','https://www.youtube.com/watch?v=uPrVOCsysRc','video','Capcom Fighters','2026-08-29'::timestamptz,now(),'primary','Official Capcom Pro Tour match. No actionable creator chapters. Playback unavailable; round-level extraction pending.'),
 ('CEO 2026 Top 8 Kilzyou Mai vs Tokido JP','https://www.youtube.com/watch?v=3wP0NtK1ngI','video','Capcom Fighters','2026-08-29'::timestamptz,now(),'primary','Official Capcom Pro Tour match. No actionable creator chapters. Playback unavailable; round-level extraction pending.'),
 ('CEO 2026 Top 8 Booce_Lee Terry vs Tokido JP','https://www.youtube.com/watch?v=OkDDXmNFhwY','video','Capcom Fighters','2026-08-29'::timestamptz,now(),'primary','Official Capcom Pro Tour match. No actionable creator chapters. Playback unavailable; round-level extraction pending.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

insert into videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
select v.slug,'youtube',v.external_id,v.title,'https://www.youtube.com/watch?v='||v.external_id,v.published_at::timestamptz,v.description,'match','draft'
from (values
 ('jp-video-ceo2026-gf-tokido-booce','WEsKeYBCqc4','CEO 2026 Grand Final Booce_Lee (Terry) vs Tokido (JP)','2026-08-17','Official current-patch grand final. Visual analysis pending.'),
 ('jp-video-ceo2026-top8-tokido-micky','uPrVOCsysRc','CEO 2026 Top 8 Tokido (JP) vs Micky (Mai)','2026-08-29','Official current-patch Top 8 match. Visual analysis pending.'),
 ('jp-video-ceo2026-top8-kilzyou-tokido','3wP0NtK1ngI','CEO 2026 Top 8 Kilzyou (Mai) vs Tokido (JP)','2026-08-29','Official current-patch Top 8 match. Visual analysis pending.'),
 ('jp-video-ceo2026-top8-booce-tokido','OkDDXmNFhwY','CEO 2026 Top 8 Booce_Lee (Terry) vs Tokido (JP)','2026-08-29','Official current-patch Top 8 match. Visual analysis pending.')
) v(slug,external_id,title,published_at,description)
where not exists(select 1 from videos x where x.external_id=v.external_id);

insert into entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,'analysis_backlog',160,
 'Official current-patch tournament match. Player/opponent/event verified; gameplay extraction pending because the player did not load.'
from characters c cross join videos v
where c.slug='jp' and v.external_id in ('WEsKeYBCqc4','uPrVOCsysRc','3wP0NtK1ngI','OkDDXmNFhwY')
and not exists(select 1 from entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);
