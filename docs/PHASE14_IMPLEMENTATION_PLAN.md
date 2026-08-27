# SF6DNA Phase14 Implementation Plan

最終更新: 2026-08-28 06:29 JST

## Phase14正式名称

**Application Integration, Public Data Gating & Demo Release Readiness**

## 目的

Phase13までに構築したCharacter Content、Supabase DB、API、UI、Unified Search、Diagnosis、Recommendation、Admin、AI Coach Retrievalを統合し、未検証情報を確定情報として漏らさず、Vercel Previewで確認可能なデモWebアプリへ近づける。

必須原則:
- Supabase実DBを正本とする。
- `reviewed ≠ verified`。
- `draft ≠ published`。
- 推測値をverified/publishedへ昇格しない。
- Phase13 Verification BacklogをPhase13未完了として扱わない。
- AI Coachは構造化データ・Source・Patchを優先する。
- Replay解析は実解析機構が確認できるまで「可能」と扱わない。
- `main`、本番公開、不可逆DB変更、認証全面変更はユーザー明示許可なしで行わない。

## Phase14完了条件

P0〜P2の19タスクを完了、またはユーザー確認のうえPhase15以降へ再分類し、以下を満たす。

- P0残件 0
- 重大ブロッカー 0
- GitHub Actions Typecheck / Lint / Build成功
- Vercel Preview成功（Production公開ではない）
- 主要Public Routeに重大runtime errorなし
- draft/reviewed/unverifiedの確定情報漏洩なし
- Diagnosis 4種が動作
- Recommendationがpublished + verified + Source付きScoreだけを使用し、不足時に安全に不足を返す
- AI Coach RetrievalがCurrent Patch + Source付きEvidenceだけを根拠候補として扱い、不足時に断定しない
- Responsive/basic securityを確認
- Dashboard/終了監査を更新

## 優先度

- **P0**: デモ公開を阻害する問題
- **P1**: SF6DNA主要機能として必要
- **P2**: 品質向上
- **P3**: Phase15以降でも問題ない

---

# P0 — 7件

## P0-01 全体監査・進捗基準・Phase14計画
- 状態: **完了**
- 目的: Phase13完了状態を固定し、実DB・実コードからPhase14基準点を作る。
- 対象ファイル: `docs/PHASE13_ALL_31_CHARACTER_COMPLETION_AUDIT.md`, `docs/PROJECT_COMPLETION_DASHBOARD.md`, 本書
- 対象DB: public schema全体、RLS、Patch、Source、主要Entity
- 依存関係: Phase13完了
- 完了条件: 50項目監査、数値化、P0〜P3分類
- テスト方法: GitHub HEAD / Supabase実DB / Vercel状態の再取得
- リスク: 古い会話・資料だけで現在値を判断すること

## P0-02 Public Verification Gate Hardening
- 状態: **完了**
- 目的: Public経路で未検証攻略情報を確定情報として返さない。
- 対象ファイル: Supabase Phase14 migration、`v2-web/src/lib/knowledge.ts`, `character-sections.ts`, `search.ts`, content detail系
- 対象DB: Move/Frame/Command/Strategy/Trait Score、RPC `search_sf6dna`
- 依存関係: 既存RLS/Admin policy
- 完了条件: Strategy=`published+verified`、Frame=published親+verified、Command=published親+official Source、Admin policy維持
- テスト方法: `pg_policies`、RPC定義、実DB status件数、Public query条件確認
- リスク: Adminや履歴参照まで遮断すること

## P0-03 Move Detail Integration
- 状態: **完了**
- 目的: Move詳細へFrame/Classic/Modern/Patch/Source/Verificationを統合する。
- 対象ファイル: `v2-web/src/lib/content-detail.ts`, `v2-web/src/app/moves/[slug]/page.tsx`
- 対象DB: `moves`, `move_frame_data`, `move_commands`, `entity_sources`, `sources`, `patches`
- 依存関係: P0-02
- 完了条件: verified current Frame、Classic、存在時のみModern、Source/Patch/Verification表示
- テスト方法: strict candidateでquery/表示条件確認
- リスク: Modern欠損を推測補完すること

