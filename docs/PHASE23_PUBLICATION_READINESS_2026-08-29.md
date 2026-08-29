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

## Move candidate snapshot — 2026-08-29 re-audit

現行Public Move Gateと同等の条件を実DBで再計算した。

- total draft Move: 2052
- strict machine gate ready: **701**
- gate not ready: **1351**
- gate-ready Character: **12 / 31**

Gate-ready draftのCharacter別件数:

| Character | Count | Modernあり | Modernなし |
|---|---:|---:|---:|
| Jamie | 93 | 90 | 3 |
| Kimberly | 76 | 70 | 6 |
| Guile | 70 | 65 | 5 |
| Elena | 68 | 67 | 1 |
| Chun-Li | 68 | 64 | 4 |
| C. Viper | 67 | 64 | 3 |
| Blanka | 63 | 62 | 1 |
| E. Honda | 60 | 55 | 5 |
| Dee Jay | 52 | 50 | 2 |
| Dhalsim | 43 | 39 | 4 |
| Mai | 39 | 34 | 5 |
| Yasmine | 2 | 2 | 0 |
| **Total** | **701** | **662** | **39** |

Gate-readyは次を満たす機械条件であり、公開承認そのものではない。

- published Character
- Classic Command
- Classic Command official Source
- Move official Source
- Current Patch verified Frame
- Frame official Source

### 701 candidate structural audit

2026-08-29 read-only監査:

- blank Move slug: 0
- blank Move name: 0
- duplicate Move slug group: 0
- blank Classic Command text: 0
- Current verified Frameが1件でないMove: 0
- Current verified Frame duplicate: 0
- Classic Commandなし: 0
- Classic Command duplicate: 0
- null Startup: 0
- null Recovery: 0
- null Damage: 0

`active / on_hit / on_block` のnullは投げ・非攻撃動作・公式表記上not-applicableとなる技を含むため、nullだけで不良判定しない。

### Official Source audit

701候補のMove / Classic Command / Current Frameに使われるofficial Evidenceを再集計した。

- CAPCOM公式Source records: 12
- blank Source URL: 0
- non-CAPCOM publisher: 0
- missing `accessed_at`: 0
- accessed_at range: 2026-08-26〜2026-08-27
- Source origin: `streetfighter.com`

Move本体はdraftのままなので、Phase20方針に従って自動publishしない。

### Why the other 19 characters remain at 0 ready candidates

31キャラ全体を分解すると、19キャラの多くはCurrent Patch verified Frameとofficial Frame Source自体は存在するが、Move本体とClassic Commandへのofficial Source relationが不足している。

これは「同じ公式Frameページに見えるから」という推測だけで機械的にrelationを追加してよいことを意味しない。Phase13の既存監査にはUFD / Frame Viewer等をSupporting Sourceとして扱ったCharacterもあるため、provenanceを確認せず一括補完しない。

したがって、現時点で安全に扱えるmachine-ready範囲は701件のままとする。

## Modern Command

701候補のうち:

- Modern Commandあり: 662
- Modern Commandなし: 39

Modern欠損39件はRelease Blockerとはしない。Classic Commandから推測補完しない。

全2052 MoveではPhase21方針どおりModern 1441 / 2052、Missing 611を維持する。

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

## Player image mechanical audit

published Player: 41。

- DB `image_url`: 未登録
- 現行Player slugと旧画像ファイル名が安全に一致すると既に確認済みのfallback: 17名
- DB `player_aliases`: published 41名すべて追加aliasなし

残りを記号除去・類似文字列だけで人物同定しない。人による確認まで保留する。

## Release options — human publication decision held until final manual stage

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

ユーザーの指示により、人の判断を要するPublication approvalは実機・実認証等と同様に最後のmanual stageへ回す。自動監査だけを理由にstatus変更しない。
