# SF6DNA Ver.1.0 — Ryu Motion Media Transfer Options

Date: 2026-09-24
Scope: Ver.1.0 RC / Motion Media pilot only
Production impact: NONE
DB write: NONE

## Current state

- Ryu source capture is complete and the recordings have already been provided by the user.
- The source must not be copied into the Git repository as a long-term transport mechanism.
- In the current Work-side environment, raw-byte materialization from the available Library/Project reference was not established successfully.
- This is a transfer-path issue, not a reason to request a new recording or to treat the source as lost.
- Do not ask the user to re-upload Ryu source until the supported Library/Project transfer paths have been exhausted.

Status:

```text
RYU_SOURCE_CAPTURE = COMPLETE
RYU_SOURCE_REFERENCE = AVAILABLE
RYU_RAW_WORK_INGEST = HOLD_SOURCE_TRANSFER
RYU_RECAPTURE_REQUIRED = NO
USER_REUPLOAD_REQUIRED_NOW = NO
```

## Preferred transfer order

### A. Direct Library / Project materialization — preferred

Use the existing source reference and materialize one source file at a time into the Work runtime.

First successful transfer must stop after inventory only:

```text
filename
sha256
bytes
duration
width
height
fps
codec
category
```

Do not immediately cut or encode the whole source. The purpose of the first transfer is to prove the ingest path and inventory contract.

### B. Read-only object storage / CDN source — preferred scalable fallback

If direct Library / Project materialization is not supported reliably, place the source master outside Git and give the ingest process read-only access.

This aligns with the already-approved scale decision:

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

Attempt exactly one supported direct source materialization path. If it succeeds, execute Batch R1 only. If it fails because raw materialization is unsupported, record the failure once and switch to the external-storage design task; do not loop on repeated large-file downloads.
