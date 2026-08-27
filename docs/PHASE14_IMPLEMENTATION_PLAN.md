# SF6DNA Phase14 Implementation Plan

最終更新: 2026-08-27 21:51 JST

## Phase14正式名称

**Application Integration, Public Data Gating & Demo Release Readiness**

## 目的

Phase13までに構築したCharacter Content、DB、検索、診断、Player、Admin、AI Coach Retrievalを実Webアプリへ統合し、次を満たすデモ状態へ到達する。

1. 主要機能がSupabase実DBを正本として動く。
2. `draft / reviewed / unverified` を確定攻略情報としてPublic UI・Search・Recommendation・AI Coachへ漏らさない。
3. Move / Frame / Command / Strategy / Player / Video / Source / Patch / Verificationを画面上で正しく関連付ける。
4. 4診断とCharacter Recommendationの不足時挙動を安全にする。
5. build / CI / runtime / responsive / securityを確認する。
6. Vercel Previewでデモ確認できる状態を作る。
7. Phase13のVerification BacklogをPhase13未完了として扱わない。

## Phase14完了条件

P0〜P2の全19タスクを完了、または明示的にPhase15以降へ再分類し、次を満たすこと。

- P0残件 = 0
- 重大ブロッカー = 0
- Vercel Preview成功
- 主要Routeに重大エラーなし
- Public画面でdraft漏洩なし
- verified必須Entityで非verified漏洩なし
- 4 Diagnosis動作
- Character Recommendationはverified dataのみ使用し、不足時に不足を返す
- AI Coach Retrievalは根拠Source/Current Patch付きEvidenceを返し、不足時に断定しない
- build / typecheck / lint成功
- Phase14終了監査とDashboard更新

本番公開、`main`変更、全31キャラ完全verified化、AI Coach Generation、Replay Coach実装はPhase14必須条件に含めない。

## 優先度定義

- **P0**: デモ公開を阻害する問題
- **P1**: SF6DNA主要機能として必要
- **P2**: 品質向上
- **P3**: Phase15以降でも問題ない

## P0 — 7件

### P0-01 全体監査・正式進捗基準・Phase14計画

- 状態: **完了**
- 目的: Phase13完了状態を正しく引き継ぎ、実DB・実コードを基準に現在地を固定する。
- 対象ファイル:
  - `docs/PHASE13_ALL_31_CHARACTER_COMPLETION_AUDIT.md`
  - `docs/V2_REQUIREMENTS.md`
  - `docs/V2_ARCHITECTURE.md`
  - `docs/V2_RELEASE_READINESS.md`
  - `docs/PROJECT_COMPLETION_DASHBOARD.md`
  - `docs/PHASE14_IMPLEMENTATION_PLAN.md`
- 対象DB: public schema全体、RLS、Patch、Source、主要Entity
- 依存関係: Phase13完了
- 完了条件: 50項目監査、完成率計算、P0〜P3分類をGitHubへ記録
- テスト方法: GitHub HEAD / Supabase実DB / Vercel接続状態を再取得して記録値と照合
- リスク: 古いPhase資料だけを参照して実DBと乖離すること

### P0-02 Public Verification Gate Hardening

- 状態: **未着手**
- 目的: `published` だけではなく、攻略Entityで `verification_status = verified` をPublic公開条件としてDB・Search・UIで強制する。
- 対象ファイル:
  - `supabase/migrations/20260827_phase14_public_verification_gate.sql`
  - `v2-web/src/lib/character-sections.ts`
  - `v2-web/src/lib/content-detail.ts`
  - 必要に応じて `v2-web/src/lib/search.ts`
- 対象DB:
  - `combos`
  - `setups`
  - `sequences`
  - `counters`
  - `trainings`
  - `move_frame_data`
  - RPC `search_sf6dna`
- 依存関係: 現行RLS/検索RPC確認済み
- 完了条件:
  - Strategy public SELECTが `published + verified` のみ
  - public Frameがverifiedのみ
  - Unified Search/AI Coach Retrievalに非verified Strategyが出ない
  - Admin policyは維持
- テスト方法:
  - RLS policy定義再取得
  - RPC定義再取得
  - draft/reviewed/unverified件数がPublic経路へ出ないことをSQL/コードで確認
  - Supabase Security Advisor再実行
- リスク: RLS条件を強くしすぎてAdminまたは将来の履歴表示を壊すこと。Admin ALL policyを維持し、Public SELECTだけ変更する。

