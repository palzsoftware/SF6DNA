# Ver.1 JP Motion Media Preview QA — 2026-09-23

## Automated acceptance

- Manifest uniqueness, assets, posters, byte sizes: covered by `motion-media-pilot.test.mjs`.
- JP-only / Preview-only gate: covered by source contract assertions.
- Video flags and reduced-motion behavior: covered by source contract assertions.
- Full test, release gates, typecheck, lint, build, and diff check: record after execution.

## Device QA

Open the new Preview with the existing device-preview token, then JP → 技.

1. ギリオチーナ、シャーロスチ、前強K、グローム・ストレルカ、ジラント、ジラント・ミドル、ODアムネジアに動画が出る。
2. 動画が無音でループし、標準の操作バーが出ない。
3. 375pxでカード外へはみ出さない。
4. OSの「視差効果を減らす / モーションを減らす」有効時は自動再生されずPosterで止まる。
5. それ以外の技は従来どおり自然なno-media表示で、壊れた枠が出ない。

Status: `PENDING_NEW_PREVIEW_AND_DEVICE_QA`.
