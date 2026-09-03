-- Phase23 practical Training batch 1.
-- Current-patch/community-derived drills for Chun-Li (Modern), E. Honda, A.K.I.,
-- Zangief, Elena (Classic), and C. Viper (Modern).
-- reviewed != verified; draft != published. This migration never publishes Training.

insert into public.sources (title, url, source_type, publisher, published_at, accessed_at, reliability_level, notes)
select v.title, v.url, 'character_guide', v.publisher, v.published_at, now(), 'community', v.notes
from (values
  ('[2026.08.03 Ver.]スト6 春麗 モダン コンボ/起き攻め/よくある状況などまとめ', 'https://note.com/tonpeidon/n/n86c1fb47de94', '豚平', '2026-08-10T11:50:00+09:00'::timestamptz, '2026.08.03 Ver.を明記したモダン春麗のコンボ・起き攻め資料。'),
  ('スト６ エドモンド本田起き攻め。あとコンボ Ver.2026.08', 'https://note.com/bonmoko_3/n/n8257f7cd418f', 'ボンモコ', null::timestamptz, '2026.08.03調整を本文で反映した本田のコンボ・起き攻め資料。'),
  ('スト６ 本田 アプデで変わったことVer2026.08.03', 'https://note.com/bonmoko_3/n/n47466be04678', 'ボンモコ', null::timestamptz, '2026.08.03の変更により増えた起き攻め・相撲ステップ関連を解説。'),
  ('10日でマスター行った簡単A.K.I.まとめ', 'https://note.com/takasin667/n/n69b37c49a845', 'Takasin', null::timestamptz, '2026年8月下旬公開。現行版で使う簡潔なA.K.I.コンボ・起き攻めを整理。'),
  ('A.K.I. 起き攻めは全部6強Pにしよう！', 'https://note.com/vast_yeti9033/n/nda1d11b198aa', 'トマソン', '2026-08-23T17:27:00+09:00'::timestamptz, '現行版6強P持続重ねのフレーム消費例。'),
  ('ザンギエフ コンボとセットアップ(2026.08.03 update)', 'https://note.com/good_lion2040/n/n95791feb0a8b', 'キノコ灯', null::timestamptz, '2026.08.03 update準拠のザンギエフコンボ・セットアップ資料。'),
  ('クラシック エレナ コンボ・起き攻め まとめ 08/03更新', 'https://note.com/tigrex/n/n295061ad909f', 'ノート', '2025-06-08T14:00:00+09:00'::timestamptz, '2026.08.03アップデート対応内容を追記したクラシックエレナ資料。対応中記述はverifiedにしない。'),
  ('モダン C･ヴァイパー コンボ自分用メモ (2026/8/3)', 'https://note.com/emesirna/n/n941607718414', 'さーな', '2025-10-23T13:54:00+09:00'::timestamptz, '記事タイトル・内容が2026/8/3版に更新されたモダンC.ヴァイパー資料。')
) as v(title, url, publisher, published_at, notes)
where not exists (select 1 from public.sources s where s.url = v.url);

