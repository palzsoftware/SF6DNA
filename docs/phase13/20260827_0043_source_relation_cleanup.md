# Phase 13 rollout log — 2026-08-27 00:43 JST

## Scope

- Current batch: Jamie, Chun-Li, Guile, Kimberly
- Database: SF6DNAPro
- Git branch: `sf6dna-v2`
- `main` was not changed.

## Applied data-quality fix

Character-level community-video candidates had been bulk-linked to every character
covered by the same video. Each source row already had a character name in its title
and a correct exact-name relation.

Pre-check:

- Candidate relations: 126
- Exact title-to-character matches available: 126
- Unmatched source titles: 0
- Mismatched relations: 96
- All 96 mismatches had a correct relation already present.

Action:

- Deleted only the 96 redundant mismatched `entity_sources` relations.
- Kept all source rows and all 30 correct character/source relations.
- No content was promoted to `verified` or `published`.

Post-check:

- Candidate relations: 30
- Remaining mismatches: 0

## Current batch checkpoint

| Character | Move | Frame | Classic | Modern | Alias | Combo | Setup | Sequence | Counter | Training | Player | Video | Trait | Source |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jamie | 20 | 20 | 20 | 0 | 20 | 10 | 0 | 0 | 0 | 16 | 3 | 1 | 12 | 4 |
| Chun-Li | 18 | 18 | 18 | 0 | 18 | 10 | 0 | 0 | 0 | 16 | 3 | 1 | 12 | 4 |
| Guile | 18 | 17 | 18 | 0 | 18 | 10 | 0 | 0 | 0 | 16 | 3 | 1 | 12 | 4 |
| Kimberly | 12 | 12 | 12 | 0 | 12 | 10 | 0 | 0 | 0 | 16 | 3 | 1 | 12 | 4 |

## Remaining work

- Guile Move/Frame count difference: 18/17
- Modern commands: 0 for all four
- Setup, Sequence, Counter: 0 for all four
- Combo rows exist but still require current-patch evidence/lab verification before promotion
- Continue strict `reviewed != verified` and `draft != published`
