# SF6DNA V1.1 Public Entity Enrichment Test Evidence — 2026-09-18

## Targeted
PASS:
- exact Move ID + slug + public Source + composite official verification + Current Patch enriches metadata;
- Source-only Move remains unknown;
- identity mismatch refuses enrichment;
- inexact Source relation refuses enrichment;
- non-Move Strategy entity is untouched;
- all current Strategy search/filter gates remain closed;
- reviewed/source/published/relevance do not imply verified;
- Patch match, unknown, stale, and non-applicable remain distinct;
- sensitive identifiers are removed from retrieval queries.

Command: `node --test tests/public-entity-enrichment-v11.test.mjs tests/coach-trusted-retrieval-v11.test.mjs tests/search-release-boundary.test.mjs tests/ai-coach-v11.test.mjs tests/coach-shared-analysis-v11.test.mjs`

Result: 41 PASS / 1 FAIL. The failure is the existing `ai-coach-v11` static expectation for the literal `生成回答はまだ無効`; generation remains disabled in the API (`generationEnabled: false`) and the failure is unrelated to enrichment.

## Repository checks
- `npm run typecheck`: PASS
- `npm run lint`: PASS
- `npm run test:release-gates`: PASS (14/14)
- `npm run build`: PASS
- `npm test`: FAIL from existing static UI expectations; enrichment tests pass
- `git diff --check`: PASS

Build warnings: existing missing `metadataBase` warning. Build-generated `tsconfig.json` and `next-env.d.ts` edits were inspected and excluded from the change set.
