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
- Ryu follows the JP Phase13 template.

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
- Added direct links to current frame-search Ver.2.0401.001 and August 2026 Ultimate Frame Data.
- All 57 Frame rows are `reviewed`; none were promoted to `verified`.
- Added 3F landing recovery to six jump normals where previously NULL.
- Frame Source links: 114 total.

## Modern command normalization

Modern Command rows: `0 -> 51`.

Six Move rows intentionally remain without a direct Modern command because they are unavailable as direct Modern actions:

- standing MK
- standing HK
- crouching LP direct input
- back HP
- weak Tatsumaki
- heavy Tatsumaki

Year4 directional-SP High Blade Kick is represented:

- down-back + SP: weak High Blade Kick
- down + SP: medium High Blade Kick
- down-forward + SP: heavy High Blade Kick

All 51 Modern commands have two Source links. No invented commands were added.

## Guide normalization

Guide Sections expanded from 1 to 9:

- existing 30-second matchup card
- overview
- beginner
- intermediate
- advanced
- MR1700+
- defense
- resource management
- training progression

All Guide Sections have current strategy and official 2026.08.03 patch Source links.

## Combo / Setup / Sequence normalization

- Existing six Combo candidates are retained.
- Their NULL Damage values are explicitly marked intentional because exact Year4 damage for those exact recipes was not reproduced or confirmed from a same-recipe source.
- No guessed damage values were inserted.
- Combo Source coverage is complete.
- Setup expanded `4 -> 6`.
- Added current Year4 +42F safe-jump Setups:
  - grounded weak High Blade Kick hit -> forward jump HK
  - airborne heavy High Blade Kick hit -> forward jump HK
- Sequence expanded `4 -> 6`.
- Added weak Tatsumaki -> step -> light Hashogeki meaty sequence.
- Added +42F safe-jump mix sequence.
- Exact opponent-specific reversal outcomes remain training dependent rather than falsely verified.

## Matchup Counter / Training normalization

- Added opponent-specific Counter baseline rows for all 30 currently playable opponents other than Ryu.
- Existing four generic Ryu Counter rows are retained.
- Counter total: 34.
- Added 30 opponent-specific matchup Training rows.
- Training total: 46.
- Added 30 Counter -> Training validation relations.
- Opponent-specific rows are `unverified / draft`; they are validation entry points, not fabricated punish certainty.

## Trait / Player / Video normalization

- Trait Score count remains 12.
- Trait Source links expanded `0 -> 24` using two current Ryu guide perspectives per score.
- Trait scores remain subjective `reviewed / draft`, not `verified`.
- Player references remain 3: EndingWalker, Shuto, Craime.
- Video references remain 3: official Ryu character guide, Season4 change guide candidate, 2026 complete Ryu guide.

## Final counts

| Category | Final |
|---|---:|
| Move | 57 |
| Frame | 57 |
| Classic Command | 57 |
| Modern Command | 51 accessible |
| Modern unavailable | 6 |
| Alias | 73 |
| Combo | 6 |
| Setup | 6 |
| Sequence | 6 |
| Counter | 34 (4 generic + 30 opponent-specific) |
| Training | 46 (16 existing + 30 matchup) |
| Guide Section | 9 |
| Trait Score | 12 |
| Trait Source links | 24 |
| Player | 3 |
| Video | 3 |
| Frame Source links | 114 |

## Source / verification gate

At final audit:

- Frame without Source: 0
- Combo without Source: 0
- Setup without Source: 0
- Sequence without Source: 0
- Counter without Source: 0
- Guide Source links: 18 (`entity_type=character_guide_section`)
- Trait without Source: 0

Training-mode-only facts, matchup-specific exact punishes, spacing-dependent gaps and exact Combo damage that could not be reproduced in this environment remain explicitly `unverified` / intentional NULL. This is treated as correct verification-state completion rather than missing data.

## Completion gate

**PASSED — Ryu Phase13 registration and normalization is complete enough to use the JP common template.**

Ryu is no longer a blocker. The next character may now be processed in original post-Ryu addition order. `main` remains untouched and Phase14 remains out of scope.
