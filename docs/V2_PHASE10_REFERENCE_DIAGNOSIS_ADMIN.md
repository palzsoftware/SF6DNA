# SF6DNA v2 Phase10 Reference / Diagnosis Admin

更新日: 2026-08-26

## 追加した管理領域

### Reference系
- Player: `/admin/reference/players`
- Tournament: `/admin/reference/tournaments`
- Video: `/admin/reference/videos`
- Glossary: `/admin/reference/glossary`

共通機能:
- 一覧
- 新規draft作成
- 編集
- Archive
- published時の公開ページ導線
- `requireAdmin()` Server Action guard
- Supabase RLS admin write policy

### Diagnosis系
- 診断一覧/編集: `/admin/diagnoses`
- 質問管理: `/admin/diagnoses/[id]`
- 選択肢/score_payload管理: `/admin/diagnoses/[id]/questions/[questionId]`

機能:
- Diagnosis create/edit/archive
- Question create/edit/archive
- Question count自動同期
- Option create/edit/delete
- score_payload JSON validation
- 公開状態管理

## 重要な修正
実DBを再確認し、Glossaryのlive tableは`glossary_terms`ではなく`glossary`であることを確認した。
管理コードをlive schemaへ合わせた。

Live glossary columns:
- id
- slug
- term
- short_definition
- definition
- status
- created_at
- updated_at

DBに存在しない`category` / `beginner_level`を管理UIから除外した。

## RLS確認
以下でadmin write policyが存在することを確認済み。
- players
- tournaments
- videos
- glossary
- diagnoses
- diagnosis_questions
- diagnosis_options

公開側はpublishedデータのみSELECT可能な構成を維持する。

## 次の管理機能候補
- PlayerCharacter relation
- PlayerAlias
- TournamentResult
- Match / MatchParticipant
- Video relation tables
- GlossaryAlias
- ComboMove / SetupMove
- TrainingRelation
- CSV/bulk import

## 安全ルール
Admin UIが存在しても、検証前の攻略・プレイヤー・大会情報を自動でpublishedにしない。
`main`は変更せず、`sf6dna-v2`上で継続する。
