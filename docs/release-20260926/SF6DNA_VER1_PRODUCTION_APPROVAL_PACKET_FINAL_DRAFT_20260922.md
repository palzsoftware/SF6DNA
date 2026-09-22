# Production approval packet — final draft

This is a draft only. It does not authorize Production.

- Candidate branch: `sf6dna-v2-chatgpt-rc-20260916`
- Production change: NO
- DB change: YES — approved Contact inbox migration only; current Contact rows 0 after verification cleanup
- Rollback target: current Production deployment must be Fresh-recorded immediately before approval
- Production env: read-only final comparison required immediately before approval
- Canonical/metadataBase: production URL must be present; local build intentionally does not guess it
- Smoke order: Home → Auth guest/account/logout → Diagnosis/save/history → Character Ryu/JP → Search → Players → Videos → Contact/Legal → sitemap/404
- Contact DB rollback: use `supabase/rollback/20260922143000_add_contact_inbox.rollback.sql`; export any real inquiries before a post-launch rollback
- Stop on: SHA mismatch, auth regression, Contact Guest/Auth failure, runtime error, canonical mismatch, or public feature-flag leak

Production deploy/alias change requires a separate explicit user approval.
