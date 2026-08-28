# Pre-Phase20 Priority Backlog & Feature Ideas

Date: 2026-08-28 JST
Branch: `sf6dna-v2`

## Current Phase Mapping

ユーザー方針により作業順を正式にPhase化する。

1. **Phase20 = Priority S**
2. **Phase21 = Priority A**
3. **Phase22 = Improvement Features**
4. **Phase23 = Final Manual / External Acceptance & Production Decision**

人力・外部依存はPhase23へ集約する。

---

## Phase20 — Priority S / Verified Content Expansion

### S1. verified攻略データ拡大
対象:
- Combo
- Setup
- Sequence
- Counter
- Training

Source / Current Patch / verification条件に従って全候補を監査し、安全にverifiedへ昇格できるものだけ反映する。

### S2. Current Patch Frame verification拡大
- Current Patch Frame: 2065
- verified: 307（Phase19時点）

official / sufficient primary evidenceがあるものだけをverified候補として整理する。

### S3. Character Guide verification
- Guide section: 278（Phase19時点）

31キャラのGuideをSource / Current Patch / verification基準で整理する。

### S4. Character Trait Score verification
- Trait Score: 372（Phase19時点）

Recommendation精度へ直結するため、Source付きverificationを優先する。

正本:
- `docs/PHASE20_VERIFIED_CONTENT_EXPANSION_PLAN.md`

---

## Phase21 — Priority A / Modern Command & Integration

### A1. Modern Command不足622件のSource付き収集
Classicから推測変換しない。

### A2. Legacy parity追加機能をFinal Acceptanceへ追加
対象:
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

### A3. Project Documentation Sync
- `PROJECT_STATUS.md`
- `FEATURES.md`
- Release Readiness
- Phase23 checklist
を同期する。

### A4〜A7 外部依存
以下はPhase21で実施せずPhase23へ移管:
- Vercel Preview
- 実画面UI/UX監査
- Real Auth / Admin E2E
- PC / iPhone actual device acceptance

正本:
- `docs/PHASE21_PRIORITY_A_PLAN.md`

---

## Phase22 — Improvement Features

### F1. 対戦後30秒ログ + 10戦弱点分析
- 相手キャラ
- 勝敗
- MR/LP
- 主な被弾原因
- 対空
- DI返し
- 確反
- 端脱出
- Drive管理
- 困った技/連携
- 知識 / 操作 / 判断 / 癖 / 対策不足分類

### F2. 弱点ヒートマップ + 今日の練習メニュー
対戦ログとTraining DBを接続して弱点を可視化し、当日の練習候補を提示する。

### F3. Punish Finder / 確反検索
verified Move / Frame / Comboのみを使い、相手技に対する安定確反・高リターン候補を提示する。

### F4. 対戦前30秒キャラ対策カード
ランク直前に必要な警戒点・距離・確反・端防御などを短く提示する。

### F5. Replay復習ワークフロー
問題場面・原因・試した回答・採用回答・再練習対象をCounter / Trainingと接続する。

### Secondary Ideas
Primary完了後に検討:
- 状況別クイズ
- Frame / 確反クイズ
- 自分の癖検出
- リーサル計算機
- ゲージ効率比較
- Matchup win-rate dashboard

正本:
- `docs/PHASE22_IMPROVEMENT_FEATURES_PLAN.md`

---

## Phase23 — Final Manual / External Acceptance

人力・外部依存をすべてここへ集約する。

- Vercel Project / Preview
- Preview Runtime / Logs
- 実Admin / non-admin E2E
- 実CRUD
- PC / iPhone実機確認
- Public Network Performance
- 外部ブラウザ確認
- Phase20〜22追加機能の実画面Acceptance
- Production Ready最終判定
- Production Deploy（ユーザー明示許可時のみ）

正本:
- `docs/PHASE23_FINAL_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md`

---

## Fixed Execution Order

1. Phase20を完了
2. Phase21を完了
3. Phase22を完了
4. 人力・外部確認が可能になった時点でPhase23

## Global Rules

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- Modern Commandを推測しない
- SourceなしFrameを確定しない
- main変更禁止
- Production deployは明示許可まで禁止
