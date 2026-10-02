# Public Copy / Character Readability Audit — 2026-10-02

BASE_SHA: `e180442b2e5e0070aeb7f44a78b3969eb8139887`。

## Scope and method

20指定Public surface＋共通の履歴・エラー表示を、routeと描画componentの文脈で読んだ。表の件数はレビューした**文言群**であり全文字列の個数ではない。DB本文、ゲーム性能、数値、入力、Source relation、verified/published状態は変更しない。法的条件の意味変更もない。

JPとRyuは既存の専用profile、Luke/Ken/Zangief等は既存adapterを使う。同じUIを2つのテンプレートから共通化し、空の攻略を生成しない。初期表示では各既存titleだけが見え、native detailsを開くと元のbody/cautionを読める。距離別は元の4フィールドをカードへ再配置する。色だけに意味を持たせず、native marker、番号、見出し、枠を併用。アニメーションなし。キーボードと開閉状態はnative disclosure、focus-visibleあり。

## Reused research

以下の2026-10-01成果物を読み、必要箇所を再利用した。新規Web比較調査なし。大規模matrixはmetadata・代表行、adoption matrixと2つの説明reportは設計判断を参照。全121サービスを再監査したとの主張ではない。

- SF6DNA_100_SITE_BENCHMARK_MATRIX_20261001.csv / .json
- SF6DNA_100_SITE_FEATURE_ADOPTION_MATRIX_20261001.csv
- SF6DNA_CROSS_INDUSTRY_UX_ADOPTION_REPORT_20261001.md
- SF6DNA_COMPETITIVE_STRENGTH_MATRIX_20261001.md
- SF6DNA_TOP20_UX_CHANGES_AFTER_100_SITE_REVIEW.md

採用した抽象パターンは要約→詳細、情報階層、視覚的グルーピング、行き止まりからの復帰。文章・CSS・HTML・配置・アイコン・画像・コード・表・独自データのコピーなし。保存検索やTraining Queue等は追加しない。

## Audit

