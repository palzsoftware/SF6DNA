# SF6DNA Ver.1.0 — Weekday Release / Content Quality Result

Date: 2026-10-01
Target branch: `sf6dna-v2-chatgpt-rc-20260916`
Base RC at preflight: `f0ef399143fae7d2ba1d0cfefed65bc88cef5beb`

## Fresh state and boundary

- GitHub target branch HEAD: `f0ef399143fae7d2ba1d0cfefed65bc88cef5beb`; local HEAD matched. No remote advancement or unexpected RC changes were found.
- Latest Vercel deployment: `dpl_EUWWhGFffzfnpjue8Sd5E3mF9TtR`, `READY`, URL `https://sf-6-921ob4y5y-somas11620-9368.vercel.app/`, commit SHA matches RC.
- Vercel project `sf-6-dna` reports `live=false`; deployment target is Preview (`target=null`). No Production deployment/configuration was changed. Environment-variable assignment inventory is `NOT_VERIFIED`; no values were read.
- Branch contained the prepared, staged 2026-09-30 offline audit batch. It was retained and included in this batch; it contains preparation/audit tools and evidence, not database/publication writes. The internal guard patch remains unapplied.
- Production, `main`, `sf6dna-v2`, Ver.1.1, DB, migrations, dependencies, and lockfiles: unchanged. No device operation, game verification, motion recording, login, push, or deployment was performed during weekday QA.

## Task results

| Work item | Result | Evidence / remaining boundary |
|---|---|---|
| Character Detail horizontal overflow | **NOT RESOLVED; no fix** | Reused latest Local/Preview automated result: zero document overflow and horizontal movement across tested narrow widths and representative characters. Historical real-device failure remains P1. Inspected Character Detail CSS; horizontal combo/media/source rails are intentional scroll containers. No single offending element + rule + failure mechanism is established. |
| Drive Rush Combo label | **PASS / already in RC** | Confirmed `414ae701bc41e0b315d12fd2811d31eab0f97684` is included in current RC history. Combo Card maps `drive_rush` to `ドライブラッシュ使用`; Counter/Matchup/Strategy wording remains context-specific. Regression test passes. No DB values changed. READY/HOLD/game/publication states are unchanged. |
| Combo input icon pilot | **IMPLEMENTED, targeted tests PASS; user QA pending** | Restricted active icon rendering to Luke’s first five existing recipe IDs. Other recipes retain literal raw text; unknown and ambiguous strings are preserved. DR/CDR/DI states remain distinct; classic and Modern inputs are never inferred across schemes. JP/Ken and remaining characters are no longer active pilots. No gameplay validity claim is made. |
| External tool/site review | **REVIEW COMPLETE; no scope added** | Freshly reviewed frame search, SuperCombo, SF6 Data Lab, SF6 Lab beginner flow, SF6ComList, SF6 Training Tools, and SF6 Sensei. See recommendations below. No external text, UI, code, image, or icon was copied. |
| 31 Character Detail automated quality | **STATIC PASS; route-level visual audit reused** | Full suite still covers 31 shared detail routes and public-content boundaries. Prior Preview route/width/theme checks were reused because routing/layout/theme foundations were unchanged. No full new 31-route browser pass was run for this scoped renderer change. |
| Public Copy naturalization | **PARTIAL / NOT COMPLETE** | Existing public terminology and internal-copy boundary tests pass. No whole-site human Japanese naturalization was performed on this weekday batch. No game fact was edited. |
| Production readiness | **READ-ONLY PARTIAL** | Current RC/Preview state checked. Vercel project currently has no live Production deployment (`live=false`); listed project domains are Vercel domains. Production origin, secret/env assignment, rollback candidate, and end-to-end Auth redirect remain `NOT_VERIFIED`. Local build warned that `metadataBase` resolves to localhost when no site URL env is present in the local build environment; no domain was guessed or changed. |
| Evidence / weekend handoff | **RECORDED** | See checklist below. User Device, Auth/Save persistence and actual SF6 game verification remain pending. |

### Overflow blocker detail

Known source patterns such as `minmax(300px,1fr)` exist in a character Combo rail whose wrapper has `overflow-x:auto`; that alone does not explain document-level overflow. Automated page measurements do not reproduce the reported physical-device behavior. The exact blocker is missing failing-device evidence: device/model, OS and browser version, actual viewport and text/zoom settings, selected character/theme/mode, reproduction steps, and a screenshot/video or remote DOM measurement identifying the element whose right edge exceeds the viewport. The first runtime checks should capture `documentElement/body` widths and the top-level offending element’s bounding box/computed width, min/max width, margin, padding, transform, position, display, grid/flex, and white-space. No speculative CSS change was made.

### External research recommendations

