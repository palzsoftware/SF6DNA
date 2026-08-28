# Phase13 Modern Command rollout — 2026-08-27 08:01 JST

## Scope

- Batch: Jamie / Chun-Li / Guile / Kimberly
- Production project: SF6DNAPro (`wnuxaxbrpudyypzdbdho`)
- Source of truth: production database
- Git branch: `sf6dna-v2` only
- Baseline patch: 2026.08.03 or later
- No Phase14 work

## Evidence

The Modern tab of each current CAPCOM official frame table was opened and checked directly on 2026-08-27.

- Jamie: https://www.streetfighter.com/6/ja-jp/character/jamie/frame
- Chun-Li: https://www.streetfighter.com/6/ja-jp/character/chunli/frame
- Guile: https://www.streetfighter.com/6/ja-jp/character/guile/frame
- Kimberly: https://www.streetfighter.com/6/ja-jp/character/kimberly/frame

The Classic and Modern rows were cross-checked for crouching heavy kick aliases:

- Jamie: しゃがみ強K（始廻） → Modern ↘+H
- Chun-Li: しゃがみ強K（元伝暗殺蹴） → Modern ↘+H
- Guile: しゃがみ強K（ドラゴンスイープ） → Modern ↘+H
- Kimberly: しゃがみ強K（水面蹴り） → Modern ↘+H

## Applied production changes

- Added 61 Modern command records.
- Added the missing official frame-table source records for Jamie, Chun-Li, and Kimberly.
- Reused the existing official Guile frame-table source.
- Linked every new Modern command to its matching CAPCOM source as `entity_type = move_command`, `relationship = official`.
- Kept the four package command statuses at `review`.
- Did not promote any character/package/content to `verified`, `complete`, or `published`.

Modern counts after rollout:

| Character | Move | Frame | Classic | Modern |
|---|---:|---:|---:|---:|
| Jamie | 20 | 20 | 20 | 18 |
| Chun-Li | 18 | 18 | 18 | 16 |
| Guile | 18 | 18 | 18 | 17 |
| Kimberly | 12 | 12 | 12 | 10 |

Modern-inaccessible moves in the current partial Move set were intentionally left without fabricated records:

- Jamie: standing LK, crouching MP
- Chun-Li: standing MK, standing HK
- Guile: standing HP
- Kimberly: standing LK, crouching MP

## Verification

Post-write checks:

- Duplicate Modern commands per move: 0
- Modern commands without matching official CAPCOM source: 0
- Duplicate source URLs for the four official frame tables: 0
- Rollout status remains `in_progress`
- Verification status remains `review`
- No published-state changes

## Known limitation / Phase13 improvement candidate

`move_commands` currently has no per-row verification status, publication status, patch validity, or direct source foreign key. Evidence is represented through `entity_sources`, while the package-level command status remains `review`. Do not add schema changes during Phase13 unless they become demo-critical.

## Reproduction

Run:

- `supabase/seeds/20260827_phase13_batch_modern_commands.sql`

The seed is idempotent for existing Modern rows, official sources, and source links.
