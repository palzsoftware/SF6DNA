# SF6DNA v2 Project Status

最終更新: 2026-09-01 JST

## 現在状態

- Phase1〜22: **完了**
- Phase23: **Final Manual Stage待ち**
- 31キャラ攻略データ（文言・画像Source）収集: **31 / 31完了**
- Safe non-human / pre-device work: **完了（2026-09-01再監査）**
- Auth / Admin non-human readiness: **完了**
- PC / iPhone実機テスト: **最後のmanual stageとしてHOLD**
- Production Readiness: **未判定 / manual stage後**
- v2 Production deploy: **未実施**

ユーザー指示により、実ログイン・人物同定・Publication approval・PC/iPhone実機操作など人の手または判断を必要とする工程は最後にまとめて実施する。

撮影待ちの詳細は`capture_backlog`で保持する。ユーザーが撮影可能と明示した時点で、キャラ別・優先度順に提示する。

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- main baseline: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Vercel project: `sf-6-dna`
- Vercel project ID: `prj_UwgkJ3pXqGBWhaH6qn6pY8TTZMpR`
- Current Patch: `2026.08.03`

## Current automated baseline

- Application implementation: `3c702ca0dad54ab2f73a2a940d1cc17e6511d3f1`
- DB hardening follow-up: `5c46de5f0a81e4c9996b5ff30f7896aa7cdf651e`
- CI invariant follow-up: `4c3dedad21fff648a2c887a7a66ba9b68bb05b23`

Application head `3c702ca0...` の8 workflowは全PASS:

- Phase16 Release Acceptance — `33240366996`
- Phase15 Runtime Smoke — `33240366991`
- Phase15 Browser Acceptance — `33240367023`
- Phase15 Lighthouse Audit — `33240366981`
- Phase19 Internal Hardening — `33240367007`
- Phase20 Verified Content Acceptance — `33240367003`
- SF6DNA v2 Web Check — `33240366993`
- Phase18 Data Gate Acceptance — `33240367041`

DB follow-up `5c46de5f...`:

- Phase19 Internal Hardening — PASS `33240529766`
- Phase18 Data Gate Acceptance — PASS

## Latest Preview / Security

DB follow-up Preview:

- Deployment: `dpl_8sdQJbKXF3EYmGgeQbsRMnk1jM74`
- READY
- Previewのみ

CI follow-up Preview `dpl_9iFYnQTxXuCUyJ3cJmTGxbMSm6Rt`:

- READY
- Build error 0
- runtime error / fatal 0

Supabase:

- Security Advisor: **0 lints**
- Current Patch: `2026.08.03`が1件
- Auth user: 0

## 31-character strategy collection snapshot

2026-09-01実DB再監査:

| Entity | Active | Draft | Unverified | Reviewed | Verified | Published | Source欠損 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Combo | 1213 | 1213 | 1078 | 134 | 1 | 0 | 0 |
| Setup | 792 | 792 | 703 | 89 | 0 | 0 | 0 |
| Sequence | 475 | 475 | 439 | 36 | 0 | 0 | 0 |
| Training | 2974 | 2974 | 2481 | 493 | 0 | 0 | - |

- Character Content Package: **31 / 31 complete**
- Active Strategy: **2480**
- Training relationなし: **0**
- Pending captureなし: **0**
- Combo notation重複group: **0**
- capture_backlog参照切れ / Character不一致: **0**
- Pending capture: **2553**（詳細は撮影開始時に提示）
- キャラ別Active Strategy範囲: **64〜168件**

これらは収集完了を示すが、実機成立確認またはPublication approvalを示さない。全Strategyを`draft`のまま維持する。

詳細: `docs/PHASE33_31_CHARACTER_STRATEGY_AUDIT_2026-09-01.md`

## 完了したPhase23 non-human hardening

