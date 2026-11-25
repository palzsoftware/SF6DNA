# 技カード V5 リリース確認キット（隔離環境専用）

本番相当の状態（本番マイグレーション 20260922 まで ＋ 115000 ＋ 技カード候補変更 V5）を**ローカルの使い捨てDB**に作り、
ローカル確認スイッチOFFの本番モードで全32キャラ・2,549枚を確認するための手順。本番・開発DBには接続しない。

## 前提
- PostgreSQL 16（スーパーユーザーで接続できるローカルクラスタ）、PostgREST 12、Node 22、python3、Playwright（Chromium）
- このリポジトリに技カード V5 パッチを当てた作業ツリー（`v2-web` を `npm ci` 済み、または node_modules をハードリンクでコピー）

## 1. 候補SQLを生成（入力とハッシュは再生成手順 V5 を参照）
```
python3 -I -B scripts/moves/build_all32_public_candidate_sql.py --official-dir "$OFFICIAL" \
  --fill v2-web/src/data/SF6DNA_ALL32_OFFICIAL_MOVE_FILL_20261125.json \
  --fixture v2-web/src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json \
  --links v2-web/src/data/SF6DNA_R15_OFFICIAL_TXT_DISPLAY_OVERLAY_20261120.json v2-web/src/data/SF6DNA_R17_OFFICIAL_TXT_MOVE_LINKS_20261120.json \
  --prod-pairs prod_identity_candidates_20261125.json --review scripts/moves/offpage33_official_review_20261125.json \
  --screen-recheck scripts/moves/official_screen_recheck_20261125.json --out "$OUT"
```
`$OUT/candidate.sql` の sha256 が再生成手順 V5 の値と一致することを確認する。

## 2. 隔離DBを作る
```
PGHOST=<socket> PGPORT=<port> DB=sf6_release_check OUT="$OUT" scripts/moves/release-check/setup_isolated_db.sh
#   旧フレーム除外案も入れる場合は末尾に --frame-history-option
```
`schema_prod_chain_20260922.sql` はデータを含まないスキーマのみ（本番が持つ 196 本のマイグレーションと同一の連鎖を
ローカルで適用した結果）。116000・120000 は技カードに不要なので入れない。

## 3. ローカルAPI（Supabase の /rest/v1 相当）
```
head -c 48 /dev/urandom | base64 > "$WORK/local_jwt_secret.txt"     # ローカル専用。本番の値は使わない
# PostgREST 設定: db-uri=postgres://authenticator:localonly@127.0.0.1:<port>/sf6_release_check, db-anon-role=anon,
#   jwt-secret="@$WORK/local_jwt_secret.txt", server-port=54308, db-pool=40, db-pool-acquisition-timeout=60
postgrest pgrst.conf &
node scripts/moves/release-check/local_api.mjs 54308 "$WORK/local_jwt_secret.txt" "$WORK/local-anon.jwt" &
```

## 4. 隔離用の承認台帳（承認ではない・ローカル確認専用）
```
node scripts/moves/release-check/gen_local_test_ledger.cjs "$APP" "$WORK/LOCAL_TEST_LEDGER.json" "$OUT/rows.csv" \
  scripts/moves/release-check/characters.json "$WORK/local-anon.jwt"      # 期待: valid true total 2549
cp "$WORK/LOCAL_TEST_LEDGER.json" "$APP/src/data/CHARACTER_PRODUCTION_RELEASE_APPROVAL.json"   # $APP は使い捨てのコピー
```
台帳はアプリ自身の公開ローダーを隔離DBに対して実行し、その結果の factDigest を記録したもの（approvalRef は LOCAL-TEST-ONLY）。
**リポジトリの台帳ファイルを書き換えない。**

## 5. ローカル確認スイッチOFFの本番モードで起動
2,549枚は次の条件がすべて揃ったときだけ表示される（承認台帳を使う本番経路）:
`next build && next start`（NODE_ENV=production）／`VERCEL_ENV=production`／`SF6DNA_WS5_TXT_PREVIEW` 未設定／`VERCEL` 未設定。
```
cd "$APP" && env -u SF6DNA_WS5_TXT_PREVIEW -u VERCEL NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 \
  NEXT_PUBLIC_SUPABASE_ANON_KEY="$(cat $WORK/local-anon.jwt)" VERCEL_ENV=production npx next build && ... npx next start -p 3330
```
（VERCEL_ENV が production 以外だと台帳を使わない別経路になり、件数・表示が変わる）

## 6. 確認
```
node scripts/moves/release-check/scrape_pages.cjs "$WORK/display.json" 3330 <characters.json の slug をカンマ区切り>
node scripts/moves/release-check/expected_command_labels.cjs "$APP" < cmd_items.json > expected_labels.json
python3 -I scripts/moves/release-check/compare_with_official.py "$WORK/display.json" "$OUT/rows.csv" "$WORK/LOCAL_TEST_LEDGER.json" \
  v2-web/src/data/SF6DNA_ALL32_OFFICIAL_MOVE_FILL_20261125.json expected_labels.json path_check.csv held_rows.csv
python3 -I scripts/moves/release-check/focus_check.py "$WORK/display.json" "$OUT/rows.csv"
psql -d sf6_release_check -f scripts/moves/release-check/api_counts.sql
```
期待値: compare `shown 2549 / held 123 / missing 0 / mismatch 0 / unexpected 0 / notGranted 0`、focus_check 10項目すべて OK、
api_counts `characters 32 / moves 2549 / move_commands 2549 / frames 4296（現行2549・旧1747）/ sources 直接0 / ベガワープ 0`。
（cmd_items.json は `python3 -I scripts/moves/release-check/make_cmd_items.py "$OUT/rows.csv" v2-web/src/data/SF6DNA_ALL32_OFFICIAL_MOVE_FILL_20261125.json` で作る）

## 7. 旧フレーム除外案（別途判断）
| | 適用前 | 適用後（frame_history_rls_option.sql） |
|---|---|---|
| 公開APIのフレーム | 4,296（現行2,549＋旧1,747） | 2,549（現行のみ） |
| 画面 | 2,549枚 | 2,549枚・ページ出力は適用前と完全一致 |
| 戻し方 | — | frame_history_rls_option_rollback.sql（4,296に戻る） |
