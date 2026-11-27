# V38: 開発DB専用 最小REVOKE SQL — 検証結果（隔離PG16・共有DB未適用）

対象SQL: docs/v38/sql/dev-revoke-source-tables-candidate.sql ／ 復旧: dev-revoke-source-tables-rollback.sql
内容: anon から sources/entity_sources の全権限、authenticated から TRUNCATE/REFERENCES/TRIGGER のみを外す。authenticated の SELECT/INSERT/UPDATE/DELETE は維持（admin管理はRLS policy + private.is_admin()）。

## 開発DB実状態（読み取り）
- 既存grant: anon = DELETE,INSERT,REFERENCES,TRIGGER,TRUNCATE,UPDATE（SELECT無し）／authenticated = 全7権限。policyは admin manage のみ。
- sources/entity_sources を参照する関数は全て SECURITY DEFINER（get_public_entity_sources, list_public_sources, private.* 7件）→ 呼び出しロールの権限不要。inline参照のpublic policyは0件。
- FK: entity_sources→sources, character_trait_scores→sources（実行時にREFERENCES権限は不要）。trigger set_updated_at はテーブル所有者権限で動作。

## 隔離PG16（開発DB相当の最小再現）での結果
| 項目 | 適用前 | 適用後 |
|---|---|---|
| anon の move_commands 閲覧(公開+公式source) | 1行 | 1行（再投入データで確認。途中の0行は適用前probeのTRUNCATEでテストデータが消えた為） |
| anon の list_public_sources() | 1行 | 1行 |
| anon の sources 直接 INSERT/TRUNCATE | RLSで拒否 / TRUNCATEはFK以外の権限拒否なし | permission denied |
| authenticated(非admin) の entity_sources TRUNCATE | **成功（RLSを素通りして全削除）** | permission denied |
| authenticated(admin) の sources INSERT/UPDATE/DELETE | 可 | 可（管理機能は維持） |
| 再適用（冪等） / ロールバック→再適用 | – | いずれも成功。ロールバックで適用前権限へ完全復旧 |
- 重要: 適用前は authenticated なら誰でも TRUNCATE でRLSを回避して出典テーブルを全消去できる（PostgREST経由では不可だが、権限としては実在）。適用の価値はあるが、共有DBへの適用は未承認のままHOLD。

## 認証ユーザーA/B 保存データ分離（隔離環境・RLS own_* policy を模擬）
- AがB名義でINSERT → 拒否。BがAの行をUPDATE/DELETE → 0行（無影響）。Bが自分の行のuser_idをAへ付け替え → 拒否。AにはAの行のみ、Bにはの行のみ表示。anonは0行。
- 制約: 上は「期待するpolicy形」の模擬検証。実際の開発DB上の own_* policy（profiles/diagnosis_results/練習記録等）の実在・内容は、共有DBへのテストユーザー作成が書き込みに当たるため未実施。読み取りでpolicyを静的確認する作業を別途行う。
