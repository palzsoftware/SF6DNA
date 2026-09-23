# SF6DNA Ver.1.0 — Production Smoke / Rollback Runbook

Date: 2026-09-24
Scope: release preparation only. This document does **not** authorize Production deploy/alias/env changes or DB writes.

## Fresh baseline

- RC branch: `sf6dna-v2-chatgpt-rc-20260916`
- RC SHA at runbook creation: `5037ed8ef275e06794c210d1b0d96411b63712f9`
- RC Preview deployment: `dpl_BrAxweXaYhTHhZzeaTnK2QCAeVaC`
- RC Preview state: `READY`
- GitHub/Vercel status for RC SHA: `success`
- RC Preview root: HTTP `200`
- RC Preview runtime error/fatal query for the latest deployment: no matching logs in the checked 6-hour window
- RC Preview is protected/noindex and is not Production

Current Production remains unchanged:

- Production alias: `sf-6-dna.vercel.app`
- Production deployment: `dpl_3T4VAzUWb57vwaN6HphfNGucDPVL`
- Production SHA: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Production state: `READY`

This Production deployment is the current rollback anchor until a final Ver.1.0 promotion is explicitly approved.

## Preconditions before Production promotion

Do not promote until all release-required items are explicitly classified PASS or accepted risk.

1. Final RC SHA is frozen and recorded.
2. Latest RC Preview is `READY` and its commit SHA matches the intended RC.
3. No unresolved confirmed P0 is present.
4. User final device acceptance for the release-critical public routes is complete.
5. Intended Production environment-variable assignment is checked in Vercel UI or another supported read-only source. Secret values do not need to be copied into evidence.
6. Production promotion is explicitly approved by the user.
7. Motion Media remains `PREVIEW_ONLY` unless its cut/mapping/device gates are separately completed; it must not block the core Ver.1.0 release.

## Pre-promotion snapshot

Immediately before any approved promotion, record:

```text
FINAL_RC_SHA =
FINAL_RC_PREVIEW_DEPLOYMENT =
FINAL_RC_PREVIEW_URL =
PRE_RELEASE_PROD_DEPLOYMENT = dpl_3T4VAzUWb57vwaN6HphfNGucDPVL
PRE_RELEASE_PROD_SHA = b9a2a8f638a3d4a98bfa042d56470664fe225ba7
PRODUCTION_ALIAS = sf-6-dna.vercel.app
```

Do not mutate the rollback anchor during preparation.

## Production smoke — read-only first pass

After an explicitly approved Production promotion, run the following read-only checks before any write-path test.

| Route / area | Minimum acceptance |
|---|---|
| `/` | HTTP 200, Home renders, primary navigation visible |
| `/characters` | HTTP 200, character list renders |
| `/characters/jp` | HTTP 200, Character Detail renders; Motion Media absence is acceptable if Ver.1.0 media remains excluded |
| `/diagnosis` | HTTP 200, diagnosis entry UI renders |
| `/search` | HTTP 200, search UI renders |
| `/players` | HTTP 200, player list renders |
| `/videos` | HTTP 200, video list/filter UI renders |
| `/contact` | HTTP 200, contact form renders; do not submit yet |
| `/auth` | HTTP 200, auth UI renders; local return-path behavior remains same-origin |
| `/faq` | HTTP 200 |
| `/privacy` | HTTP 200 |
| `/terms` | HTTP 200 |
| `/disclaimer` | HTTP 200 |
| `/robots.txt` | Production policy is intentional; not accidentally Preview/noindex-only |
| `/sitemap.xml` | Production sitemap resolves if enabled by the current contract |

Also check Vercel runtime errors after the read-only smoke. Any new repeatable `fatal`, unhandled server error, or broad 5xx cluster on release-critical routes is a rollback candidate.

## Auth smoke

Release-critical checks:

- `/auth?next=/characters/jp` keeps the return destination local.
- protocol-relative, absolute external, malformed, and backslash-host-like values must not escape the site origin.
- signed-out access to account-only save/training behavior must fail safely or route to Auth according to the committed contract.

The RC contains the return-path hardening commits:

- `ce5f111c4d50b9ba7b875fb25a37db1cb01a1be6`
- `aff8f00f935ec2eadf9966dd248651478f4071e6`

Do not weaken this validation during release.

## Write-path smoke — explicit/manual only

The following tests can create state and therefore are separated from the read-only smoke:

- real Contact submission through `submit_contact`
- real Auth sign-in / account creation
- authenticated save flows
- any Admin/Publication operation

Run only when the user explicitly approves the relevant Production write. Clean up test data when the existing contract provides a safe cleanup path.

## Rollback triggers

Rollback should be preferred over live debugging on Production when any of the following is confirmed after promotion:

1. Home or several primary public routes return 5xx or fail to render.
2. Auth return path can navigate to an external origin.
3. Production is connected to the wrong Supabase project/environment or required Production env assignment is missing.
4. Contact/public security boundary exposes direct table read/write unexpectedly.
5. A release-critical global navigation/layout regression makes the site materially unusable on supported devices.
6. A new repeated runtime fatal/error cluster is clearly introduced by the promoted RC.

Motion Media cut quality, missing optional media, or remaining 29-character recordings are **not** by themselves reasons to rollback the core Ver.1.0 release because the current media decision is Preview-only.

## Rollback target and procedure

Rollback anchor:

```text
DEPLOYMENT = dpl_3T4VAzUWb57vwaN6HphfNGucDPVL
SHA = b9a2a8f638a3d4a98bfa042d56470664fe225ba7
ALIAS = sf-6-dna.vercel.app
```

If a rollback trigger is confirmed:

1. Stop further Production writes/testing.
2. Record the failing route, status/error, request time, and current promoted deployment ID.
3. Reassign/rollback Production to the rollback anchor using the approved Vercel release procedure.
4. Confirm `sf-6-dna.vercel.app` again resolves to the rollback deployment and is `READY`.
5. Re-run Home + one representative content route + `/auth` as read-only smoke.
6. Open a release-blocking defect against the failed RC. Do not hot-patch Production directly.

This runbook does not itself perform or authorize step 3.

## Current known release notes carried forward

- Explicit per-route canonical contract: `SEO_FOLLOW_UP`, not a current release blocker.
- Exact Production env key/scope assignment: `UNVERIFIED_BY_AVAILABLE_READ_ONLY_TOOL`; requires UI/supported-source confirmation before final promotion.
- Supabase leaked-password protection warning: `CONFIG_REVIEW_NEEDED`; no unapproved Auth config change during freeze.
- MFA expansion: not a Ver.1.0 scope change.
- JP Motion Media: `PREVIEW_ONLY` pending cut/mapping/device QA.
- Ryu/other 29 Motion Media: not part of the core Ver.1.0 release gate.

## Safety record

```text
PRODUCTION_CHANGED = NO
DB_CHANGED = NO
MAIN_CHANGED = NO
SF6DNA_V2_CHANGED = NO
VER1_1_CHANGED = NO
```
