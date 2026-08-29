# SF6DNA Phase23 Final Manual / External Acceptance Plan

最終更新: 2026-08-29 JST
状態: **Non-human work完了 / Final Manual Stage待ち**

## Phase23名称

**Final Manual / External Acceptance & Production Decision**

## 現在位置

ユーザー指示により、実機・実ログイン・人物同定・Publication approvalなど人の操作または判断が必要な作業を最後にまとめて実施する。

Non-human Pre-device workは完了済み。

Automated application baseline:

`634845b9ffedacac0ba706186852f295c2204755`

詳細:

- `docs/PHASE23_PRE_DEVICE_POLISH_AUDIT_2026-08-29.md`
- `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`
- `docs/PHASE23_AUTOMATED_RC_BASELINE_2026-08-29.md`

## Completed before manual stage

- UI / copy最終監査・調整
- Character / Player画像監査
- Image Optimization / responsive最適化
- metadata / robots / sitemap / OGP / SEO
- Vercel Preview / build / runtime監査
- Static Auth/Admin boundary監査
- Public Move / Strategy Gate最終監査
- `KNOWN_ISSUES` / `TECH_DEBT` / `DATA_ISSUES` 現行v2再監査
- Release文書同期
- Application CI全Gate PASS
- Lighthouse / Performance再計測
- Move候補701件の構造 / Source監査
- Player画像の追加機械照合監査
- CAPCOM Official Frame Snapshot監査ツール修正
- CAPCOM日本語Frame Snapshot 31 / 31 PASS
- Automated RC baseline固定

## P23-00 Automated Baseline — COMPLETE

- Application tested head: `634845b9ffedacac0ba706186852f295c2204755`
- `main`未変更
- Current Patch: `2026.08.03`
- v2 Production未公開
- RLS 38 / 38
- Security Advisor 0
- Application 8 CI Gate PASS

Final RC HEADはmanual stageでDB / code / asset変更が発生した場合、その変更後に固定する。

## P23-01 Vercel Project / Preview — COMPLETE for automated stage

- Vercel Project: `sf-6-dna`
- Project ID: `prj_UwgkJ3pXqGBWhaH6qn6pY8TTZMpR`
- GitHub `palzsoftware/SF6DNA`接続済み
- `sf6dna-v2` Preview成立済み
- Preview READY確認済み
- Build error 0
- runtime error / fatal 0
- v2 Production deploy未実施

manual stageでアプリ変更が発生した場合のみ、変更後Previewを再確認する。

## P23-02 Preview Runtime / Automated Browser — COMPLETE

自動 / static確認済み対象:

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
- `/improve`
- `/matchup-card`
- robots / sitemap / metadata
- safe empty / 404
- build/runtime logs

Phase15 Browser Acceptance / Runtime Smoke等の自動GateはPASS。

## P23-03 Content Publication Approval — MANUAL HOLD

現在:

- published Character: 31
- published Diagnosis: 4
- published Move: 0
- published Strategy: 0
- strict machine-gate-ready draft Move: 701 / 2052
- ready Character: 12 / 31
- 701中Modernあり / なし: 662 / 39
- `draft + verified + Source` Strategy: Combo 1件

701候補は追加構造 / Source監査済みだが、Machine Gate PASSはpublish approvalではない。

人が以下を決定する:

- Safe minimal release
- または701候補から個別承認したMoveのみpublish

件数目的のbulk publishは禁止。

## P23-04 Real Auth / Admin E2E — MANUAL HOLD

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

Static Auth boundary / RLS / Security Advisorは確認済みだが、実セッションEvidenceの代替にはしない。

## P23-05 Player remaining-image identity check — MANUAL HOLD

- published Player: 41
- safety-confirmed fallback: 17
- DB `image_url`: 未登録
- published Player alias追加情報: 0

残画像をファイル名類似だけで機械接続しない。必要な人物同定はmanualで行う。

## P23-06 Final RC Freeze — MANUAL CHANGES後

P23-03〜05でDB / code / assetsに変更が発生した場合:

1. 必要なTypecheck / Lint / Policy / Build / Browser / Data Gateを再実行
2. Preview READYを確認
3. Build/runtime error 0を確認
4. Final RC HEADを固定

変更がなければAutomated application baseline `634845b9...` をFinal RC候補として扱う。

## P23-07 Actual Device / Browser — 最終Acceptance

Final RC固定後に実施する。

- user PC actual browser
- actual iPhone
- responsive layout
- horizontal overflow
- overlap
- keyboard/focus
- form/button reachability
- back navigation
- perceived performance
- localStorage系個人機能の操作確認

正本チェックリスト:

- `docs/PHASE23_REAL_DEVICE_TEST_CHECKLIST_2026-08-29.md`

actual-device Evidenceをemulationだけで代用しない。

## P23-08 Production Readiness Final Decision

manual Acceptance完了後に判定:

- Release Ready
- Conditional Go
- No-Go

## P23-09 Production Deployment

ユーザーから明示的なProduction deploy許可がある場合のみ実行対象とする。

許可がない場合、Release Ready判定までで停止する。

## Completed Performance Evidence

Automated baseline `634845b9`:

### Home

- Performance 0.91
- LCP 約3.39s
- Accessibility 1.00
- SEO 1.00
- CLS 0

### Character detail

- Performance 0.93
- LCP 約3.11s
- Accessibility 1.00
- SEO 1.00
- CLS 0

## Completed Official External Evidence

CAPCOM Official Frame Snapshot:

- Workflow Run: `33228209058`
- Result: PASS
- 31 / 31 Character pages HTTP 200
- all attempt 1
- Artifact ID: `9707625771`

このEvidenceはread-onlyであり、DB status変更を自動化しない。

## Exit Criteria

- Non-human Pre-device work: **完了済み**
- Publication approval: manual
- Real Auth/Admin E2E: manual
- 必要なPlayer人物確認: manual
- Final RC固定
- PC / iPhone actual-device Acceptance
- Production Readiness判定
- Release blockerが0、またはNo-Go理由が明文化済み
- Production deployはユーザー明示許可に従う

## 絶対ルール

- `main`は明示許可まで変更禁止
- v2 Production deployは明示許可まで禁止
- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- Machine Gate PASSだけでpublishしない
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- 件数目的のbulk verify / publish禁止
- actual device Evidenceをemulationだけで代用しない
- manual Auth Evidenceをstatic testで代用しない
