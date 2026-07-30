# SF6DNA

## プロジェクト概要

SF6DNAはStreet Fighter 6プレイヤー向けの総合支援サイトです。

目的は

・プレイヤー診断
・プレイヤー図鑑
・キャラクター図鑑
・チーム図鑑
・AIリプレイ分析(未実装・今後実装予定)
・成長支援

を提供することです。

---

## 使用技術

- HTML / CSS / JavaScript(素の実装。ビルドツール・フレームワーク不使用)
- バックエンド: Node.js/Express と推測される外部API(`https://sf6dna-backend.onrender.com`、YouTube動画検索用。このリポジトリには含まれない別プロジェクト)
- ホスティング: GitHub Pages(`https://sf6lab.github.io/SF6DNA/`)
- リポジトリ: `https://github.com/sf6lab/SF6DNA`
- データ保存: ブラウザの`localStorage`(お気に入り・ランク記録・比較機能・診断進捗などで使用)

※ 以前このファイルにはNext.js / TypeScript / Tailwind CSSと記載されていましたが、実際のリポジトリの実装と一致していなかったため、実態に合わせて修正しました。

---

## ディレクトリ構成

```
SF6DNA/
├── index.html, diagnosis.html, result.html,
│   character.html, character-select.html, characters.html,
│   player.html, players.html, pro-player.html,
│   team.html, team-detail.html,
│   compare.html, favorites.html, rank-tracker.html,
│   about.html, contact.html, faq.html, changelog.html,
│   sources.html, design-system.html
│
├── assets/
│   ├── css/    ← 使用中のCSS(reset, variables, layout, components等)
│   ├── js/     ← 使用中のJS(データファイル+ページ別ロジック)
│   └── images/ (characters, players, thumbnails)
│
├── css/, js/   ← 【未使用のレガシーディレクトリ】どのHTMLからも参照されていない。削除候補
│
└── players/*.png ← 選手アイコン画像
```

全HTMLファイルは`assets/`配下のCSS/JSのみを参照しています(直下の`css/`・`js/`は未使用)。

---

## デザイン

- スマホファースト(複数ブレークポイントで`@media`対応: 1024px / 768px / 480px)
- ダークテーマ(背景`#0d1117`、アクセントカラー オレンジ`#ff6b00`)
- SF6らしい近未来デザイン
- 見やすさを最優先

---

## コーディングルール

- 可読性を優先する
- 保守性を重視する
- 不要なライブラリは追加しない
- 既存の命名規則・ファイル構成(assets/css, assets/js)に合わせる
- 新規追加時も型のないプレーンJSで統一する(TypeScriptは使用しない)

---

## 実装ルール

実装前に

・変更内容
・影響範囲

を説明してください。

実装後は

・変更したファイル
・確認方法
・今後の改善案

を報告してください。

---

## 注意事項

仕様が曖昧な場合は勝手に実装せず質問してください。

既存機能は壊さないようにしてください。

大規模変更は小さな単位に分けてください。
