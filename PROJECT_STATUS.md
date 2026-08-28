# PROJECT_STATUS.md

最終更新: 2026-08-28 JST

## SF6DNA v2 現在状態

SF6DNA v2はPhase13、Phase14、Phase16を完了し、2026-08-28のユーザー明示指示により**Phase17を開始**した。

Phase16のDemo Release Decisionは **CONDITIONAL GO**。

Phase17正式名称:
**Preview Deployment, Real Environment Acceptance & Production Readiness**

Phase17では、Phase16までに完成したDemo Release Candidateを実Preview環境・実認証・実ブラウザで検証し、Production公開可否をEvidenceベースで判定する。

現在Phase17は、Vercel connectorのDeploy入力スキーマ不整合により **BLOCKED / 未完了**。アプリコード由来のDeploy failureではない。

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Phase14 Final Audit: `docs/PHASE14_FINAL_AUDIT_2026-08-28.md`
- Phase15 Evidence: `docs/PHASE15_ACCEPTANCE_EVIDENCE_2026-08-28.md`
- Phase16 Final Audit: `docs/PHASE16_RELEASE_CANDIDATE_AUDIT_2026-08-28.md`
- Phase17 Plan: `docs/PHASE17_IMPLEMENTATION_PLAN.md`
- Phase17 Evidence: `docs/PHASE17_ACCEPTANCE_EVIDENCE_2026-08-28.md`
- Release Gate: `docs/V2_RELEASE_READINESS.md`

## v2 Phase管理

| Phase | 状態 |
|---|---|
| Phase1〜12 | 完了または各Phase定義どおり終了 |
| Phase13 | **完了** |
| Phase14 | **完了** |
| Phase15 | **外部依存残件あり / Phase17で回収** |
| Phase16 | **完了 / Conditional Go** |
| Phase17 | **BLOCKED / 未完了** |

## Phase17 Backlog

| Task | 状態 |
|---|---|
| P17-00 Phase17 Baseline / Scope Freeze | **完了** |
| P17-01 Vercel Preview Environment | **BLOCKED** |
| P17-02 Preview Runtime Acceptance | P17-01待ち |
| P17-03 Real Auth / Admin E2E | 未完了 |
| P17-04 Real Device / Browser Acceptance | 未完了 |
| P17-05 Preview Performance / Runtime Logs | P17-01待ち |
| P17-06 Production Readiness Final Audit | 未判定 |
| P17-07 Phase17 Closure / Handoff | 未完了 |

## Phase17 blocker evidence

2026-08-28 JST:
- Vercel Connected Team Project: **0**
- Preview deployment: **none**
- Production deployment: **none**
- 接続済み `deploy_to_vercel` 実行時、内部では `target / name / files` を必須要求するが、公開呼び出しスキーマは引数0個であり値を渡せない。
- `target=production` の推測実行はしていない。
- 誤Deployは発生していない。

詳細: `docs/PHASE17_ACCEPTANCE_EVIDENCE_2026-08-28.md`

## Phase16 latest automated evidence

- SF6DNA v2 Web Check `33142510906`: **success**
- Phase16 Release Acceptance `33142510995`: **success**
- Phase15 Runtime Smoke `33142510966`: **success**
- Phase15 Browser Acceptance `33142511001`: **success**
- Phase15 Lighthouse `33142510926`: **success**
- Supabase Security Advisor: **0 lints**

## Production blockers

1. Vercel Project / Preview URL成立
2. Preview runtime/log確認
3. authenticated Admin/non-admin E2E + limited CRUD/cleanup
4. Audit Log acceptance requirementの扱い確定
5. user actual PC/device/browser確認
6. Public Preview/network Performance確認

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
- Phase17での未承認新機能追加
- ユーザー指示なしのPhase18移行
