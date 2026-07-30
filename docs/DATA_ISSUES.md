# DATA_ISSUES.md

character-data.jsが参照している選手ID(pros/streamers/vtubers/youtubers)のうち、
実際の選手データファイル(pro.js/streamer.js/vtuber.js/youtuber.js)に存在しないものを一覧化したドキュメントです。

**このファイルに記載された項目は、まだコードを修正していません。** 判断が必要なもの、または新規登録が必要なものです。

このドキュメントは `node scripts/check-data-integrity.js` の実行結果をもとに更新してください。新しく選手データを追加した際や、character-data.jsを編集した際は、このスクリプトを再実行し、本ドキュメントの内容を最新化することを推奨します。

最終更新時点の検出結果: 参照切れ 20件 / ID重複 1件(2026年7月時点)

---

## ② 判断が必要なもの(候補IDあり)

候補となるIDは存在するものの、別人の可能性を否定できないため、コードは修正していません。

| 参照元キャラクター | 現在のID | 候補ID | 理由 | 対応状況 |
|---|---|---|---|---|
| ザンギエフ(zangief) | junior | jr(pro.js内に実在、name:"Jr.") | 「Noble→noble」のような表記ゆれとは異なり、文字列として全く別のIDである。同一人物が略称で登録されている可能性はあるが、別人の可能性も否定できず、100%同一人物と判断できる根拠が無い | 未確認 |

---

## ③ 未登録データ(参照先IDが存在しない)

以下19件は、`pro.js`・`streamer.js`・`vtuber.js`のいずれにも該当するIDが見つかりませんでした。表記ミスではなく、**単純に選手データベースへの登録が漏れている可能性が高い**と考えられます(特に`streamer.js`は5件、`vtuber.js`は15件しか登録が無く、登録数自体が少ないため)。

| 参照元キャラクター | 現在のID | 候補ID | 理由 | 対応状況 |
|---|---|---|---|---|
| ルーク(luke) | yoshinama | なし | streamer.jsに該当ID無し | 未確認 |
| ジェイミー(jamie) | tantanmen | なし | pro.jsに該当ID無し | 未確認 |
| ジェイミー(jamie) | uryo | なし | pro.jsに該当ID無し | 未確認 |
| ジェイミー(jamie) | naruo | なし | streamer.jsに該当ID無し | 未確認 |
| ジェイミー(jamie) | kaminariqpi | なし | vtuber.jsに該当ID無し | 未確認 |
| キンバリー(kimberly) | tako | なし | pro.jsに該当ID無し | 未確認 |
| キンバリー(kimberly) | suzukinoriaki | なし | streamer.jsに該当ID無し | 未確認 |
| マノン(manon) | saikiittetsu | なし | vtuber.jsに該当ID無し | 未確認 |
| ザンギエフ(zangief) | tensihn | なし | vtuber.jsに該当ID無し | 未確認 |
| ディージェイ(deejay) | ohsuakira | なし | streamer.jsに該当ID無し | 未確認 |
| キャミィ(cammy) | sorahoshikirame | なし | vtuber.jsに該当ID無し | 未確認 |
| キャミィ(cammy) | uchiwa | なし | vtuber.jsに該当ID無し | 未確認 |
| ジュリ(juri) | betty | なし | streamer.jsに該当ID無し | 未確認 |
| ジュリ(juri) | ibrahim | なし | vtuber.jsに該当ID無し | 未確認 |
| ジュリ(juri) | amakipururu | なし | vtuber.jsに該当ID無し | 未確認 |
| ダルシム(dhalsim) | kibakibaru | なし | vtuber.jsに該当ID無し | 未確認 |
| ダルシム(dhalsim) | hoshino | なし | vtuber.jsに該当ID無し | 未確認 |
| A.K.I.(aki) | yukikiriyuki | なし | vtuber.jsに該当ID無し | 未確認 |
| C.ヴァイパー(cviper) | inaba | なし | pro.jsに該当ID無し | 未確認 |

**対応状況の選択肢について**:
- `未確認` — まだ方針を決めていない(初期状態)
- `保留` — 対応しないと決めた、または当面は様子見と決めた
- `追加予定` — 選手データベースへの新規登録を予定している

このドキュメントを更新する際は、上記いずれかに書き換えてください。

---

## その他の既知の不整合(参考)

character-data.jsからの参照切れとは別の問題として、`pro.js`内で以下のIDが重複して定義されています。JavaScriptのオブジェクトリテラルの仕様上、後に書かれた方でデータが上書きされるため、片方のデータが実質的に無効化されています。

| ファイル | 重複ID | 対応状況 |
|---|---|---|
| assets/js/pro.js | itabashizangief | 未確認 |

---

## 関連ドキュメント

- [scripts/check-data-integrity.js](../scripts/check-data-integrity.js) — このドキュメントの元になっている自動チェックスクリプト
- [TECH_DEBT.md](./TECH_DEBT.md) — その他の技術的負債の一覧
