# SF6DNA v2 Phase4 実装記録

更新日: 2026-08-26
対象ブランチ: `sf6dna-v2`

## 目的

既存GitHub Pages版を維持したまま、SF6DNA v2のNext.js実装を並行して開始できる基盤を作る。

## 実装方針

既存静的サイトの直下構成は変更せず、新規Next.jsアプリを`v2-web/`に分離した。

```text
SF6DNA/
├─ 既存HTML/CSS/JS         # 現行公開版
├─ assets/                 # 現行資産
├─ docs/
└─ v2-web/                 # 新SF6DNA v2
   ├─ src/app/
   ├─ src/lib/
   ├─ package.json
   └─ ...
```

## 追加した基盤

### Next.js / TypeScript
- Next.js 16.3系
- App Router
- React 19
- TypeScript strict mode
- `@/* -> src/*` alias

Next.js 16.xは2026-08時点でActive LTSであり、16.3系をv2の開始点とした。

### 共通UI
- Root Layout
- SF6DNA共通Header
- モバイル対応Navigation
- Home shell
- 基本CSS変数

### 4大コンテンツのルート
- `/diagnosis`
- `/characters`
- `/players`
- `/coach`

Phase4ではプレースホルダーとし、後続Phaseで機能実装する。

### Supabase接続準備

環境変数:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

ブラウザ用・サーバー用の公開データ取得クライアントfactoryを用意した。

正式なユーザーセッション/Auth SSRはまだ実装しない。Auth導入時はSupabaseのSSR方式とCookieセッションを別Phaseで追加する。

### 既存Backend接続準備

`SF6DNA_BACKEND_URL`を経由して既存Express Backendを呼び出す共通helperを追加した。

既定値は現行フロントで使用している:

`https://sf6dna-backend.onrender.com`

## 既存資産の移行方針

Phase4時点では画像・CSS・静的データを大量コピーしない。

後続Phaseで以下の順に移行する。

1. 再利用可能なデザイン要素を選別
2. 画像の利用権・重複・命名を確認
3. 必要資産のみ`v2-web/public/`またはStorageへ移す
4. `character-data.js`等の静的データは直接移植せずDB migration用データへ変換

## 未実施事項

- npm install / lockfile生成
- 実ビルド確認
- Supabase Project作成
- 本番DB migration
- Supabase Auth SSR
- Vercel Project作成
- CI
- キャラクターデータ接続
- 検索
- 診断
- AIコーチ

GitHub上のファイル操作だけではローカル依存関係のインストールと実行検証を完結できないため、実行環境が利用可能になった時点で`npm install`, `npm run typecheck`, `npm run lint`, `npm run build`を実施する。

## Phase4完了条件

- [x] 既存公開版とv2アプリを分離
- [x] Next.js App Router scaffold
- [x] TypeScript基盤
- [x] 4大コンテンツroute作成
- [x] 共通Layout/CSS
- [x] Supabase接続準備
- [x] Backend API接続helper
- [x] 環境変数template
- [x] ローカル起動手順
- [ ] 実行環境でのbuild検証（環境利用可能時に実施）

実行検証を除くコード基盤作成をPhase4完了とし、Phase5ではCharacter Encyclopediaの実装へ進む。
