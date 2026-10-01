# SF6DNA Site-wide UX Benchmark Delta

Date: 2026-10-02 (JST)  
Repository baseline: `sf6dna-v2-chatgpt-rc-20260916` @ `fd9ed809bdc6aa83365333cbd4d8b81645d0063e`  
Prior benchmark reused: `SF6DNA_100_SITE_BENCHMARK_MATRIX_20261001`, `SF6DNA_CROSS_INDUSTRY_UX_ADOPTION_REPORT_20261001`, and `SF6DNA_TOP20_UX_CHANGES_AFTER_100_SITE_REVIEW`. No full re-audit of the 100-site set was repeated.  
This is a design-pattern review. No text, code, CSS, images, or branded assets were copied.

## Fresh benchmark sample

Fresh search and page checks covered more than 20 distinct sites/services. Some sites expose only dynamic client-rendered UI to the text inspector; those entries are marked as pattern-level review rather than a full interaction test.

| Site / page checked | Observed pattern | SF6DNA decision |
|---|---|---|
| CAPCOM SF6 character roster / official manual | Official character selection and separate learning/manual destinations | ADAPT_FOR_SF6DNA: keep official sources clearly distinct from SF6DNA guidance |
| SuperCombo SF6 Wiki | Character information grouped into reusable reference sections | REUSE_IDEA: keep move/reference navigation predictable; no copied content |
| SF6 Data Lab (sf6-lab.com) | Move data, calculator, matchup and diff tools have separate task entry points | ADAPT_FOR_SF6DNA: keep specialized utilities discoverable without merging into the release scope |
| SF6 Lab (sf6-lab.net) fighter overview | Beginner guide and fighter/combos/frame/tournament routes presented as distinct paths | ADAPT_FOR_SF6DNA: task-first entry points; retain SF6DNA's diagnosis-to-practice distinction |
| SF6 Lab Chun-Li combo/setplay page | Combos connect to situation, ender advantage and setplay; page carries patch/update context | ADAPT_FOR_SF6DNA: explain context and freshness only where current evidence exists |
| SF6 Frame Data Search | Dense move records with category and numeric filters | ADAPT_FOR_SF6DNA: retain filters and readable labels; do not add unverified values |
| Miyabi Combo Archive | Combo browsing foregrounds damage, okizeme and Drive efficiency | POST_RELEASE: metric-rich combo comparison needs verified records and a separate QA plan |
| Reiketsu SF6 combo index | Character and control-type selection before browsing | REUSE_IDEA: filter by the user's task before showing long results |
| SF6 Ingrid (sf6-ingrid.com) character guide | Character page groups gameplan, combo and matchup sections with update statements | ADAPT_FOR_SF6DNA: section hierarchy is useful; never infer strategy/update facts |
| CAPCOM Buckler battle diagrams | Statistics segmented by character, control type and league | NOT_USE for Ver.1.0: live statistical claims need sample and freshness context |
| StrategyWiki SF6 contents | Table of contents supports long-reference navigation | REUSE_IDEA: keep section index short and scannable |
| ComboForge SF6 | Character browsing with notation, damage and difficulty cues | ADAPT_FOR_SF6DNA: only display fields already verified in the source record |
| ComboTier (linked through Steam community) | Video demonstrations, authored combo guides and favorites are separate tasks | POST_RELEASE: authoring / community submissions expand moderation and verification scope |
| Mobalytics champion directory | Search plus role and difficulty filters before the long roster | ADAPT_FOR_SF6DNA: use purposeful filters while preserving SF6 terminology |
| OP.GG champion help | Expert builds, alternative lanes and tier methodology have separate explanations | NOT_USE for Ver.1.0: rankings/build recommendations do not map to verified SF6DNA content |
| U.GG champion search and FAQ | Search can route directly to a named entity; data is conditioned on explicit filters | REUSE_IDEA: preserve query context and make the search scope clear |
| Liquipedia Fighting Games player page | Player profile links to dated results and game-specific activity | ADAPT_FOR_SF6DNA: separate profile facts from sourced results; images remain permission-gated |
| start.gg tournament search / home | Search and discovery split tournaments, rankings and hubs | REUSE_IDEA: make content type visible before a user opens a result |
| YouTube Help: Watch Later and playlists | Save-for-later and playlist destinations are explicit | ADAPT_FOR_SF6DNA: keep favorite/save state clearly distinct from watched state |
| Steam SF6 community guides | User-authored guide discovery and submissions | POST_RELEASE: user-generated submissions require review/moderation policy |
| Notion Help: sidebar navigation | Recents, favorites and task areas remain separately navigable | REUSE_IDEA: distinguish return paths from browse paths; do not add tracking in this batch |
| Spotify Your Library | Saved items have a stable return destination | ADAPT_FOR_SF6DNA: favorites should remain a reliable return path, separate from history |
| GitHub Docs: search syntax / filters | Query qualifiers and filter combination are explained with the search task | REUSE_IDEA: show applicable search scope and provide a clear reset path |
| Wikipedia / MediaWiki section help | Heading-derived contents and anchors support long pages | REUSE_IDEA: anchor navigation should match page sections and not obscure targets |
| Red Bull SF6 character guide | Character selection is a distinct guide-finding task | NOT_USE for Ver.1.0: editorial tier/ranking content adds claims outside the present scope |

