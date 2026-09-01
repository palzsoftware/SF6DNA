-- Luke strategy expansion from current-patch written sources only.
-- No video playback was used. All values remain reviewed/draft article claims
-- until the linked capture backlog item is reproduced on the current patch.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('スト6 ルークのコンボ','https://note.com/quirky_chimp9568/n/n455adc32fdc8','guide','焼鳥',null::timestamptz,now(),'secondary','Written combo guide crawled after the 2026-08-03 patch. Exact routes are article claims pending device reproduction.'),
 ('スト6 最強起き攻め、持続2中P','https://note.com/quirky_chimp9568/n/n86a09769ce2d','guide','焼鳥','2026-08-23'::timestamptz,now(),'secondary','Current-patch written note describing +7F meaty crouching MP. Values remain article claims.'),
 ('vsルーク キャラ対メモ S4 2026-08-03','https://note.com/emesirna/n/n3289b2ebc007','guide','さーな',null::timestamptz,now(),'secondary','Current-patch defensive guide with explicit Luke oki and pressure descriptions. Used as corroborating evidence only.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,combo_type,notation,starter,position,difficulty,purpose,conditions,notes) as (values
 ('luke-y4-5lk-cdr-jf-oki','立ち弱KキャンセルDR→ジャスト二回→ノーチェイサー','rush','5LK > CDR > 2LP > 2HP > 214MP(Perfect) > 214LP(Perfect) > 236K > P','5LK','midscreen',4,'小技差し込みから運びと起き攻め','Perfect Knuckle execution.','強フラ締めはダメージ、ノーチェイサー締めは起き攻めの分岐。'),
 ('luke-y4-2mp-ch-cdr-outlaw','しゃがみ中P CH→DRアウトロー→ジャスト二回','counter','2MP(CH) > CDR > 4HK > 2HP > 214MP(Perfect) > 214LP(Perfect) > 236K > P','2MP counter hit','midscreen',4,'カウンター確認から運びと起き攻め','Counter hit required for 4HK route.','記事ではCH時にDR後をアウトローキックへ変更。'),
 ('luke-y4-5hp-cdr-outlaw','立ち強P→DRアウトロー→ジャスト二回','rush','5HP > CDR > 4HK > 2HP > 214MP(Perfect) > 214LP(Perfect) > 236K > P','5HP','midscreen',4,'立ち強P差し込みから運び','Drive Rush and Perfect Knuckle execution.','端が近い場合は中フラ部分の成立距離を別確認。'),
 ('luke-y4-5hp-pc-jf-oki','立ち強P PC→ジャスト中弱→ノーチェイサー','punish_counter','5HP(PC) > 214MP(Perfect) > 214LP(Perfect) > 236K > P','5HP punish counter','midscreen',4,'差し返しノーゲージ運び','Punish counter and Perfect Knuckle execution.','強フラ締めへ分岐可能との記事記載。'),
 ('luke-y4-dr-lp-jf-oki','生DRしゃがみ弱P→ジャスト二回','rush','DR > 2LP > 2HP > 214MP(Perfect) > 214LP(Perfect) > 236K > P','DR 2LP','midscreen',4,'生DR小技から運びと起き攻め','Perfect Knuckle execution.','記事で使用頻度が高いと説明。'),
 ('luke-y4-dr-mp-far-snapback','遠め生DRしゃがみ中P→スナップバック','rush','DR > 2MP > 5MP > MP > MP > MP','DR 2MP','midscreen',2,'遠距離DR中Pの空振り防止','Use when 2HP would whiff due to spacing.','中Pタゲコンへの距離別切替。'),
 ('luke-y4-dr-overhead-upper','生DR中段→しゃがみ中P→強ライジング','overhead','DR > 6MP > 2MP > 623HP','DR 6MP','midscreen',2,'中段ヒット時の安定締め','Drive Rush overhead hit.','記事に具体入力あり。'),
 ('luke-y4-dreversal-punish-hflash','Dリバ確反→弱PTC→強フラッシュ','punish_counter','2MP(PC) > 5LP > MP > HP > 214HP','Drive Reversal punish counter','midscreen',2,'ドライブリバーサルへの確定反撃','Punish counter.','記事記載の簡易確反。')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.combo_type,r.notation,r.starter,r.position,r.difficulty,r.purpose,r.conditions,r.notes,ctx.patch_id,'reviewed','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,setup_type,starter,sequence_text,advantage,position,meter,description,counter_notes) as (values
 ('luke-y4-snapback-dash-hk-meaty','スナップバックヒット→前ステ→立ち強K持続','meaty','スナップバックコンボヒット','前ステップ > 5HK','guard approximately +1 claim','any','none','立ち強K持続重ね。前ステ後に重ねずシミーへも分岐。','記事記載値。成立距離とヒット有利は撮影確認。'),
 ('luke-y4-max-mflash-nochaser-dash-hk','最大溜め中フラ→ノーチェイサー→前ステ立ち強K','meaty','214MP(max charge) > 236K > P','前ステップ > 5HK','guard approximately +1 claim','any','none','立ち強K持続重ねとシミーの二択。','最大溜め版とPerfect版を分離確認。'),
 ('luke-y4-sandblast-ch-dr-oki','サンドブラストCHダウン→DR起き攻め','oki','Sand Blast counter hit knockdown','DR > 2MP / 5HK / 投げ','unknown','midscreen','Drive 1','弾CHダウン後にラッシュ性能で打撃・投げを重ねる。','距離と弾強度ごとの成立技を撮影確認。'),
 ('luke-y4-lflash-dr-overhead-meaty','弱フラ締め→DR中段持続','oki','214LP knockdown','DR > 6MP / 2LK / 投げ','6MP guard +2 claim','midscreen','Drive 1','受け身にDR中段を持続当てし、下段・投げと択にする。','その場起き時のシミー可否を分離確認。'),
 ('luke-y4-mflash-side-switch-plus5','ジャスト中フラ締め→入れ替え+5','side_switch','214MP(Perfect) knockdown','前ジャンプ > 5LK空振り > 打撃 / 投げ','+5 claim','midscreen','none','前ジャンプで位置を入れ替えて起き攻め。','後ろ歩きシミー不可との対策記事記載。垂直対策を確認。'),
 ('luke-y4-hflash-nochaser-meaty','強フラ締め→ノーチェイサー持続','meaty','214HP knockdown','236K > P > 投げ / 打撃 / シミー','throw range +2/+3 claim','midscreen','none','ノーチェイサーを重ねて有利を取り、投げと打撃へ。','見てから無敵技が確定する可能性を対策記事が指摘。'),
 ('luke-y4-corner-hflash-lp-doubleimpact','端強フラ締め→弱P空振り→ダブルインパクト持続','meaty','端・214HP knockdown','2LP空振り > 6HP > HP','unknown','corner','none','ダブルインパクト2段目までの4F割り込みを持続重ねで潰す。','通常重ねとの違い、ガード後の確反とキャンセルを確認。'),
 ('luke-y4-od-rising-dr-throw','ODライジング後→DR投げ','oki','OD Rising Upper knockdown','DR > 投げ / 打撃','unknown','midscreen','Drive 3','OD無敵技ヒット後にもDR投げを埋める。','受け身なしでシミーを防げるとの対策記事記載。')
)
insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,meter_condition,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.setup_type,r.starter,r.sequence_text,r.advantage,r.position,r.meter,r.description,r.counter_notes,ctx.patch_id,'reviewed','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,sequence_type,sequence_text,mash_point,throw_point,shimmy_point,notes) as (values
 ('luke-y4-2mp-plus1-chain','しゃがみ中P+1Fからの刻み連携','pressure','2MP(+1) > 2LP > 2MP / 2MP > 2MP > 2MK','4～5F技での割り込みは距離ごとに確認','2MP直後はその場投げが届かない','歩き投げ・後ろ歩きは確定連携ではない','対策記事の代表例。連続ガードではなく読み合いとして管理。'),
 ('luke-y4-nosebreaker-hit-plus2','ノーズブレイカーヒット後+2択','pressure','2MK > 2HP(hit) > 投げ / 4HP','4F暴れとサプレッサーの相性を確認','投げが届く+2F claim','4F以上遅らせ投げ抜けへのシミー','投げ・サプレッサー・シミーの読み合い。'),
 ('luke-y4-dr-suppressor-plus1','DRサプレッサー後+1F読み合い','pressure','DR > 4HP(block) > 4F / 投げ / シミー','相手4Fと相打ち・勝敗を確認','歩き投げの距離を確認','投げ抜け読みで様子見','ラッシュ止め技狩り後。確定連携ではない。')
)
insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,r.slug,r.name,r.sequence_type,r.sequence_text,false,r.mash_point,r.throw_point,r.shimmy_point,r.notes,ctx.patch_id,'reviewed','strategy','draft'
from ctx cross join rows r on conflict(slug) do nothing;

