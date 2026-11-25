# SFL2026 48名の掲載条件の確定と、公開に必要な変更（2026-11-25）

- 作業ツリー: E専用worktree `a3675c4`（未コミット）。
- 本番DBは Supabase コネクタで、`BEGIN TRANSACTION READ ONLY` 内の SELECT だけを実行した。2026-11-25時点の値。
- 公開状態の変更、ゲートへの追加、データの承認、SNS SQL の実行、コミット、Push、デプロイは行っていない。

## 1. 本番DBとの照合（48名）

- 48名とも、本番DBの `players` の id と slug が、コード側（profile-supplements・team-bindings）の本番IDと完全一致した。slug の重複・不一致はない。
- status:
  - published 9名: sako, dogura, shuto, higuchi, yamaguchi, takepi, tokido, john-takeuchi, hinao
  - draft 39名
  - 09-30スナップショットになかった24名は、現在 draft で存在する（updated_at 2026-11-04）。
- 本番DBの SNS 列: shuto（3種）、higuchi（YouTube・X）、dogura（Twitch・X）、tokido（X）、yamaguchi（X）以外は空。
- コード側の掲載条件は、本番ref・公開ゲート（UUID+slug の完全一致）・status=published の3つ。補足欄はさらに各データ行が APPROVED であることが必要。
  - 公開ゲートには published の9名が登録済み。draft の39名は未登録。

| 選手 | 本番status | ゲート | 本番紐づけ/動画行 | 公開に必要な変更 |
|---|---|---|---|---|
| りゅうきち（ryukichi） | draft | － | 10/10 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| sako（sako） | published | ○ | 6/6 | profile-supplements 承認、関連動画 承認 |
| 藤村（fujimura） | draft | － | 0/8 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 8件 |
| もけ（moke） | draft | － | 2/10 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 8件 |
| どぐら（dogura） | published | ○ | 14/14 | profile-supplements 承認、関連動画 承認 |
| ボンちゃん（bonchan） | draft | － | 8/8 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、SNS保留の解除（相互リンク確認済み） |
| かずのこ（kazunoko） | draft | － | 0/7 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 7件、SNS保留の解除（相互リンク確認済み） |
| Shuto（shuto） | published | ○ | 14/14 | profile-supplements 承認、関連動画 承認 |
| cosa（cosa） | draft | － | 0/5 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 5件 |
| まちゃぼー（machabo） | draft | － | 0/8 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 8件 |
| こばやん（kobayan） | draft | － | 6/6 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| きんちょ（kincho-terry） | draft | － | 9/9 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| ももち（momochi） | draft | － | 9/9 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| ひぐち（higuchi） | published | ○ | 16/16 | profile-supplements 承認、関連動画 承認 |
| ヤマグチ（yamaguchi） | published | ○ | 6/6 | profile-supplements 承認、関連動画 承認 |
| MenaRD（menard） | draft | － | 10/10 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| ACQUA（acqua） | draft | － | 5/12 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 6件（＋表示に影響しない1件） |
| ひびき（hibiki） | draft | － | 8/8 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| あきら（akira-cammy） | draft | － | 9/9 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| takepi（takepi） | published | ○ | 5/5 | profile-supplements 承認、関連動画 承認 |
| ヤナイ（yanai） | draft | － | 2/9 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 5件（＋表示に影響しない2件） |
| ジョニィ（johnny） | draft | － | 2/7 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 4件（＋表示に影響しない1件）、マリーザ対戦行の追加（提案済み） |
| 鶏めし（torimeshi） | draft | － | 9/9 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| 2BASSA（2bassa） | draft | － | 8/8 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| ときど（tokido） | published | ○ | 11/11 | profile-supplements 承認、関連動画 承認 |
| マゴ（mago） | draft | － | 2/6 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 4件 |
| 水派（mizuha） | draft | － | 1/6 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 4件（＋表示に影響しない1件） |
| わびいち（wabiichi） | draft | － | 0/7 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 7件、クリップカード追加（提案済み） |
| ガチくん（gachikun） | draft | － | 14/14 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| カワノ（kawano） | draft | － | 13/13 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、クリップカード追加（提案済み） |
| ぷげら（pugera） | draft | － | 14/14 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| さはら（sahara-ed） | draft | － | 7/7 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| 板橋ザンギエフ（itabashi-zangief） | draft | － | 7/7 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、マリーザ対戦行の追加（提案済み） |
| KEI.B（keib） | draft | － | 2/7 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 5件 |
| ナウマン（nauman） | draft | － | 1/6 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 5件 |
| 竹内ジョン（john-takeuchi） | published | ○ | 13/13 | profile-supplements 承認、関連動画 承認 |
| Seiya（seiya） | draft | － | 2/5 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 3件 |
| らおやむ（raoyamu） | draft | － | 5/10 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| 大谷（otani） | draft | － | 2/8 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 6件 |
| もっちー（mocchi） | draft | － | 2/6 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 4件 |
| ウメハラ（daigo） | draft | － | 3/7 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 4件 |
| ふ～ど（fuudo） | draft | － | 11/11 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |
| YAS（yas） | draft | － | 0/7 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 7件、クリップカード追加（提案済み） |
| ひなお（hinao） | published | ○ | 5/5 | profile-supplements 承認、関連動画 承認 |
| 高木（takagi） | draft | － | 0/4 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 4件 |
| あでりい（adelie） | draft | － | 2/6 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、本番紐づけ追加 4件 |
| Jr.（jr） | draft | － | 7/7 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認、クリップカード追加（提案済み） |
| ひかる（hikaru-aki） | draft | － | 10/10 | ゲート追加（INDIVIDUALLY_APPROVED_PLAYERS）、本番status draft→published、profile-supplements 承認、関連動画 承認 |

