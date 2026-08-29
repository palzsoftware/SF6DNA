# SF6DNA Phase23 Final Manual / External Acceptance Plan

最終更新: 2026-08-29 JST
状態: **開始済み / Pre-device polish進行中**

## Phase23名称

**Final Manual / External Acceptance & Production Decision**

## 現在の進め方

Phase23は開始済みだが、ユーザー指示によりPC / iPhone実機テストはリリース前の最後のAcceptanceとして実施する。

そのため、現在は実機テストを一旦保留し、以下のPre-device polishを先に完了する。

### Pre-device polish

1. 全ページUI最終確認・調整
2. 画像監査・調整
3. ユーザー向け文言監査
4. metadata / robots / sitemap / SEO
5. Preview runtime / logs
6. Real Auth / Admin E2E
7. Public Gate最終監査
8. KNOWN_ISSUES / TECH_DEBT現行v2再監査
9. Release文書同期
10. CI全Gate再実行
11. Public Network Performance / Lighthouse
12. Release Candidate HEAD固定

上記完了後に実機テストを開始する。

## P23-00 Final Baseline

Release Candidate固定時に実施:

- Pre-device polish完了HEAD固定
- `main`未変更確認
- Current Patch確認
- v2 Production未公開確認

## P23-01 Vercel Project / Preview

現在:

- Vercel project成立済み
- Project: `sf-6-dna`
- Project ID: `prj_UwgkJ3pXqGBWhaH6qn6pY8TTZMpR`
- GitHub `palzsoftware/SF6DNA`接続済み
- `sf6dna-v2` Preview deployment成立済み
- v2 Production deploy未実施

Pre-device polish変更後、最終PreviewがREADYであることを再確認する。

## P23-02 Preview Runtime / Logs

確認対象:

- Top
- Characters list/detail
- Moves
- Combos / Setups / Sequences / Counters / Training
- Players list/detail
- Videos list/detail
- Search
- Diagnosis
- AI Coach safe behavior
- `/tools`
- `/favorites`
- `/my-characters`
- `/compare`
- `/rank-tracker`
- `/diagnosis/history`
- `/about`
- `/faq`
- `/sources`
- `/changelog`
- `/improve`
- `/matchup-card`
- robots / sitemap / metadata
- safe empty / 404
- Vercel build/runtime logs
- 重大5xx 0

## P23-03 Real Auth / Admin E2E

安全に準備された実またはテストアカウントを使用する。

確認:

- unauthenticated block
- authenticated non-admin write block
- admin access
- limited Create / Edit / Publish / Archive
- save / re-fetch
- cleanup
- Public Gate unaffected

禁止:

- `auth.users`への直接SQL投入
- 本番攻略データの不要な破壊的変更

## P23-04 Actual Device / Browser — 最終Acceptance

Release Candidate固定後に実施する。

- user PC actual browser
- iPhone幅または実iPhone
- responsive layout
- horizontal overflow
- overlap
- keyboard/focus
- form/button reachability
- back navigation
- perceived performance
- localStorage系個人機能の操作確認

正本チェックリスト:

- `docs/PHASE23_REAL_DEVICE_TEST_CHECKLIST_2026-08-29.md`

## P23-05 Public Network Performance

実機前に実施する。

- Preview Lighthouseまたは同等計測
- Top
- Character detail
- Supabase-backed route
- Improvement feature主要route
- runtime error / response behavior

## P23-06 Final Cross-check

- Phase19〜22 Internal Evidenceとの矛盾確認
- Preview上のPublic Gate再確認
- 実認証によるAdmin境界確認
- Release docs最終確認
- 最終実機テスト結果確認

## P23-07 Production Readiness Final Decision

判定:

- Release Ready
- Conditional Go
- No-Go

## P23-08 Production Deployment

ユーザーから明示的なProduction deploy許可がある場合のみ実行対象とする。

許可がない場合、Release Ready判定までで停止する。

## Exit Criteria

- Pre-device polish完了
- Release Candidate固定
- 必須Manual / External Acceptance完了
- Production Readiness判定済み
- Release blockerが0、またはNo-Go理由が明文化済み
- Production deployはユーザー明示許可に従う

## 絶対ルール

- `main`は明示許可まで変更禁止
- v2 Production deployは明示許可まで禁止
- `reviewed ≠ verified`
- `draft ≠ published`
- 推測Modern Command禁止
- SourceなしFrame確定禁止
- 件数目的のbulk verify / publish禁止
- actual device Evidenceをemulationだけで代用しない
