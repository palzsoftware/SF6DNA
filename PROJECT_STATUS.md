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
| v2 Phase6 | 横断検索・Alias検索 | ✅ PostgreSQL統合検索RPC・Alias検索を実DBで動作確認 |
| v2 Phase7 | 短時間診断 | ✅ 汎用エンジン基盤・正式質問/推薦モデルは継続 |
| v2 Phase8 | プレイヤーDB | ✅ 一覧・詳細・Character関連基盤 |
| v2 Phase9 | 攻略/コンボ/セットプレイ/トレモ | ✅ 一覧・詳細・Character子ページ接続基盤 |
| v2 Phase10 | 管理機能 | 🧱 Supabase Auth/RLS/admin guardまで実装。CRUDは管理者アカウント設定後 |
| v2 Phase11 | AIコーチ | 🧱 Evidence Retrievalまで実装。生成回答は信頼データ投入まで無効 |
| v2 Phase12 | リプレイコーチ研究 | 📐 研究計画策定済み |

開発ブランチ: `sf6dna-v2`

## Web / CI
- `v2-web/`: Next.js 16.3 + React 19 + TypeScript
- App Router / strict TypeScript / ESLint
- GitHub Actions: install -> typecheck -> lint -> build
- Node 22へ更新
- CIエラーを都度修正し、後続runで成功確認
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

Security Advisor: hardening後0件。

## キャラクターデータ
公式CAPCOMのBase / Year1 / Year2 / Year3 / Year4ソースを登録。

現在:
- `published + is_playable=true`: 31キャラクター
- `draft + is_playable=false`: 3キャラクター（Year4で発表済みの未実装枠）

公開済み基本キャラ情報には`entity_sources`で公式出典を紐付けた。
Aliasの初期例も登録し、`ベガ`、`舞`等の検索を実DBで確認済み。

攻略評価・技・フレーム等の未検証旧データは自動Publishしていない。

## 主なWeb Route
- `/`
- `/search`
- `/diagnosis`, `/diagnosis/[slug]`
- `/characters`, `/characters/[slug]`, `/characters/[slug]/[section]`
- `/players`, `/players/[slug]`
- `/moves/[slug]`
- `/combos`, `/combos/[slug]`
- `/setups`, `/setups/[slug]`
- `/counters`, `/counters/[slug]`
- `/training`, `/training/[slug]`
- `/tournaments/[slug]`
- `/videos/[slug]`
- `/glossary/[slug]`
- `/coach`
- `/api/coach/retrieve`
- `/auth`
- `/admin`

Character子ページはMove / Combo / Setup / Counter / Training / Playerを正式DBから取得するよう接続済み。Video多対多Relationは専用設計前のため未接続。

## Backend v2
`palzsoftware/SF6DNA-Backend` の `sf6dna-v2` でroot backendをCanonicalとして整理中。

今回rootへ移行済み:
- YouTube検索
- YouTube URL解析
- 単一動画情報取得 `/api/videos/info`
- キャッシュ
- 入力検証改善
- Node 22 target
- URL parser unit test
- backend CI workflow

OpenAI/replay prototypeはnested側に保存したまま。信頼DB連携と最新API仕様確認前に本番AIへ統合しない。

## Vercel
Vercel connectionは確認済みだが、接続アカウント内のProject一覧は0件。
利用可能なconnector actionには既存Project一覧/取得/Deployment確認はあるが、GitHub repositoryから新規Projectを作成するactionが現在見当たらないため、Preview deploymentはここで停止。

## 現在の主要ブロッカー / 次工程

コードとDB基盤だけで安全に進められる範囲は大幅に前倒しした。今後の中心は以下。

1. 公式現行Patchの特定・登録
2. 全31キャラのMove / Frame / Classic-Modern Command投入
3. Combo / Setup / Counter / Trainingの検証済みデータ投入
4. Player / Tournament / Match / Videoデータ投入
5. 正式短時間診断質問・推薦モデル
6. Supabase Authで実ユーザー作成後、管理者role設定とCRUD UI
7. Vercel新規Project作成後、Previewと環境変数設定
8. AI CoachへPatch / Source付きEvidenceを渡し、生成回答を有効化
9. Replay Coach POC

## 関連ドキュメント
- `docs/V2_REQUIREMENTS.md`
- `docs/V2_ARCHITECTURE.md`
- `docs/V2_DATA_MODEL.md`
- `docs/V2_SCHEMA_DRAFT.sql`
- `docs/V2_PHASE4_IMPLEMENTATION.md`
- `docs/V2_PHASE5_CHARACTER_ENCYCLOPEDIA.md`
- `docs/V2_PHASE6_11_PROGRESS.md`
- `docs/V2_PHASE10_ADMIN_SECURITY.md`
- `docs/V2_PHASE12_REPLAY_RESEARCH.md`
- `docs/V2_SUPABASE_STATUS.md`

---

## 既存版について
現行公開版は`main`に維持し、v2開発中は直接変更しない。旧HTML/CSS/JavaScript、旧診断、図鑑、比較、お気に入り、ランク管理、練習、YouTube API等は移行候補資産として保存する。
