-- Start Jamie's text/image-only strategy collection after Luke completion.
-- Older written routes remain legacy candidates until current-patch capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('JAMIE バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jamie','official','CAPCOM','2026-08-03'::timestamptz,now(),'primary','Current patch authority.'),
 ('自分用ジェイミーメモ コンボ・起き攻め編','https://note.com/clownhello21/n/ne42b1fdbda63','guide','悪戯人形','2024-09-22'::timestamptz,now(),'secondary','Detailed frame situation catalogue; treated as legacy claims until Year4 reproduction.'),
 ('ジェイミーマスターまでの最低限使い方メモ','https://note.com/kch_/n/n5a0076a7e381','guide','kch_','2025-04-24'::timestamptz,now(),'secondary','Explicit drink-level combo and SA3 follow-up routes; legacy candidates pending Year4 reproduction.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

with ctx as (
 select (select id from characters where slug='jamie') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,notation,starter,position,purpose,conditions) as (values
 ('jamie-legacy-drink0-light-rekka','酒0小技→弱流酔拳K派生','2LP > 2LP > 5LK > 236LP > 6K > 6K','2LP','any','酒レベル上昇','Drink Lv0'),
 ('jamie-legacy-drink1-light-tc-rekka','酒1小技→弱PTC→中流酔拳K派生','2LP > 2LP > 5LP > 5LK > 5MP > 236MP > 6K > 6K','2LP','any','酒レベル上昇','Drink Lv1+'),
 ('jamie-legacy-drink2-light-breakdance','酒2小技→弱PTC→弱爆廻','2LP > 2LP > 5LP > 5LK > 5MP > 236LK','2LP','any','起き攻め重視','Drink Lv2+'),
 ('jamie-legacy-5mk-cdr-mp-hp','立ち中K→CDR中P→強P','5MK > CDR > 5MP > 2HP > finisher by drink level','5MK','any','中技から運び','Finisher changes by drink level'),
 ('jamie-legacy-5hk-pc-dr-hp-zessho','立ち強K PC→DR強P→強絶唱','5HK(PC) > DR > 2HP > 214HP','5HK punish counter','any','差し返し火力','Use dash instead of DR at close range'),
 ('jamie-legacy-di-wall-od-zessho-sweep','DI壁→強P→OD絶唱→足払いTC','DI wall splat > 2HP > 214PP > 2HK > HK > P','Drive Impact wall splat','corner','酒を飲みつつ+4起き攻め','Corner'),
 ('jamie-legacy-od-divekick-sweep','OD無影襲→足払いTC','OD Divekick > 2HK > HK > P','OD divekick','any','酒レベル上昇','Drink Lv1+'),
 ('jamie-legacy-od-commandgrab-hp','OD点辰→強P→酒別締め','OD command grab > 2HP > finisher by drink level','OD command grab','any','コマ投げ後の最大候補','Drink Lv3+'),
 ('jamie-legacy-sa3-center-dr-kicks-drink','SA3→DR天晴脚→J強K→足払いTC','SA3 > DR > 2KK > forward j.HK > 2HK > HK > P','SA3','midscreen','中央で酒レベル上昇','SA3 follow-up'),
 ('jamie-legacy-sa3-corner-damage','SA3→DR強P→強昇竜→OD昇竜','SA3 > DR > 2HP > 623HK > 623KK','SA3','corner','端ダメージ重視','Corner'),
 ('jamie-legacy-sa3-drive-crush','SA3→DR強P→キャンセルDI','SA3 > DR > 2HP > cancel Drive Impact','SA3','any','相手Drive削り・BO狙い','Delay may be required midscreen'),
 ('jamie-legacy-sa3-no-meter-swagger','SA3→強／中酔疾歩','SA3 > 214HP or 214MP','SA3','any','Driveを使わない追撃','214MP claimed +42 in corner')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,'legacy_candidate',r.notation,r.starter,r.position,3,r.purpose,r.conditions,'Older written route; Year4 device verification pending.',ctx.patch_id,'unverified','legacy_candidate','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='jamie') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,starter,sequence_text,advantage,position,description) as (values
 ('jamie-legacy-plus42-dash2','+42→前ステ2回','弱昇竜 / 弱爆廻 / 強酔疾歩等(+42)','前ステップ×2 > 打撃 / 投げ','+4 claim','midscreen','通常起き攻め。'),
 ('jamie-legacy-plus42-safejump','+42詐欺飛び','弱昇竜 / 弱爆廻 / 強酔疾歩等(+42)','前ジャンプ中K / 強K','+42 claim','any','中央・端詐欺飛び候補。'),
 ('jamie-legacy-plus40-dash-lp','OD昇竜+40→前ステ弱P空振り','OD張弓腿(+40)','前ステップ > 5LP空振り > 打撃 / 投げ','+5 claim','any','+5F調整。'),
 ('jamie-legacy-plus34-dr-overhead','+34→DR中段持続','強爆廻 / 中張弓腿(+34)','DR > 6MK > 2MP','guard +3 / hit +7 claim','any','中段持続、ガード後投げ。'),
 ('jamie-legacy-plus23-dr-fhk','+23→DR前強K','Lv4流酔拳派生等(+23)','DR > 6HK > 2MP','guard +1 claim','any','4F目重ね・相打ち2HP候補。'),
 ('jamie-legacy-plus20-dr-mp','+20→DR中P持続','酔疾歩派生(+20)','DR > 5MP > 歩き投げ / 打撃','guard +8 claim','any','中P持続重ね。'),
 ('jamie-legacy-plus16-dr-lk','+16→DR小足持続','+16ダウン','DR > 2LK','hit +6 / guard +2 claim','any','下段持続。'),
 ('jamie-legacy-corner-plus42-lp2-mp','端+42→弱P二回→中P持続','端+42ダウン','2LP空振り×2 > 5MP','+5 claim','corner','中P持続重ね。'),
 ('jamie-legacy-corner-plus39-mp-overhead','端+39→中P→中段','強張弓腿等(+39)','2MP > 6MK','unknown','corner','中段4F目重ね候補。'),
 ('jamie-legacy-corner-plus33-divekick','端+33→最低空急降下','強爆廻空中 / 中爆廻低空(+33)','最速急降下最低空 > 投げ / 打撃','guard +2 claim','corner','最低空急降下持続。'),
 ('jamie-legacy-corner-plus17-dr-mp','端+17→DR中P','弱爆廻 > 5MP空振り(+17)','DR > 5MP','unknown','corner','中P4F目重ね候補。'),
 ('jamie-legacy-corner-plus15-dr-lp','端+15→DR弱P持続','弱爆廻 > 2MK空振り(+15)','DR > 2LP','+4 claim','corner','11Fまでの無敵技を詐欺るとの記事記載。'),
 ('jamie-legacy-corner-plus7-mp','端+7→しゃがみ中P持続','+7ダウン','2MP > 2MP > OD爆廻 > 足払いTC','guard +1 claim','corner','持続中Pヒット確認と酒上昇。')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,'legacy_candidate',r.starter,r.sequence_text,r.advantage,r.position,r.description,'Older written frame claim; verify on Year4.',ctx.patch_id,'unverified','legacy_candidate','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with links(entity_type,entity_slug,source_url) as (
 select 'combo',slug,'https://note.com/kch_/n/n5a0076a7e381' from combos where slug like 'jamie-legacy-%'
 union all select 'setup',slug,'https://note.com/clownhello21/n/ne42b1fdbda63' from setups where slug like 'jamie-legacy-%'
), entities as (
 select 'combo' entity_type,id,slug from combos union all select 'setup',id,slug from setups
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select l.entity_type,e.id,s.id,'supporting','Written legacy claim; current-patch capture required.'
from links l join entities e on e.entity_type=l.entity_type and e.slug=l.entity_slug join sources s on s.url=l.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='jamie') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), entities as (
 select 'combo' related_type,id,slug,name,notation method from combos where slug like 'jamie-legacy-%'
 union all select 'setup',id,slug,name,starter_condition||' > '||sequence_text from setups where slug like 'jamie-legacy-%'
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【ジェイミー撮影待ち】'||e.name,
 case when e.related_type='combo' then 'combo_retest' else 'oki_retest' end,
 '文章資料の旧版ルートがYear4で成立するか撮影確認する。','advanced',15,ctx.character_id,
 '入力履歴・フレーム・ダメージ・Drive/SA・酒Lvを表示し、始動から終了状況まで撮影する。','中央/端、酒Lv、通常/CH/PC、受け身を指定。','CPU OFF。',e.method,
 '左右各10回で成立、ダメージ、ゲージ、終了F、酒Lv、受け身条件を記録する。',20,'成立ならreviewed current候補、非成立ならrejected/archivedへ。',ctx.patch_id,'unverified','legacy_candidate','draft'
from ctx cross join entities e on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.related_type,e.id from trainings t join (
 select 'combo' related_type,id,slug from combos union all select 'setup',id,slug from setups
) e on t.slug='training-'||e.slug where e.slug like 'jamie-legacy-%'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Source inherited from related Jamie candidate.'
from trainings t join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.slug like 'training-jamie-legacy-%'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.name ilike '%SA3%' then 25 else 50 end,
 'ジェイミー旧版文章候補。Year4での成立、酒Lv、ダメージ、ゲージ、終了Fを撮影する。'
from trainings t where t.slug like 'training-jamie-legacy-%'
on conflict(training_id) do nothing;

update character_content_packages ccp set rollout_status='in_progress',
 notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Jamie text/image-only strategy collection started after Luke completion; video playback excluded.'),updated_at=now()
from characters c where c.id=ccp.character_id and c.slug='jamie';
