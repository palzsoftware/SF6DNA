# FAQ Content and UI — 2026-09-18

## 実装結果

- 9質問を「情報と出典」「操作と機能」「保存とアカウント」「不具合と連絡」に分類。
- 日本語検索、カテゴリー絞り込み、該当件数、0件状態を実装。
- ネイティブ`details/summary`を使い、キーボード操作とフォーカス表示を維持。
- AIコーチ未公開、Modern非推測、ブラウザ保存、パッチ管理、診断非保証を明記。
- 誤情報報告はFeedbackからContact案内へ接続。未設定の受付先は作っていない。

Regression: `tests/global-pages-final-qa.test.mjs` PASS。

