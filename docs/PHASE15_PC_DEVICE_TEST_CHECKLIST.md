# SF6DNA Phase15 PC Device Test Checklist

最終更新: 2026-08-28 JST

状態: **実機確認待ち**

## 目的

Phase15 P15-04 `Device / Responsive / Accessibility Runtime Verification` のPC実機Evidenceを取得する。

Phase14でStatic responsive/accessibility reviewは完了済み。本書ではユーザーが自宅PCから実際に操作した結果だけを記録する。

重要:
- 未実施項目をPASSにしない。
- 見た目の違和感だけでもFAIL候補として記録する。
- 不具合があればスクリーンショットを保存し、ページ名と症状を添える。
- Previewが未成立の場合、ローカルまたは安全な確認環境を使用できる場合のみ実施する。Production公開はしない。

---

## A. 基本環境

記録項目:
- 実施日:
- OS:
- Browser:
- Browser version:
- 画面解像度:
- Browser zoom:
- 確認URL / environment:

---

## B. Public Route Smoke

各項目を `PASS / FAIL / BLOCKED` で記録する。

| ID | 対象 | 確認内容 | 結果 | メモ |
|---|---|---|---|---|
| PC-01 | Top | 初期表示、主要導線、レイアウト | 未実施 | |
| PC-02 | Character list | 一覧表示、カード、スクロール、リンク | 未実施 | |
| PC-03 | Character detail | Header、各Section、Source/Patch/Verification表示 | 未実施 | |
| PC-04 | Player list | 一覧、リンク、overflow | 未実施 | |
| PC-05 | Player detail | 詳細表示、関連導線 | 未実施 | |
| PC-06 | Video list/detail | 一覧・詳細・外部動画導線 | 未実施 | |
| PC-07 | Search | 入力、結果、0件、安全な表示 | 未実施 | |
| PC-08 | Diagnosis | 4種の入口表示 | 未実施 | |
| PC-09 | Diagnosis flow | 1診断を開始→回答→結果まで | 未実施 | |
| PC-10 | Progress/Data Quality | 公開経路がある場合の表示 | 未実施 | |
| PC-11 | AI Coach Retrieval | safe behavior / Evidence不足時の挙動 | 未実施 | |

---

## C. Responsive / Layout

| ID | 確認内容 | 結果 | メモ |
|---|---|---|---|
| PC-R01 | 不要な横スクロールが発生しない | 未実施 | |
| PC-R02 | テキストがカード・画面外へはみ出さない | 未実施 | |
| PC-R03 | ボタン・リンクが重ならない | 未実施 | |
| PC-R04 | 長いSource/Patch/Command表示で崩れない | 未実施 | |
| PC-R05 | Browser幅を狭めても主要操作が可能 | 未実施 | |
| PC-R06 | Browser幅を広げても極端な空白/崩れがない | 未実施 | |

推奨追加確認幅:
- 約1280px
- 約1024px
- 約768px
- 約390px相当（PC Browser DevToolsでも可。ただしActual mobile deviceとは区別する）

---

## D. Keyboard / Accessibility Runtime

| ID | 確認内容 | 結果 | メモ |
|---|---|---|---|
| PC-A01 | Tabで主要Link/Button/Formへ到達できる | 未実施 | |
| PC-A02 | Focus位置を視認できる | 未実施 | |
| PC-A03 | Enter/Spaceで対象操作ができる | 未実施 | |
| PC-A04 | InputへLabel/意味が伝わる | 未実施 | |
| PC-A05 | Modal/Dialogがある場合、keyboard操作可能 | 未実施 | |
| PC-A06 | Modal/Dialog終了後のFocus復帰に問題がない | 未実施 | |
| PC-A07 | 色だけに依存して重要状態を表現していない | 未実施 | |

---

## E. Public Data Gate Runtime

次を実画面で確認する。

| ID | 確認内容 | 結果 | メモ |
|---|---|---|---|
| PC-G01 | draftを公開済み情報として表示しない | 未実施 | |
| PC-G02 | reviewedをverifiedとして表示しない | 未実施 | |
| PC-G03 | verified Source EvidenceがないStrategyを断定表示しない | 未実施 | |
| PC-G04 | 公開データ不足時はsafe empty stateになる | 未実施 | |
| PC-G05 | Modern Command欠損を推測値で埋めない | 未実施 | |
| PC-G06 | AI CoachがEvidence不足時に捏造回答しない | 未実施 | |

---

## F. 体感Performance

これはLighthouseの代替ではなく、P15-03用の実機補助Evidence。

| ID | 確認内容 | 結果 | メモ |
|---|---|---|---|
| PC-P01 | Top初回表示で長時間の白画面がない | 未実施 | |
| PC-P02 | Character list/detail遷移が実用上遅すぎない | 未実施 | |
| PC-P03 | Search入力・結果表示に大きな引っ掛かりがない | 未実施 | |
| PC-P04 | Diagnosis回答操作に顕著な遅延がない | 未実施 | |
| PC-P05 | 画像・動画部分がページ操作を阻害しない | 未実施 | |

---

## G. 不具合報告テンプレート

不具合があった場合は以下だけでよい。

- ID:
- Page:
- 操作:
- 症状:
- 再現性: 毎回 / 時々 / 1回のみ
- Screenshot: あり / なし

例:

`PC-R01 / Character Detail / JPを開いて下へスクロール / Source欄が右へはみ出す / 毎回 / Screenshotあり`

---

## Acceptance判定

P15-04 PC実機部分を完了とできる条件:
- PC-01〜PC-11のうち環境上対象となる主要Routeを確認
- PC-R01〜R06でRelease blocking layout issueなし
- PC-A01〜A07で重大keyboard/accessibility blockerなし
- PC-G01〜G06でPublic Gate破りなし
- 発見した重大不具合は修正・再確認済み、または明示的にRelease blockerとして残す

Actual smartphone/tablet確認をPC DevToolsだけで代替完了扱いしない。
