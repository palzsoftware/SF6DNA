# Ver.1.0 技紹介テンプレート・Ryu/JP文言監査（2026-09-24）

対象は RC `57837c5732592b1a41be7e8cfbdf8a45cdb9ec3b` の Preview fixture。今回、技の説明文・Motion Media・DB は変更していない。データはすべて draft で、各 Move に結び付く Source は fixture から確認できない。フレームの `verified` フラグだけで用途や性能まで裏付けられたとは扱わない。

## 一画面の技紹介テンプレート

| 順序 | 項目 | 表示条件 |
|---|---|---|
| 1 | 技名 | canonical Move と一致する場合 |
| 2 | 動作映像 | move ID と variant を実機映像で照合した Preview 素材のみ。未照合なら表示しない |
| 3 | クラシック / モダン入力 | 実在する入力だけを表示。片方がない場合、他方から推測しない |
| 4 | 発生 / ガード時 / ダメージ | 対象パッチと確認状態を同じ場所で示す。未確認値は「確認中」 |
| 5 | 用途 | 出典または実機確認済みの短い一文のみ |
| 6 | 使いやすい場面 | 実戦条件が検証済みのときだけ表示 |
| 7 | 注意点 | 無敵、確反、キャンセル、ヒット条件などを検証できた場合のみ表示 |
| 8 | 情報源 | 個別の技・主張に結び付く出典名と行き先。単なるサイト名で公式扱いしない |

未確認欄は空欄のまま公開しない。代わりに画面側の既存の「確認中」を使う。CAPCOM公式の文章、競合の表や用途文は転記・言い換えしない。

## 判断区分

- `SAFE_COPY`: 技名・存在する入力方式など、既存構造から転記可能な事実だけ。候補であり公開承認ではない。
- `SOURCE_REQUIRED`: 技の性能、使用場面、パッチ依存の数値。個別根拠と公開ゲートが必要。
- `HUMAN_REVIEW`: 日本語の自然さとゲーム内での意味を人が照合する既存用途文。
- `DO_NOT_PUBLISH`: 内部プレースホルダーや、性能を推測している可能性のある未検証文。

## 集計

| 対象 | Move | draft | フレーム verified | クラシック入力 | モダン入力 | 既存日本語用途文 | 内部プレースホルダー |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ryu | 57 | 57 | 57 | 57 | 51 | 57 | 20 |
| JP | 59 | 59 | 59 | 59 | 55 | 0 | 0 |

`SAFE_COPY` の短文候補は技の性能を言わない「立ち弱Pの入力はクラシックで弱Pです。」のような事実の組み合わせに限る。ただしそのまま量産・公開しない。説明として有益な用途は、個別 Source と実機確認後に書き起こす。Ryu の既存用途文には「割り込み」「対空」「キャンセル」「コンボ」などの主張が含まれるため、今回の SAFE_COPY には入れない。

Ryu SA1/SA2 と JP アムネジアの映像対応は別Media監査で保留され得る。媒体があることを性能や用途文の根拠にはしない。SA3 と CA のように同じ Move の状態差は variant と条件を分けて表示する。

## 全 Move の文言仕分け

次表の判定は用途説明に対するもの。全行の技名と既存入力は `SAFE_COPY` 候補、数値や性能主張は個別 Source 確認が必要。掲載状態は全行 draft のまま。

