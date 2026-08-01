# PROJECT_STATUS.md

## リデザインの進捗(Phase管理)

| フェーズ | 対象 | ステータス |
|---|---|---|
| Phase1 | ホームページ | ✅ 完了・凍結中 |
| Phase2 | 診断ページ | ✅ 完了 |
| Phase3 | 初心者ポータル化(キャラ/プレイヤー図鑑・ランキング・大会情報等) | ✅ 完了 |
| Phase3.5 | リファクタリング(部分実施) | ✅ 完了 |
| Phase4 | マイページ・お気に入り・活動ログ・デイリークエスト・週次レポート | ✅ 完了 |
| Phase5 | リファクタリング(localStorage共通化、部分実施) | ✅ 完了 |
| Phase6 | キャラ/プレイヤー図鑑リニューアル | 📐 設計完了・実装未着手 |

**Phase1は凍結(Freeze)済みです。** 重大なバグ修正を除き、ホームページの仕様変更は行いません。

詳細な引き継ぎ内容は[docs/PROJECT_HANDOFF.md](./docs/PROJECT_HANDOFF.md)を参照してください。

---

## 実装済み機能(参考)

✅ ホーム(index.html、Phase1でパーソナライズドダッシュボードに刷新)

✅ プレイヤー診断(diagnosis.html / 通常モード・上級モードの2種類、`?mode=advanced`で切替)

✅ 診断結果ページ(result.html、8軸スコアに基づくプロ選手・キャラ推薦)

✅ プレイヤー図鑑(players.html / player.html)

✅ プロ選手名鑑(pro-player.html)

✅ キャラクター図鑑(characters.html / character.html / character-select.html)

✅ チーム図鑑(team.html / team-detail.html)

✅ キャラクター・選手比較機能(compare.html)

✅ お気に入り機能(favorites.html、localStorage使用)

✅ ランク管理(rank-tracker.html、手動MR入力・推移グラフ)

✅ 練習メニュー(training.html、診断結果の弱点軸に基づくドリル提案・完了記録)

✅ About関連サブページ群(about.html / contact.html / faq.html / changelog.html / sources.html)

✅ 動画API連携(YouTube動画取得、複数クエリでのリトライに対応)

## 未着手

- AIリプレイ分析
- コンボ検索
- フレーム検索
- 大会カレンダー(基礎データのみ存在)
- コーチングAI
- 大会ページ
- ランキング機能

---

## 関連ドキュメント

- [CHANGELOG.md](./CHANGELOG.md) — フェーズごとの変更履歴
- [KNOWN_ISSUES.md](./docs/KNOWN_ISSUES.md) — 既知の課題
- [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) — デザインルール
