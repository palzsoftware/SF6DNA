# RC Freeze Criteria

## Freeze条件

- P0 functional `0`
- Release-required P1 `0`
- Device QA、Auth、Contact、Legal、canonical、Production env `PASS`
- rollback/smoke `READY`
- target RC SHAとPreview SHA一致
- DB/Production変更は別承認とEvidenceを保持

## Freeze後に許可する変更

- P0/P1 blocker修正
- verified fact/copy correction
- Contact/Production originの承認済み実値
- QA/Evidenceのみの更新

新機能、未verified strategy、31キャラ一括media公開、schema拡張、Player画像追加は不可。緊急修正は対象fileを限定し、targeted/full gates、Preview、再QA、rollback SHAを必須とする。

記録: `BASE_SHA / FINAL_RC_SHA / PREVIEW / DEPLOYMENT / TESTS / QA / APPROVALS / ROLLBACK_SHA / OPEN_BLOCKERS`。
