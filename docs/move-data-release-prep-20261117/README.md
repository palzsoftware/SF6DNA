# 技データ 製品反映準備・データ修正（2026-11-17 第3回）

- 基準: `sf6dna-v2-chatgpt-rc-20260916` @ `014aa4bb3448c6cb9f2d6a8a2694ce51376bb7e6`（リモートの更新なし）／作業ブランチ `claude/move-data-quality-20261117`
- 第1回 `docs/move-data-quality-20261117/` と第2回 `docs/move-data-fix-20261117/` は**未変更**（第2回SQLのSHA-256は `SQL_CANDIDATES_MANIFEST.csv` に記録）
- **Commit・Push・PR・DB書込・Deployは未実施。** SQLはローカルのPGlite（使い捨てPostgreSQL）でのみ検証済み

## 提出物
| ファイル | 内容 |
|---|---|
| `SF6DNA_MOVE_DATA_R1_R3.patch` | 第1〜3回の全変更（基準SHAに `git apply` で適用可能なことを確認済み） |
| `CHANGED_FILES.txt` | 変更ファイル一覧（A=追加 / M=変更） |
| `SQL_CANDIDATES_MANIFEST.csv` | SQL候補の一覧（種別・承認状態・検証結果・SHA-256） |
| `sql/frame_concat_live_readonly_select.sql` | ブランカ・本田31件の**実DB照合用SELECT**（read only・最後にrollback） |
| `sql/elena_jhk_active_0[1-4]_*.sql` | エレナ表記破損1件のSQL候補（新規） |
| `arjun/` | 77行の管理台帳・精査フラグ・技カード下書き・GIF担当向けID対応表 |
| `p1/` | 対応付け誤り疑い・実数値相違の判断表、表記差26件のDB更新なし一覧、0プレースホルダの要確認表 |

## P0 ディージェイ
- 製品slug `dee-jay` 用の候補を `src/data/SF6DNA_WS5_APP_SLUG_PREVIEW_BUNDLES_R3_REGEN_20261117.json` として**再生成**（`scripts/build-ws5-alias-candidates.mjs`。`--check` で差分検査可能）。R3原本・公式TXT・名称・メディア登録の各JSONは未変更。
- `official-txt-preview-snapshot.ts`: R3に存在しないslugのときだけ再生成データを返す（R3の32キー全件で返り値が変わらないことをテストで確認）。
- `canonical-txt-connection.mjs`: `dee-jay:web:N` の識別子を、公式TXTの `deejay:web:N` レコードとして解決。**page.tsxは未変更**。
- 回帰確認: 別名のない28キャラはHEAD時点のコネクタと出力が完全一致。残り4キャラ（アルジュン・C.ヴァイパー・テリー・ヤスミン）の差分は、第2回で意図したN/A正規化13箇所のみ。
- 結果（page.tsxと同じ接続経路、実メディア登録あり）: **既存97技にマージ・9技を追加・合計106技、ID・slug・技名の重複0**。ローカル開発以外では接続無効のまま。
- 未登録1技・システム8行の表示: 203 スライディングヒールアッパー → 「特殊技」グループ（webId区分2xx）。602〜609 のドライブ系・パリィ系 → 既存ロジックで「必殺技」グループ（他31キャラの共通システム行と同じ扱い）。専用の「システム」グループはUI変更になるため提案のみ。
- GIF担当への引き継ぎ: メディアキー登録は `deejay` キーのみのため、`dee-jay` ではメディア紐付けがHOLD（エラーにはならない）。登録側での `dee-jay` 対応が必要。

## P0 アルジュン
- 77行すべてを `arjun/ARJUN_77_MANAGEMENT_LEDGER.json` で管理（全コマンド・フレーム・注記・補正・キャンセル・属性、表示方針、精査フラグ）。
- 精査結果: **登録62／統合1／登録しない14**
  - **201「踏み潰す」**は111「しゃがみ強K（踏み潰す）」と技術名 `(2HK)` もフレームも同一で、Classic欄が空・Modern（3+強）のみ → 111のModern入力として統合（111側のModernは「公式未掲載」）。第2回の取込候補（63件）は保護のため変更せず、台帳とカード下書きで反映。
  - 要確認フラグ: 206「追跡」はフレーム全空欄・ダメージ0／309・311は自動派生で入力なし／330・331・500・501は掴み技のためガード値なし（候補）／401は漢字の不一致（鎚/槌）／205は `ー` 表記。
