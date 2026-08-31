-- Priority JP match inventory. No captions were available and the video
-- stream could not be inspected reliably, so no gameplay technique is inferred.

insert into videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
select v.slug,'youtube',v.external_id,v.title,'https://www.youtube.com/watch?v='||v.external_id,null::timestamptz,v.description,'match','draft'
from (values
 ('jp-match-takepi-act13-1','9KyFW6VVM1I','takepi (JP) Act.13 set','15:51; no captions; pixel analysis pending.'),
 ('jp-match-takepi-world1','-U_O_xe8bRI','世界1位JP takepi','17:38; no captions; pixel analysis pending.'),
 ('jp-match-kakeru-act13','mAr9mOLOSlI','翔 (JP) Act.13 set','14:00; no captions; pixel analysis pending.'),
 ('jp-match-kakeru-leshar-cc11','H6iIVzmBNlI','KAKERU (JP) vs LESHAR (Ed) CAPCOM CUP 11','8:55 official tournament; no captions; pixel analysis pending.'),
 ('jp-match-kakeru-highlight','ss38s32Cnh0','翔JP high-level set','10:07; no captions; pixel analysis pending.'),
 ('jp-match-takepi-act13-2','tQ-mORmXyyU','takepi (JP) vs Ed/Juri/Chun-Li','16:48; no captions; pixel analysis pending.'),
 ('jp-match-takepi-space-control','fpjzxH8M_hs','takepi JP 空間支配','9:23; no captions; pixel analysis pending.'),
 ('jp-match-hikaru-tokido','OrBW9Oii1PE','HIKARU (A.K.I.) vs TOKIDO (JP)','11:52; no captions; pixel analysis pending.'),
 ('jp-match-hikaru-taketake','2_LB6vUVP2M','HIKARU (A.K.I.) vs TAKETAKE-PIANO (JP)','19:17; no captions; pixel analysis pending.'),
 ('jp-match-hikaru-takepi','tj53BGoBdUI','HIKARU (A.K.I.) vs TAKEPI (JP)','13:07; no captions; pixel analysis pending.'),
 ('jp-match-hikaru-kakeru','newIPX7T1II','Hikaru (A.K.I.) vs Kakeru (JP)','7:12; no captions; pixel analysis pending.'),
 ('jp-match-year4-kakeru','lAlGhnoK4aI','Year4調整後 翔JP','11:38 current-patch candidate; no captions; pixel analysis pending.')
) v(slug,external_id,title,description)
where not exists(select 1 from videos x where x.external_id=v.external_id);

insert into entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,'analysis_backlog',200,
 'JP match-playlist priority backlog. No captions; do not infer combos/setups/sequences from title.'
from characters c cross join videos v
where c.slug='jp' and v.external_id in (
 '9KyFW6VVM1I','-U_O_xe8bRI','mAr9mOLOSlI','H6iIVzmBNlI','ss38s32Cnh0','tQ-mORmXyyU',
 'fpjzxH8M_hs','OrBW9Oii1PE','2_LB6vUVP2M','tj53BGoBdUI','newIPX7T1II','lAlGhnoK4aI')
and not exists(select 1 from entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);
