> The initial sections below are the preserved pre-integration audit baseline. The RC integration section supersedes its eight-candidate confidence and remote-write status.

# Alex Fast-track handoff

BASE_SHA=3c45c6a7981172ac7172a034c2d867555f0976a2; remote write0; DB_WRITE0; Production/Ver1.1 unchanged. CharacterID=0a82075f-b2c3-4a3d-9267-89f3da1543dd; slugalex; Fresh moves76. Category snapshot={'throw': 3, 'taunt': 6, 'normal': 26, 'special': 30, 'super': 5, 'drive': 6}. Snapshot counts are not canonical truth.

## Input integrity

All originals retained unchanged.9 files including Jump. Container duration is not trusted for normals due anomalous leading negative video packet PTS;3114 nominal59.94fps frames (~51.952s) and audio51.819s. Frame-index normalized inspection is recorded; no source overwrite.

| File | Bytes | Container seconds | Video frames | FPS | Codec | Resolution | SHA256 |
|---|---:|---:|---:|---|---|---|---|
| alex-jump-attacks.mp4 | 118669176 | 42.219667 | 2525 | 60/1 | hevc | 2560×1440 | f629b1ecfbb774456b1fb9eee0a4e90a8fde0b5a425031a410c1aa680f889f8a |
| alex-normals.mp4 | 146304331 | 1724.541000 | 3114 | 60000/1001 | hevc | 2560×1440 | 4cf6547f6f5396a5101e51c3b66edaefdecda9572d2a1845eb7f31e664028a01 |
| alex-punish-counter-specials.mp4 | 157949905 | 56.127667 | 3361 | 60/1 | hevc | 2560×1440 | fcb41bf9c8b18561b1f25bf0027631db567d566ab8f7c8c3f47d4f0a1b467132 |
| alex-specials1.mp4 | 279539035 | 97.674000 | 5857 | 60/1 | hevc | 2560×1440 | 455c8c1baa2f4e27262390d3b290492b2c37e20ee5f900ef5d54d474dbbf5034 |
| alex-specials2.mp4 | 179253931 | 63.841333 | 3826 | 60000/1001 | hevc | 2560×1440 | e3ae278b765b8a25e5b58a1a65e24bf16859a4e4977006d3215e95cf9c13df60 |
| alex-super-arts.mp4 | 266934147 | 93.950333 | 5630 | 60/1 | hevc | 2560×1440 | e6174aae92fd5d585aa722201ea77d708589b29d5e03a88a6237bec58da8d438 |
| alex-throws.mp4 | 127816702 | 45.270667 | 2708 | 60/1 | hevc | 2560×1440 | 7a6360ad6ac2d7d94711b024f5c2d6e93aa4bf26dc99d2fde7d01aa3e1f844e4 |
| alex-unique-moves1.mp4 | 231882462 | 83.797333 | 5026 | 60/1 | hevc | 2560×1440 | 23cbda863ab47df19812e2a70bed6480bdc723fb593f89923aa3d8d255e69856 |
| alex-unique-moves2.mp4 | 210109441 | 76.374333 | 4577 | 60/1 | hevc | 2560×1440 | 02d55d405140b30402cfc8c4db87023b4880925b2088e5e81d55ddb1466d76ac |

Total bytes=1718459130. File header accessPASS for all9. Full-decode/file-review status below is tracked per file; header success alone is not full-decode proof.

## Fast-track結果

9本すべて全編video decode / Timeline確認済み。76行CSVは維持。確認用MP4/WebP17組（合計22,336,586 bytes）。既存RCの scripts/validate-motion-media.mjs を変更せず再利用し、候補manifest / 実ファイル検査PASS。追加検査でMoveID・slug・character・DB category snapshot・重複・存在・zero byte・全出力decodeを確認。公開承認0、通常Mediaの条件付き置換0。

確定したdefault候補8組：強フラッシュチョップ、ODフラッシュチョップ、ODエアニースマッシュ、ODパワーボム、SA1、SA2、SA3、CA。カテゴリ/名称差分のあるdefaultレビュー6組：ブレイカースタンス、スラッシュエルボーroute、ステップアウト、エアスタンピートroute、フライングクロスチョップ、ツイストドロップ。条件付き3組は別MDのとおり、runtime binding HOLD。

