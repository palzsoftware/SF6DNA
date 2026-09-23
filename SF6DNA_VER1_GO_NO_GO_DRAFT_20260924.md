# SF6DNA Ver.1.0 — GO / NO-GO Draft

Date: 2026-09-24
Status: `CONDITIONAL_GO_PREP / FINAL_GO_NOT_YET`

This is a release decision draft. It does not authorize Production promotion, alias changes, environment changes, or DB writes.

## Fresh release baseline

Freshly rechecked on 2026-09-24 during the overnight release-preparation pass.

- RC branch: `sf6dna-v2-chatgpt-rc-20260916`
- RC HEAD before this evidence-only refresh: `143925ed88c06a776f51da330feb4f522f3fcb0f`
- Last application-code security fix: `ce5f111c4d50b9ba7b875fb25a37db1cb01a1be6`
- Auth regression contract: `aff8f00f935ec2eadf9966dd248651478f4071e6`
- Fresh RC Preview deployment: `dpl_H51SiJxu9Q2gbPbCCmyoRCpBMFo9`
- Fresh RC Preview URL: `sf-6-vtawhp6g0-somas11620-9368.vercel.app`
- Fresh RC Preview commit: `143925ed88c06a776f51da330feb4f522f3fcb0f`
- Fresh RC Preview state: `READY`
- GitHub/Vercel combined status for `143925ed...`: `success`
- Fresh Preview runtime `error` / `fatal` query: no matching logs in the checked 6-hour window
- Preview remains Vercel-protected/noindex; an unauthenticated direct fetch can therefore return the Vercel SSO redirect instead of the application response and must not be misclassified as an application failure.

Current Production is still unchanged:

- alias: `sf-6-dna.vercel.app`
- deployment: `dpl_3T4VAzUWb57vwaN6HphfNGucDPVL`
- SHA: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- state: `READY`

## Current decision

```text
FINAL_GO = NO, NOT YET
CURRENT_CLASSIFICATION = CONDITIONAL_GO_PREP
NEW_CONFIRMED_P0 = NONE
PRODUCTION_CHANGED = NO
DB_CHANGED = NO
```

Reason: the RC has no newly confirmed P0 in the latest ChatGPT-only audits, but final user/device acceptance and Production environment confirmation are still outstanding. The most recent application-code change has targeted regression evidence and a successful Vercel build, but the older 255/255 full-suite baseline predates that auth hardening change.

## Evidence that currently supports GO

### Core application / release baseline

Earlier final-RC evidence recorded:

- Character shared template 31/31 regression PASS
- Player/Search/Video/Diagnosis/Daily regression PASS
- Full tests 255/255 PASS
- Release gates 14/14 PASS
- TypeScript/Lint/Build/diff PASS

This remains useful historical evidence, but it is not treated as a fresh full-suite run for the latest auth code.

### Latest auth/security delta

Release hardening added same-origin return-path validation for `/auth?next=...`.

Targeted evidence:

- auth UI targeted tests: 3/3 PASS in the recorded isolated replay
- redirect behavior cases: 5/5 PASS
- malicious protocol-relative / absolute-external / backslash-host-like values fall back safely
- Vercel Preview build for the auth-fix lineage: READY

### Fresh RC deployment evidence

The current candidate lineage was rechecked after the GO/NO-GO draft was created:

```text
RC_SOURCE_HEAD = 143925ed88c06a776f51da330feb4f522f3fcb0f
PREVIEW_DEPLOYMENT = dpl_H51SiJxu9Q2gbPbCCmyoRCpBMFo9
PREVIEW_STATE = READY
VERCEL_COMMIT_STATUS = success
PREVIEW_ERROR_FATAL_6H = NONE_FOUND
```

The commits after the auth application change are release-evidence/documentation commits, not application-code changes.

### Full regression execution path

`.github/workflows/v2-web-check.yml` was freshly inspected. It includes `workflow_dispatch` and runs:

