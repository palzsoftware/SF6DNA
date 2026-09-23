# SF6DNA Ver.1.0 — Production Approval Packet

Date: 2026-09-24
Status: `CONDITIONAL_GO_PREP / PRODUCTION_NOT_AUTHORIZED`

This packet consolidates the current release candidate and outstanding approval gates. It does **not** authorize Production deploy/alias/env changes, DB writes, or any change to `main`, `sf6dna-v2`, or Ver.1.1.

## 1. Candidate baseline

Freshly rechecked after the JP Motion Media mapping-hold safety fix.

```text
RC_BRANCH = sf6dna-v2-chatgpt-rc-20260916
RC_APPLICATION_HEAD = fc572ad9c95ed834414df6ebe26737bd4c0ba38b
RC_APPLICATION_PREVIEW_DEPLOYMENT = dpl_5QoVTnMf67cJVeHds5NRgnRK9nYp
RC_APPLICATION_PREVIEW_STATE = READY
RC_APPLICATION_PREVIEW_TARGET = preview
LATEST_DOCS_ONLY_HEAD_BEFORE_PACKET_REFRESH = 068eabc34bac24537981ec55f3e64ce889b68e37
```

The latest application-code delta after Auth hardening is limited to Motion Media pilot safety:

- allow `mapping_hold` as a valid manifest state;
- test the held-state contract;
- filter held clips out of Preview rendering;
- test the Preview filter contract;
- move the confirmed ambiguous JP Zilant mapping from `approved_for_preview` to `mapping_hold`.

The Motion Media pilot remains outside the core Production release boundary.

## 2. Fresh Preview / runtime evidence

For application SHA `fc572ad9c95ed834414df6ebe26737bd4c0ba38b`:

```text
VERCEL_COMBINED_STATUS = success
PREVIEW_STATE = READY
PREVIEW_DEPLOYMENT = dpl_5QoVTnMf67cJVeHds5NRgnRK9nYp
PREVIEW_RUNTIME_ERROR_FATAL_LAST_6H = 0 observed
GITHUB_ACTIONS_RUNS_FOR_EXACT_SHA = 0
```

The Preview build succeeding confirms that the current code builds on Vercel. It is **not** a substitute for the full test suite.

## 3. Fresh CI / regression evidence

A fresh full `SF6DNA v2 Web Check` run is **not** present for the exact current application SHA. The older 255/255 full-suite and 14/14 release-gate results remain historical evidence only because they predate later Auth and Motion Media safety changes.

The repository contains targeted tests for the latest Motion Media safety behavior, but this packet does not mark them as executed merely because the test files exist.

`.github/workflows/v2-web-check.yml` supports `workflow_dispatch`, but the currently available GitHub connector does not expose an action to start a new workflow dispatch. It can inspect/retry existing runs only.

Current classification:

```text
FULL_CURRENT_RC_REGRESSION = PENDING_OR_NEEDS_ACCEPTED_NARROW_EVIDENCE
```

Acceptable release paths are:

1. run the full Web Check against the frozen final RC and require Typecheck + Lint + Tests + Build PASS; or
2. explicitly accept the narrower current evidence consisting of the previously targeted Auth regression, current Vercel Preview build success, exact-SHA runtime error check, and reviewed Motion Media safety delta.

Do not reinterpret the older 255/255 result as a fresh current-RC result.

## 4. Production rollback anchor

Production remains intentionally unchanged during release preparation.

```text
PRODUCTION_ALIAS = sf-6-dna.vercel.app
PRODUCTION_DEPLOYMENT = dpl_3T4VAzUWb57vwaN6HphfNGucDPVL
PRODUCTION_SHA = b9a2a8f638a3d4a98bfa042d56470664fe225ba7
PRODUCTION_STATE = READY
```

This remains the pre-release rollback anchor. Do not mutate it during preparation.

Use `SF6DNA_VER1_PRODUCTION_SMOKE_ROLLBACK_RUNBOOK_20260924.md` after any explicitly approved promotion.

## 5. Production environment gate

Code-level environment contracts were reviewed earlier, but the currently available read-only Vercel project/deployment connector does not expose a Production/Preview environment-variable key/scope listing.

Status:

```text
PRODUCTION_ENV_ASSIGNMENT = UNVERIFIED_BY_AVAILABLE_READ_ONLY_TOOL
```

Before final promotion, confirm through Vercel UI or another supported source that the intended Production assignments exist for the required release variables. Secret values do not need to be copied into release evidence.

This is a final GO gate because a wrong backend/project assignment can make an otherwise successful build unsafe to promote.

## 6. Motion Media release boundary

Motion Media remains outside the core Ver.1.0 Production gate unless separately completed and explicitly included.

