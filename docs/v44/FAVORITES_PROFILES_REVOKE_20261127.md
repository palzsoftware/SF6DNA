# V44 favorites / profiles 過剰権限（開発DB）— 最小REVOKE候補（未適用）
- 事実（読み取り確認）: 開発DBの favorites・profiles は anon に DELETE/INSERT/REFERENCES/SELECT/TRIGGER/TRUNCATE/UPDATE、authenticated にも全権限。本番DBは anon なし・authenticated は DELETE/INSERT/SELECT/UPDATE のみ（Migration 20260902081802 適用済みの状態）。開発DBにはこのMigrationの該当部分が反映されていない（schema_migrations に該当名なし）。
- 実害の評価: RLS（user_id = auth.uid()）有効のため、anonは行を読み書きできない。ただし TRUNCATE 権限はRLSを回避するため、権限が残っていること自体が過剰（PostgRESTは通常TRUNCATEを公開しない）。重大度: 低（防御の多層化の欠落）。
- アプリへの影響: リポジトリ内に favorites テーブルへのDBアクセス（.from("favorites")）は無い。お気に入りの登録・解除・再取得は端末保存（localStorage）側で動作。→ 影響なし（想定）。DBを使う場合も authenticated のSELECT/INSERT/UPDATE/DELETEは維持。
- 復旧: dev-revoke-favorites-profiles-rollback.sql（GRANTで元に戻す）。
- 確認方法（適用後・承認時）: has_table_privilege で anon=なし／authenticated=CRUDのみ、`set local role anon` で favorites SELECT が権限拒否、authenticated(sub=任意)で自分の行0件でも SELECT が通る。
- 状態: 作成のみ。共有DBへの適用は未承認。