with links(entity_type,entity_slug,source_url) as (values
 ('combo','luke-y4-5lk-cdr-jf-oki','https://note.com/quirky_chimp9568/n/n455adc32fdc8'),
 ('combo','luke-y4-2mp-ch-cdr-outlaw','https://note.com/quirky_chimp9568/n/n455adc32fdc8'),
 ('combo','luke-y4-5hp-cdr-outlaw','https://note.com/quirky_chimp9568/n/n455adc32fdc8'),
 ('combo','luke-y4-5hp-pc-jf-oki','https://note.com/quirky_chimp9568/n/n455adc32fdc8'),
 ('combo','luke-y4-dr-lp-jf-oki','https://note.com/quirky_chimp9568/n/n455adc32fdc8'),
 ('combo','luke-y4-dr-mp-far-snapback','https://note.com/quirky_chimp9568/n/n455adc32fdc8'),
 ('combo','luke-y4-dr-overhead-upper','https://note.com/quirky_chimp9568/n/n455adc32fdc8'),
 ('combo','luke-y4-dreversal-punish-hflash','https://note.com/quirky_chimp9568/n/n455adc32fdc8'),
 ('setup','luke-y4-snapback-dash-hk-meaty','https://note.com/emesirna/n/n3289b2ebc007'),
 ('setup','luke-y4-max-mflash-nochaser-dash-hk','https://note.com/emesirna/n/n3289b2ebc007'),
 ('setup','luke-y4-sandblast-ch-dr-oki','https://note.com/emesirna/n/n3289b2ebc007'),
 ('setup','luke-y4-lflash-dr-overhead-meaty','https://note.com/emesirna/n/n3289b2ebc007'),
 ('setup','luke-y4-mflash-side-switch-plus5','https://note.com/emesirna/n/n3289b2ebc007'),
 ('setup','luke-y4-hflash-nochaser-meaty','https://note.com/emesirna/n/n3289b2ebc007'),
 ('setup','luke-y4-corner-hflash-lp-doubleimpact','https://note.com/emesirna/n/n3289b2ebc007'),
 ('setup','luke-y4-od-rising-dr-throw','https://note.com/emesirna/n/n3289b2ebc007'),
 ('sequence','luke-y4-2mp-plus1-chain','https://note.com/emesirna/n/n3289b2ebc007'),
 ('sequence','luke-y4-nosebreaker-hit-plus2','https://note.com/emesirna/n/n3289b2ebc007'),
 ('sequence','luke-y4-dr-suppressor-plus1','https://note.com/emesirna/n/n3289b2ebc007')
), entities as (
 select 'combo' entity_type,id,slug from combos
 union all select 'setup',id,slug from setups
 union all select 'sequence',id,slug from sequences
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select l.entity_type,e.id,s.id,'supporting','Current-patch written claim; no video playback used and device verification remains pending.'
from links l join entities e on e.entity_type=l.entity_type and e.slug=l.entity_slug join sources s on s.url=l.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), entities as (
 select 'combo' related_type,id,slug,name,notation method from combos where slug in (
  'luke-y4-5lk-cdr-jf-oki','luke-y4-2mp-ch-cdr-outlaw','luke-y4-5hp-cdr-outlaw','luke-y4-5hp-pc-jf-oki',
  'luke-y4-dr-lp-jf-oki','luke-y4-dr-mp-far-snapback','luke-y4-dr-overhead-upper','luke-y4-dreversal-punish-hflash')
 union all
 select 'setup',id,slug,name,starter_condition||' > '||sequence_text from setups where slug in (
  'luke-y4-snapback-dash-hk-meaty','luke-y4-max-mflash-nochaser-dash-hk','luke-y4-sandblast-ch-dr-oki','luke-y4-lflash-dr-overhead-meaty',
  'luke-y4-mflash-side-switch-plus5','luke-y4-hflash-nochaser-meaty','luke-y4-corner-hflash-lp-doubleimpact','luke-y4-od-rising-dr-throw')
 union all
 select 'sequence',id,slug,name,sequence_text from sequences where slug in (
  'luke-y4-2mp-plus1-chain','luke-y4-nosebreaker-hit-plus2','luke-y4-dr-suppressor-plus1')
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【文章情報確認】'||e.name,
 case when e.related_type='combo' then 'combo_retest' when e.related_type='setup' then 'oki_retest' else 'pressure_retest' end,
 '現行版の文章資料に記載されたルーク攻略を実機撮影で確定する。','advanced',12,ctx.character_id,
 '入力履歴・フレーム・ダメージ・Drive/SAを表示し、始動前から終了状況まで撮影する。','記事記載の中央/端、通常/CH/PC、受け身条件。','CPU OFF。',e.method,
 '左右各10回で成立入力、ダメージ、ゲージ、終了F、受け身、距離差を記録する。',20,'成立ならverified候補、不成立ならrejectedまたはarchivedへ。',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join entities e on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.related_type,e.id
from trainings t join (
 select 'combo' related_type,id,slug from combos
 union all select 'setup',id,slug from setups
 union all select 'sequence',id,slug from sequences
) e on t.slug='training-'||e.slug
where e.slug like 'luke-y4-%'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Source inherited from the related Luke strategy item.'
from trainings t
join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.slug in (
 select 'training-'||slug from combos where slug like 'luke-y4-%'
 union select 'training-'||slug from setups where slug like 'luke-y4-%'
 union select 'training-'||slug from sequences where slug like 'luke-y4-%')
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.training_type='combo_retest' then 45 when t.training_type='oki_retest' then 35 else 55 end,
 '文章で入力または状況を確認済み。現行版で成立・ダメージ・ゲージ・終了Fを撮影して確定する。'
from trainings t
where t.slug in (
 'training-luke-y4-5lk-cdr-jf-oki','training-luke-y4-2mp-ch-cdr-outlaw','training-luke-y4-5hp-cdr-outlaw','training-luke-y4-5hp-pc-jf-oki',
 'training-luke-y4-dr-lp-jf-oki','training-luke-y4-dr-mp-far-snapback','training-luke-y4-dr-overhead-upper','training-luke-y4-dreversal-punish-hflash',
 'training-luke-y4-snapback-dash-hk-meaty','training-luke-y4-max-mflash-nochaser-dash-hk','training-luke-y4-sandblast-ch-dr-oki','training-luke-y4-lflash-dr-overhead-meaty',
 'training-luke-y4-mflash-side-switch-plus5','training-luke-y4-hflash-nochaser-meaty','training-luke-y4-corner-hflash-lp-doubleimpact','training-luke-y4-od-rising-dr-throw',
 'training-luke-y4-2mp-plus1-chain','training-luke-y4-nosebreaker-hit-plus2','training-luke-y4-dr-suppressor-plus1')
on conflict(training_id) do nothing;

-- Written guide also gives the exact carry route that creates the +64 / +7
-- oki entries already stored above.
with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.character_id,'luke-y4-mflash-dr-hp-hflash','ジャスト中フラ→DR強P→強フラ運び','carry',
 '2HP > 214MP(Perfect) > DR > 5HP > 214HP(Perfect)','2HP','midscreen',5,'運びながら+64または+7起き攻めへ移行',
 'Perfect medium and heavy Flash Knuckle execution.','前ステ3回で+7、端付近では立ち弱P空振り詐欺飛びへ分岐すると記事記載。',
 ctx.patch_id,'reviewed','strategy','draft'
from ctx on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',c.id,s.id,'supporting','Current-patch written route; no video playback used and device verification remains pending.'
from combos c join sources s on s.url='https://note.com/quirky_chimp9568/n/n455adc32fdc8'
where c.slug='luke-y4-mflash-dr-hp-hflash'
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as (
 select (select id from characters where slug='luke') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), e as (
 select id,slug,name,notation from combos where slug='luke-y4-mflash-dr-hp-hflash'
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【文章情報確認】'||e.name,'combo_retest','運びコンボと終了後の+64/+7状況を現行版で確定する。','advanced',15,ctx.character_id,
 '入力履歴・フレーム・ダメージ・Drive/SAを表示し、前ステ3回または弱P空振り詐欺飛びまで撮影する。','中央開始と端到達の2条件。','CPU OFF。',e.notation,
 '左右各10回でコンボ成立、ダメージ、ゲージ、終了F、+7持続中P、端詐欺飛びを記録する。',20,'成立ならComboと関連Setupをverified候補へ。',ctx.patch_id,'unverified','strategy','draft'
from ctx cross join e on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,'combo',c.id from trainings t join combos c on t.slug='training-'||c.slug
where c.slug='luke-y4-mflash-dr-hp-hflash'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Source inherited from the related Luke combo.'
from trainings t join sources s on s.url='https://note.com/quirky_chimp9568/n/n455adc32fdc8'
where t.slug='training-luke-y4-mflash-dr-hp-hflash'
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',30,'運びコンボから+7持続中Pと端詐欺飛びまでを一連で撮影する。'
from trainings t where t.slug='training-luke-y4-mflash-dr-hp-hflash'
on conflict(training_id) do nothing;
