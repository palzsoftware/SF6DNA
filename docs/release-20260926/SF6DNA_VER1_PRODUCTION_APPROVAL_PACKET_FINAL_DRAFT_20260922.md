# Production approval packet — final draft

This is a draft only. It does not authorize Production.

- Candidate branch: `sf6dna-v2-chatgpt-rc-20260916`
- Production change: NO
- DB change: NO
- Rollback target: current Production deployment must be Fresh-recorded immediately before approval
- Production env: read-only final comparison required immediately before approval
- Canonical/metadataBase: production URL must be present; local build intentionally does not guess it
- Smoke order: Home → Auth guest/account/logout → Diagnosis/save/history → Character Ryu/JP → Search → Players → Videos → Contact/Legal → sitemap/404
- Stop on: SHA mismatch, auth regression, contact misrepresentation, runtime error, canonical mismatch, or public feature-flag leak

Production deploy/alias change requires a separate explicit user approval.
