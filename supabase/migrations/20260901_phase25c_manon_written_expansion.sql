-- Complete the Manon text/image-only strategy pass with routes that were not
-- included in phase25.  No video playback was used.
--
-- Every strategy remains draft/unverified.  Pre-2026-08-03 material is kept
-- as legacy_candidate, while Modern-specific material is kept modern_only.
-- The accidental heavy Degage advantage from 2026-08-03 was fixed on
-- 2026-08-12 and is therefore retained only as an explicit capture check.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('マノン 2026.08.03 変更点文章解説',
  'https://hiyoko-lab.com/streetfighter6_hiyoko/sf6_2026-08-03-update_01/',
  'community_guide','ヒヨワカ／ヒヨコでもわかるストリートファイター6',
  '2026-08-09 00:00:00+00'::timestamptz,now(),'community',
  'Post-patch written summary. Official patch remains the primary source.'),
 ('マノン ヤスミンパッチ所感',
  'https://note.com/super_chimp7295/n/n578aaa8c385f',
  'community_guide','BORUZOI','2026-08-05 00:00:00+00'::timestamptz,now(),'community',
  'Post-patch written claims, including the corner medium-Degage command-throw setup.'),
 ('マノン 強デガジェ不具合修正 2026.08.12',
  'https://x.com/StreetFighterJA/status/2087418819451187297',
  'official','CAPCOM','2026-08-12 00:00:00+00'::timestamptz,now(),'primary',
  'Official notice: unintended extra hit advantage on heavy Degage was corrected.'),
 ('モダンマノン操作・アシストコンボ考察',
  'https://note.com/mz45aqvdua/n/n0e17202a2dbb',
  'community_guide','wix',null::timestamptz,now(),'community',
  'Written Modern inputs and OD Degage to Assist-L route; current capture required.'),
 ('モダンマノン アシストコンボ新旧比較',
  'https://game-logbook.com/street-fighter6-202405assist/',
  'community_guide','game-logbook','2024-05-22 00:00:00+00'::timestamptz,now(),'community',
  'Older written Assist-H recipe. Imported only as a Modern legacy candidate.'),
 ('モダンマノン実戦ガイド',
  'https://note.com/gokuri_/n/n3d9978e328cd',
  'community_guide','ごくり','2025-09-26 00:00:00+00'::timestamptz,now(),'community',
  'Written Modern combos and command-throw conditioning; current capture required.'),
 ('モダンマノン基礎・キャンセルラッシュ択',
  'https://note.com/122_hsy/n/n980bfef663c1',
  'community_guide','122_hsy',null::timestamptz,now(),'community',
  'Written Modern cancel-Drive-Rush pressure tree; exact gaps require current capture.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p25c_manon_combo(
 slug text,name text,combo_type text,notation text,starter text,
 drive_cost int,sa_cost int,position text,difficulty int,purpose text,
 conditions text,content_kind text,source_url text
) on commit drop;

