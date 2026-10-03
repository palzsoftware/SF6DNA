# Yasmine canonical reconciliation — blocked approval pack

Date: 2026-10-03 JST. Base: `a829e4e52839b3d8aad987c56aa416d38a05b1ef`.

CANONICAL_MOVE_MASTER = BLOCKED / INCOMPLETE. DB_WRITE = 0. Production/main/sf6dna-v2/Ver1.1 unchanged.

## Fresh observations

- DB moves: 85, all draft. Preview Snapshot: 73. DB current frame rows: 85 (81 stored verified, 4 reviewed). Current DB patch: 2026.08.03, ID ecff9a58-d023-43ae-9962-79d25adfc1f3. Official current patch could not be freshly confirmed.
- DB categories (comparison only): normal 25, unique 2, target_combo 0, special 40, throw 2, super 4, drive 8, taunt 4. These are not official canonical counts.
- Snapshot omits exactly the 8 drive and 4 taunt rows. Its 73 IDs still match the remaining Fresh DB IDs. Identity equality with DB is not correctness proof.
- DB normal includes direction/chain commands 6MP, 4HK, 5LP~LP, 5MP~MP, 5MK~MK, 5MK~MK~HK, 2MK~HK. These are CATEGORY_REVIEW_CANDIDATES, not official CATEGORY_MISMATCH findings. DB unique includes forward/back steps (66/44); official category remains unresolved.
- The DB normal set has 6 jumping identities. This is a DB count, not a confirmed official jumping-normal inventory.
- The correct official names, category/order, commands, strength/OD/conditions, SA3/CA identity and canonical total are all UNRESOLVED. No corrections were inferred from DB, slug, recording order or secondary sources.

## Official access and stored evidence

| Source | Fresh result |
|---|---|
| https://www.streetfighter.com/6/ja-jp/character/yasmine | HTTP 403 |
| https://www.streetfighter.com/6/ja-jp/character/yasmine/movelist | HTTP 403; browser CloudFront Request blocked |
| https://www.streetfighter.com/6/ja-jp/character/yasmine/frame | HTTP 403 |
| https://www.streetfighter.com/6/en-us/character/yasmine/movelist | HTTP 403 |
| https://www.streetfighter.com/6/en-us/character/yasmine/frame | HTTP 403 |
| https://www.streetfighter.com/6/buckler/ja-jp/characters/yasmine | Search retrieval inaccessible |
| https://www.streetfighter.com/6/ja-jp/ | HTTP 403 |

No access-control bypass, proxy/mirror fetch, new workflow dispatch or secondary-source verification was used. Existing Phase20/21 fetch scripts use a mirror; they were inspected, not executed. Past Phase21 run 33183043892 returned no downloadable artifacts. The repository has retrospective audit reports but no retained raw Yasmine official command/frame table. Past success claims were not promoted to fresh evidence.

The actual relation table is `entity_sources`, not `source_relations`. Fresh SELECT read moves, Classic/Modern commands, all frame rows, patches, sources and entity_sources. The official movelist Source exists (93ba1110-3246-494c-b32d-a5fb26c81fdd), accessed 2026-08-26. The official frame Source exists (c6787ad3-2666-4cf5-92cc-a231c3ab3c4d), accessed 2026-08-27. These source registrations/relations contain no raw official move list and do not establish today's field identities. The Diff CSV records Fresh relation counts/IDs per row.

## Deliverable interpretation

- YASMINE_OFFICIAL_MOVE_MASTER.csv contains the required header only: ZERO confirmed entries, not evidence that the character has zero moves. Fabricated canonical rows would be unsafe.
- YASMINE_DB_CANONICAL_DIFF.csv contains all 85 Fresh DB rows, current names/commands/categories/orders, relation coverage and Preview membership. Every official comparison is UNRESOLVED; blank official columns mean NOT RETRIEVED, not N/A.
- YASMINE_OFFICIAL_FRAME_RECONCILIATION.csv contains all 85 current frame rows and stored values/patch/evidence. Official fields are blank/unretrieved. NULL stays UNKNOWN; D, ranges, dashes and actual numeric zero are preserved without reinterpretation.
- NAME/COMMAND/CATEGORY/ORDER/MULTIPLE mismatch counts, DB_ONLY and OFFICIAL_ONLY against the official master are UNDETERMINED, not zero. FRAME_MATCH/MISMATCH are UNDETERMINED; FRAME_UNRESOLVED = 85 database rows.

