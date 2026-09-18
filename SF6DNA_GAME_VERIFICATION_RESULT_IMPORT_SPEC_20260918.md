# Game Verification Result Import Spec

## Input row

`session_id, claim_id, character, setup, side, position, gauge, dummy_action, attempt_count, result, observed_value, condition, evidence_file, notes, checked_at, checker`

Result enum: `PASS_CURRENT`, `PASS_WITH_CONDITION`, `FAIL_CURRENT`, `NOT_TESTABLE`, `NEEDS_SOURCE_RECHECK`。

## Import rules

1. 29 claims / 8 sessionsのIDとsetupを変更しない。Generic 85は別queue。
2. 同一setup/character/corner-distance/gaugeを連続配置してよいがclaimを統合しない。
3. Evidence file、入力履歴、patch、左右/位置、試行回数を確認。
4. `PASS_CURRENT`はverified candidateであり自動publishしない。
5. 条件付きは条件を本文へ混ぜずstructured conditionとして保持。
6. Failはstale/invalid候補へ分離し、既存公開内容を自動削除しない。
7. `NOT_TESTABLE`とSource再確認は未解決のまま。

DB反映はdry-run差分、対象row count、rollback、承認後のみ。結果受領だけでSource relationやpublication statusを昇格しない。
