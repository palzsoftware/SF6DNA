# DB publication change proposal — 2026-10-04

Status: READY_FOR_REVIEW; NOT_APPROVED; DB_WRITE=0; release NO_GO.

Fresh remote: 2380758461e80b39c533f600375d239d407f8d7f. Local base: 504937880df76a3e4cb51cf67958753491e974f5.

## Exact scope and result

| Character | Required DB rows | Public ready | Structural status-only | Classic official relation missing | Move official relation missing | Frame official relation missing |
|---|---:|---:|---:|---:|---:|---:|
| C.Viper | 61 | 0 | 5 | 56 | 2 | 0 |
| Elena | 72 | 0 | 2 | 70 | 6 | 0 |
| Sagat | 60 | 0 | 0 | 60 | 60 | 0 |

Missing counts overlap; all 193 rows remain draft. Primary blocker and every secondary blocker are in PRIORITY_MOVE_PUBLICATION_AUDIT_20261004.csv. This CSV includes exact command IDs, frame IDs/values/patch/status and source IDs/URLs/reliability/relationship/notes.

## A — Status-only structural candidates (7)

These are movement actions, not a completed combat move set. Existing DB categories remain unchanged; their placement should receive canonical review. Startup/hit/block are NULL and damage is 0 in these registered frame rows; no applicability or frame values were invented.

| Character | Move | Move ID | Category | Current → target |
|---|---|---|---|---|
| c-viper | ハイジャンプ（前方） | 39b5b08b-13b6-480e-91e7-44b997748277 | special | draft → published |
| c-viper | ハイジャンプ（垂直） | 5fdba88e-ceae-4d2e-9df7-b66b5fe60dcd | special | draft → published |
| c-viper | [セービングフォース]前方ステップ | f0ddeeeb-503a-404e-9b4b-89f4d38fd873 | special | draft → published |
| c-viper | 前方ステップ | 493cb95f-ca38-4ca2-bc65-3b708e81e4e4 | unique | draft → published |
| c-viper | 後方ステップ | a0841ad5-a95c-43f8-81d4-46842fa7eba6 | unique | draft → published |
| elena | 前方ステップ | 16fe033a-0d3d-4270-8706-3b29a6d1d139 | unique | draft → published |
| elena | 後方ステップ | d9d7d368-3583-4535-9d64-ac6872e0758d | unique | draft → published |

All seven have one nonempty Classic row, one open verified frame on the unique DB current patch, and supported official move/command/frame source relations. Existing official relation notes do not contain pending-review markers. These are reused historical evidence checks, not fresh proof of the current game version. Evidence references are dated 2026-08-27/28.

DB current patch: ecff9a58-d023-43ae-9962-79d25adfc1f3 / 2026.08.03. Current CAPCOM patch correspondence remains unconfirmed. Promotion is NOT recommended as a substitute for completing combat categories.

### Approval-only SQL (not executed)

Before approval, recheck source fact correspondence, category placement, actual current version and exact CSV values. During execution capture a durable before-image including status/updated_at and command/frame/source-relation rows. Abort if any value, eligible ID set, gate, or patch differs. Do not use an older approval pack.

Preflight:
```sql
SELECT id, slug, status, private.is_move_public_ready(id) AS gate
FROM public.moves WHERE id IN (
'39b5b08b-13b6-480e-91e7-44b997748277'::uuid,'5fdba88e-ceae-4d2e-9df7-b66b5fe60dcd'::uuid,'f0ddeeeb-503a-404e-9b4b-89f4d38fd873'::uuid,'493cb95f-ca38-4ca2-bc65-3b708e81e4e4'::uuid,'a0841ad5-a95c-43f8-81d4-46842fa7eba6'::uuid,'16fe033a-0d3d-4270-8706-3b29a6d1d139'::uuid,'d9d7d368-3583-4535-9d64-ac6872e0758d'::uuid
);
-- Expected: exactly 7 rows, status draft, gate true.
SELECT id, version_label FROM public.patches WHERE is_current;
-- Expected: exactly the patch above.
```

Proposed mutation (separate explicit approval required; NOT executed):
```sql
BEGIN;
-- Recheck and lock the exact 7 move rows and dependent command/frame/source rows.
-- Abort on any before-image drift; transaction must update exactly 7 rows.
UPDATE public.moves SET status = 'published'
WHERE id IN ('39b5b08b-13b6-480e-91e7-44b997748277'::uuid,'5fdba88e-ceae-4d2e-9df7-b66b5fe60dcd'::uuid,'f0ddeeeb-503a-404e-9b4b-89f4d38fd873'::uuid,'493cb95f-ca38-4ca2-bc65-3b708e81e4e4'::uuid,'a0841ad5-a95c-43f8-81d4-46842fa7eba6'::uuid,'16fe033a-0d3d-4270-8706-3b29a6d1d139'::uuid,'d9d7d368-3583-4535-9d64-ac6872e0758d'::uuid)
AND status = 'draft' AND private.is_move_public_ready(id)
RETURNING id, slug, status;
-- Verify exact 7 IDs; otherwise ROLLBACK. No automatic COMMIT supplied.
ROLLBACK;
```

