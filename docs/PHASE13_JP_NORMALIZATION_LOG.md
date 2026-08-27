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

- Modern Command rows: `0 -> 54`.
- Five Move rows intentionally have no Modern command because they are not directly available in the Modern move set: standing LK, crouching MP, crouching HK, medium Stribog, heavy Stribog.
- No invented command was added merely to reach 59/59.

### Combo / Setup relation pass

- Combo Move links: `0 -> 24` in the first structured pass.
- Setup Move links: `0 -> 15`.
- Only explicitly named strengths / moves were linked.
- Generic notation such as bare `Triglav` or bare `Vihhat` remains unresolved until the source or training reproduction identifies the exact strength.
- Combo damage remains NULL where the current-patch value has not been reproduced or supported strongly enough.

### Training pass

- Added explicit CPU configuration text to all 16 JP Training rows.
- Added 27 `training_relations` Move links.
- Training remains `unverified` until actual in-game reproduction is recorded.

### Guide Section pass

Guide Sections: `0 -> 8`.

Added reviewed/draft sections for overview, beginner, intermediate, advanced, MR1700+, defense, resource management and training progression.

### Target-combo re-audit correction

The earlier audit described Grom Strelka / Zilant / Zilant Mid / Zilant Low as a row-granularity problem. Re-checking the current frame-data representation showed that the target-combo entries themselves are intentionally represented as one row with per-hit arrays (for example `8,10` or `12,20,21`). Therefore:

- Do **not** split Grom Strelka / Zilant / Zilant Mid / Zilant Low into separate Move records by hit.
- Existing one-row target-combo storage is compatible with the 59-row canonical count.
- Added missing `active` arrays for the four target-combo Frame rows.
- Filled 3F landing recovery on all six jump normals from the current corroborating frame reference.
- Verification remains `reviewed`; this is not an official-primary-source promotion.

### Trait source correction

A data-quality defect was found in all 12 JP Trait Score rows: their direct `source_id` pointed to `JP tournament player snapshot`, which is a player/tournament database and not an appropriate basis for playstyle scoring.

Applied correction:

- Repointed all 12 Trait Score direct sources to the current JP strategy/guide source.
- Added a second independent JP neutral-game analysis source (`JP立ち回り考察`, 2026-03-05) as corroborating evidence.
- Added 24 direct `entity_sources` links across the 12 Trait Score rows (two source links each).
- Trait values remain subjective `reviewed / draft`, not `verified`.

### Existing matchup-card reuse audit

The File Library contains the previously completed `30秒カード一覧.html` and final audit artifacts for all 31 playable characters. These cards already include opponent win condition, distance plan, anti-air, JP-facing plan and cautions, with 2026-08-03 sources. They are explicitly marked as training-unverified for numeric punish / combo / setup details. They may be migrated into matchup-specific Counter records only as candidate strategy data; numeric certainty must not be inferred from them.

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
| Counter | 6 generic JP-system counters |
| Training | 16 |
| Training Move relations | 27 |
| Guide Section | 8 |
| Trait Score | 12 |
| Trait Source links | 24 |
| JP-linked Players | 3 |
| JP-linked Videos | 1 |
| Frame Source links | 59 |
| Frame reviewed | 57 |
| Frame unverified | 2 |
| Frame verified | 0 |

## Remaining JP work before moving to the next character

1. Official/primary-source verification of Frame rows where possible.
2. Combo audit: fill damage only where current-patch reproduction/source is sufficient; finish structured component links.
3. Setup audit: resolve the three NULL advantage rows only when reproducible.
4. Sequence audit: exact gap / defense-option reproduction where possible.
5. Counter audit: migrate the existing 30 opponent cards into opponent-specific candidate records, then separately add exact target-move punish/counter data only when sourced or reproduced.
6. Training audit: add matchup-specific dummy characters to the opponent-specific drills as they are migrated.
7. Player / Video / Source / Patch final consistency audit and add current high-level reference videos where materially useful.
8. Final JP completion gate.

The JP completion gate must not claim that training-mode-only facts are complete when this environment cannot reproduce them. Such data remains `unverified` / `needs retest` rather than fabricated.

Only after the JP completion gate passes should remediation proceed in the original post-JP addition order, beginning with Ryu and then the subsequent rollout order.