成功表示は入力テンプレートであり、実押下履歴と同じではない。「弱 or 中」・汎用P/K・残存表示だけで強度を割り当てない。通常強フラッシュの初回候補に後続OD実行が含まれていたため、境界検査時に修正し、ODを独立生成した。SA3開始欠け、末尾設定/Resetも修正。これらは公開/remoteへ反映していない。

## 全ファイルTimeline / HOLD

| Source | review | retained result / exact HOLD |
|---|---|---|
| normals | COMPLETE; frame-index normalized | 12普通の立ち/しゃがみ動作とHold候補は入力非表示。12ボタン+Hold2行を推測せずHOLD。container PTS異常は上記参照 |
| jump | COMPLETE | 冒頭約0–26sに6ボタン動作。ボタン表示なしのため6行HOLD。26–31s replay設定、31–40s dummy jump/対空は6ボタンidentityの証拠ではない |
| unique1 | COMPLETE | 0–17s stance/移動、18–39s stance派生、40–45s中K空中派生、46–67s stance派生/コンビネーション、68–73s設定/Command List、74–82s stance/step-in/elbow。切り出し済みstance / elbow / step-out / air-stampede。残りLP/MP/HP・Hold・LK・HK・投げ系は独立した行identity/条件の根拠不足 |
| unique2 | COMPLETE | 0–17s投げ系/PC、18–24sCommand List、25–33s方向技試行、34–37sCommand List、38–45s空中技、46–50sCommand List、51–61s打撃、62–67sCommand List、68–73s2LK→2HK。フライングクロスチョップとツイストドロップの入力確認。方向技/親派生の残りはmenuを実行成功証拠と混同せずHOLD |
| specials1 | COMPLETE | 0–19sflash系、20–23sCommand List、24–60s対空/OD、61–64sCommand List、65–97s投げ系。強/ODflashとODknee・ODpowerbomb確定。弱中flashは表示がOR、通常K/P投げは汎用表示なので強度HOLD |
| specials2 | COMPLETE | 0–8sOD投げ、9–15sCommand List、16–33sflash、34–38sCommand List、39–52sflash、53–59.5sOD派生投げ、60–63s準備。hyper-bomb route条件付き保持。単体power-dropと背面条件の独立確認HOLD |
| throws | COMPLETE | 0–22s通常3動作、23–25s設定、26–44sPC版3動作。入力表示なし、3行すべてidentity HOLD。録画順は根拠にしない |
| super arts | COMPLETE; SA全件manual crosscheck | 3.4–7.5sSA1、14.45–22.75sSA2、44.6–55.75sSA3、63.3–75.4sCAを生成。84–90sPPの追加routeは名/親条件未確定でHOLD。数値CA閾値は推測しない |
| punish counter | COMPLETE | 条件付き2route + repeat / other trials。詳しくはALEX_CONDITIONAL_MEDIA_RESULT.md。PCを一般必要条件としない |

## Canonical / Frame / Command境界

ゲームCommand Listで特殊技として読める11行のDBカテゴリ差分を保持。名称差分は少なくとも「ツイストドロップ」vs「ツイステッドドロップ」、「コラプス・ドライバー」vs「コラプシングドライバー」。他の親子併記DB名も正式名の確定とはしない。公式サイト全件再監査は行っていない。

Fresh current frameは既存verification69 verified / 7 reviewedとして再利用しただけ。76行の新規official frame/patch照合は未実施。新しいFrame mismatchを発見したとの主張はしない。Frame未照合はMedia identity作業のblockにしていない。move単位のsource relationは今回queryで得られず、character source4件（official3/candidate YouTube1）を保持。YouTubeの公開状態は新規検証/昇格していない。Combo/Setup追加監査なし、publicStrategyContent false維持。

RCから取得した共通move-command-format.tsをそのまま利用。指定9入力atomの変換PASS。CSVの48行は共通formatter結果、28行はcombined buttons / Hold brackets / Backturn等が現契約未対応なのでHOLD_SHARED_FORMATTER_GRAMMAR。テンキー原文を公開用fallbackにしない。JP/Yasmine/Alexのブラウザ回帰確認は未実施。専用Formatterや共有Component変更0。

## Final Report

