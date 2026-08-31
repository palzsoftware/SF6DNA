-- Phase23: separate practical end-user Training from internal verification queues.
-- No Training is promoted to verified/published by this migration.
-- reviewed != verified, draft != published.

-- 1) Archive generic rollout/verification work queues. These rows describe QA work,
-- not a drill a player can immediately reproduce in Training Mode.
update public.trainings
set status = 'archived',
    updated_at = now()
where status = 'draft'
  and verification_status = 'unverified'
  and (
    (
      regexp_replace(name, '^[^ ]+ ', '') = 'コンボ・起き攻め再検証'
      and method = '同一条件を10回再現し、ダメージ、消費、運び、終了状況、起き攻め可否を記録する。'
      and success_criteria = '同一条件10回で再現できた項目だけtraining_verified候補に昇格する。'
    )
    or (
      regexp_replace(name, '^[^ ]+ ', '') = '中距離・接近手段'
      and method = '中距離から20〜50局面を処理し、置き/差し返し/対空/ガード/パリィの選択を記録する。'
      and success_criteria = '同じ被弾原因を分類でき、反応不能な択と読み合いを混同しない。'
    )
    or (
      regexp_replace(name, '^[^ ]+ ', '') = '対空認識'
      and method = '20回反応し、成功/相打ち/被弾/空振りを分類。使った技を記録する。'
      and success_criteria = '20試行で結果を分類でき、未確認の対空を確定扱いしない。'
    )
    or (
      regexp_replace(name, '^[^ ]+ ', '') = '確定反撃検証'
      and method = '最速4F候補から開始し、届く通常技・必殺技・SAを段階的に確認する。'
      and success_criteria = '確定/非確定/距離依存を区別し、フレーム表示または再現結果を保存する。'
    )
    or (
      regexp_replace(name, '^[^ ]+ ', '') = '画面端防御・脱出'
      and method = 'ガード継続、4F、投げ抜け、バックジャンプ、バクステ、パリィ、Dリバ、無敵技を比較する。'
      and success_criteria = '各回答の勝ち/負け/相打ち/読み合いを区別できる。'
    )
  );

-- 2) Archive the seven-character copies of the same generic foundation menu.
-- A character-independent canonical foundation library is inserted below instead.
update public.trainings t
set status = 'archived',
    updated_at = now()
from public.characters c
where c.id = t.player_character_id
  and t.status = 'draft'
  and t.verification_status = 'unverified'
  and c.slug in ('c-viper', 'alex', 'ingrid', 'elena', 'sagat', 'yasmine', 'mai')
  and t.name in (
    'DI返し', 'DR止め', 'ゲージ管理', 'バーンアウト', 'ヒット確認', 'リーサル',
    '前歩き制御', '差し返し', '弾/飛び道具対応', '起き攻め', '防御混合再生'
  )
  and t.method in (
    '成功/失敗と距離・ゲージ・画面位置を記録する。',
    '距離・ゲージ・画面位置ごとに成功率を記録。'
  );

