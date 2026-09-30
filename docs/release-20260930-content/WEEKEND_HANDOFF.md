# Ver.1.0 weekend QA / content closure handoff — 2026-09-30

Release target remains **2026-10-10**. Quality gates take precedence. Assistant stays deferred; no Ver.1.1 implementation changes in this batch.

## Reused evidence

Diagnosis save identity fix and four diagnosis Preview flows passed at RC4e4241f9. Auth/save-related code is unchanged in this content batch. Local/Preview horizontal overflow was not reproduced; no speculative CSS or global overflow hiding was added. Japanese fonts in the automated environment do not substitute for device rendering QA.

## Device queue

Home → Diagnosis → Result → Daily15 → Characters (Ryu, Luke, JP, Ken; longest/charge/grappler inputs in authorized combo preview) → Players → Videos → Search → Auth → Save → History → Favorites → Sources → Theme. Check 375px, dark/light, font glyphs/wrapping, buttons/card height, expanded move categories and actual command readability. Do not count the offline renderer harness as public route or device PASS.

Login → Diagnosis → Save → History → Reload → History persistence → Logout → post-logout state. Check duplicate save, errors and same result identity. **This batch did not run real save because DB_WRITE=NO.** Obtain the separately authorized test context before a real save flow.

Overflow reproduction record: device, OS, browser/version, viewport, route, character, section, theme, login state, screenshot; measure scroll width/movement. Fix only a reproduced cause.

## Ryu capture intake

RYU_MEDIA.zip has not arrived. Use the fresh expected list/checklist and scripts/ryu-media-pipeline.py. Expected order/file is a proposed recording plan, not observed recording. Review order, boundaries and identity against supplied footage; never infer move identity. Original MP4 remains outside Git. Completed WebP stays staged until mapping/visual review and existing production media manifest validation.

Actual cut/WebP/binding, missing/double/wrong moves, byte totals, initial requests, scroll/memory/layout shift and real device performance remain pending. Synthetic fixtures verify the pipeline only. Existing Ryu assets are preserved and do not count as new ZIP completion.

## Separate approvals / blocked applications

- Internal guard: approved NO / applied NO. Concrete diff and targeted test plan are in INTERNAL_ACCESS_PREPARATION.md. Anonymous exposure remains a blocker.
- Source30: individual proposals complete; DB metadata, adoption relations and public scope unchanged. Community29 LINK_ONLY + official1 PUBLIC_WITH_ATTRIBUTION recommendations are not adopted gameplay evidence. Playback/reachability and two exact dates remain unverified.
- Combo: shared renderer may cover every eligible existing card; publicStrategyContent is unchanged. Do not interpret offline eligible-corpus parsing as publicly visible combo completion or enable the flag implicitly.

These are separate scopes; approval of one does not authorize the others, Production, dependency changes or DB writes.
