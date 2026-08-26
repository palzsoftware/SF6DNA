-- JP content package seed (2026-08-26)
-- Current patch target: 2026.08.03
-- IMPORTANT: strategy rows remain draft. reviewed != verified/published.

with ctx as (
  select c.id character_id, p.id patch_id
  from public.characters c cross join public.patches p
  where c.slug='jp' and p.is_current=true
)
insert into public.combos
(character_id,slug,name,combo_type,notation,starter_text,drive_cost,sa_cost,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,v.*,ctx.patch_id,'reviewed','strategy','draft'
from ctx cross join (values
 ('jp-basic-light-sa3','小技始動 SA3基本','confirm','5LP > 5LP > 5LP > 弱ストリボーグ > SA3 ザプリェット','5LP',0::numeric,3::smallint,'any',1::smallint,'小技確認からSA3','SA3使用可能','2026-07 guide candidate; current-patch lab check pending.'),
 ('jp-light-cdr-sa1','小技CDRからSA1','confirm','5LP > 5LP > 5LP > CDR > 5LP > 5MP > 派生MP > SA1 チェルノボーグ','5LP',3::numeric,1::smallint,'any',3::smallint,'小技から火力と運び','Drive 3+ / SA1','Current-patch lab check pending.'),
 ('jp-dr-mk-sa3','DR中K始動 SA3','neutral','DR > 5MK > 5MP > 中ストリボーグ > SA3 ザプリェット','DR 5MK',1::numeric,3::smallint,'any',2::smallint,'ラッシュ始動リーサル','Drive Rush / SA3','Current-patch lab check pending.'),
 ('jp-di-wall-safejump','DI壁やられ 詐欺飛び締め','wall','DI(壁) > 5MP > 5HK > 中ストリボーグ > 5HP > 中ストリボーグ > ジャンプ攻撃','DI wall',1::numeric,0::smallint,'corner',3::smallint,'壁やられから+42F詐欺飛び','Corner DI wall splat','Source labels +42F; lab verification pending.'),
 ('jp-di-wall-sa3','DI壁やられ SA3','wall','DI(壁) > 5MP > 5HK > 中ストリボーグ > 5HP > トリグラフ > SA3 ザプリェット','DI wall',1::numeric,3::smallint,'corner',2::smallint,'壁やられ高火力','Corner / SA3','Current-patch lab check pending.'),
 ('jp-di-pc-sa3','DIパニカン SA3','punish','DI(PC) > 前歩き > 5HP > 強ストリボーグ > 中トルバラン > 強トリグラフ > SA3 ザプリェット','DI punish counter',1::numeric,3::smallint,'any',3::smallint,'DIパニカン最大寄り','SA3','Current-patch lab check pending.'),
 ('jp-di-pc-vihhat-plus15','DIパニカン ヴィーハト+15F','oki','DI(PC) > 垂直JHK > ディレイ5HK > 中ストリボーグ > 5HP > ヴィーハト','DI punish counter',1::numeric,0::smallint,'any',4::smallint,'設置起き攻めへ移行','Timing sensitive','Source labels +15F; lab verification pending.'),
 ('jp-di-pc-safejump42','DIパニカン +42F詐欺飛び','oki','DI(PC) > 垂直JHK > ディレイ5HK > 中ストリボーグ > 5HP > 中ストリボーグ > ジャンプ攻撃','DI punish counter',1::numeric,0::smallint,'any',4::smallint,'詐欺飛び起き攻め','Timing sensitive','Source labels +42F; lab verification pending.'),
 ('jp-mine-light-conversion','設置起爆 小技始動','setup','2LK > 2LP > 弱ストリボーグ > 設置起爆 > JMK > 5HP > トリグラフ','2LK',0::numeric,0::smallint,'any',4::smallint,'ヴィーハト設置からの実戦変換','Vihhat active','2026-03 article candidate.'),
 ('jp-vihhat-teleport-conversion','ODヴィーハト・アクノ変換','setup','ODヴィーハト設置 > 中ヴィーハト・アクノ > JLK > 2LP > 設置起動 > 6HK > 中ストリボーグ > 5HP > トリグラフ','OD Vihhat setup',2::numeric,0::smallint,'any',5::smallint,'設置ワープから変換','OD Vihhat active','Timing/spacing lab check pending.')
) v(slug,name,combo_type,notation,starter_text,drive_cost,sa_cost,position,difficulty,purpose,conditions,notes)
on conflict(slug) do update set notation=excluded.notation,notes=excluded.notes,updated_at=now();

with ctx as (select c.id character_id,p.id patch_id from public.characters c cross join public.patches p where c.slug='jp' and p.is_current=true)
insert into public.setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,meter_condition,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,v.*,ctx.patch_id,v.verification_status,'strategy','draft'
from ctx cross join (values
 ('jp-vihhat-plus15-after-di-pc','DIパニカン後ヴィーハト +15F','oki','DI punish counter','垂直JHK > ディレイ5HK > 中ストリボーグ > 5HP > ヴィーハト','+15F','any','Drive 1+','設置を残して起き攻めへ移行。','受け身・距離・設置位置を再確認。','reviewed'),
 ('jp-safejump42-after-di-pc','DIパニカン後 +42F詐欺飛び','safejump','DI punish counter','垂直JHK > ディレイ5HK > 中ストリボーグ > 5HP > 中ストリボーグ > 前ジャンプ攻撃','+42F','any','Drive 1+','Source labels safe jump +42F.','Character-specific wakeup check pending.','reviewed'),
 ('jp-safejump42-after-di-wall','DI壁やられ後 +42F詐欺飛び','safejump','DI wall splat','5MP > 5HK > 中ストリボーグ > 5HP > 中ストリボーグ > 前ジャンプ攻撃','+42F','corner','Drive 1+','壁やられからの詐欺飛び候補。','Current patch verification pending.','reviewed'),
 ('jp-di-pc-side-switch-vihhat','DIパニカン入れ替えヴィーハト','side_switch','DI punish counter','ODヴィーハト > LP > 中ストリボーグ > 前ステップ×2 > 前ジャンプ > ディレイJMK > 5HP > ヴィーハト',null,'corner','OD Vihhat','端から入れ替えて設置起き攻めへ。','Exact spacing/timing sensitive.','reviewed'),
 ('jp-sa2-vihhat-oki-route','SA2からヴィーハト起き攻め','sa2_oki','SA2 hit','SA2ラヴーシュカ中の追撃 > ヴィーハト設置へ移行',null,'any','SA2','SA2から設置を残す方針。','具体ルートは距離/始動依存。','unverified'),
 ('jp-vihhat-teleport-oki','ヴィーハト設置ワープ択','setplay','Vihhat active','ヴィーハト設置 > アクノ(ワープ) > 打撃/投げ/様子見',null,'any','Vihhat','設置とワープを使う択。','暴れ・無敵・パリィ分岐を個別検証。','unverified')
) v(slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,meter_condition,description,counter_notes,verification_status)
on conflict(slug) do update set sequence_text=excluded.sequence_text,verification_status=excluded.verification_status,updated_at=now();

with ctx as (select c.id character_id,p.id patch_id from public.characters c cross join public.patches p where c.slug='jp' and p.is_current=true)
insert into public.sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,v.slug,v.name,v.sequence_type,v.sequence_text,false,v.notes,ctx.patch_id,v.verification_status,'strategy','draft'
from ctx cross join (values
 ('jp-5hk-plus2-pressure','5HKガード+2後の近距離択','pressure','5HK(ガード+2) > 打撃/投げ/シミー','距離依存。保証連携とは扱わない。','unverified'),
 ('jp-vihhat-trigger-pressure','ヴィーハト起動を使った固め','setup_pressure','ヴィーハト設置 > 本体打撃/投げ > 設置起動','Exact gaps not asserted.','unverified'),
 ('jp-torbalan-layered-zoning','トルバラン上下段・フェイント択','zoning','弱/中/強トルバランとフェイントを散らす','戦略ローテーション。','unverified'),
 ('jp-triglav-vihhat-zoning','トリグラフとヴィーハトの遠距離制圧','zoning','トリグラフ > ヴィーハト設置 > 前進/飛びへ対応','戦略ローテーション。','unverified'),
 ('jp-sa2-pressure-tree','SA2ラヴーシュカ中の択','sa2_pressure','SA2 > 本体打撃/投げ/設置/位置入れ替え','状態依存。','unverified'),
 ('jp-od-amnesia-defense-tree','ODアムネジア後の防御判断','defense','相手打撃/投げを読む > ODアムネジア > 成立後の状況確認','2026-08-03投げ成立時硬直+4Fを反映して再評価。','reviewed')
) v(slug,name,sequence_type,sequence_text,notes,verification_status)
on conflict(slug) do update set sequence_text=excluded.sequence_text,notes=excluded.notes,updated_at=now();

with ctx as (select c.id character_id,p.id patch_id from public.characters c cross join public.patches p where c.slug='jp' and p.is_current=true)
insert into public.counters(slug,defender_character_id,target_type,situation,counter_type,title,summary,method,benefit,risk,difficulty,conditions,valid_from_patch_id,verification_status,content_kind,status)
select v.slug,ctx.character_id,'system',v.situation,v.counter_type,v.title,v.summary,v.method,v.benefit,v.risk,v.difficulty,v.conditions,ctx.patch_id,v.verification_status,'strategy','draft'
from ctx cross join (values
 ('jp-counter-jump-2hp','相手の通常ジャンプ','anti_air','2HP対空','基本対空候補。','正面ジャンプを見て2HP。','地上に留まって迎撃。','めくり/深い飛びは別回答。',2::smallint,'正面ジャンプ中心','reviewed'),
 ('jp-counter-jump-airthrow','近距離・高めの飛び','anti_air','空中投げ','空対空候補。','軌道に合わせて空中投げ。','位置調整。','届かない距離に弱い。',3::smallint,'空中投げ間合い','reviewed'),
 ('jp-counter-pressure-amnesia','打撃択を読んだ防御','counter','アムネジア系切り返し','当身候補。','タイミングを読んで使用。','ターン変更。','投げ/様子見に弱い。',4::smallint,'成立対象を要確認','unverified'),
 ('jp-counter-throw-od-amnesia-202608','投げを読んだODアムネジア','patch_specific','ODアムネジア投げ成立後','2026-08-03でJP硬直+4F。','旧パッチの有利状況を使わず再評価。','古い情報の誤使用防止。','具体状況はラボ必須。',3::smallint,'2026-08-03以降','reviewed'),
 ('jp-counter-parry-zoning','相手が遠距離弾をパリィ固定','adaptation','パリィ固定への前進・投げ準備','パリィ偏重への対応候補。','フェイント/設置で前進。','受けを崩す。','前進時の飛び/DR注意。',3::smallint,'パリィ偏重','unverified'),
 ('jp-counter-drive-rush','相手の生ドライブラッシュ','neutral_check','DRへの通常技/設置牽制','中距離止め候補。','5MP/2MP等と設置を検証。','接近阻止。','相手キャラ/距離依存。',4::smallint,'キャラ別調整','unverified')
) v(slug,situation,counter_type,title,summary,method,benefit,risk,difficulty,conditions,verification_status)
on conflict(slug) do update set summary=excluded.summary,method=excluded.method,updated_at=now();

-- Reference players
with ctx as (select c.id character_id,p.id patch_id from public.characters c cross join public.patches p where c.slug='jp' and p.is_current=true), vals(slug,display_name,player_type,team_name,bio,role,note) as (
 values
 ('tokido','ときど','pro','VARREL','2026年8月時点のポストパッチJP競技参照候補。','main','CEO 2026 post-patch JP reference.'),
 ('ryusei','りゅうせい','pro',null,'CJP専門参照プレイヤー。','main','Current profile lists CJP.'),
 ('takepi','takepi','competitive','Team iXA','JP競技参照プレイヤー。','main','Current JP reference.')
), up as (
 insert into public.players(slug,display_name,country_code,region,player_type,team_name,bio,is_active,status)
 select slug,display_name,'JP','Japan',player_type,team_name,bio,true,'published' from vals
 on conflict(slug) do update set team_name=excluded.team_name,bio=excluded.bio,status='published',updated_at=now()
 returning id,slug
)
insert into public.player_characters(player_id,character_id,role,valid_from_patch_id,note)
select up.id,ctx.character_id,v.role,ctx.patch_id,v.note from up join vals v using(slug) cross join ctx
where not exists(select 1 from public.player_characters pc where pc.player_id=up.id and pc.character_id=ctx.character_id and pc.role=v.role and pc.valid_to_patch_id is null);

-- Reference guide video
with c as (select id from public.characters where slug='jp'), v as (
 insert into public.videos(slug,platform,external_id,title,url,published_at,description,video_type,status)
 values('jp-ray-20260318-combo-oki','youtube','o6zXaO4iIz0','JP 強行動 強連携 コンボ 起き攻め セットプレイ','https://www.youtube.com/watch?v=o6zXaO4iIz0','2026-03-18'::timestamptz,'現行パッチで個別レシピ再検証が必要。','guide','published')
 on conflict(slug) do update set title=excluded.title,url=excluded.url,status='published',updated_at=now()
 returning id
)
insert into public.entity_videos(entity_type,entity_id,video_id,relationship,display_order,note)
select 'character',c.id,v.id,'guide',10,'JP攻略参考動画。2026-08-03版で個別検証が必要。' from c cross join v
where not exists(select 1 from public.entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id and ev.video_id=v.id);
