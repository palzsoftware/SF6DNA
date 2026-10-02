# Character media presentation result

## Confirmed before evidence
Browser on base Preview showed `object-fit: cover`, `object-position: 50% 16%`, and `transform: matrix(1.015,0,0,1.015,0,0)` on character-card images. Natural aspect ratios varied (Ryu 310×431, Luke 310×412, Chun-Li 310×494, Kimberly 310×312). Cover plus scale crops variable compositions inside a fixed frame.

## Fix
Shared Card uses contain, centered full-source bounds, no hover zoom, and bottom space for the nameplate. No arbitrary 31-character position map: none is justified from current evidence. This preserves source canvas contents, though it cannot recover a cut already present in a source asset.

Mobile Hero uses compact image/text split, a bounded 180px portrait, smaller name heading and wrapped preference controls. Generic and JP-specific templates both updated. Hero responsive image sizes now match the small mobile column. No long descriptions or game data removed.

Search inputs on Home and Search receive an inner field with distinct tint/border, magnifier and accent focus outline in both themes. Specificity accounts for existing Light-theme overrides.

## Verification
404 tests and 14 release gates pass. Typecheck/lint/build pass. Build-generated next-env.d.ts and tsconfig.json changes were inspected and excluded because they are unrelated. Two new SSR tests cover decorative icons with readable labels, and schematic range labels/cautions without data mutation. Existing JP/Ryu/Luke/Ken/Zangief strategy preservation tests pass.

Browser verification of final Preview is recorded in DEVICE_REVIEW_HANDOFF.md. Mobile viewport measurements and final human alignment assessment must not be represented as device PASS.

JP SA2 remains **MEDIA_INPUT_REQUIRED**. MP4/poster files and manifest/mapping unchanged. Re-recording is outside this batch.
