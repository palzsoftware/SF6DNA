# SF6DNA Phase19 Manual / External Acceptance Plan

最終更新: 2026-08-28 JST

状態: **廃止 / Phase20へ移管済み**

## 変更理由

人力作業・外部検証を当面実施できないため、Phase19をManual / External Acceptance専用Phaseとして使用する方針を廃止した。

旧Phase19 Backlogに含まれていた以下の作業は、すべてFinal PhaseであるPhase20へ移管する。

1. Vercel Project / Preview URL成立
2. Preview runtime / build / runtime logs
3. real Admin / non-admin session E2E + limited CRUD / cleanup
4. user actual PC/device/browser確認
5. Public Preview/network Performance確認
6. Production Readiness final decision
7. Production deploy（ユーザー明示許可がある場合のみ）

## 新しいPhase割り当て

- Phase19: `Internal Data Integrity & Release Hardening`
  - `docs/PHASE19_IMPLEMENTATION_PLAN.md`
  - ChatGPT / GitHub / Supabaseだけで完結できる内部作業

- Phase20: `Final Manual / External Acceptance & Production Decision`
  - `docs/PHASE20_FINAL_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md`
  - 人力・外部UI・実認証・実デバイス・Vercel Preview・Public Network依存作業

この文書は履歴互換のため残すが、実施Planとしては使用しない。
