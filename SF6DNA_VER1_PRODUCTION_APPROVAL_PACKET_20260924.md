# SF6DNA Ver.1.0 — Production Approval Packet

Date: 2026-09-24
Status: `CONDITIONAL_GO_PREP / PRODUCTION_NOT_AUTHORIZED`

This packet consolidates the current release candidate and outstanding approval gates. It does **not** authorize Production deploy/alias/env changes, DB writes, or any change to `main`, `sf6dna-v2`, or Ver.1.1.

## 1. Candidate baseline

Freshly rechecked before creating this packet.

```text
RC_BRANCH = sf6dna-v2-chatgpt-rc-20260916
RC_SOURCE_HEAD = 8e87978211abd00bfeabaa2f1301d329fd291df6
RC_PREVIEW_DEPLOYMENT = dpl_Exm1JQbcYP9Zn8fqijCmjEuQwP2L
RC_PREVIEW_STATE = READY
RC_PREVIEW_TARGET = preview
```

The current RC head is an evidence/documentation commit. The latest application-code security delta in the lineage is the Auth return-path hardening.

## 2. Fresh CI / security evidence

For current RC SHA `8e87978211abd00bfeabaa2f1301d329fd291df6`:

```text
CODEQL_RUN_ID = 22195512950
CODEQL_EVENT = push
CODEQL_STATUS = completed
CODEQL_CONCLUSION = success
```

A fresh full `SF6DNA v2 Web Check` run is **not** present for this exact RC SHA. The older 255/255 full-suite and 14/14 release-gate results remain historical evidence only because they predate the latest Auth hardening change.

`.github/workflows/v2-web-check.yml` supports `workflow_dispatch`, but the currently available GitHub connector does not expose an action to start a new workflow dispatch. It can inspect/retry existing runs only. Therefore this packet does not claim a fresh full regression that did not occur.

Current classification:

```text
FULL_CURRENT_RC_REGRESSION = PENDING_OR_NEEDS_ACCEPTED_NARROW_EVIDENCE
```

Acceptable release paths are:

1. run the full Web Check against the frozen final RC and require Typecheck + Lint + Tests + Build PASS; or
2. explicitly accept the narrower current evidence consisting of targeted Auth regression + successful Preview build + current CodeQL success.

Do not reinterpret the older 255/255 result as a fresh current-RC result.

## 3. Production rollback anchor

Production was freshly confirmed unchanged during this release-preparation pass.

```text
PRODUCTION_ALIAS = sf-6-dna.vercel.app
PRODUCTION_DEPLOYMENT = dpl_3T4VAzUWb57vwaN6HphfNGucDPVL
PRODUCTION_SHA = b9a2a8f638a3d4a98bfa042d56470664fe225ba7
PRODUCTION_STATE = READY
```

This remains the pre-release rollback anchor. Do not mutate it during preparation.

Use `SF6DNA_VER1_PRODUCTION_SMOKE_ROLLBACK_RUNBOOK_20260924.md` after any explicitly approved promotion.

## 4. Production environment gate

Code-level environment contracts were reviewed earlier, but the currently available read-only Vercel project/deployment connector does not expose a Production/Preview environment-variable key/scope listing.

Status:

```text
PRODUCTION_ENV_ASSIGNMENT = UNVERIFIED_BY_AVAILABLE_READ_ONLY_TOOL
```

Before final promotion, confirm through Vercel UI or another supported source that the intended Production assignments exist for the required release variables. Secret values do not need to be copied into release evidence.

This is a final GO gate because a wrong backend/project assignment can make an otherwise successful build unsafe to promote.

## 5. Motion Media release boundary

Motion Media remains outside the core Ver.1.0 Production gate unless separately completed and explicitly included.

```text
JP_MEDIA = PREVIEW_ONLY
RYU_MEDIA = TEMPLATE_TARGET / SOURCE_TRANSFER_PENDING
OTHER_29 = VIDEO_WAITING / TEMPLATE_TARGET
```

Known JP items remain:

- spacing-walk sections require re-cut review;
- remaining ambiguous move mappings must stay `MAPPING_HOLD` rather than being guessed;
- 375px/reduced-motion media QA remains pending.

These are not reasons to block the core release while Motion Media remains excluded from Production.

## 6. USER_ACTION gates

The following cannot be closed by ChatGPT-only work and remain explicit user-side gates:

| Gate | Status | Required evidence |
|---|---|---|
| PC final acceptance | `PENDING` | Release-critical public routes render/navigate correctly |
| iPhone/mobile final acceptance | `PENDING` | Release-critical public routes render/navigate correctly |
| Character Detail body-copy visual acceptance | `PENDING / USER_ACTION` | User confirms final public wording where human judgment is required |
| Production env assignment | `PENDING / USER_ACTION` | Intended Production key/scope assignment confirmed; no secret values needed |
| Production promotion approval | `PENDING / USER_ACTION` | Explicit approval naming the frozen RC to promote |

Game recording and 8 Game Verification remain USER_ACTION but do not become core release blockers unless the release scope is changed to include unfinished Motion Media/game-verification-dependent content.

## 7. Current release decision

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

## 8. Freeze checklist

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

## 9. Approval record template

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

## 10. Next ChatGPT-only action

Keep application code frozen unless a release-critical defect is found. Verify the Preview generated from this documentation-only packet commit, recheck that Production remains on the recorded rollback anchor, and continue evidence consolidation without reopening nonessential feature work.
