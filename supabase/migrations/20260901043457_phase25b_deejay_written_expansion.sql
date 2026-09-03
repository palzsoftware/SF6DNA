-- Dee Jay written/image-only strategy expansion.
--
-- This migration adds only routes that were absent from
-- 20260901_phase25_deejay_manon_marisa_written_collection.sql.
-- Every strategy remains draft/unverified. Pre-2026-08-03 routes are marked
-- as legacy candidates and require current-device capture before promotion.
-- No YouTube/video playback was used.
--
-- Deliberately excluded: the obsolete OD Machine Gun Upper (+23) > dash (+4)
-- setup. The current package already stores the 2026-08-03 +52 / double-dash
-- +14 replacement, so the superseded setup is not reintroduced here.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from (values
 ('ディージェイ 2026 ODマシンガン実戦コンボ','https://x.com/shizenboueigun/status/2034089488809705483','social_post','自然防衛軍',null::timestamptz,now(),'community','Post-2026-08-03 written social claim for DR 2HP > 5HP > OD Machine Gun Upper > SA2/SA3. No video inference.'),
 ('ディージェイ対策メモ S4','https://note.com/emesirna/n/n2f1b1895325e','community_guide','さーな','2026-08-12 00:00:00+00'::timestamptz,now(),'community','Post-patch written confirmation that H Jackknife ground hit into two dashes remains a live oki situation; exact spacing still requires capture.'),
 ('ディージェイ コンボ・起き攻め・固めまとめ','https://pachi-mea.com/sf6-wiki/10277/','community_guide','pachi-mea','2026-07-03 00:00:00+00'::timestamptz,now(),'community','Pre-patch written routes and frame claims; legacy candidates only.'),
 ('DEE JAY攻略 1800MR','https://note.com/nikotarosun/n/n05f7797391ab','community_guide','にこ太郎','2025-05-01 00:00:00+00'::timestamptz,now(),'community','Pre-patch Classic confirms and pressure branches; legacy candidates only.'),
 ('モダンディージェイ立ち回り','https://kamigame.jp/streetfighter6/page/364634271169662108.html','community_guide','神ゲー攻略','2026-01-12 00:00:00+00'::timestamptz,now(),'community','Pre-patch Modern charge, projectile and Drive Rush claims; legacy candidates only.'),
 ('モダンDJのとりこれ','https://note.com/kuwana_fgc/n/n30ab36cbf97b','community_guide','kuwana_fgc','2023-10-19 00:00:00+00'::timestamptz,now(),'community','Legacy Modern combos and oki; current-device capture required.'),
 ('モダンDJはクラシックの下位互換ではないかもしれない','https://note.com/paon_apex/n/n9342dfdb7d93','community_guide','paon_apex','2023-10-08 00:00:00+00'::timestamptz,now(),'community','Legacy Modern-specific Assist H routes; current-device capture required.'),
 ('今夜勝ちたいモダンタイプ・ディージェイ攻略','https://goziline.com/archives/53702','community_guide','ゴジライン','2023-06-20 00:00:00+00'::timestamptz,now(),'community','Legacy Modern pressure and corner oki; current-device capture required.'),
 ('ディージェイ攻略メモ','https://note.com/sitone/n/n9aa29e8dd147','community_guide','シトネ','2023-06-23 00:00:00+00'::timestamptz,now(),'community','Legacy Classic pressure, anti-air and DI routes; current-device capture required.'),
 ('モダンディージェイ ターゲットコンボ','https://gomokugenmai.digick.jp/2024/08/26/modern-deejay-target-combo/','community_guide','五目玄米',null::timestamptz,now(),'community','Page URL contains 2024-08-26 and the page displays a 2026-04-24 update, so the original publication timestamp is left unknown. Pre-patch written Modern target-combo roles and branches; legacy candidates only.')
) s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

-- Add the precise post-patch social source to the two current OD Machine Gun
-- candidates already created by phase25.
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',c.id,s.id,'supporting','Post-patch written route claim; current-device capture still required.'
from combos c
join lateral (
  select s0.id from sources s0
  where s0.url='https://x.com/shizenboueigun/status/2034089488809705483'
  order by s0.created_at,s0.id limit 1
) s on true
where c.slug in('deejay-od-machine-sa2-y4','deejay-od-machine-sa3-y4')
  and c.character_id=(select id from characters where slug='dee-jay')
on conflict(entity_type,entity_id,source_id) do nothing;

-- Add post-patch evidence to the existing H Jackknife double-dash setup without
-- promoting its legacy +4 frame claim.
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Post-patch evidence for H Jackknife > dash x2 usage; exact advantage and distance remain capture-only.'
from setups x
join lateral (
  select s0.id from sources s0
  where s0.url='https://note.com/emesirna/n/n2f1b1895325e'
  order by s0.created_at,s0.id limit 1
) s on true
where x.slug='deejay-oki-hjack'
  and x.character_id=(select id from characters where slug='dee-jay')
