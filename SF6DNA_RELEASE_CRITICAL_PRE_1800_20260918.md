# Release Critical — Pre 18:00 Read-only

基準: RC `15f0a9496c327b00252ba9c0980d6003ed8019ae`。Production/env/auth/DBの変更なし。秘密値は確認・出力していない。

| Area | State | Fresh evidence / close condition |
|---|---|---|
| Contact | `PENDING_VALUE` | `/contact`は「準備中」。正式公開前に実連絡先またはフォームが必須 |
| Privacy | `PENDING_DEVICE_QA` | routeと現行Auth/保存説明あり。最終owner/legal reviewが必要 |
| Terms / Disclaimer | `PENDING_DEVICE_QA` | routeあり。最終route smokeが必要 |
| canonical / metadataBase | `PARTIAL` | `NEXT_PUBLIC_SITE_URL`優先、なければ`VERCEL_URL`。Production値確認が必要 |
| Auth redirect | `PENDING_DEVICE_QA` | email/password Auth。login→save→reload→logoutの実環境確認が必要 |
| Required public env names | `READY_SCHEMA` | Supabase URL、anon key、site URLの3 key名を確認。値は未出力 |
| Production env | `BLOCKED_APPROVAL` | Previewとの差分・callback・domainをProduction前に確認 |
| Feature flags | `READY_RC_ONLY` | Production matrix approvalが必要 |
| Rollback | `READY` | DB migrationなし。RC commit revertで復旧可能 |
| Production smoke plan | `READY` | core routes、Auth/persistence、Contact/Legal、canonical |
| Production target SHA | `PENDING_DEVICE_QA` | 最終QA後のRC HEADを採用 |

最大のRelease blockerはContact実値、実機Auth/persistence、Production env/canonical確認。今回のread-only作業でProduction Readyへは昇格しない。

