# SF6DNA Ver.1.1 Coach Provider Security Test Evidence

Date: 2026-09-19

## Tested controls

- Timeout aborts the external call and falls back once without retry loops.
- Provider exceptions and malformed schemas fall back without exposing vendor error details.
- Generated URLs, Patch values, unsupported verified language, unmatched numeric facts, unknown evidence IDs, and conflict hard conclusions are rejected.
- Prompt-like user instructions remain isolated untrusted data.
- Email, bearer-like data, service-role text, user/request IDs, and UUIDs are redacted or blocked.
- Evidence, uncertainty, statement, user-input, and output limits are enforced.
- Rate/cost denials occur before provider execution.
- Audit records contain metadata only and exclude raw question/evidence content.

## Commands and result

`node --test tests/coach-provider-v11.test.mjs tests/coach-response-quality-v11.test.mjs tests/coach-answer-composer-v11.test.mjs`: 23/23 PASS.

`npm test`: 325/325 PASS.

`npm run test:release-gates`: 14/14 PASS.

Tests use synthetic fixtures and injected transports. No real player data, provider credential, external generation request, or DB write was used.