| Route | Component | Current copy / structure | Problem | Classification | Suggested copy / structure | Gameplay fact changed? | Safe to implement? | Implemented? |
|---|---|---|---|---|---|---|---|---|
| / | Home | リリース前の主な改善を3件だけ表示しています。 | 制作側の件数説明 | DEVELOPER_FACING | 最近の改善を紹介します。 | NO | YES | YES |
| / | Home updates | 認証エラー経路の回帰確認を追加しました。 | 実装用語 | TOO_TECHNICAL | ログイン時のエラー表示を見直しました。 | NO | YES | YES |
| / | Home CTA | 今日の15分練習を始める／診断する | 具体的な行動と遷移先 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /characters | Characters empty | 公開データはまだありません | DBの表現 | DB_LIKE | キャラクター情報はまだ掲載していません | NO | YES | YES |
| /characters | Characters no result | 名前を短くして再検索するか、一覧に戻って選択してください。 | 長い指示 | UNNECESSARILY_FORMAL | 名前を短くして検索するか、一覧から探せます。 | NO | YES | YES |
| /characters/[slug] | Both detail templates | 基本の勝ち筋 | 長文を読む目的がつかみにくい | SLIGHTLY_MECHANICAL | 試合の組み立て方 | NO | YES | YES |
| /characters/[slug] | Shared game plan | 手順1／手順2＋常時表示の全文 | 画面を縦に圧迫 | TOO_LONG | 既存の短い見出し＋閉じたdetails。本文・注意点を保持 | NO | YES | YES |
| /characters/[slug] | Shared range guide | 目的／主に使う技／注意点の横長な文章表 | 情報の階層が弱い | UNCLEAR | 距離ごとのカード：狙い／主に使う技／気をつけること | NO | YES | YES |
| /characters/[slug] | Pilot section introduction | 使う技、得意な距離、注意点を順に紹介します。 | 全文表示を前提にした紹介 | SLIGHTLY_MECHANICAL | 要点から読み、詳しい説明は必要なときに開けます。 | NO | YES | YES |
| /characters/[slug] | Pilot accessible name | Character Detail V2.2 | 内部バージョン | DEVELOPER_FACING | キャラクター情報 | NO | YES | YES |
| /characters/[slug] | Quick Start | 特徴を知る／技を確認する／今日の15分練習を決める | 行動と移動先が明確 | NATURAL | 5-anchorとDaily15を維持 | NO | NOT_NEEDED | NO |
| /characters/[slug] | Move Explorer | 技名・コマンドを検索／絞り込みを解除 | 用途と復帰操作が明確 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /characters/[slug] | Source presentation helper | 公式技表を見る／公式フレームデータを見る／記事を読む | リンク先ごとに区別済み | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /diagnosis | Diagnosis index | 知りたいことに合わせて、短い診断を選べます。 | 用途が明確 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /diagnosis/[slug] | Diagnosis Runner | 次へ／結果を見る／最初からやり直す | 操作が明確 | NATURAL | 質問・採点・結果文契約ごと維持 | NO | NOT_NEEDED | NO |
| /diagnosis/[slug] | Result / Save Notice | 今日の練習を決める／診断結果をアカウントへ保存しました。 | 導線と保存対象を明示 | NATURAL | 維持。アカウント保存成功を新たに証明したものではない | NO | NOT_NEEDED | NO |
| /diagnosis/history | History | このブラウザ内に最大50件保存します。 | 端末内保存を明示 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /me/training | DailyTrainingPlanner | このトレーニングを完了にする | 周囲の練習表記と不統一 | MIXED_TERMINOLOGY | この練習を完了にする | NO | YES | YES |
| /me/training | Daily disclaimer | 練習の完了状態は保存されず、ページを開き直すと消えます。 | 保存範囲の説明に必要 | NATURAL | 維持。日付・課題生成も変更なし | NO | NOT_NEEDED | NO |
| /search | Search start | 目的から開く／入口を選んでください。 | 目的と操作が抽象的 | UNCLEAR | 探したい情報を選ぶ／一覧からも探せます。 | NO | YES | YES |
| /search | Suggestion type | character／player／video／tournament | データ種別をそのまま表示 | DB_LIKE | 既存の日本語TYPE_LABELSで表示 | NO | YES | YES |
| /search | Search recovery | 一致する情報が見つかりません／別の言葉で検索 | 次の操作が明確 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /players | PlayerDirectory clear | 検索をクリア／条件をすべてクリア | 同じ操作の異なる呼び名 | MIXED_TERMINOLOGY | 絞り込みを解除 | NO | YES | YES |
| /players | PlayerDirectory empty | 検索語またはフィルターを変更してください。 | 指示的 | UNNECESSARILY_FORMAL | 名前や絞り込み条件を変えて探せます。 | NO | YES | YES |
| /players/[slug] | Related video empty | このプレイヤーに紐づく公開動画はまだありません。 | relationを表す内部用語 | DEVELOPER_FACING | このプレイヤーの関連動画はまだ掲載していません。 | NO | YES | YES |
| /players/[slug] | Player links | プロフィール／使用キャラクター／SNS・外部リンク | 資料の種類が分かる | NATURAL | 維持。実績や紹介本文は変更なし | NO | NOT_NEEDED | NO |
| /videos | VideoLibrary | 絞り込み／すべて解除／新しい順／視聴済み | 操作と状態を区別 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /videos/[slug] | VideoCard | YouTubeで再生／お気に入りに追加／視聴済みにする | 遷移と端末内操作が明確 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /favorites /my-characters | MyCharacterManager loading | 保存データを読み込んでいます。 | 対象が抽象的 | DB_LIKE | お気に入りとマイキャラを読み込んでいます。 | NO | YES | YES |
| /favorites | MyCharacterManager empty | キャラクター詳細またはマイキャラ管理から登録できます。 | 具体的な操作が分からない | UNCLEAR | キャラクターページの☆から追加できます。マイキャラからも選べます。 | NO | YES | YES |
| /my-characters | MyCharacterManager no characters | 公開データの準備後に利用できます。 | 制作側の状態説明 | DB_LIKE | キャラクター情報が掲載されると、ここから選べます。 | NO | YES | YES |
| /sources | Sources | 情報源／公式情報・一次情報／外部リンク | 参照と確認方針を区別 | NATURAL | 維持。Source30や公開状態は変更しない | NO | NOT_NEEDED | NO |
| /changelog | Changelog | 主要な機能追加・品質改善 | 履歴の説明。過去記録は保存 | NATURAL | 維持。過去記事を書き換えない | NO | NOT_NEEDED | NO |
| /faq | FAQ control names | Modern操作／Classic操作 | 他のUIは日本語表記 | MIXED_TERMINOLOGY | モダン操作／クラシック操作 | NO | YES | YES |
| /about | About | 今日の練習につなげるサイトです。 | 目的が具体的 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /contact | Contact heading | サイト内お問い合わせフォーム | サイト内が冗長 | TOO_REPETITIVE | お問い合わせフォーム | NO | YES | YES |
| /auth | Auth | お気に入りやランク記録は、この端末のブラウザに保存 | 保存先の説明に必要 | NATURAL | 維持。認証開始なし | NO | NOT_NEEDED | NO |
| /privacy /terms /disclaimer | Legal pages | 取り扱いについて定めます／責任を負わないものとします | 規約文では必要な文体 | NATURAL | 本文・条件・保存期間を維持 | NO | NOT_NEEDED | NO |
| /error /404 | Error / NotFound | 画面を表示できませんでした／再試行／トップへ戻る | 異常と次の操作を区別 | NATURAL | 維持 | NO | NOT_NEEDED | NO |

