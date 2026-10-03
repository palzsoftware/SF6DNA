# Yasmine recovery — partial, NO-GO

Base: 97e0dc33ec74454b84ca661ecb63af172f8756b7. Audit date: 2026-10-03.

User device QA invalidated the prior 26 mapping approvals. All 26 manifest entries are now mapping_hold; no Yasmine pilot clip remains approved. MP4s/posters and historical timestamps are preserved for re-audit, not deleted or accepted as correct. No new clip or timestamp was certified in this batch.

## Input access

All six original Library records exist: normals, unique-moves, specials1, specials2, throws, super-arts. Materialization failed HTTP 502 for each; an independent normals retry also returned HTTP 502. This is an input retrieval failure, not evidence of absent recording. Do not request re-recording on this basis. Raw video content, strength/OD/follow-up boundaries and SA identities have NOT been rechecked.

## Fresh read-only DB inventory

85 total rows; 73 required rows: normal 25, unique 2, target_combo 0, special 40, throw 2, super 4. Drive 8 and taunt 4 are outside the requested set. All 73 have Classic commands. All 73 remain draft.

The previous fallback constructed cards from approved clips: 26 cards / 2 specials. The fallback now uses a separate read-only DB snapshot: 73 identities / 40 specials, independent of media approval. Authorized remote data still takes precedence. This is Preview-only; Production publication and DB status remain unchanged.

## Numerical data

17 rows satisfy existing stored current-patch + verified + official move/Classic command/frame evidence requirements. Their existing values are reused unchanged. Other frames remain hidden. Stored verification is NOT a fresh official-table reconciliation. No missing value becomes zero; no unknown NULL becomes N/A by assumption.

## Checks

Typecheck PASS; lint PASS; tests 463/463 PASS; release gates 14/14 PASS. Build/Preview/browser evidence is recorded in DEVICE_REVIEW_HANDOFF.md after completion. Mapping validator: 26 held, 0 approved, structural errors 0. Structural PASS does not certify footage identity.

## Decision

LONG_RECORDING_PIPELINE = NEEDS_ADJUSTMENT (visual re-audit blocked by original retrieval).
MEDIA_MAPPING = NOT_ACCEPTED; 0 newly approved. Full media coverage and official reconciliation remain release blockers. Existing common desktop media layout is unchanged (~499px prior observed width); without approved Yasmine media, current Yasmine media-size acceptance is unverified.

Production/main/sf6dna-v2/Ver1.1/JP/Ryu/Beginner/Daily15 and DB are unchanged.

## Verified implementation and final report

Implementation SHA: d9bb90b47e76cb4073cdfd9ceb36b670acdd1fb7. Preview deployment dpl_FT3JW5D5MXiXEqGyC2BxKAkMgb41 was READY, branch sf6dna-v2-chatgpt-rc-20260916 and exact implementation SHA matched. Subsequent documentation-only commit does not change the tested application code; final deployment/SHA is confirmed in the final response.

Browser observations on this implementation: Yasmine all categories expanded = 73 distinct Move IDs / 0 videos; special filter = 40 distinct IDs. Desktop innerWidth1363 / documentWidth1348; document-wide overflow false, broken images 0. Dark and Light screenshots visually inspected. Stored eligible special values displayed unchanged; no fresh official reconciliation claimed. Browser's advertised capabilities do not provide viewport resize, so 375px remains USER_REQUIRED after corrected media is available. No new site-origin console errors observed; Vercel login FedCM and Chrome extension errors were excluded and not treated as SF6DNA errors.

JP route = 59 cards / 26 video elements; Ryu = 57 cards / 4 video elements; Beginner = 8 video elements after render. All three route smokes have no observed document-wide overflow. Their source/assets/manifests are unchanged. Runtime logs and initial network transfer bytes are UNMEASURED.

