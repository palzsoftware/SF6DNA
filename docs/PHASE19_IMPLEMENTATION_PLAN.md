# SF6DNA Phase19 Implementation Plan

最終更新: 2026-08-28 JST

状態: **完了 / Internal Hardening PASS**

## Phase19名称

**Internal Data Integrity & Release Hardening**

## 位置づけ

Phase19は、人力・外部UI・実デバイス・実認証セッション・Vercel Previewを必要とせず、ChatGPT / GitHub / Supabase上で完結できる内部品質作業のみを対象とする。

Phase18で完了したVerified Content Coverage / Public Gate hardeningを基準に、Production前に機械的に検査・改善できる整合性、回帰耐性、運用安全性をさらに高める。

人力・外部検証はPhase19に含めない。すべてFinal Phase（Phase20）へ移管する。

## 開始Baseline

- Phase19開始HEAD: `5665063d193b9aa9bcafcd3563eb219863007413`
- main SHA: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Current Patch: `2026.08.03`
- Phase18: Complete / Data Gate PASS
- Production Ready: 未判定 / Phase20依存

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- main: ユーザー明示許可まで変更禁止
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Phase18 Final Audit: `docs/PHASE18_FINAL_AUDIT_2026-08-28.md`
- Phase18 Data Quality: `docs/PHASE18_DATA_QUALITY_REPORT_2026-08-28.md`
- Phase19 Integrity Audit: `docs/PHASE19_INTERNAL_INTEGRITY_AUDIT_2026-08-28.md`
- Phase19 Final Audit: `docs/PHASE19_FINAL_AUDIT_2026-08-28.md`
- Release Gate: `docs/V2_RELEASE_READINESS.md`

## 絶対ルール

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Commandを追加しない
- SourceなしFrameを確定しない
- 件数目的のbulk verify/publish禁止
- Production deploy禁止
- main変更禁止
- 新機能を勝手に追加しない
- Auth全面再設計をしない
- AI Coach Generationを有効化しない
- 外部Acceptanceを内部テストで「完了扱い」にしない

## Phase19 Backlog — Final

| Task | Status |
|---|---|
| P19-00 Baseline / Scope Freeze | **完了** |
| P19-01 Referential Integrity Audit | **完了** |
| P19-02 Identifier / Uniqueness / Required Field Audit | **完了** |
| P19-03 Patch Lifecycle Integrity Audit | **完了** |
| P19-04 Public Gate Matrix Audit | **完了 / hardening実施** |
| P19-05 Source Integrity & Evidence Classification | **完了** |
| P19-06 Duplicate / Near-Duplicate Content Audit | **完了** |
| P19-07 Internal Runtime / Failure-mode Hardening | **完了** |
| P19-08 CI / Regression Expansion | **完了 / PASS** |
| P19-09 Security / Performance Advisor Triage | **完了** |
| P19-10 Release Documentation Consistency Audit | **完了** |
| P19-11 Final Audit / Closure | **完了** |

## Phase19で実施した主なHardening

1. legacy `entity_sources.entity_type='guide_section'` 16件を、実在target確認・競合0確認後に`character_guide_section`へ構造正規化。
2. Move Public GateのApp/RLS差異を解消。
3. Public Moveを`published + official Classic evidence + official Move source + Current Patch verified Frame + official Frame source`へ統一。
4. `V2_RELEASE_READINESS.md`と実装条件を同期。
5. Phase19専用CI `.github/workflows/phase19-internal-hardening.yml` を追加。
6. Source / slug / duplicate / patch lifecycle / relation整合性を実DBで監査。

## Phase19でやらなかった作業

以下はFinal Phase（Phase20）へ移管する。

1. Vercel Project作成・Git import
2. Vercel Preview deployment / Preview URL
3. Preview runtime / build / runtime logs
4. real Admin / non-admin認証セッションE2E
5. limited CRUD / cleanupの実認証Acceptance
6. user PC / iPhone / actual device確認
7. Public network Lighthouse / perceived performance
8. 外部ブラウザ互換性最終確認
9. Production Readiness最終判定
10. Production deploy（明示許可がある場合のみ）

## Exit Criteria Result

- P19-00〜P19-11: **完了**
- 重大な内部整合性blocker: **なし**
- Phase19 CI: **PASS**
- Supabase Security Advisor: **0 lints**
- Public Gate既知漏洩経路: **なし**
- Phase20 handoff: **固定済み**

Phase19は完了。Phase20はユーザー明示指示まで開始しない。
