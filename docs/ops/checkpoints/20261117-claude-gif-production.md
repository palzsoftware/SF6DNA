# GIF制作（Claude, 2026-11-17）

## 区分（混同しないこと）
| 区分 | Driveフォルダ | 命名 | media_kind |
|---|---|---|---|
| 技術試験（技アセットではない） | `SF6DNA_CLAUDE_GIF_ENV_TEST_20261117` | `tech-test-*.gif` | `TECH_TEST_NOT_A_MOVE_CANDIDATE` |
| 製品用候補 | `SF6DNA_YASMINE_R1_GIF_CANDIDATE_20261117` | `<既存move slug>-r1-candidate.gif` | `PRODUCT_GIF_CANDIDATE` |

## ヤスミン R1（製品用候補）
- 対象: `SF6DNA_VER1_YASMINE_MEDIA_MANIFEST_20261003.json` のうち `approved_for_preview` かつ `CUT_REVIEW_PASS` の12クリップ。HOLDの14クリップ（`USER_QA_FAIL_PENDING_REAUDIT`）は除外。
- 元動画: リポジトリ内の同定レビュー済みクリップ（各クリップのSHA-256がマニフェストと一致することを確認済み）。
- 設定: 480×270・20fps・256色（GIF担当の規約）。10MB超の場合は段階的に下げる（今回は発生せず）。
- 結果: 12本、最大1,246,980バイト、技術QA 12/12 PASS、DriveのSHA-256読み戻し 12/12 PASS、中間フレームの一覧シートで目視確認済み。
- 台帳: `docs/gif-production-20261117/SF6DNA_YASMINE_R1_GIF_MANIFEST_20261117.json`（Driveにも同じファイル）。各行に `current_move_id`（既存DB UUID）・`move_slug`・元クリップのSHA-256を記録。
- 状態: `release_approval: NOT_GRANTED`、`product_connected: false`。リポジトリ・メディア登録・DBには接続していない。

## 技術試験
- FFmpeg・Python・圧縮動画の読み込み・一括切り出し・10MB未満への最適化・SHA-256・Driveへの引き渡し: いずれも可（第4回）。
- 元動画を直接添付した場合の想定試験（第5回）: 246MB・1080p60・178.6秒の動画を使用。既存の `propose` が24秒、深い位置からの切り出しとGIF化が各約2秒・約3MB。ディスク残量29GB。→ **添付であれば制作可能**。添付できるファイルサイズの上限はアプリ側の仕様のため未確認。

## 未解決
- Driveにある10MB超の元動画（アルジュン等）は取得できない。経路の選択肢は `docs/gif-production-20261117/SOURCE_RETRIEVAL.md` を参照。
- 新しい制作ツールはリポジトリに追加していない（使用したスクリプトは作業領域のみ）。
