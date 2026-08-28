# SF6DNA 次回開始指示 — Phase15

最終更新: 2026-08-28 JST

この文書は、Phase15を新しいチャットで開始する場合の引き継ぎ用です。

## 開始文

SF6DNAの開発をPhase14完了状態から引き継いでください。

現在の状態は:
- Phase13完了
- Phase14完了
- Phase15準備完了 / 未着手

Phase14をやり直さず、Phase15の開始監査から進めてください。

最初に必ず以下を現在のGitHub / Supabase実状態と照合してください。

1. `PROJECT_STATUS.md`
2. `docs/PHASE14_FINAL_AUDIT_2026-08-28.md`
3. `docs/PHASE15_IMPLEMENTATION_PLAN.md`
4. `docs/PROJECT_COMPLETION_DASHBOARD.md`
5. `docs/V2_RELEASE_READINESS.md`

## 最重要ルール

GitHub:
- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`はユーザーが明示的に許可するまで変更禁止

Supabase:
- Project: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Supabase実DBを正本とする

SF6 Current Patch:
- `2026.08.03`以降

品質ルール:
- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Commandを登録しない
- SourceなしFrame値を確定登録しない
- Release件数目的で自動publishしない
- AI Coach GenerationをEvidence不足のまま有効化しない

禁止:
- Production deployment
- main merge
- 不可逆DB変更
- bulk delete
- Auth全面再設計
- Phase15要件確定前の新機能追加

## Phase14からPhase15へ正式に繰り越した5項目

1. `P15-00` Preview Environment / Deployment
   - Phase14 P0-06由来
   - Vercel Project 0件のため未検証

2. `P15-01` Preview Runtime / Public Demo Gate Smoke
   - Phase14 P0-07由来

3. `P15-02` Auth / Admin E2E
   - Phase14 P1-06由来

4. `P15-03` Performance Measurement / Advisor Review
   - Phase14 P2-03由来

5. `P15-04` Device / Responsive / Accessibility Runtime Verification
   - Phase14 P2-04のruntime部分
   - Static ReviewはPhase14で完了

重要:
- 再分類しただけであり、これらを検証済み扱いしない。
- 実機確認はユーザーが確認可能になった時点で行う。
- 実機確認ができない間も、可能なPreview/static/read-only監査を進める。

## Phase15開始順

Phase15開始後は原則として:

1. P15-00 Preview環境成立
2. P15-01 Preview Runtime / Public Gate Smoke
3. P15-02 Auth / Admin E2E
4. P15-04 Responsive / Accessibility Runtime確認
5. P15-03 Performance実測 / Advisor Review

の順に進める。

P15-00が外部要因でブロックされた場合はProduction deployで回避せず、進められるread-only監査・静的検証・テストのみ先行する。

## Phase14終了時Evidence

Source code側の最新成功CI対象commit:
- `2fe0b90c6ff2e642f3028df0a5edc9ccaeb5b60e`

GitHub Actions run:
- `33130148956`
- Typecheck success
- Lint success
- Tests 27 / 27 success
- Build success

Supabase:
- public tables 38
- RLS 38 / 38
- playable + published Character 31
- published Move 0
- verified Frame 307
- published Diagnosis 4
- published Diagnosis Question 52
- Security Advisor lint 0
- Current Patch `2026.08.03`

Vercel:
- Project 0
- Preview未成立
- Production未公開

## 開始時の指示

過去会話の推測ではなく、現在のGitHub branch / CI / Supabase / Vercel状態を再取得してください。

Phase15の既存計画と現在状態の差分を確認した後、P15-00から実作業を開始してください。

ユーザー指示なしでPhase16へ進めないでください。
