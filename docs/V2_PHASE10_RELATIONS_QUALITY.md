# SF6DNA v2 Phase10 - Relations / Data Quality

## 目的

SF6DNA v2の差別化である「データ同士が繋がっている」状態を管理画面から維持できるようにする。

## 追加したRoute

- `/admin/relations`
- `/admin/data-quality`

## `/admin/relations`

管理対象:

- Player Alias
- Glossary Alias
- Player ↔ Character
- Tournament Result
- Match
- Match Participant
- Video ↔ Entity
- Combo Move Steps
- Setup Move Steps
- Training Relations

### 設計原則

- 表示名ではなくUUIDを関係の正本とする。
- Server Actionは`requireAdmin()`を通す。
- Supabase RLSでもadmin-only writeを維持する。
- Player ↔ CharacterはPatch有効期間を保持する。
- Matchは本体とParticipantを分離する。
- Combo / Setupはstep_orderで構成技を順序付き管理する。
- Trainingはrelated_type + related_idでMove / Combo / Setup / Sequence / Counter / Character等へ接続する。

### Video関係の実DB差分

初期Schema草案には`video_characters`等の個別中間テーブル案が存在したが、実Supabase DBでは`entity_videos`に統一されている。

`entity_videos`:
- entity_type
- entity_id
- video_id
- relationship
- display_order
- note

管理UIも実DBを正本として`entity_videos`を利用する。

## `/admin/data-quality`

目的:

- UI実装完了とコンテンツ完成を混同しない。
- published件数を可視化する。
- verification_statusを可視化する。
- 31キャラごとの攻略データ網羅率を可視化する。
- AI Coach生成回答を有効化できる品質に達したか判断する。

表示項目:

- Move / Combo / Setup / Sequence / Counter / Training / Player / Tournament / Match / Video / Glossary / Diagnosis の total / published
- MoveFrame / Combo / Setup / Sequence / Counter / Training の verified件数
- Entity Sources / Entity Videos / Tournament Results / Match Participants / Alias件数
- Moveに対するFrame存在率
- 31キャラ別 Move / Frame / Combo / Setup / Sequence / Counter / Training / Player件数

## 現時点のコンテンツ状態

2026-08-26確認時:

- Move: 14件、published 0
- Combo: 0
- Setup: 0
- Sequence: 0
- Counter: 0
- Training: 0
- Player: 0
- Tournament: 0
- Match: 0
- Video: 0
- Glossary: 0

Move 14件はJP投入パイロットのdraft候補であり、検証前のためpublishedにしていない。

## 次工程

1. CI成功確認
2. Phase10管理UIの残りの実DB差分確認
3. 実AdminユーザーでE2E書込試験
4. 検証済みコンテンツの投入
5. Data Quality基準を満たした領域から段階的に公開
