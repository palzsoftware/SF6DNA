# Contact Supabase inbox change plan

## Scope and expected rows

| Item | Before | After apply | Expected rows immediately after apply |
|---|---|---|---:|
| `public.contact_inbox` | absent | private inbox table, RLS enabled, no `anon`/`authenticated` table privileges or policies | 0 |
| `public.submit_contact(...)` | absent | validated, rate-limited `SECURITY DEFINER` RPC; `EXECUTE` only for `anon`, `authenticated`, `service_role` | n/a |
| `private.contact_inbox_config` | absent | one 32-byte random HMAC salt; no client/service-role access | 1 |
| retention job | absent | daily 180-day purge | 1 scheduled job |

No existing application rows are updated or deleted by the migration. Test submissions are identified, verified, and removed after Preview verification.

## Stored fields

`id`, `created_at`, category, message, reply email, optional target URL, optional authenticated user ID, irreversible requester HMAC, and triage status. Raw IP address and user-agent are not stored.

## Access contract

- Public, guest and signed-in roles cannot `SELECT`, `INSERT`, `UPDATE`, or `DELETE` inbox rows.
- Guest and signed-in roles can only execute `submit_contact`.
- The RPC validates the category allowlist, length, email and HTTP(S) URL again in PostgreSQL.
- Limits: 3 per requester/email/account per 10 minutes, 10 per 24 hours, plus a 100-per-10-minute global circuit breaker.
- Next.js adds same-origin, 16 KiB request-size, honeypot and duplicate server validation before RPC invocation.
- `service_role` can manage the inbox; it is never exposed to browser code.

## Apply SQL

Canonical SQL: `supabase/migrations/20260922143000_add_contact_inbox.sql`.

## Rollback

Canonical rollback: `supabase/rollback/20260922143000_add_contact_inbox.rollback.sql`.

Rollback removes the retention job, RPC, inbox table, and private salt table. It does not touch any pre-existing SF6DNA table or function. Rolling back deletes any contact submissions already received, so export/retention review is required before a post-launch rollback.
