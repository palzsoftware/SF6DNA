# Weekend Device QA Pack — Final

Target SHA / Previewは本バッチpush後にEvidenceへ確定する。Kakeru・如月れん・新relation候補はDB未反映なのでQA対象外。

## 最初の15分（P0）

1. Ryu / JPを375pxとdesktopで開き、横overflow、Hero文字、概要4項目、6 tabsを確認。
2. JPに「地面からの攻撃」「空中に置く技」がなく、具体的技名になっていることを確認。
3. `/players`で名前・alias・team・character・category検索、複数filter、chip解除、全clear、0件を確認。
4. `/videos`で新着/再生回数、検索Intent、外部遷移を確認。非公開・members-onlyが出ないことを確認。

## 認証・保存（P0）

- guest → diagnosis → Daily
- login → diagnosis保存 → reload → history反映
- favorite / watched / share
- logout後の保護状態
- callback/redirect先とruntime errorなし

## Character詳細（P1）

- 代表: Ryu / JP / A.K.I. / Zangief / Yasmine、その後31キャラ巡回
- 概要、技、コンボ、セットプレイ、連携・対策、動画、Source CTA
- long command wrap、section jump、sticky/footer被り、Related Player/Video

## Game Verification / GIF（別Evidence）

- Patch direct 29 claimsは既存8 sessionsをそのまま使用。
- Generic 85はclaim-level原票を先に取り込み、同条件だけをまとめる。
- GIFはRyu/JP既存packageを使用し、1080p/60fps原本、命名、poster、crop、圧縮を維持。

## Release smoke（最後）

- Contact実値（現状は準備中のためRelease blocker）
- Privacy / Terms / Disclaimer
- canonical / metadataBase
- Production候補domainとAuth redirect
- rollback target SHA

