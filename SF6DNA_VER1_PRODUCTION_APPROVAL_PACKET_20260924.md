# SF6DNA Ver.1.0 — Production Approval Packet

Date: 2026-09-24
Status: `CONDITIONAL_GO_PREP / PRODUCTION_NOT_AUTHORIZED`

This packet is the current release-approval source of truth. It does **not** authorize Production deploy/alias/env changes, DB writes, or changes to `main`, `sf6dna-v2`, or Ver.1.1.

## 1. Frozen application candidate

```text
RC_BRANCH = sf6dna-v2-chatgpt-rc-20260916
RC_APPLICATION_SHA = 978e2a99888cd87736ac26c7c2f74fa5f8a95650
RC_APPLICATION_PREVIEW_DEPLOYMENT = dpl_4y2kmbwZhuYrHuJsc7dVmRMVeEq5
RC_APPLICATION_PREVIEW_URL = sf-6-bm067naxk-somas11620-9368.vercel.app
RC_BRANCH_ALIAS = sf-6-dna-git-sf6dna-v2-chatgpt-rc-20260916-somas11620-9368.vercel.app
RC_APPLICATION_PREVIEW_STATE = READY
RC_APPLICATION_PREVIEW_TARGET = preview
```

`95ad9718ec27ce937a1ffc59deae1a4bc48c13eb` was the previous frozen candidate. It was superseded only by the final non-Character Public Copy cleanup in `978e2a99888cd87736ac26c7c2f74fa5f8a95650`.

The superseding application commit changes user-facing copy and matching policy assertions only. It does not change routes, DB/API contracts, Character Detail character-specific body copy, Production configuration, `main`, `sf6dna-v2`, or Ver.1.1.

Application code should remain frozen unless a release-critical defect is found. Documentation-only evidence commits may follow without changing the application candidate.

## 2. Fresh full regression — CLOSED

Exact-SHA GitHub Actions evidence exists for `978e2a99888cd87736ac26c7c2f74fa5f8a95650`.

```text
WORKFLOW = SF6DNA v2 Web Check
RUN_ID = 35932977363
JOB_ID = 107423587106
STATUS = completed
CONCLUSION = success
```

All release-check steps completed successfully:

- Install dependencies: PASS
- Typecheck: PASS
- Lint: PASS
- Policy tests (`npm test`): PASS
- Build (`npm run build`): PASS

Classification:

```text
FRESH_FULL_REGRESSION = PASS / CLOSED
```

The prior exact-SHA run for `95ad9718...` remains historical evidence only. The current release decision uses the fresh successful run for `978e2a998...`.

## 3. Fresh Preview / runtime evidence

For the exact application SHA above:

- Vercel deployment `dpl_4y2kmbwZhuYrHuJsc7dVmRMVeEq5` is `READY` and SHA-matched.
- Home fetch returned HTTP 200 through the authenticated Vercel connector.
- Preview runtime `error` / `fatal` query over the checked 6-hour window returned no matching logs.
- Home response includes `x-robots-tag: noindex`.
- Open Graph / Twitter image URLs resolve as absolute HTTPS URLs against the RC branch alias.
- Route-level copy fetches such as `/players` are still redirected to Vercel SSO in this read-only fetch path, so final route-level visual copy acceptance remains USER_ACTION rather than being inferred from static/CI evidence.

This confirms the current Preview is built and reachable at the root while preserving the Preview noindex boundary. It does not claim protected route-level visual acceptance.

## 4. Final Public Copy boundary

The final non-Character Public Copy cleanup in the frozen application candidate covers three safe wording adjustments:

- Diagnosis save-failure guidance: replace the internal save-ID retry wording with a user-facing retry action.
- Players rank-filter unavailable state: describe the current unavailable state without speculative timing/data promises.
- Daily / Training notice: explain that completion state is not persisted and that unverified move/combo information is not shown.

The dedicated Public Copy review records:

```text
NON_CHARACTER_PUBLIC_COPY = CODE_REVIEW_PASS
CHARACTER_DETAIL_BODY_COPY = USER_ACTION / HOLD
BROWSER_COPY_QA = NOT_RUN_AUTH_PROTECTED
```

No new internal-term leak or release-critical copy defect is confirmed in the reviewed scope.

## 5. Metadata / canonical boundary

Current code resolves site metadata base in this order:

1. `NEXT_PUBLIC_SITE_URL`
2. Vercel system `VERCEL_URL`
3. undefined outside those environments

`robots.ts` / `sitemap.ts` use the same explicit-site-URL-first behavior and use `VERCEL_ENV` to suppress Preview indexing.

No explicit per-route canonical contract is currently present.

Classification:

```text
METADATA_BASE_PREVIEW = VERIFIED
PREVIEW_NOINDEX = VERIFIED
EXPLICIT_CANONICAL = SEO_FOLLOW_UP / NOT_RELEASE_BLOCKING
```

Do not add a global root canonical during release freeze because it could canonicalize child routes incorrectly.

## 6. Production environment gate

