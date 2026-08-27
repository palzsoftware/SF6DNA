# Phase13 JP Move / Frame 59→49 対応監査

更新日: 2026-08-27
対象ブランチ: `sf6dna-v2`
対象DB: Supabase `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)
基準パッチ: `2026.08.03` 以降

## 目的

CAPCOM公式JPフレーム表のキャラ固有59行と、Supabase実DBのJP Move/Frame 49件を対応付け、単純な「10件欠落」ではなく、統合・命名・粒度差・実欠落を分離する。

この監査が完了するまでDB変更は行わない。

## 監査ルール

- 推測値を登録しない。
- `reviewed` は `verified` ではない。
- 公式一次情報または実機確認がない値は `verified` にしない。
- 公式行とDB行の粒度が違う場合、件数だけで欠落判定しない。
- Source / Patch / 確認日 / 条件 / 画面位置 / ゲージ / 再現結果を後続修正時に保持する。

## 結論

59行と49件の差10件は、現時点では次の内訳で説明できる。

| 原因 | DB増分換算 | 内容 |
|---|---:|---|
| 通常トリグラフ3強度を1件に統合 | +2 | 弱/中/強を分離すると3件 |
| ODトリグラフ3入力を1件に統合 | +2 | OD弱/OD中/OD強を分離すると3件 |
| 通常ヴィーハト3強度を1件に統合 | +2 | 弱/中/強を分離すると3件 |
| ODヴィーハト3入力を1件に統合 | +2 | OD弱/OD中/OD強を分離すると3件 |
| SA3/CAを1件に統合 | +1 | SA3とCAを分離 |
| 空中投げタルナードがDBにない | +1 | 実欠落候補 |
| **合計** | **+10** | **49 + 10 = 59** |

したがって、**59−49=10をそのまま「10技欠落」とみなすのは誤り**。真の件数欠落候補は現時点では **空中投げ「タルナード」1件**。残る9件分は公式行粒度に対するDB統合で説明できる。

ただし、ターゲットコンボ系には件数差に出ない粒度・命名問題が別途ある。

## 59行 ↔ DB49件 対応表

分類:
- `完全一致`: 公式1行 ↔ DB1 Moveの対応が明確
- `強度/入力統合`: 複数の公式行をDB1件へ統合
- `SA3/CA統合`: SA3とCAをDB1件へ統合
- `実欠落`: 対応するDB Moveが見つからない
- `旧名称/誤粒度`: 同一系統だが名称・段階・集約方法が公式行単位と不一致

| # | 公式行 | DB slug | DB Move ID | 分類 | 監査メモ |
|---:|---|---|---|---|---|
| 1 | 立ち弱P（ノーシ） | `jp-standing-lp` | `b558b854-1a5b-41a3-89ec-b119abc475ae` | 完全一致 | 現Frameはreviewed |
| 2 | 立ち弱K（ニージニイ・ウダール） | `jp-standing-lk` | `45d7ef0d-2f7c-415d-b433-1e04ad9fe09b` | 完全一致 | 現Frameはreviewed |
| 3 | 立ち中P（シュトゥールム） | `jp-standing-mp` | `e4ed90d9-23bf-4089-978a-4f2061e3b94a` | 完全一致 | 現Frameはreviewed |
| 4 | 立ち中K（ウームヌィ・ウダール） | `jp-standing-mk` | `94ad1cb7-1464-432d-b7ee-34e0171541b0` | 完全一致 | 現Frameはreviewed |
| 5 | 立ち強P（キンターヴル） | `jp-standing-hp` | `45863f7d-e112-42d8-ab88-d33839b4873a` | 完全一致 | 現Frameはreviewed |
| 6 | 立ち強K（オボロートニ） | `jp-standing-hk` | `9e959d30-059e-404b-ab0e-279ec4c5a54a` | 完全一致 | 現Frameはreviewed |
| 7 | しゃがみ弱P（ブィストルイ・ウダール） | `jp-crouching-lp` | `7c4584fd-fdb5-4fb9-84a2-472c3c03febe` | 完全一致 | 現Frameはreviewed |
| 8 | しゃがみ弱K（リョーフキー・ウダール） | `jp-crouching-lk` | `5a596631-df8f-450b-b735-ae4b9ca14390` | 完全一致 | 現Frameはreviewed |
| 9 | しゃがみ中P（ズミヤー） | `jp-crouching-mp` | `0afd12fb-5c7a-4799-b222-21daa7ca18f3` | 完全一致 | 現Frameはreviewed |
| 10 | しゃがみ中K（ズローバ） | `jp-crouching-mk` | `92ecb272-1cbd-46f0-95f2-ad4d21506e99` | 完全一致 | 現Frameはreviewed |
| 11 | しゃがみ強P（マリートヴァ） | `jp-crouching-hp` | `33b785cd-b4e9-4232-be5c-aca9ccef7b0a` | 完全一致 | 現Frameはreviewed |
| 12 | しゃがみ強K（ジョーキル） | `jp-crouching-hk` | `5fad21d1-bb82-4a22-bf29-f125688d3cb9` | 完全一致 | 現Frameはreviewed |
| 13 | ジャンプ弱P（ルイースイ） | `jp-jump-lp` | `00edfdc1-cf06-4b8c-b836-a213a7028cf6` | 完全一致 | DB recovery未格納。公式は着地硬直を持つためFrame再監査必要 |
| 14 | ジャンプ弱K（ヴァローナ） | `jp-jump-lk` | `6cb6065e-9c33-47d1-af2c-00e4b3871182` | 完全一致 | DB recovery未格納。Frame再監査必要 |
| 15 | ジャンプ中P（ローシャッチ） | `jp-jump-mp` | `3baf3077-05b0-4360-b548-ee16b68f8a37` | 完全一致 | DB recovery未格納。Frame再監査必要 |
| 16 | ジャンプ中K（コンダ） | `jp-jump-mk` | `ce1e365b-8572-44a2-8767-0bce9f20054b` | 完全一致 | DB recovery未格納。Frame再監査必要 |
| 17 | ジャンプ強P（イディナローク） | `jp-jump-hp` | `88b7028e-f54a-4b51-a75a-670ccfce75dc` | 完全一致 | DB recovery未格納。Frame再監査必要 |
| 18 | ジャンプ強K（ジャール・プチーツァ） | `jp-jump-hk` | `61797d46-a331-4638-ba60-3dc3ea0cfd16` | 完全一致 | DB recovery未格納。Frame再監査必要 |
| 19 | ギリオチーナ | `jp-guillotine` | `610e39c3-8fef-4a72-b85b-15c3a8fedd71` | 完全一致 |  |
| 20 | シャーロスチ | `jp-shalosti` | `290c6317-4a8a-4241-84cb-fc6774db1a98` | 完全一致 | Frameはunverified |
| 21 | ヴィリーナ / Bylina | `jp-forward-hk` | `3ed94fcd-3820-4ad6-91ea-7405360afac0` | 旧名称/誤粒度 | 対応自体は明確。name_ja表記統一が必要 |
| 22 | グロームストレルカ 1段目 | `jp-back-mp` | `00306fb8-0213-4c10-af70-df4286431957` | 旧名称/誤粒度 | DB名が「後ろ中P」。公式技名へ正規化候補 |
| 23 | グロームストレルカ 2段目 | `jp-grom-strelka` | `fb460c24-5453-48e4-bc72-dc3dffcfc81c` | 旧名称/誤粒度 | DB Frameが1段目+2段目を配列/合算で保持。公式行単位と不一致 |
| 24 | ジラント | `jp-zilant` | `0cc4dbc5-1dfc-4225-b050-a6ad29b92c0e` | 旧名称/誤粒度 | DBが立ち強K→ジラントまでを合算。立ち強Kは別Moveにも存在 |
| 25 | ジラントルカー | `jp-zilant-mid` | `1e3cc0be-14ef-4c39-9392-d8b88196fc46` | 旧名称/誤粒度 | DBが全3段を合算。公式は3段目単体行 |
| 26 | ジラントナガー | `jp-zilant-low` | `0b5841d6-8c3d-4da9-af74-0d4e9c2e389c` | 旧名称/誤粒度 | DBが全3段を合算。公式は3段目単体行 |
| 27 | 弱 トリグラフ | `jp-triglav` | `ac58d193-6639-4fe4-921c-fb69f7a85908` | 強度/入力統合 | 弱/中/強をDB1件に統合 |
| 28 | 中 トリグラフ | `jp-triglav` | `ac58d193-6639-4fe4-921c-fb69f7a85908` | 強度/入力統合 | 同上 |
| 29 | 強 トリグラフ | `jp-triglav` | `ac58d193-6639-4fe4-921c-fb69f7a85908` | 強度/入力統合 | 同上 |
| 30 | OD 弱 トリグラフ | `jp-triglav-od` | `c31fe91a-5449-49c7-b264-97dccae0908f` | 強度/入力統合 | LP+MP / LP+HP / MP+HPをDB1件に統合 |
| 31 | OD 中 トリグラフ | `jp-triglav-od` | `c31fe91a-5449-49c7-b264-97dccae0908f` | 強度/入力統合 | 同上 |
| 32 | OD 強 トリグラフ | `jp-triglav-od` | `c31fe91a-5449-49c7-b264-97dccae0908f` | 強度/入力統合 | 同上 |
| 33 | 弱 ストリボーグ | `jp-stribog-l` | `34287e66-c123-4cba-8c97-7bb0bd5a90b6` | 完全一致 |  |
| 34 | 中 ストリボーグ | `jp-stribog-m` | `acef0697-16a0-49eb-b289-4df09a1843e7` | 完全一致 |  |
| 35 | 強 ストリボーグ | `jp-stribog-h` | `43f19305-48cc-4928-b355-b07daf382c00` | 完全一致 |  |
| 36 | OD ストリボーグ | `jp-stribog-od` | `b8329b05-de0d-46dd-8688-e44231540c80` | 完全一致 |  |
| 37 | 弱 ヴィーハト | `jp-departure` | `f0766896-f8e9-45eb-a769-0762d98a2714` | 強度/入力統合 | 弱/中/強をDB1件に統合 |
| 38 | 中 ヴィーハト | `jp-departure` | `f0766896-f8e9-45eb-a769-0762d98a2714` | 強度/入力統合 | 同上 |
| 39 | 強 ヴィーハト | `jp-departure` | `f0766896-f8e9-45eb-a769-0762d98a2714` | 強度/入力統合 | 同上 |
| 40 | OD 弱 ヴィーハト | `jp-departure-od` | `9ec80073-a3d7-4d24-9437-8a21dc112c68` | 強度/入力統合 | 3入力をDB1件に統合 |
| 41 | OD 中 ヴィーハト | `jp-departure-od` | `9ec80073-a3d7-4d24-9437-8a21dc112c68` | 強度/入力統合 | 同上 |
| 42 | OD 強 ヴィーハト | `jp-departure-od` | `9ec80073-a3d7-4d24-9437-8a21dc112c68` | 強度/入力統合 | 同上 |
| 43 | ヴィーハト・アクノ | `jp-departure-window` | `6fbfed6b-7805-4277-b216-60503d4cee88` | 完全一致 | Frame数値は別途公式再照合 |
| 44 | ヴィーハト・チェーニ | `jp-departure-shadow` | `a6b9d663-b9b3-494b-8d43-7aed196be8f4` | 完全一致 | Frame数値は別途公式再照合 |
| 45 | アムネジア | `jp-amnesia` | `51680ee1-db0b-4906-80da-93ba82dde6f1` | 完全一致 |  |
| 46 | OD アムネジア | `jp-amnesia-od` | `f262b667-3ec4-4b75-a7f1-df1748df2ba3` | 完全一致 |  |
| 47 | 弱 トルバラン | `jp-torbalan-l` | `06f4575b-6654-459f-bf7b-2357dcf71478` | 完全一致 |  |
| 48 | 中 トルバラン | `jp-torbalan-m` | `0b13852f-0f76-4787-b794-1ef8257fa5fe` | 完全一致 |  |
| 49 | 強 トルバラン | `jp-torbalan-h` | `cd0255a1-bf6f-4b92-ad4e-1b2d5905983c` | 完全一致 |  |
| 50 | OD トルバラン | `jp-torbalan-od` | `852ac443-78e0-4c00-a43e-5196d33aba36` | 完全一致 |  |
| 51 | アブニマーチ / Embrace | `jp-embrace` | `a7bb98cd-731c-485c-ab95-78de6cf5448e` | 旧名称/誤粒度 | DB `name_ja=エンブレイス`。日本語公式名との正規化候補 |
| 52 | OD アブニマーチ / Embrace | `jp-embrace-od` | `e87c51f7-a2e9-44b1-8061-d823351b42d5` | 旧名称/誤粒度 | 同上 |
| 53 | SA1 チェルノボーグ | `jp-sa1` | `7817f9e6-8542-4da1-be01-c6bd24294f22` | 完全一致 |  |
| 54 | SA2 ラヴーシュカ | `jp-sa2` | `85762bb5-b5ae-4a88-b4ee-55112037774e` | 完全一致 |  |
| 55 | SA3 ザプリェット | `jp-sa3` | `1845d4b9-4bac-4e4e-b6fd-3b57accfa973` | SA3/CA統合 | DB damage=4000、notesにCA4500を格納 |
| 56 | CA ザプリェット | `jp-sa3` | `1845d4b9-4bac-4e4e-b6fd-3b57accfa973` | SA3/CA統合 | 公式は別行。DBでは独立Moveなし |
| 57 | ラヴィーナ（前投げ） | `jp-forward-throw` | `94a12a74-68c3-41d2-9fb5-7684451741b5` | 旧名称/誤粒度 | DBは汎用名「前投げ」。公式固有技名をAlias/正規名設計で整理候補 |
| 58 | ウラガーン（後ろ投げ） | `jp-back-throw` | `a63b4bd9-535b-4893-a55e-42d105ad9f8b` | 旧名称/誤粒度 | DBは汎用名「後ろ投げ」 |
| 59 | タルナード（空中投げ） | — | — | **実欠落** | 現DB49件に対応Moveなし |

## DB側の重要な構造問題

### 1. ターゲットコンボの「技」と「コンボ集約」が混在

`jp-grom-strelka`, `jp-zilant`, `jp-zilant-mid`, `jp-zilant-low` は、公式フレーム表の単一行ではなく、複数段の発生・硬直・ダメージを1つのMove/Frameに合算している。

例:
- `jp-grom-strelka`: startup `8,10`, damage `1000`
- `jp-zilant`: startup `12,20`, damage `1300`
- `jp-zilant-mid`: startup `12,20,21`, damage `2300`
- `jp-zilant-low`: startup `12,20,21`, damage `2300`

この設計はMove/Frameテーブルに「1技1行」の公式粒度と「ターゲットコンボ全体」の概念が混在している。

後続修正では、Move/Frameは公式行粒度へ寄せ、コンボ全体の表現は `combos` / `combo_moves` またはSequence側へ分離する方が整合的。

### 2. Triglav / Departureの強度・入力統合

距離・入力差を持つ技を1Moveにまとめているため、今後必要な以下を正確に持てない。

- Classic Command
- Modern Command
- 強度別フレーム
- 強度別距離
- OD入力組み合わせ
- キャラ限定・距離限定Combo/Counterとの参照

JPを全31キャラ共通テンプレートにするなら、公式フレーム表1行をMoveの最低粒度とする方針が妥当。

### 3. SA3/CA統合

`jp-sa3` はSA3 4000とCA 4500を同一Moveに持つ。CAは体力条件とdamageが異なるため、公式同様に独立Move/Frameへ分離する方が条件・リーサル判断・Combo参照で扱いやすい。

### 4. 実欠落

`タルナード`（ジャンプ中の空中投げ）がMoveとして存在しない。

これは現監査で確認できた唯一の「件数差としての実欠落候補」。

## 参照影響監査

分割・正規化候補14 Moveについて、現時点の参照数を確認した。

対象:
- `jp-back-mp`
- `jp-grom-strelka`
- `jp-zilant`
- `jp-zilant-mid`
- `jp-zilant-low`
- `jp-triglav`
- `jp-triglav-od`
- `jp-departure`
- `jp-departure-od`
- `jp-sa3`
- `jp-forward-throw`
- `jp-back-throw`
- `jp-embrace`
- `jp-embrace-od`

結果:
- `move_commands`: 各Move 1件（すべてClassic）
- `move_aliases`: 前後投げのみ各1件、その他は各2件
- `combo_moves`: 全対象0件
- `setup_moves`: 全対象0件
- `training_relations` (`related_type='move'`): 全対象0件

したがって、現時点ではSplit/Rename時の直接参照影響は主に **Classic Command と Alias**。Combo / Setup / Trainingの既存外部キー付け替えは発生しない。

### Command粒度で判明した問題

- `jp-triglav`: `22P` の1件だけで弱/中/強を表現
- `jp-triglav-od`: `22PP` の1件だけでOD3入力を表現
- `jp-departure`: `214P` の1件だけで弱/中/強を表現
- `jp-departure-od`: `214PP` の1件だけでOD3入力を表現
- `jp-grom-strelka`: `4MP~MP` としてターゲットコンボ全体を1 Moveへ格納
- `jp-zilant`: `HK~HP`、`jp-zilant-mid`: `HK~HP~HP`、`jp-zilant-low`: `HK~HP~HK` として全体入力をMoveに格納
- `jp-sa3`: SA3/CA共通の `236236K` 1件

これはModern追加以前にClassic側も公式行粒度へ再設計する必要があることを示す。

## Source監査

JP全Moveについて `entity_sources` を確認した。

- MoveへのSourceリンク: **69件**
- Frame (`frame` / `move_frame_data`) への直接Sourceリンク: **0件**
- 主なMove Source:
  - `Ultimate Frame Data`（community aggregator / corroborating）
  - `frame-search.com`（community aggregator / candidate）
- 既存Source noteにも `Direct CAPCOM verification pending` が明記されている。

したがって、現状の `move_frame_data` は **直接一次Sourceによる追跡可能性を満たしていない**。`reviewed` のまま扱い、`verified` へ昇格しない。

現行Patch:
- `version_label`: `2026.08.03`
- `name`: `2026.08.03 全体バトルバランス調整`
- `is_current`: `true`
- `official_url`: `https://www.streetfighter.com/6/buckler/ja-jp/battle_change`

