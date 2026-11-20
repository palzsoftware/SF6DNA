# 攻略データ一括処理ツール（strategy-bulk）

攻略候補CSV/JSONを一括で照合し、既存の公開ゲートとカード生成器（`scripts/generate-local-strategy-cards.py`）を通してローカル確認用カードを作る。既存カード・固定管理番号・公開ゲート・DBは変更しない。

## 構成

| ファイル | 役割 |
|---|---|
| `bulk_strategy.py` | 本体。読込→仮ID→既存照合→技ID→原文→Patch→条件→分類→下書き→カード生成→新規候補→計測 |
| `source_cache.py` | 出典URL単位の取得キャッシュ。1URL1回、同一ホスト3秒間隔、robots.txt遵守、許可3サイトのみ |
| `page_text.py` | HTMLから見出し階層付きの本文ブロックと手順列（リスト・本文中の矢印連結）を抽出 |
| `source_match.py` | 入力手順と原文手順列の照合（全手一致／部分／類似／本文一致／不一致） |
| `move_check.py` | 技マスター（`SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json`）との技ID照合と一意解決 |
| `apply_reviewed_cards.py` | 生成カードをローカルRCへ追記し、レビュー台帳と練習候補リンクを更新 |
| `link_training.py` | 練習候補（281件管理・有効275件）と攻略カードの接続台帳（仮ID一致・同手順一致） |
| `test_bulk_strategy.py` | 単体・結合テスト（オフライン） |

外部ライブラリは使わない（Python標準ライブラリのみ）。仮IDは `reconcile-strategy-intake.py` の `provisional_id()` を、既存カードとの手順重複は `generate-local-strategy-cards.py` の `route()` をそのまま使う。

## 分類

| 区分 | 条件 |
|---|---|
| 反映可能 READY | 品質A、全手順の技IDが技マスターと一致、原文で同じ手順列を全手確認、資料日が2026-08-03以降、重複なし、入力の公開・実機状態が未承認・未実施 |
| 追加確認必要 REVIEW | 根拠はあるが判断が必要（品質B、部分一致、技名の表記確認、単発技、手順なしの文章、10/13修正対象技、システム行動やPC表記が原文と異なる 等） |
| HOLD | 根拠不足（原文で手順が見つからない、技ID未特定・手順数不一致、取得失敗、人のHOLD判断が継続中） |
| 重複除外 DUPLICATE | 同一仮ID、既存カードと同手順、同一バッチ内の同手順・同条件、入力側でX（既存台帳重複） |

照合規則の要点（推測で確定しない）:

- 表記ゆれは全キャラ共通の記法のみ吸収する（`2弱P`=`しゃがみ弱P`、`Cラッシュ`=`キャンセルドライブラッシュ`、矢印コマンド→数字表記 等）。キャラ固有の別名は追加しない。
- 略称（`強リパ`）は、そのキャラの技マスター内で一つの技にだけ当てはまる場合に限り一致とする。強度未指定（`昇龍拳`）は解決しない。
- 技ID未特定（品質C「技ID未特定の手順あり」）の行は、全手順が技マスターで一意に決まる場合だけIDを補完し「A 自動再判定」とする。他のC理由は再判定しない。
- 以前のHOLDのうち `HOLD_SOURCE_REVIEW`（原文確認待ち）で、原文に同じ手順列が全手あるものだけを解消する。他のHOLD理由は維持する。

## 同一出典ページの新規候補の取込

`bulk_strategy.py` は入力行・既存カードに無い手順列を `NEW_PAGE_CANDIDATES.csv` に出し、取込条件を満たすものを
`PAGE_CANDIDATE_INTAKE_ROWS.csv`（入力行と同じ形式、品質「A 新規候補自動判定」）にする。次回の `--rows` に加えると、
通常の行と同じ原文照合・技ID・Patch・重複・生成器ゲートを通る。取込条件:

- 全手順が技マスターで一意解決（またはシステム行動）。表示は技マスターの公式名（出典の文言は写さない）
- 除外: 有利フレーム表・モダン操作・集計文（N本）・「各種/追撃/締め」等の総称、途中から始まる手順、文中で参照されているだけの手順、否定・注意文、移動のみ、コンボで締めがシステム行動、節・文の日付が2026年8月より前、同一URLの品質A行で資料日2026-08-03以降を確認できないページ、10/13修正対象技
- 条件欄: 出典の見出し、手前の括弧書き（状況）、位置、PC/CH、手順の注記
- `--span-audit` で出典の該当節をローカル専用ファイルに出し、抜き取り確認に使う（引継ぎ物には含めない）

## 別名辞書

`--aliases` に技マスター担当の別名確認CSVを渡すと、判定が `CONFIRM_CANDIDATE*` の行だけを使う（HOLD・除外は使わない）。
同キャラ内で衝突する別名は捨てる。別名で技IDが解決しても、品質C「技ID未特定」以外の理由が残る行はA判定にしない。

## 実行

```sh
python3 -I scripts/strategy-bulk/bulk_strategy.py \
  --rows <候補CSV/JSON ...> \
  --cards v2-web/src/lib/strategy-research-cards-20261118.json v2-web/src/data/ws5-local-reviewed-strategy-cards.json \
  --reviews <STRATEGY_SOURCE_REVIEWS.json> --registry <FIXED_STRATEGY_REGISTRY_PRIVATE.json> \
  --prior-status <過去の判定CSV（古い順）...> \
  --master v2-web/src/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json \
  --character-names v2-web/src/data/SF6DNA_WS5_LOCAL_CHARACTER_NAMES_20261026.json \
  --cache <ローカルキャッシュ> [--offline] --out <出力先>

python3 -I scripts/strategy-bulk/apply_reviewed_cards.py <出力先> \
  --cards-file v2-web/src/data/ws5-local-reviewed-strategy-cards.json \
  --reviews <STRATEGY_SOURCE_REVIEWS.json> --training-links <TRAINING_228_LINKS_PRIVATE.json> --out <引継ぎ先>

python3 -I scripts/strategy-bulk/test_bulk_strategy.py
```

同じ入力を再投入すると反映可能は0件になる（反映済みは既存カードとの重複に分類）。

## 出力

`BULK_RESULT_ROWS.csv/json`（行別の区分・理由・照合結果）、`BULK_METRICS.json`（工程別の処理時間と件数）、`BULK_REVIEW_DRAFTS.json`（反映可能のレビュー下書き）、`BULK_READY_BATCH.csv`（生成器入力）、`BULK_NEW_CARDS.json`（生成カード）、`NEW_PAGE_CANDIDATES.csv`（同一出典ページの未収録手順。全手順が技マスターで一意解決できたもののみ、全件HOLD）、`SOURCE_FETCH_LEDGER.csv`（URL・状態・SHA256・取得日時）。

## 出典サイトの扱い

- 出典本文はローカルキャッシュにのみ保存し、引継ぎ物には含めない（sf6-genten.com 利用規約「無断複製・再配布」禁止、sf6-lab.net 免責事項「無断転載・大量複製・自動収集による再配布」ご遠慮）。引継ぎ物は手順（技の並び）、技ID、短い見出し所在、URL、ハッシュのみ。
- acqua-souken.com の robots.txt はAI学習用クローラ（ClaudeBot等）を拒否している。本ツールは参照照合用の取得で、`*` 向けの許可範囲で動作する。
- 生成カードの説明文は「自動照合の下書き」と明記し、公開は未承認のまま。
