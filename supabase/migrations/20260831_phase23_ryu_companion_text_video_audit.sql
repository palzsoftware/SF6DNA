-- Ryu video-audit substitutes for YouTube streams that could not be rendered.
-- Each selected video has a same-author companion article that describes the
-- demonstrated inputs/conditions. This establishes content review, not
-- current-patch gameplay verification. All records remain draft.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
  ('YEAR3リュウ 実戦向けコンボとセットプレイ19選（動画対応記事）','https://punipunigame.com/sf6-ryu-year3-combo/','community_guide','ぷにらぼ','2025-09-30'::timestamptz,now(),'secondary','Same-author companion article for YouTube Webv4hwKRew. Inputs and conditions reviewed from text; video stream and current-patch reproduction remain pending.'),
  ('YEAR3リュウ とりこれコンボ5選（動画対応記事）','https://punipunigame.com/sf6-year3-ryu-torikore-combo/','community_guide','ぷにらぼ','2025-12-26'::timestamptz,now(),'secondary','Same-author companion article for YouTube ZQLuHVVdG-M. Inputs and conditions reviewed from text; current-patch reproduction remains pending.'),
  ('リュウの打ち返し対策（動画対応記事）','https://punipunigame.com/sf6-ryu-counter-attack-guide/','community_guide','ぷにらぼ','2026-01-24'::timestamptz,now(),'secondary','Same-author companion article for YouTube c98pgwqOz70. Pressure options and failure cases reviewed from text; current-patch reproduction remains pending.'),
  ('リュウのインパクト返し中央シミー（動画対応記事）','https://punipunigame.com/sf6-ryu-impact-return-shimmy/','community_guide','ぷにらぼ','2026-01-07'::timestamptz,now(),'secondary','Same-author companion article for YouTube L7s0xH48pLs. Recipe, +2F claim and character/position exceptions reviewed from text; current-patch reproduction remains pending.'),
  ('2026年対応リュウ コンボ・起き攻め完全ガイド（動画対応記事）','https://momiageryo.com/2026/07/21/sf6_ryu_master/','community_guide','カルコラ','2026-07-21'::timestamptz,now(),'secondary','Companion article for YouTube kWS3zqOINUU. Full route categories and okizeme descriptions reviewed from text; current-patch reproduction remains pending.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

insert into videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
select v.slug,'youtube',v.external_id,v.title,'https://www.youtube.com/watch?v='||v.external_id,v.published_at,v.description,v.video_type,'draft'
from (values
  ('ryu-video-year3-19-routes','Webv4hwKRew','YEAR3リュウ 実戦向けコンボとセットプレイ19選','2025-09-30'::timestamptz,'Content analyzed 2026-08-31 through the same-author companion article. Video pixels/timestamps and current-patch reproduction remain pending.','combo'),
  ('ryu-video-year3-torikore','ZQLuHVVdG-M','Evo France準優勝記念 リュウのとりこれコンボ5選','2025-12-26'::timestamptz,'Content analyzed 2026-08-31 through the same-author companion article. Video pixels/timestamps and current-patch reproduction remain pending.','combo'),
  ('ryu-video-counter-attack','c98pgwqOz70','リュウ 相手の暴れ・打ち返し行動対策','2026-01-24'::timestamptz,'Content analyzed 2026-08-31 through the same-author companion article. Video pixels/timestamps and current-patch reproduction remain pending.','guide'),
  ('ryu-video-impact-shimmy','L7s0xH48pLs','リュウ インパクト返し後の中央シミーセットプレイ','2026-01-07'::timestamptz,'Content analyzed 2026-08-31 through the same-author companion article. Video pixels/timestamps and current-patch reproduction remain pending.','guide'),
  ('ryu-video-2026-master-guide','kWS3zqOINUU','2026年対応 リュウ コンボ＆起き攻め完全ガイド','2026-07-21'::timestamptz,'Content analyzed 2026-08-31 through the companion article. Video pixels/timestamps and current-patch reproduction remain pending.','guide')
) v(slug,external_id,title,published_at,description,video_type)
where not exists(select 1 from videos x where x.external_id=v.external_id);

insert into entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,'content_analyzed',90,
       'Analyzed through a detailed companion text. Do not treat as pixel/timestamp review or verified gameplay.'
from characters c cross join videos v
where c.slug='ryu' and v.slug in (
  'ryu-video-year3-19-routes','ryu-video-year3-torikore','ryu-video-counter-attack',
  'ryu-video-impact-shimmy','ryu-video-2026-master-guide'
)
and not exists(select 1 from entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);

update entity_videos ev
set relationship='content_analyzed',
    note='Analyzed from the detailed companion write-up and chapters; video pixels/timestamps still pending.'
from videos v, characters c
where ev.video_id=v.id and ev.entity_type='character' and ev.entity_id=c.id
  and c.slug='ryu' and v.slug='ryu-video-shuto-setplay';

update videos
set description='Companion write-up and chapters analyzed 2026-08-31. Video has no captions; pixel/timestamp review and current-patch reproduction remain pending.'
where slug='ryu-video-shuto-setplay';

-- This guide already existed under its canonical slug before this audit.
update entity_videos ev
set relationship='content_analyzed',
    note='Detailed companion article reviewed 2026-08-31; video pixels/timestamps and current-patch reproduction remain pending.'
from videos v, characters c
where ev.video_id=v.id and ev.entity_type='character' and ev.entity_id=c.id
  and c.slug='ryu' and v.external_id='kWS3zqOINUU';

update entity_videos ev
set relationship='content_analyzed',
    note='Auto-caption transcript reviewed with timestamps; displayed inputs and current-patch reproduction remain pending.'
from videos v, characters c
where ev.video_id=v.id and ev.entity_type='character' and ev.entity_id=c.id
  and c.slug='ryu' and v.slug='ryu-video-season3-ultimate';
