# 案A(通常ページ `characters/[slug]/page.tsx` へのGIF接続)整理 — 2026-11-17

**状態: 未適用(別承認待ち)。実ページ・カード本体・公開Manifest・承認Registry・Feature Flags は未変更。**

## 変更対象
- `v2-web/src/app/characters/[slug]/page.tsx` の1ファイルのみ(差分: `proposals/page-gif-connect-head.patch`)
  - import 1行追加 / コメント1行 / 元の `const finalBundle = connectedTxt?.bundle ?? bundle;` を `await connectLocalQaGifToBundle({ characterSlug, bundle: connectedTxt?.bundle ?? bundle, host })` に置換
- 呼び出し先(新規・未追跡のまま既に存在): `src/lib/local-qa-gif-page.ts` / `local-qa-gif.ts` / `local-qa-gif-sources.ts`

## 影響
- 接続の条件: `NODE_ENV=development` かつ `SF6DNA_WS5_TXT_PREVIEW=1` かつ `VERCEL` 未設定 かつ Host が localhost/127.0.0.1。1つでも外れれば **入力の bundle をそのまま返す**(テスト済み: 本番/Preview/外部Host/フラグ無し)。
- 既に `media` がある技(MP4など)には触れない(既存優先・テスト済み)。
- 接続されるのは、ローカルQAデータにある技だけ: 現在 ルーク15 / JP5 / マノン8 / ジュリ5 / ジェイミー7 / キャミィ29 / ディージェイ35 / 春麗2 = 106本(ryu・zangief 等はデータ無しで何もしない)。

## 公開境界(本番に出ない根拠)
1. GIF実体は gitignore 済みの `v2-web/.sf6dna-local-qa-gif/`(public外)。Gitに入らない。
2. QAデータJSONは実行時に `readFile` で読み、`path.join` の第1引数すべてに `/* turbopackIgnore: true */` 付き。隔離ビルドで `.nft.json` / `.next` にQAデータの値が0件であることを確認済み(28本時点)。静的ガードテストあり。
3. データは `localQaOnly:true` / `approval:"NOT_APPROVED"`。
4. 禁止: ローカルQAデータをそのまま公開する方法(本番公開は別承認+承認Registry+公開Manifestの手続きが必要)。
- **36本の時点で検証済み(2026-11-17)。40本(SA3/CA軽量版追加後)の再ビルドは未実施**: 隔離コピーに案Aパッチを当てて `next build` 成功。`.next` 内にQAデータのsha256/ファイル名(126件)のヒット0、`.nft.json` にQAデータ・GIFフォルダの参照なし。
- 注意: `src/data/gif-intake/local-qa/*.json` は追跡対象ファイルとして将来Commitされうるが、実行時読み込みのみで配布物に入らない(上記2)。

## 復旧方法
- 適用前: 何も変えていないので復旧不要。
- 適用後: (1) `patch -R -p1 < proposals/page-gif-connect-head.patch`(または該当3行を元に戻す)、(2) `.next` 削除→再ビルド。データ・GIF実体は削除不要(呼ばれなければ無害)。
- 別ブランチ(Ryu接続Commit `25dd9b9`)用は `page-gif-connect-ryu-branch.patch`(別履歴のためマージしない)。

## 承認時に実行すること(提案)
1. (済) 36本で隔離ビルド→QA値0件を確認
2. パッチ適用(1ファイル)→ 型チェック・全テスト・Chromium
3. 問題があれば上記の復旧手順

## 106本での再検証(2026-11-17)
隔離コピー(実ツリー無変更)に案Aパッチ適用→`next build`成功。`.next` 内にQAデータ212値(sha256+ファイル名)のヒット0、`.nft.json` にQA参照0。実ページ(page.tsx)は未適用のまま。
