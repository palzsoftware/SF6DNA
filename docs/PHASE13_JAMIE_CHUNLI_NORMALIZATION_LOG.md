# Phase13 Jamie + Chun-Li normalization log

Updated: 2026-08-27
Branch: `sf6dna-v2`
Database: Supabase `SF6DNAPro`
Patch baseline: `2026.08.03`

## Rules
- `main` unchanged.
- Supabase production DB is the source of truth.
- Do not infer unknown frame/damage values.
- `reviewed` and `verified` are preserved as separate states.
- Matchup numeric certainty remains training-gated.

## Jamie

- Move: 93
- Frame: 93
- Classic Command: 93
- Modern Command: 91
- Modern direct-unavailable Move rows: standing LK, crouching MP
- Alias: 106
- Combo: 20
- Setup: 6
- Sequence: 6
- Counter: 36 (30 opponent-specific + 6 existing generic)
- Training: 46 (30 matchup labs + 16 existing)
- Guide Section: 9
- Trait Score: 12
- Trait Source links: 24
- Player: 3
- Video: 1
- Frame Source links: 186 (official + current frame-search)

Current August 2026 UFD explicitly reports Jamie updated for the August patch and documents drink-level scaling and the changed 5HK / target-combo / Ryusuiken behavior. Existing frame rows remain verified; direct Source traceability was added rather than changing values.

## Chun-Li

- Move: 68
- Frame: 68
- Classic Command: 68
- Modern Command: 64
- Modern direct-unavailable Move rows: standing MK, standing HK, Water Lotus Fist, Crane Leg Drop
- Alias: 80
- Combo: 20
- Setup: 6
- Sequence: 6
- Counter: 36 (30 opponent-specific + 6 existing generic)
- Training: 46 (30 matchup labs + 16 existing)
- Guide Section: 9
- Trait Score: 12
- Trait Source links: 24
- Player: 3
- Video: 1
- Frame Source links: 136 (official + current frame-search)

Current August 2026 sources confirm major changes including Serenity Stream up-cancel, Water Lotus Fist +1 on block, light Hazanshu -4, and Modern directional strength selection for Hazanshu. Existing frame rows remain verified; direct Source traceability was added.

## Common Phase13 upgrades applied to both

- Added two direct sources to every active Frame row: official frame page + current frame-search snapshot.
- Added current patch / strategy sources to all Guide Sections.
- Expanded Guide Sections from 1 to 9 while retaining existing matchup-card content.
- Set all 12 Trait Scores to reviewed and added two Source links per score.
- Expanded opponent-specific Counter coverage to all 30 other current roster characters.
- Added 30 matchup-specific Training rows per character with dummy character set.
- Added Counter <-> Training verification links.
- Added Source links to all opponent-specific Counter and Training rows.
- Added Source links to all Combo rows; no exact damage is fabricated when a route does not support it.
- Added Source links to all existing Modern command rows.

## Source audit after normalization

For both Jamie and Chun-Li:
- Frame without source: 0
- Combo without source: 0
- Setup without source: 0
- Sequence without source: 0
- Counter without source: 0
- Guide without source: 0
- Trait without source: 0
- Modern command without source: 0

## Completion gate

PASSED for both characters as Phase13 registration/normalization templates.

Training-mode-dependent matchup facts remain `unverified` until reproduced. This is an explicit verification state, not missing data. Do not promote these to verified without reproduction or equivalent primary evidence.
