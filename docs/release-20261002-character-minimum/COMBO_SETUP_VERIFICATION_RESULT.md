# Combo / Setup Verification Result

内部下書きの検証候補一覧。**公開用攻略ではない。全155件 BLOCKED_BY_EVIDENCE、実機実行条件確定前。** 表内の技・手順は既存DBレコードを保持したもので、成立を新たに断定していない。NULLと0を区別し、欠落値はUNCONFIRMED。既存「持続重ね」「safe jump」等の名称も候補の原題であり、成立認定ではない。

## 選定方法・限界

各31キャラで既存draftから基本・Drive・SA等の3Combo、基本Okiと画面端等の2Setupを暫定選定した。自動コンボ/Assistだけの入力、単発対空、旧候補や曖昧な枝分かれを可能な範囲で低優先にした。カテゴリ一致はゲーム内成立を証明しない。Jamieの飲酒段階/締め技、A.K.I.のSA枝分かれ等、残った曖昧なレシピは再特定が必要。全件のDB verification_statusはそのままで、選定したものにverifiedはない。

## 限定的なSource本文照合

| Character | URL | 本文確認結果 | 未確認境界 |
| --- | --- | --- | --- |
| JP | https://takukakugamer.com/jp_combo/ | 2026-03-17更新。5MK→中ストリボーグの既存基本候補を本文で確認 | 8月DBパッチ前。現行成立・距離・条件未確認 |
| Ryu | https://sf6-genten.com/character/ryu/category/combo | 2026-08-20更新。小技→強昇龍の基本候補を本文で確認 | OD足刀ルートはSource側5MP追加と遅らせ条件あり。DB短縮レシピと同一視不可 |
| Luke | https://pachi-mea.com/sf6-wiki/10313/ | 2LP×3→214LPの基本候補を本文で確認 | 全条件・操作方式・実機最新パッチ未確認 |
| Jamie | https://takukakugamer.com/sf6-jamie-combo/ | 2026-08-04記事、Lv0小技→流酔拳候補を本文で確認 | 追加入力段階・飲酒条件・現行再現未確認 |

基本レシピの文字列対応4件、条件・パッチ・実機までSource Relation確認完了0件。Ryu別ルートの始動/遅らせ差はPARTIAL / STARTER_TIMING_DIFFERENCEで保留し、不成立とは断定していない。矛盾がないという全件結論は出していない。公式Patch検索の8/3更新snippetは本文照合や最新Patch確定の代替にしない。

## 全31の内部候補

各Source IDのリンクは末尾Registryを参照。patch_context / candidate_basis / supportingなどRelationの存在は同一レシピの成立証跡ではない。全件でSOURCE_RELATION_UNCONFIRMEDを維持（上記4件は基本レシピ文字列のみPARTIAL）。

### リュウ / ryu

#### combo — 基本 — 小技始動・強昇龍拳締め

Record: `599e4a07-7573-4814-a52a-a4686dd09b49` / `ryu-basic-light-shoryu`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | しゃがみ弱K ＞ 立ち弱P ＞ 立ち弱P ＞ 強昇龍拳 |
| Starter | しゃがみ弱K |
| Hit condition | 近距離ヒット確認 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 基本・小技確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `2e3a6f44-a9ef-4d3a-a8d4-633d2181365c` (supporting); `31684021-f50b-4587-9d60-d479ba62978a` (candidate_basis); `a6058153-8670-4f64-b24e-58304bb5c5fd` (patch_context)。

#### combo — Drive候補 — 中攻撃→OD足刀→前強K→竜巻

Record: `a05fa388-d20a-4b88-b15b-5d614372c849` / `ryu-y4-cmp-od-donkey-tatsu`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | しゃがみ中P ＞ OD上段足刀蹴り ＞ 旋風脚(6強K) ＞ 竜巻旋風脚 |
| Starter | しゃがみ中P |
| Hit condition | 立ち強P始動候補もSourceに記載。 |
| Position | any |
| Drive requirement | 2 |
| SA requirement | 0 |
| Side | UNCONFIRMED |
| Purpose | 低コスト運び・起き攻め |

未確認: side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `34cfc914-ebd1-4824-97a4-8c25772e4740` (supporting); `a6058153-8670-4f64-b24e-58304bb5c5fd` (supporting)。

#### combo — SA候補 — 端旋風脚→OD竜巻→強昇龍→SA3

Record: `1b1a2d4b-c7a0-49bf-a6f8-9b7a32fd105c` / `ryu-y4-corner-senpukyaku-odtatsu-sa3`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 旋風脚(画面端) ＞ OD竜巻 ＞ 強昇龍拳 ＞ SA3 |
| Starter | 旋風脚 |
| Hit condition | 画面端。 |
| Position | corner |
| Drive requirement | 2 |
| SA requirement | 3 |
| Side | UNCONFIRMED |
| Purpose | 端中段/打撃始動リーサル |

未確認: side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `34cfc914-ebd1-4824-97a4-8c25772e4740` (supporting); `a6058153-8670-4f64-b24e-58304bb5c5fd` (supporting)。

#### setup — 起き攻め候補 — 弱竜巻締め→弱波掌撃持続重ね

Record: `2de1eed1-214a-4df5-b250-9ef062cd7cd3` / `ryu-light-tatsu-hashogeki`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | 弱竜巻旋風脚でダウン |
| Action | 前方行動 ＞ 弱波掌撃 |
| Goal | 弱竜巻締め後の持続重ね候補 |
| Position | midscreen |
| Meter | none |
| Frame claim (未検証) | 要トレモ確認 |
| Opponent / response | 受け身・キャラ差・最速行動を要確認 |

未確認: exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `31684021-f50b-4587-9d60-d479ba62978a` (candidate_basis); `a6058153-8670-4f64-b24e-58304bb5c5fd` (patch_context)。

#### setup — 端・固有候補 — +22→中段持続

Record: `b132e350-ddb5-4062-90ef-25d43c0aa7cf` / `ryu-fk-plus22-overhead`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | フレーム有利 +22 |
| Action | 鎖骨割り |
| Goal | 中段持続から小技コンボ。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | ヒット+5／ガード+1候補 |
| Opponent / response | Source表の持続段を確認。 |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `a6058153-8670-4f64-b24e-58304bb5c5fd` (patch_context); `e1e8e320-1cdb-472b-ac03-955a62821b05` (supporting)。

### ルーク / luke

#### combo — 基本 — 小技始動・弱フラッシュナックル締め

Record: `9b1dc825-d424-49fc-8b34-463781d12dca` / `luke-light-l-flash`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LP > 2LP > 2LP > 214LP |
| Starter | 2LP |
| Hit condition | 通常ヒット |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 基本確反・小技確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `9e0141ec-765e-40d7-83f1-566df7c1ed52` (patch_context); `b71f861c-cbbb-4da5-b06f-9ce3073cf743` (reference); `f6efb8b1-6900-4cef-bf66-9aae90591cde` (supporting)。

#### combo — Drive候補 — 生DR中段→しゃがみ中P→強ライジング

Record: `c67a63b9-5f10-4031-8045-afd3f23aa3e2` / `luke-y4-dr-overhead-upper`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR > 6MP > 2MP > 623HP |
| Starter | DR 6MP |
| Hit condition | Drive Rush overhead hit. |
| Position | midscreen |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中段ヒット時の安定締め |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `7d4ba052-4ef8-46c8-88ef-68d9e395fa60` (supporting); `9e0141ec-765e-40d7-83f1-566df7c1ed52` (patch_context)。

#### combo — SA候補 — 立ち強K持続→しゃがみ中P→ODフラ→SA1

Record: `0bb22a33-9434-4365-b15f-965de4482b6e` / `luke-y4-hk-meaty-cmp-odflash-sa1`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5HK(meaty) > 2MP > 214PP > SA1 |
| Starter | 5HK meaty |
| Hit condition | 5HK持続当て。 |
| Position | any |
| Drive requirement | 2 |
| SA requirement | 1 |
| Side | UNCONFIRMED |
| Purpose | 持続重ねからSA1 |

未確認: side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `9e0141ec-765e-40d7-83f1-566df7c1ed52` (patch_context); `a6cd285f-5309-4f18-9b50-aa95621c8192` (supporting)。

#### setup — 起き攻め候補 — ODライジング後→DR投げ

Record: `a3a782ff-4d92-4b1e-a883-7bf9718928db` / `luke-y4-od-rising-dr-throw`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | OD Rising Upper knockdown |
| Action | DR > 投げ / 打撃 |
| Goal | OD無敵技ヒット後にもDR投げを埋める。 |
| Position | midscreen |
| Meter | Drive 3 |
| Frame claim (未検証) | unknown |
| Opponent / response | 受け身なしでシミーを防げるとの対策記事記載。 |

未確認: exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `2ab0bce6-b654-4dda-a46b-b85806cf7155` (supporting); `9e0141ec-765e-40d7-83f1-566df7c1ed52` (patch_context)。

#### setup — 端・固有候補 — 端背負い後ろ投げ→立ち強K持続

Record: `6f484e91-1ed5-46eb-a800-93040a59eafd` / `luke-y4-corner-backthrow-hk`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | 画面端背負い後ろ投げ(+14) |
| Action | 5HK |
| Goal | 立ち強K持続重ね。微歩き様子見でジャスパ確認投げへ分岐。 |
| Position | corner |
| Meter | none |
| Frame claim (未検証) | hit +8 / guard +1 |
| Opponent / response | 記事記載値。 |

未確認: exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `9e0141ec-765e-40d7-83f1-566df7c1ed52` (patch_context); `c1dadeec-59f5-4556-8c00-a0e250cb497c` (supporting)。

### ジェイミー / jamie

#### combo — 基本 — Lv0 しゃがみ弱P確認

Record: `81599f46-07a6-44f6-bf62-ee1c32e3e6b3` / `jamie-20260803-light-freeflow`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | しゃがみ弱P > 弱流酔脚 |
| Starter | しゃがみ弱P |
| Hit condition | 酔いLv0以上。初段ヒット確認 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 弱攻撃確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `a24b367f-c761-4e07-973a-898df9ded3a8` (supporting); `f471bbd4-7cac-4b3d-a94c-218064b0aa30` (candidate)。

#### combo — Drive候補 — DR小足→中足→酒別締め

Record: `b6d6b046-16e2-42f6-a213-6938e263a23a` / `jamie-y4-dr-2lk-2mk-finish`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR > 2LK > 2MK > drink-level finisher |
| Starter | DR 2LK |
| Hit condition | Finisher varies by drink level |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 下段始動と飲酒・起き攻め選択 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `a24b367f-c761-4e07-973a-898df9ded3a8` (patch_context); `cc6a0039-6a82-41ba-9b30-6a1e3b26c7fc` (supporting)。

#### combo — SA候補 — OD無影蹴→立ち強P→SA1

Record: `3cbb6b91-a223-484d-8ebd-d077e90f4cdf` / `jamie-y4-od-divekick-5hp-sa1`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | OD無影蹴 > 5HP > SA1 |
| Starter | OD無影蹴 |
| Hit condition | Ground/foot hit and height confirmation required |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中央SA1火力候補 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `a24b367f-c761-4e07-973a-898df9ded3a8` (patch_context); `cc6a0039-6a82-41ba-9b30-6a1e3b26c7fc` (supporting)。

#### setup — 起き攻め候補 — 流酔拳系からの運び後起き攻め

Record: `69ca8ca5-a982-436b-8580-3bf11b7abd92` / `jamie-rekka-carry-oki`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | 流酔拳系でダウンを取った後 |
| Action | 前歩き/DR > 打撃・投げ・シミー |
| Goal | 運び後の距離を利用した標準起き攻め候補。 |
| Position | any |
| Meter | Drive任意 |
| Frame claim (未検証) | UNCONFIRMED |
| Opponent / response | 派生段数と酔いレベルごとの硬直差を要確認。 |

未確認: frame_advantage, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `70a8c217-52c3-4cc5-9488-7420376598fc` (candidate); `a24b367f-c761-4e07-973a-898df9ded3a8` (patch_context)。

#### setup — 端・固有候補 — 端+15→DR弱P持続

Record: `296e0a3d-ae77-43f2-9c0b-dc9e24b0dee0` / `jamie-legacy-corner-plus15-dr-lp`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | 弱爆廻 > 2MK空振り(+15) |
| Action | DR > 2LP |
| Goal | 11Fまでの無敵技を詐欺るとの記事記載。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | +4 claim |
| Opponent / response | Older written frame claim; verify on Year4. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `a24b367f-c761-4e07-973a-898df9ded3a8` (patch_context); `ea9d2f5a-5a63-401c-802a-4b4fc8974971` (supporting)。

### 春麗 / chun-li

#### combo — 基本 — 立ち中P基本

Record: `52005f35-71f4-45dd-8f7e-59d35457af06` / `chun-li-20260803-mp-hsbk`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 立ち中P > しゃがみ中P > 強スピニングバードキック |
| Starter | 立ち中P |
| Hit condition | 下溜めが必要 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 基本ダメージ |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `e54e2a84-a826-406d-9a21-8589e9237b31` (supporting); `e6581252-d77e-4fab-93b4-20185f376425` (candidate)。

#### combo — Drive候補 — ラッシュ中段始動

Record: `9f332463-6fd9-4c7b-a243-db8994ef3b26` / `chun-li-20260803-dr-overhead`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | パリィラッシュ水蓮掌（↘+強P） > しゃがみ中P > 中スピニングバードキック |
| Starter | パリィラッシュ水蓮掌 |
| Hit condition | 下溜めが必要 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中段崩し |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `e54e2a84-a826-406d-9a21-8589e9237b31` (supporting); `e6581252-d77e-4fab-93b4-20185f376425` (candidate)。

