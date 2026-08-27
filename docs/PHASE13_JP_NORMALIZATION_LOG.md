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

### Modern command pass

Modern JP command references were re-checked against the Modern JP normal / unique / special / SA guide pages and the current 2026-08-03 baseline.

- Modern Command rows: `0 -> 54`.
- Registered directly documented Modern controls for accessible normals, assist normals, jump normals, unique attacks, target combos, Triglav variants, Stribog variants where available, Departure variants, Amnesia, Torbalan, Embrace, SA1/SA2/SA3/CA, throws and Tornado.
- For Triglav, preserved both shortcut direction and manual input context where documented.
- The following five JP Move rows intentionally have no Modern command row because they are not directly available in the Modern move set rather than being unknown commands:
  - standing LK
  - crouching MP
  - crouching HK
  - medium Stribog
  - heavy Stribog
- These five are not filled with invented commands merely to reach 59/59.
- Added the Modern JP guide as a community corroborating Source; it does not promote verification state.

### Combo / Setup relation pass

Existing prose notation was normalized toward structured references without inventing ambiguous strengths.

- Combo Move links: `0 -> 24` in the first structured pass.
- Setup Move links: `0 -> 15`.
- Only explicitly named strengths / moves were linked.
- Generic notation such as bare `Triglav` or bare `Vihhat` remains unresolved until the source or training reproduction identifies the exact strength.
- Combo damage remains NULL where the current-patch value has not been reproduced or supported strongly enough.

### Training pass

- Added explicit CPU configuration text to all 16 JP Training rows (`CPU OFF; dummy record/playback`).
- Added 27 `training_relations` Move links for anti-air, punish, Amnesia, Departure, SA, Stribog, Torbalan, Triglav and combo-confirm drills.
- Training remains `unverified` until actual in-game reproduction is recorded.

### Guide Section pass

Guide Sections: `0 -> 8`.

Added reviewed/draft sections for:

1. overview / neutral plan
2. beginner priorities
3. intermediate priorities
4. advanced priorities
5. MR1700+ decision standards
6. defense / reversal selection
7. Drive / SA resource management
8. training progression

Each Guide Section is linked to both the JP 2026-08-03 official patch baseline and a current frame-data corroborating source. Strategy text remains `draft / reviewed`, not `verified`.

## Current known counts after this pass

| Category | Count / status |
|---|---:|
| Move | 59 |
| Frame | 59 |
| Classic Command | 59 |
| Modern Command | 54 accessible moves |
| Modern unavailable moves | 5 |
| Alias | 87 |
| Combo | 10 |
| Combo Move links | 24+ structured links |
| Setup | 6 |
| Setup Move links | 15 |
| Sequence | 6 |
| Counter | 6 |
| Training | 16 |
| Training Move relations | 27 |
| Guide Section | 8 |
| Trait Score | 12 |
| JP-linked Players | 3 |
| Frame Source links | 59 |
| Frame reviewed | 57 |
| Frame unverified | 2 |
| Frame verified | 0 |

## Notes on Tornado

The air throw was re-checked after a temporary concern during audit. Multiple independent current/reference sources confirm JP has an air throw named Tornado. The DB currently stores only sourced values; unsupported fields remain NULL until an official primary source or in-game verification is available.

## Remaining JP work before moving to the next character

1. Finish target-combo row granularity cleanup for Grom Strelka / Zilant / Zilant Mid / Zilant Low.
2. Official/primary-source verification of Frame rows where possible.
3. Combo audit: fill damage only where current-patch reproduction/source is sufficient; finish structured component links.
4. Setup audit: resolve the three NULL advantage rows only when reproducible.
5. Sequence audit and conversion from generic prose to reproducible situations.
6. Counter audit including opponent character and target move; expand toward all-matchup coverage without fabricated entries.
7. Training audit: add matchup-specific dummy characters and reproduction evidence where appropriate.
8. Trait source diversification and verification review.
9. Player / Video / Source / Patch final consistency audit.
10. Final JP completion gate.

Only after the JP completion gate passes should remediation proceed in the original post-JP addition order, beginning with Ryu and then the subsequent rollout order.
