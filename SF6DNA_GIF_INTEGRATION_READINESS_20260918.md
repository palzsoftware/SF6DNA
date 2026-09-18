# GIF Integration Readiness

判定: `READY_FOR_CAPTURE_AND_INGEST`。メディア自体は未受領・未公開。

| 確認 | 状態 |
|---|---|
| media slot | `MoveMotionMedia` / combo card経路あり |
| naming | character + move/combo + take + revisionで一意化可能 |
| poster | video poster経路あり。先頭フレーム固定可能 |
| lazy load | 既存media component経路で対応 |
| reduced motion | reduced-motion CSS/静止poster fallbackあり |
| mobile sizing | container内縮小、固定横幅を要求しない |
| no-media fallback | mediaなしでも本文/cardを維持 |
| publication | Source/rights/game verification review後のみ |

受領後は原本hash→trim/crop→poster→軽量format→375/desktop確認→claim紐付け→reviewの順。録画だけでverified/publishedへ自動昇格しない。
