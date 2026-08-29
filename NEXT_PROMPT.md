# SF6DNA 次回開始指示 — Phase23 Final Manual Stage

最終更新: 2026-08-29 JST

SF6DNAを**safe non-human work完了 / Final Manual Stage待ち**状態から継続してください。Phase23を最初からやり直さないでください。

## 現在位置

- Phase1〜22: 完了
- Phase23: Final Manual Stage待ち
- Non-human Pre-device / Auth-Admin hardening: **完了**
- PC / iPhone実機テスト: HOLD
- Production Readiness: 未判定
- Production deploy: 未実施

ユーザーは、人の手が必要な作業を最後に回すよう指示している。実機・実ログイン・人物同定・Publication approvalを推測完了扱いしない。

## 正本

GitHub:
- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`変更禁止
- main baseline: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`

Supabase:
- Project: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- 実DBを正本とする

Vercel:
- Project: `sf-6-dna`
- Project ID: `prj_UwgkJ3pXqGBWhaH6qn6pY8TTZMpR`
- `sf6dna-v2` Previewのみ使用
- Production deploy禁止

Patch:
- Current Patch: `2026.08.03`

## Current automated baseline

- Application implementation: `3c702ca0dad54ab2f73a2a940d1cc17e6511d3f1`
- DB hardening follow-up: `5c46de5f0a81e4c9996b5ff30f7896aa7cdf651e`
- CI invariant follow-up: `4c3dedad21fff648a2c887a7a66ba9b68bb05b23`

Application headの8 workflowは全PASS:

- Phase16 Release Acceptance `33240366996`
- Phase15 Runtime Smoke `33240366991`
- Phase15 Browser Acceptance `33240367023`
- Phase15 Lighthouse Audit `33240366981`
- Phase19 Internal Hardening `33240367007`
- Phase20 Verified Content Acceptance `33240367003`
- SF6DNA v2 Web Check `33240366993`
- Phase18 Data Gate Acceptance `33240367041`

DB follow-upのPhase19もPASS `33240529766`。

Latest DB follow-up Preview:

- Deployment `dpl_8sdQJbKXF3EYmGgeQbsRMnk1jM74`
- READY

CI follow-up Preview `dpl_9iFYnQTxXuCUyJ3cJmTGxbMSm6Rt` はBuild error 0 / runtime error-fatal 0。

Security Advisor: **0 lints**。

## Completed non-human hardening

- UI / copy / image / SEO / responsive監査
- Next.js Image Optimization
- CAPCOM日本語Frame Snapshot 31 / 31 PASS
- Public Move polymorphic Evidence Gate修正
- Move / Classic Command / Current verified Frameにofficial Evidence必須
- Admin Move publish条件をPublic Gateへ整合
- Move新規公開をdraft→Evidence→strict gate→publishedへ変更
- Strategy 5種をdraft→Source relation→publishedへ変更
- Diagnosis completeness GateをAdmin/RLSへ追加
- Character Trait Score Source relation / GateをAdmin/RLSへ整合
- Current Patch切替をatomic RPC化
- RPCを`SECURITY INVOKER`化
- relation RLS/実データ監査
- Security Advisor 0 lints

監査文書:

- `docs/PHASE23_PRE_DEVICE_POLISH_AUDIT_2026-08-29.md`
- `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`
- `docs/PHASE23_AUTH_ADMIN_READINESS_2026-08-29.md`
- `docs/PHASE23_AUTOMATED_RC_BASELINE_2026-08-29.md`
- `docs/PHASE23_FINAL_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md`

## Current DB state

- `auth.users`: 0
- published Character: 31
- published Diagnosis: 4
- published Move: 0
- published Combo / Setup / Sequence / Counter / Training: 0
- published Character Trait Score: 0
- Current Patch: `2026.08.03` 1件

Move:

- draft: 2052
- strict machine-ready: **701**
- ready Character: 12 / 31
- Modernあり / なし: 662 / 39

現在DBの`private.is_move_public_ready`による内訳:

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

Machine Gate PASSはPublication approvalではない。自動publishしない。

## 残作業 — Human / manual stageのみ

### A. Content Publication approval

- Safe minimal release
- または701候補から個別確認・承認したMoveのみpublish

bulk publish禁止。

### B. Real Auth / Admin E2E

現在`auth.users=0`。正式な実またはテストアカウントを通常Authフローで作る。

禁止:
- `auth.users`へ直接SQL投入
- 架空credential
- static testを実ログインEvidence扱い

実ブラウザ確認:
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

### C. Player残画像の人物確認

安全接続済み17名以外は必要時のみmanual確認。ファイル名類似だけで接続しない。

### D. Final RC freeze

A〜CでDB / code / assetsが変われば、必要なCI / Preview regression後にFinal RC HEADを固定する。

### E. Final actual-device acceptance

Final RC固定後のみ:
1. PC実機
2. iPhone実機

チェックリスト: `docs/PHASE23_REAL_DEVICE_TEST_CHECKLIST_2026-08-29.md`

### F. Production Readiness

manual Acceptance完了後にRelease Ready / Conditional Go / No-Goを判定。

### G. Production deploy

ユーザーが明示的に許可した場合のみ実施。

## 絶対ルール

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- bulk verify / publish禁止
- actual-device Evidenceをemulationで代用しない
- manual Auth Evidenceをstatic testで代用しない
- `main`変更禁止
- Production deployは明示許可時のみ
