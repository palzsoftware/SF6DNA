# SF6DNA Ver.1.1 Related Video Contract Gap

Date: 2026-09-19
Decision: `HOLD`

Related Video evidence must not be treated as player evidence until its contract guarantees:

- public availability and a stable canonical URL;
- exact player and, when applicable, character identity relation;
- source/channel attribution and `checked_at` freshness;
- publication status, restriction/members-only state, and removal handling;
- the precise claim supported by the video rather than inference from title/thumbnail;
- Patch/version relevance for gameplay claims;
- correction and expiry behavior.

The current task made no schema migration or DB write. Any schema/RLS/index/backfill work requires a separate approval package and read-only impact audit first.
