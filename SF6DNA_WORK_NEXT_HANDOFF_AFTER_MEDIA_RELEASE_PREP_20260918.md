# Next Handoff — After Media / Release Prep

## ユーザー担当

1. Day 1実機QA。
2. Day 2–3にRyu/JPをカテゴリ単位MP4で録画。
3. 8 game sessions。
4. Contact実値、Production origin/env、DB/Productionの最終承認。

## Work側

- QA結果をDelta Fix Queueへ分類し、P0/P1のみ優先修正して再Preview。
- 元動画のhash、cut、poster、format比較、manifest、move mapping、375px/reduced-motion検証。
- Game結果を候補状態へ変換し、自動publishしない。
- DB/Productionは明示承認後のみ。

次の入力が動画の場合は、character/category/patch/capture dateだけ確認できれば処理開始可能。ユーザー側で分割・GIF化・圧縮は不要。
