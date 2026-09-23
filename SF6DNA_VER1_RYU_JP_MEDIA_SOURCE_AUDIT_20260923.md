# Ver.1 Ryu / JP Media Source Audit — 2026-09-23

## Scope decision

- Ryu: `USER_DEFERRED`. The user explicitly skipped Ryu because of source volume. No Ryu file was copied, encoded, mapped, or integrated.
- JP: five user-captured masters were audited read-only. Source ownership is `user_capture`.
- Database: read-only canonical Move lookup only. No database write.

| Source | SHA256 | Duration | Codec | Resolution / FPS | Audio | Result |
|---|---|---:|---|---|---|---|
| `jp_normals_20260923_take01.mp4` | `334ce6ec…dd135` | 39.801s | HEVC | 2560×1440 / ~60 | AAC 48k stereo | MAPPING_HOLD |
| `jp_unique_attacks_20260923_take01.mp4` | `3347bc48…c45b5` | 41.345s | HEVC | 2560×1440 / ~60 | AAC 48k stereo | 6 clips mapped |
| `jp_specials_20260923_take01.mp4` | `5b6f89ad…bb554` | 46.688s | HEVC | 2560×1440 / ~60 | AAC 48k stereo | MAPPING_HOLD |
| `jp_super_arts_20260923_take01.mp4` | `2dd6282d…fb769` | 170.028s | HEVC | 2560×1440 / ~60 | AAC 48k stereo | MAPPING_HOLD |
| `jp_amnesia_counter_20260923_take01.mp4` | `0f263197…c85e` | 12.523s | HEVC | 2560×1440 / ~60 | AAC 48k stereo | OD Amnesia counter mapped |

Full hashes are recorded in the manifest. Masters remain outside the repository; only optimized derivatives are committed.
