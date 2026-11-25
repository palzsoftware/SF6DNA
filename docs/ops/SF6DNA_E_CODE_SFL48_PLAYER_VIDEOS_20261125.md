# E・Code｜SFL48 Player図鑑・関連動画・キャラ動画 ローカル候補（2026-11-25）

- worktree: `C:\Users\user\Desktop\SF6DNA-E-PLAYER-VIDEOS-20261125`（branch `e-code-player-videos-20261125`、基準 `5da6353`）
- D・Code（技カード）とは別worktree。Push・DB更新・公開設定変更・デプロイは未実施。
- 全データ行は `publicationApproval: "PENDING"` のまま。公開ゲート（`player-publication-gate.ts`）は変更なし。

## 入力（Drive）

| ファイル | 行数 | sha256 |
|---|---|---|
| SF6DNA_SFL48_PROFILE_20261125.csv | 48 | dfa14c78…4fad |
| SF6DNA_SFL48_PROFILE_DELTA_20261125.csv | 386 | 3f5af666…72c3 |
| SF6DNA_SFL48_VIDEOS_20261125.csv | 65 | 9f72e740…4ee1 |
| SF6DNA_SFL48_VIDEOS_DELTA_20261125.csv | 18 | 9bbd5c10…b5d |
| SF6DNA_SPLIT_PLAYER_VIDEOS_20261124.patch | — | f5fff15b…5349 |
| SF6DNA_PLAYER_RELATED_VIDEOS_RECONCILE_V2_20261124.csv | 44 | — |

## A. 前回44件の差分

- patch の index（blob）5件がすべて `5da6353` と一致し、基準SHAは `5da6353`。Driveの生バイトで `git apply --check` が通り、適用済み（commit `39d0721`）。
  - Drive のテキスト表示経由（Markdownエスケープ・行頭空白削除）では適用できないため、必ず生バイトを使うこと。
- 44行 = 43行接続 + brayan-job 1行保留（本番draft・開発DBに行なし）。videos.json 359→402行。
- 同じ試合のまとめ仕様（`startSeconds` / `sameMatchFullStream{youtubeId,startSeconds,chapterNote}`）と種別「配信・ランクマ」はこのpatchで導入済みの既存仕様として利用。

### 今回CSVの「既存／新規」訂正（patch適用後の実データと照合）

- 新規→既存（18件）: `BDKiKN1KD0s`（第7節フル配信）は18選手とも 11/19 統合で登録済み。
- 既存→新規（1件）: sako `HIro8dvcINA` は研究CSVには既存だが、選手動画には未登録だった。今回追加。
- 「同一試合のクリップは既存」の訂正:
  - `e-V2iILIsUQ`（Jr. vs YAS）と `86lnoMqGvIs`（わびいち vs カワノ）はどの選手にも未登録。
  - `awpc0ZUw9yQ`・`wA5betZMs1c`・`RbqPkG7nhDs` は片方の選手だけ登録済みだった。

## B. 第7節 18行（動画追記CSV）

- 18選手のフル配信行と、対応するクリップ行に `matchEvidence` を追記した。
  - 中身: `chapterTime` / `matchIdentifiedAt` / `matchIdentifiedBy` / `characterBasis` / `checkedOn`。
  - `matchIdentifiedAt`（章の約2分後の映像確認時刻）は試合を特定した根拠。開始時刻には使っていない。`startSeconds` は未設定のまま。
- キャラの根拠:
  - `video_confirmed`（3試合・6選手）: 大谷×板橋ザンギエフ、マゴ×さはら、わびいち×カワノ
  - `official_clip_title`（6試合・12選手）
- 1カードにまとめる表示: 単試合クリップが主リンク、フル配信は補助リンク。
  - 映像照合済みの開始時刻がないため、補助リンクは `t=` なしの通常リンク。章時刻は「概要欄の章 X・未照合」として記録だけ残す。
- 単試合クリップ行を追加したのは3選手: keib `awpc0ZUw9yQ`、tokido `wA5betZMs1c`、daigo `RbqPkG7nhDs`。
  - タイトルとチャンネルは、相手選手側の既存クリップ行から転記した。
- 保留4選手: jr・yas・wabiichi・kawano。クリップ未登録のため、フル配信カード（根拠追記済み）だけ表示する。
- 選手の解説・ランクマ動画を15本追加した。
  - 内訳: ぷげら2、ナウマン1、ACQUA4、Shuto3（うち1本は配信・ランクマ）、もけ2、ガチくん2、sako1。
- Nephew と ストーム久保は48名の対象外のため、選手には紐づけずキャラページだけに掲載。
- videos.json は 420行、video-bindings.json は 719行。

## C. プロフィール（`profile-supplements.json`、48名）

- SFL2026所属チーム（公式ロスター）と「所属・スポンサー（履歴・Wiki）」は別の項目。
- 「開幕前のSFL公式登録キャラ」と「SF6での使用キャラ（履歴・参考／Wiki）」も別の項目。
  - 既存の確定メイン・サブ（team-bindings）は変更していない。
- デバイス:
  - 種類は公式。機種は「種類=公式、機種=二次まとめ」の23名だけ掲載する。
  - 「機種候補」止まりの25名は種類のみ。
