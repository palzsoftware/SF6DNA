# Checkpoint の書き方

- ファイル名: `YYYYMMDD-<担当>-<テーマ>.md`（例: `20261117-claude-move-data.md`）
- 1テーマ1ファイル。同じテーマを更新するときは、末尾に日付付きの節を追記する（過去の節は消さない）。
- 他の担当のCheckpointは編集しない。

## テンプレート
```
# <テーマ>（<担当>, YYYY-MM-DD）
## 基準
- ブランチ / 基準SHA / 最終SHA（未Commitなら「未Commit」）
## 変更ファイル
- A/M/D とパス
## テスト
- Typecheck / Lint / Test（件数）/ Build / その他
## 反映段階
- ローカル実装 → … → Production確認 のどこまでか
## 承認待ち・未解決
## 成果物
- patch・Driveリンク・SQL
## 次の一手
```
