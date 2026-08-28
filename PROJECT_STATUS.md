# PROJECT_STATUS.md

最終更新: 2026-08-28 JST

## SF6DNA v2 現在状態

Phase1〜20のautomated/internal scopeは完了済み。
Phase20 `Verified Content Expansion` はCAPCOM公式Frame Dataとの追加照合とPhase1〜20横断Gap監査まで完了した。

- Phase20: **COMPLETE / PASS**
- Phase21: **未開始**
- Phase22: **未開始**
- Phase23: **未開始 / Final Manual & External Acceptance**
- Demo Release Decision: **CONDITIONAL GO**
- Production Ready: **未判定 / Phase23依存**

ユーザーの明示許可なしにPhase21へ進まない。

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- main baseline SHA: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`

## Phase管理

| Phase | 状態 | 内容 |
|---|---|---|
| Phase1〜12 | **定義どおり完了** | Foundation / Architecture / Data Model / Next.js / Character / Search / Diagnosis / Player / Strategy / Admin / AI Retrieval / Replay Research |
| Phase13 | **完了** | Character Content Verification & Expansion |
| Phase14 | **完了** | Application Integration / Public Data Gate |
| Phase15 | Internal acceptance実施 / external残件移管 | Runtime / Browser / Lighthouse / Auth static acceptance |
| Phase16 | **完了 / Conditional Go** | Release Candidate hardening |
| Phase17 | **完了** | Automated/Internal closure |
| Phase18 | **完了** | Verified Content / Public Gate hardening |
| Phase19 | **完了** | Internal Data Integrity & Release Hardening |
| Phase20 | **完了 / PASS** | Verified Content Expansion + Phase1〜20 final gap audit |
| Phase21 | **未開始** | Modern Command Coverage & Pre-Release Integration |
| Phase22 | **未開始** | Improvement Features |
| Phase23 | **未開始** | Final Manual / External Acceptance & Production Decision |

## Phase20 Final Results

### Current Move / Frame

Phase20開始時:
- Current Frame: 2065
- verified: 307
- reviewed: 1752
- unverified: 6

Phase20最終active set:
- active Move: **2052**
- Current Frame: **2052**
- verified: **2020 / 2052 (98.4%)**
- reviewed: **32**
- unverified: **0**
- verified rows with official CAPCOM `official_frame_data` Source: **2020 / 2020**
- active Move without Current Frame: **0**
- active Move with multiple Current Frames: **0**

残32件:
- Taunt 31
- Alex `Exit Prowler Stance` 1

これらはsecondary Evidenceのみで、CAPCOM公式Character Frame Dataに直接対応する独立行を確認できないためreviewed維持。
100%表示のための推測verified化は行わない。

### Strategy

- Combo: 341 / verified 1
- Setup: 186 / verified 0
- Sequence: 186 / verified 0
- Counter: 1122 / verified 0
- Training: 1477 / verified 0

Source存在だけでは攻略手順自体を証明しないため、新規bulk verificationなし。

### Character Guide

- total: 278
- Source linked: 278
- verified: 0

### Character Trait Score

- total: 372
- Source linked: 372
- verified: 0

## Phase20 Final Cleanup

完了:
- CAPCOM ja-jp / en-uk Frame snapshot crosscheck
- exact / semantic / bilingual / field-only / strength-group照合
- CAPCOM parser hardening
- 明確なDB値差の訂正
- legacy/duplicate Frameの履歴化
- obsolete Moveの`archived`化
- temporary audit RPC削除
- temporary Frame Crosscheck workflow退役
- Supabase Security Advisor **0 lints**
- Phase1〜20 retrospective implementation gap audit

Phase20中に使用した一時RPC:
- `public._phase20_frame_audit_fingerprints()`

は削除済み。

Repository migration:
- `supabase/migrations/20260828_phase20_remove_temporary_audit_rpc.sql`

## Phase1〜20 Implementation Gap Audit

正本:
- `docs/PHASE20_PHASE1_TO_20_RETROSPECTIVE_GAP_AUDIT_2026-08-28.md`

判定:
- Phase1〜20 automated/internal completion gateに対する重大な未実装: **0**
- 後続Phaseで吸収済みの初期Backlogは実装済みとして確認
- 将来機能（Replay映像解析等）は未実装欠陥扱いにしない
- AI Coach GenerationはEvidence条件成立まで**OFFが仕様**
- Vercel / real Auth / actual device / public network performanceはPhase23 Manual / External Acceptance
- Audit LogはPhase17でRelease Gate必須ではないと正式判定済み

## Public Data Gate

維持:

### Move
1. Move published
2. Classic Commandあり
3. Classic Command official Evidence
4. Move official Source
5. Current Patch Frame
6. Frame verified
7. Current Frame official Source
8. Modern Commandは任意 / 推測禁止

### Strategy
- published
- verified
- Source relationあり

### Character Guide
- published + verified

### Recommendation
- published + verified + Source付きTrait Score

### AI Coach
- Source付きEvidence
- Current Patch
- input boundary
- Generation **OFF**

## Legacy Parity追加済み機能

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

## Phase21 — 未開始

正本:
- `docs/PHASE21_PRIORITY_A_PLAN.md`

主対象:
- Modern Command不足分のSource付き収集
- Legacy parity Acceptance対象化
- Release docs同期
- Regression

これはPhase21の正式Backlogであり、Phase20の実装漏れとして先行実装しない。

## Phase23 — Final Manual / External Acceptance

外部・人力依存:
1. Vercel Project / Preview
2. Preview runtime / logs
3. real Admin / non-admin authenticated E2E
4. actual PC / iPhone / device browser
5. public network performance
6. Phase20〜22追加機能の実画面Acceptance
7. Production Readiness final decision
8. Production deploy（ユーザー明示許可がある場合のみ）

## 主要文書

- `docs/V2_REQUIREMENTS.md`
- `docs/V2_ARCHITECTURE.md`
- `docs/PHASE14_FINAL_AUDIT_2026-08-28.md`
- `docs/PHASE16_RELEASE_CANDIDATE_AUDIT_2026-08-28.md`
- `docs/PHASE17_FINAL_AUDIT_2026-08-28.md`
- `docs/PHASE18_FINAL_AUDIT_2026-08-28.md`
- `docs/PHASE19_FINAL_AUDIT_2026-08-28.md`
- `docs/PHASE20_VERIFIED_CONTENT_EXPANSION_PLAN.md`
- `docs/PHASE20_VERIFIED_CONTENT_COVERAGE_REPORT_2026-08-28.md`
- `docs/PHASE20_PHASE1_TO_20_RETROSPECTIVE_GAP_AUDIT_2026-08-28.md`
- `docs/PHASE20_FINAL_AUDIT_2026-08-28.md`
- `docs/PHASE21_PRIORITY_A_PLAN.md`
- `docs/PHASE22_IMPROVEMENT_FEATURES_PLAN.md`
- `docs/PHASE23_FINAL_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md`

## 禁止事項

- main変更
- Production deploy
- status / verification_statusの推測昇格
- 推測Modern Command
- SourceなしFrame
- Evidence不足でAI Coach Generationを有効化
- ユーザー指示なしの次Phase開始
