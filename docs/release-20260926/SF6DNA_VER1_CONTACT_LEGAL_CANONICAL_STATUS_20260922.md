# Contact / Legal / Canonical Status — 2026-09-22

## Contact

`PENDING_VALUE / RELEASE_BLOCKER`。対象は `v2-web/src/app/contact/page.tsx` と、受付状況を参照する `feedback/page.tsx`。現在は「準備中」で送信先なし。運営者管理のURLまたはemailを1件提供後、リンク・copy・mobile・rollbackを確認する。値は推測しない。

## Legal

Privacy、Terms、Disclaimer、Feedback、SourcesをBrowser確認。local/browser storage、Auth、診断履歴、外部YouTube、情報精度/第三者関係の説明を実装と照合。Player画像はallowlist/fallback。最終的な法的判断そのものは運営者責任であり、本監査は実装整合性確認。

## Canonical

`READY_CODE / PENDING_PRODUCTION_ORIGIN`。

- metadataBase/robots/sitemapは`NEXT_PUBLIC_SITE_URL`優先、Previewは`VERCEL_URL` fallback。
- Production domainのhard-codeなし。
- Previewではrobots全Disallow、sitemap empty。
- Production origin確定後、`NEXT_PUBLIC_SITE_URL`のProduction scopeを確認し、Preview URLがcanonical/sitemap/hostへ混入しないことをsmokeする。
