-- Complete Chun-Li text/image-only collection with Year4 Modern routes.
-- No video-derived inputs. All records remain draft/unverified until capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select 'モダン春麗 立ち回り・コンボ（Year4対応）','https://www.sukoreru.com/sf6-chunli','guide','すこれるブログ',null::timestamptz,now(),'secondary','Updated 2026-08-05; concrete Modern routes and oki claims.'
where not exists(select 1 from sources where url='https://www.sukoreru.com/sf6-chunli');

with ctx as (
 select (select id from characters where slug='chun-li') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,notation,starter,position,purpose,conditions) as (values
 ('chun-modern-y4-assist-h-odsbk-sa3','モダン強アシストODスピバSA3','2H > stance LK > ODスピニングバードキック > M百裂脚 > SA3','Modern Assist H','any','モダン強アシスト完走','Modern only'),
 ('chun-modern-y4-corner-odsbk-lhyakuretsu','モダン端ODスピバ→弱百裂','ODスピニングバードキック > L百裂脚 > H天昇脚 or SA3','ODスピニングバードキック','corner','端追撃','Modern only'),
 ('chun-modern-y4-corner-odsbk-mhyakuretsu','モダン端ODスピバ→中百裂','ODスピニングバードキック > M百裂脚 > SA1 or OD天昇脚','ODスピニングバードキック','corner','SA回収・端火力','Modern only'),
 ('chun-modern-y4-crmk-cdr-msbk','モダン中足ラッシュ基本','2M > CDR > 5M > 4H > stance LK > Mスピニングバードキック','Modern 2M','any','モダン基本運び','Modern only'),
 ('chun-modern-y4-pursuit-cdr-msbk','モダン追突ラッシュ基本','4M or 6M > CDR > 5M > 4H > stance LK > Mスピニングバードキック','Modern pursuit punch','any','モダン牽制ラッシュ','Modern only'),
 ('chun-modern-y4-corner-cdr-hyakuretsu','モダン端中技ラッシュ百裂','2M or pursuit > CDR > 5M > 4H > H百裂脚 > L百裂脚 or H天昇脚','Modern medium cancel','corner','端詐欺飛び・火力選択','Modern only; L百裂 route is 6F safe-jump claim'),
 ('chun-modern-y4-air-hyakuretsu-pc','モダン低空百裂PC','air 百裂脚(PC) > 2L > 2L > Lスピニングバードキック','air 百裂脚 punish counter','any','投げ読み逆択','Modern only; height/charge check'),
 ('chun-modern-y4-5lp-ch-cdr','モダン弱P CH→中技ラッシュ','5L(CH) > 2M or pursuit > CDR > follow-up','Modern 5L counter hit','any','暴れCH確認','Modern only'),
 ('chun-modern-y4-sa2-air-follow','モダンSA2安定追撃','SA2 > j.2M > j.2M > j.Assist H > j.Assist H','SA2','any','ゲージ回収・起き攻め','Modern only; command SA2 recommended in combo'),
 ('chun-modern-y4-6hp-pc-punish','モダン前強PC確反','6H(PC) > 4H > stance MK > H天昇脚','Modern 6H punish counter','any','無敵技反撃','Modern only'),
 ('chun-modern-y4-drev-punish','モダンDリバ反撃','Assist M(PC) > stance MK > Hスピニングバードキック','Drive Reversal punish','any','6F確反','Modern only; source claim 2640'),
 ('chun-modern-y4-di-pc-air','モダンDIパニカン空中ルート','Assist H > stance HK > j.2M > j.2M > j.H百裂脚 or j.Assist H x2 > SA','DI punish counter','any','DI反撃・運び','Modern only'),
 ('chun-modern-y4-hazanshu-pc','モダン中覇山PC','M覇山蹴(PC) > Assist M > Hスピニングバードキック','M覇山蹴 punish counter','any','弾抜け反撃','Modern only'),
 ('chun-modern-y4-od-hazanshu','モダンOD覇山追撃','OD覇山蹴 > Lスピニングバードキック or H天昇脚','OD覇山蹴','any','起き攻め／運び選択','Modern only; normal hit')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,'modern_only',r.notation,r.starter,r.position,3,r.purpose,r.conditions,
 'Year4 Modern written route; current device capture required.',ctx.patch_id,'unverified','modern_only','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='chun-li') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,starter,sequence_text,advantage,position,description) as (values
 ('chun-modern-y4-msbk-walk-throw','モダン中スピバ後の投げ重ね','Mスピニングバードキック ender','前ステップ > 前歩き > 投げ / 5M / shimmy','unknown','any','モダン基本起き攻め。'),
 ('chun-modern-y4-assist-h-double-dash','モダン強アシスト後の前ステ2回','Assist H combo without SA3','前ステップ×2 > delayed throw / meaty 4H / shimmy','+9 claim','any','密着起き攻め。4H持続はガード+1・ヒット時Assist Mとの記事記載。'),
 ('chun-modern-y4-corner-throw-assist-h','モダン端投げ後の強アシスト重ね','corner forward throw','Assist H > H百裂脚 > hit confirm / trade pickup','unknown','corner','最速打撃重ね。強百裂は4Fと相打ち後Assist M拾いとの記事記載。'),
 ('chun-modern-y4-corner-hyakuretsu-safejump','モダン端百裂後の6F詐欺飛び','corner H百裂脚 > L百裂脚','forward jump > stomp bounce > j.HK / empty low / throw','6F safe-jump claim','corner','5F無敵技には負ける記事記載。')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,'modern_only',r.starter,r.sequence_text,r.advantage,r.position,r.description,
 'Test 4F/5F/6F reversal, parry, D-reversal, throw and back rise.',ctx.patch_id,'unverified','modern_only','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='chun-li') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,sequence_text,notes) as (values
 ('chun-y4-kikoken-advance-tree','気功拳追走の接近分岐','L気功拳 > 前歩き / DR > 投げ / 5M / 2M / 対空確認','弾を盾にした接近。飛び確認時は天昇脚。'),
 ('chun-y4-5mp-pressure-tree','立ち中P後の打撃・投げ分岐','meaty 5MP > 5LP > 2MK hit-confirm / throw / shimmy','ガード後は確定連携ではなく読み合い。CH・遅らせ投げを確認。'),
 ('chun-modern-y4-corner-assist-h-trade','モダン端強アシスト→強百裂相打ち拾い','corner Assist H > H百裂脚 > trade with 4F > Assist M pickup','記事記載の相打ち前提連携。相手技・距離・拾い確定性を撮影確認。')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,'pressure',r.sequence_text,false,'4F check','throw branch','walk-back branch','jump check','parry check','D-reversal check','invincible check',r.notes,ctx.patch_id,'unverified','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with links(entity_type,entity_slug) as (
 select 'combo',slug from combos where slug like 'chun-modern-y4-%'
 union all select 'setup',slug from setups where slug like 'chun-modern-y4-%'
 union all select 'sequence',slug from sequences where slug in ('chun-y4-kikoken-advance-tree','chun-y4-5mp-pressure-tree','chun-modern-y4-corner-assist-h-trade')
), entities as (
 select 'combo' entity_type,id,slug from combos union all select 'setup',id,slug from setups union all select 'sequence',id,slug from sequences
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select l.entity_type,e.id,s.id,'supporting','Year4 written Modern/current strategy claim; capture required.'
from links l join entities e on e.entity_type=l.entity_type and e.slug=l.entity_slug
join sources s on s.url='https://www.sukoreru.com/sf6-chunli'
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='chun-li') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), entities as (
 select 'combo' related_type,id,slug,name,notation method from combos where character_id=(select character_id from ctx) and status<>'archived'
 union all select 'setup',id,slug,name,starter_condition||' > '||sequence_text from setups where character_id=(select character_id from ctx) and status<>'archived'
 union all select 'sequence',id,slug,name,sequence_text from sequences where character_id=(select character_id from ctx) and status<>'archived'
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【春麗撮影待ち】'||e.name,
 case when e.related_type='combo' then 'combo_retest' when e.related_type='setup' then 'oki_retest' else 'pressure_retest' end,
 '文章・画像から登録した春麗攻略を2026.08.03版の実機撮影で確定する。','advanced',15,ctx.character_id,
 '入力履歴・フレーム・ダメージ・Drive/SAを表示し、操作方式、中央/端、通常/CH/PC、立ち/しゃがみ、受け身を指定して撮影する。',
 '項目記載の操作方式・画面位置・始動条件を再現。','CPU OFF。',e.method,
 '左右各10回で成立、ダメージ、ゲージ、終了F、距離、受け身、立ち/しゃがみ条件を記録する。',20,
 '成立ならverified候補。不成立ならrejectedまたはarchivedへ。',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join entities e where not exists(select 1 from trainings t where t.slug='training-'||e.slug)
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.related_type,e.id from trainings t join (
 select 'combo' related_type,id,slug from combos where character_id=(select id from characters where slug='chun-li') and status<>'archived'
 union all select 'setup',id,slug from setups where character_id=(select id from characters where slug='chun-li') and status<>'archived'
 union all select 'sequence',id,slug from sequences where character_id=(select id from characters where slug='chun-li') and status<>'archived'
) e on t.slug='training-'||e.slug
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Source inherited from related Chun-Li strategy.'
from trainings t join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.player_character_id=(select id from characters where slug='chun-li') and t.slug like 'training-chun-%'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,
 '春麗文章・画像収集完了時の撮影対象。現行成立、操作方式、入力、ダメージ、ゲージ、終了F、距離・受け身条件を確認する。'
from trainings t where t.player_character_id=(select id from characters where slug='chun-li') and t.slug like 'training-chun-%' and t.training_type in ('combo_retest','oki_retest','pressure_retest')
on conflict(training_id) do nothing;

update character_content_packages ccp set rollout_status='complete',
 notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Chun-Li text/image-only strategy collection complete. Classic and Modern routes separated; all active strategy items linked to capture_backlog. Video playback excluded.'),updated_at=now()
from characters c where c.id=ccp.character_id and c.slug='chun-li';