#### combo — SA候補 — SA2→前J中K表裏

Record: `265a70a1-27aa-446f-922c-c3b4ee1faf10` / `chun-written-sa2-side-switch`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | SA2 > forward j.MK > forward dash > 5MP |
| Starter | SA2 |
| Hit condition | Side/character spacing capture required |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | SA2後表裏 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `6fb2e533-ad82-4e5c-863d-228207be9ae5` (supporting); `e54e2a84-a826-406d-9a21-8589e9237b31` (patch_context)。

#### setup — 起き攻め候補 — 中スピバ後の前ステ起き攻め

Record: `ea76c9a9-6ea5-4630-8f45-46ce6a200d26` / `chun-written-msbk-forward-dash`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | 5MP > 2MP > Mスピニングバードキック |
| Action | 前ステップ > 投げ / 打撃 / シミー |
| Goal | 基本の地上起き攻め。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | unknown |
| Opponent / response | Check 4F, invincible reversal, parry, D-reversal and back rise. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `6fb2e533-ad82-4e5c-863d-228207be9ae5` (supporting); `e54e2a84-a826-406d-9a21-8589e9237b31` (patch_context)。

#### setup — 端・固有候補 — 端構えキャンセル小足

Record: `689950e8-a83b-424d-b119-b2175e20bd6a` / `chun-written-corner-stance-cancel-low`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner Mスピニングバードキック or H天昇脚 ender |
| Action | 行雲流水 > 構えキャンセル > 2LK > 2LP > Lスピニングバードキック |
| Goal | 構え派生に対する防御の対択。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | unknown |
| Opponent / response | Check 4F, invincible reversal, parry, D-reversal and back rise. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `6fb2e533-ad82-4e5c-863d-228207be9ae5` (supporting); `e54e2a84-a826-406d-9a21-8589e9237b31` (patch_context)。

### ガイル / guile

#### combo — 基本 — しゃがみ中P基本サマー

Record: `911f8a0a-5fa6-4936-98d2-fda542aa5e19` / `guile-written-2mp-tc-summer`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > 2MP(TC) > サマーソルトキック |
| Starter | 2MP |
| Hit condition | Classic/Modern availability and strength require capture |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 基本確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `189622dc-2071-4972-bdf9-d0f6dac4deb8` (patch_context); `30f4b384-b9a7-4ae1-b25f-e1cdc19e1b1c` (supporting)。

#### combo — Drive候補 — 中PハリケーンODサマー

Record: `dbee253b-eab9-4d0e-a17f-d99310ac5b04` / `guile-written-5mp-hurricane-odsummer`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5MP > 4HP > Hソニックハリケーン > ODサマーソルトキック |
| Starter | 5MP |
| Hit condition | Notation uses source naming; current input requires capture |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | SA1火力と距離離し |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `189622dc-2071-4972-bdf9-d0f6dac4deb8` (patch_context); `4ddb1b64-46d6-4411-afc6-1f1ad5524060` (supporting)。

#### combo — SA候補 — 中P起き攻め倒し切りSA3

Record: `bab8e29b-077d-41e1-98d3-4d5b38a78419` / `guile-written-2mp-double-cdr-sa3`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > CDR > 2MP > 5HP > CDR > 5HK > 2MP > Hサマーソルトキック > SA3 |
| Starter | 2MP |
| Hit condition | Written simplified route; current damage unknown |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 倒し切り |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `189622dc-2071-4972-bdf9-d0f6dac4deb8` (patch_context); `4ddb1b64-46d6-4411-afc6-1f1ad5524060` (supporting)。

#### setup — 起き攻め候補 — 前投げPC+15ラッシュ投げ

Record: `98c8c195-0bd0-4852-ae58-d57b9c114eb2` / `guile-written-fthrow-pc-plus15`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | forward throw punish counter |
| Action | DR投げ / 2LP / 5MP / 2MP |
| Goal | シミー・無敵ガード不可との記事記載 |
| Position | mid |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | +15 claim |
| Opponent / response | Verify normal/back rise, 4F, 5F/6F reversal, jump, backdash, parry and Drive Reversal. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `189622dc-2071-4972-bdf9-d0f6dac4deb8` (patch_context); `4ddb1b64-46d6-4411-afc6-1f1ad5524060` (supporting)。

#### setup — 端・固有候補 — 端強サマー→バクステDR弱P

Record: `8477e3fd-0220-4928-825a-7dacdf4d3952` / `guile-written-corner-hsummer-backdash`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner Hサマーソルトキック |
| Action | backdash > DR 2LP |
| Goal | 遅い無敵技への詐欺重ね候補 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | +39; +15 consumption claim |
| Opponent / response | Verify normal/back rise, 4F, 5F/6F reversal, jump, backdash, parry and Drive Reversal. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `189622dc-2071-4972-bdf9-d0f6dac4deb8` (patch_context); `4ddb1b64-46d6-4411-afc6-1f1ad5524060` (supporting)。

### キンバリー / kimberly

#### combo — 基本 — 小足刻み弱流転

Record: `087fcf3b-1c56-4a55-b0c3-25542950b6b6` / `kim-y4-light-ryuten`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LK > 2LP > 2LP > L流転一文字 |
| Starter | 2LK |
| Hit condition | Source damage 1071; +3 claim |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 小技起き攻め |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `b069e9fc-3e83-4c7c-9019-3077fbc54dbf` (supporting); `f0ff9b6f-32ee-41b9-ace3-a63ac1c7e90f` (patch_context)。

#### combo — Drive候補 — 生DR中足強流転荒鵺

Record: `940c1506-906e-458c-ab0c-41e0e35f388c` / `kim-y4-dr-low-aranya`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 2MK > 5HP > H流転一文字 > 荒鵺捻り |
| Starter | DR 2MK |
| Hit condition | Source damage 2286 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 下段運び |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `b069e9fc-3e83-4c7c-9019-3077fbc54dbf` (supporting); `f0ff9b6f-32ee-41b9-ace3-a63ac1c7e90f` (patch_context)。

#### combo — SA候補 — DR中段SA3

Record: `22fc7e1d-16ab-4198-ab37-5fe2ae582a65` / `kim-y4-dr-overhead-sa3`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 4HK > 5MP~5HP > OD疾駆け弧空K > 疾駆け胴刎ね > L流転 > SA3 |
| Starter | DR 4HK |
| Hit condition | Source damage 4307 |
| Position | corner |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中段リーサル |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `b069e9fc-3e83-4c7c-9019-3077fbc54dbf` (supporting); `f0ff9b6f-32ee-41b9-ace3-a63ac1c7e90f` (patch_context)。

#### setup — 起き攻め候補 — 弱流転+3択

Record: `f8546bd5-f345-4670-a5bc-00ce2c192ebf` / `kim-oki-light-ryuten`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | L流転 hit |
| Action | throw / 2MP / shimmy |
| Goal | 投げ・打撃・シミー |
| Position | mid |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | +3 claim |
| Opponent / response | Verify normal/back rise, 4F, jump, backdash, parry, D-reversal and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `ea621e8e-090f-4340-a896-f50e31013059` (supporting); `f0ff9b6f-32ee-41b9-ace3-a63ac1c7e90f` (patch_context)。

#### setup — 端・固有候補 — 荒鵺後前ステ択

Record: `d22d9349-806c-43f0-9fd1-49f9fc8cd914` / `kim-oki-aranya-dash`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | H流転 > 荒鵺 |
| Action | dash > throw / 2MP / shimmy |
| Goal | 端投げ・打撃 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | +4 after dash claim |
| Opponent / response | Verify normal/back rise, 4F, jump, backdash, parry, D-reversal and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `ea621e8e-090f-4340-a896-f50e31013059` (supporting); `f0ff9b6f-32ee-41b9-ace3-a63ac1c7e90f` (patch_context)。

### ジュリ / juri

#### combo — 基本 — 小技刻み中風破刃

Record: `cc4ef324-3e12-4db8-91de-41c6dd5ece90` / `juri-y4-light-fuha`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LP x2-3 > M風破刃 |
| Starter | 2LP |
| Hit condition | 距離で刻み数を変更 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 小技確認・風破ストック |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `74191946-fe26-490f-a29e-1da72481520c` (supporting); `912386f3-1c0a-4060-af1f-37f5f2f35db8` (patch_context)。

#### combo — Drive候補 — 5HKパニカンDR回収

Record: `f4f44de9-2449-4cdc-ac70-42dd00ad8c44` / `juri-y4-5hk-pc-dr`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5HK(PC) > DR > 5LP > 強風破刃 > 強天穿輪 |
| Starter | 5HK PC |
| Hit condition | Punish Counter / Drive |
| Position | any |
| Drive requirement | 1 |
| SA requirement | 0 |
| Side | UNCONFIRMED |
| Purpose | パニカン高リターン |

未確認: side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `310a2a1c-a97e-4e8b-81d2-8780affeca76` (supporting); `912386f3-1c0a-4060-af1f-37f5f2f35db8` (patch_context); `f21d2365-d668-47ea-b2a5-102bb27fa458` (supporting)。

#### combo — SA候補 — 小技CDR→SA1

Record: `65d4034d-2193-4c8a-a97f-90c8110fbdb7` / `juri-y4-light-sa1`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LP/2LK > 2LP > 2LP > CDR > 2LP > 5MP > 4HP > HP > SA1 |
| Starter | 2LP/2LK |
| Hit condition | Drive 3+ / SA1 |
| Position | any |
| Drive requirement | 3 |
| SA requirement | 1 |
| Side | UNCONFIRMED |
| Purpose | SA1火力 |

未確認: side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `310a2a1c-a97e-4e8b-81d2-8780affeca76` (supporting); `912386f3-1c0a-4060-af1f-37f5f2f35db8` (patch_context); `f21d2365-d668-47ea-b2a5-102bb27fa458` (supporting)。

#### setup — 起き攻め候補 — 弱天穿輪→前ステ起き攻め

Record: `bae0d098-5265-40b8-9d85-2e63f21785e5` / `juri-y4-l-tensenrin-dash`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | 弱天穿輪ヒット |
| Action | 弱天穿輪 > 前ステップ |
| Goal | 現行ガイドで弱天穿輪締め後に前ステで起き攻めへ移行可能。 |
| Position | midscreen |
| Meter | none |
| Frame claim (未検証) | 可変（受け身/距離依存） |
| Opponent / response | 最速無敵・受け身・距離をトレモ確認。 |

未確認: exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `912386f3-1c0a-4060-af1f-37f5f2f35db8` (patch_context); `f21d2365-d668-47ea-b2a5-102bb27fa458` (supporting)。

#### setup — 端・固有候補 — 端DI追撃後起き攻め

Record: `636d6e2e-2233-4ba1-a235-81a46418e4db` / `juri-y4-corner-di-oki`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | DI壁やられ |
| Action | DI壁 > 2HP/5HP > 必殺技締め > 起き攻め |
| Goal | 端DI追撃後の状況別起き攻め。 |
| Position | corner |
| Meter | Drive 1+ |
| Frame claim (未検証) | 可変 |
| Opponent / response | 締め技別に受け身と無敵回答を検証。 |

未確認: exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `912386f3-1c0a-4060-af1f-37f5f2f35db8` (patch_context); `f21d2365-d668-47ea-b2a5-102bb27fa458` (supporting)。

### ケン / ken

#### combo — 基本 — 2MP→LK→強昇龍

Record: `dc5aa57c-0684-4a31-8aa6-371133aa2ca5` / `ken-y4-2mp-lk-hdp`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > 5LK > 強昇龍拳 |
| Starter | 2MP |
| Hit condition | Normal hit |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | 0 |
| Side | UNCONFIRMED |
| Purpose | Year4基本確認 |

未確認: drive_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0b668bc9-04e7-444f-88f0-c70039f9102e` (patch_context); `346a1631-a290-4857-845c-4c0e1bdac9b7` (supporting); `d33665a7-e7fa-4e31-8c71-35337f3183b5` (supporting)。

#### combo — Drive候補 — 中足ラッシュ火力

Record: `b7d9768a-cc7c-48d2-bebd-bd6c3d007268` / `ken-y4-crmk-dr-damage`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MK > CDR > 2HP > 奮迅急停止 > 2MP > 5MP > 奮迅昇龍拳 |
| Starter | 2MK |
| Hit condition | Drive Rush |
| Position | any |
| Drive requirement | 3 |
| SA requirement | 0 |
| Side | UNCONFIRMED |
| Purpose | 火力＋起き攻め |

未確認: side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0b668bc9-04e7-444f-88f0-c70039f9102e` (patch_context); `346a1631-a290-4857-845c-4c0e1bdac9b7` (supporting); `d33665a7-e7fa-4e31-8c71-35337f3183b5` (supporting)。

#### combo — SA候補 — 2MPカウンター→SA1

Record: `a2cf32fa-8bbe-4d98-98a9-b0f6df1ec9bf` / `ken-y4-2mp-ch-sa1`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP(CH) > SA1 |
| Starter | 2MP CH |
| Hit condition | Counter Hit / SA1 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | 1 |
| Side | UNCONFIRMED |
| Purpose | SA1即時火力 |

未確認: drive_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0b668bc9-04e7-444f-88f0-c70039f9102e` (patch_context); `346a1631-a290-4857-845c-4c0e1bdac9b7` (supporting); `d33665a7-e7fa-4e31-8c71-35337f3183b5` (supporting)。

#### setup — 起き攻め候補 — 奮迅竜巻運び→起き攻め

Record: `3908c8a7-89a6-42bd-bffe-62f7c8f58241` / `ken-y4-qdtatsu-carry-oki`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | 奮迅竜巻締め |
| Action | 奮迅竜巻 > 前ステ×2 > 起き攻め |
| Goal | 運び後に前ステップ2回で密着有利候補。 |
| Position | midscreen |
| Meter | none |
| Frame claim (未検証) | +5F候補（要再現） |
| Opponent / response | 距離・受け身・キャラ差を再現確認。 |

未確認: exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0b668bc9-04e7-444f-88f0-c70039f9102e` (patch_context); `346a1631-a290-4857-845c-4c0e1bdac9b7` (supporting)。

