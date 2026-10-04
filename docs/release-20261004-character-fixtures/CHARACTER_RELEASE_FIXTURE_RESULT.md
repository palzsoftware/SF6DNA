# 31-character release fixture candidate — 2026-10-04

## Result and publication boundary

Fresh remote: 2380758461e80b39c533f600375d239d407f8d7f (no drift). Fresh read-only DB totals: moves 2065, commands 3508, frames 2065. All 31 route characters generated; 1939 active rows in normal/unique/target_combo/special/throw/super have a name, Classic command and exactly one open frame row for the DB current patch. Structural fixture readiness is **not** canonical approval or public readiness.

| Character | Candidate moves | Classic missing | Current row missing | Review required | Public ready |
|---|---:|---:|---:|---:|---:|
| C.Viper | 61 | 0 | 0 | 56 | 0 |
| Elena | 72 | 0 | 0 | 70 | 0 |
| Sagat | 60 | 0 | 0 | 60 | 0 |
| All 31 | 1939 | 0 | 0 | 1278 | 0 |

NULL/blank counts: startup 113, on_hit 364, on_block 517, damage 34. These are absent values, not adjudicated N/A. NULL remains NULL, zero remains zero, D and other string notation remains unchanged. DB current patch is 2026.08.03; this designation is not a fresh confirmation of CAPCOM's current production patch.

## Reproduction

Execute only the SELECT in scripts/character-release-fixture-select.sql through the read-only audit path; save its export object as JSON. Run from repository root:

    node scripts/generate-character-release-fixtures.mjs /absolute/path/to/export.json

Generator has no database connection or credentials and derives its roster from character-detail-route.ts. It whitelists output fields, keeps command sort order, selects only current/open frames, rejects ambiguous current patches and duplicate move IDs. No past frame substitution. Original status and verification are retained; notes/private source fields are not copied. usageSummary is deliberately NULL because strategy is outside this candidate.

The single generated JSON contains safe display fields plus audit metadata. The audit CSV measures structural availability; the exception CSV lists evidence/verification and structural reasons. Source flags mean existing official relations, not independently rechecked facts. Values are not discarded because relations are missing.

## Runtime

Generated snapshot is dynamically loaded by the server only when VERCEL_ENV=preview and character UUID matches. Public gate, RLS, RPC and production path are unchanged. Public or authorized device bundles precede generated candidates. JP/Ryu existing review fixtures, Alex reviewed bundle and Yasmine canonical bundle are explicitly protected from generated replacement. Ingrid's authorized device/public result still wins; the generated fallback fills its prior empty overview only when those paths return no moves.

Candidate cards say DB収録データ・公開審査前. The stored verified field is preserved as DB metadata, not presented as a new official command/identity approval. Existing shared formatter and renderer are reused. All candidate media starts NULL; existing page merge still matches available media by move ID. No held media is reactivated. Media absence renders 動作映像は未掲載.

## Verification

- Full suite: 573 PASS / 0 FAIL, including actual fixture SSR for all 31 / all 1939 IDs, generated category/commands/frames/fallback, generator NULL/zero/verification/stale-frame tests and resolver Preview/public/device precedence.
- Release gates: 14 PASS / 0 FAIL.
- Typecheck, lint, build and git diff --check: PASS.
- JP fixture file unchanged; Alex/Yasmine protected precedence and Ingrid authorized bundle regression checked automatically. No new media or formatter edits.
- Desktop / 375 / 390 visual QA: NOT_RUN_BROWSER_LIMITATION. Local Next server started with an explicit hostname, but Work browser rejected its localhost URL with net::ERR_BLOCKED_BY_CLIENT. SSR pass does not prove responsive visual QA.
- Remote write, Preview deployment, DB write, migrations: NONE. Production/main/sf6dna-v2/Ver1.1 unchanged. Build/dev-generated config and agent files excluded from commit.

## Release decision and next action

NO_GO. This candidate resolves inspection/display availability, not the outstanding official publication approvals. Fixture-first production rollout is not authorized by this change. Next single action: review this local candidate diff and approve a scoped RC push so hosted Preview can verify the 6 representative pages at Desktop/375/390 before production publication is considered.
