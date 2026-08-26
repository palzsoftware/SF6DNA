# SF6DNA v2 アーキテクチャ決定書

更新日: 2026-08-26
対象ブランチ: `sf6dna-v2`

## 1. 結論

SF6DNA v2 は、現行の静的HTML/JavaScriptサイトをそのまま拡張し続けるのではなく、既存公開版を維持しながら段階的に次の構成へ移行する。

- Web: Next.js（App Router）+ TypeScript
- DB: PostgreSQL
- DB/Auth/Storage基盤: Supabaseを第一候補として採用
- 検索: PostgreSQL全文検索 + `pg_trgm` + Aliasテーブルから開始
- 外部API/AIサービス: 既存 `SF6DNA-Backend` のNode.js/Express資産を移行・整理して再利用
- 現行公開版: 移行完了までGitHub Pagesを維持
- v2 Webの公開先: Vercelを第一候補

この構成は、診断サイトではなく「SF6総合プラットフォーム」を長期運用することを前提とする。

## 2. なぜ現行構成をそのまま拡張しないか

現行版はHTML/CSS/Vanilla JSによる静的サイトであり、既存機能の表示には十分だが、v2で必要となる以下の要件に対して保守コストが急増する。

- 全キャラクターの大量攻略データ
- 全技とAlias
- フレームデータ
- コンボ、セットプレイ、対策、トレモ
- プレイヤー、大会、試合、動画の多対多関連
- パッチ履歴・出典管理
- アカウント・お気に入り・履歴
- 管理画面
- SEO対応した大量の個別ページ
- AIコーチが参照する構造化データ

特に `assets/js/character-data.js` のような巨大な静的データファイルへ情報を増やし続ける方式はv2では採用しない。

## 3. 既存資産の扱い

### 再利用する

- UI/デザイン資産
- キャラクター画像・プレイヤー画像等の利用可能なメディア
- 診断UIの考え方
- 既存の診断進捗・回答フロー
- キャラクター/プレイヤー関連表示の設計思想
- YouTube検索Backend
- キャッシュ処理
- AI/リプレイ分析の試作コード
- 既存ドキュメントから確認できる仕様・知見

### 再構築する

- キャラクターデータ層
- 診断質問データ/採点モデル
- 検索
- コンボ/技/対策/トレーニングのデータ構造
- プレイヤー・大会・試合の正式DB
- 認証/永続保存

### 移行完了後に廃止候補

- 大量の静的JSデータ
- 重複している旧ディレクトリ
- 重複Backend

削除は移行・検証完了後にのみ行う。

## 4. v2論理構成

```text
Browser
  |
  v
Next.js Web
  |-- Public pages / SEO
  |-- Diagnosis UI
  |-- Character encyclopedia
  |-- Player encyclopedia
  |-- Search
  |-- Admin UI
  |-- Authenticated user pages
  |
  +------ Supabase
  |        |-- PostgreSQL
  |        |-- Auth
  |        |-- Storage
  |
  +------ SF6DNA Backend (Express)
           |-- YouTube API
           |-- External API integrations
           |-- AI Coach
           |-- Replay Coach research
           |-- server-side secrets
```

## 5. Webフレームワーク

### 採用: Next.js + TypeScript

理由:

1. キャラ/技/コンボ/対策など大量のSEO対象ページを作りやすい。
2. サーバー側レンダリング/静的生成を使い分けられる。
3. `/characters/ryu/moves` のようなURLを自然に設計できる。
4. 管理画面・認証画面・検索を同じWebアプリで管理できる。
5. AIやDBに関係するサーバー処理を必要に応じてWeb側にも配置できる。
6. Vanilla JSのまま大規模化するより型によるデータ破損防止ができる。

現行サイトを即時置換せず、v2を並行開発してから切り替える。

## 6. DB

### 採用: PostgreSQL

主な理由:

- データ間の関連が非常に多い。
- Character / Move / Combo / Counter / Training / Player / Match / Video等が多対多でつながる。
- パッチ履歴と出典管理を正規化しやすい。
- 検索機能も初期段階ではPostgreSQL内で実現できる。

### 管理基盤第一候補: Supabase

使用想定:

- PostgreSQL
- Auth
- Storage
- Row Level Security
- 管理用DBアクセス

サービス固有機能へ過度に依存せず、DB自体は標準PostgreSQLとして設計する。

## 7. 検索

初期版で専用検索エンジンを導入しない。

検索優先順位:

1. 完全一致
2. Alias一致
3. 前方/部分一致
4. PostgreSQL全文検索
5. 類似語検索（`pg_trgm`）

例:

- `コパ`
- `弱P`
- `小P`
- `5LP`
- `立ち弱P`

をMoveAliasから同一Moveへ解決する。

データ量・検索負荷が増えた段階でTypesense/Meilisearch/Elasticsearch等を再評価する。

## 8. Backend方針

現行フロントは `https://sf6dna-backend.onrender.com` の動画APIを参照している。

`SF6DNA-Backend`には以下の2構造が存在する。

