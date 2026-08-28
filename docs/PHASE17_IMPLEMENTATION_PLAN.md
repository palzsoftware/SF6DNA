# SF6DNA Phase17 Implementation Plan

最終更新: 2026-08-28 JST

状態: **完了**

## Phase17名称

**Automated Release Readiness Closure & External Acceptance Handoff**

## 目的

Phase16で完成したDemo Release Candidateについて、ChatGPT / GitHub / Supabase上で安全に実行できるRelease Readiness監査を完了し、人力または外部UI操作を必須とするAcceptanceを後続Phaseへ明示的に移管する。

2026-08-28、ユーザー指示により「人力作業は別Phaseへ移し、それ以外で進められる作業をすべて完了する」方針へScopeを更新した。

したがってPhase17では、Vercel UI操作・actual device操作・実認証アカウント操作を完了条件から除外し、それらはPhase19 `Manual / External Acceptance` へ移管する。

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Phase16 Final Audit: `docs/PHASE16_RELEASE_CANDIDATE_AUDIT_2026-08-28.md`
- Phase17 Evidence: `docs/PHASE17_ACCEPTANCE_EVIDENCE_2026-08-28.md`
- Phase17 Final Audit: `docs/PHASE17_FINAL_AUDIT_2026-08-28.md`
- External Acceptance Checklist: `docs/PHASE17_EXTERNAL_ACCEPTANCE_CHECKLIST_2026-08-28.md`
- Phase19 Manual Acceptance Plan: `docs/PHASE19_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md`
- Release Gate: `docs/V2_RELEASE_READINESS.md`

## 絶対ルール

- `main`はユーザー明示許可まで変更しない。
- Production deploymentはユーザー明示許可まで行わない。
- Supabase実DBを正本とする。
- `reviewed ≠ verified`。
- `draft ≠ published`。
- Sourceありだけでverifiedへ昇格しない。
- 推測Modern Commandを追加しない。
- SourceなしFrameを確定しない。
- Release件数確保だけを目的にpublish/verifyしない。
- AI Coach GenerationはEvidence不足のまま有効化しない。
- 新機能を勝手に追加しない。
- 各作業のEvidenceをGitHub文書へ残す。

---

# Phase17 Final Backlog

| Task | 最終状態 |
|---|---|
| P17-00 Baseline / Scope Freeze | **完了** |
| P17-01 Vercel Preview Environment | **Phase19へ移管** |
| P17-02 Preview Runtime Acceptance | **Phase19へ移管** |
| P17-03 Auth / Admin Release Audit | **内部監査完了 / real-session部分はPhase19へ移管** |
| P17-04 Real Device / Browser Acceptance | **Phase19へ移管** |
| P17-05 Preview Performance / Runtime Logs | **Phase19へ移管** |
| P17-06 Production Readiness Pre-audit | **完了** |
| P17-07 Phase17 Closure / Handoff | **完了** |

## P17-00 Baseline / Scope Freeze

完了。

確認:
- Phase16 carryover固定
- `main`変更なし
- Production deployなし
- Current Patch `2026.08.03`

## P17-01 / P17-02 / P17-04 / P17-05

人力またはVercel実Project/実Deploymentが必要なためPhase19へ移管。

移管対象:
- Vercel Project作成
- Root Directory `v2-web`
- Preview環境変数
- Preview deployment
- Preview URL runtime smoke
- Vercel runtime/build logs
- Public network performance
- actual PC/browser/device確認

## P17-03 Auth / Admin Release Audit

内部監査部分は完了。

確認済み:
- unauthenticated Admin block
- safe internal auth return path
- open redirect防止
- `requireAdmin()`によるServer Action guard
- RLS/Admin policy既存Evidence
- Supabase Security Advisor重大項目0
- `public.profiles` 0件のため既存real admin/non-admin sessionなし

real session E2EはPhase19へ移管する。

Audit Log:
- `docs/V2_RELEASE_READINESS.md`の正式必須Gateには含まれない。
- 未実装単独でNo-Goとしない。
- 新機能として勝手に追加しない。

## P17-06 Production Readiness Pre-audit

完了。

自動・内部Evidence:
- SF6DNA v2 Web Check: PASS
- Phase16 Release Acceptance: PASS
- Runtime Smoke: PASS
- Browser Acceptance: PASS
- Lighthouse: PASS
- Supabase Security Advisor: 0 lints
- Public verification gate維持
- AI Coach Generation OFF
- main変更なし
- Production deployなし

判定:
- **Automated/Internal Readiness: PASS**
- **Production Ready: 未判定**

Production最終判定はPhase19のManual / External Acceptance完了後に行う。

## P17-07 Closure / Handoff

完了。

- Phase17 Final Audit作成
- Human/manual tasksをPhase19へ移管
- PROJECT_STATUS更新
- Phase18は未開始のまま維持

## Non-goals

- 新診断タイプ
- Replay Coach本実装
- AI Coach生成解禁
- Auth全面再設計
- Audit機能新設
- 新DB Entity追加
- 大量自動publish / verify
- main merge
- Production deploy