## 2. 本番IDへの動画紐づけ差分（提案: `SF6DNA_SFL48_PUBLICATION_PROPOSAL_20261125.json`）

- 7名・46件:
  - 本番ID 7件はいずれも本番DBで実在を確認した（id・slug 一致、draft）。
  - 46件すべて、出演確認済み（relationConfirmed）・大会対戦・根拠あり。本番側との重複はない。そのまま追加候補とする。
- 14名・72件:
  - 掲載基準を満たし重複のない追加候補は62件。
  - 10件は、同じ試合の単試合クリップがすでに本番に紐づいているフル配信。追加しても1カードにまとまるため、表示件数は増えない（任意）。

## 3. Bの確認結果（SF6DNA_SFL48_ADD2_20261125.csv）との照合

- 未登録クリップ2本（e-V2iILIsUQ、86lnoMqGvIs）:
  - B が公式タイトル・公開日・概要欄の本配信リンク（BDKiKN1KD0s）で確認済み。jr・yas・wabiichi・kawano の4カードを提案JSONに用意した。
  - わびいち×カワノは映像でもキャラを確認済み。Jr.×YAS はタイトルで確認。
  - B は「既存登録済みID」としているが、このリポジトリの動画データと本番DBの videos（90件）には存在しない。新規追加として扱う。
- 対戦動画が不足する3キャラ:
  - マリーザ: SFL48 の johnny（goaaIfjiP7c）と板橋ザンギエフ（lzINQNblcww）の公式SFL2025対戦がある。選手の対戦行として追加すれば、キャラの対戦欄も埋まる。
    - johnny の行は概要欄の節表記がタイトルと食い違うため、節情報は HOLD。
  - アレックス: HotDog29（48名対象外）の SFL EMEAA 2026 公式対戦が2本。
    - 選手に紐づけず、キャラページだけに出すには、registered.json に「対戦」区分を足すコード変更が必要。
  - ヤスミン: 候補2本はいずれも主催者公式チャンネルか未確認のため HOLD。プロ公式大会のヤスミン対戦は見つかっていない。
- SNS:
  - ボンちゃん・かずのこは、YouTube・Twitch・X の相互リンクで本人の値が確定した（SFL公式データ側の入れ替わりは誤登録）。保留の解除案を提案JSONに入れた。
  - SNS SQL 提案ファイルは、この結果をまだ反映していない（実行もしていない）。

## 4. 現在の掲載条件で見える件数と、承認後の見込み

| 項目 | 現在（本番） | 承認後の見込み |
|---|---|---|
| 選手ページ | 9/48（ゲート登録済み＋published） | 48/48（39名をゲートに追加し、published にした場合） |
| プロフィール補足 | 0/48（全件 PENDING） | 48/48（本番ID 48件の一致を確認済み） |
| 関連動画 | 0/48（全件 PENDING） | 現データのままなら 41/48。7名・46件の本番紐づけを追加すれば 48/48 |
| キャラ解説 | 0/32 | 32/32 |
| キャラ対戦 | 0/32 | 29/32。マリーザ2行で 30/32。アレックスはキャラ単独掲載のコード変更で 31/32。ヤスミンは HOLD |

- 実画面での確認:
  - ローカル（開発DB・確認スイッチON）で 1/48（tokido）のプロフィールと関連動画を表示確認した。
  - キャラページは開発DBで、解説 31/32・対戦 28/32 を表示確認した（arjun は開発DBで404）。
  - 本番サイトの画面は確認していない。
  - 承認後の見込みは、承認済みコピーをメモリ上で描画した結果と、本番DBの照合からの推定。
