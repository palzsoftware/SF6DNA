# Yasmine official-capture reconciliation — partial

2026-10-03 JST. BASE_SHA = aeff14867ac36d8762298a9bd6b5d808098129b2. DB_WRITE = 0. Production/Ver.1.1 unchanged.

## Evidence intake

Official pages supplied by the user as screenshots/PDF, reviewed directly. Browser 403 no longer blocks the readable Command List evidence. Original uploads are retained without edits. PDF text extraction was checked against rendered pages 1–2, especially non-text arrow/P/K icons. Screenshot overlaps/PDF repetitions are one official entry, not duplicate moves.

- スクリーンショット_3-10-2026_162049_www.streetfighter.com.jpeg: SHA256 `25c9e290480e554ccc9296bbe061ceb590f04017f52b8ef2d767caf06d41458d`
- スクリーンショット_3-10-2026_162144_www.streetfighter.com.jpeg: SHA256 `b54567e9198afc03d0698e5c13139954d66a21d3bb115077a58592c14715a89e`
- ヤスミン コマンドリスト｜STREET FIGHTER 6（ストリートファイター6）｜CAPCOM.pdf: SHA256 `69fb2a93d86f2b342a878ef4343b416a59857eba82e9dd3c1b1e9bf8711e7fff`

- Command PDF: 4 pages. Combat command entries readable on pages 1–2. Page 2 has overlapping navigation graphics; underlying first unique name corroborated by extracted PDF text and command screenshot.
- Command screenshot: 629×2048. Confirms the same groups; no separate normal section appears in this Command List. Normal identities must come from Frame Data / game command list; absence here is NOT OFFICIAL_ONLY/DB_ONLY evidence.
- Frame screenshot: 532×2048 for the whole page. Table names, column headers, minus signs, values, variants and notes are too small to reliably transcribe. A 4× inspection enlargement adds no source detail. No guessed numerical value is accepted. Current official patch is not readable/confirmed.

## Readable official Command List entries

20 distinct character-specific entries/families: SPECIAL 9 (including 3 follow-up entries and Linya condition), SUPER 3, official 特殊技 6, THROW 2. This is NOT canonical DB/card/variant count. The 6 特殊技 entries include directional and multi-input moves; the page does not independently label a TARGET_COMBO subgroup. No split into invented weak/medium/heavy/OD/CA rows is made.

SA3 states 体力25%以下で性能がアップ. This confirms the condition but does not by itself decide separate CA DB-row/card handling. Parent inputs are separated from follow-up inputs: e.g. アロン is 6P during ダロイ・ン・トゥビグ, not an unconditional 6P; リニャ is 4KK during ナカタゴン・ラカス. DB combined parent~followup notation is not automatically called a wrong command. P/K are generic button icons; no unshown strength/OD variants inferred.

## Fresh DB comparison

Fresh read-only SELECT fetched character, all 85 moves, commands, frames, patches, sources and entity_sources. Actual source relation table is entity_sources. DB current rows = 85. Preview retains its existing 73 unconfirmed cards; no Preview data correction has been published.

Confirmed CATEGORY_MISMATCH: 7 DB rows map to the six official 特殊技 entries but currently have move_type=normal. Target-combo schema decision remains pending; proposed DB type is not guessed.

| DB slug | Official entry | Current category |
|---|---|---|
| yasmine-kumbinasyong-pampabagsak-2mk-hk | コンビナション・パムパバッグサ | normal |
| yasmine-walis-na-pabagsak-4hk | ワリス・ナ・パバグサ | normal |
| yasmine-kidlat-na-hiwa-5lp-lp | キドラット・ナ・ヒワ | normal |
| yasmine-sunod-sunod-na-sipa-1-5mk-mk | スノスノッド・ナ・シパ | normal |
| yasmine-sunod-sunod-na-sipa-2-5mk-mk-hk | スノスノッド・ナ・シパ | normal |
| yasmine-tatlong-hiwa-5mp-mp | タッロング・ヒワ | normal |
| yasmine-hiwang-pababa-6mp | ヒワン・パババ | normal |

Confirmed relative order problems (2 pairs / 4 rows): SA2 is ordered before SA1 in DB (1 vs 9), opposite official SUPER order; ワリス precedes ヒワン in DB (37 vs 57), opposite official 特殊技 order. Official family order and DB global display_order are different units: no automatic numeric replacement proposed.

Names: official base names transcribed; DB helper labels (SA1/weak/OD/part number) kept separate conceptually. No unsupported claim of global name match/mismatch. Commands: matching input-only subsets recorded in CSV; condition/variant identity is still incomplete. All 85 rows remain incomplete comparisons. Family candidates are not full row verification. DB_ONLY/OFFICIAL_ONLY and canonical total remain UNDETERMINED.

## Frame reconciliation

85 current frame rows recorded as comparison values only. Official startup/on_hit/on_block/damage/active/recovery remain blank with explicit UNRESOLVED_IMAGE_TEXT_TOO_SMALL. Numeric zero, D/ranges and NULL are preserved. Official N/A cannot be inferred from NULL or move type alone. Stored verified status does not certify the supplied capture or current patch.

## Approval status and safe boundary

DB_UPDATE_REQUIRED = YES_FOR_CATEGORY_AND_ORDER_FINDINGS; full update scope UNDETERMINED. Approval pack = PARTIAL / NOT_EXECUTABLE. Exact current row IDs/command IDs/frame IDs are in CSV; proposed target schema/category, variants, official frame facts and current patch must be resolved before bounded UPDATE/preconditions/verification/rollback SQL. No SQL execution, DB status/evidence changes or verification promotion.

All 26 Yasmine mappings remain HOLD_UNTIL_CANONICAL; assets retained. Canonical identity is not complete, so no mapping reapproval or Preview Snapshot rewrite. JP/Ryu/Beginner/Daily15 code untouched.

## Verification scope

Documentation-only delta. Fresh full checks: typecheck PASS, lint PASS, tests 468/468 PASS, release gates 14/14 PASS, build PASS. Build-only next-env.d.ts/tsconfig.json edits inspected and excluded; no unrelated code edits staged. Diff-check PASS. Current CSV structural checks confirm 20 unique official entries, 85 unique DB IDs, 85 current frame IDs, 7 category findings, zero populated official numerical fields. These are reconciliation-structure checks, not Canonical correctness certification. New P0/P1 not assessed for incomplete Master; existing identity blocker remains.

NEXT_SINGLE_ACTION: supply a Frame Data PDF or original-resolution screenshots split into table sections (all column headers, every row, variants/notes and patch/version). Do not resend the readable Command List or gameplay recordings. Then complete canonical normal/variant/frame inventory, propose corrections, run UI checks on an approved complete Preview Snapshot and obtain separate DB approval. RELEASE_STATUS = NO-GO.