with current_patch as (
  select id from public.patches where is_current = true order by created_at desc limit 1
), rows(character_slug, slug, name, training_type, purpose, level, duration_minutes,
       recording_instructions, playback_settings, cpu_settings, method,
       success_criteria, recommended_reps, next_step) as (
values
-- Chun-Li Modern
('chun-li','chun-li-modern-light-bnb-20260803','春麗（モダン）弱始動BnB','execution',
 '近距離の弱攻撃ヒットから、現行版の安定した百裂脚締めを左右両側で手癖にする。','beginner',6,
 'ダミー立ち、Guard OFF。1P側と2P側を交互に行う。','入力履歴・ダメージ表示ON。','CPU操作: OFF。',
 '立ち弱×2 > 中百裂脚を基本に10回ずつ。距離が近く安定するときだけ立ち弱を3回まで刻む。',
 '1P側・2P側それぞれ10回連続で完走し、3回刻んで空振る距離も識別できる。',20,
 '安定後はGuard Randomにして、ヒット時だけ百裂脚まで完走する。'),
('chun-li','chun-li-modern-crmk-dr-bnb-20260803','春麗（モダン）中技ラッシュ基本コンボ','hit_confirm',
 '中距離の主力中技からDrive Rushを使った現行版基本ルートを安定させる。','intermediate',8,
 'ダミー立ち、最初はGuard OFF。ルート安定後にGuard Randomへ変更。','入力履歴・ダメージ表示ON。','CPU操作: OFF。',
 'しゃがみ中 または 追突 > Drive Rush > 発剄 > 構え中K > 強スピニングバードキックを反復する。難しい場合はまず始動をしゃがみ中1種類に固定する。',
 '単独ルート10回連続成功後、Guard Random 20試行でヒット時の完走とガード時の停止を分けられる。',30,
 '始動技を追突にも広げ、同じ後半ルートへ合流させる。'),
('chun-li','chun-li-modern-pc-punish-20260803','春麗（モダン）無敵技ガード後PC反撃','punish',
 '大きな隙へのノーゲージPunish Counter反撃を取り切る。','intermediate',7,
 '十分な隙がある確認済み無敵技をダミーに記録するか、Punish Counter設定を使用。','ガード固定。入力履歴・ダメージ表示ON。','CPU操作: OFF。',
 '翼旋脚(前強) PC > 発剄 > 構え中K > 強天昇脚を10回反復する。距離で発剄が届かないケースは別結果として記録する。',
 '10回連続でPunish Counter始動を確認して完走できる。',20,
 '距離が遠いケースは別の反撃ルートとして分離する。'),
('chun-li','chun-li-modern-di-pc-20260803','春麗（モダン）DI返し後の定番反撃','reaction_di',
 'Drive Impact返し成功後に現行版の安定した空中コンボへ移る。','intermediate',8,
 '簡単練習設定のDI対応、またはDIを出すレコードを使用する。','再生情報OFF。入力履歴ON。','CPU操作: OFF。',
 'DI返しPC > しゃがみ強 > 構え強K > 鷹爪脚1 > 遅らせ鷹爪脚2 > ジャンプ強PTCを反復する。最初はDI返し後のコンボ部分だけ練習してよい。',
 'DI返し成功後10回中9回以上で同じ反撃を完走できる。',20,
 '安定後は歩き・飛びを追加したDI複合反応へ進む。'),

-- E. Honda
('e-honda','e-honda-hyakkan-oki-20260803','本田 百貫ヒット後+23起き攻め','oki',
 'スーパー百貫落とし地上ヒット後の頻出起き攻めを、フレーム消費込みで再現する。','intermediate',8,
 '百貫地上ヒットから開始。ダウンリバーサルに最速小技と何もしないを設定。','ダウンリバーサルをランダム再生。Frame Meter・入力履歴ON。','CPU操作: OFF。',
 '百貫ヒット後、しゃがみ弱P空振りで+7状況を作り、強大銀杏投げと立ち強K重ねを各10回練習する。',
 '投げ・打撃を各10回同じ手順で再現し、最速小技/ジャンプに対する結果を記録できる。',20,
 '通常投げ・前ステ+4Fなど別の起き攻めは別メニューとして追加する。'),
('e-honda','e-honda-corner-di-cannon-shiko-20260803','本田 端DI PC→大砲→四股→頭突き','punish',
 '2026.08.03で可能になった端DI始動の高リターンルートを安定させる。','intermediate',8,
 '画面端。Counter設定をPunish Counter、またはDI返し状況を作る。','入力履歴・ダメージ表示ON。','CPU操作: OFF。',
 'DI(PC) > 立ち強P > 大砲 > 四股 > 強頭突きを反復する。',
 '10回連続で完走し、締め後+42F前後の起き攻め状況をFrame Meterで確認できる。',20,
 '完走後は安全飛び候補と前ステ起き攻めを別Trainingで確認する。'),
('e-honda','e-honda-strong-headbutt-oki-20260803','本田 強頭突き締め後の二系統起き攻め','oki',
 '強頭突き締め後の+45F状況から、持続打撃と打撃/コマ投げ択を分けて練習する。','intermediate',10,
 '大砲等から強頭突きで締めて+45F付近を作る。最速小技と何もしないをダウンリバーサルへ設定。','ランダム再生。Frame Meter ON。','CPU操作: OFF。',
 'A: しゃがみ強P空振り > 立ち中P。B: 前ステ2回 > 打撃またはコマ投げ。A/Bを各10回行う。',
 'A/B各10回で同じフレーム消費を再現し、暴れに対する結果を説明できる。',20,
 '2026.08.03でDリバをガードできなくなった旧セットプレイと混同しない。'),
('e-honda','e-honda-haraigeri-pc-oki-20260803','本田 払い蹴りPC後の新起き攻め','oki',
 '2026.08.03で追加された払い蹴り地上PC後の起き攻めを反復する。','intermediate',7,
 '地上Punish Counter設定で払い蹴りを当て、スライドダウンを再現する。','Frame Meter・入力履歴ON。','CPU操作: OFF。',
 '払い蹴りPC > 中頭突き > 前ステで+4F付近を作り、打撃とコマ投げを各10回試す。',
 '10回連続で中頭突き>前ステの同じ状況を作り、打撃/投げの結果を分けて記録できる。',20,
 '距離依存が出る場合は開始距離を固定して別ケース化する。'),

-- A.K.I.
('aki','aki-light-bnb-heavy-whip-20260803','A.K.I. 小技→強蛇頭鞭BnB','execution',
 '現行版で頻出する小技始動から強蛇頭鞭までを安定させる。','beginner',6,
 'ダミー立ち、Guard OFF。左右両側で反復する。','入力履歴・ダメージ表示ON。','CPU操作: OFF。',
 '2弱P > 2弱P > 弱K > 強蛇頭鞭を左右各10回。',
 '左右それぞれ10回連続で完走できる。',20,
 '安定後は弱PTCを使う別始動と比較する。'),
('aki','aki-light-ptc-heavy-whip-20260803','A.K.I. 2弱P→弱PTC→強蛇頭鞭','execution',
 'アップデート後に繋がる弱PTCを使った簡潔な小技ルートを手癖にする。','beginner',6,
 'ダミー立ち、Guard OFF。','入力履歴・ダメージ表示ON。','CPU操作: OFF。',
 '2弱P > 弱Pターゲットコンボ > 強蛇頭鞭を20回。ガード時は強蛇頭鞭まで入れ込む練習にしない。',
 '10回連続完走を2セット。',20,
 'Guard Randomへ切り替え、ヒット時だけ強蛇頭鞭へ進む。'),
('aki','aki-6hp-meaty-plus44-20260803','A.K.I. +44Fから6強P持続重ね','oki',
 '現行版で頻出する+44Fダウンから、6強Pの+18F持続重ねセットを再現する。','intermediate',8,
 '強蛇頭鞭締めなど、出典で+44Fとされる同一ダウン状況を固定する。ダウンリバーサルに最速小技と何もしないを設定。','Frame Meter ON。','CPU操作: OFF。',
 '+44Fから2弱K×2空振り、または中P空振りでフレーム消費し、6強Pを重ねる。2種類を各10回比較する。',
 '各ルート10回で同じ重なりを再現し、ヒット/ガード時のフレーム差をFrame Meterで確認できる。',20,
 '実機再現が一致したルートだけverified候補にする。'),
('aki','aki-6hp-meaty-frame-consumption-20260803','A.K.I. 6強P重ねのフレーム消費4パターン','oki',
 '異なるダウン有利から同じ+18Fへ合わせるフレーム消費を覚える。','advanced',10,
 '出典の+44/+37/+32/+31F状況を1つずつ個別に作る。','Frame Meter ON。','CPU操作: OFF。',
 '+44: 2弱K×2または中P空振り、+37: 前ステ、+32: 2弱P空振り、+31: 弱P空振り。その後6強Pを重ねる。1条件ずつ10回。',
 '4条件を混ぜず個別に10回再現し、各条件で6強Pの当たり方が一致する。',40,
 '4条件が安定してから、実戦で多い2条件だけをランダムに練習する。'),

-- Zangief
('zangief','zangief-light-bnb-ppp-20260803','ザンギエフ 小足→弱P→PPP基本ルート','execution',
 '小技ヒットから+38Fの起き攻めへ移る現行版基本ルートを安定させる。','beginner',6,
 'ダミー立ち、Guard OFF。左右両側で練習する。','入力履歴・Frame Meter ON。','CPU操作: OFF。',
 '2弱K > 弱P > PPPを左右各10回。PPP後は前を入れて距離が離れないようにする。',
 '左右10回連続完走し、締め後+38F付近を毎回確認できる。',20,
 '安定後は+38F起き攻めTrainingへ進む。'),
('zangief','zangief-plus38-dr-6hp-oki-20260803','ザンギエフ +38F→DR6強P起き攻め','oki',
 'PPP締め後の+38FからDrive Rush 6強Pの持続重ねを再現する。','intermediate',8,
 '2弱K>弱P>PPPで+38F状況を作り、ダウンリバーサルに最速小技/何もしないを設定。','ランダム再生。Frame Meter ON。','CPU操作: OFF。',
 '+38FからDrive Rush > 6強Pを重ねる。ヒット時は6強P > 3中P > PP、ガード時はディレイ中スクリュー候補を別々に10回練習する。',
 'DR6強Pを20回同じタイミングで重ね、ヒット/ガードの分岐を混同しない。',20,
 'DRスクリュー・DR3投げ・DRガードは別の読み合いTrainingへ分離する。'),
('zangief','zangief-corner-plus38-mix-20260803','ザンギエフ 端+38F 打撃・大スクリュー・シミー','oki',
 '画面端の+38F状況で、打撃・コマ投げ・シミーを同じ始動から出し分ける。','intermediate',10,
 '画面端でPPP締め+38Fを作る。ダウンリバーサルに最速小技・投げ抜け・何もしないを設定。','ランダム再生。','CPU操作: OFF。',
 'A: 歩き>6強P、B: 歩き>大スクリュー、C: シミーを各10回単独練習した後、相手行動をランダムにして20試行する。',
 'A/B/Cを各10回再現し、その後20試行で選択理由と結果を分類できる。',50,
 '特定防御に偏る相手への最適択を別途整理する。'),

-- Elena Classic
('elena','elena-classic-strong-spin-pc-basic-20260803','エレナ（クラシック）強スピンサイズPC基本反撃','punish',
 '現行版の強スピンサイズPunish Counterから、ノーゲージの安定追撃を反復する。','intermediate',8,
 'Punish Counter設定。画面中央・同じ開始距離に固定。','入力履歴・ダメージ表示ON。','CPU操作: OFF。',
 '強スピンサイズ(PC) > リンクスワール > 中派生 > 遅らせ強昇龍を10回。',
 '10回連続で完走し、遅らせ強昇龍の失敗を「早い/遅い」に分けられる。',20,
 'SAゲージがある場合のSA1/SA3ルートは別Trainingへ分ける。'),
('elena','elena-classic-strong-spin-od-rhino-sa2-20260803','エレナ（クラシック）強スピンサイズ→ODライノ→SA2','execution',
 '2026.08.03で繋がりやすくなったODライノからSA2へ移るルートを練習する。','advanced',10,
 'ダミー立ち、Guard OFF。最初は通常ヒット確認ではなくコンボ部分のみ練習。','入力履歴・ダメージ表示ON。','CPU操作: OFF。',
 '強スピンサイズ(PC) > リンクスワール > 中派生 > ODライノホーン > SA2を反復する。ODライノの遅らせ有無で結果を記録する。',
 '10回中8回以上完走し、ODライノのタイミング差によるダメージ/ヒット状態を区別できる。',20,
 '安定後はSA3への接続や画面端条件を別ケースで確認する。'),
('elena','elena-classic-crmp-dr-sa2-route-20260803','エレナ（クラシック）2中Pラッシュ→SA2現行ルート','execution',
 '中距離始動から2026.08.03対応のSA2ルートを1本に固定して習得する。','advanced',10,
 'ダミー立ち、Guard OFF。中央開始。DゲージとSA2ゲージを必要量に固定。','入力履歴・ダメージ表示ON。','CPU操作: OFF。',
 '2中P > キャンセルラッシュ > 中K > 2強P > 強スピンサイズ > ODライノ > SA2を反復する。',
 '10回中8回以上で完走し、ODライノのタイミングミスを特定できる。',20,
 '安定後はGuard Randomで2中Pヒット時だけラッシュへ進む。'),
('elena','elena-classic-central-oki-plus39-20260803','エレナ（クラシック）中央+39F起き攻めルート','oki',
 '中央コンボから+39F付近の起き攻めへ毎回同じ締めで移行する。','advanced',10,
 '中央。ダウンリバーサルに最速小技・何もしないを設定。','Frame Meter ON。','CPU操作: OFF。',
 '2中P > CR > 2強P > 2中Kターゲット > 弱ムーングライド > 派生までを反復し、+39F付近を作る。',
 '10回連続で同じ締めとダウン状況を再現し、Frame Meterの結果を保存できる。',20,
 'その後の打撃/投げ/シミーは実機で成立確認後に別Trainingとして分ける。'),

-- C. Viper Modern
('c-viper','c-viper-modern-light-thunder-trace-20260803','C.ヴァイパー（モダン）弱始動→強サンダー→トレース','execution',
 '現行版モダンで頻出する弱攻撃始動の安定締めを左右で反復する。','beginner',7,
 'ダミー立ち、Guard OFF。左右両側で開始。','入力履歴・ダメージ表示ON。','CPU操作: OFF。',
 '記事表記に従い、立弱×1〜3 > 強サンダー > トレースを反復する。最初は立弱2回に固定する。',
 '左右それぞれ10回連続で完走できる。',20,
 '安定後は弱攻撃の刻み方を増やす。'),
('c-viper','c-viper-modern-light-crlight-assist-thunder-20260803','C.ヴァイパー（モダン）弱刻み→A弱→強サンダー','execution',
 'しゃがみ弱を含む刻みからアシスト弱を経由して安定締めへ移る。','intermediate',8,
 'ダミー立ち、Guard OFF。','入力履歴・ダメージ表示ON。','CPU操作: OFF。',
 '立弱 > 屈弱 > A弱 > 強サンダー > トレースを20回。記事の略号A弱はモダンのアシスト弱入力として扱う。',
 '10回連続完走を2セット行う。',20,
 'Guard Randomでヒット時だけ最後まで出す確認練習へ進む。'),
('c-viper','c-viper-modern-thunder-trace-oki-20260803','C.ヴァイパー（モダン）強サンダー→トレース後+5F起き攻め','oki',
 '頻出する強サンダー>トレース締め後の良い起き攻め状況を再現する。','intermediate',8,
 '強サンダー > トレースで締めた同一コンボから開始。ダウンリバーサルに最速小技・投げ抜け・何もしないを設定。','Frame Meter・入力履歴ON。','CPU操作: OFF。',
 '締め後に前ステップして+5F投げ間合いを作る。中央で投げ・打撃・シミーを各10回単独練習する。',
 '前ステ後の状況を10回連続で再現し、3択それぞれの勝ち/負けを記録できる。',30,
 '画面端ではシミー条件が変わるため中央と分離する。'),
('c-viper','c-viper-modern-di-pc-assist-route-20260803','C.ヴァイパー（モダン）DI PC→強アシストコンボ','reaction_di',
 'DI返し後の追撃を複雑にしすぎず、モダン強アシストコンボへ安定して移る。','beginner',6,
 '簡単練習設定のDI対応、またはDIレコードを使用。','再生情報OFF。入力履歴ON。','CPU操作: OFF。',
 'DI返しPC後、強アシストコンボへ移行して締めまで完走する。空中PC/高浮き時は最速追撃で高さを崩さないよう別ケースとして扱う。',
 'DI返し成功後10回中9回以上で同じ追撃を完走できる。',20,
 '安定後は端背負い時の位置入れ替えルートを別Trainingで追加する。')
)
insert into public.trainings (
  slug, name, training_type, purpose, level, duration_minutes,
  player_character_id, dummy_character_id,
  recording_instructions, playback_settings, cpu_settings, method,
  success_criteria, recommended_reps, next_step,
  valid_from_patch_id, valid_to_patch_id, verification_status, content_kind, status
)
select r.slug, r.name, r.training_type, r.purpose, r.level, r.duration_minutes,
       c.id, null,
       r.recording_instructions, r.playback_settings, r.cpu_settings, r.method,
       r.success_criteria, r.recommended_reps, r.next_step,
       p.id, null, 'reviewed', 'verified_strategy', 'draft'
