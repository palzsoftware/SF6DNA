# Phase13 JP normalization log

Updated: 2026-08-27
Branch: `sf6dna-v2`
Database: Supabase `SF6DNAPro`
Current patch baseline: `2026.08.03`

## Rules

- `main` is not modified.
- Supabase production DB is the source of truth.
- `reviewed` is not `verified`.
- Unknown values remain NULL rather than guessed.
- Phase14 is out of scope.
- Do not advance to another character until JP data is complete enough to satisfy the common template.

## 2026-08-27 applied changes

The initial JP audit identified 49 Move / 49 Frame rows versus a 59-row character-specific frame-table granularity.

Applied to Supabase:

- Split normal Triglav into L/M/H rows.
- Split OD Triglav into LP+MP / LP+HP / MP+HP rows.
- Split normal Departure into L/M/H rows.
- Split OD Departure into LP+MP / LP+HP / MP+HP rows.
- Split SA3 and Critical Art into separate rows.
- Added JP air throw `Tornado` as the missing Move.
- Added corresponding Frame rows so JP now has 59 Move and 59 Frame records.
- Added/normalized Classic commands for the new split rows.
- Added aliases for the new rows.
- Added direct `entity_sources` links from all 59 JP Frame records to the current August 2026 Ultimate Frame Data corroborating source.
- Preserved verification discipline: no new row was promoted to `verified`.

Current counts immediately after normalization:

| Category | Count |
|---|---:|
| Move | 59 |
| Frame | 59 |
| Classic Command | 59 |
| Modern Command | 0 |
| Frame Source links | 59 |
| Frame reviewed | 57 |
| Frame unverified | 2 |
| Frame verified | 0 |

## Notes on Tornado

The air throw was re-checked after a temporary concern during audit. Multiple independent current/reference sources confirm JP has an air throw named Tornado. The DB currently stores only the sourced 5F startup; other Frame fields remain NULL until an official primary source or in-game verification is available.

## Remaining JP work before moving to the next character

1. Modern Command coverage and availability mapping.
2. Target-combo row granularity cleanup for Grom Strelka / Zilant / Zilant Mid / Zilant Low.
3. Official/primary-source verification of Frame rows where possible.
4. Combo audit and damage / component-move links / verification.
5. Setup audit and missing advantage data / verification.
6. Sequence audit and conversion from generic prose to reproducible situations.
7. Counter audit including opponent character and target move.
8. Training audit including dummy/CPU settings, related move links, and reproducible conditions.
9. Guide Sections population.
10. Trait source diversification and verification review.
11. Final Source / Patch / verification consistency audit.

Only after the JP template is complete should remediation proceed in the original post-JP addition order, beginning with Ryu, then the subsequent characters in that rollout sequence.
