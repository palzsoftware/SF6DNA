-- JP playlist audit: chapter/description-first extraction from the user's
-- guide and match playlists. No video-pixel or device verification was
-- available, so all technical claims remain unverified legacy candidates.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('スト6 JP 解説（ユーザー再生リスト）','https://www.youtube.com/playlist?list=PL8nHRbufVk06ad3OuKBPELb8w_pRWWlYc','video_playlist','マグロ食べたい',null::timestamptz,now(),'secondary','Playlist inventoried 2026-08-31: 121 listed, 119 accessible. Analyze chapter/description evidence before pixel review.'),
 ('スト6 JP 対戦（ユーザー再生リスト）','https://www.youtube.com/playlist?list=PL8nHRbufVk05nd8jJIdnixIpBWsUYf4At','video_playlist','マグロ食べたい',null::timestamptz,now(),'secondary','Playlist inventoried 2026-08-31: 83 accessible match videos. Do not infer techniques from titles.'),
 ('JP 強行動10選 調整後','https://www.youtube.com/watch?v=LLmtz9M313g','video','レイ / Ray',null::timestamptz,now(),'secondary','No captions. Chapters reviewed 2026-08-31: 0:00 OD設置F式; 0:17 OD設置引中P; 0:45 OD設置トリグラフ; 1:18 通常設置ワープ; 1:33 OD弾通常設置投げ; 1:52 スタン設置投げ; 2:19 OD弾SA2; 2:43 立強P弱弾; 2:49 立強P弱弾フェイント; 3:19 対空OD設置ワープ. Inputs and outcomes require visual/device review.'),
 ('JP 天才武器商人の革命的な新連携','https://www.youtube.com/watch?v=6fIBrUEaMyQ','video','りゅうせい',null::timestamptz,now(),'secondary','No captions. Chapters identify new sequences at 0:19 and 3:52; exact actions require visual review.'),
 ('JP 細かい大幅強化点','https://www.youtube.com/watch?v=iOym8ksu_p4','video','りゅうせい',null::timestamptz,now(),'secondary','No captions. Chapters: 0:17 important buff; 3:29 intended use; 6:20 viability; 7:31 ODトリグラフ adjustment. Exact claims require visual/device review.'),
 ('JP ODアムネジアから完全2択の表裏','https://www.youtube.com/watch?v=CeomQNcmWv4','video','りゅうせい',null::timestamptz,now(),'secondary','No captions. Chapters: 0:19 side-switch mix; 0:58 match example; 2:27 route summary; 4:56 decision tree. 2026-08-03 throw-catch recovery change requires current-patch retest.'),
 ('JP 最新ラヴーシュカ連携','https://www.youtube.com/watch?v=NZrj9JDx4K4','video','ACQUA',null::timestamptz,now(),'secondary','No captions or chapters. Title/description only; no input inferred.'),
 ('JP 最新版完全解説・新コンボ','https://www.youtube.com/watch?v=Dmd_zhtkQzM','video','勇者きょーすけ',null::timestamptz,now(),'secondary','No captions or chapters. Title/description only; no input inferred.'),
 ('JP Year3コンボ＆セットプレイ完全版','https://www.youtube.com/watch?v=x5FrEpiVY2c','video','なんでねー',null::timestamptz,now(),'secondary','No captions. Detailed chapters reviewed: lights 0:26; mediums 2:03; heavies 4:39; Vihhat 6:39; DI 7:36; stun 8:35; Amnesia 9:10; SA2 9:27/11:29; anti-air 12:33; jump-in 13:00; normal Vihhat setups 13:54; OD Vihhat setups 16:02. Displayed inputs/damage require visual review.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

insert into videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
select v.slug,'youtube',v.external_id,v.title,'https://www.youtube.com/watch?v='||v.external_id,null::timestamptz,v.description,v.video_type,'draft'
from (values
 ('jp-video-strong-actions-10','LLmtz9M313g','JP 強行動10選 調整後','Chapter structure analyzed; no captions/pixels.','guide'),
 ('jp-video-weapon-merchant-tech','6fIBrUEaMyQ','JP 天才武器商人の革命的な新連携','Two chapter blocks identified; exact actions pending visual review.','guide'),
 ('jp-video-small-buffs','iOym8ksu_p4','JP 細かい大幅強化点','Four chapter blocks identified; exact claims pending visual review.','guide'),
 ('jp-video-amnesia-side-mix','CeomQNcmWv4','JP ODアムネジアから完全2択の表裏','Route-summary and decision-tree timestamps identified; current-patch retest required.','guide'),
 ('jp-video-lovushka-current','NZrj9JDx4K4','JP 最新ラヴーシュカ連携','No captions or chapters; analysis backlog.','guide'),
 ('jp-video-current-complete-guide','Dmd_zhtkQzM','JP 最新版完全解説・新コンボ','No captions or chapters; analysis backlog.','guide'),
 ('jp-video-year3-combo-setup','x5FrEpiVY2c','JP Year3コンボ＆セットプレイ完全版','Detailed category chapters identified; displayed recipes pending visual review.','combo')
) v(slug,external_id,title,description,video_type)
where not exists(select 1 from videos x where x.external_id=v.external_id);

insert into entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,
 case when v.external_id in ('LLmtz9M313g','x5FrEpiVY2c') then 'chapter_analyzed' else 'analysis_backlog' end,
 100,'JP playlist audit. Chapter evidence is not pixel or device verification.'
from characters c cross join videos v
where c.slug='jp' and v.external_id in ('LLmtz9M313g','6fIBrUEaMyQ','iOym8ksu_p4','CeomQNcmWv4','NZrj9JDx4K4','Dmd_zhtkQzM','x5FrEpiVY2c')
and not exists(select 1 from entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);

with ctx as (
 select (select id from characters where slug='jp') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,sequence_type,sequence_text,notes) as (values
 ('jp-video-od-vihhat-fshiki','OD設置F式候補','setup_pressure','ODヴィーハト設置 ＞ F式候補','チャプター0:00。字幕では内容を確認できたが、入力は映像確認が必要。F式の始動・打撃・対応キャラは未確認。'),
 ('jp-video-od-vihhat-back-mp','OD設置→引き中P候補','setup_pressure','ODヴィーハト設置 ＞ 引き中P','チャプター0:17。設置起動タイミング、連ガ・暴れ潰し・相打ちは映像/実機確認待ち。'),
 ('jp-video-od-vihhat-triglav','OD設置→トリグラフ候補','setup_pressure','ODヴィーハト設置 ＞ トリグラフ','チャプター0:45。トリグラフ強度・設置起動順・対応行動は映像/実機確認待ち。'),
 ('jp-video-od-orb-vihhat-throw','OD弾→通常設置→投げ候補','throw_setup','ODトルバラン候補 ＞ 通常ヴィーハト設置 ＞ 投げ','チャプター1:33。OD弾の強度、距離、投げまでの隙間は映像/実機確認待ち。'),
 ('jp-video-stun-vihhat-throw','スタン→設置→投げ候補','stun_sequence','スタン ＞ ヴィーハト設置 ＞ 投げ','チャプター1:52。スタン始動後の具体入力と投げ成立条件は映像/実機確認待ち。'),
 ('jp-video-od-orb-sa2','OD弾→SA2候補','sa2_sequence','ODトルバラン候補 ＞ SA2 ラヴーシュカ','チャプター2:19。弾強度、発動タイミング、連続ガード/コンボ/崩しの区分は映像/実機確認待ち。'),
 ('jp-video-hp-light-orb-feint','立ち強P→弱弾／フェイント択','frame_trap','立ち強P ＞ 弱トルバラン または フェイント','チャプター2:43と2:49。弱弾とフェイントの分岐。隙間、DI/パリィ/無敵への相性は映像/実機確認待ち。'),
 ('jp-video-aa-od-vihhat-warp','対空→OD設置→ワープ候補','anti_air_setup','対空 ＞ ODヴィーハト設置 ＞ ヴィーハト・アクノ','チャプター3:19。対空技、ワープ方向、表裏、追撃入力は映像/実機確認待ち。')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.sequence_type,r.sequence_text,false,r.notes,ctx.patch_id,'unverified','legacy_candidate','draft'
from rows r cross join ctx on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',q.id,s.id,'supporting','Chapter timestamp evidence only; input and current-patch outcome require visual/device verification.'
from sequences q cross join sources s
where q.slug like 'jp-video-%' and s.url='https://www.youtube.com/watch?v=LLmtz9M313g'
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='jp') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||q.slug,'【動画チャプター候補確認】'||q.name,'video_candidate_retest','JP動画のチャプター候補を現行版で再現し、入力と成立条件を確定する。','advanced',12,ctx.character_id,
 '相手の4F、投げ、ジャンプ、DI、パリィ、Dリバ、無敵を個別に記録する。','入力履歴・フレーム表示・ダメージ・ゲージON。通常受け身/後方受け身を分ける。','CPU OFF。',q.sequence_text,
 '左右各10回で始動、位置、ゲージ、成立/不成立、負ける選択肢を記録する。',20,'映像または実機で確認できた項目だけ個別にreviewedへ昇格する。',ctx.patch_id,'unverified','legacy_candidate','draft'
from sequences q cross join ctx where q.character_id=ctx.character_id and q.slug like 'jp-video-%'
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,'sequence',q.id from trainings t join sequences q on t.slug='training-'||q.slug
where q.slug like 'jp-video-%'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Chapter timestamp evidence only; current-patch reproduction pending.'
from trainings t cross join sources s
where t.slug like 'training-jp-video-%' and s.url='https://www.youtube.com/watch?v=LLmtz9M313g'
on conflict(entity_type,entity_id,source_id) do nothing;

update character_content_packages p set rollout_status='in_progress',video_status='in_progress',source_status='in_progress',updated_at=now()
from characters c where p.character_id=c.id and c.slug='jp';
