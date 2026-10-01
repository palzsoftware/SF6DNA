# Combo Publication Recovery — 2026-09-30

Fresh snapshot: `2026-09-30T09:33:59.11192+00:00`. All 1,478 existing Combo rows, 34 Characters, the current Patch, 661 Sources and 2,912 Combo Source relations were inspected locally. No DB write, published status, Feature flag or renderer change.

| Disjoint primary classification | Count |
|---|---:|
| PUBLISHABLE | 0 |
| SOURCE_REQUIRED | 0 |
| GAME_VERIFICATION_REQUIRED | 1,213 |
| DATA_ERROR | 0 |
| DUPLICATE, confirmed | 0 |
| HOLD | 265 |
| Total | 1,478 |

Current published count remains 0. First safe publication cohort is empty. The 1,213 draft rows require documented current-patch reproduction; 265 archived rows remain on hold. General verification_status does not establish a Training reproduction.

Secondary blockers overlap: no established reproduction evidence 1,478; status not verified 1,477; explicit notes conflict 302 (38 draft / 264 archived); placeholder recipe 264 (all archived); source metadata not ready 224 (all archived). SOURCE_REQUIRED primary is therefore 0 even though 224 HOLD rows also need source recovery. A source link or metadata readiness is not gameplay proof, legal approval or adoption.

## First focused review candidate

Kimberly `271b8a26-7565-4fa5-b69d-e8a542e7b2a6`, `kimberly-20260803-modern-assist2` is the only verified row. Its notes state that the CAPCOM 2026.08.03 change table specifies the updated recipe; the row remains draft. It has three source links, two metadata-ready noncandidate links, a current nonexpired patch and no pending note conflict.

Recipe: `立ち中K > OD疾駆け > OD弧空 > OD武神鉾刃脚 > 武神天翔亢竜`

Context: Modern control / after 2026.08.03 update. Damage, Drive cost and SA cost are NULL and stay unknown. It is a **source-verified review candidate**, not PUBLISHABLE. Next action is exact current-patch Training reproduction with reproducible evidence and supplied values checked; no automatic status change is proposed.

## Duplicate candidates

202 rows in 28 same-character / normalized-notation groups need contextual review. They are candidate matches only; position, conditions, control type, patch and source evidence may differ. No explicit duplicate_of evidence was present, so confirmed DUPLICATE is 0. No deletion or archiving occurred.

## Verification reuse

Previous shared renderer 1,478-row losslessness and 375px Dark/Light geometric PASS are reused. This classifier confirms raw notation reconstruction for every row, mismatch 0. The new offline classifier has 8 targeted behavior tests PASS and targeted lint PASS. It distinguishes verified flag from positive gameplay evidence, source absence, conflicting notes, invalid values, stale/archived hold and candidate/confirmed duplicates.

Combo steps were intentionally not fetched. Step count stays unknown and is not a standalone blocker. The optional reproduction evidence input contract is described in COMBO_CLASSIFICATION_METHOD.md; it is not a new DB schema requirement or migration.

## Files and compact format

- COMBO_PUBLICATION_SUMMARY.json: counts, overlapping reasons and the first focused review candidate.
- COMBO_PUBLICATION_CLASSIFICATION.csv: all 1,478 IDs and primary / secondary reason codes.
- COMBO_PUBLICATION_CLASSIFICATION.json: all 1,478 identities, raw recipes, existing facts, parser/fallback counts, patch and source evidence; 970,152 bytes.
- COMBO_CLASSIFICATION_METHOD.md: exact classifier assumptions and boundaries.

The compact JSON uses `row_columns`, `check_columns`, `fact_columns` and `source_relation_columns` to label positional arrays. Reason, Source and note excerpts are normalized into top-level registries. Full raw notes and the full DB snapshot are not duplicated in the repository. NULL numeric facts retain missing/unknown meaning.

Reproduce with:

`node scripts/audit-combo-publication.mjs <complete read-only snapshot.json> <report-directory>`

No app or data publication occurred. Combo Publication remains a release blocker until evidence, approval and actual publication validation close it.
