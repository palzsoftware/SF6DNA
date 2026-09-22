# Contact internal form audit

## Findings

- Current RC: centralized `mailto:` contact only.
- Legacy `contact.html` + `js/about.js`: UI and a blank Formspree placeholder; no configured endpoint.
- Supabase public schema: no contact/message/submission table.
- Repository: no existing mail sender, webhook, API secret, or safe delivery backend.

## Decision

`CONTACT_BACKEND = APPROVAL_REQUIRED`

A real site-internal delivery path would require one of: a new mail provider secret, an approved webhook, or a new DB schema/RLS contract. None was invented or applied. The current mail address remains available so users do not lose the only working contact path.
