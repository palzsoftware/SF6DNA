# Ver.1.1 AI Coach Answer Composer Architecture

## Scope

- Baseline: `99760527d7df4628f87cc0e8624413815e620dc0`
- Branch: `sf6dna-v1-1-ai-coach-20260918`
- Pure entry point: `composeCoachAnswer({ result, personaId })`
- Input is only a validated `CoachAnalysisResult`. No database, network, model, or write operation occurs in the Composer.

## Data flow

`CoachAnalysisResult` → analysis validation → canonical sections/evidence summaries → persona ordering → composed-answer validation → UI.

Persona changes section order, lead, and research metadata visibility only. Evidence statements, source URL, Patch, kind, and verification state remain identical for all four personas.

## Fail-closed rules

- Unknown Evidence references are rejected before composition.
- Source URL and Patch must equal the originating Evidence values.
- `検証済み` is permitted only for `VERIFIED_GAME_FACT` plus `verificationStatus=verified`.
- Source-backed, unverified, player statements, and AI inference each use non-interchangeable labels.
- `PATCH_STALE` and `PATCH_UNKNOWN` add cautions; source conflicts remain unresolved.
- Empty input produces a bounded empty state and no fabricated Evidence.

## Release boundary

The UI integration is reachable only through the existing Coach surface. `aiCoach=false`, `training=false`, and `publicStrategyContent=false` remain unchanged; API generation remains disabled.
