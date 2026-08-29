# SF6DNA Phase23 Automated RC Baseline

Date: 2026-08-29 JST
Branch: `sf6dna-v2`

## Status

**AUTOMATED BASELINE FROZEN / FINAL MANUAL RC NOT YET FROZEN**

この文書は、人の操作・判断が必要な最終stageへ入る前の自動監査baselineを固定する。

Publication approval、実Auth/Admin E2E、人物確認、PC/iPhone実機テストは含まない。

## Application baseline

Public / Adminアプリ実装の自動Gate済みcommit:

`6b5a4b8e1974f677691e655e274da9626bdb18b5`

CI invariantのみのfollow-up:

`22af783bc8fb947be138cfcdd56279a053d8f713`

このbaselineで確認済み:

- Phase16 Release Acceptance — PASS (`33239446677`)
- Phase15 Runtime Smoke — PASS (`33239446690`)
- Phase15 Browser Acceptance — PASS (`33239446655`)
- Phase15 Lighthouse Audit — PASS (`33239446718`)
- Phase19 Internal Hardening — PASS (`33239510750`)
- Phase20 Verified Content Acceptance — PASS (`33239446647`)
- SF6DNA v2 Web Check — PASS (`33239446717`)
- Phase18 Data Gate Acceptance — PASS (`33239446644`)

Phase19は旧Public Gate実装文字列を要求するstatic invariantが一度FAILしたが、Typecheck / Lint / Policy / BuildはPASSしていた。新しいpolymorphic Evidence実装にinvariantを合わせた後、run `33239510750` で完全PASSした。

## Auth / Admin hardening included in this baseline

Real Auth E2E前の追加監査で以下を修正済み。

1. `entity_sources.entity_id`がpolymorphicでFKを持たないため、Public Move GateからPostgREST inferred join依存を除去
2. Move / Classic Command / Current verified FrameのEvidenceをentity_type / entity_idで明示照合
3. 3対象すべてにofficial Sourceを要求
4. Admin publish条件をPublic Move Gate同等へ強化
5. Admin UIでMove / Command / FrameへEvidence Sourceを個別付与可能に変更
6. 新規published Moveはdraft→Command/Frame/Evidence→strict gate→publishedの順で昇格
7. Phase19 / Phase20 CIでこの仕様を固定

詳細:

`docs/PHASE23_AUTH_ADMIN_READINESS_2026-08-29.md`

## Performance baseline

画像最適化後の既存計測:

### Home

- Performance: 0.91
- Accessibility: 1.00
- Best Practices: 0.96
- SEO: 1.00
- FCP: 約0.80s
- LCP: 約3.39s
- TBT: 約65ms
- CLS: 0

### Character detail

- Performance: 0.93
- Accessibility: 1.00
- Best Practices: 0.96
- SEO: 1.00
- FCP: 約0.77s
- LCP: 約3.11s
- TBT: 約109ms
- CLS: 0

最新Phase15 Lighthouse workflowもPASS。

## Vercel

CI follow-up head `22af783bc8fb947be138cfcdd56279a053d8f713` Preview:

- Deployment: `dpl_CHHhrT5RgaXP9LGGHMm7mPSE2PgT`
- READY
- target: Preview
- Build error: 0
- runtime error / fatal: 0

Production deployは実施していない。

## Supabase / Security baseline

- Project: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- RLS: 38 / 38
- Security Advisor: 0 lints
- Player relation orphan: 0
- Public Move Gate: enforced
- Public Strategy Gate: enforced
- `auth.users`: **0**

新規Auth userはDB triggerで`profiles.role='user'`として作成され、一般ユーザーが自身をadminへ自己昇格できないRLSを確認済み。

## Content baseline

### Public

- Character: 31
- Diagnosis: 4
- Move: **0**
- Combo / Setup / Sequence / Counter / Training: **0**

Auth/Admin readiness作業後にもread-only再確認し、公開statusに変化なし。

### Move draft

- total: 2052
- strict machine-gate-ready: 701
- not ready: 1351
- ready Characters: 12 / 31
- ready候補Modernあり: 662
- ready候補Modernなし: 39

Current DB functionによるready内訳:

- Dee Jay 105
- Jamie 93
- Blanka 91
- Dhalsim 88
- Kimberly 76
- E. Honda 70
- Guile 70
- Chun-Li 68
- Yasmine 19
- Mai 10
- C. Viper 7
- Elena 4

701候補の必須Evidence:

- Move official Evidence: 701 / 701
- Classic Command official Evidence: 701 / 701
- Current verified Frame official Evidence: 701 / 701

Machine Gate PASSはPublication approvalではないためstatusは変更していない。

### Strategy

`draft + verified + Source`:

- Combo: 1
- Setup: 0
- Sequence: 0
- Counter: 0
- Training: 0

自動publishしない。

## Official frame external audit

- fix commit: `ac4ed232d0f73c619ac2681565ab55c289022967`
- Workflow: `Phase20 Official Frame Snapshot`
- Run: `33228209058`
- Result: PASS
- CAPCOM Japanese frame pages: 31 / 31 success
- HTTP 200 for all 31
- Artifact: `phase20-official-frame-snapshots-ja-jp`
- Artifact ID: `9707625771`

## Image baseline

### Character

- DB image_url: 0 / 31
- existing fallbackを使用
- Next.js Image Optimization適用済み

### Player

- published: 41
- DB image_url: 0 / 41
- safety-confirmed fallback: 17
- published Player alias追加情報: 0

残りは人物同定が必要なため自動接続しない。

## Remaining gates — human/manual only

1. Content Publication approval
2. 正式なAuth user準備
3. Real Auth / Admin E2E with actual Admin / non-admin sessions
4. Player remaining-image identity confirmation if required
5. Manual変更後のFinal RC freeze
6. PC real-device acceptance
7. iPhone real-device acceptance
8. Production Readiness decision
9. Production deploy only after explicit user permission

## Final RC rule

このAutomated RC baselineをFinal RCとは呼ばない。

manual stageでDB status / Auth test data / code / assetsが変更された場合は、その変更後に必要なCI / Preview regressionを実行してFinal RC HEADを固定する。

## Non-negotiable rules

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceあり ≠ verified
- Machine Gate PASS ≠ publish approval
- Missing Modernを推測しない
- `auth.users`へSQLで偽ユーザーを直接投入しない
- actual-device Evidenceをemulationで代用しない
- manual Auth Evidenceをstatic testで代用しない
- `main`変更禁止
- Production deployは明示許可時のみ
