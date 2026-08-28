# SF6DNA Phase15 PC Device Test Checklist

最終更新: 2026-08-28 JST

状態: **自動browser検証済み / Actual PC確認待ち**

## 目的

Phase15 P15-04のうち、CI/Lighthouse/Chromium emulationでは証明できない**Actual PC browser Evidenceだけ**を取得する。

既に自動確認済みの項目をユーザーに重複実施させない。

## 自動確認済み — 再確認必須ではない

2026-08-28:
- Runtime Smoke runs `33140999720`, `33141087038`: success
- Lighthouse run `33141100694`: success
- Browser Acceptance run `33141327374`: success

自動確認内容:
- 主要Public Route HTTP 200
- 390x844 mobile emulationで主要画面のdocument-level horizontal overflowなし
- Searchで`JP`入力→結果遷移成功
- Character Fit Diagnosisを回答→Result到達
- 1440x900 desktopで最初のTab targetがSkip Link
- visible focus確認
- Lighthouse Accessibility 100（Top / Character detail）
- AI Coach Generation OFF

これらはActual PC確認ではないため、見た目・操作感だけ最終確認する。

---

## A. 実施環境

記録:
- 実施日:
- OS:
- Browser:
- Browser version:
- 画面解像度:
- Browser zoom:
- 確認URL / environment:

Previewまたは安全なローカル環境が成立していない場合は実施しない。Production公開で代替しない。

---

## B. Actual PC 最小チェック

以下だけを実際に操作する。

| ID | 対象 | 確認内容 | 結果 | メモ |
|---|---|---|---|---|
| PC-01 | Top | 初期表示に崩れ・長い白画面がない | 未実施 | |
| PC-02 | Character | 一覧→任意キャラ詳細。文字・Source・Tabに重なり/はみ出しがない | 未実施 | |
| PC-03 | Player/Video | 一覧→詳細を各1件。リンク・スクロールに異常がない | 未実施 | |
| PC-04 | Search | `JP`等を入力→結果を開く。入力/遷移に異常がない | 未実施 | |
| PC-05 | Diagnosis | 1診断を回答→結果まで。クリック・戻る・結果表示に異常がない | 未実施 | |
| PC-06 | Keyboard | TopからTab操作。focusが見え、主要リンク/フォームへ到達できる | 未実施 | |
| PC-07 | Narrow width | Browser幅を狭め、不要なページ全体横スクロールやボタン重なりがない | 未実施 | |
| PC-08 | Browser navigation | 詳細→戻るなど通常のBrowser Backで不自然な状態にならない | 未実施 | |
| PC-09 | Performance | Character/Search/Diagnosisで体感上Releaseを妨げる遅延がない | 未実施 | |
| PC-10 | Public Gate visual | `draft`や`reviewed`が確定済み情報のように見える明白な表示がない | 未実施 | |

目安:
- 重大な見た目崩れがなければ細部の全ページ再検査は不要。
- 自動テストで通っているため、Actual PCでは「人間が見て/操作して違和感がないか」を重視する。

---

## C. 問題がなかった場合の最短報告

次の形式だけでよい:

`PC実機: PC-01〜PC-10 PASS / Browser: ○○ / 解像度: ○○ / 異常なし`

個別に説明する必要はない。

## D. 不具合があった場合

次の4点だけ送る:
- ID
- Page
- 症状
- Screenshot（可能なら）

例:
`PC-02 / JP詳細 / Source欄が右にはみ出す / Screenshotあり`

---

## Acceptance判定

Actual PC部分は:
- PC-01〜PC-10にRelease blockerなし
- 発見した重大不具合は修正後に該当項目だけ再確認

で完了とする。

Chromium/Lighthouse emulationとActual PCはEvidence上分けて記録する。
