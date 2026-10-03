# Yasmine official Frame reconciliation / approval preparation

BASE_SHA=6ccc5a1b0ae7b1853a4fcec81499fb378ef6ce89. 2026-10-03 JST.
DB_WRITE=0. Production/main/Ver.1.1 unchanged. Media26 HOLD; assets retained.

## Evidence / count units

20 prior Command families reused without re-audit (COMMAND_FAMILY records). Five official Frame captures visually transcribed; overlap deduped (FRAME_VARIANT_ROW records). Combat71: normal18 including jump6, official 特殊技7, special40, SA/CA4, throw2. Common systems10. Do not add20 families to71. TARGET_COMBO subgroup not independently labelled; Preview uses existing unique grouping without DB category changes.

Fresh DB85 moves/current frames.81 capture rows correspond by name/input/strength/stage/condition and fresh IDs. Four taunts outside supplied table: UNRESOLVED_NOT_IN_SUPPLIED_TABLE, not proven DB_ONLY. OFFICIAL_ONLY=0 within supplied table. Canonical capture count71 combat/81 including systems; entire Master PARTIAL.

## Evidence gaps

DB current patch2026.08.03/ecff9a58-d023-43ae-9962-79d25adfc1f3. Capture date is not target patch proof. All official rows PATCH_UNRESOLVED. 2026-10-03追加資料でLinya注記全文を確認。SA1はヒワン・ン・カラヒタンと読め、既存Command-family/DB名称と一致。前回Frame転記の「ン」欠落を訂正。 No secondary-source substitution.

## Frame comparison

77 row matches/4 row mismatches/4 unresolved taunts. Numeric '+' prefix and equivalent dash glyphs normalized only. D/ranges preserved. Blank/dash means no value stated for this row, shown as —; not invented zero or universal N/A. Optional active/recovery transcription partial, not silently filled from DB.

| Field | Match | Official blank/dash | Mismatch | Unresolved |
|---|---:|---:|---:|---:|
| startup |71|8|2|4|
| on_hit |56|23|2|4|
| on_block |56|25|0|4|
| damage |79|0|2|4|

Category differences7 confirmed by official 特殊技 header. Relative order SA1/SA2 and ヒワン/ワリス:2 pairs/4 rows. Official category-local order is not blindly copied into global DB indices. Literal name-label differences2 remain: standing MK subtitle and crouching HK pose prefix; not two distinct move identities. SA1 source spelling conflict resolved as prior transcription error. Nine Alon second-stage/state rows have no direct input in official table: COMMAND_CONTEXT_REQUIRES_REVIEW. Five DB rows append P; automatic transition recorded separately, not inferred extra input. No parent/frame/variant merge.

## Approval boundary

Numerical candidates6 fields in4 rows: throw2 on_hit=D; parry/cancel Drive Rush2 startup=NULL and damage=0. Exact fresh IDs/current/proposed values in Frame CSV. Approval pack PARTIAL/NOT_EXECUTABLE. Target patch/source-to-fact relation/category schema/command context must be established before bounded SQL. Later UPDATE candidates require old-value predicates, expected counts, verification SELECT and rollback from retained current values. Separate identity/category/order, command and frame scopes; no blanket85-row overwrite. Executable DB_UPDATE_REQUIRED count pending. No SQL/verification/status/source/RLS/RPC changes.

## Preview-only correction

Separate YASMINE_OFFICIAL_CAPTURE_PREVIEW_20261003.json holds71 combat rows in official order. Old DB snapshot and media assets retained for comparison/validator compatibility. Systems/taunts excluded from combat cards, not deleted. Yasmine-only Preview capture precedes unconfirmed remote identities. Production/development cannot obtain this bundle. Capture fields reviewed, never verified; visible version caveat. Blank/direct-input dash shows — with condition, printed0/D/ranges retained. Classic only; unreviewed DB Modern inputs not imported. Public gate/flags unchanged.

MEDIA_REMAP_READY_COUNT=0 (no video visual approval this batch). MEDIA_HOLD_COUNT=26. Prior12 assets retained, not reapproved. JP/Ryu/Beginner/Daily15 unaffected.

## Validation

Fresh typecheck/lint/build PASS, tests473/473 PASS, gates14/14 PASS. Media validator errors0 approved0/held26. Build-generated next-env.d.ts/tsconfig differences inspected/excluded. Browser checks recorded below; 375px USER_REQUIRED. Test success is not target-patch certification. RELEASE_STATUS=NO-GO.

## Input integrity

- image(20261003-080108).png: (1590, 1216), SHA256 5887c27a20a77dbf61d7967a2c327fdaedf06302dff741e1b527bd7a7839d46c
- image(20261003-080050).png: (1405, 908), SHA256 12ce478b4a559b6b7459a88f376395ad42a72955797376d5de3fa31be9b2662d
- image(20261003-080129).png: (1596, 1046), SHA256 d83ebca0afc4dc39e239076d54feead7265c7da2068792fb5994f37560076825
- image(20261003-080124).png: (1367, 1142), SHA256 5848a7c129ea6fc6499dff548be69aebe00278af43ce57bae1f142e8818e08c7
- image(20261003-080100).png: (1348, 506), SHA256 3e5f1a178f44e724a2b42338ad5559ff5c63cc8485408fbc410dc6c7336cd9d8

