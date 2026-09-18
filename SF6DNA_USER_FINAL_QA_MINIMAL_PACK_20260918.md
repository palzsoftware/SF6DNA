# User Final QA Minimal Pack — 2026-09-18

## 目的

広範囲の再テストは不要。最終PreviewをスマートフォンとPCで開き、以下の代表Routeだけを受け入れ確認する。

1. `/` — Header/Footer、主要入口。
2. `/characters/ryu` と `/characters/jp` — 新Shared Template、横はみ出し、Hero可読性。
3. `/players` — 検索・絞り込み・0件・代表detail 1件。
4. `/videos` — 検索、絞り込み、共有、YouTube遷移。
5. `/diagnosis` → result → Daily — guest導線。
6. `/faq` — 検索、カテゴリー、開閉。
7. `/feedback` → `/contact` — 送信フォームがなく、Contact準備中表示であること。
8. `/auth` — 実アカウントのログイン/ログアウト（可能な場合）。

## 報告方法

各項目は `PASS` または `FAIL + URL + 端末 + スクリーンショット` のみでよい。ゲーム内容の真偽確認と元動画録画は別セッションとして扱う。

