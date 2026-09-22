# SF6DNA Ver.1.0 Auth Release Audit — 2026-09-22

## 判定

`AUTH_STATIC=PASS`、`AUTH_RUNTIME=USER_DEVICE_ONLY`。

- `/auth` login/signup UIとsafe internal `next` handoffを確認。
- open redirectを避ける内部path検証あり。
- Guestはprivate match rowsをqueryせず、session missingを正常Guestとして扱う。
- 認証済みDaily loaderは自ユーザーの最新1件のみをbounded selectする。
- Diagnosis保存RPCはanon実行不可、authenticatedのみ。`request_id`再試行契約あり。
- Logoutはlocal scope、成功後document replace。error/network failure時は再試行可能。
- localStorage保存とaccount保存の違いを公開Copyで区別。

## ユーザー最終確認

実アカウントで `Login → Diagnosis → Save → History → Reload → Logout`。テスト用credentialはEvidenceへ残さない。