## Adoption labels

- **REUSE_IDEA**: a general interaction principle is already present or safe to retain.
- **ADAPT_FOR_SF6DNA**: a pattern is suitable only after adapting it to current data and release gates.
- **NOT_USE**: it conflicts with SF6DNA's evidence boundary, is redundant, or has poor Ver.1.0 fit.
- **POST_RELEASE**: valuable candidate, but requires new data, persistence, moderation, or regression scope.

## RC audit findings

The audit was a source-level review of the route/component inventory and existing relevant regression tests at the baseline SHA. It was not a visual/browser acceptance test.

| Area | Current evidence in RC | Finding / decision |
|---|---|---|
| Global shell, header, footer, mobile dock | `app/layout.tsx`, `globals.css`, `mobile-refresh.css`, `theme.css` | Primary destinations and utility destinations are separated; mobile dock has four high-frequency links. Keep the existing hierarchy. |
| Tokens, colors, typography, focus, motion | `globals.css`, `theme.css`, `product-refresh.css`; reduced-motion rule present | Shared dark/light/appearance tokens and focus-visible treatment exist. No broad restyle warranted during release closure. Runtime contrast across all appearances still requires browser/device QA. |
| Home and learning loop | `app/page.tsx` | Home presents Daily15, diagnosis, characters, search, return links and recent updates. This preserves the intended data → understanding → practice path. |
| Character list and detail | `characters/page.tsx`, `characters/[slug]/page.tsx`, `character-tabs.tsx`, `character-quick-start.tsx` | Character detail has quick-start anchors, section links, progressive disclosure and related players/videos/sources. Public tabs continue to respect the strategy release boundary. |
| Moves / combos / setplay / sequences | `character-move-explorer.tsx`, `combo-explorer.tsx`, `character-detail-pilot.tsx` and route gates | Existing search/filter and disclosure patterns are present. No new values, combo summaries or strategy data were generated. Some strategy sections remain deliberately unavailable publicly. |
| Diagnosis / result / Daily15 | diagnosis routes, `/me/training`, existing Daily15 tests | Existing diagnosis-to-Daily15 and loginless path are retained. This batch does not alter scoring, storage, or training-library gates. |
| Search | `app/search/page.tsx`, `search.module.css`, search behavior/release-boundary tests | Results are grouped by character/player/tournament/video; filters preserve the query; suggestion and empty-state recovery exist. No route/type expansion made. |
| Players / videos | players, video routes/components and player/video QA tests | Player identity and related videos are separate; user-supplied images remain governed by the existing permission policy. No player-playstyle or results claims were added. |
| Sources / legal / account / error | sources, privacy, terms, disclaimer, contact, auth, error and not-found routes | Routes exist and release-gate tests cover core boundaries. This source review cannot verify external form delivery, auth persistence, RLS or production responses. |
| Responsive and accessibility | responsive CSS and mobile overflow/accessibility test inventory | Static rules include minimum control heights, reduced motion and overflow-safe layouts. Browser QA at 320/375/390/430/Desktop was not available in this pass. |

