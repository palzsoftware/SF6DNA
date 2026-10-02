# JP SA1 / SA2 Motion Media P1 correction — 2026-10-02

BASE_SHA = 14468ba0641d92f6b9f306a2a4526d09c8fa5a0c
ROOT_CAUSE = MP4_CONTENT_SWAPPED
DEVICE_RETEST = NOT_RUN
RELEASE_STATUS = NO-GO

## Evidence and minimal correction

The latest RC was checked against the remote before editing. Move IDs, manifest URL bindings and the renderer preserve the correct separate SA1/SA2 identities. The user reported correct names/posters with reversed playback. Exported MP4 frames were inspected with ffmpeg (one frame per second) and ffprobe durations.

| Path | Before actual content | Corrected actual content | Duration | Bytes |
|---|---|---|---|---|
| jp-sa1.mp4 | Lovushka: gauge 3 → 1, portal/spheres and delayed hits | Chornobog: gauge 3 → 2, projectile and hit sequence | 4350 ms | 852298 |
| jp-sa2.mp4 | Chornobog: gauge 3 → 2, projectile and hit sequence | Lovushka: gauge 3 → 1, portal/spheres and delayed hits | 7000 ms | 1079850 |

The existing exported byte sequences were placed at their correct paths without re-encoding. Posters, move IDs, slugs and media/poster URLs are unchanged. No renderer redesign or cache query parameter was introduced. Manifest duration, loop end, file size and inherited source offsets follow the corrected byte sequences. The original source capture was not available for re-inspection; source offsets are inherited provenance, not newly verified capture boundaries. Mapping evidence now states the observed exported-video identity and pending device retest. Existing publication/verification statuses remain unchanged.

## Corrected SHA-256

SA1_MP4 = 7cc436d994eecb24d1def02e2aeac6fd28ad832100e674d109f0cfe2ef0411d8
SA2_MP4 = c0c574c716ae554eb3c9c985b1aff8c5b62b8fdb84f946b93c4e57405cbaf94f
SA1_POSTER_UNCHANGED = 843df7b99bdfbef5981f0bd6eca6eeb9c10bd8068de459d1860b00ec6a42c67d
SA2_POSTER_UNCHANGED = 27218e5a97f02b2a392faa0add731de4656b6c6e91f6a158c053f7df1b441c05
SA3_MP4_UNCHANGED = 96b3223e3f77f7222ff28c49eab61544f0cc97463f5cee057ff82e5304f72255
CA_MP4_UNCHANGED = fdda0948f87bbb5a6f8dc0e06a003d9611ddb49faec19e1030c2433f9e561729

## Regression

Three new identity regression tests lock the inspected MP4 hashes, canonical move/URL bindings, unchanged poster hashes, sizes/durations, distinct files and SA3/CA invariance. Hash checks alone do not identify a game move; their semantic basis is the visual review above. Targeted existing/new media tests: 18 PASS. Full tests: 401 PASS / 0 FAIL. Release gates: 14 PASS. Lint/build PASS; final sequential typecheck and diff check recorded in the completion report. Build-generated config changes were inspected and excluded. The first typecheck overlapped build-generated type deletion; it was rerun sequentially after build rather than treated as an application regression.

## Preview and remaining acceptance

Final commit SHA, deployment URL/ID, READY and exact branch/SHA match are recorded in the completion report after the Git-triggered Preview completes. No extra documentation-only Preview is created to embed the self-referential commit SHA here.

JP_SA1_SA2_P1 = FIXED_PENDING_DEVICE_RETEST once Preview READY / SHA match is confirmed.
User retest is limited to two cards: JP SA1 and JP SA2, each name → poster → played motion once. Close the P1 only after both pass. JP special media, public copy, Production, DB, main, sf6dna-v2 and Ver.1.1 were not changed.
