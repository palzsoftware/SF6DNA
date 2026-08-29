# SF6DNA 次回開始指示 — Phase23 Final Pre-RC Work

最終更新: 2026-08-29 JST

SF6DNAをPhase23 Pre-device automated/static polish完了状態から継続してください。

Phase23を最初からやり直さないでください。

## 現在位置

- Phase1〜22: 完了
- Phase23: 進行中
- Pre-device UI / image / copy / SEO / CI / Performance: 完了
- Application tested head: `634845b9ffedacac0ba706186852f295c2204755`
- PC / iPhone実機テスト: HOLD
- Release Candidate: 未固定

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

## 完了Evidence

- RLS 38 / 38
- Security Advisor 0 lints
- Public Move / Strategy Gate確認済み
- 8 CI workflow PASS
- Vercel Preview READY
- Preview Build error 0
- Preview runtime error / fatal 0
- Lighthouse Home Performance 0.91 / LCP約3.39s
- Lighthouse Character Performance 0.93 / LCP約3.11s

監査文書:

- `docs/PHASE23_PRE_DEVICE_POLISH_AUDIT_2026-08-29.md`
- `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`

## 次に残っている作業

### A. Content publication decision

現在:

- published Move: 0
- published Strategy: 0
- Public Move Gate ready draft: 701
- draft + verified + Source Strategy: Combo 1件

機械Gateだけでbulk publishしない。

初回Releaseをsafe empty state中心で行うか、701 Move候補等を個別監査して公開範囲を増やすか決定する。

### B. Real Auth / Admin E2E

実ログイン済みAdmin / non-adminブラウザセッションを使用して:

- unauthenticated block
- non-admin write block
- admin access
- limited Create / Edit / Publish / Archive
- save / re-fetch
- cleanup

を確認する。

### C. Release Candidate freeze

A/Bによる変更後の必要な回帰テストを通したHEADを固定する。

### D. Final actual-device acceptance

Release Candidate固定後にのみ実施:

1. PC実機
2. iPhone実機

チェックリスト:
`docs/PHASE23_REAL_DEVICE_TEST_CHECKLIST_2026-08-29.md`

## 絶対ルール

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- bulk verify / publish禁止
- actual-device Evidenceをemulationで代用しない
- `main`変更禁止
- Production deployはユーザー明示許可がある場合のみ
