# Ver.1 JP Media Encoding Report — 2026-09-23

## Encoding contract

- Output: H.264 MP4, 640×360, 60fps, yuv420p, no audio, fast-start metadata. The 720p first pass was reviewed, then reduced for the compact 375px UI and repository/Preview transfer budget.
- Encoder: `libx264`, preset `medium`, CRF 30 (OD Amnesia: CRF 32).
- Poster: WebP, quality 78, captured from each optimized clip.
- UI: muted inline loop; `preload="none"`; native controls removed; reduced-motion pauses at the poster frame.

| Clip | Duration | MP4 bytes |
|---|---:|---:|
| jp-guillotine | 2.217s | 94,994 |
| jp-shalosti | 2.217s | 89,990 |
| jp-forward-hk | 2.317s | 111,466 |
| jp-grom-strelka | 5.500s | 293,949 |
| jp-zilant | 3.717s | 248,072 |
| jp-zilant-mid | 5.600s | 342,092 |
| jp-amnesia-od-counter | 8.217s | 616,075 |

MP4 total: **1,796,638 bytes**. Posters total: **322,378 bytes** (each 34–51KB); the complete asset directory is about 2.12MB. Long source masters totaling about 871MB are not committed.
