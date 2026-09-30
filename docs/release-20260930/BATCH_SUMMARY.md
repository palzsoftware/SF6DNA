# Release Closure Batch — 2026-09-30

基準RC def0ab77。Production/main/sf6dna-v2/Ver1.1/DB/dependency変更なし。RCへの統合対象は本Batchの明示ファイルのみ。Previewは統合後1件。

## 実装

- バグ修正: 完了済み診断の保存成功後もrequest identityを保持。再読込・応答消失後のretryで同一保存を再利用。resetと回答変更は別試行。実RPC定義の読み取りと実コンポーネントの模擬保存で修正前3ケースの重複を再現、修正後8動作ケースPASS。実DB保存は未実行。
- 新機能基盤: lossless Combo tokenizerとsemantic tokens、独自text-backedアイコンrenderer、原表記保持、Luke/JP/Ken各5件Pilot。DI不明状態・曖昧な文字・数字は強制変換しない。ClassicからModernを推測しない。
- 調査/準備: Standard Assistant純粋メッセージエンジン、10動作テスト。公開Bubble・layout・localStorage・外部APIは未導入。UI/実機/アクセシビリティ条件未証明のため公開投入MOVE_TO_VER1_1。残り5Personaも延期。
- 調査: Source30件、8unique動画URL。全件NEEDS_REVIEW。publisher未設定・candidate関連付け。採用済みとは判定せず、削除・公開絞り込み・DB更新は未実施。SOURCE_30_REVIEW.jsonに指定10項目を記録。

## 検証

FULL_TESTS=355 PASS、RELEASE_GATES=14 PASS、TYPECHECK/LINT/BUILD=PASS。通常buildの子プロセス出力制約は実行環境の切替で解消。自動生成されたtsconfig/next-env変更は統合に含めない。

Combo15レシピ+synthetic列挙を独立React SSR・実CSSで375px測定。Dark/LightともscrollWidth375、overflow0、pageErrors0、aria-label欠落0。アプリPreview、実機、コンボ成立のPASSとは区別する。

既存86URL/31キャラ監査を再実行しない。共有変更はPilot IDに限定。Character詳細の原レシピprop経路と診断runnerのみ影響範囲QA対象。QA_REUSE_MATRIX.jsonに32公開候補パターンの既存証跡・影響範囲を記録。

## 残件/承認

- requireAdmin適用はWAITING_FOR_USER_APPROVAL。内部確認ページ匿名閲覧は既存状態のまま。適用案はinternal/character-preview/[slug]/page.tsx冒頭で既存requireAdminを呼ぶ。DB/role変更なし。
- AUTH_SAVE=REAL_PENDING、DEVICE_QA=PENDING。週末2026-10-03〜04の手順はWEEKEND_DEVICE_QA.md。
- Combo通常公開は既存publicStrategyContent=false。既存Device Previewへの到達、成立確認・曖昧入力解決、共通展開は未完了。Flag変更で公開範囲を広げない。
- SOURCE_POLICY=REVIEW_REQUIRED30。8URL単位で投稿者/タイトル/パッチ適合/採用関係を確認し、DB変更とは分けて承認対象の具体案を作る。
- P0新規確認=0。P1未閉鎖は内部保護/実認証保存/実機QA/Source公開方針/Combo必要範囲の5カテゴリ。P2残件は既存Polish等未閉鎖。Assistantは延期済みでGO必須外。
- STATUS=NO-GO。目安%は今回の確認から再推定せず、利用者提示95/88/97/25/88/90を据置。完了matrixとP1を優先。

次作業は変更箇所のPreview確認、未解決入力/Sourceの具体確認キュー、承認後の内部guard、週末実機QA。本番反映は別承認。
