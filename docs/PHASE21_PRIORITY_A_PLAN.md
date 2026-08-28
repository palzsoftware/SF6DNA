# SF6DNA Phase21 Priority A Plan

最終更新: 2026-08-28 JST
状態: **未開始 / Phase20完了後**

## Phase21名称

**Modern Command Coverage & Pre-Release Integration**

## 目的

Priority Aのうち内部で完結できる作業を実施し、外部・人力依存はPhase23へ引き継ぐ。

## Backlog

### P21-00 Baseline
- Phase20完了HEAD確認
- main未変更確認
- Current Patch確認

### P21-01 Modern Command不足622件のSource付き収集
- official / sufficient primary evidenceを優先
- Classic Commandから推測変換しない
- 登録できないものはmissingのまま理由を記録

### P21-02 Legacy Parity機能のAcceptance対象化
Phase19後に追加した以下をFinal Acceptance Checklistへ正式追加:
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

### P21-03 Project Documentation Sync
- `PROJECT_STATUS.md`
- `FEATURES.md`
- Release Readiness docs
- Phase23 Manual Acceptance Plan
を最新状態へ同期。

### P21-04 External Work Handoff
以下は実施せず、Phase23へ移管状態を確認:
- Vercel Preview
- 実画面UI/UX監査
- Real Auth / Admin E2E
- PC / iPhone actual device acceptance
- Public network Performance

### P21-05 Regression / Acceptance
- Typecheck
- Lint
- Tests
- Build
- Public Gate regression
- Security Advisor

### P21-06 Final Audit / Closure
- Phase21 Final Audit
- Phase22へ渡すBaseline固定

## Exit Criteria

- Modern Command収集を全不足対象に対して監査済み
- 推測補完0
- Legacy parity追加機能がPhase23 checklistへ反映済み
- DocumentationのPhase番号矛盾0
- CI PASS

## 絶対ルール

- 外部・人力AcceptanceをPhase21で強行しない
- main変更禁止
- Production deploy禁止
- Verification / Sourceルール維持
