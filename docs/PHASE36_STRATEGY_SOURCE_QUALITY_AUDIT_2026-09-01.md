# Phase 36 — Strategy Source Quality Audit (2026-09-01)

## Scope

撮影を必要としない次工程として、31キャラのActive Combo / Setup / Sequence 2,480件と対応TrainingのSource品質を監査した。

## Finding

- Active StrategyのSource欠損: 0
- Sourceが1件のみのActive Strategy: 1,074
- キャラ別公式変更ページが未接続のActive Strategy: 1,132
- 上記1,132件に対応し、同じ公式ページが未接続のTraining: 1,132

公式ページの自動特定をキャラ名の部分一致で行うと、「エド」と「エドモンド本田」のような誤対応が起こり得る。このため、31キャラのslugとCAPCOM公式URL末尾を明示対応し、完全一致URLだけを採用した。

## Change

`20260901070756_phase36_strategy_patch_context_backfill.sql`で、現在の2026.08.03パッチに属するActive Strategyと対応Trainingへ、各キャラの公式変更ページを追加する。

- relationship: `patch_context`
- 既存Source関係: 上書きしない
- Combo / Setup / Sequenceのstatus・verification_status: 変更しない
- Trainingのstatus・verification_status: 変更しない
- publishedへの昇格: 行わない

この公式ページは「その項目が現行パッチを前提としている」ことを追跡するためのSourceであり、レシピの成立を証明するSourceではない。成立確認は引き続き文言・画像Sourceの追加監査、または後日の実機撮影で行う。

## Follow-up

追加後もSourceが1件のみのActive Strategyを抽出し、以下へ分類する。

1. レシピを直接記載した文言・画像Sourceを追加できる
2. 公式フレーム／変更情報から条件だけ確認できる
3. 文言・画像では断定できず、実機撮影待ちを維持する

推測によるSource追加、verified化、published化は行わない。

## Phase 37 repair

残存29件を登録元マイグレーションまで追跡した結果、A.K.I. 9件とラシード9件は、収集時の一時表に文章Source URLが記録されていた一方、そのURLが`sources`へ作成されておらず、`entity_sources`登録が空振りしていた。

9ページの本文と該当記載を再確認し、`20260901070758_phase37_repair_missing_written_source_links.sql`で次を修復する。

- Source: 9件
- Strategy relationship: 18件
- 対応Training relationship: 18件
- status / verification_status / published: 変更なし

残る11件は、元登録時点から公式変更ページだけを直接根拠として作られた変更点固有の候補であり、存在しない第2Sourceを補わない。別の文章・画像資料を確認できるまで、撮影待ちかつ未確認を維持する。

| Character | Type | Item | Reason for retaining one Source |
|---|---|---|---|
| Dee Jay | Setup | 弱ジャック移動調整 | 2026変更後の移動量確認そのものが対象 |
| Dee Jay | Sequence | 弱ジャック位置分岐 | 2026変更後の位置分岐確認 |
| Dee Jay | Sequence | 弱攻撃刻み現行確認 | 2026変更後のヒットバック確認 |
| JP | Sequence | 5HKガード+2後の近距離択 | 公式変更値から作った防御分岐候補 |
| JP | Sequence | ODアムネジア後の防御判断 | 公式変更後の選択肢確認 |
| Lily | Sequence | 2026弱ウインド短押し長押し | 新しい短押し／長押し仕様の確認 |
| Manon | Combo | 弱Kカウンター弱ランヴェルセ | 公式変更で追加された接続候補 |
| Manon | Combo | トモエPC SA1 | 公式変更で追加されたSA接続候補 |
| Manon | Combo | トモエPC SA2 | 公式変更で追加されたSA接続候補 |
| Manon | Setup | 中デガジェ弱コマ投げ | 持続変更後の間合い・タイミング確認 |
| Manon | Sequence | BO中グランフェッテ択 | 公式硬直差とBO補正から作った候補 |

## Post-repair result

- Active Strategy: 2,480
- Source欠損: 0
- Source 2件以上: 2,469
- Source 1件のみ: 11
- 31キャラ公式変更ページ接続: 2,480 / 2,480
- published: 0
- verified: 1（既存値。今回変更なし）
