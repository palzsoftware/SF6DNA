-- Phase23 practical Training batch 05.
-- Completes practical reviewed/draft coverage for Akuma, Alex, JP and Sagat.
-- No verified/published promotion.

insert into public.sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select '実戦向け スト6豪鬼のコンボまとめ','https://takukakugamer.com/sf6-gouki-combo/','character_guide','格ゲーブログ、略してかくぶろ','2026-08-09'::timestamptz,now(),'community','Current 2026-08 practical combo source; reviewed only.'
where not exists(select 1 from public.sources where url='https://takukakugamer.com/sf6-gouki-combo/');

with cp as (select id from public.patches where is_current=true order by created_at desc limit 1),
rows(char_slug,slug,name,training_type,purpose,level,duration_minutes,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,source_url) as (
values
-- Akuma: current Aug 2026 combo guide
('akuma','akuma-practical-light-bnb','豪鬼 小技→強豪昇龍拳BnB','execution','最頻出の小技始動を左右で安定させる。','beginner',6,'ダミー立ち、ガードOFF。1P/2Pを交互に使用。','入力履歴・ダメージ表示ON。','CPU OFF。','しゃがみ弱P×2→立ち弱K→強豪昇龍拳を左右10回ずつ。','左右10回連続完走し、立ち弱K/昇龍の入力抜け0回。',20,'弱金剛灼火締めとの使い分けへ進む。','https://takukakugamer.com/sf6-gouki-combo/'),
('akuma','akuma-practical-light-kongou-plus3','豪鬼 弱金剛灼火止め+3→投げ/打撃','pressure','弱金剛灼火を派生させず、密着+3から投げと打撃を使い分ける。','intermediate',8,'しゃがみ弱P×2→弱金剛灼火まで固定。ダミー4F/投げ/無敵技を記録。','ランダム再生。フレーム表示ON。','CPU OFF。','弱金剛灼火止め後に投げ、小技、後ろ歩きを各10回。','30局面で4Fへの打撃、投げ重ね、投げ抜け空振りを分類できる。',30,'派生を出す場合との期待値を比較する。','https://takukakugamer.com/sf6-gouki-combo/'),
('akuma','akuma-practical-crmk-drc','豪鬼 中足ラッシュ基本','execution','しゃがみ中Kからキャンセルラッシュの標準ルートを固定する。','intermediate',8,'ダミー立ち、ガードOFF。','入力履歴・ダメージ表示ON。','CPU OFF。','しゃがみ中K→キャンセルラッシュ→立ち強P→立ち中K→中竜巻を10回。','10回中9回以上完走し、左右で各5回成功。',20,'Random Guardでヒット/ガード分岐へ進む。','https://takukakugamer.com/sf6-gouki-combo/'),
('akuma','akuma-practical-anti-air-conversion','豪鬼 ←強K/J中P対空コンボ','anti_air_conversion','豪昇龍拳だけでなく、高リターン対空から追撃する選択肢を身につける。','advanced',10,'ダミーに前ジャンプ攻撃、空ジャンプ、地上待機を記録。','ランダム再生。入力履歴ON。','CPU OFF。','まず←強K対空→OD百鬼豪螺旋系を10回。別枠でJ中P空対空→OD空中竜巻系を10回。地上待機には振らない。','各対空ルート10回中8回以上始動し、地上への暴発3回以下。',20,'SA2追撃は別メニューとして追加検証する。','https://takukakugamer.com/sf6-gouki-combo/'),
-- Alex: current DB verified frame / official movelist
('alex','alex-practical-air-knee-aa','アレックス エアニースマッシュ対空','anti_air','エアニースマッシュを距離別の対空投げとして使う。','beginner',8,'ダミーに近距離飛び、遠距離飛び、空ジャンプ、地上待機を記録。','ランダム再生。入力履歴ON。','CPU OFF。','近距離は速いエアニースマッシュ、遠距離は横移動の大きい強度を選択。クロスアップには無理に出さない。','20試行で15回以上対空し、クロスアップ/地上への暴発3回以下。',20,'しゃがみ強P対空との距離分担へ進む。',null),
('alex','alex-practical-oblique-plus2','アレックス オブリークスタンプ+2攻め','pressure','ガード+2のオブリークスタンプ後に小技/投げ/様子見を使い分ける。','intermediate',8,'オブリークスタンプをガードさせ、ダミー4F/投げ/無敵技を記録。','ランダム再生。フレーム表示ON。','CPU OFF。','ガード後に立ち弱P/しゃがみ弱P、近距離パワーボム系、後ろ歩きを各10回。','30局面で4Fへのフレームトラップ、投げ、無敵ガードを区別できる。',30,'Drive Rush版オブリークスタンプへ進む。',null),
('alex','alex-practical-held-heavy-pressure','アレックス ホールド強P/強K有利攻め','charge_pressure','ホールド強P/強Kをガードさせて有利状況を作り、ブレイカースタンスへ接続する。','intermediate',10,'ダミーをガード固定後、4F/投げ/DIを記録。','ランダム再生。フレーム表示ON。','CPU OFF。','ホールド立ち強Pとホールド立ち強Kを各10回。ガード後に小技、スタンス派生、様子見を使い分ける。','20回でホールド入力失敗2回以下。有利状況からの行動目的を説明できる。',20,'ヘビーラリアットホールドも追加する。',null),
('alex','alex-practical-powerbomb-tick','アレックス パワーボム強度・ティック投げ','command_throw_mix','パワーボムの強度ごとの発生/間合いを使い分け、打撃からの投げ択を作る。','intermediate',10,'ダミーに4F、ジャンプ、待機を記録。距離を近/中/遠の3段階に保存。','ランダム再生。入力履歴ON。','CPU OFF。','近距離は速いパワーボム、距離が離れたら長い版を試す。小技/オブリークスタンプ後の投げと打撃を各10回。','30局面で空振り5回以下、ジャンプへ投げを連打せず打撃/様子見へ切り替える。',30,'ODパワードロップ/ハイパーボムの用途へ進む。',null),
-- Sagat: current verified frame / official movelist
('sagat','sagat-practical-high-low-shot','サガット 上下タイガーショット撃ち分け','zoning','高いタイガーショットとグランドタイガーショットを相手状態に応じて使い分ける。','beginner',10,'ダミーに立ち歩き、しゃがみ歩き/待機、前ジャンプ、パリィを記録。','ランダム再生。入力履歴ON。','CPU OFF。','立ち行動には高いタイガーショット、しゃがみにはグランドタイガーショット。飛びには撃たず対空へ切り替える。','30局面で弾選択24回以上正答、飛びへの弾暴発4回以下。',30,'強度による弾速差とOD版を追加する。',null),
('sagat','sagat-practical-uppercut-aa','サガット タイガーアッパーカット距離別対空','anti_air','弱/中/強タイガーアッパーカットを飛びの距離で使い分ける。','beginner',8,'ダミーに近距離飛び、中距離飛び、遠距離飛び、地上待機を記録。','ランダム再生。入力履歴ON。','CPU OFF。','近距離は速い弱、距離が離れるほど中/強を検討。クロスアップには無理に出さない。','20試行で15回以上対空し、空振り/潜られを5回以下にする。',20,'立ち強K/ステップハイキック対空との距離分担へ進む。',null),
('sagat','sagat-practical-knee-spacing','サガット タイガーニークラッシュ先端管理','spacing','タイガーニークラッシュを先端で当て、有利/安全になる距離を体得する。','intermediate',10,'ダミーをガード固定。近/中/遠3距離を保存。','ガード固定。フレーム表示ON。','CPU OFF。','弱/中/強ニーを各距離でガードさせ、近すぎ/適正/空振りを記録。最終持続付近の有利を左右で再現。','30回で適正距離24回以上。近距離で不利になる強度を連打しない。',30,'ODニーと通常版を用途分離する。',null),
('sagat','sagat-practical-stmp-plus2','サガット 立ち中P+2フレームトラップ','pressure','ガード+2の立ち中Pから打撃継続を軸に攻める。','intermediate',8,'立ち中Pをガードさせ、ダミー4F/投げ/無敵技を記録。','ランダム再生。フレーム表示ON。','CPU OFF。','立ち中P後に再度立ち中P、小技、様子見を各10回。押し返しが大きいので投げは距離確認して使用。','30局面で4Fへの打撃勝ち、距離外投げの抑制、無敵ガードを分類できる。',30,'Drive Rush通常技から+状況を増やす。',null)
), ins as (
 insert into public.trainings(slug,name,training_type,purpose,player_character_id,level,duration_minutes,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,status)
 select r.slug,r.name,r.training_type,r.purpose,c.id,r.level,r.duration_minutes,r.recording_instructions,r.playback_settings,r.cpu_settings,r.method,r.success_criteria,r.recommended_reps,r.next_step,cp.id,'reviewed','draft'
 from rows r join public.characters c on c.slug=r.char_slug cross join cp
 on conflict(slug) do nothing returning id,slug
)
select count(*) from ins;

