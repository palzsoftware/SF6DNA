# SF6DNA Phase15 Static Precheck

最終更新: 2026-08-28 JST

状態: **Phase15進行中 / runtime acceptance pending**

## 目的

Vercel PreviewおよびユーザーPC実機確認が未成立の間に、P15-01 / P15-02 / P15-04でPreview不要の静的確認を先行し、実環境テスト時の阻害要因を減らす。

この文書の静的確認を、Preview/runtime/actual-device確認済みとして扱わない。

## Root Directory

現行SF6DNA v2 Web appのRoot Directoryは:

- `v2-web`

リポジトリ直下の旧HTML版とは分離して扱う。

## P15-01 Public Runtime Smoke — static precheck

現行App Router上に最低確認対象の主要経路が存在することを確認した。

- `/`
- `/characters`
- `/characters/[slug]`
- `/players`
- `/players/[slug]`
- `/videos`
- `/videos/[slug]`
- `/search`
- `/diagnosis`
- `/diagnosis/[slug]`
- `/coach`
- `/api/coach/retrieve`
- `/api/diagnosis/recommend`

Phase14の既存Public Integration / Release Gate testsは、published/verified/source条件およびsafe empty behaviorを静的に監視する。

未完了:
- Preview上のHTTP/runtime確認
- runtime log確認
- 実データを用いた画面遷移確認

## P15-02 Auth / Admin E2E — static precheck

確認済み:
- Adminサブページ側は`requireAdmin()`で認証と`profiles.role = admin`を要求する。
- 未ログイン時は`/auth?next=/admin`へ誘導する。
- Adminトップは未ログインとnon-adminをそれぞれ安全なメッセージ表示にする。

### Phase15で検出・修正した項目

修正前:
- `/auth?next=/admin`でログインしてもAuthFormが`next`を無視し、常に`/`へ戻っていた。

修正後:
- Auth pageが`next`を受け取る。
- `/`から始まり`//`では始まらない内部パスだけを許可する。
- ログイン成功後は安全化した`nextPath`へ戻す。
- 不正/外部形式のreturn pathは`/`へフォールバックする。
- static regression testを追加した。

これはE2E完了ではない。実セッションで以下が必要:
- unauthenticated Admin block
- non-admin write block
- admin login
- admin route access
- test Create/Edit
- save/re-fetch
- cleanup
- Audit Log

## P15-04 Responsive / Accessibility — static precheck

Phase14から継続してコード上では以下が存在することを確認済み:
- `focus-visible` outline
- skip link
- button minimum height 44px
- responsive grid breakpoints
- horizontal scroll container for wide Admin tables
- character tabs horizontal scrolling
- overflow-wrap for long text/URLs
- form labels
- live status message on Auth form

未完了:
- PC実ブラウザ
- smartphone/tablet viewport
- actual device
- keyboard-only navigation
- visual overflow/overlap
- modal/dialog runtime behavior（対象がある場合）

ユーザー帰宅後のPC実機確認は`docs/PHASE15_PC_DEVICE_TEST_CHECKLIST.md`を使用する。

## P15-03 Advisor precheck

2026-08-28再確認:
- Security Advisor: 0 lints
- Performance Advisor: `unused_index` INFO
- Performance Advisor: `multiple_permissive_policies` WARN

Preview/query実測前にindex削除やRLS policy統合は行わない。

## Current blocker

P15-00:
- Connected Vercel Team Project: 0
- Preview URL: 未成立
- Production deployment: 未実施

Production deployを回避策として使用しない。

## Phase15 next acceptance

Previewが成立するまで:
- static/read-only監査
- regression test追加
- Preview設定準備

Preview成立後:
1. P15-01 runtime smoke
2. P15-02 Auth/Admin E2E
3. P15-04 PC/viewport/device verification
4. P15-03 measured performance review

Phase16へはユーザー明示指示なしで進まない。
