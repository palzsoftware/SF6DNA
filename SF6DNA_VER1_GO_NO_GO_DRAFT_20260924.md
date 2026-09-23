# SF6DNA Ver.1.0 — GO / NO-GO Draft

Date: 2026-09-24
Status: `CONDITIONAL_GO_PREP / FINAL_GO_NOT_YET`

This is the current release decision draft. It does not authorize Production promotion, alias/env changes, DB writes, or changes to `main`, `sf6dna-v2`, or Ver.1.1.

## Fresh release baseline

```text
RC_BRANCH = sf6dna-v2-chatgpt-rc-20260916
FINAL_RC_APPLICATION_SHA = 95ad9718ec27ce937a1ffc59deae1a4bc48c13eb
FINAL_RC_PREVIEW_DEPLOYMENT = dpl_3Vuj32UB1Y1vC52cL3tCTZrb4TMx
FINAL_RC_PREVIEW_STATE = READY
FINAL_RC_PREVIEW_TARGET = preview
CURRENT_PRODUCTION_DEPLOYMENT = dpl_3T4VAzUWb57vwaN6HphfNGucDPVL
CURRENT_PRODUCTION_SHA = b9a2a8f638a3d4a98bfa042d56470664fe225ba7
CURRENT_PRODUCTION_STATE = READY
```

Application code should remain frozen unless a release-critical defect is discovered.

## Current decision

```text
FINAL_GO = NO, NOT YET
CURRENT_CLASSIFICATION = CONDITIONAL_GO_PREP
NEW_CONFIRMED_P0 = NONE
FRESH_FULL_REGRESSION = PASS
PRODUCTION_CHANGED = NO
DB_CHANGED = NO
```

The fresh regression blocker is closed. Final GO is still withheld because device acceptance, Production environment assignment, and explicit Production promotion approval are pending.

## Evidence supporting GO

### Exact-SHA full regression

GitHub Actions run `35926383201` executed against exact application SHA `95ad9718ec27ce937a1ffc59deae1a4bc48c13eb` and completed successfully.

Required steps:

- Typecheck: PASS
- Lint: PASS
- Policy tests: PASS
- Build: PASS

Classification:

```text
FINAL_REGRESSION = PASS
```

The older 255/255 result remains historical evidence only; it is no longer being used as a substitute for the final RC regression gate.

### Preview / runtime evidence

For exact application SHA `95ad9718...`:

- Vercel Preview is `READY`.
- Home fetch returned HTTP 200.
- Checked Preview runtime `error` / `fatal` logs: none found in the 6-hour query window.
- Home response carries `x-robots-tag: noindex`.
- Open Graph / Twitter image URLs are absolute HTTPS URLs against the RC branch alias.
- Authenticated `/robots.txt` returns `Disallow: /` for all user agents.

### Auth/security delta

The hardened `/auth?next=...` validator remains in the exact-SHA regression run. It parses against a fixed origin, requires same-origin output, and returns only local pathname/search/hash. External, protocol-relative, malformed, and backslash-host-like values fall back safely.

### Public DB/security boundary

Latest read-only evidence remains unchanged:

- no approved reason to perform freeze-time DB writes;
- Contact remains on the intended RPC boundary;
- no newly confirmed public-table P0;
- stale/mismatched Advisor text is not treated as authority over current catalog state.

No DB mutation is authorized by this draft.

## Metadata / environment result

