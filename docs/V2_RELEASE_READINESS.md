# SF6DNA v2 Release Readiness

## 目的

コード完成と公開可能状態を分離して判定する。公開は「画面が動く」だけでなく、データ品質・認証・検索・SEO・実機確認まで満たした段階で行う。

## Gate A: Build / Runtime

- GitHub Actions: install / typecheck / lint / build が成功
- 主要Routeで500エラーがない
- Supabase未設定時に安全なfallback表示になる
- Backend API障害時にページ全体が落ちない

## Gate B: Security / Admin

- Supabase RLSが全管理対象テーブルで有効
- Admin writeは `requireAdmin()` + RLS の二重ガード
- 実AdminアカウントでCreate / Edit / Publish / ArchiveのE2E確認
- API key / service role keyをClientへ露出しない
- Security Advisorの重大項目0

## Gate C: Data quality

公開攻略データは以下を満たす。

- `status = published`
- `verification_status = verified`
- Sourceあり
- Patch依存データはvalid-from Patchあり
- 旧Patch情報を現行扱いしない
- Move公開時はCommand + Frame Dataを必須とする
- AI生成のみを根拠にframe / punish / true blockstring等を確定しない

## Gate D: Character encyclopedia

31プレイアブルキャラクターについて、公開開始時点の最低条件を次とする。

- 基本Characterレコードと公式Source
- Character Alias
- 主要Move / Command / Frameのverified投入
- 最低限の基本Combo
- 代表的なCounter / Training導線

全てを100%埋めるまで公開を止めるのではなく、未投入領域を明示し、誤情報を公開しないことを優先する。

## Gate E: Diagnosis

- 上達課題診断
- プレイスタイル診断
- キャラクター適性診断
- 総合簡易診断

各診断で質問数・選択肢数・結果表示・やり直し・検索導線を確認する。

キャラクター直接推薦は `character_trait_scores` のverified + publishedマッピングが十分に揃うまで解禁しない。

## Gate F: AI Coach

生成回答を有効化する前に以下を満たす。

- Current Patch取得
- Evidence取得
- Evidence Source表示
- verifiedデータ優先
- Evidence不足時に「情報不足」と返せる
- DBにない攻略知識を断定しない

初回リリースではEvidence表示のみでも可。生成回答は後から段階解禁する。

## Gate G: Deployment / UX

- Vercel Preview成功
- Supabase環境変数設定
- PCブラウザ確認
- iPhone幅確認
- ナビゲーション・検索・診断の実機確認
- 主要ページのmetadata / OGP / sitemap / robots確認
- 画像・動画の遅延読み込みとモバイル表示確認

## Gate H: Launch decision

正式公開前に `/admin/data-quality` を確認し、以下の3種類を明確に区別する。

1. 実装済み
2. データ投入済み
3. verified + published済み

「実装済み」を「コンテンツ完成」と扱わない。
