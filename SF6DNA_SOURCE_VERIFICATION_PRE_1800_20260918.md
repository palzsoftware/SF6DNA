# Source Verification — Pre 18:00

基準RC: `15f0a9496c327b00252ba9c0980d6003ed8019ae`。read-only。DB・公開状態変更なし。

## 結論

- Source route coverageは28/28を維持。
- JP公開V2の曖昧表現2件は、`トルバラン／トリグラフ／ヴィーハト`を使う具体表現へ解消済み。
- 旧migration内の「地面からの攻撃」は履歴として残るため、承認済みDB copy更新候補へ隔離。
- Source URLだけを理由にゲーム事実をverified/publishedへ昇格した項目は0件。
- Patch直接影響29件とGeneric 85件は、claim-level原票が現RC内にないため件数を推測削減しない。

## Claim-level分類

| Claim group | Classification | Result |
|---|---|---|
| Character route source groups | `SOURCE_SUPPORTS_PARTIAL` | 28/28。route到達性は確認済みだが、URL存在だけで全claimを保証しない |
| JP vague public copy | `SOURCE_RESOLVED` | 2表現。現行V2コードと回帰テストで確認 |
| Legacy JP DB copy | `NEEDS_CROSSCHECK` | 公開経路ではない。DB承認差分に登録 |
| Patch-direct gameplay | `GAME_VERIFICATION_REQUIRED` | 29 claims / 8 sessionsを維持 |
| Generic gameplay | `GAME_VERIFICATION_REQUIRED` | 85 claims。原票取込み前の削減禁止 |
| Video解説内のcombo/setplay | `SOURCE_SUPPORTS_PARTIAL` | 動画公開確認とレシピ検証を分離 |
| Player/video relation | `SOURCE_SUPPORTS_PARTIAL` | exact ID・本人/公式cross-referenceが揃ったものだけ候補化 |

## 土日負荷の圧縮

件数の虚偽削減は行わず、実行単位を整理した。直接影響29件は既存8 sessionを維持し、Generic 85件は原票取込み後に同一キャラ・同一条件でまとめる。Web Sourceだけでゲーム内再現を代替しない。

