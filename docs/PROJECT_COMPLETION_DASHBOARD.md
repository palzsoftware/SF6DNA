# SF6DNA Project Completion Dashboard

最終更新: 2026-08-27 22:18 JST

## 現在Phase

- **Phase13: Character Content Verification & Expansion — 完了済み**
- **Phase14: Application Integration, Public Data Gating & Demo Release Readiness — 進行中**
- 作業ブランチ: `sf6dna-v2`
- `main`: 変更禁止（ユーザー明示許可まで）
- Supabase正本: `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)
- SF6現行基準: `2026.08.03` 以降

Phase13の31/31 `STRUCTURAL GATE PASSED`は維持する。Modern完全転記、完全ローカライズ、Combo/Setup/Sequence/Counter/Training等の完全Verification、`unverified → verified`、`draft → published`はPhase13未完了ではなく、Phase14以降のRelease Quality / Verification Backlogとして扱う。

## Phase14正式目的

Phase14は **Application Integration, Public Data Gating & Demo Release Readiness** とする。

Phase13までに構築したDB・API・UI・検索・診断・推薦・AI Coach Retrievalを統合し、未検証情報を確定情報として漏らさず、Vercel Previewで確認可能なデモWebアプリへ近づける。

## 進捗率

### SF6DNA全体完成率

母数: 下記50監査項目。

- 完成 = 1.00
- 検証待ち = 0.75
- 部分完成 = 0.50
- データ不足 = 0.25
- 未実装 / ブロック中 = 0.00

**26.75 / 50 = 53.5%**

### デモ版完成率

母数: ユーザー指定のデモ最低条件23ゲート。同じ加点方式。

**12.50 / 23 = 54.3%**

### Phase14完成率

母数: `PHASE14_IMPLEMENTATION_PLAN.md` のP0〜P2、計19タスク。P3はPhase15以降へ送れるため除外。

完了: **6 / 19 = 31.6%**

完了済みとして実体確認できたもの:
- P0-01 全体監査・進捗基準・Phase14計画
- P0-02 Public Verification Gate Hardening
- P0-03 Move Detail Integration
- P0-04 Safe Demo Content Release Gate
- P0-05 Current HEAD Build / CI / Static Check
- P1-01 Character → Sequence統合

### 本番版完成率

母数: 同じ50項目。本番品質として厳格採点。

- 完成 = 1.00
- 検証待ち = 0.50
- 部分完成 = 0.25
- データ不足 / 未実装 / ブロック中 = 0.00

**17.25 / 50 = 34.5%**

## 実DB・実コードの主要事実

- Playable Character: published **31** / non-playable draft **3**
- Character Content Package: **31 / 31**
- Move: **2,065件、全件draft、published 0**
- Current Frame: **2,065件**
  - verified **307**
  - reviewed **1,752**
  - unverified **6**
- Classic Command: **2,065**
- Modern Command: **1,441**（Classic比69.8%）
- Move Alias: **3,552**
- Combo: archived/unverified 40、draft/reviewed 76、draft/unverified 224、draft/verified 1
- Setup: draft/reviewed 20、draft/unverified 166
- Sequence: draft/reviewed 17、draft/unverified 169
- Counter: draft/reviewed 67、draft/unverified 1,055
- Training: draft/reviewed 8、draft/unverified 1,469
- Character Trait Score: **372件、draft/reviewed**
- Player: published 41 / draft 50
- Video: published 5 / draft 8
- Diagnosis: published **4**
- Diagnosis Question: published **52**
- Source: **328**（official 84 / primary 2 / secondary 137 / community 104 / internal_candidate 1）
- Entity Source relation: **16,716**
- Current Patch: `2026.08.03`
- public schema: **38 tables / RLS 38/38 enabled**
- Vercel接続チーム: **Project 0件**

### Public品質ゲート

確認済み:
- Character: `published`のみ
- Move: `published`のみ
- Frame: 親Move `published` + Frame `verified`
- Command: 親Move `published` + official Source
- Combo / Setup / Sequence / Counter / Training / Trait Score: `published + verified`
- Player / Video: `published`
- Unified Search RPC: Strategyを`published + verified`に限定
- AI Coach Retrieval: Unified Search結果を根拠として利用するため、基礎Evidenceは上記公開ゲートを継承

したがって、`draft / reviewed / unverified`をPublic・Search・AI Coachへ確定情報として漏らさない基盤は成立している。ただしPreview上の回帰確認は未完。

## 全体監査 — 50項目

| # | 項目 | 状態 | 現状 |
|---:|---|---|---|
| 1 | 要件定義 | 完成 | Phase1〜13資料とPhase14要件を確認 |
| 2 | アーキテクチャ | 完成 | Next.js + Supabase構成確立 |
| 3 | DB Schema | 完成 | public 38テーブル |
| 4 | Supabase RLS | 完成 | 38/38有効、公開品質Gateあり |
| 5 | Auth | 部分完成 | SSR/Auth UI基盤あり、E2E未完 |
| 6 | Character | 完成 | 31 playable published、31/31 package |
| 7 | Move | データ不足 | 2,065件あるが全件draft |
| 8 | Frame | 検証待ち | verified 307 / reviewed 1,752 / unverified 6 |
| 9 | Classic Command | 検証待ち | 2,065件、公開時official Source条件あり |
| 10 | Modern Command | データ不足 | 1,441 / 2,065 |
| 11 | Alias | 部分完成 | Move alias 3,552ほか構造あり |
| 12 | Combo | データ不足 | 公開可能セット未成立 |
| 13 | Setup | データ不足 | published 0 |
| 14 | Sequence | データ不足 | published 0 |
| 15 | Counter | データ不足 | published 0 |
| 16 | Training | データ不足 | published 0 |
| 17 | Player | 部分完成 | published 41 |
| 18 | Video | 部分完成 | published 5 |
| 19 | Character Trait Score | データ不足 | 372 draft/reviewed、published+verified 0 |
| 20 | Source | 部分完成 | 328 Source / 16,716 relation、完全coverage監査残り |
| 21 | Patch | 完成 | Current Patch 2026.08.03 |
| 22 | Verification | 検証待ち | Phase13 carryoverあり |
| 23 | Character UI | 部分完成 | list/detail/sectionあり、Sequence導線追加済み |
| 24 | Move UI | 部分完成 | Frame/Command/Patch/Source/Verification統合済み、公開Move 0 |
| 25 | Combo UI | 部分完成 | list/detailあり、公開データ0 |
| 26 | Setup UI | 部分完成 | list/detailあり、公開データ0 |
| 27 | Counter UI | 部分完成 | list/detailあり、公開データ0 |
| 28 | Training UI | 部分完成 | list/detailあり、公開データ0 |
| 29 | Player UI | 部分完成 | list/detailあり |
| 30 | Video UI | 部分完成 | detail/Character relationあり |
| 31 | Unified Search | 部分完成 | RPC + `/search`、公開品質Gateあり |
| 32 | Diagnosis | 完成 | 4 published / 52 questions |
| 33 | Character Recommendation | データ不足 | Engineあり、公開Trait Score 0 |
| 34 | Admin | 検証待ち | CRUD/relations/data-qualityあり、実Admin E2E残り |
| 35 | Data Quality | 部分完成 | Dashboard/Source/Patch/Verification管理あり |
| 36 | AI Coach Retrieval | 部分完成 | Retrieval + Current Patch + Source Evidenceあり、coverage不足 |
| 37 | AI Coach Generation | 未実装 | 意図的に未有効化 |
| 38 | Authentication | 検証待ち | Login/Session/Admin E2E残り |
| 39 | Public / Draft separation | 検証待ち | DB/Search/UI Gate確認済み、Preview回帰確認待ち |
| 40 | API | 部分完成 | Diagnosis Recommend / Coach Retrieve等あり |
| 41 | Error handling | 部分完成 | fallbackあり、Preview runtime smoke残り |
| 42 | Responsive UI | 検証待ち | CSS基盤あり、実viewport確認残り |
| 43 | SEO | 部分完成 | root metadataあり、個別SEO残り |
| 44 | Performance | 検証待ち | Preview計測未実施 |
| 45 | Security | 部分完成 | RLS/Admin guard基盤あり、Auth/Admin E2E残り |
| 46 | Testing | 部分完成 | CI static checksあり、自動Unit/E2E不足 |
| 47 | CI | 完成 | commit `fba99ea20ad44d7e38eba79e01d2913411d1257b` のcheck成功 |
| 48 | Deployment | 未実装 | v2 Preview未成立 |
| 49 | Vercel | ブロック中 | 接続TeamにProject 0件 |
| 50 | Demo Release Readiness | ブロック中 | 公開主要攻略データ不足 + Preview未成立 |

状態内訳:
- 完成: 8
- 部分完成: 21
- 検証待ち: 8
- データ不足: 9
- 未実装: 2
- ブロック中: 2

## デモ版23ゲート

| # | 条件 | 状態 |
|---:|---|---|
| 1 | トップページ | 完成 |
| 2 | キャラクター一覧 | 完成 |
| 3 | キャラクター詳細 | 完成 |
| 4 | 技一覧 | データ不足 |
| 5 | 技詳細 | データ不足 |
| 6 | フレーム | データ不足 |
| 7 | コマンド | データ不足 |
| 8 | コンボ | データ不足 |
| 9 | セットプレイ | データ不足 |
| 10 | 対策 | データ不足 |
| 11 | トレモ | データ不足 |
| 12 | プレイヤー | 完成 |
| 13 | 動画 | 部分完成 |
| 14 | 統合検索 | 部分完成 |
| 15 | 診断4種 | 完成 |
| 16 | キャラクター推薦 | データ不足 |
| 17 | AI Coach Retrieval最低限動作 | 部分完成 |
| 18 | レスポンシブ | 検証待ち |
| 19 | 重大エラーなし | 検証待ち |
| 20 | draft漏洩なし | 検証待ち |
| 21 | 基本セキュリティ | 部分完成 |
| 22 | build成功 | 完成 |
| 23 | Vercel Preview可能 | ブロック中 |

## 優先度・残件

### P0

計7件。完了5件、残り**2件**。

- P0-06 Vercel Preview Project / Deployment — **ブロック中**
- P0-07 Preview Runtime / Demo Gate Smoke — P0-06依存

### P1

計7件。完了1件、残り**6件**。

完了:
- P1-01 Character → Sequence統合

残り:
- P1-02 Strategy Public UI Integration
- P1-03 Player / Video Integration Completion
- P1-04 Character Recommendation Verified Data Pipeline
- P1-05 AI Coach Verified Evidence Policy
- P1-06 Auth / Admin E2E
- P1-07 SEO / Public Metadata Baseline

### P2

計5件、残り**5件**。

- Modern Command Coverage Improvement
- Automated Test Expansion
- Performance Measurement / Optimization
- Responsive / Accessibility Polish
- Data Quality / Progress Automation

### P3

Phase14完成率の母数外。

- Phase13 Verification / Release Quality Backlogの全面完了
- AI Coach Generation
- Replay Coach（実解析機構が成立してから）

## ブロッカー

現在の重大ブロッカーグループ: **2件**

1. **Vercel Project未作成** — 接続TeamでProject 0件のためPreview実機確認不可。
2. **Public Release Dataset不足** — Move 2,065件は全件draft、Strategyもpublished+verified公開セットが不足。推測値を昇格して解消してはならない。

CI Typecheckブロッカーは2026-08-27 22:17 JSTに解消済み。

## 今回完了したこと

- Phase13 31/31 `STRUCTURAL GATE PASSED`を再確認
- Supabase 38テーブル・RLS 38/38を再監査
- 主要Entityの件数・status・verificationを実DBから再取得
- Unified Searchの公開品質GateをSQL定義で確認
- AI Coach RetrievalのEvidence経路をコード確認
- Vercel接続状態を確認（Project 0件）
- 最新CI失敗原因を特定
- `CharacterSectionKey`追加後に不足していた`sequences` metadataを修正
- commit `fba99ea20ad44d7e38eba79e01d2913411d1257b` でGitHub Actions check成功
- Character → Sequence統合を完了扱いへ更新

## 次の作業

1. P1-02 Strategy Public UI Integrationを進め、Source/Patch/Verification表示とsafe empty stateを統一する。
2. 並行して、公開可能なMove/Strategy candidateを実DBから厳格条件で抽出する。自動publishはしない。
3. Vercel Projectが利用可能になり次第P0-06→P0-07を実行する。本番公開は行わない。
4. 大きな作業単位ごとに本Dashboardを再監査・更新する。
