# SF6DNA v2 データモデル決定書

更新日: 2026-08-26  
対象ブランチ: `sf6dna-v2`

## 1. 目的

SF6DNA v2の中核となるPostgreSQLデータモデルを定義する。

本設計は次の4大コンテンツを同じ知識基盤から支えることを目的とする。

1. 診断
2. キャラクター情報
3. プレイヤー情報
4. AIコーチング

将来のリプレイコーチング、大会・試合研究、検索、管理画面、パッチ更新にも耐えられる構造とする。

---

## 2. 基本原則

### 2.1 IDと表示名を分離する
- 主キーは原則 `uuid`
- URLには人間可読な `slug` を使う
- 表示名変更で関連が壊れない構造にする

### 2.2 攻略情報をコードに埋め込まない
キャラクター、技、コンボ、対策、トレーニング、プレイヤー等はDBで管理する。

### 2.3 表記揺れを正式データとして扱う
例: `弱P / 小P / コパ / 5LP / 立ち弱P` は `move_aliases` から同じ `move_id` へ解決する。

### 2.4 パッチ履歴を捨てない
上書きだけでなく、必要な情報は `valid_from_patch_id / valid_to_patch_id` で有効期間を持てるようにする。

### 2.5 客観データと攻略評価を区別する
- フレーム、ダメージ、コマンド等 = objective
- 立ち回り、難易度、推奨行動等 = editorial / verified_strategy

### 2.6 出典を保持する
公開情報には可能な限り `Source` を紐付ける。

### 2.7 多対多は中間テーブルを使う
文字列タグのみで関係を表現しない。

### 2.8 削除より非公開化を優先する
運用データは `status` を持たせ、履歴保全を優先する。

---

# 3. 共通カラム方針

主要テーブルには原則以下を持たせる。

| カラム | 型 | 用途 |
|---|---|---|
| `id` | uuid | 内部ID |
| `slug` | text | URL・検索用識別子 |
| `status` | text | draft / published / archived |
| `created_at` | timestamptz | 作成日時 |
| `updated_at` | timestamptz | 更新日時 |

攻略・ゲームデータ系には必要に応じて以下も持つ。

| カラム | 用途 |
|---|---|
| `valid_from_patch_id` | このパッチから有効 |
| `valid_to_patch_id` | このパッチまで有効。現行ならnull |
| `verification_status` | unverified / verified / official |
| `content_kind` | objective / editorial / verified_strategy |

---

# 4. パッチ・出典

## 4.1 `patches`
SF6のバージョン・バトル変更を管理する。

主なカラム:
- `id`
- `version_label`
- `name`
- `released_at`
- `official_url`
- `notes`
- `is_current`

`is_current=true` は原則1件のみ。

## 4.2 `sources`
情報源を管理する。

主なカラム:
- `id`
- `title`
- `url`
- `source_type` : official / frame_data / video / article / social / sf6dna_verification / other
- `publisher`
- `published_at`
- `accessed_at`
- `reliability_level`
- `notes`

## 4.3 `entity_sources`
任意の攻略エンティティとSourceを結ぶ共通参照テーブル。

主なカラム:
- `id`
- `entity_type`
- `entity_id`
- `source_id`
- `relationship` : primary / supporting / verification / inspiration
- `note`

`entity_type + entity_id` はアプリ/API側で存在確認する。

---

# 5. キャラクター

## 5.1 `characters`
キャラクター本体。

主なカラム:
- `id`
- `slug`
- `name_ja`
- `name_en`
- `short_name`
- `image_url`
- `release_date`
- `archetype`
- `difficulty`
- `preferred_range`
- `summary`
- `strengths_summary`
- `weaknesses_summary`
- `is_playable`
- `display_order`

## 5.2 `character_aliases`
キャラクター名の表記揺れ。

例: `豪鬼 / Akuma / Gouki`

- `id`
- `character_id`
- `alias`
- `normalized_alias`
- `locale`

## 5.3 `character_guide_sections`
キャラ辞典の文章系攻略を管理する。

用途例:
- 基本方針
- 開幕
- 遠距離
- 中距離
- 近距離
- 画面端
- 攻め
- 防御
- 対空
- ゲージ管理
- バーンアウト
- プレイ中に考えること

