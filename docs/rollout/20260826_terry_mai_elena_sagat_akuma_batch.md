# 2026-08-26 rollout batch

Branch: `sf6dna-v2`
Baseline patch: `2026.08.03`

## Characters advanced

- Terry
- Mai
- Elena
- Sagat
- Gouki/Akuma

## Current data state

Terry, Mai and Elena already had initial Move / Classic Command / Frame candidate packages present in Supabase and were re-audited against frame-search search results reporting `Ver.2.0401.001`. Cached direct pages still show `Ver.2.0401.000`, so records remain `draft / unverified`.

Sagat received 10 initial normal-move candidates sourced from the current search-index result reporting `Ver.2.0401.001`. The cached opened page is stale at `Ver.2.0301.001`; provenance notes explicitly mark the discrepancy and publication is blocked pending current direct/in-game verification.

Gouki/Akuma received 4 initial candidates from the current search-index result (`Ver.2.0401.001`). The direct page cache was unavailable, so these records are also `draft / unverified`.

## Quality rule

No search-index or cache-only value is promoted to `verified` or `published`. Current CAPCOM or in-game confirmation remains required for final publication.

## Next

Continue C. Viper, Alex, Ingrid and Yasmine objective Move / Frame / Command rollout, then return to fill missing full move lists and strategy entities for every character.