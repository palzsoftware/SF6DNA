# Player / Video existing-data publication recovery

Base RC: `f0ef3991`. Fresh DB snapshot retrieved by the integration owner on 2026-09-30. Offline audit SHA-256: `73d8c321dea721c61c07d0dbbfa9eca132366c4ef10cae67cb871a5e47345e5e`. Current public scope unchanged; DB writes: zero.

| Cohort | Total | Current public | Draft | Evidence-ready draft | Draft primary classification |
|---|---:|---:|---:|---:|---|
| Players | 91 | 41 | 50 | 0 | SOURCE_REQUIRED 50 |
| Videos | 90 | 3 | 87 | 0 | METADATA_INCOMPLETE 87 |

Player structural candidates: **50**. All 50 have a name/slug, safe source links, consistent existing character relations, no unsafe social URL and no duplicate slug. Their existing source notes point to generic FGC Top Players directory / 12-month character snapshots. The notes do not contain individual claim excerpts or a concrete reviewed claim record. `SOURCE_REQUIRED` therefore means **claim support review required**, not “no source exists”, not a failed game check, and not a new DB-column requirement. Existing published 41 remain published and are reported separately.

Draft profiles form two recovery cohorts: 21 only have display identity/type plus existing relations; 29 carry tournament/character-use biography claims, of which 19 also contain country codes. Missing image, team, social accounts, biography and real name are optional, not blockers. Existing empty image permission allowlist means text fallback. Existing tournament_results table has zero rows; no results are fabricated.

Video overlapping structural dimensions: `URL_OK=87`, `TITLE_OK=87`, `RELATION_OK=87`, `SOURCE_OK(attached)=0`. No unsafe video URLs, duplicate video identities, dangling entity relations or conflicting external IDs were found. These structural checks do not prove title accuracy, video claims, current patch suitability or live availability. Optional channel/duration/language/control type/view-count defaults remain null/empty and do not block a verified title/link card.

**Source binding recovery:** 64/90 video URLs match existing source records, including 62 drafts and 2 published videos. No `entity_sources(entity_type=video)` links currently exist. Existing source IDs can be reused after title/attribution/relationship review; do not create duplicate sources. `VIDEO_SOURCE_BINDING_PROPOSALS.json` records every existing-source candidate, including multi-source matches for grouped videos. Matching a URL does not itself approve the title or technical claims. The other 26 videos (25 drafts +1 public) have no existing exact/same-video-ID match and need targeted source provenance review.

Existing relationships: player_characters **93**, entity_videos **112**. All **17** zero-public-player character gaps have existing draft candidates, so no new player or relation collection is needed. Evidence-ready gap closures remain **0**. Review the queue below, then publish only after a separately authorized DB/publication action.

| Character | Existing player relations | Current public players | Draft recovery queue | Ready drafts | Current public videos |
|---|---:|---:|---|---:|---:|
| luke | 3 | 3 | — | 0 | 0 |
| cammy | 3 | 0 | phenom, punk, akira-cammy | 0 | 0 |
| jp | 3 | 3 | — | 0 | 1 |
| ryu | 3 | 3 | — | 0 | 2 |
| jamie | 3 | 3 | — | 0 | 0 |
| chun-li | 3 | 3 | — | 0 | 0 |
| guile | 3 | 3 | — | 0 | 0 |
| kimberly | 3 | 3 | — | 0 | 0 |
| juri | 3 | 0 | 2bassa, jak, nephew | 0 | 0 |
| ken | 3 | 0 | notpedro, christ, mashedpotatoes | 0 | 0 |
| blanka | 3 | 0 | shigematsu, menard, kingsvega | 0 | 0 |
| dhalsim | 3 | 0 | yhc-mochi, docmorales24, torimeshi | 0 | 0 |
| e-honda | 3 | 0 | matt-hazard, slice, rangasamy | 0 | 0 |
| dee-jay | 3 | 0 | brayan-job, bloo, taizen | 0 | 0 |
| manon | 3 | 0 | akutagawa, idom, axl | 0 | 0 |
| marisa | 3 | 0 | jimmy-dr, fhassa, esuta | 0 | 0 |
| zangief | 3 | 0 | kobayan, itabashi-zangief, jr | 0 | 0 |
| lily | 3 | 0 | hibiki, kojikog, slice | 0 | 0 |
| rashid | 3 | 0 | big-bird, gachikun, dual-kevin | 0 | 0 |
| aki | 3 | 0 | hikaru-aki, kharsonist, hope-aki | 0 | 0 |
| ed | 3 | 0 | momochi, fuudo, sahara-ed | 0 | 0 |
| akuma | 3 | 0 | naooonn, kawano, leshar | 0 | 0 |
| m-bison | 3 | 0 | zhen-bison, hotdog29, dcq | 0 | 0 |
| terry | 3 | 0 | booce-lee, kincho-terry, riddles | 0 | 0 |
| mai | 3 | 3 | — | 0 | 0 |
| elena | 3 | 3 | — | 0 | 0 |
| sagat | 3 | 3 | — | 0 | 0 |
| alex | 3 | 3 | — | 0 | 0 |
| c-viper | 3 | 3 | — | 0 | 0 |
| ingrid | 3 | 3 | — | 0 | 0 |
| yasmine | 3 | 3 | — | 0 | 0 |

## Next bounded work

1. Review individual names/type/character use against the attached existing directory or character source; review biography/country claims only where present. Record source-specific claim support, not a generic relation label.
2. Review the 62 draft video existing-source matches before preparing any source binding; reuse the source30 verified metadata proposals where the IDs/URLs match, while preserving the separate video title/content decision.
3. For 25 draft videos without an existing source match, verify the existing video URL and its title/uploader; do not introduce an API or infer optional metadata.
4. Preserve all existing IDs, URLs and relations. No status changes or source-link writes occur in this batch.

## Validation

`python3 -m unittest discover -s scripts/tests -p test_player_video_publication.py -v`: 11 synthetic contract tests PASS. Full snapshot row counts and 31-character coverage reconcile. App code, shared CSS, navigation and auth did not change in this lane, so existing route PASS results are reused. No live link availability or real-device PASS is claimed.
