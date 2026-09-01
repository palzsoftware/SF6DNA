-- Complete Jamie's written pass and start Chun-Li's text/image-only collection.
-- Video playback is excluded; all routes remain draft/unverified pending capture.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('スト6春麗マスターに上がるための最低限使い方メモ','https://note.com/kch_/n/n9bb5becc8343','guide','kch_','2025-05-07'::timestamptz,now(),'secondary','Concrete Classic combo and oki recipes; current capture required.'),
 ('CHUN-LI バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/chunli','official','CAPCOM','2026-08-03'::timestamptz,now(),'primary','Current patch authority.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

with ctx as (
 select (select id from characters where slug='chun-li') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,notation,starter,position,purpose,conditions) as (values
 ('chun-written-lp-od-hyakuretsu','小技→OD百裂脚追撃','5LP > 5LP > OD百裂脚 > follow-up','5LP','any','小技からDrive使用','追撃強度・距離は撮影確認'),
 ('chun-written-5mp-2mp-msbk','立ち中P→中スピバ','5MP > 2MP > Mスピニングバードキック','5MP','any','基本起き攻め','前ステ起き攻め'),
 ('chun-written-5mp-2mp-odsbk','立ち中P→ODスピバ追撃','5MP > 2MP > ODスピニングバードキック > H天昇脚 or M百裂脚','5MP','any','Drive使用・運び','DRまたは前ステ×2起き攻め'),
 ('chun-written-shimmy-2hp-stance-mk','シミー2強P→構え中K','2HP > 行雲流水・仙風(MK) > Hスピニングバードキック or ODスピニングバードキック > H天昇脚','2HP shimmy','any','シミー火力','距離・溜め確認'),
 ('chun-written-dr-overhead-msbk','DR中段→中スピバ','DR > 3HP > 5MP > 2MP > Mスピニングバードキック','DR 3HP','any','気功拳追走中段','Classic only'),
 ('chun-written-dr-low-stance-lk','DR中足→構え弱K','DR > 2MK > 行雲流水・前突(LK) > Mスピニングバードキック','DR 2MK','any','気功拳追走下段','Classic only'),
 ('chun-written-cdr-light-msbk','追突／中足CDR小技','6MP or 2MK > CDR > 2LP > 5MP > 2MP > Mスピニングバードキック','6MP or 2MK','any','中技ラッシュ基本','始動距離を撮影確認'),
 ('chun-written-cdr-bhp-stance-mk','追突／中足CDR後ろ強P','6MP or 2MK > CDR > 4HP > 行雲流水・仙風(MK) > Hスピニングバードキック','6MP or 2MK','any','中技ラッシュ高火力','溜め・距離確認'),
 ('chun-written-crouch-only-cdr-air','しゃがみ限定中足ラッシュ空中ルート','2MK > CDR > 5MP > 4HP > 行雲流水・天空脚(HK) > j.鷹爪脚 x2 > j.HP > j.HP > SA','2MK','any','しゃがみ限定SAルート','Crouching opponent only'),
 ('chun-written-dr-3hk-side-switch-sa','DR鶴脚落→入れ替えSA','DR > 3HK > 2HP > 行雲流水・天空脚(HK) > j.鷹爪脚 x2 > j.HP > j.HP > SA','DR 3HK','any','入れ替え・SA','ガード時有利は記事記載、数値未確定'),
 ('chun-written-di-pc-air-sa','DIパニカン空中SAルート','DI(PC) > 2HP > 行雲流水・天空脚(HK) > j.鷹爪脚 x2 > j.HP > j.HP > SA','DI punish counter','any','DI最大候補','SA種類別撮影'),
 ('chun-written-stun-max-sa3','スタン最大SA3候補','j.HK > 5HK > 行雲流水・仙風(MK) > OD気功拳 > 5MP > 2MP > CDR > 5HP > 行雲流水・仙風(MK) > OD気功拳 > 5MP > 2MP > H百裂脚 > SA3','stun','corner','スタン最大候補','Drive/SA full; current scaling capture required'),
 ('chun-written-reversal-punish-max','無敵技ガード最大候補','DR > 4HP > H覇山蹴 > 2MP > CDR > 2HP > 行雲流水・仙風(MK) > OD気功拳 > 5LK > CDR > 5LP > 4HP > 行雲流水・天空脚(HK) > j.鷹爪脚 x2 > j.HP > j.HP > SA3','invincible reversal punish','any','無敵技反撃最大候補','Full resource; spacing and current scaling capture required'),
 ('chun-written-sa2-safejump','SA2空中追撃→詐欺飛び','SA2 > late j.MP (ground hit only) > j.鷹爪脚 x2 > j.HP > j.HP > safe jump','SA2','any','SA2後詐欺飛び','Ground hit only'),
 ('chun-written-sa2-side-switch','SA2→前J中K表裏','SA2 > forward j.MK > forward dash > 5MP','SA2','any','SA2後表裏','Side/character spacing capture required')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,'written_candidate',r.notation,r.starter,r.position,3,r.purpose,r.conditions,
 'Written recipe; no video inference. Current-patch capture required.',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='chun-li') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,starter,sequence_text,advantage,position,description) as (values
 ('chun-written-lsbk-hazanshu','弱スピバ後の強覇山蹴重ね','2LK > 2LP > Lスピニングバードキック','H覇山蹴 > hit confirm / pressure','unknown','any','小技コンボ後の中段重ね候補。'),
 ('chun-written-msbk-forward-dash','中スピバ後の前ステ起き攻め','5MP > 2MP > Mスピニングバードキック','前ステップ > 投げ / 打撃 / シミー','unknown','any','基本の地上起き攻め。'),
 ('chun-written-odsbk-double-dash','ODスピバ追撃後の前ステ2回','5MP > 2MP > ODスピニングバードキック > H天昇脚 or M百裂脚','前ステップ > 前ステップ > 投げ / 打撃','unknown','any','追撃後の地上起き攻め。'),
 ('chun-written-corner-stance-hp','端中スピバ／天昇後の構え強P','corner Mスピニングバードキック or H天昇脚 ender','行雲流水 > 構えHP派生 > ODスピバ or CDR on hit','unknown','corner','端の持続重ね候補。'),
 ('chun-written-corner-stance-cancel-low','端構えキャンセル小足','corner Mスピニングバードキック or H天昇脚 ender','行雲流水 > 構えキャンセル > 2LK > 2LP > Lスピニングバードキック','unknown','corner','構え派生に対する防御の対択。'),
 ('chun-written-corner-hyakuretsu-safejump','端強百裂→弱百裂詐欺飛び','corner 2HP > H百裂脚 > L百裂脚','forward jump attack / empty low / empty throw','safe-jump claim','corner','記事記載の詐欺飛びとすかし択。')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,'written_candidate',r.starter,r.sequence_text,r.advantage,r.position,r.description,
 'Check 4F, invincible reversal, parry, D-reversal and back rise.',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with links(entity_type,entity_slug) as (
 select 'combo',slug from combos where slug like 'chun-written-%'
 union all select 'setup',slug from setups where slug like 'chun-written-%'
), entities as (
 select 'combo' entity_type,id,slug from combos union all select 'setup',id,slug from setups
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select l.entity_type,e.id,s.id,'supporting','Concrete written claim; current capture required.'
from links l join entities e on e.entity_type=l.entity_type and e.slug=l.entity_slug
join sources s on s.url='https://note.com/kch_/n/n9bb5becc8343'
on conflict(entity_type,entity_id,source_id) do nothing;

-- Create capture tasks for every active Chun-Li Combo/Setup/Sequence.
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
 '入力履歴・フレーム・ダメージ・Drive/SAを表示し、中央/端、通常/CH/PC、立ち/しゃがみ、受け身を指定して撮影する。',
 '項目記載の画面位置・始動条件を再現。','CPU OFF。',e.method,
 '左右各10回で成立、ダメージ、ゲージ、終了F、距離、受け身、立ち/しゃがみ条件を記録する。',20,
 '成立ならverified候補。不成立・旧版ならrejectedまたはarchivedへ。',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join entities e
where not exists(select 1 from trainings t where t.slug='training-'||e.slug)
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
select t.player_character_id,t.id,'pending',
 case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' then 20
      when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,
 '春麗文章・画像候補。現行成立、入力、ダメージ、ゲージ、終了F、距離・受け身・立ち/しゃがみ条件を撮影確認する。'
from trainings t where t.player_character_id=(select id from characters where slug='chun-li')
and t.slug like 'training-chun-%' and t.training_type in ('combo_retest','oki_retest','pressure_retest')
on conflict(training_id) do nothing;

update character_content_packages ccp set rollout_status='complete',
 notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Jamie text/image-only strategy collection complete; 64 active strategy items tracked in capture_backlog. Video playback excluded.'),updated_at=now()
from characters c where c.id=ccp.character_id and c.slug='jamie';

update character_content_packages ccp set rollout_status='in_progress',
 notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Chun-Li text/image-only strategy collection started after Jamie completion; video playback excluded.'),updated_at=now()
from characters c where c.id=ccp.character_id and c.slug='chun-li';
