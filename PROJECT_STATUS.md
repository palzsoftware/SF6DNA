# PROJECT_STATUS.md

最終更新: 2026-08-28 JST

## SF6DNA v2 現在状態

SF6DNA v2はPhase13、Phase14、Phase16、Phase17を完了した。

Phase17では、ChatGPT / GitHub / Supabase上で安全に実行できるRelease Readiness監査を完了し、人力・外部UI・実認証・実デバイス依存のAcceptanceをPhase19へ明示的に移管した。

現在のDemo Release Decisionは **CONDITIONAL GO**。

- Automated / Internal Readiness: **PASS**
- Production Ready: **未判定**
- Phase18: **未開始**
- Phase19 Manual / External Acceptance: **未開始 / 移管済み**

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- main SHA: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Phase14 Final Audit: `docs/PHASE14_FINAL_AUDIT_2026-08-28.md`
- Phase15 Evidence: `docs/PHASE15_ACCEPTANCE_EVIDENCE_2026-08-28.md`
- Phase16 Final Audit: `docs/PHASE16_RELEASE_CANDIDATE_AUDIT_2026-08-28.md`
- Phase17 Plan: `docs/PHASE17_IMPLEMENTATION_PLAN.md`
- Phase17 Evidence: `docs/PHASE17_ACCEPTANCE_EVIDENCE_2026-08-28.md`
- Phase17 Final Audit: `docs/PHASE17_FINAL_AUDIT_2026-08-28.md`
- Phase19 Manual Acceptance Plan: `docs/PHASE19_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md`
- Release Gate: `docs/V2_RELEASE_READINESS.md`

## v2 Phase管理

| Phase | 状態 |
|---|---|
| Phase1〜12 | 完了または各Phase定義どおり終了 |
| Phase13 | **完了** |
| Phase14 | **完了** |
| Phase15 | 外部Acceptance残件をPhase19へ移管 |
| Phase16 | **完了 / Conditional Go** |
| Phase17 | **完了 / Automated & Internal PASS** |
| Phase18 | **未開始** |
| Phase19 | **未開始 / Manual & External Acceptance予約** |

## Phase17 Final Status

| Task | 最終状態 |
|---|---|
| P17-00 Baseline / Scope Freeze | **完了** |
| P17-01 Vercel Preview Environment | **Phase19へ移管** |
| P17-02 Preview Runtime Acceptance | **Phase19へ移管** |
| P17-03 Auth / Admin Release Audit | **内部監査完了 / real sessionはPhase19** |
| P17-04 Real Device / Browser Acceptance | **Phase19へ移管** |
| P17-05 Preview Performance / Runtime Logs | **Phase19へ移管** |
| P17-06 Production Readiness Pre-audit | **完了** |
| P17-07 Closure / Handoff | **完了** |

## Phase17 Automated / Internal Evidence

- SF6DNA v2 Web Check `33142510906`: **success**
- Phase16 Release Acceptance `33142510995`: **success**
- Phase15 Runtime Smoke `33142510966`: **success**
- Phase15 Browser Acceptance `33142511001`: **success**
- Phase15 Lighthouse `33142510926`: **success**
- Supabase Security Advisor: **0 lints**
- Auth/Admin static release audit: **new blockerなし**

## Phase19へ移管した人力・外部作業

1. Vercel Project / Preview URL成立
2. Preview runtime / build / runtime logs
3. real Admin / non-admin session E2E + limited CRUD / cleanup
4. user actual PC/device/browser確認
5. Public Preview/network Performance確認
6. Production Readiness final decision

Audit Logは`docs/V2_RELEASE_READINESS.md`の必須Release Gateではないため、人力Acceptance blockerとは扱わない。必要なら将来別途要件化する。

## Phase18 Proposed Scope — 未開始

Phase18は人力Acceptance待ちで停止しない、ChatGPT側で進行可能な **Verified Content Coverage & Publish Candidate Preparation** を候補とする。

予定作業:
1. 31キャラのCurrent Patchデータ品質・Source coverage再監査
2. Move / Frame / Classic Command / Modern Commandの公開候補品質分類
3. Combo / Setup / Sequence / Counter / TrainingのSource・Patch・verification readiness分類
4. verified/publishedへ昇格可能な候補と、Evidence不足候補を明確に分離
5. Public Search / Character Guide / AI Coach Retrievalのverification gate regression監査
6. Data Quality / release candidate report更新
7. Phase18 automated acceptanceとFinal Audit
8. Phase19へ渡すRelease Candidate baseline固定

注意:
- 候補抽出 ≠ verified
- 候補抽出 ≠ published
- 自動bulk verify/publishは行わない
- 推測値補完は行わない

Phase18の正式Planは、ユーザーがPhase18開始を明示した時点でGitHubへ作成する。

## Demo Content Inventory

Public/release-gated:
- playable + published Character: 31
- published Move: 0
- verified Frame: 307
- published + verified Combo/Setup/Sequence/Counter/Training: 0
- published Player: 41
- published Video: 5
- published Diagnosis: 4
- published Diagnosis Question: 52
- published + verified Character Trait Score: 0

Working:
- Move: 2065
- Classic Command: 2065
- Modern Command: 1443 / 2065（約69.9%、missing 622）
- Combo: 341
- Setup: 186
- Sequence: 186
- Counter: 1122
- Training: 1477
- Player: 91
- Video: 13
- Trait Score: 372

候補件数を理由にstatus/verificationを昇格していない。

## Public Data Policy

必ず維持する。

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- Modern Commandを推測補完しない
- SourceなしFrame値を確定しない
- Release件数目的で自動publishしない
- Strategy / Character Guide Public Gateは`published + verified`
- Recommendationは`published + verified + Source`付きTrait Scoreのみ
- AI CoachはSource付きEvidence + Current Patchを要求
- AI Coach GenerationはOFF

## 禁止事項

- main変更
- Production deploy
- 不可逆DB変更
- bulk delete
- status / verification_statusの推測昇格
- 推測Modern Command
- SourceなしFrame
- Evidence不足でのAI Coach Generation有効化
- Auth全面再設計
- Audit機能の勝手な新設
- ユーザー指示なしのPhase18開始
