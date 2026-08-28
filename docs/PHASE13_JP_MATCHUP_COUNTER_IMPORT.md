# Phase13 JP matchup Counter import

Updated: 2026-08-27
Branch: `sf6dna-v2`
Patch baseline: `2026.08.03`

## Purpose

Structure the previously created 31-character pre-match 30-second cards into opponent-specific JP Counter candidate records without promoting unverified numeric claims.

## Provenance

Source artifact: File Library `30秒カード一覧.html` created 2026-08-25. The artifact contains 31 playable-character cards with win condition, distance plan, anti-air, JP-facing plan, cautions, official 2026.08.03 battle-change URL, official move-list URL and a secondary guide/video candidate.

The companion final audit explicitly states that current-version damage, exact punish ranges, 1F interrupt gaps, character-specific hitbox interactions, wake-up setups and video-derived techniques were not reproduced in training mode and must remain `training_unverified` candidates.

## Import rule

- JP is defender_character.
- One candidate Counter row is created for every other playable opponent (30 opponents; JP mirror remains in the generic JP strategy records).
- `opponent_character_id` is mandatory.
- `target_type = matchup_plan`; no target move UUID is asserted at this stage.
- `verification_status = unverified`, `content_kind = strategy`, `status = draft`.
- These records are matchup-plan containers, not exact punish claims.
- Later exact punish / interrupt / anti-air rows must be separate records with concrete target move, range/position/condition, Source and reproduction status.

## Five audit groups

1. High pressure / approach: Akuma, Ken, Cammy, M.Bison, Mai, Luke, Juri, Rashid, Yasmine.
2. Projectile / midrange: Guile, Dee Jay, Chun-Li, Ryu, Sagat.
3. Special movement / trajectory: Blanka, Dhalsim, Kimberly, A.K.I., C.Viper.
4. Throw / high damage: Zangief, Manon, Lily, Marisa, E.Honda, Alex.
5. Character-resource / remaining: Jamie, Ed, Terry, Elena, Ingrid.

## Candidate handling

The first import stores only the audited strategic emphasis for each group and the original 30-second-card provenance. It does not fabricate frame-perfect answers. This is intentionally a structure-first pass so the next per-opponent verification can attach exact target moves, training recordings, match footage and official frame evidence independently.
