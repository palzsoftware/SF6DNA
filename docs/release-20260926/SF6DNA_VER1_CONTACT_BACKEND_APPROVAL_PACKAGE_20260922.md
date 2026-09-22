# Contact backend approval package

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

Until then, keep `deliveryEnabled=false`, the API fail-closed, and mailto available.
