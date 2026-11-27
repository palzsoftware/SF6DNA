# SF6DNA V45（Claude B）動画の実表示件数確認・最終接続（2026-11-27）
基準SHA: Preview 074ecc69a4fe8dc9514fca4ece5415b1b017a015（palzsoftware/sf6dna ブランチ sf6dna-v1-rc-qa-20261127、dpl_7RKtDXMh71bAj3mEKfksFJ6gHDSu）。クラウド候補 e7a6c9d は動画・Playerデータの変更なし（V38〜V41の差分はdocs/SQL/診断のみ）。
DB: 開発・本番とも読み取りのみ。共有DB書込・Push・Deploy・本番変更・公開昇格なし。

## 1. 動画リストの件数（データ保有数・公開可能数・実表示数を分けて記載）
表示の仕組み（v2-web/src/app/videos/page.tsx, src/lib/registered-youtube-videos.ts）: 掲載動画 = DBの published 動画 ＋ 登録YouTubeデータ（videos.json＋registered.json）のうち publicationApproval=APPROVED の行。PENDING行はサーバー側で除外（ローカルのloopbackプレビュー時のみ表示）。1枚=YouTube ID単位。初期12件表示＋「さらに12件表示」。

| 項目 | 開発DB環境（Preview） | 本番DB環境 |
|---|---|---|
| 登録データ: player行 / キャラ行 | 1,038 / 440 | 同左 |
| 登録データの関連付け（video-bindings） | 1,037 | 1,036（計2,073） |
| 重複を除いた動画本数（登録データ） | 774 | 774 |
| DBの videos | 14（published 1） | 90（published 3、一意90） |
| 公開条件を満たす本数 | 登録データ0（全件PENDING）＋DB 1 | 登録データ0＋DB 3 |
| **実表示カード数** | **1（Previewで「1件中 1件を表示」を確認・ELqbxdcNeeE）** | 3（DBのみ。未デプロイのため画面未確認） |
| 承認された場合に表示されるカード数（現データ） | 772 | 773 |
| 同上・V45取り込み後 | 825 | 831 |

- 実表示のキャラ別・Player別・カテゴリ別: 登録データ由来は全キャラ0本（32キャラすべて0）。Preview実表示の1本は ELqbxdcNeeE（解説・キャラ/Player関連なし）。本番DBのpublished関連は jp 1本・ryu 2本。
- 非表示理由（登録データ・本番環境）: player行の公開承認PENDING 1,038、キャラ行の公開承認PENDING 440。承認後も残る非表示: 同じ試合のクリップに統合されるフル配信256、クリップ重複13、Player ID紐付けなし2（開発は1、＋開発DBにアルジュン無し扱いのキャラ行4）。
- 承認された場合のキャラ別本数は count_wnux_if_approved.json / after_wnux_if_approved.json（少ない順: ヤスミン9、本田11、マリーザ11、マノン12、A.K.I.13、アレックス13、イングリッド15、リリー16、ジュリ18、アルジュン19）。0本のキャラは本番環境では無し（開発環境はアルジュンのみ0、character-ids.json の developmentMissing による）。
- Player別（承認時）: 56名（本番）／57名（開発）。カテゴリ別（承認時・本番）: 対戦491・解説186・ランクマ/リプレイ96。

## 2. 既存動画の接続改善（V43 22本・V44 68本）
- V43 22本はdocs側の候補（docs/v26/player14-video-candidates.json）で、製品データとの重複は qIXTVR9f8os の1本のみ（製品に既存）。
- V44 68本のうち10本は製品データに既存 → 除外。残り58本を registered.json 形式（キャラ単位・playerSlug=null・解説・PENDING）で追加候補にした。**Player IDが無くてもキャラ単位の行は既存仕様で表示できる**（承認後）。
- 選手の使用キャラとしては扱わない（category=解説、playerSlug=null）。時刻はチャプター由来（映像未視聴）と evidenceBasis に記載。ACQUAチャンネルは運営者未確定と記載。
- 取り込み後（承認された場合）: マリーザ11→19、ヤスミン9→17、本田11→20、イングリッド15→18、アルジュン19→24、アレックス13→21、マノン12→15、キンバリー33→41、ディージェイ32→38。

## 3. Player図鑑・大会実績
- 追加14名のプロフィール補完: V44の delta_profile_supplements_14_v44.json を維持（Broski・Luffy・XianはPlayer IDなし＝保留）。
- SFL48名の既存317行の製品反映状態（profile-supplements.json と照合）: 修正候補261行のうち190行は反映済み・71行は未反映、点検済み38行（変更不要）、確認待ち10行、保留8行。
- 大会実績10件: 大会ID・Player IDは開発DBの実値（11/27読み取り）。順位根拠はV44のとおり。復旧SQLは追加10行の (tournament_id, player_id, placement, note LIKE 'V44 %') に限定（既存61行に該当noteは0件を確認）。EWC2026 Hibiki はHOLD維持。

## 4. 軽微修正
profile-supplements-cviper-v45.patch（「舞6、Cヴァイパー1」→「舞6、C.ヴァイパー1」1か所）。074ecc6 に git apply --check 成功。

## 区分
- 実装候補: delta_character_videos_v45.json（58行）、profile-supplements-cviper-v45.patch、delta_video_v43.json（sourceDate・出演確認）
- 承認待ち: tournament_results_v45_apply.sql（開発DB）、全動画の公開承認、Xian draft登録
- 未接続: V43の22本（docs候補のまま・製品の videos.json 未登録）、14名プロフィール、SFL48未反映71行
- HOLD: Hibiki、Broski・Luffy、推定順位4件、大会IDのない大会、ACQUAチャンネルの運営者

## 適用順序
1. git apply profile-supplements-cviper-v45.patch
2. python3 apply_v43.py docs/v26/player14-video-candidates.json delta_video_v43.json <出力>（docs候補の更新）
3. python3 apply_v45.py v2-web/src/data/character-videos/registered.json delta_character_videos_v45.json <出力> → 内容確認後に置き換え
4. （承認後）開発DBで tournament_results_v45_apply.sql、戻す場合は tournament_results_v45_rollback.sql
5. python3 test_v45.py、件数確認は python3 count_videos.py <v2-web> <environment> actual|if_approved

## テスト結果
test_v45.py 9/9 PASS、V43 test 8/8、V44 test 14/14（いずれも本便で再実行）。Previewの実表示1件をブラウザで確認。
