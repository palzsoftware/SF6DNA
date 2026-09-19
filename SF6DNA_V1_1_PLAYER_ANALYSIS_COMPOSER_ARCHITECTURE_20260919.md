# Player Analysis Composer Architecture

`composePlayerAnalysis` は既存Player Analysis modelと共通Coach Evidence契約を受け取り、表示用のsection、uncertainty、Evidence summaryを決定論的に構成する。

## Evidence境界

| Kind | 表示 | 制約 |
|---|---|---|
| PLAYER_STATEMENT | 本人の発言 | source reference必須 |
| OBSERVED_BEHAVIOR | 試合で確認できる行動 | source reference必須 |
| OBSERVED_PATTERN | 複数試合で見られる傾向 | source reference必須 |
| AI_INFERENCE | AIによる分析 | verified禁止・本人発言化禁止 |
| SOURCE_BACKED_FACT | 出典確認済み情報 | source必須・verified昇格禁止 |

Personaはsection順序だけを変更し、Evidence、事実、URL、Patch、Player identityを変更しない。Main Character、Rank、性格は入力にない限り生成しない。Evidenceがなければ空sectionを出さない。
