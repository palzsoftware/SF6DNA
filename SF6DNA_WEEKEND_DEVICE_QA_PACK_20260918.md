# Weekend Device QA Pack

Record device, OS, browser, route, expected/actual, screenshot, and PASS/FAIL. Stop on data loss, auth loop, or inaccessible core action.

1. Character: priority `/characters/ryu`, `/characters/jp`, then all 31; copy/layout/375px overflow, tabs, CTA. Use the existing 29-claim / 8-session game-verification runbook unchanged.
2. Player: `/players` search, category filter, character filter, combined AND, chips, clear-all, zero result, card/detail links, Player↔Character. Kakeru and 如月れん are excluded until approved DB publication.
3. Video: filters, favorite, watched, share, public provider links; members/private/deleted must not masquerade as playable.
4. Diagnosis/Daily: guest diagnosis→Daily; authenticated persistence and return flow.
5. Account: login, redirect, save, history, logout, signed-out state.
6. GIF pilot: Ryu and JP only; loading, motion, fallback, layout.

Minimum viewport: 375px mobile plus one desktop. Player V2 PASS requires no horizontal page overflow and correct group semantics.
