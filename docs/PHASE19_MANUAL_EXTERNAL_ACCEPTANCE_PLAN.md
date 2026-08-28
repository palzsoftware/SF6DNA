# SF6DNA Phase19 Manual / External Acceptance Plan

最終更新: 2026-08-28 JST

状態: **未開始 / Phase17から移管済み**

## 位置づけ

Phase19は、人力・外部UI・実デバイス・実認証セッションが必要なAcceptanceだけをまとめて実施するPhaseとする。

Phase17から移管された外部依存を回収し、Production最終判定を行う。

Phase18とは独立する。Phase18はChatGPT側で進行可能な開発・データ品質作業を対象とし、Phase19の人力作業待ちでPhase18を止めない。

## 移管元

- Phase15 external acceptance carryover
- Phase17 P17-01 / P17-02 / real-session part of P17-03 / P17-04 / P17-05

## Phase19 Backlog

### P19-00 External Acceptance Baseline
- Phase18完了時点のHEAD固定
- main未変更確認
- Production未公開確認
- Current Patch確認

### P19-01 Vercel Project / Preview
- GitHub `palzsoftware/SF6DNA` import
- Root Directory `v2-web`
- Preview用環境変数
- Preview deployment
- Preview URL取得
- Production deploymentではないことを確認

### P19-02 Preview Runtime / Logs
- Top
- Characters list/detail
- Players list/detail
- Videos list/detail
- Search
- Diagnosis
- AI Coach safe behavior
- robots / sitemap / metadata
- safe empty / 404
- Vercel build/runtime logs
-重大5xx 0

### P19-03 Real Auth / Admin E2E
安全に準備された実またはテストアカウントを使用する。

確認:
- unauthenticated block
- authenticated non-admin write block
- admin access
- limited Create / Edit / Publish / Archive
- save / re-fetch
- cleanup
- Public Gate unaffected

禁止:
- `auth.users`への直接SQL投入
- 本番攻略データの不要な破壊的変更

### P19-04 Actual Device / Browser
- user PC actual browser
- iPhone幅または実iPhone
- responsive layout
- horizontal overflow
- overlap
- keyboard/focus
- form/button reachability
- back navigation
- perceived performance

### P19-05 Public Network Performance
- Preview Lighthouseまたは同等計測
- Top
- Character detail
- Supabase-backed route
- runtime error / response behavior

### P19-06 Production Readiness Final Decision
判定:
- Release Ready
- Conditional Go
- No-Go

Production deployment自体はユーザー明示許可まで行わない。

## 正本チェックリスト

実施時は以下を使用する:
- `docs/PHASE17_EXTERNAL_ACCEPTANCE_CHECKLIST_2026-08-28.md`
- `docs/V2_RELEASE_READINESS.md`

## 絶対ルール

- mainは明示許可まで変更禁止
- Production deployは明示許可まで禁止
- reviewed ≠ verified
- draft ≠ published
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- 件数目的のbulk verify/publish禁止
- actual device Evidenceをemulationで代用しない