-- 3) Register community Training Mode references. They are supporting evidence,
-- not official verification of character-specific frame/gameplay claims.
insert into public.sources (title, url, source_type, publisher, published_at, accessed_at, reliability_level, notes)
select v.title, v.url, v.source_type, v.publisher, v.published_at, now(), 'community', v.notes
from (values
  ('基礎力UPトレモ練習メニュー 初心者〜中級者', 'https://www.youtube.com/watch?v=ofUP9_Sqjso', 'video_guide', 'スト6攻略備忘録チャンネル', '2024-07-28T00:00:00Z'::timestamptz, '対空・起き上がり・防御・ラッシュ止め等の段階練習。'),
  ('Two Training Drills to Fix Common SF6 Mistakes', 'https://www.youtube.com/watch?v=4GFLhNe1Ni0', 'video_guide', 'Chris_F', '2025-01-13T00:00:00Z'::timestamptz, 'シミー、投げ重ねと対空、DRC攻防などの実践ドリル。'),
  ('対空トレーニングモード設定！実践的な練習で跳びを落とせ', 'https://note.com/habanero_academy/n/n6ca171ccef2e', 'community_guide', 'めいきょ〜ハバネロ格ゲー学園', '2025-06-23T00:00:00Z'::timestamptz, '簡単練習設定の対空練習とレコード追加による段階練習。'),
  ('超基礎的な練習メニュー', 'https://note.com/kusaba_sos6925/n/n14e61c530cdf', 'community_guide', 'クサバ', '2025-02-20T00:00:00Z'::timestamptz, '対空・起き攻め等をTraining Mode設定まで分解した基礎メニュー。'),
  ('How to WHIFF PUNISH? Street fighter 6 basics tutorial', 'https://www.youtube.com/watch?v=GHgvSf5O_68', 'video_guide', 'Beslem', '2026-02-09T00:00:00Z'::timestamptz, '差し返しの条件と2種類の練習。'),
  ('What type of practice do you do before playing?', 'https://www.reddit.com/r/StreetFighter/comments/1op85xp', 'community_discussion', 'r/StreetFighter', '2025-11-05T00:00:00Z'::timestamptz, 'BnBを左右両側、最大反撃等をウォームアップするコミュニティ例。'),
  ('What are some good ways to practice hit confirm?', 'https://www.reddit.com/r/StreetFighter/comments/1dmmlsf', 'community_discussion', 'r/StreetFighter', '2024-06-23T00:00:00Z'::timestamptz, 'Random Guardを用いたヒット確認練習のコミュニティ例。'),
  ('Street Fighter 6 Beginner Guide Part 3: Drive Impact countermeasures', 'https://note.com/haku_thinks/n/n2349c9df4a59', 'community_guide', 'Haku', '2026-08-03T00:00:00Z'::timestamptz, '簡単練習設定のDrive Impact対応練習。'),
  ('特定個人向けCジュリ攻略', 'https://note.com/genji_shibamura/n/n82a0026a1be5', 'character_guide', '芝村玄慈', '2024-08-23T00:00:00Z'::timestamptz, 'Random Guard中足確認、CPU Lv7でのDI複合練習など具体的なジュリ練習。'),
  ('Ken / From Silver to Platinum', 'https://note.com/genji_shibamura/n/naf772200d914', 'character_guide', '芝村玄慈', null::timestamptz, 'CPU Lv7を使った画面端DI返しの実践練習。')
) as v(title, url, source_type, publisher, published_at, notes)
where not exists (select 1 from public.sources s where s.url = v.url);