## Safe change integrated in this batch

The Character Quick Start panel already helped users move through character basics, moves, the first lesson, players and videos. It did not offer a direct route from character learning into the already-public Daily15 planner. Added a visible, keyboard-focusable **「今日の15分練習を決める」** link to `/me/training` in the shared quick-start component, used by the shared pilot and JP detail.

This link does not assert that the Daily15 plan is character-specific. It delegates to the existing planner, which can use the user's existing diagnosis context. No diagnosis logic, data, feature flags, publication gates, DB, or facts changed.

## Deferred / rejected in this batch

- Personal recent-character history, saved searches, and resuming partially completed plans: POST_RELEASE; require persistence and privacy/retention decisions.
- User-submitted combos/guides: POST_RELEASE; require moderation and verification.
- Live tiers, matchup rankings and recommendations: NOT_USE for Ver.1.0 unless the measurement scope and freshness are stated.
- New frame, damage, patch, player result, combo-condition or playstyle claims: NOT_USE without current primary evidence.
- Replacing the established site-wide visual language: NOT_USE during release closure; existing cross-route styles already implement shared tokens and interaction states.

## Verification and release boundary

- Targeted test: `character-ux.test.mjs` updated to assert the new link while preserving the five existing in-page anchors.
- `npm test`: PASS, 392 passed / 0 failed.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run test:release-gates`: PASS, 14 passed / 0 failed.
- `npm run build`: PASS. Next.js printed its existing `metadataBase` fallback warning because no production site URL is set in this local build. Next.js also auto-edited `tsconfig.json` and `next-env.d.ts`; those generated edits were discarded after inspection, leaving the project config unchanged.
- `git diff --check`: PASS.
- GitHub RC push: complete, non-force. Branch: `sf6dna-v2-chatgpt-rc-20260916`; code commit `ddfd927b2d8f03b4daa121fc588728abbef8b825`.
- Vercel Preview: READY at `https://sf-6-mugctgek9-somas11620-9368.vercel.app/characters/ryu`, Deployment `dpl_H3CKfXjwvKTNwj4SKv2X4NYApgka`, Git SHA matched the code commit above.
- Preview browser check: Ryu Character Detail rendered; the new 「今日の15分練習を決める」 link opened `/me/training`, and the Daily15 page rendered its plan. This confirms the target route and visible experience at the available browser viewport only.
- Browser QA at 320 / 375 / 390 / 430 px, Desktop size matrix, keyboard-only tab sequence, contrast per palette and user-device QA: pending; not represented as passed.
- Production, main, `sf6dna-v2`, V2, database and migrations: unchanged.

## Fresh source list

- https://www.streetfighter.com/6/character
- https://game.capcom.com/manual/SF6/
- https://wiki.supercombo.gg/w/Street_Fighter_6
- https://www.sf6-lab.com/
- https://sf6-lab.net/en/
- https://sf6-lab.net/en/fighters/chunli/combo
- https://frame-search.com/?lang=en-us
- https://www.miyabi-combo.com/
- https://reiketsu.net/sf6/
- https://www.sf6-ingrid.com/character/jp
- https://www.streetfighter.com/6/buckler/en/stats/dia
- https://strategywiki.org/wiki/Street_Fighter_6/Table_of_Contents
- https://comboforge.gg/games/sf6
- https://combotier.com/
- https://mobalytics.gg/lol/champions
- https://help.op.gg/hc/en-us/sections/31089153940505-Champions
- https://u.gg/lol/champions
- https://liquipedia.net/fighters/Fuudo
- https://www.start.gg/search/tournaments
- https://support.google.com/youtube/answer/56101?hl=en
- https://steamcommunity.com/app/1364780/guides/
- https://www.notion.com/help/navigate-with-the-sidebar
- https://support.spotify.com/ws/article/your-library/
- https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-search-syntax
- https://www.mediawiki.org/wiki/Help:Section
- https://www.redbull.com/int-en/street-fighter-6-character-guide
