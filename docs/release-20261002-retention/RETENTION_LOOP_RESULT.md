# Retention loop verification — 2026-10-02

Base remote: cff42c14456b45461c4f9244c48b815d64a936b1, tree 9415e1572260d53b1c7ea6b5a18d1a27f0973e7e. Fresh remote matched before RC write. Code commit: 2e8500d38ef9010fc8fdcbab9526c0d0f36b7721, tree a2d483e55d4bb7153844d9293292c38f662f81ef.

## Implemented

Versioned browser-local Daily15 snapshots, Start, per-item completion/undo, reload restoration, stable UUID upsert, latest-unfinished resume, repeated sessions without a per-day limit, compact Home return state, practice-history timeline and completion next actions. History cap 50; render first 10; storage additional character budget. Corrupt/absent data fallback, unknown-schema overwrite protection and storage/quota failure feedback. See persistence contract and history model.

No new dependencies, API/LLM, game-fact edits, DB writes, auth requirement, Production/main/sf6dna-v2/Ver1.1 changes. Original diagnosis and task-generation libraries unchanged. Flags aiCoach=false, training=false, publicStrategyContent=false unchanged. Generic illustration helpers reused; chibi fallback/rights unchanged. JP SA2 MEDIA_INPUT_REQUIRED, untouched.

Weekly Goal / Weekly Review: DEFERRED. Companion: FOUNDATION_ONLY (typed state interface); no constant widget. Scope expansion beyond authorized retention features: none.

## Gates

422 tests PASS / 0 FAIL, including 13 new persistence tests; 14 release gates PASS. Typecheck, lint, build, diff check PASS. Post-build generated next-env.d.ts / tsconfig.json diffs inspected and excluded, followed by typecheck PASS. Static generation 47/47; /me/training dynamic, /me/training/history static shell with client local-state hydration. No new build error. Existing diagnosis-question, scoring, recommendations, save/request-id/idempotency contracts are reused; no account Auth Save was executed.

## Browser evidence

Verified code Preview: https://sf-6-h9435d0cc-somas11620-9368.vercel.app/
Deployment: dpl_8psqdyjBa4Xodaj9uk6Xz45hvZxk. READY; exact code SHA and RC branch match.

Dark flow: Start → complete first item (5/15, 1/3) → Reload → same session / three items / 1/3 restored → Home resume link targets same UUID → finish remaining items (15/15) → Home completion/history → one history row → Reload still one row. PASS.

Browser tab close/reopen: completed history retained in another tab after original tab closed. PASS. Repeat action: same three tasks, new UUID, 0/3, same-day second practice allowed. Light flow: first item → Reload restore → remaining items → two independent completed history rows. PASS. One accordion click immediately after reload did not change the visible panel; a fresh DOM observation and one retry succeeded. No reproducible blocker or current-host console error observed; device tap/feel acceptance remains pending.

Diagnosis-result flow: completed the existing 12-question improvement diagnosis through UI (test answers), clicked its unchanged /me/training?diagnosis=improvement&focus=anti_air link. First task remained anti-air; Start and Reload retained the same diagnosis-derived theme/task snapshot. PASS. No account Save invoked. Third test session remained incomplete, independently represented beside two completed sessions.

Dark / Light Home, Daily15 and practice history rendered; document clientWidth/scrollWidth 1348/1348 in the available 1363px browser. No complete broken image or current-host console errors observed. New UI uses existing responsive layout and safe text wrapping. Browser viewport resize unavailable: 320/375/390/430 NOT_VERIFIED; no static/desktop evidence promoted to device PASS.

The final evidence-only commit has identical application/test/assets to the tested code commit. Final exact-SHA Preview metadata is reported with the final result; gates are reused for that unchanged application tree. Browser-local histories are origin-specific and do not transfer between Preview deployment URLs.

## Remaining acceptance

One device retention scenario in DEVICE_REVIEW_HANDOFF.md. Real-account Auth Save/persistence remains separate. Internal Guard / Production approval and pre/post-promotion checks remain independent core gates. JP SA2 media input and character-derivative Production rights remain unchanged. Scope-dependent unpublished Luke5 / Source30 / optional media are not promoted to new unconditional core blockers.

NEW_P0=0 observed; NEW_P1=0 newly observed. RELEASE_STATUS=NO-GO. Next single action: final Preview on the user's device, one-item completion → Reload → resume → full completion → history without duplicates.
