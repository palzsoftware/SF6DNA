# PROJECT_STATUS.md

最終更新: 2026-08-28 JST

## SF6DNA v2 現在状態

SF6DNA v2は、Phase13のCharacter Content Verification & Expansionを完了し、Phase14のApplication Integration / Public Data Gating / Demo Release Readinessも完了した。

現在は**Phase15進行中**。

2026-08-28、ユーザーの明示指示によりPhase15を開始した。Phase14はやり直さず、`docs/PHASE15_IMPLEMENTATION_PLAN.md` に従ってAcceptance Evidence回収を進める。

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
- Phase15 PC Device Test: `docs/PHASE15_PC_DEVICE_TEST_CHECKLIST.md`

## v2 Phase管理

| Phase | 状態 |
|---|---|
| Phase1〜12 | 完了または各Phase定義どおり終了 |
| Phase13 | **完了** |
| Phase14 | **完了** |
| Phase15 | **進行中** |

Phase14は19タスク中14件をPhase14内で完了し、Preview/実環境依存の5件をユーザー承認のうえPhase15へ正式に再分類した。

- P0-06 → P15-00 Preview Environment / Deployment
- P0-07 → P15-01 Preview Runtime / Public Demo Gate Smoke
- P1-06 → P15-02 Auth / Admin E2E
- P2-03 → P15-03 Performance Measurement / Advisor Review
- P2-04 runtime部分 → P15-04 Device / Responsive / Accessibility Runtime Verification

**再分類 ≠ 検証済み**。

## Phase15進捗

### P15-00 Preview Environment / Deployment

状態: **外部ブロック / 未完了**

- 接続Vercel TeamのProject: 0件
- Vercel Preview: 未成立
- Production deployment: 未実施
- 接続ツール上で、新規ProjectをGitHub repoへ紐付け、Preview targetを安全に明示して作成する操作が利用できないため、Production誤Deployを避けて停止
- Production deployで回避しない

### P15-01 Preview Runtime / Public Demo Gate Smoke

状態: **Preview待ち**

- Runtime smokeはP15-00完了後に実施
- Preview不要のPublic Gate静的監査・既存CI Evidenceは維持

### P15-02 Auth / Admin E2E

状態: **安全なE2E環境待ち**

- 実セッションCRUDはPreviewまたは同等の安全な環境成立後に実施
- 本番攻略データをテスト目的で不要に変更しない

### P15-04 Device / Responsive / Accessibility Runtime Verification

状態: **PC実機確認待ち**

- ユーザーは帰宅後、自宅PCで実機テストを実施予定
- Phase14のStatic responsive/accessibility reviewは完了済み
- PC実機結果は `docs/PHASE15_PC_DEVICE_TEST_CHECKLIST.md` のAcceptance Evidenceへ反映する

### P15-03 Performance Measurement / Advisor Review

状態: **部分監査実施 / 実測待ち**

2026-08-28 read-only再確認:
- Security Advisor: lint 0
- Performance Advisor: `unused_index` INFO / `multiple_permissive_policies` WARN継続
- Lighthouse / runtime response / mobile perceived performanceはPreview未成立のため未計測
- index削除やRLS policy統合は実測前に行わない

## GitHub / CI

Phase14終了時の最新source code変更commit:
- `2fe0b90c6ff2e642f3028df0a5edc9ccaeb5b60e`

GitHub Actions run `33130148956`:
- Typecheck: success
- Lint: success
- Tests: **27 / 27 success**
- Build: success
- check: success

Phase15開始時点のbranch HEADはPhase14終了文書commit `f2b2f8916d5e3fce9aeeff0788d240b92bae537a` から開始した。

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

2026-08-28 Phase15開始後Advisor再確認:
- Security Advisor: lint **0**
- Performance Advisor: `unused_index` INFO / `multiple_permissive_policies` WARN

Performance警告は実測後に評価し、未計測のままindex/policyを変更しない。

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

Phase15進行中だがRelease Readyではない。

現時点:
- Vercel Project: **0**
- Vercel Preview: 未成立
- Production deployment: 未実施
- Authenticated Admin E2E: 未実施
- Actual PC device確認: 帰宅後実施予定 / 未検証
- Preview Performance計測: 未実施
- Release Ready Move / Strategy / Recommendation: 0

これらを推測・自動昇格・Production deployで解消しない。

## Phase15実施順

1. **P15-00** Preview環境成立
2. **P15-01** Preview Runtime / Public Gate Smoke
3. **P15-02** Auth / Admin E2E
4. **P15-04** Responsive / Accessibility Runtime Verification
5. **P15-03** Performance実測 / Advisor Review
6. Acceptance Evidenceをまとめる

P15-00が外部要因でブロック中でも、Preview不要の静的監査・DB read-only監査・テスト準備は進める。

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
- ユーザー指示なしのPhase16移行

新要素が必要な場合は実装せず、提案としてユーザーへ報告する。
