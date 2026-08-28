# SF6DNA Phase16 Implementation Plan

最終更新: 2026-08-28 JST

状態: **進行中**

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

目的:
- Phase16開始時点のGitHub / CI / Supabase / Phase15残件を固定する。
- デモ版に含める既存機能と含めない機能を明確にする。

完了条件:
- Phase16 baseline文書化
- Phase15 carryoverを未完了のまま明示
- Production未公開を確認

## P16-01 Demo Content Minimum Inventory

目的:
- デモ版で実際にPublic表示可能なコンテンツ量を機械的に把握する。

確認対象:
- Character
- Move / Frame / Command
- Combo / Setup / Sequence / Counter / Training
- Player / Video
- Diagnosis
- Character Trait Score / Recommendation

ルール:
- candidateとpublish承認を区別する。
- 件数確保のための自動publishはしない。
- verified / Source / Current Patch条件を維持する。

## P16-02 SEO / Metadata / Crawlability Release Audit

確認対象:
- root metadata
- title / description
- canonical / metadataBase
- robots
- sitemap
- OGP / Twitter metadata
- Dynamic detail metadata
- noindex対象のAdmin/Auth
- broken metadata URLやProduction domain hard-codeの有無

安全に修正可能な既存実装上の欠陥だけ修正する。

## P16-03 Public UX / Safe Empty / Error-State Audit

確認対象:
- Public list/detail
- 0件時表示
- 不正slug/404
- Supabase/API失敗時fallback
- draft/reviewed/unverified leakage
- Search 0件
- Diagnosisデータ不足
- AI Coach Evidence不足

新しいコンテンツや機能を作らず、既存仕様の安全性をRelease Candidateとして確認する。

## P16-04 Demo Launch Operations Package

目的:
- Vercel Preview成立後、ユーザーが少ない操作でデモ公開判定できる手順を作る。

含める:
- Root Directory `v2-web`
- 必要な公開環境変数一覧
- Preview verification checklist
- Production deploy前チェック
- rollback / stop conditions
- main merge禁止状態の明示

Production deploymentそのものはPhase16で自動実行しない。

## P16-05 Demo Release Decision Package

目的:
- Release Ready / Conditional Go / No-GoをEvidenceで判定する。

判定に必須:
- Phase16 P16-00〜04完了
- Phase15残件の結果
- Public Gate維持
- Security重大blocker 0
- Release blocking UX/runtime error 0

Phase15外部依存が未解消の場合、Phase16の自動作業は完了してもDemo Release DecisionをPASSにしない。

---

# Phase16 Non-goals

- 新診断タイプ
- Replay Coach本実装
- AI Coach生成解禁
- Auth全面再設計
- Audit機能新設
- 新DB Entity追加
- 大量自動publish / verify
- main merge
- Production deploy

必要性を発見した場合は、実装せず提案/Release blockerとして記録する。
