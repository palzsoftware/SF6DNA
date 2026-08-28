# SF6DNA Phase18 Implementation Plan

最終更新: 2026-08-28 JST

状態: **進行中**

## Phase18名称

**Verified Content Coverage & Publish Candidate Preparation**

## 目的

Phase17でAutomated / Internal ReadinessをPASSとしたRelease Candidateに対し、Supabase実DBを正本として全31キャラの現行Patchデータ品質を再監査し、公開候補とEvidence不足を明確に分離する。

Phase18は品質分類・Public Gate回帰監査・自動Acceptance整備を行うPhaseであり、件数確保目的のverify/publishや推測補完は行わない。

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- main: ユーザー明示許可まで変更禁止
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Phase17 Final Audit: `docs/PHASE17_FINAL_AUDIT_2026-08-28.md`
- Release Gate: `docs/V2_RELEASE_READINESS.md`

## 絶対ルール

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Commandを追加しない
- SourceなしFrameを確定しない
- 自動bulk verify/publishをしない
- AI Coach Generationを有効化しない
- 新機能を勝手に追加しない
- 人力・外部AcceptanceはPhase19へ維持する
- Phase18作業記録をGitHubへ残す

## Backlog

### P18-00 Baseline / Scope Freeze
- Phase17完了状態とDB baselineを固定
- Current Patch確認
- main未変更確認

### P18-01 31 Character Current Patch Quality Audit
- 31 playable published Character
- Character Source coverage
- Move / Frame / Command coverageをキャラ別集計
- 現行Patch verified Frame coverage

### P18-02 Move / Frame / Command Publish Candidate Classification
- Move総数
- Current Patch Frame
- verified Frame
- Classic Command
- Modern Command
- Move Source / Frame Source
- 機械的公開候補を抽出
- Evidence不足理由を分類

### P18-03 Strategy Content Readiness Classification
対象:
- Combo
- Setup
- Sequence
- Counter
- Training

分類:
- status
- verification_status
- Source
- Current Patch
- published+verified+Source
- draft verified candidate
- reviewed/unverified backlog

### P18-04 Trait / Diagnosis / Reference Coverage Audit
- Character Trait Score
- Diagnosis / Question
- Player / Video
- Source coverage
- Public gate readiness

### P18-05 Public Gate Regression Audit
- Search
- Character Guide
- Knowledge list/detail
- AI Coach Retrieval
- Recommendation
- draft/reviewed/unverified leakage防止

### P18-06 Data Quality Report / Publish Candidate Report
- 全31キャラ別品質表
- 公開候補
- Evidence不足
- 実機確認待ち
- 推測禁止領域

### P18-07 Automated Acceptance
- Phase18用CI/静的Acceptanceを整備
- Data gate regressionを検出
- Typecheck / lint / build / policyを維持

### P18-08 Final Audit / Closure
- Phase18 Final Audit
- PROJECT_STATUS更新
- Phase19へ渡すbaseline固定
- Phase19は自動開始しない

## Non-goals

- 推測Modern Command
- SourceなしFrame
- bulk verify/publish
- Replay Coach
- 新診断
- AI Coach Generation解禁
- Auth全面再設計
- Production deploy
- main merge
- Vercel/actual device/manual acceptance
