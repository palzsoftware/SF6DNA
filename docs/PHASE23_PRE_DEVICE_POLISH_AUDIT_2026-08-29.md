# SF6DNA Phase23 Pre-device Polish Audit

Date: 2026-08-29 JST
Application head: `634845b9ffedacac0ba706186852f295c2204755`
Branch: `sf6dna-v2`

## Decision

**PRE-DEVICE AUTOMATED / STATIC POLISH COMPLETE**

実機テスト前にChatGPT / GitHub / Supabase / Vercelで安全に完了できるUI・画像・文言・SEO・Public Gate・CI・Performance監査を完了した。

ただし、Release Candidate固定前に次の外部または公開判断項目が残る。

1. 実認証セッションによるAdmin Create / Edit / Publish / Archive E2E
2. 攻略データの公開方針決定
3. 上記完了後のRelease Candidate固定
4. PC / iPhone実機テスト

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

旧画像と現在のPlayer slugが完全一致した17件だけfallback接続した。

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

表記変換・人物同定が必要な残画像は推測接続しない。

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

## 6. Content publication snapshot

2026-08-29実DB:

- published Move: 0
- published Combo: 0
- published Setup: 0
- published Sequence: 0
- published Counter: 0
- published Training: 0

Move:

- draft: 2052
- Public Move Gateの機械条件を満たすdraft候補: 701
- 条件未達draft: 1351

701候補は12キャラクターに分布する。

- C. Viper 7
- E. Honda 70
- Elena 4
- Guile 70
- Kimberly 76
- Jamie 93
- Dhalsim 88
- Dee Jay 105
- Blanka 91
- Yasmine 19
- Mai 10
- Chun-Li 68

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
- 現状態で攻略系Publicページは安全なempty stateが中心になる

したがって、初回Releaseを「キャラクター基本情報・診断・個人ツール中心の安全な公開」にするか、701 Move候補等を個別公開監査してからReleaseするかを、Release Candidate固定前に決定する。

## 7. CI final rerun

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

## 8. Lighthouse improvement

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

## 9. Vercel Preview

Application head `634845b9` deployment:

- Deployment: `dpl_3D1HCB6Azx6P3rv5XoAQPHJJC3tH`
- State: READY
- target: Preview
- Build error: 0
- Preview runtime error / fatal（直近24h）: 0

PreviewはVercel SSO保護下にあるため、外部fetchだけで実ユーザー操作を代替しない。

## 10. Auth / Admin

Static / DB boundary確認済み:

- unauthenticated admin accessはAuth導線へ送る
- non-admin roleをAdminとして扱わない
- Admin writeは `requireAdmin()` とRLS境界を使用
- RLS 38 / 38
- Security Advisor 0

未完了:

- 実ログイン済みAdmin / non-adminブラウザセッションによるCreate / Edit / Publish / ArchiveのE2E

この項目は実認証セッションなしに「完了」と推測しない。

## 11. Release Candidate freeze condition

次を満たすまでRC固定しない。

- 攻略データ公開方針決定
- 必要な場合は公開候補の個別監査 / publish
- 実Auth / Admin E2E
- その変更後の必要な回帰テスト

完了後、Release Candidate HEADを固定してPC / iPhone実機テストへ進む。

## 12. Production

- `main`: 変更していない
- v2 Production deployment: 実施していない
- Production deployはユーザー明示許可がある場合のみ実施する
