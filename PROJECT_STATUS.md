# SF6DNA v2 Project Status

最終更新: 2026-08-29 JST

## 現在状態

- Phase1〜22: **完了**
- Phase23: **進行中**
- Pre-device automated/static polish: **完了**
- Application tested head: `634845b9ffedacac0ba706186852f295c2204755`
- PC / iPhone実機テスト: **Release Candidate固定後の最後の確認としてHOLD**
- Production Readiness: **未判定**
- v2 Production deploy: **未実施**

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- main baseline: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch baseline: `2026.08.03`

## 完了したPre-device作業

- 全主要ページUI / copy再監査
- 公開画面の内部管理用語整理
- Character / Player画像監査
- exact-match Player画像17件の安全なfallback接続
- Next.js Image Optimization導入
- Home / Character / Player画像のresponsive最適化
- metadata / robots / sitemap / OGP整理
- Preview検索クロール禁止
- Release docs更新
- KNOWN_ISSUES / TECH_DEBTのv2再分類
- Supabase RLS 38 / 38確認
- Security Advisor 0 lints確認
- Public Move / Strategy Gate再確認
- 全8 CI workflow再実行 / PASS
- Lighthouse再計測
- 最新Vercel Preview READY / Build error 0 / runtime error-fatal 0

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

- draft 2052
- machine Public Gate ready draft: 701

Strategy candidate (`draft + verified + Source`):

- Combo: 1
- Setup / Sequence / Counter / Training: 0

701件は機械Gate通過でありpublish承認ではないため、自動publishしていない。

詳細: `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`

## 残作業 — 実機テスト前

### 1. 攻略データ公開方針決定

現在の安全なempty state中心で初回Releaseするか、701 Move候補等を個別監査して公開範囲を増やしてからReleaseするかを決定する。

### 2. Real Auth / Admin E2E

実ログイン済みAdmin / non-adminセッションで次を確認する。

- unauthenticated block
- non-admin write block
- admin access
- limited Create / Edit / Publish / Archive
- save / re-fetch
- cleanup
- Public Gate unaffected

静的Auth境界、RLS、Security Advisorは確認済みだが、実セッションE2Eを推測完了扱いしない。

### 3. Release Candidate固定

上記でコード / DB変更が発生した場合に必要な回帰テストを行い、Release Candidate HEADを固定する。

## 最後の作業

Release Candidate固定後:

1. PC実機テスト
2. iPhone実機テスト
3. Production Readiness最終判定
4. Production deploy（ユーザー明示許可がある場合のみ）

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