Code contract:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
SF6DNA_BACKEND_URL
VERCEL_URL
VERCEL_ENV
```

Vercel documentation confirms `VERCEL_URL` and `VERCEL_ENV` are deployment system variables. Current Preview behavior verifies deployment-aware metadata and Preview noindex behavior.

However, the available read-only Vercel connector does not expose the project's configured environment-variable key/scope listing. Therefore the actual user-configured **Production** assignment remains unverified here.

```text
PREVIEW_METADATA_BASE = VERIFIED
PREVIEW_NOINDEX = VERIFIED
PRODUCTION_ENV_ASSIGNMENT = USER_ACTION / PENDING
```

No explicit per-route canonical contract is present. This remains an SEO follow-up, not a core release blocker.

## Motion Media boundary

```text
JP_MEDIA = PREVIEW_ONLY / HELD_MAPPING_FILTER_ACTIVE
RYU_MEDIA = SOURCE_LOCATED / RAW_TRANSFER_HELD / TEMPLATE_TARGET
OTHER_29 = VIDEO_WAITING / TEMPLATE_TARGET
```

JP spacing-walk re-cut, remaining mapping review, 375px media QA, reduced-motion media QA, Ryu ingest, and the remaining 29 characters do not block the core release while Motion Media stays excluded from Production. Unknown mappings remain `MAPPING_HOLD` rather than being guessed.

## Remaining release gates

### Gate A — Final application freeze

Status: `PASS / FROZEN_CANDIDATE`

`95ad9718ec27ce937a1ffc59deae1a4bc48c13eb` is the current frozen application candidate. Documentation-only evidence commits may continue. Any application-code change reopens the regression gate.

### Gate B — Fresh regression

Status: `PASS / CLOSED`

Exact-SHA full Web Check completed successfully.

### Gate C — User final device acceptance

Status: `USER_ACTION / PENDING`

Verify release-critical public routes on intended PC and iPhone/mobile devices. Motion Media-only checks may remain separate while Motion Media is excluded from Production.

### Gate D — Production environment assignment

Status: `USER_ACTION / PENDING`

Confirm through Vercel UI or another supported source that intended Production key/scope assignments exist. Secret values do not need to be shared.

### Gate E — Character Detail human copy acceptance

Status: `USER_ACTION / PENDING`

Character Detail body copy requiring human judgment remains explicitly outside ChatGPT-only completion.

### Gate F — Explicit Production approval

Status: `USER_ACTION / PENDING`

No Production deploy/alias/env change may occur until explicit approval names the frozen application SHA.

## Risk register

| Item | Classification | Release effect |
|---|---|---|
| Auth return-path edge case | `FIXED / REGRESSION_PASS` | Closed |
| Fresh full regression | `PASS` | Closed |
| Explicit per-route canonical | `SEO_FOLLOW_UP` | Not core blocker |
| Exact Vercel Production env scopes | `UNVERIFIED` | Final GO gate |
| Supabase leaked-password protection warning | `CONFIG_REVIEW_NEEDED` | Carry risk; no unapproved freeze-time config change |
| MFA expansion | `POST_V1_SECURITY_SCOPE` | Not Ver.1.0 scope addition |
| Advisor/catalog mismatch | `RECHECK_REQUIRED` | Do not mutate DB speculatively |
| JP spacing walks / mapping review | `MEDIA_PREVIEW_ONLY` | Not core blocker |
| Ryu + remaining 29 recordings | `POST_CORE_RELEASE_MEDIA_ROLLOUT` | Not core blocker |

## GO condition

Final status may change to `GO` only when all are true:

```text
FINAL_RC_APPLICATION_SHA = 95ad9718ec27ce937a1ffc59deae1a4bc48c13eb
CONFIRMED_P0 = 0
FINAL_REGRESSION = PASS
USER_DEVICE_ACCEPTANCE = PASS
CHARACTER_DETAIL_HUMAN_ACCEPTANCE = PASS
PRODUCTION_ENV_ASSIGNMENT = CONFIRMED
PRODUCTION_PROMOTION_APPROVAL = EXPLICIT
ROLLBACK_ANCHOR = RECORDED
```

After approval, use `SF6DNA_VER1_PRODUCTION_SMOKE_ROLLBACK_RUNBOOK_20260924.md` for post-promotion smoke and rollback handling.

## NO-GO conditions

Keep NO-GO if any of these is true at release time:

- confirmed repeatable P0 remains open;
- final RC Preview does not match the approved application SHA;
- required Production environment assignment is missing or points to the wrong backend/project;
- device acceptance finds a release-critical render/navigation/auth failure;
- Character Detail human acceptance finds release-critical public wording/data issues;
- application code changes without a new exact-SHA regression pass;
- rollback anchor is unknown;
- Production promotion has not been explicitly approved.

## Safety record

```text
PRODUCTION_CHANGED = NO
DB_CHANGED = NO
MAIN_CHANGED = NO
SF6DNA_V2_CHANGED = NO
VER1_1_CHANGED = NO
```

## Next ChatGPT-only action

Keep the application candidate frozen. Continue read-only release evidence checks only; do not reopen nonessential features or retry failed media-transfer paths without a new supported route.
