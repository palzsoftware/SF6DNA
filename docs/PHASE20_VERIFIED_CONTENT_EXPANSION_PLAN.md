# SF6DNA Phase20 Verified Content Expansion Plan

最終更新: 2026-08-28 JST
状態: **完了 / PASS**

## Phase20名称

**Verified Content Expansion**

## 目的

Priority S をPhase20として実施する。Phase19までに構築したPublic Gateを維持したまま、実際に公開可能となるverifiedコンテンツのCoverageを増やす。

## Backlog

### P20-00 Baseline — COMPLETE
- Phase19完了状態とPre-Phase20追加機能を確認
- main未変更確認
- Current Patch `2026.08.03`確認
- status / verificationの既存分布を再計測

### P20-01 Strategy Verification Expansion — COMPLETE
対象:
- Combo
- Setup
- Sequence
- Counter
- Training

全件についてSource / Patch / Evidenceを突合。
新規で安全にverifiedへ昇格できるdirect strong Evidenceは0件だったため、既存verified Combo 1件以外は昇格していない。

### P20-02 Current Patch Frame Verification Expansion — COMPLETE
- Current Patch Frame全2065件をEvidence基準で再分類
- CAPCOM公式Frame Dataへのdirect Evidenceを持つreviewed 501件のみverifiedへ昇格
- verified: 307 -> **808**
- reviewed remaining: 1251
- unverified remaining: 6
- strict eligible remaining: 0
- Move Public Gateとの整合性確認済み

### P20-03 Character Guide Verification — COMPLETE
- 278/278 sectionを監査
- Source linked 278
- official Source含有143
- direct strong Evidence 0
- 合成攻略本文をSource存在だけでverifiedにしないため、278件すべてreviewed維持

### P20-04 Character Trait Score Verification — COMPLETE
- 372/372を監査
- Source linked 372
- official/primary Source 0
- secondary 336 / community 36
- numeric editorial scoreを推測verified化せず全372件reviewed維持

### P20-05 Public Coverage Report — COMPLETE
- `docs/PHASE20_VERIFIED_CONTENT_COVERAGE_REPORT_2026-08-28.md`

### P20-06 Regression / Acceptance — COMPLETE
- Public Gate regressionを維持
- Phase20専用Workflow追加
- Supabase Security Advisor: 0 lints
- Typecheck / Lint / Test / BuildをCIで検証

### P20-07 Final Audit / Closure — COMPLETE
- `docs/PHASE20_FINAL_AUDIT_2026-08-28.md`
- `PROJECT_STATUS.md`更新
- Phase21 handoff baseline固定

## Exit Criteria

- Priority Sの4項目を全件監査済み: **PASS**
- 安全にverifiedへ昇格できるものだけ反映: **PASS**
- 未確認は理由付きで残す: **PASS**
- Public Gateを弱めない: **PASS**
- CI PASS: **PASS**

## 絶対ルール

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- main変更禁止
- Production deploy禁止
