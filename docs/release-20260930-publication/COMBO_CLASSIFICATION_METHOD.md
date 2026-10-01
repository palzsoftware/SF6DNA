# Combo Publication Recovery Method

This batch classifies existing records offline. It does not publish, alter DB data, change feature flags, infer gameplay correctness or introduce a new application gate.

Existing repository gate requires published + verified, current nonexpired patch, published playable character, exact nonplaceholder notation and entity_sources evidence. The classifier additionally distinguishes current gameplay reproduction evidence from the general `verification_status` field.

## Disjoint primary classes

Precedence is DATA_ERROR → DUPLICATE → HOLD → SOURCE_REQUIRED → GAME_VERIFICATION_REQUIRED → PUBLISHABLE. Every additional blocker is retained as a secondary reason. Per-reason counts overlap and must not be added to the primary totals.

- DATA_ERROR: missing identity/notation, raw reconstruction failure or invalid supplied numeric value.
- DUPLICATE: explicit duplicate_of references an existing different record. Same character/notation alone is a candidate, not proof of duplication.
- HOLD: archived/noncurrent patch/nonpublic character boundary.
- SOURCE_REQUIRED: no resolved HTTPS source with title, publisher and noncandidate relation. This is metadata readiness; a link is not gameplay evidence or legal approval.
- GAME_VERIFICATION_REQUIRED: unverified/reviewed status, placeholder/pending notes, missing required context or no documented current-patch reproduction.
- PUBLISHABLE: no remaining blockers, including verified status, source metadata, exact recipe, current context and explicit reproduction evidence.

NULL damage / drive cost / SA cost remain unknown; they are not fabricated and are not treated as zero. Verification of any supplied value still belongs to reproduction evidence.

## Explicit gameplay evidence

The local adapter accepts an optional `game_verification` evidence object with a PASS result, current patch ID, HTTPS recording, verifier and date. This is a report-input contract, not an existing DB schema assertion, new migration or new feature. A general verified flag, verified Move frame, Combo step count, source relation, parser losslessness or 375px rendering PASS does not satisfy this evidence requirement.

If fresh DB records do not contain this evidence or comparable reviewed evidence has not been explicitly adapted, the automatic first safe cohort remains empty. This means evidence is not established by this snapshot, rather than asserting that every combo fails in-game.

## Duplicate candidates

Whitespace and > / ＞ / → separators may be normalized for candidate detection. Inputs, strength, timing, controls, conditions and source evidence are not semantically merged. Candidate IDs are reported alongside per-record blockers; no DB record is removed or archived.

## Reused QA

The previous 1,478-row renderer losslessness and 375px Dark/Light geometry PASS are reused. This batch only tests the new offline classification logic. No application renderer/UI changed.

## Run

`node scripts/audit-combo-publication.mjs <complete fresh read-only snapshot.json> <report-directory>`

Snapshot supports top-level combos / characters / patches / sources / entity_sources / combo_steps arrays or per-Combo nested character_record / patch / source_relations / steps. Source metadata and notes are inspected from the supplied snapshot; the script does not fetch the network or write DB data.
