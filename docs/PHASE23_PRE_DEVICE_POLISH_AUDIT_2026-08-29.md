# SF6DNA Phase23 Pre-device Polish Audit

Date: 2026-08-29 JST
Application automated baseline: `6b5a4b8e1974f677691e655e274da9626bdb18b5`
CI invariant follow-up: `22af783bc8fb947be138cfcdd56279a053d8f713`
Branch: `sf6dna-v2`

## Decision

**NON-HUMAN PRE-DEVICE WORK COMPLETE**

実機・実ログイン・人物同定・公開承認など人の判断または操作を必要とする項目を除き、GitHub / Supabase / Vercelで安全に完了できるUI・画像・文言・SEO・Public Gate・Admin publication path・CI・Performance・Source・Release文書監査を完了した。

人の手が必要な作業はユーザー指示どおり最後のmanual stageへ保留する。

`main`変更・v2 Production deployは行っていない。

## 1. UI / copy / image / SEO

完了:

- Home / Characters / Players / Diagnosis / Tools / Improve / Matchup Card / About / FAQ / Sources / Changelog等の主要文言再監査
- Public UIの内部管理用語を一般向け表現へ整理
- safe empty / error stateを未確認情報で補わない方針へ統一
- Character / Player画像監査
- Playerは安全確認済み17名のみlegacy fallback接続
- Next.js Image Optimization、AVIF / WebP、responsive sizes、layout space reservationを反映
- metadata / robots / sitemap / OGP / Twitter image整理
- Preview環境はrobotsで全クロール禁止

Player:

- published: 41
- DB `image_url`: 0 / 41
- published Player alias追加情報: 0
- safety-confirmed fallback: 17

残りPlayer画像は人物同定が必要なためmanual stageへ保留する。

## 2. Supabase / Security

Project:

- `SF6DNAPro`
- `wnuxaxbrpudyypzdbdho`

確認:

- public table: 38
- RLS enabled: 38 / 38
- Security Advisor: 0 lints
- Current Patch: 1
- Player relation orphan: 0
- `auth.users`: **0**

Auth role境界:

- 新規Auth userはtriggerでprofile作成
- default roleは`user`
- 一般ユーザーが自身のroleをadminへ自己昇格できないRLSを確認
- `private.is_admin()`によるAdmin判定を確認

実ログインユーザーが存在しないためReal Auth E2Eはmanual stageへ保留する。SQLによる偽Auth user作成は行わない。

## 3. Public Move Gate / Admin publication hardening

Pre-device最終監査で、public Moveが0件のため未顕在化だった問題を検出した。

### Public Gate polymorphic Source issue

`entity_sources.entity_id`はpolymorphicでMove / Command / FrameへのFKを持たないが、旧Public GateはPostgREST inferred joinに依存していた。

修正:

- commit `6abe88a67d812d130e0f46aeaf15feebfaad6a3c`
- Evidenceを`entity_type + entity_id`で明示取得
- Sourceを別照合
- Move / Classic Command / Current verified Frameそれぞれのofficial Sourceを要求

### Admin publish gate mismatch

旧Admin publish条件がPublic Gateより緩く、`status=published`でもPublic Gate不合格の状態を作れる余地があった。

修正:

- commits `5a112fb47db87d476543da236834537c34720066`, `6b5a4b8e1974f677691e655e274da9626bdb18b5`
- Classic Command必須
- Current Patch verified Frame必須
- Move / Classic Command / Current Frameのofficial Evidence必須
- 新規published指定でもdraft作成→Evidence登録→strict gate→published昇格

### Admin Evidence UI

- commit `2fa254feb3469b6e4b70b65f31bb0a7035695287`
- Move本体 / Classic・Modern Command / Frame versionへEvidence Sourceを個別追加可能

CI再発防止:

- Phase20 strict publication evidence invariant追加
- Phase19 old inferred-join invariantを新実装へ同期
- follow-up commit `22af783bc8fb947be138cfcdd56279a053d8f713`

詳細: `docs/PHASE23_AUTH_ADMIN_READINESS_2026-08-29.md`

## 4. Content publication snapshot — current DB

最終read-only確認:

- published Move: **0**
- published Combo: **0**
- published Setup: **0**
- published Sequence: **0**
- published Counter: **0**
- published Training: **0**

Move:

- draft: 2052
- strict machine gate ready: **701**
- not ready: 1351
- ready Character: 12 / 31
- Modernあり / なし: 662 / 39

現DB関数によるready内訳:

