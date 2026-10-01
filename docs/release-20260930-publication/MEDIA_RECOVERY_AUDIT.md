# Existing Media Recovery Audit — 2026-09-30

## Confirmed fresh state

Snapshot: `2026-09-30T09:33:59.11192+00:00` (read-only snapshot supplied by root).

- Prepared57 Ryu candidate IDs, slugs, names, original move types, canonical display order and draft/public status match Fresh57 exactly: **drift0 / new IDs0**.
- Fresh DB `move_motion_media`: **0 rows**. This is DB absence, not proof that the repository contains no media.
- Existing four repository manifests contain **35 clips**: **34 approved_for_preview**, **1 mapping_hold**.
- Existing files: **35 MP4 + 35 static poster WebP =70 files**, **13,363,469 bytes**. All70 are referenced by the manifests and present.
- Every35 manifest clip ID/slug/character association matches Fresh canonical moves. No identity mismatch was found.
- Existing WebP RIFF chunk inspection found **0 Animated WebP**; these35 are posters, not full action animations. Preview motions currently use MP4.
- New user RYU_MEDIA.zip: **absent**. Existing4 Ryu clips are partial prior evidence, not completion of all57 recording candidates.

| Character | Manifest clips | Preview approved | Mapping hold | Asset files | Combined bytes |
| --- | ---: | ---: | ---: | ---: | ---: |
| luke | 1 | 1 | 0 | 2 | 338,572 |
| manon | 3 | 3 | 0 | 6 | 965,289 |
| jp | 27 | 26 | 1 | 54 | 11,415,752 |
| ryu | 4 | 4 | 0 | 8 | 643,856 |

Held mapping: `jp-amnesia-od`. The existing hold must remain withheld. File existence and canonical ID matching do not resolve visual mapping hold or establish new game verification.

## Why repository media differs from ordinary publication

1. `src/lib/preview-motion-media-pilot.ts` imports four local manifests and exposes only `approved_for_preview` clips for the fixed JP/Ryu/Luke/Manon character IDs.
2. `src/lib/device-preview.ts:getDevicePreviewMoveMotionMedia` returns no media outside `VERCEL_ENV=preview`; in Preview, local approved pilot media is available without a device token. A valid token additionally permits the preview RPC and merges local pilot IDs over DB preview rows.
3. The character-detail pilot path in `src/app/characters/[slug]/page.tsx` loads this media and overlays matching `moveId` onto the remote bundle or existing fixture.
4. Ordinary public lookup in `src/lib/move-motion-media.ts` reads only `move_motion_media.status=published`; Fresh has0 rows. Existing Preview approval is not ordinary public publication approval.
5. `src/components/move-motion-media.tsx` uses video `preload=none`, viewport/visibility pause and reduced-motion controls. Static WebP posters are not equivalent to Animated WebP clips. Actual Animated WebP fleet performance remains untested until recordings are provided and staged.

## Recovery classification

- Asset recovery: **not required** for these70 known files; all present and referenced.
- Canonical identity recovery: **not required** for these35 known manifest mappings; Fresh matches.
- Ordinary publication: **PENDING / scope approval and reviewed delivery strategy required**. No DB rows or loader/public boundary were changed.
- Missing57-complete Ryu recording intake: **WAITING_FOR_USER_ZIP**. No assumption that a recording was provided, and no manufactured cut/WebP output.
- Previous held clip: **KEEP_WITHHELD**.

## Changed preparation evidence only

`RYU_EXPECTED_MOVES_VARIANTS.json` now records `fresh_crosscheck=MATCH` at the new snapshot timestamp. `MEDIA_RECOVERY_AUDIT.json` contains per-clip identities, status, file existence and byte counts, plus per-asset static/animated classification and loader evidence. No app code, assets, DB, permissions or public flags were modified by this audit.

This audit is metadata/file/loader evidence; it reuses previous visual QA and does not claim a new gameplay or device verification PASS.