#### setup — 端・固有候補 — 持続奮迅中段セットプレイ

Record: `b47b3a02-6e6f-4781-9be2-d4fdab939469` / `ken-y4-meaty-qdoverhead`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | 対応するダウンを取得 |
| Action | 時間消費 > 奮迅脚 > 中段派生持続当て |
| Goal | 持続中段CHからYear4高火力ルートへ移行可能。 |
| Position | corner |
| Meter | none |
| Frame claim (未検証) | 可変（持続依存） |
| Opponent / response | 成立ダウン・F消費・CH条件を必ず実機確認。 |

未確認: exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0b668bc9-04e7-444f-88f0-c70039f9102e` (patch_context); `346a1631-a290-4857-845c-4c0e1bdac9b7` (supporting)。

### ブランカ / blanka

#### combo — 基本 — 4中K電撃締め

Record: `60e9d3fc-3bfc-46d9-b99e-b0a8a61606f7` / `blanka-4mk-thunder`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 4MK > 5MK > エレクトリックサンダー |
| Starter | 4MK |
| Hit condition | Standing/crouching consistency required. |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 近距離確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0413a164-37a7-42fc-b6ae-30f3005e927e` (supporting); `c2bd5a01-5b54-4409-8936-34f5a6cdac2f` (patch_context)。

#### combo — Drive候補 — DR弱K中K電撃

Record: `1b6b62a8-8c84-4461-8c80-52264e5bf6d0` / `blanka-dr-5lk-thunder`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 5LK > 5MK > エレクトリックサンダー |
| Starter | DR 5LK |
| Hit condition | Drive Rush starter. |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | DR小技確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0413a164-37a7-42fc-b6ae-30f3005e927e` (supporting); `c2bd5a01-5b54-4409-8936-34f5a6cdac2f` (patch_context)。

#### combo — SA候補 — DI壁強ロリSA3

Record: `6d43379d-c786-4385-b8ec-0e3163d749ad` / `blanka-di-wall-sa3`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DI wall splat > 5HP > Hローリングアタック > SA3 |
| Starter | DI wall splat |
| Hit condition | SA3 cancel timing required. |
| Position | corner |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 端DIリーサル |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0413a164-37a7-42fc-b6ae-30f3005e927e` (supporting); `c2bd5a01-5b54-4409-8936-34f5a6cdac2f` (patch_context)。

#### setup — 起き攻め候補 — 弱バチカ後中段

Record: `1707544c-fb79-4972-b31e-a456fe956142` / `blanka-oki-lvertical-overhead`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | Lバーチカルローリング +33 |
| Action | delayed DR 6MP > confirm |
| Goal | 遅らせ中段。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source timing claim |
| Opponent / response | Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0413a164-37a7-42fc-b6ae-30f3005e927e` (supporting); `c2bd5a01-5b54-4409-8936-34f5a6cdac2f` (patch_context)。

#### setup — 端・固有候補 — 中ロリ後DR強K相打ち

Record: `36434bab-4c37-4341-bf38-facb7d406cb3` / `blanka-oki-mrolling-trade`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | Mローリングアタック +14 |
| Action | DR 5HK > trade follow-up |
| Goal | 4F暴れとの相打ち追撃。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | 4F trade claim |
| Opponent / response | Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0413a164-37a7-42fc-b6ae-30f3005e927e` (supporting); `c2bd5a01-5b54-4409-8936-34f5a6cdac2f` (patch_context)。

### ダルシム / dhalsim

#### combo — 基本 — 涅槃キック強フレイム

Record: `b966a3b6-cb00-4066-9f9f-1934075e3ae9` / `dhalsim-4mk-flame`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 4MK > Hヨガフレイム |
| Starter | 4MK |
| Hit condition | 半回転入力確認 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 近距離基本 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `b4da6868-992c-4c8b-adf4-0991c0cdfbd9` (supporting); `d03845a3-9ced-48a7-8db1-c615d9f8883b` (patch_context)。

#### combo — Drive候補 — 小技ODファイア

Record: `e8741e4b-2c9f-42a1-b862-ddd124206552` / `dhalsim-lp-od-fire`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5LP > 2LP > ODヨガファイア |
| Starter | 5LP |
| Hit condition | Drive 2. |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 小技攻め継続 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `c09f0c86-b75f-4124-a0fc-2855b6c13fee` (supporting); `d03845a3-9ced-48a7-8db1-c615d9f8883b` (patch_context)。

#### combo — SA候補 — DI膝崩れODフレイム

Record: `070c77f0-39a6-4bf4-849e-160548a4bc48` / `dhalsim-di`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DI clean hit > 4MK > ODヨガフレイム > 3HP / SA1 |
| Starter | DI punish counter |
| Hit condition | 距離・補正確認 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | DI反撃 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `d03845a3-9ced-48a7-8db1-c615d9f8883b` (patch_context); `d81d2e38-7bca-42bc-9a53-211ae5f46ecb` (supporting)。

#### setup — 起き攻め候補 — ODフレイム後強K

Record: `806ea4af-4248-4bf1-ba86-2513767df25c` / `dhalsim-oki-odflame-hk`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | ODヨガフレイム > 5HK |
| Action | Lヨガファイア / teleport offense |
| Goal | 強K締めからの弾・テレポ。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source +18 claim |
| Opponent / response | Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `c09f0c86-b75f-4124-a0fc-2855b6c13fee` (supporting); `d03845a3-9ced-48a7-8db1-c615d9f8883b` (patch_context)。

#### setup — 端・固有候補 — 端前投げ弱P柔道

Record: `b35375b0-2242-4ef7-b47e-8e3173e96963` / `dhalsim-oki-corner-throw`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner forward throw |
| Action | 2LP > forward throw / strike |
| Goal | 端投げ継続 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | unknown |
| Opponent / response | Verify rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `5bf09cec-17b5-4031-9cab-838a22570e4b` (supporting); `d03845a3-9ced-48a7-8db1-c615d9f8883b` (patch_context)。

### エドモンド本田 / e-honda

#### combo — 基本 — 小技百貫締め

Record: `ecb3d415-d56a-41f1-942f-77f337cfc98a` / `honda-light-butt`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LP x2 > Hスーパー百貫落とし |
| Starter | 2LP |
| Hit condition | 立ちやられ限定候補 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 小技起き攻め |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `25350a31-b3f3-4298-9ecf-09816f8ee862` (supporting); `76bb64f0-e02b-412b-9473-c22a8082ffff` (patch_context)。

#### combo — Drive候補 — DR中P持続大砲百貫

Record: `e5617197-8933-4428-a613-ee3df3cee5de` / `honda-dr-mp-y4`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 5MP(meaty) > 5HP > 大砲 > H百貫 |
| Starter | DR 5MP |
| Hit condition | Source +8 block/+13 hit claim |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 現行主力 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `76bb64f0-e02b-412b-9473-c22a8082ffff` (patch_context); `ff296a3f-0e4e-474d-9e9c-ba1439b95d75` (supporting)。

#### combo — SA候補 — DI壁強張り手OD百貫

Record: `615399df-f748-4f64-8f22-5e48fd0b80d1` / `honda-di-wall`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DI wall splat > 5HP > H百裂張り手 > OD百貫 / SA1 |
| Starter | DI wall splat |
| Hit condition | 約3000記事主張 |
| Position | corner |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 壁反撃 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `76bb64f0-e02b-412b-9473-c22a8082ffff` (patch_context); `b3401782-12d0-4ec9-b462-b17a9b2a412d` (supporting)。

#### setup — 起き攻め候補 — 百貫後前ステ三択

Record: `5110f623-b0e5-4c80-bff5-d259e0576f14` / `honda-oki-butt-dash`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | H百貫 +23 |
| Action | dash > light / normal throw / 大銀杏 |
| Goal | 同一モーションからの三択。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source +4 claim |
| Opponent / response | Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `76bb64f0-e02b-412b-9473-c22a8082ffff` (patch_context); `e706af71-84a8-48c0-90d0-48b15d3791a9` (supporting)。

#### setup — 端・固有候補 — 強頭突き後強P消費

Record: `899e8849-6221-4b95-8786-499dc0458806` / `honda-oki-headbutt-framekill`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | cannon > H頭突き +45 |
| Action | 2HP whiff > 5MP meaty |
| Goal | 強P空振りから中P持続。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source hit +9/block +4 claim |
| Opponent / response | Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `76bb64f0-e02b-412b-9473-c22a8082ffff` (patch_context); `e706af71-84a8-48c0-90d0-48b15d3791a9` (supporting)。

### ディージェイ / dee-jay

#### combo — 基本 — 小技中ソバット

Record: `7812eab2-6764-437a-b7b3-e7edce06dd7a` / `deejay-light-sobat`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LP x3 > Mクイックローリングソバット |
| Starter | 2LP |
| Hit condition | legacy candidate; SA3可 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 小技確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `39076175-1aaa-4272-87ae-7010067b2970` (supporting); `e7b15dec-13b4-454f-b776-707c167f3650` (patch_context)。

#### combo — Drive候補 — DR小足強ソバット

Record: `6bab57c6-a182-4256-ab59-50438675e4ac` / `deejay-dr-low`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 2LK > 2MP > Hソバット |
| Starter | DR 2LK |
| Hit condition | legacy candidate |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 下段択 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `d3d3f822-82e7-4d32-ae69-8cd59e019322` (supporting); `e7b15dec-13b4-454f-b776-707c167f3650` (patch_context)。

#### combo — SA候補 — 強PパニカンSA3

Record: `81b430dc-ee22-4637-b7f0-da4d6840594e` / `deejay-2hp-pc-sa3`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2HP(PC) > 5HP > Mマシンガンアッパー > SA3 |
| Starter | 2HP punish counter |
| Hit condition | legacy candidate; legacy damage claim 5400 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 無敵反撃 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `39076175-1aaa-4272-87ae-7010067b2970` (supporting); `e7b15dec-13b4-454f-b776-707c167f3650` (patch_context)。

#### setup — 起き攻め候補 — 強ジャック前ステ2回

Record: `ab354ee0-2cff-4826-a17b-3446e4b4716c` / `deejay-oki-hjack`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | Hジャック ground hit |
| Action | dash x2 > strike / throw |
| Goal | legacy candidate; 先端距離確認 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | +4 claim |
| Opponent / response | Verify rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `46794c7d-6ad3-4cdb-a190-45be80673f99` (supporting); `d3d3f822-82e7-4d32-ae69-8cd59e019322` (supporting); `e7b15dec-13b4-454f-b776-707c167f3650` (patch_context)。

#### setup — 端・固有候補 — 端前投げ持続中段

Record: `df49949e-8ca7-4e31-99c9-9b8ee5f830cb` / `deejay-oki-corner-throw`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner forward throw |
| Action | 5LP whiff > 6MK meaty / throw / shimmy |
| Goal | legacy candidate |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | +3 block claim |
| Opponent / response | Verify rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `d3d3f822-82e7-4d32-ae69-8cd59e019322` (supporting); `e7b15dec-13b4-454f-b776-707c167f3650` (patch_context)。

### マノン / manon

#### combo — 基本 — レベランスデガジェ

Record: `cdda45f9-9dca-4815-b582-4e7d1cd9e93c` / `manon-basic-degage`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 4HP > L/Mデガジェ |
| Starter | 4HP |
| Hit condition | legacy candidate |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 基本確反 |

未確認: drive_cost, sa_cost, side_requirement, recipe_branch_or_strength, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `8b18513d-5853-4fac-9d96-4cbbe9dcab6b` (supporting); `d9a4184e-fe63-4e0f-8082-c7431212a7c2` (patch_context)。

#### combo — Drive候補 — グラン・フェッテPC追撃

Record: `4213a325-5c17-447c-87fd-343197f46d62` / `manon-exp-grand-pc-dr-renverse`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | グラン・フェッテ(PC) > DR 5MK > Mランヴェルセ |
| Starter | グラン・フェッテ punish counter |
| Hit condition | legacy candidate; normal Grand Fouette punish counter; current patch capture required. |
| Position | any |
| Drive requirement | 1 |
| SA requirement | 0 |
| Side | UNCONFIRMED |
| Purpose | 弾抜けパニカンからメダルを獲得する。 |

未確認: side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `53f05c3b-20bb-4619-bb4a-ae21d2fd7cee` (supporting); `d9a4184e-fe63-4e0f-8082-c7431212a7c2` (patch_context)。

#### combo — SA候補 — トモエPC SA1

Record: `6b109b41-780d-44ab-9462-5ff9dc99924a` / `manon-3hk-pc-sa1-y4`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 3HK(PC) > SA1 |
| Starter | 3HK punish counter |
| Hit condition | fixed knockdown |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 現行入れ替えSA1 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `d9a4184e-fe63-4e0f-8082-c7431212a7c2` (supporting)。

#### setup — 起き攻め候補 — 強ロンポワンDR下段

Record: `ddcf4f25-c173-489e-bbef-708982355350` / `manon-oki-h-rond-low`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | Hロンポワン hit |
| Action | delayed DR 2MK |
| Goal | 最速は空振り |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | timing dependent |
| Opponent / response | Verify rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `53f05c3b-20bb-4619-bb4a-ae21d2fd7cee` (supporting); `d9a4184e-fe63-4e0f-8082-c7431212a7c2` (patch_context)。

