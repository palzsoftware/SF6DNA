# SF6DNA Phase15 Implementation Plan

最終更新: 2026-08-28 JST

状態: **進行中 / Acceptance Evidence回収中**

## 位置づけ

Phase15は、Phase14終了時にユーザー承認のうえ再分類したPreview・実ブラウザ・実機・Performance系Acceptanceを回収し、Release Readinessを実環境Evidenceで前進させるPhaseとする。

2026-08-28、ユーザーの明示指示によりPhase15を開始済み。

正本:
- Phase14終了監査: `docs/PHASE14_FINAL_AUDIT_2026-08-28.md`
- Phase15 Evidence: `docs/PHASE15_ACCEPTANCE_EVIDENCE_2026-08-28.md`
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
- 新機能をユーザー承認なく追加しない。

---

# Phase15 Acceptance Backlog

## P15-00 Preview Environment / Deployment

Phase14由来: P0-06

状態: **未完了 / 外部ツール制約**

目的:
- `sf6dna-v2`を安全なVercel Previewで確認できる状態にする。

現状:
- 接続Vercel TeamのProjectは0件。
- Preview未成立。
- 現在公開されているVercel connectorのdeploy操作ではtarget/name/files/rootDirectoryを明示できず、SF6DNA `v2-web`を安全に指定できない。

完了条件:
- Vercel Projectが存在する。
- Root Directoryが`v2-web`を指す。
- Preview用環境変数を設定する。
- Preview deploymentが成功する。
- Productionへ公開していないことを確認する。

禁止:
- Phase完了のためだけにProduction deploymentすること。
- Production domainを推測してhard-codeすること。

---

## P15-01 Preview Runtime / Public Demo Gate Smoke

Phase14由来: P0-07

状態: **CI runtime確認済み / Vercel Preview再確認待ち**

依存: P15-00

目的:
- 実Preview上でPublic Route・API・Public Gateを確認する。

最低確認対象:
- Top
- Character list/detail
- Player list/detail
- Video list/detail
- Search
- Diagnosis
- AI Coach Retrievalのsafe behavior

現時点Evidence:
- GitHub Actions runtime smoke `33140999720`, `33141087038` success。
- 主要Public Route HTTP 200。
- 実Supabase public接続成功。
- AI CoachはCurrent Patch `2026.08.03`を認識し`generationEnabled=false`を維持。
- unauthenticated `/admin/characters` はHTTP 307で`/auth?next=/admin`へredirect。

完了条件:
- Vercel Preview上で主要Route重大runtime error 0。
- draft/reviewed/unverifiedを確定情報としてPublicへ漏らさない。
- safe empty stateが未検証情報の代替表示をしない。
- Preview runtime logsにReleaseを妨げる重大errorがない。

---

## P15-02 Auth / Admin E2E

Phase14由来: P1-06

状態: **静的/unauth runtime/RLS確認済み / real session E2E待ち**

依存: P15-00または同等の安全なE2E環境

目的:
- Login / Session / Admin role / CRUDを実セッションで確認する。

確認済み:
- unauthenticated Admin block runtime確認。
- Auth return-path不整合を修正しCI成功。
- major admin-managed tablesは`private.is_admin()`をAdmin write条件に使用。
- `private.is_admin()`は`auth.uid()`と`profiles.role='admin'`を要求。

未完了:
- non-admin authenticated write block実セッション確認。
- Admin user login / route access。
- 限定test record Create/Edit。
- save/re-fetch。
- cleanup。
- Public Gate維持確認。
- Audit Log確認。

Audit Log差分:
- 現在の実DBでaudit table / audit triggerを確認できていない。
- 監査機能を勝手に新設せず、要件差分として扱う。

注意:
- 本番攻略データをテスト目的で不要に変更しない。
- テストデータを使える場合はテストデータを優先する。

---

## P15-03 Performance Measurement / Advisor Review

Phase14由来: P2-03

状態: **ローカルCI実測・Advisor確認済み / Public Preview実測待ち**

目的:
- 推測最適化ではなく実測からPerformance課題を特定する。

確認済み:
- Lighthouse mobile emulation run `33141100694` success。
- Top: Performance 99 / Accessibility 100 / Best Practices 96 / SEO 100。
- Character detail: Performance 98 / Accessibility 100 / Best Practices 96 / SEO 100。
- warm local runtime response sample取得。
- Supabase Security Advisor: 0 lints。
- Performance Advisor: `unused_index` INFO / `multiple_permissive_policies` WARN。
- `pg_stat_user_indexes` read-only baseline確認。

残り:
- Vercel Preview/Public network response。
- Vercel runtime logと実ネットワーク上の体感確認。

判断ルール:
- 未使用indexは実query利用状況を確認してから削除判断する。
- permissive policy統合はRLS behaviorとAdmin/Public accessを確認してから判断する。
- Securityや公開GateをPerformance改善のために弱めない。

---

## P15-04 Device / Responsive / Accessibility Runtime Verification

Phase14由来: P2-04のruntime部分

状態: **static + emulated browser確認済み / actual user PC待ち**

Phase14で完了済み:
- Static responsive review
- Static accessibility tests
- keyboard/focus/ARIA関連のコード監査

Phase15追加Evidence:
- Lighthouse mobile Accessibility 100（Top / Character detail）。
- Chromium 390x844 mobile emulationで主要画面のdocument-level horizontal overflowなし。
- Search操作成功。
- Character Fit Diagnosisを回答してResult到達。
- Desktop 1440x900で最初のTabがSkip Link、visible focus確認。
- Browser Acceptance run `33141327374` success。

Phase15で残るもの:
- ユーザーPC actual browser。
- actual device visual overlap / scroll / browser back等。
- 必要に応じたtablet相当最終確認。

重要:
- 実機未確認を「確認済み」と記録しない。
- emulationとactual deviceを分けてEvidence管理する。

---

# Phase15開始順

1. **P15-00** Preview環境を成立させる。
2. **P15-01** Public Runtime / Demo Gate smoke。
3. **P15-02** Auth / Admin E2E。
4. **P15-04** Responsive / Accessibility runtime確認。
5. **P15-03** Performance実測・Advisor評価。
6. Acceptance Evidenceをまとめる。

P15-00が外部要因でブロックされたため、Production deployや推測変更で回避せず、GitHub Actions runtime/browser/Lighthouse、DB read-only監査を先行した。

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

Phase15は開始済みであり、現在はAcceptance Evidence回収中。

---

# Phase15 Non-goals until explicitly approved

以下はPhase15で自動的には行わない。
- 新しい診断タイプ追加
- AI Coach Generation解禁
- Replay Coach本実装
- Auth全面再設計
- Audit機能の新規設計/新DB Entity追加
- 大量データのverified/published昇格
- main merge
- Production release

新要素が必要と判断した場合は、実装せず提案一覧として報告する。
