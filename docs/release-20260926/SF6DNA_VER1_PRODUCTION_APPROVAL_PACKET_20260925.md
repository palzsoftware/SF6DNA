# SF6DNA Ver.1.0 Production Approval Packet — 2026-09-25

## 承認対象

- Source: RC branchの最終HEAD（GitHub/Vercelで再照合）
- Preview: 最終RC commit由来のREADY deployment
- Code gates: 256/256 tests、14/14 release gates、typecheck/lint/build/diff PASS
- DB migration/write: なし
- Flags: AI Coach/Strategy/Training LibraryすべてOFF

## Production前に値を埋める

1. Contact URL/email
2. Production originと`NEXT_PUBLIC_SITE_URL` presence/scope
3. Supabase public URL/key presence、Auth redirect allowlist（値はEvidenceへ記録しない）
4. User final QA結果
5. leaked-password protectionのOwner判断
6. previous stable Production deployment/SHA

## 明示承認文

上記を確認後、ユーザーが「このFinal RC SHAをProductionへdeployしてよい」と明示するまで、Production env/deploy/aliasを変更しない。

## Rollback

Vercelの直前stable deploymentへaliasを戻し、env変更があれば元値へ戻す。その後Smoke Runbookを再実行。今回DB rollbackは不要。
