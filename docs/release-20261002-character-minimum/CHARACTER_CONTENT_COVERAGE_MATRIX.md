# Character Minimum Content Audit — 2026-10-02

開始RC / ⑫開始時SHA: `2e8500d38ef9010fc8fdcbab9526c0d0f36b7721`。統合ベース: `e67f38341fd6175266aca7c3dd081011776ab15f`（⑫の検証文書追加のみ、アプリ差分なし）。対象: `sf6dna-v2-chatgpt-rc-20260916`。

Supabase SELECTによるFresh取得: 2026-10-02T05:54:24.095443+00:00。DB全34キャラクターのうち公開・プレイ可能31を対象とした。追加3件は公開対象に含めていない。DBを書き換えていない。

## 結論

**Coverage監査と内部候補の選定は完了。公開可能なMinimum Setの完成ではない。** 全31で既存候補3Combo＋2Setupを選定したが、公開準備完了0件。COMPLETE_MINIMUM=0、PARTIAL=0、BLOCKED=31（重複なし）。候補が多いこと、Sourceがあること、reviewedであることはverifiedの証明にならない。

DB Combo総数1478（draft1213 / archived265 / published0）。draftはunverified1078・reviewed134・verified1。Setup総数924（draft792 / archived132 / published0）、draftはunverified703・reviewed89・verified0。Sequence607（draft475 / archived132 / published0）。唯一のverified ComboはKimberlyのModern Assist候補であり、今回の選定対象には含めていない。既存statusは変更していない。

選定93Combo / 62Setup / selected verified0 / publishable0。主な不足は、同一レシピのSource Relation、操作方式・通常ヒット/CH/PC、ゲージ条件、距離・起き上がり・タイミング、現行ゲームビルドでの再現証跡。さらにpublicStrategyContent=falseにより通常公開経路は遮断されている。

## 全31 Coverage

「選定」は既存下書きの検証候補であり、「準備完了」は条件・出典・現行パッチ・実機確認を満たす公開準備完了を指す。Video列は既存published Video entityのみ。

| Character | slug | Combo draft | DB verified draft | Combo選定 | Combo準備完了 | Combo公開 | Setup draft | DB verified draft | Setup選定 | Setup準備完了 | Setup公開 | 公開Video | 判定 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| リュウ | ryu | 77 | 0 | 3 | 0 | 0 | 66 | 0 | 2 | 0 | 0 | 2 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ルーク | luke | 48 | 0 | 3 | 0 | 0 | 33 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ジェイミー | jamie | 36 | 0 | 3 | 0 | 0 | 19 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| 春麗 | chun-li | 39 | 0 | 3 | 0 | 0 | 16 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ガイル | guile | 32 | 0 | 3 | 0 | 0 | 21 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| キンバリー | kimberly | 31 | 1 | 3 | 0 | 0 | 25 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ジュリ | juri | 33 | 0 | 3 | 0 | 0 | 21 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ケン | ken | 35 | 0 | 3 | 0 | 0 | 26 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ブランカ | blanka | 36 | 0 | 3 | 0 | 0 | 22 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ダルシム | dhalsim | 35 | 0 | 3 | 0 | 0 | 21 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| エドモンド本田 | e-honda | 35 | 0 | 3 | 0 | 0 | 22 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ディージェイ | dee-jay | 40 | 0 | 3 | 0 | 0 | 35 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| マノン | manon | 31 | 0 | 3 | 0 | 0 | 23 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| マリーザ | marisa | 42 | 0 | 3 | 0 | 0 | 36 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| JP | jp | 30 | 0 | 3 | 0 | 0 | 9 | 0 | 2 | 0 | 0 | 1 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ザンギエフ | zangief | 56 | 0 | 3 | 0 | 0 | 29 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| リリー | lily | 52 | 0 | 3 | 0 | 0 | 28 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| キャミィ | cammy | 41 | 0 | 3 | 0 | 0 | 25 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ラシード | rashid | 37 | 0 | 3 | 0 | 0 | 24 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| A.K.I. | aki | 38 | 0 | 3 | 0 | 0 | 26 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| エド | ed | 39 | 0 | 3 | 0 | 0 | 24 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| 豪鬼 | akuma | 36 | 0 | 3 | 0 | 0 | 23 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ベガ | m-bison | 37 | 0 | 3 | 0 | 0 | 24 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| テリー | terry | 38 | 0 | 3 | 0 | 0 | 24 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| 不知火舞 | mai | 39 | 0 | 3 | 0 | 0 | 25 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| エレナ | elena | 41 | 0 | 3 | 0 | 0 | 25 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| サガット | sagat | 35 | 0 | 3 | 0 | 0 | 22 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| C.ヴァイパー | c-viper | 34 | 0 | 3 | 0 | 0 | 23 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| アレックス | alex | 34 | 0 | 3 | 0 | 0 | 23 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| イングリッド | ingrid | 38 | 0 | 3 | 0 | 0 | 26 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |
| ヤスミン | yasmine | 38 | 0 | 3 | 0 | 0 | 26 | 0 | 2 | 0 | 0 | 0 | BLOCKED_BY_EVIDENCE / PUBLICATION |

## 関連動画

既存90Video中published3、draft87。公開Relationに基づくRyu2 / JP1のみであり、新規動画追加やタイトルによる関連付けは行っていない。Lukeには別モデルの既存Source Video Reference1件が表示されるため、published Video3件と混ぜない。Luke参照は2026.08.03より古く、攻略の現行成立を保証しない。

- Ryu: https://www.youtube.com/watch?v=iAs1p3LVdAs （公式概要、現行フレーム値の根拠にはしない）
- Ryu: https://www.youtube.com/watch?v=kWS3zqOINUU （既存レビュー済みガイド、各レシピの現行再現は別確認）
- JP: https://youtube.com/live/6-LsC5hynes （大会参照、Combo/Setupの成立証明にはしない）
- Luke Source Reference: https://www.youtube.com/watch?v=VTWNWpdNyWc （guide_reference、旧パッチ）

31全体のRelation metadataを監査。YouTubeへの実遷移はRyu公式CTAで確認した。残りの個別動画について再生完了・全タイムスタンプ分析は実施していない。

## 監査範囲と次段階

Source661件・Combo/Setup Relation4724件のmetadataを取得。今回選定に関係するSource115件を検証結果に記録。本文を確認したのは4ガイドのみであり、31全件の本文照合を完了したとは扱わない。DB current patch=2026.08.03はDB基準値であり、実機最新ビルドの証明ではない。既知403の公式Patch URL/取得経路は再試行していない。

優先順はJP/Ryu/Lukeの基本各1件をSource条件まで閉じる→まとめて実機検証→他28キャラクター。Public gate / DB publish / verified昇格は別承認と証跡が必要。未確認情報で空欄を埋めていない。
