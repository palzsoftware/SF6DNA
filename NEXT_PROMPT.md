# SF6DNA 次回開始指示 — Phase23 Final Manual Stage

最終更新: 2026-08-29 JST

SF6DNAを**Non-human Pre-device / Auth-Admin readiness完了**状態から継続してください。

Phase23を最初からやり直さないでください。

## 現在位置

- Phase1〜22: 完了
- Phase23: 最終manual stage待ち
- Non-human Pre-device work: **完了**
- Auth / Admin non-human readiness: **完了**
- Application automated baseline: `6b5a4b8e1974f677691e655e274da9626bdb18b5`
- CI invariant follow-up: `22af783bc8fb947be138cfcdd56279a053d8f713`
- PC / iPhone実機テスト: HOLD
- Production Readiness: 未判定
- Production deploy: 未実施

ユーザーは、人の手が必要な作業を最後に回すよう指示している。実機・実ログイン・人物同定・Publication approvalを推測完了扱いしない。

## 正本

GitHub:
- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`変更禁止
- main baseline: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`

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
- CAPCOM日本語Frame Snapshot 31 / 31 PASS
- Snapshot run: `33228209058`
- Snapshot Artifact ID: `9707625771`
- Move候補701件の構造 / Evidence監査完了
- Public Move Gateのpolymorphic Source join不具合修正
- Admin publish条件をPublic Gate同等へ強化
- AdminでMove / Command / Frame Evidence Sourceを個別付与可能
- 新規published Moveはdraft→Evidence→strict gate→publishedの順で昇格
- Application regression GREEN
- Vercel Preview READY / Build error 0 / runtime error-fatal 0

Current application regression:

- Phase16 Release Acceptance — PASS (`33239446677`)
- Phase15 Runtime Smoke — PASS (`33239446690`)
- Phase15 Browser Acceptance — PASS (`33239446655`)
- Phase15 Lighthouse Audit — PASS (`33239446718`)
- Phase19 Internal Hardening — PASS (`33239510750`)
- Phase20 Verified Content Acceptance — PASS (`33239446647`)
- SF6DNA v2 Web Check — PASS (`33239446717`)
- Phase18 Data Gate Acceptance — PASS (`33239446644`)

監査文書:

- `docs/PHASE23_PRE_DEVICE_POLISH_AUDIT_2026-08-29.md`
- `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`
- `docs/PHASE23_AUTH_ADMIN_READINESS_2026-08-29.md`
- `docs/PHASE23_AUTOMATED_RC_BASELINE_2026-08-29.md`

## Current DB state

最終read-only確認:

- `auth.users`: **0**
- published Character: 31
- published Diagnosis: 4
- published Move: **0**
- published Combo / Setup / Sequence / Counter / Training: **0**
- strict machine-gate-ready draft Move: **701 / 2052**
- ready Character: 12 / 31
- 701中Modernあり / なし: 662 / 39

701候補の現在DB関数による内訳:

- Dee Jay 105
- Jamie 93
- Blanka 91
- Dhalsim 88
- Kimberly 76
- E. Honda 70
- Guile 70
- Chun-Li 68
- Yasmine 19
- Mai 10
- C. Viper 7
- Elena 4

Machine Gate PASSはpublish approvalではない。自動publishしない。

## 残っている作業 — Human / manual stageのみ

### A. Content Publication approval

人が公開範囲を決定する。

- Safe minimal release
- または701候補から個別承認したMoveのみpublish

### B. Real Auth / Admin E2E

現在`auth.users=0`。正式な実またはテストアカウントを通常のAuthフローで準備する必要がある。

禁止:

- `auth.users`へ直接SQL投入
- 架空credential作成
- static testを実ログインEvidence扱い

実ブラウザで確認:

1. unauthenticated block
2. non-admin write block
3. admin access
4. limited draft Create
5. Edit / save / re-fetch
6. Move / Command / Frame Evidence attachment
7. incomplete EvidenceでPublish拒否
8. approved test dataでstrict Publish成功
9. public read behavior
10. Archive
11. cleanup
12. Public Gate unaffected

### C. Player残画像の人物確認

安全接続済み17名以外は、ファイル名類似だけで機械接続しない。

### D. Final Release Candidate freeze

A〜Cでコード / DB変更が発生した場合は必要な回帰テストを行い、最終RC HEADを固定する。

### E. Final actual-device acceptance

最終RC固定後にのみ実施:

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
- manual Auth Evidenceを静的テストで代用しない
- `main`変更禁止
- Production deployはユーザー明示許可がある場合のみ
