# SF6DNA Phase15 Acceptance Evidence

最終更新: 2026-08-28 JST

状態: **Phase15進行中 / 自動検証可能範囲は大幅前進 / 外部・実セッション依存項目あり**

この文書はPhase15のAcceptance Evidenceを集約する。ローカルCI/browser emulationの成功をVercel Previewやactual device確認済みとして扱わない。

## 1. P15-00 Preview Environment / Deployment

状態: **未完了 / 外部ツール制約**

確認結果:
- Connected Vercel Team Project: 0
- Preview deployment: 0
- Preview URL: 未成立
- Production deployment: 未実施

Vercel公式仕様上、通常DeployはPreview、Productionは明示的なProduction targetが必要。
一方、現在ChatGPTへ公開されているVercel `deploy_to_vercel` 操作は引数を受け取らず、MCP公式仕様上必要なtarget/name/filesや、SF6DNA固有のRoot Directory `v2-web` を明示できない。

誤Project/誤RootへのDeployを避けるため、無条件Deployは実行しない。
Production deployで回避しない。

## 2. P15-01 Runtime / Public Demo Gate Evidence

Vercel Previewは未成立だが、GitHub Actions runner上で現行`sf6dna-v2`をproduction buildし、実Supabase public接続を使用してruntime smokeを実施した。

### Runtime Smoke

Workflow:
- `.github/workflows/phase15-runtime-smoke.yml`

Successful runs:
- `33140999720`
- `33141087038`

確認済みHTTP 200:
- `/`
- `/characters`
- `/characters/aki`
- `/players`
- `/players/blaz`
- `/videos`
- `/videos/jp-ray-20260318-combo-oki`
- `/search?q=jp`
- `/diagnosis`
- `/diagnosis/character-fit-check`
- `/coach`
- `/auth`
- `/admin`

実在slugはSupabase実DBのpublished recordから取得した。

### AI Coach safe behavior

Runtime responseで確認:
- `generationEnabled = false`
- `ready = true`
- Source付きEvidenceを取得
- Evidence count = 1（当該smoke query時）
- Current Patch = `2026.08.03`

AI Generationは有効化していない。

### Runtime response sample

GitHub hosted runner内のwarm local serverでの参考値。Public network/Vercel latencyではない。

Run `33141087038`の代表値:
- `/`: 約 0.0033s
- `/characters`: 約 0.0028s
- `/players`: 約 0.0032s
- `/diagnosis`: 約 0.0028s
- `/coach`: 約 0.0082s

未完了:
- Vercel Preview URL上の再確認
- Vercel runtime logs
- Public network latency

## 3. P15-02 Auth / Admin E2E Evidence

### 確認済み

Phase15でAuth return-path不整合を修正済み。

修正内容:
- `/auth?next=/admin`の内部return pathをログイン後に利用可能にした。
- `/`から始まり`//`では始まらない内部pathだけを許可。
- 外部形式・不正値は`/`へfallback。
- static regression test追加。

Source fix CI:
- run `33138407354`
- Typecheck: success
- Lint: success
- Policy tests: success
- Build: success

Runtime unauthenticated Admin check:
- `/admin/characters`
- HTTP `307`
- Location `/auth?next=/admin`

DB read-only policy audit:
- 主要Admin対象tableのadmin write policyは`ALL` + `private.is_admin()`を要求。
- `private.is_admin()`は`auth.uid()`と`public.profiles.role = 'admin'`の一致を要求。
- Public read policyとAdmin write policyは分離されている。

### 未完了

実認証sessionが必要:
- non-admin authenticated userのwrite拒否
- admin login
- Admin対象画面到達
- 限定test record Create/Edit
- save後re-fetch
- cleanup
- Public Gate維持確認

### Audit Log差分

実DBのread-only調査では:
- `public` / `private` schemaに`audit`を名前に含むtableなし
- auditを名前/処理に含むtriggerなし

