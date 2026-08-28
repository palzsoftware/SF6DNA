# SF6DNA Phase20 Verified Content Coverage Report

Date: 2026-08-28 JST
Branch: `sf6dna-v2`
Current Patch: `2026.08.03`

## Purpose

Phase20 `Verified Content Expansion` の最終CoverageとEvidence方針を記録する。

原則:
- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceがあるだけではverifiedへ昇格しない
- 件数目的のbulk verifyは禁止
- Current PatchとEvidenceを満たす場合のみverifiedとする
- CAPCOM Frame Dataに存在しない項目を、数字合わせのためにverifiedへ昇格しない

## 1. Strategy Content

Phase20ではCombo / Setup / Sequence / Counter / Trainingを全件監査した。

| Kind | Total | Verified |
|---|---:|---:|
| Combo | 341 | 1 |
| Setup | 186 | 0 |
| Sequence | 186 | 0 |
| Counter | 1122 | 0 |
| Training | 1477 | 0 |

新規Strategyの自動verified昇格は行っていない。
Official Sourceが存在しても、攻略手順・択・セットプレイ・トレーニング処方そのものを直接証明しない限りverifiedとはしない。

既存verified Combo 1件も`draft`のまま維持し、自動publishしていない。

## 2. Current Patch Frame Data

### Phase20開始時

- Current Frame: 2065
- verified: 307
- reviewed: 1752
- unverified: 6

### Phase20前半のstrict promotion

既存DB上で以下をすべて満たすCurrent Frameのみを最初に昇格した。

1. Current Patch / open row
2. existing status = `reviewed`
3. Source reliability = `official`
4. Source type = `official_frame_data`
5. Evidence relationship = `official` または `primary`

このpassで501件を`reviewed -> verified`へ昇格した。

### Phase20追加照合

ユーザー指示により、39.1%時点ではPhase20を閉じず、CAPCOM日本語・英語Frame Data snapshotとの照合を継続した。

実施した追加監査:
- 日英正式技名照合
- 強度/OD同名グループの1対1対応
- フレーム表記の意味正規化
- duration形式とabsolute active rangeの同値判定
- landing recoveryの正規化
- 複数段/派生技のCAPCOM行との対応
- DBカテゴリとCAPCOMカテゴリが異なる技の正式名照合
- CAPCOM表の折返し行/連結列のparser修正
- current verified行も含む再確認
- CAPCOM値と明確に異なる既存値の訂正
- 現行CAPCOMに存在しないlegacy/duplicate rowの履歴化

推測による補完は行っていない。

### Final active/current set

Phase20終了時のcanonical active set:

- active Move: **2052**
- Current Frame: **2052**
- verified: **2020 / 2052 (98.4%)**
- reviewed exception: **32**
- unverified: **0**
- active Move without Current Frame: **0**
- active Move with multiple Current Frames: **0**
- verified rows with an official CAPCOM `official_frame_data` Source: **2020 / 2020**

### Remaining reviewed exception 32

32件をverifiedにしないのは未監査だからではない。

- Taunt: **31件**
- Alex `Exit Prowler Stance`: **1件**

これらは現在DBではsecondary `frame_data` / `structured_dataset` Evidenceのみを持ち、CAPCOM公式Character Frame Dataに直接対応する独立行を確認できない。

したがって:
- `reviewed`を維持
- CAPCOMに無い値を捏造しない
- verified率100%を作るための昇格をしない

**CAPCOM公式Frame Dataで直接比較可能なCurrent FrameについてはPhase20で照合対象を解消済み**と判定する。

## 3. Legacy / Duplicate cleanup

Phase20照合により、現行CAPCOM側に存在しない、または正規現行Moveと重複するlegacy rowを発見した。

処置:
- Frame historyは削除せず`valid_to_patch_id = 2026.08.03`で履歴化
- 対応Moveは`archived`へ移行
- 現行データをbulk deleteしない

対象には以下を含む:
- Terry legacy weak Burn Knuckle duplicate
- Ingrid legacy/non-current Monoid/Sunburst rows
- Ingrid legacy Sun Shot fragment rows
- archived Dhalsim Long Sliding duplicate Frame

最終整合性:
- active Move = 2052
- active Current Frame = 2052
- open Frame欠損 = 0
- multiple open Frame = 0

## 4. Character Guide

- total/current: 278
- Source linked: 278
- verified: 0

Guideは複数の判断・攻略情報を含む合成コンテンツであり、Source存在だけでは本文全体をverifiedにしない。
既存Public Gate `published + verified`を維持する。

## 5. Character Trait Score

- total: 372
- Source linked: 372
- verified: 0

Trait Scoreは編集・評価値であり、一次Evidenceなしに数値をverified化しない。
Recommendation Gateを弱めない。

## 6. Public Exposure Impact

Phase20終了時:
- active Move: 2052
- published Move: 0
- Public-ready Move: 0

Frame verification拡大だけで未承認Moveは公開されない。
Public Move Gateは引き続き以下を要求する。

1. Move published
2. Classic Commandあり
3. Classic Command official Evidence
4. Move official Source
5. Current Patch Frame
6. Frame verified
7. Current Frame official Source
8. Modern Commandは任意 / 推測禁止

Strategy / Character Guide / Recommendation Gateも弱めていない。

## 7. Security / Audit Infrastructure

Phase20中のみ使用した`public._phase20_frame_audit_fingerprints()`は最終照合後に削除した。

Repository migration:
- `supabase/migrations/20260828_phase20_remove_temporary_audit_rpc.sql`

一時Crosscheck workflowもPhase20終了時に退役した。

最終Supabase Security Advisor:
- **0 lints**

## 8. Coverage Summary

| Area | Total | Verified | Status |
|---|---:|---:|---|
| Active Current Frame | 2052 | 2020 | **98.4%** |
| Reviewed non-CAPCOM-comparable exception | 32 | 0 | reviewed維持 |
| Unverified Current Frame | 0 | - | none |
| Combo | 341 | 1 | no auto promotion |
| Setup | 186 | 0 | no auto promotion |
| Sequence | 186 | 0 | no auto promotion |
| Counter | 1122 | 0 | no auto promotion |
| Training | 1477 | 0 | no auto promotion |
| Character Guide | 278 | 0 | reviewed gate maintained |
| Trait Score | 372 | 0 | reviewed gate maintained |

## Conclusion

Phase20は39.1%時点のstrict Source-link promotionだけでは終了せず、CAPCOM公式Frame Dataとの実値照合を追加実施した。

最終的にactive/current Frame 2052件中2020件をverifiedとし、残る32件はCAPCOM公式Frame Dataに直接比較対象が無い例外として`reviewed`を維持した。

**verified: **2020 / 2052 (98.4%)****

100%という見た目を作るためにEvidence基準を下げていない。これをPhase20の最終Coverageとする。
