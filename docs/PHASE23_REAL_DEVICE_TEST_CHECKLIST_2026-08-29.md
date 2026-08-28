# SF6DNA Phase23 Real-Device Test Checklist

Date: 2026-08-29 JST
Target branch: `sf6dna-v2`

## Purpose

Phase20-22までの内部実装・データGate・CIを通過したv2を、実際のPC/スマートフォン環境で確認する。

このPhaseでは、見た目・操作・保存・遷移・実データ表示の実機差を確認する。

## Test rules

- `main`へmergeしない
- Productionへ公開しない
- 不具合を見つけてもverified / publishedデータを推測修正しない
- データ内容の誤りとUI不具合を分けて記録する
- 再現手順がある場合は端末・ブラウザ・URL・操作順を残す

## Test environment record

- Date:
- Device:
- OS:
- Browser:
- Screen size / orientation:
- Network:
- Test URL:
- Tested commit:

Result notation:

- `[PASS]` 正常
- `[FAIL]` 不具合あり
- `[N/A]` 対象外

---

# A. Global / Navigation

- [ ] Homeが表示される
- [ ] Header / navigationが操作できる
- [ ] Footerリンクが操作できる
- [ ] 戻る・進む操作で異常が出ない
- [ ] 404相当URLでアプリ全体が壊れない
- [ ] PC幅で横スクロールや重なりが発生しない
- [ ] スマートフォン幅で文字・ボタン・カードが画面外へ崩れない
- [ ] 縦画面で操作できる

Notes:

---

# B. Character data / Public Gate

最低3キャラ、可能なら使用キャラ・人気キャラ・データ量の多いキャラで確認する。

- [ ] キャラクター一覧が表示される
- [ ] キャラクター詳細が表示される
- [ ] Movesが表示される
- [ ] Framesが表示される
- [ ] Classic Commandが表示される
- [ ] Modern Commandが存在する技では表示される
- [ ] Modern Command未登録技で推測表示されない
- [ ] Comboが表示される
- [ ] Trainingが表示される
- [ ] Matchup/Counter情報が表示される
- [ ] Source表示・導線が正常
- [ ] draft / reviewed / unverified情報がPublic Gateを迂回して断定表示されない

Characters tested:

1.
2.
3.

Notes:

---

# C. Search

- [ ] 検索ページが表示される
- [ ] キャラクター名で検索できる
- [ ] 技名で検索できる
- [ ] 攻略系キーワードで検索できる
- [ ] 結果リンクが正しい詳細へ移動する
- [ ] 結果0件でもUIが壊れない

Notes:

---

# D. Diagnosis

## New diagnosis

- [ ] 診断一覧が表示される
- [ ] 診断を開始できる
- [ ] 回答選択が視認できる
- [ ] 次へ / 戻るが正常
- [ ] 最終結果が表示される
- [ ] 診断履歴へ保存される

## Resume behavior added in Phase22

1. 診断を途中まで回答する
2. ページを閉じる / 別ページへ移動する
3. 同じ診断を再度開く

- [ ] 過去に自分で選択した回答だけが復元される
- [ ] 最初の未回答質問から再開する
- [ ] 未回答項目が勝手に埋まらない
- [ ] 「最初からやり直す」で保存回答が消える
- [ ] リロード後も期待どおりに動く

Notes:

---

# E. Favorites

- [ ] お気に入り追加ができる
- [ ] お気に入り一覧に反映される
- [ ] リロード後も保持される
- [ ] 削除できる

Notes:

---

# F. My Characters

- [ ] メイン / サブ / 練習中を設定できる
- [ ] 表示が保存される
- [ ] リロード後も保持される
- [ ] 更新・解除できる

Notes:

---

# G. Character Compare

- [ ] 2キャラを選択できる
- [ ] 比較情報が表示される
- [ ] キャラ変更で内容が更新される
- [ ] スマートフォン幅でも比較表示が読める

Notes:

---

# H. Rank Tracker

- [ ] キャラクターを選べる
- [ ] MR / LPを入力できる
- [ ] メモを保存できる
- [ ] 履歴が表示される
- [ ] リロード後も保持される
- [ ] 削除・修正対象の操作が正常

Notes:

---

# I. Improvement Loop — Phase22

Open: `/improve`

## 30-second battle log

