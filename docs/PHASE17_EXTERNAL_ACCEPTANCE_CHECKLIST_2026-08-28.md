# SF6DNA Phase17 External Acceptance Checklist

最終更新: 2026-08-28 JST

目的: Vercel Preview作成とユーザー実機確認を同じタイミングで実施し、Phase17の外部依存Acceptanceを一度で回収する。

## 事前条件

- Repository: `palzsoftware/SF6DNA`
- Branch: `sf6dna-v2`
- App Root: `v2-web`
- Supabase: `SF6DNAPro`
- Current Patch: `2026.08.03`
- `main`変更禁止
- Production deploy禁止（ユーザー明示許可まで）

## A. Vercel Project / Preview

1. VercelでGitHub repo `palzsoftware/SF6DNA` をImportする。
2. Root Directoryを `v2-web` に設定する。
3. FrameworkはNext.jsを使用する。
4. Preview環境へ必要な環境変数を設定する。
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - 必要に応じて `NEXT_PUBLIC_SITE_URL`
5. Production deploymentを実行しない。
6. `sf6dna-v2` のPreview deploymentを作成する。
7. Preview URLを記録する。

## B. Preview Runtime

Preview URLで以下を確認する。

- `/`
- `/search`
- `/characters`
- Character detail
- `/players`
- Player detail
- `/videos`
- Video detail
- `/diagnosis`
- Diagnosis detail/flow
- `/coach`
- `/training`
- `/combos`
- `/counters`
- `/setups`
- `/sequences`
- `/auth`
- `/admin`

確認事項:
- 主要Route 500なし
- safe empty state正常
- invalid slugは404
- draft / reviewed / unverifiedを確定情報としてPublicへ漏らさない
- AI Coach GenerationはOFF
- Current Patch `2026.08.03`を維持
- robots / metadata / noindex方針が壊れていない

## C. Auth / Admin E2E

実アカウントが準備できた場合のみ実行する。

### unauthenticated
- `/admin/*` が管理機能へ到達できない
- `/auth?next=/admin` へ安全に誘導される

### non-admin
- `/admin` で権限なし表示
- Admin subrouteのwriteが拒否される

### admin
- `/admin` に入れる
- 限定テストレコードでCreate/Edit
- save/re-fetch
- cleanup
- Public Gateが崩れていない

本番攻略データをテストのために不要に変更しない。

## D. Actual PC / Browser

ユーザーPCの実ブラウザで確認する。

- Top表示
- Header / Navigation
- Search入力・検索結果
- Character list/detail
- Player list/detail
- Video list/detail
- Diagnosis開始→回答→結果→やり直し
- AI Coach safe behavior
- Browser Back / Forward
- keyboard Tab移動
- focus表示
- 横スクロール異常なし
- ボタン/フォームが押せる
- テキスト切れ/重なりなし
- 画像・動画表示崩れなし

必要に応じてiPhone幅でも確認する。

## E. Vercel Logs / Performance

- Preview deployment build成功
- Runtime errorの重大項目0
- 500系の反復なし
- Supabase-backed routeの異常遅延なし
- Lighthouseまたは同等実測
- Top / Character detailを最低対象とする

Phase15ローカルEvidence:
- Top Performance 99 / Accessibility 100 / Best Practices 96 / SEO 100
- Character Performance 98 / Accessibility 100 / Best Practices 96 / SEO 100

Preview値は別Evidenceとして記録する。

## F. Phase17 Final Decision

以下を分けて記録する。

- CI PASS ≠ Preview PASS
- Preview PASS ≠ Actual Device PASS
- Actual Device PASS ≠ Production Ready

判定候補:
- Release Ready
- Conditional Go
- No-Go

Production deployは最終判定後もユーザー明示許可があるまで行わない。

## Evidence記録

実施時は以下へ結果を追記する。
- `docs/PHASE17_ACCEPTANCE_EVIDENCE_2026-08-28.md`
- `docs/PHASE17_FINAL_AUDIT_2026-08-28.md`（Phase完了時作成）
- `PROJECT_STATUS.md`
