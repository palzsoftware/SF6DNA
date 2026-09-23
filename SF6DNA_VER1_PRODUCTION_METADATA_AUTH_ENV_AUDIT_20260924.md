# SF6DNA Ver.1.0 — Production Metadata / Auth Redirect / Env Read-only Audit

Date: 2026-09-24
Scope: Release-candidate branch only. No Production deploy/alias/env changes and no DB writes.

## 1. Fresh baseline

```text
RC_APPLICATION_SHA = 95ad9718ec27ce937a1ffc59deae1a4bc48c13eb
PREVIEW_DEPLOYMENT = dpl_3Vuj32UB1Y1vC52cL3tCTZrb4TMx
PREVIEW_STATE = READY
PREVIEW_TARGET = preview
PRODUCTION_DEPLOYMENT = dpl_3T4VAzUWb57vwaN6HphfNGucDPVL
PRODUCTION_SHA = b9a2a8f638a3d4a98bfa042d56470664fe225ba7
PRODUCTION_STATE = READY
```

## 2. Metadata base contract

`v2-web/src/app/layout.tsx` resolves `metadataBase` in this order:

1. `NEXT_PUBLIC_SITE_URL`
2. `VERCEL_URL` converted to `https://<VERCEL_URL>`
3. undefined when neither resolves to a valid URL

`robots.ts` and `sitemap.ts` use the same explicit-site-URL-first / `VERCEL_URL` fallback policy. Both use `VERCEL_ENV` to distinguish Preview from Production behavior.

Vercel documentation confirms:

- `VERCEL_URL` is a system environment variable containing the deployment domain without scheme;
- `VERCEL_ENV` identifies `production`, `preview`, or `development`;
- `VERCEL_PROJECT_PRODUCTION_URL` also exists, but the current SF6DNA code does not depend on it.

No code change was made during this audit because the current behavior is working and release freeze should avoid nonessential metadata refactors.

## 3. Fresh Preview runtime verification

Authenticated read of the exact-SHA Preview home returned HTTP 200.

Rendered metadata contains absolute URLs such as:

```text
https://sf-6-dna-git-sf6dna-v2-chatgpt-rc-20260916-somas11620-9368.vercel.app/opengraph-image?... 
https://sf-6-dna-git-sf6dna-v2-chatgpt-rc-20260916-somas11620-9368.vercel.app/twitter-image?...
```

This verifies that `metadataBase` resolves to an absolute Preview HTTPS base in the current Vercel environment.

The same response contains:

```text
x-robots-tag: noindex
```

Authenticated `/robots.txt` returned:

```text
User-Agent: *
Disallow: /
```

Therefore Preview indexing suppression is working in runtime, not only in static code review.

Direct authenticated retrieval of `/sitemap.xml` through the current connector remains constrained by Vercel SSO handling on that path. Static code review confirms `sitemap()` returns an empty list whenever `VERCEL_ENV` exists and is not `production`. Do not claim a direct runtime sitemap body PASS from this connector limitation.

## 4. Canonical

No explicit `alternates.canonical` contract is present in root metadata and the fetched Preview home does not expose a `rel="canonical"` link.

Status:

```text
EXPLICIT_CANONICAL = NOT_RELEASE_BLOCKING / SEO_FOLLOW_UP
```

Do not add a root-level global canonical during release freeze because that could incorrectly canonicalize child routes.

## 5. Auth return path

The release-hardened `/auth?next=...` validator:

- parses against a fixed dummy origin;
- requires the parsed origin to stay equal to the dummy origin;
- returns only pathname + search + hash;
- falls back to `/` for malformed or cross-origin input.

Current exact-SHA full regression includes the hardened Auth behavior and completed successfully.

Classification:

```text
AUTH_RETURN_PATH = FIXED / REGRESSION_PASS
```

## 6. Fresh full regression

GitHub Actions exact-SHA run:

```text
WORKFLOW = SF6DNA v2 Web Check
RUN_ID = 35926383201
JOB_ID = 107402354050
HEAD_SHA = 95ad9718ec27ce937a1ffc59deae1a4bc48c13eb
STATUS = completed
CONCLUSION = success
```

All required workflow steps completed successfully:

- Typecheck: PASS
- Lint: PASS
- Policy tests: PASS
- Build: PASS

```text
FRESH_FULL_REGRESSION = PASS / CLOSED
```

## 7. Environment variable contract

Repository contract (`v2-web/.env.example` and runtime code):

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
SF6DNA_BACKEND_URL
VERCEL_URL
VERCEL_ENV
```

Fresh conclusions:

```text
CODE_ENV_CONTRACT = VERIFIED
VERCEL_SYSTEM_ENV_CONTRACT = VERIFIED_FROM_VERCEL_DOCS
PREVIEW_METADATA_RESOLUTION = VERIFIED_AT_RUNTIME
PREVIEW_NOINDEX = VERIFIED_AT_RUNTIME
PRODUCTION_PROJECT_ENV_SCOPE = UNVERIFIED_BY_AVAILABLE_READ_ONLY_TOOL
```

The available Vercel deployment/project read tools expose deployments, aliases, target environment, runtime logs, and deployment metadata, but not the configured project environment-variable key/scope listing. Therefore do not infer that user-configured Production variables are present merely because Preview works.

Before Production promotion, confirm the intended Production key/scope assignments in Vercel UI or another supported source. Secret values do not need to be copied or shared.

## 8. Production boundary / rollback

Production remains unchanged:

```text
ALIAS = sf-6-dna.vercel.app
DEPLOYMENT = dpl_3T4VAzUWb57vwaN6HphfNGucDPVL
SHA = b9a2a8f638a3d4a98bfa042d56470664fe225ba7
STATE = READY
```

Fresh project runtime-error query over the checked 24-hour window returned no grouped runtime errors.

No Production alias, deployment, or environment setting was changed.

## 9. Release status

```text
NEW_P0_BLOCKER = NONE
AUTH_REDIRECT_GATE = CLOSED
FRESH_REGRESSION_GATE = CLOSED
METADATA_BASE_PREVIEW = PASS
PREVIEW_NOINDEX = PASS
PRODUCTION_ENV_ASSIGNMENT = USER_ACTION / PENDING
CANONICAL = SEO_FOLLOW_UP
```

The remaining environment gate is about confirming Production assignment, not discovering a current Preview defect.

## 10. Next ChatGPT-only action

Keep application code frozen. Continue read-only release evidence consolidation only. Production env confirmation, device acceptance, Character Detail human acceptance, and Production promotion approval remain USER_ACTION gates.
