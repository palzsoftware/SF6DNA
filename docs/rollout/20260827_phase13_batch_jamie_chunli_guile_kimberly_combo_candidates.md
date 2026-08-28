# Phase13 batch — Jamie / Chun-Li / Guile / Kimberly

Date: 2026-08-27
Branch: `sf6dna-v2`

## Supabase work

Added 10 combo verification-candidate records per character (40 total) so current-patch combo research can be tracked without inventing recipe, damage, or gauge values.

All new rows are:
- `verification_status = unverified`
- `status = draft`
- current patch linked
- explicitly marked as requiring training-mode confirmation

Current batch baseline after this run:
- Jamie: Combo 10 / Training 16 / Player 3 / Trait 12
- Chun-Li: Combo 10 / Training 16 / Player 3 / Trait 12
- Guile: Combo 10 / Training 16 / Player 3 / Trait 12
- Kimberly: Combo 10 / Training 16 / Player 3 / Trait 12

## Current-patch research anchors

- CAPCOM 2026-08-03 battle-change pages are the primary patch anchors.
- Jamie: current-patch analysis confirms expanded Lv3 Meiteishu routes and Ryusuiken knockdown/setplay changes.
- Chun-Li: 2026-08-03 stance/Hazanshu changes affect routing and pressure verification.
- Guile: current combo source dated 2026-08-02 plus 2026-08-03 patch must be cross-checked in training mode before promotion.
- Kimberly: 2026-08-03 changes include expanded bomb stock/routing possibilities; exact recipes remain unverified until lab confirmation.

## Policy

No candidate recipe, damage value, frame value, or gauge value was fabricated. No new strategy row was promoted to verified/published. `main` was not modified.
