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

## Applied normalization

- Move / Frame normalized to 59 canonical character-specific rows.
- Normal and OD Triglav / Vihhat variants split to frame-table granularity.
- SA3 / CA separated.
- Tornado air throw added.
- Classic commands normalized to 59 rows.
- Modern commands registered for 54 accessible moves; five unavailable Modern moves intentionally have no command row.
- Aliases normalized.
- All 59 Frame rows have direct Source traceability.
- Grom Strelka / Zilant target combos were re-audited and retained as one row with per-hit arrays; no unnecessary per-hit Move split.
- Missing target-combo active arrays and jump-normal landing recovery were filled from corroborating current frame references.

## Strategy / content normalization

- Existing candidate Combos were structurally linked to Moves where unambiguous.
- Existing 10 candidate Combos retain NULL damage intentionally when exact current-patch notation damage has not been reproduced; each is marked `[INTENTIONAL_NULL]`.
- Added 10 canonical practical Combos with explicit notation + damage pairs from a linked combo guide; these remain `reviewed`, not `verified`.
- Setup Move links added and all three previously NULL frame-advantage rows changed to explicit variable/timing-dependent states rather than fake fixed values.
- Sequence rows were marked structurally complete while preserving training-unverified exact gaps/options.
- Added 30 opponent-specific JP Counter candidate rows for every current opponent through Yasmine, in addition to six generic JP-system counters.
- Added 30 opponent-specific Training rows with dummy character, recording method, random playback, success criteria, and Counter linkage.
- Added eight Guide Sections covering overview, beginner, intermediate, advanced, MR1700+, defense, resource management, and training progression.
- Trait source defect corrected: all 12 trait scores no longer use the player-tournament snapshot as their direct style source; 24 trait Source links now provide two community references per trait.

## Current post-patch evidence

- Added 2026.08.03 JP update summary as patch-context corroboration.
- Added CEO 2026 post-patch tournament evidence.
- Linked current tournament evidence to JP and Tokido.
- Added CEO 2026 Day3 Part2 tournament archive as a second JP character video reference.

## Final completion audit

Final production-DB state at JP completion gate:

| Category | State |
|---|---:|
| Move | 59 |
| Frame | 59 |
| Classic Command | 59 |
| Modern Command | 54 accessible / 5 intentionally unavailable |
| Alias | 87 |
| Combo | 20 total: 10 canonical with damage + 10 intentional-null candidates |
| Setup | 6 / no unexplained frame-advantage NULL |
| Sequence | 6 / all structurally complete |
| Counter | 36 = 6 generic + 30 opponent-specific |
| Training | 46 = 16 core + 30 matchup-specific |
| Guide Section | 8 |
| Trait Score | 12 / 24 Source links |
| Player | 3 |
| Video | 2 |

Source-orphan audit:

- Frame without Source: 0
- Combo without Source: 0
- Setup without Source: 0
- Sequence without Source: 0
- Counter without Source: 0
- Guide Section without Source: 0
- Trait Score without Source: 0

## Verification debt policy

The JP data-registration and structural-quality gate is complete. This does **not** mean every gameplay fact is `verified`.

Items requiring actual game/training-mode reproduction remain `reviewed` or `unverified`, including exact one-frame gaps, spacing-specific punish windows, some setup timing, matchup-specific counter certainty, and the ten historical candidate combo damages. These are deliberate verification states, not missing registration work. No value is promoted to `verified` or `published` solely to satisfy completeness.

## JP completion gate

**PASSED — JP Phase13 data registration / normalization is complete enough to serve as the common character template.**

The earlier “remaining JP work” list is now superseded by this completion gate. Future JP work is maintenance / verification improvement, not blocking data-registration completion.

The next character remediation may proceed in the original post-JP rollout order, beginning with **Ryu**. Phase14 remains prohibited without explicit user permission.