### P0-03 Move Detail Integration

- 状態: **未着手**
- 目的: Move詳細でMove本体だけでなくCurrent Frame、Classic/Modern Command、Patch、Source、Verificationを一体表示できるようにする。
- 対象ファイル:
  - `v2-web/src/lib/content-detail.ts`
  - `v2-web/src/app/moves/[slug]/page.tsx`
  - 必要に応じて型/表示component
- 対象DB:
  - `moves`
  - `move_frame_data`
  - `move_commands`
  - `entity_sources`
  - `sources`
  - `patches`
- 依存関係: P0-02
- 完了条件:
  - verified current Frameのみ表示
  - Classic Command表示
  - Modernは存在するときだけ表示し、欠損を推測補完しない
  - Source/Patch/Verificationを確認できる
- テスト方法: verified Frameを持つMove候補でquery結果を検証、非verified Frameが表示されないことを確認
- リスク: Move本体はstatusのみでverification列がないため、子Entityの品質ゲートを誤ってMove全体の確定性と混同しないこと

### P0-04 Safe Demo Content Release Gate

- 状態: **未着手**
- 目的: デモで表示するMove/Combo/Setup/Counter/Training等について、公開可否を機械的に判定できる最低条件を定義する。
- 対象ファイル:
  - `docs/V2_RELEASE_READINESS.md`
  - `docs/PROJECT_COMPLETION_DASHBOARD.md`
  - 必要なData Quality/Admin code
- 対象DB: Move/Frame/Command/Strategy/Source/Patch/Verification各テーブル
- 依存関係: P0-02、P0-03
- 完了条件:
  - 推測値をpublishしない
  - `reviewed ≠ verified` を維持
  - Move公開時のFrame/Command/Source条件を明文化
  - Strategyはpublished + verified + Source + Patch条件を満たす候補だけ公開対象
  - 条件を満たさない場合は安全な空状態を表示
- テスト方法: Data Quality queryで候補件数を算出し、条件不適合Entityが候補に混ざらないことを確認
- リスク: デモ件数を増やすために検証不足データを昇格すること。禁止。

### P0-05 Current HEAD Build / CI / Static Check

- 状態: **未着手**
- 目的: Phase14変更後のCurrent HEADでtypecheck/lint/buildを成功させる。
- 対象ファイル:
  - `.github/workflows/v2-web-check.yml`
  - `v2-web/**`
- 対象DB: なし
- 依存関係: P0-02、P0-03のコード変更
- 完了条件: GitHub Actionsのtypecheck / lint / buildがCurrent HEADで成功
- テスト方法: workflow runのconclusionを確認
- リスク: docs-only HEADではworkflowが走らないため、古い成功結果をCurrent HEAD成功と誤認しないこと

### P0-06 Vercel Preview Project / Deployment

- 状態: **ブロック中**
- 目的: `sf6dna-v2` のデモ用Previewを作成する。本番公開はしない。
- 対象ファイル:
  - `v2-web/.env.example`
  - Vercel Project設定
- 対象DB: Supabase接続先の環境変数のみ。DBデータ変更なし。
- 依存関係: P0-05
- 完了条件:
  - Vercel Projectが存在
  - Root Directory=`v2-web` 等の設定が正しい
  - Preview環境変数設定
  - Preview deployment成功
- テスト方法: Vercel deployment status/build log確認
- リスク: 現在接続TeamのProjectが0件。誤ってProduction deployment/本番ドメイン変更をしない。

### P0-07 Preview Runtime / Demo Gate Smoke

- 状態: **未着手**
- 目的: 実Preview上で主要Route・draft漏洩・レスポンシブ・重大runtime errorを確認する。
- 対象ファイル: `v2-web/src/app/**`、`v2-web/src/lib/**`
- 対象DB: Public read経路全般
- 依存関係: P0-06
- 完了条件:
  - トップ/Character/Move/Strategy/Player/Video/Search/Diagnosis/Recommendation/Coachの主要導線で重大エラーなし
  - draft漏洩なし
  - iPhone幅/PC幅で利用可能
- テスト方法: Preview route smoke、Vercel runtime logs、Public query確認
- リスク: Preview未作成のままローカル構造だけで「デモ可能」と判定すること

## P1 — 7件

### P1-01 Character → Sequence統合