| Character | Count | Modernあり | Modernなし |
|---|---:|---:|---:|
| Dee Jay | 105 | 102 | 3 |
| Jamie | 93 | 91 | 2 |
| Blanka | 91 | 83 | 8 |
| Dhalsim | 88 | 77 | 11 |
| Kimberly | 76 | 74 | 2 |
| E. Honda | 70 | 65 | 5 |
| Guile | 70 | 66 | 4 |
| Chun-Li | 68 | 64 | 4 |
| Yasmine | 19 | 19 | 0 |
| Mai | 10 | 10 | 0 |
| C. Viper | 7 | 7 | 0 |
| Elena | 4 | 4 | 0 |
| **Total** | **701** | **662** | **39** |

701候補の構造監査:

- blank slug / name / Classic Command: 0
- duplicate slug group: 0
- Current verified Frame cardinality異常: 0
- Classic Command cardinality異常: 0
- null Startup / Recovery / Damage: 0 / 0 / 0

701候補のrequired official Evidence:

- Move: 701 / 701
- Classic Command: 701 / 701
- Current verified Frame: 701 / 701
- 3対象すべてにCAPCOM公式Evidence: 701 / 701

関連Source recordはtotal 36で、official 12、supplemental / non-official 24。補助Sourceをofficialへ昇格していない。

Strategy candidate (`draft + verified + Source`):

- Combo: 1
- Setup / Sequence / Counter / Training: 0

重要:

- Machine Gate PASS ≠ publish approval
- `draft ≠ published`
- bulk publish禁止
- Modern欠損を推測補完しない

Publication approvalはmanual stageへ保留する。

詳細: `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`

## 5. CAPCOM Official Frame Snapshot

- fix commit: `ac4ed232d0f73c619ac2681565ab55c289022967`
- Workflow: `Phase20 Official Frame Snapshot`
- Run: `33228209058`
- Result: PASS
- CAPCOM Japanese frame pages: **31 / 31 HTTP 200**
- Artifact: `phase20-official-frame-snapshots-ja-jp`
- Artifact files: 32（31 Character + manifest）
- Artifact ID: `9707625771`

Snapshotはread-only Evidenceであり、DB status変更には使用していない。

## 6. Automated regression final state

Application code head `6b5a4b8e1974f677691e655e274da9626bdb18b5` / CI follow-up `22af783bc8fb947be138cfcdd56279a053d8f713`:

- Phase16 Release Acceptance — PASS (`33239446677`)
- Phase15 Runtime Smoke — PASS (`33239446690`)
- Phase15 Browser Acceptance — PASS (`33239446655`)
- Phase15 Lighthouse Audit — PASS (`33239446718`)
- Phase19 Internal Hardening — PASS (`33239510750`)
- Phase20 Verified Content Acceptance — PASS (`33239446647`)
- SF6DNA v2 Web Check — PASS (`33239446717`)
- Phase18 Data Gate Acceptance — PASS (`33239446644`)

Typecheck / Lint / Policy tests / Build / Browser / Data Gate / Release smokeはGREEN。

## 7. Performance

画像最適化後の基準:

### Home

- Performance: **0.91**
- LCP: **約3.39s**
- FCP: 約0.80s
- TBT: 約65ms
- CLS: 0
- Accessibility: 1.00
- Best Practices: 0.96
- SEO: 1.00

### Character detail

- Performance: **0.93**
- LCP: **約3.11s**
- FCP: 約0.77s
- TBT: 約109ms
- CLS: 0
- Accessibility: 1.00
- Best Practices: 0.96
- SEO: 1.00

最新Lighthouse workflowもPASS。

## 8. Vercel Preview

CI follow-up head `22af783bc8fb947be138cfcdd56279a053d8f713`:

- Deployment: `dpl_CHHhrT5RgaXP9LGGHMm7mPSE2PgT`
- State: READY
- target: Preview
- Build error: 0
- runtime error / fatal: 0

PreviewはVercel SSO保護下。外部fetchだけで実ユーザー操作を代替しない。

## 9. Human / manual stage — intentionally held

残る作業は人の操作または判断を必要とするものだけ。

1. 攻略データPublication approval
2. 正式な実またはテストAuth user準備
3. 実Admin / non-admin browser E2E
4. Player残画像の人物確認（必要な場合）
5. manual変更後のFinal RC freeze
6. PC実機テスト
7. iPhone実機テスト
8. Production Readiness最終判定
9. Production deploy（ユーザー明示許可時のみ）

実機テストはユーザー指示どおり最終RC固定後の最後のAcceptanceとして実施する。

## 10. Production

- `main`: 変更していない
- v2 Production deployment: 実施していない
- Production deployはユーザー明示許可がある場合のみ実施する
