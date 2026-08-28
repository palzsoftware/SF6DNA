# SF6DNA

Street Fighter 6(スト6)のプレイヤー向け総合支援サイトです。

公開URL: https://sf6lab.github.io/SF6DNA/

---

## 概要

SF6DNAは、スト6をプレイする人が「自分に合ったキャラクター」「参考にすべきプロ選手・配信者」を見つけたり、キャラクターやチーム、選手について調べたりできる情報サイトです。診断・図鑑・比較・ランク管理など、対戦格闘ゲームを続けていく上で役立つ機能を1つのサイトにまとめています。

## プロジェクトの目的

- プレイヤー診断: 質問に答えることで、自分のプレイスタイルに合ったキャラクターや参考にすべきプロ選手・配信者を提示する
- プレイヤー図鑑: プロ選手・配信者・VTuber・YouTuberの情報をまとめて閲覧できるようにする
- キャラクター図鑑: 全キャラクターの特徴・強み弱み・コンボ動画・対策キャラなどを整理する
- チーム図鑑: eスポーツチームの所属選手・年代別ロスターをまとめる
- 成長支援: ランク推移の記録、キャラクター比較などを通じて上達をサポートする
- (今後)AIリプレイ分析: プレイ内容をAIで分析し、改善点をフィードバックする機能を追加予定

---

## 現在実装済みの機能

| 機能 | 概要 |
|---|---|
| ホーム | サイトの入り口。各機能への導線 |
| プレイヤー診断 | 通常モード・上級モードの2種類。質問に回答してタイプ診断を行う(`diagnosis.html`、`?mode=advanced`で上級モードに切替) |
| 診断結果 | 8軸のスコアに基づき、おすすめキャラクター・参考プロ選手を動的に提示(`result.html`) |
| プレイヤー図鑑 | プロ選手・配信者・VTuber・YouTuberの一覧・詳細(`players.html`、`player.html`) |
| プロ選手名鑑 | 一部選手向けの詳細ページ(`pro-player.html`) |
| キャラクター図鑑 | 全キャラクターの詳細情報・コンボ動画(`characters.html`、`character.html`) |
| キャラクター比較選択 | 比較したいキャラクターを選ぶ画面(`character-select.html`) |
| チーム図鑑 | チーム一覧・詳細・年代別ロスター(`team.html`、`team-detail.html`) |
| 比較機能 | 選手・キャラクターを比較(`compare.html`) |
| お気に入り | 診断結果やキャラクターをブラウザに保存(`favorites.html`) |
| ランク管理 | MR(マスターレート)の手動記録・推移グラフ・Actカレンダー(`rank-tracker.html`) |
| About関連 | サイト概要・お問い合わせ・FAQ・更新履歴・情報源(`about.html`ほか) |
| 動画API連携 | バックエンドAPI経由でYouTube動画を検索・表示。0件時は複数クエリで自動リトライ |

## 今後実装予定の機能

（[FEATURES.md](./FEATURES.md) より）

- AIリプレイ分析
- コンボ検索
- フレーム検索
- 練習メニュー生成
- 大会カレンダー
- コーチングAI

現時点では上記のコード実装は未着手です。詳細な進捗は [PROJECT_STATUS.md](./PROJECT_STATUS.md) を参照してください。

---

## 技術スタック

- **フロントエンド**: HTML / CSS / JavaScript(素の実装。フレームワーク・ビルドツールは使用していません)
- **ホスティング**: GitHub Pages
- **バックエンド**: 動画検索用の外部API(`https://sf6dna-backend.onrender.com`、Node.js/Expressと推測。**このリポジトリには含まれておらず、別リポジトリで管理されています**)
- **データ保存**: ブラウザの`localStorage`(サーバー側のデータベースは使用していません)

---

## ディレクトリ構成

```
SF6DNA/
├── index.html, diagnosis.html, result.html,          # トップ・診断関連
│   character.html, character-select.html, characters.html,  # キャラクター関連
│   player.html, players.html, pro-player.html,       # 選手関連
│   team.html, team-detail.html,                      # チーム関連
│   compare.html, favorites.html, rank-tracker.html,  # 比較・お気に入り・ランク管理
│   about.html, contact.html, faq.html,
│   changelog.html, sources.html, design-system.html
│
├── assets/
│   ├── css/    ← 使用中のCSS
│   ├── js/     ← 使用中のJS(データファイル + ページ別ロジック)
│   └── images/ (characters, players, thumbnails)
│
├── docs/
│   ├── ARCHITECTURE.md ← システム構成の詳細
│   ├── TECH_DEBT.md    ← 既知の技術的負債・改善候補
│   └── DATA_ISSUES.md  ← 選手データの参照切れ・重複の管理台帳
│
├── css/, js/   ← 【未使用のレガシーディレクトリ】どのHTMLからも参照されていません
│
└── players/*.png ← 選手アイコン画像
```

各ファイルの詳しい役割は [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) を参照してください。

---

## ローカルでの起動方法

このプロジェクトはビルド不要の静的サイトです。以下のいずれかの方法で確認できます。

### 方法1: 簡易HTTPサーバーを使う(推奨)

```bash
# リポジトリのルートで実行
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/index.html` を開いてください。

> **注意**: `index.html`をブラウザで直接ダブルクリックして開く(`file://`で開く)と、動画検索APIへのリクエストが正しく動作しない場合があります。可能な限り上記のような簡易サーバー経由で確認してください。

### 方法2: VS CodeのLive Server拡張機能などを使う

同様に、ローカルサーバー経由でアクセスしてください。

---

## GitHub Pagesへの公開方法

このリポジトリはGitHub Pagesで公開されています(`https://sf6lab.github.io/SF6DNA/`)。

一般的なGitHub Pagesの公開手順は以下の通りです（**リポジトリのSettings画面の実際の設定は未確認のため、参考情報としてご確認ください**）。

1. `main`ブランチに変更をpushする
2. GitHubリポジトリの **Settings → Pages** で、公開元ブランチ(例: `main` / `root`)が設定されていることを確認する
3. 数分後、公開URLに変更が反映される

---

## 開発ルール

開発時のルールは [CLAUDE.md](./CLAUDE.md) にまとめています。主なポイント:

- 可読性・保守性を優先する
- 不要なライブラリを追加しない
- 実装前に変更内容・影響範囲を説明する
- 実装後に変更ファイル・確認方法・今後の改善案を報告する
- 仕様が曖昧な場合は質問する
- 既存機能を壊さない
- 大規模変更は小さな単位に分ける

---

## 今後のロードマップ

1. **ドキュメント整備**(完了): README・ARCHITECTURE・TECH_DEBT・DATA_ISSUESの整備による保守性向上
2. **データ整合性の段階的な修正**(対応中): 確実に修正できるもの(表記ゆれ等)から順に対応。判断が必要なもの・未登録データは [docs/DATA_ISSUES.md](./docs/DATA_ISSUES.md) で管理し、`node scripts/check-data-integrity.js` で継続的に検証
3. **未実装機能の着手**: FEATURES.mdの実装予定機能から優先順位を決めて着手
4. **技術的負債の解消**: [docs/TECH_DEBT.md](./docs/TECH_DEBT.md) に記載の項目(レガシーディレクトリの削除、選手ID重複の解消など)

進捗状況は随時 [PROJECT_STATUS.md](./PROJECT_STATUS.md) に反映します。
