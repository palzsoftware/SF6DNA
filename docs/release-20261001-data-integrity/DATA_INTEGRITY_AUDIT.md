# SF6DNA Data Integrity監査 2026-10-01

## 結論

対象DBには31キャラ分の既存資産が存在します。Public件数が少ない主因は公開状態・公式Source条件・Preview専用fixtureです。公開数の少なさをデータ消失や全キャラ未完成とは扱いません。

この監査範囲で新規P0/P1を確認していません。全体のRelease判断はNO-GOを維持します。認証、Production Legal、公開境界、実機QA等は別Workstreamの証拠が必要です。

## 基準と境界

- Repository: palzsoftware/SF6DNA
- 監査基準SHA: 62330bd76f3af54a3b54871ebd50721aa393f9f8
- Tree: 0b183bd1e5d9988553e37ef16ac3a2434165f2b4
- Supabase: 接続済み対象DB。SELECT・定義読取のみ。
- Release: 2026-10-10第一目標、2026-10-31最終窓。品質優先。
- DB、Production、main、sf6dna-v2、Ver1.1変更なし。
- Public件数は現在の保存statusとコード・公開predicateに基づきます。匿名HTTP/ブラウザ/実機の確認とは区別します。
- DBの各SELECTは別snapshotです。巨大なロックやDB更新は行っていません。

## データ一覧

| 領域 | DB total | 保存状態・公開条件 | UIでの使われ方 |
| --- | ---: | --- | --- |
| Characters | 34 | published/playable 31、draft/nonplayable 3 | listCharactersは31件。未実装3件は意図的除外 |
| Moves | 2,065 | draft 2,052、archived 13、published/public-ready 0 | RC PreviewはRPCまたはfixture。Public技ルートのGate維持 |
| Commands | 3,508 | 全2,065技にClassicあり。Modernは1,443技 | Modern不存在をClassicから補完しない |
| Frames | 2,065 | verified 2,021、reviewed 44 | Move自体にverification_statusはない。Frame状態として解釈 |
| Motion Media DB | 0 | DB行なし | ローカルPreview manifestは4キャラ・34技・34clip |
| Players | 91 | published 41、draft 50 | 全Playerに有効なCharacter relationあり |
| Videos | 90 | published 3、draft 87 | PublicはRyu 2、JP 1。draft動画は全31キャラに紐付く |
| Sources | 661 | Public RPC候補660、internal_candidate 1 | CandidateをPublic数に混ぜない。本文・Source30再監査なし |
| Combos | 1,478 | draft 1,213、archived 265、published 0 | reviewed 134、verified 1。Strategy Gate維持 |
| Setups | 924 | draft 792、archived 132、published 0 | reviewed 89、verified 0。全件Source relationあり |
| Sequences | 607 | draft 475、archived 132、published 0 | reviewed 36、verified 0。全件Source relationあり |

Commandのnumeric_notationは3,225行、button_notationは1,691行、condition_textは1,925行あります。command_text空欄0。Modern未登録は622技ですが、Modernで利用できる技かは実機確認していないため、622件の不具合とはしません。

## Character Coverageの読み方

CHARACTER_COVERAGE_MATRIX.csvはPublic対象31キャラを1行ずつ収録します。画像・概要・基本属性は31件すべてGOOD。DB image_urlは31件nullですが、legacy-character-images.tsの31ファイル対応とasset実在を確認しました。画像配信のHTTP再監査は対象外です。

Master GOOD=31。横断CoverageはPARTIAL=31、EMPTY=0、BLOCKED=0です。PARTIALは領域ごとのGate・公開数の差を表す分類で、リリース未完成判定ではありません。Moves/Combosは31キャラすべてGATED。Playerは14キャラがPublic relationを持ち、残る17キャラはdraft relationが存在します。VideoはPublic relationが2キャラ、残る29キャラにもdraft relationが存在します。

Media countはapproved_for_previewのdistinct move ID数です。DB Media countとは分離しました。Ryu 4/57、JP 26/59、Luke 1/50、Manon 3/49。残る27キャラは現行manifestに未統合です。録画の不存在は確認していません。MEDIA_INPUT_REQUIREDは統合入力の確認が必要という意味で、新規録画要求ではありません。JPの個別mappingは別担当へ委譲しています。

