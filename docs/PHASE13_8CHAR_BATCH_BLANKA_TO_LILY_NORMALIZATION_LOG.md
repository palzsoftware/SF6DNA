# Phase13 — 8 Character Batch Normalization Log

Date: 2026-08-27
Branch: `sf6dna-v2`
Patch baseline: `2026.08.03`

Characters:
1. Blanka
2. Dhalsim
3. E. Honda
4. Dee Jay
5. Manon
6. Marisa
7. Zangief
8. Lily

## Final counts

| Character | Move | Frame | Classic | Modern* | Alias | Combo | Setup | Sequence | Counter | Training | Guide | Trait | Player | Video |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blanka | 52 | 52 | 52 | 20 | 104 | 10 | 6 | 6 | 36 | 46 | 9 | 12 | 3 | 1 |
| Dhalsim | 50 | 50 | 50 | 14 | 100 | 10 | 6 | 6 | 36 | 46 | 9 | 12 | 3 | 1 |
| E. Honda | 55 | 55 | 55 | 15 | 110 | 10 | 6 | 6 | 36 | 46 | 9 | 12 | 3 | 1 |
| Dee Jay | 61 | 61 | 61 | 15 | 122 | 10 | 6 | 6 | 36 | 46 | 9 | 12 | 3 | 1 |
| Manon | 49 | 49 | 49 | 17 | 98 | 10 | 6 | 6 | 36 | 46 | 9 | 12 | 3 | 1 |
| Marisa | 53 | 53 | 53 | 13 | 106 | 10 | 6 | 6 | 36 | 46 | 9 | 12 | 3 | 1 |
| Zangief | 47 | 47 | 47 | 14 | 94 | 10 | 6 | 6 | 36 | 46 | 9 | 12 | 3 | 1 |
| Lily | 47 | 47 | 47 | 14 | 94 | 10 | 6 | 6 | 36 | 46 | 9 | 12 | 3 | 1 |

\* Modern is the source-confirmed subset only. Missing Modern rows are not filled by inference; unavailable or not-currently-confirmed commands remain absent intentionally.

## Data-source strategy

Primary/current references are the CAPCOM 2026-08-03 character battle-change pages and official movelists. Current frame review uses Ultimate Frame Data (August 2026) with frame-search as corroboration. A structured SuperCombo-derived dataset from `RyoSogawa/sf6-sensei` (source snapshots fetched around 2026-08-19, CC-BY-SA) was used as a supplementary normalization aid, not as a replacement for current patch review.

Modern inputs are registered only where the character-specific Modern guide explicitly supports the input. They are linked to the corresponding Kamigame Modern normal/unique/special/SA source pages. No command is invented to force Move and Modern counts to match.

## Matchup / training package

Each character now has:
- 6 generic/system Counter records
- 30 opponent-specific matchup Counter records
- 16 generic Training records
- 30 opponent-specific matchup Training records
- Counter-to-Training verification relations for the matchup package

Opponent-specific matchup content remains `unverified / draft` until reproduced or independently confirmed at the exact distance/condition. No exact punish-frame value was fabricated.

## Combo / Setup / Sequence

Each character has:
- 10 Combo candidate records
- 6 Setup records
- 6 Sequence records

These provide the Phase13 structure and verification entry points. Exact route damage, one-frame gaps, safe-jump values, distance-specific punish claims, and similar training-mode facts remain unverified where no direct reproduction was available.

## Player / Video

Three Player links were registered per character using recent FGC Top Players tournament/profile data.

Lily note: Slice remains a historical/recent Lily reference in the Lily character snapshot, but the 2026-08-27 current player directory identifies Slice with E. Honda. Therefore the Lily link is kept as `secondary` with the discrepancy explicitly noted rather than treated as an unqualified current main.

One existing Season4/current-guide candidate video remains linked per character. Video existence does not promote technical claims to `verified`.

## Trait

All 12 Trait scores per character have at least two Source links:
- FGC Top Players character profile as playstyle/tournament context
- UFD as current move-property corroboration

Trait numbers remain editorial `reviewed` scores, not objective verified measurements.

## Source audit

Final source-orphan audit returned zero for all eight characters in all audited categories:
- Frame
- Modern Command
- Combo
- Setup
- Sequence
- Counter
- Training
- Guide Section
- Trait Score

Frame Source relationship:
- UFD = supporting
- frame-search = corroborating

Strategy candidate Source relationships explicitly state that UFD/Season4 guide material supplies current mechanics/context and does not itself prove an exact combo/setup/matchup answer.

## Patch / Verification audit

All Frame rows use patch baseline `2026.08.03`.

Final Frame state:
- Blanka: 52 reviewed / 0 verified
- Dhalsim: 50 reviewed / 0 verified
- E. Honda: 55 reviewed / 0 verified
- Dee Jay: 61 reviewed / 0 verified
- Manon: 49 reviewed / 0 verified
- Marisa: 53 reviewed / 0 verified
- Zangief: 47 reviewed / 0 verified
- Lily: 47 reviewed / 0 verified

Verified Combo / Setup / Sequence / Counter / Training created by this batch: 0.

This is intentional. `reviewed ≠ verified`, and no in-game-only fact was promoted without the required evidence.

## Completion gate

**PASSED — Blanka, Dhalsim, E. Honda, Dee Jay, Manon, Marisa, Zangief, and Lily Phase13 registration / normalization are complete enough to use the JP common character template.**

Unverified candidate slots remain part of the verification workflow and do not block Phase13 structural completion.

`main` was not modified.
Phase14 was not entered.
