# Release Fixture + confirmed media candidate — 2026-10-05

## Candidate outcome

The 31-character, 1939-move Preview-only snapshot was restored from the saved candidate patch and is unchanged. Remote RC HEAD remains 2380758461e80b39c533f600375d239d407f8d7f. This local branch also contains the prior unpushed recovery and publication-audit ancestry; do not push the whole branch without a scoped review.

The latest Elena pack contains five identity-confirmed mappings. Their move IDs, slugs, character and super category match the release snapshot. Five MP4s and their five static WebP posters were copied byte-for-byte, compared against the **actual current pack** SHA256, and decoded. The shared video renderer is reused, without a renderer change. One mapped row, `elena-revival-dance-healing-236236p-2`, retains `HOLD_COMMAND_REVIEW` in source metadata; attaching the previously confirmed motion does not approve its command. All five remain Preview candidate content.

| Character | Cards | New mapped media | No-media fallback | Status |
|---|---:|---:|---:|---|
| Elena | 72 | 5 | 67 | Preview-only candidate |
| C.Viper | 61 | 0 / 5 | 61 | Latest pack transfer blocked |
| Sagat | 60 | 0 | 60 | Existing eight excluded |

Only the exact allowlisted five move IDs can attach local media. When these three pages use the generated fixture, the normal DB media merge is suppressed so old C.Viper and Sagat assets, or any unreviewed Elena assets, cannot reappear. Other characters retain the prior media path. JP, Alex, Ingrid and Yasmine precedence in the resolver is unchanged.

## Pack and HOLD preservation

Latest input packs: `ELENA_MEDIA_PACK_20261005.zip`, `CVIPER_MEDIA_PACK_20261005.zip`, `SAGAT_MEDIA_PACK_20261005.zip`. Elena and Sagat actual archives were obtained and checked; C.Viper's 53,310,017-byte latest archive repeatedly returned HTTP 502 during authenticated transfer. The earlier checkpoint's C.Viper hashes/bytes were not substituted. Therefore five C.Viper mappings have **not** been integrated or validated against the latest physical files.

72 unmapped clips remain in those three original asset packs (Elena 16, C.Viper 39, Sagat 17), with their source/timeline/media/hash/index metadata held there. None has a move ID in this release allowlist. Pack source records are retained; no raw footage, existing packs or old assets were deleted. The old Sagat eight have no recovered verified mapping and render count zero in the generated candidate.

## Verification and release decision

Elena five: SHA256 10/10 matched, FFprobe/FFmpeg decode 10/10 PASS, zero-byte/duplicate/missing file 0. Automated SSR renders five media and 67 fallbacks on the exact Elena cards. All 31 fixture SSR checks still cover 1939 IDs; full test suite, gates, typecheck, lint, build and diff-check results are recorded in the candidate checks. Desktop/375/390 Browser QA was not run: the Work browser previously rejected localhost with `net::ERR_BLOCKED_BY_CLIENT`.

**RC_PREVIEW_READY = NO** because the latest C.Viper pack could not be transferred and its five confirmed mappings cannot be independently integrated. Remote write, DB write, production deployment and other branches: none. Release remains NO_GO.

Next single action: restore the latest `CVIPER_MEDIA_PACK_20261005.zip` actual bytes through an accessible authorized transfer, then validate and add its five exact mappings before requesting scoped RC push approval.
