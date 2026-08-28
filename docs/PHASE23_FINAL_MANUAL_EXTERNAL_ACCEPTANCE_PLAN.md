# SF6DNA Phase23 Final Manual / External Acceptance Plan

最終更新: 2026-08-28 JST
状態: **未開始 / Final Phase予約**

## Phase23名称

**Final Manual / External Acceptance & Production Decision**

## 位置づけ

Phase23をSF6DNA v2のFinal Phaseとする。

ChatGPT / GitHub / Supabaseだけでは完結できない、人力・外部UI・実デバイス・実認証・Vercel Preview・Public Network依存のAcceptanceをすべてここへ集約する。

Phase20〜22で内部作業・データ拡充・追加機能を完了し、人力作業が可能になった時点でPhase23を開始する。

## Backlog

### P23-00 Final Baseline
- Phase22完了HEAD固定
- main未変更確認
- Current Patch確認
- Production未公開確認

### P23-01 Vercel Project / Preview
- GitHub `palzsoftware/SF6DNA` import
- Root Directory `v2-web`
- Preview環境変数設定
- Preview deployment
- Preview URL取得
- Production deploymentではないことを確認

### P23-02 Preview Runtime / Logs
確認対象:
- Top
- Characters list/detail
- Moves
- Combos / Setups / Sequences / Counters / Training
- Players list/detail
- Videos list/detail
- Search
- Diagnosis
- AI Coach safe behavior
- `/tools`
- `/favorites`
- `/my-characters`
- `/compare`
- `/rank-tracker`
- `/diagnosis/history`
- `/about`
- `/faq`
- `/sources`
- `/changelog`
- Phase22で追加したImprovement features
- robots / sitemap / metadata
- safe empty / 404
- Vercel build/runtime logs
- 重大5xx 0

### P23-03 Real Auth / Admin E2E
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

### P23-04 Actual Device / Browser
- user PC actual browser
- iPhone幅または実iPhone
- responsive layout
- horizontal overflow
- overlap
- keyboard/focus
- form/button reachability
- back navigation
- perceived performance
- localStorage系個人機能の操作確認

### P23-05 Public Network Performance
- Preview Lighthouseまたは同等計測
- Top
- Character detail
- Supabase-backed route
- Improvement feature主要route
- runtime error / response behavior

### P23-06 Final Cross-check
- Phase19〜22 Internal Evidenceとの矛盾確認
- Preview上のPublic Gate再確認
- 実認証によるAdmin境界確認
- Release docs最終確認

### P23-07 Production Readiness Final Decision
判定:
- Release Ready
- Conditional Go
- No-Go

### P23-08 Production Deployment
ユーザーから明示的なProduction deploy許可がある場合のみ実行対象とする。

許可がない場合、Release Ready判定までで停止する。

## Exit Criteria

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
