# 開発管理の集約 提案（2026-11-17）

推奨: **リポジトリ内に「台帳1枚＋担当範囲1枚＋Checkpoint 1フォルダ」を置き、コードはブランチ、バイナリはDriveに分ける。** 既存の資料は移動・削除せず、新しい台帳から参照する形で段階的に移行する。

## 現状の課題（確認済みの事実）
- `PROJECT_STATUS.md` / `NEXT_PROMPT.md` の最終更新は2026-08〜09。正本ブランチの記載（`sf6dna-v2`）が現在の基準 `sf6dna-v2-chatgpt-rc-20260916` と一致しない。
- 管理系Markdownはルート直下に90件、`docs/` 直下に101件＋41フォルダ。日付付きの派生版（`_V2`, `_FINAL`, `_LATEST`, `_UPDATED` など）が並び、最新版を判断しにくい。
- Driveには各AIの成果がZIPで並び、Windowsパス前提の適用スクリプト（`apply_local.py`）付きのものがある。リポジトリに未適用のまま残る案がある（例: 11月12日のアルジュン案）。
- 同じ作業の重複が起きている（例: アルジュン77技のカード化を複数の担当が別方式で実施）。

## 提案する構成
```
docs/ops/
  WORKBOARD.md        # 単一の進捗台帳（全ワークストリーム1表）
  OWNERSHIP.md        # 担当範囲（パス単位）と共有ファイルの調整ルール
  checkpoints/
    YYYYMMDD-<担当>-<テーマ>.md   # 固定テンプレートのCheckpoint
```

### WORKBOARD.md（1表で管理）
| 列 | 内容 |
|---|---|
| ワークストリーム | 例: 技データ、GIF制作、GIF接続、Player図鑑 |
| 担当 | Claude / ChatGPT / Codex / 人 |
| ブランチ | `claude/…`、`codex/…` など、ワークストリームごとに1本 |
| 基準SHA / 最新SHA | 開始時と現在 |
| 状態 | `ローカル実装` → `ローカル検証` → `GitHub反映` → `Preview反映` → `Preview QA` → `Production反映` → `Production確認`（ユーザー設定の区分をそのまま使う） |
| 承認待ち | DB書込、Deploy、公式確認など |
| 次の一手 / ブロッカー | 1行 |

### OWNERSHIP.md（競合防止）
- パス単位で担当を決める（CODEOWNERS形式）。初期案:
  - 技データ: `v2-web/src/data/SF6DNA_WS5_*`（メディア登録を除く）、`src/lib/canonical-txt-connection.mjs`、`src/lib/ws5-slug-alias.mjs`、`src/lib/pre-release-character.ts`、`scripts/audit-*` / `build-*`
  - GIF接続: `src/data/SF6DNA_WS5_MEDIA_KEY_REGISTRY_*`、`*_MEDIA_MANIFEST_*`、`src/lib/media-key-registry.mjs`、`public/media/**`
  - Player図鑑: `src/lib/player*`、`src/app/players/**`、`src/data/player-research/**`
  - **共有（変更前に台帳で予約）**: `src/app/characters/[slug]/page.tsx`、`src/components/character-unified-page.tsx`
- 共有ファイルを変更する担当は、WORKBOARDの「予約」欄に記入してから着手する。予約があるファイルには触れない。

### Checkpoint（固定テンプレート）
```
基準SHA / 作業ブランチ / 最終SHA
変更ファイル（A/M/D）
テスト: Typecheck / Lint / Test（件数）/ Build / その他
状態（上記7段階のどこまで）
承認待ち・未解決・次の一手
成果物（patch・Driveリンク）
```

### 受け渡しの原則
- **コードはブランチとPRで受け渡す**（ZIPと適用スクリプトは使わない）。各担当が同じ基準SHAからブランチを切り、PRで統合する。
- **Driveはバイナリ専用**（動画・GIF・大きな成果物）とし、必ずマニフェスト（SHA256・元動画・状態）を添える。
- 他の担当の未コミット変更は、その担当のブランチやワークツリーにのみ存在する。共有ブランチへの直接Pushと、ほかの担当のブランチのrebaseは禁止する。

## 移行手順（承認後）
1. `docs/ops/` の3ファイルを追加し、現在のワークストリーム（技データ、GIF制作、GIF接続、Player図鑑、Ryu統合など）を台帳に登録する。
2. `PROJECT_STATUS.md` / `NEXT_PROMPT.md` の先頭に「最新は `docs/ops/WORKBOARD.md`」と1行追記する（本文は変更しない）。
3. 以後のCheckpointは `docs/ops/checkpoints/` のみに作成する。
4. Drive上の未適用ZIPは台帳の「未統合成果」欄に列挙し、採用・不採用を判断してからブランチ化する。

本提案は文書のみで、既存ファイルの移動・削除・変更は行っていない。
