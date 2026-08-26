# Phase13 batch log — Jamie / Chun-Li / Guile / Kimberly

Date: 2026-08-27
Patch baseline: 2026.08.03
Branch: sf6dna-v2

## Supabase changes

For each of the four characters, added draft/unverified strategy candidates to reach the JP reference count in:

- Setup: 6
- Sequence: 6
- Counter: 6

Total added in this run:

- 24 setup records
- 24 sequence records
- 24 counter records

All new records use `status=draft`, `verification_status=unverified`, `content_kind=strategy`, and are linked to the current 2026.08.03 patch. Exact frame advantage, true blockstrings, character-specific wakeup behavior, and punish certainty are intentionally not asserted without training-mode verification.

## Package status

`setup_status`, `sequence_status`, and `counter_status` were moved to `review` for Jamie, Chun-Li, Guile, and Kimberly. `rollout_status` remains `in_progress`; nothing was promoted to verified/published.

## Research notes

Fresh 2026 materials were checked for current strategy context. Chun-Li has a May 2026 community setup collection and a March 2026 detailed combo/pressure guide. Guile has March/April 2026 discussion of new tools and current resources. Kimberly has June 2026 setup examples. Official 2026.08.03 pages were treated as the patch baseline but direct page fetches can return 403, so no unobservable frame values were copied.

## Next priorities

1. Expand Move / Frame / Classic command coverage for this four-character batch toward JP-like completeness.
2. Build Modern command data only from current official command lists; do not infer mappings.
3. Attach stronger per-record sources where schema support exists or add a reproducible seed/log representation.
4. Keep all strategy candidates draft until training-mode or first-party verification is sufficient.
