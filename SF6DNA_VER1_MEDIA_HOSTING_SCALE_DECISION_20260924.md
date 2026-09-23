# SF6DNA Ver.1 Media Hosting / Scale Decision — 2026-09-24

## Decision

**B. PILOT_ONLY_REPO / BULK_STORAGE_RECOMMENDED**

The existing JP Pilot may remain repository-local for protected Preview verification. Do **not** use repository-local binary assets as the default rollout model for all 31 characters until a separate bulk-media storage/CDN contract is approved.

This is **not** a Ver.1.0 release blocker. Motion Media stays optional and Preview-only unless its remaining device QA and mapping/cut review are completed.

## Fresh baseline

- RC branch: `sf6dna-v2-chatgpt-rc-20260916`
- RC HEAD at audit start: `36dedff0563789c9d6db7f2194d7d4ac50b06e24`
- JP media code deployment SHA: `fc59b4a428f37ff7c5ddc4a4fc7a84b93db10cfa`
- Vercel deployment: `dpl_FDPAjFv9auqGCgit9AkEsQM3iZGY` / `READY`
- Pilot media: 7 MP4 + 7 WebP posters
- MP4 total: `1,796,638 bytes`
- Poster total: `322,378 bytes`
- Complete JP Pilot assets: about `2.12 MB`
- Long source masters: about `871 MB`; correctly excluded from the repository

Current delivery contract remains 640×360 / 60fps H.264 MP4, no audio, fast-start, WebP poster, `preload="none"`, muted/loop/playsInline, reduced-motion pause/reset.

## 31-character scale estimate

The only measured baseline is the current 7-clip JP Pilot. Its average complete asset cost is about `302.7 KB/clip` including poster. The table below is therefore a **pilot-derived capacity estimate**, not a forecast of final content volume.

| Scenario | Average media / character | Total clips | Pilot-derived total |
|---|---:|---:|---:|
| LOW | 5 | 155 | ~46.9 MB |
| EXPECTED | 15 | 465 | ~140.8 MB |
| HIGH | 30 | 930 | ~281.5 MB |

Important limitations:

- The JP Pilot has no representative Super Art set, so long cinematic clips can increase the average.
- Ryu has not yet been integrated into this measured baseline.
- Revisions matter: Git retains committed binary history even when a clip is later replaced, so repository growth can exceed the currently served asset size.
- Initial route payload is not equal to the full asset total because videos use `preload="none"`; however, browsing many move rows still creates CDN/storage traffic and repository/deployment churn.

## Why repository-local is acceptable for Pilot but not the default scale target

### Pilot

Repository-local assets are currently useful because they:

- keep the Preview self-contained;
- avoid introducing a new production storage contract before release;
- are only about 2.12 MB for the current 7-clip set;
- have already passed Work-side Preview playback/runtime checks.

### 31-character rollout

Using Git as the long-term media store has avoidable costs:

- binary revisions permanently increase Git history;
- large batches make clone/fetch, connector transfer, commit/push and Preview deployment slower;
- replacing clips for cut quality fixes (for example removing spacing walks) repeatedly grows history;
- source masters must never be committed, so a separate source/working-media path is required anyway.

Therefore the recommended architecture is:

```text
Source masters (external / working storage, never Git)
    ↓
Cut + encode pipeline
    ↓
Validated MP4 + poster
    ↓
Bulk object storage / CDN for scaled rollout
    ↓
Manifest stores stable media URL + metadata
    ↓
SF6DNA Character Detail
```

No storage provider is selected or provisioned by this decision. That would be a separate approved change.

## Release boundary

For Ver.1.0:

```text
JP_MEDIA = PREVIEW_ONLY
RYU_MEDIA = HOLD_SOURCE_TRANSFER / TEMPLATE_TARGET
OTHER_29 = VIDEO_WAITING / TEMPLATE_TARGET
PRODUCTION_MEDIA_CHANGE = NO
DB_MEDIA_WRITE = NO
```

Reasons JP remains Preview-only at this point:

1. User device QA for 375px and reduced-motion remains pending.
2. The user has reported that some clips include unwanted forward/backward walking used for spacing; cut review is therefore still required before Production inclusion.
3. The current 7 mappings are a Pilot, while normals/general specials/super-arts remain `MAPPING_HOLD` in the repository evidence.

The motion-media feature must not delay the 2026-09-26 Ver.1.0 release.

## Required rollout gates before character-scale expansion

A character may move from `VIDEO_WAITING` to integrated Preview only when all applicable gates pass:

1. `SOURCE_AUDIT_PASS` — hash / duration / resolution / fps / ownership recorded.
2. `CUT_REVIEW_PASS` — clip excludes unrelated walking, menu transitions and excessive idle time.
3. `MOVE_MAPPING_PASS` — Move ID/slug/name mapping is explicit; uncertain mappings stay `MAPPING_HOLD`.
4. `ENCODE_PASS` — MP4/poster comply with the approved delivery profile.
5. `VALIDATION_PASS` — files exist, sizes match manifest, no duplicate move/variant, no missing poster.
6. `PREVIEW_QA_PASS` — playback, mobile layout, no-media fallback and reduced-motion checked.
7. `HOSTING_READY` — bulk storage/CDN approved before broad 31-character production rollout.

## Next ChatGPT-only work

1. Build a reusable media validation helper against the existing manifest contract.
2. Build/generate a Move mapping worksheet/template that can be reused for Ryu and the remaining 29 characters.
3. Document a Ryu source-transfer path that avoids re-sending large masters through an unreliable long Work session.
4. Keep the current JP assets unchanged until the clip-cut review can specifically address unwanted spacing walks; do not perform a blind all-file re-encode.

## Safety / change record

- DB changed: **NO**
- Production changed: **NO**
- `main` changed: **NO**
- `sf6dna-v2` changed: **NO**
- Ver.1.1 changed: **NO**
- Source masters added to Git: **NO**
