# SF6DNA V1.1 Shared Analysis Test Evidence — 2026-09-18

## Targeted isolation

PASS:
- Shared Analysis deterministic behavior test
- committed test source syntax check
- diagnosis issue semantics retained
- Daily objective/success/failure adjustment retained
- user “+3F” assertion remains PLAYER_STATEMENT / unverified
- source URL preservation for Character context
- Player without Source creates no source-backed facts
- priority issue derives from Diagnosis Evidence
- drill derives from Daily Evidence
- empty context creates uncertainty instead of fabricated facts
- mixed context creates no VERIFIED_GAME_FACT
- Persona formatting preserves Evidence facts

The committed test file contains adapter/evidence/analysis/persona/regression cases, but the full repository `npm test` suite could not be executed in the isolated runtime.

## Remote static checks

PASS:
- all five adapters exist
- all five Evidence builder paths exist
- Shared Analysis Engine exists
- no Phase 2 code creates kind=VERIFIED_GAME_FACT
- input loader uses public Character/Player loaders
- input loader has no Strategy/internal/service-role reference
- Coach page gate runs before searchParams
- Diagnosis Coach CTA guards remain 2/2
- Diagnosis Coach URL helper contains no request_id/user_id/answers/score payload
- Daily Coach CTA is gated by `releaseFeatures.aiCoach`
- all three release flags remain false
- sitemap does not include /coach

## Build / runtime boundary

Vercel deployment for code SHA:
- Deployment: `dpl_EmqMyUQStaDxXB1UGhhUkPHvHuH7`
- Preview: `https://sf-6-96r4wgd8b-somas11620-9368.vercel.app/`
- State: READY
- Git SHA match: PASS
- Vercel status: success
- `/coach`: application 404 while aiCoach=false

## Not run standalone

- `npm run typecheck`: NOT_RUN_STANDALONE
- `npm run lint`: NOT_RUN
- full `npm test`: NOT_RUN
- `npm run test:release-gates`: NOT_RUN
- local `npm run build`: NOT_RUN
- local `git diff --check`: NOT_RUN

Reason: isolated runtime cannot resolve github.com, so full repository clone is unavailable. Vercel build PASS is not reported as standalone typecheck/lint/full-test PASS.
