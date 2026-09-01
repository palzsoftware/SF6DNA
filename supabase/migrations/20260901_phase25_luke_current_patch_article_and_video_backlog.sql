-- Luke current-patch article extraction and visual-analysis backlog.
-- Article claims are reviewed/draft, never verified. Video-only topics remain
-- unverified legacy candidates because both long-form and Shorts playback probes
-- stayed at 0:00 with readyState=0 and no decoded frame.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('スト6 ルーク コンボまとめ 2026','https://takukakugamer.com/sf6-luke-combo/','guide','格ゲーブロガー拓','2026-08-09'::timestamptz,now(),'secondary','2026-08-03 patch-era article. Exact recipes and stated damage reviewed; device reproduction remains pending.'),
 ('スト6 ルーク セットプレイまとめ 2026','https://takukakugamer.com/sf6-luke-setup/','guide','格ゲーブロガー拓','2026-08-21'::timestamptz,now(),'secondary','Published 2026-08-05 and updated 2026-08-21. Frame/oki values are author claims, not device-verified facts.'),
 ('Mルーク マスターまでのコンボ 2026-08-03追記','https://note.com/matsunoki709/n/n946282327da4','guide','松/じぎーも','2026-04-01'::timestamptz,now(),'secondary','Includes an explicit 2026-08-03 setup addendum. Modern-only routes are kept distinct.'),
 ('SF6 Luke and Jamie Season 4 new combos/setups','https://www.youtube.com/watch?v=4aXtcLA_p8Q','video','YouTube guide',null::timestamptz,now(),'secondary','Creator timestamp says Luke starts at 0:00. No captions. Playback probe stayed at 0:00 with no decoded frame; no recipe inferred.'),
 ('今年のルークは+7Fが強い','https://www.youtube.com/shorts/Lva0F2KXFEI','video','jazzzzy669',null::timestamptz,now(),'secondary','Short title confirms a +7F Luke topic. Playback stayed at 0:00 with no decoded frame; exact recipe requires user capture.'),
 ('ルーク 立ち強K持続当てセットプレイ','https://www.youtube.com/shorts/MVoZRVTJjY8','video','YouTube short guide',null::timestamptz,now(),'secondary','Title-only topic. No input inferred; current-patch capture required.'),
 ('ルーク 画面端後ろ投げ後セットプレイ','https://www.youtube.com/shorts/yA0aERDjluY','video','YouTube short guide',null::timestamptz,now(),'secondary','Title-only topic. No input inferred; current-patch capture required.'),
 ('モダンルーク ノーゲージ最大コンボ','https://www.youtube.com/shorts/aV1ZUHbiE1s','video','YouTube short guide',null::timestamptz,now(),'secondary','Title claims a Modern no-meter maximum route. Exact recipe/damage cannot be inferred without visual capture.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,combo_type,notation,starter,damage,drive_cost,sa_cost,position,difficulty,purpose,conditions,notes,source_url) as (values
 ('luke-y4-hp-od-sand-fatal-upper','立ち強P→ODサンド→フェイタル→強ライジング','punish','5HP > 236PP > P > 623HP','5HP',3020,2,0,'corner',3,'端のヒット確認火力','2026.08.03版記事。端。','記事記載3020。SA1/2/3締めは3500/3980/4700と記載。','https://takukakugamer.com/sf6-luke-combo/'),
 ('luke-y4-light-odflash-walk-hdp','小技→ODフラッシュ→微歩き強ライジング','light','2LK > 2LP > 214PP > 微歩き > 623HP','2LK',1720,2,0,'midscreen',4,'小技から起き攻めを得る','微歩き入力。','記事記載1720。歩き量は実機確認対象。','https://takukakugamer.com/sf6-luke-combo/'),
 ('luke-y4-corner-light-odflash-airflash-upper','端小技ODフラ→J中P→エアフラ→弱ライジング','corner','2LK > 2LP > 214PP > j.MP > 遅らせ空中214P > 623LP','2LK',null,2,0,'corner',5,'Year4端空中ルート','エアフラは最大溜め直前で解放。','Year4でODフラ→J中Pが成立すると記事記載。ダメージは締め条件で分離確認。','https://takukakugamer.com/sf6-luke-combo/'),
 ('luke-y4-corner-hp-lflash-airflash-upper','端強P→弱フラ→J中P→エアフラ→弱ライジング','corner','5HP > 214LP(Perfect or max charge) > j.MP > 遅らせ空中214P > 623LP','5HP',3020,0,0,'corner',5,'端の火力と起き攻め','弱フラ後。エアフラは最大溜めにしない。','記事記載3020。SA1/2/3締めは3570/3970/4570。','https://takukakugamer.com/sf6-luke-combo/'),
 ('luke-y4-hp-pc-mflash-odflash-ddt','立ち強P PC→中溜め→遅らせODフラ→DDT','punish_counter','5HP(PC) > 214MP(max charge) > 遅らせ214PP > PP','5HP punish counter',3500,2,0,'midscreen',4,'差し返し高火力','ODフラを遅らせる。','記事記載3500。中フラPerfect時3600。','https://takukakugamer.com/sf6-luke-combo/'),
 ('luke-y4-di-pc-hp-mflash-nochaser','DI PC→しゃがみ強P→中フラ→ノーチェイサー','drive_impact','DI(PC) > 2HP > 214MP(Perfect) > 236K > P','Drive Impact punish counter',2809,1,0,'midscreen',3,'DI後の運びと+7起き攻め','中フラPerfect。','記事記載2809。ノーチェイサー空振り時の+7はSetupで管理。','https://takukakugamer.com/sf6-luke-combo/'),
 ('luke-y4-suppressor-pc-mflash-ddt','サプレッサーPC→中ジャスト→ODフラDDT','punish_counter','4HP(PC) > 214MP(Perfect) > 214PP > PP','4HP punish counter',4130,2,0,'midscreen',5,'中距離差し返し最大候補','中フラ最大溜め不可との記事注意。','記事記載4130。現行成立を実機確認する。','https://takukakugamer.com/sf6-luke-combo/'),
 ('luke-y4-modern-corner-sa2-lethal','モダン端SA2リーサル候補','lethal','5HP > CDR > 4HP > 2HP > CDR > 4HP > 2HP > 214LP(Perfect) > j.MP > 微溜め空中214P > SA2','5HP',4415,6,2,'corner',5,'モダン端SA2リーサル','Modern only。J中P最速、空中フラを僅かに溜める。','note記載4415。入力タイミングは撮影確認対象。','https://note.com/matsunoki709/n/n946282327da4')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,damage,drive_cost,sa_cost,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.combo_type,r.notation,r.starter,r.damage,r.drive_cost,r.sa_cost,r.position,r.difficulty,r.purpose,r.conditions,r.notes,ctx.patch_id,'reviewed','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,setup_type,starter,sequence_text,advantage,position,meter,description,counter_notes,source_url) as (values
 ('luke-y4-lflash-charge-nochaser-2mp','弱溜めフラ空中ヒット→+7しゃがみ中P最持続','oki','弱フラッシュナックル最大溜め空中ヒット(+56)','最速ノーチェイサー空振り > 2MP','+7 after frame kill; 2MP hit +7 / guard +3','midscreen','none','2MPヒット時2HPへ繋ぐ。投げ・垂直・4HKへ分岐。','記事記載値。投げは体感調整。','https://takukakugamer.com/sf6-luke-setup/'),
 ('luke-y4-hflash-air-plus64-nochaser-hk','強フラ空中締め+64→ノーチェイサー→立ち強K','meaty','強フラッシュナックルPerfectまたは最大溜め空中締め(+64)','最速ノーチェイサー空振り > 5HK','+15 after frame kill; hit +8 / guard +1','midscreen','none','立ち強K最終持続重ね。','記事記載値。','https://takukakugamer.com/sf6-luke-setup/'),
 ('luke-y4-hflash-air-plus64-triple-dash','強フラ空中締め+64→前ステ3回+7','oki','強フラッシュナックルPerfectまたは最大溜め空中締め(+64)','前ステップ×3 > 2MP / 投げ / 垂直 / 4HK','+7','midscreen','none','2MP最終持続はhit +7/guard +3。','記事記載値。','https://takukakugamer.com/sf6-luke-setup/'),
 ('luke-y4-ddt-hk-meaty','DDT→立ち強K持続','meaty','DDT(+12)','5HK','hit +5 / guard -2','midscreen','Drive 2','ハードダウン固定からの持続重ね。歩き投げ／シミーへ分岐。','記事記載値。','https://takukakugamer.com/sf6-luke-setup/'),
 ('luke-y4-forward-throw-dr-pressure','前投げ→DR遅らせ弱P／中P／4HK','throw_oki','前投げ(+19)','DR > 微遅らせ5LP / 微遅らせ2MP / 4HK','5LP guard +2 claim','midscreen','Drive 1','弱Pは投げ間合い、2MPは暴れ潰し、4HKはジャンプ・バクステ狩り。','4HKは最速4Fと相打ち時hit +19と記事記載。','https://takukakugamer.com/sf6-luke-setup/'),
 ('luke-y4-corner-backthrow-hk','端背負い後ろ投げ→立ち強K持続','throw_oki','画面端背負い後ろ投げ(+14)','5HK','hit +8 / guard +1','corner','none','立ち強K持続重ね。微歩き様子見でジャスパ確認投げへ分岐。','記事記載値。','https://takukakugamer.com/sf6-luke-setup/'),
 ('luke-y4-corner-hflash-plus42-safejump','端強フラ+42→詐欺飛び','safe_jump','端・強フラッシュナックル締め(+42)','前ジャンプ強K','+42','corner','none','+42F詐欺飛び候補。','実機で無敵技ガードと着地硬直を確認する。','https://takukakugamer.com/sf6-luke-setup/'),
 ('luke-y4-corner-plus64-safejump','端強フラ空中+64→弱P空振り詐欺飛び','safe_jump','端・強フラッシュナックル空中締め(+64)','5LP空振り > 前ジャンプ強K','+42 after frame kill','corner','none','立ち弱P空振りで+42へ調整。','記事記載値。実機で無敵技ガードを確認する。','https://takukakugamer.com/sf6-luke-setup/'),
 ('luke-y4-corner-rising-2mp-whiff','端弱ライジング→しゃがみ中P空振り','oki','端・弱ライジング地上または低空ヒット(+28～31)','2MP空振り > 投げ / 2MP / 垂直','+4 claim','corner','none','端投げ・打撃・垂直シミー分岐。','高度で有利が変動するため実機確認対象。','https://takukakugamer.com/sf6-luke-setup/'),
 ('luke-y4-modern-plus7-2mp','モダン+7F→しゃがみ中P最持続','meaty','溜め中ナックル等 > 弱フラッシュナックルPerfect','ノーチェイサー空振り > 2MP','+7; hit +7','midscreen','none','2026-08-03追加。2MP持続増加を使い、ヒット時2HPへ。','noteの2026-08-03追記。Modern route context。','https://note.com/matsunoki709/n/n946282327da4')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,meter_condition,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.setup_type,r.starter,r.sequence_text,r.advantage,r.position,r.meter,r.description,r.counter_notes,ctx.patch_id,'reviewed','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with links(entity_type,entity_slug,source_url) as (values
 ('combo','luke-y4-hp-od-sand-fatal-upper','https://takukakugamer.com/sf6-luke-combo/'),
 ('combo','luke-y4-light-odflash-walk-hdp','https://takukakugamer.com/sf6-luke-combo/'),
 ('combo','luke-y4-corner-light-odflash-airflash-upper','https://takukakugamer.com/sf6-luke-combo/'),
 ('combo','luke-y4-corner-hp-lflash-airflash-upper','https://takukakugamer.com/sf6-luke-combo/'),
 ('combo','luke-y4-hp-pc-mflash-odflash-ddt','https://takukakugamer.com/sf6-luke-combo/'),
 ('combo','luke-y4-di-pc-hp-mflash-nochaser','https://takukakugamer.com/sf6-luke-combo/'),
 ('combo','luke-y4-suppressor-pc-mflash-ddt','https://takukakugamer.com/sf6-luke-combo/'),
 ('combo','luke-y4-modern-corner-sa2-lethal','https://note.com/matsunoki709/n/n946282327da4'),
 ('setup','luke-y4-lflash-charge-nochaser-2mp','https://takukakugamer.com/sf6-luke-setup/'),
 ('setup','luke-y4-hflash-air-plus64-nochaser-hk','https://takukakugamer.com/sf6-luke-setup/'),
 ('setup','luke-y4-hflash-air-plus64-triple-dash','https://takukakugamer.com/sf6-luke-setup/'),
 ('setup','luke-y4-ddt-hk-meaty','https://takukakugamer.com/sf6-luke-setup/'),
 ('setup','luke-y4-forward-throw-dr-pressure','https://takukakugamer.com/sf6-luke-setup/'),
 ('setup','luke-y4-corner-backthrow-hk','https://takukakugamer.com/sf6-luke-setup/'),
 ('setup','luke-y4-corner-hflash-plus42-safejump','https://takukakugamer.com/sf6-luke-setup/'),
 ('setup','luke-y4-corner-plus64-safejump','https://takukakugamer.com/sf6-luke-setup/'),
 ('setup','luke-y4-corner-rising-2mp-whiff','https://takukakugamer.com/sf6-luke-setup/'),
 ('setup','luke-y4-modern-plus7-2mp','https://note.com/matsunoki709/n/n946282327da4')
), entities as (
 select 'combo' entity_type,id,slug from combos
 union all select 'setup',id,slug from setups
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select l.entity_type,e.id,s.id,'supporting','Current-patch article claim; device verification remains pending.'
from links l join entities e on e.entity_type=l.entity_type and e.slug=l.entity_slug join sources s on s.url=l.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

insert into videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
select v.slug,'youtube',v.external_id,v.title,v.url,null::timestamptz,v.description,v.video_type,'draft'
from (values
 ('luke-video-season4-new-routes','4aXtcLA_p8Q','SF6 Luke and Jamie Season 4 new combos/setups','https://www.youtube.com/watch?v=4aXtcLA_p8Q','No captions. Playback probe stayed at 0:00; Luke section topic only.','guide'),
 ('luke-short-plus7','Lva0F2KXFEI','今年のルークは+7Fが強い','https://www.youtube.com/shorts/Lva0F2KXFEI','No decoded frame. Exact +7 route requires capture.','guide'),
 ('luke-short-hk-meaty','MVoZRVTJjY8','ルーク 立ち強K持続当てセットプレイ','https://www.youtube.com/shorts/MVoZRVTJjY8','Title-only; exact starter/frame kill requires capture.','guide'),
 ('luke-short-corner-backthrow','yA0aERDjluY','ルーク 画面端後ろ投げ後セットプレイ','https://www.youtube.com/shorts/yA0aERDjluY','Title-only; exact input requires capture.','guide'),
 ('luke-short-modern-meterless-max','aV1ZUHbiE1s','モダンルーク ノーゲージ最大コンボ','https://www.youtube.com/shorts/aV1ZUHbiE1s','Title-only; exact recipe and damage require capture.','combo')
) v(slug,external_id,title,url,description,video_type)
where not exists(select 1 from videos x where x.external_id=v.external_id);

insert into entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,'analysis_backlog',160,'Luke video/Shorts visual backlog; do not infer on-screen recipes.'
from characters c cross join videos v
where c.slug='luke' and v.external_id in ('4aXtcLA_p8Q','Lva0F2KXFEI','MVoZRVTJjY8','yA0aERDjluY','aV1ZUHbiE1s')
and not exists(select 1 from entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,method,source_url) as (values
 ('luke-capture-season4-new-routes','【撮影待ち】Season4新コンボ・セットプレイ','動画のLuke区間から、始動・ルート・位置・ゲージ・ダメージを項目別に再現する。','https://www.youtube.com/watch?v=4aXtcLA_p8Q'),
 ('luke-capture-short-plus7','【撮影待ち】+7Fルーク連携','Shortsで紹介された+7F状況の始動、フレーム消費、後続技を再現する。','https://www.youtube.com/shorts/Lva0F2KXFEI'),
 ('luke-capture-short-hk-meaty','【撮影待ち】立ち強K持続当て','Shortsの始動から立ち強K持続当てまでを再現する。','https://www.youtube.com/shorts/MVoZRVTJjY8'),
 ('luke-capture-short-corner-backthrow','【撮影待ち】端後ろ投げセットプレイ','端背負い後ろ投げ後のフレーム消費・持続重ね・投げ分岐を再現する。','https://www.youtube.com/shorts/yA0aERDjluY'),
 ('luke-capture-short-modern-meterless-max','【撮影待ち】モダンノーゲージ最大候補','モダン限定ノーゲージ最大とされるルートの入力とダメージを再現する。','https://www.youtube.com/shorts/aV1ZUHbiE1s')
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select r.slug,r.name,'video_candidate_retest','映像内にしかないルーク攻略情報をユーザー撮影で確定する。','advanced',15,ctx.character_id,
 '入力履歴・フレーム・ダメージ・Drive/SAを表示し、始動前から結果表示まで撮影する。','中央/端、Classic/Modern、通常/CH/PCを動画内容に合わせて分離。','CPU OFF。',r.method,
 '左右各10回で成立入力、ダメージ、ゲージ、終了F、受け身、キャラ差を記録する。',20,'成立時のみ個別Combo/Setup/Sequenceへreviewedで登録する。',ctx.patch_id,'unverified','legacy_candidate','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with links(training_slug,source_url) as (values
 ('luke-capture-season4-new-routes','https://www.youtube.com/watch?v=4aXtcLA_p8Q'),
 ('luke-capture-short-plus7','https://www.youtube.com/shorts/Lva0F2KXFEI'),
 ('luke-capture-short-hk-meaty','https://www.youtube.com/shorts/MVoZRVTJjY8'),
 ('luke-capture-short-corner-backthrow','https://www.youtube.com/shorts/yA0aERDjluY'),
 ('luke-capture-short-modern-meterless-max','https://www.youtube.com/shorts/aV1ZUHbiE1s')
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Video-only topic; exact recipe requires user capture.'
from links l join trainings t on t.slug=l.training_slug join sources s on s.url=l.source_url
on conflict(entity_type,entity_id,source_id) do nothing;
