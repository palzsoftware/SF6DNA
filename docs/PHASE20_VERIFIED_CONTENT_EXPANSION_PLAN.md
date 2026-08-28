# SF6DNA Phase20 Verified Content Expansion Plan

最終更新: 2026-08-28 JST
状態: **完了 / PASS**

## Phase20名称

**Verified Content Expansion**

## 目的

Phase19までに構築したPublic Gateを維持したまま、Current PatchのFrameを中心にverified Coverageを安全に拡大し、Phase1〜20の内部実装状態を最終監査する。

## Final Task Status

### P20-00 Baseline — COMPLETE
- Phase19完了状態確認
- main未変更確認
- Current Patch `2026.08.03`確認

### P20-01 Strategy Verification Expansion — COMPLETE
- Combo / Setup / Sequence / Counter / Training全件をEvidence基準で監査
- Source存在だけでは攻略内容を直接証明しないため、新規自動verified化なし

### P20-02 Current Patch Frame Verification Expansion — COMPLETE

Phase20開始:
- Current Frame 2065
- verified 307
- reviewed 1752
- unverified 6

初回strict direct-source pass:
- 501件をreviewed -> verified
- 808 / 2065 = 39.1%

追加CAPCOM照合後の最終active set:
- active Move **2052**
- Current Frame **2052**
- verified **2020 / 2052 = 98.4%**
- reviewed exception **32**
- unverified **0**

残32:
- Taunt 31
- Alex Exit Prowler Stance 1

CAPCOM公式Character Frame Dataに直接比較対象が無いためreviewed維持。

### P20-03 Character Guide Verification — COMPLETE
- 278/278監査
- Source linked 278
- 合成攻略本文をSource存在だけでverifiedにしない
- verified 0を維持

### P20-04 Character Trait Score Verification — COMPLETE
- 372/372監査
- Source linked 372
- 数値評価を推測verified化しない
- verified 0を維持

### P20-05 Public Coverage Report — COMPLETE
- `docs/PHASE20_VERIFIED_CONTENT_COVERAGE_REPORT_2026-08-28.md`

### P20-06 Regression / Acceptance — COMPLETE
恒久Acceptance:
- `.github/workflows/phase20-verified-content-acceptance.yml`

確認対象:
- Typecheck
- Lint
- Policy tests
- Build
- verification policy
- Public Move Gate
- temporary audit RPC cleanup

### P20-07 Final Audit / Closure — COMPLETE
- `docs/PHASE20_FINAL_AUDIT_2026-08-28.md`
- `PROJECT_STATUS.md`同期

### P20-08 Phase1〜20 Retrospective Gap Audit — COMPLETE
- `docs/PHASE20_PHASE1_TO_20_RETROSPECTIVE_GAP_AUDIT_2026-08-28.md`
- automated/internal重大実装漏れ 0
- future / external / proposalを正式Phase Gateと分離

### P20-09 Temporary Audit Surface Cleanup — COMPLETE
- temporary Supabase SECURITY DEFINER RPC削除
- temporary Frame Crosscheck workflow退役
- Security Advisor 0 lints

### P20-10 Move / Frame Lifecycle Integrity — COMPLETE
legacy/duplicateの履歴化後にMove/Frame整合性を再確認・修復。

最終:
- active Move 2052
- Current Frame 2052
- active Move without Current Frame 0
- multiple Current Frame 0

## Exit Criteria

- Priority S監査済み: **PASS**
- CAPCOM official Frame Data照合可能行を安全に監査: **PASS**
- 未確認/非比較対象は理由付きreviewed維持: **PASS**
- Phase1〜20内部実装Gap監査: **PASS**
- Public Gateを弱めない: **PASS**
- temporary audit surface撤去: **PASS**
- Security Advisor 0 lint: **PASS**
- Move/Frame lifecycle integrity: **PASS**
- CI final acceptance: **PASS確認をPhase20最終Evidenceとする**

## 絶対ルール

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- main変更禁止
- Production deploy禁止
- Phase21を自動開始しない