FRESH_BASE_SHA = 3c45c6a7981172ac7172a034c2d867555f0976a2
FINAL_SHA = NO_NEW_COMMIT; latest read-only RC SHA matches base
REMOTE_WRITE = 0
ALEX_CHARACTER_ID = 0a82075f-b2c3-4a3d-9267-89f3da1543dd
FRESH_DB_MOVE_COUNT = 76
INPUT_FILES = 9 (including Jump)
INPUT_TOTAL_SIZE = 1718459130 bytes
NORMAL_EXPECTED = 12 ordinary standing/crouching + 2 Hold DB variants
NORMAL_MAPPED = 0
NORMAL_UNRESOLVED = 14
JUMP_SOURCE = PRESENT; alex-jump-attacks.mp4
JUMP_EXPECTED = 6 ordinary buttons
JUMP_MAPPED = 0
JUMP_UNRESOLVED = 6
UNIQUE_FILES = 2
UNIQUE_IDENTIFIED = 8 media review candidates; 11 readable game-category discrepancies overall
UNIQUE_UNRESOLVED = 13 additional DB stance/directional candidate rows; canonical total not asserted
SPECIAL_FILES = 2
SPECIAL_IDENTIFIED = 5 non-stance family rows (4 default + hyper-bomb conditional)
SPECIAL_UNRESOLVED = 10 non-stance family DB rows
OD_CONFIRMED = 4 (flash-chop, aerial-knee, power-bomb, hyper-bomb route)
FOLLOW_UP_CONFIRMED = successful commands and intervals in CSV; child names/necessity limited to evidence
FOLLOW_UP_UNRESOLVED = exact rows/reasons in CSV; no recording-order allocation
THROW_IDENTIFIED = 3 distinct motions; 0 button-to-DB identities
THROW_UNRESOLVED = 3
SA_IDENTIFIED = 4 (SA1/SA2/SA3/CA)
SA_UNRESOLVED = 1 (PP conditional route)
PUNISH_COUNTER_SOURCE = PRESENT
CONDITIONAL_MEDIA_IDENTIFIED = 3 route candidates (2 PC source + hyper-bomb)
CONDITIONAL_MEDIA_UNRESOLVED = runtime binding3; exclusive PC necessity/name/parent exact reasons in conditional MD
MEDIA_OUTPUT_MP4 = 17
MEDIA_OUTPUT_WEBP = 17
MEDIA_OUTPUT_SIZE = 22336586 bytes
WRONG_MAPPING = 0_APPROVED; review candidates are not public approvals
DUPLICATE_MAPPING = 0
BROKEN_MEDIA = 0
CATEGORY_DISCREPANCIES = 11 retained
COMMAND_DISCREPANCIES = PP/SA2 parent-condition candidate1; not falsely resolved
FRAME_UNRESOLVED = 76 rows not newly official-reconciled; existing DB values retained
COMMAND_FORMATTER = REUSED; supported48 / unsupported grammarHOLD28
JP_COMMAND_REGRESSION = NOT_RUN_BROWSER; specified common atom testPASS
YASMINE_REGRESSION = NOT_RUN_BROWSER; no Yasmine file edits
DB_WRITE = 0
PRODUCTION = NO_CHANGE
VER1_1 = NO_CHANGE
TYPECHECK = NOT_RUN (no app implementation)
LINT = NOT_RUN (no app implementation)
TESTS = LOCAL_MEDIA_VALIDATION_PASS; npm app testsNOT_RUN
RELEASE_GATES = NOT_RUN (no app implementation)
BUILD = NOT_RUN (no app implementation)
DIFF_CHECK = NOT_RUN_GIT (artifact preparation only)
PREVIEW = NOT_CREATED
DEPLOYMENT = NONE
SHA_MATCH = READ_ONLY_BASE_MATCH; Preview matchNOT_APPLICABLE
FAST_TRACK_STATUS = READY_FOR_LOCAL_REVIEW_HANDOFF_WITH_EXACT_HOLDS; release NO-GO
USER_DEVICE_QA_REQUIRED = ALEX_ONLY_AFTER_PREVIEW (Desktop Dark/Light and375px); no current UI PASS claim
NEXT_SINGLE_ACTION = review the8 default candidates for authorized Preview integration; unresolved Alex rows can remainHOLD while next Character proceeds

