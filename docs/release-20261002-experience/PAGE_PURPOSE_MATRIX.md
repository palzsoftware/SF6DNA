# Page Purpose Matrix — 2026-10-02

Base: 6ae24476dfb8da2c2ed650fbf55462d1c1dc8030。⑥のVisual Refreshを継承。既存121サービス成果の「階層・段階表示・復帰導線・視覚走査」を再利用し、外部UI/asset/codeをコピーしない。

| Page | Primary purpose / first useful information | Primary CTA | Secondary CTA | Foldable / visualizable | Mobile priority |
|---|---|---|---|---|---|
| Home | 今日やることを決める / 05×3 | Daily15 | Diagnosis | 続きからrail・探索・動画spotlight・更新strip | Today→Continue→Explore→Watch→Update |
| Diagnosis | 自分の回答から傾向を知る | 次へ / 結果を見る | 戻る / Daily15 | 回答状況rail、selected/focus、優先項目 | 質問と選択肢を優先 |
| Character | 既存攻略を視覚的に読む | Quick Start / 技一覧 | Daily15 / Player / Video | 勝ち筋details+connector、距離別の定性的な線 | 長文は展開、技検索維持 |
| Player | 人物から関連動画へ | この選手の動画 | Character / 外部リンク | profile hero、人物名、関係リンク | 少ない情報でも推測で埋めない |
| Video | 動画から学ぶ | 外部再生 | 詳細 / 保存 / 視聴済み | thumbnail、関係pill、保存と視聴済みの別状態 | 1列、filter開閉維持 |
| Search | 素早く発見する | 検索 | 結果type / reset | 種別ごと線形、alias表示維持 | 検索Box・条件・0件回復 |
| Favorites | 保存したキャラへ戻る | Character detail | 動画一覧の既存favorite filter | return rail、キャラ一覧 | 端末保存を明記、動画保存一覧の新機能なし |
| History | 過去の診断概要を見る | 再診断 | 削除 | time/timeline | localStorage履歴、Account DB履歴ではない |
| Sources | 参照先を確認する | 外部source | 公開方針details | 落ち着いたreference rows | 出典の存在を検証済みと見せない |
| Changelog | 何が変わったか確認する | 既存更新を読む | 通常navigation | 既存日付/本文のtimeline | 新しい日付/area metadataを推測しない |

Header: 主要navigationを優先し、Theme/Appearanceをnative「表示設定」detailsへ収容。テーマ状態・保存・head初期化は変更なし。
Future backlogのみ: 最近見たキャラ、Saved Search、Daily15 persistence、Training Queue/History、専用Match検索、Random Match、Hit/Counter/Punish/Air media。未実装機能のbuttonを表示しない。
