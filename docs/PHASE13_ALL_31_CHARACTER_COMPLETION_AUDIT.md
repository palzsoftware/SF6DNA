# Phase13 — All 31 Playable Character Completion Audit

Date: 2026-08-27
Branch: `sf6dna-v2`
Patch baseline: `2026.08.03`
Scope: 31 currently playable characters. Future rows Arjun / Tifa / Bosch are excluded.

## Executive result

**STRUCTURAL GATE: PASSED (31 / 31 characters).**

This result means the Phase13 data model is populated consistently enough for every playable character to use the JP common character template. It does **not** mean every matchup, combo, setup or training-mode-only claim is gameplay-verified.

## Database-wide counts

- Playable characters: 31
- Move: 1,874
- Frame: 1,874
- Classic Command: 1,874
- Modern Command (source-confirmed rows): 676
- Combo: 341
- Setup: 186
- Sequence: 186
- Matchup Counter: 930 (= 31 × 30 opponents)
- Matchup Training: 930 (= 31 × 30 opponents)
- Trait Score: 372 (= 31 × 12 traits)
- Player-character links: 93 (= 31 × 3)
- Character videos: 35

## Hard structural integrity checks

Across all 1,874 Move rows:

- Move without Frame: **0**
- Move with duplicate Frame rows: **0**
- Move without Classic Command: **0**
- Move with duplicate Classic Command rows: **0**
- Move with duplicate Modern rows: **0**

All 31 characters have:
- 30 opponent-specific matchup Counter rows
- 30 opponent-specific matchup Training rows
- at least 6 generic Counter rows
- at least 16 generic Training rows
- at least 10 Combo rows after audit repair (Ryu was topped up from 6 to 10)
- at least 6 Setup rows
- at least 6 Sequence rows
- at least 8 Guide sections
- exactly 12 Trait scores
- exactly 3 Player references
- at least 1 Character video

## Repairs made during all-31 audit

### Ryu
Found two structural shortfalls relative to the common template:
- Combo 6 -> 10
- generic Counter 4 -> 6

Added only explicit `unverified` verification slots; no exact route or damage was fabricated.

### Final-seven generic Training
Mai / Elena / Sagat / C. Viper / Alex / Ingrid / Yasmine had only 13 generic drills after overlap with pre-existing training records. Added three non-overlapping general drills per character, bringing each to 16:
- forward-walk control
- projectile response
- mixed defensive playback

### Legacy Source relationship normalization
The audit found legacy source-key mismatches on:
- Chun-Li Frame / general Training
- Jamie Frame / general Training
- JP Frame / Modern / Training

These were re-linked to the current entity types:
- `move_frame_data`
- `move_command`
- `training`

After correction, source-orphan audit is zero across all audited categories for all 31 characters.

## Source / Patch audit

Audited categories:
- Frame
- Modern Command
- Combo
- Setup
- Sequence
- Counter
- Training
- Guide Section
- Trait Score

Result:
- source-orphan rows: **0**
- Frame patch mismatches against `2026.08.03`: **0**

## Verification audit

The only Frame rows still intentionally `unverified` are two JP records:
1. `jp-shalosti` — secondary current values exist, but official/in-game cross-check is still pending.
2. `jp-tornado` — existence and 5F startup are corroborated; Active / Recovery / other exact values intentionally remain NULL pending official/in-game verification.

These are **not structural missing data**. They are correctly represented verification backlog.

No newly generated final-seven exact tactical record was promoted to `verified`.

## Remaining content-depth backlog identified by the audit

### 1. Modern command coverage is uneven
Modern is not expected to equal Move count because moves are removed/remapped in Modern. However, several recently normalized characters currently contain only a source-confirmed subset. This is a **content-depth backlog**, not a DB structural failure.

Examples of low row counts at audit time include:
- Sagat 1
- Yasmine 1
- Akuma 3
- Alex 3
- C. Viper 3
- Ed 3
- Rashid 3
- Terry 3
- M. Bison 4
- A.K.I. 5
- Mai / Ingrid 6
- Cammy / Luke 7

Rule remains: do not infer Classic inputs as Modern inputs simply to increase counts.

Yasmine now has one exact Modern command from a current source: Mukha ng Langit is one-button-only in Modern and uses down-back/down/down-forward + SP to select three travel distances. Other image-only mappings remain pending direct transcription.

### 2. Japanese move-name localization is incomplete on imported sets
The structured normalization source often lacks Japanese localized names. As a result, `name_ja` equals the English name for many rows on characters such as Blanka, Dhalsim, E. Honda, Dee Jay, Manon, parts of Marisa/Zangief/Lily, and the final seven imported characters.

This is a **display/localization backlog**. Frame/command identity is intact, but official Japanese move names should be transcribed from CAPCOM/current Japanese movelists before Japanese production UI treats `name_ja` as fully localized.

### 3. Exact strategy verification backlog
The audit intentionally found many NULL/unverified strategy values:
- Combo rows with NULL damage: 321 / 341
- Setup rows with NULL frame advantage: 162 / 186
- unverified Sequence rows: 169 / 186
- unverified matchup Counter rows: 930 / 930

These are largely candidate/verification slots created specifically to avoid invented values. They require direct current sources or Training Mode reproduction before promotion.

This backlog must **not** be converted to guessed data simply to make NULL counts zero.

## Interpretation

Phase13 now has two separate notions of completion:

### A. Structural registration / normalization
**COMPLETE: 31 / 31.**

Every playable character is represented across the common SF6DNA categories and can be served by the common data model.

### B. Exact tactical verification / Japanese localization / complete Modern transcription
**NOT fully complete.**

Remaining work is explicitly tracked as source/transcription/training verification backlog rather than hidden as missing or guessed values.

## Safety / branch status

- `main` was not modified.
- Work remains on `sf6dna-v2`.
- Phase14 was not entered.