- 目的: Phase14特別確認事項のCharacter → Sequence導線をWeb UIへ追加する。
- 対象ファイル: `v2-web/src/types/character.ts`, `v2-web/src/lib/character-sections.ts`, Character tabs/section page
- 対象DB: `sequences`
- 依存関係: P0-02
- 完了条件: Character詳細からverified + published Sequenceへ到達できる。未公開時は安全な空表示。
- テスト方法: Character section routeでquery/リンク確認
- リスク: draft Sequenceを表示しないこと

### P1-02 Strategy Public UI Integration

- 目的: Combo/Setup/Sequence/Counter/Trainingを共通の公開品質ルールで表示し、Source/Patch/Verificationも確認可能にする。
- 対象ファイル: strategy list/detail routes、`content-detail.ts`、共通component
- 対象DB: Strategy各表、`entity_sources`, `sources`, `patches`
- 依存関係: P0-02、P0-04
- 完了条件: 公開対象のみ表示、Source/Patch表示、欠損時の安全なempty state
- テスト方法: verified/published・draft・reviewed各ケースを比較
- リスク: verifiedとpublishedの片方だけで公開すること

### P1-03 Player / Video Integration Completion

- 目的: Character → Player / Video、Player詳細、Video詳細の導線と空状態を整える。
- 対象ファイル: Player/Video/Character section routes、関連lib
- 対象DB: `players`, `player_characters`, `videos`, `entity_videos`, Source relation
- 依存関係: Public status gate
- 完了条件: published EntityのみPublic表示、リンク切れなし
- テスト方法: published Player 41件、Video 5件の代表データで確認
- リスク: draft Player/Video漏洩

### P1-04 Character Recommendation Verified Data Pipeline

- 目的: Recommendation Engineに必要なTrait Scoreの公開品質導線を確立する。
- 対象ファイル: recommendation lib/API、Admin Trait/Data Quality、Release docs
- 対象DB: `character_traits`, `character_trait_scores`, `entity_sources`
- 依存関係: Source/Verification policy
- 完了条件: published + verified + Source付きScoreだけ推薦に使用し、coverage不足時は不足表示
- テスト方法: 75% coverage gate、0件時、不足時、十分時のAPI確認
- リスク: 372 reviewed draftをverifiedと誤認しないこと

### P1-05 AI Coach Verified Evidence Policy

- 目的: AI Coach Retrievalをverified public evidence優先に統一し、Evidence不足時に断定しない。
- 対象ファイル: `v2-web/src/lib/coach-evidence.ts`, `v2-web/src/app/api/coach/retrieve/route.ts`, Coach UI
- 対象DB: Search対象Entity、Source、Patch
- 依存関係: P0-02、P0-04
- 完了条件: Current Patch/Source付きverified evidence、Evidence不足時の明示、GenerationはOFF維持
- テスト方法: evidenceあり/なし、draft/unverifiedキーワードでAPI確認
- リスク: Search結果をそのまま「確定情報」として生成へ渡すこと

### P1-06 Auth / Admin E2E

- 目的: Login/Session/Admin role/Create/Edit/Publish/Archiveの実動作を確認する。
- 対象ファイル: Auth/Admin/Proxy/Supabase SSR関連
- 対象DB: `profiles`、Admin管理Entity、RLS
- 依存関係: Previewまたは安全なE2E環境
- 完了条件: 非Admin遮断、Admin書込成功、Public反映条件正常
- テスト方法: 実Admin accountによるE2E。大量変更はしない。
- リスク: 本番データを誤編集しないよう最小テストレコードで行う

### P1-07 SEO Baseline

- 目的: デモ公開に必要な検索エンジン向け最低構成を追加する。
- 対象ファイル: route metadata、`sitemap.ts`, `robots.ts`, OGP設定
- 対象DB: published public Entity URL生成
- 依存関係: Public URL構造確定
- 完了条件: Character等の主要個別metadata、sitemap、robots、基本OGP
- テスト方法: build結果と生成metadata/route確認
- リスク: draft URLをsitemapへ含めないこと

## P2 — 5件

### P2-01 Modern Command Coverage Improvement

- 目的: Modern 1,441/2,065の不足を優先度順に補完する。
- 対象ファイル: ingest/admin/docs
- 対象DB: `move_commands`, Source relation
- 依存関係: 十分な一次情報または実機確認
- 完了条件: 検証可能な範囲でcoverageを上げ、推測補完0
- テスト方法: control_scheme別coverage query、Source確認
- リスク: 2026.08.03変更を旧資料から転記すること

### P2-02 Automated Test Expansion

