# SF6DNA v2 Supabase 状況

更新日: 2026-08-26

## 接続先
既存Supabase Project `SF6DNAPro` をv2正式DB基盤として利用開始した。
Project Refは環境設定用の公開識別子として管理し、Service Role等の秘密情報はGitHubへ保存しない。

## 適用済みMigration
1. `20260826050548 sf6dna_v2_core_schema`
2. `20260826050709 sf6dna_v2_rls_policies`
3. `20260826050727 sf6dna_v2_security_hardening`
4. `20260826051151 sf6dna_v2_performance_indexes`
5. `20260826051202 sf6dna_v2_rls_auth_initplan`
6. `20260826051232 sf6dna_v2_cross_search_rpc`

## 実装済み
- PostgreSQL正式スキーマ
- `pg_trgm`
- Alias用GIN index
- 外部キー/主要一覧用index
- updated_at trigger
- RLS
- public published-content read
- own profile / favorite / diagnosis result access
- admin role判定基盤
- private schemaへ権限判定関数を隔離
- unified search RPC `search_sf6dna`

## Security Advisor
Core + RLS適用後にSupabase Security Advisorを実行し、指摘された以下を修正した。
- mutable search_path
- extension in public schema
- admin helper function exposure

修正後のSecurity Advisor結果: 0件。

## Performance Advisor
外部キーindex不足とauth.uid() initplan指摘に対応するMigrationを追加済み。
公開SELECTとadmin policyの重複によるperformance warningは今後policy整理時に最適化する。これは現時点で機密性を破るSecurity Advisor問題ではない。

## データ状態
スキーマ作成時点では公開ゲームデータを投入していない。
正確性を優先し、未検証の旧静的データを自動Publishしない。

## 次のデータ作業
- 現行Patch登録
- Source登録
- Character基本情報
- Move / Frame / Command
- Combo / Setup / Counter / Training
- Player
- Diagnosis

各ゲームデータは出典・パッチ・検証状態を確認した上で公開する。
