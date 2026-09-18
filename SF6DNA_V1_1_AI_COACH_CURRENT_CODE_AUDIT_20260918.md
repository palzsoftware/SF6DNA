# SF6DNA V1.1 AI Coach Current Code Audit — 2026-09-18

## Baseline

- Repository: `palzsoftware/SF6DNA`
- V1.0 RC branch: `sf6dna-v2-chatgpt-rc-20260916`
- V1.0 base SHA: `502f23baeb43e7224ac745dda9eedc63b088bdee`
- V1.1 branch: `sf6dna-v1-1-ai-coach-20260918`

## Fresh audit

V1.0 baseline already contains a fail-closed AI Coach shell.

- `/coach` checks `releaseFeatures.aiCoach` before reading `searchParams`.
- `/api/coach/retrieve` checks the same flag before `request.json()` and retrieval.
- Diagnosis contains two Coach CTAs and both are guarded by `releaseFeatures.aiCoach && topQuery`.
- Release flags remain `aiCoach=false / training=false / publicStrategyContent=false`.
- Existing retrieval attaches public Source links, requires Current Patch + sourced evidence for readiness, and returns `generationEnabled=false`.
- Existing code had no shared `CoachAnalysisResult`, no seven-kind Evidence model, no four-persona config, and no persona invariance contract.

## Decision

Do not weaken the V1.0 hard gate. V1.1 adds an in-memory evidence/analysis/persona foundation behind the existing disabled surface. No DB schema, provider secret, migration, RLS/RPC/GRANT change is required for this foundation.
