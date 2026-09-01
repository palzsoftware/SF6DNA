# Phase34 Capture Queue Operational Audit

Date: 2026-09-01 JST  
Supabase: `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)

## Decision

撮影待ちキューは、ユーザーが撮影可能と明示した時点でキャラ別・優先度順に提示できる状態である。現時点では詳細リストを表示せず、`capture_backlog`に保持する。

## Queue snapshot

- pending: 2553
- キャラ別件数: 64〜168
- 平均: 82.4
- `requested_at`設定済み: 0
- 空の撮影名 / 目的 / 録画手順 / 方法 / 成功条件 / 依頼文: すべて0
- Training参照切れ: 0
- Character不一致: 0

## Strategy linkage

| Related type | Pending |
|---|---:|
| Combo | 1213 |
| Setup | 792 |
| Sequence | 475 |
| Standalone | 73 |
| **Total** | **2553** |

Standalone 73件は関係欠損ではない。

- 初心者ページ向け操作説明素材: 64
- 独立した動画候補再確認: 8
- Combo discovery: 1

## Priority distribution

| Priority | Count |
|---:|---:|
| 5 | 1 |
| 10 | 64 |
| 15 | 4 |
| 20 | 352 |
| 25 | 4 |
| 30 | 662 |
| 35 | 872 |
| 40 | 5 |
| 45 | 468 |
| 50 | 78 |
| 55 | 14 |
| 80 | 29 |

数値が小さいほど先に提示する。件数だけで再採番せず、既存の優先度・キャラ・Training名の順で安定ソートする。

## Presentation rule

ユーザーが「撮影作業できます」と明示した場合:

1. 希望キャラが明示されていれば、そのキャラだけ抽出する
2. キャラ指定がなければ、priorityが最小の未依頼項目から提示する
3. 一度に提示する件数は、撮影セッションとして扱える量へまとめる
4. 同じ設定・画面位置・ゲージ条件の項目は連続配置する
5. Combo / Setup / Sequence / 初心者向け説明素材を明示する
6. 撮影時に必要な入力履歴・フレーム・ダメージ・ゲージ・ダミー設定を付ける
7. 提示した項目だけ`requested_at`を記録する
8. 動画提供後に`provided`へ変更し、成立判定後に`confirmed / rejected / not_needed`へ更新する

ユーザーが撮影可能と明示する前に、`requested_at`や`capture_status`を先行変更しない。

## Export query

再開時は`scripts/export-pending-capture-queue.sql`を使い、Supabase実DBから最新リストを生成する。保存済みの静的一覧を正本にしない。

## Verification result

- Queue structural audit: PASS
- Priority availability: PASS
- Required filming instructions: PASS
- Strategy coverage: 2480 / 2480
- Standalone classification: 73 / 73 explained
- DB mutation during audit: none
