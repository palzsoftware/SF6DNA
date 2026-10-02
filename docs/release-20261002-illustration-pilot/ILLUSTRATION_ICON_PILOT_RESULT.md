# Illustration / icon pilot result — 2026-10-02

Base remote SHA: b711a7ab34a854661d8e822f3a89c5d4cdd944a1
Base tree: 82fabc55d460e9b9a180f502512a296c51539a5e

## Scope / integration

JP / Ryu / Luke generated as a single static fan-art series. Preview-only guides sit in the Quick Start heading, not the main Hero or character-list portrait. Three allowlisted assets, no full rollout. Existing five anchors and public Daily15 CTA preserved. No device-preview token, unpublished strategy or media mapping introduced.

Home replaces two-letter training / diagnosis / character slots with existing-style original inline icons. Daily15 adds one original geometric helper; Favorites and local diagnosis History add helpers only to empty states. Search keeps its verified input presentation and existing search icon. Diagnosis uses the new DNA icon at the Home entry; the diagnosis screen and logic remain unchanged. Player images / video thumbnails remain primary.

## Checks

409 tests PASS, 14 release gates PASS. Typecheck / lint / build / diff check PASS. An initial local Turbopack persistence panic was resolved by retaining the old generated cache in a temporary directory and rebuilding with a fresh cache. Generated next-env.d.ts / tsconfig.json diffs were inspected and excluded; final typecheck PASS. Five new tests cover Preview environment allowlisting, Production and promoted-host denial before filesystem access, Quick Start preservation / decorative lazy image semantics, distinct valid assets, and decorative vector helpers. Existing Daily15 handler test imports the presentation helper without changing the tested logic.

No gameplay fact, public data visibility, questions, scoring, recommendation, task generation, save contract, request_id or idempotency changes. No new product function, dependency, DB write, Production, main, sf6dna-v2 or Ver1.1 change. Existing media files, posters and manifest untouched. Release flags unchanged.

Asset total: 71.0 KiB. Delivery route has no-store and noindex, and files are outside public. Output tracing includes all three WebP files. Production fallback requires a Production-target build; unverified Preview artifacts must not be directly promoted. See rights gate.

## Pending acceptance

Code commit: c85e24ee2487b4a5b3d78843d6e45fdf310a74ef
Verified Preview: https://sf-6-jkpcdryjm-somas11620-9368.vercel.app/
Deployment: dpl_6MkWgdCb1o6qia81zuzsrymjbfLy, READY, exact code SHA / branch match.

Deployed Dark / Light desktop smoke: PASS for Home, Diagnosis, Daily15, Characters, JP, Ryu, Luke, Search, Favorites. Browser viewport innerWidth 1363, document clientWidth / scrollWidth 1348 / 1348 for each theme / route. No document-wide overflow observed. Three chibi image sources loaded with natural dimensions; ordinary lazy-loading can show not-yet-loaded state before the image enters the view. No broken complete images or current-host console errors observed. Favorites empty helper verified after local preference initialization. Main Hero and character-list artwork unchanged. No mobile PASS inferred.

Final documentation-only commit retains this code / asset evidence; its deployment metadata is checked in the final report.
Mobile 320 / 375 / 390 / 430: USER_REQUIRED (cloud viewport resize unavailable).
Character derivative rights: UNVERIFIED_FOR_PRODUCTION.
JP SA2: MEDIA_INPUT_REQUIRED, untouched.
User review: Home / JP / Daily15 only.
Release: NO-GO, no additional confirmed P0/P1.
