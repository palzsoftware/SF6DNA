# SF6DNA Phase20 Verified Content Expansion Plan

最終更新: 2026-08-28 JST
状態: **未開始**

## Phase20名称

**Verified Content Expansion**

## 目的

Priority S をPhase20として実施する。Phase19までに構築したPublic Gateを維持したまま、実際に公開可能となるverifiedコンテンツのCoverageを増やす。

## Backlog

### P20-00 Baseline
- Phase19完了状態とPre-Phase20追加機能を確認
- main未変更確認
- Current Patch `2026.08.03`確認
- status / verificationの既存分布を再計測

### P20-01 Strategy Verification Expansion
対象:
- Combo
- Setup
- Sequence
- Counter
- Training

実施:
- Source / Patch / Evidenceを突合
- sufficient evidenceがあるものだけverified候補化
- 公開候補と未確認を分離

禁止:
- 件数目的のbulk verify
- Source不足の昇格
- reviewedをverified扱い

### P20-02 Current Patch Frame Verification Expansion
- Current Patch Frame全件をEvidence基準で再分類
- official / sufficient primary evidenceがあるものだけverified候補化
- Move Public Gateとの整合性確認

### P20-03 Character Guide Verification
- 31キャラGuide sectionをSource / Current Patch / Evidence基準で監査
- verified候補と不足理由を分類
- 未確認内容を推測補完しない

### P20-04 Character Trait Score Verification
- 372 Trait ScoreをEvidence基準で監査
- Recommendation Gateへ投入可能な候補を分類
- 診断精度に直結するためEvidence不足を明示

### P20-05 Public Coverage Report
- コンテンツ種別別verified率
- キャラ別Coverage
- Source不足 / Patch不足 / 実機確認待ちの件数
- 公開候補一覧

### P20-06 Regression / Acceptance
- Public Gate regression
- Security Advisor
- Typecheck / Lint / Test / Build
- Phase20専用Evidence記録

### P20-07 Final Audit / Closure
- Phase20 Final Audit
- `PROJECT_STATUS.md`更新
- Phase21へ渡すBaseline固定

## Exit Criteria

- Priority Sの4項目を全件監査済み
- 安全にverifiedへ昇格できるものだけ反映
- 未確認は理由付きで残す
- Public Gateを弱めない
- CI PASS

## 絶対ルール

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- main変更禁止
- Production deploy禁止
