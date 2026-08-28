# SF6DNA Phase19 Implementation Plan

最終更新: 2026-08-28 JST

状態: **進行中**

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

## Phase19 Backlog

### P19-00 Baseline / Scope Freeze
- Phase18完了HEAD固定
- main未変更確認
- Current Patch一意性確認
- Phase20移管対象を固定

### P19-01 Referential Integrity Audit
Supabase実DBで以下を監査する。
- orphan Character relation
- orphan Move / Frame / Command relation
- orphan Source relation
- orphan Player / Video / Strategy relation
- Patch FK整合性
- entity_sourcesのentity_type / entity_id対応妥当性
- duplicate relation / duplicate source association

安全に修正可能な明白な構造不整合のみ修正し、内容判断が必要なデータは変更しない。

### P19-02 Identifier / Uniqueness / Required Field Audit
- slug重複
- null / blank slug
- blank title/name
- display_order異常
- Classic Command欠損
- Current Patch Frame欠損
- duplicate current frame
- duplicate current patch association
- published Entityの必須参照不足

推測値は補完しない。

### P19-03 Patch Lifecycle Integrity Audit
- `is_current=true` Patchの一意性
- valid_from / valid_to整合性
- Current Patch参照の妥当性
- future / stale patch relation
- Current Patchと公開Gate条件の不一致
- 期間逆転や重複期間の検出

### P19-04 Public Gate Matrix Audit
対象:
- Character
- Move
- Frame
- Move Command
- Character Guide
- Combo
- Setup
- Sequence
- Counter
- Training
- Trait Score
- Player
- Video
- Search
- Recommendation
- AI Coach Retrieval

アプリQuery、RPC、RLSの3層で公開条件を比較し、経路ごとの差異・漏洩余地を検出する。

### P19-05 Source Integrity & Evidence Classification
- Source URL / title / publisher / reliability_levelの欠損監査
- EntityごとのSource coverage
- Source relationのentity_type妥当性
- official / supporting等のEvidence分類監査
- Current Patch Evidenceとして使用可能かの機械分類

Sourceありだけでverifiedへ昇格しない。

### P19-06 Duplicate / Near-Duplicate Content Audit
対象:
- Move aliases
- Character aliases
- Player aliases
- Combo
- Setup
- Sequence
- Counter
- Training
- Guide sections

完全重複・機械的に高確度な重複候補を抽出する。

自動削除・統合は行わず、明白なduplicate relationのみ安全に整理可能とする。

### P19-07 Internal Runtime / Failure-mode Hardening
ローカル/CIで再現可能な範囲のみ対象。
- malformed slug
- notFound / empty state
- Supabase未設定時
- DB query error時
- AI Coach入力境界
- Search empty / malformed query
- metadata / robots / sitemap
- Admin unauth redirect static behavior

外部Previewや実ブラウザを必要とするAcceptanceはPhase20へ残す。

### P19-08 CI / Regression Expansion
Phase19専用Acceptanceを追加する。
最低限:
- typecheck
- lint
- policy tests
- build
- Public Gate static regression
- Patch integrity assumptions
- release-critical query invariants

DB実値監査はFinal AuditにEvidenceとして記録する。

### P19-09 Security / Performance Advisor Triage
- Supabase Security Advisor再確認
- Performance Advisor再確認
- 新規Critical / Error有無を分類
- unused_index / multiple_permissive_policiesは実測なしでblind fixしない
- 安全に確定できる設定不備だけ修正対象

### P19-10 Release Documentation Consistency Audit
以下の相互矛盾を解消する。
- PROJECT_STATUS
- V2_RELEASE_READINESS
- Phase15〜19 Evidence / Final Audit
- migration履歴
- Public Data Policy
- Phase20 Final Acceptance handoff

### P19-11 Final Audit / Closure
- Phase19 Final Audit作成
- Automated/Internal PASS or blocker判定
- Phase20へ渡すHEAD / DB baseline固定
- Phase20は自動開始しない

## Phase19でやらない作業

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

## Exit Criteria

Phase19完了条件:
- P19-00〜P19-11完了
- 重大な内部整合性blockerなし、または明示的にPhase20/将来作業へ分類済み
- CI PASS
- Supabase Security Advisorに新規Release blockerなし
- Public Gate matrixに既知の漏洩経路なし
- Final Phase handoffが固定済み
