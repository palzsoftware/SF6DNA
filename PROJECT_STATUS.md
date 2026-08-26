# PROJECT_STATUS.md

## SF6DNA v2 開発状況

2026-08-26より、既存公開版を保全したまま総合プラットフォーム版SF6DNA v2の再構築を開始した。

### v2 Phase管理

| フェーズ | 対象 | ステータス |
|---|---|---|
| v2 Phase1 | 安全な開発基盤・ブランチ分離・要件正本化 | ✅ 完了 |
| v2 Phase2 | Backend整理・正式アーキテクチャ設計 | ✅ 完了 |
| v2 Phase3 | DB・基礎データモデル | ✅ 完了・Supabase実DBへ適用済み |
| v2 Phase4 | Next.js基盤・既存資産の移行基盤 | ✅ GitHub Actionsでtypecheck/lint/build成功確認 |
| v2 Phase5 | キャラクター辞典 | ✅ 31プレイアブル基本データ・出典・各セクション接続基盤まで実装 |
| v2 Phase6 | 横断検索・Alias検索 | ✅ Setup/Sequenceを含むPostgreSQL統合検索RPCを実DBで動作確認 |
| v2 Phase7 | 短時間診断 | ✅ 汎用エンジン + 最初の12問上達課題診断を実DBで公開 |
| v2 Phase8 | プレイヤーDB | ✅ 一覧・詳細・Character関連基盤 |
| v2 Phase9 | 攻略/コンボ/セットプレイ/連携/トレモ | ✅ 一覧・詳細・Character子ページ接続基盤 |
| v2 Phase10 | 管理機能 | 🧱 Supabase Auth/RLS/admin guardまで実装。CRUDは管理者アカウント設定後 |
| v2 Phase11 | AIコーチ | 🧱 Current Patch + Source付きEvidence Retrievalまで実装。生成回答は信頼データ投入まで無効 |
| v2 Phase12 | リプレイコーチ研究 | 📐 研究計画策定済み |

開発ブランチ: `sf6dna-v2`

## Web / CI
- `v2-web/`: Next.js 16.3 + React 19 + TypeScript
- App Router / strict TypeScript / ESLint
- GitHub Actions: install -> typecheck -> lint -> build
- Node 22へ更新
- CIエラーを都度修正。AI Coachのquery初期化で検出されたReact lintエラーもServer Componentへ処理を移して修正済み
- `/auth` とSupabase SSR cookie session基盤を追加
- `/admin` は認証 + `profiles.role = admin` で保護
- 現行静的サイト`main`は変更していない

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

Security Advisor: hardening後重大Lint 0件。
Performance Advisor: unused index INFOとmultiple permissive policies WARNあり。データ投入前のためindexは保持し、RLS重複は後続の性能整理項目とする。

## キャラクターデータ
公式CAPCOMのBase / Year1 / Year2 / Year3 / Year4ソースを登録。

現在:
- `published + is_playable=true`: 31キャラクター
- `draft + is_playable=false`: 3キャラクター（Year4で発表済みの未実装枠）

公開済み基本キャラ情報には`entity_sources`で公式出典を紐付けた。
Aliasの初期例も登録し、`ベガ`、`舞`等の検索を実DBで確認済み。

攻略評価・技・フレーム等の未検証旧データは自動Publishしていない。

## 短時間診断
最初の正式公開診断:
- slug: `improvement-check`
- 名称: 上達課題診断
- 12問 / 12評価軸 / 48選択肢
- スコア0〜3で「今の練習優先度」を評価
- 結果上位3項目から横断検索とAI Coach Evidenceへ接続

今後、キャラクター適性・プレイスタイル・総合簡易診断を同じDB駆動エンジン上に追加する。

## 主なWeb Route
- `/`
- `/search`
- `/diagnosis`, `/diagnosis/[slug]`
- `/characters`, `/characters/[slug]`, `/characters/[slug]/[section]`
- `/players`, `/players/[slug]`
- `/moves/[slug]`
- `/combos`, `/combos/[slug]`
- `/setups`, `/setups/[slug]`
- `/sequences`, `/sequences/[slug]`
- `/counters`, `/counters/[slug]`
- `/training`, `/training/[slug]`
- `/tournaments/[slug]`
- `/videos/[slug]`
- `/glossary/[slug]`
- `/coach`
- `/api/coach/retrieve`
- `/auth`
- `/admin`

Character子ページはMove / Combo / Setup / Counter / Training / Playerを正式DBから取得するよう接続済み。Video多対多Relationは専用表示設計を継続する。

## AI Coach
`/api/coach/retrieve` は現在以下を返す。
- ユーザー質問
- Current Patch
- 横断検索Evidence
- Evidenceに紐付いたSource

生成AI回答は意図的にOFF。Move / Frame / Counter / Trainingなど検証済み攻略データが十分に入るまで、検索結果だけで攻略文章を捏造しない。

## Backend v2
`palzsoftware/SF6DNA-Backend` の `sf6dna-v2` でroot backendをCanonicalとして整理中。

rootへ移行済み:
- YouTube検索
- YouTube URL解析
- 単一動画情報取得 `/api/videos/info`
- キャッシュ
- 入力検証改善
- Node 22 target
- URL parser unit test
- backend CI workflow

OpenAI/replay prototypeはnested側に保存したまま。信頼DB連携と最新API仕様確認前に本番AIへ統合しない。

## 再現性
実DBへ適用した後続変更をrepositoryにも記録:
- `supabase/migrations/20260826_extend_unified_search.sql`
- `supabase/seeds/20260826_improvement_check.sql`

Live DBだけが先行して仕様差分になる状態を避ける。

## Vercel
Vercel connectionは確認済みだが、接続アカウント内のProject一覧は0件。
利用可能な操作には既存Project一覧/取得/Deployment確認はあるが、GitHub repositoryから新規Projectを安全に作成する操作が現在見当たらないため、Preview deploymentは停止中。

## 現在の主要ブロッカー / 次工程

コードとDB基盤だけで安全に進められる範囲は大幅に前倒し済み。残る中心作業は以下。

1. 全31キャラのMove / Frame / Classic-Modern Commandを公式・検証済みソースから投入
2. Combo / Setup / Sequence / Counter / Trainingの検証済みデータ投入
3. Player / Tournament / Match / Videoの検証済みデータ投入
4. キャラクター適性・プレイスタイル・総合簡易診断の正式質問/推薦モデル
5. Supabase Authで実ユーザー作成後、管理者role設定とCRUD UI実地検証
6. Vercel Project作成・環境変数設定・Preview確認
7. 信頼データが十分になった後、AI Coach生成回答を段階的に有効化
8. Replay Coachは実データ取得方法・精度・規約・コストを実証してから着手

詳細:
- [docs/V2_PHASE6_11_PROGRESS.md](./docs/V2_PHASE6_11_PROGRESS.md)
- [docs/V2_PHASE12_REPLAY_RESEARCH.md](./docs/V2_PHASE12_REPLAY_RESEARCH.md)
- [docs/V2_SUPABASE_STATUS.md](./docs/V2_SUPABASE_STATUS.md)
