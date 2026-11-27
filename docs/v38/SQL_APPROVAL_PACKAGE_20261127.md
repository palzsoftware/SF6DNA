# V38: 開発DB向けSQL 承認パッケージ（すべて未実行・開発DB vvsknbmlfvvnrmgtyhbf 専用）
読み取りで確認した現状（2026-11-27）と、適用時の影響・復旧。本番は対象外（禁止）。

| # | SQL | 現状（読み取り） | 適用時の影響 | 復旧 |
|---|---|---|---|---|
| 1 | docs/v38/sql/dev-revoke-source-tables-candidate.sql | anonにsources/entity_sourcesの書込・TRUNCATE等が残存 | 権限のみ変更。公開RPC・管理(admin policy)は不変（隔離PG16で検証済み・冪等・再適用可） | dev-revoke-source-tables-rollback.sql |
| 2 | v2-web/docs/v26/sql/arjun-dev-character-candidate.sql | 開発DBに slug=arjun 無し、display_order=32 は空き（本番は arjun:draft:非playable で存在） | characters に1行(draft・非公開)。公開表示に出ない | `delete ... where slug='arjun' and moves未投入`（SQL末尾に記載） |
| 3 | v2-web/docs/v26/sql/arjun-intake-candidate.sql（#2の後） | moves0件 | moves62/move_commands120/frames62(candidate_only)。公開フラグは触らない。entity_sources等の出典は別途 | SQL内の手順 or Arjun行ごと削除（FK順） |
| 4 | v2-web/docs/v26/sql/player6-dev-draft-candidate.sql | 6 slug とも開発DBに無し（players計99件）。本番にも6件とも無し | players に最大6行(draft)。Player6確認結果により problem-x/oil-king/kusanagi の3行へ縮小を推奨（PLAYER6_IDENTITY_REVIEW 参照） | `delete from players where slug in (...) and status='draft'` |
| 5 | v2-web/docs/v33/sql/improvement-check-q11-wording-candidate.sql | 開発DBで現行文に一致する行=1。Q11の保存済み回答参照=11件（本番は7件）。本番の文言も同一 | 質問文1行のみ更新。選択肢・配点・保存済み回答は不変 | 同SQL末尾のrollback（現行文へ戻す） |
- 実行順: #1 → #2 → #3、#4・#5は独立。各々に個別承認が必要。
- Q11は本番にも同じ文言があるため、開発DBだけ変えるとPreviewと本番の質問文が乖離する。本番反映（別途承認）とセットで扱うこと。
