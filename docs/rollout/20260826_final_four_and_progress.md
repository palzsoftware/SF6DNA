# 2026-08-26 Final Four Character Rollout + Progress Snapshot

Branch: `sf6dna-v2`
Baseline patch: `2026.08.03`

## Final four characters

Objective Move / Classic Command / Frame candidate rollout completed for the last four roster targets:

- C. Viper
- Alex
- Ingrid
- Yasmine

This batch added 50 Move candidates, 50 Classic Commands, 50 Frame candidates, and 50 Move ↔ Source links.

All data remains `draft / unverified` because frame-search search-index results report `Ver.2.0401.001` while direct cached pages can report `Ver.2.0401.000`.

## 31-character current structural coverage

- Move: 31 / 31 characters
- Frame: 31 / 31
- Classic Command: 31 / 31
- Training: 31 / 31
- Character Video relation: 31 / 31
- Character guide card: 30 / 31 (JP uses its dedicated package rather than character_guide_sections)
- Combo: 2 / 31
- Setup: 2 / 31
- Sequence: 2 / 31
- Counter: 2 / 31
- Player references: 2 / 31
- Character Trait Score: 2 / 31

## JP package current values

- Move: 49
- Frame: 49
- Command: 49
- Move Alias: 76
- Combo: 10
- Setup: 6
- Sequence: 6
- Counter: 6
- Training: 16
- Reference Player: 3
- Character Video: 1
- Character Trait Score: 12

JP remains the reference package. `reviewed` is not `verified`; gameplay-dependent data is not published until current-patch in-game or directly authoritative verification.

## Phase interpretation

The code/platform foundation through Phase10 is largely implemented. Phase11 retrieval is implemented but generative coaching remains intentionally gated by verified evidence. The next practical phase is not a new schema phase: it is **Content Verification & Expansion**, converting the 30-character structural rollout into JP-equivalent factual packages and promoting safe records through verification/publish gates.

Recommended order:

1. Complete full Move / Frame / Classic + Modern Command transcription for all 31.
2. Move aliases for all characters.
3. Combo / Setup / Sequence / Counter package for each character.
4. Player / Tournament / Match / Video references.
5. 12 Character Trait Scores per character.
6. In-game verification + Source audit + publication.
7. Enable AI Coach generation only after verified evidence coverage is sufficient.
8. Preview deployment / Admin E2E / release-readiness pass.

`main` remains untouched.