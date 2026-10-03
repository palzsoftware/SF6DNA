> Mapping acceptance withdrawn on 2026-10-03 after user device QA found name/command/video mismatches. All 26 mappings are held. Historical PASS statements below are superseded by ../release-20261003-yasmine-recovery/YASMINE_FULL_MEDIA_RECONCILIATION.md.

# Yasmine Media Integration Result — PARTIAL PREVIEW PILOT

BASE_SHA = 634ad668e3c84eb51ddb0be643a07d9604cb52b6
CODE_SHA = d2cf0baa4028eda337f1d23ce3e63b1fa903a34e
CODE_TREE = b3e69c5af92cd3937edff32b3bf6d9fef48e723a

The same six recordings were successfully retrieved and inspected. This supersedes the earlier access-blocked result; no re-recording was supplied or requested. Originals remain separate and unchanged. Full 73-move completion is not claimed.

## Coverage

Fresh read-only Yasmine inventory: character a9f61f3f-d6e0-4f98-8f1f-6fb94fae7baa; 85 DB rows, all draft; 73 required-category rows. No DB status, frame, command or gameplay fact was changed.

| DB category | Expected | Mapped clips | Held |
|---|---:|---:|---:|
| normal | 25 | 18 | 7 |
| unique | 2 | 0 | 2 |
| target_combo | 0 | 0 | 0 |
| special | 40 | 2 | 38 |
| throw | 2 | 2 | 0 |
| super | 4 | 4 | 0 |
| **Required total** | **73** | **26** | **47** |

Drive 8 and taunt 4 are outside this pilot. DB normal includes named command/chain attacks; those rows retain their DB category. Footage in the unique recording supplies six mapped normal-category rows. No taxonomy was rewritten.

26 cuts were identified through movement, recorded menu labels and/or HUD evidence, not recording order alone. Standing/crouching basics, named chains, two throws, Kulog/Ulan and four distinct super clips are mapped. The CSV contains all 73 fresh IDs/slugs, timestamps, outputs and evidence/hold reasons. Unresolved entries are not automatically missing recordings: seven normal rows (six jumping normals and one chain), two step rows, and 38 special strength/OD/enhanced/follow-up variants remain unassigned. Input history is absent and recordings contain failed inputs/repeats/resets; clarification of variant timestamps is needed before further mapping.

## Media and integration

INPUT_FILES = 6; INPUT_TOTAL_SIZE = 1,062,356,731 bytes.
MEDIA_OUTPUT_TOTAL = 26 silent H.264 MP4 + 26 WebP posters.
MEDIA_OUTPUT_SIZE = 12,959,355 bytes; MP4 portion = 12,308,989 bytes.
All MP4s: 640×360, 60 fps, yuv420p, faststart. Source footage is never upscaled. All 26 final MP4s decode without ffmpeg errors. Manifest records source/output SHA256, fresh move identity, individual cut/poster offsets, observed whiff/hit/demo variant, and approved_for_preview status. SA3 is not reused for CA.

Preview fixture integration uses the shared motion adapter and Move Card. Yasmine fallback is Preview-only; remote authorized data remains preferred. Production/development return no Yasmine pilot fixture. All pilot moves remain draft and frame=null: unverified numerical values are not copied or labeled verified. This does not remediate the separate all-character publication blocker.

Shared media-bearing Move Cards now allocate a larger desktop media column. At observed viewport 1363px, card width 1180px and media width 499.3px (previous static wrapper maximum 190px). Commands retain a separate column. Rows without media and the existing ≤760px layout are preserved. No Yasmine-only CSS override was added.

## Verification

Fresh checks on CODE_SHA: typecheck PASS; lint PASS; tests 462/462 PASS; release gates 14/14 PASS; build PASS; diff-check PASS. Generic motion validator PASS: 26 clips / 6 sources. New tests cover IDs/files/uniqueness/cut bounds, super distinctions, Preview-only boundaries, frame hiding and held/wrong-character rejection. Build-generated configuration changes were inspected and excluded; typecheck was repeated with original configuration.

Code Preview: dpl_CcyBWGXHq6MhURmpEQkqBfPa9nzJ, READY, target Preview, branch sf6dna-v2-chatgpt-rc-20260916, exact d2cf0baa4028eda337f1d23ce3e63b1fa903a34e.
Observed URL: https://sf-6-9lrpfrsjx-somas11620-9368.vercel.app/characters/yasmine
Final documentation commit/deployment SHA is reported in the task handoff; documentation-only delta reuses these code-tree checks.

Browser: all four available category groups expanded; all 26 move IDs/cards/videos present, all 26 video readyState≥2 after visiting, video errors 0, broken images 0. Desktop Dark and Light visually inspected; document width 1348px at innerWidth1363px, no document overflow observed. Two-frame source/start/end cut sheets and fine SA boundaries were reviewed before integration. Device acceptance of mapping/start/end remains pending.

JP and Ryu route smoke PASS. Ryu shared media width 499.3px; JP SA1/SA2 distinct existing URLs/posters retained. Existing JP/Ryu binary assets and manifests unchanged. Beginner route renders with 8 video elements; no tutorial media files or mapping changed. Daily15/History untouched; existing device evidence reused.

Console: no new application errors observed in inspected routes; extension metadata errors and a Vercel sign-in FedCM error during initial protected Preview access are separate browser/provider noise. Runtime logs not audited. Actual 320/375/390/430 viewports are USER_REQUIRED: this browser advertises no viewport control, so desktop observations are not mobile PASS. Reduced-motion handling is unchanged and statically reviewed; dynamic emulation not run.

Performance: preload=none on all 26 move videos; initial offscreen elements stayed readyState0 until approached. Poster-first and viewport-triggered playback preserved. Media total size is not initial transfer. Exact initial transfer/LCP/CLS NOT_MEASURED. No critical desktop rendering or decode regression observed.

## Decision

MOVE_MAPPING = 26 reviewed / 47 held; duplicate IDs/slugs/output paths = 0; broken final media = 0. No wrong mapping observed in the reviewed subset, subject to user acceptance. Missing input moves UNDETERMINED for held entries; no guessed variants or reused clips. LONG_RECORDING_PIPELINE = NEEDS_ADJUSTMENT. Recording contract is in LONG_RECORDING_PIPELINE_DECISION.md.

GAME_FACT_CHANGE = 0; DB_WRITE = 0; PRODUCTION = NO_CHANGE; VER1_1_CHANGE = 0; PUBLIC_BOUNDARY_CHANGE = 0. Existing public publication gates, AI Coach/Training/Strategy flags, Chibi rights status, JP SA2 and Beginner media are unchanged.

RELEASE_STATUS = NO-GO. The full Yasmine media pilot remains incomplete; separate existing release/publication/auth/rights decisions are not closed by this batch. Next action: review the Yasmine Preview subset and identify timestamps/strengths for held variants from the same recordings. Additional recording is only needed after a specific absent action is confirmed.
