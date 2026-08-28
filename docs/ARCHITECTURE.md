# ARCHITECTURE.md

SF6DNAのシステム構成についてまとめたドキュメントです。コード調査(2026年7月時点)に基づいて作成しています。

---

## 1. システム全体構成

```
┌─────────────────────────┐
│   ブラウザ(利用者)        │
│                          │
│  ┌────────────────────┐  │
│  │ HTML / CSS / JS     │  │      GitHub Pagesが
│  │ (静的ファイル)        │◀─┼──── 静的ファイルを配信
│  └────────────────────┘  │
│           │               │
│           │ fetch()        │
│           ▼               │
│  ┌────────────────────┐  │
│  │ localStorage        │  │  ブラウザ内にデータを保存
│  │ (診断結果/お気に入り/  │  │  (サーバー側DBは無し)
│  │  ランク記録/比較選択) │  │
│  └────────────────────┘  │
└──────────┬───────────────┘
           │ fetch() (動画検索のみ)
           ▼
┌─────────────────────────┐
│ バックエンドAPI            │
│ https://sf6dna-backend    │  このリポジトリには
│   .onrender.com           │  含まれない(別リポジトリ)
│ (Node.js/Expressと推測)    │
└──────────┬───────────────┘
           │
           ▼
      YouTube Data API 等(推測、未確認)
```

**ポイント**
- サーバーサイドのアプリケーションロジックは存在せず、GitHub Pagesが静的ファイルをそのまま配信している
- 「ユーザーのデータを保存する」処理はすべてブラウザの`localStorage`で完結しており、サーバー側にユーザーデータは送信されない
- ネットワーク通信が発生するのは、動画検索(YouTube動画取得)のときだけ

---

## 2. 各HTMLページの役割

| ページ | ファイル | 役割 |
|---|---|---|
| ホーム | `index.html` | サイトの入り口。各機能への導線、キャラクター/選手のプレビュー表示 |
| プレイヤー診断 | `diagnosis.html` | 質問に回答してタイプ診断を行う。通常/上級モードあり |
| 診断結果 | `result.html` | 診断結果の表示、おすすめキャラ・プロ選手の提示、お気に入り・履歴機能 |
| キャラクター一覧 | `characters.html` | 全キャラクターの検索・一覧表示、使用状況(メイン/サブ等)の管理 |
| キャラクター詳細 | `character.html` | 個別キャラクターの詳細情報、コンボ動画、対策キャラ等 |
| キャラクター選択(比較用) | `character-select.html` | 比較したいキャラクターを選ぶ画面 |
| 選手一覧 | `players.html` | プロ選手・配信者・VTuber・YouTuberの一覧・検索 |
| 選手詳細 | `player.html` | 個別選手の詳細情報、実績、おすすめ動画 |
| プロ選手名鑑(詳細) | `pro-player.html` | 一部の主要選手向けの詳細ページ(6名のみ対応、`pro-player-directory.js`参照) |
| チーム一覧 | `team.html` | eスポーツチームの一覧 |
| チーム詳細 | `team-detail.html` | チームの所属選手、年代別ロスター、関連動画 |
| 比較 | `compare.html` | 2キャラクター(または選手)の比較表示、対戦動画 |
| お気に入り | `favorites.html` | 保存した診断結果・キャラクターの一覧(ロジックはHTML内に直接記述、詳細は5章) |
| ランク管理 | `rank-tracker.html` | MRの手動記録・推移グラフ・Actカレンダー表示 |
| About / Contact / FAQ / Changelog / Sources | `about.html`ほか | サイト概要・お問い合わせ・よくある質問・更新履歴・参照情報源 |
| デザインシステム | `design-system.html` | 色・UIコンポーネントの確認用ページ(他ページと異なり最小限のCSSのみ読み込み) |

---

## 3. 各JavaScriptファイルの役割

### データファイル(画面を持たない、他のJSから参照される)

| ファイル | 役割 |
|---|---|
| `character-data.js` | 全キャラクターのデータ(基本情報・強み弱み・コンボ動画・対策キャラ・関連選手など)。ファイル内で最も大きい(約104KB) |
| `pro.js` | プロ選手のデータ(約90名分) |
| `streamer.js` | 配信者のデータ(5名分) |
| `vtuber.js` | VTuberのデータ(15名分) |
| `youtuber.js` | YouTuberのデータ(**現在は空。今後の登録用の器として用意されているとみられる**) |
| `player-data.js` | `pro.js`/`streamer.js`/`vtuber.js`/`youtuber.js`をスプレッド構文(`...`)でまとめたもの。実質的な「選手データベース」の窓口 |
| `team-data.js` | チームのデータ(17チーム分) |
| `caster.js` | 実況・解説者のデータ |
| `reference-sources.js` | サイト作成時に参照した情報源のリスト(`sources.html`で表示) |
| `pro-player-directory.js` | `pro-player.html`向けの補足データ(名前・使用キャラ等)。選手情報の重複を避けるための設計 |
| `sf6-calendar-events.js` | スト6のAct切り替え日・アップデート日のデータ(ランク管理ページのカレンダーで使用) |

