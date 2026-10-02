# Beginner Media Integration Result

Base SHA: `1aef8163dec6635a21b4ba0f588bf65aeeff2e08`

Verified media/code SHA: `1d5f6a491ebb9bb5ad2336fdb465e48a0cbbc8af`

Preview: https://sf-6-4m75hmiic-somas11620-9368.vercel.app — READY / exact SHA and branch match.

8 themes: INPUT_FOUND / TRIMMED / ENCODED / POSTER / MAPPED / BROWSER_PASS.

| ID | Clip | Source trim(s) | Duration(ms) | MP4 bytes | Poster bytes |
|---|---|---|---:|---:|---:|
| guard | beginner-guard.mp4 | 10.3–12.4 | 2100 | 462506 | 46302 |
| anti-air | beginner-anti-air.mp4 | 7.0–10.8 | 3800 | 1022410 | 33622 |
| impact | beginner-drive-impact.mp4 | 5.3–8.0 | 2700 | 971575 | 63110 |
| parry | beginner-drive-parry.mp4 | 6.2–8.6 | 2400 | 652835 | 42722 |
| rush | beginner-drive-rush.mp4 | 3.2–6.7 | 3500 | 1007312 | 44602 |
| cancel-rush | beginner-cancel-drive-rush.mp4 | 3.65–6.7 | 3067 | 890756 | 46770 |
| super | beginner-super-art.mp4 | 3.18–5.95 | 2767 | 1164544 | 46378 |
| combo | beginner-simple-combo.mp4 | 2.9–7.0 | 4100 | 911720 | 45122 |

H.264/yuv420p, 960×540, 30fps, faststart, no audio; WebP posters. Existing 12-step order, body copy, diagrams, CTA and media component unchanged. Ryu combo caption explicitly says it is not a recipe shared by all characters.

Existing player: controls, muted, loop, playsInline, preload="none", no autoplay. Reduced-motion users also play explicitly; no simultaneous automatic start. Missing/unknown media resolves to existing diagram-only fallback. Status remains approved_for_preview; Production does not render these clips under the existing publication policy. No public boundary promotion was performed.

Browser evidence: all eight native players readyState=4, 960×540 decode, expected durations, currentSrc/poster paths match theme. DI, DR and CDR are distinct files/actions. Desktop Dark/Light rendering checked; document-wide overflow false. Site-filtered Console errors/warnings: none observed. Browser extension metadata errors excluded from site errors. No Vercel runtime-log coverage claim.

375/390px actual viewport: USER_REQUIRED (resize API unavailable). Static responsive width/minmax/wrapping reviewed; no CSS changed. LCP/CLS and bandwidth totals not benchmarked. Initial videos remain unloaded until explicit play; assets are not bundled into JS. Critical performance regression: none observed within these checks.

Fresh checks on exact code/media tree: typecheck PASS; lint PASS; 459 tests PASS; 14 release gates PASS; build PASS; git diff --check PASS. Tests lock eight unique media mappings and hashes, preserve missing fallback and Preview-only behavior, and distinguish JP SA1/SA2 content hashes. Every processed MP4 decoded successfully with ffmpeg; every poster/file exists and is nonzero.

Hashes:

- `guard` MP4 `07f8a27083833eec23be86f11875b1da7d0c2e295ebb096023d0196077f92578`; poster `a18a97be0315806282ae6426d929cfbfc998225fca6d7680f14f3d37eca19cfb`.
- `anti-air` MP4 `d72dba13efcfdc93e91179875aac987ea746d381125d27f67c5cd354c5633a87`; poster `c011d3d9b08b90304dfd52a0905bff903871878c75c26da0cbc3342bfd82fab4`.
- `impact` MP4 `7a66bfd8dfcb4549cc891b6ac18b0bf5621ffb9f0dab070acf608385bb8b4d28`; poster `4618164c5cf2bfa4618745ef677af807998addd518f9dccaa6893ad3ae6badd4`.
- `parry` MP4 `7a5f1d982d0b15d795e9ffdbc779106118322bff7a72688622a5ef0724bc84f6`; poster `41d8418af7e6abb2ccab262c0b7308ad7f2980163edf2e900050cc1e97c804ef`.
- `rush` MP4 `68413e3b94a34958ee0d88305ea4cb79fe5e36131aa7018166a8a6bee66a10de`; poster `6d8960ded65ab33d1425a8cd8b7b5093f6585d6e4372e1890e93e5457804bcfa`.
- `cancel-rush` MP4 `22433b679a5d7b08c897d46680e328fd708adfe51e5e67b5f16ee68e586cf8ab`; poster `8f2a16f32e4054d478e33058b64b51bbb80283864414e9ff5c3412def4b234df`.
- `super` MP4 `80e1db9876ef84a6c858f2120849dd143914c85cf0173937fefd4a0885e64382`; poster `7dae7d0ebe846cea3f1d83917a186533dd67d114a3763360e4c7b67dbac57e61`.
- `combo` MP4 `b4876f9e5a310202a19ef2303ee6676a00cf4c61be0dac37c791abd41b19b793`; poster `0a418867e3d51ede2ddeafeaf9a66557f4e615c92f94207bf92f2cde1f56142b`.

Total shipped media: 9,213,388 bytes / 18 files (9 MP4 + 9 WebP, including JP SA2 replacements). No original captures shipped.