on conflict(entity_type,entity_id,source_id) do nothing;

-- Backfill the more specific source for the H Sobat +2 strike/throw/shimmy
-- sequence that phase25 already created.
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Legacy written +2 strike/throw/shimmy claim; current-device capture required.'
from sequences x
join lateral (
  select s0.id from sources s0
  where s0.url='https://note.com/sitone/n/n9aa29e8dd147'
  order by s0.created_at,s0.id limit 1
) s on true
where x.slug='deejay-seq-sobat'
  and x.character_id=(select id from characters where slug='dee-jay')
on conflict(entity_type,entity_id,source_id) do nothing;

-- Phase25 used strategy for every Classic row. Isolate only the pre-patch
-- Dee Jay rows below; the six current 2026 rows are deliberately excluded:
-- OD Machine Gun SA2/SA3, OD Machine Gun +14, L Jackknife movement, and the
-- two matching current-patch sequences. Modern rows keep modern_only.
update combos
set content_kind='legacy_candidate',
    conditions=case
      when coalesce(conditions,'') ilike '%legacy candidate%' then conditions
      else concat_ws('; ','legacy candidate',nullif(conditions,''))
    end,
    verification_status='unverified',status='draft',updated_at=now()
where character_id=(select id from characters where slug='dee-jay')
  and slug in(
    'deejay-light-sobat','deejay-light-jackknife','deejay-2hp-jackknife',
    'deejay-2hp-pc-sa3','deejay-di-wall-sa3','deejay-cdr-sa3',
    'deejay-pc-jackknife','deejay-od-jus-corner',
    'deejay-di-pc-jackknife','deejay-dr-low'
  );

update setups
set content_kind='legacy_candidate',
    description=case
      when coalesce(description,'') ilike '%legacy candidate%' then description
      else concat_ws('; ','legacy candidate',nullif(description,''))
    end,
    verification_status='unverified',status='draft',updated_at=now()
where character_id=(select id from characters where slug='dee-jay')
  and slug in(
    'deejay-oki-hjack','deejay-oki-hjack-safejump',
    'deejay-oki-corner-throw','deejay-oki-sobat',
    'deejay-oki-sweep','deejay-oki-jack-whiff'
  );

update sequences
set content_kind='legacy_candidate',
    notes=case
      when coalesce(notes,'') ilike '%legacy candidate%' then notes
      else concat_ws(E'\n','legacy candidate',nullif(notes,''))
    end,
    verification_status='unverified',status='draft',updated_at=now()
where character_id=(select id from characters where slug='dee-jay')
  and slug in('deejay-seq-jus','deejay-seq-dr','deejay-seq-sobat');

update setups
set description=case
      when coalesce(description,'') ilike '%legacy candidate%' then description
      else concat_ws('; ','legacy candidate',nullif(description,''))
    end,
    verification_status='unverified',status='draft',updated_at=now()
where character_id=(select id from characters where slug='dee-jay')
  and content_kind='modern_only'
  and slug in('deejay-oki-modern-hjack','deejay-oki-modern-odair');

update sequences
set notes=case
      when coalesce(notes,'') ilike '%legacy candidate%' then notes
      else concat_ws(E'\n','legacy candidate; Modern only',nullif(notes,''))
    end,
    verification_status='unverified',status='draft',updated_at=now()
where character_id=(select id from characters where slug='dee-jay')
  and content_kind='modern_only'
  and slug='deejay-seq-modern';

create temporary table p25b_dj_combo(
  slug text,
  name text,
  typ text,
  notation text,
  starter text,
  pos text,
  diff int,
  purpose text,
  conditions text,
  src text
) on commit drop;

