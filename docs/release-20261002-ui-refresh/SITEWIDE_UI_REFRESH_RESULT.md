# Sitewide UI Refresh Result — 2026-10-02

BASE_SHA = `edc01e2f33fd815907d3e6aa60587933d6ed4956`
BASE_TREE = `78eb6a4257c615ee7174e8c25ca379647d0c45f3`
CODE_SHA = `c6054662f5258ba22a3e4c3c59b7f6b55d5fec61`
RELEASE_STATUS = NO-GO / USER_REVIEW_PENDING

## 実装

- Home: 非対称Hero、既存Character image layer、CSSのDNAノード・線・grid、15分練習spotlight、05×3、続きから→探索→更新。
- 共通: semantic palette、見出しのaccent strip、余白・文字の階層、用途による角丸、empty stateの回復表示、hover/tap反応。
- キャラ一覧: 既存画像を活かした背景・hover、短い本文・nameplate、カード形状とCTAの階層。
- Character Detail: 既存detailsを維持したstep connector、距離カードの抽象図、section header、Move categoryの操作域、関連Playerのカード形状。
- Search: 検索Boxを主役にし、結果のgroup/hoverを強調。既存query/type/filter/suggestion/resetを維持。
- Players: 既存initial/imageをprofileとして見せる形状と反応。実績・プレイスタイルの推測追加なし。
- Video / Favorites / Diagnosis / Daily15 / About / FAQ / Auth / Legal: 共通surface・type・CTA・empty-stateの調整を適用。各ロジックと保存先の説明を維持。
- Changelog: 既存日付・見出し・本文をtimelineとtime要素へ。新しいupdate metadataやゲームPatch情報は作らない。

## ファイル

Home / shared: `v2-web/src/app/page.tsx`、`layout.tsx`、`training-lab-refresh.css`。
Character: `character-game-guide.tsx`、`character-game-guide.module.css`、`character-detail-pilot.module.css`（`v2-web/src/components/`）。
Sitewide specific: `v2-web/src/app/search/search.module.css`、`players/players.module.css`、`changelog/page.tsx`。
Test: `v2-web/tests/character-ux.test.mjs`。

コード差分10ファイル。文書は本directoryの4件。外部library・外部asset追加0。JP public media、poster、manifest、mapping変更0。診断・Auth・DB・RLS・RPC・gameplay fact・公開status・verification status変更0。publicStrategyContent / aiCoach / trainingの公開境界を維持。

## 検証

- targeted character-ux: 6 PASS。Home primary CTA、05×3、探索→更新順、既存routes/mobile dock、Quick Start、move検索・解除、動画filterの実handlerを確認。
- full tests: 401 PASS / 0 FAIL。件数固定ではなく今回実測。
- release-gates: 14 PASS / 0 FAIL。
- typecheck / lint / build / diff-check: PASS。
- 最初のbuildは依存ディレクトリのworktree外symlinkをTurbopackが拒否。依存のローカル配置だけ修正し再実行でPASS。package/lockfile/config変更なし。
- Nextによるnext-env.d.ts・tsconfig.jsonの自動生成差分を確認し、明示した2ファイルだけ元に戻した。
- 初回CLI pushは認証不足で未反映。GitHub connectorのtree/commitで反映し、tree SHAをローカル検証済みtreeと照合。force=false。

Browser結果は下記Preview verification追記に記録する。ソース契約によるMobile/reduced-motion確認を実viewport・実機PASSとは呼ばない。

## 残事項

Homeの好み、JP/Ryu/Lukeの読みやすさはユーザー目視待ち。Auth/Device等の未完了Release判断を自動GOへ昇格しない。新規P0/P1はコード確認・テストの範囲で発見0、実機未確認を不存在の証明にしない。

## Preview verification（code RC）

Deployment: `dpl_FXH1bm85zboZXw7XM2WWSxshtygx`。URL: https://sf-6-amh8lq7p0-somas11620-9368.vercel.app/ 。READY / branch一致 / Exact SHA `c6054662f5258ba22a3e4c3c59b7f6b55d5fec61`一致。保護されたPreviewは接続済みVercelの一時アクセスで確認し、保護設定は変更しない。認証用URLを文書へ保存しない。

Cloud Browser viewport 1363pxでHome＋代表12ページ（Characters、JP、Ryu、Luke、Search、Players、Videos、Favorites、Diagnosis、Daily15、Sources、Changelog）のh1描画完了とdocument幅を確認。すべてscrollWidth <= viewport。13ページのpage-wide横overflow発見0。全機能のinteraction完全監査ではない。

Home Dark/Lightのスクリーンショット目視、Primary CTA→Daily15表示、JPのnative detailsクリック開閉・Enter開閉、0件検索→JP再検索を確認。確認範囲のSF6DNA originのconsole error発見0。拡張機能のmetadata警告と先行VercelログインのGoogle One Tap警告はアプリ不具合と区別。

MOBILE_STATIC_QA = source/既存testsの契約確認済み（1列、140px画像域、44px操作域、minmax）。375/390/430/320の実viewport・実機は未確認。Cloud Browserにviewport変更APIがなく、ローカルbrowser取得は証明書／ダウンロード経路で失敗。Desktopを見てMobile PASSとは判定しない。
DARK_LIGHT_QA = Home desktop目視確認済み。他全画面・全paletteのcontrast完全監査ではない。
REDUCED_MOTION = CSS契約確認済み。reduced-motion実viewportの動作検証は未確認。
HOME_PLAYFULNESS = 独自DNA・非対称階層・反応を実装。ユーザーの主観評価待ち。

Remoteコードcommitは`2085ad0a940627fcd8c2554e8429700d1dfe1491`（Home）と`c6054662f5258ba22a3e4c3c59b7f6b55d5fec61`（共通・詳細）。文書commitはこの記録の後に追加し、コード変更なしで最終DeploymentのREADY/SHAを照合する。
