# Phase33 31-Character Strategy Collection Audit

Date: 2026-09-01 JST  
Supabase: `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)  
Patch baseline: `2026.08.03`

## Decision

31キャラの文言・画像SourceによるCombo / Setup / Sequence収集は完了した。動画再生は収集条件から除外し、実機撮影が必要な項目は内部`capture_backlog`へ分離した。

これは収集完了判定であり、現行パッチでの成立確認、`verified`化、Publication approvalではない。

## Package coverage

- Character Content Package: 31
- `rollout_status=complete`: 31
- open / blocked: 0
- キャラ別Active Strategy: 64〜168件
- キャラ別pending capture: 64〜168件

## Strategy inventory

| Entity | Active | Draft | Unverified | Reviewed | Verified | Published |
|---|---:|---:|---:|---:|---:|---:|
| Combo | 1213 | 1213 | 1078 | 134 | 1 | 0 |
| Setup | 792 | 792 | 703 | 89 | 0 | 0 |
| Sequence | 475 | 475 | 439 | 36 | 0 | 0 |
| **Total** | **2480** | **2480** | **2220** | **259** | **1** | **0** |

Training:

- Active / draft: 2974 / 2974
- Unverified: 2481
- Reviewed: 493
- Verified / published: 0 / 0

## Integrity audit

| Check | Result |
|---|---:|
| Active Strategy without Source | 0 |
| Active Strategy without Training relation | 0 |
| Active Strategy without pending capture | 0 |
| Duplicate active Combo notation groups | 0 |
| capture_backlog missing Training | 0 |
| capture_backlog missing Character | 0 |
| capture_backlog Character mismatch | 0 |
| Supabase Security Advisor | 0 lints |

Sourceが1件の既存項目は残っているが、Source欠損はない。2件未満を機械的に不成立・不良とは判定せず、公開条件は既存のstrict gateに従う。

## Capture queue

- total: 2554
- pending: 2553
- not needed: 1
- provided / confirmed / rejected: 0 / 0 / 0

詳細リストは通常の進捗報告では表示しない。ユーザーが撮影可能と明示した時点で、キャラ・優先度・カテゴリ・必要表示項目を含む撮影単位へまとめて提示する。

## Public state

- playable + published Character: 31
- published Diagnosis: 4
- published Move / Combo / Setup / Sequence / Training: 0
- `auth.users`: 0

今回の監査で公開状態、verification状態、Auth userは変更していない。

## Remaining gates

1. ユーザー提供の実機撮影と成立判定
2. 不成立候補のarchive、成立候補のreview/verified判断
3. Content Publication approval
4. Real Auth / Admin E2E
5. Player残画像の人物確認
6. Final RC freeze
7. PC / iPhone実機Acceptance
8. Production readiness判定
9. Production deploy（明示許可時のみ）
