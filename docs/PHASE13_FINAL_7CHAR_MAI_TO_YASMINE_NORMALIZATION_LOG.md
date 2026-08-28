# Phase13 — Final 7 Character Normalization Log

Date: 2026-08-27
Branch: `sf6dna-v2`
Patch baseline: `2026.08.03`

Characters:
1. Mai
2. Elena
3. Sagat
4. C. Viper
5. Alex
6. Ingrid
7. Yasmine

## Base move normalization

The incomplete legacy Move/Frame/Classic sets were replaced with current structured frame-data snapshots (SuperCombo-derived via `RyoSogawa/sf6-sensei`, fetched around 2026-08-19) and cross-referenced to Ultimate Frame Data August 2026 pages. No imported row was auto-promoted to `verified`.

Final base counts:

| Character | Move | Frame | Classic | Alias |
|---|---:|---:|---:|---:|
| Mai | 87 | 87 | 87 | 87 |
| Elena | 82 | 82 | 82 | 82 |
| Sagat | 69 | 69 | 69 | 69 |
| C. Viper | 64 | 64 | 64 | 64 |
| Alex | 76 | 76 | 76 | 76 |
| Ingrid | 83 | 83 | 83 | 83 |
| Yasmine | 70 | 70 | 70 | 70 |

All Frame rows are patch `2026.08.03` and `reviewed`, not `verified`.

## Strategy package

Each character now has at minimum:
- 10 Combo candidate slots
- 6 Setup candidate slots
- 6 Sequence candidate slots
- 6 generic/system Counters
- 30 opponent-specific matchup Counters
- 16 generic Training drills
- 30 opponent-specific matchup Training drills
- 9 Guide sections
- 12 Trait scores
- 3 Player references
- 1 Character video

Exact combo notation/damage, setup frame advantage, sequence gaps and opponent-specific guaranteed answers remain `unverified` where no direct in-game reproduction exists. Candidate slots explicitly state this rather than fabricating values.

## Modern

Modern commands are source-confirmed subsets only; Move-count parity is not a completion criterion because Modern removes/remaps moves.

Confirmed rows added in this batch:
- Mai: 6
- Elena: 3
- Sagat: 1
- C. Viper: 3
- Alex: 3
- Ingrid: 6
- Yasmine: 1

Yasmine Modern evidence is from Dengeki Online (2026-07-23). It explicitly states Modern-unavailable moves include standing LP, standing MK and Sunusunod na Sipa, and that Mukha ng Langit is Modern one-button-only with down-back/down/down-forward + SP selecting three travel distances. Other image-only button mappings were not inferred.

## Player references

Three current/recent player references were registered per character. For Yasmine, because traditional FGC profile databases were not yet populated immediately after her 2026-08-03 release, the current 2026-08 rating table was used as a secondary reference: Enzo, Tachikawa and lllRaihanlll.

## Source and verification

Audited categories are linked using current UFD/profile/current-guide sources with explicit relationship notes. Contextual sources do not prove exact combo/setup/matchup claims.

No final-seven content was incorrectly promoted to `verified`.

## One-shot importer safety

A fixed one-shot GitHub Action invoked a fixed final-seven importer. The workflow succeeded, was removed from `sf6dna-v2`, and the temporary Edge Function was immediately redeployed as a disabled handler with JWT verification enabled. No general SQL/command execution endpoint remains exposed.

## Completion gate

**PASSED — Mai, Elena, Sagat, C. Viper, Alex, Ingrid and Yasmine have completed Phase13 structural registration/normalization.**

This does not mean every training-mode-only tactical claim is verified. Verification backlog remains explicitly represented by `unverified` records and NULL exact values.

`main` was not modified.
Phase14 was not entered.
