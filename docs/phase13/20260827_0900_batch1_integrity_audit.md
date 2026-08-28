# Phase13 current-batch integrity audit — 2026-08-27 09:00 JST

## Scope

- Production project: SF6DNAPro (`wnuxaxbrpudyypzdbdho`)
- Batch: Jamie / Chun-Li / Guile / Kimberly
- Source of truth: production database
- Git branch: `sf6dna-v2` only
- Baseline patch: `2026.08.03`
- No Phase14 work

## Confirmed production counts

| Character | Move | Frame | Classic | Modern | Alias | Combo | Setup | Sequence | Counter | Training | Player | Trait |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jamie | 20 | 20 | 20 | 18 | 20 | 10 | 6 | 6 | 6 | 16 | 3 | 12 |
| Chun-Li | 18 | 18 | 18 | 16 | 18 | 10 | 6 | 6 | 6 | 16 | 3 | 12 |
| Guile | 18 | 18 | 18 | 17 | 18 | 10 | 6 | 6 | 6 | 16 | 3 | 12 |
| Kimberly | 12 | 12 | 12 | 10 | 12 | 10 | 6 | 6 | 6 | 16 | 3 | 12 |

## Integrity results

- Move / Frame count differences: 0
- Moves without Classic command: 0
- Duplicate Command records for the same Move and control scheme: 0
- Blank Classic or Modern command text: 0
- Combo / Setup / Sequence / Counter / Training records outside `draft / unverified`: 0
- Patch mismatch or missing current patch among those entities: 0
- Duplicate slugs within the four-character entity sets: 0
- Modern counts remain 61 total; unavailable Modern mappings were not fabricated.
- Guile has one officially verified Frame row (jumping heavy kick); all other Frame rows in this partial batch remain unverified.

## Evidence gaps retained without promotion

- Combo: 40 records have no entity-level Source relation.
- Training: 64 records have no entity-level Source relation.
- Setup / Sequence / Counter: 72 records use character-matching community-video sources only as `candidate`.
- The current Move / Frame sets remain partial, so package `move_status`, `frame_status`, and `rollout_status` stay `in_progress`.
- All strategy and training records remain `draft / unverified`.
- No `published` or `verified` promotion was performed.

The missing Combo and Training sources were not bulk-linked to generic character videos. Relevance must be checked per record to avoid repeating incorrect Source relationships.

## Database changes

None. This run was a read-only integrity audit.

## Reproduction

Run:

- `supabase/seeds/20260827_phase13_batch1_integrity_audit.sql`

## Next continuation point

1. Compare the partial Move lists against the current CAPCOM official frame tables for all four characters.
2. Add only missing Move / Frame / Classic / Modern / Alias records directly confirmed by official data.
3. Verify Combo and Training evidence per record before adding Source relations.
4. Keep Setup / Sequence / Counter at `candidate / draft / unverified` until video-content or training-mode reproduction confirms them.