-- 4) Canonical character-independent foundation library.
-- These rows intentionally have player_character_id = NULL. The player substitutes
-- their own character's anti-air, BnB, punish route, etc. They remain reviewed/draft.
with current_patch as (
  select id from public.patches where is_current = true order by created_at desc limit 1
), rows(slug, name, training_type, purpose, level, duration_minutes,
       recording_instructions, playback_settings, cpu_settings, method,
       success_criteria, recommended_reps, next_step) as (
values
  ('foundation-bnb-both-sides', '基礎コンボ（BnB）左右反復', 'execution',
   '実戦で最も使う安定コンボを1P側・2P側の両方で迷わず完走できるようにする。', 'beginner', 8,
   'ダミーは立ち状態。まずガードOFFで始動を確実に当てる。左右は位置リセットで交互に行う。',
   '通常再生。入力履歴とダメージ表示ON。', 'CPU操作: OFF。',
   '使用頻度が最も高い1ルートだけを選び、1P側10回→2P側10回。失敗したらその側のカウントをやり直す。',
   '左右それぞれ10回連続で同じルートを完走し、入力抜け・不要な暴発がない。', 20,
   '安定後はヒット確認・Punish Counter・画面端など実戦条件を1つだけ追加する。'),

  ('foundation-anti-air-level1', '対空 Level 1：飛びだけを見る', 'anti_air',
   '対空コマンドと反応タイミングを手に馴染ませる。', 'beginner', 5,
   '簡単練習設定の「対空技練習」を使用。前ジャンプ・垂直ジャンプの再生情報表示は見ない。',
   'ランダム再生。入力履歴ON。', 'CPU操作: OFF。',
   '自キャラで最も安定する対空を1つに絞り、飛びを見てから出す。地上行動を自分から増やさない。',
   '20試行で16回以上対空でき、コマンドミスと反応遅れを別々に記録できる。', 20,
   '安定したら「対空 Level 2：地上行動と混ぜる」へ進む。'),

  ('foundation-anti-air-level2', '対空 Level 2：地上行動と飛びの混合', 'anti_air',
   '地上戦へ意識を割いた状態でも飛びへ反応する練習をする。', 'intermediate', 8,
   '対空練習を土台に、前歩き・後ろ歩き・地上牽制など安全な地上行動を複数レコードへ追加する。',
   '複数スロットをランダム再生。再生情報表示OFF、入力履歴ON。', 'CPU操作: OFF。',
   '地上行動にはガード/間合い管理、飛びにだけ対空。最初は地上行動2種+飛びから始め、慣れたら種類を増やす。',
   '20試行で飛びへの対空16回以上かつ、地上行動への対空暴発3回以下。', 20,
   'DIや生DRを1種類ずつ加えてMental Stack練習へ発展させる。'),

  ('foundation-di-reaction', 'Drive Impact返し：単独反応', 'reaction_di',
   'Drive Impactを見て返す一連の反応を自動化する。', 'beginner', 5,
   '簡単練習設定の「ドライブインパクトへの対応練習」を使用する。',
   '再生情報表示OFF。入力履歴ON。', 'CPU操作: OFF。',
   '相手のDrive Impactを見てから自分のDrive Impactで返し、成功後は自キャラの安定反撃を最後まで行う。',
   '10試行中8回以上で返しまで成功し、失敗を「反応遅れ」「別行動中」「入力ミス」に分類できる。', 20,
   '安定後は飛び・歩き・牽制を追加した複合反応へ進む。'),

  ('foundation-raw-dr-check', '生Drive Rush止め', 'reaction_dr',
   '相手の生Drive Rushへ反応して、止める・ガードする判断を安定させる。', 'intermediate', 8,
   '中距離から「生Drive Rush」「前歩き」「何もしない」を別スロットに記録する。',
   '3スロットをランダム再生。入力履歴ON。', 'CPU操作: OFF。',
   '生Drive Rushにだけ自キャラの停止候補を出す。届かない距離や遅れた時は無理に押さずガードする。',
   '20試行で、生Drive Rushへの対応結果を「停止成功・相打ち・ガード・被弾」に分類し、停止成功率70%以上を目標にする。', 20,
   '前ジャンプを追加して、対空との二重意識へ進む。'),

  ('foundation-random-guard-hit-confirm', 'Random Guardヒット確認', 'hit_confirm',
   'ヒット時だけコンボへ進み、ガード時は安全な行動で止める習慣を作る。', 'beginner', 8,
   'ダミーのガード設定をRandomにする。練習したい始動技を1種類に固定する。',
   'Guard: Random。入力履歴・ダメージ表示ON。', 'CPU操作: OFF。',
   '始動まで入力し、ヒットなら決めたコンボ、ガードなら決めた安全な停止/連携へ分岐する。最初は単一始動のみ。',
   '10回連続でヒット/ガードの分岐を誤らない。失敗時は「見間違い」と「指の入れ込み」を分けて記録する。', 20,
   '安定後はCounter/Punish CounterをRandomにして分岐を1つ追加する。'),

  ('foundation-post-block-punish', 'ガード後の確定反撃', 'punish',
   '相手の隙が大きい行動をガードした後、用意した反撃を遅れず返す。', 'beginner', 6,
   '相手キャラの「確定反撃できることを既に確認済みの技」を1〜3本だけ記録する。未確認技を練習対象にしない。',
   '通常またはランダム再生。ガード固定、入力履歴ON。', 'CPU操作: OFF。',
   '技をガードしたら、自キャラで確定すると確認済みの最短反撃から始める。慣れたらダメージの高い反撃へ置き換える。',
   '各対象技10回中9回以上、ガード後に反撃を成立させる。距離で届かない場合は別ケースとして分ける。', 20,
   '対象技を1本ずつ増やし、最終的にランダム再生で見分ける。'),

  ('foundation-max-punish', '最大反撃コンボ反復', 'punish',
   '無敵技など大きな隙をガードした時に、普段より高い反撃を確実に取る。', 'intermediate', 8,
   '大きな隙のある行動を1本記録し、ガード後の状況を固定する。',
   '通常再生。Punish Counter表示・入力履歴・ダメージ表示ON。', 'CPU操作: OFF。',
   '自キャラで現在確認済みの最大反撃ルートを、始動から締めまで反復する。未確認コンボは使用しない。',
   '10回連続で完走し、通常の小反撃へ妥協した回数が0回。', 20,
   '中央・端・SAあり/なしを別メニューとして追加する。'),

  ('foundation-whiff-punish', '差し返し：空振りを見て押す', 'whiff_punish',
   '相手の牽制の空振りを確認してから差し返す反応と間合いを作る。', 'intermediate', 8,
   '相手に「牽制技を空振り」「前後歩き」を別スロットで記録。最初は牽制1種類だけにする。',
   'ランダム再生。入力履歴ON。', 'CPU操作: OFF。',
   '牽制の予備動作ではなく空振りを見てから差し返す。歩きには技を振らず、自分の差し返し技が届く位置を維持する。',
   '20試行で差し返し成功12回以上、歩きへの誤反応3回以下。空振り/届かない失敗を分ける。', 20,
   '牽制技を2種類に増やすか、飛びを追加して対空との二重意識へ進む。'),

  ('foundation-throw-strike-defense', '投げ・打撃・遅らせ防御', 'defense_throw',
   '起き上がりや密着で、投げ・打撃・遅らせ行動へ同じ防御だけを連打しない練習をする。', 'intermediate', 8,
   '密着から「投げ」「打撃」「少し待って打撃」を別スロットに記録する。',
   '3スロットをランダム再生。ガード復帰設定を統一。', 'CPU操作: OFF。',
   '最初はガードを軸に結果を見る。次に投げ抜け、バックジャンプ、バクステ、パリィなどを1つずつ比較し、万能行動として扱わない。',
   '20試行すべてで被弾理由を「投げ・打撃・遅らせ・自分の暴れ」に分類できる。', 20,
   '画面端へ移し、DIを追加した端防御へ進む。'),

  ('foundation-corner-defense-mix', '画面端防御：打撃・投げ・シミー・DI', 'defense_corner',
   '画面端で複数の攻めを混ぜられた時の防御選択を練習する。', 'intermediate', 10,
   '端密着から「打撃重ね」「投げ」「シミー」「Drive Impact」を4スロットに記録する。具体的なキャラ連携は確認済みのものだけ使う。',
   '4スロットをランダム再生。入力履歴ON。', 'CPU操作: OFF。',
   'まずガード中心で観察し、必要に応じて投げ抜け・ジャンプ・パリィ・Drive Reversal・無敵技を使い分ける。',
   '20試行で同じ防御行動を5回以上連続せず、全被弾を相手択と自分択の組み合わせで説明できる。', 20,
   '苦手だった1択だけを単独再生して修正し、再び4択ランダムへ戻す。'),

  ('foundation-meaty-wakeup', '起き攻め：打撃重ねの再現', 'oki_meaty',
   'ダウン後の打撃重ねを感覚ではなく反復可能な手順として覚える。', 'beginner', 7,
   'ダウンリバーサルに「自キャラで検証用として使う最速小技」と「何もしない」を設定する。必要なら無敵技も別枠で追加する。',
   'ダウンリバーサルをランダム再生。入力履歴ON。', 'CPU操作: OFF。',
   '自キャラで既に確認済みのダウンを1つ選び、同じ前ステ/ラッシュ/通常技で毎回同じタイミングの打撃を重ねる。',
   '10回連続で小技暴れに負けず、何もしない相手へも空振りしない。同じダウン条件でのみ判定する。', 20,
   '打撃が安定したら同じ始動から投げ・シミーを追加する。'),

  ('foundation-oki-strike-throw-shimmy', '起き攻め：打撃・投げ・シミー三択', 'oki_mix',
   '同じダウンから打撃・投げ・シミーを使い分け、相手の防御癖へ対応する。', 'intermediate', 10,
   'ダウンリバーサルに「最速小技」「投げ抜け」「無敵技/パリィのうち確認したいもの」を別々に設定する。',
   'ダウンリバーサルをランダム再生。入力履歴ON。', 'CPU操作: OFF。',
   '確認済みの同一ダウンから、打撃重ね・投げ・少し下がって投げ抜け狩りを各10回。最後にランダム防御へ切り替えて選択する。',
   '各択を単独で10回連続再現し、その後20試行で「なぜその択を選んだか」を説明できる。', 30,
   '画面端と中央で結果が変わる場合は別メニューとして分ける。'),

  ('foundation-mental-stack-mix', '複合反応：飛び・DI・生DR・地上待機', 'decision_mixed',
   '実戦に近い複数の注意対象を混ぜ、1つだけを凝視しなくても反応できる状態を作る。', 'intermediate', 10,
   '「前ジャンプ」「Drive Impact」「生Drive Rush」「前後歩き/何もしない」を別スロットに記録。最初は2種類だけONにする。',
   'ランダム再生。再生情報表示OFF、入力履歴ON。', 'CPU操作: OFF。',
   '対空・DI返し・DR停止・ガード/歩きの担当行動を1つずつ決める。2択→3択→4択の順で増やし、一度に全部始めない。',
   '20試行で各行動への対応結果を分類し、特定1種類だけ成功率50%未満ならその単独練習へ戻る。', 20,
   '苦手1項目を5分単独練習してから、同じ4択ランダムへ再挑戦する。')
)
insert into public.trainings (
  slug, name, training_type, purpose, level, duration_minutes,
  player_character_id, dummy_character_id,
  recording_instructions, playback_settings, cpu_settings, method,
  success_criteria, recommended_reps, next_step,
  valid_from_patch_id, valid_to_patch_id, verification_status, content_kind, status
)
select r.slug, r.name, r.training_type, r.purpose, r.level, r.duration_minutes,
       null, null,
       r.recording_instructions, r.playback_settings, r.cpu_settings, r.method,
       r.success_criteria, r.recommended_reps, r.next_step,
       p.id, null, 'reviewed', 'verified_strategy', 'draft'