insert into p25c_manon_combo values
 ('manon-exp-grand-pc-dr-renverse','グラン・フェッテPC追撃','punish_counter',
  'グラン・フェッテ(PC) > DR 5MK > Mランヴェルセ','グラン・フェッテ punish counter',
  1,0,'any',4,'弾抜けパニカンからメダルを獲得する。',
  'legacy candidate; normal Grand Fouette punish counter; current patch capture required.',
  'legacy_candidate','https://www.sukoreru.com/sf6-manon'),
 ('manon-exp-hk-pc-degage','立ち強Kパニカンデガジェ','punish_counter',
  '5HK(PC) > L/Mデガジェ','5HK punish counter',
  0,0,'any',3,'遠距離差し返しからダウンと運びを取る。',
  'legacy candidate; strength and spacing must be reproduced on the current patch.',
  'legacy_candidate','https://www.sukoreru.com/sf6-manon'),
 ('manon-exp-hk-pc-sa2','立ち強KパニカンSA2','punish_counter',
  '5HK(PC) > SA2 エトワール','5HK punish counter',
  0,2,'any',3,'遠距離パニカンからSA2へ繋ぐ。',
  'legacy candidate; source claims 3800 damage and Drive damage, but values are not imported as facts.',
  'legacy_candidate','https://www.sukoreru.com/sf6-manon'),
 ('manon-exp-di-wall-od-sa2','端DI壁ODロン・ポワンSA2','wall_splat',
  'DI wall splat > 4HP > ODロン・ポワン > Mデガジェ > SA2 エトワール','DI wall splat',
  3,2,'corner',4,'端の壁やられからSA2で締める。',
  'legacy candidate; Drive cost includes DI plus one OD move.',
  'legacy_candidate','https://mntone.hateblo.jp/entry/sf6_manon'),
 ('manon-exp-jump-od-sa3','飛び込みODグラン・フェッテSA3','jump_in',
  'j.HK > 4HP > ODグラン・フェッテ > 4HP > Hロン・ポワン > Lランヴェルセ > SA3 パ・ド・ドゥ','j.HK',
  2,3,'any',5,'飛び込みからメダル獲得とSA3を両立する。',
  'legacy candidate; Medal level changes damage; current patch capture required.',
  'legacy_candidate','https://mntone.hateblo.jp/entry/sf6_manon'),
 ('manon-exp-dr-mp-ch-medal','DR立ち中Pカウンターメダル','counter',
  'DR 5MP(CH) > 4HP > ODグラン・フェッテ > 4HP > Hロン・ポワン > Lランヴェルセ','DR 5MP counter',
  3,0,'any',4,'生ラッシュ中Pカウンターからメダルを獲得する。',
  'legacy candidate; Drive cost includes raw Drive Rush and one OD branch.',
  'legacy_candidate','https://mntone.hateblo.jp/entry/sf6_manon'),
 ('manon-exp-modern-aa-od-rond','モダンODロン・ポワン対空','modern_only',
  'ODロン・ポワン(anti-air) > Lランヴェルセ','Modern ODロン・ポワン anti-air',
  2,0,'any',3,'モダン対空からメダルを獲得する。',
  'legacy candidate; hit height changes whether the follow-up connects.',
  'modern_only','https://kamigame.jp/streetfighter6/page/302016678814828204.html'),
 ('manon-exp-modern-od-renverse-dr','モダンODランヴェルセ弾抜け','modern_only',
  'ODランヴェルセ > ODグラン・フェッテ > DR 5M > Lランヴェルセ','Modern ODランヴェルセ projectile punish',
  3,0,'any',4,'弾抜けから再度メダルを獲得する。',
  'legacy candidate; Drive cost is OD Renverse plus raw Drive Rush.',
  'modern_only','https://kamigame.jp/streetfighter6/page/302016678814828204.html'),
 ('manon-exp-modern-od-degage-assist','モダンODデガジェ弱アシスト','modern_only',
  'ODデガジェ > 5LK > Hロン・ポワン','Modern ODデガジェ',
  2,0,'any',3,'中段ODデガジェから弱アシスト始動技でダウンを取る。',
  'legacy candidate; written source describes OD Degage into Assist-L, whose route begins 5LK > H Rond-point.',
  'modern_only','https://note.com/mz45aqvdua/n/n0e17202a2dbb'),
 ('manon-exp-modern-assist-heavy-sa3','モダン強アシストSA3','modern_only',
  '4HP > ODランヴェルセ > ODグラン・フェッテ > 4HP > Hランヴェルセ > SA3 パ・ド・ドゥ','Modern Assist H',
  2,3,'any',3,'確定反撃からメダル獲得とSA3を狙う。',
  'legacy candidate; older Assist-H recipe; current in-game Assist Combo must be checked.',
  'modern_only','https://game-logbook.com/street-fighter6-202405assist/');

