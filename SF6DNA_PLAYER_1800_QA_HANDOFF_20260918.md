# SF6DNA Player 18:00 QA Handoff

## 現在地

- Latest RC SHA: `7e8d3afff3075a621a893128ac2e7fe4508d4b6e`（次のartifact-only commit作成前）
- Current Preview: https://sf-6-qfrnx0sdn-somas11620-9368.vercel.app/
- Player list/search/detail automated gate: `PASS`
- Device QA: `PENDING`
- DB changed: `NO`
- Production changed: `NO`

## 今回の調査成果

- Video relation: 10件`RELATION_READY`、2件Kakeru確認Queue、Shuto/如月れんはexact video未解決
- Tournament: Kakeruとときどの優勝候補をPrimary確定、Shuto/りゅうせいは参加情報のみ、如月れんはSecondary cross-check待ち
- Sho / 翔: Kakeruとして解決。CAPCOM公式でJP使用・CAPCOM CUP 11優勝を確認
- 如月れん: 人物・所属・YouTube・Twitch・公式プロフィールを確認。Character/Tournamentは保留
- Alias: 29候補（うち1件Hold）
- DB write Approval Package: READY

## データギャップ

DB writeを行っていないため現行DBの件数は変わらない。

| Gap | Current | Approval適用後の最大改善候補 |
| --- | ---: | ---: |
| Team | 28 | 1（如月れん新規候補） |
| Region/Country | 15 | 1（Kakeru新規候補） |
| Bio | 24 | 2（Kakeru・如月れん新規候補） |
| X | 30 | Kakeru 1件はcross-check待ち |
| YouTube | 37 | 1（如月れん） |
| Twitch | 33 | 1（如月れん）＋Kakeru cross-check待ち |
| Website | 38 | 1（如月れん公式プロフィール） |
| Tournament Result | 41 | 2（Kakeru・ときど） |
| Published Video Relation | 41 | 10候補 |
| Aliases | 41 | 28 review-ready candidates |

## 実機QA（約5分）

1. Player一覧を開く
2. `ときど`、`VARREL`、`JP`、`Crazy Raccoon`、`リュウ`で検索
3. 存在しない名前で自然な0件表示を確認
4. クリアで41件へ戻ることを確認
5. ときど、りゅうせい、Shuto、EndingWalker、Craimeの詳細を開く
6. 文字切れ、カード重なり、不自然なHero文、壊れた外部リンクがないか確認

今回の調査候補はDB未反映のため、Kakeru・如月れんはPreview QA対象外。
