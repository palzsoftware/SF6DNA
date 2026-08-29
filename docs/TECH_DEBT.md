# SF6DNA v2 Technical Debt

最終更新: 2026-08-29 JST
対象: `sf6dna-v2` / `v2-web`

過去の静的版調査記録ではなく、現行Next.js / Supabase版を基準に整理する。

## 1. 画像配信

### 1-1. Character image fallback

公開31キャラクターのSupabase `image_url` は現在未登録で、`v2-web/src/lib/legacy-character-images.ts` からGitHub raw assetへfallbackしている。

利点:

- 31キャラクターの既存画像を安全に再利用できる
- DBへ推測URLを書き込まずに表示できる

負債:

- branch上のraw GitHub assetに依存する
- 一部source画像が数MBあり、画像転送量が大きくなる可能性がある
- Next Image最適化へ完全移行していない

Phase23のPublic Network Performanceで影響を計測し、必要なら画像圧縮・CDN / Storage移行・Next Image化を別変更として実施する。

### 1-2. Player image ownership

公開PlayerのDB `image_url` は未登録。

Pre-device polishでは、現在のPlayer slugとlegacy画像ファイル名が**完全一致したものだけ**fallback対象にした。表記変換や人物同定が必要な画像は推測接続しない。

将来的には確認済み画像をSupabase Storage等へ移し、DB `image_url` を正本化する方が保守しやすい。

## 2. Legacy static implementation

リポジトリ直下には旧HTML / CSS / JavaScript版が残っている。

- v2 Runtimeの正本ではない
- 画像素材や履歴参照には現在も一部利用価値がある
- 旧 `character-data.js` / `pro.js` 等のデータ問題をv2 DB問題と混同しない必要がある

削除はRelease前必須ではない。素材移行完了後にLegacy archive / cleanupとして別途判断する。

## 3. Release documentation drift

過去に `PROJECT_STATUS.md` / `NEXT_PROMPT.md` / READMEが実装状態より古くなる問題が発生した。

2026-08-29のPre-device polishで主要文書はPhase23へ同期した。

今後はPhase完了・Release Candidate固定・Production判定のタイミングで同時更新する。

## 4. Local-only personal data

Favorites / My Characters / Rank Tracker / Diagnosis History / Diagnosis draft / Improvement battle log / Replay reviewはブラウザlocalStorageを使用する。

これは現リリース仕様だが、端末間同期はしない。将来アカウント同期を実装する場合はmigration / privacy / conflict handlingが必要になる。

## 5. AI Coach generation

Source-backed retrieval基盤はあるが、自由生成による攻略回答はEvidence条件が十分になるまでOFF。

これは欠陥ではなく品質Gate。Generationを有効化する場合はEvidence不足時の停止、Source表示、Patch境界、verified優先を維持する。

## 6. Modern Command coverage

Phase21監査後も611件が未入力。

公式情報から安全に取得できないため推測しない。これはデータ欠陥を隠すための空欄ではなく、品質ルールに従った意図的な未入力。

## 7. Actual-device evidence

静的テスト・Browser E2E・Vercel Previewだけでは、実PC / iPhoneの表示・操作・localStorage挙動を完全には代替できない。

Release Candidate固定後にPhase23実機チェックリストを実行するまでProduction Readyは最終判定しない。

## 8. 今後の改善候補

Release blockerではない候補:

- 画像最適化 / Storage移行
- Legacy static site archive
- 個人データのアカウント同期
- AI Replay映像解析
- AI Coach generation段階解禁
- Team Directory / Roster Historyのv2再構築

新機能はRelease polishと混ぜず、Production Ready判定後の別スコープで扱う。
