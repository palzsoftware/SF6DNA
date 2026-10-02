# Device / Game QA Handoff

## 今回の判定

31キャラクターの選定93Combo / 62Setupは内部検証候補。**条件が確定していないため全155件をそのまま実行するQA Packにはしない。** 録画待ちで候補準備を止めていないが、録画なしとVerificationなしは別問題。公開可能Minimum0、ゲーム検証未実施。全31の詳細候補・Input・条件・Source IDはCOMBO_SETUP_VERIFICATION_RESULT.mdにまとまっている。

## 次の単一アクション

**JP / Ryu / Lukeの基本Combo各1件について、Source Relationと不足条件を先に閉じる。**

- JP `jp-canon-5mk-1800`: 5MK→中ストリボーグの本文対応は確認。通常ヒット/CH/PC、操作方式、距離、現行ビルドを確認する。
- Ryu `ryu-basic-light-shoryu`: 小技→強昇龍の本文対応は確認。始動距離、操作方式、通常ヒット条件、ゲージ表現のNULLを解決する。
- Luke `luke-light-l-flash`: 2LP×3→214LPの本文対応は確認。近距離成立範囲、操作方式、ヒット条件、現行ビルドを確認する。

DBゲージNULLを「0」と推定しない。記録されたnotationに技強度/締め分岐が足りなければSource照合で明文化する。Sourceが不足した候補はSOURCE_RESEARCH_REQUIRED、実行条件不明のままユーザーに試行を要求しない。本人の実機ビルドがDB2026.08.03と異なる場合は互換性を先に確認。

## 条件確定後のBatch QA（提案プロトコル、ゲーム性能の断定ではない）

キャラクター単位でまとめ、1Comboごとに往復確認しない。各Record IDに以下を記録する。

| 項目 | 記録するもの |
| --- | --- |
| Build | ゲーム版・日付、根拠Source版 |
| Training setup | 自キャラ・相手・操作方式、左右、開始位置/距離 |
| Resource | Drive、SA、固有資源の開始値・消費値 |
| Hit | 通常/CH/PCを区別、ガードと自動回復設定 |
| Combo steps | 確定済みInputをそのまま実行、必要ならタイミング |
| Expected | コンボ継続・締め・ダウン等、Sourceで確定した結果のみ |
| Combo pass | 同一条件で5回連続再現でき、条件の記録がある（QA基準として提案） |
| Combo fail | 確定条件で継続しない/結果が違う。Inputミスと条件不足を分ける |
| Setup | ダウン源、距離、前/後受け身、タイミング、相手応答を固定 |
| Setup pass | 記録した状況・行動・狙いが再現。無敵技/ジャンプ等の検証範囲を明示 |
| Setup hold | 不明条件・相手差・応答差が残る。safe jump/meaty/frame killと断定しない |
| Evidence | Record ID、条件、結果、実施日。画面記録や動画は必要範囲のみ、Motion Media化は不要 |

距離・タイミング・受け身・相手条件がUNCONFIRMEDならPass/Failを採点せずHOLD。既存候補の「持続重ね」「安全」等の原題を期待結果として無条件採用しない。ダメージNULLに新しい推測値を入れない。Source→Game再現→独立レビューを経てもDB昇格/公開Gate変更は本Batch外。

## Device QA

実施済み: desktop6キャラ、通常公開候補の漏出なし、Ryu専用Combo route404、Ryu Light/Dark切替、Ryu公式YouTubeへのCTA遷移。Mobile実機/375pxはMOBILE_NOT_VERIFIED。Browser再生完了・全動画内容検証は未実施。

今回UI/code変更なしのため新しいUser Device QAは要求しない。後続で公開内容を導入する時はJP/Ryu/Luke＋データ量の違うキャラを375pxで、notation折り返し、長文、横overflow、動画CTA、Light/Dark確認する。自動確認できた項目を繰り返しユーザーへ依頼しない。

## 維持する境界

MOTION_MEDIA_REQUIRED=NO。JP_SA2_MEDIA=MEDIA_INPUT_REQUIRED（⑬対象外）。Chibi生成・Production昇格なし。Daily15/Practice History/Retention storage変更0。DB_WRITE=0。PUBLIC_BOUNDARY_CHANGE=0。GAME_FACT_CHANGE=0。Release status=NO-GO。

必要な最終承認は、証跡が揃った後のDB/公開契約変更の別Batchで扱う。現在の根拠不足をGate解除で回避しない。
