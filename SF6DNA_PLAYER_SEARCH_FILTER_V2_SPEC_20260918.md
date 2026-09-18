# Player Search / Filter V2

## Implemented on RC

- Search: name, alias, team, character name/slug, category label, region/country.
- Multi-select category and character filters.
- OR within each group; AND between search/category/character groups.
- Removable filter chips, clear-all, live result count, zero-result state.
- Rank appears only as an unavailable state until source-dated data exists.
- Controls wrap at 375px; no page-wide overflow masking.

## Deferred (`READY_FOR_SCHEMA`)

Rank, Team/Agency multi-filter, region normalization, multi-category records, and URL-persisted filter state. Rank must never be inferred from tournament results or creator reputation.

## Acceptance examples

`JP + プロ` returns only players satisfying both groups. Multiple characters are OR. Multiple categories are OR. Clearing one chip preserves the other groups; clear-all resets search and all filters.