```text
JP_MEDIA = PREVIEW_ONLY / HELD_MAPPING_FILTER_ACTIVE
RYU_MEDIA = TEMPLATE_TARGET / SOURCE_LOCATED / RAW_TRANSFER_HELD
OTHER_29 = VIDEO_WAITING / TEMPLATE_TARGET
```

### JP

The confirmed ambiguous `jp-zilant` mapping is now `mapping_hold` and is filtered from Preview output. This closes the immediate risk of knowingly showing the wrong clip under that move name.

Still pending:

- spacing-walk sections require re-cut review;
- any additional ambiguous move mapping must stay `MAPPING_HOLD` rather than be guessed;
- 375px/reduced-motion media QA remains pending.

### Ryu

The four source masters were freshly located in ChatGPT Library under `/SF6DNA/`:

```text
ryu_normals_20260923_take02.mp4
ryu_unique_attacks_20260923_take01.mp4
ryu_specials_20260923_take01.mp4
ryu_super_arts_20260923_take01.mp4
TOTAL_BYTES = 964002738
```

A single direct raw-byte materialization attempt was made and failed because these Project files do not expose an authorized raw-byte materialization path to the current Work runtime. This is not source loss and does not require re-recording or immediate re-upload.

See `SF6DNA_VER1_RYU_TRANSFER_OPTIONS_20260924.md` for the exact transfer state and provider-neutral fallback design.

These Motion Media items are not reasons to block the core release while Motion Media remains excluded from Production.

## 7. USER_ACTION gates

The following cannot be closed by ChatGPT-only work and remain explicit user-side gates:

| Gate | Status | Required evidence |
|---|---|---|
| PC final acceptance | `PENDING` | Release-critical public routes render/navigate correctly |
| iPhone/mobile final acceptance | `PENDING` | Release-critical public routes render/navigate correctly |
| Character Detail body-copy visual acceptance | `PENDING / USER_ACTION` | User confirms final public wording where human judgment is required |
| Production env assignment | `PENDING / USER_ACTION` | Intended Production key/scope assignment confirmed; no secret values needed |
| Production promotion approval | `PENDING / USER_ACTION` | Explicit approval naming the frozen RC to promote |

Game recording and 8 Game Verification remain USER_ACTION but do not become core release blockers unless the release scope is changed to include unfinished Motion Media/game-verification-dependent content.

## 8. Current release decision

```text
FINAL_GO = NO, NOT YET
CURRENT_CLASSIFICATION = CONDITIONAL_GO_PREP
NEW_CONFIRMED_P0 = NONE
PRODUCTION_CHANGED = NO
DB_CHANGED = NO
MAIN_CHANGED = NO
SF6DNA_V2_CHANGED = NO
VER1_1_CHANGED = NO
```

The current candidate has no newly confirmed P0 from the latest ChatGPT-only checks. Final GO is still withheld because final device acceptance, Production environment assignment, and explicit Production approval are unresolved, and current-RC full regression is either still pending or must be explicitly accepted as narrower evidence.

## 9. Freeze checklist

Before changing `FINAL_GO` to `GO`, require all of the following:

```text
FINAL_RC_SHA = FROZEN_AND_RECORDED
FINAL_RC_PREVIEW = READY_AND_SHA_MATCHED
CONFIRMED_P0 = 0
FINAL_REGRESSION = PASS_OR_EXPLICITLY_ACCEPTED_NARROW_EVIDENCE
USER_DEVICE_ACCEPTANCE = PASS
PRODUCTION_ENV_ASSIGNMENT = CONFIRMED
ROLLBACK_ANCHOR = RECORDED
PRODUCTION_PROMOTION_APPROVAL = EXPLICIT
```

If any application-code change is added after RC freeze, reopen the regression decision and create new Preview evidence before promotion.

Documentation-only evidence updates may continue, but avoid unnecessary commits once the final candidate is ready to freeze.

## 10. Approval record template

Complete only when the user explicitly approves Production promotion.

```text
APPROVAL_TIME =
APPROVED_FINAL_RC_SHA =
APPROVED_PREVIEW_DEPLOYMENT =
PRE_RELEASE_PROD_DEPLOYMENT = dpl_3T4VAzUWb57vwaN6HphfNGucDPVL
PRE_RELEASE_PROD_SHA = b9a2a8f638a3d4a98bfa042d56470664fe225ba7
REGRESSION_EVIDENCE =
DEVICE_ACCEPTANCE =
PRODUCTION_ENV_ASSIGNMENT =
PROMOTION_APPROVAL = EXPLICIT
```

Until this record is valid, Production promotion remains unauthorized.

## 11. Next ChatGPT-only action

Keep core application code frozen unless a release-critical defect is found. Do not retry the same Ryu raw-materialization path. Continue read-only release evidence checks and provider-neutral Motion Media ingest design without reopening nonessential features.
