# PROJECT_STATUS.md

## SF6DNA v2 開発状況

2026-08-26より、既存公開版を保全したまま総合プラットフォーム版SF6DNA v2の再構築を開始した。

### v2の4大メインコンテンツ
1. 診断
2. キャラクター情報
3. プレイヤー情報
4. AIコーチング（将来リプレイコーチングを追加予定）

### v2 Phase管理

| フェーズ | 対象 | ステータス |
|---|---|---|
| v2 Phase1 | 安全な開発基盤・ブランチ分離・要件正本化 | ✅ 完了 |
| v2 Phase2 | Backend整理・正式アーキテクチャ設計 | ⏭ 次工程 |
| v2 Phase3 | DB・基礎データモデル | 未着手 |
| v2 Phase4 | 既存資産の移行基盤 | 未着手 |
| v2 Phase5 | キャラクター辞典 | 未着手 |
| v2 Phase6 | 横断検索・Alias検索 | 未着手 |
| v2 Phase7 | 短時間診断への再構築 | 未着手 |
| v2 Phase8 | プレイヤーDB | 未着手 |
| v2 Phase9 | 対策・コンボ・セットプレイ・トレモ | 未着手 |
| v2 Phase10 | 管理機能 | 未着手 |
| v2 Phase11 | AIコーチ | 未着手 |
| v2 Phase12 | リプレイコーチ研究・実証 | 未着手 |

v2開発ブランチ: `sf6dna-v2`

新要件の正本: [docs/V2_REQUIREMENTS.md](./docs/V2_REQUIREMENTS.md)

Phase1の開発ルール: [docs/V2_PHASE1_FOUNDATION.md](./docs/V2_PHASE1_FOUNDATION.md)

> v2開発では旧PROJECT_STATUSのPhase番号と混同しないこと。旧Phase群は既存版の履歴として以下に残す。

---

## 既存版リデザインの進捗（履歴）

| フェーズ | 対象 | ステータス |
|---|---|---|
| Phase1 | ホームページ | ✅ 完了・凍結中 |
| Phase2 | 診断ページ | ✅ 完了 |
| Phase3 | 初心者ポータル化（キャラ/プレイヤー図鑑・ランキング・大会情報等） | ✅ 完了 |
| Phase3.5 | リファクタリング（部分実施） | ✅ 完了 |
| Phase4 | マイページ・お気に入り・活動ログ・デイリークエスト・週次レポート | ✅ 完了 |
| Phase5 | リファクタリング（localStorage共通化、部分実施） | ✅ 完了 |
| Phase6 | キャラ/プレイヤー図鑑リニューアル | 📐 設計完了・v2移行により旧計画として保留 |

既存版Phase1は凍結（Freeze）済み。重大なバグ修正を除き、公開版ホームページの仕様変更は行わない。

詳細な旧引き継ぎ内容は[docs/PROJECT_HANDOFF.md](./docs/PROJECT_HANDOFF.md)を参照。

---

## 既存版で実装済みの機能（再利用候補）

✅ ホーム（index.html）

✅ プレイヤー診断（diagnosis.html / 通常モード・上級モード）

✅ 診断結果ページ（result.html、8軸スコアに基づくプロ選手・キャラ推薦）

✅ プレイヤー図鑑（players.html / player.html）

✅ プロ選手名鑑（pro-player.html）

✅ キャラクター図鑑（characters.html / character.html / character-select.html）

✅ チーム図鑑（team.html / team-detail.html）

✅ キャラクター・選手比較機能（compare.html）

✅ お気に入り機能（favorites.html、localStorage使用）

✅ ランク管理（rank-tracker.html、手動MR入力・推移グラフ）

✅ 練習メニュー（training.html、診断結果の弱点軸に基づくドリル提案・完了記録）

✅ About関連サブページ群（about.html / contact.html / faq.html / changelog.html / sources.html）

✅ 動画API連携（YouTube動画取得、複数クエリでのリトライに対応）

## v2で再設計・新規構築する主要領域

- 短時間診断
- 本格キャラクター辞典
- 技・フレームデータ
- コンボ
- セットプレイ
- キャラ/技/連携対策
- トレーニングDB
- プレイヤーDB拡張
- 大会・試合DB
- 横断検索
- 表記揺れ / Alias検索
- Patch / Source管理
- 管理画面
- AIコーチ
- 将来のリプレイコーチ

---

## 関連ドキュメント

- [docs/V2_REQUIREMENTS.md](./docs/V2_REQUIREMENTS.md) — v2確定要件
- [docs/V2_PHASE1_FOUNDATION.md](./docs/V2_PHASE1_FOUNDATION.md) — v2 Phase1安全基盤
- [CHANGELOG.md](./CHANGELOG.md) — 既存版フェーズごとの変更履歴
- [docs/KNOWN_ISSUES.md](./docs/KNOWN_ISSUES.md) — 既知の課題
- [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) — デザインルール
