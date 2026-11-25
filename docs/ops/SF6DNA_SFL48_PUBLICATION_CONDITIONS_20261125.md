# SFL2026 48名の掲載条件と、本番IDへの動画紐づけ差分（2026-11-25）

- 対象ツリー: `5da63536` に 0001 → 0002 を適用したもの（`eb92dc4a…`、a3675c4 と同一）。コミットは作っていない。
- DB書き込み・公開設定変更は行っていない。
- 本番DBには接続していない。本番のstatusは既存資料 `docs/release-20260930-publication/PLAYER_PUBLICATION_AUDIT.json`（2026-09-30時点の読み取り専用スナップショット）で代用した。
- 開発DBは anon キーで読み取りのみ確認した（2026-11-25）。

## 選手ページが本番で表示される条件（コード上）

1. `NEXT_PUBLIC_SUPABASE_URL` が本番ref（wnuxaxbrpudyypzdbdho）であること。
2. 公開ゲート `src/lib/player-publication-gate.ts` に、その環境の UUID+slug が完全一致で登録されていること。登録先は `LEGACY_PRODUCTION_PUBLIC_PLAYERS`、`LEGACY_DEVELOPMENT_MIRROR_PLAYERS`、`INDIVIDUALLY_APPROVED_PLAYERS`（現在は空）のいずれか。
3. DBの行が `status = published` であること（`players.ts` のクエリ側で絞る）。
4. 補足欄が表示されるには、さらに各データ行が `APPROVED` であることが必要。プロフィール補足・関連動画・チーム成績は、いずれも環境＋実ID＋slug の一致でつながる。
   - ローカル確認スイッチは承認待ちの行を見せるだけで、1〜3の条件は解除しない。

## 集計（48名）

| 区分 | 人数 | 本番ページを止めている条件 |
|---|---|---|
| 公開ゲート登録済み・09-30時点で本番published | 9 | なし。補足データ（PENDING）の承認だけで表示される |
| 公開ゲート未登録・09-30時点で本番draft | 15 | 個別承認（ゲート追加）と本番statusの公開。2つとも別途承認が必要 |
| 公開ゲート未登録・09-30スナップショットに行なし | 24 | 個別承認と、本番の現在statusの確認（09-30以降に作成された行と推定。未確認） |

- 9名: sako, dogura, shuto, higuchi, yamaguchi, takepi, tokido, john-takeuchi, hinao
- 本番draft（09-30時点）15名: kobayan, kincho-terry, momochi, menard, hibiki, akira-cammy, torimeshi, 2bassa, gachikun, kawano, sahara-ed, itabashi-zangief, fuudo, jr, hikaru-aki
- スナップショットに行なし24名: ryukichi, fujimura, moke, bonchan, kazunoko, cosa, machabo, acqua, yanai, johnny, mago, mizuha, wabiichi, pugera, keib, nauman, seiya, raoyamu, otani, mocchi, daigo, yas, takagi, adelie
- 開発DB: anon で見える published は tokido だけ。開発の公開ゲートは本番と同じ9名（ミラー）。
- 個別承認に必要な材料（環境別UUID+slug）は、48名とも profile-supplements の identities にそろっている（本番・開発の両方）。
  - ゲートへの追加はコード変更になるため、承認後に別作業で行う。

## 本番IDへの動画紐づけ差分

### 7名（本番の動画バインディングが0件）

- `SF6DNA_SFL48_PROD_VIDEO_BINDING_PROPOSAL_7_20261125.json`（提案のみ。`video-bindings.json` には適用していない）

| 選手 | 本番ID | 追加候補 |
|---|---|---|
| 藤村（fujimura） | c39fec4d-0a0f-44e4-84df-32dd02d27df2 | 8 |
| かずのこ（kazunoko） | 724e15ca-09ca-4fe3-a88f-295ab096ee6e | 7 |
| cosa | ae813bdf-3bef-40b4-80b2-0c7c83476a40 | 5 |
| まちゃぼー（machabo） | c3669ee5-c426-426e-b7b4-fa59b36fa6ca | 8 |
| わびいち（wabiichi） | 538bb704-b076-4325-a81c-27a8f5d7ca21 | 7 |
| YAS（yas） | 8ab50c59-0968-4e27-a3ff-80319ec83cf0 | 7 |
| 高木（takagi） | 106e21de-1383-4dcb-ab09-4d0d7dc2c4ed | 4 |

計46行。

- 本番IDの出典は `team-bindings.json` の本番行のみ。
  - 初出は 52eddb3（2026-11-10「record SFL2026 environment-specific display identities」）。11/19 に本番実IDへ接続済みと記録されている。
  - 7名とも09-30スナップショットにない。そのため、適用前に本番DBの読み取りで「その UUID+slug の行が実在すること」を確認する必要がある（現環境では本番に未接続のため未確認）。
- 開発側のバインディングは既存のものがあるので、動画キーは開発と同じ。

### 一部だけ本番に紐づいている14名（参考）

- 開発だけにある72件は、提案JSONには含めていない。
- 内訳: moke 8, acqua 7, yanai 7, johnny 5, mago 4, mizuha 5, keib 5, nauman 5, seiya 3, raoyamu 5, otani 6, mocchi 4, daigo 4, adelie 4
- 11/19 の統合時の行のうち、開発のみのまま残っているもの。
- 同じ手順（本番IDの実在確認 → 提案 → 承認）で扱える。

## 全48名の一覧

