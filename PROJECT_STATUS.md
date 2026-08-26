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
| v2 Phase7 | 短時間診断 | ✅ 4診断公開 + verified Trait Score型の実キャラ推薦Engine/APIまで実装。Trait Score投入が残り |
| v2 Phase8 | プレイヤーDB | ✅ 一覧・詳細・Character関連基盤 |
| v2 Phase9 | 攻略/コンボ/セットプレイ/連携/トレモ | ✅ 表示基盤 + JP完成テンプレート候補データを実DBへ投入 |
| v2 Phase10 | 管理機能 | ✅ 主要Entity CRUD + 関係データ + Data Quality + キャラ適性マッピング管理まで実装。実Admin E2Eのみ未実施 |
| v2 Phase11 | AIコーチ | 🧱 Current Patch + Source付きEvidence Retrievalまで実装。生成回答はverifiedデータ充足まで無効 |
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
- Character Recommendation Engine/APIを実装し、キャラ適性・総合診断から呼び出し可能
- Recommendation UI接続コミット `9807d80...` はtypecheck/lint/build成功

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
- updated_at trigger / RLS / private admin role
- auth.users -> profiles自動作成trigger
- 外部キー/主要query index / pg_trgm Alias index
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

### JP完成テンプレート進捗

実DB現在値:
- Move: 49
- Current Frame: 49
- Frame reviewed: 48
- Frame unverified: 1
- Move Alias: 76
- Combo: 10
- Setup: 6
- Sequence: 6
- Counter: 6
- Training: 16
- Reference Player: 3（ときど / りゅうせい / takepi）
- Character Video: 1
- Published Move/strategy: 0（品質ゲート維持）

JPは残り30キャラ横展開用の先行テンプレートとして、Move/Frame/Alias/Combo/Setup/Sequence/Counter/Training/Player/Videoまで候補データを揃えた。

重要:
- `reviewed` は `verified` ではない。
- 2026.08.03現行パッチでゲーム内トレモまたは直接公式データ照合後にverified/publishedへ昇格する。
- ODアムネジアは2026.08.03で投げ成立時のJP硬直が4F増えているため旧パッチ起き攻めを流用しない。
- DI壁/DIパニカンの+42F詐欺飛び、DIパニカン後ヴィーハト+15F、SA2/設置ワープ系はタイミング依存のためラボ確認必須。
- Modern操作は2026.08.03で変更があるため、旧コマンド資料をそのままpublishedにしない。

詳細: `docs/V2_JP_CONTENT_PACKAGE_STATUS.md`
再現Seed: `supabase/seeds/20260826_jp_content_package.sql`

## Phase10 管理機能

主要Route:
- `/admin/data-status`
- `/admin/data-quality`
- `/admin/characters`
- `/admin/character-traits`
- `/admin/moves`
- `/admin/content/[kind]`
- `/admin/reference/[kind]`
- `/admin/diagnoses`
- `/admin/relations`
- `/admin/sources`

キャラクター適性マッピング:
- 共通Trait 12種を正式DB化
- `character_trait_scores` は0〜5
- publishedには `verification_status = verified` + Source必須
- 現時点ではTrait定義12件のみ公開、実キャラScoreは0件
- `/api/diagnosis/recommend` はpublished + verifiedのみ照合
- active traitの75%以上が揃うキャラだけ推薦対象
- データ不足時は推薦を捏造せず不足メッセージを返す

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

主要ボトルネックはコードではなく、現行パッチでの実機検証と検証済みコンテンツ投入。

## 短時間診断

公開済み:
- `improvement-check` 上達課題診断: 12問 / 48選択肢
- `playstyle-check` プレイスタイル診断: 10問 / 40選択肢
- `character-fit-check` キャラクター適性診断: 10問 / 40選択肢
- `comprehensive-check` 総合簡易診断: 20問 / 80選択肢

Character Recommendation:
- `character_fit` と `comprehensive` からRecommendation APIを呼び出す
- weighted trait scoring + coverage gate
- TOP5候補、一致度、照合Trait数、主な一致理由を表示
- Trait Scoreが0件の現状では「推薦データ不足」と表示

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

1. JP 49技・Modern操作・Combo/Setup/Sequence/Counterを2026.08.03版トレモで最終検証しverified/publishedへ昇格
2. JPのCharacter Trait ScoreをSource付きでレビュー・投入
3. JPテンプレートのverified化手順を確定後、残り30キャラへ同じEntity構造で展開
4. Player / Tournament / Match / Videoを30キャラ側へ展開
5. 実Adminユーザー作成後の管理画面E2E書込試験
6. Vercel Preview deploymentと環境変数・実機確認
7. SEO / OGP / sitemap / metadata最終調整
8. verified Evidenceが十分になった領域からAI Coach生成回答を段階的に有効化
9. Replay Coachは実データ取得方法・精度・規約・コストを実証後に着手

詳細:
- [docs/V2_JP_CONTENT_PACKAGE_STATUS.md](./docs/V2_JP_CONTENT_PACKAGE_STATUS.md)
- [docs/V2_CHARACTER_RECOMMENDATION_ENGINE.md](./docs/V2_CHARACTER_RECOMMENDATION_ENGINE.md)
- [docs/V2_RELEASE_READINESS.md](./docs/V2_RELEASE_READINESS.md)
- [docs/V2_MOVE_INGEST_PILOT.md](./docs/V2_MOVE_INGEST_PILOT.md)
- [docs/V2_PHASE12_REPLAY_RESEARCH.md](./docs/V2_PHASE12_REPLAY_RESEARCH.md)
