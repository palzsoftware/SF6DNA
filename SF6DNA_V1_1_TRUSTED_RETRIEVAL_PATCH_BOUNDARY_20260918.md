# SF6DNA V1.1 Trusted Retrieval Patch Boundary — 2026-09-18

## Patch states
- PATCH_MATCH
- PATCH_COMPATIBLE
- PATCH_UNKNOWN
- PATCH_STALE
- PATCH_NOT_APPLICABLE

## Patch-sensitive
Examples:
- Move / Frame
- Combo
- Setup
- Sequence
- Counter
- Training

## Patch-non-sensitive
Profile/content metadata can be Patch-independent depending on the claim.
Examples include Player profile links or generic public profile information.

## Rules
- Patch match does not imply verified.
- verified status does not override a stale Patch for a Patch-sensitive game fact.
- unknown Patch on a Patch-sensitive item adds uncertainty.
- stale Patch becomes UNVERIFIED_CANDIDATE for current-game usage.
- compatibility is never guessed. It must be supplied explicitly by a trusted contract.

## Current source of truth
Current Patch is read from the existing `patches.is_current=true` record.
Read-only observation on 2026-09-18: `2026.08.03`.

No new Patch table, migration or runtime config was added.
