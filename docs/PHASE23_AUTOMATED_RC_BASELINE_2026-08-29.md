# SF6DNA Phase23 Automated RC Baseline

Date: 2026-08-29 JST
Branch: `sf6dna-v2`

## Status

**AUTOMATED BASELINE FROZEN / FINAL MANUAL RC NOT YET FROZEN**

人の判断・実ログイン・人物同定・PC/iPhone実機Acceptanceへ入る前の自動監査baselineを固定する。Machine Gate PASSはPublication approvalではない。

## Baseline heads

- Application implementation: `3c702ca0dad54ab2f73a2a940d1cc17e6511d3f1`
- DB hardening follow-up: `5c46de5f0a81e4c9996b5ff30f7896aa7cdf651e`
- CI invariant follow-up: `4c3dedad21fff648a2c887a7a66ba9b68bb05b23`

Application headの8 Gate:

- Phase16 Release Acceptance — PASS `33240366996`
- Phase15 Runtime Smoke — PASS `33240366991`
- Phase15 Browser Acceptance — PASS `33240367023`
- Phase15 Lighthouse Audit — PASS `33240366981`
- Phase19 Internal Hardening — PASS `33240367007`
- Phase20 Verified Content Acceptance — PASS `33240367003`
- SF6DNA v2 Web Check — PASS `33240366993`
- Phase18 Data Gate Acceptance — PASS `33240367041`

DB follow-up `5c46de5f...` のPhase19 — PASS `33240529766`。

## Release hardening included

- Public Move Gateのpolymorphic Evidence照合修正
- Move / Classic Command / Current verified Frameそれぞれにofficial Evidence必須
- Admin Move publish条件をPublic Gateへ整合
- Move新規公開をdraft→Evidence→strict gate→publishedへ変更
- Strategy 5種をdraft→Source relation→publishedへ変更
- Diagnosis公開complete gateをAdmin/RLS両方へ追加
- Character Trait ScoreのSource relationとPublic GateをAdmin/RLS両方へ整合
- Current Patch切替をatomic RPC化
- Current Patch RPCを`SECURITY INVOKER`化
- relation RLS/実データ横断監査
- Security Advisor: **0 lints**

詳細: `docs/PHASE23_AUTH_ADMIN_READINESS_2026-08-29.md`

## Vercel

DB follow-up head `5c46de5f...`:

- Deployment: `dpl_8sdQJbKXF3EYmGgeQbsRMnk1jM74`
- State: READY
- target: Preview
- v2 Production deploy: 未実施

CI follow-up Preview `4c3dedad...`:

- Deployment: `dpl_9iFYnQTxXuCUyJ3cJmTGxbMSm6Rt`
- READY
- Build error: 0
- runtime error / fatal: 0

## Supabase / Security

- Project: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`（1件）
- Security Advisor: 0 lints
- Public Move Gate: enforced
- Public Strategy Gate: enforced
- Diagnosis completeness Gate: enforced
- Character Trait Score Gate: enforced
- `auth.users`: 0

## Current public content

- playable + published Character: 31
- published Diagnosis: 4
- published Move: 0
- published Combo / Setup / Sequence / Counter / Training: 0
- published Character Trait Score: 0

## Move draft gate snapshot

実DBの`private.is_move_public_ready(m.id)`で再集計:

- draft Move: 2052
- strict machine-gate-ready: **701**
- not ready: 1351
- ready Characters: 12 / 31
- Modernあり: 662
- Modernなし: 39

| Character | Ready | Modern | No Modern |
|---|---:|---:|---:|
| Dee Jay | 105 | 102 | 3 |
| Jamie | 93 | 91 | 2 |
| Blanka | 91 | 83 | 8 |
| Dhalsim | 88 | 77 | 11 |
| Kimberly | 76 | 74 | 2 |
| E. Honda | 70 | 65 | 5 |
| Guile | 70 | 66 | 4 |
| Chun-Li | 68 | 64 | 4 |
| Yasmine | 19 | 19 | 0 |
| Mai Shiranui | 10 | 10 | 0 |
| C. Viper | 7 | 7 | 0 |
| Elena | 4 | 4 | 0 |
| **Total** | **701** | **662** | **39** |

701件は必須のMove / Classic Command / Current verified Frame official Evidenceを満たすが、全件draftのまま維持する。

## Strategy snapshot

`draft + verified + Source relation`:

- Combo: 1
- Setup: 0
- Sequence: 0
- Counter: 0
- Training: 0

自動publishしない。

## Diagnosis / Trait snapshot

Published Diagnosis 4件:

- published Question数: 12 / 10 / 10 / 20
- Optionなしpublished Question: 0
- 全4件release-ready

Character Trait Score:

- total: 372
- published: 0
- public-ready: 0

## External / image evidence

CAPCOM Official Frame Snapshot:

- Run: `33228209058`
- 31 / 31 pages HTTP 200
- Artifact: `phase20-official-frame-snapshots-ja-jp`
- Artifact ID: `9707625771`

Player:

- published: 41
- DB image_url: 0 / 41
- safety-confirmed fallback: 17
- remaining images: manual identity check only

## Performance baseline

Home:
- Performance 0.91
- Accessibility 1.00
- SEO 1.00
- LCP 約3.39s
- CLS 0

Character detail:
- Performance 0.93
- Accessibility 1.00
- SEO 1.00
- LCP 約3.11s
- CLS 0

最新Lighthouse workflowもPASS。

## Remaining gates — human/manual only

1. Content Publication approval
2. 正式なAuth user準備
3. Real Auth / Admin E2E
4. 必要ならPlayer画像人物確認
5. manual変更後のFinal RC freeze
6. PC actual-device acceptance
7. iPhone actual-device acceptance
8. Production Readiness decision
9. Production deploy（ユーザー明示許可時のみ）

## Final RC rule

このAutomated baselineをFinal RCとは呼ばない。manual stageでDB / code / assetsが変わった場合は、その変更後に必要な回帰テストを実行してFinal RC HEADを固定する。

## Non-negotiable rules

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceあり ≠ verified
- Machine Gate PASS ≠ Publication approval
- Missing Modernを推測しない
- 偽Auth userをSQL投入しない
- actual-device Evidenceをemulationで代用しない
- `main`変更禁止
- Production deployは明示許可時のみ
