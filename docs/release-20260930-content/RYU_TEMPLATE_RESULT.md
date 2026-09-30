# Ryu template lane result — 2026-09-30

- Fresh canonical data: shared read-only snapshot `/tmp/sf6dna-content-fresh.json`, fetched 2026-09-30T08:08:51.979467+00:00.
- 57 observed Ryu move rows, all draft; canonical published expected move count 0. This is a capture candidate plan, not a claim that all are approved public content.
- Raw types: normal18, throw2, unique5, target_combo2, special27, super3. Recording grouping normal20 / unique7 / special27 / super3, all grouping/order/file names proposed and unverified.
- No standalone canonical CA row observed. CA is a verification gap, not an invented move ID.
- Expected recording checklist: `/tmp/sf6dna-ryu-expected-moves.json`. Exact IDs, slugs, names, observed types, draft status, display order retained. Candidate frame arrays intentionally excluded from this checklist.
- RYU_MEDIA.zip absent; no claims of recorded/cut/generated/bound counts or PASS.
- Shared move card now reuses ComboInputRecipe for existing command text, retaining its raw recipe/text fallback. Generic P is not converted into a guessed Classic/Modern button by this change.
- Shared frame contract supports optional active/recovery/onHit; card displays only supplied nonempty values. Existing fixture values remain untouched, and no draft canonical frame candidate data was published.
- No global CSS or layout edits; local CSS unchanged.
- Existing source/media presentation remains intact. No new per-move source linkage was invented, because current bundle has no canonical per-move source references.
- Targeted tests: `node --test --test-isolation=none tests/character-move-frame-render.test.mjs tests/character-detail-pilot.test.mjs`: 15 PASS (3 new render tests + 12 existing).
- Root final batch handles typecheck/lint/build, and affected shared character template 375px/desktop Dark/Light Preview checks.
- Files changed by this lane: `v2-web/src/components/character-detail-pilot.tsx`, `v2-web/src/lib/device-preview.ts`, `v2-web/tests/character-move-frame-render.test.mjs`.
- No DB writes, migrations, dependencies, auth, release flags or Production changes.
