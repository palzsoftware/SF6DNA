# Player / Video Publication Recovery — existing gate contract

Base RC: `f0ef3991`. This lane changes no application queries, publication status, permissions or DB data.

## Current public query behavior

| Consumer | Existing rule | Consequence |
|---|---|---|
| `lib/players.ts` list/detail | `players.status = published` | Draft players are unavailable to both index and detail. |
| `lib/players.ts` character links | Related character must be published | Draft/future character links do not display. |
| `lib/character-sections.ts` player section | Drops a linked player unless published | Existing relation counts are not public player counts. |
| `lib/event-media.ts` video list/detail | `videos.status = published` | Draft videos are unavailable to index and detail. |
| Video list player/character resolution | Related entity must be published | Relation exists does not mean relation label displays. |
| Character video section | Drops linked video unless published | Existing relation counts are not public video counts. |
| Player detail video section | Uses public video list then existing player relation names | A relation alone never publishes a video. |
| Tournament result display | Related tournament must be published | Result relation is not independent proof of result accuracy. |
| Approved player image resolver | Empty explicit permission allowlist | Uses existing text fallback; missing/unapproved images are optional. |

## Readiness policy

`READY` means an evidence-backed recommendation, never execution approval. Identity/title/URLs must be present and consistent; existing sources must actually support the claims that the current UI would display. Source relation labels such as `candidate`, `supporting` or `corroborating` do not by themselves verify identity, profile facts, title, tournament claims or character use.

No new DB verification column or new application gate is required by this audit. If concrete source support is reviewed, `evidence_assessments` may be supplied as **audit-only annotations**, with the existing `source_id`, exact supported claim scope and review evidence reference. These are not a schema change. Without that source support, preserve the record and identify the specific review needed; do not generate biography, team, region, results or game facts.

Player classifications form one primary partition: `READY`, `SOURCE_REQUIRED`, `PROFILE_INCOMPLETE`, `RELATION_ONLY`, `IMAGE_REQUIRED`, `HOLD`. `IMAGE_REQUIRED` remains zero under the existing text fallback design. Real name, team, region, biography, images and social accounts are optional if absent. If those claims are present and displayed, their provenance requires review.

Video primary classes form one partition: `READY`, `METADATA_INCOMPLETE`, `HOLD`. `SOURCE_OK`, `URL_OK`, `TITLE_OK`, `RELATION_OK` are overlapping dimensions, not additional primary partitions. Safe URL structure is not a live broken-link check. Title presence is not title correctness. Relation resolution is not proof of gameplay content.

The intentional display defaults stay unchanged: `channelName=null`, `durationSeconds=null`, `language=null`, `controlTypes=[]`, `viewCount=null`. Those optional defaults never by themselves block a verified title/link card.

## Reproducible offline audit

```sh
python3 scripts/audit-player-video-publication.py /tmp/current-db-snapshot.json --output-dir docs/release-20260930-publication
python3 -m unittest discover -s scripts/tests -p test_player_video_publication.py -v
```

Input uses existing table arrays: `players`, `videos`, `characters`, `player_characters`, `entity_videos`, `sources`, `entity_sources`, `tournament_results`, optionally `tournaments` and `matches`. No network access or DB clients are used. Outputs identify every row by its existing ID and preserve current/public/draft counts separately. YouTube duplicates compare actual video IDs across watch/short/embed/share URL forms; conflicting `external_id` mappings are held.

## Execution handoff

1. Review the identified source/profile/content gaps using existing source records; do not re-collect relations.
2. Record which source supports each displayed claim, distinguish optional absent values from unsupported present claims.
3. Re-run only this offline classification with reviewed evidence annotations.
4. Produce an explicit candidate ID list and before/after public coverage estimate.
5. DB/publication execution remains blocked by this work order (`DB_WRITE=NO`); no candidate becomes public in this batch.
6. After a separately authorized status change, QA Players, affected Player details, Videos and affected Character sections. Reuse existing unrelated PASS results.
