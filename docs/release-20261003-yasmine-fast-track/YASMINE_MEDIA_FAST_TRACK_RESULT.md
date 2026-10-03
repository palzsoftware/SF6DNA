# Yasmine fast-track result — 2026-10-03

## Decision

CONFIRMED_MEDIA_MAXIMIZED_FOR_ACCESSIBLE_SOURCE = 12
WRONG_MEDIA_VISIBLE = 0 observed
ALL_SOURCE_FILES = 1 processed / 5 exactly blocked
FAST_TRACK_PIPELINE = NEEDS_ADJUSTMENT (source delivery; no requirement to resolve patch or all media before next character)
RELEASE_STATUS = NO-GO

No Command/Frame/DB re-audit or patch exploration. Reused Command 20 families, DB 85, official Frame 81, 77 matching rows, 4 mismatched rows / 6 fields, 4 rows outside supplied material, 7 category mismatches, 2 order pairs / 4 rows. Official capture Preview has 71 combat cards. Frame verification remains reviewed, PATCH_UNRESOLVED; no Production verification grant.

## Coverage (Canonical combat identities, not old DB classifications)

| Category | Expected | Confirmed media | Unresolved |
|---|---:|---:|---:|
| Normal | 18 | 12 | 6 |
| Unique / target combo | 7 | 0 | 7 |
| Special | 40 | 0 | 40 |
| Throw | 2 | 0 | 2 |
| Super / CA | 4 | 0 | 4 |
| Total | 71 | 12 | 59 |

Every unresolved Move ID/slug/command is in YASMINE_MEDIA_FAST_TRACK_MAPPING.csv. Unresolved is not an assertion that the user failed to record it. The six jump identities were not established in this source; no substitute clips are assigned.

## One-source processing

| Source | Result | Attempts this batch |
|---|---|---:|
| yasmine-normals(3).mp4 | Local original read; entire timeline and detailed action intervals reviewed | Local, no redownload |
| yasmine-unique-moves(2).mp4 | SOURCE_ACCESS_BLOCKED_HTTP_502 | 2 |
| yasmine-specials1(1).mp4 | SOURCE_ACCESS_BLOCKED_HTTP_502 | 1 |
| yasmine-specials2(1).mp4 | SOURCE_ACCESS_BLOCKED_HTTP_502 | 1 |
| yasmine-throws(2).mp4 | SOURCE_ACCESS_BLOCKED_HTTP_502 | 1 |
| yasmine-super-arts(2).mp4 | SOURCE_ACCESS_BLOCKED_HTTP_502 | 1 |

All five original file records were located, but their video bytes could not be downloaded. Files were attempted sequentially, not together. No disputed old unique/special/throw/SA mapping was restored from recording order or prior approval.

Normals original SHA256: c20e61b210382cbfad62c62e71eb6425605b113b3bc91c146324803f0787381c; 136,363,686 bytes; 47.533 seconds; 2560×1440 HEVC ~60fps. Original unchanged. Motion and standing/crouching stance, Canonical identities/commands and neutral clip boundaries were compared. Recording order only supports those checks; there is no input HUD or OCR evidence. Twelve existing identical source intervals/MP4/posters reused with no redundant encode. All 24 files decoded successfully; combined 1,647,227 bytes. Original 26 assets kept; 12 scoped approvals / 14 existing mappings held.

## Containment and data

The Yasmine remote media path remains held, including inline bundle media. A separate per-clip local resolver requires Canonical ID, slug, name, category, command, visual review, source and cut bounds. Blanket approval, altered identity, duplicate mapping, or altered timestamps fail closed. The local resolver is Preview-only. Unresolved cards remain visible without media.

Preview snapshot now uses SA1 ヒワン・ン・カラヒタン and the confirmed Linya condition: 初段ヒット/近距離で空振り時/位置が入れ替わった場合2段目に派生. Frame numbers unchanged. No DB statuses/evidence/verification changes.

## Public command formatter

Shared Move Card and JP Move Card use one conservative formatter; recognized compact input atoms convert directions and LP/MP/HP/LK/MK/HK into arrows and 弱中強. Unknown notation, Japanese text, existing arrows and conditions remain unchanged. Charge/other unsupported grammar is preserved rather than guessed. Raw numeric data stays in the data model, and raw/formatted strings both feed search. No always-visible 原表記 line on Move Cards. Combo/Setup/Sequence rendering unchanged.

