# Phase13 Guile / Kimberly / Juri / Ken normalization log

Updated: 2026-08-27
Branch: `sf6dna-v2`
Database: Supabase `SF6DNAPro`
Patch baseline: `2026.08.03`

## Rules

- `main` untouched.
- Production Supabase is source of truth.
- No guessed values are promoted to verified.
- Training-dependent matchup details remain `unverified`.
- Phase14 is out of scope.

## Batch result

Four-character batch completed: Guile, Kimberly, Juri, Ken.

### Guile
- Move 70 / Frame 70 / Classic 70 / Modern 66 / Alias 82
- Combo 10 / Setup 6 / Sequence 6
- Counter 36 (6 generic + 30 matchup)
- Training 46 (16 general + 30 matchup)
- Guide 9 / Trait 12 / Player 3 / Video 1
- Frame rows retain their pre-existing `verified` state; 3 current evidence links per Frame (official, frame-search, UFD).

### Kimberly
- Move 76 / Frame 76 / Classic 76 / Modern 74 / Alias 82
- Combo 11 / Setup 6 / Sequence 6
- Counter 36 / Training 46
- Guide 9 / Trait 12 / Player 3 / Video 1
- Frame rows retain their pre-existing `verified` state; current evidence links added.

### Juri
Juri was materially incomplete at batch start (10 Move/Frame/Classic, no Modern/Combo/Setup/Sequence/Counter/Trait/Player). Rebuilt to the current August 2026 granularity:
- Move 46 / Frame 46 / Classic 46
- Modern 43 accessible; three confirmed unavailable direct moves: standing LP (chain context only), standing MK, forward MP
- Alias 138
- Combo 10 / Setup 6 / Sequence 6
- Counter 36 / Training 46
- Guide 9 / Trait 12 / Player 3 / Video 1
- All reconstructed Frame rows are `reviewed`, not `verified`.
- Current Juri sources include official movelist/frame/2026-08-03 patch, August 2026 UFD, frame-search, current 2026-08-05 strategy guide, Modern command references and FGC tournament/player snapshot.

Important 2026-08 data represented includes current standing LK/MK behavior, crouching MP/LK updates, back HK advantage, Fuha/Feng Shui structure, 5HK punish-counter routes, current anti-air and okizeme candidates.

### Ken
Ken was materially incomplete at batch start (12 Move/Frame/Classic, no Modern/Combo/Setup/Sequence/Counter/Trait/Player). Rebuilt to current Year4 granularity:
- Move 59 / Frame 59 / Classic 59
- Modern 53 accessible; six confirmed inaccessible actions: crouching LP direct input, crouching MP, weak/medium Hadoken, weak/medium Dragonlash
- Alias 177
- Combo 10 / Setup 6 / Sequence 6
- Counter 36 / Training 46
- Guide 9 / Trait 12 / Player 3 / Video 1
- All reconstructed Frame rows are `reviewed`, not `verified`.

Important 2026-08-03 changes represented:
- crouching MP: 600 damage, +5F hit, reduced hitback context
- Quick Dash Forward Step Kick: fastest 17F context, +1F hit, added whiff/armor recovery context
- Year4 crouching-MP combo routes and current DR medium-punch pressure candidates
- Modern Quick Dash / Jinrai / Dragonlash access distinctions

## Shared work applied to all four

- Frame evidence traceability completed (official current frame page + frame-search + August UFD where available).
- Guide expanded from one matchup card to common Phase13 breadth: overview, beginner, intermediate, advanced, MR1700+, defense, meter, training plus the existing matchup card.
- 30 opponent-specific Counter candidate records per character added.
- 30 opponent-specific Training records per character added and linked to their corresponding Counter records.
- Exact matchup punish/gap answers remain unverified until reproduced.
- Trait source quality normalized: strategy guides are direct evidence; FGC player/tournament data is corroborating only.
- All major Frame / Modern / Combo / Setup / Sequence / Counter / Guide / Trait / Training records have direct Source traceability after final audit.

## Verification discipline

- Guile/Kimberly pre-existing Frame verification was preserved; no artificial downgrade or promotion was applied.
- Juri/Ken reconstructed Frame data remains `reviewed` because this environment did not reproduce the values in-game.
- Matchup-specific Counter/Training remains `unverified` by design.
- Subjective Trait scores are `reviewed` editorial data, never objective `verified` statistics.
- Current-source combo values can be `reviewed`, but are not treated as in-game verified unless reproduction evidence exists.

## Completion gate

**PASSED — Guile, Kimberly, Juri and Ken satisfy the Phase13 structural completion gate and can proceed as a four-character completed batch.**

This successful four-character batch demonstrates that the next remediation batch can be expanded to eight characters, while preserving per-character audits and verification discipline.
