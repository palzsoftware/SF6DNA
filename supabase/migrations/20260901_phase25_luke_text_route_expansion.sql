-- Additional Luke routes extracted from current-patch written guides.
-- Values remain reviewed/draft article claims until device reproduction.

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,combo_type,notation,starter,damage,drive_cost,sa_cost,position,difficulty,purpose,conditions,notes) as (values
 ('luke-y4-hk-meaty-cmp-ddt','立ち強K持続→しゃがみ中P→DDT','meaty_confirm','5HK(meaty) > 2MP > 214PP > PP','5HK meaty',3570,2,0,'any',3,'持続重ねヒット時の安定火力','5HK持続当て。','記事記載3570。'),
 ('luke-y4-hk-meaty-cmp-odflash-sa1','立ち強K持続→しゃがみ中P→ODフラ→SA1','meaty_confirm','5HK(meaty) > 2MP > 214PP > SA1','5HK meaty',3540,2,1,'any',3,'持続重ねからSA1','5HK持続当て。','記事記載3540。'),
 ('luke-y4-corner-light-odflash-sand-upper','端小技→ODフラ→弱サンド→弱ライジング','corner','2LK > 2LP > 214PP > 236LP > 623LP','2LK',1810,2,0,'corner',3,'端小技の安定締め','Year4 current article.','記事記載1810。SA2締め2760。'),
 ('luke-y4-corner-light-odflash-mflash-sa3','端小技→ODフラ→中フラ→SA3','corner_lethal','2LK > 2LP > 214PP > 214MP > SA3','2LK',3540,2,3,'corner',4,'端小技リーサル','SA3 available.','記事記載3540。'),
 ('luke-y4-corner-dr-bhk-pc-hk-ddt','端DRサプレッサーPC→立ち強K持続→DDT','punish_counter','DR > 4HK(PC) > 5HK(meaty) > 2MP > 214PP > PP','DR 4HK punish counter',4360,3,0,'corner',5,'無敵技読みのクラシック最大候補','Classic only。端。','記事記載4360。'),
 ('luke-y4-hp-lflash-charge-sa2','立ち強P→弱最大溜め→弱フラ→SA2','sa2','5HP > 214LP(max charge) > 214LP > SA2','5HP',3730,0,2,'midscreen',3,'SA2リーサル候補','弱フラ最大溜め。','記事記載3730。'),
 ('luke-y4-doubleimpact-pc-charge-sa3','ダブルインパクトPC→溜めナックル→SA3','punish_counter','6HP(PC) > HP > 214MP(max charge) > 214LP(max charge) > 214MP > SA3','6HP punish counter',5160,0,3,'midscreen',4,'差し返しSA3リーサル','中フラからSA3キャンセル。','記事記載5160。')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,damage,drive_cost,sa_cost,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.combo_type,r.notation,r.starter,r.damage,r.drive_cost,r.sa_cost,r.position,r.difficulty,r.purpose,r.conditions,r.notes,ctx.patch_id,'reviewed','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,sequence_type,sequence_text,mash_point,throw_point,shimmy_point,jump_option,parry_option,invincible_option,notes) as (values
 ('luke-y4-lflash-plus36-dr-mix','弱フラ+36後のDR三択','oki_sequence','弱フラッシュナックル(+36) > 前ステ(+17) > DR停止 > 2MP / 投げ / 4HK / 遅らせ2MP','2MP持続重ねを4Fで検証','DR停止後に投げ','後ろ歩き、または4HKで投げ抜け狩り','4HKでジャンプ・バクステを狩る','ジャスパ読みは投げ分岐','DRへ発生の速い無敵技','記事ではDR停止後のフレームが経路で異なるため、各分岐を別々に確認する。'),
 ('luke-y4-hupper-plus29-dr-mix','強ライジング根本後のDR中下段投げ','oki_sequence','強ライジング根本(+29) > DR > 6MP / 2LK / 投げ / 5LK空振りフェイント','6MPと2LKの隙間を確認','DR投げ','5LK空振り後の様子見','中段を見せて下段へ分岐','中段ジャスパ読み投げ','5LK空振りでSA暴れ確認','空中ヒット高度で+29～31程度に変動する記事注意あり。'),
 ('luke-y4-corner-forwardthrow-loop','端前投げ後の柔道・打撃・シミー','throw_sequence','端前投げ(+19) > 前歩き > 前投げ / 2MP / シミー、または前ステ > 2LP / 投げ','2MP重ねを4Fで確認','最大+5投げの体感調整','前歩き後ろ歩き','ジャンプ・バクステへの打撃確認','前ステ後は暗転確認パリィ候補','リバサSAを前ステで確認','確定連携ではなく、端投げ後の読み合い。')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.sequence_type,r.sequence_text,false,r.mash_point,r.throw_point,r.shimmy_point,r.jump_option,r.parry_option,null,r.invincible_option,r.notes,ctx.patch_id,'reviewed','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with entities as (
 select 'combo' entity_type,id,slug from combos where slug like 'luke-y4-%'
 union all select 'sequence',id,slug from sequences where slug like 'luke-y4-%'
), src as (select id from sources where url='https://takukakugamer.com/sf6-luke-combo/' order by accessed_at desc limit 1),
setup_src as (select id from sources where url='https://takukakugamer.com/sf6-luke-setup/' order by accessed_at desc limit 1)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select e.entity_type,e.id,case when e.entity_type='combo' then src.id else setup_src.id end,'supporting','2026-08 current-patch written guide; device verification pending.'
from entities e cross join src cross join setup_src
where e.slug in (
 'luke-y4-hk-meaty-cmp-ddt','luke-y4-hk-meaty-cmp-odflash-sa1','luke-y4-corner-light-odflash-sand-upper',
 'luke-y4-corner-light-odflash-mflash-sa3','luke-y4-corner-dr-bhk-pc-hk-ddt','luke-y4-hp-lflash-charge-sa2',
 'luke-y4-doubleimpact-pc-charge-sa3','luke-y4-lflash-plus36-dr-mix','luke-y4-hupper-plus29-dr-mix','luke-y4-corner-forwardthrow-loop')
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), entities as (
 select 'combo' related_type,id,slug,name,notation method from combos where slug in (
  'luke-y4-hk-meaty-cmp-ddt','luke-y4-hk-meaty-cmp-odflash-sa1','luke-y4-corner-light-odflash-sand-upper',
  'luke-y4-corner-light-odflash-mflash-sa3','luke-y4-corner-dr-bhk-pc-hk-ddt','luke-y4-hp-lflash-charge-sa2','luke-y4-doubleimpact-pc-charge-sa3')
 union all
 select 'sequence',id,slug,name,sequence_text from sequences where slug in (
  'luke-y4-lflash-plus36-dr-mix','luke-y4-hupper-plus29-dr-mix','luke-y4-corner-forwardthrow-loop')
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【記事記載値確認】'||e.name,
 case when e.related_type='combo' then 'combo_retest' else 'pressure_retest' end,
 '2026年8月の記事記載ルートを現行版で再現する。','advanced',12,ctx.character_id,
 '入力履歴・フレーム・ダメージ・Drive/SAを表示。中央/端、CH/PC、Classic/Modernを指定どおり設定。','記事と同じ条件。','CPU OFF。',e.method,
 '左右各10回で成立、ダメージ、有利、ゲージ、受け身、キャラ差を記録する。',20,'成立ならverified候補、非成立ならarchivedへ。',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join entities e on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.related_type,e.id
from trainings t
join (
 select 'combo' related_type,id,slug from combos
 union all select 'sequence',id,slug from sequences
) e on t.slug='training-'||e.slug
where e.slug in (
 'luke-y4-hk-meaty-cmp-ddt','luke-y4-hk-meaty-cmp-odflash-sa1','luke-y4-corner-light-odflash-sand-upper',
 'luke-y4-corner-light-odflash-mflash-sa3','luke-y4-corner-dr-bhk-pc-hk-ddt','luke-y4-hp-lflash-charge-sa2',
 'luke-y4-doubleimpact-pc-charge-sa3','luke-y4-lflash-plus36-dr-mix','luke-y4-hupper-plus29-dr-mix','luke-y4-corner-forwardthrow-loop')
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Source inherited from related Luke strategy entity.'
from trainings t
join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.slug like 'training-luke-y4-%'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.name ilike '%SA2%' or t.name ilike '%SA3%' then 30 else 50 end,
 '記事記載の現行ルート。成立・ダメージ・ゲージ・終了Fを撮影して確認する。'
from trainings t
where t.slug in (
 'training-luke-y4-hk-meaty-cmp-ddt','training-luke-y4-hk-meaty-cmp-odflash-sa1','training-luke-y4-corner-light-odflash-sand-upper',
 'training-luke-y4-corner-light-odflash-mflash-sa3','training-luke-y4-corner-dr-bhk-pc-hk-ddt','training-luke-y4-hp-lflash-charge-sa2',
 'training-luke-y4-doubleimpact-pc-charge-sa3','training-luke-y4-lflash-plus36-dr-mix','training-luke-y4-hupper-plus29-dr-mix','training-luke-y4-corner-forwardthrow-loop')
on conflict(training_id) do nothing;