## Frame監査で次に確認する項目

Move対応確定後、各公式59行について次を比較する。

- startup
- active
- recovery / total
- on_hit
- on_block
- damage
- cancel
- hit_level
- invincibility
- notes
- valid_from_patch_id
- direct Source link
- verification_status

特に優先確認:

1. ジャンプ6技の着地硬直
2. ターゲットコンボ各段のFrame分離
3. Triglav 6行の距離/入力差
4. Departure 6行の設置位置/入力差
5. SA3とCAのdamage/条件
6. タルナード新規Move候補

## Source状態

- CAPCOM公式JPフレームページ: `https://www.streetfighter.com/6/ja-jp/character/jp/frame`
- 自動取得環境ではCAPCOMページが403となるため、現監査では公式ページへリンクする現行ミラー/索引と既存DBを用いて**構造対応のみ**を確定した。
- このため、Frameの `verified` 昇格はまだ行わない。
- DB変更もまだ行わない。

## 次工程

1. 59行対応表を基準にMove修正案を作成
2. 既存参照影響はCommand/Alias中心であることを前提にsplit/rename/alias化計画を作る
3. `move_commands` と `move_aliases` の新旧対応表を作る
4. Frameの一次Source確保または実機確認手順を設計する
5. 変更SQLを作るが、実行前に重複・Source・Patch・参照整合性を再監査
6. Move基盤修正後にFrame → Classic → Modernへ進む
