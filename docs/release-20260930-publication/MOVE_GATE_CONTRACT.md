# Existing move publication recovery: gate contract

Base RC: `f0ef3991`; audit-only implementation. No application query, gate, feature flag, DB record, or public scope is changed.

## Existing gate and publication readiness

| Layer | Existing behavior | Audit treatment |
|---|---|---|
| Move status | `moves.status = published` | Every draft remains unpublished; candidate sets do not change status. |
| Current patch | `patches.is_current = true`, `maybeSingle()` | Exactly one current patch required; missing/multiple current patch fails closed. |
| Classic command | At least one Classic command row | Publication preparation additionally needs nonempty existing command text/numeric/button notation. Modern input is not inferred. |
| Frame | Verified, open-ended row starting at current patch | Verified is a DB label. Explicit candidate/pending verification notes prevent evidence-ready classification. |
| Official evidence | At least one RPC-allowlisted source with official reliability for each of move, any Classic command, any current verified frame | Audit reports evidence targets separately. Existing labels alone do not independently establish source accuracy or game verification. HTTPS required for proposed source readiness. |
| Description | Not required by `isMovePublicReady` | Missing existing description/usage summary is an overlapping readiness issue; no generated performance claim. |
| Strategy feature | `releaseFeatures.publicStrategyContent = false` | Structural candidates are not actual publicly accessible move detail pages. Flag remains disabled. |

The live `get_public_entity_sources()` definition observed on 2026-09-30 filters source reliability and source type through allowlists; it does not itself filter candidate/adoption notes. The audit uses the observed source-type allowlist for official-labelled evidence.

`isMovePublicReady()` gets sources through `get_public_entity_sources()`. The live `private.is_move_public_ready` requires Classic official evidence, move official evidence and a verified current/open frame with official evidence. `private.is_public_source_target` additionally requires published move status for move/command/frame source access. `getPublicEntitySources` discards entries missing title, URL or source type. These conditions are accounted for in the structural candidate contract. An offline structural candidate is not a runtime RPC PASS. The audit cannot promote data by labelling it ready.

## Classification precedence

The primary classification is mutually exclusive and deterministic:

1. `DATA_INCONSISTENT`: duplicate move identity, missing identity, or multiple current verified frame rows.
2. `HOLD`: explicit whole move/current-frame/command pending or candidate evidence, no unique current patch, or no current verified frame. Source-scoped uncertainty is evaluated at its claim target and retained separately; optional community evidence does not veto an independent complete official chain.
3. `COMMAND_REQUIRED`: no usable existing Classic input.
4. `SOURCE_REQUIRED`: missing HTTPS official-labelled evidence at any required target.
5. `DESCRIPTION_REQUIRED`: no existing description/usage summary.
6. `FRAME_VERIFIED_BUT_MOVE_DRAFT`: all preceding preparation checks met, but move remains unpublished.
7. `PUBLISHABLE`: all preparation checks met and status already published.

`overlapping_reason_counts` and each move's `reasons` retain other blockers regardless of primary class. `current_verified_frame_moves` reports the frame-labelled candidate pool independently, so frame-ready draft moves that also lack evidence are not lost in primary totals. `FRAME_VERIFIED_BUT_MOVE_DRAFT` is a prepared subset, not the total frame-labelled draft pool.

No frame numbers, commands, patch facts, or verified status are inferred. Null descriptive fields remain null. Numeric frame values are not copied into this publication readiness report because the audit does not establish their accuracy.

## Display differences to preserve for later approved work

- `content-detail.ts` and `character-sections.ts` currently select an open-ended verified frame without directly requiring `valid_from_patch_id = current patch`. `isMovePublicReady` separately requires a current-patch frame. Multiple open verified rows can therefore make the display row differ from the gate-qualified row.
- `MovePage` currently checks the strategy feature before evaluating its preview request, so that route remains unavailable while the feature is disabled.
- A source labelled official is not necessarily an official publisher. Candidate notes and source URLs remain evidence that needs review; the audit does not relabel publishers or adopt sources.

These are recorded findings, not instructions to relax the gate or enable public content.

## Reproduction

```sh
python scripts/test-audit-move-publication.py
python scripts/audit-move-publication.py /tmp/fresh-move-snapshot.json docs/release-20260930-publication/MOVE_PUBLICATION_AUDIT.json
```

The fixture suite is isolated from Supabase and network access. Existing application/browser PASS evidence is reused because this lane changes audit scripts and documentation only.

The JSON output uses lossless normalized tables; use `expand_report()` to recover exact ordinary per-move dictionaries. Candidate/source uncertainty stays scoped to the relevant evidence claim. Source/relation pending notes are recorded separately from whole-row HOLD reasons.