- UI / copy / responsive / SEO / metadata監査
- Character / Player画像監査
- safety-confirmed Player fallback 17名
- Next.js Image Optimization
- Vercel build/runtime監査
- CAPCOM公式Frame Snapshot 31 / 31 PASS
- Public Move / Strategy Gate監査
- Move / Classic Command / Current verified Frameのofficial Evidence Gate整合
- Move Admin publishをdraft→Evidence→strict gate→publishedへ変更
- Strategy 5種をdraft→Source relation→publishedへ変更
- Diagnosis completeness GateをAdmin/RLSへ追加
- Character Trait ScoreのSource relation / Public GateをAdmin/RLSへ整合
- Current Patch切替をatomic RPC化
- RPCを`SECURITY INVOKER`化
- relation RLS/実データ横断監査
- Security Advisor再監査 0 lints

詳細:

- `docs/PHASE23_PRE_DEVICE_POLISH_AUDIT_2026-08-29.md`
- `docs/PHASE23_AUTH_ADMIN_READINESS_2026-08-29.md`
- `docs/PHASE23_AUTOMATED_RC_BASELINE_2026-08-29.md`

## Current Public Content

最終read-only確認:

- playable + published Character: 31
- published Diagnosis: 4
- published Move: 0
- published Combo / Setup / Sequence / Counter / Training: 0
- published Character Trait Score: 0
- `auth.users`: 0

今回のhardeningでは攻略コンテンツのPublication statusやAuth userを変更していない。

## Move machine-gate snapshot

実DBの`private.is_move_public_ready(m.id)`で再集計:

- draft Move: 2052
- strict machine-ready: **701**
- not ready: 1351
- ready Characters: 12 / 31
- Modernあり / なし: **662 / 39**

Character別:

- Dee Jay 105
- Jamie 93
- Blanka 91
- Dhalsim 88
- Kimberly 76
- E. Honda 70
- Guile 70
- Chun-Li 68
- Yasmine 19
- Mai Shiranui 10
- C. Viper 7
- Elena 4

701件はMove / Classic Command / Current verified Frameのrequired official Evidenceを満たすが、Machine Gate PASSはPublication approvalではないためdraftを維持する。

詳細: `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`

## Strategy / Diagnosis / Trait state

Strategy `draft + verified + Source relation`:

- Combo 1
- Setup 0
- Sequence 0
- Counter 0
- Training 0

収集済みStrategy全体は上記31-character snapshotを参照。`Sourceあり ≠ verified`のため、未確認データを自動昇格しない。

Published Diagnosis 4件:

- published Question数 12 / 10 / 10 / 20
- Optionなしpublished Question 0
- 全4件release-ready

Character Trait Score:

- total 372
- published 0
- public-ready 0

## Performance baseline

Home:
- Performance 0.91
- Accessibility 1.00
- SEO 1.00
- LCP 約3.39s
- CLS 0

Character detail:
- Performance 0.93
- Accessibility 1.00
- SEO 1.00
- LCP 約3.11s
- CLS 0

最新Lighthouse workflowもPASS。

## CAPCOM Official Snapshot

- Run: `33228209058`
- Result: PASS
- CAPCOM Japanese frame pages: 31 / 31 HTTP 200
- Artifact: `phase20-official-frame-snapshots-ja-jp`
- Artifact ID: `9707625771`

## 残作業 — Human / manual stageのみ

### 1. Content Publication approval

- Safe minimal release
- または701 Move候補から内容を個別承認したもののみpublish

bulk publish禁止。

### 2. Real Auth / Admin E2E

正式な実またはテストアカウントを通常Authフローで準備し、実ブラウザでunauthenticated / non-admin / admin / Create / Edit / Evidence / Publish rejection-success / Archive / cleanupを確認する。

### 3. Player残画像の人物確認

必要な場合だけmanual確認。ファイル名類似で接続しない。

### 4. Final RC freeze

manual stageでDB / code / assetsが変われば、その変更後に回帰テストを実施してFinal RC HEADを固定する。

### 5. PC / iPhone実機テスト

Final RCに対して最後に実施する。

### 6. Production Readiness判定

実機Acceptance後にRelease Ready / Conditional Go / No-Goを判定する。

### 7. Production deploy

ユーザーが明示的に許可した場合のみ実施する。

## Data quality rules

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- 件数目的のbulk verify / publish禁止
- AI CoachはEvidence不足を自由生成で補わない

## Modern Command

- Current Move: 2052
- Classic: 2052 / 2052
- Modern: 1441 / 2052
- Missing Modern: 611

公式情報から安全に取得できないModernは未入力を維持する。
