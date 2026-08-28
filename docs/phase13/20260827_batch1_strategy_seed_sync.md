# Phase13 Batch 1 strategy seed sync — 2026-08-27

## Scope

- Jamie
- Chun-Li
- Guile
- Kimberly
- Tables: `setups`, `sequences`, `counters`

## Production DB checkpoint

SF6DNAPro (`wnuxaxbrpudyypzdbdho`) was treated as the source of truth.

| Entity | Rows | Verification | Publication |
|---|---:|---|---|
| Setup | 24 | all `unverified` | all `draft` |
| Sequence | 24 | all `unverified` | all `draft` |
| Counter | 24 | all `unverified` | all `draft` |

All 72 rows remain linked to patch `2026.08.03`.

## Change

Added a complete, idempotent seed for the 72 existing strategy candidates:

- `supabase/seeds/20260827_batch1_strategy_candidates_full.sql`
- resolves character and patch UUIDs from stable slugs/version labels
- upserts by entity slug
- preserves exact DB content and `unverified / draft` state
- does not promote any row to `verified` or `published`

The earlier candidate Source relation seed remains separate:
`supabase/seeds/20260827_batch1_strategy_candidate_source_links.sql`.

## Verification

The full seed was executed inside a transaction ending in `ROLLBACK`.

Result:

- Setup: 24, unsafe state: 0
- Sequence: 24, unsafe state: 0
- Counter: 24, unsafe state: 0
- no production DB change was retained

## Remaining

- Reproduce and verify all 72 strategy candidates in-game and/or against sufficient primary evidence.
- Inspect the linked community videos at content level before any Source relation promotion.
- Build Modern Command data for the four characters; current count remains 0.