### ページ別ロジック

| ファイル | 対応ページ | 役割 |
|---|---|---|
| `main.js` | index.html | トップページの簡易な演出処理 |
| `nav.js` | 全ページ共通 | ヘッダーナビゲーション(ハンバーガーメニュー開閉、PC/モバイル表示切替、ドロップダウン制御) |
| `diagnosis.js` | diagnosis.html | 通常モードの診断ロジック・質問データ |
| `diagnosis-advanced.js` | diagnosis.html(`?mode=advanced`時) | 上級モードの診断ロジック・質問データ(約500問分の記述あり) |
| `result.js` | result.html | 診断結果の描画、お気に入り・履歴の管理、動画取得 |
| `characters-list.js` | characters.html | キャラクター一覧の検索・絞り込み・使用状況管理 |
| `characters.js` | character.html | キャラクター詳細の描画、動画タブ切替、動画API連携 |
| `character-select.js` | character-select.html | 比較用キャラクターの選択・保存 |
| `players-list.js` | players.html | 選手一覧の検索・絞り込み |
| `player.js` | player.html | 選手詳細の描画、実績表示、動画API連携 |
| `team.js` | team.html | チーム一覧の描画 |
| `team-detail.js` | team-detail.html | チーム詳細の描画、ロスター履歴、動画API連携 |
| `compare.js` | compare.html | 比較機能のロジック、対戦動画API連携 |
| `rank-tracker.js` | rank-tracker.html | ランク記録の保存・グラフ描画・カレンダー表示 |
| `about.js` | about.html | お問い合わせフォームの送信処理(Formspree想定、未設定時はフォールバック表示) |
| `sources.js` | sources.html | 参照情報源一覧の描画 |
| `video-search.js` | team-detail.html / player.html / character.html / compare.html | **動画検索の共通関数**。複数クエリで自動リトライを行う(詳細は6章) |

### 未使用ファイル

| ファイル | 状態 |
|---|---|
| `diagnosis_old.js` | どのHTMLからも読み込まれていない(レガシー) |
| `result-data_old.js` | 中身が空(0バイト)。どのHTMLからも読み込まれていない |

---

## 4. CSS構成

### 共通CSS(ほぼ全ページで読み込み)

| ファイル | 役割 |
|---|---|
| `reset.css` | ブラウザデフォルトスタイルのリセット |
| `variables.css` | カラー・余白・角丸等のCSS変数定義(ダークテーマの基盤) |
| `layout.css` | ページ全体のレイアウト(ヘッダー・コンテナ幅など) |
| `components.css` | 汎用UIコンポーネント(ボタン・カード等) |
| `components-v2.css` | 追加のUIコンポーネント(ファイルサイズが最大、約37KB) |
| `responsive.css` | レスポンシブ対応(1024px/768px/480pxのブレークポイント) |
| `view-mode.css` | PC/モバイル表示切替機能用のスタイル |

### ページ専用CSS

| ファイル | 対応ページ |
|---|---|
| `index.css` | index.html |
| `diagnosis.css` | diagnosis.html |
| `player.css` | player.html |
| `result.css` | result.html |
| `team.css` | team.html / team-detail.html |
| `rank-tracker.css` | rank-tracker.html |

`design-system.html`のみ、共通CSSのうち`reset.css`と`variables.css`しか読み込んでおらず、UIコンポーネントの見た目確認用の独立したページになっています。

---

## 5. localStorageの利用箇所

サーバー側にデータベースが無いため、利用者ごとのデータはすべてブラウザの`localStorage`に保存されます。

| キー | 保存内容 | 主な利用ファイル |
|---|---|---|
| `sf6dna_result` | 直近の診断結果(タイプ) | diagnosis.js, result.js |
| `sf6dna_score` | 直近の診断スコア(8軸) | diagnosis.js, result.js |
| `sf6dna_diagnosis_mode` | 診断モード(通常/上級) | diagnosis.js, result.js |
| `sf6dna_history` | 診断結果の履歴 | result.js |
| `sf6dna_favorites` | お気に入り登録した内容 | result.js, favorites.html(インラインscript) |
| `sf6dna_compare` | 比較用に選択したキャラクター | character-select.js, compare.js |
| `sf6dna_status` | キャラクターごとの使用状況(メイン/サブ等) | characters-list.js |
| `sf6dna_rank_history` | ランク(MR)の記録履歴 | rank-tracker.js |
| `sf6dna_view_mode` | PC/モバイル表示切替の設定 | nav.js |

