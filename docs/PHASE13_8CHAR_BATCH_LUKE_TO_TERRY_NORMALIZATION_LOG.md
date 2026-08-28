# Phase13 — 8 Character Batch Normalization Log

Date: 2026-08-27
Branch: `sf6dna-v2`
Patch baseline: `2026.08.03`

Characters:
1. Luke
2. Cammy
3. Rashid
4. A.K.I.
5. Ed
6. Akuma
7. M. Bison
8. Terry

## Final counts

| Character | Move | Frame | Classic | Modern* | Alias | Combo | Setup | Sequence | Counter total | Matchup Counter | Training total | Matchup Training | Guide | Trait | Player | Video |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Luke | 50 | 50 | 50 | 7 | 115 | 10 | 6 | 6 | 42 | 30 | 62 | 30 | 9 | 12 | 3 | 2 |
| Cammy | 53 | 53 | 53 | 7 | 88 | 10 | 6 | 6 | 36 | 30 | 51 | 30 | 9 | 12 | 3 | 1 |
| Rashid | 54 | 54 | 54 | 3 | 89 | 10 | 6 | 6 | 36 | 30 | 51 | 30 | 9 | 12 | 3 | 1 |
| A.K.I. | 52 | 52 | 52 | 5 | 84 | 10 | 6 | 6 | 36 | 30 | 51 | 30 | 9 | 12 | 3 | 1 |
| Ed | 48 | 48 | 48 | 3 | 76 | 10 | 6 | 6 | 36 | 30 | 51 | 30 | 9 | 12 | 3 | 1 |
| Akuma | 47 | 47 | 47 | 3 | 90 | 10 | 6 | 6 | 36 | 30 | 51 | 30 | 9 | 12 | 3 | 1 |
| M. Bison | 45 | 45 | 45 | 4 | 70 | 10 | 6 | 6 | 36 | 30 | 51 | 30 | 9 | 12 | 3 | 1 |
| Terry | 52 | 52 | 52 | 3 | 84 | 10 | 6 | 6 | 36 | 30 | 51 | 30 | 9 | 12 | 3 | 1 |

\* Modern is intentionally the source-confirmed subset only. No Classic input is copied into Modern by inference and no command is invented to make counts match.

## Baseline and verification policy

- Current patch baseline: `2026.08.03`.
- All Frame rows in this batch are `reviewed` and `verified=0`.
- Frame patch mismatch count is zero for all eight characters.
- Candidate Combo / Setup / Sequence rows created or normalized by this batch have no `verified` promotion.
- Exact training-mode-only facts (one-frame gaps, safe-jump timing, distance-specific punish, matchup guaranteed answer, etc.) remain unverified until reproduced or independently confirmed.

## Move / Frame normalization

Luke already had a relatively complete base package and was retained/audited.

The other seven characters were expanded from incomplete normal-heavy records into character packages containing the currently required unique attacks, target combos, special-strength variants, major branches, Super Arts, and throws where available from current August 2026 references.

Current frame support:
- Ultimate Frame Data August 2026 = supporting
- frame-search current = corroborating

Every Frame row has Source tracking. Source orphan count = 0.

## Akuma Super Art correction

An inconsistency discovered during the batch was corrected before completion:
- SA1: `滅殺豪波動 / Messatsu Gohado`
- air SA1: `天魔豪斬空 / Tenma Gozanku`
- SA2: `崩天劫火 / Empyrean's End`
- SA3: `禍坏 / Sip of Calamity`
- CA: `禍坏（CA） / Sip of Calamity (CA)`
- `瞬獄殺 / Shun Goku Satsu / Raging Demon` is stored separately as the CA-only Level 3 option, not incorrectly merged into the ordinary SA3 row.

The separation follows the current August 2026 UFD Super Arts structure.

## Modern

Modern commands were registered only where the character-specific Modern normal-move guide explicitly identifies the button mapping.

Sources are character-specific Kamigame Modern normal-move pages, checked 2026-08-27.
Every registered Modern command has a direct `move_command` Source link. Modern Source orphan count = 0.

Unregistered Modern commands mean either:
1. unavailable in Modern, or
2. not confirmed in the source subset used in this batch.

They are not treated as silently known commands.

## Matchup / Training package

All eight characters have exactly 30 opponent-specific matchup Counter records and exactly 30 matchup Training records.

The matchup package is `unverified / draft` and is used as a verification entry point:
- record opponent approach / jump / Drive Rush / main move / corner sequence
- compare character-side responses
- classify as guaranteed / trade / read / invalid
- only promote exact answers after evidence/reproduction

Luke retains pre-existing generic/system Counter and Training records, so total counts are higher than the other seven characters. Existing data was not deleted merely to force equal totals.

## Combo / Setup / Sequence

Every character has:
- Combo: 10
- Setup: 6
- Sequence: 6

For previously incomplete characters these include explicit Phase13 candidate slots. Damage or exact timing is NULL/unknown where not directly verified. These candidate records are structural completion, not fabricated tactical proof.

## Guide / Trait / Player / Video

Every character now has:
- Guide: 9 sections
- Trait: 12 scores
- Player: 3 references
- Existing current/Season4 video references retained

Trait is an editorial reviewed score, supported by current FGC Top Players statistics plus current UFD move-property context. It is not marked as an objective verified measurement.

Player references are based on the current/recent FGC Top Players directory checked 2026-08-27.

## Source audit

Final Source orphan audit returned **0** for every one of the eight characters in:
- Frame
- registered Modern Command
- Combo
- Setup
- Sequence
- Counter
- Training
- Guide Section
- Trait Score

Official 2026-08-03 character battle-change sources are additionally linked to Guide sections as patch context. They are not misused as evidence for unrelated exact recipes.

## Completion gate

**PASSED — Luke, Cammy, Rashid, A.K.I., Ed, Akuma, M. Bison, and Terry Phase13 registration / normalization are complete enough to use the JP common character template.**

Unverified candidate slots remain part of the explicit verification backlog and do not block Phase13 structural completion.

`main` was not modified.
Phase14 was not entered.