主なカラム:
- `id`
- `character_id`
- `section_type`
- `title`
- `body`
- `summary`
- `difficulty_level`
- `display_order`
- パッチ/検証系共通カラム

同じキャラの同じsectionを複数レベル向けに持つことを許可する。

---

# 6. 技・フレームデータ

## 6.1 `moves`
技そのものを表す。フレーム数値とは分離する。

主なカラム:
- `id`
- `character_id`
- `slug`
- `name_ja`
- `name_en`
- `move_type` : normal / unique / target_combo / special / super_art / throw / system
- `strength_variant`
- `description`
- `usage_summary`
- `display_order`

## 6.2 `move_aliases`
検索用表記揺れ。

- `id`
- `move_id`
- `alias`
- `normalized_alias`
- `alias_type` : notation / nickname / old_name / locale / community

`normalized_alias` にインデックスを張る。

## 6.3 `move_commands`
Classic / Modernを独立して扱う。

- `id`
- `move_id`
- `control_scheme` : classic / modern
- `command_text`
- `numeric_notation`
- `button_notation`
- `condition_text`
- `sort_order`

1技に複数コマンドを許可する。

## 6.4 `move_frame_data`
パッチで変化する客観値を分離する。

- `id`
- `move_id`
- `startup`
- `active`
- `recovery`
- `on_hit`
- `on_block`
- `damage`
- `drive_damage`
- `super_gain`
- `cancel_type`
- `hit_level`
- `invincibility`
- `notes`
- `valid_from_patch_id`
- `valid_to_patch_id`
- `verification_status`

`moves` を更新せず履歴を追加することで過去パッチを保持する。

---

# 7. コンボ

## 7.1 `combos`

主なカラム:
- `id`
- `character_id`
- `slug`
- `name`
- `combo_type` : beginner / basic / confirm / punish / corner / drive / sa / max_damage / lethal / burnout
- `notation`
- `starter_text`
- `damage`
- `drive_cost`
- `drive_gain`
- `sa_cost`
- `position` : midscreen / corner / any
- `side_requirement`
- `difficulty`
- `purpose`
- `conditions`
- `notes`
- `video_url`
- パッチ/検証系共通カラム

## 7.2 `combo_moves`
Comboを構成する技を順序付きで関連付ける。

- `combo_id`
- `move_id`
- `step_order`
- `note`

文字列notationだけでなくMove IDでも追えるようにする。

---

# 8. セットプレイ・連携

## 8.1 `setups`
起き攻め・設置・詐欺飛び等。

- `id`
- `character_id`
- `slug`
- `name`
- `setup_type`
- `starter_condition`
- `sequence_text`
- `frame_advantage`
- `position`
- `meter_condition`
- `description`
- `counter_notes`
- パッチ/検証系共通カラム

## 8.2 `setup_moves`
Setup内の技列。

- `setup_id`
- `move_id`
- `step_order`
- `note`

## 8.3 `sequences`
ガード連携・攻め継続等を独立管理する。

- `id`
- `character_id`
- `slug`
- `name`
- `sequence_type`
- `sequence_text`
- `is_true_blockstring`
- `mash_point`
- `throw_point`
- `shimmy_point`
- `jump_option`
- `parry_option`
- `drive_reversal_option`
- `invincible_option`
- `notes`
- パッチ/検証系共通カラム

---

# 9. 対策

## 9.1 `counters`
「何に対する、誰側の対策か」を明示する。

主なカラム:
- `id`
- `slug`
- `defender_character_id` : 対策を使う側。汎用ならnull
- `opponent_character_id`
- `target_type` : character / move / sequence / setup / situation
- `target_id`
- `situation`
- `counter_type` : guard / parry / perfect_parry / punish / whiff_punish / anti_air / impact / jump / backdash / reversal / drive_reversal / spacing / other
- `title`
- `summary`
- `method`
- `benefit`
- `risk`
- `difficulty`
- `conditions`
- パッチ/検証系共通カラム

### 例
`JP側 × 舞 × 特定連携 × Dリバーサル` を1件のCounterとして持てる。

---

# 10. トレーニング

## 10.1 `trainings`
トレモ設定そのものを独立資産として扱う。

