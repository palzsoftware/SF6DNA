# SF6DNA 次回開始指示 — Phase23 Final Manual Stage

最終更新: 2026-08-29 JST

SF6DNAを**Non-human Pre-device作業完了**状態から継続してください。

Phase23を最初からやり直さないでください。

## 現在位置

- Phase1〜22: 完了
- Phase23: 最終manual stage待ち
- Non-human Pre-device work: **完了**
- Application tested head: `634845b9ffedacac0ba706186852f295c2204755`
- Automated RC baseline: `634845b9ffedacac0ba706186852f295c2204755`
- PC / iPhone実機テスト: HOLD
- Production Readiness: 未判定
- Production deploy: 未実施

ユーザーは、実機テスト等の人の手が必要な作業を最後に回すよう指示している。ユーザーがmanual stage開始を指示するまで、実機・実ログイン・人物同定・公開承認を完了扱いにしない。

## 正本

GitHub:
- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`変更禁止

Supabase:
- Project: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- 実DBを正本とする

Vercel:
- Project: `sf-6-dna`
- Project ID: `prj_UwgkJ3pXqGBWhaH6qn6pY8TTZMpR`
- `sf6dna-v2` Previewのみ使用
- v2 Production deploy禁止

Patch:
- `2026.08.03`以降

## Non-human完了Evidence

- UI / copy / image / SEO監査完了
- Next.js Image Optimization反映
- RLS 38 / 38
- Security Advisor 0 lints
- Public Move / Strategy Gate確認済み
- Player DB参照orphan 0
- `KNOWN_ISSUES` / `TECH_DEBT` / `DATA_ISSUES` v2再分類済み
- Application 8 CI workflow PASS
- Vercel Preview READY
- Preview Build error 0
- Preview runtime error / fatal 0
- Lighthouse Home Performance 0.91 / LCP約3.39s
- Lighthouse Character Performance 0.93 / LCP約3.11s
- CAPCOM Official Frame Snapshot workflow修正済み
- CAPCOM日本語Frame Snapshot **31 / 31 PASS**
- Snapshot run: `33228209058`
- Snapshot Artifact ID: `9707625771`

監査文書:

- `docs/PHASE23_PRE_DEVICE_POLISH_AUDIT_2026-08-29.md`
- `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`
- `docs/PHASE23_AUTOMATED_RC_BASELINE_2026-08-29.md`

## Current content state

- published Character: 31
- published Diagnosis: 4
- published Move: 0
- published Combo / Setup / Sequence / Counter / Training: 0
- strict machine-gate-ready draft Move: **701 / 2052**
- ready Character: 12 / 31
- 701中Modernあり / なし: 662 / 39
- `draft + verified + Source` Strategy: Combo 1件のみ

701候補は追加構造 / Source監査済みだが、Machine Gate PASSはpublish approvalではない。自動publishしない。

## 残っている作業 — Human / manual stageのみ

### A. Content Publication approval

人が公開範囲を決定する。

- Safe minimal release
- または701候補から個別承認したMoveのみpublish

必要に応じ、公開変更後に回帰テストを行う。

### B. Real Auth / Admin E2E

実ログイン済みAdmin / non-adminブラウザセッションを使用して:

- unauthenticated block
- non-admin write block
- admin access
- limited Create / Edit / Publish / Archive
- save / re-fetch
- cleanup
- Public Gate unaffected

を確認する。

### C. Player残画像の人物確認

現在安全接続済み17名以外は、ファイル名類似だけで機械接続しない。必要な人物確認をmanualで行う。

### D. Final Release Candidate freeze

A〜Cでコード / DB変更が発生した場合は必要な回帰テストを行い、最終RC HEADを固定する。

### E. Final actual-device acceptance

最終RC固定後に実施:

1. PC実機
2. iPhone実機

チェックリスト:
`docs/PHASE23_REAL_DEVICE_TEST_CHECKLIST_2026-08-29.md`

### F. Production Readiness

manual Acceptance完了後にRelease Ready / Conditional Go / No-Goを判定する。

### G. Production deploy

ユーザーが明示的に許可した場合のみ実施する。

## 絶対ルール

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- bulk verify / publish禁止
- actual-device Evidenceをemulationで代用しない
- manual Evidenceを静的テストで代用しない
- `main`変更禁止
- Production deployはユーザー明示許可がある場合のみ
