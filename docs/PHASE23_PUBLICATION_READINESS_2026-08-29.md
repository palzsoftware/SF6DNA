# SF6DNA Phase23 Content Publication Readiness

Date: 2026-08-29 JST
Supabase: `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)
Patch baseline: `2026.08.03`

## Purpose

実機テスト前に、実装完成とPublicコンテンツ完成を分離して判断する。

## Current public content

- playable + published Character: 31
- published Diagnosis: 4
- published Move: 0
- published Combo: 0
- published Setup: 0
- published Sequence: 0
- published Counter: 0
- published Training: 0

Public攻略Routeは、公開条件を満たす情報が0件の場合に未確認データを代替表示せずsafe empty stateを表示する。

## Move candidate snapshot

- total draft Move: 2052
- `private.is_move_public_ready(id)` = true: 701
- false: 1351

Gate-ready draftのCharacter別件数:

| Character | Count |
|---|---:|
| C. Viper | 7 |
| E. Honda | 70 |
| Elena | 4 |
| Guile | 70 |
| Kimberly | 76 |
| Jamie | 93 |
| Dhalsim | 88 |
| Dee Jay | 105 |
| Blanka | 91 |
| Yasmine | 19 |
| Mai | 10 |
| Chun-Li | 68 |

Gate-readyは次を満たす機械条件であり、公開承認そのものではない。

- published Character
- Classic Command
- Classic Command official Source
- Move official Source
- Current Patch verified Frame
- Frame official Source

Move本体はdraftのままなので、Phase20方針に従って自動publishしない。

## Strategy candidate snapshot

`status=draft AND verification_status=verified AND Source relationあり`:

| Entity | Count |
|---|---:|
| Combo | 1 |
| Setup | 0 |
| Sequence | 0 |
| Counter | 0 |
| Training | 0 |

StrategyはSourceがあるだけでは内容そのものの正しさを証明しないため、reviewed / unverifiedを件数目的で昇格しない。

## Release options

### Option A — Safe minimal release

- Character基本情報
- Diagnosis
- Player
- Searchで安全に公開できるデータ
- Favorites / My Characters / Compare / Rank Tracker
- Improvement Loop / Diagnosis History
- About / FAQ / Sources / Changelog
- Strategy / Moveは条件未達・未承認ならempty state

メリット:

- 誤情報公開リスクが最小
- 現在の品質ルールを完全維持

注意:

- 「キャラクター攻略プラットフォーム」としては攻略データ量が少なく見える

### Option B — Move candidate individual publication audit before release

701 Gate-ready draft Moveを個別に最終確認し、承認できるものだけpublishする。

必要確認:

- Character / Move名称
- Classic Command
- Frame
- Current Patch
- Move / Command / Frame official Source
- obsolete / duplicateでないこと

メリット:

- 初回ReleaseのMove / Frameコンテンツを増やせる

注意:

- 701件を機械Gateだけで一括publishしてはいけない
- 12キャラに偏る
- Strategy不足は別問題として残る

## Decision rule

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceあり ≠ Strategy verified
- Machine Gate PASS ≠ Publish approval
- Modern Command欠損をClassicから推測しない

Release Candidate固定前にOption A / Option Bまたは同等の公開範囲を決定する。
