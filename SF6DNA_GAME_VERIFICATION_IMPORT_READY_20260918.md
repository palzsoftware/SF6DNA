# Game Verification Import Ready

判定: `READY`。対象は29 direct claims / 8 sessions。85 genericはclaim-level原票取込まで実行開始しない。

Input: `session_id,claim_id,character,setup,side,position,gauge,dummy_action,attempt_count,result,observed_value,condition,evidence_file,notes,checked_at,checker`

| Result | 変換候補 | 自動公開 |
|---|---|---|
| `PASS_CURRENT` | `verified_candidate` | NO |
| `PASS_WITH_CONDITION` | `verified_candidate` + structured condition | NO |
| `FAIL_CURRENT` | `stale_or_invalid_candidate` | NO |
| `NOT_TESTABLE` | unresolved | NO |
| `NEEDS_SOURCE_RECHECK` | source queue | NO |

同一setupを連続実施してよいがclaim IDは統合しない。patch、side、position、gauge、試行回数、Evidence fileを保持する。Work側が受領後に入力検査、差分候補、Source再確認、DB承認対象を作成する。
