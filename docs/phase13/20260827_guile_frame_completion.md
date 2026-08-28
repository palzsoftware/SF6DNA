# Phase 13 rollout log — Guile frame completion

Date checked: 2026-08-27  
Branch: `sf6dna-v2`

## Finding

The Guile Move/Frame difference was caused by one missing frame row:

- Move: Jump Heavy Kick (Anti Round Kick)
- Move slug: `guile-jump-hk`
- Existing move status: `draft`
- Existing description explicitly required direct verification

## Official verification

CAPCOM official frame data:

- URL: https://www.streetfighter.com/6/ja-jp/character/guile/frame
- Startup: 10F
- Active: 10–14F
- Recovery: 3F after landing
- Damage: 800

Drive and Super values were not populated because they were not mapped with
sufficient certainty from the available official result.

## Database change

- Added one `move_frame_data` row
- Verification status: `verified`
- Valid-from patch: current `2026.08.03`
- Added the official frame-data source
- Linked the source to the Guile jump-heavy-kick move
- No content publication status was changed

## Post-check

- Guile Move: 18
- Guile Frame: 18
- Missing frame rows: 0

## Remaining current-batch work

- Modern commands: 0 for Jamie, Chun-Li, Guile, Kimberly
- Setup: 0 for all four
- Sequence: 0 for all four
- Counter: 0 for all four
- Existing combos remain subject to evidence/lab verification before promotion
