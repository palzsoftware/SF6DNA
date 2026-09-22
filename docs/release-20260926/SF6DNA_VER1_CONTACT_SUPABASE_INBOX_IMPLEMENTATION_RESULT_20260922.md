# Contact Supabase inbox implementation result

`CONTACT_INTERNAL_FORM = PASS`

## Database result

- Migration `add_contact_inbox`: applied successfully to `SF6DNAPro`.
- Before: contact table/RPC absent, inbox rows 0.
- After: `public.contact_inbox`, `public.submit_contact`, private HMAC salt and daily retention job present; inbox rows returned to 0 after verification cleanup.
- Guest RPC verification: PASS; `user_id` remained null.
- Authenticated RPC verification: PASS; validated Auth user ID was attached.
- Verification rows: 2 created, inspected, then deleted.
- Raw requester IP: not stored. Only a 64-character HMAC-SHA256 value is stored.
- Public/anon/authenticated table `SELECT`: denied.
- Anon/authenticated direct table `INSERT`: denied.
- Anon/authenticated RPC `EXECUTE`: granted intentionally.
- RLS: enabled with default deny and no client row policies.
- Retention: daily purge for records older than 180 days.

## Application result

- `/api/contact` now calls the Supabase RPC with the current guest or authenticated session.
- Validation remains in the browser and is repeated in the API route and PostgreSQL.
- Added same-origin enforcement, 16 KiB request ceiling, honeypot, per-requester/email/account limits and a global circuit breaker.
- Draft text stays in the form after a failed response.
- Contact, Privacy and Terms text now describes the fields, purpose, abuse control and 180-day retention.
- Email fallback remains available.

## Advisor review

The advisor reports the new RPC as an externally executable `SECURITY DEFINER` function. This is intentional: it is the only write surface and performs strict validation/rate checks while the table remains inaccessible. The empty-policy informational finding is also intentional default-deny behavior. Pre-existing public-source RPC and leaked-password warnings were not changed in this scope.

## Regression

- Targeted Contact/global page tests: 9/9 PASS.
- Full tests: 268/268 PASS.
- Release gates: 14/14 PASS.
- TypeScript: PASS.
- ESLint: PASS.
- Build: PASS.
- Diff check: PASS.

## Production boundary

No Production deployment or alias change was performed. The database migration is active under the user's explicit Supabase inbox approval; the web application change remains on the RC branch and Preview until separate Production approval.
