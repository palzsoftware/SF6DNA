# SF6DNA v2 検証済み攻略データ投入ルール

更新日: 2026-08-26

## 目的

Move / Frame / Command / Combo / Setup / Sequence / Counter / Training を大量投入するときも、コードやAIの推測で事実を補完せず、Patch・Source・検証状態を追跡できる状態を維持する。

## 必須原則

1. キャラクター名や技名ではなくDB ID / slugで関連付ける。
2. 現行Patchを明示する。
3. フレーム・ダメージ・コマンド等の客観情報はSourceを必須とする。
4. 確認できない値は `null` / 未入力とし、推測値を入れない。
5. Import直後は原則 `draft`。
6. 公開前にSource・Patch・整合性を確認して `published` にする。
7. 旧静的JSデータは「候補値」であり、Source照合なしでは公開データへ昇格させない。
8. パッチ変更時は旧行を上書きして履歴を消さず、有効期間で管理する。

## Source優先度

推奨順:
1. CAPCOM公式バトル変更 / 公式フレーム・コマンド情報
2. SF6DNA側で再現可能なトレーニングモード検証
3. 信頼できる一次動画・上位プレイヤー解説
4. 二次攻略記事

Sourceには最低限 `title / url / source_type / publisher / published_at / reliability_level` を持たせる。

## Move / Frame / Command投入単位

1技について最低限:
- character_slug
- move_slug
- name_ja
- move_type
- Classic / Modern command（存在する側）
- startup / active / recovery / on_hit / on_block（確認可能な項目）
- damage（確認可能なら）
- valid_from_patch
- source_url
- verification_status

同名技の弱中強/OD等は、検索・フレーム・コマンド差がある場合に独立Moveまたはvariantとして明確に区別する。

## Combo / Setup / Sequence

客観値と攻略評価を分離する。

Combo:
- notation
- starter
- damage
- Drive / SA cost
- position
- conditions
- Patch
- Source / own verification

Setup:
- starter_condition
- sequence_text
- frame_advantage（確認できる場合）
- position
- meter_condition

Sequence:
- sequence_text
- true blockstringか
- mash point
- throw / shimmy
- jump / parry / D-reversal / invincible option

「割り込める」「確定」等の断定はフレームまたは再現検証がある場合のみ公開する。

## Counter / Training

Counterは「対象」と「回答」を分離して保存する。
- opponent character / move / sequence / situation
- defender character（キャラ固有なら）
- method
- conditions
- benefit
- risk
- difficulty
- Source / verification

Trainingは再現できる手順を優先する。
- own character
- dummy character
- recording
- playback
- method
- success criteria
- reps
- linked Counter / Move / Sequence

## Import手順

1. Source登録
2. Patch確認
3. Character slug解決
4. Import用データを作成
5. 必須フィールド / slug重複を検証
6. `draft` で投入
7. Source Relation作成
8. 検証
9. `published` へ変更
10. Search / Character page / AI Coach Evidenceで疎通確認

## AI利用ルール

AIは以下には使用可能:
- Source文章から候補フィールドを抽出
- 表記正規化候補
- 既存データとの差分候補抽出
- CSV/JSON整形

AIだけで確定してはいけないもの:
- 未確認フレーム
- 確反
- true blockstring
- 無敵時間
- ヒット/ガード有利不利
- コンボ成立条件
- キャラ固有の確定対策

これらはSourceまたは再現検証後に公開する。

## 現在のDB投入状況

2026-08-26時点:
- Patch: 1
- Source: 7
- Character: 34（31 playable published + 3 future draft）
- Move / Frame / Combo / Setup / Sequence / Counter / Training: 0
- Diagnosis: 1（12 questions / 48 options）

従って、次の大規模工程は「UI追加」ではなく検証済み攻略データの投入が中心となる。