- 除外14行の表示方針: システム10行 → 他キャラと同じくローカル候補カード（必殺技グループ）でDB登録対象外。飛び道具の分離4行 → 単独カードにせず、発射元の技カードに補足（`officialSupplementaryRows`）として付与（316→313〜315、321→318〜320、325→322〜324、329→326〜328）。
- 技カード下書き `arjun/ARJUN_CARD_DRAFT_BUNDLE.json`: 既存の技カード形式で72枚（登録62＋システム10）。値は公式TXTのまま、状態は `draft` / `candidate_only`。**既存の `CharacterUnifiedPage` でSSR描画でき、アンカーの重複がないことをテストで確認**。どのページにも未接続で、公開ゲートは維持。
- GIF担当向け `arjun/ARJUN_MOVE_ID_TABLE_FOR_MEDIA.csv`: 77行。現在のプレビュー技ID・slugと既存メディアキー登録が**77/77一致**。DB登録用のslug候補とRCプレビューIDを併記し、正式なDB UUIDは空欄（登録時に採番。メディアキーは `sourceRecordKey` 基準で維持される）。

## P0 データ修正
| 対象 | 状態 |
|---|---|
| ブランカ・本田31件 | **実DB照合用SELECTを提出**（frame ID照合に加え、slug経由の現行フレーム件数・技の公開状態・検証状態・公式出典件数を確認）。PGliteで31 READY、read only下での更新拒否を確認 |
| キャミィSA2 2件 | 公式確認待ちを維持（第2回SQL、確認フラグがないと適用されない） |
| 舞 3段目 1件 | 公式確認待ちを維持（同上） |
| エレナ ジャンプ強K 1件（新規） | `10-20 / 10-11,13-20` → `10-11,13-20`。DB自身の後半部分を使うため確認フラグ不要。DB書込承認待ち |

## P1 数値不一致
`p1/P1_MAPPING_AND_NUMERIC_DECISIONS.csv`（31行＝対応付け誤り疑い15行（5技）＋実数値相違16行）

| 判断 | 行数 | 内容 |
|---|---:|---|
| CONFIRMED_DB_ERROR | 5 | 舞 3段目（SQL候補済み） |
| CONFIRMED_DB_NOTATION_ERROR | 1 | エレナ（SQL候補作成） |
| WS5_IDENTITY_MAPPING_ERROR | 1 | リュウ不破三連撃: DBのTC全体の行を、R3候補がTXTの2段目に対応付けている → WS5担当で対応付けを解除 |
| ROW_GRANULARITY | 6 | ルークODフラッシュナックル（1・2段目を1行）、テリー パワーダンク（3パートを1行） → DB更新なし |
| PATCH_OR_SOURCE_DIFFERENCE / PATCH_CHECK_REQUIRED | 14 | ケンOD空中竜巻、龍尾脚・竜巻のダメージ、SA2硬直、ジュリ風破刃・暗剣殺など → 現行公式値の確認待ち |
| DIFFERENT_BASIS | 3 | ジュリ天穿輪の硬直（DBは全体、TXTは着地後） → 比較不能のためDB更新なし |
| DB_PLACEHOLDER_AND_STARTUP_DIFF | 1 | A.K.I.紫泡泉 → `p1/ZERO_PLACEHOLDER_REVIEW.csv` で確認 |

- 表記差26件は `p1/P3_NOTATION_ONLY_NO_DB_UPDATE.csv` に**DB更新なし**として明記。
- 持続・硬直などが `0` の技10件（スタンス・移動・設置系）は「該当なし」の意図の可能性があるため、要確認のみ（DB更新なし）。

## 検証結果
| 項目 | 結果 |
|---|---|
| Typecheck | PASS |
| Lint | PASS |
| Test | 949件中 PASS 936 / FAIL 0 / SKIP 13（SKIPはすべて既存テスト） |
| Build | PASS |
| 再生成データの差分チェック（`build-ws5-alias-candidates.mjs --check`） | 最新 |
| patchの適用確認（基準SHAへの `git apply --check` ＋適用後ツリーの一致） | OK |
| SQL（PGlite） | 31件連結・キャミィ・舞・エレナ・実DB照合SELECTのすべてで、想定どおりの照合・中断・復旧を確認 |
