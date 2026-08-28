# PROJECT_STATUS.md

最終更新: 2026-08-28 JST

## SF6DNA v2 現在状態

SF6DNA v2はPhase13、Phase14を完了し、Phase15のAcceptance回収を進めたうえで、2026-08-28のユーザー明示指示により**Phase16を開始**した。

Phase15はVercel Preview / real Auth/Admin session / actual device / Public network performanceという外部依存項目を残しており、完了扱いにはしない。Phase16ではこれらを消去・推測完了せず、Demo Release Decisionの依存条件として保持する。

Phase16正式名称:
**Demo Release Candidate / Launch Preparation**

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Phase14 Final Audit: `docs/PHASE14_FINAL_AUDIT_2026-08-28.md`
- Phase15 Plan: `docs/PHASE15_IMPLEMENTATION_PLAN.md`
- Phase15 Evidence: `docs/PHASE15_ACCEPTANCE_EVIDENCE_2026-08-28.md`
- Phase16 Plan: `docs/PHASE16_IMPLEMENTATION_PLAN.md`
- Release Gate: `docs/V2_RELEASE_READINESS.md`
- Phase15 PC Device Test: `docs/PHASE15_PC_DEVICE_TEST_CHECKLIST.md`

## v2 Phase管理

| Phase | 状態 |
|---|---|
| Phase1〜12 | 完了または各Phase定義どおり終了 |
| Phase13 | **完了** |
| Phase14 | **完了** |
| Phase15 | **外部依存残件あり / Evidence回収継続** |
| Phase16 | **進行中** |

## Phase15 carryover

未完了のままPhase16 Release Decisionへ持ち越す:
1. Vercel Project / Preview URL成立
2. Preview runtime/log確認
3. Authenticated Admin/non-admin E2E + limited CRUD/cleanup
4. Audit Log受け入れ先の要件確定
5. ユーザーactual device/browser確認
6. Public Preview/network Performance確認

Phase15で自動確認済み:
- Runtime Smoke success
- Auth return-path fix + CI success
- unauthenticated Admin redirect runtime success
- Lighthouse mobile: Top Performance 99 / Accessibility 100
- Lighthouse mobile: Character Performance 98 / Accessibility 100
- Chromium 390x844 major route overflow check success
- Search interaction success
- Character Fit Diagnosis completion success
- Desktop Skip Link / visible focus success
- Security Advisor lint 0

## Phase16

計画: `docs/PHASE16_IMPLEMENTATION_PLAN.md`

### P16-00 Release Candidate Baseline / Scope Freeze
状態: **進行中**

### P16-01 Demo Content Minimum Inventory
状態: **未完了**

### P16-02 SEO / Metadata / Crawlability Release Audit
状態: **未完了**

### P16-03 Public UX / Safe Empty / Error-State Audit
状態: **未完了**

### P16-04 Demo Launch Operations Package
状態: **未完了**

### P16-05 Demo Release Decision Package
状態: **未完了**

## Supabase実DB baseline

Phase15開始時点までのRead-only監査:
- public base tables: 38
- RLS: 38 / 38 enabled
- playable + published Character: 31
- published Move: 0
- verified Frame: 307
- published Diagnosis: 4
- published Diagnosis Question: 52
- Current Patch: `2026.08.03`
- Security Advisor: lint 0
- Performance Advisor: `unused_index` INFO / `multiple_permissive_policies` WARN

Phase16 P16-01で最新のDemo Content Inventoryを再取得する。

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
- Phase16での未承認新機能追加
- ユーザー指示なしのPhase17移行
