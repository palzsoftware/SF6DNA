# Ryu Media Integration — preparation contract closure

## Current status

- ZIP_RECEIVED = NO. No user ZIP/recording was observed in upload paths.
- EXPECTED_CANDIDATES = 57, reused from the 2026-09-30 08:08:51.979467 UTC canonical read-only snapshot. Fresh cross-check at 2026-09-30T09:33:59.11192+00:00 completed: all57 IDs/slugs/names/types/display-order/status match, drift0.
- PUBLIC_EXPECTED_MOVE_COUNT = 0 in that snapshot: all 57 rows were draft. A capture checklist does not approve public content.
- RECORDED / CUT / WEBP / MAPPED / UNMAPPED / MISSING / DUPLICATE = NOT_MEASURED_WITH_ACTUAL_RECORDING. Missing ZIP is not evidence of 57 missing actions in a submitted recording.
- ACTUAL_MEDIA_CAPACITY / PREVIEW_MEDIA_PERFORMANCE / DEVICE_MEDIA_QA = PENDING.
- No new media files, source MP4s, asset assignments, DB writes, dependencies, Production or Ver.1.1 changes.

## Reused evidence and enriched plan

`RYU_EXPECTED_MOVES_VARIANTS.json` preserves every prior observed UUID, canonical slug/name, display order, raw move type and draft/public status. No move identity or gameplay fact was generated.

| Preparation category | Observed candidates | Evidence |
| --- | ---: | --- |
| NORMAL | 18 | original_move_type=normal |
| UNIQUE | 5 | original_move_type=unique |
| TARGET_COMBO | 2 | original_move_type=target_combo |
| THROW | 2 | original_move_type=throw |
| SPECIAL | 16 | original_move_type=special without explicit OD/variant grouping |
| OD | 8 | explicit OD in canonical name |
| SUPER | 3 | original_move_type=super |
| CA | 0 | no standalone canonical CA row observed |
| OTHER_REQUIRED_VARIANTS | 3 | explicit bracketed Denjin or aerial name/slug labels |

Variants describe only already explicit labels: normal, light, medium, heavy, od, denjin, denjin-od, aerial, aerial-od. OD rows with Denjin/aerial are grouped OD while retaining both labels in variant. These are recording preparation groups, not changes to canonical move_type. CA remains an explicit unresolved verification item with null ID/slug/name; this batch does not invent a CA move ID or a new variant row.

`RYU_RECORDING_CHECKLIST_VARIANTS.json` is automatically generated. No user manual move list required. Every row is RECORDING_NOT_RECEIVED with order/cut/mapping reviews false. Proposed file names/grouping and recording order are unverified suggestions.

## Changed tool contract

- Nine required category values supported.
- Expected and reviewed manifest carry variant; exact ID+variant identity and slug+variant uniqueness validated. Multiple explicitly supplied variants of one canonical ID can be handled; the tool creates no variant identities itself.
- Legacy preparation rows without variant default to normal for compatibility. New prepared checklist always carries explicit variant.
- `expected_file` is a proposed filename, never a fixed user upload requirement. An actual safe filename is accepted when `file_reviewed:true`; its exact SHA must match source_sha256.
- Original expected `order` remains immutable. Actual `recorded_order` can differ after order review and must be a positive, unique order within the confirmed actual recording file. This supports differently grouped/merged files without silently inferring their contents.
- Traversal, links, changed hashes, duplicate identities, duplicate file/order, invalid/overlapping time ranges and incomplete reviews still reject.
- Canonical slugs already prefixed ryu- yield ryu-standing-lp.webp, without doubling character prefix. Repeated canonical slug variants use a variant suffix. Output filename collisions reject before encoding.
- WebP staging remains NOT_BOUND_NOT_GAME_VERIFIED. No public copy or assignment is automatic.

## Targeted verification

New publication contract suite: **6 PASS**.

```
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s scripts/tests -p 'test_ryu_media_pipeline.py' -k PublicationContractTests -v
```

One existing overlap fixture was adapted to supply unique actual recording order; that affected test separately PASS. The unchanged 11-test safety/encoding baseline was reused rather than rerun. No actual Ryu recording or fresh WebP visual QA was performed.

## ZIP arrival procedure

1. Root checks fresh canonical IDs/slugs/names against prepared57 candidate plan and updates only proven changes.
2. Safe intake returns filenames/hash/byte counts; original MP4s remain temporary/local archive.
3. Confirm actual file assignment and recording order; then propose static-boundary cuts. Visual review identifies each action and confirms variant/cut/hash.
4. Record confidence internally; LOW / unidentified / multiple action / early or late cut remain withheld. Review flags are not set by automation.
5. Render new staging directory; confirm action starts/ends/loop/mobile readability/byte budget. Compare actual counts against expected and report per category/name/slug/order/status.
6. Only validated WebP and reviewed site manifest may be proposed for integration. Existing assignments require explicit reviewed changes.
7. Targeted Preview performance and weekend device QA remain mandatory after actual media integration.
