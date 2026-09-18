# SF6DNA V1.1 Trusted Retrieval Test Evidence — 2026-09-18

## Targeted isolated behavior
PASS in the isolated runtime:
- reviewed + Source -> SOURCE_BACKED_FACT
- explicit verified + public Source + current Patch -> VERIFIED_GAME_FACT
- Source + unknown verification -> UNVERIFIED_CANDIDATE
- stale verified game fact -> UNVERIFIED_CANDIDATE + uncertainty
- non-Patch-sensitive verified profile does not become VERIFIED_GAME_FACT
- draft/internal/restricted filtering
- conflicting statements -> uncertainty
- UUID/email/user_id/request_id/long numeric identifier removal from Retrieval query

## Committed test coverage
`coach-trusted-retrieval-v11.test.mjs` covers:
- Source does not imply verified
- reviewed != verified
- published/relevance != verified
- Patch match/unknown/stale/not-applicable
- stale downgrade
- defensive filtering
- exact Character/Player direct identity isolation
- conflict handling
- ranking
- query privacy sanitization
- runtime provenance normalization
- Shared Analysis integration
- Coach API hard gate / generation disabled

## Remote static regression
PASS:
- Coach API feature gate still precedes request parsing
- old sourced-evidence filter remains
- old Current Patch readiness expression remains
- generationEnabled=false remains
- three release flags remain false
- Shared Analysis includes retrieval Evidence + uncertainty
- Research Persona only changes detail display, not verification

## Standalone full repository checks
The isolated execution environment still cannot resolve github.com, so a full repository clone is unavailable.

Therefore:
- standalone typecheck = NOT_RUN
- lint = NOT_RUN
- full npm test = NOT_RUN
- release-gates standalone = NOT_RUN
- local build = NOT_RUN
- local git diff --check = NOT_RUN

Vercel build status is recorded separately and is not treated as full local test success.
