# SF6DNA Project Completion Dashboard

最終更新: 2026-08-27 22:03 JST

## 現在Phase

- **Phase13: Character Content Verification & Expansion — 完了済み**
- **Phase14: Application Integration, Public Data Gating & Demo Release Readiness — 進行中**
- `main` は変更しない。
- 作業ブランチ: `sf6dna-v2`
- Supabase正本: `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)
- SF6現行基準: `2026.08.03`

Phase14の目的は、Phase13までに構築したDB・API・UI・検索・診断・AI Coach Retrievalを統合し、**未検証データを確定情報として漏らさず、Vercel Previewでデモ確認できるWebアプリ**へ到達させることとする。

Phase13の構造完成をやり直さない。Phase13から残ったModern、完全Verification、公開品質確認はPhase14以降のRelease Quality / Verification Backlogとして扱う。

## 進捗計算ルール

### 全体完成率

母数は本書の「全体監査」50項目。

| 状態 | 加点 |
|---|---:|
| 完成 | 1.00 |
| 検証待ち | 0.75 |
| 部分完成 | 0.50 |
| データ不足 | 0.25 |
| 未実装 | 0.00 |
| ブロック中 | 0.00 |

`全体完成率 = 加点合計 / 50 × 100`

現状は `26.75 / 50 = 53.5%`。

### デモ完成率

母数はPhase14開始指示のデモ最低条件23ゲート。上記と同じ加点で計算する。

現状は `12.50 / 23 = 54.3%`。

### 本番版完成率

本番版は公開品質を厳しく評価するため、同じ50項目を以下で再採点する。

- 完成 = 1.00
- 検証待ち = 0.50
- 部分完成 = 0.25
- データ不足 / 未実装 / ブロック中 = 0

現状は `17.25 / 50 = 34.5%`。

### Phase14完成率

`PHASE14_IMPLEMENTATION_PLAN.md` のP0〜P2をPhase14必須タスクとし、各タスクを同じ1件として計算する。P3はPhase15以降へ送れるため母数から除外する。

初期計画: P0 7件 + P1 7件 + P2 5件 = **19件**。

現在完了: P0-01〜P0-05 = **5件**。

`Phase14完成率 = 5 / 19 = 26.3%`

## 現在の主要DB事実

- Playable Character: published **31** / draft non-playable **3**
- Move: draft **2,065** / published **0**
- Current Frame: **2,065**
  - verified **307**
  - reviewed **1,752**
  - unverified **6**
- Classic Command: **2,065 / 2,065 moves**
- Modern Command: **1,441 / 2,065 moves = 69.8%**
- Combo: **341**、published **0**
- Setup: **186**、published **0**
- Sequence: **186**、published **0**
- Counter: **1,122**、published **0**
- Training: **1,477**、published **0**
- Character Trait Score: **372**、全件 draft + reviewed、published + verified **0**
- Player: published **41** / draft **50**
- Video: published **5** / draft **8**
- Diagnosis: published **4**
- Diagnosis Question: published **52**
- Current Patch: `2026.08.03 全体バトルバランス調整`
- public schemaの38テーブル: **RLS 38/38有効**
- Strategy Public RLS: **published + verified を強制済み**
- Frame Public RLS: **親Move published + Frame verified を強制済み**
- Command Public RLS: **親Move published + Command official Sourceを強制済み**
- Unified Search Strategy: **published + verified を明示済み**
- Supabase Security Advisor: **指摘0件**（Phase14 migration後再確認）
- Strict Move release candidate: **307件 / 4キャラ**
  - ジェイミー 93
  - キンバリー 76
  - ガイル 70
  - 春麗 68
  - 307件すべてCurrent verified Frame + official Move/Frame/Classic Command Sourceあり
  - Modernあり295 / なし12
- Strategy verified candidate: **Kimberly Combo 1件、draft維持**
- Vercel接続チーム: **Project 0件**

注意:
- `Sourceあり` は `verified` を意味しない。
- `reviewed` は `verified` ではない。
- `draft` は `published` ではない。
- Phase13の `STRUCTURAL GATE PASSED` は「公開品質100%」を意味しない。
- 機械的なRelease Gate通過は自動publish承認ではない。

## 全体監査 — 50項目

| # | 項目 | 状態 | 根拠 / 残件 |
|---:|---|---|---|
| 1 | 要件定義 | 完成 | `docs/V2_REQUIREMENTS.md` を正本として確認 |
| 2 | アーキテクチャ | 完成 | `docs/V2_ARCHITECTURE.md`、Next.js + Supabase + Backend構成 |
| 3 | DB Schema | 完成 | Supabase実DBに主要38テーブル、関係・Patch・Sourceを実装済み |
| 4 | Supabase RLS | 完成 | 38/38有効。Strategy/Frame/CommandのPublic品質GateもPhase14で強化済み |
| 5 | Auth | 部分完成 | Supabase SSR/Auth UI/Session基盤あり。実ユーザーE2E未完 |
| 6 | Character | 完成 | 31 playable published、Phase13 31/31 structural gate passed |
| 7 | Move | データ不足 | 2,065件登録済みだが全件draft。strict release candidateは307件 |
| 8 | Frame | 検証待ち | Current 2,065件。verified 307 / reviewed 1,752 / unverified 6 |
| 9 | Classic Command | 検証待ち | 2,065/2,065構造登録済み。Public時はofficial SourceをRLSで要求 |
| 10 | Modern Command | データ不足 | 1,441/2,065 = 69.8%。Phase13 carryover |
| 11 | Alias | 部分完成 | Character/Move/Player等のAlias構造と検索連携あり。完全表記揺れ監査は未完 |
| 12 | Combo | データ不足 | 341件あるがpublished 0。verifiedはKimberly draft 1件のみ |
| 13 | Setup | データ不足 | 186件あるがpublished 0。reviewed 20、残りunverified |
| 14 | Sequence | データ不足 | 186件あるがpublished 0。reviewed 17、残りunverified |
| 15 | Counter | データ不足 | 1,122件あるがpublished 0。reviewed 67、残りunverified |
| 16 | Training | データ不足 | 1,477件あるがpublished 0。reviewed 8、残りunverified |
| 17 | Player | 部分完成 | published 41 / draft 50。Character relation基盤あり |
| 18 | Video | 部分完成 | published 5 / draft 8。Entity relation基盤あり |
| 19 | Character Trait Score | データ不足 | 372件すべてdraft + reviewed。published + verified 0 |
| 20 | Source | 部分完成 | 多数EntityにSource relationあり。Entity種別ごとの完全coverage/品質統一は未完 |
| 21 | Patch | 完成 | Current Patch=`2026.08.03` を実DBで確認 |
| 22 | Verification | 検証待ち | Phase13 carryover。verified化は構造完成と別タスク |
| 23 | Character UI | 部分完成 | 一覧/詳細/section routeあり。公開攻略データ不足とSequence統合不足あり |
| 24 | Move UI | 部分完成 | Move detailへverified Frame / Classic・Modern Command / Patch / Source / Verificationを統合済み。公開Move 0 |
| 25 | Combo UI | 部分完成 | list/detail基盤あり。published + verifiedのみ取得、公開データ0 |
| 26 | Setup UI | 部分完成 | list/detail基盤あり。published + verifiedのみ取得、公開データ0 |
| 27 | Counter UI | 部分完成 | list/detail基盤あり。published + verifiedのみ取得、公開データ0 |
| 28 | Training UI | 部分完成 | list/detail基盤あり。published + verifiedのみ取得、公開データ0 |
| 29 | Player UI | 部分完成 | list/detailあり、published 41。Preview実機確認未完 |
| 30 | Video UI | 部分完成 | detail/Character relationあり。公開件数少、一覧導線は限定的 |
| 31 | Unified Search | 部分完成 | `search_sf6dna` + `/search` 実装。Strategyはpublished + verifiedを明示。公開攻略データ不足あり |
| 32 | Diagnosis | 完成 | 4診断published、52 question。Runner/API基盤あり |
| 33 | Character Recommendation | データ不足 | Engineはpublished+verifiedのみを要求するが対象Trait Scoreが0 |
| 34 | Admin | 検証待ち | CRUD/relations/data-quality実装済み。実Admin E2E書込未確認 |
| 35 | Data Quality | 部分完成 | Admin dashboard/Source/Patch/Verification管理基盤あり。Release GateをPhase14で明文化 |
| 36 | AI Coach Retrieval | 部分完成 | Current Patch + Search Evidence + Sourceあり。Search側verified gate強化済み。Evidence coverage不足 |
| 37 | AI Coach Generation | 未実装 | 意図的にOFF。信頼DB充足前は有効化しない |
| 38 | Authentication | 検証待ち | Auth基盤はあるがSignup/Login/Session/Adminを通したE2E未完 |
| 39 | Public / Draft separation | 検証待ち | DB/Search/UI gateは強化済み。Vercel Preview上の漏洩回帰確認待ち |
| 40 | API | 部分完成 | Diagnosis Recommend / Coach Retrieve等あり。総合API・外部Backend統合は未完 |
| 41 | Error handling | 部分完成 | Supabase未設定/Query errorのfallbackあり。Preview主要Route runtime smoke未完 |
| 42 | Responsive UI | 検証待ち | CSS実装あり。iPhone幅/PC実機確認未完 |
| 43 | SEO | 部分完成 | Root metadataあり。個別metadata/OGP/sitemap/robotsが未完 |
| 44 | Performance | 検証待ち | 最適化方針あり。Preview上の計測・Lighthouse等未実施 |
| 45 | Security | 部分完成 | RLS 38/38、Security Advisor 0、Admin二重ガードあり。Auth/Admin E2Eが残る |
| 46 | Testing | 部分完成 | typecheck/lint/build成功。Unit/E2E/公開漏洩回帰テスト不足 |
| 47 | CI | 完成 | `7dbc0a7` のGitHub Actions `check` がsuccess。以降はmigration/docsのみ |
| 48 | Deployment | 未実装 | v2 Preview deployment未成立 |
| 49 | Vercel | ブロック中 | 接続チームにProject 0件。Preview先未作成 |
| 50 | Demo Release Readiness | ブロック中 | 公開Move/攻略データ0、Preview未作成、runtime/E2E未完 |

### 状態内訳

- 完成: **8**
- 部分完成: **21**
- 検証待ち: **8**
- データ不足: **9**
- 未実装: **2**
- ブロック中: **2**

## デモ版23ゲート

| # | デモ条件 | 状態 |
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

## 正式進捗

- **SF6DNA全体完成率: 53.5%**
- **デモ版完成率: 54.3%**
- **Phase14完成率: 26.3%**（5 / 19）
- **本番版完成率: 34.5%**

## 優先度別タスク数

初期Phase14計画:

- P0: **7件**
- P1: **7件**
- P2: **5件**
- P3: **4件**（Phase14完成率の母数外）

現在:

- P0完了: **5件**
- 残りP0: **2件**
- 残りP1: **7件**
- 残りP2: **5件**

## P0状況

| Task | 状態 | 内容 |
|---|---|---|
| P0-01 | 完了 | 全体監査・Dashboard・Phase14 Plan |
| P0-02 | 完了 | Public Verification Gate Hardening。Strategy/Frame/Command/RPC/UI |
| P0-03 | 完了 | Move DetailへFrame/Command/Patch/Source/Verification統合 |
| P0-04 | 完了 | Safe Demo Release Gate定義。307 Move候補を抽出、auto publishなし |
| P0-05 | 完了 | Current Web codeでtypecheck/lint/build success |
| P0-06 | ブロック中 | Vercel Preview Projectが存在しない |
| P0-07 | ブロック中 | P0-06依存。Preview runtime / responsive / leak smoke |

## ブロッカー

**2件**

1. **Vercel Preview先が存在しない**
   - 接続Vercel TeamのProjectが0件。
   - 本番公開は行わず、Preview用Project/Repository Root/環境変数の準備が必要。

2. **公開可能なMove/Strategy知識が最低デモラインに未到達**
   - Move published 0。
   - Combo/Setup/Sequence/Counter/Training published 0。
   - strict Move release candidateは307件あるが、機械Gate通過だけでは自動publishしない。
   - これはPhase13未完了ではなく、Phase14 Release Quality / Verification Backlog。

## 今回までに完了したこと

- Phase13 31/31 Character structural gate passedを再確認
- Phase14正式名称・完了条件・進捗算定式確定
- `docs/PROJECT_COMPLETION_DASHBOARD.md` 作成
- `docs/PHASE14_IMPLEMENTATION_PLAN.md` 作成
- `docs/V2_RELEASE_READINESS.md` にPhase14 Safe Demo Release Gate追加
- Supabase Strategy Public RLSをpublished + verifiedへ強化
- Supabase Frame Public RLSをpublished parent Move + verified Frameへ強化
- Supabase Command Public RLSをpublished parent Move + official Sourceへ強化
- Unified Search Strategyをpublished + verifiedへ強化
- Character Strategy sections / Knowledge lists / Detailでverifiedを明示
- Move Detailへverified Frame / Command / Patch / Source / Verificationを統合
- Supabase Security Advisor 0件をmigration後再確認
- GitHub Actions build success確認
- Strict Move release candidate 307件を抽出。自動publishは実施していない

## 進行中項目

- P0-06 Vercel Preview接続方法の解消
- P0-07 Preview smokeはP0-06待ち
- Vercel外部ブロック中でも進められるP1統合作業を継続する

## 未着手 / 後続項目

- Character → Sequence UI統合
- Strategy Source/Patch表示統合
- Player/Video統合仕上げ
- Character Recommendation verified Trait pipeline
- AI Coach Evidence不足時挙動の強化
- 実Admin/Auth E2E
- 個別SEO / sitemap / robots / OGP
- Performance計測
- 31キャラ全データの完全verified化
- AI Coach Generation
- Replay Coach実装

## 次の作業

1. Vercel Project作成手段は外部ブロッカーとして保持し、勝手にProduction deployしない
2. **P1-01 Character → Sequence統合** を開始
3. P1-02 Strategy Source/Patch/Verification表示へ進む
4. Preview先が用意でき次第P0-06/P0-07へ戻る

## 更新ルール

大きな作業単位完了ごとにこのファイルを更新する。

ユーザーから「進捗は？」と聞かれた場合は、必ず次の3点を再確認してから回答する。

1. Supabase実DB
2. GitHub `sf6dna-v2` 実コード
3. `docs/PROJECT_COMPLETION_DASHBOARD.md`

古い会話上の数値だけで回答しない。
