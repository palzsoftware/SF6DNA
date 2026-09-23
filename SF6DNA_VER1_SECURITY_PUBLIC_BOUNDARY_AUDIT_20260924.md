# SF6DNA Ver.1.0 — Security / Public Boundary Audit

Date: 2026-09-24
Scope: read-only audit
DB writes: NONE
Production changes: NONE

## Summary

Fresh catalog/function inspection was performed against the current SF6DNA Supabase project.

Result:

```text
PUBLIC_CONTACT_DIRECT_TABLE_ACCESS = BLOCKED
PUBLIC_CONTACT_RPC = EXPECTED_PATH
PUBLIC_SOURCE_RPC_BOUNDARY = REVIEWED
FUNCTION_SEARCH_PATH_MANUAL_CHECK = PASS
SUPABASE_ADVISOR_STATE = RECHECK_REQUIRED
DB_CHANGE_REQUIRED_IN_THIS_BATCH = NO
```

## Contact boundary

Current contact storage inspected: `public.contact_inbox`.

Observed direct table privileges:

| Role | SELECT | INSERT | UPDATE | DELETE |
|---|---:|---:|---:|---:|
| `anon` | NO | NO | NO | NO |
| `authenticated` | NO | NO | NO | NO |

RLS is enabled on the table.

The intended public submission path is the `public.submit_contact` RPC rather than direct table access.

Fresh function inspection showed:

- `SECURITY DEFINER`
- executable by `anon` / `authenticated`
- explicit empty `search_path`
- fully-qualified table references
- server-side input validation
- duplicate/rate-limit logic before insert

Conclusion:

```text
CONTACT_DIRECT_PUBLIC_READ = NO
CONTACT_DIRECT_PUBLIC_WRITE = NO
CONTACT_RPC_PATH = EXPECTED
```

## Public source RPC boundary

Fresh inspection covered:

- `public.get_public_entity_sources`
- `public.list_public_sources`

Both currently show:

- `SECURITY DEFINER`
- executable by `anon` / `authenticated`
- explicit empty `search_path`
- fully-qualified relation references
- public-result filtering rather than unrestricted table passthrough

The inspected definitions constrain the public source surface to verified/public-use data and bounded output.

Status:

```text
PUBLIC_SOURCE_RPC_MANUAL_BOUNDARY_CHECK = PASS
```

## Supabase advisor discrepancy

The current Supabase Security Advisor response still reports warnings including:

- `rls_enabled_no_policy` naming `public.contact_submissions`
- `function_search_path_mutable` for the inspected public RPCs
- leaked-password protection disabled
- insufficient MFA options

However, fresh catalog/function inspection does not match the first two warning descriptions:

- current contact table discovered by live catalog inspection is `public.contact_inbox`
- the inspected RPC function metadata currently includes an explicit empty `search_path`

Therefore the first two advisor findings are not treated as proven current defects without a refreshed advisor state that agrees with the live catalog.

Classification:

```text
ADVISOR_CONTACT_TABLE_WARNING = STALE_OR_DELAYED_SUSPECTED / RECHECK_REQUIRED
ADVISOR_SEARCH_PATH_WARNING = STALE_OR_DELAYED_SUSPECTED / RECHECK_REQUIRED
```

No DB mutation is justified from this mismatch alone.

## Auth configuration warnings

### Leaked password protection

Advisor currently reports leaked-password protection disabled.

Classification:

```text
AUTH_LEAKED_PASSWORD_PROTECTION = CONFIG_REVIEW_NEEDED
```

Do not change Production Auth configuration in this batch. This must be evaluated against the current release/auth runbook and explicitly approved before any Production setting change.

### MFA options

Advisor currently reports insufficient MFA options.

Classification:

```text
AUTH_MFA = NOT_A_V1_SCOPE_CHANGE
```

MFA is not added as an unplanned Ver.1.0 feature during release freeze. The warning remains documented for post-release security planning unless an existing release requirement says otherwise.

## Release interpretation

From this read-only audit alone:

- no new direct public table exposure was confirmed
- no DB write/migration/RLS/RPC/GRANT change is required
- advisor/catalog mismatches require later recheck, not speculative mutation
- Auth configuration warnings remain visible release-risk notes, but no unapproved setting change is performed

Current classification:

```text
SECURITY_PUBLIC_BOUNDARY = NO_NEW_CONFIRMED_P0_FROM_THIS_AUDIT
PRODUCTION_CHANGE = NO
DB_CHANGE = NO
```

## Next check

At the next release-readiness pass:

1. refresh Security Advisor state once
2. compare it again with live catalog/function metadata
3. verify Auth redirect / Production env scope separately
4. carry leaked-password protection as an explicit GO/NO-GO risk note until reviewed

Do not repeat DB function/table inspection unless the schema SHA/state changes or the refreshed advisor still conflicts.