| 選手 | 本番ゲート | 開発ゲート | 本番status（09-30時点） | 開発DB（anon可視） | プロフィール項目数 | 動画 本番/開発/行数 | 本番ページを止めている条件 |
|---|---|---|---|---|---|---|---|
| りゅうきち（ryukichi） | － | － | 行なし | － | 10 | 10/10/10 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| sako（sako） | ○ | ○ | published（SOURCE_REQUIRED） | － | 10 | 6/6/6 | なし（データ承認のみ） |
| 藤村（fujimura） | － | － | 行なし | － | 10 | 0/8/8 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| もけ（moke） | － | － | 行なし | － | 10 | 2/10/10 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| どぐら（dogura） | ○ | ○ | published（SOURCE_REQUIRED） | － | 9 | 14/14/14 | なし（データ承認のみ） |
| ボンちゃん（bonchan） | － | － | 行なし | － | 10 | 8/8/8 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| かずのこ（kazunoko） | － | － | 行なし | － | 10 | 0/7/7 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| Shuto（shuto） | ○ | ○ | published（SOURCE_REQUIRED） | － | 10 | 14/14/14 | なし（データ承認のみ） |
| cosa（cosa） | － | － | 行なし | － | 10 | 0/5/5 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| まちゃぼー（machabo） | － | － | 行なし | － | 10 | 0/8/8 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| こばやん（kobayan） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 6/6/6 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| きんちょ（kincho-terry） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 9/9/9 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| ももち（momochi） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 9/9/9 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| ひぐち（higuchi） | ○ | ○ | published（SOURCE_REQUIRED） | － | 10 | 16/16/16 | なし（データ承認のみ） |
| ヤマグチ（yamaguchi） | ○ | ○ | published（SOURCE_REQUIRED） | － | 10 | 6/6/6 | なし（データ承認のみ） |
| MenaRD（menard） | － | － | draft（SOURCE_REQUIRED） | － | 9 | 10/10/10 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| ACQUA（acqua） | － | － | 行なし | － | 10 | 5/12/12 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| ひびき（hibiki） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 8/8/8 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| あきら（akira-cammy） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 9/9/9 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| takepi（takepi） | ○ | ○ | published（SOURCE_REQUIRED） | － | 9 | 5/5/5 | なし（データ承認のみ） |
| ヤナイ（yanai） | － | － | 行なし | － | 10 | 2/9/9 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| ジョニィ（johnny） | － | － | 行なし | － | 9 | 2/7/7 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| 鶏めし（torimeshi） | － | － | draft（SOURCE_REQUIRED） | － | 9 | 9/9/9 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| 2BASSA（2bassa） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 8/8/8 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| ときど（tokido） | ○ | ○ | published（SOURCE_REQUIRED） | ○ | 10 | 11/11/11 | なし（データ承認のみ） |
| マゴ（mago） | － | － | 行なし | － | 10 | 2/6/6 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| 水派（mizuha） | － | － | 行なし | － | 10 | 1/6/6 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| わびいち（wabiichi） | － | － | 行なし | － | 10 | 0/7/7 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| ガチくん（gachikun） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 14/14/14 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| カワノ（kawano） | － | － | draft（SOURCE_REQUIRED） | － | 9 | 13/13/13 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| ぷげら（pugera） | － | － | 行なし | － | 10 | 14/14/14 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| さはら（sahara-ed） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 7/7/7 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| 板橋ザンギエフ（itabashi-zangief） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 7/7/7 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| KEI.B（keib） | － | － | 行なし | － | 10 | 2/7/7 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| ナウマン（nauman） | － | － | 行なし | － | 10 | 1/6/6 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| 竹内ジョン（john-takeuchi） | ○ | ○ | published（SOURCE_REQUIRED） | － | 10 | 13/13/13 | なし（データ承認のみ） |
| Seiya（seiya） | － | － | 行なし | － | 9 | 2/5/5 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| らおやむ（raoyamu） | － | － | 行なし | － | 10 | 5/10/10 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| 大谷（otani） | － | － | 行なし | － | 10 | 2/8/8 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| もっちー（mocchi） | － | － | 行なし | － | 10 | 2/6/6 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| ウメハラ（daigo） | － | － | 行なし | － | 10 | 3/7/7 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| ふ～ど（fuudo） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 11/11/11 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| YAS（yas） | － | － | 行なし | － | 10 | 0/7/7 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| ひなお（hinao） | ○ | ○ | published（SOURCE_REQUIRED） | － | 9 | 5/5/5 | なし（データ承認のみ） |
| 高木（takagi） | － | － | 行なし | － | 10 | 0/4/4 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| あでりい（adelie） | － | － | 行なし | － | 10 | 2/6/6 | 公開ゲート未登録（個別承認が必要）、2026-09-30本番スナップショットに行なし（現在のstatus未確認） |
| Jr.（jr） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 7/7/7 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |
| ひかる（hikaru-aki） | － | － | draft（SOURCE_REQUIRED） | － | 10 | 10/10/10 | 公開ゲート未登録（個別承認が必要）、本番status=draft（09-30時点） |

## 次の作業（承認が必要なもの）

1. 本番DBの読み取りで確認する: 24名の status と UUID、7名の UUID の実在。
2. 46行（＋任意で72行）の本番バインディングを `video-bindings.json` に追加する。データ変更なので承認後に行う。
3. 公開する選手を `INDIVIDUALLY_APPROVED_PLAYERS` に追加する（コード変更）。あわせて本番 status を published にする（DB書き込み）。
4. 補足データ（プロフィール・動画・チーム成績・キャラ動画）の `publicationApproval` を APPROVED にする。
