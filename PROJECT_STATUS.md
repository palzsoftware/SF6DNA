# PROJECT_STATUS.md

## SF6DNA v2 開発状況

2026-08-26より、既存公開版を保全したまま総合プラットフォーム版SF6DNA v2の再構築を開始した。

### v2の4大メインコンテンツ
1. 診断
2. キャラクター情報
3. プレイヤー情報
4. AIコーチング（将来リプレイコーチングを追加予定）

### v2 Phase管理

| フェーズ | 対象 | ステータス |
|---|---|---|
| v2 Phase1 | 安全な開発基盤・ブランチ分離・要件正本化 | ✅ 完了 |
| v2 Phase2 | Backend整理・正式アーキテクチャ設計 | ✅ 完了 |
| v2 Phase3 | DB・基礎データモデル | ✅ 完了・Supabase実DBへ適用済み |
| v2 Phase4 | Next.js基盤・既存資産の移行基盤 | ✅ 基盤完了・GitHub Actions build成功確認済み |
| v2 Phase5 | キャラクター辞典 | ✅ 表示・URL・Repository基盤完了（正確な実データ投入は継続） |
| v2 Phase6 | 横断検索・Alias検索 | ✅ PostgreSQL統合検索RPCまで実装（実データ投入後に品質調整） |
| v2 Phase7 | 短時間診断への再構築 | ✅ 汎用エンジン基盤実装（正式質問・推薦ロジックは継続） |
| v2 Phase8 | プレイヤーDB | ✅ 一覧・詳細・キャラ関連基盤実装 |
| v2 Phase9 | 対策・コンボ・セットプレイ・トレモ | ✅ 一覧・詳細基盤実装（関連表示・Sequenceは継続） |
| v2 Phase10 | 管理機能 | 🧱 RLS/admin権限基盤まで実DB適用・管理UIはAuth設定後 |
| v2 Phase11 | AIコーチ | 🧱 Retrieval基盤実装・生成回答は信頼データ投入まで無効 |
| v2 Phase12 | リプレイコーチ研究・実証 | 📐 研究計画策定済み |

v2開発ブランチ: `sf6dna-v2`

## Web / CI
- `v2-web/`: Next.js 16.3 + React 19 + TypeScript
- App Router / strict TypeScript / ESLint
- GitHub Actionsで install -> typecheck -> lint -> build を実行
- 初回TypeScriptエラーを修正後、後続runで成功を確認
- 現行静的サイトは`main`に維持し、v2とは分離

## Supabase実DB
既存Project `SF6DNAPro` をv2 DBとして接続済み。

適用済み:
- 正式PostgreSQL schema
- Patch / Source
- Character / Move / Frame / Command / Alias
- Combo / Setup / Sequence / Counter / Training
- Player / Tournament / Match / Video
- Glossary
- Diagnosis
- Profile / Favorite
- updated_at trigger
- RLS
- admin role判定基盤
- 外部キー/一覧index
- Alias用pg_trgm index
- 統合検索RPC `search_sf6dna`

Security Advisorの指摘はhardening後0件。
詳細: `docs/V2_SUPABASE_STATUS.md`

## 現在の主なWeb実装

### キャラクター辞典
- `/characters`
- `/characters/[slug]`
- `/characters/[slug]/[section]`

### 横断検索
- `/search`
- Character / Alias
- Move / Alias
- Combo
- Counter
- Training
- Player / Alias
- Tournament
- Video
- Glossary / Alias
- PostgreSQL側で類似度・Aliasを含めて統合検索

### 短時間診断
- `/diagnosis`
- `/diagnosis/[slug]`
- DB駆動 Question / Option
- 進捗 / 戻る / 次へ
- `score_payload`汎用集計

### プレイヤーDB
- `/players`
- `/players/[slug]`
- PlayerCharacter関連

### 攻略・研究
- `/moves/[slug]`
- `/combos` / `/combos/[slug]`
- `/setups` / `/setups/[slug]`
- `/counters` / `/counters/[slug]`
- `/training` / `/training/[slug]`
- `/tournaments/[slug]`
- `/videos/[slug]`
- `/glossary/[slug]`

### 管理
- `/admin` は現在ロック画面
- DB側はRLS + admin role基盤まで適用
- 管理UI有効化にはSupabase Authの実ユーザー/管理者設定が必要

### AIコーチ
- `/coach`
- `/api/coach/retrieve`
- 統合検索を使ったEvidence retrieval
- AI生成は現状無効
- Patch / Source付きの信頼できるSF6データ投入後に生成を有効化する

## 現在の主要ブロッカー / 次工程

技術基盤だけで進められる範囲はかなり前倒し済み。次の比重は「正確なコンテンツ」と実サービス設定へ移る。

未完:
- 正確な現行Patch / Source / 全キャラクターデータ投入
- 全技・Frame・Command・Combo・Setup・Counter・Training投入
- Player / Tournament / Match / Videoデータ投入
- 正式短時間診断質問と推薦モデル
- Supabase Auth設定 / adminユーザー設定
- 管理画面CRUD
- Vercel Preview / 本番環境変数設定
- AI Backendとの生成回答接続
- リプレイ映像解析POC

未検証の旧静的攻略データは自動Publishしない。

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
