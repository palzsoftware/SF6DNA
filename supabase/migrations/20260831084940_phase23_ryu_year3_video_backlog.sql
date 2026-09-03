-- Ryu: widen evidence window to 2025-09-01..2026-08-31.
-- Older-patch recipes and unreviewed match footage remain draft/unverified.
insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select 'YEAR3対応 リュウおすすめコンボ19選','https://punipunigame.com/sf6-ryu-year3-combo/','community_guide','ぷにぷに','2025-09-30'::timestamptz,now(),'secondary','Year3 recipe catalog. Re-check against 2026-08-03 before verification.'
where not exists(select 1 from sources where url='https://punipunigame.com/sf6-ryu-year3-combo/');

with ctx as(select (select id from characters where slug='ryu') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),
r(slug,name,ctype,notation,starter,pos,purpose,conditions,notes) as(values
('ryu-y3-hdp-corner-meaty-conversion','端強昇龍→中K消費→持続中Pコンボ','corner','小技×3 ＞ 強昇龍拳 ＞ 立ち中K空振り ＞ 立ち中P(持続) ＞ 引き強P ＞ 強足刀 ＞ 中昇龍拳','小技','corner','持続重ねヒット時の端コンボ','Year3映像/記事。','立ち中Pはガード+2候補。現行成立未確認。'),
('ryu-y3-ltatsu-overhead-conversion','弱竜巻→持続中段→OD竜巻','overhead','小技×3 ＞ 弱竜巻 ＞ 立ち弱P空振り ＞ 鎖骨割り ＞ 立ち弱P ＞ 立ち弱K ＞ OD竜巻 ＞ 強昇龍拳','小技','corner','持続中段から端火力','画面端。','中段ヒット+5/ガード+1候補。'),
('ryu-y3-odtatsu-dr-mp-mhasho-hdp','端OD竜巻DR中Pルート','corner','小技×3 ＞ OD竜巻 ＞ ドライブラッシュ立ち中P ＞ 中波掌撃 ＞ 強昇龍拳','小技','corner','端Drive火力','Year3。','2026.08.31成立は実機確認待ち。'),
('ryu-y3-odtatsu-dr-mp-hdonkey','端OD竜巻→DR中P→強足刀','oki','小技×3 ＞ OD竜巻 ＞ ドライブラッシュ立ち中P ＞ 強上段足刀蹴り','小技','corner','詐欺飛び移行','Year3。','強足刀後の+42候補を確認。'),
('ryu-y3-odtatsu-sa1','端OD竜巻SA1伸ばし','sa','小技×3 ＞ OD竜巻 ＞ DR立ち中P ＞ Cラッシュしゃがみ強P ＞ 強足刀 ＞ SA1','小技','corner','SA1火力','Drive+SA1。','Damage/Drive消費は未転記。'),
('ryu-y3-odtatsu-sa3','端OD竜巻SA3最大候補','lethal','小技×3 ＞ OD竜巻 ＞ DR立ち中P ＞ Cラッシュしゃがみ強P ＞ 強足刀 ＞ 強昇龍拳 ＞ SA3','小技','corner','SA3リーサル','Drive+SA3。','現行キャンセル可否を確認。'),
('ryu-y3-senpu-air-tatsu-overhead','旋風脚→空中竜巻→持続中段','overhead','旋風脚 ＞ 空中竜巻 ＞ しゃがみ弱K空振り ＞ 鎖骨割り','旋風脚','corner','Year3端中段セットプレイ','画面端。','2026-08-03旋風脚/空中竜巻変更後の成立を優先確認。'),
('ryu-y3-crmk-drc-hhasho','中足ラッシュ強波掌撃基本','drive_rush','しゃがみ中K ＞ Cラッシュしゃがみ強P または 立ち強P ＞ 強波掌撃','しゃがみ中K','any','Year3主力確認','強波掌撃後は状況別追撃。','派生を個別Comboへ接続する基礎パーツ。')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.cid,r.slug,r.name,r.ctype,r.notation,r.starter,r.pos,3,r.purpose,r.conditions,r.notes,ctx.pid,'unverified','legacy_candidate','draft' from r cross join ctx on conflict(slug) do nothing;

with ctx as(select (select id from characters where slug='ryu') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),
r(slug,name,stype,starter,seq,adv,pos,description,notes) as(values
('ryu-y3-hdp-dash-gosho','強昇龍→前ステ微歩き投げ／大ゴス','oki','小技×3 ＞ 強昇龍拳','前ステップ ＞ 微歩き投げ / 鳩尾砕き','source-described','any','投げ重ねが難しい相手への大ゴス暴れ潰し。','後ろ歩きには投げが届かない候補。'),
('ryu-y3-hdp-auto-shimmy','強昇龍→生DRしゃがみガード自動シミー','oki','小技×3 ＞ 強昇龍拳','最速生ドライブラッシュ ＞ しゃがみガード','source-described','any','無敵・中足暴れをガードするシミー候補。','記事本文は後ろ受け身限定と記載。'),
('ryu-y3-ltatsu-dr-shimmy','弱竜巻→生DR後ろ歩き自動シミー','oki','小技×3 ＞ 弱竜巻','最速生ドライブラッシュ ＞ 後ろ歩き ＞ しゃがみガード','source-described','any','投げ抜けと無敵を避ける。','中足暴れに負けるため早めにしゃがみガード。'),
('ryu-y3-ltatsu-lp-fireball','弱竜巻→弱P消費→弱波動持続','projectile_oki','画面端：小技×3 ＞ 弱竜巻','立ち弱P空振り ＞ 弱波動拳','source-described','corner','弾重ね。','SAのみ無敵の相手やJPアムネジア対策候補。'),
('ryu-y3-weak-donkey-air-tatsu-delay','弱足刀詐欺飛び→遅らせ空中竜巻','safejump','端：小技×3 ＞ 弱足刀','前ジャンプ ＞ 遅らせ空中竜巻 ＞ 昇龍追撃候補','+42 source claim','corner','ファジー弱P/遅らせ打撃対策。','空中竜巻のタイミングと現行軌道を確認。')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.cid,r.slug,r.name,r.stype,r.starter,r.seq,r.adv,r.pos,r.description,r.notes,ctx.pid,'unverified','legacy_candidate','draft' from r cross join ctx on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select x.kind,x.id,s.id,'supporting','Year3 recipe source; legacy candidate pending current-patch review.' from(
 select 'combo' kind,id from combos where slug like 'ryu-y3-%'
 union all select 'setup',id from setups where slug like 'ryu-y3-%'
)x cross join sources s where s.url='https://punipunigame.com/sf6-ryu-year3-combo/'
on conflict(entity_type,entity_id,source_id) do nothing;

-- Match/guide video inventory. No recipe is inferred from a title.
insert into videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
select v.slug,'youtube',v.external_id,v.title,'https://www.youtube.com/watch?v='||v.external_id,v.published_at,v.description,v.video_type,'draft'
from(values
('ryu-video-season3-ultimate','2cN27UUF95g','SF6 Season 3 Ryu Ultimate Guide - Combos, Frame Traps, Setups',null::timestamptz,'Guide candidate: new routes, side switch, SA2 and frame traps. Requires timestamp extraction.','guide'),
('ryu-video-season3-new-combos','78lXWbSCHDQ','Season 3 NEW Ryu Combos! SF6',null::timestamptz,'Combo guide candidate; Classic/Modern and patch date must be classified.','combo'),
('ryu-video-yas-angrybird','yNTXGbflDbQ','YAS (Ryu) vs ANGRYBIRD (Ryu)',null::timestamptz,'Mirror high-level replay; inspect confirms, resource routes and oki.','match'),
('ryu-video-yas-cosa-ken','qyQxzhxZUkM','YAS (Ryu) vs COSA (Ken)',null::timestamptz,'High-level replay candidate.','match'),
('ryu-video-yas-daigo','Cqc3dtDpaXQ','YAS (Ryu) vs DAIGO (Akuma)',null::timestamptz,'High-level replay candidate.','match'),
('ryu-video-yas-kazunoko-viper','h1FhaJKouFw','KAZUNOKO (C.Viper) vs YAS (Ryu)','2026-05-18'::timestamptz,'High-level replay in the requested one-year window.','match'),
('ryu-video-yas-sahara','sgx-BCsfpuE','SAHARA (Ken) vs YAS (Ryu)','2026-05-08'::timestamptz,'High-level replay in the requested one-year window.','match'),
('ryu-video-shuto-cosa','uXuhCwVCEkU','SHUTO (Ryu) vs COSA (Akuma)',null::timestamptz,'High-level replay candidate.','match'),
('ryu-video-yas-johntakeuchi','4n9XY6QU4oI','YAS (Ryu) vs JOHNTAKEUCHI (Jamie)',null::timestamptz,'High-level replay candidate.','match'),
('ryu-video-yas-kazunoko-jamie','ekcjVPEkcHA','KAZUNOKO (Jamie) vs YAS (Ryu)','2026-08-14'::timestamptz,'Post-2026-08-03 high-level replay; video stream inspection pending.','match'),
('ryu-video-yas-hikaru-aki','E0pg7TJeCo4','YAS (Ryu) vs Hikaru (A.K.I.)','2026-08-09'::timestamptz,'Post-2026-08-03 high-level replay.','match'),
('ryu-video-craime-yas-cpt','Fm5IPXmNdeQ','CRAIME vs YAS - CEO / CPT 2026',null::timestamptz,'Tournament footage candidate.','tournament'),
('ryu-video-cosa-sfl-eita','CYDJRFwqIWI','えいた（豪鬼）vs cosa（リュウ）SFL 2026','2026-08-29'::timestamptz,'Official post-patch tournament footage.','tournament'),
('ryu-video-shuto-setplay','BpWyb_iiz7k','しゅーと リュウのセットプレイ・コンボ解説',null::timestamptz,'35:32 guide with chapters at 0:00, 5:01 and 8:47; no captions.','guide')
)v(slug,external_id,title,published_at,description,video_type)
where not exists(select 1 from videos x where x.external_id=v.external_id);

insert into entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,'analysis_backlog',100,'Ryu one-year video audit backlog; do not publish until content/timestamps are reviewed.'
from characters c cross join videos v where c.slug='ryu' and v.slug like 'ryu-video-%'
and not exists(select 1 from entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);

with ctx as(select (select id from characters where slug='ryu') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid), candidates as(
 select 'combo' kind,id,slug,name,notation recipe from combos,ctx where character_id=ctx.cid and slug like 'ryu-y3-%'
 union all select 'setup',id,slug,name,starter_condition||' ＞ '||sequence_text from setups,ctx where character_id=ctx.cid and slug like 'ryu-y3-%'
),ins as(
 insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
 select 'training-'||c.slug,'【旧版成立確認】'||c.name,case when c.kind='combo' then 'combo_retest' else 'oki_retest' end,'直近1年間のレシピが2026.08.31版で成立するか確認する。','advanced',10,ctx.cid,'Sourceと同じ位置・ゲージ・受け身・CH/PC条件を設定。4F、無敵、投げ、ジャンプを必要に応じて記録。','入力履歴・フレーム・ダメージ表示ON。','CPU OFF。',c.recipe,'左右各10回で成立可否、ダメージ、終了F、距離、例外キャラを記録する。',20,'成立すればreviewed、成立しなければarchivedへ。',ctx.pid,'unverified','legacy_candidate','draft'
 from candidates c cross join ctx on conflict(slug) do nothing returning id,slug)
select count(*) from ins;

insert into training_relations(training_id,related_type,related_id)
select t.id,'combo',c.id from trainings t join combos c on t.slug='training-'||c.slug where c.slug like 'ryu-y3-%'
union all select t.id,'setup',s.id from trainings t join setups s on t.slug='training-'||s.slug where s.slug like 'ryu-y3-%'
on conflict(training_id,related_type,related_id) do nothing;