- repository rootの `src/`
- `SF6DNA-Backend/src/` というネストされたコピー

root版は `package.json -> node src/server.js` で起動する構造であり、現行デプロイ候補として扱う。

nested版にはroot版より新しい以下の試作が存在する。

- YouTube単一動画情報取得
- OpenAI連携
- Replay Analyze API
- replayPrompt

Phase2以降の方針:

1. root版をCanonical Backendとする。
2. nested版の有用機能をrootへ1機能ずつ移植する。
3. 各機能をテストする。
4. 完全移行後のみnested版を削除する。

Renderダッシュボードの実際のRoot Directory/Start CommandはGitHubから確認できないため、削除前に外部設定確認を必須とする。

## 9. AI Coach

AIはSF6攻略知識を自由生成する構成にしない。

```text
User question
  -> query解析
  -> SF6DNA DBから関連データ取得
  -> Character / Move / Counter / Training / Source 等を構造化
  -> AIへ渡す
  -> 根拠付きで説明
```

基本原則:

- SF6DNA DBを事実の主ソースとする。
- DBに無い情報を確定情報として補完しない。
- version/patch/sourceを回答生成時に利用可能にする。
- API keyはサーバー側のみ。

## 10. Replay Coach

将来機能として維持する。

既存BackendにはOpenAIを用いた試作が存在するが、現状の試作はYouTube動画タイトル/説明文とユーザー入力を主材料としており、実際の試合映像そのものを解析しているわけではない。

従って「リプレイ映像コーチング完成済み」とは扱わない。

将来は以下を別途検証する。

- SF6リプレイ情報を取得できる範囲
- 動画入力/フレーム解析の実現方法
- コスト
- 精度
- 利用規約
- ユーザーデータの扱い

## 11. 認証

初期リリースの大半はログイン不要。

ログインが必要な候補:

- 診断履歴
- お気に入り同期
- トレーニング履歴
- 課題履歴
- My Page
- 管理画面

ゲスト利用は引き続き最重要とする。

## 12. Admin

v2では管理画面を必須とする。

管理対象:

- Character
- Move / Alias
- Combo
- Setup / Sequence
- Counter
- Training
- Player
- Tournament / Match
- Video
- Glossary
- Patch
- Source
- Diagnosis

大量データをソースコード修正で管理する方式を終了する。

## 13. SEO

主要情報は個別URLを持つ。

例:

```text
/characters/ryu
/characters/ryu/moves
/characters/ryu/combos
/characters/ryu/matchups
/moves/ryu-hashogeki
/players/example-player
/tournaments/example-event
```

検索結果に出す価値のあるデータは可能な限りサーバー側でHTML化する。

## 14. デプロイ移行

### 現在

- 現行Web: GitHub Pages
- Backend: Render URLをフロントが使用

### v2開発中

- `main` = 現行公開版
- `sf6dna-v2` = v2開発
- GitHub Pagesの公開構成は触らない

### v2公開時

第一候補:

- Web: Vercel
- Database/Auth/Storage: Supabase
- External/AI backend: Render

本番切替前に独自ドメイン導入も再評価する。

## 15. セキュリティ

- OpenAI/YouTube/Supabase service role等の秘密情報をクライアントへ出さない。
- CORS `*` は開発用途のみとし本番では許可Originを限定する。
- Adminは認証 + role判定を必須とする。
- 入力値検証をAPI側でも実施する。
- AI機能には別レート制限を設ける。
- DBではRLSを設定する。

## 16. 移行戦略

全面書き換えを一度に行わない。

```text
Phase1 安全な開発基盤
Phase2 アーキテクチャ確定          <- 本文書
Phase3 DB/Data Model
Phase4 Next.js基盤 + 既存資産移行
Phase5 Character Encyclopedia
Phase6 Search
Phase7 Short Diagnosis
Phase8 Player Database
Phase9 Counter/Combo/Training
Phase10 Admin
Phase11 AI Coach
Phase12 Replay Coach Research
```

## 17. Phase2決定事項

- [x] v2は現行静的サイトへ直接継ぎ足さない
- [x] 現行公開版を維持し並行開発する
- [x] Next.js + TypeScriptをv2 Webの基本技術にする
- [x] PostgreSQLを正式DBにする
- [x] SupabaseをDB/Auth/Storageの第一候補にする
- [x] 既存Express Backendは外部API/AI資産として再利用する
- [x] root BackendをCanonical候補とする
- [x] nested Backendは移植完了まで保存する
- [x] 検索はPostgreSQL + Aliasから開始する
- [x] AIはDB retrievalを先に行う設計にする
- [x] GitHub Pagesはv2切替まで維持する

## 18. 次工程

Phase3で正式なリレーショナルデータモデルを確定する。

最初に定義する中核エンティティ:

- Character
- Move
- MoveAlias
- Combo
- Setup
- Sequence
- Counter
- Training
- Player
- Tournament
- Match
- Video
- Glossary
- Patch
- Source
- Diagnosis
