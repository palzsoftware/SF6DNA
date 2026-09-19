# SF6DNA Ver.1.1 Coach Provider Adapter Architecture

Date: 2026-09-19
Base SHA: `7ff486b5b016e150004b659cb30608235e2d842f`

## Boundary

`CoachProvider.generate()` accepts only the provider-independent `CoachPromptInput`. The input separates allowed facts, player statements, AI inferences, uncertainty, persona policy, prohibited claims, locale, and isolated untrusted user data. External transports are injected into `ExternalCoachProviderAdapter`; no vendor SDK, credential, or environment dependency is present.

The execution path is: input projection and redaction → rate/cost pre-check → abortable provider call → schema check → evidence post-validation → conservative repair → result. Any failure returns the deterministic provider draft. Retry is fixed at zero (`maxRetries: 0`), so no unbounded retry is possible.

## Limits

- Evidence: 12 items maximum, deduplicated by ID.
- Statement: 240 characters; uncertainty: 8 items; user text: 500 characters.
- Provider output: 4,000 characters maximum.
- Timeout: 4 seconds.
- Policy thresholds: 6 requests/minute, 60/day, 8,000 estimated units/request.

The counters are pure-policy inputs, not persistent enforcement. Persisted multi-instance enforcement requires separately approved infrastructure and is not activated here.

## Post-validation

Generated output must use known evidence IDs and may not invent a Source URL, Patch, verified status, numeric game fact, player statement, raw ID, internal enum, or secret-like value. Stale Patch and conflicting evidence may not receive a current/hard conclusion. Numeric claims must exactly match a numeric fact in the section's referenced evidence.

Observability emits metadata only: provider ID, model, latency, success/fallback, error category, evidence count, and persona. Raw prompts, provider errors, evidence text, user text, and credentials are excluded.

## Activation state

The deterministic provider and common adapter framework are ready. A live external provider is `HOLD`: no vendor selection, credential approval, cost owner, persistent rate limiter, legal copy approval, or environment-scoped Preview activation was established in this work.