1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm test`
5. `npm run build`

Its automatic `push` trigger is limited to `sf6dna-v2`, but the workflow itself is manually dispatchable. The currently available GitHub connector can read workflow state/jobs/logs and retry existing jobs, but it does not expose a new workflow-dispatch action. The container runner also cannot reach GitHub to clone the repository. Therefore a fresh full run was **not silently claimed** in this pass.

This is a tooling-execution limitation, not a discovered application defect.

### Public DB/security boundary

Latest read-only audit found:

- no direct `anon` / `authenticated` read/write grants to current contact storage
- Contact uses the intended RPC path
- inspected public-source RPCs retain bounded public-result behavior
- no confirmed new public-table P0 from the audit

No DB mutation is justified by stale/mismatched Advisor text alone.

### Motion Media

Current media decision is intentionally outside the core Ver.1.0 gate:

```text
JP_MEDIA = PREVIEW_ONLY
RYU_MEDIA = HOLD_SOURCE_TRANSFER / TEMPLATE_TARGET
OTHER_29 = VIDEO_WAITING / TEMPLATE_TARGET
```

The reported unwanted JP spacing walks, remaining mapping review, 375px media QA, and reduced-motion media QA therefore do not block the core release while media stays excluded from Production.

## Remaining release gates

### Gate A — Final RC freeze

Status: `PENDING`

Before release, record the exact final RC SHA and stop adding nonessential changes. Documentation-only release evidence may continue until the freeze point, but application code changes after freeze require a new regression decision.

### Gate B — Fresh regression after latest application-code change

Status: `PENDING_OR_NEEDS_ACCEPTED_RISK`

The last fresh full-suite baseline (255/255) predates the auth return-path hardening. Current evidence includes targeted auth regression plus Vercel build success, but that is not equivalent to the full suite.

Preferred final-release path:

1. manually dispatch `SF6DNA v2 Web Check` against the final RC branch, or run the equivalent approved repository runner;
2. require Typecheck + Lint + Policy tests + Build to pass;
3. if no approved runner can be executed before release, explicitly record acceptance of the narrower targeted + Vercel-build evidence rather than treating the older 255/255 result as fresh.

### Gate C — User final device acceptance

Status: `USER_ACTION / PENDING`

At minimum verify the release-critical public routes on the intended PC/mobile devices. Keep Motion Media-only checks separate if the media feature remains Preview-only.

### Gate D — Production environment assignment

Status: `USER_ACTION / PENDING`

The code contract is verified, but the available read-only Vercel connector does not expose the required Production/Preview environment-variable key scope listing through the currently available project/deployment tools.

Before final promotion, confirm in Vercel UI or another supported source that the intended Production assignments exist for the required release variables. Secret values do not need to be shared.

### Gate E — Explicit Production approval

Status: `USER_ACTION / PENDING`

No Production deploy/alias/env change may occur until the user explicitly approves the final RC promotion.

## Risk register

| Item | Classification | Release effect |
|---|---|---|
| Auth return-path open-redirect edge case | FIXED_IN_RC | Must remain covered by final regression |
| Explicit per-route canonical | SEO_FOLLOW_UP | Not current release blocker |
| Exact Vercel Production env scopes | UNVERIFIED | Final GO gate |
| Supabase leaked-password protection warning | CONFIG_REVIEW_NEEDED | Carry as explicit risk; no unapproved freeze-time config change |
| MFA expansion | POST_V1_SECURITY_SCOPE | Not a Ver.1.0 scope addition |
| Advisor/catalog mismatch | RECHECK_REQUIRED | Do not mutate DB speculatively |
| JP spacing walks / mapping review | MEDIA_PREVIEW_ONLY | Not core release blocker |
| Ryu + remaining 29 recordings | POST_CORE_RELEASE_MEDIA_ROLLOUT | Not core release blocker |

## GO condition

Final status may change to `GO` only when all of the following are true:

```text
FINAL_RC_SHA = FROZEN
CONFIRMED_P0 = 0
FINAL_REGRESSION = PASS or EXPLICITLY_ACCEPTED_NARROW_EVIDENCE
USER_DEVICE_ACCEPTANCE = PASS
PRODUCTION_ENV_ASSIGNMENT = CONFIRMED
PRODUCTION_PROMOTION_APPROVAL = EXPLICIT
ROLLBACK_ANCHOR = RECORDED
```

After those are satisfied, use `SF6DNA_VER1_PRODUCTION_SMOKE_ROLLBACK_RUNBOOK_20260924.md` for the post-promotion smoke and rollback decision.

## NO-GO conditions

Keep `NO-GO` if any of these is true at release time:

- confirmed repeatable P0 remains open;
- final RC Preview does not build or does not match the intended SHA;
- required Production environment assignment is missing or points to the wrong backend/project;
- user device acceptance finds a release-critical navigation/render/auth failure;
- final regression finds a release-critical failure;
- rollback anchor is unknown;
- Production promotion has not been explicitly approved.

## Next ChatGPT-only action

Keep the RC application code frozen unless a release-critical defect is discovered. On the next pass, first verify that this evidence-only commit receives a READY Preview and that the production rollback anchor remains unchanged; then continue release-evidence consolidation rather than reopening Motion Media or nonessential feature work.

## Safety record

```text
PRODUCTION_CHANGED = NO
DB_CHANGED = NO
MAIN_CHANGED = NO
SF6DNA_V2_CHANGED = NO
VER1_1_CHANGED = NO
```
