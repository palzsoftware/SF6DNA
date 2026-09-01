-- JP remaining guide-video chapter audit.
-- Chapter labels are treated as topic/timestamp evidence only. Exact inputs,
-- damage and current-patch validity remain unverified unless stated otherwise.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('JP SA2ラヴーシュカ主力コンボ・連携講座','https://www.youtube.com/watch?v=mwhNc0qi3Fs','video','りゅうせい','2024-11-12'::timestamptz,now(),'secondary','Auto-caption track exists but transcript panel remained loading. Creator chapters reviewed: basic/carry/corner/DI/OD Triglav/side-switch/Drive management/guard mix/DR starter/unblockable, 0:00-20:26. Exact displayed recipes require visual review.'),
 ('JP 設置後のDrive残量別行動','https://www.youtube.com/watch?v=qV-KgJ9Uwrw','video','なんでねー','2025-09-26'::timestamptz,now(),'secondary','Creator description and chapters reviewed: retreating opponent 0:24; 5+ bars 2:04; 3-4 bars 2:52; 1-2 bars 4:22; match examples 5:29. Exact inputs require visual review.'),
 ('JP 超実戦向けセットプレイ解説','https://www.youtube.com/watch?v=9_7W0ISQWQA','video','ガーカス','2024-08-18'::timestamptz,now(),'secondary','Creator chapters reviewed: 3HP hit, perfect parry, 5HK guard, 2HK hit, corner forward throw, 5HP/Triglav into normal or OD Vihhat, corner Amnesia, 2HP into mid/low Torbalan. Exact follow-ups require visual review.'),
 ('JP MR2200セットプレイ解説','https://www.youtube.com/watch?v=Lj-nsY8XP6g','video','ロズト','2025-03-13'::timestamptz,now(),'secondary','Creator chapters reviewed: 6HK into Vihhat, back throw meaty, 2HK punish counter, corner normal/OD Vihhat, raw DR, OD Torbalan, throw into meaty Triglav/fake 2LP, SA2 D-reversal option select and F-shiki branches. Current-patch visual/device retest required.'),
 ('JP 墓場連携・体格キャラ依存研究','https://www.youtube.com/watch?v=UBsoBb01LOw','video','りゅうせい','2026-02-11'::timestamptz,now(),'secondary','Creator chapters reviewed: sequence research 0:27; body-size difference 3:51; character-specific difference 6:08. Exact route and per-character table require visual/device review.'),
 ('JP 墓場連携・誠ルート実演','https://www.youtube.com/watch?v=zkRUtKkx1vA','video','ももち / Momochi','2026-02-02'::timestamptz,now(),'secondary','Creator chapters reviewed: source sequence investigation 0:18; route supplied 1:34; graveyard sequence 5:28; follow-up reasoning 7:48. Exact route requires visual/device review.'),
 ('JP 最新ラヴーシュカ連携','https://www.youtube.com/watch?v=NZrj9JDx4K4','video','ACQUA','2026-05-19'::timestamptz,now(),'secondary','No creator chapters in description and transcript did not load. Title/description confirm a modern Lovushka mix topic; no input inferred.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

insert into videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
select v.slug,'youtube',v.external_id,v.title,'https://www.youtube.com/watch?v='||v.external_id,v.published_at::timestamptz,v.description,'guide','draft'
from (values
 ('jp-video-sa2-main-route-matrix','mwhNc0qi3Fs','JP SA2ラヴーシュカ主力コンボ・連携講座','2024-11-12','Creator chapter matrix reviewed; exact displayed recipes pending.'),
 ('jp-video-vihhat-drive-tier-actions','qV-KgJ9Uwrw','JP 設置後のDrive残量別行動','2025-09-26','Creator description and Drive-tier chapters reviewed.'),
 ('jp-video-practical-setplay-matrix','9_7W0ISQWQA','JP 超実戦向けセットプレイ解説','2024-08-18','Creator starter/knockdown chapter matrix reviewed.'),
 ('jp-video-mr2200-setplay-matrix','Lj-nsY8XP6g','JP MR2200セットプレイ解説','2025-03-13','Creator chapter matrix reviewed; 2026-08-03 retest required.'),
 ('jp-video-graveyard-size-study','UBsoBb01LOw','JP 墓場連携・体格キャラ依存研究','2026-02-11','Body-size and character-specific chapters reviewed.'),
 ('jp-video-graveyard-makoto-route','zkRUtKkx1vA','JP 墓場連携・誠ルート実演','2026-02-02','Source/route/reasoning chapters reviewed.'),
 ('jp-video-latest-lovushka-mix','NZrj9JDx4K4','JP 最新ラヴーシュカ連携','2026-05-19','No creator chapters or usable transcript; exact input pending.')
) v(slug,external_id,title,published_at,description)
where not exists(select 1 from videos x where x.external_id=v.external_id);

insert into entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,
 case when v.external_id='NZrj9JDx4K4' then 'analysis_backlog' else 'chapter_analyzed' end,
 150,'JP remaining guide audit. No recipe inferred beyond creator-authored chapter labels.'
from characters c cross join videos v
where c.slug='jp' and v.external_id in ('mwhNc0qi3Fs','qV-KgJ9Uwrw','9_7W0ISQWQA','Lj-nsY8XP6g','UBsoBb01LOw','zkRUtKkx1vA','NZrj9JDx4K4')
and not exists(select 1 from entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);

with ctx as (
 select (select id from characters where slug='jp') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,sequence_type,sequence_text,notes) as (values
 ('jp-video-sa2-route-matrix','SA2ラヴーシュカ用途別ルート候補','sa2_sequence','SA2 ラヴーシュカ ＞ 基本／運び／端／DI／ODトリグラフ／入れ替え／崩し分岐','チャプター0:00、1:38、3:40、5:07、7:16、8:11、9:32、12:37、13:43、14:23、18:29。字幕ではカテゴリを確認できたが、入力は映像確認が必要。'),
 ('jp-video-vihhat-drive-tier-decision','ヴィーハト設置後・Drive残量別行動候補','resource_sequence','ヴィーハト設置後 ＞ 相手の後退確認 ＞ Drive 5本以上／3-4本／1-2本で行動を分岐','チャプター0:24、2:04、2:52、4:22、5:29。概要欄でゲージ別判断を確認。具体入力、消費量、期待値は映像確認が必要。'),
 ('jp-video-practical-setplay-starters','始動・ダウン別実戦セットプレイ候補','oki_sequence','3HP／ジャスパ／5HKガード／2HKヒット／端前投げ／5HP・トリグラフ・アムネジア後 ＞ 設置・中下段候補','チャプター0:00、0:44、0:53、1:11、1:58、3:18、3:52、4:32、4:52、5:25。旧版資料のため現行成立と正確な追撃は映像・実機確認が必要。'),
 ('jp-video-mr2200-setplay-branches','MR2200セットプレイ分岐候補','oki_sequence','6HK／後ろ投げ／2HK PC／端投げ／通常・OD設置／OD弾／SA2 ＞ 持続・DR・F式分岐','チャプター1:20、2:01、2:10、2:50、3:30、5:58、6:32、7:01、7:14、7:52、9:05、9:52、10:51、11:17、11:48。アムネジア変更を含め現行再検証必須。'),
 ('jp-video-graveyard-character-matrix','墓場連携・体格／キャラ別成立候補','sa2_sequence','墓場連携候補 ＞ 相手の体格・キャラクター別にルート／結果を分岐','研究動画0:27、3:51、6:08と実演動画1:34、5:28、7:48。体格差・キャラ差の存在はチャプターで確認したが、入力と対象表は映像・実機確認が必要。')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.sequence_type,r.sequence_text,false,r.notes,ctx.patch_id,'unverified','legacy_candidate','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with links(sequence_slug,source_url) as (values
 ('jp-video-sa2-route-matrix','https://www.youtube.com/watch?v=mwhNc0qi3Fs'),
 ('jp-video-vihhat-drive-tier-decision','https://www.youtube.com/watch?v=qV-KgJ9Uwrw'),
 ('jp-video-practical-setplay-starters','https://www.youtube.com/watch?v=9_7W0ISQWQA'),
 ('jp-video-mr2200-setplay-branches','https://www.youtube.com/watch?v=Lj-nsY8XP6g'),
 ('jp-video-graveyard-character-matrix','https://www.youtube.com/watch?v=UBsoBb01LOw'),
 ('jp-video-graveyard-character-matrix','https://www.youtube.com/watch?v=zkRUtKkx1vA')
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',q.id,s.id,'supporting','Creator-authored chapter evidence; exact input and current-patch result require visual/device verification.'
from links l join sequences q on q.slug=l.sequence_slug join sources s on s.url=l.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='jp') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||q.slug,'【動画チャプター候補確認】'||q.name,'video_candidate_retest','動画チャプター候補を現行版で個別検証する。','advanced',25,ctx.character_id,
 '動画記載時刻を開き、始動・位置・Drive/SA・相手キャラを分離して記録する。','入力履歴・フレーム・Drive/SA・ダメージON。中央/端を分ける。','CPU OFF。',q.sequence_text,
 '各分岐を左右10回。成立入力、ダメージ、有利、受け身、キャラ限、割り込みを記録する。',20,'成立条件が確定した場合だけ個別Combo/Setup/Sequenceへ分割する。',ctx.patch_id,'unverified','legacy_candidate','draft'
from sequences q cross join ctx
where q.slug in ('jp-video-sa2-route-matrix','jp-video-vihhat-drive-tier-decision','jp-video-practical-setplay-starters','jp-video-mr2200-setplay-branches','jp-video-graveyard-character-matrix')
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,'sequence',q.id from sequences q join trainings t on t.slug='training-'||q.slug
where q.slug in ('jp-video-sa2-route-matrix','jp-video-vihhat-drive-tier-decision','jp-video-practical-setplay-starters','jp-video-mr2200-setplay-branches','jp-video-graveyard-character-matrix')
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Chapter source inherited from related sequence; current-patch reproduction pending.'
from trainings t
join sequences q on t.slug='training-'||q.slug
join entity_sources es on es.entity_type='sequence' and es.entity_id=q.id
where q.slug in ('jp-video-sa2-route-matrix','jp-video-vihhat-drive-tier-decision','jp-video-practical-setplay-starters','jp-video-mr2200-setplay-branches','jp-video-graveyard-character-matrix')
on conflict(entity_type,entity_id,source_id) do nothing;
