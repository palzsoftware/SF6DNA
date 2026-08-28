# SF6DNA v2 Phase10 管理機能・セキュリティ方針

更新日: 2026-08-26

## 目的
大量の攻略データをコード編集ではなく管理画面から安全に更新できるようにする。

## 管理対象
- Character / Alias / Guide
- Move / MoveAlias / MoveCommand / MoveFrameData
- Combo
- Setup / Sequence
- Counter
- Training
- Player / PlayerCharacter / Alias
- Tournament / Match
- Video
- Glossary
- Patch
- Source
- Diagnosis / Question / Option

## セキュリティ原則
1. 管理画面はSupabase Authのログイン必須。
2. `profiles.role = admin` のユーザーのみ更新可能。
3. 公開WebからService Role Keyを絶対に参照しない。
4. DB側でもRLSを必須とし、UIを隠すだけで権限管理しない。
5. 公開データのSELECTと管理者のINSERT/UPDATE/DELETEを別Policyにする。
6. 変更履歴を残す。重要ゲームデータは削除よりarchivedを優先する。
7. Patch / Source / verification_statusを公開前チェック項目にする。

## 管理画面構成案
- `/admin` ダッシュボード
- `/admin/characters`
- `/admin/moves`
- `/admin/combos`
- `/admin/counters`
- `/admin/trainings`
- `/admin/players`
- `/admin/tournaments`
- `/admin/videos`
- `/admin/glossary`
- `/admin/patches`
- `/admin/sources`
- `/admin/diagnoses`

## 公開フロー
`draft -> review -> published -> archived`

初期実装ではreviewをstatus列とは別運用にせず、`verification_status` と `status` の組み合わせで管理する。

## 現在のブロッカー
GitHub上のコードだけでは以下を安全に確定できない。
- 実Supabase Project
- Auth provider設定
- 管理者ユーザー
- RLSの実DB適用と動作確認
- Service Roleの保管先

そのためPhase10は設計まで進め、認証なしの書き込み管理画面は作らない。
