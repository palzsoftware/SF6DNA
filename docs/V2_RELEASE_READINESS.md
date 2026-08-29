# SF6DNA v2 Release Readiness

最終更新: 2026-08-29 JST

## Current decision

**NOT YET RELEASE READY**

Pre-device automated/static polishは完了したが、Release Candidate固定前に以下が残る。

1. 攻略データ公開範囲の決定
2. Real Auth / Admin E2E
3. Release Candidate固定
4. PC / iPhone実機Acceptance
5. Production Readiness最終判定

Production deployはユーザー明示許可がある場合のみ実施する。

## Gate A — Build / Runtime: PASS

Application tested head:
`634845b9ffedacac0ba706186852f295c2204755`

PASS:

- Phase16 Release Acceptance
- Phase15 Runtime Smoke
- Phase15 Browser Acceptance
- Phase19 Internal Hardening
- Phase20 Verified Content Acceptance
- Phase18 Data Gate Acceptance
- SF6DNA v2 Web Check
- Build / Typecheck / Lint / Policy tests

Vercel Preview:

- READY
- Build error 0
- runtime error / fatal 0（確認時直近24h）

## Gate B — Security / Admin: CONDITIONAL

PASS:

- public RLS 38 / 38
- Supabase Security Advisor 0 lints
- unauthenticated / non-admin / admin境界のstatic code確認
- `requireAdmin()` + RLS構成確認

Pending:

- 実Admin / non-adminブラウザセッションによるCreate / Edit / Publish / Archive E2E

実セッション確認なしに完了扱いしない。

## Gate C — Data quality: PASS for protection / publication decision pending

維持する原則:

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedにしない
- Modern CommandをClassicから推測しない
- SourceなしFrameを確定しない
- Current Patchを外れた値をCurrentとして扱わない

Public Gate漏れは確認されていない。

## Gate D — Character encyclopedia: CONTENT SCOPE PENDING

現在:

- playable + published Character: 31
- published Move: 0
- published Combo / Setup / Sequence / Counter / Training: 0

Move draft 2052件中701件はPublic Move Gateの機械条件を満たすが、draftのため公開承認ではない。

初回Releaseをsafe empty state中心にするか、個別公開監査を行うかをRelease Candidate固定前に決定する。

詳細:
`docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`

## Gate E — Diagnosis: INTERNAL PASS / final device pending

- published Diagnosis: 4
- Diagnosis runner実装済み
- 端末内draft answer resume実装済み
- Diagnosis History実装済み
- Browser / policy tests PASS

最終PC / iPhone操作確認はPhase23実機Acceptanceで行う。

## Gate F — AI Coach: SAFE MODE PASS

- Source-backed retrieval中心
- Evidence不足を自由生成で補うGenerationはOFF
- input boundaryあり
- sourced evidence優先

自由生成の全面解禁は初回Release必須ではない。

## Gate G — Deployment / UX: PRE-DEVICE PASS

完了:

- Vercel Preview
- Preview build/runtime log
- metadata / robots / sitemap / OGP
- Preview no-index
- Browser Acceptance
- Lighthouse
- Image Optimization

Lighthouse after optimization:

### Home

- Performance 0.91
- Accessibility 1.00
- Best Practices 0.96
- SEO 1.00
- LCP 約3.39s
- CLS 0

### Character detail

- Performance 0.93
- Accessibility 1.00
- Best Practices 0.96
- SEO 1.00
- LCP 約3.11s
- CLS 0

Pending:

- PC actual browser
- iPhone actual browser
- actual localStorage操作

これらはRelease Candidate固定後の最後の作業として実施する。

## Gate H — Launch decision: PENDING

Production Readinessは実機Acceptance終了後に次から判定する。

- Release Ready
- Conditional Go
- No-Go

## Public Move Gate

Moveは最低限以下を要求する。

1. Character published
2. Move published
3. Classic Command
4. Classic Command official Source
5. Move official Source
6. Current Patch Frame
7. Frame verified
8. Frame official Source
9. Modern Commandは存在する場合だけ表示し、欠損を推測しない

## Public Strategy Gate

Combo / Setup / Sequence / Counter / Trainingは最低限:

1. published
2. verified
3. Source relation

を要求する。

Publicデータ0件の場合、reviewed / unverified / draftを代替表示せずsafe empty stateを出す。

## Production rule

- `main`はユーザー明示許可まで変更しない
- v2 Production deployはユーザー明示許可まで行わない
- 件数確保を理由にverification / publicationルールを緩めない
