# SF6DNA Phase19 Final Audit

最終更新: 2026-08-28 JST

状態: **COMPLETE / INTERNAL HARDENING PASS**

## Phase19

**Internal Data Integrity & Release Hardening**

Phase19は、人力・Vercel・実デバイス・実認証セッションを使わず、GitHub / Supabase / CIで完結する内部Release Hardeningを対象とした。

## Final Decision

- Phase19: **完了**
- Internal Data Integrity: **PASS**
- Public Gate Hardening: **PASS**
- Automated Acceptance: **PASS**
- Supabase Security: **PASS / 0 lints**
- Production Ready: **未判定**
- Demo Release Decision: **CONDITIONAL GO維持**
- Phase20: **未開始**

Phase19 PASSはPhase20の外部・実機Acceptanceを代替しない。

## Task Result

| Task | Result |
|---|---|
| P19-00 Baseline / Scope Freeze | 完了 |
| P19-01 Referential Integrity Audit | 完了 |
| P19-02 Identifier / Uniqueness / Required Field Audit | 完了 |
| P19-03 Patch Lifecycle Integrity Audit | 完了 |
| P19-04 Public Gate Matrix Audit | 完了 / hardening実施 |
| P19-05 Source Integrity & Evidence Classification | 完了 |
| P19-06 Duplicate / Near-Duplicate Content Audit | 完了 |
| P19-07 Internal Runtime / Failure-mode Hardening | 完了 |
| P19-08 CI / Regression Expansion | 完了 / PASS |
| P19-09 Security / Performance Advisor Triage | 完了 |
| P19-10 Release Documentation Consistency Audit | 完了 |
| P19-11 Final Audit / Closure | 完了 |

## Baseline

- Phase19 start HEAD: `5665063d193b9aa9bcafcd3563eb219863007413`
- main baseline: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Current Patch: `2026.08.03`
- Current Patch record count: 1
- playable + published Character: 31

## Structural Integrity

### FK

Public schemaのForeign Keyは全てvalidated。

### entity_sources legacy type

16件のlegacy `guide_section`を発見した。
全16件が既存`character_guide_sections.id`を参照し、既存新表記との競合0を確認後、構造メタデータのみ正規化した。

Migration:
- Supabase: `phase19_normalize_guide_section_source_type`
- Repo: `supabase/migrations/20260828060550_phase19_normalize_guide_section_source_type.sql`

修正後:
- legacy type: 0
- unknown entity_source type: 0
- invalid entity_source target: 0
- duplicate entity_source group: 0

## Identifier / Required Field Result

重大項目は全て0:

- Character / Move / Player / Video blank slug
- duplicate Character / Move / Player / Video slug
- Strategy duplicate slug
- Strategy blank required field
- Move without Classic Command
- Move without open Current Frame
- multiple open Current Frame
- exact duplicate Move Command
- negative critical display_order
- exact duplicate Alias / Strategy / Guide content

Combo/Setupで同じMoveが複数stepに現れるケースは、step_order重複0・exact relation重複0のため削除しなかった。

## Patch Lifecycle

- Current Patch count: 1
- Frame validity reversal: 0
- Combo / Setup / Sequence / Counter / Training reversal: 0
- Character Guide reversal: 0
- Player Character reversal: 0
- open Frame not starting at Current Patch: 0

## Source Integrity

- Source: 329
- blank title: 0
- blank URL: 0
- blank source_type: 0
- blank reliability_level: 0
- non-http(s) URL: 0
- unknown reliability: 0
- blank publisher: 30（nullable / non-blocking / 推測補完なし）

Reliability:
- official 85
- primary 2
- secondary 137
- community 104
- internal_candidate 1

normalized URL duplicate candidateは8 group。
異なるEvidence title/contextを持つため、自動merge/deleteしなかった。

## Public Gate Hardening

### Strategy

Combo / Setup / Sequence / Counter / Training Public RLS:
- published
- verified
- matching Source relation

を維持。

### Move

Phase19開始時点ではApp側Move GateとRLS側Move Gateに差異があった。
RLS側もRelease Gateへ統一した。

Final Public Move Gate:
1. Move = published
2. Classic Commandあり
3. Classic Commandにofficial Evidence
4. Move本体にofficial Source
5. Current Patch Frame
6. Frame = verified
7. Current Frameにofficial Source
8. Modern Commandは任意 / 推測禁止

Migrations:
- `phase19_strict_public_move_rls`
- `phase19_require_official_move_and_frame_sources`

Repo:
- `supabase/migrations/20260828060858_phase19_strict_public_move_rls.sql`
- `supabase/migrations/20260828061405_phase19_require_official_move_and_frame_sources.sql`

App:
- `v2-web/src/lib/public-move-gate.ts`

307件のCurrent verified Frame候補についてMove / Frame / Classic Commandのofficial Evidenceが全件存在することを実DBで確認した。

### Other public paths

- Character Guide: published + verified
- Trait Recommendation: published + verified + Source
- Knowledge Strategy list/detail: published + verified; RLSでSourceを追加防御
- Search: Moveを`isMovePublicReady`でpost-filter
- AI Coach: Source付きEvidenceのみ / Current Patch / Generation OFF
- Auth next: internal path only / `//`拒否
- robots: `/admin`, `/api/`, `/auth` disallow

## Failure-mode / Regression

新規Workflow:
- `.github/workflows/phase19-internal-hardening.yml`

確認項目:
- npm ci
- Typecheck
- Lint
- Policy tests
- Build
- Public Move Gate invariants
- Strategy Source RLS invariants
- Character Guide gate
- Trait Recommendation gate
- AI Coach input/source/generation boundaries
- Auth return-path safety
- robots crawl controls

### CI Evidence

- Phase19 Internal Hardening `33147283023`: **success**
- Phase19 Internal Hardening `33147262450`: **success**
- Phase18 Data Gate Acceptance `33147262444`: **success**
- SF6DNA v2 Web Check `33146979482`: **success**

Phase19 workflow初回run `33147088363` はstatic SQL assertionの空白依存によりfailureした。
Typecheck / Lint / existing Policy tests / Buildはそのrunでもsuccess。テストハーネスをwhitespace-tolerantに修正し、後続runでPASSした。アプリ/DB不具合としては扱わない。

## Supabase Advisors

### Security

- **0 lints**

### Performance

既知の非blocker:
- `unused_index` INFO
- `multiple_permissive_policies` WARN

実測なしのblind index削除・RLS全面統合はしない。

References:
- https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index
- https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies

## No content promotion

Phase19では以下を実施していない。

- status推測変更
- verification_status推測変更
- bulk verify/publish
- Modern Command推測
- Frame推測
- Source publisher推測
- content duplicate自動削除
- AI Coach Generation解禁
- main merge
- Production deploy

## Phase20 Handoff

Final Phase `Phase20: Final Manual / External Acceptance & Production Decision`へ以下だけを残す。

1. Vercel Project / Git import
2. Preview Deploy / Preview URL
3. Preview runtime / build / runtime logs
4. real Admin / non-admin E2E + limited CRUD / cleanup
5. user PC / iPhone / actual device/browser
6. Public network Performance
7. 外部ブラウザ互換性
8. Production Readiness final decision
9. Production deploy（ユーザー明示許可がある場合のみ）

Phase20は自動開始しない。

## Conclusion

Phase19で実行可能な内部品質・整合性・Public Gate・CI hardening作業は完了した。
重大な内部Release blockerは残っていない。
Production Readyは、Phase20の人力・外部Acceptanceが未実施のため未判定のままとする。
