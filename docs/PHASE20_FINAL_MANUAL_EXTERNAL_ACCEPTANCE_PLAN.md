# SF6DNA Phase20 Final Manual / External Acceptance Plan

最終更新: 2026-08-28 JST

状態: **未開始 / Final Phase予約**

## Phase20名称

**Final Manual / External Acceptance & Production Decision**

## 位置づけ

Phase20をSF6DNA v2のFinal Phaseとする。

ChatGPT / GitHub / Supabaseだけでは完結できない、人力・外部UI・実デバイス・実認証・Vercel Preview・Public Network依存のAcceptanceをすべてここへ集約する。

Phase19までは内部作業を進め、人力作業が可能になるまでPhase20は開始しない。

## Backlog

### P20-00 Final Baseline
- Phase19完了HEAD固定
- main未変更確認
- Current Patch確認
- Production未公開確認

### P20-01 Vercel Project / Preview
- GitHub `palzsoftware/SF6DNA` import
- Root Directory `v2-web`
- Preview環境変数設定
- Preview deployment
- Preview URL取得
- Production deploymentではないことを確認

### P20-02 Preview Runtime / Logs
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

### P20-03 Real Auth / Admin E2E
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

### P20-04 Actual Device / Browser
- user PC actual browser
- iPhone幅または実iPhone
- responsive layout
- horizontal overflow
- overlap
- keyboard/focus
- form/button reachability
- back navigation
- perceived performance

### P20-05 Public Network Performance
- Preview Lighthouseまたは同等計測
- Top
- Character detail
- Supabase-backed route
- runtime error / response behavior

### P20-06 Final Cross-check
- Phase19 Internal Evidenceとの矛盾確認
- Preview上のPublic Gate再確認
- 実認証によるAdmin境界確認
- Release docs最終確認

### P20-07 Production Readiness Final Decision
判定:
- Release Ready
- Conditional Go
- No-Go

### P20-08 Production Deployment
ユーザーから明示的なProduction deploy許可がある場合のみ実行対象とする。

許可がない場合、Release Ready判定までで停止する。

## Exit Criteria

Final Phase完了条件:
- 必須Manual / External Acceptance完了
- Production Readiness判定済み
- Release blockerが0、またはNo-Go理由が明文化済み
- Production deployはユーザー明示許可に従う

## 絶対ルール

- mainは明示許可まで変更禁止
- Production deployは明示許可まで禁止
- reviewed ≠ verified
- draft ≠ published
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- 件数目的のbulk verify/publish禁止
- actual device Evidenceをemulationだけで代用しない
