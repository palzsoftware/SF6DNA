# Phase 13 rollout log — batch 1 strategy source links

Date checked: 2026-08-27  
Branch: `sf6dna-v2`

## Current database state discovered

Jamie, Chun-Li, Guile, and Kimberly each now have:

- Combo: 10
- Setup: 6
- Sequence: 6
- Counter: 6

All 72 Setup/Sequence/Counter rows were already:

- `verification_status = unverified`
- `status = draft`
- linked to the current `2026.08.03` patch

Package statuses were already `review`. No verification or publication promotion
was performed.

## Source-link gap fixed

Before this run, none of the 72 strategy rows had an `entity_sources` relation.

Added one exact character-name matched Season 4 community-video candidate source
to every row:

- Jamie: 18 links
- Chun-Li: 18 links
- Guile: 18 links
- Kimberly: 18 links
- Total: 72 links

Relationship is `candidate`, with an explicit note that the link does not establish
frame accuracy, setup validity, a true blockstring, or verification.

## Verification

For every character and each of Setup/Sequence/Counter:

- Item count: 6
- `unverified + draft`: 6
- Current patch linked: 6
- Exact candidate source linked: 6

## Remaining work

- The 72 candidate rows still require source playback and/or game lab reproduction
  before any promotion.
- Safe-jump candidates require exact knockdown, timing, recovery, and reversal testing.
- Modern command data remains 0 for all four characters.
- The database has the candidate rows, but their full insert seed was not present in
  GitHub at this checkpoint; only the source-link seed created in this run is synced.
