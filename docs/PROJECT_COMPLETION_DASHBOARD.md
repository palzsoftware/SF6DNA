# SF6DNA Project Completion Dashboard

最終更新: 2026-08-28 JST

## 現在Phase

- Phase1〜20 automated/internal scope: **完了**
- Phase20 `Verified Content Expansion`: **COMPLETE / PASS**
- Phase21: **未開始**
- Phase22: **未開始**
- Phase23: **未開始 / Final Manual & External Acceptance**
- 作業ブランチ: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- Supabase正本: `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)
- Current Patch: `2026.08.03`

## Phase20 Final Data Quality

| Item | Final |
|---|---:|
| Active Move | 2052 |
| Current Frame | 2052 |
| Verified Current Frame | **2020** |
| Verified Rate | **98.4%** |
| Reviewed exception | **32** |
| Unverified | **0** |
| Verified with official CAPCOM Frame Source | **2020 / 2020** |
| Active Move without Current Frame | **0** |
| Active Move with multiple Current Frame | **0** |

Reviewed 32:
- Taunt 31
- Alex `Exit Prowler Stance` 1

CAPCOM公式Character Frame Dataに直接比較可能な独立行が無いため、Evidence基準を下げずreviewedを維持する。

## Phase20 Final Cleanup

- CAPCOM ja-jp / en-uk Frame照合完了
- legacy / duplicate working rowsを履歴化
- obsolete Moveをarchived化
- archived Dhalsim duplicate open Frameをcleanup
- temporary audit RPC削除
- temporary Frame Crosscheck workflow退役
- Supabase Security Advisor: **0 lints**
- Phase1〜20 retrospective implementation gap audit: **PASS**

## Phase1〜20 Implementation Gap

正本:
- `docs/PHASE20_PHASE1_TO_20_RETROSPECTIVE_GAP_AUDIT_2026-08-28.md`

判定:
- automated/internal完了条件の重大未実装: **0**
- 将来機能 / UX提案 / External Acceptanceは正式Phase境界に従い別扱い
- Replay映像解析はPhase12定義どおり将来研究対象
- AI Coach GenerationはEvidence条件成立までOFFが仕様
- Vercel / real Auth / actual device / public network performanceはPhase23へ移管
- Audit LogはPhase17でRelease Gate必須ではないと正式判定済み

## Public Gate

維持:
- `reviewed ≠ verified`
- `draft ≠ published`
- Move: published + Classic official Evidence + official Move Source + Current verified Frame + official Frame Source
- Strategy: published + verified + Source
- Character Guide: published + verified
- Recommendation: published + verified + Source
- AI Coach: Source Evidence + Current Patch / Generation OFF

## Phase Summary

| Phase | Status |
|---|---|
| Phase1〜12 | 完了または各Phase定義どおり終了 |
| Phase13 | 完了 |
| Phase14 | 完了 |
| Phase15 | Internal acceptance実施 / external残件移管 |
| Phase16 | 完了 / Conditional Go |
| Phase17 | 完了 / Automated & Internal PASS |
| Phase18 | 完了 / Data Gate PASS |
| Phase19 | 完了 / Integrity & Hardening PASS |
| Phase20 | **完了 / Verification Expansion PASS** |
| Phase21 | **未開始** |
| Phase22 | **未開始** |
| Phase23 | **未開始 / Manual & External Final Phase** |

## Current Release Decision

- Automated / Internal Readiness: **PASS**
- Data Gate: **PASS**
- Security: **PASS**
- Demo Release Decision: **CONDITIONAL GO**
- Production Ready: **未判定 / Phase23依存**
- Production deploy: **未実施**

## Phase21 Entry

Phase21はユーザー明示指示まで開始しない。
正本:
- `docs/PHASE21_PRIORITY_A_PLAN.md`

Phase21のModern Command不足対応などをPhase20の実装漏れとして先行実施しない。
