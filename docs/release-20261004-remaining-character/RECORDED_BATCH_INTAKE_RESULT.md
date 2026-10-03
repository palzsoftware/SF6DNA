# Remaining Character recorded intake — 2026-10-04 JST

Release status: **NO-GO**. Fast-track status: **NEEDS_INPUT / preparation candidate ready**.

## Fresh evidence and scope

- Remote/base: `de3b9b0938799fc80847cb73ea7a0b6a5d05cf98`; tree `47733e68c48f219f9928f9350426a2258f23f91d`. Fresh remote checked at start and before finalization; no remote drift observed.
- Initial working tree clean. Existing work was not overwritten. No game facts, runtime component, resolver, formatter, publication gate, asset, manifest, DB, migration, Production, main, sf6dna-v2 or Ver1.1 changed.
- Fresh read-only Supabase inventory: 31 published playable characters; 2,065 moves (2,052 draft / 13 archived). Current DB patch `2026.08.03`; this does not prove recorded footage patch or constitute new verification.
- Internal inventory includes Classic/Modern commands, active current-frame candidates, verification status, existing evidence relations and related video/source metadata. It contains no secrets or internal notes. `scripts/data/remaining-character-intake-20261004.json` is an offline working inventory, not canonical and not imported by web rendering.
- Previous fast-track evidence for Ryu, JP, Luke, Jamie, Manon, Marisa, Yasmine, Ingrid, Alex was reused. Canonical/Frame audits were not repeated. Ingrid recordings exist in prior intake metadata, but no local approved runtime manifest is present in this RC; it remains NEEDS_ADJUSTMENT.

## Recorded intake findings

C.Viper, Sagat, Elena, Mai, Terry, M.Bison, Akuma, Ed are **USER_REPORTED_RECORDED**, not file-confirmed. Targeted Latin/Japanese filename searches plus the available 116-MP4 inventory did not identify accessible source files for these eight. They may be recorded on the user's device; this is not evidence of absent recordings. No anonymous file was assigned to a character by guessing.

| Character | Accessible target source | Media processing | Preview cards |
|---|---|---|---:|
| C.Viper | Not identified | NEEDS_INPUT | 0 |
| Sagat | Not identified | NEEDS_INPUT | 0 |
| Elena | Not identified | NEEDS_INPUT | 0 |
| Mai | Not identified | NEEDS_INPUT | 0 |
| Terry | Not identified | NEEDS_INPUT | 0 |
| M.Bison | Not identified | NEEDS_INPUT | 0 |
| Akuma | Not identified | NEEDS_INPUT | 0 |
| Ed | Not identified | NEEDS_INPUT | 0 |

Recorded file-confirmed new characters = **0**; user-reported = **8**. Recording queue candidates = **14**, derived from 31 minus nine prior-work characters minus eight reported characters. They are UNCONFIRMED_RECORDING, not conclusively unrecorded. The prior “remaining 9” figure cannot be reconciled with current evidence; do not request duplicate recordings.

## Concrete preparation

`node scripts/prepare-character-media-intake.mjs` regenerates `scripts/data/CHARACTER_MEDIA_MAPPING_TEMPLATE_20261004.csv` from the frozen read-only inventory. There are **22 characters / 1,379 active required-category moves**. Every expected ID has exactly one template row. This is an intake reconciliation, not a claim that these moves render publicly.

Each row carries fresh ID/slug/name/category, Classic raw and formatted commands, Modern command, strength, condition, order, current-frame candidates and source relations. Source file, interval, game label and visual review remain blank. All media is UNRESOLVED / INPUT_PENDING. No mapping, cuts, assets or publication are auto-approved.

The existing shared formatter is reused without edits. **1,143 command fields resolve to its supported output; 236 require review for unsupported/raw grammar. Five of the 22 characters have no such formatter holds.** These flags do not certify DB command identity. Charge/state/compound notation is not guessed; review exact raw/numeric input against the recording. No runtime display was changed.

A small intake validator rejects wrong-character identity, invalid cut intervals and order-only approval. It is structural validation only; it cannot certify visual identity. Existing media validators remain required after cutting and cover files/posters/mappings.

## Page and content preflight

All 31 DB slugs have the existing V2 Preview route; Production V2 routing remains disabled. Existing renderer/filter/search/media layout and five-category grouping are reused. No new static fixture bulk copy, privileged rendering path or public gate bypass was introduced.

Live latest Preview checks: eight new target pages have correct H1, Quick Start, Move section and no desktop horizontal overflow, but **zero move cards**. Remote preview bundle/public gate/fallback data resolution remains a release blocker for these characters. Page shell availability and intake readiness do not mean data rollout complete. Mapping templates are ready; publication/rendering still needs evidence-qualified data resolution.

