# SF6DNA Ver.1.0 Next Handoff to Release — 2026-09-26

## Completed

Fresh Audit、Protected Preview全面QA、31 Character、代表Player、Video/Search、Guest Diagnosis→Daily15、Global/Legal pages、DB public boundary read-only監査、P1 Search Copy修正、全gates。

## Remaining（順番固定）

1. 運営者Contact実値を受領しRCへ最小反映。
2. 最新PreviewでUser Minimal QA（特に本人Auth）を実施。
3. Production origin/env/Auth redirectをkey name/scopeのみ確認。
4. Final RC Freeze、rollback target固定。
5. Final SHAを指定したProduction Approval取得。
6. 承認後のみdeploy→Smoke。失敗時rollback。

## Immutable boundaries

Production/main/sf6dna-v2/DBは未変更。V1.1は停止。`aiCoach=false`, `training=false`, `publicStrategyContent=false`。