from rows r cross join current_patch p
on conflict (slug) do nothing;

-- 5) Link appropriate supporting references to each foundation drill.
with mapping(training_slug, source_url) as (
values
  ('foundation-bnb-both-sides', 'https://www.reddit.com/r/StreetFighter/comments/1op85xp'),
  ('foundation-bnb-both-sides', 'https://www.youtube.com/watch?v=ofUP9_Sqjso'),
  ('foundation-anti-air-level1', 'https://www.youtube.com/watch?v=ofUP9_Sqjso'),
  ('foundation-anti-air-level1', 'https://note.com/habanero_academy/n/n6ca171ccef2e'),
  ('foundation-anti-air-level1', 'https://note.com/kusaba_sos6925/n/n14e61c530cdf'),
  ('foundation-anti-air-level2', 'https://www.youtube.com/watch?v=ofUP9_Sqjso'),
  ('foundation-anti-air-level2', 'https://note.com/habanero_academy/n/n6ca171ccef2e'),
  ('foundation-di-reaction', 'https://note.com/haku_thinks/n/n2349c9df4a59'),
  ('foundation-raw-dr-check', 'https://www.youtube.com/watch?v=ofUP9_Sqjso'),
  ('foundation-random-guard-hit-confirm', 'https://www.reddit.com/r/StreetFighter/comments/1dmmlsf'),
  ('foundation-random-guard-hit-confirm', 'https://note.com/genji_shibamura/n/n82a0026a1be5'),
  ('foundation-post-block-punish', 'https://www.youtube.com/watch?v=ofUP9_Sqjso'),
  ('foundation-max-punish', 'https://www.reddit.com/r/StreetFighter/comments/1op85xp'),
  ('foundation-whiff-punish', 'https://www.youtube.com/watch?v=GHgvSf5O_68'),
  ('foundation-throw-strike-defense', 'https://www.youtube.com/watch?v=ofUP9_Sqjso'),
  ('foundation-throw-strike-defense', 'https://www.youtube.com/watch?v=4GFLhNe1Ni0'),
  ('foundation-corner-defense-mix', 'https://www.youtube.com/watch?v=4GFLhNe1Ni0'),
  ('foundation-meaty-wakeup', 'https://www.youtube.com/watch?v=ofUP9_Sqjso'),
  ('foundation-meaty-wakeup', 'https://note.com/kusaba_sos6925/n/n14e61c530cdf'),
  ('foundation-oki-strike-throw-shimmy', 'https://www.youtube.com/watch?v=4GFLhNe1Ni0'),
  ('foundation-mental-stack-mix', 'https://note.com/habanero_academy/n/n6ca171ccef2e'),
  ('foundation-mental-stack-mix', 'https://note.com/genji_shibamura/n/n82a0026a1be5')
)
insert into public.entity_sources (entity_type, entity_id, source_id, relationship, note)
select 'training', t.id, s.id, 'supporting', 'Practical Training Mode drill reference; reviewed, not verified.'
from mapping m
join public.trainings t on t.slug = m.training_slug
join public.sources s on s.url = m.source_url
on conflict (entity_type, entity_id, source_id) do nothing;

