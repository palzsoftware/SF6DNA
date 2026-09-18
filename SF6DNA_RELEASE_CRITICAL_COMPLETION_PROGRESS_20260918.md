# Release Critical Completion Progress

基準RC: `dcb601918870c06c26a24df0a3267f1ee348d734`。本書はread-only監査結果であり、Production/DB変更はない。

| 項目 | 判定 | 現在地 | Close条件 |
|---|---|---|---|
| Contact | `PENDING_VALUE` | `/contact` は「お問い合わせ窓口を準備しています」 | 所有者が連絡先またはform URLを指定し、Previewで送信先確認 |
| Privacy / Terms / Disclaimer | `READY_COPY / PENDING_OWNER_REVIEW` | 3 route存在。Disclaimerは非公式・権利帰属を明示 | 実機route smokeと所有者最終確認 |
| Player画像 | `SAFE_CURRENT` | 新規の無許諾画像追加なし | 画像追加時に個別rights確認 |
| YouTube | `SAFE_EXTERNAL_LINK_ONLY` | provider publicとrelation/publishを分離 | DB反映前の再probe |
| AI Coach / Strategy / Training Library | `OFF_CONFIRMED` | Release対象外 | Production flag matrix確認 |
| canonical / metadataBase | `READY_CODE / PENDING_PRODUCTION_ORIGIN` | `NEXT_PUBLIC_SITE_URL`優先、次に`VERCEL_URL`。Preview固定なし | Production origin値と生成HTML確認 |
| robots / sitemap | `READY_PREVIEW_SAFE` | Previewはcrawl拒否、sitemap空 | Production domainで再確認 |
| Auth redirect | `READY_STATIC / PENDING_DEVICE` | email/password flow。OAuth callback追加は不要 | login→save→reload→history→logout実機PASS |
| Production env | `PENDING_APPROVAL` | key名のみ確認済み。秘密値は未表示 | Production scopeの値/redirect allowlistを所有者確認 |
| Rollback | `READY_PLAN` | DB変更なし、RC commit単位でrevert可能 | Release直前SHAを固定 |

## Contact実値適用allowlist

- UI: Contact routeのplaceholder文言とCTAだけ。
- Test: placeholder非表示、指定された連絡先/URL、Privacy/Terms/Disclaimerからの導線。
- 禁止: 推測メール、個人連絡先、秘密値、Production設定の先行変更。

## Production smoke

`/`, `/characters`, `/characters/ryu`, `/characters/jp`, `/players`, `/videos`, global search, diagnosis→Daily, login/save/reload/history/logout, `/privacy`, `/terms`, `/disclaimer`, `/contact`, 404、console error、canonical、robots、sitemapを確認する。

Release Criticalはコード欠陥として未解決ではなく、`Contact実値`、`Production origin/env`、`実機Auth/route smoke`の承認・確認待ち。
