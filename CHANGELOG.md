# CHANGELOG.md

SF6DNAの開発マイルストーンを記録するドキュメントです。Gitタグに相当する区切りとして、フェーズ単位で記録します。

---

## Phase1 Final — 2026-07-30

**ステータス: 確定・凍結(Freeze)**

以降、重大なバグ修正を除き、ホームページの仕様変更は行わない。ホームページを変更する場合は、必ずPhase2以降の内容との整合性を確認した上で行うこと。

### 概要

「診断サイト」から「毎日開きたくなるSF6総合プラットフォーム」への第一歩として、ホームページを基準デザインとして全面リデザインした。

### 主な変更内容

- **ドキュメント整備**: README / ARCHITECTURE / TECH_DEBT / DATA_ISSUES の整備
- **デザインコンセプトの検討・確定**: Riot Games風をベースに、eスポーツ大会風のライブ感を取り入れた方向性を採用
- **SF6DNA Design System策定**: `docs/DESIGN_SYSTEM.md`としてColor/Typography/Spacing/Border/Shadow/Animation/Icon/Card/Button/Navigationのルールを定義
- **ホームページの全面リデザイン**:
  - パーソナライズドダッシュボード(未診断/診断済みでの出し分け)
  - レベル・XP・実績バッジ・成長記録
  - 「今日のあなたへ」(日替わりコンテンツ、将来のAPI/AI差し替えを想定した構造)
  - Coming Soon表示(ランキング・大会情報・AIリプレイ分析)
- **プレイヤー画像の追加・整備**: 49名分の画像を追加、命名規則を統一、データとの紐付けを検証
- **データ整備の一部着手**: 大文字小文字の表記ゆれ修正(`Noble`→`noble`)、活動終了選手(ホロスターズ2名)のデータ削除
- **品質確認・バグ修正**:
  - 診断未実施でresult.htmlに直接アクセスした際のエラーを修正
  - ホーム再構築に伴う未使用コード(`main.js`)を削除
- **データ整合性チェックスクリプトの追加**: `scripts/check-data-integrity.js`

### 既知の課題

`docs/KNOWN_ISSUES.md`を参照。

### 対象ファイル(主な変更範囲)

`index.html` / `assets/css/index.css` / `assets/js/home.js` / `assets/js/daily-tips-data.js` / `assets/js/main.js` / `assets/js/result.js`(バグ修正のみ) / `assets/js/pro.js` / `assets/js/streamer.js` / `assets/js/vtuber.js` / `assets/js/team-data.js` / `assets/js/pro-player-directory.js` / `assets/images/players/*` / `assets/css/variables.css`(トークン追記) / `docs/*`

---

## 今後の予定

- **Phase2**: 診断ページ・診断結果・練習メニューのリデザイン
- **Phase3**: キャラクター・プレイヤー・チーム・比較ページへの展開
- **Phase4**: 共通CSSの責務分離・不要コードの整理