## Exact numerical candidate rows

| Table | Row ID | Move | Field | Current | Proposed | Source |
|---|---|---|---|---|---|---|
| move_frame_data | 6fa1f8ff-fb49-4211-8333-508c23f5ef6f | ピギル・ウロ | on_hit | NULL/empty | D | image(20261003-080124).png |
| move_frame_data | 204974a2-c459-49ca-83b6-5b362efe1187 | ヒラ・カマイ | on_hit | NULL/empty | D | image(20261003-080124).png |
| move_frame_data | 3094e995-dacb-4ceb-b2de-e9e0d48003a8 | パリィドライブラッシュ | startup | 3 | — | image(20261003-080129).png |
| move_frame_data | 3094e995-dacb-4ceb-b2de-e9e0d48003a8 | パリィドライブラッシュ | damage | NULL/empty | 0 | image(20261003-080129).png |
| move_frame_data | 7778ea64-d350-4185-a6ec-2ac5ecf37930 | キャンセルドライブラッシュ | startup | 9 | — | image(20261003-080129).png |
| move_frame_data | 7778ea64-d350-4185-a6ec-2ac5ecf37930 | キャンセルドライブラッシュ | damage | NULL/empty | 0 | image(20261003-080129).png |

## Browser verification (2026-10-03)

Implementation Preview dpl_58MV36MtKcSzYch1qCvSVu5haKnW READY, branch sf6dna-v2-chatgpt-rc-20260916, exact SHA37908a5a6d2b998d5ade8ae2e9db6460fb51bf83. Browser width1363px. Filters all71/normal18/特殊技7/special40/throw2/SA4 PASS. Formal name ヒワン・パババ search1; 6MP substring search3 (also236MP), PASS. Throws display D/— and1200; SA/CA rows2000/0/4000/4500 observed. Visible Yasmine videos0. Dark/Light selection and rendered appearance observed; document overflow0. JP/Ryu render correct headings/move sections, video elements26/4 and overflow0. App error not observed in captured log window; extension metadata errors excluded, coverage limited (20 latest errors). Transient browser transport recovered once. 375px USER_REQUIRED; no supported viewport resize API. No new observed P0/P1; existing canonical blockers remain.

Final documentation-only commit uses the same code/assets as this verified implementation. Deployment SHA checked separately in final report. This does not certify target patch,  taunt4 absence or media mapping. Media26 HOLD; remap-ready0.

## Narrow evidence addendum — 2026-10-03 JST

Base2e7e4ee688c40ad3d9c28ec1f2ddcd2db05063a6; fresh remote confirmed unchanged. Scope: five new captures only; Command20 families/Frame81/DB85 not re-audited, no fresh DB queries.

PATCH_STATUS=PATCH_UNRESOLVED. All five captures show table rows only: no version/date/patch heading or selector. Capture filename/date cannot establish target patch or match DB2026.08.03. No web/secondary-source substitution.

Linya note from image(20261003-083628).png: 「初段ヒット/近距離で空振り時/位置が入れ替わった場合2段目に派生」。Full note now readable; condition recorded without borrowing parent frame values. Existing startup22/on_hit D/on_block-3/damage1100 remain FRAME_MATCH; no new numerical comparison or count change. Source-to-patch verification still unresolved.

SA1 image(20261003-083638).png reads 「SA1 ヒワン・ン・カラヒタン」. Retained Command family and current comparison DB name agree. Previous Frame transcription omitted ン; this was a transcription error, not official-source disagreement. Canonical/Frame/Diff CSV corrected. Literal name-label differences3→2; category7 and order2pairs/4rows unchanged.

Master remains PARTIAL solely within existing evidence limitations, including patch context and four taunts absent from supplied table. No claim of full roster proof. Frame77 match/4 mismatch/4 unresolved unchanged; numerical candidate4rows/6fields unchanged. DB approval pack NOT_EXECUTABLE; DB_WRITE0, no SQL execution.

Documentation-only update. Preview code/snapshot unchanged this batch: prior Preview still has abbreviated SA1 name and clipped-note fallback; these presentation corrections are pending a separate bounded code update. Do not use old Preview wording as canonical evidence. Previous code tests473/gates14/build are same-code evidence reused, not fresh runs. Current docs diff-check required. Media26 HOLD/ready0; no mapping changes. Production/main/Ver.1.1 unchanged.

NEXT_SINGLE_ACTION: provide official page version/date/patch context (header/selector or explicit official statement); no resend of81 frame rows or recordings required.

### New input integrity
- image(20261003-083600).png: SHA256 8f4f7df21c1007dd5c9da22bb97e69efdff9219ea771e7a5e1b458c6b89d86a6
- image(20261003-083606).png: SHA256 cc4c2d7cfad996de76c33b93b17661f534b9621e238b1103472f06d9b98e2b12
- image(20261003-083615).png: SHA256 4ee9ac1e46f51b31608ecba2941581ec358f1aba7ab47f09a6633e8756a35b52
- image(20261003-083628).png: SHA256 22cdb1f70774d53267db44bd0abe573c7c01cedfac21c0d9322da3cee38e795d
- image(20261003-083638).png: SHA256 f1b0c9d7a19079012d8713605b61669e15f766adf63bf7ceed02c7260bd08421