Existing live regressions: JP 59 cards / 26 videos; Yasmine 71 / 12; Alex 7 / 7. These are reused existing coverage, not full-character completion. Alex Light/Dark representative checks preserve seven cards and no horizontal overflow. 375px remains USER_REQUIRED in the later consolidated device batch. App console errors: 0 observed in this navigation range; browser-extension metadata errors were observed and excluded from app errors. Playback identity/decode was not newly audited without new footage.

Existing local manifests: **81 clips, 66 approved-for-preview, 15 mapping holds** (JP 1, Yasmine 14), eight characters. New media ready/integrated = **0**. Old assets and holds remain unchanged. New wrong/broken/duplicate media introduced = **0**; this does not certify every old video visually.

Related data: 112 character-video relations, only **3 published**; 31 YouTube source-reference relations. Candidate URLs from both paths dedupe to **112 character/YouTube-ID candidates**. Existing URL syntax/host/ID and explicit character relations were checked; HTTP availability, video contents and publication eligibility were not newly verified. No source reference was promoted to a Video entity. Combo/Setup relation counts are retained in the internal inventory; unverified content was not promoted.

## Checks

- Typecheck PASS; lint PASS; tests PASS: **557 / 557** (six intake tests added); release gates PASS: **14**.
- Build PASS. Next.js generated changes to `next-env.d.ts` and `tsconfig.json` were reviewed, saved outside the repo as diagnostic copies, then only those generated changes returned to their initial tracked contents. No generated config changes are included.
- Generic media validator PASS: **81 clips**, file existence/nonzero integrity. Recorded-four PASS: **17**; Alex PASS: **7**; Yasmine PASS: **26 / 12 approved / 14 held**. No decode or visual re-audit claimed.
- Diff check PASS. Fresh test count: 557; local candidate SHA is reported in the final response; no new runtime deployment is claimed.

## Preview and authorization

Vercel read-only confirmed base deployment `dpl_4EzU9EycsStQByAruQ7tvi8oqJiW`, READY, correct branch and exact **base SHA**.

Preview: https://sf-6-ihg0yfmcw-somas11620-9368.vercel.app

This batch is a local implementation candidate. User instruction §76 requires explicit remote-write approval for branch/character scope. No new-batch push approval was established, so **REMOTE_WRITE = 0**. The existing Preview is not a deployment of this candidate. Candidate SHA match = NOT_DEPLOYED; base SHA match = YES.

## Handoff and blocker classification

- NEEDS_INPUT: eight reported characters' source transfers. First needed file: actual C.Viper normals recording, suggested name `c-viper-normals.mp4`. Do not request re-recording.
- NEEDS_ADJUSTMENT: empty move data resolution on the remaining pages; Ingrid existing manifest coverage gap; 236 command review holds. These are exact preflight findings, not safely solved by publishing draft rows.
- RELEASE_CONDITIONAL: partial motion coverage, Jump input pending, unresolved variants, Frame patch, Combo/Setup/YouTube expansion.
- No new application P0/P1 caused by this candidate; existing empty move pages remain an explicit release blocker. Release remains NO-GO.

FRESH_BASE_SHA = de3b9b0938799fc80847cb73ea7a0b6a5d05cf98
RECORDED_CHARACTERS_CONFIRMED = 0_FILE_VERIFIED / 8_USER_REPORTED
RECORDED_COUNT = 8_USER_REPORTED_ONLY
RECORDING_REMAINING_COUNT = 14_CANDIDATES_NOT_VERIFIED_UNRECORDED
PREFLIGHT_COMPLETE_COUNT = 31_DB_STATIC / 11_LIVE_REPRESENTATIVE
MEDIA_READY_COUNT = 0_NEW / 66_EXISTING_APPROVED
MEDIA_INTEGRATED_COUNT = 0_NEW
COMMAND_NORMALIZED_COUNT = 1143_OF_1379_TEMPLATE_FIELDS / 5_OF_22_CHARACTERS_WITHOUT_FORMAT_HOLDS
PAGE_READY_COUNT = 31_SHELL / 22_INTAKE / NEW_TARGET_RENDER_COVERAGE_BLOCKED
HOLD_TOTAL = 1379_INPUT_PENDING + 15_EXISTING_MEDIA_HOLDS; 236_COMMAND_REVIEWS_OVERLAP
YOUTUBE_CANDIDATE_COUNT = 112_CHARACTER_ID_PAIRS_NOT_PUBLIC_APPROVAL
DB_WRITE = 0
PRODUCTION = NO_CHANGE
MAIN = NO_CHANGE
SF6DNA_V2 = NO_CHANGE
VER1_1 = NO_CHANGE
NEXT_SINGLE_ACTION = TRANSFER_EXISTING_C_VIPER_NORMALS_MP4