-- Akuma community guide link.
insert into public.entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Current Aug 2026 practical combo source; reviewed, not verified.'
from public.trainings t
join lateral (select id from public.sources where url='https://takukakugamer.com/sf6-gouki-combo/' order by created_at desc limit 1) s on true
where t.slug like 'akuma-practical-%'
on conflict(entity_type,entity_id,source_id) do nothing;

-- Alex/Sagat link to current official movelists.
insert into public.entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'reference','Current official movelist supports move identity; Training method is reviewed editorial guidance, not verified gameplay evidence.'
from public.trainings t join public.characters c on c.id=t.player_character_id
join lateral (
 select s1.id from public.sources s1
 where s1.url=case c.slug
  when 'alex' then 'https://www.streetfighter.com/6/ja-jp/character/alex/movelist'
  when 'sagat' then 'https://www.streetfighter.com/6/ja-jp/character/sagat/movelist'
 end order by s1.created_at desc limit 1
) s on true
where t.status='draft' and t.verification_status='reviewed' and t.slug like '%-practical-%' and c.slug in ('alex','sagat')
on conflict(entity_type,entity_id,source_id) do nothing;

-- JP already has practical, current-source-backed drills. Promote review state only.
update public.trainings
set verification_status='reviewed', updated_at=now()
where status='draft' and verification_status='unverified'
  and slug in ('jp-training-4f-check','jp-training-aa-2hp','jp-training-amnesia','jp-training-departure','jp-training-triglav');
