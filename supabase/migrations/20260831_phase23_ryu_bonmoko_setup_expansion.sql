-- Ryu setup candidates transcribed from a 2025-05-14 recipe-level note.
-- These are deliberately quarantined as legacy_candidate/unverified/draft until
-- reproduced on the 2026-08-03 patch. Source frame claims are not verification.

with ctx as (
  select (select id from characters where slug='ryu') ryu_id,
         (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.ryu_id,'ryu-y3-note-odtatsu-lhasho42','端OD竜巻→弱波掌撃+42候補','oki',
       '小技×3 ＞ OD竜巻旋風脚 ＞ 弱波掌撃','小技','corner',3,'Drive使用の詐欺飛び移行',
       '2025-05-14記事。画面端。','記事は+42Fと記載。現行版の追撃可否・受け身・終了Fを実機確認。',
       ctx.patch_id,'unverified','legacy_candidate','draft'
from ctx on conflict(slug) do nothing;

with ctx as (
  select (select id from characters where slug='ryu') ryu_id,
         (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,setup_type,starter,recipe,frame_claim,position,meter,description,counter_notes) as (values
('ryu-y3-note-ltatsu-dash-walk','弱竜巻→前ステ微歩き投げ／打撃','oki','弱竜巻旋風脚地上ヒット','前ステップ ＞ 微歩き ＞ 前投げ / 打撃','source-described','any','none','ノーDriveで密着択へ移行する候補。','微歩き量、後方受け身、4F、無敵技を確認。'),
('ryu-y3-note-ltatsu-dash-gosho','弱竜巻→前ステ鳩尾砕き相打ち','trade_setup','弱竜巻旋風脚地上ヒット','前ステップ ＞ 鳩尾砕き ＞ 4F相打ち時に立ち強P追撃','source-described','any','none','暴れとの相打ちから追撃する候補。','相打ち技・距離で状況が変わる。確定連携ではない。'),
('ryu-y3-note-hdp-corner-lp-hasho-gosho','端強昇龍→弱P空振り→波掌撃／鳩尾砕き','meaty','画面端：強昇龍拳締め','立ち弱P空振り ＞ 弱波掌撃 / 鳩尾砕き','source-described','corner','none','弱波掌撃持続と、ジャストパリィずらしの鳩尾砕き分岐。','両分岐は確定ではない。4F、パリィ、無敵技を個別確認。'),
('ryu-y3-note-hdp-corner-clk-hp','端強昇龍→しゃがみ弱K空振り→強P持続','meaty','画面端：強昇龍拳締め','しゃがみ弱K空振り ＞ 立ち強P','guard +2 / hit +8 claim','corner','none','立ち強Pの持続重ね候補。','記事記載Fを現行フレーム表示で確認。'),
('ryu-y3-note-odtatsu-lhasho-safejump','端OD竜巻→弱波掌撃→詐欺飛び','safe_jump','画面端：小技×3 ＞ OD竜巻 ＞ 弱波掌撃','最速前ジャンプ ＞ ジャンプ強K / 透かし下段 / 透かし投げ','+42 claim','corner','drive','OD竜巻から+42F締めを選ぶ詐欺飛び候補。','4F・各OD無敵・遅らせ打撃・受け身を確認。'),
('ryu-y3-note-odtatsu-hdp-crmk','端OD竜巻→強昇龍→中足空振り','shimmy','画面端：OD竜巻 ＞ 強昇龍拳','しゃがみ中K空振り ＞ 後退 / 投げ / 打撃','+2 outside throw claim','corner','drive','投げ間合い外からのシミー候補。','相手キャラの通常投げ・コマ投げ間合い差を確認。'),
('ryu-y3-note-sa2-odhasho-bhp','溜めSA2→しゃがみ強P→OD波掌撃→引き強P','resource_pressure','しゃがみ中P ＞ OD足刀 ＞ 溜めSA2 ＞ 強竜巻後','しゃがみ強P ＞ OD波掌撃 ＞ 引き強P','SA2 end +7 to +10 claim','corner','drive_sa','SA2で端へ運んだ後にDriveを削る攻め候補。','SA2溜め量で終了Fが変化。引き強Pの相打ち追撃を確認。'),
('ryu-y3-note-di-side-switch-reset','DI入れ替え→中P空振り→再DI','impact_setup','被画面端DI PC ＞ 前ステップ ＞ しゃがみ強P ＞ OD足刀 ＞ 前ステップ ＞ 中昇龍','中昇龍をしゃがみ中P空振りに変更 ＞ ドライブインパクト','source-described','corner','drive','入れ替えコンボのダメージを捨てて再DIを重ねる候補。','DI返し、パリィ、無敵技、ジャンプ可否を確認。'),
('ryu-y3-note-senpu-odtatsu-whiff-mp','端旋風脚→OD竜巻→旋風脚空振り→中P','meaty','画面端：旋風脚ヒット ＞ OD竜巻','旋風脚空振り ＞ 立ち中P','guard +2 / hit +10 claim','corner','drive','立ち中P持続重ね候補。','記事記載は投げ間合い外。距離と現行Fを確認。'),
('ryu-y3-note-mdonkey-dash-overhead','端中足刀→前ステ→中段持続','overhead','画面端：中上段足刀蹴り地上ヒット','前ステップ ＞ 鎖骨割り','hit +4 claim','corner','none','展開の速い持続中段候補。','記事は立ち弱K非接続と記載。ヒット時の最適追撃を確認。'),
('ryu-y3-note-hdonkey-mdp-clp2-mp','端強足刀→中昇龍→弱P×2空振り→中P','meaty','画面端：強足刀 ＞ 中昇龍拳','しゃがみ弱P空振り×2 ＞ 立ち中P','guard +2 / hit +9 claim','corner','none','中P持続から引き強Pへつなぎ攻めを循環させる候補。','2回の空振り入力猶予、投げ間合い、現行Fを確認。')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,meter_condition,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.ryu_id,r.slug,r.name,r.setup_type,r.starter,r.recipe,r.frame_claim,r.position,r.meter,r.description,r.counter_notes,
       ctx.patch_id,'unverified','legacy_candidate','draft'
from rows r cross join ctx on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',c.id,s.id,'supporting','2025 recipe source; current-patch reproduction pending.'
from combos c cross join sources s
where c.slug='ryu-y3-note-odtatsu-lhasho42'
  and s.url='https://note.com/bonmoko_3/n/n6f0e26063ea9'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','2025 recipe source; current-patch reproduction pending.'
from setups x cross join sources s
where x.slug like 'ryu-y3-note-%'
  and s.url='https://note.com/bonmoko_3/n/n6f0e26063ea9'
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
  select (select id from characters where slug='ryu') ryu_id,
         (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), candidates as (
  select 'combo' entity_type,id,slug,name,notation recipe,purpose
  from combos,ctx where character_id=ctx.ryu_id and slug='ryu-y3-note-odtatsu-lhasho42'
  union all
  select 'setup',id,slug,name,starter_condition||' ＞ '||sequence_text,description
  from setups,ctx where character_id=ctx.ryu_id and slug like 'ryu-y3-note-%'
), ins as (
  insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
  select 'training-'||c.slug,'【旧版成立確認】'||c.name,
         case when c.entity_type='combo' then 'combo_retest' else 'oki_retest' end,
         c.purpose,'advanced',10,ctx.ryu_id,
         '記事と同じ位置・ゲージ・受け身を設定し、4F、ガード、パリィ、DI、OD無敵技を必要に応じて記録。',
         'Random playback。入力履歴・フレーム・ダメージ・Drive/SA表示ON。','CPU OFF。',c.recipe,
         '左右各10回で成立可否、Damage、消費ゲージ、終了F、距離、受け身、キャラ差を記録。',20,
         '成立ならreviewed、非成立ならarchivedへ。',ctx.patch_id,'unverified','legacy_candidate','draft'
  from candidates c cross join ctx on conflict(slug) do nothing returning id,slug
)
select count(*) from ins;

insert into training_relations(training_id,related_type,related_id)
select t.id,'combo',c.id from trainings t join combos c on t.slug='training-'||c.slug
where c.slug='ryu-y3-note-odtatsu-lhasho42'
on conflict(training_id,related_type,related_id) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,'setup',s.id from trainings t join setups s on t.slug='training-'||s.slug
where s.slug like 'ryu-y3-note-%'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','2025 recipe source; current-patch reproduction pending.'
from trainings t cross join sources s
where t.slug like 'training-ryu-y3-note-%'
  and s.url='https://note.com/bonmoko_3/n/n6f0e26063ea9'
on conflict(entity_type,entity_id,source_id) do nothing;
