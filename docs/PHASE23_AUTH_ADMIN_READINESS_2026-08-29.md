# SF6DNA Phase23 Auth / Admin Readiness

Date: 2026-08-29 JST
Branch: `sf6dna-v2`
Supabase: `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`)

## Status

**NON-HUMAN AUTH / ADMIN READINESS COMPLETE / REAL SESSION E2E HELD**

ユーザー指示により、実ログインを必要とする操作は最後のmanual stageへ保留する。この文書は実セッションなしで確認・修正できるAuth / Admin境界を記録する。

## Auth inventory

2026-08-29 read-only確認:

- `auth.users`: **0**
- 既存Admin実アカウント: 0
- 既存non-admin実アカウント: 0

したがって、既存セッションを利用したReal Auth / Admin E2Eは現時点では実行不能。

禁止事項を維持:

- `auth.users`へSQLで偽ユーザーを直接投入しない
- 架空credentialを作らない
- static testをReal Auth Evidenceとして扱わない

## Signup / role boundary

DB監査:

- `auth.users`新規作成時に`private.handle_new_user` triggerがprofileを作成する
- 新規profileのroleは`user`
- `profiles` RLSで一般ユーザーが自身のroleをadminへ自己昇格できない
- `private.is_admin()`によるadmin判定を使用
- unauthenticated admin subrouteはAuth導線へ送る
- non-adminはAdmin操作権限を得ない

## Release-prep defects found and fixed

Real Auth E2E前のコード監査で、Move Admin / Public Gateに次の問題を検出した。

### 1. Public Move Gate polymorphic Source join

`entity_sources.entity_id`はpolymorphicであり、Move / Command / FrameへのFKを持たない。

旧Public GateはPostgREST inferred join `entity_sources!inner(...)` に依存していたため、Moveが実際にpublishedされた際にEvidence判定が正しく成立しない可能性があった。

修正:

- commit: `6abe88a67d812d130e0f46aeaf15feebfaad6a3c`
- `entity_sources`をentity_type / entity_idで明示取得
- `sources`を別照合し、`reliability_level=official`を確認
- Move / Classic Command / Current verified Frameのofficial Evidenceを個別に要求
- Modern Commandはoptionalのまま維持

### 2. Admin publish gate was weaker than Public Gate

旧Adminでは、Moveをpublishedへ変更する条件がPublic Gateより緩く、DB上で`published`なのにPublic Gate不合格という不整合を作れる余地があった。

修正:

- commits: `5a112fb47db87d476543da236834537c34720066`, `6b5a4b8e1974f677691e655e274da9626bdb18b5`
- Classic Command必須
- Current Patch必須
- Current Patchのverified Frame必須
- Move official Source必須
- Classic Command official Source必須
- Current Frame official Source必須

新規Moveをpublished指定した場合も、いったんdraftで作成し、Command / Frame / Evidence登録後に厳格Gateを再確認してからpublishedへ昇格する。

### 3. Admin UI lacked Command / Frame Evidence attachment

旧UIではMove本体へSourceを付与できても、Classic Command / FrameへEvidence Sourceを追加できなかった。

修正:

- commit: `2fa254feb3469b6e4b70b65f31bb0a7035695287`
- Move本体
- Classic / Modern Command
- Frame version

を対象としてEvidence Sourceを明示選択できるようにした。

新規Moveでは選択SourceをMove / 入力Command / FrameへEvidenceとして登録する。

### 4. CI invariant updated

- Phase20 strict publication evidence guard追加
- Phase19の旧inferred-join文字列依存を修正
- Phase19 fix commit: `22af783bc8fb947be138cfcdd56279a053d8f713`

## Automated regression

Application code head:

`6b5a4b8e1974f677691e655e274da9626bdb18b5`

CI-only follow-up head:

`22af783bc8fb947be138cfcdd56279a053d8f713`

確認済み:

- Phase16 Release Acceptance — PASS (`33239446677`)
- Phase15 Runtime Smoke — PASS (`33239446690`)
- Phase15 Browser Acceptance — PASS (`33239446655`)
- Phase15 Lighthouse Audit — PASS (`33239446718`)
- Phase20 Verified Content Acceptance — PASS (`33239446647`)
- SF6DNA v2 Web Check — PASS (`33239446717`)
- Phase18 Data Gate Acceptance — PASS (`33239446644`)
- Phase19 Internal Hardening — PASS after invariant update (`33239510750`)

## Vercel Preview

Latest branch head Preview:

- SHA: `22af783bc8fb947be138cfcdd56279a053d8f713`
- Deployment: `dpl_CHHhrT5RgaXP9LGGHMm7mPSE2PgT`
- State: READY
- target: Preview
- Build error: 0
- runtime error / fatal checked: 0

Production deployは行っていない。

## DB no-change check

2026-08-29 final read-only check:

- `auth.users`: 0
- published Move: 0
- published Combo: 0
- published Setup: 0
- published Sequence: 0
- published Counter: 0
- published Training: 0

今回のAuth/Admin readiness作業で実ユーザー・攻略コンテンツのstatusは変更していない。

## Remaining Real Auth / Admin E2E — manual only

実または正式なテストアカウントをAuthフローから準備した後、実ブラウザセッションで以下を確認する。

1. unauthenticated admin subroute block
2. authenticated non-admin write block
3. admin access
4. limited draft Create
5. Edit / save / re-fetch
6. Evidence Source attachment
7. strict Publish gate rejection for incomplete evidence
8. approved test dataでPublish gate success
9. public read behavior
10. Archive
11. cleanup
12. Public Gate unaffected

このReal Session E2E完了前にFinal RCとは判定しない。
