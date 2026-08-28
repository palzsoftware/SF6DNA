# SF6DNA Phase18 Final Audit

最終更新: 2026-08-28 JST

状態: **完了**

## Phase18

**Verified Content Coverage & Publish Candidate Preparation**

## Final Decision

- Phase18: **COMPLETE**
- Automated / Internal Data Readiness: **PASS**
- Production Ready: **未判定 / Phase19依存**
- Demo Release Decision: **CONDITIONAL GO維持**
- Phase19: **未開始**

Phase18は人力・外部環境Acceptanceを完了条件から分離し、ChatGPT / GitHub / Supabase上で安全に実施可能なデータ品質監査・公開候補分類・Public Gate防御・自動Acceptanceを完了した。

## Task Completion

| ID | Task | 結果 |
|---|---|---|
| P18-00 | Baseline / Scope Freeze | PASS |
| P18-01 | 31 Character Current Patch Quality Audit | PASS |
| P18-02 | Move / Frame / Command Publish Candidate Classification | PASS |
| P18-03 | Strategy Content Readiness Classification | PASS |
| P18-04 | Trait / Diagnosis / Reference Coverage Audit | PASS |
| P18-05 | Public Gate Regression Audit | PASS / hardening実施 |
| P18-06 | Data Quality / Publish Candidate Report | PASS |
| P18-07 | Automated Acceptance | PASS |
| P18-08 | Final Audit / Closure | PASS |