## P0-04 Safe Demo Content Release Gate
- 状態: **完了**
- 目的: デモ公開候補を機械的に絞れる条件を確立する。
- 対象ファイル: `docs/V2_RELEASE_READINESS.md`, Dashboard、Data Quality関連
- 対象DB: Move/Frame/Command/Strategy/Source/Patch/Verification
- 依存関係: P0-02, P0-03
- 完了条件: Release Gate明文化、strict Move候補抽出、Strategy verified条件、条件外safe empty
- テスト方法: read-only quality queryで候補と除外対象を比較
- リスク: 件数目的の自動publish。禁止。

## P0-05 Current HEAD Build / CI / Static Check
- 状態: **完了**
- 目的: Current HEADでTypeScript/Lint/Buildを通す。
- 対象ファイル: `.github/workflows/v2-web-check.yml`, `v2-web/**`
- 対象DB: なし
- 依存関係: Phase14 UI変更
- 完了条件: GitHub Actions check成功
- テスト方法: commit `d356095ff18c7b1851e6ae8614f20fa4c25c656d` でTypecheck/Lint/Build成功を確認
- リスク: 古い成功runを最新成功と誤認すること

## P0-06 Vercel Preview Project / Deployment
- 状態: **ブロック中**
- 目的: `sf6dna-v2`をPreviewで実機確認可能にする。本番公開はしない。
- 対象ファイル: `v2-web/.env.example`、Vercel Project設定
- 対象DB: DB変更なし。Preview環境変数のみ。
- 依存関係: P0-05
- 完了条件: Vercel Project存在、Root Directory/Env設定、Preview deployment成功
- テスト方法: Vercel deployment/build log確認
- リスク: 接続TeamのProject 0件。Productionを誤操作しないこと

## P0-07 Preview Runtime / Demo Gate Smoke
- 状態: **ブロック中**
- 目的: Preview上で主要Route、draft漏洩、runtime error、responsiveを確認する。
- 対象ファイル: `v2-web/src/app/**`, `v2-web/src/lib/**`
- 対象DB: Public read経路全般
- 依存関係: P0-06
- 完了条件: 主要導線重大エラー0、draft漏洩0、PC/スマホ利用可能
- テスト方法: Preview smoke + Vercel runtime logs + Public query確認
- リスク: Previewなしでデモ可能と判定すること

---

# P1 — 7件

## P1-01 Character → Sequence統合
- 状態: **完了**
- 目的: Character詳細からSequenceへ到達できるようにする。
- 対象ファイル: Character type/tab/section route/lib
- 対象DB: `sequences`
- 依存関係: P0-02
- 完了条件: `sequences` tab/meta/query、published+verified限定
- テスト方法: Typecheck/Lint/Build成功、コード条件確認
- リスク: draft Sequence漏洩

## P1-02 Strategy Public UI Integration
- 状態: **完了**
- 目的: Combo/Setup/Sequence/Counter/Trainingを共通品質ルールで表示する。
- 対象ファイル: `v2-web/src/lib/content-detail.ts`、各list/detail route、`SimpleDetailView`
- 対象DB: Strategy各表、`entity_sources`, `sources`, `patches`
- 依存関係: P0-02, P0-04
- 完了条件: published+verifiedのみ、Source/Patch/Verification表示、安全なempty state
- テスト方法: DB status確認、commit `9c9d500...`以降のCI、最新HEAD CI success
- リスク: verifiedとpublishedの片方だけで公開すること

## P1-03 Player / Video Integration Completion
- 状態: **完了**
- 目的: Character→Player/VideoとPlayer/Video公開導線を完成させる。
- 対象ファイル: `lib/players.ts`, Player detail、`lib/event-media.ts`, `/videos`, root navigation
- 対象DB: `players`, `player_characters`, `videos`, `entity_videos`, `entity_sources`
- 依存関係: Public status gate
- 完了条件: publishedのみ、Player Source表示、Video list/detail、empty state、主要ナビ導線
- テスト方法: 実DB published Player 41 / Video 5、draft Player 50 / Video 8を確認、最新HEAD CI success
- リスク: draft Player/Video漏洩

