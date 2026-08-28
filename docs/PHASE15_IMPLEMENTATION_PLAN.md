# SF6DNA Phase15 Implementation Plan

最終更新: 2026-08-28 JST

状態: **準備完了 / 未着手**

## 位置づけ

Phase15は、Phase14終了時にユーザー承認のうえ再分類したPreview・実ブラウザ・実機・Performance系Acceptanceを回収し、Release Readinessを実環境Evidenceで前進させるPhaseとする。

本書の作成はPhase15開始ではない。Phase15の実作業は、ユーザーから開始の明示指示を受けてから行う。

正本:
- Phase14終了監査: `docs/PHASE14_FINAL_AUDIT_2026-08-28.md`
- Release Gate: `docs/V2_RELEASE_READINESS.md`
- 実DB: Supabase `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)
- 作業ブランチ: `sf6dna-v2`

## 絶対ルール

- `main`はユーザー明示許可まで変更しない。
- Production deploymentはユーザー明示許可まで行わない。
- Supabase実DBを正本とする。
- `reviewed ≠ verified`。
- `draft ≠ published`。
- Sourceありだけでverifiedへ昇格しない。
- Modern Commandを推測補完しない。
- SourceなしFrame値を確定登録しない。
- Release件数確保を目的とした自動publishをしない。
- AI Coach GenerationをEvidence不足のまま有効化しない。
- Performance Advisorの警告を計測せずblind fixしない。
- Phase15要件確定前に新機能を追加しない。

---

# Phase15 Acceptance Backlog

## P15-00 Preview Environment / Deployment

Phase14由来: P0-06

目的:
- `sf6dna-v2`を安全なVercel Previewで確認できる状態にする。

現状:
- 接続Vercel TeamのProjectは0件。
- Preview未成立。

完了条件:
- Vercel Projectが存在する。
- Root Directoryがv2 Web appを指す。
- Preview用環境変数を設定する。
- Preview deploymentが成功する。
- Productionへ公開していないことを確認する。

禁止:
- Phase完了のためだけにProduction deploymentすること。
- Production domainを推測してhard-codeすること。

---

## P15-01 Preview Runtime / Public Demo Gate Smoke

Phase14由来: P0-07

依存: P15-00

目的:
- 実Preview上でPublic Route・API・Public Gateを確認する。

最低確認対象:
- Top
- Character list/detail
- Player list/detail
- Video list/detail
- Search
- Diagnosis 4種
- Progress / Data Quality公開経路
- AI Coach Retrievalのsafe behavior

完了条件:
- 主要Route重大runtime error 0。
- draft/reviewed/unverifiedを確定情報としてPublicへ漏らさない。
- safe empty stateが未検証情報の代替表示をしない。
- Preview runtime logsにReleaseを妨げる重大errorがない。

---

## P15-02 Auth / Admin E2E

Phase14由来: P1-06

依存: P15-00または同等の安全なE2E環境

目的:
- Login / Session / Admin role / CRUDを実セッションで確認する。

完了条件:
- unauthenticated userをAdminから遮断。
- non-admin userをAdmin writeから遮断。
- Admin userが対象画面へ到達可能。
- 限定したtest recordでCreateまたはEditを実行。
- save後のre-fetchで変更を確認。
- 必要なcleanupを実施。
- Audit Logが対象操作を記録。
- Public GateがAdmin操作後も維持される。

注意:
- 本番攻略データをテスト目的で不要に変更しない。
- テストデータを使える場合はテストデータを優先する。

---

## P15-03 Performance Measurement / Advisor Review

Phase14由来: P2-03

依存: P15-00 / P15-01

目的:
- 推測最適化ではなく実測からPerformance課題を特定する。

確認項目:
- Lighthouseまたは同等計測
- Server/runtime response
- Supabase query behavior
- 大きな画像・動画表示
- Mobile viewportでの体感遅延
- Supabase Performance Advisor

2026-08-28時点のAdvisor carryover:
- `unused_index` INFO
- `multiple_permissive_policies` WARN

判断ルール:
- 未使用indexは実query利用状況を確認してから削除判断する。
- permissive policy統合はRLS behaviorとAdmin/Public accessを確認してから判断する。
- Securityや公開GateをPerformance改善のために弱めない。

---

## P15-04 Device / Responsive / Accessibility Runtime Verification

Phase14由来: P2-04のruntime部分

依存: P15-00 / P15-01

Phase14で完了済み:
- Static responsive review
- Static accessibility tests
- keyboard/focus/ARIA関連のコード監査

Phase15で確認するもの:
- PC browser
- smartphone width
- tablet相当
- actual device（ユーザーが確認可能になった時点）
- Tab keyboard navigation
- focus-visible
- form/button/link到達性
- horizontal overflow
- text/button overlap
- touch target操作性
- modal/dialog等のkeyboard trapping behavior

重要:
- 実機未確認を「確認済み」と記録しない。
- ユーザーが実機確認できない期間でも、Previewのviewport/browser検証は可能な範囲で進める。

---

# Phase15開始順

Phase15開始の明示指示後、原則として次の順に進める。

1. **P15-00** Preview環境を成立させる。
2. **P15-01** Public Runtime / Demo Gate smoke。
3. **P15-02** Auth / Admin E2E。
4. **P15-04** Responsive / Accessibility runtime確認。
5. **P15-03** Performance実測・Advisor評価。
6. Acceptance Evidenceをまとめ、次の開発要件をユーザーへ報告する。

P15-00が外部要因でブロックされた場合、Preview不要の静的監査・DB read-only監査・テスト拡張だけを進め、Production deployや推測変更で回避しない。

---

# Phase15 Entry Check

Phase14終了時点で確認済み:
- Phase14 source code CI: Typecheck / Lint / 27 tests / Build success。
- Supabase public tables 38 / RLS 38。
- Security Advisor重大項目0。
- Current Patch `2026.08.03`。
- Public Verification Gate migration適用済み。
- `main`変更なし。
- Production deployなし。
- Phase15へ移す5項目が明文化済み。

したがって、Phase15はユーザーの開始指示を受け次第、P15-00から開始できる。

---

# Phase15 Non-goals until explicitly approved

以下はPhase15開始時点で自動的には行わない。
- 新しい診断タイプ追加
- AI Coach Generation解禁
- Replay Coach本実装
- Auth全面再設計
- 新DB Entity追加
- 大量データのverified/published昇格
- main merge
- Production release

新要素が必要と判断した場合は、実装せず提案一覧として報告する。
