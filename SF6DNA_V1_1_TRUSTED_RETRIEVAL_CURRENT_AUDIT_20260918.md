# SF6DNA V1.1 Trusted Retrieval Current Audit — 2026-09-18

## Baseline
- V1.0 RC: `502f23baeb43e7224ac745dda9eedc63b088bdee`
- V1.1 base: `52a9dc1b8b638ca8f63d438dfe99d771b12664cc`
- Trusted Retrieval implementation commit: `f1ae182a27a4eab142332ab9ee93975cc4d8e034`

## Fresh code audit
Current entry point is `POST /api/coach/retrieve`.

Pipeline before Phase 3:
```
question
→ searchAcrossContent()
→ search_sf6dna RPC
→ SearchResultItem
→ attachSourcesToEvidence()
→ Current Patch lookup
→ sourced result list
```

Existing public search already:
- removes Training while `training=false`
- removes Move/Combo/Setup/Sequence/Counter while `publicStrategyContent=false`
- applies the stricter public Move readiness gate
- returns only public application search entities

Existing Source attachment uses `public.get_public_entity_sources`.

## Contract gap found
`SearchResultItem` previously contained id/type/title/subtitle/href/matchedBy only.
Public Source attachment contained Source URL/reliability but did not carry an explicit entity verification status or compatible Patch.

Therefore:
```
Source exists != verified
published != verified
relevance != verified
Current Patch exists != entity verified
```

Phase 3 does not infer missing verification metadata.

## Current Patch
Read-only DB check:
- Current Patch: `2026.08.03`
- source: `patches.is_current=true`
- no Patch value is hard-coded into the adapter

## Public Source boundary
Read-only anon `list_public_sources()` returns official/primary/secondary/community only. The underlying table still contains one internal_candidate, so Phase 3 keeps an application-side defensive internal-source filter and does not trust catalog presence alone.

## Runtime classification
Current raw search results have no explicit verification metadata. After normalization they start as:
- verificationStatus = unknown
- availabilityStatus = unknown for syntactically valid HTTP(S) Source
- publicationStatus = published because they already passed public search
- Patch = unknown unless future enriched metadata provides it

This means current runtime retrieval cannot automatically become VERIFIED_GAME_FACT.
