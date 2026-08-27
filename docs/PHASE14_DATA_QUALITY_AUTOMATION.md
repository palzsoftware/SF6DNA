# Phase14 Data Quality / Progress Automation

最終更新: 2026-08-27 JST

## 正規の再集計手順

`supabase/quality/phase14_public_readiness.sql` を `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`) に対して実行する。

- SQLは `SELECT` / CTEのみで、DBを書き換えない。
- Supabase実DBを毎回再集計し、スナップショット値を正本にしない。
- `published`、`verified`、Source、Current Patchを別々に集計する。
- Release Readyは原則 `published + verified + Source + Current Patch`。Moveは親Move published、Current verified Frame、Source、Classic Commandを必要条件とする。
- Player / Videoはverification列を持たないため、publishedと固有relationを別集計する。
- `reviewed`を`verified`へ、`draft`を`published`へ自動昇格しない。

## 出力

- Character: playable published / draft non-playable
- Move: total / published / draft / Frame / verified Frame / Source / Classic / Modern / Release Ready
- Strategy 5種: total / draft / reviewed / verified / published / published+verified / Source / Current Patch / Release Ready
- Trait Score: total / reviewed / verified / published / published+verified / Source / Release Ready
- Player: published / draft / Source
- Video: published / draft / Character relation / Source relation
- 全31キャラ: Move / Frame / Classic / Modern / Combo / Setup / Sequence / Counter / Training / Player / Video / Trait Score / Release Ready
- Recommendation Ready Candidate数
- AI Coach Source Evidence Entity数
- RLS対象テーブル数 / RLS有効数

## 人間判断のまま残す値

P0/P1/P2残件、Blocker、50項目完成率はImplementation Planと実行環境の確認が必要なため自動判定しない。Dashboard更新時に本レポート、GitHub Actions、Vercel状態を合わせて判断する。
