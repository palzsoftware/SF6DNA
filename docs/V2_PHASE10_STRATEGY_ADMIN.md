# SF6DNA v2 Phase10 Strategy Admin

更新日: 2026-08-26

## 対象
以下の攻略系データを1つの共通管理基盤で管理する。

- Combo
- Setup
- Sequence
- Counter
- Training

## 管理Route
- `/admin/content/combos`
- `/admin/content/setups`
- `/admin/content/sequences`
- `/admin/content/counters`
- `/admin/content/trainings`

## 実装済み
- 一覧
- 新規作成
- 編集
- Archive
- draft / published / archived
- verification_status
- valid_from_patch_id / valid_to_patch_id
- Source紐付け
- Character選択
- Counterの自キャラ/相手キャラ
- Trainingの自キャラ/ダミーキャラ
- `requireAdmin()`によるServer Action保護
- Supabase RLSによるadmin write制御

## 公開ルール
管理画面で入力できても、未検証データは原則以下で保存する。

- `status = draft`
- `verification_status = unverified` または `candidate`

公開条件:
1. 現行Patchとの整合確認
2. Source確認
3. 成立条件・例外条件確認
4. verification_statusを`verified`へ変更
5. `published`へ変更

## 実装方針
攻略系5種類は共通の管理UI・Server Actionを使用し、重複コードを抑える。
一方、DBは各Entityを独立テーブルとして維持し、検索・AI Retrieval・Patch管理を容易にする。

## CI
追加後のGitHub Actionsで以下を確認済み。
- Typecheck: success
- Lint: success
- Next.js build: success

## 未完
- 実AdminユーザーでのE2E書込試験
- Combo Move step編集
- Setup Move step編集
- Training Relation編集
- Counter target_idのEntity選択UI
- Source重複紐付けの専用UI
- Bulk import / CSV
