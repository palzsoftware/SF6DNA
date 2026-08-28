# SF6DNA Phase20 Verified Content Coverage Report

Date: 2026-08-28 JST
Branch: `sf6dna-v2`
Current Patch: `2026.08.03`

## Purpose

Phase20 `Verified Content Expansion` の全件監査結果を記録する。

原則:
- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceがあるだけではverifiedへ昇格しない
- 件数目的のbulk verifyは禁止
- Current PatchとEvidenceを満たす場合のみ昇格候補とする

## 1. Strategy Content

対象は全件Current Patch。

| Kind | Total | Verified | Reviewed | Unverified | Source linked | Official Source | Direct strong Evidence |
|---|---:|---:|---:|---:|---:|---:|---:|
| Combo | 341 | 1 | 76 | 264 | 341 | 41 | 0 |
| Setup | 186 | 0 | 20 | 166 | 186 | 0 | 0 |
| Sequence | 186 | 0 | 17 | 169 | 186 | 2 | 0 |
| Counter | 1122 | 0 | 67 | 1055 | 1122 | 92 | 0 |
| Training | 1477 | 0 | 8 | 1469 | 1477 | 92 | 0 |

### Decision

Phase20では新規Strategyのverified昇格を行わない。

理由:
- Source relationは主に`supporting` / `corroborating` / `candidate` / `patch_context`。
- Official Sourceが付いていても多くはpatch contextであり、Strategy本文・手順・択・コンボ成立を直接証明する一次Evidenceではない。
- `direct strong Evidence`（official/primary reliabilityかつdirect relationship）は0件。

既存verified Combo 1件:
- `kimberly-20260803-modern-assist2`
- `draft + verified`を維持し、自動publishしない。

## 2. Current Patch Frame Data

### Before Phase20
- Current Frame: 2065
- verified: 307
- reviewed: 1752
- unverified: 6

### Strict Promotion Rule

以下をすべて満たすCurrent Frameだけを`verified`へ昇格:
1. Current Patch (`2026.08.03`)
2. open/current row (`valid_to_patch_id is null`)
3. existing status = `reviewed`
4. linked Source reliability = `official`
5. Source type = `official_frame_data`
6. Evidence relationship = `official` or `primary`

この条件はCAPCOM公式Character Frame Dataへ直接紐づくEvidenceのみを対象にする。

### Applied Result
- newly promoted: **501**
- verified after Phase20: **808 / 2065 (39.1%)**
- reviewed remaining: **1251**
- unverified remaining: **6**
- strict eligible remaining: **0**

### Newly covered characters

Phase20で公式Frame Dataに直接紐づくreviewed rowをverifiedへ昇格した主なキャラ:
- ジュリ: 46
- ケン: 59
- ブランカ: 91
- ダルシム: 89
- エドモンド本田: 70
- ディージェイ: 105
- JP: +1
- 不知火舞: +10
- エレナ: +4
- C.ヴァイパー: +7
- ヤスミン: +19

既存verified:
- ジェイミー 93
- 春麗 68
- ガイル 70
- キンバリー 76

### Remaining reason

残り1257件はPhase20のstrict direct-official ruleを満たすEvidenceがDB上に存在しない。
推測・secondary/communityだけでのverifyは行わない。

## 3. Character Guide

- total: 278
- Current Patch: 278
- reviewed: 278
- verified: 0
- Source linked: 278
- Official Sourceを含むsection: 143
- official supporting relation: 35
- official patch-context relation: 36
- direct strong Evidence: 0

### Decision

新規verified昇格なし。

Guideは複数の事実・判断・戦略を含む合成コンテンツであり、official patch/sourceが紐づくだけでは本文全体の正確性を直接証明しない。
各sectionは`reviewed`を維持する。

## 4. Character Trait Scores

- total: 372
- reviewed: 372
- verified: 0
- Source linked: 372
- official Source: 0
- primary Source: 0
- secondary Source: 336
- community Source: 36

### Decision

新規verified昇格なし。

Trait Scoreは数値化された編集・推定評価であり、現状official/primary Evidenceが存在しない。
Recommendation Gateへ投入するためのverified化は行わない。

## 5. Public Exposure Impact

Frame verificationは808へ増えたが、Move statusは:
- Move total: 2065
- published Move: 0
- Public-ready Move: 0

したがってPhase20のFrame verification拡大だけで未承認MoveがPublicへ露出することはない。
Public Move Gateは変更していない。

## 6. Coverage Summary

| Area | Total | Verified | Verified Rate |
|---|---:|---:|---:|
| Current Frame | 2065 | 808 | 39.1% |
| Combo | 341 | 1 | 0.3% |
| Setup | 186 | 0 | 0% |
| Sequence | 186 | 0 | 0% |
| Counter | 1122 | 0 | 0% |
| Training | 1477 | 0 | 0% |
| Character Guide | 278 | 0 | 0% |
| Trait Score | 372 | 0 | 0% |

## Conclusion

Phase20で安全に昇格可能と判定できたのは、CAPCOM公式Frame Dataへdirect Evidenceを持つCurrent Frame 501件のみ。

Strategy / Guide / Traitは全件監査したが、現在のEvidenceでは`verified`へ昇格させないことが正しい。
未確認データは未確認のまま維持する。
