# SF6DNA V1.1 Public Entity Enrichment Test Evidence — 2026-09-18

## Targeted
PASS:
- exact Move ID + slug + public Source + composite official verification + Current Patch enriches metadata;
- Source-only Move remains unknown;
- identity mismatch refuses enrichment;
- inexact Source relation refuses enrichment;
- non-Move Strategy entity is untouched;
- all current Strategy search/filter gates remain closed;
- reviewed/source/published/relevance do not imply verified;
- Patch match, unknown, stale, and non-applicable remain distinct;
- sensitive identifiers are removed from retrieval queries.

Command: `node --test tests/public-entity-enrichment-v11.test.mjs tests/coach-trusted-retrieval-v11.test.mjs tests/search-release-boundary.test.mjs tests/ai-coach-v11.test.mjs tests/coach-shared-analysis-v11.test.mjs`

Result: 41 PASS / 1 FAIL. The failure is the existing `ai-coach-v11` static expectation for the literal `生成回答はまだ無効`; generation remains disabled in the API (`generationEnabled: false`) and the failure is unrelated to enrichment.

## Repository checks
- `npm run typecheck`: PASS
- `npm run lint`: PASS
- `npm run test:release-gates`: PASS (14/14)
- `npm run build`: PASS
- `npm test`: FAIL from existing static UI expectations; enrichment tests pass
- `git diff --check`: PASS

Build warnings: existing missing `metadataBase` warning. Build-generated `tsconfig.json` and `next-env.d.ts` edits were inspected and excluded from the change set.


## 2026-09-24 Fresh検証
| 検証 | 結果 |
|---|---|
| Enrichment + Trusted Retrieval | 54 PASS / 0 FAIL |
| 全テスト（Persona/Input/Provider等含む） | 377 PASS / 0 FAIL |
| release-gates | 14 PASS / 0 FAIL |
| typecheck | PASS |
| lint | PASS |
| build | PASS（既存metadataBase警告2件） |
| git diff --check | PASS |
| 実DBのschema/RPC/RLS/current patch | READ-ONLY確認 |
| anon Move / unverified frame / direct Source | 0 / 0 / 0 |
| 実DBの公開Move成功経路 | NOT_RUN：公開Moveなし |
| ブラウザ実機QA | NOT_RUN |

Source ID/URL/typeの同一relation、character/patch不一致、非公開状態、Patch欠落、未知到達性、閉鎖Strategyゲート、部分batch結果、例外fallback、複数現行frameの拒否を追加検証。
Mockは実DB成功の代替証拠ではない。旧9/18の失敗結果は履歴として保持し、本節を最新結果とする。
