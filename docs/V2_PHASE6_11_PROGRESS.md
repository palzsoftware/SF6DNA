# SF6DNA v2 Phase6〜11 進捗記録

更新日: 2026-08-26

## Phase6 横断検索・Alias検索
実装済み:
- `/search`
- NFKC正規化
- PostgreSQL RPC `search_sf6dna`
- `pg_trgm`
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
- エンティティ単位の重複排除
- Alias一致表示
- Setup / Sequence検索結果から個別ページへの導線
- `ベガ` Alias検索を実DBで疎通確認

今後:
- Matchの直接検索表現（Match自体にslug/titleが無いため別設計が必要）
- サジェスト
- 検索ランキングの利用ログによる調整
- データ増加後のEXPLAIN/性能計測

## Phase7 短時間診断
実装済み:
- DB駆動Diagnosis一覧
- `/diagnosis/[slug]`
- Question / Optionの汎用レンダリング
- 進捗
- 戻る / 次へ
- score_payloadの汎用集計
- 少数問診断前提のUI
- 最初の正式公開診断 `improvement-check` をSupabaseへ投入
- 12問 / 12軸 / 48選択肢
- 結果を「練習優先度」として上位3件表示
- 結果から横断検索・AI Coach Evidenceへ接続

今後:
- キャラクター適性診断
- プレイスタイル診断
- 総合簡易診断
- 実戦ログとの接続
- 登録ユーザー向け履歴保存

## Phase8 プレイヤーDB
実装済み:
- `/players`
- `/players/[slug]`
- Player Repository
- PlayerCharacter関連
- プロ以外のplayer_typeに対応
- 外部リンク表示

今後:
- 検証済みPlayerデータ投入
- 大会成績
- Match / Video統合
- キャラ別プレイヤー一覧
- フィルタ・地域検索

## Phase9 攻略・トレーニング
実装済み:
- `/moves/[slug]`
- `/combos` / `/combos/[slug]`
- `/setups` / `/setups/[slug]`
- `/sequences` / `/sequences/[slug]`
- `/counters` / `/counters/[slug]`
- `/training` / `/training/[slug]`
- 共通一覧・詳細UI
- Sequenceの連続ガード / 暴れ / 投げ / シミー / パリィ / Dリバーサル / 無敵技の表示項目
- Setup / SequenceにCharacter情報を接続

今後:
- 検証済みMove / Frame / Combo / Setup / Sequence / Counter / Trainingデータ投入
- Character子ページとの完全統合
- 各攻略詳細でのPatch/Source表示
- 関連Training / Counter / Video
- 詳細フィルタ

## Phase10 管理機能
実装済み/設計済み:
- Supabase Auth前提
- `profiles.role = admin` 判定
- RLS
- draft / published / archived運用
- `/admin` 管理者ガード
- 管理対象カテゴリへの導線

ブロッカー:
- 実管理者アカウントがまだ無いためCRUD画面を実ユーザーで検証できない。
- 認証を迂回する管理APIは作らない。

## Phase11 AIコーチ
実装済み:
- `/api/coach/retrieve`
- `/coach` retrieval UI
- DB検索結果をEvidenceとして返す構造
- 500文字上限等の入力検証
- 現在Patch取得
- Evidenceごとの `entity_sources -> sources` 取得
- 画面上にPatchと出典を表示
- 診断結果から `?q=` で質問初期値を渡す導線
- 生成回答を意図的に無効化

生成回答を有効化する条件:
1. Move / Frame / Counter / Training等の検証済みデータを十分に投入
2. Patch / Source紐付けを主要攻略データへ適用
3. Express BackendのAI契約を確定
4. Structured Output + 引用可能Evidenceで回答
5. DBに無い事実を断定しないガードを検証

## Supabase実環境
実施済み:
- PostgreSQL Schema
- RLS
- Auth/Profile基盤
- `pg_trgm`
- unified search RPC
- current Patch
- CAPCOM公式Source群
- 31 playable Characterをpublished
- 3将来Characterをdraft/non-playable
- 最初の短時間診断をpublished
- Security Advisor: 現在重大Lintなし

Performance Advisor:
- 空データが多いためunused index INFOが多数出るが、現時点では削除しない。
- public read policyとadmin manage policyの重複によるmultiple permissive policies WARNがある。これは今後のRLS性能整理項目とする。

## CI
GitHub Actions `SF6DNA v2 Web Check` で以下を継続実行:
- npm install
- typecheck
- lint
- next build

2026-08-26時点で通常のv2基盤は成功済み。AI Coach UI変更時にReact lintエラーを1件検出し、URL query初期化をServer Component側へ移して修正した。修正後CIを再確認する。

## 現時点の主要ブロッカー
1. 正確性確認済みの攻略データ投入（Move / Frame / Combo / Counter等）
2. Supabase Auth上の実Adminアカウント
3. Vercel Project作成・環境変数設定・Preview確認
4. 将来Replay Coach向けの実リプレイ/映像取得方法の実証

上記以外の基盤実装は引き続き `sf6dna-v2` で進める。
