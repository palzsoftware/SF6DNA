# SF6DNA Ver.1.0 Security / Public Boundary — 2026-09-22

## 判定

`PASS_WITH_ONE_AUTH_SETTING_REVIEW`。DB writeなし。

- public schema全テーブルでRLS有効をFresh確認。
- 公開loadersはCharacter/Player/Videoをpublishedで絞り、Strategyはpublished+verifiedを要求。
- `aiCoach=false`, `training=false`, `publicStrategyContent=false`。
- Coach UIは404、Coach APIはbody parse/retrieval前に404 fail-closed。
- Strategy/Training Library routesとsearch/sitemap漏えいをrelease-gatesで防止。
- `save_diagnosis_result_with_answers`はSECURITY INVOKER、anon execute=false、authenticated=true。
- Advisor警告の公開source 2 RPCはread-only/stableで公開source allowlistを返す設計。`get_public_entity_sources`はさらにpublic target predicateを通す。今回権限変更なし。
- Supabase leaked-password protectionはOFF。P0とは判定しないが、Production前のOwner判断項目。

参考: [Supabase database linter](https://supabase.com/docs/guides/database/database-linter) / [Password security](https://supabase.com/docs/guides/auth/password-security)
