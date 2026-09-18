# Next Handoff — Release Completion

## ユーザー担当（9/19–9/23）

`SF6DNA_WEEKEND_DEVICE_QA_EXECUTION_PLAN_20260918.md`の順で、実機QA、8 game sessions、Ryu/JP録画だけを実施する。

## Work側の次アクション

1. QA FAIL受領ごとに再現→RC修正→targeted/full gates→push→Preview→再QA箇所だけ返す。
2. Game結果をimport specで検査し、verified/stale/source-recheck候補へ変換。自動publishしない。
3. GIF原本をhash、trim/crop/poster/圧縮し、rights/game review後にRC統合。
4. Contact実値とProduction originが提示されたらallowlist内だけを反映。
5. DB packageは明示承認後だけdry-run→transaction→readback。Productionは別承認。

## 現在のblocker

- `CONTACT = PENDING_VALUE`
- `PRODUCTION_ORIGIN / ENV = PENDING_APPROVAL`
- `AUTH = PENDING_DEVICE_QA`
- `GAME_VERIFICATION = 29 / 8 sessions + 85 generic`
- `GIF = CAPTURE_PENDING`
- `DEVICE_QA = PENDING`

Release目標は9/26。Code CompleteとRelease Readyを分離し、失敗した経路だけを短い再QAへ戻す。