#### setup — 端・固有候補 — 中デガジェ弱コマ投げ

Record: `747e33ef-fb6c-4fbd-be6d-c6e78c1f058b` / `manon-oki-degage-throw-y4`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | Mデガジェ hit |
| Action | dash > immediate Lマネージュドレ |
| Goal | 持続3F化で待ち不要候補 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | current claim |
| Opponent / response | Verify rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `d9a4184e-fe63-4e0f-8082-c7431212a7c2` (supporting)。

### マリーザ / marisa

#### combo — 基本 — しゃがみ中P中グラディウス

Record: `a654b915-e0f2-43f2-bd15-19a809bd88bf` / `marisa-p25d-2mp-mgradius`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > Mグラディウス |
| Starter | 2MP |
| Hit condition | No Drive or SA. |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 牽制ヒット時の簡易締め |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `4858dca0-5ffc-4b6b-8b36-6f3dfff5a5ee` (patch_context); `64e8e70f-7de0-4de6-9a29-64ea3eb68a9e` (supporting)。

#### combo — Drive候補 — DR中段弱ディマ

Record: `3f744af3-f5e3-443b-9343-338b1e1f5b0c` / `marisa-dr-overhead`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 3HP > 2LP x2 > Lディマ~6P |
| Starter | DR 3HP |
| Hit condition | current written |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中段択 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `4858dca0-5ffc-4b6b-8b36-6f3dfff5a5ee` (patch_context); `64e8e70f-7de0-4de6-9a29-64ea3eb68a9e` (supporting)。

#### combo — SA候補 — 生ラッシュ中段SA3

Record: `a74d9d52-ac46-4d36-af75-0ef58285d308` / `marisa-p25d-dr-overhead-sa3`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 3HP > 2LP > SA3 |
| Starter | DR 3HP |
| Hit condition | Drive1 + SA3. |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中段リーサル |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `4858dca0-5ffc-4b6b-8b36-6f3dfff5a5ee` (patch_context); `64e8e70f-7de0-4de6-9a29-64ea3eb68a9e` (supporting)。

#### setup — 起き攻め候補 — 弱ディマDR択

Record: `93852e68-8770-40ef-b728-63d86dc8bdf0` / `marisa-oki-ldimach-dr`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | Lディマ hit |
| Action | DR charged 4HP |
| Goal | ラッシュ溜め4HP。通常投げ・エンフォルド分岐はmarisa-p25d-ldimach-dr-throw-scutumで管理。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | unknown |
| Opponent / response | Verify rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `1cfa7793-0511-455e-aa2d-0092676b776e` (supporting); `4858dca0-5ffc-4b6b-8b36-6f3dfff5a5ee` (patch_context)。

#### setup — 端・固有候補 — 旧端後ろ投げ前ステ前強K

Record: `f32236ff-979a-47e7-9330-85a0e2dc5c36` / `marisa-legacy-backthrow-dash-6hk`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner back throw |
| Action | dash > 6HK |
| Goal | 旧版後ろ投げ起き攻め。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | unknown |
| Opponent / response | 2026現行成立を確認。 |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `4858dca0-5ffc-4b6b-8b36-6f3dfff5a5ee` (patch_context); `d69862a2-0091-46c1-96ec-7d4de87cec7c` (supporting)。

### JP / jp

#### combo — 基本 — 5MK基本 1800

Record: `ff37ae97-6366-467e-8cef-b3493435e00d` / `jp-canon-5mk-1800`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5MK > 中ストリボーグ |
| Starter | 5MK |
| Hit condition | 中央 |
| Position | any |
| Drive requirement | 0 |
| SA requirement | 0 |
| Side | UNCONFIRMED |
| Purpose | 中攻撃からの安定択 |

