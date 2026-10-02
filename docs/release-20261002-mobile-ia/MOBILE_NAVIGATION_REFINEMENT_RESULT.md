# Mobile IA refinement — 2026-10-02

BASE_SHA = 44f321a50285e09bc33a1b63c0e2113da651e560
RELEASE_STATUS = NO-GO

## Implementation

Global exploration remains Characters / Diagnosis / Search / Players / Videos. Desktop keeps visible navigation; mobile uses a native menu disclosure beside logo and existing display settings. No new settings system, storage or request. Return dock: Home / Daily15 / Favorites / local Diagnosis History / My Character. Exact-path aria-current distinguishes active destination without treating Diagnosis pages as History. Five Japanese labels, 44px minimum tap area; no English pseudo-label row. Dock outer height reduces from 63px to 54px, excluding safe-area placement. Body bottom reservation is 64px + safe-area inset, greater than 54px dock + 8px bottom offset; actual Safari overlap requires device evidence.

Continue: 3 columns desktop, 2 mobile; Explore: 4 desktop, 2 mobile. At <=340px both fall back to one column. Short helper descriptions, title then description, no icon column, compact 12px mobile padding. Daily15/Diagnosis remain prominent; Today > Continue > Explore > Watch > Updates remains. Hero imagery and DNA kept; mobile visual minimum height 240px. Character list two-column rules unchanged, body padding 12px and CTA becomes 詳細を見る; full character-specific accessible link name remains.

Tone: orange primary retained; diagnosis surface uses existing info tint, Watch uses one muted violet token and neutral Updates/Continue. Monochrome maps Watch tone to muted text. Text colors remain semantic existing theme tokens. No rainbow, asset/dependency/animation additions. Reduced motion retained.

## Verification

Full tests 402 PASS / 0 FAIL; Release gates 14 PASS. Targeted character/navigation tests 7 PASS, including exact active route, all five destinations, zero overlap with global exploration destinations. Three existing copy assertions updated for shorter intended labels, keeping original scope/retention checks. typecheck/lint/build/diff final results and exact Preview SHA are in completion report. Build-generated next-env/tsconfig inspected and excluded from changes.

Browser viewport control is unavailable in the connected browser and existing local executables remain unavailable. 320/375/390/430 runtime measurements are NOT_RUN, not inferred from CSS. Source review verifies wrapping, minmax(0,1fr), 44px targets, fixed dock reservation and safe-area; actual mobile overflow/overlap remains NOT_VERIFIED. Desktop Dark/Light smoke results are recorded in completion report.

GAME_FACT_CHANGE=0 / PUBLIC_BOUNDARY_CHANGE=0 / NEW_FEATURE=0. No diagnosis/save/scoring contract, release flags, Motion Media/mapping/manifest, data/source relations, Production or DB write.

## One-session device handoff

Only Home and Characters required. Home: menu open/close, display settings, Dock destination/current state, Continue/Explore density, section color, scroll length. Characters: two-column cards, short CTA, Header/Dock, final footer not hidden. Portrait, no pinch zoom; record device/OS/browser/display zoom/theme/SHA, each PASS/FAIL/NOT_RUN. Optional JP only if shared Header/Dock issue occurs. No 31-page retest. Account Save and JP Media acceptance remain separate.
