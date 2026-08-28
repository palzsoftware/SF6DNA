# PROJECT_STATUS.md

最終更新: 2026-08-28 JST

## SF6DNA v2 現在状態

Phase13、Phase14、Phase16、Phase17、Phase18、Phase19は完了済み。
Phase15の外部Acceptance残件はFinal Phaseへ移管済み。

Phase19後、旧版独自機能のうちv2と重複せず安全に移植可能なものとして、Favorites / My Characters / Character Compare / Rank Tracker / Diagnosis History / About / FAQ / Sources / Changelogを追加した。

ユーザー方針により、従来Phase20に予定していたManual / External Acceptanceを**Phase23**へ移動し、Phase20〜22を追加開発Phaseとして再定義した。

現在のDemo Release Decisionは **CONDITIONAL GO**。

- Automated / Internal Readiness: **PASS**
- Data Gate Readiness: **PASS**
- Internal Integrity / Hardening: **PASS**
- Production Ready: **未判定 / Phase23依存**
- Phase20: **未開始 / Priority S**
- Phase21: **未開始 / Priority A**
- Phase22: **未開始 / Improvement Features**
- Phase23: **未開始 / Final Manual & External Acceptance**

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- main baseline SHA: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`

主要文書:
- Phase14 Final Audit: `docs/PHASE14_FINAL_AUDIT_2026-08-28.md`
- Phase15 Evidence: `docs/PHASE15_ACCEPTANCE_EVIDENCE_2026-08-28.md`
- Phase16 Final Audit: `docs/PHASE16_RELEASE_CANDIDATE_AUDIT_2026-08-28.md`
- Phase17 Final Audit: `docs/PHASE17_FINAL_AUDIT_2026-08-28.md`
- Phase18 Final Audit: `docs/PHASE18_FINAL_AUDIT_2026-08-28.md`
- Phase18 Data Quality: `docs/PHASE18_DATA_QUALITY_REPORT_2026-08-28.md`
- Phase19 Plan: `docs/PHASE19_IMPLEMENTATION_PLAN.md`
- Phase19 Integrity Audit: `docs/PHASE19_INTERNAL_INTEGRITY_AUDIT_2026-08-28.md`
- Phase19 Final Audit: `docs/PHASE19_FINAL_AUDIT_2026-08-28.md`
- Legacy Parity Audit: `docs/PRE_PHASE20_LEGACY_PARITY_AUDIT_2026-08-28.md`
- Priority / Feature Backlog: `docs/PRE_PHASE20_PRIORITY_BACKLOG_AND_FEATURE_IDEAS_2026-08-28.md`
- Phase20 Plan: `docs/PHASE20_VERIFIED_CONTENT_EXPANSION_PLAN.md`
- Phase21 Plan: `docs/PHASE21_PRIORITY_A_PLAN.md`
- Phase22 Plan: `docs/PHASE22_IMPROVEMENT_FEATURES_PLAN.md`
- Phase23 Final Manual Acceptance Plan: `docs/PHASE23_FINAL_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md`
- Deprecated old Phase20 Manual Plan: `docs/PHASE20_FINAL_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md`
- Release Gate: `docs/V2_RELEASE_READINESS.md`

## v2 Phase管理

| Phase | 状態 | 内容 |
|---|---|---|
| Phase1〜12 | 完了または各Phase定義どおり終了 | 基盤・v2構築 |
| Phase13 | **完了** | Character Content Verification & Expansion |
| Phase14 | **完了** | Application Integration / Public Gate |
| Phase15 | 外部残件をPhase23へ移管 | Acceptance強化 |
| Phase16 | **完了 / Conditional Go** | Release Candidate準備 |
| Phase17 | **完了 / Automated & Internal PASS** | Internal Acceptance |
| Phase18 | **完了 / Data Gate PASS** | Verified Content Coverage準備 |
| Phase19 | **完了 / Internal Integrity & Hardening PASS** | DB / Gate / CI総監査 |
| Phase20 | **未開始** | Priority S / Verified Content Expansion |
| Phase21 | **未開始** | Priority A / Modern Command & Integration |
| Phase22 | **未開始** | Player Improvement Loop & Advanced Utility Features |
| Phase23 | **未開始 / Final Phase** | Manual / External Acceptance & Production Decision |

## Phase20 — Priority S

1. Strategy verified攻略データ拡大
   - Combo
   - Setup
   - Sequence
   - Counter
   - Training
2. Current Patch Frame verification拡大
3. Character Guide verification
4. Character Trait Score verification
5. Coverage Report / CI / Final Audit

ルール:
- 件数目的のbulk verify禁止
- Source不足の昇格禁止
- reviewed ≠ verified

## Phase21 — Priority A

1. Modern Command不足622件のSource付き収集
2. Legacy parity追加機能をPhase23 Acceptanceへ追加
3. `PROJECT_STATUS.md` / `FEATURES.md` / Release docs同期
4. Vercel / 実画面 / Real Auth / 実機作業はPhase23へ明示移管
5. Regression / Final Audit

## Phase22 — Improvement Features

Primary:
1. 対戦後30秒ログ + 10戦弱点分析
2. 弱点ヒートマップ + 今日の練習メニュー
3. Punish Finder / 確反検索
4. 対戦前30秒キャラ対策カード
5. Replay復習ワークフロー

Secondary候補:
- 状況別クイズ
- Frame / 確反クイズ
- 自分の癖検出
- リーサル計算機
- ゲージ効率比較
- Matchup win-rate dashboard

## Phase23 — Final Manual / External Acceptance

Phase23をFinal Phaseとする。

1. Vercel Project / Git import
2. Preview deployment / Preview URL
3. Preview runtime / build / runtime logs
4. real Admin / non-admin session E2E + limited CRUD / cleanup
5. user PC / iPhone / actual device/browser確認
6. Public Preview/network Performance
7. Phase20〜22追加機能の実画面Acceptance
8. 外部ブラウザ互換性最終確認
9. Production Readiness final decision
10. Production deploy（ユーザー明示許可がある場合のみ）

人力・外部確認が可能になるまでPhase23を開始しない。

## Phase19 Integrity Results

重大内部blockerは検出されていない。

- Current Patch record: 1
- FK constraints: validated
- duplicate/blank critical slug groups: 0
- Move without Classic Command: 0
- Move without open Current Frame: 0
- multiple open Current Frame: 0
- Patch validity reversal: 0
- invalid polymorphic Source target: 0
- duplicate entity_source relation: 0
- exact duplicate Alias/Strategy/Guide groups: 0

Source metadata:
- total 329
- blank title/url/source_type/reliability: 0
- blank publisher: 30（nullable / non-blocking / 推測補完なし）
- normalized duplicate URL candidate: 8 groups（異なるEvidence contextのため自動統合なし）

## Public Data Gate — Current Internal State

### Strategy
Combo / Setup / Sequence / Counter / Training:
- published
- verified
- matching Source relationあり

### Character Guide
- published + verified

### Recommendation
- published + verified + Source付きTrait Scoreのみ

### Move
Public MoveはApp + RLSで以下を要求:
1. Move published
2. Classic Commandあり
3. Classic Command official Evidence
4. Move official Source
5. Current Patch Frame
6. Frame verified
7. Current Frame official Source
8. Modern Commandは任意 / 推測しない

### AI Coach
- Source付きEvidenceのみ
- Current Patch取得
- input boundaryあり
- Generation OFF

## Phase18/19 Data Snapshot

- playable + published Character: 31
- Move: 2065
- Classic Command: 2065
- Modern Command: 1443
- Modern missing: 622
- Current Patch Frame: 2065
- Current Patch verified Frame: 307
- Combo: 341 / verified 1 / published 0
- Setup: 186 / verified 0 / published 0
- Sequence: 186 / verified 0 / published 0
- Counter: 1122 / verified 0 / published 0
- Training: 1477 / verified 0 / published 0
- Character Guide: 278 / published 0 / verified 0
- Character Trait Score: 372 / published 0 / verified 0
- published Diagnosis: 4
- published Diagnosis Question: 52
- Player: 91 / published 41
- Video: 13 / published 5

件数を理由にstatus / verificationを昇格しない。

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

個人データは現時点ではbrowser localStorage保存で、Supabase Public Data Gateを書き換えない。

## Public Data Policy

必ず維持する。

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- Modern Commandを推測補完しない
- SourceなしFrame値を確定しない
- Release件数目的で自動publishしない
- Strategy Public Gateは`published + verified + Source`
- Character Guide Public Gateは`published + verified`
- Recommendationは`published + verified + Source`付きTrait Scoreのみ
- Public MoveはCurrent Patch verified Frame + official Move/Frame/Classic Evidenceを要求
- AI CoachはSource付きEvidence + Current Patchを要求
- AI Coach GenerationはOFF

## 禁止事項

- main変更
- Production deploy
- 不可逆DB変更
- bulk delete
- status / verification_statusの推測昇格
- 推測Modern Command
- SourceなしFrame
- Evidence不足でのAI Coach Generation有効化
- Auth全面再設計
- Audit機能の勝手な新設
- ユーザー指示なしの次Phase開始
