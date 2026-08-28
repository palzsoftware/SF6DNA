# SF6DNA Phase17 Implementation Plan

最終更新: 2026-08-28 JST

状態: **進行中**

## Phase17名称

**Preview Deployment, Real Environment Acceptance & Production Readiness**

## 目的

Phase16で完成したDemo Release Candidateを、実際のPreview環境・実認証セッション・実ブラウザで検証し、Production公開可否をEvidenceベースで判定する。

Phase17は原則として新機能追加Phaseではない。Release blockerの修正、公開環境設定、実環境Acceptance、最終Production Readiness判定を対象とする。

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Phase16 Final Audit: `docs/PHASE16_RELEASE_CANDIDATE_AUDIT_2026-08-28.md`
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

# Phase17 Backlog

## P17-00 Phase17 Baseline / Scope Freeze

目的:
- Phase16完了時点のGitHub / Supabase / CI / Production blockerを固定する。

完了条件:
- Phase17 plan作成
- Phase16 carryover明示
- main / Production未変更を確認

## P17-01 Vercel Preview Environment

目的:
- `sf6dna-v2` の `v2-web` をVercel Preview環境で動作可能にする。

完了条件:
- Vercel Project成立
- Root Directory `v2-web`
- Preview環境変数設定
- Preview deployment成功
- Preview URL取得
- Production deploymentではないことを確認

## P17-02 Preview Runtime Acceptance

確認対象:
- Top
- Character list/detail
- Player list/detail
- Video list/detail
- Search
- Diagnosis
- AI Coach Retrieval
- robots / sitemap / metadata
- safe empty / 404
- draft/reviewed/unverified leakage
- Vercel runtime logs

## P17-03 Real Auth / Admin E2E

確認対象:
- unauthenticated Admin block
- non-admin write block
- admin access
- limited Create/Edit
- save/re-fetch
- cleanup
- public gate unaffected
- Audit Log要件の扱い

実データを不必要に変更しない。

## P17-04 Real Device / Browser Acceptance

確認対象:
- user actual PC/browser
- responsive layout
- keyboard/focus
- overflow/overlap
- form/button reachability
- perceived performance

自動ブラウザEvidenceとactual-device Evidenceを分離する。

## P17-05 Preview Performance / Runtime Logs

確認対象:
- Lighthouse or equivalent on Preview
- Vercel runtime errors/logs
- major 4xx/5xx
- response behavior
- Supabase-backed route performance

## P17-06 Production Readiness Final Audit

判定:
- Release Ready
- Conditional Go
- No-Go

必須条件:
- P17-01〜05のEvidence
- Security重大blocker 0
- Release-blocking runtime/UX error 0
- Public Gate維持

Production deployment自体はユーザー明示許可まで実行しない。

## P17-07 Phase17 Closure / Handoff

- Phase17 Final Audit作成
- PROJECT_STATUS更新
- 実施変更 / commit / DB migration / CI / runtime / device evidence記録
- 未完了・外部依存・追加提案を明記
- Phase18へはユーザー明示指示まで進まない

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