Post-change verification, only after separately approved application: read the exact seven via anon RLS plus get_public_entity_sources and the shared resolver, compare command/frame fields and IDs to the before-image, inspect page cards; verify no extra IDs appeared. Status promotion alone cannot produce C.Viper/Elena/Sagat full five-category coverage.

Rollback proposal: restore only those exact IDs from the durable before-image, conditioned on their unchanged post-update values; abort on subsequent edits. Original status for all seven is draft. No rollback is necessary now because nothing was applied.

## B — Official Classic command relations (186 rows)

C.Viper 56, Elena 70, Sagat 60. Each has an existing nonempty Classic command row, but no official relation to that command ID. There is no command verification_status column; ACTION_VERIFY_COMMAND means evidence review, not an invented status update. Use exact command IDs/conditions from the row CSV. A Modern move/frame relation does NOT establish a Classic command claim.

Required action: compare the exact Classic command and variant/condition with official/in-game evidence; only after correspondence is established propose an entity_sources move_command relation to an existing or separately approved source. No INSERT SQL is supplied without a verified fact-to-source binding. URL equality alone cannot authorize linking.

## C — Move identity relations (68 rows, overlapping B)

C.Viper 2: standing-heavy-kick-5hk, standing-medium-punch-5mp. Elena 6: moon-glider-214hp, moon-glider-214mp, revival-dance-healing-236236p-2, slide-3hk, standing-heavy-kick-5hk, standing-light-punch-5lp (all with character prefix). Sagat: all 60 IDs in the row CSV. Required action: canonical identity/variant review, then separately approve move source relations. Frame evidence must not be copied to identity or command automatically.

## D — Frame/patch/canonical checks

All priority rows have exactly one current open verified frame with official relation and admissible source type/title/URL. No frame write or verification promotion is proposed. NULL/D/0 values are preserved. Current patch validity means DB contract match only. No official snapshot is available in this checkout; direct official frame routes returned 403 on 2026-10-04. No alternative unofficial source was substituted, and no retry loop was run.

Historical rollout notes include stale/version-discrepancy cautions; later Phase20 frame relations explicitly record normalization and verification. Both facts are retained. We do not turn inherited verification labels into a fresh canonical certification or declare zero canonical mismatches without source review.

## Gate reproduction and all31 automation

The DB private.is_move_public_ready function checks official Classic command, official move identity, current open verified frame plus official frame relation. It does not inspect moves.status. Public moves RLS adds published status. Public source RPC also requires the published gate-ready target, admissible source type, and nonempty title/URL in the client. A resolver fix cannot bypass these conditions.

Read-only scripts/release-publication-select.sql exports all required rows and detailed priority relations. scripts/audit-release-publication.py consumes those SELECT exports locally and emits the two CSVs; it never connects to DB. The SQL predicate reproduction matches the live private function for all 1,939 rows (0 mismatches). All31 totals: 0 ready, 661 structural status-only, 1,278 Classic evidence missing, 1,033 identity evidence missing, 1 Frame evidence missing. Counts overlap; these are structural eligibility counts, not 661 newly verified facts.

No resolver/template/formatter/media/RLS/RPC changes. Ingrid/Alex/JP reference behavior stays on the same code paths. No browser QA required for this audit-only change.

## Next single action

Obtain readable current official Classic command evidence for C.Viper combat rows and bind verified claims to the exact command IDs. Keep status promotion and relation changes as separate approval scopes. Do not spend the next step on optional media.

## Validation of this local candidate

Typecheck PASS; lint PASS; current full suite 568 PASS / 0 FAIL; release gates 14 PASS / 0 FAIL; build PASS. Python audit tests 5 PASS. Existing resolver/card/reference regression tests ran in the full suite; no runtime files changed. Browser QA NOT_RUN (audit-only). Generated next-env.d.ts/tsconfig changes were inspected and excluded from the candidate. No DB writes, remote writes, migrations or Production changes.

Counts are from fresh SELECT on 2026-10-04. Gate reproduction disagreement 0/1939. Priority command rows 193/193; current verified frame rows 193/193; official priority source relations have supported source type, title and URL, with no official pending-note markers. No new values or applicability classifications were generated.

Repeat: export each SELECT result set in scripts/release-publication-select.sql as a JSON array, then run:

```bash
python scripts/audit-release-publication.py all-rows.json priority-details.json output-directory
python scripts/test-audit-release-publication.py
```

The public source RPC is target-gated; draft evidence retrieved by the audit connector is diagnostic, not a public rendering path. The existing anon resolver is unchanged. None of the 7 status-only candidates establishes startup/hit/block data for a combat move.
