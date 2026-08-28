# SF6DNA Phase18 Implementation Plan

最終更新: 2026-08-28 JST

状態: **完了**

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
- Phase18 Data Quality Report: `docs/PHASE18_DATA_QUALITY_REPORT_2026-08-28.md`
- Phase18 Final Audit: `docs/PHASE18_FINAL_AUDIT_2026-08-28.md`
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

## Backlog Final Status

| ID | Task | 状態 |
|---|---|---|
| P18-00 | Baseline / Scope Freeze | **完了** |
| P18-01 | 31 Character Current Patch Quality Audit | **完了** |
| P18-02 | Move / Frame / Command Publish Candidate Classification | **完了** |
| P18-03 | Strategy Content Readiness Classification | **完了** |
| P18-04 | Trait / Diagnosis / Reference Coverage Audit | **完了** |
| P18-05 | Public Gate Regression Audit | **完了** |
| P18-06 | Data Quality Report / Publish Candidate Report | **完了** |
| P18-07 | Automated Acceptance | **完了** |
| P18-08 | Final Audit / Closure | **完了** |

## P18-05で実施したRelease Gate改善

### Public Move Gate

Move本体には`verification_status`がないため、`status=published`だけで公開しないよう、以下の共通Gateを追加した。

- Move status = published
- Classic Commandあり
- Current Patch verified Frameあり
- Move Sourceあり
- Current Frame Sourceあり
- Modern Commandは任意・推測禁止

適用先:
- direct Move detail
- Character Move section
- Unified Search

### Strategy Source Gate

Combo / Setup / Sequence / Counter / TrainingのPublic RLSを、

- published
- verified
- Source relationあり

の3条件へ強化した。

Migration:
`supabase/migrations/20260828_phase18_strategy_source_public_gate.sql`

## Automated Acceptance

- Phase18 Data Gate Acceptance `33145909173`: **success**
- Phase18 Data Gate Acceptance `33145974207`: **success**
- SF6DNA v2 Web Check `33145974201`: **success**
- Supabase Security Advisor: **0 lints**

## Completion Rule

Phase18では人力・外部環境作業を完了条件に含めない。

以下はPhase19へ維持する。
- Vercel Project / Preview
- Preview Runtime / Logs
- real Auth/Admin session E2E
- actual PC/device/browser
- Public network Performance
- Production Readiness final decision

## Non-goals / 実施していないもの

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

## Closure

Phase18の全作業は完了した。
Phase19はユーザーの明示指示を受けるまで開始しない。