with ctx as (
 select (select id from characters where slug='manon') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into combos(
 character_id,slug,name,combo_type,notation,starter_text,drive_cost,sa_cost,
 position,difficulty,purpose,conditions,notes,valid_from_patch_id,
 verification_status,content_kind,status
)
select ctx.character_id,r.slug,r.name,r.combo_type,r.notation,r.starter,
 r.drive_cost,r.sa_cost,r.position,r.difficulty,r.purpose,r.conditions,
 'Text/image-only claim. No video playback. Record Medal level and do not store a fixed damage value until reproduction.',
 ctx.patch_id,'unverified',r.content_kind,'draft'
from ctx cross join p25c_manon_combo r
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',c.id,s.id,'supporting',
 'Written route only; current-device capture is required before verification.'
from p25c_manon_combo r
join combos c on c.slug=r.slug
join sources s on s.url=r.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25c_manon_setup(
 slug text,name text,setup_type text,starter text,sequence_text text,
 advantage text,position text,description text,counter_notes text,
 content_kind text,source_url text
) on commit drop;

insert into p25c_manon_setup values
 ('manon-exp-oki-renverse-2mp','ランヴェルセ後DR屈中P','oki',
  'ランヴェルセ hit','DR 2MP > hit: デガジェ系 / block: 弱マネージュ・ドレ候補',
  'unknown','any','後方受け身を前提にDR屈中Pを重ねる。',
  'Legacy claim. Verify both wake-up recoveries, 4F, jump, backdash and distance.',
  'legacy_candidate','https://note.com/wantyandx/n/n015b948c6025'),
 ('manon-exp-oki-renverse-4mk','ランヴェルセ後DRアン・オー始動','oki',
  'ランヴェルセ hit','delayed DR 4MK > M follow-up / command throw / guard',
  'not meaty; plus-on-block claim','any','打撃は埋まらないが、ガードさせて読み合いを継続する候補。',
  'Legacy claim. This is not a guaranteed meaty; label it as a read-based setup.',
  'legacy_candidate','https://note.com/wantyandx/n/n015b948c6025'),
 ('manon-exp-oki-renverse-normal-throw','ランヴェルセ後DR最速通常投げ','oki',
  'ランヴェルセ hit','DR > immediate normal throw',
  'unknown','any','最速通常投げで一部OD無敵技を空振りさせる候補。',
  'Legacy claim. Some SA reversals are not avoided; test each reversal family separately.',
  'legacy_candidate','https://note.com/wantyandx/n/n015b948c6025'),
 ('manon-exp-oki-command-command','コマ投げ後DRコマ投げ','command_throw',
  'マネージュ・ドレ hit','DR > M/Hマネージュ・ドレ',
  'unknown','any','DR立ち強P重ねに対してガードを選ぶ相手への投げ択。',
  'Legacy claim. Verify throw range, 4F, jump, backdash, parry and invincible options.',
  'legacy_candidate','https://note.com/wantyandx/n/n015b948c6025'),
 ('manon-exp-oki-command-dash-fake','コマ投げ後前ステぼったくり','command_throw',
  'マネージュ・ドレ hit','dash > M/Hマネージュ・ドレ or SA3 reversal read',
  '-2 claim after dash','any','前ステ後の不利を相手が知らない場合に通す読み合い。',
  'Legacy candidate and explicitly not a guaranteed setup. 4F mash beats the command throw.',
  'legacy_candidate','https://note.com/gokuri_/n/n3d9978e328cd');

with ctx as (
 select (select id from characters where slug='manon') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into setups(
 character_id,slug,name,setup_type,starter_condition,sequence_text,
 frame_advantage,position,description,counter_notes,valid_from_patch_id,
 verification_status,content_kind,status
)
select ctx.character_id,r.slug,r.name,r.setup_type,r.starter,r.sequence_text,
 r.advantage,r.position,r.description,r.counter_notes,ctx.patch_id,
 'unverified',r.content_kind,'draft'
from ctx cross join p25c_manon_setup r
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting',
 'Pre-current-patch written setup; capture all defensive branches before verification.'
from p25c_manon_setup r
join setups x on x.slug=r.slug
join sources s on s.url=r.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25c_manon_sequence(
 slug text,name text,sequence_text text,notes text,content_kind text,source_url text
) on commit drop;

insert into p25c_manon_sequence values
 ('manon-exp-seq-od-renverse-projectile','ODランヴェルセ弾抜け分岐',
  'projectile read > ODランヴェルセ > ODグラン・フェッテ > DR strike / Lランヴェルセ / pressure',
  'Legacy written branch. Separate confirmed combo, block pressure and whiff outcomes; do not label the whole tree guaranteed.',
  'legacy_candidate','https://kamigame.jp/streetfighter6/page/302016678814828204.html'),
 ('manon-exp-seq-command-conditioning','コマ投げ後の対応読み循環',
  'マネージュ・ドレ > dash command throw(fake) > opponent 4F response > next knockdown DR 5MP meaty > command throw',
  'Conditioning sequence, not a true blockstring. The source states dash leaves Manon at -2 and DR 5MP catches the learned jab response.',
  'legacy_candidate','https://note.com/gokuri_/n/n3d9978e328cd'),
 ('manon-exp-seq-modern-cdr-mix','モダン中攻撃ラッシュ二択',
  'Modern M > CDR > L(block) > SP command throw / L > Assist H > Lランヴェルセ',
  'Modern-only pressure tree. Verify whether every prefix is continuous guard and record the exact jump/mash point.',
  'modern_only','https://note.com/122_hsy/n/n980bfef663c1');

with ctx as (
 select (select id from characters where slug='manon') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into sequences(
 character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,
 mash_point,throw_point,shimmy_point,jump_option,parry_option,
 drive_reversal_option,invincible_option,notes,valid_from_patch_id,
 verification_status,content_kind,status
)
select ctx.character_id,r.slug,r.name,'pressure',r.sequence_text,false,
 'record 4F response','record command/normal throw branch','record back-walk branch',
 'record jump timing','record parry and perfect-parry timing','record D-reversal timing',
 'record OD/SA reversal timing',r.notes,ctx.patch_id,'unverified',r.content_kind,'draft'
from ctx cross join p25c_manon_sequence r
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting',
 'Written decision tree; guaranteed portions and read-based branches must be separated during capture.'
from p25c_manon_sequence r
join sequences x on x.slug=r.slug
join sources s on s.url=r.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

-- Preserve the post-2026-08-03 heavy-Degage advantage only as a hotfix-aware
-- capture target.  The source is attached to the existing legacy placeholder.
update setups
set frame_advantage='unknown',
    description='2026-08-12公式修正後の現行有利は未計測。旧増加値はcapture-only。',
    counter_notes='legacy candidate; reproduce both wake-up recoveries after the hotfix before recording any frame value.',
    verification_status='unverified',
    content_kind='legacy_candidate',
    status='draft',
    updated_at=now()
where slug='manon-oki-degage-bugwait';

update trainings
set verification_status='unverified',
    content_kind='legacy_candidate',
    status='draft',
    updated_at=now()
where slug='training-manon-oki-degage-bugwait';

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'contradicting',
 'Official 2026-08-12 notice corrected unintended heavy-Degage hit advantage. Do not promote the old value.'
from setups x
join sources s on s.url='https://x.com/StreetFighterJA/status/2087418819451187297'
where x.slug='manon-oki-degage-bugwait'
on conflict(entity_type,entity_id,source_id) do nothing;

-- One reproduction Training for every new strategy entity.
with ctx as (
 select (select id from characters where slug='manon') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), entities as (
 select 'combo' related_type,c.id,c.slug,c.name,c.notation method,c.content_kind
 from p25c_manon_combo r join combos c on c.slug=r.slug
 union all
 select 'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind
 from p25c_manon_setup r join setups x on x.slug=r.slug
 union all
 select 'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind
 from p25c_manon_sequence r join sequences x on x.slug=r.slug
)
insert into trainings(
 slug,name,training_type,purpose,level,duration_minutes,player_character_id,
 recording_instructions,playback_settings,cpu_settings,method,success_criteria,
 recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status
)
select 'training-'||e.slug,'【マノン撮影待ち】'||e.name,
 case when e.related_type='combo' then 'combo_retest'
      when e.related_type='setup' then 'oki_retest'
      else 'pressure_retest' end,
 '文章・画像から収集したマノン攻略の現行成立を確定する。','advanced',15,
 ctx.character_id,
 '入力履歴・フレーム・ダメージ・Drive/SA・メダルLvを表示。Classic/Modern、位置、CH/PCを指定する。',
 '通常/後方受け身、4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を項目に応じて収録。',
 'CPU OFF。防御分岐の確認時のみレコード再生を使用。',e.method,
 '左右各10回で成立、ダメージ、ゲージ、終了F、受け身、距離、メダルLv、キャラ差を記録する。',
 20,'成立ならverified候補。不成立ならrejected/archivedへ。',ctx.patch_id,
 'unverified',e.content_kind,'draft'
from ctx cross join entities e
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.related_type,e.id
from trainings t
join (
 select 'combo' related_type,c.id,c.slug from p25c_manon_combo r join combos c on c.slug=r.slug
 union all
 select 'setup',x.id,x.slug from p25c_manon_setup r join setups x on x.slug=r.slug
 union all
 select 'sequence',x.id,x.slug from p25c_manon_sequence r join sequences x on x.slug=r.slug
) e on t.slug='training-'||e.slug
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting',
 'Source inherited from the related Manon strategy entity.'
from trainings t
join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.slug like 'training-manon-exp-%'
on conflict(entity_type,entity_id,source_id) do nothing;

-- Reusable beginner-page capture items discovered during the Manon pass.
create temporary table p25c_manon_media(
 slug text,name text,method text,source_url text
) on commit drop;

insert into p25c_manon_media values
 ('manon-media-cdr-mix','【初心者素材】中攻撃キャンセルラッシュ二択',
  '5MP > CDR > 2MPをガードさせ、強マネージュ・ドレ、2MP、レベランス、ガードの各分岐を入力履歴とフレーム付きで比較する。',
  'https://www.sukoreru.com/sf6-manon'),
 ('manon-media-antiair-medal','【初心者素材】ODロン・ポワン対空の高さ',
  '低・中・高の三高度でODロン・ポワンを当て、弱／中ランヴェルセが繋がる高さと失敗例を撮影する。',
  'https://note.com/gokuri_/n/n3d9978e328cd'),
 ('manon-media-degage-strengths','【初心者素材】デガジェ4強度比較',
  '弱の下段、中の運び、強／ODの中段、OD空中バウンドを比較し、弱デガジェ後のDR持続重ねまで短尺で撮影する。',
  'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/manon');

with ctx as (
 select (select id from characters where slug='manon') character_id,
        (select id from patches where is_current=true order by released_at desc limit 1) patch_id
)
insert into trainings(
 slug,name,training_type,purpose,level,duration_minutes,player_character_id,
 recording_instructions,playback_settings,cpu_settings,method,success_criteria,
 recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status
)
select r.slug,r.name,'instructional_media',
 '初心者説明ページとマノンのキャラクターページで再利用する。','beginner',12,
 ctx.character_id,'720p60fps以上。入力履歴・フレーム・ダメージ・Drive/SA・メダルLvを表示。',
 '必要な動作だけを個別収録し、成功例と失敗例の再生を分ける。','CPU OFF。',
 r.method,'入力、成立条件、結果の違いが短尺で判別できる。',5,
 '説明クリップと短尺ループへ分割する。',ctx.patch_id,'unverified','training','draft'
from ctx cross join p25c_manon_media r
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting',
 'Written reference for reusable Manon beginner media.'
from p25c_manon_media r
join trainings t on t.slug=r.slug
join sources s on s.url=r.source_url
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when t.training_type='instructional_media' then 10
      when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%ODデガジェ%' then 20
      when t.training_type='oki_retest' then 30
      when t.training_type='combo_retest' then 35
      else 45 end,
 case when t.training_type='instructional_media'
      then '初心者ページ兼マノンページ用の短尺素材。'
      else '現行成立、入力、ダメージ、ゲージ、終了F、受け身、位置、メダルLv、キャラ条件を確認。' end
from trainings t
where t.player_character_id=(select id from characters where slug='manon')
  and (t.slug like 'training-manon-exp-%' or t.slug in(select slug from p25c_manon_media))
on conflict(training_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',15,
 '2026-08-12公式修正後の強デガジェ有利・起き攻めを再計測する。旧増加値を現行値として扱わない。'
from trainings t
where t.slug='training-manon-oki-degage-bugwait'
on conflict(training_id) do nothing;

update capture_backlog cb
set priority=15,
    request_notes='2026-08-12公式修正後の強デガジェ有利・起き攻めを再計測する。旧増加値を現行値として扱わない。'
from trainings t
where cb.training_id=t.id
  and t.slug='training-manon-oki-degage-bugwait'
  and cb.capture_status='pending';

-- Ensure the hotfix source also reaches the existing capture Training.
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'contradicting',
 'Official hotfix source: the old heavy-Degage advantage is not a current confirmed value.'
from trainings t
join sources s on s.url='https://x.com/StreetFighterJA/status/2087418819451187297'
where t.slug='training-manon-oki-degage-bugwait'
on conflict(entity_type,entity_id,source_id) do nothing;

update character_content_packages ccp
set notes=case
      when coalesce(ccp.notes,'') like '%2026-09-01 phase25c: Manon written expansion%'
        then ccp.notes
      else concat_ws(E'\n',nullif(ccp.notes,''),
        '2026-09-01 phase25c: Manon written expansion added remaining Classic/Modern routes, oki branches, pressure trees and reusable beginner media. Heavy-Degage pre-hotfix advantage remains capture-only.')
    end,
    updated_at=now()
from characters c
where c.id=ccp.character_id and c.slug='manon';