- [ ] 使用キャラを選べる
- [ ] 相手キャラを選べる
- [ ] 勝敗を選べる
- [ ] MR / LPを入力できる
- [ ] 主な被弾原因を入力できる
- [ ] 対空を記録できる
- [ ] DI返しを記録できる
- [ ] 確反を記録できる
- [ ] 端脱出を記録できる
- [ ] Drive管理を記録できる
- [ ] 困った技・連携を記録できる
- [ ] 原因分類を選べる
- [ ] 一部項目が未入力でも保存できる

## Persistence

- [ ] 保存した対戦ログが表示される
- [ ] リロード後も保持される
- [ ] ページ移動後に戻っても保持される
- [ ] 削除できる

## Last-10 analysis

テスト用に複数件登録する。

- [ ] 直近10戦だけが分析対象になる
- [ ] 勝敗件数が一致する
- [ ] 対空ミス率が入力内容と一致する
- [ ] DI返しミス率が入力内容と一致する
- [ ] 確反ミス率が入力内容と一致する
- [ ] 端脱出ミス率が入力内容と一致する
- [ ] Drive管理ミス率が入力内容と一致する
- [ ] 最優先課題が記録に基づいて表示される
- [ ] Trainingリンクが正常
- [ ] Matchupリンクが正常

Notes:

---

# J. Replay Review — Phase22

Inside `/improve`

- [ ] 問題場面を入力できる
- [ ] 原因を入力できる
- [ ] 試した回答を入力できる
- [ ] 採用回答を入力できる
- [ ] 再練習対象を入力できる
- [ ] 保存後に一覧表示される
- [ ] リロード後も保持される
- [ ] Trainingへのリンクが正常
- [ ] 削除できる

確認事項:

- [ ] 自動Replay解析を行ったかのような誤表示がない

Notes:

---

# K. Matchup Knowledge Card — Phase22

Open: `/matchup-card`

- [ ] 自キャラを選べる
- [ ] 相手キャラを選べる
- [ ] `自キャラ vs 相手キャラ`が正しく更新される
- [ ] 相手の公開済み代表技が表示される
- [ ] verified + Source付きCounterがある場合だけ表示される
- [ ] Counterがない対面は空状態になる
- [ ] Counterがない対面で攻略内容を推測生成しない
- [ ] Trainingリンクが正常
- [ ] 相手Movesリンクが正常
- [ ] Improvement Loopへ戻れる
- [ ] スマートフォン幅でも選択UI・カードが操作できる

Matchups tested:

1.
2.
3.

Notes:

---

# L. Diagnosis History

- [ ] 診断完了後に履歴が増える
- [ ] 一覧を開ける
- [ ] リロード後も保持される
- [ ] 既存上限・削除仕様が正常

Notes:

---

# M. Static information pages

- [ ] About
- [ ] FAQ
- [ ] Sources
- [ ] Changelog

各ページで確認:

- [ ] 404にならない
- [ ] レイアウトが崩れない
- [ ] 内部リンクが壊れていない

Notes:

---

# N. Empty / Error states

可能な範囲で確認する。

- [ ] 検索0件
- [ ] Matchup Counter 0件
- [ ] Improvement Log 0件
- [ ] Replay Review 0件
- [ ] データ取得不能時に白画面にならない
- [ ] エラー文がデータを捏造・補完しない

Notes:

---

# O. Browser local storage cross-check

対象:

- Favorites
- My Characters
- Rank Tracker
- Diagnosis History
- Diagnosis draft/resume
- Improvement battle log
- Replay review

For each applicable feature:

- [ ] 同じブラウザのリロードで保持
- [ ] 同じブラウザのページ遷移で保持
- [ ] 削除操作が反映される

Important expected behavior:

- ブラウザlocalStorageのため、別端末・別ブラウザへ自動同期しないことは正常仕様。

Notes:

---

# P. Final real-device decision

## Blocking failures

実機テスト完了時、以下が1件でもあればPhase23はFAIL扱い:

- 起動不能 / 白画面
- 主要ページ404
- 保存データ消失が仕様外で発生
- Public Gate漏れ
- reviewed / draft / unverifiedをverified相当として表示
- Sourceなし攻略の断定表示
- 主要操作不能
- モバイルで主要UIが画面外に出て操作不能

## Result

- [ ] PASS — 実機テスト完了、次Phaseへ進行可能
- [ ] CONDITIONAL PASS — 軽微修正後に再確認
- [ ] FAIL — Blocker修正が必要

Blocking issues:

1.
2.
3.

Non-blocking issues:

1.
2.
3.

Final tested commit:

Tester:

Date:
