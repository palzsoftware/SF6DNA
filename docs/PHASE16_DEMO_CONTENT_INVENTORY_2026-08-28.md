# SF6DNA Phase16 Demo Content Inventory

最終更新: 2026-08-28 JST

状態: **P16-01完了 / read-only inventory**

## 原則

本InventoryはSupabase実DB `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`) をread-onlyで集計した結果である。

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 候補件数を理由に自動publishしない
- Current Patchは `2026.08.03`

## Public inventory

| Entity | Public / release-gated count |
|---|---:|
| Published playable Character | 31 |
| Published Move | 0 |
| Verified Frame | 307 |
| Published + verified Combo | 0 |
| Published + verified Setup | 0 |
| Published + verified Sequence | 0 |
| Published + verified Counter | 0 |
| Published + verified Training | 0 |
| Published Player | 41 |
| Published Video | 5 |
| Published Diagnosis | 4 |
| Published Diagnosis Question | 52 |
| Published + verified Character Trait Score | 0 |

Character 31件とPlayer 41件は全件Source relationありを確認した。

## Working inventory

| Entity | Total |
|---|---:|
| Move | 2065 |
| Move Frame | 2065 |
| Classic Command | 2065 |
| Modern Command | 1443 |
| Combo | 341 |
| Setup | 186 |
| Sequence | 186 |
| Counter | 1122 |
| Training | 1477 |
| Player | 91 |
| Video | 13 |
| Character Trait Score | 372 |

Modern Command coverage:
- 1443 / 2065 = 約69.9%
- missing = 622

欠損Modern Commandは推測補完しない。

## Verification distribution

- Character Trait Score: draft + reviewed 372
- Combo:
  - archived + unverified 40
  - draft + reviewed 76
  - draft + unverified 224
  - draft + verified 1
- Counter:
  - draft + reviewed 67
  - draft + unverified 1055
- Sequence:
  - draft + reviewed 17
  - draft + unverified 169
- Setup:
  - draft + reviewed 20
  - draft + unverified 166
- Training:
  - draft + reviewed 8
  - draft + unverified 1469

## Current Patch / Source candidate

Current Patch `2026.08.03`:
- verified Frame: 307
- verified Frame with Source: 307
- draft + verified Combo: 1
- draft + verified + Current Patch + Source Combo: 1

このCombo 1件は**公開候補**であって、publish承認済みではない。Phase16ではstatus変更を行わない。

## Demo判断

現状でもデモ版として以下を安全に見せられる:
- 31 Character
- 41 Player
- 5 Video
- 4 Diagnosis / 52 Questions
- Search
- AI Coach Evidence Retrieval（Generation OFF）
- 公開Gateによるsafe empty state

一方、Move / Combo / Setup / Sequence / Counter / Training / Recommendationは公開Gateを維持すると多くが空になる。
これはデータ欠損を推測値で埋めるより安全であり、デモ版では既知の制約として表示する。

## DB変更

P16-01ではDB write / status変更 / verification昇格 / DDLを実施していない。
