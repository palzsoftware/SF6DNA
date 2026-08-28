# PROJECT_STATUS.md

最終更新: 2026-08-28 JST

## SF6DNA v2 現在状態

SF6DNA v2はPhase13、Phase14、Phase16、Phase17、Phase18を完了した。

Phase18 `Verified Content Coverage & Publish Candidate Preparation` では、Supabase実DBを正本として全31キャラのCurrent Patch品質監査、Move/Frame/Command・Strategy・Trait/Diagnosis/Referenceの公開候補分類、Public Gate回帰監査と防御強化、Phase18専用Automated Acceptanceを完了した。

現在のDemo Release Decisionは **CONDITIONAL GO**。

- Automated / Internal Readiness: **PASS**
- Data Gate Readiness: **PASS**
- Production Ready: **未判定 / Final Phase依存**
- Phase18: **完了**
- Phase19 Internal Data Integrity & Release Hardening: **未開始 / 定義済み**
- Phase20 Final Manual / External Acceptance: **未開始 / Final Phase予約**

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
- Phase17 Final Audit: `docs/PHASE17_FINAL_AUDIT_2026-08-28.md`
- Phase18 Plan: `docs/PHASE18_IMPLEMENTATION_PLAN.md`
- Phase18 Data Quality: `docs/PHASE18_DATA_QUALITY_REPORT_2026-08-28.md`
- Phase18 Final Audit: `docs/PHASE18_FINAL_AUDIT_2026-08-28.md`
- Phase19 Plan: `docs/PHASE19_IMPLEMENTATION_PLAN.md`
- Phase20 Final Manual Acceptance Plan: `docs/PHASE20_FINAL_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md`
- Legacy Phase19 Manual Plan: `docs/PHASE19_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md`（廃止 / Phase20へ移管済み）
- Release Gate: `docs/V2_RELEASE_READINESS.md`

## v2 Phase管理

| Phase | 状態 |
|---|---|
| Phase1〜12 | 完了または各Phase定義どおり終了 |
| Phase13 | **完了** |
| Phase14 | **完了** |
| Phase15 | 外部Acceptance残件をFinal Phaseへ移管 |
| Phase16 | **完了 / Conditional Go** |
| Phase17 | **完了 / Automated & Internal PASS** |
| Phase18 | **完了 / Data Gate PASS** |
| Phase19 | **未開始 / Internal Data Integrity & Release Hardening** |
| Phase20 | **未開始 / Final Manual & External Acceptance予約** |

## Phase18 Final Status

| Task | 状態 |
|---|---|
| P18-00 Baseline / Scope Freeze | **完了** |
| P18-01 31 Character Current Patch Quality Audit | **完了** |
| P18-02 Move / Frame / Command Publish Candidate Classification | **完了** |
| P18-03 Strategy Content Readiness Classification | **完了** |
| P18-04 Trait / Diagnosis / Reference Coverage Audit | **完了** |
| P18-05 Public Gate Regression Audit | **完了 / hardening実施** |
| P18-06 Data Quality / Publish Candidate Report | **完了** |
| P18-07 Automated Acceptance | **完了 / PASS** |
| P18-08 Final Audit / Closure | **完了** |

## Phase18 Data Quality Snapshot

### Character / Move

- playable + published Character: 31
- Character Source coverage: 31 / 31
- Move: 2065
- Classic Command: 2065
- Modern Command: 1443
- Modern missing: 622
- Current Patch Frame: 2065
- Current Patch verified Frame: 307
- Move Source: 1347
- Current Frame Source: 2065
- machine Move public candidates: 307
- Current Frame未verified: 1758

verified Current Frameが揃う4キャラ:
- 春麗 68
- ガイル 70
- ジェイミー 93
- キンバリー 76

candidateを理由にMove statusをpublishedへ変更していない。

### Strategy

- Combo: 341 / verified 1 / published 0 / Source 341
- Setup: 186 / verified 0 / published 0 / Source 186
- Sequence: 186 / verified 0 / published 0 / Source 186
- Counter: 1122 / verified 0 / published 0 / Source 1122
- Training: 1477 / verified 0 / published 0 / Source 1477

唯一のdraft verified candidate:
- `kimberly-20260803-modern-assist2`
- Current Patch `2026.08.03`
- Source relation 2
- draft維持

### Other

- Character Guide: 278 / published 0 / verified 0 / Source 278
- Character Trait Score: 372 / published 0 / verified 0 / Source 372
- published Diagnosis: 4
- published Diagnosis Question: 52
- Player: 91 / published 41
- Video: 13 / published 5

## Phase18 Public Gate Improvements

### Move

追加:
- `v2-web/src/lib/public-move-gate.ts`

Public Moveの表示条件を以下へ統一:
1. Move published
2. Classic Commandあり
3. Current Patch verified Frameあり
4. Move Sourceあり
5. Current Frame Sourceあり
6. Modern Commandは任意・推測しない

適用経路:
- direct Move detail
- Character Move section
- Unified Search

### Strategy

Supabase migration:
- `phase18_strategy_source_public_gate`
- repo: `supabase/migrations/20260828_phase18_strategy_source_public_gate.sql`

Combo / Setup / Sequence / Counter / Training Public RLSを:
- published
- verified
- matching Source relationあり

へ強化。

## Phase18 Automated Evidence

- Phase18 Data Gate Acceptance `33145909173`: **success**
- Phase18 Data Gate Acceptance `33145974207`: **success**
- SF6DNA v2 Web Check `33145974201`: **success**
- Supabase Security Advisor after Phase18 DDL: **0 lints**

Performance Advisor:
- `unused_index` INFO
- `multiple_permissive_policies` WARN

計測なしのblind fixは行っていない。

## Phase19 — Internal Data Integrity & Release Hardening

Phase19はChatGPT / GitHub / Supabaseのみで完結する内部作業Phaseとする。

主要作業:
1. Referential Integrity Audit
2. Identifier / Uniqueness / Required Field Audit
3. Patch Lifecycle Integrity Audit
4. Public Gate Matrix Audit（App Query / RPC / RLS）
5. Source Integrity & Evidence Classification
6. Duplicate / Near-Duplicate Content Audit
7. Internal Runtime / Failure-mode Hardening
8. CI / Regression Expansion
9. Security / Performance Advisor Triage
10. Release Documentation Consistency Audit
11. Final Audit / Phase20 handoff

Phase19はユーザーの明示指示まで開始しない。

## Final Phaseへ移管した人力・外部作業

Final Phaseを **Phase20 `Final Manual / External Acceptance & Production Decision`** とする。

以下はPhase19から完全に除外し、Phase20へ集約する。

1. Vercel Project / Git import
2. Preview deployment / Preview URL
3. Preview runtime / build / runtime logs
4. real Admin / non-admin session E2E + limited CRUD / cleanup
5. user PC / iPhone / actual device/browser確認
6. Public Preview/network Performance
7. 外部ブラウザ互換性最終確認
8. Production Readiness final decision
9. Production deploy（ユーザー明示許可がある場合のみ）

Phase20は人力作業が可能になるまで開始しない。

## Public Data Policy

必ず維持する。

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- Modern Commandを推測補完しない
- SourceなしFrame値を確定しない
- Release件数目的で自動publishしない
- Strategy Public Gateは`published + verified + Source`
- Character Guide Public Gateは`published + verified`
- Recommendationは`published + verified + Source`付きTrait Scoreのみ
- Public MoveはCurrent Patch verified Frame + Source + Classicを要求
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
- ユーザー指示なしのPhase19開始
