# SF6DNA Phase23 Automated RC Baseline

Date: 2026-08-29 JST
Branch: `sf6dna-v2`

## Status

**AUTOMATED BASELINE FROZEN / FINAL MANUAL RC NOT YET FROZEN**

この文書は、人の操作・判断が必要な最終stageへ入る前の自動監査baselineを固定する。

Publication approval、実Auth/Admin E2E、人物確認、PC/iPhone実機テストは含まない。

## Application baseline

Publicアプリ実装の自動Gate済みcommit:

`634845b9ffedacac0ba706186852f295c2204755`

このcommitで:

- Phase16 Release Acceptance — PASS
- Phase15 Runtime Smoke — PASS
- Phase15 Browser Acceptance — PASS
- Phase15 Lighthouse Audit — PASS
- Phase19 Internal Hardening — PASS
- Phase20 Verified Content Acceptance — PASS
- SF6DNA v2 Web Check — PASS
- Phase18 Data Gate Acceptance — PASS

を確認済み。

## Performance baseline

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

## Vercel

`sf6dna-v2` Previewで次を継続確認済み:

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

## Content baseline

### Public

- Character: 31
- Diagnosis: 4
- Move: 0
- Combo / Setup / Sequence / Counter / Training: 0

### Move draft

- total: 2052
- strict machine-gate-ready: 701
- not ready: 1351
- ready Characters: 12 / 31
- ready候補Modernあり: 662
- ready候補Modernなし: 39

701候補の構造監査ではRelease Blockerとなるblank / duplicate / Current Frame cardinality / Classic Command cardinality異常を検出していない。

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

Official snapshot audit toolのReader URL不具合を修正:

- commit: `ac4ed232d0f73c619ac2681565ab55c289022967`

GitHub Actions:

- Workflow: `Phase20 Official Frame Snapshot`
- Run: `33228209058`
- Result: PASS
- CAPCOM Japanese frame pages: 31 / 31 success
- HTTP: 200 for all 31
- attempts: 1 for all 31
- Artifact: `phase20-official-frame-snapshots-ja-jp`
- Artifact ID: `9707625771`

Snapshotはread-only EvidenceでありDB status変更には使用していない。

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

## Documentation baseline

現行v2基準へ再同期済み:

- `PROJECT_STATUS.md`
- `NEXT_PROMPT.md`
- `README.md`
- `CHANGELOG.md`
- `docs/V2_RELEASE_READINESS.md`
- `docs/KNOWN_ISSUES.md`
- `docs/TECH_DEBT.md`
- `docs/DATA_ISSUES.md`
- `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`
- `docs/PHASE23_PRE_DEVICE_POLISH_AUDIT_2026-08-29.md`

旧静的版課題を現行v2 Release Blockerと混同しない。

## Remaining gates — human/manual only

1. Content Publication approval
2. Real Auth / Admin E2E with actual sessions
3. Player remaining-image identity confirmation if required
4. Manual changes後のfinal RC freeze
5. PC real-device acceptance
6. iPhone real-device acceptance
7. Production Readiness decision
8. Production deploy only after explicit user permission

## Final RC rule

このAutomated RC baselineをFinal RCとは呼ばない。

manual stageでDB status / code / assetsが変更された場合は、その変更後に必要なCI / Preview regressionを実行してFinal RC HEADを固定する。

## Non-negotiable rules

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceあり ≠ verified
- Machine Gate PASS ≠ publish approval
- Missing Modernを推測しない
- actual-device Evidenceをemulationで代用しない
- manual Auth Evidenceをstatic testで代用しない
- `main`変更禁止
- Production deployは明示許可時のみ