## P1-04 Character Recommendation Verified Data Pipeline
- 状態: **完了**
- 目的: Recommendationを公開品質Trait Scoreだけで成立させる。
- 対象ファイル: `v2-web/src/lib/character-recommendations.ts`, recommend API
- 対象DB: `character_traits`, `character_trait_scores`, `entity_sources`
- 依存関係: Verification/Source policy
- 完了条件: published+verified+Source付きScoreのみ使用、75% mapped trait gate、不足時は不足表示
- テスト方法: 実DB372件が全件draft+reviewed、Source relation 744件であることを確認。現状0 candidateを安全に返す
- リスク: reviewed draftをverified扱いすること

## P1-05 AI Coach Verified Evidence Policy
- 状態: **完了**
- 目的: AI Coach RetrievalをCurrent Patch/Source付きEvidence中心に統一する。
- 対象ファイル: `lib/coach-evidence.ts`, `app/api/coach/retrieve/route.ts`, `components/coach-retrieval-demo.tsx`
- 対象DB: Search対象Entity、Source、Patch
- 依存関係: P0-02, P0-04
- 完了条件: SourceなしEvidenceを除外、Current Patch不明/根拠なし時にready不可、Generation OFF維持
- テスト方法: 実DB `JP`検索でJP Character Source 3、Video Source 0を確認。Source 0 VideoがCoach Evidenceから除外されるコード条件を確認、最新HEAD CI success
- リスク: Retrieval結果を根拠なし生成へ流すこと

## P1-06 Auth / Admin E2E
- 状態: **ブロック中**
- 目的: Login/Session/Admin role/CRUDの実動作を確認する。
- 対象ファイル: Auth/Admin/Proxy/Supabase SSR関連
- 対象DB: `profiles`、Admin対象Entity、RLS
- 依存関係: Previewまたは安全なE2E環境
- 完了条件: 非Admin遮断、Admin操作成立、Public Gate維持
- テスト方法: 実セッションでread/write/role確認
- リスク: 本番データの不要な変更。テストデータを限定する