Repository contract requires or uses:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
SF6DNA_BACKEND_URL
VERCEL_URL (Vercel system variable)
VERCEL_ENV (Vercel system variable)
```

The current Preview demonstrates that deployment-aware metadata / noindex behavior works. However, the currently available read-only Vercel connector does **not** expose the project's configured environment-variable key/scope listing. Therefore the exact Production assignment of user-configured variables cannot be independently verified here.

```text
CODE_ENV_CONTRACT = VERIFIED
VERCEL_SYSTEM_ENV_BEHAVIOR = VERIFIED
PREVIEW_METADATA_RESOLUTION = VERIFIED
PRODUCTION_PROJECT_ENV_SCOPE = UNVERIFIED_BY_AVAILABLE_READ_ONLY_TOOL
```

Before final promotion, confirm in Vercel UI or another supported source that the intended **Production** assignments exist for the required Supabase and site URL variables. Secret values do not need to be copied into release evidence.

This remains a final GO gate.

## 7. Production rollback anchor

Production remains intentionally unchanged:

```text
PRODUCTION_ALIAS = sf-6-dna.vercel.app
PRODUCTION_DEPLOYMENT = dpl_3T4VAzUWb57vwaN6HphfNGucDPVL
PRODUCTION_SHA = b9a2a8f638a3d4a98bfa042d56470664fe225ba7
PRODUCTION_STATE = READY
```

Use `SF6DNA_VER1_PRODUCTION_SMOKE_ROLLBACK_RUNBOOK_20260924.md` after any explicitly approved promotion.

## 8. Motion Media release boundary

Motion Media remains outside the core Ver.1.0 Production gate unless explicitly added later.

```text
JP_MEDIA = PREVIEW_ONLY / HELD_MAPPING_FILTER_ACTIVE
RYU_MEDIA = TEMPLATE_TARGET / SOURCE_LOCATED / RAW_TRANSFER_HELD
OTHER_29 = VIDEO_WAITING / TEMPLATE_TARGET
```

- Confirmed ambiguous JP mappings remain held and filtered from Preview output.
- JP spacing-walk sections remain re-cut review work.
- Unknown mappings must remain `MAPPING_HOLD`; do not guess.
- Ryu source masters are located; no re-recording is required.
- Do not retry the same failed raw-materialization path repeatedly.

These items do not block core Ver.1.0 while Motion Media remains excluded from Production.

## 9. Remaining USER_ACTION gates

| Gate | Status | Required evidence |
|---|---|---|
| PC final acceptance | `PENDING` | Release-critical public routes render/navigate correctly |
| iPhone/mobile final acceptance | `PENDING` | Release-critical public routes render/navigate correctly |
| Character Detail body-copy visual acceptance | `PENDING / USER_ACTION` | User confirms final public wording where human judgment is required |
| Protected route-level Public Copy visual acceptance | `PENDING / USER_ACTION` | Final three copy changes render naturally in authenticated Preview |
| Production env assignment | `PENDING / USER_ACTION` | Intended Production key/scope assignment confirmed; no secret values needed |
| Production promotion approval | `PENDING / USER_ACTION` | Explicit approval naming the frozen application SHA to promote |

Game recording and 8 Game Verification remain USER_ACTION but do not become core blockers unless the release scope is changed.

## 10. Current release decision

```text
FINAL_GO = NO, NOT YET
CURRENT_CLASSIFICATION = CONDITIONAL_GO_PREP
NEW_CONFIRMED_P0 = NONE
FRESH_FULL_REGRESSION = PASS
PRODUCTION_CHANGED = NO
DB_CHANGED = NO
MAIN_CHANGED = NO
SF6DNA_V2_CHANGED = NO
VER1_1_CHANGED = NO
```

The exact-SHA regression gate is closed for the current frozen application candidate. Final GO is still withheld because user/device visual acceptance, Production environment assignment, and explicit Production promotion approval remain unresolved.

## 11. Freeze checklist

Before changing `FINAL_GO` to `GO`, require:

```text
FINAL_RC_APPLICATION_SHA = 978e2a99888cd87736ac26c7c2f74fa5f8a95650
FINAL_RC_PREVIEW = READY_AND_SHA_MATCHED
CONFIRMED_P0 = 0
FINAL_REGRESSION = PASS
USER_DEVICE_ACCEPTANCE = PASS
CHARACTER_DETAIL_HUMAN_ACCEPTANCE = PASS
PROTECTED_ROUTE_COPY_ACCEPTANCE = PASS
PRODUCTION_ENV_ASSIGNMENT = CONFIRMED
ROLLBACK_ANCHOR = RECORDED
PRODUCTION_PROMOTION_APPROVAL = EXPLICIT
```

If application code changes after this point, reopen the regression gate and require a new exact-SHA Preview and full Web Check.

## 12. Approval record template

Complete only after explicit Production promotion approval.

```text
APPROVAL_TIME =
APPROVED_FINAL_RC_APPLICATION_SHA = 978e2a99888cd87736ac26c7c2f74fa5f8a95650
APPROVED_PREVIEW_DEPLOYMENT = dpl_4y2kmbwZhuYrHuJsc7dVmRMVeEq5
PRE_RELEASE_PROD_DEPLOYMENT = dpl_3T4VAzUWb57vwaN6HphfNGucDPVL
PRE_RELEASE_PROD_SHA = b9a2a8f638a3d4a98bfa042d56470664fe225ba7
REGRESSION_EVIDENCE = GitHub Actions run 35932977363 / success
DEVICE_ACCEPTANCE =
CHARACTER_DETAIL_HUMAN_ACCEPTANCE =
PROTECTED_ROUTE_COPY_ACCEPTANCE =
PRODUCTION_ENV_ASSIGNMENT =
PROMOTION_APPROVAL = EXPLICIT
```

Until this record is valid, Production promotion remains unauthorized.

## 13. Next ChatGPT-only action

Keep application code frozen at `978e2a99888cd87736ac26c7c2f74fa5f8a95650`. Continue only read-only release checks and evidence consolidation. Do not reopen Motion Media or add nonessential features before the core release.
