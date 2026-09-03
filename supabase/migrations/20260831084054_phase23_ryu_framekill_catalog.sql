-- Ryu-only frame-kill catalog from the detailed community setplay table.
-- Values remain reviewed/draft until reproduced on the 2026-08-03 build.
insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select 'リュウ超攻略：セットプレイ一覧','https://note.com/nikotarosun/n/nf893ddf7c836','community_guide','にこ太郎','2025-05-24'::timestamptz,now(),'secondary','Detailed knockdown/frame-kill catalog. Current-patch compatibility must be reproduced.'
where not exists(select 1 from sources where url='https://note.com/nikotarosun/n/nf893ddf7c836');

with ctx as(select (select id from characters where slug='ryu') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),
r(slug,name,starter,seq,adv,pos,description,notes) as(values
('ryu-fk-sweep-pc-jump','大足PC+47→前ジャンプ','しゃがみ強K(PC) +47','最速前ジャンプ ＞ ジャンプ強P','着地+4／J強P後+1候補','any','前ジャンプから表裏を分かりにくくする。','ジャンプ攻撃のタイミングと表裏を実機確認。'),
('ryu-fk-sweep-pc-dash-mp','大足PC+47→前ステ中P','しゃがみ強K(PC) +47','前ステップ ＞ 立ち中P','+8候補','any','持続立ち中Pから攻めを継続。','ヒット+10/ガード+2候補を確認。'),
('ryu-fk-hdonkey-dash2','強足刀+45→前ステ2回','強上段足刀蹴り +45','前ステップ×2 ＞ 投げ / 打撃 / シミー','+7候補','any','強足刀後の密着起き攻め。','受け身とキャラ別投げ間合いを確認。'),
('ryu-fk-hdonkey-dash-crmp','強足刀+45→前ステ2中P','強上段足刀蹴り +45','前ステップ ＞ しゃがみ中P','+4候補','any','自動タイミングの中P重ね。','持続当て結果を確認。'),
('ryu-fk-hdonkey-hasho','強足刀+45→中波掌撃','強上段足刀蹴り +45','中波掌撃','+4候補','any','波掌撃重ねで攻め継続。','ガード/CH/DI結果を確認。'),
('ryu-fk-plus42-5mp','+42→立ち中P空振り消費','弱足刀等 +42','立ち中P空振り ＞ 打撃 / 投げ','+22残り候補','any','+42締めからのフレーム消費。','用途別の後続入力を確認。'),
('ryu-fk-plus42-sweep','+42→大足空振り+9','弱足刀等 +42','しゃがみ強K空振り ＞ 打撃 / 投げ','+9候補','any','短い有利へ調整する。','空振り距離と相手行動を確認。'),
('ryu-fk-plus42-fuhajin35','+42→弱波掌撃空振り+7','弱足刀等 +42','弱波掌撃空振り ＞ 打撃 / 投げ','+7候補','any','+42から投げ打撃択へ。','Source表の全体35Fを現行版で確認。'),
('ryu-fk-plus41-jump','+41詐欺飛び候補','強波掌撃＞弱昇龍ほか +41','最速前ジャンプ ＞ ジャンプ強K','+41','any','+41締めの詐欺飛び候補。','4F/5F/6F無敵ごとに成立を確認。'),
('ryu-fk-mdonkey-hp','中足刀+40→強P空振り+8','中上段足刀蹴り +40','立ち強P空振り ＞ 打撃 / 投げ','+8候補','any','中足刀後の自動フレーム消費。','強P全体Fと距離を確認。'),
('ryu-fk-mdonkey-hk','中足刀+40→強K空振り+5','中上段足刀蹴り +40','立ち強K空振り ＞ 投げ / 打撃 / シミー','+5候補','any','シミー可能候補。','キャラ別投げ間合いを確認。'),
('ryu-fk-odtatsu-ldp-hk','OD竜巻→弱昇龍+39→強K空振り','OD竜巻 ＞ 弱昇龍拳 +39','立ち強K空振り ＞ 投げ / 打撃 / シミー','+4候補','corner','端シミー候補。','後退量と投げ間合いを確認。'),
('ryu-fk-plus38-throw','+38→投げ空振り+8','強波掌撃＞中竜巻等 +38','通常投げ空振り ＞ 打撃 / 投げ','+8候補','any','投げ空振りを使うフレーム消費。','空振りモーションと位置を確認。'),
('ryu-fk-plus38-lp-mp','+38→弱P中P空振り+5','強波掌撃＞中竜巻等 +38','立ち弱P空振り ＞ 立ち中P空振り ＞ 打撃 / 投げ','+5候補','any','二段階フレーム消費。','距離変化を確認。'),
('ryu-fk-ltatsu-throw','弱竜巻+35→投げ空振り+5','弱竜巻旋風脚 +35','通常投げ空振り ＞ 打撃 / 投げ / シミー','+5候補','any','弱竜巻後のシミー候補。','ザンギ・マリーザ等の投げ間合い差を確認。'),
('ryu-fk-plus34-throw','+34→投げ空振り+4','OD竜巻＞中昇龍等 +34','通常投げ空振り ＞ 打撃 / 投げ','+4候補','any','+34締めの最小有利調整。','広い投げ間合いのキャラは別択へ。'),
('ryu-fk-sweep-dr-overhead','大足+32→DR中段持続','しゃがみ強K +32','ドライブラッシュ鎖骨割り','ヒット+8／ガード+4候補','any','大足後の中段持続当て。','2段の当たり方と無敵対応を確認。'),
('ryu-fk-odtatsu-hdp-crlp-lk','OD竜巻→強昇龍+31→弱P弱K','OD竜巻 ＞ 強昇龍拳 +31','立ち弱P空振り ＞ しゃがみ弱K','+5候補','corner','下段重ねと投げの二択。','Source表のF消費を確認。'),
('ryu-fk-hdp-dash2','強昇龍+29→前ステ2回','小技＞強昇龍拳 +29','前ステップ×2 ＞ 投げ / 打撃 / 後ろ歩き','source-described','any','強昇龍締めの基本追走。','Source間で有利値差があるため実機確定待ち。'),
('ryu-fk-mtatsu-fireball','中竜巻+23→弱波動持続','中竜巻旋風脚 +23','一瞬遅らせ弱波動拳 ＞ 引き強P','ヒット+9／ガード+3候補','corner','端到達時の弾重ね。','遅らせ量、SA1相打ち、DIを確認。'),
('ryu-fk-mtatsu-dash','中竜巻+23→前ステ+4','中竜巻旋風脚 +23','前ステップ ＞ 投げ / 打撃','+4候補','corner','端到達時の密着択。','中央では距離不足。'),
('ryu-fk-plus22-overhead','+22→中段持続','フレーム有利 +22','鎖骨割り','ヒット+5／ガード+1候補','corner','中段持続から小技コンボ。','Source表の持続段を確認。'),
('ryu-fk-plus21-odhasho','+21→OD波掌撃+7','フレーム有利 +21','OD波掌撃','ヒット/ガード+7候補','any','有利を保つDrive連携。','DI・Dリバ・パリィ対応を確認。'),
('ryu-fk-plus16-lhasho','+16→弱波掌撃持続','フレーム有利 +16','弱波掌撃','ヒット+7／ガード+2候補','any','弱波掌撃持続重ね。','最速暴れ相打ち時の追撃を確認。'),
('ryu-fk-plus14-odfireball','+14→OD波動+2','フレーム有利 +14','OD波動拳 ＞ 投げ / 打撃 / 後退','ガード+2候補','any','弾重ね後の投げ間合い調整。','最速投げと微遅らせで間合いが変わる。'),
('ryu-fk-denjin-charge-plus8','波掌撃→DR弱K→電刃+8','強波掌撃 ＞ DR立ち弱K ＞ 電刃錬気','立ち中P / 弱波掌撃 / 投げ','+8候補','corner','電刃取得後の起き攻め。','立ち中Pはヒット+10/ガード+2候補。'),
('ryu-fk-odtatsu-denjin-plus5','OD竜巻→電刃+5','OD竜巻 ＞ 電刃錬気','立ち弱P / 投げ / しゃがみ強P','+5候補','corner','端で電刃取得しつつ攻め継続。','シミー可否と4F相打ちを確認。')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.cid,r.slug,r.name,'frame_kill',r.starter,r.seq,r.adv,r.pos,r.description,r.notes,ctx.pid,'reviewed','strategy','draft' from r cross join ctx on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',s.id,src.id,'supporting','Detailed frame-kill table; reviewed pending 2026-08-03 reproduction.' from setups s cross join sources src
where s.slug like 'ryu-fk-%' and src.url='https://note.com/nikotarosun/n/nf893ddf7c836'
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as(select (select id from characters where slug='ryu') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid), ins as(
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||s.slug,'【Frame Kill確認】'||s.name,'oki','Source記載の有利F・持続当て・距離条件を確定する。','advanced',8,ctx.cid,'4F、投げ、ジャンプ、OD無敵、パリィを記録。通常/後方受け身を必要に応じて切替。','Random playback。フレーム・入力履歴ON。','CPU OFF。',s.starter_condition||' ＞ '||s.sequence_text,'左右各10回で有利F、持続当て、投げ間合い、無敵対応を記録する。',20,'成立結果をSetupへ反映する。',ctx.pid,'reviewed','training','draft'
from setups s cross join ctx where s.slug like 'ryu-fk-%' on conflict(slug) do nothing returning id,slug)
select count(*) from ins;

insert into training_relations(training_id,related_type,related_id)
select t.id,'setup',s.id from trainings t join setups s on t.slug='training-'||s.slug where s.slug like 'ryu-fk-%'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,src.id,'supporting','Frame-kill recipe source; reviewed, not verified.' from trainings t cross join sources src
where t.slug like 'training-ryu-fk-%' and src.url='https://note.com/nikotarosun/n/nf893ddf7c836'
on conflict(entity_type,entity_id,source_id) do nothing;
