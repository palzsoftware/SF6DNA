# Phase35 Capture Result Intake Readiness

Date: 2026-09-01 JST  
Supabase: `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)

## Decision

ユーザー撮影動画を受け取った後、撮影待ち項目との照合、成立／不成立判定、`capture_backlog`更新までは現在のDBで実施できる。

一方、元動画をSF6DNAのサイト用素材として永続保存する経路は未完成である。Supabase Storage bucketは0件で、既存`videos`はYouTube等の外部URL管理、`move_motion_media`は公開可能な完成素材URLの管理を目的としている。

したがって、今夜の撮影では判定処理を先行し、元動画はユーザー側でも保持する。Storageや動画公開方式を推測で追加しない。

## Current capability

| Operation | Status | Notes |
|---|---|---|
| 撮影項目を優先順に抽出 | Ready | `scripts/export-pending-capture-queue.sql` |
| 動画と撮影項目を照合 | Ready | Training名・録画手順・成功条件を使用 |
| 受領状態を記録 | Ready | `capture_status=provided` |
| 成立を記録 | Ready | `capture_status=confirmed` |
| 不成立を記録 | Ready | `capture_status=rejected` |
| 撮影不要を記録 | Ready | `capture_status=not_needed` |
| 結果メモを保存 | Ready | `result_notes` |
| 元動画をSupabaseへ保存 | Not ready | Storage bucket 0 |
| コンボ等へ動画URLを直接接続 | Partial | `entity_videos`は外部動画用。内部撮影との直接関係は未定義 |
| 技GIF・操作説明素材を公開 | Hold | 永続URL、変換形式、公開承認が必要 |

## Intake procedure

1. ユーザーが撮影可能と連絡する
2. 最新DBから1キャラ分の未依頼撮影項目を抽出する
3. 同じ設定・位置・ゲージ条件で撮れる項目をまとめて提示する
4. 提示項目だけ`requested_at`を記録する
5. ユーザーが動画を添付する
6. 動画内の入力履歴、フレーム、ダメージ、ゲージ、位置、ダミー条件を確認する
7. 不明な入力や数値は推測せず、再撮影または未確認として残す
8. 受領した項目を`provided`へ更新する
9. 成立判定後、`confirmed / rejected / not_needed`へ個別更新する
10. Combo / Setup / Sequence本体のverificationは別判断とし、撮影済みだけで一括`verified`にしない

## Result update rules

`scripts/process-capture-results.sql`を使用する。

- 既定値は`dry_run=true`
- 正確な`backlog_id`だけを入力する
- Dry runで対象件数と現在状態を確認する
- 状態遷移が正しいことを確認後だけ`dry_run=false`にする
- `pending → provided → confirmed/rejected`を基本とする
- 成立判定できないものは`provided`のまま残す
- 再撮影が必要な場合は`result_notes`へ理由を記録する

## Media retention warning

ChatGPTへの添付動画だけをサイト用原本として扱わない。永続保存経路が決まるまで、ユーザー側で元動画を削除しない。

将来の候補:

- 非公開の原本Storage
- 公開用に軽量化したMP4 / WebM
- 技動作向けGIFまたは短尺動画
- Combo / Setup / Sequence / Trainingとの明示的なmedia relation

これらは保存容量、公開範囲、RLS、変換方式を伴う新仕様なので、ユーザー承認後に実装する。

## Audit evidence

- `storage.buckets`: 0
- `videos`: total 90 / draft 85 / published 5
- `entity_videos`: 112
- `move_motion_media`: 0
- `capture_backlog`にはstatus、request/result notes、requested/provided/resolved timestampsが存在
- Clientから`capture_backlog`へのアクセスはRLSで拒否済み