| Field | Result |
|---|---|
| BASE_SHA | 97e0dc33ec74454b84ca661ecb63af172f8756b7 |
| FILES_CHANGED | 10; explicit files only |
| YASMINE_MOVE_COUNT | 85 DB total / 73 required |
| NORMAL_EXPECTED / NORMAL_MAPPED | 25 / 0 approved (18 prior candidates held) |
| UNIQUE_EXPECTED / UNIQUE_MAPPED | 2 / 0 approved |
| TARGET_COMBO_EXPECTED / TARGET_COMBO_MAPPED | 0 / 0 |
| SPECIAL_EXPECTED / SPECIAL_MAPPED | 40 / 0 approved (2 prior candidates held) |
| THROW_EXPECTED / THROW_MAPPED | 2 / 0 approved (2 prior candidates held) |
| SA_EXPECTED / SA_MAPPED | 4 / 0 approved (4 prior candidates held) |
| SPECIAL_VARIANTS / OD_VARIANTS / DERIVATIVES | PENDING_VISUAL_REAUDIT |
| WRONG_MAPPING | Prior device FAIL; all 26 approvals withdrawn; no newly approved media |
| DUPLICATE_MAPPING | 0 structural duplicates |
| UNMATCHED_CAPTURE | UNVERIFIED; originals could not be materialized |
| MEDIA_OUTPUT_TOTAL / MEDIA_OUTPUT_SIZE | 0 new; prior 26 MP4 + 26 posters retained, 12,959,355 bytes |
| STARTUP_PRESENT / STARTUP_MISSING | DB65 / 8 UNKNOWN NULL; official unconfirmed |
| ON_HIT_PRESENT / ON_HIT_NA / ON_HIT_MISSING | DB53 / 0 newly classified / 20 UNKNOWN NULL |
| ON_BLOCK_PRESENT / ON_BLOCK_NA / ON_BLOCK_MISSING | DB57 / 0 newly classified / 16 UNKNOWN NULL |
| DAMAGE_PRESENT / DAMAGE_NA / DAMAGE_MISSING | DB73 / 0 / 0 |
| OFFICIAL_FRAME_SOURCE | CAPCOM Yasmine frame URL; fresh request 403; stored access 2026-08-27 |
| DB_OFFICIAL_MISMATCHES | UNVERIFIED; do not presume zero |
| DB_UPDATE_REQUIRED | UNDETERMINED until official reconciliation |
| DB_WRITE | 0 |
| MOVE_CARD_UI | 73 identity/Classic command cards; 40 special cards; stored eligible frames17; other frames withheld |
| DESKTOP_MEDIA_SIZE | Existing common ~499px media layout retained; Yasmine size not accepted without approved clips |
| 375_QA | USER_REQUIRED after corrected media available |
| DARK_THEME / LIGHT_THEME | PASS observed Desktop containment layout |
| JP_REGRESSION / RYU_REGRESSION / BEGINNER_REGRESSION | Route smoke PASS, no source/asset change |
| LONG_RECORDING_PIPELINE | NEEDS_ADJUSTMENT, retrieval blocks re-audit |
| RECORDING_CONTRACT | Do not infer identity by order. Review strength, OD, resource state, follow-up and every SA separately; exact timestamps require visual evidence. No re-recording requested. |
| PRODUCTION / VER1_1 | NO_CHANGE |
| TYPECHECK / LINT / BUILD / DIFF_CHECK | PASS fresh |
| TESTS / RELEASE_GATES | 463/463 / 14/14 PASS fresh |
| PREVIEW / SHA_MATCH | Implementation READY / YES; final docs deployment verified separately |
| NEW_P0 / NEW_P1 | 0 new observed; existing mapping failure remains unresolved |
| RELEASE_BLOCKERS | Raw materialization502; official403; media remapping incomplete; current official fields unreconciled |
| USER_DEVICE_QA_REQUIRED | YASMINE_ONLY after corrected clips; no repeat Daily15 QA |
| USER_DB_APPROVAL_REQUIRED | NONE requested now; separate exact diff/update/rollback proposal required if real DB discrepancies are confirmed |
| RELEASE_STATUS | NO-GO |
| NEXT_SINGLE_ACTION | Restore access to the same six originals, then resume content-based mapping; do not re-record or order-map |

