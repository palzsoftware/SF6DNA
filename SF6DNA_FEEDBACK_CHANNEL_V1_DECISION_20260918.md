# Feedback Channel V1 Decision — 2026-09-18

## Decision

`/feedback` は案内専用でリリースする。フォーム、公開掲示板、UGC、DB保存、個人情報収集は実装しない。

## 理由

Contact実値が未決定の状態で送信UIを置くと、受領できるという誤認とデータ取扱いリスクが生じるため。利用者には「表示・操作」「掲載情報」「機能・使い方」の報告準備項目だけを提示し、正式窓口は`/contact`で確認させる。

PUBLIC_FORUM = NO