- 目的: Public gate、Search、Recommendation、主要lib/APIの回帰テストを増やす。
- 対象ファイル: `v2-web` test設定/テストコード、CI
- 対象DB: fixtureまたは安全なread-only test data
- 依存関係: P0/P1仕様確定
- 完了条件: gate/search/recommendationの主要ケースを自動検証
- テスト方法: CIで自動実行
- リスク: 実DB依存テストの不安定化

### P2-03 Performance Measurement / Optimization

- 目的: デモPreviewでページ速度と大量データqueryを計測・改善する。
- 対象ファイル: Next.js page/lib、画像/動画表示
- 対象DB: query/index
- 依存関係: Vercel Preview
- 完了条件: 主要ページで明確な性能問題がない、必要なindex/query改善を記録
- テスト方法: Lighthouse/Preview runtime/query確認
- リスク: 計測前の過剰最適化

### P2-04 Responsive / Accessibility Polish

- 目的: スマホファースト要件に沿ってiPhone幅/PC幅、キーボード/ARIA等を改善する。
- 対象ファイル: `v2-web/src/app/globals.css`, components/pages
- 対象DB: なし
- 依存関係: P0-07
- 完了条件: 主要画面で横崩れ・操作不能なし、基本アクセシビリティ確認
- テスト方法: 複数viewport/manual smoke
- リスク: 見た目修正で既存導線を壊すこと

### P2-05 Data Quality / Progress Automation

- 目的: verified/published/Source/Patch coverageを継続監査しやすくする。
- 対象ファイル: Admin Data Quality、Dashboard更新手順、必要なread-only query
- 対象DB: 全Content Entity
- 依存関係: 公開品質ルール確定
- 完了条件: Character別/Entity別の公開準備状況を再計算可能
- テスト方法: live DB件数と管理画面表示を照合
- リスク: 件数だけを品質と誤認しないこと

## P3 — 4件

### P3-01 31 Character Full Verification / Publication

- 目的: Phase13から残った全Move/Combo/Setup/Sequence/Counter/Training等を完全verified化する。
- 対象DB: 全Character Content
- 完了条件: 一次情報/実機確認に基づくverified + published
- リスク: 長期作業。Phase14デモをこれだけのために止めない。

### P3-02 AI Coach Generation

- 目的: 十分なverified Evidenceが揃った領域から根拠付き生成回答を段階解禁する。
- 対象ファイル/DB: Coach Backend/API、trusted evidence DB
- 完了条件: 根拠・Patch・Source・不足時拒否を含む生成品質試験合格
- リスク: DB外攻略知識の断定、APIコスト、プロンプト注入

### P3-03 Replay Coach Implementation

- 目的: 実際の動画/ゲームプレイ解析が可能と実証できた場合のみ実装へ進む。
- 対象: Backend/Replay pipeline
- 完了条件: 実映像解析方式、精度、規約、コスト、データ保護を実証
- リスク: 現在のprototypeを「映像解析済み」と誤認しないこと

### P3-04 Production Launch / Domain / Monetization

- 目的: Demo合格後の正式公開準備。
- 対象: `main` merge、Production Vercel、domain、広告等
- 依存関係: ユーザーの明示承認
- 完了条件: Phase15以降で別途定義
- リスク: Phase14中に勝手に本番公開・main変更しないこと

## Phase13 Verification / Release Quality Backlogの扱い

以下はPhase13未完了タスクではない。

- Modern操作完全転記
- 日本語技名完全ローカライズ
- Combo正確ダメージ
- Combo現行ルート再検証
- Setup有利F
- Sequence成立確認
- Counter実機検証
- Training実機検証
- JP一部Frame等の実機/公式照合
- unverified → verified
- draft → published

Phase14ではデモを阻害するものだけP0/P1へ引き上げ、残りはP2/P3として管理する。

## 現在の実行順

1. P0-01 完了
2. **P0-02 Public Verification Gate Hardening**
3. P0-03 Move Detail Integration
4. P0-04 Safe Demo Content Release Gate
5. P0-05 Current HEAD Build / CI
6. P0-06 Vercel Preview
7. P0-07 Preview Runtime Smoke
8. P1へ進む

## 禁止事項

Phase14中、明示承認なしに以下を実行しない。

- `main`変更/merge
- 本番データ大量削除
- 不可逆DB変更
- 認証方式全面変更
- 課金契約
- Production公開
- 本番ドメイン変更
- 重要仕様の全面変更
- 推測値のverified/published化
- Phase15開始
