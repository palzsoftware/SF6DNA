# SF6DNA V1.1 Shared Analysis Architecture — 2026-09-18

## Pipeline

```text
Raw Product Input
↓
Input Adapter
↓
Normalized Coach Context
↓
Evidence Builder
↓
Shared Analysis Engine
↓
CoachAnalysisResult
↓
Persona Formatter
↓
UI
```

Persona is applied only after `CoachAnalysisResult` exists.

## Normalized Context

`CoachInputContext` supports optional:
- diagnosisResult
- dailyTraining
- userMessage
- characterContext
- playerContext
- accountContext
- locale
- requestedPersona

Missing fields do not fail the entire analysis.

## Adapter semantics

- Diagnosis: only improvement/comprehensive results become improvement candidates. Character Fit / Playstyle are not reinterpreted as weaknesses.
- Daily: existing generated practice plan becomes drill context; it remains a practice proposal, not a verified gameplay fact.
- User message: always PLAYER_STATEMENT / unverified.
- Character: only public-source-referenced facts become SOURCE_BACKED_FACT / reviewed.
- Player: same rule; no inferred rank, main character, playstyle or player intention.
- Replay: not implemented without an input contract.

## Deterministic Engine v1

- Diagnosis primary issues -> priorityIssues
- Daily items -> drills
- User assertions -> Evidence + uncertainty
- Source-referenced Character/Player fields -> Evidence only
- Insufficient evidence -> uncertainty
- No input layer emits VERIFIED_GAME_FACT in Phase 2

The engine validates the final `CoachAnalysisResult` using the existing Coach Foundation validator before returning it.