- 生年月日・出身・趣味は SFL公式。ひなお・takepi の生年月日は非掲載。
- プレイスタイル: Wiki本文は転載しない。公式Q&Aを「本人コメント（プレイの見どころ）」として表示する（開幕前の自己申告と明記）。
- SNS:
  - X は SFL公式ロスター。YouTube と Twitch は「SFL公式掲載」の確認済み分だけ。
  - ボンちゃん・かずのこは YouTube/Twitch を保留（公式データの入れ替わり疑い）。X は既存の確認済みを維持。
  - Wiki だけのリンクは本人と照合していないため採用しない。
  - 既存の表示経路は DB の `players.{x,youtube,twitch}_url`。DB へ入れる案は `SF6DNA_SFL48_SNS_DB_PROPOSAL_20261125.sql`（未適用。NULLの列だけ埋め、上書きしない。96文）。
  - ローカルではプロフィール補足欄で表示を確認した。

## D. キャラページの関連動画（`src/data/character-videos/registered.json`）

- 公式キャラクターガイドはユニーク動画ID 29本・29キャラ（30本ではない）。春麗・ジュリ・マノンは公式ガイドなし。
- 選手の解説動画17本は、選手への紐づけ根拠があるもののみ `playerSlug` を設定した。
- 対戦動画は、選手動画のうち「大会対戦」かつ characterLinks のあるものから導出する。
  - 同じ動画は1回だけ表示する。クリップでまとめ済みのフル配信は別に出さない。
- 表示箇所は「関連ビデオ」欄の自動検索結果の前。`character-unified-page.tsx` は変更していない（既存の `automaticVideos` 枠を使用）。

## 表示件数

### 現在の公開設定で見える件数

開発DBで `next dev`（ローカル確認スイッチOFF）を実際に巡回した結果。

| 項目 | 件数 | 理由 |
|---|---|---|
| 選手ページ | 1/48（tokido） | 公開条件。開発DBで anon に見える published 行は tokido のみ。ゲートの対象（開発ミラー）は9名 |
| プロフィール補足 | 0/48 | 公開条件（PENDING） |
| 関連動画 | 0/48 | 公開条件（PENDING） |
| キャラ解説 | 0/32 | 公開条件（PENDING） |
| キャラ対戦 | 0/32 | 公開条件（PENDING） |

- キャラページは開発DBで31/32表示。arjun は 404（DB側）。
- 本番の公開ゲートで表示対象になる48名中の選手は9名: sako・dogura・shuto・higuchi・yamaguchi・takepi・tokido・john-takeuchi・hinao。
  - 本番DBの status は確認していない（接続していない）。

### ローカル確認スイッチON（承認待ちを確認用に表示）、開発DB

| 項目 | 件数 |
|---|---|
| 選手ページ | 1/48 |
| プロフィール補足 | 1/48 |
| 関連動画 | 1/48 |
| キャラ解説 | 31/32 |
| キャラ対戦 | 28/32 |

- 重複カードは0件。`t=` 付きリンクは0件。
- 31/32 と 28/32 は arjun ページの 404（DB）分だけ少ない。

### 隔離環境で表示確認した件数

承認済みコピーをメモリ上で描画した（`tests/sfl48-profile-character-videos-20261125.test.mjs`）。

| 項目 | 本番ID | 開発ID |
|---|---|---|
| プロフィール | 48/48 | 48/48 |
| 関連動画 | 41/48 | 48/48 |
| キャラ解説 | 32/32 | 32/32 |
| キャラ対戦 | 29/32 | 29/32 |

- 関連動画で本番が41/48の理由: fujimura・kazunoko・cosa・machabo・wabiichi・yas・takagi の7名は、`5da6353` 時点から動画バインディングが開発IDだけで、本番IDの接続がない（データ不足）。
- キャラ対戦がない3キャラ（alex・marisa・yasmine）は、48名の対戦動画にそのキャラの行がない（データ不足）。
- 公開ゲートの対象9名に限ると、承認されればプロフィール 9/9、関連動画 9/9。

## 変更ファイル

- `v2-web/src/data/player-research/videos.json`, `video-bindings.json`（追記）
- `v2-web/src/data/player-research/profile-supplements.json`（新規）
- `v2-web/src/data/character-videos/registered.json`（新規）
- `v2-web/src/components/player-profile-supplement.tsx`（新規）
- `v2-web/src/components/character-registered-videos.tsx`（新規）
- `v2-web/src/components/player-detail-supplements.tsx`, `player-profile.tsx`（補足欄の差し込み）
- `v2-web/src/app/characters/[slug]/page.tsx`（登録動画を関連ビデオ欄に差し込み）
- `v2-web/scripts/player-research/build-sfl48-20261125.cjs`, `csv.cjs`（再生成スクリプト。`39d0721` から再実行するとバイト一致）
- `v2-web/tests/sfl48-profile-character-videos-20261125.test.mjs`（新規）。既存テスト2本の依存表に新しいimportを追加。
- `docs/ops/SF6DNA_SFL48_SNS_DB_PROPOSAL_20261125.sql`（未適用）

## 確認方法

- `npm test`
  - 1239件中 1231 pass。失敗5件は技カード・GIF・診断の既存テストで、基準でも同じく失敗する。
  - 選手関連テストは 81/81 pass。
- `npx tsc --noEmit`・eslint（変更ファイル）は問題なし。
- `SF6DNA_PLAYER_LOCAL_PREVIEW=1 npx next dev` → `http://localhost:<port>/players/tokido`、`/characters/<slug>`

## 未照合・保留

- クリップ `e-V2iILIsUQ`・`86lnoMqGvIs` のタイトルとURL確認（4選手）
- ボンちゃん・かずのこの YouTube/Twitch（本人発信での照合）
- 本番の7名の動画バインディング（本番IDでの接続）
- brayan-job（11/24から保留）
- 本番DBの選手 status（未確認）
