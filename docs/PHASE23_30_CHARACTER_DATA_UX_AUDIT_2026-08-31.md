# Phase23 30-character Data / UX Audit — 2026-08-31

## Scope

User requested that the Ryu continuous motion-video upload be deferred until the final manual stage. This audit therefore covers the other 30 playable characters and the shared SF6DNA UX/layout.

No Move, Strategy, Trait Score, or other draft/reviewed content was promoted to published by this work.

## 30-character inventory (Ryu excluded)

- Playable Characters: **30**
- Move records: **2008**
- Moves with current verified Frame: **1963**
- Moves with a Modern Command record: **1392**
- `draft + private.is_move_public_ready(id)` candidates: **701**
- Characters with at least one public-ready Move candidate: **12 / 30**
- Characters whose current Move inventory is entirely public-ready: **7 / 30**

### Characters with public-ready Move candidates

| Character | Ready | Total |
| --- | ---: | ---: |
| Dee Jay | 105 | 105 |
| Jamie | 93 | 93 |
| Blanka | 91 | 91 |
| Dhalsim | 88 | 89 |
| Kimberly | 76 | 76 |
| E. Honda | 70 | 70 |
| Guile | 70 | 70 |
| Chun-Li | 68 | 68 |
| Yasmine | 19 | 85 |
| Mai Shiranui | 10 | 95 |
| C. Viper | 7 | 72 |
| Elena | 4 | 86 |

These are readiness candidates only. **Readiness does not authorize publication.**

## Character shell audit

For the 30 Characters, the following top-level descriptive fields are currently empty in `characters`:

- `image_url`
- `archetype`
- `preferred_range`
- `difficulty`
- `summary`
- `strengths_summary`
- `weaknesses_summary`

This does not currently leave the UI without Character art because `legacyCharacterImageUrl()` contains a fallback mapping for all 31 playable Characters.

The descriptive fields must not be populated from reviewed strategy prose merely to fill UI space: the Character rows are already public, so doing that would expose reviewed/unverified strategy content through a published shell.

## Guide-section audit

- Most non-Ryu Characters have **9** non-archived `character_guide_sections`.
- JP has **8**.
- These sections are primarily `draft / reviewed` and are therefore not public content.
- Some Characters (for example JP, Guile, Kimberly, Ken, Juri) already contain notably character-specific reviewed prose.
- A substantial portion of the remaining roster still contains intentionally generic reviewed templates that require additional evidence or actual-game verification before they can become release-quality public strategy text.

The Preview UI now groups these review candidates by purpose rather than displaying one long undifferentiated list.

## Character Source audit

A direct Character-level official movelist relation existed for nearly the full roster. JP was the exception even though the official JP movelist and 2026.08.03 patch Sources already existed in `sources`.

Phase23 now links those existing official Sources to JP through an idempotent migration:

- official JP movelist
- official JP 2026.08.03 battle-change page

No guessed URL or generated Source was introduced.

## Preview audit / change

The Phase23 token-gated device Preview RPCs were originally hard-limited to Ryu. That prevented the same pre-publication UX and data inspection from being used for the other 30 Characters.

The Preview RPCs now accept any Character that is both:

- `status = 'published'`
- `is_playable = true`

The existing temporary token/expiry gate and read-only behavior remain in place. The change does not publish draft/reviewed content.

## UX findings

### 1. Global navigation was too broad for daily use

The header contained eight equal-weight destinations. The revised navigation prioritizes the tasks that are repeatedly useful during SF6 play:

- Search
- Characters
- Matchups
- Training
- Diagnosis
- AI Coach
- My tools

Players and Videos remain available through secondary navigation/content surfaces.

### 2. Home page looked more like a promotional landing page than a repeat-use tool

A new task-oriented "今すぐ使う" area sends the user directly to:

- pre-match matchup review
- practice
- post-match review/tools
- character study

The existing SF6DNA pillars remain below it.

### 3. Character directory required scrolling through all Characters

The directory now supports a lightweight server-side Character-name filter and provides direct links to:

- Favorites
- Character comparison
- Matchups
- Training

No client-side state or new backend feature was required.

### 4. Character overview had unnecessary empty panels

Because top-level Strengths/Weaknesses fields are intentionally still empty, rendering permanent "準備中" panels added noise. Empty Strength/Weakness panels are now suppressed.

Reviewed Preview guide sections are grouped into:

- pre-match
- core game plan
- level-based priorities
- match decisions
- practice

### 5. Character tabs were easy to lose while scrolling

Character tabs are now sticky, with horizontal scrolling retained for narrow screens.

### 6. Move pages repeated an empty motion placeholder for every Move

With motion capture deliberately deferred, a Character with 70–100 Moves could show 70–100 identical "GIF / 短尺動画は準備中" blocks. Those repeated placeholders are removed.

Motion media now appears only when actual media exists. The CAPCOM official movelist is exposed once near the section header, using the Character's official Source relation instead of a Ryu-only hard-coded URL.

### 7. Visual styling was overly decorative in places

A final CSS override layer (`ux-refresh.css`) reduces decorative cut-corner shapes and giant visual markers, keeps the dark SF6 identity, and uses orange/cyan more selectively. The goal is a calmer data-tool/product surface that can be used repeatedly rather than a one-time promotional page.

## Safety / publication state

- `reviewed ≠ verified` remains unchanged.
- `draft ≠ published` remains unchanged.
- No Modern Command was inferred.
- No bulk publication was performed.
- Ryu motion-video upload remains deferred to the final manual stage per user request.
- `main` and Production are outside the scope of this change and must remain untouched without explicit permission.
