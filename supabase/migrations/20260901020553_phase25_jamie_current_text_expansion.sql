-- Expand Jamie from current written/image sources and complete capture coverage.
-- Video playback is intentionally excluded. All new strategy records stay draft/unverified.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('ジェイミー調整（2026/03/17）徹底解説','https://note.com/daigoro_pso2/n/na1d80900edca','guide','大五郎','2026-03-19'::timestamptz,now(),'secondary','Concrete written Year4 routes and frame claims; capture required.'),
 ('スト6 ジェイミーメモ 2026/05/31','https://note.com/islet_game/n/ncfd29355c7d1','guide','islet','2026-05-31'::timestamptz,now(),'secondary','Current-year strategy notes; concrete sequences remain unverified.'),
 ('Year 4 モダンジェイミー立ち回りガイド','https://note.com/gardenstory/n/n610bb12556cd','guide','amber','2026-08-07'::timestamptz,now(),'secondary','Modern-only Year4 written routes; kept separate from Classic.'),
 ('202506 Ver. ジェイミー解説 どう変わった？','https://note.com/sizn/n/nb81e16d64bf1','guide','sizn',null::timestamptz,now(),'secondary','Written route and hit-condition analysis; current capture required.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

-- Phase13 placeholders contain no recipe and must not count as usable strategy data.
update combos
set status='archived',
    notes=concat_ws(E'\n',nullif(notes,''),'2026-09-01: archived because notation only said 要トレモ確認 and contained no reproducible recipe.'),
    updated_at=now()
where character_id=(select id from characters where slug='jamie')
  and slug like 'jamie-phase13-20260827-%'
  and notation='要トレモ確認';

with ctx as (
 select (select id from characters where slug='jamie') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,notation,starter,position,purpose,conditions,source_url,kind) as (values
 ('jamie-y4-5mp-2mp-od-swagger','立ち中P→しゃがみ中P→OD酔疾歩','5MP > 2MP > OD酔疾歩','5MP','any','中Pヒット確認から運び・端展開','Year4 written route','https://note.com/sizn/n/nb81e16d64bf1','strategy'),
 ('jamie-y4-5mp-ch-2hp-od-swagger','立ち中P CH→しゃがみ強P→OD酔疾歩','5MP(CH) > 2HP > OD酔疾歩','5MP counter hit','any','起き攻め中のCH確認最大候補','CH / spacing check required','https://note.com/sizn/n/nb81e16d64bf1','strategy'),
 ('jamie-y4-5mp-pc-5mk-od-swagger','立ち中P PC→立ち中K→OD酔疾歩','5MP(PC) > 5MK > OD酔疾歩','5MP punish counter','any','シミー・確反の火力候補','PC / spacing check required','https://note.com/sizn/n/nb81e16d64bf1','strategy'),
 ('jamie-y4-dr-2lk-2mk-finish','DR小足→中足→酒別締め','DR > 2LK > 2MK > drink-level finisher','DR 2LK','any','下段始動と飲酒・起き攻め選択','Finisher varies by drink level','https://note.com/daigoro_pso2/n/na1d80900edca','strategy'),
 ('jamie-y4-2mk-od-bakkai-sa3','酒2 中足→OD爆廻→SA3','2MK > OD爆廻 > SA3 > SA3 follow-up','2MK','any','中足始動リーサル候補','Drink Lv2+; article claims 3727 before route comparison','https://note.com/daigoro_pso2/n/na1d80900edca','strategy'),
 ('jamie-y4-2mk-od-bakkai-sa2-max','酒2 中足→OD爆廻→SA2最大候補','2MK > OD爆廻 > SA2 > 2HP > CDR > 5MP > 2HP > CDR > 6HP > 2MP > weak-P TC > SA1','2MK','any','SA2を使う中足始動最大候補','Drink Lv2; article claim 4116; exact TC input and current scaling require capture','https://note.com/daigoro_pso2/n/na1d80900edca','strategy'),
 ('jamie-y4-od-divekick-od-bakkai-sa3','OD無影蹴→OD爆廻→SA3','OD無影蹴 > OD爆廻 > SA3','OD無影蹴','any','OD無影蹴からSA3','Drink Lv2+; hit height check required','https://note.com/daigoro_pso2/n/na1d80900edca','strategy'),
 ('jamie-y4-od-divekick-5hp-sa1','OD無影蹴→立ち強P→SA1','OD無影蹴 > 5HP > SA1','OD無影蹴','any','中央SA1火力候補','Ground/foot hit and height confirmation required','https://note.com/daigoro_pso2/n/na1d80900edca','strategy'),
 ('jamie-y4-corner-od-divekick-5hp-sweep','端OD無影蹴→立ち強P→足払いTC','OD無影蹴 > 5HP > 2HK > HK > P','OD無影蹴','corner','端運び・飲酒','Ground/foot hit and height confirmation required','https://note.com/daigoro_pso2/n/na1d80900edca','strategy'),
 ('jamie-y4-corner-2kk-5hp-sweep','端天晴脚→立ち強P→足払いTC','2KK > 5HP > 2HK > HK > P','2KK launcher','corner','端ノーゲージ飲酒+4候補','Article claims +4; starter preceding 2KK varies','https://note.com/daigoro_pso2/n/na1d80900edca','strategy'),
 ('jamie-y4-momochi-carry-drink','ももちコン運び・飲酒','CDR > 2KK > forward j.HK > 5HP > 2HK > HK > P','Cancelable normal > CDR','midscreen','中央から端へ運びながら飲酒','Timing has a one-frame failure window per source','https://note.com/daigoro_pso2/n/na1d80900edca','strategy'),
 ('jamie-modern-y4-lv0-light-arrow','モダン酒0 小技→弱張弓腿','2L > 2L > weak 張弓腿','Modern 2L','any','モダン酒0の飲酒','Modern only','https://note.com/gardenstory/n/n610bb12556cd','modern_only'),
 ('jamie-modern-y4-2mk-cdr-heavy-swagger','モダン中足ラッシュ→強酔疾歩','2M > CDR > 5M > 2H > strong 酔疾歩','Modern 2M','any','モダン中央起き攻め','Modern only; Lv2+ may use strong 爆廻','https://note.com/gardenstory/n/n610bb12556cd','modern_only'),
 ('jamie-modern-y4-invincible-punish','モダン無敵技ガード後PC','Assist H(PC) > forward dash > 2H > strong 酔疾歩','Assist H punish counter','any','モダン無敵技反撃','Modern only; source also describes a two-drink Lv0 option','https://note.com/gardenstory/n/n610bb12556cd','modern_only')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,case when r.kind='modern_only' then 'modern_only' else 'current_candidate' end,
 r.notation,r.starter,r.position,3,r.purpose,r.conditions,'Written route; no video inference. Device capture required.',ctx.patch_id,'unverified',r.kind,'draft'
from ctx cross join rows r
on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='jamie') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,stype,sequence_text,notes,source_url) as (values
 ('jamie-y4-od-bakkai-sa2-pressure','OD爆廻ガード→SA2連携','pressure','OD爆廻（ガード） > SA2 > 2MP or 2MK','記事記載はSA2後+7F。連続ガード、割り込み、ジャスパ、Dリバを撮影確認する。','https://note.com/daigoro_pso2/n/na1d80900edca'),
 ('jamie-y4-light3-bhp-counterpoke','小技3回→後ろ強P打ち返し狩り','pressure','light attack x3 (guard) > 4HP > super-cancel confirmation','一般的なキャンセル可能中技の打ち返しを潰すという記事記載。距離・キャラ・相打ちを確認する。','https://note.com/islet_game/n/ncfd29355c7d1'),
 ('jamie-y4-dr-mp-commandgrab-layer','酒3 DR中P→打撃／点辰','pressure','DR > 5MP (guard) > 5MP / throw / 点辰 / shimmy','モダン記事にも明記された酒3の打撃・コマ投げ択。確定連携ではなく読み合いとして登録。','https://note.com/gardenstory/n/n610bb12556cd')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.stype,r.sequence_text,false,'4F interrupt check','throw/command throw branch','walk-back branch','jump escape check','parry/jP check','D-reversal check','invincible reversal check',r.notes,ctx.patch_id,'unverified','strategy','draft'
from ctx cross join rows r
on conflict(slug) do nothing;

with links(entity_type,entity_slug,source_url) as (
 select 'combo',slug,
 case
  when slug in ('jamie-y4-5mp-2mp-od-swagger','jamie-y4-5mp-ch-2hp-od-swagger','jamie-y4-5mp-pc-5mk-od-swagger') then 'https://note.com/sizn/n/nb81e16d64bf1'
  when slug like 'jamie-modern-%' then 'https://note.com/gardenstory/n/n610bb12556cd'
  else 'https://note.com/daigoro_pso2/n/na1d80900edca' end
 from combos where slug like 'jamie-y4-%' or slug like 'jamie-modern-y4-%'
 union all
 select 'sequence',slug,
 case when slug='jamie-y4-light3-bhp-counterpoke' then 'https://note.com/islet_game/n/ncfd29355c7d1'
      when slug='jamie-y4-dr-mp-commandgrab-layer' then 'https://note.com/gardenstory/n/n610bb12556cd'
      else 'https://note.com/daigoro_pso2/n/na1d80900edca' end
 from sequences where slug like 'jamie-y4-%'
), entities as (
 select 'combo' entity_type,id,slug from combos
 union all select 'sequence',id,slug from sequences
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select l.entity_type,e.id,s.id,'supporting','Concrete written claim; current-patch capture required.'
from links l join entities e on e.entity_type=l.entity_type and e.slug=l.entity_slug
join sources s on s.url=l.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

-- Every active concrete Jamie strategy entity receives one reproducible capture task.
with ctx as (
 select (select id from characters where slug='jamie') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), entities as (
 select 'combo' related_type,id,slug,name,notation method
 from combos where character_id=(select character_id from ctx) and status<>'archived'
 union all
 select 'setup',id,slug,name,starter_condition||' > '||sequence_text
 from setups where character_id=(select character_id from ctx) and status<>'archived'
 union all
 select 'sequence',id,slug,name,sequence_text
 from sequences where character_id=(select character_id from ctx) and status<>'archived'
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【ジェイミー撮影待ち】'||e.name,
 case when e.related_type='combo' then 'combo_retest' when e.related_type='setup' then 'oki_retest' else 'pressure_retest' end,
 '文章・画像から登録したジェイミー攻略を2026.08.03版の実機撮影で確定する。','advanced',15,ctx.character_id,
 '入力履歴・フレーム・ダメージ・Drive/SA・酒Lvを表示し、中央/端、通常/CH/PC、受け身を指定して撮影する。',
 '項目記載の酒Lv・画面位置・始動条件を再現。','CPU OFF。',e.method,
 '左右各10回で成立、ダメージ、ゲージ、終了F、酒Lv、距離、受け身条件を記録する。',20,
 '成立ならverified候補。不成立・旧版ならrejectedまたはarchivedへ。',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join entities e
where not exists(select 1 from trainings t where t.slug='training-'||e.slug)
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.related_type,e.id
from trainings t join (
 select 'combo' related_type,id,slug from combos where character_id=(select id from characters where slug='jamie') and status<>'archived'
 union all select 'setup',id,slug from setups where character_id=(select id from characters where slug='jamie') and status<>'archived'
 union all select 'sequence',id,slug from sequences where character_id=(select id from characters where slug='jamie') and status<>'archived'
) e on t.slug='training-'||e.slug
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Source inherited from the related Jamie strategy entity.'
from trainings t
join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.player_character_id=(select id from characters where slug='jamie')
  and t.slug like 'training-jamie-%'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.name ilike '%SA2%' or t.name ilike '%SA3%' then 20
      when t.training_type='oki_retest' then 30
      when t.training_type='combo_retest' then 35
      else 45 end,
 'ジェイミー文章・画像候補。現行成立、入力、ダメージ、ゲージ、酒Lv、終了F、距離・受け身条件を撮影確認する。'
from trainings t
where t.player_character_id=(select id from characters where slug='jamie')
  and t.slug like 'training-jamie-%'
  and t.training_type in ('combo_retest','oki_retest','pressure_retest')
on conflict(training_id) do nothing;

update character_content_packages ccp
set rollout_status='in_progress',
 notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Jamie current written expansion added; placeholder combos archived; all active concrete strategy entities linked to capture backlog. Video playback excluded.'),
 updated_at=now()
from characters c where c.id=ccp.character_id and c.slug='jamie';
