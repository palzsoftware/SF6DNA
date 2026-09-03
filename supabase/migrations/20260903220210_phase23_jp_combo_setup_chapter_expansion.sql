-- Second JP chapter audit. Exact on-screen recipes are intentionally not
-- inferred because the YouTube video element timed out during pixel review.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('JP 厳選16コンボとセットプレイ集','https://www.youtube.com/watch?v=Ab-M1poFHX0','video','ミダ猫のゲーム動画',null::timestamptz,now(),'secondary','No captions. Chapters reviewed 2026-08-31: lights 0:15; OD Torbalan 2:47; DR medium/overhead 3:39; 2MP DRC 4:10; OD Vihhat setup 5:09; carry 6:35; Vihhat hit 7:17; HP PC 7:57; DReversal punish 8:36; DI PC 8:56; DI wall 9:43; stun 10:13; invincible punish 10:51; OD Amnesia 11:37; SA1 12:27; SA2 12:49; SA3 13:25. Displayed inputs/damage require visual/device review.'),
 ('JP 設置の強い使い方','https://www.youtube.com/watch?v=GCa9lNVWY-M','video','なんでねー',null::timestamptz,now(),'secondary','No captions. Chapters reviewed 2026-08-31: DR forced mix 0:33; forward-dash assault 1:37; pseudo-safe-jump 3:08; chase-DR mix 4:35; match examples 5:53. Starter and exact inputs require visual/device review.'),
 ('JP Year3最強コンボ動画','https://www.youtube.com/watch?v=IkakoZGX8sg','video','JP guide creator',null::timestamptz,now(),'secondary','No captions. Chapters reviewed 2026-08-31: SA1/SA2 lethal 0:18; corner setups 1:36; SA2 hit combos 6:23; anti-air lethal 7:34. Displayed inputs/damage require visual/device review.'),
 ('JP 2026.08.03公式変更リスト','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jp','official_patch','CAPCOM','2026-08-03'::timestamptz,now(),'primary','Official current patch. Vihhat Akno cancel access added from 5MP/5HK/2LK/2MK; OD Triglav grounded normal-hit launch changed; OD Amnesia throw-catch recovery +4F; verify old Amnesia routes.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

insert into videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
select v.slug,'youtube',v.external_id,v.title,'https://www.youtube.com/watch?v='||v.external_id,null::timestamptz,v.description,v.video_type,'draft'
from (values
 ('jp-video-16-combo-setup','Ab-M1poFHX0','JP 厳選16コンボとセットプレイ集','Eighteen technical chapter timestamps inventoried; displayed recipes pending visual review.','combo'),
 ('jp-video-vihhat-usage','GCa9lNVWY-M','JP 設置の強い使い方','Four setup branches timestamped; exact starter/input pending visual review.','guide'),
 ('jp-video-year3-max-combo','IkakoZGX8sg','JP Year3最強コンボ動画','Four combo/setup categories timestamped; displayed recipes pending visual review.','combo')
) v(slug,external_id,title,description,video_type)
where not exists(select 1 from videos x where x.external_id=v.external_id);

insert into entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,'chapter_analyzed',110,'JP playlist chapter audit; no pixel or device verification.'
from characters c cross join videos v
where c.slug='jp' and v.external_id in ('Ab-M1poFHX0','GCa9lNVWY-M','IkakoZGX8sg')
and not exists(select 1 from entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);

with ctx as (
 select (select id from characters where slug='jp') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,sequence_type,sequence_text,notes) as (values
 ('jp-video-vihhat-dr-mix','ヴィーハト設置後のDR強制二択候補','setup_pressure','ヴィーハト設置後 ＞ ドライブラッシュ ＞ 打撃/投げ候補','チャプター0:33。字幕では内容を確認できたが、入力は映像確認が必要。ラッシュ技、設置起動、隙間は未確認。'),
 ('jp-video-vihhat-forward-dash','ヴィーハト設置後の前ステ強襲候補','setup_pressure','ヴィーハト設置後 ＞ 前ステップ ＞ 打撃/投げ候補','チャプター1:37。前ステ回数、技、通常/OD設置、受け身条件は映像/実機確認待ち。'),
 ('jp-video-vihhat-pseudo-safejump','ヴィーハト設置後の疑似詐欺飛び候補','safe_jump_candidate','ヴィーハト設置後 ＞ 前ジャンプ攻撃候補 ＞ 設置起動','チャプター3:08。真の詐欺飛びではなく疑似表記。始動、ジャンプ技、無敵への結果は映像/実機確認待ち。'),
 ('jp-video-vihhat-chase-dr','ヴィーハト設置後の追いDR二択候補','setup_pressure','ヴィーハト設置後 ＞ 相手後退を追うDR ＞ 打撃/投げ候補','チャプター4:35。追いラッシュの始動技、距離、設置起動タイミングは映像/実機確認待ち。')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.sequence_type,r.sequence_text,false,r.notes,ctx.patch_id,'unverified','legacy_candidate','draft'
from rows r cross join ctx on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',q.id,s.id,'supporting','Chapter timestamp evidence; exact input and current-patch outcome require visual/device verification.'
from sequences q cross join sources s
where q.slug like 'jp-video-vihhat-%' and s.url='https://www.youtube.com/watch?v=GCa9lNVWY-M'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',q.id,s.id,'current_patch_context','Official 2026-08-03 Vihhat Akno cancel expansion supports retesting these setup branches; it does not verify the video recipe.'
from sequences q cross join sources s
where q.slug like 'jp-video-vihhat-%' and s.url='https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jp'
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='jp') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||q.slug,'【動画チャプター候補確認】'||q.name,'video_candidate_retest','設置後の候補を現行版で再現し、入力・受け身・防御分岐を確定する。','advanced',12,ctx.character_id,
 '相手の4F、投げ、後退、ジャンプ、DI、パリィ、Dリバ、無敵を個別に記録する。','入力履歴・フレーム表示ON。通常/後方受け身と中央/端を分ける。','CPU OFF。',q.sequence_text,
 '左右各10回で成立位置、隙間、連ガ、割り込み、設置起動順を記録する。',20,'映像または実機で確認できた項目だけ個別にreviewedへ昇格する。',ctx.patch_id,'unverified','legacy_candidate','draft'
from sequences q cross join ctx where q.character_id=ctx.character_id and q.slug like 'jp-video-vihhat-%'
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,'sequence',q.id from trainings t join sequences q on t.slug='training-'||q.slug
where q.slug like 'jp-video-vihhat-%'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Chapter timestamp evidence; current-patch reproduction pending.'
from trainings t cross join sources s
where t.slug like 'training-jp-video-vihhat-%' and s.url='https://www.youtube.com/watch?v=GCa9lNVWY-M'
on conflict(entity_type,entity_id,source_id) do nothing;
