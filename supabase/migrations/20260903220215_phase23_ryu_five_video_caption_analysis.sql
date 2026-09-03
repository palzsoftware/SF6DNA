-- Caption-first review of five Ryu guides. YouTube video pixels remained black
-- (videoWidth/videoHeight 0) even at 144p, so visually displayed inputs are not
-- promoted to verified facts. Spoken claims remain unverified legacy candidates.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
  ('リュウ YEAR3おすすめコンボまとめ','https://www.youtube.com/watch?v=Webv4hwKRew','video','ぷにぷにの格ゲー解説ちゃんねる',null::timestamptz,now(),'secondary','Japanese auto-captions reviewed 2026-08-31. Key sections: 0:29-8:36, 8:38-17:05, 17:06-23:42, 23:44-28:36, 28:39-32:45. Visual stream remained unavailable; displayed recipes/damage require visual or device review.'),
  ('リュウ とりこれコンボ5選','https://www.youtube.com/watch?v=ZQLuHVVdG-M','video','ぷにぷにの格ゲー解説ちゃんねる',null::timestamptz,now(),'secondary','Japanese auto-captions reviewed 2026-08-31. Key sections: 0:29-1:44, 1:47-2:38, 2:40-3:37, 3:39-4:23, 4:24-5:23. Visual stream remained unavailable; displayed recipes/damage require visual or device review.'),
  ('リュウ 打ち返し行動対策','https://www.youtube.com/watch?v=c98pgwqOz70','video','ぷにぷにの格ゲー解説ちゃんねる',null::timestamptz,now(),'secondary','Japanese auto-captions reviewed 2026-08-31. Key sections: 1:15-2:27 and 2:29-3:49. Visual stream remained unavailable; exact spacing and counter-hit reproduction require device review.'),
  ('リュウ インパクト返し中央シミー','https://www.youtube.com/watch?v=L7s0xH48pLs','video','ぷにぷにの格ゲー解説ちゃんねる',null::timestamptz,now(),'secondary','Japanese auto-captions reviewed 2026-08-31. Key section: 0:24-2:02. Visual stream remained unavailable; displayed recipe and +2F claim require device review.'),
  ('2026年対応 リュウ コンボ・起き攻め完全ガイド','https://www.youtube.com/watch?v=kWS3zqOINUU','video','さわかぜ',null::timestamptz,now(),'secondary','Japanese auto-captions reviewed 2026-08-31. Strategy 0:23-9:39; combos 9:39 onward. Visual stream remained unavailable; garbled move names and displayed recipes are not inferred.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

update sources s set accessed_at=now(), notes=x.notes
from (values
  ('https://www.youtube.com/watch?v=Webv4hwKRew','Japanese auto-captions reviewed 2026-08-31. Key sections: 0:29-8:36, 8:38-17:05, 17:06-23:42, 23:44-28:36, 28:39-32:45. Visual stream remained unavailable; displayed recipes/damage require visual or device review.'),
  ('https://www.youtube.com/watch?v=ZQLuHVVdG-M','Japanese auto-captions reviewed 2026-08-31. Key sections: 0:29-1:44, 1:47-2:38, 2:40-3:37, 3:39-4:23, 4:24-5:23. Visual stream remained unavailable; displayed recipes/damage require visual or device review.'),
  ('https://www.youtube.com/watch?v=c98pgwqOz70','Japanese auto-captions reviewed 2026-08-31. Key sections: 1:15-2:27 and 2:29-3:49. Visual stream remained unavailable; exact spacing and counter-hit reproduction require device review.'),
  ('https://www.youtube.com/watch?v=L7s0xH48pLs','Japanese auto-captions reviewed 2026-08-31. Key section: 0:24-2:02. Visual stream remained unavailable; displayed recipe and +2F claim require device review.'),
  ('https://www.youtube.com/watch?v=kWS3zqOINUU','Japanese auto-captions reviewed 2026-08-31. Strategy 0:23-9:39; combos 9:39 onward. Visual stream remained unavailable; garbled move names and displayed recipes are not inferred.')
) x(url,notes) where s.url=x.url;

with ctx as (
  select (select id from characters where slug='ryu') ryu_id,
         (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,sequence_type,sequence_text,mash,throw_point,shimmy,jump_opt,parry_opt,drev,invincible,notes) as (values
('ryu-video-counter-light-chain','小技3発刻みで最速打ち返しを潰す','frame_trap','小技ガード ＞ 小技 ＞ 小技（ヒット確認から必殺技）','字幕1:15-1:30。雑な最速通常技打ち返しにカウンターを狙う。',null,null,null,'相手のジャストパリィを確認','Dリバを確認','無敵技には負ける','入力に使う小技の種類・距離・連続回数は映像未確認。'),
('ryu-video-counter-crlp-lhasho','しゃがみ弱Pキャンセル弱波掌撃で打ち返し狩り','frame_trap','小技2～3発ガード ＞ しゃがみ弱Pキャンセル弱波掌撃 ＞ CH時：中竜巻 / SA1 / DRしゃがみ中Pまたは立ち弱K','字幕1:35-2:27。弱波掌撃は連続ガードではなく、最速打ち返しを狩る読み合い。',null,null,null,'ジャストパリィに負ける','Dリバを確認','無敵技に負ける','しゃがみ弱PキャンセルならDI返しが間に合うという動画主張。全分岐を実機確認。'),
('ryu-video-counter-gosho-dj-tc','鳩尾砕きガード後のDJジョスク対策TC','counter_sequence','鳩尾砕きガード ＞ DJジョスクール確認 ＞ ターゲットコンボ（ヒット時集中 / ガード時2段目止め）','字幕2:50-3:13。旋風脚確認よりTCを推奨。',null,null,null,'パリィを確認','Dリバを確認','無敵技を確認','TCの具体的な構成は字幕だけで断定せず、映像/実機確認待ち。'),
('ryu-video-counter-jamie-backdash','小技2発→バクステでジェイミー強P打ち返しを回避','whiff_punish_sequence','小技×2ガード ＞ バックステップ ＞ ジェイミー立ち強P空振り ＞ 立ち強P反撃','字幕3:16-3:49。露骨な強P打ち返し癖への一点読み。',null,'バクステによる投げ回避分岐',null,'パリィを確認','Dリバを確認','無敵技を確認','距離・小技種類・反撃確定性は映像/実機確認待ち。')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.ryu_id,r.slug,r.name,r.sequence_type,r.sequence_text,false,r.mash,r.throw_point,r.shimmy,r.jump_opt,r.parry_opt,r.drev,r.invincible,r.notes,ctx.patch_id,'unverified','legacy_candidate','draft'
from rows r cross join ctx on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',q.id,s.id,'supporting','Auto-caption timestamp evidence; visual stream and current-patch reproduction pending.'
from sequences q cross join sources s
where q.slug like 'ryu-video-counter-%' and s.url in (
 'https://www.youtube.com/watch?v=c98pgwqOz70',
 'https://punipunigame.com/sf6-ryu-counter-attack-guide/'
)
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='ryu') ryu_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||q.slug,'【字幕候補確認】'||q.name,'pressure_retest','字幕由来の打ち返し対策を現行版で再現する。','advanced',12,ctx.ryu_id,
 '相手の最速通常技、DI、投げ、ジャスパ、OD無敵を個別に記録する。','入力履歴・フレーム表示ON。通常再生とランダム再生を分ける。','CPU OFF。',q.sequence_text,
 '左右各10回で成立距離、CH/PC、反撃、負ける選択肢を記録する。',20,'成立時のみreviewedへ個別昇格する。',ctx.patch_id,'unverified','legacy_candidate','draft'
from sequences q cross join ctx where q.character_id=ctx.ryu_id and q.slug like 'ryu-video-counter-%'
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,'sequence',q.id from trainings t join sequences q on t.slug='training-'||q.slug
where q.slug like 'ryu-video-counter-%'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Auto-caption timestamp evidence; visual stream and current-patch reproduction pending.'
from trainings t cross join sources s
where t.slug like 'training-ryu-video-counter-%' and s.url='https://www.youtube.com/watch?v=c98pgwqOz70'
on conflict(entity_type,entity_id,source_id) do nothing;

update videos v set description=x.description
from (values
 ('Webv4hwKRew','Auto-captions analyzed 2026-08-31. Five strategy blocks timestamped; video pixels remained black at 144p, so displayed recipes/damage remain visually unconfirmed.'),
 ('ZQLuHVVdG-M','Auto-captions analyzed 2026-08-31. Five strategy blocks timestamped; video pixels remained black at 144p, so displayed recipes/damage remain visually unconfirmed.'),
 ('c98pgwqOz70','Auto-captions analyzed 2026-08-31. Pressure-counter sections 1:15-2:27 and 2:29-3:49 extracted; video pixels remained black at 144p.'),
 ('L7s0xH48pLs','Auto-captions analyzed 2026-08-31. Impact-return setup 0:24-2:02 extracted; video pixels remained black at 144p.'),
 ('kWS3zqOINUU','Auto-captions analyzed 2026-08-31. Strategy and combo sections identified; video pixels remained black at 144p, so garbled move names were not inferred.')
) x(external_id,description) where v.external_id=x.external_id;
