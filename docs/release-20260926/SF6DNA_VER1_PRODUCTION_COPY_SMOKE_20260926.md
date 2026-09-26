# SF6DNA Ver.1.0 Production Copy Smoke

STATUS = `NOT_RUN_NO_PRODUCTION_APPROVAL`

実施予定日: 2026-09-26

Production deployの明示承認後にのみ実施する。2026-09-26 08:55 JST時点でFinal RC SHAを指定した明示承認を確認できないため、Production deploy、alias、env、Smokeは実施していない。

## Read-only deploy前監査

| 項目 | 結果 |
|---|---|
| RC HEAD | `7787dba220c435347af8459a44ee64eff9591814` |
| 最新Preview | `dpl_7xMJNzrHKP4F8EcxRe8Ku8TLLiVh` / READY / SHA一致 / target=null |
| Build | Next.js build・TypeScript・46 page生成 PASS、Build error 0 |
| Runtime | 直近6時間のVercel Runtime Error 0 |
| Public Copy差分 | 前回表示確認済みSHAから7 commitを監査、追加P0/P1なし |
| 最新Preview実表示 | `NOT_RUN_AUTH_REQUIRED` |
| Production | `dpl_3T4VAzUWb57vwaN6HphfNGucDPVL` / `main` / `b9a2a8f638a3d4a98bfa042d56470664fe225ba7` / READY |
| Production変更 | NO |
| Production Smoke | NOT RUN |

## 承認後の確認Route

- Home
- Login
- Contact
- FAQ
- Privacy
- Terms
- Disclaimer

## 承認後の確認項目

- 文言崩れ、文字切れ、古いplaceholderがない
- 内部用語が表示されない
- CTAが実際の遷移・送信動作と一致する
- ContactフォームがPrimary、メールがFallbackとして表示される
- Loginの保存範囲説明が実機動作と一致する

```text
PRODUCTION_SHA =
b9a2a8f638a3d4a98bfa042d56470664fe225ba7

DEPLOYMENT =
dpl_3T4VAzUWb57vwaN6HphfNGucDPVL

SMOKE_RESULT =
NOT_RUN_NO_PRODUCTION_APPROVAL

COPY_REGRESSION =
NOT_ASSESSED_ON_PRODUCTION

ROLLBACK_REQUIRED =
NO_PRODUCTION_CHANGE
```
