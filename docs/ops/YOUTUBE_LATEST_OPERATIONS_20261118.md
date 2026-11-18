# YouTube新着動画 運用メモ（2026-11-18・承認待ち）

## 取得回数制限（複数インスタンス）
- 共有層: Next Data Cache（`unstable_cache`, revalidate 86400s, tag `sf6dna-latest-youtube`）。Vercel上ではインスタンス間で共有されるため、成功時の上流取得は「3カテゴリ×1日1回」が基本。【仕様上の想定。実Vercel環境では未検証】
- インスタンス内の保険: 1日30回上限 + 失敗後30分クールダウン（`createQuotaGuard`）。
  - これはインスタンス単位。最悪ケース = インスタンス数 × 30回。1回 = search 100 + videos 1 = 101 units。
  - 1インスタンスの1日最大 = 30回 × 101 = 3,030 units。全インスタンス合計 = インスタンス数 × 3,030。3インスタンスまでは 9,090 units で 10,000 以内、4インスタンス以上が同日に上限まで使うと超過し得る（その場合も課金ではなく停止→フォールバック）。
- 失敗時は例外がキャッシュされないため再試行が起こるが、上記クールダウンで抑制。
- 厳密な全体上限が必要なら共有KV（Upstash等）でカウンタを持つ方式が候補（追加サービス＝要承認、未実装）。

## 定期実行（候補・未適用）
- `docs/ops/VERCEL_CRON_CANDIDATE_20261118.json`: 1日1回 `/api/youtube/latest/refresh`。
- Vercel Cron は `Authorization: Bearer $CRON_SECRET` を付与して GET する仕様に合わせ、ルートは CRON_SECRET（32文字以上）一致時のみ動作。
- ルートはキャッシュを stale にするだけ（YouTube API は呼ばない）。次の閲覧時に再取得。

## 利用プラン・追加料金（一般知識・未確認事項を含む）
- YouTube Data API v3: 既定 10,000 units/日・無料。上限超過は課金ではなく 403 (quotaExceeded) で停止 → 本実装は掲載動画へフォールバック。【Google公式の現行条件は未再確認】
- Vercel Cron: Hobby でも利用可（Hobbyは1日1回程度の頻度制限あり）。本候補は1日1回のため追加料金なしの想定。【契約プランは未確認。Vercelダッシュボードで要確認】
- 本機能に新たな有料サービスは追加していない。

## 有効化に必要な環境変数（サーバー側のみ・NEXT_PUBLIC禁止）
| 変数 | Preview | Production |
|---|---|---|
| SF6DNA_LATEST_VIDEO_ENABLED=1 | 要承認 | 要承認 |
| SF6DNA_LATEST_VIDEO_PRODUCTION=1 | 不要 | 要承認 |
| YOUTUBE_DATA_API_KEY | 既存 | 既存 |
| CRON_SECRET（32文字以上） | 任意 | 要承認 |

## APIキー無し時の表示
- 自動取得3棚は掲載動画があれば FALLBACK 表示、無ければ「現在、動画を取得できません」。厳選棚は常に掲載動画のみ。
