# Combo Input Icon Foundation / Pilot result — 2026-09-30

## Implementation
- Lossless tokenizer with DIRECTION, BUTTON, SYSTEM_ACTION, SUPER, SPECIAL_COMMAND, CONDITION, TEXT, AMBIGUOUS semantic tokens.
- Explicit Classic LP/MP/HP/LK/MK/HK and generic L/M/H/SP/ASSIST are recognized separately. No control-scheme conversion.
- DR / CDR and explicit DI hit / guard / wall splat / stun remain distinct.
- Bare DI and DI(PC)/DI(clean)/DI(wall)/DI(壁), generic P/K/PP/KK remain AMBIGUOUS and visible as original text.
- Compact 5LP, 236LP, 22HP, 236236LP are recognized. Prose/gauge numbers stay ambiguous; → between recipe actions stays a text separator.
- Requested motions, circles, charge, jump and command-throw semantic definitions supported. Unclear timing and input remain text. Circle/charge labels do not invent direction or duration.
- Renderer uses original SF6DNA text-backed shapes with aria-label, title, text fallback, theme variables and shape distinctions. Original recipe always displayed, no copyrighted input assets.
- PilotComboCard integration gated by exact 15 IDs (Luke 5 / JP 5 / Ken 5), no publication eligibility, route feature flag, DB or global CSS change.

## Files
- src/lib/combo-input-tokens.ts
- src/components/combo-input-recipe.tsx
- src/components/combo-input-recipe.module.css
- src/components/pilot-combo-card.tsx
- tests/combo-input-tokens.test.mjs
- tests/fixtures/combo-icon-pilot.json

## Validation
- New 10 behavior tests + existing 3 integration tests: 13 PASS.
- Targeted eslint: PASS.
- Actual React SSR renderer checked for escaping, exact DR/CDR and DI_GUARD aria labels, DI(PC) ambiguous preservation.
- Isolated full PilotComboCard React SSR with actual 15 snapshot recipes and synthetic required enum coverage, real card/recipe CSS, all details expanded, at 375px:
  - Dark: document scrollWidth 375, overflow 0, page errors 0.
  - Light: document scrollWidth 375, overflow 0, page errors 0.
  - 15 cards, 16 original-recipe blocks, 171 labeled icons, unlabeled icons 0.
- Harness does not create an app route or enable unpublished strategy content.
- `/tmp/sf6dna-combo-pilot-measurements.json` contains measurements; harness and screenshots in /tmp/sf6dna-combo-pilot-*.

## Limits / remaining
- Existing publicStrategyContent=false; standard public character detail does not expose these recipe cards. Existing authorized device preview token is required for application route QA.
- Snapshot rows have reviewed/unverified status. Display/parser PASS does not certify combo gameplay, current patch, source accuracy, or public eligibility.
- Full shared renderer rollout not performed; only 15 pilot IDs.
- Japanese font is missing in temporary Chromium. Glyph quality, linebreak readability, contrast on actual site theme and 375px real-device QA remain pending.
- Circle, charge, command throw and rarer motion coverage is synthetic, not validated real recipes.
- Upstream character-detail-pilot currently normalizes combo.command through normalizePublicCopy. To preserve DB notation byte-for-byte, root should remove that normalization for recipe only; no new content interpretation is needed.
