# SF6DNA v2 Phase6〜11 進捗記録

更新日: 2026-08-26

## Phase6 横断検索・Alias検索
実装済み:
- `/search`
- NFKC正規化
- Character / CharacterAlias
- Move / MoveAlias
- Combo
- Player / PlayerAlias
- Glossary
- 重複排除
- Alias一致の表示

未完:
- Counter / Training / Tournament / Match / Videoまでの完全横断
- pg_trgm / FTSのDB側最適化
- 検索候補サジェスト
- 専用ランキング

## Phase7 短時間診断
実装済み:
- DB駆動Diagnosis一覧
- `/diagnosis/[slug]`
- Question / Optionの汎用レンダリング
- 進捗
- 戻る / 次へ
- score_payloadの汎用集計
- 少数問診断前提のUI

未完:
- 正式質問データ
- Character適性・Style・Issueの正式スコアモデル
- 診断結果からキャラ/練習/攻略への正式推薦
- 登録ユーザー向け履歴保存

## Phase8 プレイヤーDB
実装済み:
- `/players`
- `/players/[slug]`
- Player Repository
- PlayerCharacter関連
- プロ以外のplayer_typeに対応
- 外部リンク表示

未完:
- 大会成績
- Match / Video統合
- キャラ別プレイヤー一覧
- フィルタ・地域検索

## Phase9 攻略・トレーニング
実装済み:
- `/combos`
- `/combos/[slug]`
- `/setups`
- `/setups/[slug]`
- `/counters`
- `/counters/[slug]`
- `/training`
- `/training/[slug]`
- `/moves/[slug]`
- 共通一覧・詳細UI

未完:
- Sequence一覧/詳細
- Character子ページとの完全統合
- パッチ/Source表示
- 関連Training / Counter / Video
- 詳細フィルタ

## Phase10 管理機能
設計済み:
- 管理対象
- Auth必須
- admin role
- RLS必須
- draft/published/archived運用
- `/admin`ロック画面

実書き込み管理画面は未実装。
Supabase Project / Auth / RLS実環境なしで認証なし管理APIを作らない。

## Phase11 AIコーチ
実装済み:
- `/api/coach/retrieve`
- `/coach` retrieval UI
- DB検索結果をEvidenceとして返す構造
- 500文字上限等の入力検証
- 生成回答を意図的に無効化

次:
1. SF6DNAの信頼できるデータを投入
2. Source / PatchもEvidenceへ含める
3. Express BackendのAI機能と接続
4. Structured Outputを用いて回答
5. DBに無い事実は断定しない

## 共通未検証事項
GitHubファイル操作環境では以下をまだ実行していない。
- npm install
- typecheck
- lint
- next build
- 実Supabase接続
- RLS動作確認
- Vercel Preview

これらは実行環境またはVercel/Supabase接続後に必ず検証する。
