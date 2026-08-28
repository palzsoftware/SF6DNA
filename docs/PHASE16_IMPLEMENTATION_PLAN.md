# SF6DNA Phase16 Implementation Plan

最終更新: 2026-08-28 JST

状態: **完了**

## Phase16名称

**Demo Release Candidate / Launch Preparation**

## 目的

Phase15までに構築・検証したv2アプリを、デモ版として公開判定できるRelease Candidateへ整理する。

Phase16は新機能追加Phaseではない。既存のRelease Readinessをもとに、公開候補データ、SEO/metadata、Public UX、安全なempty/error state、Launch運用、最終Release Decisionを監査・整備する。

Phase15の未完了項目（Vercel Preview、real Auth/Admin E2E、actual device、Public network performance）は解消済みとして扱わず、Phase16の最終Release Decisionの依存条件として保持する。

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Release Gate: `docs/V2_RELEASE_READINESS.md`
- Phase15 Evidence: `docs/PHASE15_ACCEPTANCE_EVIDENCE_2026-08-28.md`
- Phase16 Final Audit: `docs/PHASE16_RELEASE_CANDIDATE_AUDIT_2026-08-28.md`

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
- Phase16では新機能を勝手に追加しない。

---

# Phase16 Backlog

## P16-00 Release Candidate Baseline / Scope Freeze

状態: **完了**

- GitHub / CI / Supabase / Phase15 carryoverを固定。
- Demo Release Candidateの対象とNon-goalを明確化。
- Production未公開を確認。

## P16-01 Demo Content Minimum Inventory

状態: **完了**

- Supabase実DBをread-only集計。
- `docs/PHASE16_DEMO_CONTENT_INVENTORY_2026-08-28.md` を作成。
- candidateとpublish承認を分離。
- 自動publish/verifyなし。

## P16-02 SEO / Metadata / Crawlability Release Audit

状態: **完了**

- metadataBase / OGP / Twitter metadata整備。
- title templateによる二重ブランドを解消。
- Auth/Admin noindex。
- robotsの実route整合。
- Public dynamic detail metadata追加。
- Phase16 Release Acceptanceでruntime確認済み。

## P16-03 Public UX / Safe Empty / Error-State Audit

状態: **完了**

- invalid slug 404、Search safe empty、AI Coach入力制約をruntime確認。
- Character Guide Public Gateの漏れを発見し、RLSとapp双方を`published + verified`へ修正。
- Security Advisor 0 lintsを維持。

## P16-04 Demo Launch Operations Package

状態: **完了**

- `docs/PHASE16_DEMO_LAUNCH_RUNBOOK.md` 作成。
- Root Directory、env vars、Preview確認、Production前Gate、stop/rollback条件を固定。
- Production deployment自体は未実施。

## P16-05 Demo Release Decision Package

状態: **完了**

判定: **CONDITIONAL GO**

- Release CandidateとしてPreviewへ進める品質Evidenceは成立。
- ただしPhase15外部依存Acceptanceが未完了のためProduction Release Readyとは判定しない。

残る外部依存:
1. Vercel Project / Preview URL成立
2. Preview runtime/log確認
3. authenticated Admin/non-admin real session E2E + limited CRUD/cleanup
4. Audit Log acceptance requirementの受け入れ先確定
5. user actual PC/device/browser確認
6. Public Preview/network Performance計測

---

# Phase16 Final Evidence

- SF6DNA v2 Web Check `33142510906`: success
- Phase16 Release Acceptance `33142510995`: success
- Phase15 Runtime Smoke `33142510966`: success
- Phase15 Browser Acceptance `33142511001`: success
- Phase15 Lighthouse `33142510926`: success
- Supabase Security Advisor: 0 lints
- Vercel Project: 0
- Preview: none
- Production: none

---

# Phase16 Non-goals / 未実施

- 新診断タイプ
- Replay Coach本実装
- AI Coach生成解禁
- Auth全面再設計
- Audit機能新設
- 新DB Entity追加
- 大量自動publish / verify
- main merge
- Production deploy
- Phase17開始

## 完了判定

P16-00〜P16-05をすべて完了。

**Phase16完了。Demo Release DecisionはConditional Go。**

Phase17へはユーザーの明示指示を受けるまで進まない。
