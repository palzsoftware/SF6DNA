# PROJECT_STATUS.md

最終更新: 2026-08-28 JST

## SF6DNA v2 現在状態

SF6DNA v2はPhase13、Phase14を完了し、Phase15のAcceptance回収を進めた後、Phase16 `Demo Release Candidate / Launch Preparation` を完了した。

現在のDemo Release Decisionは **CONDITIONAL GO**。

現行 `sf6dna-v2` は、CI / Runtime / Browser / Lighthouse / Release Acceptance / Supabase Security監査を通過し、デモ版Release CandidateとしてPreviewへ進める状態にある。

ただしPhase15のVercel Preview、real Auth/Admin E2E、actual device、Public network performance等の外部依存Acceptanceは未完了である。したがってProduction Release Readyとは判定しない。

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Phase14 Final Audit: `docs/PHASE14_FINAL_AUDIT_2026-08-28.md`
- Phase15 Evidence: `docs/PHASE15_ACCEPTANCE_EVIDENCE_2026-08-28.md`
- Phase16 Plan: `docs/PHASE16_IMPLEMENTATION_PLAN.md`
- Phase16 Content Inventory: `docs/PHASE16_DEMO_CONTENT_INVENTORY_2026-08-28.md`
- Phase16 Launch Runbook: `docs/PHASE16_DEMO_LAUNCH_RUNBOOK.md`
- Phase16 Final Audit: `docs/PHASE16_RELEASE_CANDIDATE_AUDIT_2026-08-28.md`
- Release Gate: `docs/V2_RELEASE_READINESS.md`
- Phase15 PC Device Test: `docs/PHASE15_PC_DEVICE_TEST_CHECKLIST.md`

## v2 Phase管理

| Phase | 状態 |
|---|---|
| Phase1〜12 | 完了または各Phase定義どおり終了 |
| Phase13 | **完了** |
| Phase14 | **完了** |
| Phase15 | **外部依存残件あり / Acceptance継続** |
| Phase16 | **完了 / Conditional Go** |
| Phase17 | **未開始** |

## Phase16完了状況

| Task | 状態 |
|---|---|
| P16-00 Release Candidate Baseline / Scope Freeze | 完了 |
| P16-01 Demo Content Minimum Inventory | 完了 |
| P16-02 SEO / Metadata / Crawlability Release Audit | 完了 |
| P16-03 Public UX / Safe Empty / Error-State Audit | 完了 |
| P16-04 Demo Launch Operations Package | 完了 |
| P16-05 Demo Release Decision Package | 完了 / Conditional Go |

## Phase16主要改善

- root metadataBaseをPreview/実URLに追従できる設計へ変更
- OGP / Twitter metadata整備
- Public page titleの二重 `| SF6DNA` を解消
- Auth/Adminをnoindex/nofollow/noarchive
- robotsを実routeへ整合
- Public dynamic detail metadata追加
- Search no-result / invalid slug / AI Coach invalid inputのruntime acceptance追加
- Character Guide Public Gateを `published + verified` に強化
- Character Guide GateをRLSとapp query双方で防御

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

## Latest automated evidence

- SF6DNA v2 Web Check `33142510906`: **success**
  - Typecheck success
  - Lint success
  - Policy tests success
  - Build success
- Phase16 Release Acceptance `33142510995`: **success**
- Phase15 Runtime Smoke `33142510966`: **success**
- Phase15 Browser Acceptance `33142511001`: **success**
- Phase15 Lighthouse `33142510926`: **success**
- Supabase Security Advisor: **0 lints**

## Phase15 carryover / Production blockers

未完了:
1. Vercel Project / Preview URL成立
2. Preview runtime/log確認
3. authenticated Admin/non-admin E2E + limited CRUD/cleanup
4. Audit Log acceptance requirementの受け入れ先確定
5. user actual PC/device/browser確認
6. Public Preview/network Performance確認

Vercel最終確認:
- Connected Team Project: **0**
- Preview deployment: **none**
- Production deployment: **none**

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
- ユーザー指示なしのPhase17移行

## 次の状態

Phase16は完了した。
Phase17はユーザーの明示指示を受けるまで開始しない。