## Canonical Baseline

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- main SHA: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`（Phase18開始時確認）

## P18-01 / P18-02 Move Quality Audit

Published playable Character:
- 31
- Character Source coverage: 31 / 31

Move aggregate:
- Move: 2065
- Classic Command: 2065
- Modern Command: 1443
- Modern missing: 622
- Current Patch Frame: 2065
- Current Patch verified Frame: 307
- Move Source: 1347
- Current Frame Source: 2065
- machine publish candidate: 307
- Current Frame未verified: 1758

307件のmachine candidateは公開承認ではない。

verified Current Frameが揃う4キャラ:
- 春麗: 68
- ガイル: 70
- ジェイミー: 93
- キンバリー: 76

Modern Command欠損622件は推測補完していない。

## P18-03 Strategy Readiness

| Entity | Total | Published | Verified | Source | Public Ready | draft verified candidate |
|---|---:|---:|---:|---:|---:|---:|
| Combo | 341 | 0 | 1 | 341 | 0 | 1 |
| Setup | 186 | 0 | 0 | 186 | 0 | 0 |
| Sequence | 186 | 0 | 0 | 186 | 0 | 0 |
| Counter | 1122 | 0 | 0 | 1122 | 0 | 0 |
| Training | 1477 | 0 | 0 | 1477 | 0 | 0 |

唯一のdraft verified candidate:
- `kimberly-20260803-modern-assist2`
- `Modern アシストコンボ2（2026.08.03）`
- Current Patch: `2026.08.03`
- Source relation: 2
- status: draft

自動publishはしていない。

## P18-04 Other Coverage

Character Guide:
- total 278
- Current Patch 278
- Source 278
- published 0
- verified 0
- strict public ready 0

Character Trait Score:
- total 372
- Source 372
- published 0
- verified 0

Diagnosis:
- published Diagnosis 4
- published Questions 52
- DB question_countと実公開Question数が4診断すべて一致

Player:
- total 91
- published 41
- Source relation 91

Video:
- total 13
- published 5

## P18-05 Public Gate Regression Audit

### Finding 1: Move

Move本体にはverification_statusがないため、将来Moveをpublishedにした場合に`status=published`だけで次の経路へ出る余地を検出した。

- direct Move detail
- Character Move section
- Unified Search

現時点ではpublished Move=0のため実漏洩はなかった。

### Fix: Public Move Gate

新規:
- `v2-web/src/lib/public-move-gate.ts`

必須条件:
1. Move published
2. Classic Commandあり
3. Current Patch verified Frameあり
4. Move Sourceあり
5. Current Frame Sourceあり
6. Modernは任意・推測禁止

適用:
- `v2-web/src/app/moves/[slug]/page.tsx`
- `v2-web/src/lib/character-sections.ts`
- `v2-web/src/lib/search.ts`

### Finding 2: Strategy Source requirement

Release GateはStrategyにSourceを要求する一方、RLSは従来published + verifiedまでだった。

現時点ではpublished Strategy=0のため実漏洩はなかった。

### Fix: Strategy Source RLS

Supabase migration:
- `phase18_strategy_source_public_gate`

Repository migration:
- `supabase/migrations/20260828_phase18_strategy_source_public_gate.sql`

対象:
- combos
- setups
- sequences
- counters
- trainings

全テーブルでPublic SELECTを`published + verified + matching entity_sources exists`へ強化した。

実DBの`pg_policies`を再取得し、5テーブルすべてへSource条件が入ったことを確認済み。

## P18-06 Report

作成:
- `docs/PHASE18_DATA_QUALITY_REPORT_2026-08-28.md`

全31キャラのMove / Classic / Modern / Current Frame / verified Frame / Move Source / Frame Source / machine candidateを記録した。

## P18-07 Automated Acceptance

新規workflow:
- `.github/workflows/phase18-data-gate-acceptance.yml`

Acceptance項目:
- npm ci
- Typecheck
- Lint
- Policy tests
- Build
- Public Move Gate static assertion
- Character Guide verified gate assertion
- Strategy published+verified gate assertion
- Recommendation published+verified+Source assertion

Evidence:
- Phase18 Data Gate Acceptance `33145909173`: **success**
- Phase18 Data Gate Acceptance `33145974207`: **success**
- SF6DNA v2 Web Check `33145974201`: **success**

全step成功。

## Supabase Advisor after Phase18 DDL

Security Advisor:
- **0 lints**

Performance Advisor:
- `unused_index` INFO
- `multiple_permissive_policies` WARN

Performance警告は計測なしでblind fixしていない。

Remediation reference:
- https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index
- https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies

## Phase18 Commits

主要commit:
- `f8663f699ef5a42d729bf20aec27576a9b65d983` — Phase18開始Plan
- `ef7704a4b11208af8bc1a6fd3decb95a58cbe92d` — Public Move Gate
- `8399ca16751d2c9e36a6ebe7dc008240ca94e831` — Move detail gate
- `15f0685f9ba5037db911842a5fe7e3330e653a51` — Character Move gate
- `2df4780786fb6d1cd33d1755c967eac9e0a60d6a` — Search Move gate
- `3882752fa43ea1aca5f951d7a54e9b6d5198fe0c` — Data Quality Report
- `12f9b1a6a90c66f8eab4eb316670774c732ed4c8` — Phase18 CI
- `48d8d5450505f2ac9be2396bed9dc11ab0b2c019` — Strategy Source RLS migration repo record
- `4d54eb834a4d3ccde4c5e57dc9a03be1dcf17feb` — Final data quality evidence
- `59cc773ae4aa41eb6c7524f7572438dbbbf5503f` — Phase18 plan complete

## Data Mutation Safety

Phase18で実施していないもの:
- statusの一括変更
- verification_statusの一括変更
- candidateの自動publish
- reviewedからverifiedへの自動昇格
- Modern Command推測補完
- Frame値の推測登録
- Source捏造
- AI Coach Generation有効化
- Production deploy
- main merge

DB変更はPublic Gateを強化するRLS migrationのみ。

## Phase19 Handoff

Phase19へ残す人力・外部Acceptance:
1. Vercel Project / Preview
2. Preview runtime / logs
3. real Admin / non-admin session E2E
4. actual PC/device/browser
5. Public Preview/network performance
6. Production Readiness final decision

Phase19はユーザー明示指示まで開始しない。

## Final Conclusion

Phase18の全定義作業は完了した。

データ品質上、現状は大量のWorking dataを保有しているが、公開可能性を決める主因はEvidence/verificationであり、件数不足を理由に安全基準を下げていない。

Phase18終了時点でPublic GateはPhase17以前より強化され、自動回帰Acceptanceも追加された。
