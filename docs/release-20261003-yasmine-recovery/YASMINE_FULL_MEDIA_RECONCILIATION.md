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

