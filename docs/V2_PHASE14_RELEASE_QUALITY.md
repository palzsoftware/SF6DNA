# SF6DNA v2 Phase14 — Release Quality & Verified Content Promotion

Date: 2026-08-27
Branch: `sf6dna-v2`
Patch baseline: `2026.08.03`

## Purpose

Phase13 completed the structural registration / normalization gate for all 31 playable characters. Phase14 does not add new product features. It moves the existing data and application toward release-quality state using the existing `V2_RELEASE_READINESS.md` gates.

The Phase14 focus is:

1. separate `reviewed` from `verified` and `draft` from `published`;
2. promote only records supported by sufficient current-patch evidence;
3. keep Training Mode / timing-dependent claims unverified until reproduced;
4. measure 31-character release-readiness coverage without inventing missing values;
5. run existing release-readiness checks for data quality, admin/security and deployment when the required prerequisites are available.

## Phase13 handoff state

Phase13 structural gate: **PASSED (31 / 31 playable characters)**.

All 31 `character_content_packages` are `complete` at the structural/normalization level.

Phase13 safety rules remain mandatory:

- `reviewed != verified`
- `draft != published`
- do not infer missing frame, command, combo, setup or matchup values
- current patch is `2026.08.03`
- exact tactical claims require direct current source or Training Mode reproduction
- future/non-playable rows are outside the 31-character scope

## Phase14 baseline — Supabase production DB

Baseline captured on 2026-08-27 from `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`).

| Category | Total | Published | Verified |
|---|---:|---:|---:|
| Playable Character | 31 | 31 | - |
| Move Frame | 2065 | n/a | 307 |
| Combo | 341 | 0 | 1 |
| Setup | 186 | 0 | 0 |
| Sequence | 186 | 0 | 0 |
| Counter | 1122 | 0 | 0 |
| Training | 1477 | 0 | 0 |
| Character Trait Score | 372 | 0 | 0 |

Interpretation: Phase14 is primarily a verification / release-readiness phase, not a content-count expansion phase.

## Release-quality gates used in Phase14

Phase14 consumes existing gates from `docs/V2_RELEASE_READINESS.md`.

### Gate C — Data quality

For any strategy/gameplay record promoted to public use:

- `status = published`
- `verification_status = verified`
- Source exists
- patch-dependent data has a valid current-patch relationship
- old-patch information is not presented as current
- exact frame / punish / true-string claims are not based on AI inference

### Gate D — Character encyclopedia

For each of the 31 playable characters, measure release-ready coverage for:

- Character + official Source
- Alias
- key Move / Command / Frame
- minimum basic Combo coverage
- representative Counter / Training guidance

The gate does not require every candidate slot to become verified. Unknown or unverified content must remain clearly unavailable rather than guessed.

### Gate G — Deployment / UX

After data and application prerequisites are ready:

- Vercel Preview
- Supabase environment configuration
- desktop + iPhone-width checks
- navigation / search / diagnosis checks
- metadata / OGP / sitemap / robots checks

## Phase14 work order

1. Build a per-character verified/published coverage audit.
2. Identify records that are already eligible for promotion from existing current evidence.
3. Do not promote any timing-dependent or hands-on-only candidate without reproduction evidence.
4. Re-run source/patch/publish-leak checks after every promotion batch.
5. Confirm diagnosis Trait Score readiness separately from generic content presence.
6. Run Build/Runtime and release-readiness checks on `sf6dna-v2`.
7. Produce a Phase14 completion audit before entering the next phase.

## Explicitly deferred ideas

The following were discovered during Phase13 and are **not automatically implemented in Phase14** without a separate decision:

- formal Alias applicability rules
- UI distinction between candidate Combo and verified practical Combo
- Source ownership directly on `player_characters` relationships
- broader package-status taxonomy documentation beyond the minimum needed for current operation

## Completion definition

Phase14 is complete when:

- verified/published coverage is accurately measured for all 31 characters;
- eligible existing evidence has been promoted without weakening verification rules;
- remaining unverified backlog is explicitly classified rather than hidden;
- no unverified strategy record is accidentally public;
- current-patch/source integrity gates pass;
- existing release-readiness checks that can be executed in the current environment have been completed and remaining external/manual gates are explicitly listed.

Phase14 completion does **not** require fabricated 100% content coverage.