Tests cover all eight requested examples, Japanese/arrow preservation, unknown grammar, raw/formatted search, Canonical per-clip containment, altered timestamps and Production exclusion. Existing 31-character synthetic DOM coverage still checks all required IDs. This is a safe formatter baseline, not a claim to parse every SF6 input grammar.

## Verification

| Check | Result |
|---|---|
| typecheck | PASS |
| lint | PASS |
| tests | 486 / 486 PASS |
| release gates | 14 / 14 PASS |
| build | PASS |
| diff check | PASS |
| Yasmine mapping validator | PASS; 12 approved / 14 held |
| MP4 / WebP decode | 24 / 24 PASS |
| Yasmine cards | 71; normal 18 / unique 7 / special 40 / throw 2 / SA 4 |
| Media | Only 12 confirmed normal cards; all twelve searched and DOM association checked |
| Desktop Dark / Light | PASS; representative video readyState 4 and currentTime advancing |
| Desktop media width | 499.296875 px |
| Page-wide overflow | 0 observed |
| 375px | USER_REQUIRED; viewport resize unavailable in this browser surface |
| JP command regression | PASS; 59 cards, existing Japanese/arrows retained |
| Ryu command check | PASS; 57 cards, normalized commands |
| Ingrid live command check | UNVERIFIED: current Preview returned 0 move cards; other work left unchanged |
| App console | 0 new application errors observed; browser-extension metadata errors excluded |
| Initial media delivery | preload=none / poster-first / viewport observer retained; not all videos initially decoded |
| LCP / transfer benchmark | Not measured; total asset bytes are not initial transfer |

Tests/build were run with npm on Linux, equivalent scripts to requested npm.cmd. Build-generated next-env.d.ts / tsconfig.json changes inspected and excluded; original tracked contents retained.

## Fast-track baseline for the remaining characters

1. Reuse existing identity/evidence; compare only mismatches, NULLs and unresolved variants.
2. Process one recording at a time. Prefer visible game success-name/input labels plus actual animation. Never recording-order-only mapping.
3. Each Move becomes CONFIRMED or UNRESOLVED; one unresolved variant does not stop its siblings or other categories.
4. Reuse same source hash / interval / Move output; decode MP4 and poster, validate IDs, categories, duplicate mappings and cuts.
5. Integrate only scoped confirmed clips; keep remaining cards without media; check Preview and move to next character.

Yasmine patch, unresolved media, Production verification, extra videos/combos/setups remain backlog. No new all-character official audit. Yasmine is paused safely after accessible-source integration; source-delivery failure does not block Ingrid or the next character.

BASE_SHA = bda01b7d61968c5cd3ffaf7f667cd58a664891f1
IMPLEMENTATION_SHA = d44eab0e33b5676716db3267f674c04b56fe7b46
IMPLEMENTATION_TREE = 993788de0e48a5caa0517be6b16c37c53e80b257
PREVIEW = READY
DEPLOYMENT = dpl_8MGjDo9kurR1t6v9wp7qxdvbkXHJ
SHA_MATCH = YES for implementation Preview
PREVIEW_URL = https://sf-6-dcpyntts8-somas11620-9368.vercel.app/characters/yasmine
WRONG_MAPPING = 0 observed in restored subset
DUPLICATE_MAPPING = 0
BROKEN_MEDIA = 0
FRAME_MATCH = 77_REUSED
FRAME_MISMATCH = 4_ROWS_6_FIELDS_REUSED
PATCH_VERSION = UNRESOLVED
PATCH_VERIFICATION = UNRESOLVED
DB_WRITE = 0
PRODUCTION = NO_CHANGE
VER1_1 = NO_CHANGE
NEW_P0 = 0 observed
NEW_P1 = 0 observed from this change; existing unresolved media and other-character data not closed
USER_DEVICE_QA_REQUIRED = YASMINE_RESTORED_NORMALS_ONLY
NEXT_SINGLE_ACTION = If continuing Yasmine, supply unique-moves only; otherwise proceed to next character with success-label evidence. Do not repeat Canonical/Frame audit.
