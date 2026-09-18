# SF6DNA V1.1 Player Context Boundary — 2026-09-18

## Allowed

The Phase 2 adapter accepts only values returned by the existing published Player loader and only emits Player context facts when a public HTTP(S) Source relation is present.

Candidate source-referenced fields:
- bio
- team
- region
- published linked character

Output classification:
`SOURCE_BACKED_FACT / reviewed`

This classification intentionally does not mean verified.

## Forbidden / not inferred

- rank
- player intention
- playstyle
- decision tendency
- main character when no published relationship exists
- hidden/internal notes
- draft data
- AI inference presented as Player fact

Player Analysis Foundation still separates PLAYER_STATEMENT / OBSERVED_BEHAVIOR / OBSERVED_PATTERN / AI_INFERENCE.

## Limitation

A Player-level Source relation does not prove every profile field independently. Phase 2 therefore keeps these facts at `reviewed` and does not promote them to VERIFIED_GAME_FACT. Future per-claim evidence should make field-level provenance more precise.

## Related Video

HOLD remains mandatory.

Fresh DB state carried from the previous batch:
- published videos = 3
- draft videos = 87
- entity_videos Player relations = 0
- published Match -> Player video relation = 0
- explicit availability/members-only/private/restricted column = absent

No public Player Related Video UI was added in this batch.