## Integration handoff

このWorkの対象branchへのcommit/push明示承認は未確認（ユーザー指示#83）。remote実装を開始していない。統合時はFresh HEADと共有差分を確認し、まず8 default候補だけを対象にする。カテゴリ/名前差分6 defaultと条件付き3はHOLDを維持。最新共通Formatter、poster-first、preload none、大きいMedia領域、MediaなしCardを維持。共有/条件schemaの自動上書きは禁止。実装後にnpm各check・release gates・build・git diff --check・Alex/JP/Yasmine/RyuのQAを実施する。

Timestamp基準：生成ClipのSOURCE_START_MS / END_MSはFFmpeg -ss入力基準の相対秒。Originalのcontainer absolute PTSではない。Source timelineのfpsラベルはサンプリング時刻で、境界はClip側で別確認した。normalsはframe-index正規化基準を別記。既存原本は全件変更なし。

## RC integration scope — 2026-10-03

Seven MP4/WebP pairs are selected for Preview. OD Power Bomb is excluded after stale-success-label re-review. Check Alex Desktop Dark/Light and 375px, three special clips and four SA clips, Japanese arrow commands, complete animations and no adjacent attacks. All other captures remain review-only/HOLD; numerical frames are not newly verified. RC implementation uses explicit Preview environment gates.

Validation and exact deployment details will be recorded after checks. Production/Ver1.1/DB remain unchanged.

Local implementation checks: typecheck PASS; lint PASS; tests 499/499 PASS; release-gates 14/14 PASS; build PASS; diff-check PASS; Alex media validator including 14-file full decode PASS. Implementation Preview QA is complete as recorded below.

## Verified implementation Preview

- Fresh base: `3c45c6a7981172ac7172a034c2d867555f0976a2`.
- Implementation RC SHA: `5bdeb6965b82b963b27f1f60dbf93c3173619a5e`; tree `3a16089c06d98c74f2fd000a5885871e0f9dad91`. GitHub-uploaded 24 blobs and resulting tree exactly match the locally tested tree.
- Vercel deployment: `dpl_6n3jy8THovT94op8Lg3vpeciPvLd`, READY, Preview target, exact RC branch/SHA.
- URL: https://sf-6-13b5tfljg-somas11620-9368.vercel.app/characters/alex
- Desktop Dark / Light: PASS at 1363px viewport; three Special / four SA cards; all seven videos readyState 4, no media decode error; each video width 499px; horizontal overflow 0; preload none. Offscreen videos initially stayed unloaded, confirming lazy behavior.
- JP: 59 cards, Japanese arrow/button commands retained, no Alex media; Yasmine: 71 cards / 12 currently rendered videos, no Alex media; Ryu: 57 cards / 4 currently rendered videos, no Alex media. Representative desktop overflow 0 on all three. These rendered video counts are not total coverage claims.
- 375px: USER_DEVICE_QA_REQUIRED. This browser exposes no viewport-resize API. No mobile PASS claim.
- Frames: null for all seven Preview cards; existing DB audit remains evidence only, not new frame verification.
- Media: seven MP4 + seven WebP, 11,848,898 bytes total. Wrong approved mapping 0; duplicate mapping 0; broken media 0.
- HOLD: OD Power Bomb (stale initial OD label, new normal SUCCESS); six name/category discrepant candidates; three conditional candidates; Jump six-button identity; all other unconfirmed variants/frames; Combo/Setup and DB edits. Review originals and 17-pair local pack retained.
- Checks: typecheck PASS; lint PASS; tests 499/499; release-gates 14/14; build PASS; diff-check PASS; Alex validator/full decode PASS.
- Remote write: authorized RC only. DB_WRITE 0; Production NO_CHANGE; Ver1.1 NO_CHANGE; main and sf6dna-v2 unchanged.
- FAST_TRACK_STATUS: READY_FOR_RC_PREVIEW_WITH_EXACT_HOLDS. Release remains NO-GO; no Production approval granted.
- NEXT_SINGLE_ACTION: Alex 375px user-device check; unconfirmed identities remain HOLD while rollout proceeds to the next character.

The following handoff commit changes documentation only. Its own exact Preview SHA is checked after deployment and reported in the conversation; runtime/assets match the implementation SHA above.