未確認: side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0703633f-45c9-4e39-bf97-7dd502741a75` (patch_context); `1409a536-105b-4282-87c8-ae0a4606930a` (patch_context); `e829af82-3473-4eea-a3b1-9054c4df39e4` (supporting)。

#### combo — Drive候補 — DR中K始動 SA3

Record: `797eda8e-1075-4547-830e-11d4037e1d8c` / `jp-dr-mk-sa3`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR > 5MK > 5MP > 中ストリボーグ > SA3 ザプリェット |
| Starter | DR 5MK |
| Hit condition | Drive Rush / SA3 |
| Position | any |
| Drive requirement | 1 |
| SA requirement | 3 |
| Side | UNCONFIRMED |
| Purpose | ラッシュ始動リーサル |

未確認: side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `1409a536-105b-4282-87c8-ae0a4606930a` (patch_context); `156adc78-e4ce-47a5-9764-1666ea5b24b2` (candidate)。

#### combo — SA候補 — 5HPパニカン SA3 4780

Record: `56966232-bcc5-447d-a25e-85b41fe4b468` / `jp-canon-5hp-pc-sa3-4780`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5HP(PC) > 強ストリボーグ > 中トルバラン > 強トリグラフ > SA3 |
| Starter | 5HP PC |
| Hit condition | Punish Counter / SA3 |
| Position | any |
| Drive requirement | 0 |
| SA requirement | 3 |
| Side | UNCONFIRMED |
| Purpose | 差し返しパニカンからSA3 |

未確認: side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `0703633f-45c9-4e39-bf97-7dd502741a75` (patch_context); `1409a536-105b-4282-87c8-ae0a4606930a` (patch_context); `e829af82-3473-4eea-a3b1-9054c4df39e4` (supporting)。

#### setup — 起き攻め候補 — DIパニカン後ヴィーハト +15F

Record: `bae99ed3-9530-4121-9eaf-3ebf2ef6330b` / `jp-vihhat-plus15-after-di-pc`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | DI punish counter |
| Action | 垂直JHK > ディレイ5HK > 中ストリボーグ > 5HP > ヴィーハト |
| Goal | 設置を残して起き攻めへ移行する候補。 |
| Position | any |
| Meter | Drive 1+ |
| Frame claim (未検証) | +15F |
| Opponent / response | 受け身・距離・設置位置をトレモで再確認。 |

未確認: exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `1409a536-105b-4282-87c8-ae0a4606930a` (patch_context); `156adc78-e4ce-47a5-9764-1666ea5b24b2` (candidate)。

#### setup — 端・固有候補 — DI壁やられ後 +42F詐欺飛び

Record: `82b139f6-9619-4d39-af54-fa9ff00060c7` / `jp-safejump42-after-di-wall`; DB draft / reviewed; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | DI wall splat |
| Action | 5MP > 5HK > 中ストリボーグ > 5HP > 中ストリボーグ > 前ジャンプ攻撃 |
| Goal | 壁やられからの詐欺飛び候補。 |
| Position | corner |
| Meter | Drive 1+ |
| Frame claim (未検証) | +42F |
| Opponent / response | Current patch verification pending. |

未確認: exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `1409a536-105b-4282-87c8-ae0a4606930a` (patch_context); `156adc78-e4ce-47a5-9764-1666ea5b24b2` (candidate)。

### ザンギエフ / zangief

#### combo — 基本 — しゃがみ小P2回ラリアット

Record: `880ec635-27e9-4dd7-bc57-5c3a9ecf87d1` / `zangief-y4-2lp2-lariat`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LP x2 > Double Lariat |
| Starter | 2LP |
| Hit condition | Spacing-sensitive. |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 4F暴れ確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `898d77d3-b877-4a72-89f2-837bb7823654` (supporting); `f9e6d6a3-a3c8-44b6-87f5-8ddf125c7932` (patch_context)。

#### combo — Drive候補 — 小足小P ODラリアット

Record: `7e6eb06f-b33a-4347-be76-567e3df6634d` / `zangief-y4-2lk-lp-od-lariat`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LK > 5LP > OD Double Lariat |
| Starter | 2LK |
| Hit condition | Drive2; Source +38 claim. |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 小技起き攻め |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `87d05dc1-17af-433e-bbf0-ccb3d3385870` (supporting); `f9e6d6a3-a3c8-44b6-87f5-8ddf125c7932` (patch_context)。

#### combo — SA候補 — 小技ODラリアットSA2

Record: `0004fb88-33e8-429b-b62a-36219c0e5880` / `zangief-y4-light-od-lariat-sa2`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LK > 5LP > OD Double Lariat > SA2 |
| Starter | 2LK |
| Hit condition | Drive2 + SA2. |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 小技SA2簡易 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `87d05dc1-17af-433e-bbf0-ccb3d3385870` (supporting); `f9e6d6a3-a3c8-44b6-87f5-8ddf125c7932` (patch_context)。

#### setup — 起き攻め候補 — ラリアット+27 DR大足

Record: `67a1a021-9195-4c11-8859-b0b94cd2c382` / `zangief-y4-lariat27-dr-sweep`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | Double Lariat +27 |
| Action | DR 2HK |
| Goal | 距離が遠い時のハードダウン狙い。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source +27 claim |
| Opponent / response | Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `87d05dc1-17af-433e-bbf0-ccb3d3385870` (supporting); `f9e6d6a3-a3c8-44b6-87f5-8ddf125c7932` (patch_context)。

#### setup — 端・固有候補 — 端ラリアット歩き強スクリュー

Record: `7efe08d3-0093-42c8-97a9-b1b4e61cbfd1` / `zangief-y4-lariat27-corner-spd`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | Double Lariat +27 |
| Action | walk > H SPD |
| Goal | 端で投げ間合いまで歩く。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Throw branch |
| Opponent / response | Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `87d05dc1-17af-433e-bbf0-ccb3d3385870` (supporting); `f9e6d6a3-a3c8-44b6-87f5-8ddf125c7932` (patch_context)。

### リリー / lily

#### combo — 基本 — 屈強P中ウインド

Record: `955a1a0c-fb49-4737-88d6-4858b239cf80` / `lily-y4-2hp-mwind`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2HP > M Condor Wind |
| Starter | 2HP |
| Hit condition | Two-hit confirm; DI can interrupt on block. |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 主力風回収 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `1e902b4f-cddd-4b7c-8cd3-89f0a563a85d` (supporting); `8a4c99c2-8f5e-47a5-ab46-8449cc1f8596` (patch_context)。

#### combo — Drive候補 — 立中K ODウインド

Record: `f3bc43c1-7ff7-48cf-90a9-a89b73adc0d1` / `lily-y4-5mk-od-wind`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5MK > OD Condor Wind |
| Starter | 5MK |
| Hit condition | Drive2 and stock gain. |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 風回収 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `66d3df30-5674-4d9e-8a30-4793ce86bee5` (supporting); `8a4c99c2-8f5e-47a5-ab46-8449cc1f8596` (patch_context)。

#### combo — SA候補 — 屈強P中ウインドSA3

Record: `e9f8b087-49c0-4890-a05d-92bcaee2ebaf` / `lily-y4-2hp-mwind-sa3`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2HP > M Condor Wind > SA3 |
| Starter | 2HP |
| Hit condition | SA3. |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 主力SA3 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `1e902b4f-cddd-4b7c-8cd3-89f0a563a85d` (supporting); `8a4c99c2-8f5e-47a5-ab46-8449cc1f8596` (patch_context)。

#### setup — 起き攻め候補 — コマ投げ後弱ウインド

Record: `ced8969c-acb5-4474-8c60-7ec370f093f4` / `lily-y4-command-throw-wind-charge`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | Mexican Typhoon hit |
| Action | L Condor Wind charge |
| Goal | 距離を利用して風回収。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | No guaranteed oki claim |
| Opponent / response | Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `5532eb66-b2e9-4e33-b87c-9ffdba9a3ee9` (supporting); `8a4c99c2-8f5e-47a5-ab46-8449cc1f8596` (patch_context)。

#### setup — 端・固有候補 — 端前投げ微歩き4強P

Record: `ab91e55b-f421-4724-9ad5-903d96f48d74` / `lily-y4-corner-forward-throw-4hp`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner forward throw |
| Action | micro-walk > 4HP(meaty) |
| Goal | 打撃重ね。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Manual timing required |
| Opponent / response | Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `66d3df30-5674-4d9e-8a30-4793ce86bee5` (supporting); `8a4c99c2-8f5e-47a5-ab46-8449cc1f8596` (patch_context)。

### キャミィ / cammy

#### combo — 基本 — 屈強P屈中P強アロー

Record: `7e447da3-f9b2-438b-9296-4cb791fabb0b` / `cammy-y4-2hp-2mp-harrow`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2HP > 2MP > H Spiral Arrow |
| Starter | 2HP |
| Hit condition | 記事記載2100。現行値は撮影。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 持続重ね基本 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `75600d2f-fa52-48d2-821f-d910f1809a8d` (patch_context); `fa7f1f71-3512-439a-bce1-9fd4f58d5177` (supporting)。

#### combo — Drive候補 — 端ODアロー強スパイク

Record: `1e10ef56-ab09-4d97-afbd-8e28d4e321b9` / `cammy-y4-corner-od-arrow-spike`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | OD Spiral Arrow > H Cannon Spike |
| Starter | OD Spiral Arrow |
| Hit condition | 位置と向きを確認。 |
| Position | corner |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 入れ替え・追撃 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `1ede77fc-2835-451f-b5c7-f3977ad99b66` (supporting); `75600d2f-fa52-48d2-821f-d910f1809a8d` (patch_context)。

#### combo — SA候補 — 小技ラッシュTC SA3

Record: `13ca5cc9-8a96-472f-890e-aa3ec0fb5672` / `cammy-y4-light-cdr-target-sa3`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5LP/5LK > CDR 5LP > 5HP > 4MP~HK > SA3 |
| Starter | light hit |
| Hit condition | Drive3+SA3。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 小技SA3 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `75600d2f-fa52-48d2-821f-d910f1809a8d` (patch_context); `fa7f1f71-3512-439a-bce1-9fd4f58d5177` (supporting)。

#### setup — 起き攻め候補 — 強ナックル+3連携

Record: `fa07956b-38e1-448d-bb1b-d2a9143954eb` / `cammy-y4-hknuckle-plus3`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | H Spin Knuckle guard |
| Action | 5MP/throw/block |
| Goal | 打撃投げと無敵待ち。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Official frame must be checked |
| Opponent / response | Verify both rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `75600d2f-fa52-48d2-821f-d910f1809a8d` (patch_context); `8b2bffb7-cc54-46ca-bc13-6af234e136e3` (supporting)。

#### setup — 端・固有候補 — 端中アロー小足空振り屈強P

Record: `f37cf6ee-6d23-410f-80e3-50476a4680ef` / `cammy-y4-corner-marrow-whiff-2lk`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner M Spiral Arrow |
| Action | whiff 2LK > 2HP(meaty) |
| Goal | 端専用フレーム消費。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source guard +4 claim |
| Opponent / response | Verify both rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `3824cfe8-ccd9-4a51-8a9a-2dbc926273f3` (supporting); `75600d2f-fa52-48d2-821f-d910f1809a8d` (patch_context)。

### ラシード / rashid

#### combo — 基本 — 強P中イーグル

Record: `63fe0e63-e0d9-4ab5-b0fe-2da4cf26f72d` / `rashid-y4-5hp-meagle`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5HP > M Eagle Spike |
| Starter | 5HP |
| Hit condition | 起き攻め優先。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 強P運び |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `382e9e86-67d4-4961-9fe7-70e8562d06a1` (supporting); `5d50633d-9fc8-4855-a0b8-535c687c8f04` (patch_context)。

#### combo — Drive候補 — ラッシュ小足弱イーグル

Record: `bea4f705-1042-4034-a4b1-bd31903cd0e3` / `rashid-y4-dr-2lk-2mk-leagle`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 2LK > 2MK > L Eagle Spike |
| Starter | DR 2LK |
| Hit condition | Drive1。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 生ラ下段 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `5d50633d-9fc8-4855-a0b8-535c687c8f04` (patch_context); `f9caead3-13e8-4b0b-a6ce-303dd38f4da5` (supporting)。

#### combo — SA候補 — 強P強サイクロンSA1

Record: `f10a5256-9d2b-4b62-99a4-ca4c818de5fa` / `rashid-y4-5hp-hcyclone-sa1`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5HP > H Arabian Cyclone > Assault Roll > SA1 |
| Starter | 5HP |
| Hit condition | SA1。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 省Drive SA1 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `382e9e86-67d4-4961-9fe7-70e8562d06a1` (supporting); `5d50633d-9fc8-4855-a0b8-535c687c8f04` (patch_context)。

#### setup — 起き攻め候補 — 弱イーグル遅らせ中段

Record: `13f26ae6-319b-4734-acee-1109a5519664` / `rashid-y4-leagle30-delay6hp`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | L Eagle Spike ground hit |
| Action | DR > delayed 6HP |
| Goal | 中段重ね。 |
| Position | midscreen |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Timing claim |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `5d50633d-9fc8-4855-a0b8-535c687c8f04` (patch_context); `f57a7880-e9ca-40ed-9864-94a7069cfe3f` (supporting)。

#### setup — 端・固有候補 — 端前投げ柔道

Record: `3ef092d7-8c10-485e-9a3f-1a0520b279e9` / `rashid-y4-corner-throw-loop`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner forward throw |
| Action | dash > throw / 5LP / shimmy |
| Goal | 現行投げ後フレームを確認。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source +27 legacy claim |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `254bbb7c-cc20-4114-b6ad-7f3583a042cc` (supporting); `5d50633d-9fc8-4855-a0b8-535c687c8f04` (patch_context)。

### A.K.I. / aki

#### combo — 基本 — 中足小K強蛇頭鞭

Record: `b985f521-abfd-4c47-86af-c2216471926b` / `aki-y4-2mk-5lk-hwhip`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MK > 5LK > H Serpent Lash |
| Starter | 2MK close hit |
| Hit condition | NH+5記事記載。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 下段基本 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `1dc0d502-7002-4550-aa9f-9577b68b5aa0` (supporting); `38688514-891f-464e-b4f5-a70b1e9c3b65` (patch_context)。

#### combo — Drive候補 — OD凶襲突毒付与

Record: `5224c4e2-85fa-4c10-a87f-5a9282571fe9` / `aki-y4-od-cruelfate-hkd`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | OD Cruel Fate ground hit > hard knockdown |
| Starter | OD Cruel Fate |
| Hit condition | 方向入力による飛距離。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 奇襲毒付与 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `1dc0d502-7002-4550-aa9f-9577b68b5aa0` (supporting); `38688514-891f-464e-b4f5-a70b1e9c3b65` (patch_context)。

#### combo — SA候補 — 中鞭破裂SA

Record: `b4af16c8-ca02-434a-9ebc-de0931d98390` / `aki-y4-poison-mwhip-sa`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | M Lash burst > 6HP/2HK > SA1/SA2/SA3 |
| Starter | poisoned opponent |
| Hit condition | 各SAを撮影。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 無Drive SA |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `38688514-891f-464e-b4f5-a70b1e9c3b65` (patch_context); `9034978d-0918-4e46-99e7-50b060a70777` (supporting)。

#### setup — 起き攻め候補 — OD凶襲突ガード+2

Record: `fd6b6139-d4b0-48e5-b276-a5aaed97c096` / `aki-y4-od-cruelfate-plus2`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | OD Cruel Fate guard |
| Action | 5LP/throw/block |
| Goal | 高度・方向別。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source +2 claim |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `1dc0d502-7002-4550-aa9f-9577b68b5aa0` (supporting); `38688514-891f-464e-b4f5-a70b1e9c3b65` (patch_context)。

#### setup — 端・固有候補 — 毒破裂+35端持続中P

Record: `06e78184-7a71-4f84-869e-416bb55d3b5a` / `aki-y4-poisonburst35`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | delayed Fang > L Lash ender +35 |
| Action | whiff 2LK > DR 5MP latest active |
| Goal | 最持続と投げ距離。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source +35 claim |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `38688514-891f-464e-b4f5-a70b1e9c3b65` (patch_context); `9034978d-0918-4e46-99e7-50b060a70777` (supporting)。

### エド / ed

#### combo — 基本 — 屈中P強ブリッツ

Record: `cf986a1f-905c-4503-a44e-83fd27c15ad4` / `ed-y4-2mp-hblitz`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > H Psycho Blitz |
| Starter | 2MP |
| Hit condition | 距離確認。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中P基本 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `8e7af01c-4b8e-4b36-a418-86104bffe8fb` (patch_context); `f42d8a5d-6c09-48af-a9eb-739b0a86f95f` (supporting)。

#### combo — Drive候補 — ラッシュ小P中P強ブリッツ

Record: `021a2d3f-a127-44c9-850c-114c8ac7eef5` / `ed-y4-dr-lp-mp-hblitz`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 5LP > 5MP > 5HP > H Blitz |
| Starter | DR 5LP |
| Hit condition | Drive1。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 生ラ基本 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `5f3d74bb-7b39-4b43-91f2-7655f82f820c` (supporting); `8e7af01c-4b8e-4b36-a418-86104bffe8fb` (patch_context)。

#### combo — SA候補 — 中央SA2基礎

Record: `94f43dcf-2418-42e4-ac2c-ee503f40e616` / `ed-y4-sa2-central`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | OD Blitz > SA2 > H Upper > 6HP > H Upper |
| Starter | OD Blitz hit |
| Hit condition | 球の当て方と+42。 |
| Position | midscreen |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中央SA2 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `26da6fcf-2ec8-42bb-bd9f-613ce2d0b2a2` (supporting); `8e7af01c-4b8e-4b36-a418-86104bffe8fb` (patch_context)。

#### setup — 起き攻め候補 — 屈中K持続重ね

Record: `68977684-b970-4a84-9536-7efbeb018018` / `ed-y4-meaty-2mk`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | specified knockdown |
| Action | 2MK(meaty) > 2MK / 5HP(CH) |
| Goal | Dリバ詐欺候補。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Hit +9 / guard 0 claim |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `4a8b01d6-ad41-4065-bf96-45ed5d5340d6` (supporting); `8e7af01c-4b8e-4b36-a418-86104bffe8fb` (patch_context)。

#### setup — 端・固有候補 — 端前投げ択

Record: `2d1b914c-2f44-46dd-9bba-b095dfd4e25a` / `ed-y4-corner-throw`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner forward throw |
| Action | walk throw / 5MP / shimmy |
| Goal | 柔道可否。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Manual timing |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `168fddee-7a91-4a0c-9ba8-d77e20f2e1ec` (supporting); `8e7af01c-4b8e-4b36-a418-86104bffe8fb` (patch_context)。

### 豪鬼 / akuma

#### combo — 基本 — 中足弱豪波動

Record: `daaf1328-cf5b-4546-a014-1974a7981818` / `akuma-y4-2mk-lfireball`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MK > L Gou Hadoken |
| Starter | 2MK |
| Hit condition | 間合いと反撃。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中足確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `c25ef64b-e50e-419b-bac3-921b074ac1bd` (patch_context); `ecf0d16f-7172-4143-97d9-3a2c789a698e` (supporting)。

#### combo — Drive候補 — ラッシュ下段強竜巻

Record: `a1748bc2-3368-45e7-a40a-56597b1904d9` / `akuma-y4-dr-2lk-5mk-htatsu`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 2LK > 5MK > H Tatsumaki |
| Starter | DR 2LK |
| Hit condition | 強竜巻の位置。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 下段始動 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `55c16e77-9ad3-48a6-b010-67477d6bbd85` (supporting); `c25ef64b-e50e-419b-bac3-921b074ac1bd` (patch_context)。

#### combo — SA候補 — SA1締め

Record: `b1b10ec4-bfb0-488b-a089-a269a564a7f8` / `akuma-y4-sa1-basic`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > 2MP > M Adamant Flame > SA1 |
| Starter | 2MP |
| Hit condition | キャンセル可否。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | SA1リーサル |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `c25ef64b-e50e-419b-bac3-921b074ac1bd` (patch_context); `f29d79a0-7686-4e31-a73b-530517beafb8` (supporting)。

#### setup — 起き攻め候補 — 中金剛起き攻め

Record: `b5e44304-2659-433d-a52e-66c6cbacf3a5` / `akuma-y4-madamant-oki`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | M Adamant Flame knockdown |
| Action | dash > 5MP / throw / shimmy |
| Goal | 距離別。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Route-specific |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `03ac6c9e-195b-440c-89f7-7acfe32a10ff` (supporting); `c25ef64b-e50e-419b-bac3-921b074ac1bd` (patch_context)。

#### setup — 端・固有候補 — 端前投げ柔道

Record: `257cd824-5dba-4510-9430-45a4fc5939ae` / `akuma-y4-forwardthrow-corner`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner forward throw |
| Action | walk throw / 5MP / shimmy |
| Goal | 投げ間合いとバクステ。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Manual timing |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `03ac6c9e-195b-440c-89f7-7acfe32a10ff` (supporting); `c25ef64b-e50e-419b-bac3-921b074ac1bd` (patch_context)。

### ベガ / m-bison

#### combo — 基本 — 強P強フィスト

Record: `df87bd15-a01a-4344-ae78-7327fd2c2e54` / `bison-y4-5hp-hbackfist`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5HP > H Backfist Combo |
| Starter | 5HP |
| Hit condition | 間合い。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | マイン付与基本 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `7a918cef-f7f4-4d4a-980a-87ea860e92b8` (patch_context); `c9ccf16c-f6f7-4289-ab55-e0912adda633` (supporting)。

#### combo — Drive候補 — ラッシュ中段ニー

Record: `77144086-8ff1-4498-913f-62e77693a2c5` / `bison-y4-dr-6hp-2mp`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 6HP > 2MP > M Double Knee Press |
| Starter | DR 6HP |
| Hit condition | 持続段階。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中段始動 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `47fdfc71-d217-403b-ab56-0e8d4564386b` (supporting); `7a918cef-f7f4-4d4a-980a-87ea860e92b8` (patch_context)。

#### combo — SA候補 — SA1締め

Record: `e6b1c7c8-9937-40f3-9d9c-faabe73a473d` / `bison-y4-sa1-basic`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > M Double Knee Press > SA1 |
| Starter | 2MP |
| Hit condition | キャンセル窓。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | SA1リーサル |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `7a918cef-f7f4-4d4a-980a-87ea860e92b8` (patch_context); `c9ccf16c-f6f7-4289-ab55-e0912adda633` (supporting)。

#### setup — 起き攻め候補 — デビリバ有利攻め

Record: `53067af2-6de1-4530-8a2e-c8829c7165fb` / `bison-y4-devilreverse-plus`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | Devil Reverse guard |
| Action | 5MP / throw / backstep bait |
| Goal | 高度別有利。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Height-dependent plus |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `7a918cef-f7f4-4d4a-980a-87ea860e92b8` (patch_context); `7d89c655-62d7-4a53-8a2f-34f8d1e41589` (supporting)。

#### setup — 端・固有候補 — 端前投げ柔道

Record: `6cf6faee-b68e-4955-b0be-107cf6e59be6` / `bison-y4-forwardthrow-corner`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner forward throw |
| Action | walk throw / 5MP / 4HK shimmy |
| Goal | 投げ間合い。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Manual timing |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `7a918cef-f7f4-4d4a-980a-87ea860e92b8` (patch_context); `c9ccf16c-f6f7-4289-ab55-e0912adda633` (supporting)。

### テリー / terry

#### combo — 基本 — 屈中P中バーン

Record: `c04450ba-00e7-4cc8-8615-3ef5a9277ffb` / `terry-y4-2mp-mburn`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > M Burn Knuckle |
| Starter | 2MP |
| Hit condition | 間合い。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中技基本 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `b73b8645-c8de-4ba6-810c-7d9a11b62e18` (patch_context); `dc038442-5db7-47c6-ab29-6ddee9d162ec` (supporting)。

#### combo — Drive候補 — 屈中P ODチャージ

Record: `ad3a06a0-6203-41db-94fb-a1cf3ca42ca7` / `terry-y4-2mp-odcharge-hburn`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > OD Power Charge > H Burn Knuckle |
| Starter | 2MP |
| Hit condition | 位置。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | Drive2運び |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `b73b8645-c8de-4ba6-810c-7d9a11b62e18` (patch_context); `dc038442-5db7-47c6-ab29-6ddee9d162ec` (supporting)。

#### combo — SA候補 — 小技SA1

Record: `c13dfb3d-91a0-4ccd-b287-3d8b298c5fb5` / `terry-y4-sa1-light`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LP x2 > CDR 2LP > 2HP > M Power Charge > SA1 |
| Starter | 2LP |
| Hit condition | Drive3。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | SA1リーサル |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `b73b8645-c8de-4ba6-810c-7d9a11b62e18` (patch_context); `dc038442-5db7-47c6-ab29-6ddee9d162ec` (supporting)。

#### setup — 起き攻め候補 — その場受け身前ステ+3

Record: `cb229e41-b8f0-4e43-978d-9e502ea19fe4` / `terry-y4-throw22-step`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | forward throw +22 |
| Action | dash > throw / lights / shimmy |
| Goal | 中央はその場受け身限定、端は密着。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source +3 |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `80f85e75-5576-4032-bdab-ad21f295e282` (supporting); `b73b8645-c8de-4ba6-810c-7d9a11b62e18` (patch_context)。

#### setup — 端・固有候補 — 入れ替え強バーン持続

Record: `b34921cd-6f2c-444a-916e-211ef58fa941` / `terry-y4-side-switch35-burn`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner-back DI side-switch +35 |
| Action | H Burn Knuckle meaty |
| Goal | 持続位置。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source guard +5 claim |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `b73b8645-c8de-4ba6-810c-7d9a11b62e18` (patch_context); `dc038442-5db7-47c6-ab29-6ddee9d162ec` (supporting)。

### 不知火舞 / mai

#### combo — 基本 — 中P強忍蜂

Record: `352bbfee-3a55-4f22-bb68-30da239e079b` / `mai-y4-mp-hshinobi`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5MP > H Shinobi Bachi |
| Starter | 5MP |
| Hit condition | 記事+22。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中技基本 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `596218a4-cc7b-4c44-b7f6-345ae7637fa7` (patch_context); `782ced8c-8b08-4eea-93c2-169a03e49c3a` (supporting)。

#### combo — Drive候補 — ラッシュ中段+42

Record: `e7943c48-b0b8-4ff4-9bc7-14c20c71dcf7` / `mai-y4-dr-overhead-lktc`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 6MP > 5LK~LK~LK > Musasabi |
| Starter | DR 6MP |
| Hit condition | 記事+42。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 中段始動 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `596218a4-cc7b-4c44-b7f6-345ae7637fa7` (patch_context); `782ced8c-8b08-4eea-93c2-169a03e49c3a` (supporting)。

#### combo — SA候補 — SA1焔獲得

Record: `ec8602e2-6a09-43c2-9c6a-c8c3533abac6` / `mai-y4-sa1-basic`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP(PC) > 5HP > OD Ryuuenbu > SA1 |
| Starter | 2MP punish counter |
| Hit condition | Year4中央可否。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | SA1・焔獲得 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `596218a4-cc7b-4c44-b7f6-345ae7637fa7` (patch_context); `782ced8c-8b08-4eea-93c2-169a03e49c3a` (supporting)。

#### setup — 起き攻め候補 — 強忍蜂インパクト重ね

Record: `e0428918-7c5f-46d1-8721-653582503438` / `mai-y4-hshinobi-di`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | H Shinobi ground hit |
| Action | Drive Impact meaty |
| Goal | 無敵・SA回答。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Covered claim |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `3f87f53d-0911-4f7d-a376-9b1980bfb147` (supporting); `596218a4-cc7b-4c44-b7f6-345ae7637fa7` (patch_context)。

#### setup — 端・固有候補 — 端中龍炎舞+35

Record: `0c9efd53-973a-4a71-840f-94c9591d918b` / `mai-y4-corner-mryuen35`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner M Ryuuenbu hit |
| Action | whiff 5LK > 6MP meaty |
| Goal | 持続中段。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source hit +4 claim |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `3f87f53d-0911-4f7d-a376-9b1980bfb147` (supporting); `596218a4-cc7b-4c44-b7f6-345ae7637fa7` (patch_context)。

### エレナ / elena

#### combo — 基本 — 前強PTC

Record: `7d7bedf3-d48b-49b6-962a-52069d078e9f` / `elena-y4-6hp-target`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 6HP~HP~HP |
| Starter | 6HP |
| Hit condition | 記事+40。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 差し込み |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `69151330-9319-4659-99fa-78bb982ef008` (supporting); `b44be282-0e1b-412a-9f0e-0ce4e68d370b` (patch_context)。

#### combo — Drive候補 — ラッシュ中足中KTC

Record: `4c4ae2f5-eb9f-4f21-aab7-00e92998c88b` / `elena-y4-dr-low-mktc`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 2MK > 5MK~HK > M Spin Scythe |
| Starter | DR 2MK |
| Hit condition | 現行中足調整。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 下段始動 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `b44be282-0e1b-412a-9f0e-0ce4e68d370b` (patch_context); `ecbe61c5-4ad1-489a-a4ed-69b011949760` (supporting)。

#### combo — SA候補 — 屈中P ODムーンSA2

Record: `12a44709-6f55-436b-bfad-31c025bb63b8` / `elena-y4-2mp-odmoon-sa2`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > OD Moon Glide > SA2 |
| Starter | 2MP |
| Hit condition | 補正。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 4000候補 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `69151330-9319-4659-99fa-78bb982ef008` (supporting); `b44be282-0e1b-412a-9f0e-0ce4e68d370b` (patch_context)。

#### setup — 起き攻め候補 — 弱スピン+34前ステ前強P

Record: `5def8e3a-0acd-4973-b029-020f3a9ac016` / `elena-y4-lspin34-dash6hp`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | L Spin Scythe +34 |
| Action | dash > 6HP meaty |
| Goal | TC確認。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source +14 after dash |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `69151330-9319-4659-99fa-78bb982ef008` (supporting); `b44be282-0e1b-412a-9f0e-0ce4e68d370b` (patch_context)。

#### setup — 端・固有候補 — 端+36弱リンク消費

Record: `b46cf223-9419-4a06-845e-787b3479d4ae` / `elena-y4-corner-plus36-lynx`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner L Scratch/Rhino ender +36 |
| Action | L Lynx(+8) > 5MK(meaty) |
| Goal | 投げ間合い・シミー。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source guard +4 hit +8 claim |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `69151330-9319-4659-99fa-78bb982ef008` (supporting); `b44be282-0e1b-412a-9f0e-0ce4e68d370b` (patch_context)。

### サガット / sagat

#### combo — 基本 — タイガースティング

Record: `c47a5916-35c0-4dee-b51d-126d7c4cfd7e` / `sagat-y4-sting-target`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5HP~HK Tiger Sting |
| Starter | 5HP |
| Hit condition | 先端とニー追撃。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 牽制確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `44de3b49-93d2-477c-804c-d03ed63fedf4` (supporting); `f0be5a3a-8c11-461f-8b8e-4091963f2de1` (patch_context)。

#### combo — Drive候補 — 端屈強P OD弾

Record: `78a5ad6e-64cf-489c-80c4-cbb60b21d8b5` / `sagat-y4-corner-2hp-odshot`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2HP > OD Tiger Shot > Step High > M Uppercut/SA |
| Starter | 2HP |
| Hit condition | OD弾ヒット数。 |
| Position | corner |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 端火力 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `44de3b49-93d2-477c-804c-d03ed63fedf4` (supporting); `f0be5a3a-8c11-461f-8b8e-4091963f2de1` (patch_context)。

#### combo — SA候補 — SA2ステハイ

Record: `017b587d-78aa-4118-8bcd-7f3f3c1d8620` / `sagat-y4-sa2-route`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | Monolith > M Shot > DR 5HK > CDR 5HK > Step High > SA2 |
| Starter | medium confirm, SA2 |
| Hit condition | Drive量。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | SA2最大候補 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `44de3b49-93d2-477c-804c-d03ed63fedf4` (supporting); `f0be5a3a-8c11-461f-8b8e-4091963f2de1` (patch_context)。

#### setup — 起き攻め候補 — +34ラッシュDI

Record: `38958903-42e8-4e5d-9a02-4934dbb02edc` / `sagat-y4-plus34-di`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | L Uppercut route +34 |
| Action | DR Drive Impact |
| Goal | ジャンプ不可主張を確認。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Meaty claim |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `44de3b49-93d2-477c-804c-d03ed63fedf4` (supporting); `f0be5a3a-8c11-461f-8b8e-4091963f2de1` (patch_context)。

#### setup — 端・固有候補 — 端グリード弱アパカ

Record: `2c0440a3-0dc5-4177-8de3-ff4e25fcbb56` / `sagat-y4-corner-greed-upper33`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner Greed > L Uppercut +32~33 |
| Action | whiff 5LK > 5MP meaty / shimmy |
| Goal | アパカ高度差。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source +8 after whiff |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `44de3b49-93d2-477c-804c-d03ed63fedf4` (supporting); `f0be5a3a-8c11-461f-8b8e-4091963f2de1` (patch_context)。

### C.ヴァイパー / c-viper

#### combo — 基本 — 中Pセービング

Record: `5480073a-df6b-4076-9dd7-d2e20e257c51` / `viper-y4-5mp-2mp-saving`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5MP > 2MP > Saving Force |
| Starter | 5MP |
| Hit condition | 密着で前ステ+3。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | ノーDrive起き攻め |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `253d3c3a-dbe4-4ee3-b175-b5991ddd86b0` (supporting); `9bd841f7-93d9-4d8c-9696-0522b8f1df33` (patch_context)。

#### combo — Drive候補 — 屈中P ODサンダー

Record: `dc922acf-a4d6-4247-9b05-319ea808ce37` / `viper-y4-2mp-odthunder`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > OD Thunder Slap |
| Starter | 2MP |
| Hit condition | Drive2。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | +42詐欺飛び |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `253d3c3a-dbe4-4ee3-b175-b5991ddd86b0` (supporting); `9bd841f7-93d9-4d8c-9696-0522b8f1df33` (patch_context)。

#### combo — SA候補 — SA1セイスモ重ね

Record: `e2371349-7e5a-4e51-b0f9-f9bc73a3a568` / `viper-y4-sa1-seismo-pressure`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | confirm > SA1 > H Seismo meaty |
| Starter | SA1 hit |
| Hit condition | +22~23。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | SA1起点 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `253d3c3a-dbe4-4ee3-b175-b5991ddd86b0` (supporting); `9bd841f7-93d9-4d8c-9696-0522b8f1df33` (patch_context)。

#### setup — 起き攻め候補 — +23弱バニ重ね

Record: `670b6ce4-1ecc-4ba1-814e-ccb35df80263` / `viper-y4-plus23-doubleburn`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | +23 knockdown |
| Action | L Burning meaty > Double Burn |
| Goal | 1F無敵に弱い。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | DI return possible claim |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `99a849ce-644b-40c9-8b56-02efcb95e4c7` (supporting); `9bd841f7-93d9-4d8c-9696-0522b8f1df33` (patch_context)。

#### setup — 端・固有候補 — 端前投げ歩き択

Record: `0863abd5-f2ce-4e40-afec-98bc2e6ed8bb` / `viper-y4-corner-throw-walk`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner forward throw +28 |
| Action | walk throw / strike / shimmy |
| Goal | 前ステ+7はシミー差。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Manual timing |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `99a849ce-644b-40c9-8b56-02efcb95e4c7` (supporting); `9bd841f7-93d9-4d8c-9696-0522b8f1df33` (patch_context)。

### アレックス / alex

#### combo — 基本 — 小技弱アックス

Record: `ca58406b-bc77-4978-b752-dc3e9cf9faad` / `alex-y4-lights-laxe`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LK/LP > LP > LP > L Flash Axe |
| Starter | light |
| Hit condition | ガード-4。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 小技安全 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `23ad3049-f54e-4268-b723-14cd2d33a73d` (patch_context); `7f8c6d94-56d9-418f-afd2-e10ddc89e5d5` (supporting)。

#### combo — Drive候補 — ラッシュ屈強Pフラチョ

Record: `8db01aa3-c7ef-4ad8-817b-b9ee9ff2c490` / `alex-y4-dr2hp-chop`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DR 2HP > Flash Chop |
| Starter | DR 2HP |
| Hit condition | パワーボム分岐。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | ラッシュ確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `23ad3049-f54e-4268-b723-14cd2d33a73d` (patch_context); `7f8c6d94-56d9-418f-afd2-e10ddc89e5d5` (supporting)。

#### combo — SA候補 — DI SA2最大

Record: `f83ebfcb-a89e-4e5e-adcf-a9ba0d3805ac` / `alex-y4-di-sa2`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | DI(PC) > DR 2HP > Flash Chop > OD Power Bomb > Power Drop > SA2 |
| Starter | DI punish counter, SA2 |
| Hit condition | 距離。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | DI SA2 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `23ad3049-f54e-4268-b723-14cd2d33a73d` (patch_context); `7f8c6d94-56d9-418f-afd2-e10ddc89e5d5` (supporting)。

#### setup — 起き攻め候補 — エアスタンピート前ステ

Record: `0ecdf98a-05cd-4207-a3aa-e2cc4ad0f240` / `alex-y4-stamp-dash`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | Breaker M Air Stampede |
| Action | dash(+6) > 5MP / timed L Power Bomb |
| Goal | 最速投げは後退に届かない。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source +6 |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `23ad3049-f54e-4268-b723-14cd2d33a73d` (patch_context); `7f8c6d94-56d9-418f-afd2-e10ddc89e5d5` (supporting)。

#### setup — 端・固有候補 — 端下投げOD投げ

Record: `83242576-fc0c-4b50-bfe3-cd37978c9ace` / `alex-y4-corner-downthrow`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner down throw |
| Action | walk OD Power Bomb meaty |
| Goal | Modern推奨候補。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Manual timing |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `23ad3049-f54e-4268-b723-14cd2d33a73d` (patch_context); `7f8c6d94-56d9-418f-afd2-e10ddc89e5d5` (supporting)。

### イングリッド / ingrid

#### combo — 基本 — 引中KTC

Record: `f28ac180-3247-42d8-b06e-64e61034b2d0` / `ingrid-y4-4mktc`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 4MK~HP |
| Starter | 4MK |
| Hit condition | 記事+44。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 牽制確認 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `7be241e4-7e11-4d90-96c7-8b42807412e8` (patch_context); `f0de845c-e839-4dfb-9783-f1962b2e9b47` (supporting)。

#### combo — Drive候補 — 中PTC Lv2フレア

Record: `3c278d51-243b-4214-85b7-4ae28697efa4` / `ingrid-y4-mptc-lv2flare`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5MP~MK > OD Sunflare(Lv2) > 6KKK |
| Starter | 5MP, stock1 |
| Hit condition | 記事+44。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | ストック1火力 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `7be241e4-7e11-4d90-96c7-8b42807412e8` (patch_context); `f0de845c-e839-4dfb-9783-f1962b2e9b47` (supporting)。

#### combo — SA候補 — 屈強P Lv3 SA3

Record: `634ab57b-c41d-4ce4-b9df-e6eeaa91bc5c` / `ingrid-y4-2hp-lv3-sa3`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2HP > OD Sunflare(Lv3) > 2KKK > OD Sunrize > SA3 |
| Starter | 2HP, stock2, SA3 |
| Hit condition | 記事5820。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 最大候補 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `7be241e4-7e11-4d90-96c7-8b42807412e8` (patch_context); `f0de845c-e839-4dfb-9783-f1962b2e9b47` (supporting)。

#### setup — 起き攻め候補 — +37持続中段

Record: `282f965c-61e2-4dd7-856d-a710209288af` / `ingrid-y4-plus37-overhead`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | +37 knockdown |
| Action | whiff 2LP > 6MP last-active |
| Goal | フレーム消費。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source hit +6 |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `7be241e4-7e11-4d90-96c7-8b42807412e8` (patch_context); `f0de845c-e839-4dfb-9783-f1962b2e9b47` (supporting)。

#### setup — 端・固有候補 — 端中ライズ持続中段

Record: `b0cc8e69-5844-4c34-ae36-b0f8619a83a9` / `ingrid-y4-mrise-overhead`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | corner M Sunrize +38 |
| Action | whiff 2LK > 6MP meaty |
| Goal | 現行値確認。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source hit +5 guard -1 |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `7be241e4-7e11-4d90-96c7-8b42807412e8` (patch_context); `f0de845c-e839-4dfb-9783-f1962b2e9b47` (supporting)。

### ヤスミン / yasmine

#### combo — 基本 — 中KTC

Record: `b60dd0c3-aa0b-4069-ac0e-dd364823e25c` / `yasmine-y4-mktc`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 5MK~MK~HK |
| Starter | 5MK |
| Hit condition | 記事+33。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | TC基本 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `4c24e6b8-b267-44db-b999-c6c7c73bb6b9` (patch_context); `526c0235-6423-4da2-a580-79c282310c1d` (supporting)。

#### combo — Drive候補 — 屈中P ODタリム

Record: `39f8abf8-5e44-4843-97c5-f0c95940367c` / `yasmine-y4-2mp-odtalim`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2MP > OD Talim > HP > H Ripa |
| Starter | 2MP |
| Hit condition | Drive2。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | 運び火力 |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `4c24e6b8-b267-44db-b999-c6c7c73bb6b9` (patch_context); `526c0235-6423-4da2-a580-79c282310c1d` (supporting)。

#### combo — SA候補 — 小技SA3

Record: `eb820527-a07b-4a27-9b73-e90b3ac6e61c` / `yasmine-y4-lights-sa3`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Input | 2LP > 5LP~LP > OD Daloy~Aron > SA3 |
| Starter | light, SA3 |
| Hit condition | Bayani差。 |
| Position | any |
| Drive requirement | UNCONFIRMED |
| SA requirement | UNCONFIRMED |
| Side | UNCONFIRMED |
| Purpose | SA3リーサル |

未確認: drive_cost, sa_cost, side_requirement, control_scheme_confirmation, normal_CH_PC_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `4c24e6b8-b267-44db-b999-c6c7c73bb6b9` (patch_context); `526c0235-6423-4da2-a580-79c282310c1d` (supporting)。

#### setup — 起き攻め候補 — 中足TC+30

Record: `45832c68-eca9-4441-9ec5-e9cb5c84c0fc` / `yasmine-y4-2mkhk30`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | 2MK~HK +30 |
| Action | DR 6MP meaty / DR pressure |
| Goal | 後方受け身投げ不可。 |
| Position | any |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source third-active |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `4c24e6b8-b267-44db-b999-c6c7c73bb6b9` (patch_context); `526c0235-6423-4da2-a580-79c282310c1d` (supporting)。

#### setup — 端・固有候補 — SA3端BO連携

Record: `bae68180-ab95-4985-81dc-fc6c83971cf0` / `yasmine-y4-sa3-bo`; DB draft / unverified; 判定 **BLOCKED_BY_EVIDENCE**。

| 項目 | 既存値 |
| --- | --- |
| Situation | SA3 +42, opponent BO |
| Action | dash > extended DR 2MP > DI |
| Goal | 端限定。 |
| Position | corner |
| Meter | UNCONFIRMED |
| Frame claim (未検証) | Source 1F gap |
| Opponent / response | Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options. |

未確認: meter_condition, exact_spacing, exact_timing, opponent_recovery_and_response, control_scheme_confirmation, knockdown_hit_source_confirmation, current_patch_game_reproduction, same_recipe_source_relation。

Patch baseline: `ecff9a58-d023-43ae-9962-79d25adfc1f3`; current game compatibility **UNCONFIRMED**。

Source Relation: `4c24e6b8-b267-44db-b999-c6c7c73bb6b9` (patch_context); `526c0235-6423-4da2-a580-79c282310c1d` (supporting)。

## Source Registry（metadataのみ、本文確認済みを意味しない）

| Source ID | Title | Publisher | URL |
| --- | --- | --- | --- |
| 03ac6c9e-195b-440c-89f7-7acfe32a10ff | 豪鬼攻略 2026年8月更新 | もみあげリョウ | https://momiageryo.com/2026/07/11/sf6_gouki_combosetplay/ |
| 0413a164-37a7-42fc-b6ae-30f3005e927e | ブランカ基礎コンボ起き攻め | kch_ | https://note.com/kch_/n/n8bb3b56378a6 |
| 0703633f-45c9-4e39-bf97-7dd502741a75 | 2026.08.03 JP update summary | ヒヨワカ | https://hiyoko-lab.com/streetfighter6_hiyoko/sf6_2026-08-03-update_01/ |
| 0b668bc9-04e7-444f-88f0-c70039f9102e | ケン 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ken |
| 1409a536-105b-4282-87c8-ae0a4606930a | JP 2026.08.03 battle changes | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jp |
| 156adc78-e4ce-47a5-9764-1666ea5b24b2 | JP攻略・コンボ・立ち回り・固め連携まとめ | pachi-mea.com | https://pachi-mea.com/sf6-wiki/10259/ |
| 168fddee-7a91-4a0c-9ba8-d77e20f2e1ec | 2000MRエド攻略 | にこ太郎 | https://note.com/nikotarosun/n/n99fbf1d58191 |
| 189622dc-2071-4972-bdf9-d0f6dac4deb8 | ガイル 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/guile |
| 1cfa7793-0511-455e-aa2d-0092676b776e | マリーザ セットプレイまとめ | 格ゲーブログ、略してかくぶろ | https://takukakugamer.com/sf6-marisa-setup/ |
| 1dc0d502-7002-4550-aa9f-9577b68b5aa0 | A.K.I.基本的な使い方 | 格ゲーブロガー拓 | https://takukakugamer.com/sf6-aki-howtouse/ |
| 1e902b4f-cddd-4b7c-8cd3-89f0a563a85d | リリー実戦用コンボまとめ 2026.8 | 日野ハナ | https://note.com/hanahino/n/nd35fc00acbb6 |
| 1ede77fc-2835-451f-b5c7-f3977ad99b66 | キャミィ 強化アロー空中当てセットプレイ | 下限 | https://note.com/finalmmin/n/nd2591c899510 |
| 23ad3049-f54e-4268-b723-14cd2d33a73d | アレックス 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/alex |
| 25350a31-b3f3-4298-9ecf-09816f8ee862 | モダン本田MR2000メモ | namayuki7 | https://note.com/namayuki7/n/ndf95c894f805 |
| 253d3c3a-dbe4-4ee3-b175-b5991ddd86b0 | 今夜勝ちたいC.ヴァイパー攻略 | ゴジライン | https://goziline.com/archives/64321 |
| 254bbb7c-cc20-4114-b6ad-7f3583a042cc | これから始めるモダンラシード とりこれ | さーな | https://note.com/emesirna/n/n684620436146 |
| 26da6fcf-2ec8-42bb-bd9f-613ce2d0b2a2 | モダンエド簡単コンボと起き攻め | でんのすけ | https://note.com/denndenn/n/n3880e5e71ef1 |
| 2ab0bce6-b654-4dda-a46b-b85806cf7155 | vsルーク キャラ対メモ S4 2026-08-03 | さーな | https://note.com/emesirna/n/n3289b2ebc007 |
| 2e3a6f44-a9ef-4d3a-a8d4-633d2181365c | リュウ コンボ Year4 | SF6 全キャラ攻略 | https://sf6-genten.com/character/ryu/category/combo |
| 30f4b384-b9a7-4ae1-b25f-e1cdc19e1b1c | ガイル最低限使い方メモ | kch_ | https://note.com/kch_/n/n7fc6850705e9 |
| 310a2a1c-a97e-4e8b-81d2-8780affeca76 | ジュリ簡単攻略 2026 | もみあげRYO | https://momiageryo.com/2026/05/22/sf6_juri/ |
| 31684021-f50b-4587-9d60-d479ba62978a | リュウ攻略 - 2026年8月3日版 | SF6 全キャラ攻略 | https://www.sf6-genten.com/character/ryu |
| 346a1631-a290-4857-845c-4c0e1bdac9b7 | ケン Year4変更点まとめ | いっせー_ケンらぼ | https://note.com/isseeeko/n/na5e817df921a |
| 34cfc914-ebd1-4824-97a4-8c25772e4740 | リュウ、始めました～攻略～コンボと起き攻め | ボンモコ | https://note.com/bonmoko_3/n/n6f0e26063ea9 |
| 3824cfe8-ccd9-4a51-8a9a-2dbc926273f3 | キャミィ初心者Wiki コンボと起き攻め | SF6初心者Wiki | https://w.atwiki.jp/sf6begin/pages/38.html |
| 382e9e86-67d4-4961-9fe7-70e8562d06a1 | ラシードコンボ選択 | ゆば | https://note.com/yubibiseth/n/nc4725e9f71a7 |
| 38688514-891f-464e-b4f5-a70b1e9c3b65 | A.K.I. 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/aki |
| 39076175-1aaa-4272-87ae-7010067b2970 | ディージェイ基本コンボ | community author | https://note.com/crisismattsu/n/nf41c0eb44192 |
| 3f87f53d-0911-4f7d-a376-9b1980bfb147 | 不知火舞セットプレイ | 格ゲーブロガー拓 | https://takukakugamer.com/sf6-mai-setup/ |
| 44de3b49-93d2-477c-804c-d03ed63fedf4 | サガット 基本コンボと起き攻め | ボンモコ | https://note.com/bonmoko_3/n/n21ed46db0cdf |
| 46794c7d-6ad3-4cdb-a190-45be80673f99 | ディージェイ対策メモ S4 | さーな | https://note.com/emesirna/n/n2f1b1895325e |
| 47fdfc71-d217-403b-ab56-0e8d4564386b | ベガコンボ起き攻め集 | サム | https://note.com/991357/m/md7d3e6e41597 |
| 4858dca0-5ffc-4b6b-8b36-6f3dfff5a5ee | マリーザ 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/marisa |
| 4a8b01d6-ad41-4065-bf96-45ed5d5340d6 | エド起き攻め打撃択 前編 | 大五郎 | https://note.com/daigoro_pso2/n/ned4ab96caff9 |
| 4c24e6b8-b267-44db-b999-c6c7c73bb6b9 | ヤスミン 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/yasmine |
| 4ddb1b64-46d6-4411-afc6-1f1ad5524060 | スト6ガイルの起き攻めまとめ | もちもち | https://note.com/mochimochi_sf/n/n25e5ee23d718 |
| 526c0235-6423-4da2-a580-79c282310c1d | ヤスミン攻略 コンボ・起き攻めまとめ | ドス | https://note.com/dos236236/n/nf495faf8df1e |
| 53f05c3b-20bb-4619-bb4a-ae21d2fd7cee | マノンコンボ起き攻め | スコレル | https://www.sukoreru.com/sf6-manon |
| 5532eb66-b2e9-4e33-b87c-9ffdba9a3ee9 | リリーマスター最低限使い方メモ | kch_ | https://note.com/kch_/n/ne17fb373f776 |
| 55c16e77-9ad3-48a6-b010-67477d6bbd85 | 豪鬼使い方セットプレイ | kch_ | https://note.com/kch_/n/n965d5daa6103 |
| 596218a4-cc7b-4c44-b7f6-345ae7637fa7 | 不知火舞 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/mai |
| 5bf09cec-17b5-4031-9cab-838a22570e4b | モダンダルシム攻略 | ゴジライン | https://goziline.com/archives/54059 |
| 5d50633d-9fc8-4855-a0b8-535c687c8f04 | ラシード 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/rashid |
| 5f3d74bb-7b39-4b43-91f2-7655f82f820c | エド立ち回り攻略 | babapiero | https://note.com/babapiero/n/nee9bbc650b3d |
| 64e8e70f-7de0-4de6-9a29-64ea3eb68a9e | マリーザ現行コンボ | たくかくゲーマー | https://takukakugamer.com/sf6-marisa-combo/ |
| 66d3df30-5674-4d9e-8a30-4793ce86bee5 | リリーの基本的な使い方 コンボ・起き攻め・セットプレイ | 格ゲーブロガー拓 | https://takukakugamer.com/sf6-lily-howtouse/ |
| 69151330-9319-4659-99fa-78bb982ef008 | エレナ コンボ・起き攻めまとめ | ドス | https://note.com/dos236236/n/nce65d6199ac4 |
| 6fb2e533-ad82-4e5c-863d-228207be9ae5 | スト6春麗マスターに上がるための最低限使い方メモ | kch_ | https://note.com/kch_/n/n9bb5becc8343 |
| 70a8c217-52c3-4cc5-9488-7420376598fc | Season 4 現行変更解説候補 ジェイミー | UNCONFIRMED | https://www.youtube.com/watch?v=1F6pj4PbyXM |
| 74191946-fe26-490f-a29e-1da72481520c | ジュリ最低限使い方メモ | kch_ | https://note.com/kch_/n/n17ca2198da74 |
| 75600d2f-fa52-48d2-821f-d910f1809a8d | キャミィ 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/cammy |
| 76bb64f0-e02b-412b-9473-c22a8082ffff | エドモンド本田 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/honda |
| 782ced8c-8b08-4eea-93c2-169a03e49c3a | 不知火舞 コンボ・起き攻めまとめ | ドス | https://note.com/dos236236/n/n42ac0d684926 |
| 7a918cef-f7f4-4d4a-980a-87ea860e92b8 | ベガ 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/vega_mbison |
| 7be241e4-7e11-4d90-96c7-8b42807412e8 | イングリッド 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ingrid |
| 7d4ba052-4ef8-46c8-88ef-68d9e395fa60 | スト6 ルークのコンボ | 焼鳥 | https://note.com/quirky_chimp9568/n/n455adc32fdc8 |
| 7d89c655-62d7-4a53-8a2f-34f8d1e41589 | ベガセットプレイまとめ | 六畳一間 | https://note.com/rokujokazuma/n/nec7bb5fffcf1 |
| 7f8c6d94-56d9-418f-afd2-e10ddc89e5d5 | アレックス 基本コンボ・基本連係 | 原田ダダスケ | https://note.com/dadasuke/n/n9ade212b1831 |
| 80f85e75-5576-4032-bdab-ad21f295e282 | Cテリー初心者コンボ・起き攻め | one-days | https://one-days.org/sf6-terry1/ |
| 87d05dc1-17af-433e-bbf0-ccb3d3385870 | ザンギエフ コンボとセットアップ(2026.08.03 update) | キノコ灯 | https://note.com/good_lion2040/n/n95791feb0a8b |
| 898d77d3-b877-4a72-89f2-837bb7823654 | SF6 ザンギエフコンボ表 | キチパ | https://note.com/kichipa_/n/n0b430978c306 |
| 8a4c99c2-8f5e-47a5-ab46-8449cc1f8596 | リリー 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/lily |
| 8b18513d-5853-4fac-9d96-4cbbe9dcab6b | Year4マノンコンボメモ | mntone | https://mntone.hateblo.jp/entry/sf6_manon |
| 8b2bffb7-cc54-46ca-bc13-6af234e136e3 | キャミィの使い方 コンボ・起き攻め | 格ゲーブロガー拓 | https://takukakugamer.com/sf6-cammy-howtouse/ |
| 8e7af01c-4b8e-4b36-a418-86104bffe8fb | エド 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ed |
| 9034978d-0918-4e46-99e7-50b060a70777 | C:A.K.I. ハイマスタッチ | ムサイ | https://note.com/terry631/n/nb3327f900fcd |
| 912386f3-1c0a-4060-af1f-37f5f2f35db8 | ジュリ 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/juri |
| 99a849ce-644b-40c9-8b56-02efcb95e4c7 | モダンC.ヴァイパー 起き攻めメモ | さーな | https://note.com/emesirna/n/n192205d3ea1f |
| 9bd841f7-93d9-4d8c-9696-0522b8f1df33 | C.ヴァイパー 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/cviper |
| 9e0141ec-765e-40d7-83f1-566df7c1ed52 | ルーク 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/luke |
| a24b367f-c761-4e07-973a-898df9ded3a8 | ジェイミー 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jamie |
| a6058153-8670-4f64-b24e-58304bb5c5fd | リュウ 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ryu |
| a6cd285f-5309-4f18-9b50-aa95621c8192 | ルーク コンボまとめ | 格ゲーブログ、略してかくぶろ | https://takukakugamer.com/sf6-luke-combo/ |
| b069e9fc-3e83-4c7c-9019-3077fbc54dbf | Cキンバリー コンボまとめ 2026年8月 | 松/じぎーも | https://note.com/matsunoki709/n/ncc6937837af7 |
| b3401782-12d0-4ec9-b462-b17a9b2a412d | 本田備忘録 | pta | https://note.com/fgdgdgh/n/n2febe8109954 |
| b44be282-0e1b-412a-9f0e-0ce4e68d370b | エレナ 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/elena |
| b4da6868-992c-4c8b-adf4-0991c0cdfbd9 | Cダルシム完全攻略 | にこ太郎 | https://note.com/nikotarosun/n/n4de225c4e4a9 |
| b71f861c-cbbb-4da5-b06f-9ce3073cf743 | ルーク｜コンボ・立ち回り・キャラ対策・固め連携まとめ | パチめあ！攻略情報まとめサイト | https://pachi-mea.com/sf6-wiki/10313/ |
| b73b8645-c8de-4ba6-810c-7d9a11b62e18 | テリー 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/terry |
| c09f0c86-b75f-4124-a0fc-2855b6c13fee | ダルシム コンボ起き攻め立ち回り | ビーキョウ | https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A |
| c1dadeec-59f5-4556-8c00-a0e250cb497c | スト6 ルーク セットプレイまとめ 2026 | 格ゲーブロガー拓 | https://takukakugamer.com/sf6-luke-setup/ |
| c25ef64b-e50e-419b-bac3-921b074ac1bd | 豪鬼 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/gouki_akuma |
| c2bd5a01-5b54-4409-8936-34f5a6cdac2f | ブランカ 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/blanka |
| c9ccf16c-f6f7-4289-ab55-e0912adda633 | モダンベガ評価2026 | 神ゲー攻略 | https://kamigame.jp/streetfighter6/page/322662586657036042.html |
| cc6a0039-6a82-41ba-9b30-6a1e3b26c7fc | ジェイミー調整（2026/03/17）徹底解説 | 大五郎 | https://note.com/daigoro_pso2/n/na1d80900edca |
| d03845a3-9ced-48a7-8db1-c615d9f8883b | ダルシム 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/dhalsim |
| d33665a7-e7fa-4e31-8c71-35337f3183b5 | ケン コンボまとめ | 格ゲーブログ、略してかくぶろ | https://takukakugamer.com/sf6-ken-combo/ |
| d3d3f822-82e7-4d32-ae69-8cd59e019322 | ディージェイコンボ・セットプレイ | community author | https://note.com/kiliboshidaikon/n/n06bb2a78fcb4 |
| d69862a2-0091-46c1-96ec-7d4de87cec7c | マリーザ、始めました 起き攻め編 | ボンモコ | https://note.com/bonmoko_3/n/n2609bb89961e |
| d81d2e38-7bca-42bc-9a53-211ae5f46ecb | モダンダルシムのとりこれ | 桑名 | https://note.com/kuwana_fgc/n/ncf7a73b03a7f |
| d9a4184e-fe63-4e0f-8082-c7431212a7c2 | マノン 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/manon |
| dc038442-5db7-47c6-ab29-6ddee9d162ec | テリー コンボ・起き攻めまとめ | ドス | https://note.com/dos236236/n/n6b48ac883e1c |
| e1e8e320-1cdb-472b-ac03-955a62821b05 | リュウ超攻略：セットプレイ一覧 | にこ太郎 | https://note.com/nikotarosun/n/nf893ddf7c836 |
| e54e2a84-a826-406d-9a21-8589e9237b31 | 春麗 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/chunli |
| e6581252-d77e-4fab-93b4-20185f376425 | スト6における春麗のコンボをまとめます | かくぶろ！ | https://takukakugamer.com/sf6-chun-li-combo/ |
| e706af71-84a8-48c0-90d0-48b15d3791a9 | スト６ エドモンド本田起き攻め。あとコンボ Ver.2026.08 | ボンモコ | https://note.com/bonmoko_3/n/n8257f7cd418f |
| e7b15dec-13b4-454f-b776-707c167f3650 | ディージェイ 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/deejay |
| e829af82-3473-4eea-a3b1-9054c4df39e4 | クラシックJPコンボまとめ | 格ゲーブログ、略してかくぶろ | https://takukakugamer.com/jp_combo/ |
| ea621e8e-090f-4340-a896-f50e31013059 | キンバリー起き攻めネタ集 | なお | https://note.com/kirby0423/n/nef88e492c2d8 |
| ea9d2f5a-5a63-401c-802a-4b4fc8974971 | 自分用ジェイミーメモ コンボ・起き攻め編 | 悪戯人形 | https://note.com/clownhello21/n/ne42b1fdbda63 |
| ecbe61c5-4ad1-489a-a4ed-69b011949760 | クラシックエレナ 2026.08.03対応 | tigrex | https://note.com/tigrex/n/ndc46a9f98883 |
| ecf0d16f-7172-4143-97d9-3a2c789a698e | 豪鬼コンボ 2026年1月 | 焼鳥 | https://note.com/quirky_chimp9568/n/n9473b9d60c12 |
| f0be5a3a-8c11-461f-8b8e-4091963f2de1 | サガット 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/sagat |
| f0de845c-e839-4dfb-9783-f1962b2e9b47 | イングリッド コンボ・起き攻めまとめ | ドス | https://note.com/dos236236/n/nd3f3300416b7 |
| f0ff9b6f-32ee-41b9-ace3-a63ac1c7e90f | キンバリー 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/kimberly |
| f21d2365-d668-47ea-b2a5-102bb27fa458 | ジュリ攻略・コンボ・立ち回り・固め連携まとめ | パチめあ | https://pachi-mea.com/sf6-wiki/10182/ |
| f29d79a0-7686-4e31-a73b-530517beafb8 | モダン豪鬼コンボ | 神ゲー攻略 | https://kamigame.jp/streetfighter6/page/317199723331067429.html |
| f42d8a5d-6c09-48af-a9eb-739b0a86f95f | エドまとめ | elleair104 | https://note.com/elleair104/n/n80787a22aae0 |
| f471bbd4-7cac-4b3d-a94c-218064b0aa30 | スト6におけるジェイミーのコンボをまとめます！ | かくぶろ！ | https://takukakugamer.com/sf6-jamie-combo/ |
| f57a7880-e9ca-40ed-9864-94a7069cfe3f | ラシードセットプレイ イーグルスパイク編 | ゆば | https://note.com/yubibiseth/n/n19ce3203f1f2 |
| f6efb8b1-6900-4cef-bf66-9aae90591cde | Luke - Ultimate Frame Data (August 2026 current) | Ultimate Frame Data | https://ultimateframedata.com/sf6/luke |
| f9caead3-13e8-4b0b-a6ce-303dd38f4da5 | ラシード最低限使い方メモ | kch_ | https://note.com/kch_/n/n73833af80a6d |
| f9e6d6a3-a3c8-44b6-87f5-8ddf125c7932 | ザンギエフ 2026.08.03 公式バトル変更 | CAPCOM | https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/zangief |
| fa7f1f71-3512-439a-bce1-9fd4f58d5177 | Cキャミィ マスターまでのコンボ 26年4月 | 松/じぎーも | https://note.com/matsunoki709/n/nd514588a2312 |
| ff296a3f-0e4e-474d-9e9c-ba1439b95d75 | 本田コンボ起き攻めまとめ | でんでん | https://note.com/denndenn/n/nc96680b2ff78 |

## 完了判定

候補選定155件。公開準備完了0件。正式なゲームVerificationは未実施。準備候補をDBへ登録・変更せず、reviewed→verified / draft→publishedも行っていない。Source本文の転載、フレーム表や有料データの転記は行っていない。
