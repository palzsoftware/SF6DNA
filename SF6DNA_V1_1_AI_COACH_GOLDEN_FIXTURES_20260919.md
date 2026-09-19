# AI Coach Golden Fixtures

基準SHA: `1b4518a8eff9742e66f5cb8066f9c609a9ca2acc`

Golden fixtureはすべてsyntheticで、Public Playerデータには混ぜていない。

| ID | 代表ケース | 固定する境界 |
|---|---|---|
| diagnosis-only | 診断のみ | 課題・強み・診断Evidence |
| diagnosis-daily | 診断＋Daily | 練習目的・手順・成功条件 |
| user-assertion | ユーザー主張 | PLAYER_STATEMENTのまま保持 |
| assertion-verified | 主張＋検証済み取得 | 2つのEvidenceを分離 |
| stale-patch | 旧Patch | 現行事実化せず注意へ |
| conflicting-sources | 出典競合 | 結論保留 |
| source-backed | 出典あり未検証 | verified禁止 |
| no-evidence | 根拠なし | 自然な空状態 |
| player-inference | Player推定 | AI推定を本人発言化しない |
| mixed-context | 複合Context | ID・URL・Patch・identity維持 |

全ケースを4 Personaで構成し、事実集合とprovenanceの同一性をstructured assertionで確認した。