-- 6) Replace broad Juri placeholders with two concrete, source-backed drills.
update public.trainings
set name = 'ジュリ 中足ラッシュ・Random Guard確認',
    training_type = 'hit_confirm',
    purpose = '中足ラッシュまでを共通入力にし、ヒット時のコンボとガード時の攻め継続を見分ける。',
    level = 'intermediate',
    duration_minutes = 8,
    recording_instructions = 'ダミーのGuard設定をRandomにする。',
    playback_settings = 'Guard: Random。入力履歴ON。',
    cpu_settings = 'CPU操作: OFF。',
    method = '2MK > Drive Rushまで入力し、ヒット時は確認済みコンボへ、ガード時は2LP > 投げへ分岐する。最初は5回連続成功を目標にする。',
    success_criteria = '5回連続でヒット/ガード分岐を成功。安定後は10回、15回へ連続成功数を伸ばす。',
    recommended_reps = 15,
    next_step = '実戦で中足ラッシュを使い、分岐ミスが出たらRandom Guardへ戻る。',
    verification_status = 'reviewed',
    updated_at = now()
where slug = 'juri-training-hitconfirm'
  and status = 'draft'
  and verification_status = 'unverified';

update public.trainings
set name = 'ジュリ DI返し＋複合意識',
    training_type = 'reaction_di',
    purpose = 'DIだけを凝視する段階から、地上の接近を処理しながらDIも返す段階へ進む。',
    level = 'intermediate',
    duration_minutes = 10,
    recording_instructions = 'CPU Lv7を相手に使う実戦形式。最初は体力無限でDI返しだけに集中してもよい。',
    playback_settings = 'CPU戦形式。入力履歴ON。',
    cpu_settings = 'CPU Lv7。ゲージ類Normal。SAゲージ0。',
    method = '最初はDIを最優先で見る。慣れたら5LK/2LPで接近を咎め、2LP時は2LP > 2MPまで準備しながらDI返しも維持する。対空はこのドリルでは優先しない。',
    success_criteria = 'DIが出た10試行について「返し成功・反応遅れ・別行動中」を全て分類できる。3セット続けて改善が止まったら単独DI練習へ戻る。',
    recommended_reps = 30,
    next_step = 'DI返しが安定後、対空を1項目だけ追加してMental Stackを増やす。',
    verification_status = 'reviewed',
    updated_at = now()
