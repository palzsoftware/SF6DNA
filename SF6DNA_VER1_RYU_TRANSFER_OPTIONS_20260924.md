# SF6DNA Ver.1.0 — Ryu Motion Media Transfer Options

Date: 2026-09-24
Scope: Ver.1.0 RC / Motion Media pilot only
Production impact: NONE
DB write: NONE

## Current state

- Ryu source capture is complete and the recordings have already been provided by the user.
- The source must not be copied into the Git repository as a long-term transport mechanism.
- The Ryu masters were freshly located in the ChatGPT Library under `/SF6DNA/`; the source is not missing.
- A direct raw-byte materialization attempt was made once against the located Library/Project files and the runtime returned `This Project file does not have an authorized raw-byte materialization path.` for all four requested files.
- This is a transfer-path authorization/capability issue, not a reason to request a new recording or to treat the source as lost.
- Do not retry the same large-file materialization path repeatedly and do not ask the user to re-upload Ryu source while the existing Library copies remain available.

Status:

```text
RYU_SOURCE_CAPTURE = COMPLETE
RYU_SOURCE_REFERENCE = LOCATED_IN_LIBRARY
RYU_RAW_WORK_INGEST = HOLD_SOURCE_TRANSFER_AUTHORIZATION
RYU_RECAPTURE_REQUIRED = NO
USER_REUPLOAD_REQUIRED_NOW = NO
DIRECT_LIBRARY_MATERIALIZATION_RETRY = NO
```

## Fresh source inventory — Library metadata

The current canonical source candidates located in `/SF6DNA/` are:

| Category | Library path | Bytes |
|---|---|---:|
| normals | `/SF6DNA/ryu_normals_20260923_take02.mp4` | 239,555,173 |
| unique_attacks | `/SF6DNA/ryu_unique_attacks_20260923_take01.mp4` | 110,852,673 |
| specials | `/SF6DNA/ryu_specials_20260923_take01.mp4` | 226,932,756 |
| super_arts | `/SF6DNA/ryu_super_arts_20260923_take01.mp4` | 386,662,136 |

```text
RYU_SOURCE_FILE_COUNT = 4
RYU_SOURCE_TOTAL_BYTES = 964002738
RYU_SOURCE_TOTAL_DECIMAL_GB = 0.964
```

Duplicate suffixed copies such as `(1)` / `(2)` also exist in Library with matching byte counts for the corresponding recordings. They are not separate capture requirements and must not trigger duplicate ingestion or re-encoding.

The unsuffixed paths above are the preferred source references unless a later checksum comparison proves otherwise.

## Preferred transfer order

### A. Direct Library / Project materialization — attempted and held

The preferred direct path was attempted once on 2026-09-24 using the located Ryu source references.

Result:

```text
DIRECT_MATERIALIZATION = FAILED_UNSUPPORTED_AUTHORIZED_RAW_PATH
FILES_ATTEMPTED = 4
BYTES_COPIED = 0
SOURCE_LOST = NO
RETRY_SAME_PATH = NO
```

No ffprobe, checksum, cut, or encode result is claimed because raw bytes never reached the Work runtime.

### B. Read-only object storage / CDN source — next supported design path

Because A is currently unavailable, the next scalable path is a read-only source object location outside Git. Do not create or mutate a bucket during ChatGPT-only release work without an explicitly approved storage target.

This aligns with the scale decision:

```text
Git / Vercel static assets = pilot only
Bulk character media = external object storage / CDN recommended
```

Requirements:

- read-only source access for Work
- stable object key
- no public write credential in the client
- checksum recorded before processing
- source master kept separate from delivery MP4s
- source URL/object reference must not be embedded into the public client unless intentionally public
- ingestion must work one file at a time and resume without reprocessing completed categories

Suggested object key contract:

```text
sf6dna-motion-source/{character_slug}/{capture_date}/{category}/{filename}
```

Derived delivery assets should remain separate, for example:

```text
sf6dna-motion-delivery/{character_slug}/{move_slug}/{variant}.mp4
sf6dna-motion-delivery/{character_slug}/{move_slug}/{variant}.webp
```

The ingest process should accept a local path or a short-lived/read-only URL and produce the same inventory contract, so future storage-provider choice does not change the R1–R4 pipeline.

### C. Split archive — emergency fallback only

A split ZIP is acceptable only if A and B are unavailable.

Rules:

- archive parts must be checksum verified
- never commit archive parts to Git
- extract to temporary Work storage only
- delete temporary copies after derived outputs are validated

### D. Local preprocessing package — last fallback

If raw source transfer remains impossible, preprocessing may be performed outside Work and only the following package transferred:

```text
source inventory
cut-candidate manifest
confirmed clips
poster images
mapping worksheet
checksums
```

This does not change the mapping rule: ambiguous clips remain `MAPPING_HOLD`.

## Ryu ingest sequence after transfer succeeds

Run as separate small batches.

### Batch R1 — inventory only

- ffprobe source files
- SHA-256
- category assignment
- no re-encode
- no repository asset write

Gate:

```text
R1_PASS = all source files readable + metadata valid
```

### Batch R2 — move worksheet + cut candidates

Generate the Ryu worksheet from the current Move source of truth and associate candidates.

Important:

- no move-name inference from recording order alone
- distance-adjustment walking before/after a move must not be accepted as `cut_reviewed`
- uncertain start/end boundaries => `CUT_REVIEW_HOLD`
- uncertain move identity => `MAPPING_HOLD`

### Batch R3 — confirmed clips only

For confirmed mappings only:

```text
720p / <=60 fps
H.264
no audio
faststart
poster
validation
```

Do not bulk-encode unreviewed candidates.

### Batch R4 — Character Detail integration

Only after validation:

- add media mapping
- run media validator
- targeted UI tests
- Preview QA
- no Production promotion in the same batch

## Relationship to remaining 29 characters

Ryu + JP are the implementation template.

The remaining 29 characters do not need recordings before the common pipeline is completed. Their pre-recording state can be prepared as:

```text
Move worksheet = READY
Manifest schema = READY
Validation = READY
UI fallback = READY
Media assets = WAITING_FOR_CAPTURE
```

Once a future recording is supplied, the same R1 → R4 process is reused without character-specific UI redevelopment.

## Release boundary

Ryu Motion Media is not a Ver.1.0 release blocker.

```text
V1_0_PRODUCTION_DEPENDENCY = NO
PRODUCTION_MEDIA_WRITE = NO
RELEASE_DELAY_FOR_RYU_TRANSFER = NO
```

If source transfer remains unresolved by release freeze, keep Motion Media outside the Production release and continue on the RC/pilot path.

## Next Work action

Do not retry direct Library raw materialization. Keep the four located Ryu masters as the canonical source references and continue the provider-neutral read-only object-storage ingest design. If/when a supported raw-byte path becomes available, execute Batch R1 only first; do not immediately cut or encode all four sources.
