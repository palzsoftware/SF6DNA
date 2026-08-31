-- Timestamped Ryu Season 3 routes extracted from YouTube auto-captions.
-- Captions establish the spoken recipe/intent, but not every visually displayed
-- input. Therefore all rows remain legacy_candidate/unverified/draft.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
values(
  'SF6 Season 3 Ryu Ultimate Guide - Combos, Frame Traps, Setups',
  'https://www.youtube.com/watch?v=2cN27UUF95g',
  'video','ThisIsAMKIDD',null,now(),'secondary',
  'English auto-caption transcript extracted 2026-08-31. Timestamped spoken recipes; visually displayed inputs still require video/device review.'
)
on conflict do nothing;

update sources
set accessed_at=now(),
    notes='English auto-caption transcript extracted 2026-08-31. Timestamped spoken recipes; visually displayed inputs still require video/device review.'
where url='https://www.youtube.com/watch?v=2cN27UUF95g';

with ctx as (
  select (select id from characters where slug='ryu') ryu_id,
         (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,combo_type,notation,starter,position,difficulty,purpose,conditions,notes) as (values
('ryu-y3-video-crlp-hasho-side-switch-sa3','しゃがみ弱P波掌撃罠→入れ替えSA3候補','side_switch',
 'しゃがみ弱P ＞ 波掌撃フレームトラップ(CH) ＞ DRしゃがみ中P ＞ OD上段足刀蹴り ＞ 前ステップ ＞ 自動振り向き昇龍拳 ＞ 逆方向SA3',
 'しゃがみ弱Pからの波掌撃フレームトラップ','corner',5,'端からの入れ替えリーサル',
 '動画1:06～1:24。CH前提。','昇龍強度、波掌撃強度、DR種別、各キャンセル猶予は映像/実機確認待ち。'),
('ryu-y3-video-slp-hasho-side-switch-sa3','立ち弱P波掌撃罠→立ち強P入れ替えSA3候補','side_switch',
 '立ち弱P ＞ 波掌撃フレームトラップ(CH) ＞ DR立ち強P ＞ OD上段足刀蹴り ＞ 前ステップ ＞ 自動振り向き昇龍拳 ＞ 逆方向SA3',
 '立ち弱Pからの波掌撃フレームトラップ','corner',5,'端からの入れ替えリーサル',
 '動画1:25～1:36。','字幕はしゃがみ中Pだと相手が高すぎて空振り、立ち強Pを使うと説明。細部は要確認。'),
('ryu-y3-video-denjin-sa2-manual-dr','電刃SA2 Stage2→手動DR遅らせ強P候補','max_damage',
 '立ち強P ＞ 電刃SA2 Stage2 ＞ 手動DRしゃがみ強P(各段を少し遅らせる・回数は映像確認) ＞ 強上段足刀蹴り ＞ SA1',
 '電刃あり立ち強P','any',5,'電刃SA2最大火力候補',
 '動画1:40～3:20。全リソース使用候補。','字幕で手動DRと各しゃがみ強Pの遅らせ、強足刀後SA1を確認。反復回数とDamageは未確定。')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.ryu_id,r.slug,r.name,r.combo_type,r.notation,r.starter,r.position,r.difficulty,r.purpose,r.conditions,r.notes,
       ctx.patch_id,'unverified','legacy_candidate','draft'
from rows r cross join ctx on conflict(slug) do nothing;

with ctx as (
  select (select id from characters where slug='ryu') ryu_id,
         (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,sequence_type,sequence_text,is_true,mash,throw_point,shimmy,jump_opt,parry_opt,drev,invincible,notes) as (values
('ryu-y3-video-dr-clk-crmp-trap','DRしゃがみ弱K→しゃがみ中P 4F潰し','frame_trap',
 'ドライブラッシュしゃがみ弱Kガード ＞ しゃがみ中P',false,
 '動画5:19～5:33は4F小技を安定して潰すと説明',null,null,'バックジャンプ時は別途SA1候補','パリィ/ジャスパを確認','Dリバを確認','無敵技には負ける',
 '2026年共通しゃがみ弱K変更後の連携。ガード距離と真の隙間を現行フレーム表示で確認。'),
('ryu-y3-video-dr-clk-bhp-trade','DRしゃがみ弱K→引き強P相打ち追撃','trade_sequence',
 'ドライブラッシュしゃがみ弱Kガード ＞ 引き強P ＞ 4F相打ち時しゃがみ中P / しゃがみ中K / 立ち強P',false,
 '引き強Pが4Fと相打ちしても追撃可能との字幕',null,null,'ジャンプ可否を確認','パリィ/ジャスパを確認','Dリバを確認','無敵技には負ける',
 '動画5:40～6:12。引き強Pがガードされ未キャンセルだと不利と説明。確定連携ではない。'),
('ryu-y3-video-tickthrow-jump-sa1','中足DR弱P投げ択→ジャンプ逃げSA1','jump_escape_punish',
 'しゃがみ中K ＞ Cラッシュ立ち弱P ＞ 前投げ択 ＞ 相手バックジャンプ/垂直ジャンプ確認 ＞ SA1',false,
 null,'弱Pから投げ択','投げ抜け狩りは別分岐','動画8:00～8:21はジャンプ下降をSA1で狩ると説明','パリィには投げ択','Dリバ可否を確認','無敵読みはガード',
 '高速化SA1による反応狩り。字幕はoption select未発見と明言しており、確定OS扱い禁止。')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.ryu_id,r.slug,r.name,r.sequence_type,r.sequence_text,r.is_true,r.mash,r.throw_point,r.shimmy,r.jump_opt,r.parry_opt,r.drev,r.invincible,r.notes,
       ctx.patch_id,'unverified','legacy_candidate','draft'
from rows r cross join ctx on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',c.id,s.id,'supporting','Timestamped auto-caption evidence; displayed inputs and current-patch reproduction pending.'
from combos c cross join sources s
where c.slug like 'ryu-y3-video-%' and s.url='https://www.youtube.com/watch?v=2cN27UUF95g'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',q.id,s.id,'supporting','Timestamped auto-caption evidence; current-patch reproduction pending.'
from sequences q cross join sources s
where q.slug like 'ryu-y3-video-%' and s.url='https://www.youtube.com/watch?v=2cN27UUF95g'
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
  select (select id from characters where slug='ryu') ryu_id,
         (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), candidates as (
  select 'combo' entity_type,id,slug,name,notation recipe,purpose from combos,ctx
   where character_id=ctx.ryu_id and slug like 'ryu-y3-video-%'
  union all
  select 'sequence',id,slug,name,sequence_text,notes from sequences,ctx
   where character_id=ctx.ryu_id and slug like 'ryu-y3-video-%'
), ins as (
  insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
  select 'training-'||c.slug,'【動画成立確認】'||c.name,
         case when c.entity_type='combo' then 'combo_retest' else 'pressure_retest' end,
         c.purpose,'advanced',12,ctx.ryu_id,
         '動画Timestampと同じ位置・電刃・Drive・SAを設定。4F、ガード、ジャンプ、パリィ、DI、OD無敵を必要に応じて記録。',
         'Random playback。入力履歴・フレーム・ダメージ・Drive/SA表示ON。','CPU OFF。',c.recipe,
         '左右各10回で成立可否、Damage、消費ゲージ、終了F、距離、キャラ差を記録。',20,
         '映像または実機で不足入力を確定後、reviewedへ個別昇格する。',ctx.patch_id,'unverified','legacy_candidate','draft'
  from candidates c cross join ctx on conflict(slug) do nothing returning id,slug
)
select count(*) from ins;

insert into training_relations(training_id,related_type,related_id)
select t.id,'combo',c.id from trainings t join combos c on t.slug='training-'||c.slug
where c.slug like 'ryu-y3-video-%'
on conflict(training_id,related_type,related_id) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,'sequence',q.id from trainings t join sequences q on t.slug='training-'||q.slug
where q.slug like 'ryu-y3-video-%'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Timestamped auto-caption evidence; current-patch reproduction pending.'
from trainings t cross join sources s
where t.slug like 'training-ryu-y3-video-%' and s.url='https://www.youtube.com/watch?v=2cN27UUF95g'
on conflict(entity_type,entity_id,source_id) do nothing;

update videos
set description='Auto-caption transcript analyzed 2026-08-31. Extracted timestamped candidates at 1:06-1:36, 1:40-3:20, 5:19-6:12 and 8:00-8:21; displayed inputs still pending visual/device verification.'
where url='https://www.youtube.com/watch?v=2cN27UUF95g';
