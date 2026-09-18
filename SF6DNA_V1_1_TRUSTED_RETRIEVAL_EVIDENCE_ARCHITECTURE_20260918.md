# SF6DNA V1.1 Trusted Retrieval Evidence Architecture — 2026-09-18

## Pipeline
```
Trusted Retrieval
↓
Result Validation / defensive filtering
↓
TrustedRetrievalItem
↓
Patch evaluation
↓
Evidence classification
↓
Shared Analysis Engine
↓
CoachAnalysisResult
↓
Persona Formatter
```

## TrustedRetrievalItem
Keeps independently:
- entity type / entity id / slug
- exact character/player identity when directly known
- statement
- Source ID / URL / type / reliability
- Patch
- verification status
- publication status
- Source publication/access timestamps
- relevance score
- availability status
- patch sensitivity
- fact domain
- conflict key

## Classification
### VERIFIED_GAME_FACT
Requires all:
- explicit verificationStatus=verified
- game-fact domain
- valid Source
- Source availability explicitly public
- Patch match/compatible, or Patch not applicable

### SOURCE_BACKED_FACT
Used for:
- reviewed + Source, unless stale Patch
- verified non-game profile/content with explicitly public Source

### UNVERIFIED_CANDIDATE
Used when:
- verification is unknown
- Patch-sensitive fact has stale/insufficient Patch
- explicit verification/public availability requirements for a hard game fact are not met

No relevance score, publication state or Source presence promotes an item to verified.

## Ranking
Priority:
1. verified + Patch match
2. verified + Patch compatible/non-sensitive
3. reviewed + Patch match
4. reviewed + Patch unknown/non-sensitive
5. unverified candidate

Within a tier:
- relevance
- Source quality

Ranking changes order only. It never changes verification state.

## Conflict
Items sharing a conflict key but carrying different statements create uncertainty.
The engine does not select a winner automatically.
