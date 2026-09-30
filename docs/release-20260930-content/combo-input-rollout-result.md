# Combo Input Full Renderer Rollout — 2026-09-30

## Scope

Shared `PilotComboCard` no longer limits semantic rendering to 15 pilot IDs. It renders the raw recipe for every card supplied by the existing loader. Existing `publicStrategyContent=false`, published/verified filters, statuses, roles, routes and data are unchanged.

Explicit relative direction tokens `N/UP/UP_FORWARD/FORWARD/DOWN_FORWARD/DOWN/DOWN_BACK/BACK/UP_BACK` added. DR/CDR and explicit DI states remain separate; uncertain DI, generic P/K and unrecognized inputs remain visible text. Original notation is preserved, including the legacy JP adapter via `rawRecipe`.

## Fresh corpus

Read-only snapshot supplied by the root agent from Supabase project `wnuxaxbrpudyypzdbdho`. Fetch timestamp is recorded in `combo-input-rollout-audit.json`.

Public eligibility is the actual existing Combo section predicate: `status=published AND verification_status=verified`.

| Scope | Combos | Tokens | Known | Text fallback | Ambiguous | Raw mismatches |
|---|---:|---:|---:|---:|---:|---:|
| Public eligible | 0 | 0 | 0 | 0 | 0 | 0 |
| Actually rendered public | 0 | 0 | 0 | 0 | 0 | 0 |
| Internal corpus, all statuses | 1,478 | 19,320 | 6,919 | 11,805 | 596 | 0 |

Internal corpus has draft 1,213 / archived 265; reviewed 134 / unverified 1,343 / verified 1. These counts do not represent public, adopted or gameplay-approved combos.

TEXT counts include separators and literal technique/prose fragments. Actionable unknown report excludes pure separators, has 822 distinct entries, and preserves examples plus suggested `TEXT_FALLBACK` or `AMBIGUOUS` action. No unknown input has been inferred or silently replaced.

## Verification

- Targeted behavioral tests: 15 PASS (12 tokenizer/render tests + 3 existing integration tests).
- Targeted lint: PASS.
- Isolated actual React SSR full shared card renderer and CSS, all 1,478 internal rows plus synthetic declared tokens, all details opened:
  - 375px Dark: scrollWidth 375, horizontal overflow 0.
  - 375px Light: scrollWidth 375, horizontal overflow 0.
  - 6,977 labeled icons, missing aria-label 0, page errors 0.
- Raw recipe reconstructed from semantic tokens exactly for every fresh internal row; missing recipe 0.
- Shared nonpilot-card test confirms raw recipe wins over normalized display copy.
- No public route or data publication was added by the isolated harness.

## Status

`FULL_RENDERER_CODE = IMPLEMENTED_AND_TARGETED_TESTED`

`FULL_PUBLIC_ROLLOUT = PENDING_PUBLIC_ELIGIBILITY_AND_SCOPE`

`TOTAL_RENDERED_PUBLIC_COMBOS = 0`

Preview route tests, repository full verification, actual theme contrast, Japanese glyph readability and weekend real-device QA belong to parent batch closure. Japanese font is missing in temporary Chromium; local geometric PASS does not certify glyph quality. This work is semantic display verification, not gameplay or combo adoption verification.

## Reproducibility

`node scripts/audit-combo-inputs.mjs <fresh snapshot JSON> <output JSON>`

The script reads data and writes a local report only. It has no network client and no DB write path. Full raw snapshot stays outside the repository; requested unknown examples are retained in the report.

Local harness paths:

- `/tmp/sf6dna-combo-full-harness.cjs`
- `/tmp/sf6dna-combo-full-browser.cjs`
- `/tmp/sf6dna-combo-full-measurements.json`
