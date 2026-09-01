# SF6DNA Phase23 Content Publication Readiness

Last re-audit: 2026-09-01 JST
Supabase: `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)
Patch baseline: `2026.08.03`

## Purpose

実装完成とPublicコンテンツ完成を分離して判断する。Machine Gate PASSをPublication approvalとして扱わない。

## Current public content

- playable + published Character: 31
- published Diagnosis: 4
- published Move: 0
- published Combo: 0
- published Setup: 0
- published Sequence: 0
- published Counter: 0
- published Training: 0
- published Character Trait Score: 0

攻略Routeは公開条件を満たすデータがない場合、未確認データを代替表示せずsafe empty stateを表示する。

## Move candidate snapshot — current DB re-audit

実DBの`private.is_move_public_ready(m.id)`をdraft Moveへ直接適用して再集計した。

- total draft Move: 2052
- strict machine gate ready: **701**
- gate not ready: **1351**
- gate-ready Character: **12 / 31**
- Modernあり / なし: **662 / 39**

| Character | Count | Modernあり | Modernなし |
|---|---:|---:|---:|
| Dee Jay | 105 | 102 | 3 |
| Jamie | 93 | 91 | 2 |
| Blanka | 91 | 83 | 8 |
| Dhalsim | 88 | 77 | 11 |
| Kimberly | 76 | 74 | 2 |
| E. Honda | 70 | 65 | 5 |
| Guile | 70 | 66 | 4 |
| Chun-Li | 68 | 64 | 4 |
| Yasmine | 19 | 19 | 0 |
| Mai Shiranui | 10 | 10 | 0 |
| C. Viper | 7 | 7 | 0 |
| Elena | 4 | 4 | 0 |
| **Total** | **701** | **662** | **39** |

Gate-readyの機械条件:

- published Character
- Classic Command
- Classic Command official Source
- Move official Source
- Current Patch verified Frame
- Frame official Source

### Structural audit

701候補:

- blank Move slug: 0
- blank Move name: 0
- duplicate Move slug group: 0
- blank Classic Command: 0
- Current verified Frameが1件でないMove: 0
- Current verified Frame duplicate: 0
- Classic Commandなし: 0
- Classic Command duplicate: 0
- null Startup: 0
- null Recovery: 0
- null Damage: 0

`active / on_hit / on_block`のnullはnot-applicableを含むため、null単独で不良判定しない。

### Evidence audit

701候補:

- Move official Evidence: 701 / 701
- Classic Command official Evidence: 701 / 701
- Current verified Frame official Evidence: 701 / 701
- 必須3対象すべてofficial Evidenceあり: 701 / 701

関連Source record全体:

- total 36
- official 12
- supplemental / non-official 24
- blank URL 0

補助Sourceをofficialへ昇格したわけではない。

### Remaining 1351

19キャラの多くはCurrent verified FrameやFrame Sourceが存在しても、Move本体またはClassic Commandのofficial Source relationが不足している。既存Phase13ではUFD / Frame Viewer等をSupporting Sourceとして扱ったデータもあるため、同じページに見えるという理由だけでofficial relationを機械補完しない。

したがって安全なmachine-ready範囲は701件のままとする。

## Modern Command

701候補:

- Modernあり 662
- Modernなし 39

全2052 Move:

- Classic 2052 / 2052
- Modern 1441 / 2052
- Missing Modern 611

Modern欠損をClassicから推測補完しない。

## Strategy snapshot

`status=draft AND verification_status=verified AND Source relationあり`:

- Combo 1
- Setup 0
- Sequence 0
- Counter 0
- Training 0

SourceがあるだけでStrategy内容の正しさを証明したことにはならないため、自動publishしない。

31キャラの文言・画像Source収集完了後の全Active Strategy:

| Entity | Active | Unverified | Reviewed | Verified | Published | Source欠損 |
|---|---:|---:|---:|---:|---:|---:|
| Combo | 1213 | 1078 | 134 | 1 | 0 | 0 |
| Setup | 792 | 703 | 89 | 0 | 0 | 0 |
| Sequence | 475 | 439 | 36 | 0 | 0 | 0 |

- 全2480件にTraining relationあり
- 全2480件にpending captureあり
- Combo notation重複group 0
- 撮影待ち詳細は`capture_backlog`で非公開管理

したがって、収集完了と公開準備完了は別である。実機確認前の一括verified化・一括publishは禁止する。

## Diagnosis / Trait snapshot

Published Diagnosis 4件は新しいcompleteness Gateでも全件ready:

- published Question数 12 / 10 / 10 / 20
- Optionなしpublished Question 0

Character Trait Score:

- total 372
- published 0
- public-ready 0

## Admin publication path readiness

Current automated implementation:

- Application: `3c702ca0dad54ab2f73a2a940d1cc17e6511d3f1`
- DB hardening: `5c46de5f0a81e4c9996b5ff30f7896aa7cdf651e`

Move:

- Classic Command必須
- Current verified Frame必須
- Move / Classic Command / Frame official Source必須
- 新規published指定はdraft→Evidence→strict gate→published

Strategy:

- draft→Source relation→published

Diagnosis:

- incomplete Diagnosis / Questionを公開不可

Character Trait Score:

- verified + Source relation + published parentを要求

Current Patch:

- atomic RPCで切替
- RPCはSecurity INVOKER
- Security Advisor 0 lints

詳細: `docs/PHASE23_AUTH_ADMIN_READINESS_2026-08-29.md`

## Player image mechanical audit

- published Player: 41
- DB `image_url`: 0 / 41
- safety-confirmed fallback: 17
- published Playerの追加alias: 0

残りは文字列類似だけで人物同定しない。

## Release options — manual decision

### Option A — Safe minimal release

Character / Diagnosis / Player / Search /個人ツール等の安全な公開データを中心にReleaseし、Move / Strategyは未承認ならempty stateを維持する。

### Option B — Individual Move publication

701候補を人が個別確認し、承認できるものだけpublishする。

確認対象:

- Character / Move名称
- Classic Command
- Frame
- Current Patch
- required official Evidence
- obsolete / duplicateでないこと

701件をMachine Gateだけで一括publishしてはいけない。

## Decision rules

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceあり ≠ verified
- Machine Gate PASS ≠ Publication approval
- Modern Commandを推測しない

Publication approvalは最後のmanual stageまで保留する。