## Safe containment

All 26 existing Yasmine media mappings are mapping_hold, including the 12 normals recovered in the previous batch. All MP4/WebP assets and prior visual-review metadata are retained. Manifest identity approval is HOLD_UNTIL_CANONICAL. The local loader and device-token remote Preview loader both return no Yasmine media while held; accidentally reapproving a clip cannot bypass the hold. Cards remain the existing unconfirmed DB Snapshot; they are NOT a corrected canonical Preview.

Other characters, frame values/verification/publication contract, DB status, Daily15 and Beginner media are unchanged. No new Canonical Snapshot was generated.

## DB correction approval: NOT READY

Affected rows are inventoried in the two comparison CSVs. Proposed values, evidence-to-fact correspondence and release impact cannot yet be determined. UPDATE/verification-after-UPDATE/rollback SQL are deliberately not issued until exact official differences exist. No speculative comprehensive DB approval is requested.

Next prerequisite: obtain the actual current official Classic Command List and Frame Data contents with all categories/variants/conditions and patch date (for example, an export or screenshots supplied by the user). Then compare by explicit identity/command/condition, prepare bounded SQL with Fresh IDs and preconditions plus rollback from original values, and obtain separate DB approval. Media stays held until Canonical Master user QA passes.

## Verification

Targeted containment tests: PASS. Full checks and Preview evidence are recorded below after execution.

Fresh local checks: typecheck PASS (including after excluding build-only next-env.d.ts/tsconfig.json edits), lint PASS, tests 468/468 PASS, release gates 14/14 PASS, build PASS, diff-check PASS. Yasmine media validator: 0 errors/0 warnings, 0 approved/26 held. Added tests exercise local accidental approval rejection, remote RPC suppression and inline-bundle media removal, JP/Ryu unaffected, production Preview boundary and unchanged card/verified-field behavior.

NEW_P0 = 0 observed in containment delta; NEW_P1 = 0 observed in containment delta. Existing user-reported Yasmine identity/mapping defect remains unresolved and release-blocking. This is not a claim of 0 defects in the current Move Master.

## Fresh DB field inventory (not official confirmation)

| Field | Value present | NULL / UNKNOWN |
|---|---:|---:|
| startup | 77 | 8 |
| on_hit | 56 | 29 |
| on_block | 62 | 23 |
| damage | 83 | 2 |

## Deployed containment QA

Implementation SHA: 4c3a83dd6a2ca26b319102582fe0854b289bc8ec. Preview dpl_3pfEZvrDUYapAehUHF5nYKV9c8cd was READY, target branch and exact SHA matched.

Desktop Yasmine Dark/Light: no document-wide overflow observed, zero video elements. Existing Snapshot cards: 73 unique identities; filter results normal 25, special 40, super 4, throw 2, unique 2, all 73. Search 5LP returns 2 cards and restores 73 after clearing. These validate containment/filter behavior ONLY, not official category/name/command correctness. No canonical correction or frame completion is claimed.

JP and Ryu representative routes render, retain respectively 26 and 4 video elements, and show no document-wide overflow. No application console error observed during the inspected navigation; browser-extension metadata errors excluded. Runtime server logs were not audited. 375px browser resize was unavailable: USER_REQUIRED, deferred until Canonical Master is ready.

FINAL_RELEASE_GO = NO. Canonical counts, mismatch counts, official-only/DB-only identities and DB update necessity remain UNDETERMINED. DB_WRITE = 0; Production/Ver.1.1 unchanged. Next single action is obtaining the current official Command List and Frame Data contents (including patch/variants/conditions); no gameplay rerecording is requested.
