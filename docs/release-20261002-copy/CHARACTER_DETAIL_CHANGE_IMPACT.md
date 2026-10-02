# Character Detail Change Impact — 2026-10-02

| Component | Routes affected | Copy-only? | Layout? | Game fact? | Mobile retest? |
|---|---|---|---|---|---|
| CharacterGamePlan | JP専用＋既存31キャラ共通テンプレート（既存route条件） | NO | 要点＋native details | NO | JP/Ryuを中心に代表確認 |
| CharacterRangeGuide | 同上。既存rangesなしは空状態 | NO | 距離カード、2列→1列 | NO | JP/Ryu、長文を重点確認 |
| CharacterDetailPilot / JpCharacterDetail | /characters/[slug] | NO | 共通componentへ接続 | NO | JP/Ryu/Luke |
| Home | / | YES | NO | NO | 全面再確認不要 |
| Search | /search | YES | NO | NO | 既存検索回帰を再利用 |
| MyCharacterManager | /favorites /my-characters | YES | NO | NO | 保存操作の契約は不変 |
| PlayerDirectory / Player Detail | /players /players/[slug] | YES | NO | NO | フィルター契約は不変 |
| DailyTrainingPlanner | /me/training | YES | NO | NO | タスク生成・日付・保存は不変 |
| FAQ / Contact | /faq /contact | YES | NO | NO | 法的説明・フォーム契約は不変 |

## Representative static QA

JP/Ryuは既存専用profileのtitle/body/cautionとrange/actions/purpose/cautionが全てSSRに残ることを確認。Luke/Ken/Zangiefは現行adapterの攻略未掲載経路を使い、推測生成がないことを確認する。日本語長文とHTMLに見える入力の欠落・エスケープも確認。

既存のQuick Start 5-anchor / Daily15、Move Search / Category Filter / raw command、public boundary、媒体・関連資料の回帰テストを維持する。SSR/static PASSを実機PASSとは扱わない。

## User review: three pages only

最新PreviewでJP → Ryu → Lukeの順。文章の自然さ、最初に見える情報量、ポイントの開閉、距離カード、スマホ体感をまとめて見る。Ken/Zangiefを全ページ再試験する必要はなく、代表で異常が出た場合だけ追加する。

JP MP4のSA1/SA2入れ替わりとReal Auth/Saveは別Gate。本Batchの確認対象へ混ぜず、既知のRelease残件として維持。
