# 統合準備・GIF制作環境（2026-11-17 第4回）

- 基準: `sf6dna-v2-chatgpt-rc-20260916` @ `014aa4bb3448c6cb9f2d6a8a2694ce51376bb7e6`（リモートの更新なし）／作業ブランチ `claude/move-data-quality-20261117`
- **Commit・Push・PR・DB書込・Deployは未実施。** 第1〜3回の成果物は変更していない。
- 管理方式の提案は `DEV_MANAGEMENT_PROPOSAL.md` を参照。

## 1. アルジュン 72枚の技カード接続（最小差分）
| 変更 | 内容 |
|---|---|
| `src/app/internal/character-preview/[slug]/page.tsx` | 1行変更: `getPreReleaseCharacter(slug) ?? await getPreReleaseLocalCardCharacter(slug, admission)` |
| `src/lib/pre-release-character.ts` | `getPreReleaseLocalCardCharacter()` を追加。実行時importは関数内のみ（既存のプレビュー経路は依存なし） |
| `src/data/SF6DNA_ARJUN_CARD_DRAFT_20261117.json` | 第3回のカード下書きと同一（`build-arjun-intake-candidate.mjs --card-data --check` で差分検査） |

- **表示条件**: 既存のWS5ローカル判定 `isWs5LocalCardRequest`（`NODE_ENV=development`、`SF6DNA_WS5_TXT_PREVIEW=1`、localhost、Vercel外）。Vercel Preview（9技）とProduction（404）の挙動は変更なし。
- **重複防止**: プレビュー用の9技プレースホルダを**置き換える**。9技の各系統は72枚に含まれる（第3回の対応表）。
- **未確認値の扱い**: 全カードが `draft` / `candidate_only`。根拠欄は「公式TXT候補（2026-10-23取得）。Patch・Source・表示照合・公開承認待ち」。数値の表示は既存のWS5ローカル表示規則に従う。
- **GIF対応表の活用**: 既存の `attachMoveMediaKeys` で、メディアキー登録の `arjun` 行から72枚すべてにmediaKeyを付与（77行の対応表と同じ紐付け）。メディア実体は未接続（`media: null`）。
- **確認結果**: Next.js開発サーバーで `/internal/character-preview/arjun` がHTTP 200。72枚を表示し、プレースホルダの重複なし、noindex維持、`/internal/character-preview/ryu` は404。
- 関連資料: 他の担当による11月12日の案（`/arjun-research-local` ルートの新設、または `characters/[slug]/page.tsx` への分岐）はリポジトリに未適用。本実装はどちらのファイルにも触れていないため競合しない。

## 2. ディージェイ メディアキー対応設計（GIF担当への引き継ぎ）
### 現状
- 製品slug `dee-jay` の表示経路は第3回で接続済み（106技、重複0）。
- メディアキー登録 `SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json` は `characterSlug: "deejay"`・プレビューID基準のため、`dee-jay` では106件すべてHOLD（エラーにはならない）。
- GIF担当の `DEEJAY_R15` 40件（`SF6DNA_P0_INDIVIDUAL_GIF_MANIFEST_20261117.json`）は `archive_move_id` = 既存DBの技IDで識別されている。

### 設計（提案。登録ファイルは変更していない）
1. メディアキーは `sourceRecordKey`（`deejay:web:N`）単位で不変とし、既存キーを**再発行しない**（`resolveStableMoveMediaKey` の規則どおり）。
2. 登録データに `characterSlug: "dee-jay"` の別名行を106行追加する。`currentMoveId` / `moveSlug` は製品側の値（既存97技は既存のUUID・slug、9行はプレビューID）にする。
3. 元の `deejay` 行は残す（内部ルート `/internal/ws5-txt-moves/deejay` が使用中）。

### 検証（メモリ上のシミュレーション。リポジトリは未変更）
| 登録データ | mediaKey付与 | HOLD |
|---|---:|---:|
| 現在の登録データ | 0 / 106 | 106 |
| 別名行を追加した場合 | **106 / 106** | 0 |

- 別名行のmediaKeyは、元の `deejay` 行のキーと106件すべて同一。
- GIF 40件 → 既存技ID → 公式TXT行 → mediaKey が**40件すべてつながり**、ファイル名のslugも既存slugと一致。

### 引き継ぎファイル
- `dee-jay/DEE_JAY_MEDIA_KEY_ALIAS_CANDIDATE.csv`: 追加候補の別名行106行
- `dee-jay/DEE_JAY_GIF_TO_MOVE_LINK_CANDIDATE.csv`: GIF 40件と技・mediaKeyの対応（出力SHA256付き）
- 反映はGIF接続担当の判断で行う（本担当は登録ファイルを変更しない）

## 3. GIF制作環境（Claude Code）実行可否
| 項目 | 結果 | 根拠 |
|---|---|---|
| FFmpeg | **可** | 6.1.1（ffprobe含む） |
| Python | **可** | 3.13.18 + Pillow 12.3.0 |
| 圧縮動画の読み込み | **可** | H.264 1280×720 60fps のmp4をデコード |
| 一括切り出し | **可** | 既存 `scripts/ryu-media-pipeline.py propose` で境界候補を抽出 → 3本を7秒でGIF化 |
| 10MB未満への最適化 | **可** | 2.35秒: 3.0MB／4.7秒: 6.1MB（480×270・20fps）。14秒: 自動で400px・15fps・128色に段階を下げて8.4MB |
| SHA256生成 | **可** | 出力・元動画ともに生成 |
| Google Driveへの引き渡し | **可** | テストフォルダにアップロード → 読み戻したSHA256が一致 |
| **Driveからの元動画取得** | **不可（ブロッカー）** | Driveコネクタのダウンロード上限は10MB。元動画は24〜330MBで取得できない |

- 試験成果物（技アセットではない）: Drive `SF6DNA_CLAUDE_GIF_ENV_TEST_20261117/tech-test-a.gif`（SHA256 `c5798246…a86609`）と `TECH_TEST_MANIFEST.json`。素材はリポジトリ内のQA用クリップ `qa/luke/combo-clean-20261011.mp4`。
- **未制作技の試験制作は未実施**。アルジュン（GIF 0件）の元動画は「32.アルジュン/1.技カード用」に36〜265MBで保存されており、上記の上限で取得できない。
- 解除方法（いずれか1つ）:
  1. 撮影クリップを10MB未満に分割してDriveに置く（例: 技ごとに数秒ずつ）
  2. 元動画をこのセッションへ直接添付する
  3. ユーザーのPCをこのセッションに接続し、ローカルの動画を読む
- GIF化の設定はGIF担当の規約（480×270・約20fps・`release_approval: NOT_GRANTED`・Drive読み戻しSHA確認）に合わせた。新しい制作ツールはリポジトリに追加していない（試験スクリプトはスクラッチパッドのみ）。
