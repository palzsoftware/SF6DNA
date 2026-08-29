# SF6DNA Phase23 Auth / Admin Readiness

Date: 2026-08-29 JST
Branch: `sf6dna-v2`
Supabase: `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)

## Status

**NON-HUMAN AUTH / ADMIN READINESS COMPLETE / REAL SESSION E2E HELD**

実ログイン・人物同定・Publication approval・実機操作はユーザー指示により最後のmanual stageへ保留する。本書は実セッションなしで安全に確認・修正できるAuth / Admin境界の最終記録である。

## Auth inventory / role boundary

2026-08-29最終read-only確認:

- `auth.users`: **0**
- 既存Admin実アカウント: 0
- 既存non-admin実アカウント: 0
- 新規Auth userはtriggerにより`profiles.role='user'`で作成される
- 一般ユーザーが自身のroleをadminへ自己昇格できないRLSを確認
- Admin判定は`private.is_admin()`を使用

Real Auth E2Eでは次を禁止する。

- `auth.users`への直接SQL投入
- 架空credential作成
- static/RLS testを実ログインEvidenceとして扱う

## Completed release hardening

### Move publication

- polymorphic `entity_sources`に対するPostgREST inferred join依存を除去
- Move / Classic Command / Current verified FrameのEvidenceを`entity_type / entity_id`で明示照合
- 3対象すべてにofficial Sourceを要求
- Admin publish条件をPublic Move Gateと同等へ強化
- Admin UIでMove / Command / FrameへSourceを個別付与可能
- 新規Moveをpublished指定しても、draft作成→Command/Frame/Evidence登録→strict gate再確認→published昇格の順に変更

### Strategy publication

Combo / Setup / Sequence / Counter / Trainingは、新規published指定でもdraft作成→Source relation登録→published昇格の順に統一した。Source登録失敗時にpublished rowだけが残る状態を防止した。

### Diagnosis publication completeness

Admin側:

- 新規Diagnosisの直接published作成を禁止
- 新規Questionの直接published作成を禁止
- published Diagnosisにはpublished Questionを1件以上要求
- published QuestionにはOptionを1件以上要求
- published Questionの最後のOption削除を禁止

DB/RLS側:

- release-ready Diagnosisのみpublic read
- Question / Optionもrelease-readyな親Diagnosis配下のみpublic read

既存published Diagnosis 4件は、公開質問数`12 / 10 / 10 / 20`、Optionなし公開Question 0件で、全件release-readyを確認済み。

### Character Trait Score publication

旧Adminは`source_id`だけを保存していた一方、Public Recommendationは`entity_sources(entity_type='character_trait_score')`を要求していたため整合しなかった。

修正後:

- publishedには`verification_status='verified'`とSourceを要求
- `entity_sources` relationを必ず作成
- 新規published指定はdraft→Source relation→published
- DB/RLSもpublished + verified + Source relation + published Character + published Traitを要求

現DBのCharacter Trait Scoreは372件、published 0件のため既存公開挙動への影響なし。

### Current Patch switch atomicity

旧AdminはCurrent Patchを一度全解除してから次を設定していたため、後半失敗時にCurrent Patchが0件になるリスクがあった。

修正:

- migration: `20260829_phase23_atomic_current_patch_switch.sql`
- RPC: `public.set_current_patch(uuid)`
- Adminは新Patchを`is_current=false`で作成し、必要時だけRPCでCurrentへ切替
- 切替はDB transaction内で実施
- admin checkを維持
- Security Advisor指摘を受け、follow-up `20260829_phase23_current_patch_rpc_security_invoker.sql` でRPCを`SECURITY INVOKER`へ変更
- 最新Security Advisor: **0 lints**
- Current Patchは`2026.08.03`が1件のまま

### Relation audit

Admin relation tablesとRLSを横断監査した。現在の実データで以下のdraft-parent漏出は0件。

- published Player → non-published Character relation: 0
- published Tournament → non-published Player result: 0
- published Match → non-published Player/Character participant: 0
- published Strategy親配下のrelation: 0（Strategy自体published 0）
- published Video relation 5件はすべてpublished Character向け

現状データに対するrelease blockerは確認されなかったため、推測的なrelation仕様変更は行っていない。

## Automated baseline

Application implementation head:

`3c702ca0dad54ab2f73a2a940d1cc17e6511d3f1`

DB hardening follow-up:

`5c46de5f0a81e4c9996b5ff30f7896aa7cdf651e`

CI invariant follow-up:

`4c3dedad21fff648a2c887a7a66ba9b68bb05b23`

Application head `3c702ca0...` の8 workflowは全PASS:

- Phase16 Release Acceptance — `33240366996`
- Phase15 Runtime Smoke — `33240366991`
- Phase15 Browser Acceptance — `33240367023`
- Phase15 Lighthouse Audit — `33240366981`
- Phase19 Internal Hardening — `33240367007`
- Phase20 Verified Content Acceptance — `33240367003`
- SF6DNA v2 Web Check — `33240366993`
- Phase18 Data Gate Acceptance — `33240367041`

DB follow-up `5c46de5f...` のPhase19もPASS: `33240529766`。

## Vercel Preview

DB follow-up head `5c46de5f...`:

- Deployment: `dpl_8sdQJbKXF3EYmGgeQbsRMnk1jM74`
- State: READY
- target: Preview
- Production deploy: 未実施

直前のCI follow-up PreviewでもBuild error 0 / runtime error-fatal 0を確認済み。

## DB no-change check

- `auth.users`: 0
- published Move: 0
- published Combo / Setup / Sequence / Counter / Training: 0
- published Character Trait Score: 0
- published Diagnosis: 4

今回のhardeningで攻略コンテンツのPublication statusやAuth userは変更していない。

## Remaining Real Auth / Admin E2E — manual only

正式な実またはテストアカウントを通常Authフローから準備した後、実ブラウザセッションで以下を確認する。

1. unauthenticated admin block
2. non-admin write block
3. admin access
4. limited draft Create
5. Edit / save / re-fetch
6. Evidence attachment
7. incomplete Evidence publish rejection
8. approved test dataでPublish成功
9. public read behavior
10. Archive
11. cleanup
12. Public Gate unaffected

この実セッションE2E完了前にFinal RCとは判定しない。
