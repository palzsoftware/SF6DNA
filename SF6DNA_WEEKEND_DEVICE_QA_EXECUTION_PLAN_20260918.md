# 9/19–9/23 実機QA実行計画

目的: ユーザー作業を `実機QA + GIF録画 + ゲーム検証` のみに限定する。調査、台帳化、取込判定、修正、EvidenceはWork側が担当する。

## Day 1 — P0導線（目安45–60分）

1. Ryu / JPを375pxとdesktopで確認: Hero、概要4項目、6 tabs、横overflow、文字切れ。
2. `/players`: 名前・alias・team・character・category検索、複数filter、解除、0件。
3. `/videos`: filter、並び順、Intent検索、share、外部遷移。
4. global search、diagnosis→Daily。
5. login→save→reload→history→logout。

停止条件: data loss、login loop、blank screen、P0 route 5xx。該当時は時刻・URL・操作・Screenshotだけ残してその導線を停止。

## Day 2 — Character問題経路 + 前半4 session + Ryu GIF（60–90分）

- Ryu / JP / A.K.I. / Zangief / Yasmineのtabs、section jump、command wrap、Source CTA、Related Player/Video。
- Game session 1–4を原票どおり実施。
- Ryu pilotを1080p/60fps原本で録画。編集・圧縮は不要。

## Day 3 — 後半4 session + JP GIF + Relation UI（60–90分）

- Game session 5–8。
- JP pilot録画。
- Player→Video、Character→Player/Videoの表示と遷移。

## Day 4 — 回帰・Release面（45–60分）

- 31 Character巡回は表示崩れ/5xx/旧templateの有無だけを短時間確認。
- Privacy / Terms / Disclaimer / Contact、404、console error。
- Auth/save/history/logoutを別sessionでもう一度確認。
- Production候補domain確定後のみcanonical/robots/sitemapを確認。

## Day 5 — Final RC（30–45分）

- 修正済み箇所だけ再確認。
- blocker一覧をPASS / FAIL / NOT_TESTABLEで確定。
- Production承認packetの対象SHA、rollback SHA、smoke順を承認。

## 提出形式

- QA: `PASS` または `FAIL + URL + 操作 + Screenshot`。
- Game: 既存session templateのresult enumを使用。
- GIF: 原本ファイル名にcharacter/move/takeを含める。Source contentの再配布素材は使用しない。

ユーザーは原因調査、CSV編集、DB判断、画像圧縮、コード修正を行わない。
