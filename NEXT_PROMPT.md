# SF6DNA 次回開始指示 — Phase23 Pre-device Polish

最終更新: 2026-08-29 JST

SF6DNAの開発をPhase22完了・Phase23開始済み状態から引き継いでください。

## 現在位置

- Phase1〜22: 完了
- Phase23: 開始済み
- 現在: **Pre-device polish**
- PC / iPhone実機テスト: **Release Candidate固定後の最後の作業として保留**

Phase23を最初からやり直さないでください。

## 正本

GitHub:
- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- `main`はユーザーが明示的に許可するまで変更禁止

Supabase:
- Project: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- 実DBを正本とする

SF6 Current Patch:
- `2026.08.03`以降

Vercel:
- Project: `sf-6-dna`
- Project ID: `prj_UwgkJ3pXqGBWhaH6qn6pY8TTZMpR`
- `sf6dna-v2` Previewを使用
- v2 Production deployは禁止

## 品質ルール

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- 推測Modern Commandを登録しない
- SourceなしFrameを確定しない
- 件数目的でpublishしない
- AI CoachがEvidence不足を自由生成で補わない

## 続ける作業

以下を上から順に、実機テスト前に完了する。

1. UI最終監査・調整
2. 画像参照 / fallback / トリミング / OGP監査
3. ユーザー向け文言監査
4. metadata / robots / sitemap / SEO監査
5. Preview build / runtime / 主要route確認
6. Real Auth / Admin E2E
7. Public Gate最終監査
8. KNOWN_ISSUES / TECH_DEBT現行v2再監査
9. Release docs同期
10. CI全Gate再実行
11. Lighthouse / Performance確認
12. Release Candidate HEAD固定
13. PC実機テスト
14. iPhone実機テスト
15. Production Readiness判定

Production deployは、ユーザーが明示的に許可した場合のみ行う。

## 実機テスト

`docs/PHASE23_REAL_DEVICE_TEST_CHECKLIST_2026-08-29.md` を使用する。

ただし現在は実行せず、Pre-device polishとRelease Candidate固定が完了した後に開始する。