- `id`
- `slug`
- `name`
- `training_type` : anti_air / whiff_punish / impact / drive_rush / combo / confirm / defense / parry / throw_shimmy / drive_reversal / oki / corner / matchup / move_counter / other
- `purpose`
- `level`
- `duration_minutes`
- `player_character_id`
- `dummy_character_id`
- `recording_instructions`
- `playback_settings`
- `cpu_settings`
- `method`
- `success_criteria`
- `recommended_reps`
- `next_step`
- パッチ/検証系共通カラム

## 10.2 `training_relations`
TrainingをCounter/Move/Combo/Setup/Sequence等へ関連付ける。

- `training_id`
- `related_type`
- `related_id`
- `relationship`

---

# 11. プレイヤー

## 11.1 `players`
プロに限定しないプレイヤーDB。

- `id`
- `slug`
- `display_name`
- `real_name`
- `country_code`
- `region`
- `player_type` : pro / non_pro_top / legend / specialist / streamer / vtuber / creator / coach / other
- `team_name`
- `bio`
- `image_url`
- `youtube_url`
- `twitch_url`
- `x_url`
- `website_url`
- `is_active`

## 11.2 `player_characters`

- `player_id`
- `character_id`
- `role` : main / sub / pocket / historical
- `valid_from_patch_id`
- `valid_to_patch_id`
- `note`

## 11.3 `player_aliases`
旧名・表記揺れ・英字/日本語表記を管理。

---

# 12. 大会・試合

## 12.1 `tournaments`

- `id`
- `slug`
- `name`
- `series_name`
- `start_date`
- `end_date`
- `region`
- `venue`
- `event_type` : offline / online / hybrid
- `scale`
- `official_url`
- `notes`

## 12.2 `tournament_results`

- `tournament_id`
- `player_id`
- `placement`
- `note`

## 12.3 `matches`

- `id`
- `tournament_id`
- `round_name`
- `played_at`
- `best_of`
- `winner_player_id`
- `score_text`
- `video_id`
- `notes`

## 12.4 `match_participants`
2人対戦を前提にしつつ、モデル上は参加者テーブルへ分離する。

- `match_id`
- `player_id`
- `side`
- `character_id`
- `is_winner`

これにより「特定キャラ同士の大会試合」を検索できる。

---

# 13. 動画

## 13.1 `videos`
YouTube検索結果を毎回表示するだけでなく、重要動画をSF6DNA内で正式データ化する。

- `id`
- `slug`
- `platform` : youtube / twitch / other
- `external_id`
- `url`
- `title`
- `description`
- `thumbnail_url`
- `channel_name`
- `published_at`
- `video_type` : guide / combo / counter / training / ranked / tournament / match / player_commentary / beginner / other
- `duration_seconds`
- `status`

## 13.2 関連テーブル
- `video_characters`
- `video_moves`
- `video_players`
- `video_tournaments`
- `video_matches`
- `video_counters`

各テーブルは対象IDと `video_id` を持つ。

---

# 14. 用語集

## 14.1 `glossary_terms`

- `id`
- `slug`
- `term`
- `short_definition`
- `definition`
- `category`
- `beginner_level`
- `status`

## 14.2 `glossary_aliases`
略称・言い換えを管理する。

---

# 15. 診断

## 15.1 `diagnoses`

- `id`
- `slug`
- `name`
- `diagnosis_type` : character / playstyle / improvement / comprehensive
- `description`
- `estimated_minutes`
- `status`
- `version`

## 15.2 `diagnosis_questions`

- `id`
- `diagnosis_id`
- `question_text`
- `help_text`
- `question_type`
- `display_order`
- `is_required`
- `dimension_key`

## 15.3 `diagnosis_options`

- `id`
- `question_id`
- `label`
- `description`
- `display_order`
- `score_payload` jsonb

`score_payload` は診断ロジックの係数等を格納するが、実行ロジック自体をDB内文字列コードとして保存しない。

## 15.4 `diagnosis_results`
登録ユーザーの履歴保存用。

- `id`
- `user_id`
- `diagnosis_id`
- `diagnosis_version`
- `answers` jsonb
- `scores` jsonb
- `result_summary` jsonb
- `completed_at`

ゲスト結果はブラウザ保存を許可する。

---

# 16. ユーザー

Supabase Authの `auth.users` を認証本体とし、公開/アプリ情報は別テーブルにする。

## 16.1 `profiles`

