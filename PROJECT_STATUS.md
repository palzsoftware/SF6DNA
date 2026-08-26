# PROJECT_STATUS.md

## SF6DNA v2 開発状況

2026-08-26より、既存公開版を保全したまま総合プラットフォーム版SF6DNA v2の再構築を開始した。

### v2 Phase管理

| フェーズ | 対象 | ステータス |
|---|---|---|
| v2 Phase1 | 安全な開発基盤・ブランチ分離・要件正本化 | ✅ 完了 |
| v2 Phase2 | Backend整理・正式アーキテクチャ設計 | ✅ 完了 |
| v2 Phase3 | DB・基礎データモデル | ✅ 完了・Supabase実DBへ適用済み |
| v2 Phase4 | Next.js基盤・既存資産の移行基盤 | ✅ CI成功 |
| v2 Phase5 | キャラクター辞典 | ✅ 31プレイアブル基本データ・出典・各セクション接続基盤 |
| v2 Phase6 | 横断検索・Alias検索 | ✅ PostgreSQL統合検索RPCを実DBで動作確認 |
| v2 Phase7 | 短時間診断 | 🧱 上達課題・プレイスタイル・キャラクター適性の3診断を実DBで公開。総合簡易診断とキャラ推薦モデルが残り |
| v2 Phase8 | プレイヤーDB | ✅ 一覧・詳細・Character関連基盤 |
| v2 Phase9 | 攻略/コンボ/セットプレイ/連携/トレモ | ✅ 一覧・詳細・Character子ページ接続基盤 |
| v2 Phase10 | 管理機能 | ✅ 主要Entity CRUD + 関係データ管理 + Data Quality可視化まで実装。実Admin E2Eのみ未実施 |
| v2 Phase11 | AIコーチ | 🧱 Current Patch + Source付きEvidence Retrievalまで実装。生成回答は信頼データ投入まで無効 |
| v2 Phase12 | リプレイコーチ研究 | 📐 研究計画策定済み |

開発ブランチ: `sf6dna-v2`
`main`は変更していない。

## Web / CI

- `v2-web/`: Next.js 16.3 + React 19 + TypeScript
- App Router / strict TypeScript / ESLint / Node 22
- GitHub Actions: install -> typecheck -> lint -> build
- `/auth` とSupabase SSR cookie session基盤
- `/admin` は認証 + `profiles.role = admin` で保護
- Relation / Data Quality追加後を含むCIでtypecheck/lint/build成功確認済み
- 複数Diagnosis typeに応じて結果表示を切り替えるRunnerへ拡張し、CI成功確認済み

## Supabase実DB

Project `SF6DNAPro` をv2 DBとして使用。

実装済み:
- PostgreSQL正式スキーマ
- Patch / Source / EntitySource
- Character / Alias / Guide
- Move / Command / Frame / Alias
- Combo / Setup / Sequence / Counter / Training
- Player / Tournament / Match / Video
- Glossary
- Diagnosis / Question / Option
- Profile / Favorite / DiagnosisResult
- updated_at trigger
- RLS
- private admin role判定
- auth.users -> profiles自動作成trigger
- 外部キー/主要query index
- `pg_trgm` Alias index
- 統合検索RPC `search_sf6dna`

Current Patch:
- `2026.08.03`
- `2026.08.03 全体バトルバランス調整`
- CAPCOM公式変更リストSource登録済み

## キャラクターデータ

- `published + is_playable=true`: 31キャラクター
- `draft + is_playable=false`: 3キャラクター
- 公開済み基本キャラ情報は公式Source付き
- 未検証攻略データは自動Publishしない

JP Move投入パイロット:
- Move: 14 draft
- Command: 14
- Frame候補: 14
- published: 0
- verification前のためAI/public表示には使用しない

## Phase10 管理機能

主要Route:
- `/admin/data-status`
- `/admin/data-quality`
- `/admin/characters`
- `/admin/moves`
- `/admin/content/[kind]`（Combo / Setup / Sequence / Counter / Training）
- `/admin/reference/[kind]`（Player / Tournament / Video / Glossary）
- `/admin/diagnoses`
- `/admin/relations`
- `/admin/sources`

