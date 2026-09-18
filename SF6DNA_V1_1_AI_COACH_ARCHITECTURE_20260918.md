# SF6DNA V1.1 AI Coach Architecture — 2026-09-18

## Pipeline

```text
User / Diagnosis / Player / Replay / Input
        ↓
Shared Analysis Engine
        ↓
Evidence / Facts / Observations / Inferences
        ↓
Coach Persona Formatter
        ↓
User-facing Coaching Response
```

## Evidence contract

Implemented kinds:

- PLAYER_STATEMENT
- OBSERVED_BEHAVIOR
- OBSERVED_PATTERN
- AI_INFERENCE
- VERIFIED_GAME_FACT
- SOURCE_BACKED_FACT
- UNVERIFIED_CANDIDATE

Verified/source-backed factual evidence must retain provenance. `VERIFIED_GAME_FACT` must have verificationStatus=`verified`. `UNVERIFIED_CANDIDATE` cannot be promoted to verified by the formatter.

## Shared result

`CoachAnalysisResult` contains summary, strengths, priorityIssues, drills, evidence, uncertainty, and nextActions. Findings and drills reference Evidence IDs; unknown references fail validation.

## Personas

- balanced — standard/default
- competitive — priority mistakes and practical reproduction first
- supportive — smaller, manageable improvement focus
- research — evidence/patch/uncertainty first

Persona may change lead text, feedback order and presentation depth. It does not rewrite Evidence items, Source URLs, Patch, character/player identity, evidence kind, or verification status.

Mascot slots exist as `mascotAsset: null`; no CAPCOM/Player/Team asset is used.
