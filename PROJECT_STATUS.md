# PROJECT_STATUS.md

最終更新: 2026-08-28 JST

## SF6DNA v2 現在状態

SF6DNA v2はPhase13、Phase14、Phase16、Phase17、Phase18、Phase19を完了した。

Phase19 `Internal Data Integrity & Release Hardening` では、Supabase実DBを正本として参照整合性・識別子・Patch lifecycle・Source/Evidence・duplicate候補・Public Gate Matrixを横断監査し、Move Public GateのApp/RLS差異とlegacy Source種別を修正した。Phase19専用CIも追加しPASSを確認した。

現在のDemo Release Decisionは **CONDITIONAL GO**。

- Automated / Internal Readiness: **PASS**
- Data Gate Readiness: **PASS**
- Internal Integrity / Hardening: **PASS**
- Production Ready: **未判定 / Phase20依存**
- Phase19: **完了**
- Phase20 Final Manual / External Acceptance: **未開始 / Final Phase予約**

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- main baseline SHA: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Phase14 Final Audit: `docs/PHASE14_FINAL_AUDIT_2026-08-28.md`
- Phase15 Evidence: `docs/PHASE15_ACCEPTANCE_EVIDENCE_2026-08-28.md`
- Phase16 Final Audit: `docs/PHASE16_RELEASE_CANDIDATE_AUDIT_2026-08-28.md`
- Phase17 Final Audit: `docs/PHASE17_FINAL_AUDIT_2026-08-28.md`
- Phase18 Final Audit: `docs/PHASE18_FINAL_AUDIT_2026-08-28.md`
- Phase18 Data Quality: `docs/PHASE18_DATA_QUALITY_REPORT_2026-08-28.md`
- Phase19 Plan: `docs/PHASE19_IMPLEMENTATION_PLAN.md`
- Phase19 Integrity Audit: `docs/PHASE19_INTERNAL_INTEGRITY_AUDIT_2026-08-28.md`
- Phase19 Final Audit: `docs/PHASE19_FINAL_AUDIT_2026-08-28.md`
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
| Phase19 | **完了 / Internal Integrity & Hardening PASS** |
| Phase20 | **未開始 / Final Manual & External Acceptance予約** |

## Phase19 Final Status

| Task | 状態 |
|---|---|
| P19-00 Baseline / Scope Freeze | **完了** |
| P19-01 Referential Integrity Audit | **完了** |
| P19-02 Identifier / Uniqueness / Required Field Audit | **完了** |
| P19-03 Patch Lifecycle Integrity Audit | **完了** |
| P19-04 Public Gate Matrix Audit | **完了 / hardening実施** |
| P19-05 Source Integrity & Evidence Classification | **完了** |
| P19-06 Duplicate / Near-Duplicate Content Audit | **完了** |
| P19-07 Internal Runtime / Failure-mode Hardening | **完了** |
| P19-08 CI / Regression Expansion | **完了 / PASS** |
| P19-09 Security / Performance Advisor Triage | **完了** |
| P19-10 Release Documentation Consistency Audit | **完了** |
| P19-11 Final Audit / Closure | **完了** |

## Phase19 Integrity Results

重大内部blockerは検出されていない。

- Current Patch record: 1
- FK constraints: validated
- duplicate/blank critical slug groups: 0
- Move without Classic Command: 0
- Move without open Current Frame: 0
- multiple open Current Frame: 0
- Patch validity reversal: 0
- invalid polymorphic Source target: 0
- duplicate entity_source relation: 0
- exact duplicate Alias/Strategy/Guide groups: 0

legacy `entity_sources.entity_type='guide_section'` 16件は全target実在・競合0確認後、`character_guide_section`へ構造正規化した。

Source metadata:
- total 329
- blank title/url/source_type/reliability: 0
- blank publisher: 30（nullable / non-blocking / 推測補完なし）
- normalized duplicate URL candidate: 8 groups（異なるEvidence contextのため自動統合なし）

