# SF6DNA Ver.1.0 Release QA Master — 2026-09-22

## Work側結果

| Scope | 結果 | Evidence要約 |
|---|---|---|
| Home / Global | PASS | Header、Footer、主要CTA、内部導線、overflow 0 |
| Characters | PASS | 31/31 routes、V2共通Tab、legacy情報源Tabなし、runtime errorなし |
| Player | PASS | 検索、カテゴリ＋キャラAND filter、clear、0件、代表6 detail |
| Video | PASS | 検索、JP filter、Favorite/Watchedのon/off復元、0件 |
| Global Search | PASS_AFTER_FIX | JP/リュウ/ときど/VARREL/Crazy Raccoon/コンボ/SA2/最大コンボを確認 |
| Diagnosis → Daily15 | PASS | Guest 12問完了、結果→対空focus、5分×3、accordion、5/15操作 |
| Auth | STATIC_PASS / USER_DEVICE_ONLY | route、safe next、save contract、missing-session、logout回帰はPASS。本人credential runtimeは未実施 |
| Global pages | PASS_WITH_CONTACT_PENDING | About/FAQ/Feedback/Sources/Privacy/Terms/Disclaimer/Changelog正常。Contact実値のみ未提供 |
| Technical | PASS_WITH_ENV_PENDING | custom 404、robots/sitemap実装・tests、runtime/overflow確認。Production origin/env presenceは承認時確認 |

## Browser範囲

- Release主要22 routesをCloud Browserで巡回。unexpected 404、page-wide overflow、app-origin console errorなし。
- 31 Character routesを全件巡回。各routeに概要/技/コンボ/セットプレイ/連携・対策/動画。
- Consoleに出たメッセージはBrowser extension由来のみで、アプリ由来ではない。
- `robots.txt`はBrowser側client block、認証fetchはSSO redirectのため、コード・build・専用testsで検証。

## Gates

`P0_OPEN=0`、`REQUIRED_P1_OPEN=0`。Contact値、本人Auth acceptance、Production Approvalはユーザー入力/承認待ち。
