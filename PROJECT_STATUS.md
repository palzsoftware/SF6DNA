# SF6DNA v2 Project Status

最終更新: 2026-08-29 JST

## 現在状態

- Phase1〜22: **完了**
- Phase23: **開始済み / Pre-device polish進行中**
- PC / iPhone実機テスト: **リリース前の最後の確認として保留**
- Production Readiness: **未判定 / 最終実機テスト後に判定**
- v2 Production deploy: **未実施**

現在は、実機テストを最後に行えるように、UI・画像・文言・SEO・Preview・Auth/Admin・Public Gate・Release文書・CI・Performanceの仕上げを先に進める。

## 正本

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`: ユーザー明示許可まで変更禁止
- main baseline: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch baseline: `2026.08.03`

## Phase状態

| Phase | 状態 | 概要 |
|---|---|---|
| Phase1〜12 | 完了 | Foundation / Architecture / Data Model / Next.js / Character / Search / Diagnosis / Player / Strategy / Admin / AI Retrieval / Replay Research |
| Phase13 | 完了 | Character Content Verification & Expansion |
| Phase14 | 完了 | Application Integration / Public Data Gate |
| Phase15 | 完了 | Runtime / Browser / Lighthouse / Auth static acceptance |
| Phase16 | 完了 | Release Candidate hardening |
| Phase17 | 完了 | Automated/Internal closure |
| Phase18 | 完了 | Verified Content / Public Gate hardening |
| Phase19 | 完了 | Internal Data Integrity & Release Hardening |
| Phase20 | 完了 / PASS | Verified Content Expansion + Phase1〜20 gap audit |
| Phase21 | 完了 | Modern Command audit / pre-release integration |
| Phase22 | 完了 | Improvement Loop / diagnosis resume / matchup card / replay review |
| Phase23 | 進行中 | Pre-device polish → final real-device acceptance → release decision |

## Phase22完了時の内部Gate

Phase22 final auditで以下を確認済み:

- Typecheck: PASS
- Lint: PASS
- Policy tests: PASS
- Build: PASS
- Phase20 Verified Content Acceptance: PASS
- Phase15 Browser Acceptance: PASS
- Phase15 Lighthouse Audit: PASS
- Supabase Security Advisor: 0 lints

Phase22完了後にUI調整コミットが追加されているため、最終Release Candidate固定前にCIを再実行する。

## 現在のPre-device polish

実機テスト前に完了する対象:

1. 全ページUI最終確認・調整
2. キャラクター / プレイヤー / OGP等の画像監査
3. ユーザー向け文言の最終調整
4. metadata / robots / sitemap / SEO確認
5. Vercel Preview / runtime logs確認
6. Real Auth / Admin E2E
7. Public Gate最終監査
8. `KNOWN_ISSUES.md` / `TECH_DEBT.md`の現行v2再監査
9. Release文書同期
10. 全CI再実行
11. Public Network Performance / Lighthouse
12. Release Candidate HEAD固定
13. PC実機テスト
14. iPhone実機テスト
15. Production Readiness最終判定
16. Production deploy（ユーザー明示許可がある場合のみ）

## Vercel

- Project: `sf-6-dna`
- Project ID: `prj_UwgkJ3pXqGBWhaH6qn6pY8TTZMpR`
- `sf6dna-v2` Preview deployment運用中
- v2のProduction deployは未実施
- 旧`main` baselineのProduction deploymentは既存だが、v2とは別扱い

## Data quality rules

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceが存在するだけではverifiedへ昇格しない
- 推測Modern Commandを登録しない
- SourceなしFrameを確定登録しない
- 件数目的でbulk verify / publishしない
- AI CoachはEvidence不足を自由生成で補わない

## Modern Command

Phase21からの既知の非Blocker:

- Current Move: 2052
- Classic: 2052 / 2052
- Modern: 1441 / 2052
- Missing Modern: 611

公式情報から安全に取得できない611件は未入力を維持し、推測補完しない。

## 次の作業

Phase23を最初からやり直さず、**Pre-device polishの残作業を継続する**。

実機テストはRelease Candidate固定後の最後のAcceptanceとして実施する。