where slug = 'juri-training-di'
  and status = 'draft'
  and verification_status = 'unverified';

-- Add the explicit Juri guide source to the refined rows.
insert into public.entity_sources (entity_type, entity_id, source_id, relationship, note)
select 'training', t.id, s.id, 'primary', 'Exact Training Mode settings and progression described in the guide.'
from public.trainings t
join public.sources s on s.url = 'https://note.com/genji_shibamura/n/n82a0026a1be5'
where t.slug in ('juri-training-hitconfirm', 'juri-training-di')
on conflict (entity_type, entity_id, source_id) do nothing;

-- 7) Refine Ken's generic DI row with a concrete CPU Lv7 corner drill from its guide.
update public.trainings
set name = 'ケン 画面端DI返し・CPU Lv7',
    training_type = 'reaction_di',
    purpose = '自分が画面端を背負った実戦負荷で、地上の小技牽制をしながらDIを返す。',
    level = 'intermediate',
    duration_minutes = 8,
    recording_instructions = '自分が画面端を背負った状態でCPU Lv7と対戦する。',
    playback_settings = 'CPU戦形式。入力履歴ON。',
    cpu_settings = 'CPU Lv7。体力は有限または反復しやすい設定。',
    method = 'DIボタンへ指を置き、相手の接近には2LPまたは5LKなど確認済みの軽い牽制を使う。飛びは無理に対空せずガードを優先し、DIが来たらDI返しから確認済みコンボへ。',
    success_criteria = 'CPUを1回倒すまで継続し、DI被弾・DI返し成功・別行動中を記録する。同条件を3セット行い被弾原因が減るか確認する。',
    recommended_reps = 3,
    next_step = 'DI返しが安定したら、対空も同時に見る通常対戦寄りの練習へ戻す。',
    verification_status = 'reviewed',
    updated_at = now()
