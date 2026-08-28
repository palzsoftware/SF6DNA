# SF6DNA v2 Web

SF6DNA v2のNext.jsアプリです。既存公開版を壊さず並行開発するため、リポジトリ直下の静的HTML群とは分離して`v2-web/`配下に置いています。

## 技術

- Next.js 16.3 / App Router
- React 19
- TypeScript
- Supabase JavaScript client
- ESLint

## 現在の役割

Phase4では以下のみを提供します。

- Next.jsアプリの起動基盤
- 共通レイアウト
- 4大メインコンテンツへのルート
- 基本CSS
- Supabase接続準備
- 既存Express Backend呼び出し用ヘルパー

実データ接続、正式認証、管理画面、診断ロジック、AIコーチは後続Phaseで実装します。

## ローカル起動

```bash
cd v2-web
npm install
cp .env.example .env.local
npm run dev
```

必要な環境変数:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SF6DNA_BACKEND_URL=https://sf6dna-backend.onrender.com
```

Supabase未作成の段階でも、DBクライアントを呼ばないページは表示可能です。

## 安全ルール

- 既存の静的サイトは削除しない。
- `main`へ直接v2を公開しない。
- v2の正本要件は`../docs/V2_REQUIREMENTS.md`。
- データモデルは`../docs/V2_DATA_MODEL.md`。
- SQL草案は`../docs/V2_SCHEMA_DRAFT.sql`。
