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
| v2 Phase7 | 短時間診断 | ✅ 上達課題・プレイスタイル・キャラクター適性・総合簡易の4診断を実DBで公開。実キャラ推薦スコア投入が残り |
| v2 Phase8 | プレイヤーDB | ✅ 一覧・詳細・Character関連基盤 |
| v2 Phase9 | 攻略/コンボ/セットプレイ/連携/トレモ | ✅ 一覧・詳細・Character子ページ接続基盤 |
| v2 Phase10 | 管理機能 | ✅ 主要Entity CRUD + 関係データ + Data Quality + キャラ適性マッピング管理まで実装。実Admin E2Eのみ未実施 |
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
- Diagnosis Runnerは改善診断・スタイル診断・キャラ適性・総合診断の結果モードに対応

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
- Character Trait / Character Trait Score
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
- `/admin/character-traits`
- `/admin/moves`
- `/admin/content/[kind]`（Combo / Setup / Sequence / Counter / Training）
- `/admin/reference/[kind]`（Player / Tournament / Video / Glossary）
- `/admin/diagnoses`
- `/admin/relations`
- `/admin/sources`

キャラクター適性マッピング:
- 共通Trait 12種を正式DB化
- `character_trait_scores` は0〜5
- publishedには `verification_status = verified` + Source必須
- 現時点ではTrait定義12件のみ公開、実キャラScoreは0件
- 十分なverified Scoreが揃うまで診断からの直接キャラ推薦は解禁しない

Server Actionは`requireAdmin()`、DB書込はSupabase RLSの二重ガード。

## Data Quality

`/admin/data-quality`で以下を確認可能:
- total / published件数
- verification_status
- Source / Video / Result / Participant / Alias関係件数
- Moveに対するFrame存在率
- 31キャラ別 Move / Frame / Combo / Setup / Sequence / Counter / Training / Player網羅率
- 31キャラ別 Character Trait Mapping件数
- キャラクター推薦のverified + published準備数

主要ボトルネックはコードではなく検証済みコンテンツ投入。

## 短時間診断

公開済み:
- `improvement-check` 上達課題診断: 12問 / 48選択肢
- `playstyle-check` プレイスタイル診断: 10問 / 40選択肢
- `character-fit-check` キャラクター適性診断: 10問 / 40選択肢
- `comprehensive-check` 総合簡易診断: 20問 / 80選択肢

総合簡易診断は、改善優先度TOP3とプレイスタイル傾向TOP3を分離表示する。
各結果から横断検索とAI Coach Evidenceへ接続。

残り:
- verified Character Trait Score投入後の実キャラクター推薦
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

Vercel接続は利用可能。現行GitHub repository/subdirectoryと環境変数の対象確認後にPreview deploymentを行う。

## Release readiness

公開判定基準を `docs/V2_RELEASE_READINESS.md` に定義。
実装済み / データ投入済み / verified + published済みを分けて判断する。

## 次工程

1. 全31キャラのMove / Frame / Classic-Modern Commandを公式・検証済みSourceから投入
2. Combo / Setup / Sequence / Counter / Trainingのverifiedデータ投入
3. Character Trait ScoreをSource付きでレビュー・投入し、キャラクター推薦を解禁
4. Player / Tournament / Match / Videoの検証済みデータ投入
5. 実Adminユーザー作成後の管理画面E2E書込試験
6. Vercel Preview deploymentと環境変数・実機確認
7. SEO / OGP / sitemap / metadata最終調整
8. verified Evidenceが十分になった領域からAI Coach生成回答を段階的に有効化
9. Replay Coachは実データ取得方法・精度・規約・コストを実証後に着手

詳細:
- [docs/V2_RELEASE_READINESS.md](./docs/V2_RELEASE_READINESS.md)
- [docs/V2_PHASE10_RELATIONS_QUALITY.md](./docs/V2_PHASE10_RELATIONS_QUALITY.md)
- [docs/V2_MOVE_INGEST_PILOT.md](./docs/V2_MOVE_INGEST_PILOT.md)
- [docs/V2_PHASE12_REPLAY_RESEARCH.md](./docs/V2_PHASE12_REPLAY_RESEARCH.md)
- [docs/V2_SUPABASE_STATUS.md](./docs/V2_SUPABASE_STATUS.md)
