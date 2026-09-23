# Ver.1 JP Motion Media Preview QA — 2026-09-23

## Automated acceptance

- Manifest uniqueness, assets, posters, byte sizes: covered by `motion-media-pilot.test.mjs`.
- JP-only / Preview-only gate: covered by source contract assertions.
- Video flags and reduced-motion behavior: covered by source contract assertions.
- Full test, release gates, typecheck, lint, build, and diff check: record after execution.

## Work-side Preview browser result

- Deployment: `dpl_FDPAjFv9auqGCgit9AkEsQM3iZGY` / READY.
- Preview SHA: `fc59b4a428f37ff7c5ddc4a4fc7a84b93db10cfa` (code verification deployment).
- `/characters/jp`: HTTP 200; 7 `<video>` elements rendered.
- Mapping labels: ギリオチーナ、シャーロスチ、前強K、グローム・ストレルカ、ジラント、ジラント・ミドル、ODアムネジア — all present.
- Playback: 7/7 `readyState=4`, playing, muted, loop, native controls absent.
- Desktop viewport: 1363px; document client/scroll width both 1348px, no horizontal overflow.
- Page runtime errors: 0. A browser-extension-only metadata error was excluded from the page result.

## Device QA

Open the new Preview with the existing device-preview token, then JP → 技.

1. ギリオチーナ、シャーロスチ、前強K、グローム・ストレルカ、ジラント、ジラント・ミドル、ODアムネジアに動画が出る。
2. 動画が無音でループし、標準の操作バーが出ない。
3. 375pxでカード外へはみ出さない。
4. OSの「視差効果を減らす / モーションを減らす」有効時は自動再生されずPosterで止まる。
5. それ以外の技は従来どおり自然なno-media表示で、壊れた枠が出ない。

Status: `WORK_BROWSER_PASS / PENDING_375PX_AND_REDUCED_MOTION_DEVICE_QA`.
