# SF6DNA Phase23 Pre-device Polish Audit

Date: 2026-08-29 JST
Branch: `sf6dna-v2`

## Decision

**ALL SAFE NON-HUMAN PRE-DEVICE WORK COMPLETE**

実機・実ログイン・人物同定・Publication approvalなど人の操作または判断が必要な項目を除き、GitHub / Supabase / Vercelで安全に完了できるPhase23作業は完了した。

- `main`変更なし
- v2 Production deployなし
- PC / iPhone actual-device testはFinal RC後までHOLD

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

DB follow-up Phase19もPASS `33240529766`。

## UI / copy / image / SEO

完了:

- 主要PublicページUI/copy再監査
- 内部管理用語のPublic表示整理
- safe empty/error state維持
- Character / Player画像監査
- safety-confirmed Player fallback 17名
- Next.js Image Optimization / responsive sizes
- metadata / robots / sitemap / OGP整理
- Preview crawl禁止

Player:

- published 41
- DB image_url 0 / 41
- safety-confirmed fallback 17
- remaining imagesはmanual identity checkのみ

## Supabase / Security

- public table RLS: 38 / 38確認済み
- Security Advisor: **0 lints**
- Current Patch: `2026.08.03`が1件
- `auth.users`: 0
- Auth default role: `user`
- non-admin self-promotion block確認
- Admin判定: `private.is_admin()`

## Publication / Admin hardening

### Move

- polymorphic `entity_sources` inferred join依存を除去
- Move / Classic Command / Current verified Frameにofficial Evidence必須
- Admin publish条件をPublic Gateと同等へ整合
- Evidence UIをMove / Command / Frameへ拡張
- 新規published指定はdraft→Evidence→strict gate→published

### Strategy

Combo / Setup / Sequence / Counter / Trainingをdraft→Source relation→publishedへ統一。

### Diagnosis

- incomplete Diagnosis / Questionの公開をAdminで拒否
- published QuestionにはOption必須
- DB/RLSもrelease-ready parentを要求
- 既存4 Diagnosisはpublished Question数12 / 10 / 10 / 20、Optionなし0で全件ready

### Character Trait Score

- publishedにはverified + Source必須
- `entity_sources` relation必須
- published Character / Trait parent必須
- total 372 / published 0 / public-ready 0

### Current Patch

- Adminの2段階切替を廃止
- `public.set_current_patch(uuid)`でatomic切替
- RPCはadmin checkあり
- Security Advisor指摘を受け`SECURITY INVOKER`化
- Security Advisor 0 lintsへ復帰

### Relation audit

現在実データでdraft-parent漏出0件。published video relation 5件は全てpublished Character向け。不要な仕様変更は行っていない。

詳細: `docs/PHASE23_AUTH_ADMIN_READINESS_2026-08-29.md`

## Current publication snapshot

- published Character 31
- published Diagnosis 4
- published Move 0
- published Combo / Setup / Sequence / Counter / Training 0
- published Character Trait Score 0

Move:

- draft 2052
- strict machine-ready **701**
- not ready 1351
- ready Character 12 / 31
- Modernあり / なし **662 / 39**

Current DB functionによる内訳:

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

701件はrequired official Evidenceを満たすが、Machine Gate PASS ≠ Publication approvalのためdraft維持。

Strategy `draft + verified + Source`:

- Combo 1
- Setup / Sequence / Counter / Training 0

詳細: `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`

## CAPCOM official snapshot

- Run `33228209058`
- CAPCOM Japanese Frame pages 31 / 31 HTTP 200
- Artifact `phase20-official-frame-snapshots-ja-jp`
- Artifact ID `9707625771`

read-only Evidenceとして使用し、DB statusを自動変更していない。

## Performance

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

最新LighthouseもPASS。

## Vercel

DB follow-up Preview:

- SHA `5c46de5f0a81e4c9996b5ff30f7896aa7cdf651e`
- Deployment `dpl_8sdQJbKXF3EYmGgeQbsRMnk1jM74`
- READY

CI follow-up Preview:

- Deployment `dpl_9iFYnQTxXuCUyJ3cJmTGxbMSm6Rt`
- READY
- Build error 0
- runtime error / fatal 0

## Remaining work — human/manual only

1. Content Publication approval
2. 正式なAuth user準備
3. Real Auth / Admin E2E
4. 必要ならPlayer残画像人物確認
5. manual変更後のFinal RC freeze
6. PC実機test
7. iPhone実機test
8. Production Readiness decision
9. Production deploy（ユーザー明示許可時のみ）

## Rules

- `reviewed ≠ verified`
- `draft ≠ published`
- Machine Gate PASS ≠ Publication approval
- Missing Modernを推測しない
- 偽Auth userをSQL投入しない
- actual-device Evidenceをemulationで代用しない
- `main`変更禁止
- Production deployは明示許可時のみ
