# SF6DNA Ver.1.0 Production Smoke Runbook — 2026-09-25

Production明示承認後のみ実行。

1. Deployment READY、Production alias、Git SHA、TLS、originを確認。
2. `/`, `/characters`, `/characters/ryu`, `/characters/jp`, `/players`, `/videos`, `/diagnosis`, `/me/training`, `/search`, `/faq`, `/sources`, `/privacy`, `/terms`, `/disclaimer`, `/contact`。
3. Login→Diagnosis→Save→History→Reload→Logout。
4. `/coach`、Strategy detail、Training Libraryが公開されないことを確認。
5. robots/sitemap/canonicalがProduction originで、Preview originを含まないことを確認。
6. Console、failed API/asset、CORS、runtime error、375px overflowを確認。

即rollback条件: Login/Save不能、主要route 5xx、private/disabled content漏えい、重大CORS/runtime、wrong canonical、Contact/Legal欠落。
