# SF6DNA v2 Phase13 — Character Content Verification & Expansion

Start: 2026-08-26
Branch: `sf6dna-v2`
Current patch baseline: `2026.08.03`

## Objective

31プレイアブルキャラクターの攻略データを、JPで先行構築したEntity構造と品質ゲートに揃え、AI Coachおよびデモ公開に耐えられる信頼データへ段階的に昇格する。

## Work order

1. Move / Frame / Classic Commandの完全化
2. Modern Commandの現行版確認
3. Move Alias完全化
4. Combo
5. Setup / Oki
6. Sequence / Interrupt
7. Counter / Punish
8. Training
9. Player / Tournament / Match / Video
10. 12 Character Trait Scores
11. Current-patch verification
12. verified / published gate review

## Quality rules

- CAPCOM一次情報を最優先する。
- frame-search等は現行候補・クロスチェックに使うが、それだけでverifiedにしない。
- 実機トレモで再現していない距離依存・1F単位・セットプレイ・割り込み・Modern差分は推測しない。
- reviewed != verified。
- draft != public。
- AI Coachにはpublished + verifiedのみを優先的にEvidenceとして与える。
- Phase13中に見つけた新機能・仕様改善案は、デモ版リリースに必須でない限り実装せず、Phase13終了時に提案一覧として提出する。

## Initial Phase13 execution — Ryu

Phase13開始時のRyu coverage:
- Move 20
- Frame 20
- Classic Command 20
- Modern Command 0
- Alias 22
- Combo 6
- Setup 4
- Sequence 4
- Counter 4
- Training 13
- Player 1
- Video 2
- Trait Score 12

Current frame-search index was confirmed at `Ver.2.0401.001` on 2026-08-26.

Added in first Phase13 batch:
- 14 special-move candidates: L/M/H/Denjin/OD Hadoken variants, L/M/H/OD Shoryuken, L/M/H/OD Tatsumaki
- 14 Classic commands
- 14 current-patch frame candidates
- 14 move-source links
- 12 shorthand aliases

These records remain draft; frame candidates are reviewed, not verified.

## Discovery backlog

During Phase13, feature/UX/data-model ideas should be collected here but not implemented unless they block the demo release. Final recommendation review happens when Phase13 closes.