PUBLIC_COPY_ITEMS_REVIEWED = 39 文言群
PUBLIC_COPY_ITEMS_CHANGED = 20 文言群（個別の文字列置換数とは異なる）

## Evidence separation / remaining blockers

- User evidence on base RC: JP page-wide overflow NOT_REPRODUCED/PASS、Quick Start→Daily15 PASS。今回変更後の実機PASSには転用しない。
- User evidence: JP SA1/SA2は技名とposterが正しい一方、再生MP4が相互に入れ替わる。既知の別P1。今回media asset / manifest / bindingは変更しない。
- Real Auth/Save/DB persistenceは未確認。local diagnosis historyとは別。
- Source30承認待ち、DB_APPLIED=0。Internal Guard承認待ち、APPLIED=NO。
- publicStrategyContent=false、aiCoach=false、training=falseの境界は維持。新機能・新依存・DB/Production変更なし。
- RELEASE_STATUS=NO-GO。未確認をPASSへ昇格しない。

## Verification

- Full tests: 398 PASS / 0 FAIL（追加6件）。Release Gates: 14 PASS。
- typecheck / lint / build / git diff --check: PASS。
- Build-generated next-env.d.tsとtsconfig.jsonの差分を確認。Next生成import、JSX設定、dev type include、整形のみのため本Batchへ含めず、変更前の内容を維持した。維持後typecheck PASS。
- 代表5キャラのSSR回帰PASS。JP/Ryuは元profileを実際に描画。Luke/Ken/Zangiefは現行adapterによる未掲載profileを描画。実際のDB全件や実端末はこのテストの証拠範囲に含まれない。
- Quick Start 5-anchor/Daily15、Move Search/filter/原文コマンド、Public Boundaryの既存回帰PASS。
- Browser QAは公開後の最新Previewで確認し、最終報告へ記載する。375pxを指定できない環境では未測定のまま扱う。
- SSRは実機・375px DOM・日本語体感の証明ではない。新P0/P1はStatic範囲で0 observed。JP MP4は既知P1のまま別作業。
