# SF6DNA Phase23 Pre-device Polish Audit

Date: 2026-08-29 JST
Application head: `634845b9ffedacac0ba706186852f295c2204755`
Branch: `sf6dna-v2`

## Decision

**NON-HUMAN PRE-DEVICE WORK COMPLETE**

実機・実ログイン・人物同定・公開承認など人の判断または操作を必要とする項目を除き、GitHub / Supabase / Vercelで安全に完了できるUI・画像・文言・SEO・Public Gate・CI・Performance・Source・Release文書監査を完了した。

人の手が必要な作業はユーザー指示どおり最後のmanual stageへ保留する。

`main`変更・v2 Production deployは行っていない。

## 1. UI / copy polish

完了:

- Home / Characters / Players / Diagnosis / Tools / Improve / Matchup Card / About / FAQ / Sources / Changelog等の主要文言を再監査
- Public UIに露出していた `Public Gate`、raw `published + verified`、`verification_status`、Supabase等の内部用語を一般向け表現へ整理
- Improvement / Matchup Cardのページタイトル重複を修正
- empty / error stateを「未確認情報を代替表示しない」方針に統一
- 公開Routeの `TODO` / `Coming Soon` 類を追加検索し、明確な残存を確認しなかった

内部のDB Gate / verificationロジック自体は変更していない。

## 2. Image audit / optimization

### Character

実DB:

- playable + published Character: 31
- DB `image_url`: 31件すべて未登録

v2は既存Character画像fallbackを利用する。

改善:

- Next.js Image Optimizationを有効化
- AVIF / WebP対応
- responsive `sizes`追加
- Hero LCP画像をpriority指定
- Character card / detailを最適化経路へ統一
- card image領域を固定し、layout shiftを抑制

### Player

実DB:

- published Player: 41
- DB `image_url`: 41件すべて未登録
- published 41名の `player_aliases`: 追加alias 0

旧画像と現在のPlayer slugが安全に一致すると既に確認済みの17件だけfallback接続した。

対象:

- blaz
- caba
- dogura
- endingwalker
- go1
- higuchi
- hinao
- kilzyou
- micky
- nemo
- ryusei
- sako
- shuto
- tachikawa
- takepi
- tokido
- yamaguchi

残画像について、ハイフン除去・大文字小文字・類似文字列だけで人物同定することはしない。追加aliasもないため、これ以上の機械的な安全接続はできない。人物確認はmanual stageへ保留する。

## 3. SEO / metadata

完了:

- Preview環境はrobotsで全クロール禁止
- Production用robotsはAdmin/API/Authとローカル個人データRouteをクロール対象外に設定
- sitemap対象を主要Public Routeへ拡張
- dynamic Character / Move / Strategy / Player / Video / Diagnosisをsitemap対象化
- OGP image / Twitter imageをコード生成
- metadata title / descriptionを主要ページで整理

GitHub ActionsのローカルBuildではProduction URLを設定しないためmetadataBase warningが出る場合がある。Vercelでは `VERCEL_URL` から解決する設計で、未確定Production domainを推測してハードコードしない。

## 4. Supabase / Security

Project:

- `SF6DNAPro`
- `wnuxaxbrpudyypzdbdho`

確認:

- public table: 38
- RLS enabled: 38 / 38
- Security Advisor: 0 lints
- Current Patch: 1件
- `player_characters -> players` orphan: 0
- `player_characters -> characters` orphan: 0
- `player_aliases -> players` orphan: 0

旧静的版 `DATA_ISSUES.md` のPlayer ID参照切れは現行v2 Blockerではないことを再確認し、文書を現行Supabase基準へ更新した。

Performance Advisorにはunused index / multiple permissive policy等の最適化候補が存在する。

Release直前にRLSを大規模変更するリスクを避け、Security / Public Gateに問題がない限り今回のBlockerとはしない。

## 5. Public Data Gate

Move public readinessは以下を維持:

- Move published
- Classic Command存在
- Classic Command official evidence
- Move official Source
- Current Patch Frame
- Frame verified
- Frame official Source

Strategy public readinessは以下を維持:

- published
- verified
- Source relation

Public Gate漏れを示すDB / static test上の問題は検出しなかった。

## 6. Content publication snapshot — corrected re-audit

2026-08-29実DB:

- published Move: 0
- published Combo: 0
- published Setup: 0
- published Sequence: 0
- published Counter: 0
- published Training: 0

Move:

- draft: 2052
- strict machine gateを満たすdraft候補: **701**
- 条件未達draft: **1351**
- gate-ready Character: **12 / 31**

正しいCharacter別内訳:

- Jamie 93
- Kimberly 76
- Guile 70
- Elena 68
- Chun-Li 68
- C. Viper 67
- Blanka 63
- E. Honda 60
- Dee Jay 52
- Dhalsim 43
- Mai 39
- Yasmine 2

Modern:

- 701候補中Modernあり: 662
- 701候補中Modernなし: 39

701候補の追加構造監査:

- blank slug: 0
- blank name: 0
- duplicate slug group: 0
- blank Classic Command: 0
- Current verified Frame cardinality異常: 0
- duplicate Current verified Frame: 0
- Classic Command missing / duplicate: 0 / 0
- null Startup / Recovery / Damage: 0 / 0 / 0

