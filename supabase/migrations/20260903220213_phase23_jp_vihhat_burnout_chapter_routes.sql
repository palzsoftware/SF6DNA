-- Third JP chapter audit: Vihhat, burnout pressure and pseudo-frame-kill
-- inventory. Chapter labels are evidence for topics/timestamps only; exact
-- inputs, gaps and outcomes remain visual/device-unverified.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('JPで勝つためのコンボ・起き攻め集','https://www.youtube.com/watch?v=D0gf1YooclQ','video','JP攻略動画',null::timestamptz,now(),'secondary','No captions. Chapters: combos 0:00; SA2 combo/guard mix 5:54; corner 5HP combo/setup 8:06; okizeme 11:10. Displayed inputs require visual/device review.'),
 ('JP 2026年3月17日調整セットプレイ解説','https://www.youtube.com/watch?v=zpeWJ8ioB_Y','video','JP攻略動画',null::timestamptz,now(),'secondary','No captions or chapters. Old-patch setup guide; no recipe inferred.'),
 ('JP Year3コンボ・ラヴーシュカ講座','https://www.youtube.com/watch?v=1CGk90HKR2o','video','ACQUA',null::timestamptz,now(),'secondary','No captions or chapters. Old-patch guide; no recipe inferred.'),
 ('JP ヴィーハト講座','https://www.youtube.com/watch?v=GfRhgq355UE','video','JP攻略動画',null::timestamptz,now(),'secondary','No captions. Chapters: weak 0:00; medium 1:17; heavy 3:56; details 7:08; hit conversion 9:04; approach after setup 15:21; 5HK combo 18:17. Displayed inputs require visual/device review.'),
 ('JP 無限設置・ゲージ管理','https://www.youtube.com/watch?v=rV9OeCyILYA','video','なんでねー',null::timestamptz,now(),'secondary','No captions. Chapters: concept 0:21; pseudo-frame-kills 1:49, 3:12, 3:48; match examples 4:31. Exact frame-kill inputs require visual/device review.'),
 ('JP 画面端セットプレイ3選','https://www.youtube.com/watch?v=CyTwrrgrbQg','video','JP攻略動画',null::timestamptz,now(),'secondary','No captions or chapters; video states leverless input history is shown. Exact recipes require visual review.'),
 ('JPセットプレイ3種と対応','https://www.youtube.com/watch?v=KMrV_6C9Huw','video','JP対策動画',null::timestamptz,now(),'secondary','No captions. Chapters: Triglav→OD Vihhat 0:12; 5HP→Vihhat 2:14; 5HP→OD Vihhat 3:57; burnout OD Vihhat 5:00. Exact gaps/options require visual/device review.'),
 ('JP ラヴーシュカのバーンアウト技術','https://www.youtube.com/watch?v=SPul6hrXhNw','video','レリンch',null::timestamptz,now(),'secondary','No captions or chapters. Description confirms a technique but gives no input; no recipe inferred.'),
 ('JPバーンアウト講座','https://www.youtube.com/watch?v=kz-0FC5BJ4A','video','JP攻略動画',null::timestamptz,now(),'secondary','No captions. Chapters: OD Torbalan sequence 0:00; 5HK→5HP TC tree 1:21; OD Torbalan chip sequence 2:05; SA2 mix 3:01; midscreen chip 5:14. Exact gaps/options require visual/device review.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

insert into videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
select v.slug,'youtube',v.external_id,v.title,'https://www.youtube.com/watch?v='||v.external_id,null::timestamptz,v.description,v.video_type,'draft'
from (values
 ('jp-video-combo-oki-collection','D0gf1YooclQ','JPで勝つためのコンボ・起き攻め集','Four technical chapter blocks reviewed; displayed recipes pending.','combo'),
 ('jp-video-20260317-setplay','zpeWJ8ioB_Y','JP 2026年3月17日調整セットプレイ解説','No captions/chapters; legacy analysis backlog.','guide'),
 ('jp-video-year3-acqua-guide','1CGk90HKR2o','JP Year3コンボ・ラヴーシュカ講座','No captions/chapters; legacy analysis backlog.','guide'),
 ('jp-video-vihhat-guide','GfRhgq355UE','JP ヴィーハト講座','Seven technical chapter blocks reviewed; displayed inputs pending.','guide'),
 ('jp-video-infinite-vihhat','rV9OeCyILYA','JP 無限設置・ゲージ管理','Three pseudo-frame-kill timestamps reviewed; exact inputs pending.','guide'),
 ('jp-video-corner-setplay-3','CyTwrrgrbQg','JP 画面端セットプレイ3選','No captions/chapters; leverless input display requires pixel review.','guide'),
 ('jp-video-setplay-counter-3','KMrV_6C9Huw','JPセットプレイ3種と対応','Four setup chapter blocks reviewed; exact gaps pending.','guide'),
 ('jp-video-lovushka-burnout-tech','SPul6hrXhNw','JP ラヴーシュカのバーンアウト技術','No captions/chapters; no recipe inferred.','guide'),
 ('jp-video-burnout-course','kz-0FC5BJ4A','JPバーンアウト講座','Five burnout chapter blocks reviewed; exact gaps pending.','guide')
) v(slug,external_id,title,description,video_type)
where not exists(select 1 from videos x where x.external_id=v.external_id);

insert into entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,
 case when v.external_id in ('D0gf1YooclQ','GfRhgq355UE','rV9OeCyILYA','KMrV_6C9Huw','kz-0FC5BJ4A') then 'chapter_analyzed' else 'analysis_backlog' end,
 120,'JP guide-playlist audit. No pixel or device verification.'
from characters c cross join videos v
where c.slug='jp' and v.external_id in ('D0gf1YooclQ','zpeWJ8ioB_Y','1CGk90HKR2o','GfRhgq355UE','rV9OeCyILYA','CyTwrrgrbQg','KMrV_6C9Huw','SPul6hrXhNw','kz-0FC5BJ4A')
and not exists(select 1 from entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);

with ctx as (
 select (select id from characters where slug='jp') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,sequence_type,sequence_text,notes,source_url) as (values
 ('jp-video-infinite-vihhat-loop','疑似フレーム消費による無限設置候補','resource_management','ヴィーハト設置後 ＞ 疑似フレーム消費 ＞ 再設置を狙う','チャプター0:21、1:49、3:12、3:48。3種類の空振り/待機入力、設置強度、再設置可能状況は映像/実機確認待ち。','https://www.youtube.com/watch?v=rV9OeCyILYA'),
 ('jp-video-triglav-od-vihhat','トリグラフ後ODヴィーハト候補','setup_pressure','トリグラフ ＞ ODヴィーハト設置 ＞ 攻め継続候補','チャプター0:12。トリグラフ強度、設置タイミング、防御側対応は映像/実機確認待ち。','https://www.youtube.com/watch?v=KMrV_6C9Huw'),
 ('jp-video-hp-vihhat','立ち強P後ヴィーハト候補','setup_pressure','立ち強P ＞ ヴィーハト設置 ＞ 攻め継続候補','チャプター2:14。通常設置の強度、ヒット/ガード条件、隙間は映像/実機確認待ち。','https://www.youtube.com/watch?v=KMrV_6C9Huw'),
 ('jp-video-hp-od-vihhat','立ち強P後ODヴィーハト候補','setup_pressure','立ち強P ＞ ODヴィーハト設置 ＞ 攻め継続候補','チャプター3:57。ヒット/ガード条件、設置起動順、防御側対応は映像/実機確認待ち。','https://www.youtube.com/watch?v=KMrV_6C9Huw'),
 ('jp-video-bo-od-vihhat','相手バーンアウト中ODヴィーハト候補','burnout_pressure','相手バーンアウト ＞ ODヴィーハト設置 ＞ 削り/崩し候補','チャプター5:00。始動技、連続ガード、DI/SA分岐は映像/実機確認待ち。','https://www.youtube.com/watch?v=KMrV_6C9Huw'),
 ('jp-video-bo-od-torbalan','バーンアウト中ODトルバラン削り連携候補','burnout_pressure','相手バーンアウト ＞ ODトルバラン ＞ 削り後の攻め継続候補','チャプター0:00と2:05。トルバラン強度、隙間、後続技は映像/実機確認待ち。','https://www.youtube.com/watch?v=kz-0FC5BJ4A'),
 ('jp-video-bo-hk-hp-tc','バーンアウト中立ち強K→立ち強P TC択候補','burnout_pressure','相手バーンアウト ＞ 立ち強K ＞ 立ち強Pターゲットコンボ候補 ＞ 分岐','チャプター1:21。TC表記は動画章題による。後続行動と割り込み可否は映像/実機確認待ち。','https://www.youtube.com/watch?v=kz-0FC5BJ4A'),
 ('jp-video-bo-sa2-mix','バーンアウト中SA2崩し候補','burnout_pressure','相手バーンアウト ＞ SA2 ラヴーシュカ ＞ 打撃/投げ/削り候補','チャプター3:01。発動始動、連ガ、補正切り、DI分岐は映像/実機確認待ち。','https://www.youtube.com/watch?v=kz-0FC5BJ4A'),
 ('jp-video-bo-midscreen-chip','バーンアウト中中央削り連携候補','burnout_pressure','相手バーンアウト・中央 ＞ 弾/設置を使った削り連携候補','チャプター5:14。具体的な弾・設置・隙間は字幕では確認できず映像/実機確認待ち。','https://www.youtube.com/watch?v=kz-0FC5BJ4A')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.sequence_type,r.sequence_text,false,r.notes,ctx.patch_id,'unverified','legacy_candidate','draft'
from rows r cross join ctx on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',q.id,s.id,'supporting','Chapter timestamp evidence only; exact input/gap and current-patch outcome require visual/device verification.'
from sequences q join (values
 ('jp-video-infinite-vihhat-loop','https://www.youtube.com/watch?v=rV9OeCyILYA'),
 ('jp-video-triglav-od-vihhat','https://www.youtube.com/watch?v=KMrV_6C9Huw'),
 ('jp-video-hp-vihhat','https://www.youtube.com/watch?v=KMrV_6C9Huw'),
 ('jp-video-hp-od-vihhat','https://www.youtube.com/watch?v=KMrV_6C9Huw'),
 ('jp-video-bo-od-vihhat','https://www.youtube.com/watch?v=KMrV_6C9Huw'),
 ('jp-video-bo-od-torbalan','https://www.youtube.com/watch?v=kz-0FC5BJ4A'),
 ('jp-video-bo-hk-hp-tc','https://www.youtube.com/watch?v=kz-0FC5BJ4A'),
 ('jp-video-bo-sa2-mix','https://www.youtube.com/watch?v=kz-0FC5BJ4A'),
 ('jp-video-bo-midscreen-chip','https://www.youtube.com/watch?v=kz-0FC5BJ4A')
) m(slug,url) on m.slug=q.slug join sources s on s.url=m.url
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='jp') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||q.slug,'【動画チャプター候補確認】'||q.name,'video_candidate_retest','JP固有の設置・バーンアウト候補を現行版で再現する。','advanced',15,ctx.character_id,
 '相手の4F、投げ、ジャンプ、DI、パリィ、Dリバ、無敵、SAを個別に記録する。','入力履歴・フレーム表示・Drive/SA・ダメージON。中央/端と通常/BOを分ける。','CPU OFF。',q.sequence_text,
 '左右各10回で設置強度、隙間、連ガ、削り、割り込み、再設置可否を記録する。',20,'現行成立と入力が確定した項目だけreviewedへ個別昇格する。',ctx.patch_id,'unverified','legacy_candidate','draft'
from sequences q cross join ctx where q.character_id=ctx.character_id and q.slug in (
 'jp-video-infinite-vihhat-loop','jp-video-triglav-od-vihhat','jp-video-hp-vihhat','jp-video-hp-od-vihhat','jp-video-bo-od-vihhat','jp-video-bo-od-torbalan','jp-video-bo-hk-hp-tc','jp-video-bo-sa2-mix','jp-video-bo-midscreen-chip')
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,'sequence',q.id from trainings t join sequences q on t.slug='training-'||q.slug
where q.slug in ('jp-video-infinite-vihhat-loop','jp-video-triglav-od-vihhat','jp-video-hp-vihhat','jp-video-hp-od-vihhat','jp-video-bo-od-vihhat','jp-video-bo-od-torbalan','jp-video-bo-hk-hp-tc','jp-video-bo-sa2-mix','jp-video-bo-midscreen-chip')
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Chapter timestamp evidence; current-patch reproduction pending.'
from trainings t join sequences q on t.slug='training-'||q.slug
join entity_sources es on es.entity_type='sequence' and es.entity_id=q.id
join sources s on s.id=es.source_id
where q.slug in ('jp-video-infinite-vihhat-loop','jp-video-triglav-od-vihhat','jp-video-hp-vihhat','jp-video-hp-od-vihhat','jp-video-bo-od-vihhat','jp-video-bo-od-torbalan','jp-video-bo-hk-hp-tc','jp-video-bo-sa2-mix','jp-video-bo-midscreen-chip')
on conflict(entity_type,entity_id,source_id) do nothing;