RC Preview fallback fixtureの技数はRyu57、JP59、Luke1、Manon3、残る27キャラ0です。DBは全31キャラに技があります。RPC結果が得られない場合のfixture差であり、DB消失ではありません。Quick StartもRC Preview専用です。Productionへの公開範囲変更は行いません。

Verified Move count列は「stored verified Frameを持つ技」の数であり、Move公開済み・ゲーム検証済みの新規認定ではありません。

## 関係・重複・孤立

- 対象28 FKの孤立0。Move→Character、Player→Character、Command/Frame→Move、Combo/Setup→Move等を確認。
- polymorphic entity_sources 29,875行・entity_videos 112行の存在整合: broken 0。
- Source relation、Video relation、Player/Character pairの重複0。
- 対象7領域のslug空欄・invalid・case-only conflict・重複0。Character名、Player名の重複候補0。
- Combo/SetupのMove参照で別Characterへ接続する行0。
- 同一move/scheme/sort_orderのCommand衝突0、完全一致Command重複0、同一current move/patch Frame重複0。
- Public VideoのCharacter/Player/Event relation不足0。現行entity_videosはCharacter型のみ。matches/tournament由来の動画情報は0件。
- Sources URL空欄・形式不正0。Video URL重複0。同一Source URLは7組・29行です。Source provenanceや別内容の可能性があるため、自動統合・削除はしません。
- entity_sourcesおよびtrait-score direct source参照を持たないSourceは81件。うちinternal_candidate1件は意図的非公開。残り80件はrelation付与の確認候補で、global Source一覧ですでに利用できる可能性があります。
- Charactersを他の参照がない理由でorphanとは呼びません。Master ID/slug invalidは0。PlayerのCharacter relation無し0。

## FrameとStrategy

startup/active/recovery/onHit/onBlock/damageが全てnon-nullのFrameは1,314、partialは751です。COMPLETEとVERIFIEDは直交します。complete verified1,305、complete reviewed9、partial verified716、partial reviewed35。投げ等の不適用値と本当の欠落は実機未確認です。全行にpatchがあり、MISSING Frame0、UNVERIFIED Frame0。

現行DB Patchは2026.08.03です。ゲーム側の最新Patch一致は今回確認していません。

Comboはslug/recipe/Character/Source不存在0。published+unverified0。verified+draft1は公開承認と検証の状態を分ける正常な組合せです。Recipeの内容やLuke5のSource一致は別Workstreamへ残します。Sourceがあるだけでverifiedへ昇格しません。

Diagnosis関連のcharacter_trait_scoresは372行・31キャラ、Character/Trait/Sourceの参照切れ0、同一Character/Trait重複0。質問・採点・推薦内容の再監査や変更はありません。

## 回復候補

DATA_RECOVERY_CANDIDATES.csvはキャラ単位の集約在庫です。Movesは排他的に701件PUBLICATION_APPROVAL_REQUIRED、1,319件SOURCE_REQUIRED、32件VERIFICATION_REQUIRED、13件INTENTIONALLY_HIDDENです。701件は公開predicateの根拠部分を満たしますが、全てdraftです。自動公開しません。

draft Players50件、draft Videos87件は公開承認前の候補です。キャラごとのrelation件数は同じentityを複数回含み得るため、CSVの行件数を足してglobal entity数にしません。34件のMediaはPreview専用で、公開承認・実機mapping確認を要求する分類に留めます。SAFE_TO_SURFACE_EXISTINGの確認済み候補は0です。コードだけで公開する安全な回復は今回確認できませんでした。

## テストとGap

Fresh baseline382 PASS。追加6 Unit、基準SHAで388 PASS、Remote追従後392 PASS。Release Gates14 PASS。typecheck/lint/build PASS。実関数のVideo filter OR/AND、no-result、unknown metadata、Favorite/Watched、storage再読込・不正JSON・SSRを追加しました。

メモリstorageとvmを利用するUnitであり、実ブラウザのlocalStorage永続性、Supabase、認証をPASSとはしません。17領域すべて実装あり・自動検査の参照あり。ただし静的文字列検査だけのTESTEDはEvidence kinds=STATICとし、実ブラウザ成功を意味せず、TESTEDだけで網羅済みにしません。TEST_COVERAGE_GAP_MATRIX.csvに検査種類と残るGapを分離しています。全領域のLive DB certificationはNOです。