## Public Data Gate — Final Internal State

### Strategy

Combo / Setup / Sequence / Counter / Training Public RLS:
- `status = published`
- `verification_status = verified`
- matching Source relationあり

### Character Guide

- published + verified

### Recommendation

- published + verified + Source付きTrait Scoreのみ

### Move

Public MoveはApp + RLSで以下を要求する。

1. Move published
2. Classic Commandあり
3. Classic Command official Evidence
4. Move official Source
5. Current Patch Frame
6. Frame verified
7. Current Frame official Source
8. Modern Commandは任意 / 推測しない

307件のCurrent verified Frame候補はMove / Frame / Classic Commandのofficial Evidenceを全件満たすことを確認した。ただしcandidate ≠ published。

### AI Coach

- Source付きEvidenceのみ
- Current Patch取得
- input boundaryあり
- Generation OFF

## Phase19 DB / Code Changes

Supabase migrations:
- `phase19_normalize_guide_section_source_type`
- `phase19_strict_public_move_rls`
- `phase19_require_official_move_and_frame_sources`

Repo migrations:
- `supabase/migrations/20260828_phase19_normalize_guide_section_source_type.sql`
- `supabase/migrations/20260828_phase19_strict_public_move_rls.sql`
- `supabase/migrations/20260828_phase19_require_official_move_and_frame_sources.sql`

App/CI:
- `v2-web/src/lib/public-move-gate.ts` official Evidence gateへ厳格化
- `.github/workflows/phase19-internal-hardening.yml` 追加
- `docs/V2_RELEASE_READINESS.md` Phase19実装と同期

## Phase19 Automated Evidence

- Phase19 Internal Hardening `33147283023`: **success**
- Phase19 Internal Hardening `33147262450`: **success**
- Phase18 Data Gate Acceptance `33147262444`: **success**
- SF6DNA v2 Web Check `33146979482`: **success**
- Supabase Security Advisor after Phase19 DDL: **0 lints**

Phase19 CI初回 `33147088363` はSQL static assertionの空白依存によるtest harness failure。Typecheck/Lint/Policy/Buildは成功しており、assertionを修正後のrunでPASSした。

Performance Advisor:
- `unused_index` INFO
- `multiple_permissive_policies` WARN

実測なしのblind fixは行っていない。

## Phase18/19 Data Snapshot

- playable + published Character: 31
- Move: 2065
- Classic Command: 2065
- Modern Command: 1443
- Modern missing: 622
- Current Patch Frame: 2065
- Current Patch verified Frame: 307
- Combo: 341 / verified 1 / published 0
- Setup: 186 / verified 0 / published 0
- Sequence: 186 / verified 0 / published 0
- Counter: 1122 / verified 0 / published 0
- Training: 1477 / verified 0 / published 0
- Character Guide: 278 / published 0 / verified 0
- Character Trait Score: 372 / published 0 / verified 0
- published Diagnosis: 4
- published Diagnosis Question: 52
- Player: 91 / published 41
- Video: 13 / published 5

件数を理由にstatus/verificationを昇格していない。

## Final Phaseへ移管した人力・外部作業

Final Phaseを **Phase20 `Final Manual / External Acceptance & Production Decision`** とする。

1. Vercel Project / Git import
2. Preview deployment / Preview URL
3. Preview runtime / build / runtime logs
4. real Admin / non-admin session E2E + limited CRUD / cleanup
5. user PC / iPhone / actual device/browser確認
6. Public Preview/network Performance
7. 外部ブラウザ互換性最終確認
8. Production Readiness final decision
9. Production deploy（ユーザー明示許可がある場合のみ）

Phase20はユーザーの明示指示まで開始しない。

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
- Public MoveはCurrent Patch verified Frame + official Move/Frame/Classic Evidenceを要求
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
- ユーザー指示なしのPhase20開始
