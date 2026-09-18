# Sho / 如月れん Source監査

監査日: 2026-09-18
DB操作: read-only（writeなし）

## 結論

| 対象 | DB record / alias | Fresh判定 | 公開Route追加 |
|---|---|---|---|
| Sho / 翔 | recordなし / aliasなし | `SOURCE_INSUFFICIENT` / `NOT_FOUND` | しない |
| 如月れん | recordなし / aliasなし | `PUBLIC_RECORD_EXISTS` / `CANDIDATE_RECORD_READY`（人物同定まで） | しない |

## Sho / 翔

- published 41件と全statusのplayers、player_aliasesをread-only確認したが該当なし。
- CAPCOM / SFL公式、Team公式、指定SecondaryをFresh検索したが、「Sho / 翔」を一意のSF6 Player recordへ結びつけられるPrimary Sourceを確認できなかった。
- `video-intent.ts` の検索語彙には存在するが、検索語彙は公開Player Entityの証明ではない。
- よって推測追加せず、`SOURCE_INSUFFICIENT` とする。

## 如月れん

- published 41件と全statusのplayers、player_aliasesをread-only確認したが該当なし。
- CAPCOM公式SFL応援アンバサダー特設情報、Brave group名義の公式リリース、本人Twitch、Secondary大会記録が存在し、人物の公開記録は確認できる。
- PUNK WORKSHOP公式のコラボ製品は「如月れん × JP」を示すが、競技Player Entityの恒常的なmain Characterや大会実績を直接証明するものとは扱わない。
- `VTuber最協決定戦 Ver. STREET FIGHTER 6 第一幕` 1位はSecondaryで確認したが、大会Primaryによる順位・Character照合前のため `NEEDS_CROSSCHECK`。
- 人物プロフィール候補としては `CANDIDATE_RECORD_READY`、競技実績・Character relationは `SOURCE_REQUIRED`。DB writeは行わない。

## 参照

- CAPCOM SFL公式応援アンバサダー: https://sf.esports.capcom.com/
- Brave group公式リリース（PR TIMES検索結果）: https://prtimes.jp/ （記事直URLは再取得Queue）
- 格ゲーチェッカー 如月れん: https://kakuge-checker.com/player/view/kisaragiren/
- fgamers 如月れん: https://fgamers.jp/
- Twitch 如月れん: https://www.twitch.tv/ （検索結果で本人ページを確認。恒久URLは再取得Queue）
- PUNK WORKSHOP: https://punkworkshop.jp/

注: Secondaryは調査開始点であり、verified/public publishの単独根拠には使用しない。