| Character | Move slug | 技名 | 用途文判定 | 理由 / 次の確認 |
|---|---|---|---|---|
| RYU | `ryu-standing-lp` | 立ち弱P（ジャブ） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-standing-lk` | 立ち弱K（ローキック） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-standing-mp` | 立ち中P（鉤突き） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-standing-mk` | 立ち中K（横蹴り） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-standing-hp` | 立ち強P（正拳突き） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-standing-hk` | 立ち強K（後ろ回し蹴り） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-crouching-lp` | しゃがみ弱P（ジャブ） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-crouching-lk` | しゃがみ弱K（キック） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-crouching-mp` | しゃがみ中P（ストレート） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-crouching-mk` | しゃがみ中K（くるぶしキック） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-crouching-hp` | しゃがみ強P（突き上げアッパー） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-crouching-hk` | しゃがみ強K（回転足払い） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-jump-lp` | ジャンプ弱P（肘落とし） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-jump-lk` | ジャンプ弱K（ひざ蹴り） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-jump-mp` | ジャンプ中P（すくい突き） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-jump-mk` | ジャンプ中K（飛び蹴り） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-jump-hp` | ジャンプ強P（ストレート） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-jump-hk` | ジャンプ強K（跳び前蹴り） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-collarbone-breaker` | 鎖骨割り | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-solar-plexus-strike` | 鳩尾砕き | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-back-hp` | 後ろ強P（Short Uppercut） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-back-hk` | 後ろ強K（Axe Kick） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-forward-hk` | 前強K（Whirlwind Kick） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-target-hp-hk` | 強P→強K ターゲットコンボ | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-fuwa-triple-strike` | 中P→弱K→強K（Fuwa Triple Strike） | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-l-hadoken` | 弱 波動拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-m-hadoken` | 中 波動拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-h-hadoken` | 強 波動拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-denjin-hadoken` | [電刃錬気] 波動拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-od-hadoken` | OD 波動拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-denjin-od-hadoken` | [電刃錬気] OD 波動拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-l-shoryuken` | 弱 昇龍拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-m-shoryuken` | 中 昇龍拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-h-shoryuken` | 強 昇龍拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-od-shoryuken` | OD 昇龍拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-l-tatsumaki` | 弱 竜巻旋風脚 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-m-tatsumaki` | 中 竜巻旋風脚 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-h-tatsumaki` | 強 竜巻旋風脚 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-od-tatsumaki` | OD 竜巻旋風脚 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-l-high-blade-kick` | 弱 上段足刀蹴り | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-m-high-blade-kick` | 中 上段足刀蹴り | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-h-high-blade-kick` | 強 上段足刀蹴り | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-od-high-blade-kick` | OD 上段足刀蹴り | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-l-hashogeki` | 弱 波掌撃 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-m-hashogeki` | 中 波掌撃 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-h-hashogeki` | 強 波掌撃 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-od-hashogeki` | OD 波掌撃 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-denjin-charge` | 電刃錬気 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-denjin-hashogeki` | [電刃錬気] 波掌撃 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-denjin-od-hashogeki` | [電刃錬気] OD 波掌撃 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-sa1-shinku-hadoken` | SA1 真空波動拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-sa2-shin-hashogeki` | SA2 真・波掌撃 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-sa3-shin-shoryuken` | SA3 真・昇龍拳 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-aerial-tatsumaki` | 空中竜巻旋風脚 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-od-aerial-tatsumaki` | OD 空中竜巻旋風脚 | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-forward-throw` | 前投げ | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| RYU | `ryu-back-throw` | 後ろ投げ | HUMAN_REVIEW | 既存用途文の意味・実機・個別Sourceを照合 |
| JP | `jp-standing-lp` | 立ち弱P（ノーシ） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-standing-lk` | 立ち弱K（ニージニイ・ウダール） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-standing-mp` | 立ち中P（シュトゥールム） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-standing-mk` | 立ち中K（ウームヌィ・ウダール） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-standing-hp` | 立ち強P（キンターヴル） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-standing-hk` | 立ち強K（オボロートニ） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-crouching-lp` | しゃがみ弱P（ブィストルイ・ウダール） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-crouching-lk` | しゃがみ弱K（リョーフキー・ウダール） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-crouching-mp` | しゃがみ中P（ズミヤー） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-crouching-mk` | しゃがみ中K（ズローバ） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-crouching-hp` | しゃがみ強P（マリートヴァ） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-crouching-hk` | しゃがみ強K（ジョーキル） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-guillotine` | ギリオチーナ | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-shalosti` | シャーロスチ | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-back-mp` | 後ろ中P / Back + Medium Punch | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-jump-lp` | ジャンプ弱P（ルイースイ） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-forward-hk` | 前強K（Bylina） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-grom-strelka` | グローム・ストレルカ | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-jump-lk` | ジャンプ弱K（ヴァローナ） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-jump-mp` | ジャンプ中P（ローシャッチ） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-zilant` | ジラント | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-jump-mk` | ジャンプ中K（コンダ） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-zilant-mid` | ジラント・ミドル | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-jump-hp` | ジャンプ強P（イディナローク） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-zilant-low` | ジラント・ロー | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-jump-hk` | ジャンプ強K（ジャール・プチーツァ） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-triglav-l` | 弱 トリグラフ / Triglav | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-triglav-m` | 中 トリグラフ / Triglav | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-triglav-h` | 強 トリグラフ / Triglav | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-triglav-od-l` | OD 弱 トリグラフ / Triglav | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-triglav-od-m` | OD 中 トリグラフ / Triglav | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-triglav-od-h` | OD 強 トリグラフ / Triglav | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-stribog-l` | 弱 ストリボーグ / Stribog | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-stribog-m` | 中 ストリボーグ / Stribog | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-stribog-h` | 強 ストリボーグ / Stribog | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-stribog-od` | OD ストリボーグ / Stribog | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-departure-l` | 弱 ヴィーハト / Departure | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-departure-m` | 中 ヴィーハト / Departure | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-departure-h` | 強 ヴィーハト / Departure | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-departure-od-l` | OD 弱 ヴィーハト / Departure | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-departure-od-m` | OD 中 ヴィーハト / Departure | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-departure-od-h` | OD 強 ヴィーハト / Departure | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-departure-window` | ヴィーハト・アクノ / Departure > Window | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-departure-shadow` | ヴィーハト・チェーニ / Departure > Shadow | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-amnesia` | アムネジア / Amnesia | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-amnesia-od` | OD アムネジア / Amnesia | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-torbalan-l` | 弱 トルバラン / Torbalan | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-torbalan-m` | 中 トルバラン / Torbalan | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-torbalan-h` | 強 トルバラン / Torbalan | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-torbalan-od` | OD トルバラン / Torbalan | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-embrace` | エンブレイス / Embrace | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-embrace-od` | OD エンブレイス / Embrace | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-sa1` | チェルノボーグ / Chornobog（SA1） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-sa2` | ラヴーシュカ / Lovushka（SA2） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-sa3` | ザプリェット / Interdiction（SA3） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-ca` | ザプリェット / Interdiction（CA） | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-forward-throw` | 前投げ | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-back-throw` | 後ろ投げ | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |
| JP | `jp-tornado` | トルネード / Tornado | SOURCE_REQUIRED | 用途文なし。技別のSourceと実機確認が必要 |

## 10/3 までの差別化優先順位

既存競合調査（`SF6DNA_VER1_COMPETITOR_RESEARCH_20260924.md`）を基にした実装上の優先順位。競合にも技表、動画、初心者向け説明、練習メニューは存在する。

1. 診断結果から課題と「今日の15分練習」へ迷わず進めることを375px/PCで検証する。
2. 技名・映像・入力を誤対応なく示す。未確認mappingは保留する。
3. 初心者向け用途は個別根拠のある技から短く書く。未verified文を一括公開しない。
4. 情報源リンクは行き先が分かる名前で示し、Player/Videoへの導線を残す。

この順位は競合の優劣やモバイル操作性の実測を示すものではない。競合調査は公開ページの本文・構造を中心に行われ、全キャラと実機操作は未検証。
