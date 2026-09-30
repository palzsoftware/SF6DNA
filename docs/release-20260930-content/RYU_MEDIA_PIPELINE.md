# Ryu Media Pipeline 2026-09-30

## Scope / measured result
- `RYU_MEDIA.zip` and new capture MP4s are absent from upload/project_sources. Existing tracked Ryu media were not treated as new captures or overwritten.
- Pipeline implemented: Python stdlib + existing /usr/bin/ffmpeg and /usr/bin/ffprobe, no dependency additions.
- 11 meaningful unit/integration tests PASS (`PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s scripts/tests -p 'test_ryu_media_pipeline.py' -v`). Synthetic testsrc fixture only; zero claims about game accuracy.
- Code: scripts/ryu-media-pipeline.py, scripts/tests/test_ryu_media_pipeline.py.
- Expected move list is provided by Ryu Template lane from fresh canonical data. The pipeline accepts any character slug and can be reused for later characters.

## Operations
```
python3 scripts/ryu-media-pipeline.py checklist EXPECTED.json /tmp/ryu-checklist.json
python3 scripts/ryu-media-pipeline.py intake /tmp/RYU_MEDIA.zip /tmp/ryu-capture /tmp/ryu-intake.json
python3 scripts/ryu-media-pipeline.py propose /tmp/ryu-capture/ryu_01_normals.mp4 /tmp/ryu-normal-boundaries.json
python3 scripts/ryu-media-pipeline.py render EXPECTED.json /tmp/ryu-reviewed-manifest.json /tmp/ryu-capture /tmp/ryu-webp-staging
```
Existing output files/directories are not overwritten. Original MP4s and transient cut work stay outside Git. ffmpeg consumes the reviewed start/end range directly without creating a duplicate intermediate MP4. Final WebP remains in staging; this tool never writes public assets, assigns IDs, writes DB, or declares game verification.

Expected format:
```
{"character":"ryu","moves":[{"move_id":"canonical UUID","move_slug":"canonical-slug","move_name":"canonical name","category":"NORMAL|UNIQUE|SPECIAL|SUPER|CA","order":1,"expected_file":"ryu_01_normals.mp4"}]}
```
Checklist preserves each expected category/name/order/expected_file, starts with `ORDER_NOT_VERIFIED` and `RECORDING_NOT_RECEIVED`; no user manual move list required. Reviewed manifest must exactly match IDs/slugs/names/categories/order/files. Each row additionally needs `start`, `end`, `source_sha256`, `order_reviewed:true`, `cut_reviewed:true`, `mapping_reviewed:true`. Hash comes from intake report and binds review to the exact recording. A changed recording invalidates review.

## Guardrails
- ZIP whole-directory prevalidation: paths/traversal/absolute/Windows-path forms, symlinks/special files, case-colliding entries, encryption, allowed extensions, entry count 256, per-file 2 GiB, total 8 GiB, high compression ratio, disk capacity. Stream copy verifies CRC and declared bytes; error removes the new partial extraction directory.
- Unknown or duplicate IDs/slugs, wrong names/category/order/file, overlapping time ranges, NaN/infinite/negative/overlong cuts reject.
- Probe limit: 4096px dimensions, <= 1 hour source; segment <=20sec. ffmpeg single-thread encoding, <=640px width, 15fps, quality75, no audio, <=20MiB per output, finite subprocess timeouts.
- Freezedetect runs at reduced 160px width and produces candidate boundaries with 0.3sec padding. Moving HUD/background can cause missing/false cuts. All proposals have null move_id and explicit REVIEW_REQUIRED. No move identity is inferred from video.
- WebP output report declares `NOT_BOUND_NOT_GAME_VERIFIED`, requiring human visual start/end/loop/readability review, then existing motion-media manifest validator / Preview targeted QA before integration. These reviewed preparation manifests are not the production motion-media schema.

## Current media status
```
INTAKE = WAITING_FOR_USER_ZIP
MANIFEST = CHECKLIST_FOUNDATION_READY / ORDER_NOT_VERIFIED
CUT = PROPOSAL_TOOL_READY / ACTUAL_RECORDING_PENDING
WEBP = ENCODER_FIXTURE_TESTED / ACTUAL_RECORDING_PENDING
MAPPING = VALIDATOR_FIXTURE_TESTED / ACTUAL_RECORDING_PENDING
BOUND_MOVE_COUNT = NOT_MEASURED
CAPACITY = ACTUAL_RECORDING_PENDING
DEVICE_PERFORMANCE = PENDING
```

## Upon ZIP arrival
1. Generate fresh checklist, intake/hash/probe all provided recordings.
2. Cross-check expected order against the actual recording or explicit confirmed checklist; do not infer identity or approve order.
3. Review freeze boundary proposals and identify missing/double/wrong moves explicitly with category/name/order/file/status.
4. Render staged WebP; review first/last frames, natural loops, command identity, missing/duplicate mappings.
5. Check expected/recorded/manifest/reviewed-cut/WebP/bound counts, sum sizes, individual sizes. Existing assets need an explicit reviewed mapping change; no implicit replacement.
6. Integrate only reviewed WebP and validated site manifest, then Ryu target Preview: initial load/request volume/layout shift/scroll/memory; Dark/Light375 readability and expanded-category checks. Real-device performance remains weekend QA.
