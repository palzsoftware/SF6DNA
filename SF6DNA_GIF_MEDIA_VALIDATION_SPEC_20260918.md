# Motion Media Validation Specification

| Gate | PASS条件 |
|---|---|
| ownership | `source_owner=user_capture`、第三者素材なし |
| integrity | 原本SHA256記録、破損なし |
| mapping | Character slug、Move ID/slug、category/variantがRCデータと一致 |
| cut | 入力前後の不要時間を除去し、技の始動・終了を欠損しない |
| loop | 不自然な黒frame/瞬間移動/音切れなし |
| poster | 静止画で技を誤認させず、動画未再生時もlayout維持 |
| format | PilotでGIF/WebP/MP4を実測比較。見た目だけで決めない |
| mobile | 375pxで横overflow、切れ、重なりなし |
| motion | reduced-motion時はposterまたは非アニメfallback |
| loading | below-foldはlazy/preload none、初期表示を妨げない |
| failure | broken URL/no mediaでもcard本文と操作を維持 |
| game fact | 録画一致だけでdamage/frame/setupをverifiedにしない |
| preview | Ryu/JP Previewでconsole/runtime errorなし |

各clipは`PASS`, `RETAKE`, `REMAPPING_REQUIRED`, `GAME_VERIFICATION_REQUIRED`, `RIGHTS_BLOCKED`のいずれかで判定する。
