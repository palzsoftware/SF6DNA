# 通常ページ(characters/[slug])へのGIF接続 統合計画(承認待ち・未適用)

結論: **page.tsx の1ファイル・追加3行/削除1行**で、ローカルQAのGIF(27本)を通常ページに接続できる。実ページは未変更。承認後に適用する。

## 1. 現状比較
- HEAD(52eddb3) = origin/sf6dna-v2-chatgpt-rc-20260916 と同じ。Ryu接続版(origin/sf6dna-ryu-preview-qa-20261113)は別の仕組み(Vercel Preview専用 `connectRyuQaMotion`)で、同じ `finalBundle` 行を変更している → **ブランチ別に2本の差分案**を用意。
  - 案A `page-gif-connect-head.patch`(HEAD用): import 1行 + コメント1行 + 呼び出し1行(元の finalBundle 行を置換)
  - 案B `page-gif-connect-ryu-branch.patch`(Ryuブランチ用): Ryuの結果(`ryuConnectedBundle`)を受けてからQA接続を後段に足す。Ryuの挙動は変えない
- 両案とも `patch --dry-run` / `git apply --check` で適用可を確認済み。

## 2. 必要なファイル(新規追加のみ・既存の変更は page.tsx だけ)
- `v2-web/src/lib/local-qa-gif.ts`, `local-qa-gif-page.ts`, `local-qa-gif-sources.ts`, `local-qa-gif-variants.ts`(任意: 派生パターン用)
- `v2-web/src/app/internal/gif-qa/**`(隔離ルート。画像配信ルートを含む)
- `v2-web/src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_{LUKE,JP,MANON,JURI}_20261116.json`(+ LUKE_VARIANTS 任意)
- GIF実体は含めない(gitignore済み `v2-web/.sf6dna-local-qa-gif/`)

## 3. 安全性(確認済み)
- 入口判定: `NODE_ENV=development` + `SF6DNA_WS5_TXT_PREVIEW=1` + `VERCEL`なし + localhost の全てを満たす時だけ動作。それ以外は入力バンドルをそのまま返す(テスト済み: 本番/Vercel/外部ホスト/フラグ無し)。
- MP4優先: 既に media がある技・承認済みMP4がある技は上書きしない(テスト済み)。ID未確認のGIFはデータに入っていない(HOLD)。
- カード本体(character-unified-page / move-motion-media)・公開Manifest・承認Registry・Feature Flags は無変更。
- 隔離コピーでの本番ビルド(next build)成功。**クライアント向け成果物(.next/static)にQAデータ・GIF名・QA文字列は0件**。サーバー成果物のコードに入るのはQAの定数/関数のみ(技IDは既存の公開データ由来)。
- **解決済み(17:5x)**: `.nft.json` にQA用JSON5本が載る原因は、`local-qa-gif-sources.ts` の `path.join` のうち1か所(`dataDir()` に固定文字列 `gif-intake/local-qa` を足す箇所)に `turbopackIgnore` が無く、Turbopackが「読み込み対象フォルダ」として静的に解釈したため。全ての `path.join` 第1引数に `/* turbopackIgnore: true */` を付けて解決(next.config 変更は不要)。隔離コピーで本番ビルドし、`.nft.json` のQA用JSON 0件・GIF格納先 0件、ビルド成果物全体でQAデータ由来の値(SHA・GIF名など107個)0件を確認。付け忘れ防止の静的テストも追加。

## 4. 実ページを本物のまま描画できない点
`/characters/[slug]` は Supabase が必要で、ローカルには `.env` が無く描画不可。代わりに (1) 同じ接続関数をカード統合ページで Chromium 検証(27本表示・配信エラー0)、(2) 差分案適用後の隔離コピー `_page-copy` の型検査・本番ビルドで確認。**実ページの描画そのものは未確認**。

## 5. 承認が必要なもの
1. `characters/[slug]/page.tsx` への差分案A(または案B)の適用
2. (不要になった)`next.config` のトレース除外
3. (任意)カード本体の派生パターン切替(`card-media-variants.patch`)
4. 新規ファイル群のコミット(コミット/Pushは今回禁止のまま)

## 6. 復旧方法
- 適用前に戻す: `git apply -R scripts/gif-intake/proposals/page-gif-connect-head.patch` または `git checkout -- "v2-web/src/app/characters/[slug]/page.tsx"`
- 新規ファイルは削除するだけ(既存コードから参照されるのは page.tsx の1行のみ)。
