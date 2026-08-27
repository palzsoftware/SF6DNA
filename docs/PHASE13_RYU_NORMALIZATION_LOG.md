# Phase13 Ryu normalization log

Updated: 2026-08-27
Branch: `sf6dna-v2`
Database: Supabase `SF6DNAPro`
Current patch baseline: `2026.08.03`

## Rules

- `main` is not modified.
- Supabase production DB is the source of truth.
- `reviewed` is not `verified`.
- Unknown values remain NULL / explicitly pending rather than guessed.
- Do not advance to another character until Ryu reaches the JP-template completion gate.

## Baseline before normalization

| Category | Count |
|---|---:|
| Move | 57 |
| Frame | 57 |
| Classic Command | 57 |
| Modern Command | 0 |
| Alias | 73 |
| Combo | 6 |
| Setup | 4 |
| Sequence | 4 |
| Counter | 4 |
| Training | 16 |
| Guide Section | 1 |
| Trait Score | 12 |
| Player | 3 |
| Video | 3 |

## Frame normalization

- All 57 current Frame rows now have direct current-source traceability.
- Added direct links to the current frame-search Ver.2.0401.001 snapshot and August 2026 Ultimate Frame Data.
- All 57 Frame rows are `reviewed`; none were promoted to `verified`.
- Added 3F landing recovery to the six jump normals where it was previously NULL.
- Current Frame source links: 114 total (two per row).

## Modern command normalization

Modern Command rows: `0 -> 51`.

Year4 / 2026-08 current references were used. Six Move rows intentionally remain without a direct Modern command because they are unavailable as direct Modern actions rather than missing data:

- standing MK
- standing HK
- crouching LP direct input
- back HP
- weak Tatsumaki
- heavy Tatsumaki

The Year4 directional-SP High Blade Kick change is represented:

- down-back + SP: weak High Blade Kick
- down + SP: medium High Blade Kick
- down-forward + SP: heavy High Blade Kick

All 51 Modern command rows have two Source links: one current Year4 availability source and one detailed command reference. No invented commands were added to force 57/57.

## Current issues / remaining work

1. Alias consistency audit.
2. Current Combo expansion and damage handling; preserve NULL for recipes whose exact current-patch damage is not sourced/reproduced.
3. Setup expansion with current sourced safe-jump / oki candidates.
4. Sequence expansion / exact-condition review.
5. Counter expansion from four generic rows to opponent-specific coverage.
6. Matchup-specific Training coverage.
7. Guide Sections expansion to JP-template breadth.
8. Trait Source audit.
9. Player / Video current-patch audit.
10. Final Source / Patch / Verification consistency audit and Ryu completion gate.

Ryu is not complete yet; do not advance to the next character.
