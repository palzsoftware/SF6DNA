# SF6DNA v2 Known Issues

最終更新: 2026-08-29 JST
対象: `sf6dna-v2` / `v2-web`

この文書では、現行v2のReleaseに影響する課題と、旧静的版にのみ残る課題を分離する。

## 現行v2 — Open

| 重大度 | 内容 | Release扱い |
|---|---|---|
| 中 | PC / iPhone実機AcceptanceはRelease Candidate固定後までHOLD中 | **Release前必須** |
| 低 | 公開プレイヤー41名のDB `image_url` は未登録。旧画像と現在slugが完全一致した17名だけv2 fallbackを再接続済みで、残りは画像なし表示 | 非Blocker / 画像同定後に追加可能 |
| 低 | 公開31キャラクターのDB `image_url` は未登録。v2はリポジトリの既存キャラクター画像fallbackを利用中 | 非Blocker / Performance確認対象 |
| 低 | 一部の既存キャラクター・プレイヤー画像ファイルが大きく、raw GitHub assetを利用するため初回画像転送量が増える可能性がある | Phase23 Performanceで確認 |
| 低 | Modern Command 611件は公式情報から安全に確定できず未入力 | **仕様どおり / 非Blocker** |

## 現行v2 — 解消済み / 再分類済み

- Vercel Preview未成立: 解消済み。`sf6dna-v2` Preview運用中。
- Phase21 / Phase22未開始という管理資料の記載: 解消済み。Release docsをPhase23へ同期。
- ユーザー画面に `Public Gate` / `published + verified` 等の内部用語が目立つ状態: 主要公開ページを一般向け表現へ整理済み。
- プレイヤー種別 `competitive` や使用キャラroleが英語内部値のまま表示される状態: 表示ラベルを整理済み。
- Previewの検索エンジンクロール: `VERCEL_ENV` がProduction以外の場合はrobotsで全クロールを禁止。

## Legacy static site — v2 Release Blockerではない

旧 `index.html` / `assets/js/*` 等には過去の監査で以下が記録されている。

- `character-data.js` の旧Player ID参照切れ
- `pro.js` の旧ID重複
- 旧player image命名不一致
- 直下 `css/` / `js/` 等の未使用Legacy code
- 旧ページの閲覧履歴未実装
- 旧Tabler Icons CDNの実ブラウザ確認

これらはSupabase-backed `v2-web`の正本データ / Runtimeとは別系統であり、**現行v2のRelease Blockerとして扱わない**。

Legacyを削除・統合する場合は別途cleanupとして扱い、v2のデータへ推測マッピングしない。

## Blocker判定

以下はPhase23実機テストで1件でも発生すればRelease Blocker:

- 起動不能 / 白画面
- 主要Route 404 / 5xx
- 仕様外の保存データ消失
- Public Data Gate漏れ
- reviewed / draft / unverified情報の確定表示
- Sourceなし攻略の断定表示
- 主要操作不能
- PC / モバイルで主要UIが画面外へ出て操作不能

正本チェックリスト: `docs/PHASE23_REAL_DEVICE_TEST_CHECKLIST_2026-08-29.md`
