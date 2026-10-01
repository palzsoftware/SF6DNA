# Existing moves publication recovery result

Base RC: `f0ef3991`. Fresh read-only DB snapshot: `2026-09-30T09:33:59.11192+00:00` (18:33:59 JST).

## Classification

| Primary class | Moves |
|---|---:|
| PUBLISHABLE | 0 |
| FRAME_VERIFIED_BUT_MOVE_DRAFT | 701 |
| SOURCE_REQUIRED | 1,250 |
| COMMAND_REQUIRED | 0 |
| DESCRIPTION_REQUIRED | 0 |
| DATA_INCONSISTENT | 0 |
| HOLD | 114 |
| **Total** | **2,065** |

Primary classes do not overlap. Missing fields and evidence remain in the separate overlapping reasons, even when a higher-priority issue determines the primary class.

- All 2,065 moves are draft. **Current code gate ready: 0; current public move detail routes: 0.**
- If only status were hypothetically published, 701 moves meet the observed structural code/RPC contract. This is a calculation, not a status change or publication approval.
- The same 701 have usable existing Classic input, a labelled current verified frame and HTTPS official-labelled evidence for move, command and frame, with no explicit whole-row verification prohibition detected. This is the strongest **preparation cohort**, not a new game verification PASS.
- No source content or frame values were newly fetched, inferred or adopted. Source and mapping accuracy remains bounded by the existing recorded evidence.
- `releaseFeatures.publicStrategyContent` remains false. No public scope or DB data was changed.

## Frame and input state

- Frame rows labelled verified: **2,021**.
- Current/open verified frame rows: **2,020**, covering **2,020 distinct moves**. The additional verified row is not a current-patch row.
- No current verified frame: **45 moves**.
- Explicit current frame/command/move verification caveat: **69 moves**. These remain HOLD even if a verified frame flag exists.
- HOLD total: **45 + 69 = 114**.
- Usable Classic input exists for all **2,065** moves. Modern input was not inferred.
- Description/usage summary absent: **1 move** (`terry-burn-knuckle-l`, ID `c1b34f9b-2268-4a89-a473-2eda9922cc3c`). Its primary class is determined by another blocker; DESCRIPTION_REQUIRED = 0 does not mean no description gap.
- Duplicate move identity/current frame conflicts detected: **0**.

## Source scope and retained caveats

Official evidence is checked independently at each required target; a frame source alone cannot satisfy move or command evidence.

Overlapping official evidence gaps: move **1,094**; Classic command **1,363**; current frame **45**. These counts overlap and must not be added to primary totals.

**1,848 moves** retain source/relation-scoped pending notes. A candidate/community link is not a global veto when an independent complete official source chain exists. Such notes remain recorded as `SOURCE_SCOPED_PENDING_NOTES_REVIEW_REQUIRED`; they are not deleted, silently marked verified or treated as evidence for unsupported claims.

By contrast, a whole current frame/command/move note explicitly saying candidate, do not publish, direct verification pending or inferred/not verified remains a blocker. Scoped notes saying omitted fields remain unverified are preserved separately; they do not invalidate captured fields and do not permit filling absent values.

Observed official-labelled evidence URLs in this move audit use `www.streetfighter.com`. No official-labelled third-party source host was observed in this dataset. Host/DB labels alone are not an independent claim-by-claim source validation.

## Strongest preparation cohort by character

| Character | Moves |
|---|---:|
| blanka | 91 |
| c-viper | 7 |
| chun-li | 68 |
| dee-jay | 105 |
| dhalsim | 88 |
| e-honda | 70 |
| elena | 4 |
| guile | 70 |
| jamie | 93 |
| kimberly | 76 |
| mai | 10 |
| yasmine | 19 |

The Luke / JP / Ken / Ryu move records are not promoted into this cohort by extrapolating from their icon/media pilot results. Parser rendering PASS is separate from game-data publication evidence.

Representative existing cohort IDs (no automatic publication):

| ID | Slug | Existing name |
|---|---|---|
| `d174c7e0-e631-4207-900d-03aaa63ce1db` | `blanka-air-rolling` | 弱 エリアルローリング |
| `357470d2-3863-4987-8771-b89e3c582ce9` | `blanka-air-rolling-od` | OD エリアルローリング |
| `356e80a5-c3fc-47ec-9941-0b8a20bffa4f` | `blanka-amazon-river-run` | アマゾンリバーラン |

## Actionable handoff and evidence format

`MOVE_PUBLICATION_AUDIT.json` contains all 2,065 move IDs, names, slugs, source/command/frame IDs, primary class, overlapping blockers and the exact original notes. It is a lossless normalized columnar JSON (~0.85 MB), avoiding repeated source paragraphs. `move_columns` defines each row; identifier, label, note, source and diagnostic registries preserve all original evidence.

To expand into ordinary per-move dictionaries:

```python
import importlib.util, json
spec = importlib.util.spec_from_file_location("move_audit", "scripts/audit-move-publication.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
report = module.expand_report(json.load(open("docs/release-20260930-publication/MOVE_PUBLICATION_AUDIT.json")))
# report["moves"] contains exact per-move dictionaries.
```

- First review the 701 preparation candidates at their existing IDs; publication requires approved status/scope changes, which this batch does not apply.
- Resolve source chain gaps on the 1,250 SOURCE_REQUIRED moves using existing relations before new collection.
- Review the 69 explicit whole-row caveats with their exact frame/command/source references; clear only through real supporting evidence, never a flag-only promotion.
- For 45 missing-current-frame moves, retain text/unknown fallback and do not manufacture current values.
- Reconcile any old source candidate notes only for the claim actually superseded by stronger evidence; do not erase unrelated unverified fields.

## Verification and QA reuse

New audit contracts: **17 fixture tests PASS**. Actual 2,065-move compact/expanded diagnostic round trip: **PASS**, lossless. The full batch verification is tracked in the root release report.

This lane changes audit scripts and documentation only. Existing application/browser PASS results are reused; no unrelated 86-URL or full application audit was performed by this lane.
