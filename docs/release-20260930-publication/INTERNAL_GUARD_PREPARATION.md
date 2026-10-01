# Internal guard — prepared, not applied

Base RC: `f0ef3991`. Route: `/internal/character-preview/[slug]`.

`INTERNAL_GUARD_UNAPPLIED.patch` reuses `requireAdmin()` before awaiting parameters or loading character data. No live route, auth mechanism or public access setting changed. Approval remains `WAITING_FOR_USER_APPROVAL`.

The six offline tests execute the existing `requireAdmin` implementation and the prepared route with mocked Supabase and navigation: anonymous redirect, nonadmin redirect, profile error redirect, admin access, admin unknown-character 404, and unchanged live-route hash. They passed. This is `MOCK_PASS`; it does not establish real administrator login or device QA.

Run: `node --test scripts/tests/internal-guard-preparation.test.cjs`.

The previous 18-pattern route inventory is reused from `../release-20260930-content/INTERNAL_ACCESS_PREPARATION.json`. Fifteen patterns use requireAdmin, two inline admin checks, one remains unguarded. Previous anonymous access result for that route remains relevant because application/auth code is unchanged. Actual application requires explicit approval; after approval, check the route hash, apply this patch, run auth guard tests and verify anonymous/nonadmin/admin behavior on the affected route only.

Auth/Save real-flow and weekend device runbook are reused from `../release-20260930-content/WEEKEND_HANDOFF.md`. Actual Save creates DB data, so it remains pending separate DB-write authorization. No Login/Save claim is inferred from mock tests.