したがって現状、Phase15 Planにある「Audit Logが対象操作を記録」の受け入れ先を確認できていない。
監査機能を新設することはPhase15の自動修正として行わず、要件差分として残す。

## 4. P15-04 Responsive / Accessibility Runtime Evidence

### Static evidence

既存:
- `focus-visible`
- Skip Link
- button min-height 44px
- responsive breakpoints
- horizontal scroll container
- character tabs horizontal scroll
- overflow-wrap
- labels / aria-live / progressbar

### Lighthouse mobile emulation

Workflow:
- `.github/workflows/phase15-lighthouse.yml`

Run:
- `33141100694` success

Top:
- Performance: 99
- Accessibility: 100
- Best Practices: 96
- SEO: 100
- FCP: 約 778ms
- LCP: 約 1581ms
- CLS: 0
- TBT: 約 68ms

Character detail `/characters/aki`:
- Performance: 98
- Accessibility: 100
- Best Practices: 96
- SEO: 100
- FCP: 約 764ms
- LCP: 約 2293ms
- CLS: 0
- TBT: 約 51ms

数値はGitHub runner上のlocal appへのLighthouse mobile emulationであり、actual device/Public network値ではない。

### Chromium browser acceptance

Workflow:
- `.github/workflows/phase15-browser-e2e.yml`

Successful run:
- `33141327374`

390x844 mobile emulationで確認:
- Top / Character / Player / Video / Search / Diagnosis / Coach / AuthがHTTP 200
- 上記主要画面でdocument-level horizontal overflowなし
- Search欄へ`JP`入力 → 検索遷移成功
- Character Fit Diagnosisで各問回答 → Result到達

1440x900 desktop emulationで確認:
- 最初のTab focusがSkip Link
- Skip Link文言確認
- focus outlineがvisible
- Auth formが不正なexternal-looking `next` queryでも表示崩壊しない

未完了:
- ユーザーPC actual browser確認
- actual deviceでのvisual overlap / touch / scroll / browser-back等

## 5. P15-03 Performance / Advisor Evidence

### Lighthouse

上記P15-04記載の通り、Top/Character detailで高スコアを確認。
現時点でEvidenceに基づく緊急Performance修正は不要と判断する。

### Runtime timing

GitHub runner warm-local sampleでは主要routeに大きな遅延なし。
Public network/Vercel測定はP15-00待ち。

### Supabase Advisor

2026-08-28再確認:
- Security Advisor: 0 lints
- Performance Advisor: `unused_index` INFO
- Performance Advisor: `multiple_permissive_policies` WARN

`pg_stat_user_indexes`もread-only確認したが、未使用判定だけを根拠にindex削除しない。
RLS policy統合もPublic/Admin Gateを弱める可能性があるためblind fixしない。

## 6. Browser E2E初回失敗の扱い

初回run `33141238840`はfailure。
原因:
- app defectではなくCI scriptのPlaywright module resolution不備。

修正:
- PlaywrightをCI runnerにのみ一時installする方式へ変更。
- project package.json/package-lockへPlaywright依存を追加していない。

再実行run `33141327374`はsuccess。

## 7. 現在のPhase15残件

### External / manual dependency

1. P15-00 Vercel Project + Preview成立
2. Preview URL上でP15-01を再確認しVercel runtime logs確認
3. P15-02 real authenticated admin/non-admin E2E + limited CRUD/cleanup
4. P15-02 Audit Log受け入れ先の要件確定
5. P15-04 user PC actual-device/browser verification
6. P15-03 Public Preview/network performance confirmation

## 8. Safety state

維持済み:
- `main`変更なし
- Production deployなし
- Supabase DDL/writeなし（Phase15 acceptance監査中）
- status/verification_status自動昇格なし
- Modern Command推測なし
- SourceなしFrame確定なし
- AI Coach Generation OFF

Phase15は上記残件があるため**未完了**。
Phase16へはユーザー明示指示なしで進まない。
