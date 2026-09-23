# SF6DNA Ver.1.0 — GO / NO-GO Draft

Date: 2026-09-24
Status: `CONDITIONAL_GO_PREP / FINAL_GO_NOT_YET`

This is a release decision draft. It does not authorize Production promotion, alias changes, environment changes, or DB writes.

## Fresh release baseline

- RC branch: `sf6dna-v2-chatgpt-rc-20260916`
- RC code/evidence baseline before this draft: `d032ab45a51db36c436077bf2d7233b9b8011d79`
- Last application-code security fix: `ce5f111c4d50b9ba7b875fb25a37db1cb01a1be6`
- Auth regression contract: `aff8f00f935ec2eadf9966dd248651478f4071e6`
- Latest verified application/evidence Preview before this draft: `dpl_BrAxweXaYhTHhZzeaTnK2QCAeVaC` for SHA `5037ed8ef275e06794c210d1b0d96411b63712f9`, `READY`
- GitHub/Vercel combined status for `5037ed8...`: `success`
- Latest checked Preview root: HTTP `200`
- Latest checked Preview error/fatal runtime query: no matching logs in the checked 6-hour window

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

Reason: the RC has no newly confirmed P0 in the latest ChatGPT-only audits, but final user/device acceptance and Production environment confirmation are still outstanding. The most recent application-code change also has targeted regression evidence and a successful Vercel build, but the older 255/255 full-suite baseline predates that auth hardening change.

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
- Vercel Preview build for the auth-fix commit: READY

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

1. run the repository's full `v2-web` test/typecheck/lint/build/release-gate set against the final RC SHA if an approved runner is available;
2. if a runner remains unavailable, explicitly record acceptance of the narrower targeted + Vercel-build evidence before final GO rather than silently treating the old full-suite result as fresh.

### Gate C — User final device acceptance

Status: `USER_ACTION / PENDING`

At minimum verify the release-critical public routes on the intended PC/mobile devices. Keep Motion Media-only checks separate if the media feature remains Preview-only.

### Gate D — Production environment assignment

Status: `USER_ACTION / PENDING`

The code contract is verified, but the available read-only connector cannot enumerate actual Vercel Production/Preview environment key scopes.

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

Continue read-only/fresh release evidence on the final RC candidate, avoid nonessential application changes, and prepare the exact final-freeze snapshot. Do not spend the core release window on JP/Ryu media completion while Motion Media remains Preview-only.

## Safety record

```text
PRODUCTION_CHANGED = NO
DB_CHANGED = NO
MAIN_CHANGED = NO
SF6DNA_V2_CHANGED = NO
VER1_1_CHANGED = NO
```
