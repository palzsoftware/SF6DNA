# Contact backend approval package

Status: `APPROVED_AND_IMPLEMENTED_SUPABASE_INBOX` on 2026-09-22.

## Approval required

Choose and authorize exactly one delivery contract:

1. Managed email provider: approve provider, sender/domain, secret storage, rate limits, retention and privacy wording.
2. Supabase inbox: approve schema, RLS/RPC, retention/deletion, admin access and spam controls.
3. Existing owned webhook: provide the verified endpoint, authentication method and operating owner.

## Acceptance gates after approval

- Guest and authenticated delivery succeeds
- No service secret reaches the browser
- Validation and category allowlist enforced server-side
- Per-IP/session abuse controls
- Failure does not lose the draft
- Privacy/Terms text matches actual collected fields and retention
- Success confirmed in Preview and inbox

The approved Supabase inbox implementation is recorded in `SF6DNA_VER1_CONTACT_SUPABASE_INBOX_IMPLEMENTATION_RESULT_20260922.md`. Mailto remains available as a fallback.
