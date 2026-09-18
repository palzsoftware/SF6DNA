# SF6DNA Player Device QA Handoff — 2026-09-18

## QA scope

Previewで以下だけを確認する。

1. `/players` を375px相当とDesktopで開く。
2. Player cardに「チーム / 主なキャラクター / 地域」が表示され、長い名前が切れないこと。
3. `/players/tokido` と `/players/ryusei` を開く。
4. Profile fallbackに無断Player写真・Team logoが表示されないこと。
5. 「使用キャラクター / SNS・外部リンク / 大会実績 / 関連動画 / 情報源」が崩れないこと。
6. Source CTAがリンク種別を説明し、外部リンクが新しいTabで開くこと。
7. Related Videoが0件の場合、自然なEmpty Stateが表示されること。
8. Global Searchで `VARREL`、`SCARZ`、`JP`、`リュウ` を入力しPlayer候補が出ること。

## Priority routes

- `/players`
- `/players/tokido`
- `/players/ryusei`
- `/players/shuto`
- `/players/tachikawa`
- `/players/higuchi`
- `/players/nemo`
- `/players/mister-crimson`

## Expected constraints

- Player画像は全件Fallback（許諾済みallowlist 0件）。
- 公開Player 41件のVideo relationとTournament Resultは現DBで0件。空状態は不具合ではない。
- DBは変更していない。

Device QA完了まではPlayer領域をRelease approvedにしない。
