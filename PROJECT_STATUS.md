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
| v2 Phase3 | DB・基礎データモデル | ✅ 完了 |
| v2 Phase4 | Next.js基盤・既存資産の移行基盤 | ✅ 基盤完了（build検証は未実行） |
| v2 Phase5 | キャラクター辞典 | ✅ 表示・URL・Repository基盤完了（実データ投入は継続） |
| v2 Phase6 | 横断検索・Alias検索 | ✅ 基盤実装（完全横断・FTS最適化は継続） |
| v2 Phase7 | 短時間診断への再構築 | ✅ 汎用エンジン基盤実装（正式質問・推薦ロジックは継続） |
| v2 Phase8 | プレイヤーDB | ✅ 一覧・詳細・キャラ関連基盤実装 |
| v2 Phase9 | 対策・コンボ・セットプレイ・トレモ | ✅ 一覧・詳細基盤実装（関連表示・Sequenceは継続） |
| v2 Phase10 | 管理機能 | 📐 セキュリティ設計完了・実装保留（Supabase Auth/RLS実環境待ち） |
| v2 Phase11 | AIコーチ | 🧱 Retrieval基盤実装・生成回答は意図的に未有効化 |
| v2 Phase12 | リプレイコーチ研究・実証 | 未着手 |

v2開発ブランチ: `sf6dna-v2`

## 現在の主な実装

### Web基盤
- `v2-web/`にNext.js 16.3 + React 19 + TypeScriptの独立アプリを作成
- App Router / strict TypeScript / ESLint
- Supabase browser/server client factory
- 現行静的サイトと分離

### キャラクター辞典
- `/characters`
- `/characters/[slug]`
- `/characters/[slug]/[section]`
- Move / Combo / Setup / Counter / Training等への子導線

### 横断検索
- `/search`
- NFKC正規化
- Character / CharacterAlias
- Move / MoveAlias
- Combo
- Player / PlayerAlias
- Glossary
- Alias一致表示と重複排除

### 短時間診断
- `/diagnosis`
- `/diagnosis/[slug]`
- Question / OptionをDBから描画
- 進捗、戻る、次へ
- `score_payload`汎用集計
- 少数問前提UI

### プレイヤーDB
- `/players`
- `/players/[slug]`
- PlayerCharacter関連
- プロ/非プロ強豪/Legend/職人/配信者/VTuber/攻略投稿者/コーチ等の型を想定

### 攻略・トレーニング
- `/moves/[slug]`
- `/combos` / `/combos/[slug]`
- `/setups` / `/setups/[slug]`
- `/counters` / `/counters/[slug]`
- `/training` / `/training/[slug]`
- `/glossary/[slug]`

### 管理
- `/admin` は安全のためロック状態
- 認証なし書き込みAPIは作成しない
- Supabase Auth + admin role + RLS必須
- 詳細: `docs/V2_PHASE10_ADMIN_SECURITY.md`

### AIコーチ
- `/coach`
- `/api/coach/retrieve`
- ユーザー質問からSF6DNA DBを検索してEvidence候補を返す
- 現段階ではAI生成回答を無効化
- 信頼できるデータ、Patch、Source、Backend接続後に生成を有効化する

## まだ必要な外部・実行環境作業

GitHubファイル操作だけでは以下は未実施。

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Vercel Preview
- 実Supabase Project作成/接続
- PostgreSQL Migration適用
- RLS適用・検証
- Auth設定
- 管理者ユーザー設定
- 実データ投入
- OpenAI/AI Backendの本番接続

このため、現在は「コード基盤を前倒しで構築し、安全性・データ精度に関わる箇所は外部環境確認まで有効化しない」状態。

## 関連ドキュメント

- `docs/V2_REQUIREMENTS.md` — v2確定要件
- `docs/V2_PHASE1_FOUNDATION.md` — Phase1安全基盤
- `docs/V2_ARCHITECTURE.md` — Phase2正式アーキテクチャ
- `docs/V2_DATA_MODEL.md` — Phase3データモデル
- `docs/V2_SCHEMA_DRAFT.sql` — PostgreSQL草案
- `docs/V2_PHASE4_IMPLEMENTATION.md` — Phase4実装記録
- `docs/V2_PHASE5_CHARACTER_ENCYCLOPEDIA.md` — Phase5実装記録
- `docs/V2_PHASE6_11_PROGRESS.md` — Phase6〜11進捗
- `docs/V2_PHASE10_ADMIN_SECURITY.md` — 管理機能セキュリティ設計

---

## 既存版について

現行公開版は`main`に維持し、v2開発中は直接変更しない。
旧HTML/CSS/JavaScript、旧診断、プレイヤー図鑑、キャラクター図鑑、チーム図鑑、比較、お気に入り、ランク管理、練習メニュー、YouTube API等は移行候補資産として保存する。
