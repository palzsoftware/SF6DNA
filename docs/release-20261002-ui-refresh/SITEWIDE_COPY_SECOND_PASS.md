# Public Copy Second Pass — 2026-10-02

前Batchの39群のうち、未変更19群を再確認。変更数を目的にせず、操作先・保存先・公開境界が分かる表現を維持した。攻略本文・数値・質問・採点・診断結果contract・法的条件は変更しない。

## 残19群の判定

以下は前Batchの項目名と現行文言を再利用した照合表。19/19をKEEP。最後の未変更は今回の判定も同じ。アカウント保存の成功やDB実行確認を意味しない。

| Route | Component | Current copy / structure | Reason | Classification | Decision | Gameplay change | Change needed | Changed |
|---|---|---|---|---|---|---|---|---|
| / | Home CTA | 今日の15分練習を始める／診断する | 具体的な行動と遷移先 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /characters/[slug] | Quick Start | 特徴を知る／技を確認する／今日の15分練習を決める | 行動と移動先が明確 | NATURAL | 5-anchorとDaily15を維持 | NO | NOT_NEEDED | NO |
| /characters/[slug] | Move Explorer | 技名・コマンドを検索／絞り込みを解除 | 用途と復帰操作が明確 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /characters/[slug] | Source presentation helper | 公式技表を見る／公式フレームデータを見る／記事を読む | リンク先ごとに区別済み | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /diagnosis | Diagnosis index | 知りたいことに合わせて、短い診断を選べます。 | 用途が明確 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /diagnosis/[slug] | Diagnosis Runner | 次へ／結果を見る／最初からやり直す | 操作が明確 | NATURAL | 質問・採点・結果文契約ごと維持 | NO | NOT_NEEDED | NO |
| /diagnosis/[slug] | Result / Save Notice | 今日の練習を決める／診断結果をアカウントへ保存しました。 | 導線と保存対象を明示 | NATURAL | 維持。アカウント保存成功を新たに証明したものではない | NO | NOT_NEEDED | NO |
| /diagnosis/history | History | このブラウザ内に最大50件保存します。 | 端末内保存を明示 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /me/training | Daily disclaimer | 練習の完了状態は保存されず、ページを開き直すと消えます。 | 保存範囲の説明に必要 | NATURAL | 維持。日付・課題生成も変更なし | NO | NOT_NEEDED | NO |
| /search | Search recovery | 一致する情報が見つかりません／別の言葉で検索 | 次の操作が明確 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /players/[slug] | Player links | プロフィール／使用キャラクター／SNS・外部リンク | 資料の種類が分かる | NATURAL | 維持。実績や紹介本文は変更なし | NO | NOT_NEEDED | NO |
| /videos | VideoLibrary | 絞り込み／すべて解除／新しい順／視聴済み | 操作と状態を区別 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /videos/[slug] | VideoCard | YouTubeで再生／お気に入りに追加／視聴済みにする | 遷移と端末内操作が明確 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /sources | Sources | 情報源／公式情報・一次情報／外部リンク | 参照と確認方針を区別 | NATURAL | 維持。Source30や公開状態は変更しない | NO | NOT_NEEDED | NO |
| /changelog | Changelog | 主要な機能追加・品質改善 | 履歴の説明。過去記録は保存 | NATURAL | 維持。過去記事を書き換えない | NO | NOT_NEEDED | NO |
| /about | About | 今日の練習につなげるサイトです。 | 目的が具体的 | NATURAL | 維持 | NO | NOT_NEEDED | NO |
| /auth | Auth | お気に入りやランク記録は、この端末のブラウザに保存 | 保存先の説明に必要 | NATURAL | 維持。認証開始なし | NO | NOT_NEEDED | NO |
| /privacy /terms /disclaimer | Legal pages | 取り扱いについて定めます／責任を負わないものとします | 規約文では必要な文体 | NATURAL | 本文・条件・保存期間を維持 | NO | NOT_NEEDED | NO |
| /error /404 | Error / NotFound | 画面を表示できませんでした／再試行／トップへ戻る | 異常と次の操作を区別 | NATURAL | 維持 | NO | NOT_NEEDED | NO |

## Homeの追加編集: 7文言群

| 群 | Before | After / 判断 |
|---|---|---|
| Hero label | STREET FIGHTER 6 / PLAYER TOOLKIT | SF6DNA / TRAINING LAB。独自ブランドの役割を短く示す |
| Hero本文 | 必要なキャラクター情報や動画も、そのまま探せます。 | キャラクターの技や動画も、ここから。 |
| 今日やること | 迷ったら、ここから1つ選べば始められます。 | まずは15分。課題が曖昧なら診断から。 |
| 練習カード案内 | TRAIN／今日の15分練習 → | TODAY’S TRAINING／練習メニューを見る。05×3の読上げ説明を追加 |
| 検索例 | JP / 翔 / SA2 | JP / 翔。技検索まで含むように見える例を除く |
| 続きから本文 | 保存したものや、自分用の情報へすぐ戻れます。 | お気に入り、マイキャラ、前の診断へ。 |
| ナビ末尾 | 各説明文＋矢印 | 説明文を保持し、矢印の反復を削減 |

PUBLIC_COPY_REVIEWED = 26文言群（残19＋Home7）。PUBLIC_COPY_CHANGED = 7文言群。前Batchの20群変更を今回の変更へ再計上しない。

初心者: 技情報と今日の練習への入口を維持。中級者: Move Searchとカテゴリを維持。初回: Primary/Secondaryを整理。再訪: Favorites・My Character・診断履歴を明示。

未変更のSourceリンク用途・reviewed/verifiedの意味・Daily15の保存されない説明を残す。Legalは規約として必要な文体を保持。内部データ名や実装用語を新たに公開しない。