**設計上の注意点**: `favorites.html`は他のページと異なり、専用の外部JSファイルを持たず、HTMLファイル内に直接`<script>`タグでロジックを記述しています。他ページとの実装方針の一貫性という観点では改善余地があります(`docs/TECH_DEBT.md`にも記載)。

---

## 6. 動画APIとの連携フロー

対象ページ: `team-detail.html` / `player.html` / `character.html`(コンボ動画タブ) / `compare.html`

```
1. ページ読み込み時、各ページのJS(team-detail.js等)が
   検索クエリの候補を複数パターン用意する
   例: ["○○ 対戦動画 大会 ストリートファイター6",
        "○○ SF6 大会",
        "○○ ストリートファイター6"]

2. video-search.js の共通関数 fetchVideosWithQueryRetry() を呼び出す

3. 共通関数が、クエリを先頭から順にバックエンドAPIへ送信する
   GET https://sf6dna-backend.onrender.com/api/videos/search?q=<クエリ>&max=<件数>

4. 結果が1件以上返ってきた時点で、そのクエリの結果を採用して処理を終了する
   (すべてのクエリで0件、またはAPIエラーだった場合は null を返す)

5. 各ページのJSが、結果を動画カードのHTMLとして描画する
   結果が無ければ「現在関連動画はありません」を表示する
```

この「複数クエリでの自動リトライ」により、1つ目の検索キーワードでは動画が見つからなかった場合でも、言い回しを変えた検索で見つかる可能性を高めています。

**未確認事項**: バックエンドAPI自体の実装(検索アルゴリズム、YouTube Data APIの利用有無、レート制限の有無など)は別リポジトリのため、このドキュメントでは確認できていません。

---

## 7. データの流れ(診断機能を例に)

```
[診断ページ] diagnosis.html / diagnosis.js
   質問に回答
        ↓
   スコアを8軸(movement/offense/defense/reading/combo/
   characterKnowledge/mental/tournament)で算出
        ↓
   localStorage に "sf6dna_result" / "sf6dna_score" / "sf6dna_diagnosis_mode" として保存
        ↓
   result.html へ画面遷移
        ↓
[結果ページ] result.js が localStorage から値を読み込み
        ↓
   character-data.js / pro-player-directory.js 等のデータと突き合わせて
   おすすめキャラクター・プロ選手を動的に算出・表示
        ↓
   「お気に入り」ボタンで localStorage の "sf6dna_favorites" に追記可能
   「履歴」として localStorage の "sf6dna_history" にも記録
```

---

## 8. 今後拡張しやすい構成案

現状の構成を大きく崩さずに拡張していくための案です。断定的な設計変更ではなく、あくまで選択肢として提示します。

1. **APIベースURLの一元管理**
   現在4ファイルに重複している`VIDEO_API_BASE_URL`を、`video-search.js`など1箇所に集約する。バックエンドのURLが変わった場合の修正箇所を1つにできる。

2. **選手データベースの正規化**
   `character-data.js`が選手IDを直接文字列で参照する現在の方式は、表記ゆれ(今回発見した21件の不整合など)が起きやすい。可能であれば、参照時にIDの存在チェックを行う簡易バリデーションスクリプト(Node.jsで実行する開発用ツール)を用意すると、今後同様の不整合を早期発見しやすくなる。

3. **favorites.htmlのロジック分離**
   他ページと同様に`assets/js/favorites.js`として切り出すと、コードの一貫性が高まり保守しやすくなる。

4. **AIリプレイ分析機能の追加**
   FEATURES.mdに記載の「AIリプレイ分析」を追加する場合、現在の構成(データファイル + ページ別ロジックの分離)を踏襲し、`assets/js/replay-data.js`(データ)・`assets/js/replay-analysis.js`(ロジック)・`replay.html`(画面)のような形で追加すると、既存の設計方針と一貫性を保ちやすい。

5. **legacyディレクトリの整理**
   直下の`css/`・`js/`ディレクトリ、`diagnosis_old.js`、`result-data_old.js`は、削除前に一度Gitのタグやブランチとして退避しておくと、後から「やはり必要だった」場合にも復元しやすい。

---

## 関連ドキュメント

- [README.md](../README.md) - プロジェクト概要・起動方法
- [CLAUDE.md](../CLAUDE.md) - 開発ルール
- [PROJECT_STATUS.md](../PROJECT_STATUS.md) - 実装状況
- [FEATURES.md](../FEATURES.md) - 実装予定機能
- [TECH_DEBT.md](./TECH_DEBT.md) - 技術的負債・改善候補
