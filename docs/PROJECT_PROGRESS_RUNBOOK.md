# SF6DNA Project Progress Runbook

最終更新: 2026-08-27 JST

## 目的

SF6DNAの進捗回答を古い会話や固定スナップショットだけに依存させず、毎回以下の実体から再確認する。

1. Supabase実DB (`SF6DNAPro`, project ID `wnuxaxbrpudyypzdbdho`)
2. GitHub `sf6dna-v2` のCurrent HEAD / CI
3. `docs/PROJECT_COMPLETION_DASHBOARD.md`
4. `docs/PHASE14_IMPLEMENTATION_PLAN.md`

`main`はユーザー明示許可まで変更しない。

## 「進捗は？」と聞かれた時の手順

### 1. Supabase実DBを再集計

`supabase/quality/phase14_project_snapshot.sql` をread-onlyで実行する。

最低限確認する値:
- playable published Character
- Move total / published / draft
- Current Frame verified / reviewed / unverified
- Classic / Modern Command coverage
- Combo / Setup / Sequence / Counter / Training totalとpublished+verified
- Trait Score total / published+verified / Source links
- Player / Video published / draft
- Diagnosis / Question published
- Source / Entity Source
- public table数 / RLS enabled数
- Current Patch

このSQLは進捗集計専用であり、DB書込・DDLを実行しない。

### 2. GitHub Current HEADを確認

対象:
- repository: `palzsoftware/SF6DNA`
- branch: `sf6dna-v2`

確認事項:
- Current HEAD SHA
- 最新コード変更
- GitHub Actions `SF6DNA v2 Web Check`
- Typecheck
- Lint
- Release gate tests
- Build

古い成功runをCurrent HEAD成功として扱わない。

### 3. Vercel状態を確認

Preview関連の進捗回答時は、Vercel Project / Deploymentを実確認する。

- Projectが存在しなければPreviewを完成扱いにしない。
- Production deploymentはユーザー明示許可なしで実行しない。
- Production domainを推測しない。

### 4. Dashboardと実体を照合

`docs/PROJECT_COMPLETION_DASHBOARD.md` の件数と実DB再集計に差がある場合、Supabase実DBを正としてDashboardを更新する。

コード状態に差がある場合、GitHub Current HEADを正として更新する。

### 5. 完成率を再計算

#### 全体完成率
母数: Dashboardの50監査項目。

- 完成 = 1.00
- 検証待ち = 0.75
- 部分完成 = 0.50
- データ不足 = 0.25
- 未実装 = 0
- ブロック中 = 0

#### デモ完成率
母数: Dashboardの23デモゲート。同じ加点方式。

#### Phase14完成率
母数: `PHASE14_IMPLEMENTATION_PLAN.md` のP0〜P2、19タスク。

`完了タスク数 / 19 × 100`

P3はPhase14母数外。

#### 本番版完成率
母数: 同じ50監査項目。

- 完成 = 1.00
- 検証待ち = 0.50
- 部分完成 = 0.25
- データ不足 / 未実装 / ブロック中 = 0

### 6. 回答フォーマット

最低限以下を返す。

- 現在Phase
- 全体完成率
- デモ完成率
- Phase14完成率
- 本番版完成率
- 今回完了したこと
- P0残件
- P1残件
- P2残件
- ブロッカー
- 次の作業

## 公開品質ルール

以下を進捗率を上げる目的で変更しない。

- `reviewed ≠ verified`
- `draft ≠ published`
- 推測値をverified / publishedへ昇格しない
- Modern欠損を推測補完しない
- Sourceがあることだけでverifiedとみなさない
- Phase13 Verification BacklogをPhase13未完了へ戻さない

## 更新タイミング

以下のいずれかが起きたらDashboard / Planを更新する。

- P0/P1/P2タスク完了
- ブロッカー発生・解消
- 公開品質ゲート変更
- Current Patch変更
- 大規模なverified/published件数変化
- Vercel Preview成立
- CI状態の重大変化
- Phase終了監査

## 正本の優先順位

データ件数・Verification・Publication:
**Supabase実DB > Dashboard > 過去会話**

コード・CI:
**GitHub `sf6dna-v2` Current HEAD > Dashboard > 過去会話**

Preview/Deployment:
**Vercel実状態 > Dashboard > 過去会話**
