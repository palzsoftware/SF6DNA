# Phase 38 — Training Source Quality Audit (2026-09-01)

## Scope

撮影前に実行可能な品質監査として、Active Training 2,974件のSource、関連Strategy、パッチ、公開状態を確認した。

## Before repair

- Active Training: 2,974
- キャラ固有Training: 2,960
- キャラ非依存Training: 14
- Source欠損: 1
- Source 2件未満: 293
- キャラ別2026.08.03公式変更ページ未接続: 313
- 上記313件のうちSource 2件未満: 270
- 現行パッチ外: 0
- published: 0
- verified: 0

Source欠損1件は`guile-capture-stun-max-current`であり、文章からレシピを断定せず、実機で現行スタン最大候補を探索する独立Trainingである。レシピSourceは存在しないため、ガイル公式変更ページだけをパッチ文脈として接続する。

## Change

`20260901_phase38_training_patch_context_backfill.sql`で、現在のパッチに属するキャラ固有Trainingへ、完全一致で特定した各キャラ公式変更ページを追加する。

- relationship: `patch_context`
- 追加対象: 313件
- 既存Source関係: 上書きしない
- Trainingのstatus・verification_status: 変更しない
- publishedへの昇格: 行わない

公式ページはパッチ文脈だけを示し、Trainingの方法や成功結果を証明しない。

## Relation audit note

Strategy relationがないActive Trainingは485件ある。これにはキャラ非依存の基礎練習、Move／防御／操作練習、撮影前の探索Trainingが含まれるため、relation欠損とは一括判定しない。Strategy由来Trainingのrelation欠損は引き続き0件である。

## Post-repair result

- Active Training: 2,974
- Source欠損: 0
- Source 2件以上: 2,950
- Source 1件のみ: 24
- キャラ固有Trainingの公式変更ページ接続: 2,960 / 2,960
- 現行パッチ外: 0
- published / verified: 0 / 0

Source 1件のみの24件は、キャラ非依存の基礎Training 7件と、公式変更点固有候補・探索Training・説明用素材候補17件である。存在しないレシピSourceを補わず、未確認状態を維持する。
