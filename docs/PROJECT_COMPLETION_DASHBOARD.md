# SF6DNA Project Completion Dashboard

最終更新: 2026-08-28 06:24 JST

## 現在Phase

- **Phase13: Character Content Verification & Expansion — 完了済み**
- **Phase14: Application Integration, Public Data Gating & Demo Release Readiness — 進行中**
- 作業ブランチ: `sf6dna-v2`
- `main`: 変更禁止（ユーザー明示許可まで）
- Supabase正本: `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)
- SF6現行基準: `2026.08.03` 以降

Phase13の31/31 `STRUCTURAL GATE PASSED`は維持する。Modern完全転記、完全ローカライズ、Combo/Setup/Sequence/Counter/Training等の完全Verification、`unverified → verified`、`draft → published`はPhase13未完了ではなく、Phase14以降のRelease Quality / Verification Backlogとして扱う。

## Phase14正式目的

Phase13までに構築したDB・API・UI・検索・診断・推薦・AI Coach Retrievalを統合し、未検証情報を確定情報として漏らさず、Vercel Previewで確認可能なデモWebアプリへ近づける。

---

# 進捗率

## SF6DNA全体完成率

母数: 下記50監査項目。

- 完成 = 1.00
- 検証待ち = 0.75
- 部分完成 = 0.50
- データ不足 = 0.25
- 未実装 / ブロック中 = 0.00

**28.25 / 50 = 56.5%**

## デモ版完成率

母数: ユーザー指定のデモ最低条件23ゲート。同じ加点方式。

**13.00 / 23 = 56.5%**

## Phase14完成率

母数: `PHASE14_IMPLEMENTATION_PLAN.md` のP0〜P2、計19タスク。P3はPhase15以降へ送れるため除外。

**13 / 19 = 68.4%**

完了:
- P0-01 全体監査・進捗基準・Phase14計画
- P0-02 Public Verification Gate Hardening
- P0-03 Move Detail Integration
- P0-04 Safe Demo Content Release Gate
- P0-05 Current HEAD Build / CI / Static Check
- P1-01 Character → Sequence統合
- P1-02 Strategy Public UI Integration
- P1-03 Player / Video Integration Completion
- P1-04 Character Recommendation Verified Data Pipeline
- P1-05 AI Coach Verified Evidence Policy
- P1-07 SEO / Public Metadata Baseline
- P2-02 Automated Test Expansion
- P2-05 Data Quality / Progress Automation

## 本番版完成率

母数: 同じ50項目。本番品質として厳格採点。

- 完成 = 1.00
- 検証待ち = 0.50
- 部分完成 = 0.25
- データ不足 / 未実装 / ブロック中 = 0.00

**19.00 / 50 = 38.0%**

---

# 実DB・実コードの主要事実

- Playable Character: published **31** / non-playable draft **3**
- Character Content Package: **31 / 31**
- Move: **2,065件、全件draft、published 0**
- Move Source付き: **1,347**
- Release Ready Move: **0**
- Current Frame: **2,065件**
  - verified **307**
  - reviewed **1,752**
  - unverified **6**
- Classic Command: **2,065**
- Modern Command: **1,441**（Classic比69.8%）
- Modern Command未登録: **624**（うち公式Move Source relationあり41、公式Source付きClassic Commandあり41。Modern入力の直接根拠は未確認）
- Move Alias: **3,552**
- Combo: archived/unverified 40、draft/reviewed 76、draft/unverified 224、draft/verified 1
- Setup: draft/reviewed 20、draft/unverified 166
- Sequence: draft/reviewed 17、draft/unverified 169
- Counter: draft/reviewed 67、draft/unverified 1,055
- Training: draft/reviewed 8、draft/unverified 1,469
- Character Trait Score: **372件、全件draft + reviewed**
- Character Trait Score Source relation: **744**
- Player: published **41** / draft **50**
- Player Source relation: **94**
- Video: published **5** / draft **8**
- Character→Video relation: published Videoへのlink **5**、draft Videoを含むlink **30**
- Video Source relation: **0**（Video自体のURLは保持）
- Release Ready Strategy: **0**
- Recommendation Ready Candidate: **0**
- AI Coach Source Evidence Entity: **9,870**
- Diagnosis: published **4**
- Diagnosis Question: published **52**
- Source: **328**（official 84 / primary 2 / secondary 137 / community 104 / internal_candidate 1）
- Entity Source relation: **16,716**
- Current Patch: `2026.08.03`
- public schema: **38 tables / RLS 38/38 enabled**
- Vercel接続チーム: **Project 0件**

## Public品質ゲート

確認済み:
- Character: `published`のみ
- Move: `published`のみ
- Frame: 親Move `published` + Frame `verified`
- Command: 親Move `published` + official Source
- Combo / Setup / Sequence / Counter / Training / Trait Score: `published + verified`
- Player / Video: `published`
- Unified Search RPC: Strategyを`published + verified`に限定
- Recommendation: `published + verified + Source付きTrait Score`のみ
- AI Coach Retrieval: Public Search Gate通過後さらに`Source付きEvidence`のみ。Current Patch不明またはEvidence不足時は断定しない。GenerationはOFF

Preview上の最終回帰確認は未完。

## CI

最新のコード変更を含むcommit / GitHub Actionsは、今回変更のpush後に更新する。

ローカル検証:
- Typecheck: **success**
- Lint: **success**
- Tests: **24 / 24 success**
- Build: **success**

---

# 全体監査 — 50項目

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
| 10 | Modern Command | データ不足 | 1,441 / 2,065。未登録624件をキャラ別・Source別にread-only集計済み |
| 11 | Alias | 部分完成 | Move alias 3,552ほか構造あり |
| 12 | Combo | データ不足 | published 0 |
| 13 | Setup | データ不足 | published 0 |
| 14 | Sequence | データ不足 | published 0 |
| 15 | Counter | データ不足 | published 0 |
| 16 | Training | データ不足 | published 0 |
| 17 | Player | 部分完成 | published 41 / draft 50 |
| 18 | Video | 部分完成 | published 5 / draft 8 |
| 19 | Character Trait Score | データ不足 | 372 draft/reviewed、published+verified 0 |
| 20 | Source | 部分完成 | 328 Source / 16,716 relation、Entity別coverage残り |
| 21 | Patch | 完成 | Current Patch 2026.08.03 |
| 22 | Verification | 検証待ち | Phase13 carryoverあり |
| 23 | Character UI | 部分完成 | list/detail/sections/Sequence導線あり、公開攻略データ不足 |
| 24 | Move UI | 部分完成 | Frame/Command/Patch/Source/Verification統合済み、公開Move 0 |
| 25 | Combo UI | 部分完成 | list/detail + Patch/Source/Verification対応、公開データ0 |
| 26 | Setup UI | 部分完成 | list/detail + Patch/Source/Verification対応、公開データ0 |
| 27 | Counter UI | 部分完成 | list/detail + Patch/Source/Verification対応、公開データ0 |
| 28 | Training UI | 部分完成 | list/detail + Patch/Source/Verification対応、公開データ0 |
| 29 | Player UI | 検証待ち | list/detail、Character relation、Source表示まで実装。Preview runtime確認待ち |
| 30 | Video UI | 検証待ち | `/videos` list/detail、Character relation、published gate実装。Preview runtime確認待ち |
| 31 | Unified Search | 部分完成 | RPC + `/search`、公開品質Gateあり。Strategy公開データ不足 |
| 32 | Diagnosis | 完成 | 4 published / 52 questions |
| 33 | Character Recommendation | データ不足 | Pipeline完成、公開Trait Score 0 |
| 34 | Admin | 検証待ち | CRUD/relations/data-qualityあり、実Admin E2E残り |
| 35 | Data Quality | 完成 | read-only再集計SQLで全体・31キャラ別・Release Readyを同一条件集計 |
| 36 | AI Coach Retrieval | 検証待ち | Source付きEvidence + Current Patch gate実装。Preview API確認待ち |
| 37 | AI Coach Generation | 未実装 | 意図的に未有効化 |
| 38 | Authentication | 検証待ち | Login/Session/Admin E2E残り |
| 39 | Public / Draft separation | 検証待ち | DB/Search/UI Gate確認済み、Preview回帰確認待ち |
| 40 | API | 部分完成 | Diagnosis Recommend / Coach Retrieve等あり |
| 41 | Error handling | 部分完成 | global error / 404を追加、Preview runtime smoke残り |
| 42 | Responsive UI | 検証待ち | Static Review完了。長文・table・nav対策済み、実viewport確認残り |
| 43 | SEO | 検証待ち | metadata/OGP/Twitter/robots/sitemap実装、実Preview URL確認待ち |
| 44 | Performance | 検証待ち | Preview計測未実施 |
| 45 | Security | 部分完成 | RLS/Admin guard基盤あり、Auth/Admin E2E残り |
| 46 | Testing | 部分完成 | Public Gate/Recommendation/Coach/Search/Sitemap/Data Quality/Static Accessibilityを24 testsで自動化。Auth E2Eは残り |
| 47 | CI | 完成 | 今回変更はローカル4チェック成功。最新HEAD Actions確認後にcommitを記録 |
| 48 | Deployment | 未実装 | v2 Preview未成立 |
| 49 | Vercel | ブロック中 | 接続TeamにProject 0件 |
| 50 | Demo Release Readiness | ブロック中 | 公開主要攻略データ不足 + Preview未成立 |

状態内訳:
- 完成: **9**
- 部分完成: **16**
- 検証待ち: **12**
- データ不足: **9**
- 未実装: **2**
- ブロック中: **2**

---

# デモ版23ゲート

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
| 13 | 動画 | 検証待ち |
| 14 | 統合検索 | 部分完成 |
| 15 | 診断4種 | 完成 |
| 16 | キャラクター推薦 | データ不足 |
| 17 | AI Coach Retrieval最低限動作 | 検証待ち |
| 18 | レスポンシブ | 検証待ち |
| 19 | 重大エラーなし | 検証待ち |
| 20 | draft漏洩なし | 検証待ち |
| 21 | 基本セキュリティ | 部分完成 |
| 22 | build成功 | 完成 |
| 23 | Vercel Preview可能 | ブロック中 |

---

# 優先度・残件

## P0

計7件。完了5、残り**2**。

- P0-06 Vercel Preview Project / Deployment — **ブロック中**
- P0-07 Preview Runtime / Demo Gate Smoke — **P0-06依存でブロック中**

## P1

計7件。完了6、残り**1**。

残り:
- P1-06 Auth / Admin E2E — **Preview依存でブロック中**

## P2

計5件。完了2、残り**3**。

- P2-01 Modern Command Coverage Improvement — **不足状況整理完了、一次情報/実機検証待ち**
- P2-02 Automated Test Expansion — **完了**
- P2-03 Performance Measurement / Optimization — Preview依存
- P2-04 Responsive / Accessibility Polish — **Static Review完了、最終確認Preview依存**
- P2-05 Data Quality / Progress Automation — **完了**

## P3

Phase14完成率の母数外。

- Phase13 Verification / Release Quality Backlog全面完了
- AI Coach Generation
- Replay Coach（実解析機構成立後）

---

# ブロッカー

重大ブロッカー: **2グループ**

1. **Vercel Preview環境未成立**
   - Vercel接続TeamのProject 0件
   - P0-06 / P0-07 / P1-06 / P2-03最終確認へ影響

2. **公開品質データ不足**
   - Move published 0
   - Strategy主要5種 published 0
   - Trait Score published+verified 0
   - デモで公開攻略コンテンツを十分表示できない

これはPhase13未完了を意味しない。Release Quality / Verification Backlogとして扱う。

# 今回完了したこと

- P2-04 Static Review: skip navigation、main landmark、global error / 404、外部リンク保護、画像寸法、長文折返し、table overflowを改善
- Static Accessibility回帰テスト5件を追加し、全Tests **24 / 24 success**
- P2-01: 実DBのModern不足624件を31キャラ別・Source relation別にread-only集計
- Modern入力を推測せず、一次情報/実機確認候補として監査資料と再実行SQLを追加
- P2-02: Public Release Gate 13要件を18 Policy testsへ拡張
- 失敗していたAI Coach readinessテストを現行実装へ整合
- CI依存導入を`npm ci`へ固定し、lockfileを追加
- P2-05: `phase14_public_readiness.sql`を追加し実DBでread-only実行成功
- Move/Strategy/Trait/Player/Video、31キャラ別coverage、Release Readyを自動集計
- Responsive / Accessibility Static Reviewとして進捗bar、状態通知、タップ領域、長文折返しを改善
- 今回変更を含むローカルHEADでTypecheck/Lint/Tests/Build成功
- Strategy詳細へPatch / Verification / Sourceを共通統合
- Character → SequenceのCI不整合修正を含む統合確定
- Player Source表示
- `/videos` 公開一覧追加
- Video主要ナビ追加
- Recommendationをpublished + verified + Source付きTrait Scoreに限定
- AI CoachをSource付きEvidenceに限定
- AI CoachでCurrent Patch不明/根拠不足時の安全な不足状態を実装
- Generation OFFを維持
- robots / sitemap / OGP / Twitter metadata追加
- Productionドメインを推測せず`NEXT_PUBLIC_SITE_URL` / `VERCEL_URL`に対応
- 最新コードHEADでTypecheck/Lint/Build成功

# 次の作業

1. Modern未登録のうち少数不足キャラと公式Source relationあり41件を、現行一次情報または実機で個別確認
2. Vercel Project利用可能後、P2-04の複数viewport・keyboard最終確認を実施
3. Vercel Project利用可能後、P0-06 / P0-07 / P1-06 / P2-03を再開
