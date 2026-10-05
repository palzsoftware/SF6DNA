# 31-character GIF-less RC baseline — 2026-10-05

This is the formal Ver.1.0 Character Page RC baseline, superseding the earlier requirement to integrate all ten confirmed media before RC push readiness. Media backfill is optional and does not hide cards.

## Verified local candidate

Remote baseline: `2380758461e80b39c533f600375d239d407f8d7f`. Starting local candidate: `cfa0045b150b68ab40e617326a310cbd632b894f`. No remote write or deployment performed.

The generated snapshot contains 31 route characters and 1,939 combat moves. Classic commands missing: 0; current-patch frame rows missing: 0. NULL fields and existing verification statuses are retained. Every generated card carries “DB収録データ・公開審査前”; this is Preview candidate data, not production approval. The 1,278 evidence-review exceptions remain in the existing audit.

| Representative | Fixture cards | Integrated media | Fallback |
|---|---:|---:|---:|
| C.Viper | 61 | 0 | 61 |
| Elena | 72 | 5 | 67 |
| Sagat | 60 | 0 | 60 |

The generated snapshot SSR test covers all 31 characters and all 1,939 IDs, commands, frame fields, categories and fallback. Existing JP/Alex/Ingrid paths retain precedence; their fixtures, assets and source files are unchanged. Their existing automated tests and resolver contract tests pass. Actual deployed route counts and visual behavior require the subsequent Preview QA; snapshot SSR does not replace that check.

## Media intake

Confirmed media uses the existing shared renderer, Preview-only, bound by exact character + move ID + move slug. Appending a validated mapping to the shared manifest and adding its files needs no Character Page edit. Required metadata: character, ID, slug, media type/path/hash, source filename/hash, interval, variant, mapping method, mapping status CONFIRMED, confidence HIGH. MEDIUM/LOW, review/hold mapping, invalid intervals, malformed hashes and wrong identities are rejected. The existing gif path supports animated WebP/GIF; video supports MP4. No raw processing or shared renderer change was made.

Current Elena five mapping metadata is preserved, including the command-review flag on the healing entry; confirmed motion does not approve its command. C.Viper latest pack HTTP 502 remains optional backfill. Sagat old eight stay excluded. The 72 unmapped clips stay held in the original packs and are not included in the allowlist.

## Current checks

- typecheck PASS; lint PASS
- Full suite: 577 PASS / 0 FAIL
- Release gates: 14 PASS / 0 FAIL
- Build PASS; diff-check PASS
- Motion validator PASS: 27 existing clips; Elena latest five media/poster hash checks PASS
- Future-character media attachment, animated WebP/GIF compatibility and review-only isolation tests PASS
- Desktop / 375px / 390px: NOT_RUN_BROWSER_LIMITATION (Work browser localhost restriction). Not reported as PASS.

RC_PREVIEW_PUSH_READY = YES for the GIF-less baseline; RELEASE_STATUS = NO_GO pending scoped push approval, exact-SHA Preview and representative visual QA. DB/Production/main/sf6dna-v2/Ver.1.1/migrations: unchanged.

## Push scope and next action

The local branch includes six previously unpushed recovery/fixture/media commits before this baseline update. A future approval must cover the complete diff against the fresh RC remote, or the approved files must be packaged into a scoped branch. Do not treat this update commit alone as the entire fixture change. The fixture was recovered from its saved patch; the original e070770 SHA is not this branch's ancestry.

Next single action: review and explicitly approve the complete RC candidate diff for target-branch push, then verify Preview exact SHA and JP/Alex/Ingrid/C.Viper/Elena/Sagat at Desktop, 390px and 375px.