実DBRelation loader、Source RPCのロール別projection、ブラウザFavorite再読込、実検索のno-result等にGapがあります。Auth/Diagnosis read-backはRelease-criticalですが別担当へ残します。未検証という理由だけで新規P0/P1には昇格しません。

## Schema Contract GapとData Ledger

| ID | DATA_PRIORITY | 所見 | 今回の処置 |
| --- | --- | --- | --- |
| D01 | P2_DATA | Source URL重複7組、relation無しPublic候補80 | provenanceと対象entity確認候補。変更なし |
| D02 | VALID_DIFFERENCE | DB画像null、31asset fallbackあり | 欠落扱いしない |
| D03 | VALID_DIFFERENCE | published0のMoves/Strategy、draft50 Players/draft87 Videos | 公開Gateとして分類 |
| D04 | BACKLOG | フレームpartial751、optional release_date12、Video日時未入力66 | 成立条件・適用性未確認。必須範囲へ追加しない |
| S01 | BACKLOG | polymorphic entity targetにFK無し | validator/trigger案のみ。migration禁止維持 |
| S02 | BACKLOG | Command order・current FrameのUNIQUE無し | variant契約確認後の計画のみ |
| S03 | VALID_DIFFERENCE | Player relation PKにrole、Source URL UNIQUE無し | 現在重複pair0。許される複数role/出典差を維持 |
| T01 | HIGH | loader・storage・filterの実環境検査不足 | Unit6件追加、ブラウザPASS捏造なし |

PK/FK/UNIQUE/INDEX/NOT NULL/CHECKは現行metadataを読取確認し、DATA_RELATION_ISSUES.jsonには契約差の結論と監査方法だけを収録しています。対象constraintはvalid。全域のindex最適化やRLS全面監査は対象外です。

## 未完了と次の1作業

この③ではLive UI・ユーザー端末・ゲーム・録画・Public Boundary全面監査を実施していません。全体GOは証明されていません。

次の1作業: テストGap担当へ、実ブラウザでのFavorite保存→別ページ→reloadの永続性確認を引き継ぐ。今回のUnitはその実環境証拠を代替しません。

## Fresh Remote追従

REMOTE_DRIFT=YES。Remoteはd86514c59d9e7380d07b2e36f6e093a5a7ed800dへ進行しました。7ファイルの差分は子ページmetadata、Home文言、お気に入りのaria-labelと新規テスト4件です。Loader/fixture/manifest/schema契約への変更はなく、データ監査証拠は62330bd基準で再利用しました。Fast-forwardで保持し、統合後392テスト・Gates14・typecheck・lint・buildを再確認しました。今回の変更はテスト1ファイル＋本フォルダ6成果物に限定します。

Test分類: IMPLEMENTED17、TESTED6（静的のみ3を含む）、MOCK_ONLY6、SSR_ONLY5、NO_TEST0、BROWSER_REQUIRED17、DEVICE_REQUIRED5。分類は検査の種類であり全面動作保証ではありません。

## Safe Integration / Security Review

旧ローカルcommit 2857605の7ファイルを確認。①の7ファイルとは同一ファイル・同一行・同一componentの競合なし。Remote基準d86514c59d9e7380d07b2e36f6e093a5a7ed800dから必要差分のみ新commitへ統合し、旧commitのraw情報をPush履歴へ含めません。

JSONのDB行・個別Source/relation ID・URL・schema/RPC定義・SQL全文・raw snapshotを除去し、件数・問題分類・契約差・再現方法へ縮小。Recovery CSVの個別Source 81行は分類別2行へ集約。接続先project識別子も除去。6成果物とテストに秘密・認証情報・private user data・内部メモ・私用メールは含めません。ファイル除外0、情報削減対象3ファイル。DB再監査・DB変更・公開状態変更は行いません。

追加6件は実関数を使うUnitで、ブラウザ・DB・AuthのPASSを主張しません。最新版の①テストを保持して再検証します。PreviewはPush後にREADY・branch・新SHAの一致を別途確認します。

Safe Integration Fresh検証: 392 tests PASS / 14 Release Gates PASS / typecheck PASS / lint PASS / build PASS / diff check PASS。npm.cmd相当のnpmをLinux環境で実行。next-env.d.ts・tsconfig.jsonの生成差分を確認し、基準commitの内容へ戻しました。
