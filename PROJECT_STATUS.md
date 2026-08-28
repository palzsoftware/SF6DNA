# PROJECT_STATUS.md

最終更新: 2026-08-28 JST

## SF6DNA v2 現在状態

SF6DNA v2はPhase13、Phase14を完了し、現在は**Phase15進行中**。

2026-08-28、ユーザーの明示指示によりPhase15を開始した。Phase14はやり直さず、`docs/PHASE15_IMPLEMENTATION_PLAN.md` に従ってAcceptance Evidence回収を進めている。

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
- Release Gate: `docs/V2_RELEASE_READINESS.md`
- Phase15 PC Device Test: `docs/PHASE15_PC_DEVICE_TEST_CHECKLIST.md`

## v2 Phase管理

| Phase | 状態 |
|---|---|
| Phase1〜12 | 完了または各Phase定義どおり終了 |
| Phase13 | **完了** |
| Phase14 | **完了** |
| Phase15 | **進行中** |

Phase14からPhase15へ再分類した5件:
- P0-06 → P15-00 Preview Environment / Deployment
- P0-07 → P15-01 Preview Runtime / Public Demo Gate Smoke
- P1-06 → P15-02 Auth / Admin E2E
- P2-03 → P15-03 Performance Measurement / Advisor Review
- P2-04 runtime部分 → P15-04 Device / Responsive / Accessibility Runtime Verification

**再分類 ≠ 検証済み**。

## Phase15進捗

### P15-00 Preview Environment / Deployment

状態: **外部ツール制約 / 未完了**

- Connected Vercel Team Project: 0
- Vercel Preview: 未成立
- Preview URL: 未発行
- Production deployment: 未実施
- 現在公開されているVercel deploy connectorはtarget/name/files/rootDirectoryを明示できず、SF6DNAの`v2-web`を安全に指定できない
- Production deployで回避しない

### P15-01 Runtime / Public Demo Gate Smoke

状態: **CI Runtime確認済み / Vercel Preview再確認待ち**

GitHub Actions:
- run `33140999720`: success
- run `33141087038`: success

確認済み:
- 現行`sf6dna-v2` production build成功
- 実Supabase public接続成功
- Top / Character / Player / Video / Search / Diagnosis / Coach / Auth / Adminの主要route HTTP 200
- AI Coach: Current Patch `2026.08.03`
- AI Coach: `generationEnabled=false`
- unauthenticated `/admin/characters`: HTTP 307 → `/auth?next=/admin`

残り:
- Vercel Preview上の同等smoke
- Vercel runtime logs

### P15-02 Auth / Admin E2E

状態: **静的 + unauth Runtime + RLS確認済み / real session E2E待ち**

確認済み:
- Admin return-path不整合をPhase15で修正
- auth修正CI run `33138407354`: Typecheck / Lint / Policy tests / Build success
- unauthenticated Admin subrouteのruntime block成功
- major Admin write policyは`private.is_admin()`を要求
- `private.is_admin()`は`auth.uid()` + `profiles.role='admin'`を確認

残り:
- authenticated non-admin write拒否
- admin login / route access
- limited Create/Edit
- save/re-fetch
- cleanup
- Public Gate維持
- Audit Log

Audit Log調査:
- `public` / `private`にaudit tableを確認できず
- audit triggerも確認できず
- 新規Audit機能はユーザー承認なく追加しない

### P15-04 Device / Responsive / Accessibility Runtime Verification

状態: **Static + browser emulation確認済み / actual PC待ち**

Lighthouse run `33141100694`: success
- Top: Performance 99 / Accessibility 100 / Best Practices 96 / SEO 100
- Character detail: Performance 98 / Accessibility 100 / Best Practices 96 / SEO 100

Browser Acceptance run `33141327374`: success
- Chromium 390x844で主要画面horizontal overflowなし
- Search操作成功
- Character Fit Diagnosis完走→Result到達
- Desktop 1440x900でSkip Linkが最初のTab target
- visible focus確認

残り:
- ユーザー自宅PC actual browser確認
- actual device visual/scroll/back等の最終確認

### P15-03 Performance Measurement / Advisor Review

状態: **CI実測・Advisor監査済み / Public Preview計測待ち**

確認済み:
- Lighthouse実測良好
- warm local runtime sampleで重大遅延なし
- Security Advisor: lint 0
- Performance Advisor: `unused_index` INFO / `multiple_permissive_policies` WARN
- `pg_stat_user_indexes` read-only baseline確認

判断:
- Evidence上、緊急Performance修正なし
- index削除やRLS policy統合はblind fixしない
- Public Preview/network performanceはP15-00待ち

## Phase15で追加したCI Acceptance

- `.github/workflows/phase15-runtime-smoke.yml`
- `.github/workflows/phase15-lighthouse.yml`
- `.github/workflows/phase15-browser-e2e.yml`

Browser E2E初回run `33141238840`はPlaywright module resolutionというCI設定不備でfailure。アプリ不具合ではなく、CI runnerだけにPlaywrightを一時導入する方式へ修正し、run `33141327374`でsuccessを確認した。

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

残るAcceptance:
1. Vercel Project / Preview URL成立
2. Preview runtime/log確認
3. Authenticated Admin/non-admin E2E + limited CRUD/cleanup
4. Audit Log受け入れ先の要件確定
5. ユーザーPC actual device/browser確認
6. Public Preview/network Performance確認

これらを推測・自動昇格・Production deployで解消しない。

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
- ユーザー指示なしのPhase16移行