管理可能:
- Character create/edit/archive
- Patch登録・Current切替
- Source登録
- Move / Classic-Modern Command / Patch別Frame / Source
- Combo / Setup / Sequence / Counter / Training
- Player / Tournament / Video / Glossary
- Diagnosis / Question / Option / score_payload

関係データ:
- Player Alias
- Glossary Alias
- Player ↔ Character + Patch期間
- Tournament Result
- Match
- Match Participant
- Video ↔ Entity (`entity_videos`)
- Combo Move Steps
- Setup Move Steps
- Training Relations

Server Actionは`requireAdmin()`、DB書込はSupabase RLSの二重ガード。

## Data Quality

`/admin/data-quality`で以下を確認可能:
- total / published件数
- verification_status
- Source / Video / Result / Participant / Alias関係件数
- Moveに対するFrame存在率
- 31キャラ別 Move / Frame / Combo / Setup / Sequence / Counter / Training / Player網羅率

2026-08-26実DB確認時:
- Move 14 / published 0
- Combo 0
- Setup 0
- Sequence 0
- Counter 0
- Training 0
- Player 0
- Tournament 0
- Match 0
- Video 0
- Glossary 0

したがって、現時点の主要ボトルネックはコードではなく検証済みコンテンツ投入。

## 短時間診断

公開済み:
- `improvement-check` 上達課題診断: 12問 / 48選択肢
- `playstyle-check` プレイスタイル診断: 10問 / 40選択肢
- `character-fit-check` キャラクター適性診断: 10問 / 40選択肢

Runnerは`diagnosis_type`に応じて、改善優先度 / プレイスタイル傾向 / キャラクター特性適性として結果文言を切り替える。
結果上位項目から横断検索とAI Coach Evidenceへ接続。

残り:
- 総合簡易診断
- キャラクター特性スコア → 実キャラクター推薦の正式マッピング
- 診断結果保存・比較の本格運用

## AI Coach

`/api/coach/retrieve`:
- ユーザー質問
- Current Patch
- 横断検索Evidence
- Evidenceに紐付いたSource

生成回答はOFF。Move / Frame / Counter / Training等のverifiedデータが十分になるまで、DBにない攻略知識を生成させない。

## Backend v2

`palzsoftware/SF6DNA-Backend` の `sf6dna-v2` でroot backendをCanonicalとして整理中。

rootへ移行済み:
- YouTube検索
- YouTube URL解析
- `/api/videos/info`
- キャッシュ
- 入力検証改善
- Node 22
- URL parser unit test
- backend CI

OpenAI/replay prototypeはnested側に保持。信頼DB連携と最新API仕様確認前に本番統合しない。

## Vercel

接続アカウント内Project一覧は0件。接続側には`deploy_to_vercel`操作が存在するが、現行GitHub repository/subdirectoryと環境変数が正しく対象になることを確認してからPreview deploymentを行う。

## 次工程

1. 実Adminユーザー作成後の管理画面E2E書込試験
2. 全31キャラのMove / Frame / Classic-Modern Commandを公式・検証済みSourceから投入
3. Combo / Setup / Sequence / Counter / Trainingのverifiedデータ投入
4. Player / Tournament / Match / Videoの検証済みデータ投入
5. 総合簡易診断とキャラクター推薦マッピングを完成
6. Vercel Preview deploymentと環境変数・実機確認
7. verified Evidenceが十分になった領域からAI Coach生成回答を段階的に有効化
8. SEO / OGP / sitemap / metadata最終調整
9. Replay Coachは実データ取得方法・精度・規約・コストを実証後に着手

詳細:
- [docs/V2_PHASE10_RELATIONS_QUALITY.md](./docs/V2_PHASE10_RELATIONS_QUALITY.md)
- [docs/V2_MOVE_INGEST_PILOT.md](./docs/V2_MOVE_INGEST_PILOT.md)
- [docs/V2_PHASE12_REPLAY_RESEARCH.md](./docs/V2_PHASE12_REPLAY_RESEARCH.md)
- [docs/V2_SUPABASE_STATUS.md](./docs/V2_SUPABASE_STATUS.md)