where slug = 'ken-training-di'
  and status = 'draft'
  and verification_status = 'unverified';

insert into public.entity_sources (entity_type, entity_id, source_id, relationship, note)
select 'training', t.id, s.id, 'primary', 'Concrete CPU Lv7 corner DI-response drill described in the guide.'
from public.trainings t
join public.sources s on s.url = 'https://note.com/genji_shibamura/n/naf772200d914'
where t.slug = 'ken-training-di'
on conflict (entity_type, entity_id, source_id) do nothing;

-- 8) Harden Training publication readiness around reproducibility.
-- A public Training must contain enough information for a player to actually perform it.
create or replace function private.is_training_public_ready(target_training_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trainings tr
    join public.patches p on p.id = tr.valid_from_patch_id
    where tr.id = target_training_id
      and tr.status = 'published'
      and tr.verification_status = 'verified'
      and p.is_current = true
      and tr.valid_to_patch_id is null
      and tr.name is not null and btrim(tr.name) <> ''
      and tr.training_type is not null and btrim(tr.training_type) <> ''
      and tr.purpose is not null and btrim(tr.purpose) <> ''
      and tr.method is not null and btrim(tr.method) <> ''
      and tr.success_criteria is not null and btrim(tr.success_criteria) <> ''
      and tr.duration_minutes is not null and tr.duration_minutes > 0
      and tr.recommended_reps is not null and tr.recommended_reps > 0
      and (
        coalesce(btrim(tr.recording_instructions), '') <> ''
        or coalesce(btrim(tr.playback_settings), '') <> ''
        or coalesce(btrim(tr.cpu_settings), '') <> ''
      )
      and coalesce(tr.next_step, '') not ilike '%Counter%昇格%'
      and coalesce(tr.success_criteria, '') not ilike '%training_verified候補%'
      and coalesce(tr.method, '') not ilike '%training_verified候補%'
      and (
        tr.player_character_id is null
        or exists (
          select 1 from public.characters c
          where c.id = tr.player_character_id
            and c.status = 'published'
            and c.is_playable = true
        )
      )
      and (
        tr.dummy_character_id is null
        or exists (
          select 1 from public.characters c
          where c.id = tr.dummy_character_id
            and c.status = 'published'
            and c.is_playable = true
        )
      )
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'training'
          and es.entity_id = tr.id
      )
  );