insert into p25b_dj_combo values
-- Classic legacy candidates omitted from the first phase25 batch.
('deejay-di-wall-od-machine-sa2','DI壁ODマシンガンSA2','wall_splat','DI wall splat > 2MP > ODマシンガンアッパー > SA2','DI wall splat','corner',4,'壁やられSA2','legacy candidate; Drive3 + SA2; ODマシンガンの現行吹き飛びを確認','https://note.com/crisismattsu/n/nf41c0eb44192'),
('deejay-di-wall-jus-jack','DI壁ジョスクール強派生','wall_splat','DI wall splat > 2MP > ジョスクール H派生 > Hジャックナイフ','DI wall splat','corner',4,'壁やられSA温存','legacy candidate; 派生高度と強ジャック接続を確認','https://note.com/crisismattsu/n/nf41c0eb44192'),
('deejay-light-cdr-sa3','小技ダブルラッシュSA3','super','2LP > CDR 5LP > 2HP > 2MP > CDR 2HP > 5HP > Mマシンガンアッパー > SA3','2LP','any',5,'小技リーサル','legacy candidate; Drive6 + SA3; 2026弱攻撃バック縮小後の距離を確認','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-pc-mid-sobat','中距離しゃがみ強Pパニカン','punish_counter','2HP(PC) > 5HP > 5LP > 2LP > Mソバット','2HP punish counter','mid',4,'中距離確反','legacy candidate; 5HPが先端でない場合のリカバリー','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-pc-tip-jack','先端しゃがみ強Pパニカン','punish_counter','2HP(PC) > tip 5HP > 2LP > Mジャック > Hジャック','2HP punish counter','mid',5,'先端確反','legacy candidate; 5HP先端+5F主張・立ち食らい・距離限定','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-od-jus-mid-sobat','ODジョスクール中派生強ソバット','drive','ODジョスクール M派生 > Hソバット','OD Jus Cool M follow-up','any',3,'Drive火力と運び','legacy candidate; Drive2; SA1/SA2/SA3直接分岐も確認','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-od-jus-air-super-corner','端ODジョス強派生OD弾SA','corner','ODジョスクール H派生 > ODエアスラッシャー > ジョスクール H派生 > SA1 / SA2 / Hソバット > SA3','OD Jus Cool H follow-up','corner',5,'端リーサル分岐','legacy candidate; Drive4 + SA; コンボカウントと弾回数を確認','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-di-pc-machine-sa3','DIパニカン強マシンガンSA3','punish_counter','DI(PC) > delayed 5HP > Hマシンガンアッパー > SA3','DI punish counter','any',4,'DIリーサル','legacy candidate; 端のみノーキャンセル最大というSource主張','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-di-pc-od-machine-sa2','DIパニカンODマシンガンSA2','punish_counter','DI(PC) > delayed 5HP > ODマシンガンアッパー > SA2','DI punish counter','any',4,'DI SA2ルート','legacy candidate; Drive3 + SA2; 2026 ODマシンガン変更後を確認','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-drev-jack','Dリバーサルガード強ジャック','punish_counter','D-Reversal guard > 2MP > 2MP > Mジャック > Hジャック','Drive Reversal guard','any',4,'Dリバーサル確反','legacy candidate; 遠めでは2MP二回目が届かない','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-medium-kick-sobat','立ち中K強ソバット','basic','5MK > 2MP > Hソバット','5MK','mid',3,'牽制ヒット確認','legacy candidate; 近め5MK限定','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-od-jus-switch-jack','ODジョスクール入れ替え強ジャック','side_switch','ODジョスクール > forward-P follow-up > Hジャック','OD Jus Cool forward-P','any',5,'入れ替えコンボ','legacy candidate; 前P中にdown-forward保持で下溜め','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-di-knee-switch','DIパニカンニー入れ替え','side_switch','DI(PC) > immediate Knee Shot > 5LK > Hマシンガンアッパー','DI punish counter','any',5,'入れ替えDI反撃','legacy candidate; ニー最速・相手位置・SA3ノーキャンセル確認','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-hk-pc-dr-jack','立ち強Kパニカンラッシュ','punish_counter','5HK(PC) > DR 5MP > 2HP > optional 2MP > Hジャック','5HK punish counter','any',4,'差し返し火力','legacy candidate; 先端時は2MP省略','https://note.com/nikotarosun/n/n05f7797391ab'),
-- Modern-only legacy candidates omitted from the first phase25 batch.
('deejay-modern-di-wall-jus','モダンDI壁ジョスクール','modern_only','corner DI wall splat > Assist M > ジョスクール > H派生 > Hジャック','Modern DI wall splat','corner',4,'モダン壁やられ','legacy candidate; Modern only; Drive1; Source damage 1783-1952','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('deejay-modern-2h-pc','モダンしゃがみ強パニカン','modern_only','2H(PC) > Assist H x2 > ODジョスクール H派生 > Hジャック','Modern 2H punish counter','any',4,'モダン確反','legacy candidate; Modern only; Drive2; Source damage 3300-3410','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('deejay-modern-assist-m-sa2','モダン中アシストSA2','modern_only','Assist M chain: 2MP > ODダブルローリングソバット > SA2 Light','Modern Assist M','any',2,'モダンSA2基本','legacy candidate; Modern only; Drive2 + SA2; Source damage 3718','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('deejay-modern-assist-h-sa3','モダン強アシストSA3','modern_only','Assist H chain: 4HK > ODジョスクール > M派生 > Hソバット > SA3','Modern Assist H','any',3,'モダンSA3基本','legacy candidate; Modern only; Drive2 + SA3; Source damage 4670','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('deejay-modern-assist-h-jack','モダン強アシスト強ジャック','modern_only','Assist H > Hジャック','Modern Assist H','any',2,'モダン低コスト火力','legacy candidate; Modern only; Assist H中に下溜め・強制立たせというSource主張','https://note.com/paon_apex/n/n9342dfdb7d93'),
('deejay-modern-sunrise-ch-jack','モダンサンライズヒールCH','modern_only','6M(CH) > Assist H > Hジャック','Modern 6M counter','any',3,'モダン中段カウンター','legacy candidate; Modern only; Source damage 2600','https://note.com/paon_apex/n/n9342dfdb7d93'),
('deejay-modern-dr-m-assist-l','モダンDR中アシスト弱','modern_only','DR M > M > Assist L x2','Modern DR M','any',2,'モダン接近確認','legacy candidate; Modern only; ボタン割当・完走内容を現行確認','https://note.com/kuwana_fgc/n/n30ab36cbf97b'),
('deejay-modern-dr-m-jack','モダンDR中強ジャック','modern_only','DR M > 2H > Assist M > Hジャック','Modern DR M','any',3,'モダンDR火力','legacy candidate; Modern only; Drive1','https://note.com/kuwana_fgc/n/n30ab36cbf97b'),
('deejay-modern-wall-machine-sa3','モダン端DIマシンガンSA3','modern_only','corner DI wall splat > Assist M > Hマシンガンアッパー > no-cancel SA3','Modern DI wall splat','corner',5,'モダン壁リーサル','legacy candidate; Modern only; ノーキャンセル猶予を確認','https://note.com/kuwana_fgc/n/n30ab36cbf97b'),
('deejay-modern-light-jack','モダン下段ダブルジャック','modern_only','2L > L > Mジャック > Hジャック','Modern 2L','corner',4,'モダン下段端火力','legacy candidate; Modern only; 端寄り・立ち食らい・詐欺飛び移行を確認','https://note.com/kuwana_fgc/n/n30ab36cbf97b');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.typ,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,
       'Written/image claim from before 2026-08-03; no video playback. Current-device capture required.',
       p.id,'unverified',case when r.typ='modern_only' then 'modern_only' else 'legacy_candidate' end,'draft'
from p25b_dj_combo r
join characters c on c.slug='dee-jay'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1) p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Legacy written/image claim; current-device capture required.'
from p25b_dj_combo r
join combos x on x.slug=r.slug
  and x.character_id=(select id from characters where slug='dee-jay')
join lateral (
  select s0.id from sources s0 where s0.url=r.src
  order by s0.created_at,s0.id limit 1
) s on true
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25b_dj_setup(
  slug text,
  name text,
  typ text,
  starter text,
  seq text,
  adv text,
  pos text,
  descr text,
  src text
) on commit drop;

insert into p25b_dj_setup values
-- Classic legacy candidates.
('deejay-oki-corner-throw-sobat','端前投げ後弱ソバット三択','throw_oki','corner forward throw','Lソバット > micro-walk throw / crouch-wait shimmy / 2HP or delayed 4HK','Lソバット後8F claim','corner','legacy candidate; バクステ、後ろジャンプ、4F、無敵への分岐を確認','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-oki-corner-throw-di','端前投げ後DI重ね','throw_oki','corner forward throw','5LP whiff > Drive Impact','DI meaty claim','corner','legacy candidate; バーンアウト中のスタン用。無敵・SA・投げ無敵を分離','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-oki-corner-throw-dr-lk','端前投げ後DR弱K','throw_oki','corner forward throw','DR 5LK > throw / shimmy / strike','+5 claim','corner','legacy candidate; 投げ持続とバクステ後の確定差を確認','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-oki-corner-backthrow-dr-4hk','端背負い後ろ投げ後DR引き強K','throw_oki','corner back throw side switch','DR 4HK meaty > 2MP > Hエアスラッシャー / throw','+2 block claim','corner','legacy candidate; 持続、投げ間合い、Dリバーサルを確認','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-oki-corner-msobat-6mk','端中ソバット後持続サンライズ','frame_kill','corner Mソバット hit','5LP whiff > 6MK meaty > hit 4HK / block throw','meaty claim','corner','legacy candidate; 前投げ版より近く投げ間合い内というSource主張','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-oki-double-jack-mp','中強ジャック後中P持続','frame_kill','Mジャック > Hジャック','2HP whiff > 5MP meaty > 4HK / walk throw','+4 block claim','any','legacy candidate; 投げ間合い外・相打ち追撃を確認','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-oki-sa2-air-4hk','SA2空中締め引き強K','super_setup','SA2 air hit H ender','4HK > strike / throw / shimmy','air: +5 claim; ground: +2 claim','any','legacy candidate; 空中/地上ヒットを別撮影','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-oki-2mk-dash-5mk','しゃがみ中K後持続中K','meaty','2MK hit','dash > 5MK meaty > SA1 on hit','hit +8 claim; block +1 claim','any','legacy candidate; 最持続、受け身、SA1確認','https://pachi-mea.com/sf6-wiki/10277/'),
('deejay-oki-2mk-dr-whiff','しゃがみ中K後DR弱P消費','frame_kill','2MK hit','DR > 5LP whiff > delayed throw / shimmy / 4HK / 2MP meaty','+6 frame-kill; 2MP +5 claim','any','legacy candidate; 最速投げは空振りというSource注意','https://pachi-mea.com/sf6-wiki/10277/'),
('deejay-oki-hjack-di','強ジャック後前ステDI','oki','Hジャック hit near corner','dash > Drive Impact','23F before DI claim','corner','legacy candidate; 無敵以外の暴れ潰しというSource主張','https://note.com/crisismattsu/n/ne5a6d4382898'),
('deejay-oki-sa1-jump','SA1後弱ジャック飛び','safe_jump','SA1 hit','Lジャック > j.MP / j.MK / immediate Knee Shot > throw','safe-jump claim','any','legacy candidate; 中央/端、ジャンプ強度、表裏を分離','https://note.com/crisismattsu/n/ne5a6d4382898'),
('deejay-oki-wall-jack-framekill','DI壁強ジャック後弱ジャック詐欺飛び','safe_jump','DI wall > H follow-up > Hジャック','Lジャック > descending jump attack','safe-jump claim','corner','legacy candidate; 弱ジャックの2026後ろ入力有無を分離','https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-oki-forwardthrow-dr-6mk','中央前投げ後DRサンライズ','throw_oki','forward throw','DR 6MK meaty > throw / 4HK / confirm','+5 to +7 claim','mid','legacy candidate; 中ソバット後と同系統、持続タイミング要確認','https://note.com/crisismattsu/n/ne5a6d4382898'),
-- Modern-only legacy candidates.
('deejay-oki-modern-dr-m-confirm','モダンDR中ヒットガード確認','modern_oki','Modern DR M','Assist H on hit / stop or pressure on block','DR M +6 block claim','any','legacy candidate; Modern only; ランダムガードで確認','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('deejay-oki-modern-throw-dr-6m','モダン中央投げ後DR中段','modern_oki','Modern normal throw midscreen','DR 6M > Assist L / SA3 / Assist H when close','meaty claim','mid','legacy candidate; Modern only; 4F、ジャンプ、投げ間合い確認','https://note.com/kuwana_fgc/n/n30ab36cbf97b'),
('deejay-oki-modern-corner-throw-shimmy','モダン端投げ後前ステシミー','modern_oki','Modern corner normal throw','dash > micro-back crouch shimmy / delayed throw / Assist H','unknown','corner','legacy candidate; Modern only; 投げ抜け・無敵・前進無敵を確認','https://note.com/kuwana_fgc/n/n30ab36cbf97b'),
('deejay-oki-modern-assist-l-dr','モダン弱アシスト後DR二択','modern_oki','Modern Assist L ender knockdown','DR > throw / 6M','unknown','any','legacy candidate; Modern only; 弱アシスト完走内容と受け身を確認','https://goziline.com/archives/53702'),
('deejay-oki-modern-corner-airslash','モダン端引き強KODエアスラ択','modern_oki','corner 4H > ODエアスラッシャー block','throw / 4H','unknown','corner','legacy candidate; Modern only; 連続ガード、DI、Dリバを確認','https://goziline.com/archives/53702'),
('deejay-oki-modern-corner-throw-6m','モダン端投げ後持続中段','modern_oki','Modern corner forward throw','micro-walk 6M meaty > 5L / throw','+1/+2 legacy claim','corner','legacy candidate; Modern only; 立ち/しゃがみガード差を分離','https://goziline.com/archives/53702'),
('deejay-oki-modern-corner-throw-whiff','モダン端投げ後弱空振り二択','modern_oki','Modern corner forward throw','dash > 5L whiff > throw / 4H','unknown','corner','legacy candidate; Modern only; 投げは暴れ、4Hはジャンプ/バクステ狩りというSource主張','https://goziline.com/archives/53702'),
('deejay-oki-modern-hjack-safejump','モダン端強ジャック詐欺飛び','modern_oki','Modern corner Hジャック three-hit','forward jump attack','safe-jump claim','corner','legacy candidate; Modern only; ジャンプ強度と着地ガードを確認','https://goziline.com/archives/53702'),
('deejay-oki-modern-wall-machine-safejump','モダン壁マシンガン後詐欺飛び','modern_oki','corner DI wall > Assist M > Hマシンガン','forward jump attack','safe-jump claim','corner','legacy candidate; Modern only; 2026 OD/通常マシンガン差を分離','https://note.com/kuwana_fgc/n/n30ab36cbf97b'),
('deejay-oki-modern-double-jack-knee','モダン中強ジャック後ニー詐欺飛び','modern_oki','corner Mジャック > Hジャック','immediate J2L Knee Shot','safe-jump claim','corner','legacy candidate; Modern only; 高度、裏回り、無敵を確認','https://note.com/kuwana_fgc/n/n30ab36cbf97b'),
('deejay-oki-modern-antiair-jus','モダン引き強K対空ジョスク二択','modern_oki','Modern 4H anti-air','cancel Jus Cool > L low / M overhead','unknown','any','legacy candidate; Modern only; 対空高度と端追撃を確認','https://goziline.com/archives/53702'),
('deejay-oki-modern-mair-dr','モダン中エアスラ追走','modern_oki','Modern Mエアスラッシャー','DR M / DR throw behind projectile','projectile cover','mid','legacy candidate; Modern only; 溜め共有・弾相殺・DIを確認','https://kamigame.jp/streetfighter6/page/364634271169662108.html');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.typ,r.starter,r.seq,r.adv,r.pos,r.descr,
       'Legacy candidate. Verify normal/back rise, 4F, jump, backdash, parry, D-Reversal, DI and invincible options.',
       p.id,'unverified',case when r.typ like 'modern%' then 'modern_only' else 'legacy_candidate' end,'draft'
from p25b_dj_setup r
join characters c on c.slug='dee-jay'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1) p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Legacy written/image claim; current-device capture required.'
from p25b_dj_setup r
join setups x on x.slug=r.slug
  and x.character_id=(select id from characters where slug='dee-jay')
join lateral (
  select s0.id from sources s0 where s0.url=r.src
  order by s0.created_at,s0.id limit 1
) s on true
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25b_dj_seq(
  slug text,
  name text,
  seq text,
  notes text,
  modern_only boolean,
  src text
) on commit drop;

insert into p25b_dj_seq values
('deejay-seq-dr-lp-hitconfirm','DR弱P引き強Kヒット確認','DR 5LP > 4HK > hit: ODエアスラ > 5LK > Hソバ / ODジョスクM派生 > Mソバ / Hソバ; block: stop or feint','legacy candidate; 4HKヒット確認、溜め、距離を分離。',false,'https://note.com/nikotarosun/n/n05f7797391ab'),
('deejay-seq-dr-lp-airslash','DR弱P強Pエアスラ削り','DR 5LP > 5HP > Hエアスラッシャー > ジョスクール間合い','legacy candidate; 5HPが4Fと相打ち、弾まで連続ガードというSource主張。',false,'https://note.com/nikotarosun/n/n05f7797391ab'),
('deejay-seq-funky-dance-delay','ファンキーダンス遅らせ暴れ潰し','5MP > delayed 5MP > CH: 5LP target combo / block: fake, throw or stop','legacy candidate; 2段目CH確認、6F相打ち、フェイク移行を確認。',false,'https://note.com/nikotarosun/n/n05f7797391ab'),
('deejay-seq-mp-lk-cdr','中P弱Kキャンセルラッシュ','5MP > 5LK > CDR 5LP > 2HP > 2MP > Jackknife ender','legacy candidate; 中P後の暴れ潰しとヒットガード確認。',false,'https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-seq-2mk-dr-6mk','しゃがみ中K後DR中段固め','2MK > DR 6MK > delayed throw / 4HK~Lエアスラ / 5LP blockstring','legacy candidate; DR 6MKガード+5というSource主張。',false,'https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-seq-dr-mp-airslash','DR中P強Pエアスラ固め','DR 5MP > 5HP > Hエアスラッシャー > ジョスクール','legacy candidate; 5HP>強弾連続ガードとDrive削りを確認。',false,'https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-seq-oki-jus-stop','起き攻めジョスクール急停止','oki DR > Jus Cool stop > reversal whiff punish / L low / M overhead / throw','legacy candidate; 実質シミーと無敵技空振り誘発のSource主張。',false,'https://note.com/kiliboshidaikon/n/n06bb2a78fcb4'),
('deejay-seq-modern-dr-m-assist','モダンDR中アシスト確認','DR M > Assist H > hit: combo / block: stop, throw or Hエアスラ','legacy candidate; Modern only; DR Mガード+6と4F暴れ潰しを確認。',true,'https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('deejay-seq-modern-corner-airslash','モダン端ODエアスラ二択','corner 4H > ODエアスラ block > throw / 4H / stop','legacy candidate; Modern only; 連続ガード、DI、Dリバを確認。',true,'https://goziline.com/archives/53702'),
('deejay-seq-modern-antiair-jus','モダン引き強K対空派生','4H anti-air > Jus Cool > L low / M overhead / H combo','legacy candidate; Modern only; 高度別の追撃可否を記録。',true,'https://goziline.com/archives/53702'),
('deejay-seq-modern-odair-dr','モダンODエアスラ追走確認','ODエアスラ > DR > hit combo / block strike-throw / parry bait','legacy candidate; Modern only; 弾と本体の間隔、DI、パリィを確認。',true,'https://kamigame.jp/streetfighter6/page/364634271169662108.html'),
('deejay-seq-modern-sa-choice','モダンSA役割分岐','SA1 punish / SA2 Light projectile punish / SA3 reversal or anti-air','legacy candidate; Modern only; SA2はLightのみというSource主張、簡易補正を確認。',true,'https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('deejay-seq-modern-target-choices','モダンターゲットコンボ使い分け','5L~L~L fast confirm / 5M~M~M pressure / 5M~H~H knockdown','legacy candidate; Modern only; 最速触り、暴れ潰し、確定ダウンを用途別に確認。',true,'https://gomokugenmai.digick.jp/2024/08/26/modern-deejay-target-combo/');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,false,'4F check','throw branch','backwalk or stop branch','jump check','parry check','D-Reversal check','invincible check',r.notes,p.id,'unverified',case when r.modern_only then 'modern_only' else 'legacy_candidate' end,'draft'
from p25b_dj_seq r
join characters c on c.slug='dee-jay'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1) p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Legacy written/image claim; current-device capture required.'
from p25b_dj_seq r
join sequences x on x.slug=r.slug
  and x.character_id=(select id from characters where slug='dee-jay')
join lateral (
  select s0.id from sources s0 where s0.url=r.src
  order by s0.created_at,s0.id limit 1
) s on true
on conflict(entity_type,entity_id,source_id) do nothing;

-- One verification Training per newly added strategy item.
with ctx as(
  select (select id from characters where slug='dee-jay') cid,
         (select id from patches where is_current=true order by released_at desc limit 1) pid
), e as(
  select 'combo' typ,x.id,x.slug,x.name,x.notation method,x.content_kind
  from p25b_dj_combo r join combos x on x.slug=r.slug
    and x.character_id=(select id from characters where slug='dee-jay')
  union all
  select 'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind
  from p25b_dj_setup r join setups x on x.slug=r.slug
    and x.character_id=(select id from characters where slug='dee-jay')
  union all
  select 'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind
  from p25b_dj_seq r join sequences x on x.slug=r.slug
    and x.character_id=(select id from characters where slug='dee-jay')
)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【ディージェイ撮影待ち】'||e.name,
       case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,
       '文章・画像から収集したlegacy候補を2026-08-03版で確定する。','advanced',15,ctx.cid,
       '入力履歴・フレーム・ダメージ・Drive/SA表示ON。Classic/Modern、位置、立ち/しゃがみ、受け身を指定。',
       '4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,
       '左右各10回で成立、数値、位置、受け身、立ち/しゃがみ、キャラ条件を記録。',20,
       '成立ならverified候補。不成立ならarchived。',ctx.pid,'unverified',e.content_kind,'draft'
from ctx cross join e
where not exists(select 1 from trainings t where t.slug='training-'||e.slug)
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id
from trainings t
join(
  select 'combo' typ,x.id,x.slug from p25b_dj_combo r join combos x on x.slug=r.slug
    and x.character_id=(select id from characters where slug='dee-jay')
  union all
  select 'setup',x.id,x.slug from p25b_dj_setup r join setups x on x.slug=r.slug
    and x.character_id=(select id from characters where slug='dee-jay')
  union all
  select 'sequence',x.id,x.slug from p25b_dj_seq r join sequences x on x.slug=r.slug
    and x.character_id=(select id from characters where slug='dee-jay')
) e on t.slug='training-'||e.slug
on conflict(training_id,related_type,related_id) do nothing;

-- Reusable beginner-page media captures that were not present in phase25.
create temporary table p25b_dj_media(
  slug text,
  name text,
  purpose text,
  method text,
  src text
) on commit drop;

insert into p25b_dj_media values
('deejay-media-classic-charge-combo','【初心者素材】小技中の下溜めと締め分岐','Classicの溜め維持と立ち/しゃがみ確認を説明する。','入力履歴ON。2LP x3中に下溜めし、立ち食らいはHジャック、しゃがみ/距離外はMソバットへ切り替える成功例と失敗例を撮影。','https://www.streetfighter.com/6/ja-jp/character/deejay/movelist'),
('deejay-media-modern-assist-h-charge','【初心者素材】モダン強アシスト中の下溜め','Modern固有のAssist Hから強ジャック入力を説明する。','立ち/しゃがみダミーとランダムガードを使用。Assist H中に下溜めし、ヒット時Hジャック、ガード時停止を入力履歴付き撮影。','https://note.com/paon_apex/n/n9342dfdb7d93'),
('deejay-media-modern-dr-confirm','【初心者素材】モダンDR中のヒットガード確認','DR M後のコンボ移行と停止判断を説明する。','ランダムガード。DR Mヒット時はAssist Hルート、ガード時は停止/投げ/弾を別テイクで撮影しフレームを表示。','https://kamigame.jp/streetfighter6/page/350089989993852124.html'),
('deejay-media-sa2-rhythm','【初心者素材】SA2リズム入力とModern差','Classic三種類の追加入力とModern Light版の違いを説明する。','入力履歴・SAゲージ表示ON。Light/Marvelous/Maximumの追加入力、成功/失敗、Modern one-button Lightを個別撮影。','https://www.streetfighter.com/6/ja-jp/character/deejay/movelist'),
('deejay-media-hjack-oki-safejump','【初心者素材】強ジャック後の二種類の攻め','前ステ二回起き攻めと端詐欺飛び候補を比較する。','Hジャック後、前ステ×2の打撃/投げと端の前ジャンプ攻撃を撮影。通常/後方受け身、4F、無敵技で成立を表示。','https://note.com/emesirna/n/n2f1b1895325e');

insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select r.slug,r.name,'instructional_media',r.purpose,'beginner',10,c.id,
       '720p60fps以上。入力履歴・フレーム・ダメージ・Drive/SA表示ON。成功例と必要な失敗例を分ける。',
       '必要なダミー動作だけ個別再生。','CPU OFF。',r.method,
       '入力と結果が短尺で判別できる。',5,'1～2秒ループと10～20秒説明クリップへ分割。',p.id,'unverified','training','draft'
from p25b_dj_media r
join characters c on c.slug='dee-jay'
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1) p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Written/official reference for instructional capture.'
from p25b_dj_media r
join trainings t on t.slug=r.slug
  and t.player_character_id=(select id from characters where slug='dee-jay')
join lateral (
  select s0.id from sources s0 where s0.url=r.src
  order by s0.created_at,s0.id limit 1
) s on true
on conflict(entity_type,entity_id,source_id) do nothing;

-- Keep the verification Training classification aligned with its strategy.
-- This also repairs the phase25 Dee Jay Trainings for legacy Classic and
-- Modern-only rows without touching the six current-patch strategy rows or
-- instructional-media Trainings.
with strategy_kind as(
  select 'combo' related_type,x.id related_id,x.content_kind
  from combos x
  where x.character_id=(select id from characters where slug='dee-jay')
  union all
  select 'setup',x.id,x.content_kind
  from setups x
  where x.character_id=(select id from characters where slug='dee-jay')
  union all
  select 'sequence',x.id,x.content_kind
  from sequences x
  where x.character_id=(select id from characters where slug='dee-jay')
)
update trainings t
set content_kind=k.content_kind,
    verification_status='unverified',status='draft',updated_at=now()
from training_relations tr
join strategy_kind k
  on k.related_type=tr.related_type and k.related_id=tr.related_id
where tr.training_id=t.id
  and t.player_character_id=(select id from characters where slug='dee-jay')
  and k.content_kind in('legacy_candidate','modern_only');

-- Inherit every strategy source, including the newly attached post-patch source,
-- to its verification Training.
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related Dee Jay strategy.'
from trainings t
join training_relations tr on tr.training_id=t.id
join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.player_character_id=(select id from characters where slug='dee-jay')
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
       case when t.training_type='instructional_media' then 10
            when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%リーサル%' then 20
            when t.training_type='oki_retest' then 30
            when t.training_type='combo_retest' then 35
            else 45 end,
       case when t.training_type='instructional_media'
            then '初心者ページ兼ディージェイページ用の短尺素材。'
            else 'legacy候補。2026-08-03版の成立、入力、数値、位置、受け身、立ち/しゃがみ、キャラ条件を確認。' end
from trainings t
where t.player_character_id=(select id from characters where slug='dee-jay')
  and (
    exists(select 1 from p25b_dj_combo r where t.slug='training-'||r.slug)
    or exists(select 1 from p25b_dj_setup r where t.slug='training-'||r.slug)
    or exists(select 1 from p25b_dj_seq r where t.slug='training-'||r.slug)
    or exists(select 1 from p25b_dj_media r where t.slug=r.slug)
  )
on conflict(training_id) do nothing;

update character_content_packages ccp
set rollout_status='complete',
    notes=case
      when coalesce(ccp.notes,'') like '%2026-09-01 phase25b:%' then ccp.notes
      else concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01 phase25b: Dee Jay written expansion complete. Missing Classic/Modern legacy candidates and five reusable beginner captures added; video playback excluded.')
    end,
    updated_at=now()
from characters c
where c.id=ccp.character_id
  and c.slug='dee-jay';
