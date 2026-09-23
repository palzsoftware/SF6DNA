# SF6DNA Ver.1.0 — Production Metadata / Auth Redirect / Env Read-only Audit

Date: 2026-09-24

## Scope

Release-candidate branch only. No Production alias/deploy/env changes and no DB writes.

Fresh base before this audit: `19f0003aa0c758411e12b7bac0d054d0eb343252`.

## Metadata / site URL

`v2-web/src/app/layout.tsx` resolves `metadataBase` in this order:

1. `NEXT_PUBLIC_SITE_URL`
2. `VERCEL_URL` as `https://<VERCEL_URL>`
3. undefined if neither is available or the result is invalid

`robots.ts` and `sitemap.ts` use the same explicit-site-URL-first / Vercel-URL-fallback policy. Preview deployments are excluded from sitemap indexing and Vercel also returns `x-robots-tag: noindex` on the protected Preview.

Fresh RC Preview `19f0003aa0c758411e12b7bac0d054d0eb343252` rendered absolute Open Graph / Twitter image URLs against the RC branch alias, so `metadataBase` is resolving to an absolute Preview URL in the current Preview environment.

### Canonical

No explicit `alternates.canonical` contract was found in the root metadata, and the fetched RC home HTML did not contain a `rel="canonical"` link.

Status: `NOT_RELEASE_BLOCKING / SEO_FOLLOW_UP`.

Reason: adding a root-level canonical without a per-route contract could incorrectly canonicalize child pages. Do not guess a Production domain or add a global canonical during the release freeze.

## Auth return path audit

The `/auth` page accepts a local `next` destination and passes it to the client login form after server-side validation.

The previous validation rejected `//host` but only used string-prefix checks. WHATWG URL parsing treats a value such as `/\\evil.example` as a cross-origin URL, so the old check was not sufficiently strict for an attacker-supplied return path.

Release fix applied:

- parse the candidate against a fixed dummy origin;
- require the parsed origin to remain equal to that dummy origin;
- pass only parsed pathname + search + hash to the client router;
- malformed or cross-origin candidates fall back to `/`.

Commits:

- `ce5f111c4d50b9ba7b875fb25a37db1cb01a1be6` — auth return-path hardening
- `aff8f00f935ec2eadf9966dd248651478f4071e6` — static regression contract

Targeted verification:

- `auth-session-ui.test.mjs`: 3/3 PASS in isolated local replay of the committed source/test contents
- redirect behavior cases: 5/5 PASS (`/characters/...`, `//evil`, `/\\evil`, absolute external URL, missing value)

Full suite was not re-run in this connector-only run. Vercel Preview build is the build/type integration gate for the pushed RC commits.

## Environment variable contract

Repository contract (`v2-web/.env.example` and runtime code):

- `NEXT_PUBLIC_SUPABASE_URL` — public browser/server Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public browser/server anon key
- `NEXT_PUBLIC_SITE_URL` — explicit public site base URL for metadata / robots / sitemap
- `SF6DNA_BACKEND_URL` — backend endpoint, with the current Render URL as code fallback
- `VERCEL_URL` / `VERCEL_ENV` — Vercel system environment values used for deployment-aware URL/indexing behavior

The available Vercel read-only connector does not expose project environment-variable keys/scopes, so the exact Production/Preview scope assignment cannot be independently verified in this run without changing settings or using unsupported APIs.

Status:

- code contract: `VERIFIED`
- current Preview URL resolution: `VERIFIED`
- actual Vercel Production env key/scope assignment: `UNVERIFIED_BY_AVAILABLE_READ_ONLY_TOOL`

Do not infer secret values and do not change Production env during this audit.

## Current Preview / Production boundary

Fresh Preview before the auth fix:

- RC SHA: `19f0003aa0c758411e12b7bac0d054d0eb343252`
- Deployment: `dpl_CM138ndifdkp7D2qVxsqhzKnsGsD`
- State: `READY`
- Target: Preview (`target=null`)

Current Production alias remains on the pre-Ver.1 Next/legacy deployment:

- Alias: `sf-6-dna.vercel.app`
- Deployment: `dpl_3T4VAzUWb57vwaN6HphfNGucDPVL`
- Production SHA: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- State: `READY`

No Production alias or deployment was changed.

## Release status

- New P0 blocker: `NONE`
- P1 fixed in RC: `AUTH_NEXT_RETURN_PATH_HARDENING`
- SEO follow-up: `EXPLICIT_PER_ROUTE_CANONICAL_CONTRACT`
- USER_ACTION / release approval: verify intended Production env assignment before final Production promotion if Vercel UI access is available; no values need to be shared.

## Next ChatGPT-only batch

After the auth-fix Preview reaches READY, perform Preview smoke for `/auth` and continue Release Evidence / rollback / Production Smoke Runbook preparation. Keep Motion Media device-only checks separated as USER_ACTION.