$$;

create or replace function private.enforce_training_publication_ready()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status <> 'published' then
    return new;
  end if;

  if new.verification_status <> 'verified' then
    raise exception 'published training requires verification_status=verified';
  end if;

  if new.name is null or btrim(new.name) = ''
     or new.training_type is null or btrim(new.training_type) = ''
     or new.purpose is null or btrim(new.purpose) = ''
     or new.method is null or btrim(new.method) = ''
     or new.success_criteria is null or btrim(new.success_criteria) = '' then
    raise exception 'published training requires type, purpose, method and success criteria';
  end if;

  if new.duration_minutes is null or new.duration_minutes <= 0
     or new.recommended_reps is null or new.recommended_reps <= 0 then
    raise exception 'published training requires positive duration and repetitions';
  end if;

  if coalesce(btrim(new.recording_instructions), '') = ''
     and coalesce(btrim(new.playback_settings), '') = ''
     and coalesce(btrim(new.cpu_settings), '') = '' then
    raise exception 'published training requires reproducible Training Mode settings';
  end if;

  if coalesce(new.next_step, '') ilike '%Counter%昇格%'
     or coalesce(new.success_criteria, '') ilike '%training_verified候補%'
     or coalesce(new.method, '') ilike '%training_verified候補%' then
    raise exception 'internal verification work queue cannot be published as Training';
  end if;

  if new.valid_to_patch_id is not null
     or not exists (
       select 1 from public.patches p
       where p.id = new.valid_from_patch_id
         and p.is_current = true
     ) then
    raise exception 'published training must target the current patch';
  end if;

  if new.player_character_id is not null
     and not exists (
       select 1 from public.characters c
       where c.id = new.player_character_id
         and c.status = 'published'
         and c.is_playable = true
     ) then
    raise exception 'published training player must be a published playable character';
  end if;

  if new.dummy_character_id is not null
     and not exists (
       select 1 from public.characters c
       where c.id = new.dummy_character_id
         and c.status = 'published'
         and c.is_playable = true
     ) then
    raise exception 'published training dummy must be a published playable character';
  end if;

  if not exists (
    select 1 from public.entity_sources es
    where es.entity_type = 'training'
      and es.entity_id = new.id
  ) then
    raise exception 'published training requires Source evidence';
  end if;

  return new;
end;
$$;

-- Trigger is already present in prior Phase23 hardening. Recreate it to ensure
-- newly required columns also invoke the publication check when edited.
drop trigger if exists enforce_training_publication_ready on public.trainings;
create trigger enforce_training_publication_ready
before insert or update of status, verification_status, name, training_type, purpose, method,
  success_criteria, duration_minutes, recommended_reps, recording_instructions,
  playback_settings, cpu_settings, next_step, valid_from_patch_id, valid_to_patch_id,
  player_character_id, dummy_character_id
on public.trainings
for each row
execute function private.enforce_training_publication_ready();
