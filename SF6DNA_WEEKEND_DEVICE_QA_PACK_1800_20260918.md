# Weekend Device QA Pack — 18:00 Final

対象RC/Previewは本batchの最終報告に記録する。ユーザー作業は実機QA、GIF録画、ゲーム検証だけ。

## Day 1 — P0 45–60分

- Character: Ryu/JPの375px+desktop、Hero、概要4項目、6 tabs、overflow、Source CTA。
- Player: search、category/character filter、detail、cross-navigation、0件。
- Video: search/Intent、filter/sort、favorite/watched/share、外部遷移。
- global search、guest diagnosis→Daily。
- login→save→reload→history→logout。

## Day 2 — 60–90分

- A.K.I./Zangief/Yasmineと既知issue route。
- session 1–4。
- Ryu GIF原本録画。

## Day 3 — 60–90分

- session 5–8。
- JP GIF原本録画。
- Character↔Player↔Video遷移。

## Day 4 — 45–60分

- 31 Characterは5xx/旧template/表示崩れの巡回。
- Contact、Privacy、Terms、Disclaimer、404、console。
- Auth/save/history/logoutの再確認。

## Day 5 — 30–45分

- FAIL修正箇所だけ再QA。
- blocker、target SHA、rollback SHA、Production smokeを確定。

停止条件はdata loss、login loop、blank screen、5xx。FAIL時はURL、操作、時刻、Screenshotだけ提出し、原因調査はWork側が行う。Generic 85はclaim-level原票が揃うまで実施しない。
