# SF6DNA Phase17 Acceptance Evidence

最終更新: 2026-08-28 JST

状態: **外部確認待ち / Phase17未完了**

## Phase17

**Preview Deployment, Real Environment Acceptance & Production Readiness**

## Baseline

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- Supabase: `SF6DNAPro`
- Current Patch: `2026.08.03`
- Phase16: 完了 / Conditional Go
- Production: 未公開
- main: 未変更

## P17-00 Baseline / Scope Freeze

状態: **完了**

実施:
- `docs/PHASE17_IMPLEMENTATION_PLAN.md` 作成
- `PROJECT_STATUS.md` をPhase17進行中へ更新
- Phase16 carryoverをPhase17 backlogへ引き継ぎ

## P17-01 Vercel Preview Environment

状態: **外部確認待ち / BLOCKED**

2026-08-28 JST時点のVercel状態:
- Connected Team Project: 0
- Preview deployment: none
- Production deployment: none

### Deploy実行結果

接続済みVercelの `deploy_to_vercel` を通常Preview用途として実行したが、ツール側で以下の入力検証エラーとなった。

- `target`: `preview | production` が必須
- `name`: string が必須
- `files`: array が必須

一方、このチャットへ公開されている `deploy_to_vercel` の呼び出しスキーマは引数0個であり、これら必須値を渡す手段がない。

結論:
- アプリコード由来のDeploy failureではない。
- Vercel connector/tool schema mismatchによる外部ブロッカー。
- `target=production` を推測して実行していない。
- `v2-web`以外を誤Deployしていない。
- Production deploymentは発生していない。
- ユーザー方針により、Vercel Project作成はactual device確認と同じタイミングで実施する。

## P17-02 Preview Runtime Acceptance

状態: **未開始 / P17-01依存**

Preview URLがないため実行不可。

Phase16までの代替Evidence:
- Runtime Smoke: success
- Release Acceptance: success
- Browser Acceptance: success
- Lighthouse: success

ただし、これらをPreview実環境PASSへ昇格しない。

## P17-03 Real Auth / Admin E2E

状態: **内部監査完了 / 実セッション待ち**

2026-08-28 JSTの実DB確認:
- `public.profiles`: **0件**
- 既存Admin profile: 0
- 既存non-admin profile: 0

このため、既存実アカウントを使ったAdmin/non-admin session E2Eは現状実施できない。

安全ルール:
- Phase完了目的でAuth userを勝手に作成しない。
- `auth.users`へ直接SQLでテストユーザーを作らない。
- 実ユーザー作成またはユーザー承認済みテストアカウント準備後に実施する。

### 2026-08-28 static release audit

確認した主要実装:
- `v2-web/src/lib/admin.ts`
- `v2-web/src/app/admin/page.tsx`
- `v2-web/src/app/admin/characters/actions.ts`
- `v2-web/src/app/auth/page.tsx`

確認結果:
- `requireAdmin()` は未認証ユーザーを `/auth?next=/admin` へredirectする。
- 認証済み非Adminは `/admin` へ戻され、管理トップで「権限がありません」を表示する設計。
- CharacterのCreate / Update / Archive Server Actionは処理冒頭で `requireAdmin()` を必ず実行する。
- Auth `next` は `/` 始まりのみ許可し、`//...` を拒否するためprotocol-relative external redirectを防止する。
- Auth/Admin static auditで新たなRelease blockerは検出しなかった。

自動確認済み:
- unauthenticated Admin block
- safe internal auth return path
- admin server action protection static audit
- RLS/Admin policy static audit

未確認:
- real admin session
- real non-admin session
- limited Create/Edit
- save/re-fetch
- cleanup
- Public Gate unaffected after authenticated mutation

### Audit Log要件整理

`docs/V2_RELEASE_READINESS.md`を再確認した結果、正式Release Gate Bに必要なのは以下であり、Audit Logは必須項目として定義されていない。

- RLS
- `requireAdmin()` + RLS二重ガード
- 実AdminでCreate/Edit/Publish/Archive E2E
- Clientへのsecret露出防止
- Security Advisor重大項目0

Audit LogはPhase15 P15-02の追加確認項目として記載されたが、同文書自身が「監査機能を勝手に新設せず、要件差分として扱う」としている。

Phase17判定:
- Audit Log未実装だけを理由にRelease Gate失敗へしない。
- Audit機能は新機能として勝手に追加しない。
- 将来必要なら別途承認を受けて設計する。

## P17-04 Real Device / Browser Acceptance

状態: **準備完了 / ユーザー実機確認待ち**

ユーザー方針:
- Vercel Project作成・Preview確認と同タイミングでactual PC/browser確認を行う。

外部確認時の手順を統合したチェックリストを作成:
- `docs/PHASE17_EXTERNAL_ACCEPTANCE_CHECKLIST_2026-08-28.md`

チェックリストには以下を統合した。
- Vercel Project / Preview
- Preview Runtime
- Auth/Admin E2E
- actual PC/browser
- Vercel Logs / Performance
- Final Decision

自動Evidenceはactual-device完了として扱わない。

## P17-05 Preview Performance / Runtime Logs

状態: **準備完了 / P17-01依存**

Preview Project/Deploymentが存在しないためVercel runtime logsおよびPublic network performanceを取得できない。

既存CI LighthouseをPreview performanceへ昇格しない。

外部AcceptanceチェックリストへTop / Character detailの最低実測対象、runtime error、500系、Supabase-backed route確認を定義済み。

## P17-06 Production Readiness Final Audit

状態: **Pre-audit完了 / 最終判定待ち**

内部確認済み:
- Phase16 Release Acceptance: PASS
- Runtime Smoke: PASS
- Browser Acceptance: PASS
- Lighthouse: PASS
- Supabase Security Advisor（2026-08-28再確認）: **0 lints**
- Auth/Admin static release audit: blockerなし
- Public Gateを弱める変更なし
- AI Coach Generation OFF
- Production deployなし
- main変更なし

最終判定に残る必須Evidence:
1. Vercel Preview成立
2. Preview Runtime / Logs
3. 実Admin session E2E
4. 実PC/browser acceptance
5. Preview network performance

したがって現時点ではProduction Readyへ昇格せず、Phase16の **Conditional Go** を維持する。

## P17-07 Closure / Handoff

状態: **未完了**

P17-01〜05の外部Evidence回収後にFinal Auditを作成する。

## Current Stop / Resume Point

Phase17でChatGPT単独で安全に実施できる内部監査と外部確認準備は現時点で完了。

次回actual device確認タイミングで `docs/PHASE17_EXTERNAL_ACCEPTANCE_CHECKLIST_2026-08-28.md` に従い以下を連続実施する:
1. Vercel Project作成
2. Preview deployment
3. Preview runtime/log確認
4. actual PC/browser確認
5. Preview performance確認
6. 認証テスト用アカウントが安全に準備できる場合、Real Auth/Admin E2E
7. P17-06最終判定
8. P17-07 Final Audit / Closure

## Safety Confirmation

- main変更なし
- Production deployなし
- Supabase content status/verification変更なし
- Auth test user無断作成なし
- 推測publish/verifyなし
- AI Coach Generation OFF維持
- Audit機能新設なし
- 新機能追加なし
