# SF6DNA

Street Fighter 6プレイヤー向けの総合支援プラットフォームです。

現在のリリース候補は **`v2-web`** を正とします。リポジトリ直下の旧HTML/CSS/JavaScript版は履歴・素材参照用のレガシー実装です。

## 現在の状態

- Phase1〜22: 完了
- Phase23: Pre-device polish進行中
- PC / iPhone実機テスト: Release Candidate固定後の最終Acceptanceとして保留
- v2 Production deploy: 未実施

詳細は [PROJECT_STATUS.md](./PROJECT_STATUS.md) を参照してください。

## 主な機能

- 診断: プレイ傾向・課題・キャラクター候補を短時間診断で整理
- キャラクター辞典: 技、Command、Frame、Combo、Setup、Sequence、Counter、Training
- プレイヤー情報: プロ・競技プレイヤー・参考プレイヤー情報
- 動画: 公開済み動画データ
- 横断検索
- AIコーチ: SF6DNA内で出典を確認できる情報の検索・提示を中心とした安全な支援
- お気に入り / マイキャラ / キャラクター比較
- MR / LPランク記録
- 診断履歴
- 対戦後30秒ログ / 直近10戦振り返り / リプレイ復習
- 対面ナレッジカード
- Admin / Data Quality管理

機能一覧は [FEATURES.md](./FEATURES.md) を参照してください。

## データ品質方針

SF6DNAでは件数より誤情報を出さないことを優先します。

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceがあるだけではverifiedへ昇格しない
- 推測Modern Commandを登録しない
- SourceなしFrameを確定登録しない
- 旧Patch情報をCurrentとして扱わない
- Strategyは公開条件を満たした情報だけをPublic UIへ表示する
- AI Coachは根拠不足の攻略内容を自由生成で補わない

現行Patch baselineは `2026.08.03` 以降です。

## 技術スタック

### v2

- Next.js 16
- React 19
- TypeScript 5
- Supabase
- Vercel
- Browser localStorage（個人向けローカル保存機能）

### Legacy

リポジトリ直下には旧静的サイトのHTML / CSS / JavaScriptと画像素材が残っています。v2のRuntime正本ではありません。

## ディレクトリ

```text
SF6DNA/
├── v2-web/                 # 現行Next.jsアプリ
│   ├── src/app/            # Routes / UI
│   ├── src/components/     # Components
│   ├── src/lib/            # Supabase access / public gates / helpers
│   └── tests/              # Policy / release / regression tests
├── supabase/               # migrations / DB related files
├── docs/                   # Phase audit / requirements / release docs
├── assets/images/          # 旧版由来の画像素材。v2 fallbackでも一部利用
├── scripts/                # audit / migration utilities
└── *.html, assets/js, ...  # Legacy static implementation
```

## ローカル起動

```bash
cd v2-web
npm install
npm run dev
```

標準では `http://localhost:3000` を開きます。

### 必要な環境変数

最低限、Supabase-backed routeを確認する場合は次を設定します。

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

公開URLを明示する環境では必要に応じて次も設定します。

```text
NEXT_PUBLIC_SITE_URL
```

秘密鍵・service role keyをClientへ公開しないでください。

## 品質確認

`v2-web` で以下を実行できます。

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

GitHub ActionsにはBrowser / Runtime / Lighthouse / Release / Data Gate系のAcceptance workflowもあります。

## Deployment

- 作業ブランチ: `sf6dna-v2`
- Preview: Vercel Previewを使用
- `main`: ユーザーの明示許可まで変更しない
- v2 Production deploy: ユーザーの明示許可がある場合のみ実行

Previewは検索エンジン向けにクロールを許可しない設定です。

## Release前の残作業

実機テスト前にUI・画像・文言・SEO・Preview・Auth/Admin・Public Gate・Release docs・CI・Performanceを完了し、Release Candidate HEADを固定します。

その後、[Phase23 Real-Device Test Checklist](./docs/PHASE23_REAL_DEVICE_TEST_CHECKLIST_2026-08-29.md) を使ってPC / iPhone実機テストを行い、Production Readinessを最終判定します。

## 関連文書

- [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- [FEATURES.md](./FEATURES.md)
- [docs/V2_REQUIREMENTS.md](./docs/V2_REQUIREMENTS.md)
- [docs/V2_RELEASE_READINESS.md](./docs/V2_RELEASE_READINESS.md)
- [docs/KNOWN_ISSUES.md](./docs/KNOWN_ISSUES.md)
- [docs/TECH_DEBT.md](./docs/TECH_DEBT.md)
- [docs/PHASE22_FINAL_AUDIT_2026-08-29.md](./docs/PHASE22_FINAL_AUDIT_2026-08-29.md)
- [docs/PHASE23_FINAL_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md](./docs/PHASE23_FINAL_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md)
