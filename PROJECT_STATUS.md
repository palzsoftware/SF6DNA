# SF6DNA v2 Project Status

最終更新: 2026-08-29 JST

## 現在状態

- Phase1〜22: **完了**
- Phase23: **最終manual stage待ち**
- Non-human Pre-device work: **完了**
- Application tested head: `634845b9ffedacac0ba706186852f295c2204755`
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
- 全8 application CI workflow再実行 / PASS
- Lighthouse再計測
- Vercel Preview READY / Build error 0 / runtime error-fatal 0

詳細: `docs/PHASE23_PRE_DEVICE_POLISH_AUDIT_2026-08-29.md`

## Performance

画像最適化前 → 後:

### Home

- Performance: 0.61 → **0.91**
- LCP: 約31.76s → **約3.39s**
- TBT: 約532ms → **約65ms**
- CLS: 0
- Accessibility: 1.00
- SEO: 1.00

### Character detail

- Performance: 0.84 → **0.93**
- LCP: 約4.28s → **約3.11s**
- CLS: 0
- Accessibility: 1.00
- SEO: 1.00

## Current Public Content

- playable + published Character: 31
- published Diagnosis: 4
- published Move: 0
- published Combo / Setup / Sequence / Counter / Training: 0

Move:

- draft: 2052
- strict machine Public Gate ready draft: **701**
- gate not ready: 1351
- ready Character: 12 / 31
- ready候補のModernあり / なし: 662 / 39

701候補について、blank slug/name/Classic Command、duplicate slug、Current Frame cardinality、Classic Command cardinality、Startup/Recovery/Damage欠損などの構造異常は検出していない。Move / Classic Command / Current Frameのrequired official EvidenceもCAPCOM Source relationで確認済み。

Strategy candidate (`draft + verified + Source`):

- Combo: 1
- Setup / Sequence / Counter / Training: 0

701件は機械Gate通過でありpublish承認ではないため、自動publishしていない。

詳細: `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`

## CAPCOM Official Snapshot

- Audit script fix: `ac4ed232d0f73c619ac2681565ab55c289022967`
- Workflow: `Phase20 Official Frame Snapshot`
- Run: `33228209058`
- Result: **PASS**
- CAPCOM Japanese frame pages: **31 / 31 HTTP 200**
- Artifact: `phase20-official-frame-snapshots-ja-jp`
- Artifact ID: `9707625771`

このSnapshot取得はEvidence監査用であり、DB statusを変更しない。

## 残作業 — Human / manual stageのみ

### 1. 攻略データPublication approval

人による公開範囲の判断。

- Safe empty state中心のminimal release
- または701 Move候補から個別承認したもののみpublish

Machine Gateだけを根拠にbulk publishしない。

### 2. Real Auth / Admin E2E

実ログイン済みAdmin / non-adminセッションで確認する。

- unauthenticated block
- non-admin write block
- admin access
- limited Create / Edit / Publish / Archive
- save / re-fetch
- cleanup
- Public Gate unaffected

静的Auth境界、RLS、Security Advisorは確認済みだが、実セッションE2Eを推測完了扱いしない。

### 3. Player残画像の人物確認

機械的に安全確定できない画像だけmanual確認する。

### 4. 最終Release Candidate固定

manual stageでPublication status等の変更が発生した場合、その変更後に必要な回帰テストを実施して最終RC HEADを固定する。

### 5. PC / iPhone実機テスト

最終RCに対して実施する。

### 6. Production Readiness判定

実機Acceptance完了後に最終判定する。

### 7. Production deploy

ユーザーが明示的に許可した場合のみ実施する。

## Automated RC baseline

Publicアプリ実装の自動Gate済みbaseline:

`634845b9ffedacac0ba706186852f295c2204755`

このcommit以降の現時点の変更は監査ツール / 文書更新で、Publicアプリ実装の動作変更はない。

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
