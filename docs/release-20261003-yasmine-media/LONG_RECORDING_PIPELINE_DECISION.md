# Long Recording Pipeline Decision

LONG_RECORDING_PIPELINE = NEEDS_ADJUSTMENT.

The six actual recordings are readable. Long-category capture → reviewed offsets → individual MP4/poster → manifest is usable for confidently identified actions. This is partial integration, not a 73/73 coverage claim. 26 identities are reviewed; 47 DB rows remain unassigned. No all-character automatic rollout is approved.

## Recording contract for subsequent characters

- Reuse the five-category filenames; split specials into specials1/specials2 when needed.
- Show the in-game move name and input history. Keep weak/medium/heavy/OD and prerequisite state distinguishable in the footage or add an accompanying timestamp/name list.
- For normals include standing, crouching and jumping attacks separately. Include complete target-combo stages and the required conditions for enhanced follow-ups.
- Leave about one second of neutral before and after each full action. Put reset/menu transitions between takes, not inside the action.
- Preserve fixed camera/dummy settings and readable HUD. Specify hit/whiff; throws use contact. Record SA3 and CA as distinct takes.
- 1440p HEVC/~60fps is acceptable input. Web output uses existing 640×360 H.264 60fps, yuv420p, faststart, silent + WebP poster. Do not upscale.

Inventory/probe/hash → candidate cut sheet → visual identity/variant review → encode derived outputs → decode/file/hash/manifest validation → Preview DOM/playback → device acceptance. Original files are never overwritten. Ambiguous captures are held, not assigned by order and not duplicated to fill coverage.

For these same recordings, obtain a move/strength timestamp clarification for unresolved special variants before requesting new footage. Only genuinely absent actions need additional capture. Detailed unresolved list is in YASMINE_MOVE_MEDIA_MAPPING.csv.

Desktop enlargement applies to the shared media-bearing Move Card; rows without media and ≤760px layout are preserved. Production uses its existing public gate; these local pilot identities have no verified frame data and are Preview-only.