from rows r
join public.characters c on c.slug = r.character_slug and c.status='published' and c.is_playable=true
cross join current_patch p
on conflict (slug) do nothing;

with mapping(training_slug, source_url) as (
values
  ('chun-li-modern-light-bnb-20260803','https://note.com/tonpeidon/n/n86c1fb47de94'),
  ('chun-li-modern-crmk-dr-bnb-20260803','https://note.com/tonpeidon/n/n86c1fb47de94'),
  ('chun-li-modern-pc-punish-20260803','https://note.com/tonpeidon/n/n86c1fb47de94'),
  ('chun-li-modern-di-pc-20260803','https://note.com/tonpeidon/n/n86c1fb47de94'),
  ('e-honda-hyakkan-oki-20260803','https://note.com/bonmoko_3/n/n8257f7cd418f'),
  ('e-honda-corner-di-cannon-shiko-20260803','https://note.com/bonmoko_3/n/n8257f7cd418f'),
  ('e-honda-strong-headbutt-oki-20260803','https://note.com/bonmoko_3/n/n8257f7cd418f'),
  ('e-honda-haraigeri-pc-oki-20260803','https://note.com/bonmoko_3/n/n47466be04678'),
  ('aki-light-bnb-heavy-whip-20260803','https://note.com/takasin667/n/n69b37c49a845'),
  ('aki-light-ptc-heavy-whip-20260803','https://note.com/takasin667/n/n69b37c49a845'),
  ('aki-6hp-meaty-plus44-20260803','https://note.com/vast_yeti9033/n/nda1d11b198aa'),
  ('aki-6hp-meaty-frame-consumption-20260803','https://note.com/vast_yeti9033/n/nda1d11b198aa'),
  ('zangief-light-bnb-ppp-20260803','https://note.com/good_lion2040/n/n95791feb0a8b'),
  ('zangief-plus38-dr-6hp-oki-20260803','https://note.com/good_lion2040/n/n95791feb0a8b'),
  ('zangief-corner-plus38-mix-20260803','https://note.com/good_lion2040/n/n95791feb0a8b'),
  ('elena-classic-strong-spin-pc-basic-20260803','https://note.com/tigrex/n/n295061ad909f'),
  ('elena-classic-strong-spin-od-rhino-sa2-20260803','https://note.com/tigrex/n/n295061ad909f'),
  ('elena-classic-crmp-dr-sa2-route-20260803','https://note.com/tigrex/n/n295061ad909f'),
  ('elena-classic-central-oki-plus39-20260803','https://note.com/tigrex/n/n295061ad909f'),
  ('c-viper-modern-light-thunder-trace-20260803','https://note.com/emesirna/n/n941607718414'),
  ('c-viper-modern-light-crlight-assist-thunder-20260803','https://note.com/emesirna/n/n941607718414'),
  ('c-viper-modern-thunder-trace-oki-20260803','https://note.com/emesirna/n/n941607718414'),
  ('c-viper-modern-di-pc-assist-route-20260803','https://note.com/emesirna/n/n941607718414')
)
insert into public.entity_sources(entity_type, entity_id, source_id, relationship, note)
select 'training', t.id, s.id, 'primary', 'Current-version practical character Training reference; reviewed, not verified.'
from mapping m
join public.trainings t on t.slug=m.training_slug
join public.sources s on s.url=m.source_url
on conflict(entity_type,entity_id,source_id) do nothing;