## P1-07 SEO / Public Metadata Baseline
- 状態: **完了**
- 目的: デモ公開に最低限必要なmetadata/robots/sitemap/OGPを整える。
- 対象ファイル: `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `.env.example`
- 対象DB: published EntityのみURL対象。Strategyはpublished+verifiedのみ
- 依存関係: Public URL構造
- 完了条件: root metadata、OGP/Twitter、robots、公開ゲート連動sitemap、Vercel URL対応
- テスト方法: `NEXT_PUBLIC_SITE_URL`または`VERCEL_URL`以外のドメインを仮定しないこと、最新HEAD Build success
- リスク: draft URLをsitemapへ含めること、Productionドメインを推測すること

---

# P2 — 5件

## P2-01 Modern Command Coverage Improvement
- 状態: **進行中（不足状況整理完了、一次情報/実機検証待ち）**
- 目的: Modern 1,441/2,065の不足を検証可能な範囲で改善する。
- 対象ファイル: ingest/admin/docs
- 対象DB: `move_commands`, Source relation
- 依存関係: 一次情報または実機確認
- 完了条件: 推測補完0でcoverage向上
- テスト方法: `phase14_modern_command_gaps.sql`を実DBでread-only実行。Modern 1,441/2,065、未登録624、公式Source relationあり候補41を確認
- リスク: 旧Patch情報の誤転記

## P2-02 Automated Test Expansion
- 状態: **完了**
- 目的: Public Gate/Search/Recommendation/APIの回帰テストを自動化する。
- 対象ファイル: `v2-web` test設定/テスト、CI
- 対象DB: fixtureまたは安全なread-only test data
- 依存関係: P0/P1仕様確定
- 完了条件: 主要release gateをCIで自動検証
- テスト方法: 24 Policy tests、Typecheck、Lint、Build。最新コードcommit `a4beef1...`、Actions run `33118205585` success
- リスク: 実DB依存テストの不安定化

## P2-03 Performance Measurement / Optimization
- 状態: **ブロック中**
- 目的: Previewでページ速度とqueryを計測・改善する。
- 対象ファイル: Next page/lib、画像/動画表示
- 対象DB: query/index
- 依存関係: P0-06
- 完了条件: 主要ページに重大性能問題なし
- テスト方法: Lighthouse/Runtime/query確認
- リスク: 計測前の過剰最適化

## P2-04 Responsive / Accessibility Polish
- 状態: **進行中（Static Review完了、Preview最終確認はブロック）**
- 目的: スマホ/PC、キーボード、基本ARIAを改善する。
- 対象ファイル: `globals.css`, components/pages
- 対象DB: なし
- 依存関係: static reviewは可能、最終確認はP0-07
- 完了条件: 主要画面で横崩れ・操作不能なし
- テスト方法: skip navigation/main landmark、global error/404、external link rel、画像alt/寸法、tap target/table/nav/長文CSSをStatic tests 5件で確認。Preview複数viewportは未実施
- リスク: 見た目変更による導線破壊

## P2-05 Data Quality / Progress Automation
- 状態: **完了**
- 目的: verified/published/Source/Patch coverageを継続監査しやすくする。
- 対象ファイル: Admin Data Quality、Dashboard更新手順、必要なread-only query
- 対象DB: 全Content Entity
- 依存関係: Release Gate確定
- 完了条件: 主要coverageを一貫したread-only queryで再計算可能
- テスト方法: `supabase/quality/phase14_public_readiness.sql`を実DBでread-only実行。全体・31キャラ別・Release Ready集計成功、read-only自動テスト成功
- リスク: スナップショット値を正本化すること

---

# P3 — Phase15以降候補

## P3-01 Phase13 Verification / Release Quality Backlog全面完了
- 目的: Modern、ローカライズ、Combo/Setup/Sequence/Counter/Training等を継続検証する。
- 対象ファイル: ingest/docs/admin
- 対象DB: Character Content全般
- 依存関係: 一次情報/実機検証
- 完了条件: 別途Release Quality基準を満たす範囲で昇格
- テスト方法: Source/Patch/Verification監査
- リスク: Phase13へ巻き戻して扱うこと

## P3-02 AI Coach Generation
- 目的: 十分なEvidence基盤が整った後に生成機能を検討する。
- 対象ファイル: 将来のgeneration API/UI
- 対象DB: verified public evidence
- 依存関係: P1-05、Evidence coverage
- 完了条件: 根拠引用・不足時抑制・安全な生成契約
- テスト方法: groundedness/漏洩テスト
- リスク: 根拠のないSF6攻略生成

## P3-03 Replay Coach
- 目的: 実際の動画/リプレイ解析方式が成立した場合のみ実装する。
- 対象ファイル/DB: 未確定
- 依存関係: 実解析技術の確認
- 完了条件: 実データを解析可能な仕組みが存在すること
- テスト方法: 実リプレイで再現性確認
- リスク: 未実装技術を「解析可能」と表現すること

## 現在の進捗

- P0: **5/7完了、残り2（Vercel依存）**
- P1: **6/7完了、残り1（Preview依存）**
- P2: **2/5完了、残り3**
- Phase14必須: **13/19 = 68.4%**
- P3: Phase14母数外

## 次の実装順

1. P2-01 Modern未登録の少数不足キャラと公式Source relationあり41件を一次情報/実機で個別確認（推測補完なし）
2. P0-06 Vercel Preview Project / Deployment（Project利用可能後）
3. P2-04 Preview複数viewport・keyboard最終確認
4. P0-07 Preview Runtime / Demo Gate Smoke
5. P1-06 Auth/Admin E2E
6. P2-03 Performance Measurement / Optimization

P0-06/P0-07/P1-06/P2-03の最終確認はVercel Project 0件のため現在ブロックしている。Claude Code待ちを理由にその他のPhase14作業は停止しない。
