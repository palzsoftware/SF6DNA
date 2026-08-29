# SF6DNA Phase23 Final Manual / External Acceptance Plan

最終更新: 2026-08-29 JST
状態: **全safe non-human work完了 / Final Manual Stage待ち**

## Phase23名称

**Final Manual / External Acceptance & Production Decision**

## Current automated baseline

- Application implementation: `3c702ca0dad54ab2f73a2a940d1cc17e6511d3f1`
- DB hardening follow-up: `5c46de5f0a81e4c9996b5ff30f7896aa7cdf651e`
- CI invariant follow-up: `4c3dedad21fff648a2c887a7a66ba9b68bb05b23`
- Current Patch: `2026.08.03`
- `main`: 未変更
- v2 Production: 未公開

このbaselineはFinal RCではない。Publication/Auth/人物確認などmanual変更後に必要なら再固定する。

## Completed before manual stage

- UI / copy / responsive / SEO / metadata最終監査
- Character / Player画像機械監査と安全な17 Player fallback
- Next.js Image Optimization
- Vercel Preview / build / runtime監査
- CAPCOM日本語Frame Snapshot 31 / 31 PASS
- Public Move / Strategy Gate監査
- Move / Command / Frame official Evidence Gate整合
- Move Admin publish順序hardening
- Strategy 5種 publish順序hardening
- Diagnosis completeness Admin/RLS Gate
- Character Trait Score Source/Admin/RLS Gate
- Current Patch atomic switch RPC
- RPC Security INVOKER化
- relation RLS/実データ監査
- Security Advisor 0 lints
- Application 8 CI Gate PASS
- current machine-ready Move 701件の再集計

## P23-00 Automated Baseline — COMPLETE

Application head `3c702ca0...` の8 workflowは全PASS:

- Phase16 Release Acceptance `33240366996`
- Phase15 Runtime Smoke `33240366991`
- Phase15 Browser Acceptance `33240367023`
- Phase15 Lighthouse Audit `33240366981`
- Phase19 Internal Hardening `33240367007`
- Phase20 Verified Content Acceptance `33240367003`
- SF6DNA v2 Web Check `33240366993`
- Phase18 Data Gate Acceptance `33240367041`

DB follow-up `5c46de5f...` のPhase19もPASS `33240529766`。

## P23-01 Vercel Preview — COMPLETE for automated stage

Latest DB follow-up Preview:

- Deployment: `dpl_8sdQJbKXF3EYmGgeQbsRMnk1jM74`
- READY
- Previewのみ

CI follow-up Preview:

- Deployment: `dpl_9iFYnQTxXuCUyJ3cJmTGxbMSm6Rt`
- READY
- Build error 0
- runtime error / fatal 0

Production deployは未実施。

## P23-02 Data / Security — COMPLETE for automated stage

Current public:

- Character: 31
- Diagnosis: 4
- Move: 0
- Combo / Setup / Sequence / Counter / Training: 0
- Character Trait Score: 0
- `auth.users`: 0

Current Move draft:

- total 2052
- strict machine-ready 701
- not ready 1351
- ready Character 12 / 31
- Modernあり / なし: 662 / 39

701件の現在DB内訳:

- Dee Jay 105
- Jamie 93
- Blanka 91
- Dhalsim 88
- Kimberly 76
- E. Honda 70
- Guile 70
- Chun-Li 68
- Yasmine 19
- Mai Shiranui 10
- C. Viper 7
- Elena 4

Machine Gate PASSはPublication approvalではない。

## P23-03 Content Publication Approval — MANUAL HOLD

人が初回公開範囲を決定する。

- Safe minimal release（Move/Strategyは未承認ならempty state）
- または701候補から内容を個別確認し承認したMoveのみpublish

件数目的のbulk publishは禁止。

## P23-04 Real Auth / Admin E2E — MANUAL HOLD

現在`auth.users=0`。正式な実またはテストアカウントを通常Authフローから準備して実ブラウザで確認する。

1. unauthenticated block
2. non-admin write block
3. admin access
4. limited draft Create
5. Edit / save / re-fetch
6. Evidence attachment
7. incomplete publish rejection
8. approved test Publish success
9. public read
10. Archive
11. cleanup
12. Public Gate unaffected

禁止:

- `auth.users`への直接SQL投入
- static testを実ログインEvidence扱い

## P23-05 Player remaining-image identity check — MANUAL HOLD

- published Player: 41
- safety-confirmed fallback: 17
- DB `image_url`: 0 / 41

残りは人物同定が必要な場合だけmanual確認する。ファイル名類似で自動接続しない。

## P23-06 Final RC Freeze

P23-03〜05でDB / code / assetsが変わった場合:

1. 必要なTypecheck / Lint / Policy / Build / Browser / Data Gateを再実行
2. Preview READY確認
3. Build/runtime error 0確認
4. Final RC HEAD固定

変更がなければ現在Automated baselineをFinal RC候補として再評価する。

## P23-07 Actual Device Acceptance — 最後に実施

Final RC固定後のみ:

1. PC actual browser
2. iPhone actual device

確認:

- responsive / horizontal overflow / overlap
- keyboard / focus
- form/button reachability
- navigation / back behavior
- perceived performance
- localStorage系個人機能

正本チェックリスト:
`docs/PHASE23_REAL_DEVICE_TEST_CHECKLIST_2026-08-29.md`

## P23-08 Production Readiness

manual Acceptance完了後に判定:

- Release Ready
- Conditional Go
- No-Go

## P23-09 Production Deployment

ユーザーが明示的に許可した場合のみ実行する。許可がなければReadiness判定までで停止する。

## External evidence

CAPCOM Official Frame Snapshot:

- Run `33228209058`
- 31 / 31 Character pages HTTP 200
- Artifact ID `9707625771`

## Exit Criteria

- safe non-human work: 完了
- Publication approval: manual
- Real Auth/Admin E2E: manual
- 必要なPlayer人物確認: manual
- Final RC固定
- PC / iPhone actual-device Acceptance
- Production Readiness判定
- Production deployは明示許可時のみ

## 絶対ルール

- `main`変更禁止
- Production deploy禁止（明示許可まで）
- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- Machine Gateだけでpublishしない
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- bulk verify / publish禁止
- actual-device Evidenceをemulationで代用しない
- manual Auth Evidenceをstatic testで代用しない
