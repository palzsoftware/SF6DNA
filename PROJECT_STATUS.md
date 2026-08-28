# PROJECT_STATUS.md

最終更新: 2026-08-28 JST

## SF6DNA v2 現在状態

SF6DNA v2は、Phase13のCharacter Content Verification & Expansionを完了し、Phase14のApplication Integration / Public Data Gating / Demo Release Readinessも完了した。

現在は**Phase15準備完了 / 未着手**。

Phase15の実作業はユーザーから開始の明示指示を受けてから行う。

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Phase14 Final Audit: `docs/PHASE14_FINAL_AUDIT_2026-08-28.md`
- Phase15 Plan: `docs/PHASE15_IMPLEMENTATION_PLAN.md`
- Release Gate: `docs/V2_RELEASE_READINESS.md`
- Completion Dashboard: `docs/PROJECT_COMPLETION_DASHBOARD.md`

## v2 Phase管理

| Phase | 状態 |
|---|---|
| Phase1〜12 | 完了または各Phase定義どおり終了 |
| Phase13 | **完了** |
| Phase14 | **完了** |
| Phase15 | **準備完了 / 未着手** |

Phase14は19タスク中14件をPhase14内で完了し、Preview/実環境依存の5件をユーザー承認のうえPhase15へ正式に再分類した。

- P0-06 → P15-00 Preview Environment / Deployment
- P0-07 → P15-01 Preview Runtime / Public Demo Gate Smoke
- P1-06 → P15-02 Auth / Admin E2E
- P2-03 → P15-03 Performance Measurement / Advisor Review
- P2-04 runtime部分 → P15-04 Device / Responsive / Accessibility Runtime Verification

**再分類 ≠ 検証済み**。

## GitHub / CI

Phase14終了監査開始時HEAD:
- `583bab045d112394a85fff757efa4218946a5736`

最新のsource code変更を含むcommit:
- `2fe0b90c6ff2e642f3028df0a5edc9ccaeb5b60e`

GitHub Actions run `33130148956`:
- Typecheck: success
- Lint: success
- Tests: **27 / 27 success**
- Build: success
- check: success

以降のPhase14終了処理はdocumentationのみ。

## Supabase実DB

Phase14終了時Read-only監査:
- public base tables: **38**
- RLS: **38 / 38 enabled**
- playable + published Character: **31**
- published Move: **0**
- verified Frame: **307**
- published Diagnosis: **4**
- published Diagnosis Question: **52**
- Current Patch: **2026.08.03**

Phase14 Public Gate migration適用確認:
- `phase14_public_verification_gate`
- `phase14_public_command_source_gate`

Security Advisor:
- lint **0**

Performance Advisor:
- `unused_index` INFO
- `multiple_permissive_policies` WARN

Performance警告はPhase15で実測後に評価し、未計測のままindex/policyを変更しない。

## Public Data Policy

必ず維持する。

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- Modern Commandを推測補完しない
- SourceなしFrame値を確定しない
- Release件数目的で自動publishしない
- Strategy Public Gateは`published + verified`
- Recommendationは`published + verified + Source`付きTrait Scoreのみ
- AI CoachはSource付きEvidence + Current Patchを要求
- AI Coach GenerationはOFF

## Release Readiness

Phase14完了はRelease Readyを意味しない。

現時点:
- Vercel Project: **0**
- Vercel Preview: 未成立
- Production deployment: 未実施
- Authenticated Admin E2E: 未実施
- Actual device確認: 未実施
- Preview Performance計測: 未実施
- Release Ready Move / Strategy / Recommendation: 0

これらはPhase15以降でEvidenceを取得する。

## Phase15開始時の最初の順序

ユーザーからPhase15開始指示を受けたら、`docs/PHASE15_IMPLEMENTATION_PLAN.md`を読み、以下から開始する。

1. P15-00 Preview環境成立
2. P15-01 Preview Runtime / Public Gate Smoke
3. P15-02 Auth / Admin E2E
4. P15-04 Responsive / Accessibility Runtime Verification
5. P15-03 Performance実測 / Advisor Review

ユーザーが現在実機確認できない場合でも、実機確認を検証済みにせず後段へ残し、可能なPreview/static/read-only監査を先に進める。

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
- Phase15要件確定前の新機能追加

新要素が必要な場合は実装せず、提案としてユーザーへ報告する。
