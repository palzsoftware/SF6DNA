# Production Gate Preparation

Production変更は未実施。対象RCは本batchの最終SHA、直前安定候補は `fee5b2966086f80a82558a4e05f3e39ccc20682d`。

## Environment / domain

| 項目 | Preview | Production close条件 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | key存在を確認 | Production scopeの値を所有者確認 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | key存在を確認 | anon keyであることとscopeを確認。値は報告へ出さない |
| `NEXT_PUBLIC_SITE_URL` | Preview alias生成に利用可能 | 正式originを指定し、末尾slashを正規化 |
| `VERCEL_URL` | fallback | canonicalのProduction正本にはしない |
| Auth redirect | email/password flow | 正式originをallowlist、login/save/reload/history/logout実機PASS |

Previewはrobotsでcrawl拒否、sitemap空。Productionでは正式originのcanonical/social metadata、robots、sitemapを再確認する。

## Release smoke順

1. SHA/deployment/domain一致。
2. `/`, Character list、Ryu/JP、Player、Video、global search。
3. guest diagnosis→Daily。
4. login→save→reload→history→logout。
5. Privacy / Terms / Disclaimer / Contact、404、console error。
6. canonical、OG/Twitter URL、robots、sitemap。

## Rollback

- DB migrationなしのため、問題時は直前安定commitへVercel rollbackまたはRC revert。
- Auth/Production envを変更した場合は、変更前snapshotへ戻して再deploy。
- DB、RLS、RPC、GRANTは本packetの対象外。
