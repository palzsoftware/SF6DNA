# Sho / 翔・如月れん Source監査 V2

監査日: 2026-09-18  
DB操作: read-only（writeなし）

## 結論

| 入力名 | 正規化候補 | 判定 | DB反映 |
| --- | --- | --- | --- |
| Sho / 翔 | `Kakeru` | `IDENTITY_RESOLVED / CANDIDATE_RECORD_READY_FOR_REVIEW` | Approval待ち |
| 如月れん | `如月れん` | `PUBLIC_RECORD_CONFIRMED / CANDIDATE_RECORD_READY_FOR_REVIEW` | Approval待ち |

## Sho / 翔

前回の検索語が曖昧だったため未解決としていたが、CAPCOM公式のCAPCOM CUP 11 RECAPで、KakeruがJPを使用して優勝したことを確認した。SF6文脈の「翔」はKakeruの日本語表記として扱うのが妥当。

- 推奨Public表示名: `Kakeru`
- 検索Alias候補: `翔`, `Sho`, `Kakerugo`, `Uzura`
- Region候補: Japan
- Character候補: JP
- Tournament候補: CAPCOM CUP 11 / 1st / 2025
- Primary source: https://sf.esports.capcom.com/

`Sho`をPublic表示名にすると同名別人との衝突リスクがあるため、表示名はCAPCOM公式表記の`Kakeru`を推奨する。

## 如月れん

人物同定、所属、本人配信導線は十分に確認できた。

- Public表示名候補: `如月れん`
- Alias候補: `Ren Kisaragi`, `Kisaragi Ren`, `ren_kisaragi__`
- Affiliation候補: `ぶいすぽっ！ / Iris Black Games`
- YouTube: https://www.youtube.com/@ren_kisaragi__
- Twitch: https://www.twitch.tv/ren_kisaragi__
- Official profile: https://store.vspo.jp/pages/kisaragi-ren

ただし、恒常的なmain characterと大会順位はPrimary Sourceの照合が不足している。PUNK WORKSHOPの「如月れん × JP」はコラボ製品の関係を示すだけで、main characterの単独根拠にはしない。VTuber最協1位はSecondary候補のまま維持する。

## 判断

- 両名とも人物レコード候補はレビュー可能。
- KakeruのJP・CAPCOM CUP 11優勝はPrimaryで確定可能。
- 如月れんの外部リンク・所属は追加候補として十分。
- 如月れんのCharacter relation・Tournament resultは追加Source確認まで保留。
- DB writeはApproval取得後に別工程で実施する。
