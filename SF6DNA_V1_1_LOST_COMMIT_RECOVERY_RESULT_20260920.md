# SF6DNA Ver.1.1 Lost Commit Functional Recovery Result

Date: 2026-09-20

```text
LOST_COMMIT = 935f58667b5e9c3def2a5b4fcb63fc37276feaee
LOST_COMMIT_RECOVERED_EXACTLY = NO
FUNCTIONAL_REBUILD = YES
REMOTE_BASE = 6cae16f3f3b3d2ff1e44e08328c1622f3fcb60cb
NEW_REMOTE_SHA = COMMIT_CONTAINING_THIS_EVIDENCE
```

The lost Git object was not recreated. Its functional scope was rebuilt from a fresh checkout of the remote base with the current Phase 1–7 contracts as the source of truth.

## Restored scope

- Exact-branch, Preview-only AI Coach activation; default and Production remain fail-closed.
- Trusted retrieval → Shared Analysis → provider-independent prompt → Deterministic Provider → validation → Composer/UI path.
- Input/evidence/output limits inherited from the prompt contract plus timeout, zero retry, unit estimate, rate/day budget, duplicate and concurrency guards.
- AI Coach Privacy, Terms, Disclaimer, and FAQ copy without unsupported provider-specific promises.
- Evidence-backed Player Analysis public gate and hidden-by-default UI.
- Related Video availability/exact-player public contract with `UNKNOWN` fail-closed.

## Runtime verification

- Preview-equivalent build: PASS.
- `GET /coach`: HTTP 200.
- `POST /api/coach/retrieve`: HTTP 200.
- Provider: `deterministic`, `completed`, no fallback.
- External generation remains `generationEnabled=false`.
- Default release flags remain literal `false`.

No DB write, migration, RLS, RPC, GRANT, Production, `main`, `sf6dna-v2`, or Ver.1.0 RC change was made.
