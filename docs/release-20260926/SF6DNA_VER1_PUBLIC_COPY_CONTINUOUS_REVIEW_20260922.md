# SF6DNA Ver.1.0 Public Copy継続校閲

- 実施日: 2026-09-22
- Base SHA: `26842d126aac341637af02b4214296e0805c73d2`
- 対象: `sf6dna-v2-chatgpt-rc-20260916`
- 判定: `PASS_FOR_PREVIEW`
- Character Detail固有攻略本文: 対象外

## 対象Route

Home、Header/Footer、Login、Contact、Feedback、Privacy、Terms、Disclaimer、About、FAQ、Sources、Changelog、Search、Characters一覧、Character Detail共通UI、Players一覧/詳細、Videos一覧/詳細、Diagnosis一覧/実行/履歴、Daily15、Favorites、My Characters、Rank Tracker、Compare、Improve、Matchup Card、Moves/Combos/Setups/Sequences/Counters/Trainingの一覧/詳細、Glossary詳細、Tournament詳細、Tools、404、Error、Loading/Empty Stateを実コードから確認した。

管理画面、Preview専用の内部確認表示、Character固有攻略本文はPublic Copy判定から除外した。

## 結果

| 項目 | 結果 |
|---|---|
| Reviewed routes | 49 route files + shared Header/Footer/Form/Error/Empty UI |
| Reviewed items | 説明文、案内文、CTA、Label、Helper、Validation、Success、Empty/Error state |
| Changed items | 15 |
| Internal terms remaining | 0（通常Public UI） |
| Vague CTA remaining | 0（通常Public UI。accordionの「開く」は展開操作を示すため維持） |
| Contact helper | 自然な日本語・180日保持説明維持 |
| Login helper | 自然な日本語・端末保存範囲維持 |
| Character Detail hold | YES |

## 主な判断

- Loginは機能範囲を変えず、冗長な「完了した」を削除し、端末保存の因果関係を明確にした。
- Contactは一般ユーザー向けに短くしたが、保存対象、ログイン時の関連付け、迷惑行為対策、180日以内の削除を維持した。
- Privacyは「アカウントID」を「利用中のアカウントを識別する情報」に変更し、法的意味を維持した。
- Contact/Feedbackではサイト内フォームをPrimary、メールを利用できない場合のFallbackとして明示した。
- 検索結果とCharacter Detail共通導線の「開く」は、遷移先が分かるCTAへ変更した。
- Character Detail内accordionの「開く」はページ遷移ではなく開閉操作を正確に示すため変更しなかった。
- Previewトークン利用時だけ表示される `draft / reviewed` は実機確認者向けの状態表示であり、通常Public UIには出ないため維持した。

## 継続運用

- RC更新時: 変更Routeと共有ComponentのCopy差分を再監査する。
- 2026-09-24: Public Copy全体を再走査する。
- 2026-09-25: Final RC候補で最終読み直し。以後はP0/P1のみ修正する。
- 2026-09-26: Production承認後、deploy前後にContact/Login/Home/FAQ/Privacy/Terms/Disclaimerを確認する。

## 制約

DB変更なし。Production変更なし。`main` / `sf6dna-v2`変更なし。診断契約変更なし。Ver.1.1取り込みなし。
