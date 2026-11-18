# 全キャラ共通GIF受入: Manifestの必須項目と手順(2026-11-16)

## 手順(キャラ共通・既存部品の再利用)
1. ChatGPTのパッケージ(JSON)を `scripts/gif-intake/packages/<キャラ>-handoff-<日付>/` に保存する
2. `node scripts/gif-intake/intake-plan.mjs --character <slug> --package <a.json,b.json> --aliases <別名表/素材台帳> --visual-qa <目視QA> --out <plan.json>`
   → CONNECT_READY / NEEDS_VISUAL_QA / MP4_PRIORITY / HOLD(理由コード付き)に自動で仕分け
3. NEEDS_VISUAL_QA は Claude が目視QA(コンタクトシート)→ 台帳に CONFIRMED を記録 → 2. を再実行
4. `node scripts/gif-intake/build-local-qa-data.mjs --character <slug> --visual-qa <..> --plan <plan.json> ...` で CONNECT_READY のみローカルQAデータ化
5. `node scripts/gif-intake/run-gif-pipeline.mjs --characters <slug>` でChromium検証(新キャラは local-qa-gif-sources.ts の編集不要。ファイル名の規則で自動検出)

## パッケージの必須項目(1GIFにつき)
| 項目(別名も可) | 必須 | 備考 |
|---|---|---|
| asset_filename / gif / filename | 必須 | |
| asset_sha256 / gif_sha256 / sha256 | 必須 | 無ければ SHA_MISSING でHOLD |
| technical_qa | 必須 | PASS 以外は HOLD |
| confirmed_move_id / formal_move_id | 任意 | 「CLAUDE_...」等の未確定語は無視。公開用データの技IDと一致する場合のみ「主張」として扱う |
| confirmed_strength / strength_status / move_strength | 弱・中・強の技は必須 | VERIFIED/CONFIRMED 以外は HOLD。撮影順・見た目のみは確認済みにならない |
| mapping_status | 任意 | HOLD を含むとHOLD |
| publication_status | 任意 | 承認を主張しても無視(警告のみ)。常に NOT_APPROVED |
| source_video / clip_start_seconds / clip_end_seconds | 推奨 | 強度・技の確認証拠。無い場合は HOLD理由の追跡が難しくなる |

## 技IDの根拠の強さ
別名対応表(技名・コマンド照合済み) > 目視QA台帳(CONFIRMED) > パッケージの主張。食い違えば ID_CONFLICT でHOLD。
## 常に守る境界
未承認(NOT_APPROVED)・localQaOnly・MP4優先・公開用データに無い技IDは接続しない・公開Manifest/承認Registryに触れない。