701候補のofficial Source:

- CAPCOM official Source records: 12
- blank URL: 0
- non-CAPCOM publisher: 0
- accessed_at欠損: 0
- Source origin: `streetfighter.com`

残り19キャラの多くはCurrent Patch verified Frame + official Frame Sourceは存在するが、Move本体 / Classic Commandへのofficial Source relationが不足する。Phase13の既存監査にSupporting Sourceを使ったCharacterもあるため、provenance確認なしに公式relationを一括追加しない。

Strategyで `draft + verified + Source` まで満たす候補:

- Combo: 1
- Setup: 0
- Sequence: 0
- Counter: 0
- Training: 0

重要:

- 機械Gate通過 ≠ publish承認
- `draft ≠ published`
- 件数目的のbulk publishは禁止
- Modern欠損を推測補完しない
- 現状態で攻略系Publicページは安全なempty stateが中心になる

Publication approvalは人の判断を要するため最後のmanual stageへ保留する。自動監査だけを理由にstatus変更しない。

詳細: `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`

## 7. CAPCOM Official Frame Snapshot

既存 `scripts/phase20-fetch-official-frame-snapshots.mjs` のReader URL組み立てに誤りを発見し修正した。

- 修正commit: `ac4ed232d0f73c619ac2681565ab55c289022967`
- Workflow: `Phase20 Official Frame Snapshot`
- Run: `33228209058`
- Result: **PASS**
- Current CAPCOM Japanese frame snapshots: **31 / 31 success**
- 全31キャラ: HTTP 200 / attempt 1
- Artifact: `phase20-official-frame-snapshots-ja-jp`
- Artifact files: 32（31 Character + manifest）
- Artifact ID: `9707625771`

この監査はCAPCOMページの現在取得可能性を確認するものであり、DBのdraftを自動publish / verified化する処理ではない。

## 8. CI final rerun

Application head `634845b9ffedacac0ba706186852f295c2204755` で確認:

- Phase16 Release Acceptance — PASS (`33226223976`)
- Phase15 Runtime Smoke — PASS (`33226223883`)
- Phase15 Browser Acceptance — PASS (`33226223866`)
- Phase15 Lighthouse Audit — PASS (`33226223848`)
- Phase19 Internal Hardening — PASS (`33226223851`)
- Phase20 Verified Content Acceptance — PASS (`33226223857`)
- SF6DNA v2 Web Check — PASS (`33226223854`)
- Phase18 Data Gate Acceptance — PASS (`33226223864`)

Typecheck / Lint / Policy tests / Build / Browser E2E / Data GateはGREEN。

Application head以降の変更は監査スクリプト・Release文書のみであり、Publicアプリ実装には変更していない。

## 9. Lighthouse improvement

画像最適化前の基準:

### Home

- Performance: 0.61
- LCP: 約31.76s
- FCP: 約0.87s
- TBT: 約532ms
- Accessibility: 1.00
- SEO: 1.00

### Character detail

- Performance: 0.84
- LCP: 約4.28s
- FCP: 約0.77s
- TBT: 約152ms
- Accessibility: 1.00
- SEO: 1.00

画像最適化後 `634845b9`:

### Home

- Performance: **0.91**
- LCP: **約3.39s**
- FCP: 約0.80s
- TBT: 約65ms
- CLS: 0
- Accessibility: 1.00
- Best Practices: 0.96
- SEO: 1.00

### Character detail

- Performance: **0.93**
- LCP: **約3.11s**
- FCP: 約0.77s
- TBT: 約109ms
- CLS: 0
- Accessibility: 1.00
- Best Practices: 0.96
- SEO: 1.00

Homeの重大な画像LCP問題は大幅改善した。

## 10. Vercel Preview

最新監査・文書更新前のApplication head `634845b9` PreviewはREADY / Build error 0 / runtime error・fatal 0。

監査ツール・文書更新後のPreviewについても随時READY / Build error 0 / runtime error・fatal 0を確認しており、アプリ実装の変更はない。

PreviewはVercel SSO保護下にあるため、外部fetchだけで実ユーザー操作を代替しない。

## 11. Human / manual stage — intentionally held

以下は人の操作・判断を必要とするため、ユーザー指示どおり最後まで実行しない。

1. 攻略データPublication approval
   - Safe minimal releaseにするか
   - 701候補から個別承認して公開するか
2. 実ログイン済みAdmin / non-adminセッションによるE2E
   - unauth / non-admin boundary
   - Create / Edit / Publish / Archive / re-fetch / cleanup
3. Player残画像の人物同定が必要な確認
4. PC実機テスト
5. iPhone実機テスト
6. Production Readiness最終判定
7. Production deploy（ユーザー明示許可時のみ）

## 12. Release Candidate baseline

Publicアプリ実装の自動Gate済みbaseline:

`634845b9ffedacac0ba706186852f295c2204755`

その後のbranch commitは監査ツール / 文書の更新のみ。

manual stageでPublication status等を変更した場合は、その変更後に改めて最終RC HEADを固定し、PC / iPhone実機テストを行う。

## 13. Production

- `main`: 変更していない
- v2 Production deployment: 実施していない
- Production deployはユーザー明示許可がある場合のみ実施する
