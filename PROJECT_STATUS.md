# SF6DNA v2 Project Status

最終更新: 2026-08-29 JST

## 現在状態

- Phase1〜22: **完了**
- Phase23: **最終manual stage待ち**
- Non-human Pre-device work: **完了**
- Auth / Admin non-human readiness: **完了**
- Application automated baseline: `6b5a4b8e1974f677691e655e274da9626bdb18b5`
- CI invariant follow-up: `22af783bc8fb947be138cfcdd56279a053d8f713`
- PC / iPhone実機テスト: **最後のmanual stageとしてHOLD**
- Production Readiness: **未判定 / manual stage後**
- v2 Production deploy: **未実施**

ユーザー指示により、実機・実ログイン・人物同定・Publication approval等、人の操作または判断を必要とする作業は最後まで保留する。

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- main baseline: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch baseline: `2026.08.03`

## 完了したNon-human Pre-device作業

- 全主要ページUI / copy再監査
- 公開画面の内部管理用語整理
- Character / Player画像監査
- 安全確認済みPlayer画像17件のfallback接続
- Player alias機械監査（published 41名に追加aliasなし）
- Next.js Image Optimization導入
- Home / Character / Player画像のresponsive最適化
- metadata / robots / sitemap / OGP整理
- Preview検索クロール禁止
- Release docs更新
- `KNOWN_ISSUES.md` / `TECH_DEBT.md` / `DATA_ISSUES.md` のv2再分類
- Supabase参照整合性監査
- Supabase RLS 38 / 38確認
- Security Advisor 0 lints確認
- Public Move / Strategy Gate再確認
- Move候補701件の構造 / Source再監査
- CAPCOM公式Frame Snapshotスクリプト修正
- CAPCOM日本語Frame Snapshot **31 / 31取得PASS**
- Lighthouse再計測
- Vercel Preview READY / Build error 0 / runtime error-fatal 0

詳細: `docs/PHASE23_PRE_DEVICE_POLISH_AUDIT_2026-08-29.md`

## Auth / Admin readiness追加監査

2026-08-29にReal Auth E2E前の境界を追加監査した。

Supabase:

- `auth.users`: **0**
- 新規Auth userはtriggerで`profiles.role='user'`として作成
- 一般ユーザーが自身のroleをadminへ自己昇格できないRLSを確認
- `private.is_admin()`によるAdmin判定を確認

実ユーザー0件のため、Real Admin / non-admin browser E2Eはmanual stageまで保留する。偽Auth userをSQL投入して代用しない。

監査中にMove Admin / Public Gateのリリース前不具合を検出・修正:

1. polymorphic `entity_sources`に対するPostgREST inferred join依存を除去
2. Admin publish条件をPublic Move Gateと同等へ強化
3. Move / Command / FrameへEvidence Sourceを個別付与できるAdmin UIを追加
4. 新規published Moveはdraft作成→Evidence登録→厳格Gate再確認→published昇格へ変更
5. Phase19 / Phase20 CIへ再発防止invariant追加

詳細: `docs/PHASE23_AUTH_ADMIN_READINESS_2026-08-29.md`

## Automated regression — current baseline

Application code head `6b5a4b8e1974f677691e655e274da9626bdb18b5` とCI-only follow-up `22af783bc8fb947be138cfcdd56279a053d8f713` で確認:

- Phase16 Release Acceptance — PASS (`33239446677`)
- Phase15 Runtime Smoke — PASS (`33239446690`)
- Phase15 Browser Acceptance — PASS (`33239446655`)
- Phase15 Lighthouse Audit — PASS (`33239446718`)
- Phase19 Internal Hardening — PASS (`33239510750`)
- Phase20 Verified Content Acceptance — PASS (`33239446647`)
- SF6DNA v2 Web Check — PASS (`33239446717`)
- Phase18 Data Gate Acceptance — PASS (`33239446644`)

最新CI follow-up Preview:

- SHA: `22af783bc8fb947be138cfcdd56279a053d8f713`
- Deployment: `dpl_CHHhrT5RgaXP9LGGHMm7mPSE2PgT`
- READY
- target: Preview
- Build error: 0
- runtime error / fatal: 0

## Performance baseline

画像最適化後の既存計測:

### Home

- Performance: **0.91**
- LCP: **約3.39s**
- TBT: **約65ms**
- CLS: 0
- Accessibility: 1.00
- SEO: 1.00

### Character detail

- Performance: **0.93**
- LCP: **約3.11s**
- CLS: 0
- Accessibility: 1.00
- SEO: 1.00

最新Lighthouse workflowもPASSしている。

## Current Public Content

最終read-only確認:

- playable + published Character: 31
- published Diagnosis: 4
- published Move: **0**
- published Combo / Setup / Sequence / Counter / Training: **0**
- `auth.users`: **0**

今回のAuth/Admin readiness作業では実ユーザー・攻略コンテンツstatusを変更していない。

Move:

- draft: 2052
- strict machine Public Gate ready draft: **701**
- gate not ready: 1351
- ready Character: 12 / 31
- ready候補Modernあり / なし: 662 / 39

現DB関数による正しいCharacter別内訳:

- Dee Jay 105
- Jamie 93
- Blanka 91
- Dhalsim 88
- Kimberly 76
- E. Honda 70
- Guile 70
- Chun-Li 68
- Yasmine 19
- Mai 10
- C. Viper 7
- Elena 4

701候補はMove / Classic Command / Current verified Frameのrequired official Evidenceを701 / 701で確認済み。ただしMachine Gate PASSはpublish承認ではないため自動publishしない。

詳細: `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`

## CAPCOM Official Snapshot

- Audit script fix: `ac4ed232d0f73c619ac2681565ab55c289022967`
- Workflow: `Phase20 Official Frame Snapshot`
- Run: `33228209058`
- Result: **PASS**
- CAPCOM Japanese frame pages: **31 / 31 HTTP 200**
- Artifact: `phase20-official-frame-snapshots-ja-jp`
- Artifact ID: `9707625771`

## 残作業 — Human / manual stageのみ

### 1. 攻略データPublication approval

人による公開範囲の判断。

- Safe empty state中心のminimal release
- または701 Move候補から個別承認したもののみpublish

Machine Gateだけを根拠にbulk publishしない。

### 2. Real Auth / Admin E2E

現在Auth user 0件。正式な実またはテストアカウントをAuthフローから準備し、実ブラウザセッションで確認する。

- unauthenticated block
- non-admin write block
- admin access
- limited Create / Edit / Evidence attach / Publish / Archive
- incomplete Evidence publish rejection
- save / re-fetch
- cleanup
- Public Gate unaffected

### 3. Player残画像の人物確認

機械的に安全確定できない画像だけmanual確認する。

### 4. 最終Release Candidate固定

manual stageでPublication status / test data / code等の変更が発生した場合、その変更後に必要な回帰テストを実施して最終RC HEADを固定する。

### 5. PC / iPhone実機テスト

最終RCに対して最後に実施する。

### 6. Production Readiness判定

実機Acceptance完了後に最終判定する。

### 7. Production deploy

ユーザーが明示的に許可した場合のみ実施する。

## Data quality rules

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Commandを登録しない
- SourceなしFrameを確定登録しない
- 件数目的でbulk verify / publishしない
- AI CoachはEvidence不足を自由生成で補わない

## Modern Command

- Current Move: 2052
- Classic: 2052 / 2052
- Modern: 1441 / 2052
- Missing Modern: 611

公式情報から安全に取得できない611件は未入力を維持する。
