# Public Copy test evidence

- Targeted UI/copy tests: 33 / 33 PASS
- Full tests: 267 / 267 PASS
- Release gates: 14 / 14 PASS
- TypeScript: PASS
- ESLint: PASS
- Next production build: PASS
- `git diff --check`: PASS
- Build-only changes to `next-env.d.ts` and `tsconfig.json`: inspected and excluded
- New guard: `tests/public-copy-natural-japanese.test.mjs`

The production build emitted the existing local `metadataBase` fallback warning because no production site URL is configured in the local shell. The release configuration continues to fail closed rather than guessing a production domain.