- `user_id` (auth.users.id)
- `display_name`
- `sf6_id`
- `sf6_id_public`
- `current_rank`
- `peak_rank`
- `current_mr`
- `peak_mr`
- `control_scheme`
- `main_character_id`
- `target_text`

## 16.2 `favorites`

- `id`
- `user_id`
- `entity_type`
- `entity_id`
- `created_at`

初期はCharacter/Combo/Counter/Training/Player/Video等を対象にする。

---

# 17. 検索用設計

## 17.1 初期検索対象
- Character / CharacterAlias
- Move / MoveAlias
- Combo
- Setup
- Sequence
- Counter
- Training
- Player / PlayerAlias
- Tournament
- Video
- Glossary / GlossaryAlias

## 17.2 正規化
検索時はアプリ側で以下を正規化する。

- Unicode正規化
- 英字小文字化
- 全角/半角の統一
- 空白の整理
- 必要に応じて記号差の吸収

## 17.3 インデックス
主な候補:
- 全 `slug` unique index
- Aliasの `normalized_alias`
- `pg_trgm` GIN index
- PostgreSQL `tsvector` 検索列
- 各FK
- `valid_to_patch_id IS NULL` を用いる現行データ検索用index

---

# 18. AIコーチ用データ取得

AIコーチは直接全DBを自由探索させず、アプリ/API側で関連情報を構造化して渡す。

例:

```text
Question: JPで舞の画面端が苦手
  -> Character: JP
  -> Opponent: Mai
  -> CharacterGuideSection: corner defense
  -> relevant Moves
  -> relevant Sequences
  -> Counters (JP-specific優先)
  -> Trainings
  -> Sources
  -> AIへコンテキストとして渡す
```

AI向け取得結果には最低限以下を含める。

- entity id
- title/name
- body/data
- patch/version
- verification status
- source URLs

---

# 19. RLS / 権限の基本方針

### 公開読み取り
`status=published` の攻略データは原則匿名read可。

### 一般ユーザー
自身の以下のみwrite可。
- profile
- diagnosis results
- favorites
- 将来のtraining/history

### Admin/Editor
攻略DBのwrite権限をroleで制御する。

公開クライアントへSupabase Service Role Keyを配布しない。

---

# 20. v2 Phase3で確定する中核関係

```text
Character
 ├─ Move ─ MoveAlias
 │   ├─ MoveCommand
 │   └─ MoveFrameData ─ Patch
 ├─ Combo ─ ComboMove ─ Move
 ├─ Setup ─ SetupMove ─ Move
 ├─ Sequence
 ├─ CharacterGuideSection
 └─ PlayerCharacter ─ Player

Opponent Character / Move / Sequence / Setup
 └─ Counter
      └─ Training

Tournament
 ├─ TournamentResult ─ Player
 └─ Match ─ MatchParticipant ─ Player / Character

Video
 ├─ Character
 ├─ Move
 ├─ Player
 ├─ Tournament
 ├─ Match
 └─ Counter

Source / Patch
 └─ 攻略エンティティの根拠・有効期間

Diagnosis
 ├─ Question
 │   └─ Option
 └─ Result ─ User
```

---

# 21. 意図的に後回しにするもの

Phase3では以下を実装しない。

- AIベクトルDB
- 専用検索エンジン
- リプレイ動画フレーム解析テーブル
- 詳細な大会ゲーム単位の入力
- 課金テーブル
- 広告配信テーブル
- SNS機能

必要になった段階で既存モデルを壊さず追加する。

---

# 22. Phase3完了条件

- [x] Character中心の辞典モデルを定義
- [x] MoveとFrameDataを分離
- [x] Classic/Modernコマンドを分離
- [x] Aliasを正式モデル化
- [x] Combo/Setup/Sequence/Counter/Trainingを独立エンティティ化
- [x] Player/Tournament/Match/VideoをIDで接続
- [x] Patch/Source管理を定義
- [x] Diagnosisの短時間診断対応モデルを定義
- [x] User/Profile/Favoriteの基礎を定義
- [x] AIコーチが参照可能な構造を定義
- [x] PostgreSQL/Supabase前提の権限方針を定義

次工程Phase4では、このデータモデルを前提としてNext.js v2の基盤と既存資産の移行方法を構築する。
