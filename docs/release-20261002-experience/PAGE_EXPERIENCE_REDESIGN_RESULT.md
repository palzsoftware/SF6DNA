# Page Experience Redesign — 2026-10-02

BASE_SHA = 6ae24476dfb8da2c2ed650fbf55462d1c1dc8030
RELEASE_STATUS = NO-GO

## 実装

HomeのToday→Continue→Explore→Watch→Updateを既存routeのみで分離。Continueはborder rail、Exploreは検索＋方向選択、Watchは横長spotlight、更新はcompact strip。⑤のMediaや⑥Hero/DNA/05×3は維持。
Diagnosisは回答状態marker、診断名/質問位置、aria-pressedとselected反応、結果の最上位を強調。質問/option/scoring/recommendation/save/request_id/idempotency/結果本文を変更しない。
Characterは既存details connectorと定性的な距離線を強化。距離線に数値や技のreachを割り当てず、既存近/中/遠ラベルだけを使用。
Playerは人物heroと既存関連動画anchorを主導線に。Videoはthumbnail中心、関係pill、未保存/保存済みと未視聴/視聴済みを分離。既存filter/sort/preference/visibleと保存方式を維持。
Searchは既存type群を線形で区別し0件の条件/resetを追加。Favoritesはキャラ復帰と既存動画filterへの案内、Historyは端末履歴timeline、Sourcesは落ち着いた行と公開方針details、Changelogは既存timelineを継承。
Themeはnative表示設定detailsへ。新client state/通信/画像/外部dependencyを追加しない。semantic palette、CSS media query、reduced-motionを使用。body overflow隠蔽なし。

## 変更境界

GAME_FACT_CHANGE=0 / PUBLIC_BOUNDARY_CHANGE=0 / NEW_FEATURE=0。
DiagnosisRunner差分はJSXの進捗/ariaとResultList classのみ。計算・effects・save関数未変更。
release flags / data layer / source relations / DB / Media files・mapping・manifest / Production / main / sf6dna-v2 / Ver1.1の変更なし。
React Best Practices review: 既存effects/初期state維持、fetch追加なし、保存ロジック変更なし、native disclosure、focus/aria、paletteとreduced-motionを確認。

## QA

既存character-ux対象6 PASS。Full tests401 PASS / 0FAIL（最初の1FAILは動画説明の既存文言契約に戻して解消）。Release gates14 PASS。lint/typecheck/build/diffは最終出力を完了報告で記録。
Build生成next-env/tsconfigの差分を確認し、今回の実装とは無関係なため元の2ファイル内容だけを復元する。無条件restoreはしない。
Browser/Previewの最終SHAと検証結果は完了報告を正本とする。375px実測や実機結果が取れない場合、source/SSRをDEVICE_PASSに昇格しない。

## Device handoff

全ページ/31キャラのユーザー確認を要求しない。最終PreviewでHome→Diagnosis→JP→代表Player→Videoの1session。Character共通表示はJP＋Ryu/Lukeの2〜3ページ。
見る点は第一印象、単調さ、文章の自然さ、初心者の分かりやすさ、fold/tap、スマホの密度。JP SA1/SA2 name/poster/playbackの再確認は⑤P1として別記録。Account Save受入は別機能QA、History reloadだけではDB保存PASSにしない。
Static route/build/既存境界testをユーザーへ重複依頼しない。各結果PASS/FAIL/BLOCKED/NOT_RUN、SHA/Deployment/Device/Themeを記録。
NewP0/P1は実施確認範囲での観測として報告し、未検証範囲を無事故とは断定しない。Productionは変更しない。