| Feature idea | Classification | Finding / constraint |
|---|---|---|
| Compact frame-data search, row details, Punish Finder | `BACKLOG_1_0_X` | Filtering by character/move properties and linking punish candidates reduces repeated table scanning. Do not copy frame tables or their unique explanatory text; independently source/verify every data value. |
| Beginner learning path with an explicit next action | `ADOPT_FOR_V1_0` (existing navigation audit only) | SF6 Lab orders beginner lessons and then points to fighter, combo and frame resources. Preserve this generic cross-linking idea within existing pages; do not expand scope with a new curriculum today. |
| Direction/button input symbols | `PILOT_FOR_V1_0` | SF6ComList demonstrates a visual direction pad/button palette. SF6DNA’s own text-backed symbols stay limited to Luke first five pending user device approval. No competitor assets copied. |
| Damage calculator, pressure/oki calculator, combo finder | `BACKLOG_LATER` | These require verified move/condition data and validated formulas, so a feature-only imitation could create misleading output. |
| Character progress, training checklist, video chapter/tag filters, customizable tables, hitbox visuals | `BACKLOG_LATER` | Useful concepts, but not release closure. Video chapter metadata and hitbox visuals need rights/availability and sourcing review. |
| Scraped or license-unclear frame/combo data and copied images/icons | `DO_NOT_ADOPT` | Keep source and attribution conditions explicit; do not import data or assets until rights review and attribution requirements are satisfied. |

The reviewed sites are independent/community tools, not endorsements or authoritative gameplay validation. SF6 Sensei explicitly documents its data as CC-BY-SA-4.0-derived from SuperCombo; that license boundary is not suitable for unreviewed copying into SF6DNA.

## Verification

- Full web tests: **368 PASS**
- Release Gates: **14 PASS**
- Targeted renderer / Drive Rush / overflow tests: **24 PASS**
- Offline publication/source-preparation tests: **28 PASS** (Python) + **13 PASS** (Node)
- Typecheck: **PASS**
- Lint: **PASS**
- Build: **PASS** (local `metadataBase` warning explained above)
- Diff checks: run before integration; build-generated `next-env.d.ts` and `tsconfig.json` changes restored.
- Automated device/375px recheck against a new Preview after the pilot scope change: **NOT RUN**. No new Preview was created during this batch.

## Release decision

- P0: **0 observed**
- P1: **OPEN** — real-device Character Detail horizontal overflow (cause unknown); real Auth/Save/History flow; internal page guard approval/application; Source/publication approvals and Combo game verification; weekend device/game verification.
- P2: **OPEN** — remaining content polish, full source review and deferred feature concepts.
- Combo inventory from the prior fresh audit remains: **930 total; 548 READY_FOR_GAME_VERIFICATION; 382 HOLD; 0 GAME_VERIFIED; 0 PUBLICATION_APPROVED.** READY is not verification, and verification is not publication approval.
- Status: **NO-GO**. Workday static/browser automation does not replace weekend device QA, real Auth/Save, or game verification.

## Weekend user QA checklist

1. Reproduce the horizontal overflow on the original failing phone and a second phone if available. Capture device/browser/viewport/zoom, theme/mode, route, steps and evidence; record the first overflowing element before any CSS change.
2. Check Character Detail, Home, Diagnosis/result, Daily15, Characters, Players, Videos/Search, Sources, and Combo icon pilot in 375px light/dark and applicable themes. Inspect Japanese glyphs, wrapping, card height, tap targets, contrast, icon labels, and raw recipe fallback.
3. On real SF6, test Luke first five recipes only; confirm individual inputs/situations and retain each current verification state. No game verification should be inferred from the icon display.
4. With an authorized test account and user-authorized save, run Login → Diagnosis → Save → History → Reload → persistence → Logout; check duplicate-save and logout state. No live account or DB write was used for weekday verification.
5. Confirm device horizontal movement and Japanese font rendering. Record PASS/FAIL per route and condition rather than a single global assertion.

## Next single action

At the weekend, capture the original phone’s overflow runtime evidence first. That evidence is needed to identify the P1 root cause without guessing at layout CSS.

## External research links (checked 2026-10-01)

- Frame Data Search: https://frame-search.com/?lang=en-us
- SuperCombo SF6 Wiki: https://wiki.supercombo.gg/w/Street_Fighter_6
- SF6 Data Lab combo calculator: https://www.sf6-lab.com/combo
- SF6 Lab beginner path: https://sf6-lab.net/en/beginner
- SF6ComList (MIT; visual combo input UI): https://github.com/kirin0198/SF6ComList
- SF6 Training Tools: https://github.com/Wael3rd/SF6_Tools
- SF6 Sensei license / data provenance: https://github.com/RyoSogawa/sf6-sensei
