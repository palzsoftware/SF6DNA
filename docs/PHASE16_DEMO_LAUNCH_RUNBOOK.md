# SF6DNA Phase16 Demo Launch Runbook

最終更新: 2026-08-28 JST

状態: **P16-04完了 / Production未実行**

## 目的

SF6DNA v2をデモ公開候補としてVercel Previewで確認し、Production公開前に停止条件を判定するための運用手順。

## Repository

- GitHub: `palzsoftware/SF6DNA`
- deploy対象branch: `sf6dna-v2`
- Root Directory: `v2-web`
- `main`: ユーザー明示許可まで変更禁止
- Production deployment: ユーザー明示許可まで禁止

## 必須Environment Variables

`v2-web/.env.example` と現行コードから確認した値:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

`SF6DNA_BACKEND_URL` は `.env.example` に存在するが、Phase16コード検索では現行v2からの利用箇所を確認できなかったため、デモLaunch必須値として断定しない。

### Preview設定

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase `SF6DNAPro` のURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの公開用publishable/anon key
- `NEXT_PUBLIC_SITE_URL`: 実際に成立したPreview URL

Service Role KeyをPublic/Preview client envへ入れない。

## Vercel Project設定

1. Repositoryを `palzsoftware/SF6DNA` に設定する。
2. Root Directoryを `v2-web` に設定する。
3. FrameworkはNext.jsとして検出させる。
4. Preview environment variablesを設定する。
5. `sf6dna-v2` からPreview Deploymentを作成する。
6. Deployment targetがProductionではないことを確認する。

現在ChatGPT接続Vercel toolではProject作成時の `target/name/files/rootDirectory` を明示できないため、誤Deploy防止のため無引数Deployは使用しない。

## Preview Acceptance

Preview URL成立後、最低限確認:

- `/`
- `/characters`
- Character detail
- `/players`
- Player detail
- `/videos`
- Video detail
- `/search`
- `/diagnosis`
- 1診断の完走
- `/coach`
- `/auth`
- 未ログインAdmin subrouteの遮断
- `/robots.txt`
- `/sitemap.xml`

加えて:
- Vercel runtime errorsにRelease-blocking errorがない
- draft/reviewed/unverifiedを確定情報としてPublicへ漏らさない
- safe empty stateが維持される
- AI Coach `generationEnabled=false`

## Actual device/browser acceptance

Phase15の実機チェックリストを使用する:
- `docs/PHASE15_PC_DEVICE_TEST_CHECKLIST.md`

PC DevToolsやCI emulationをactual device確認の代替完了扱いにしない。

## Production前Gate

以下の全てがPASSするまでProductionへ進めない:

- Preview deployment success
- Preview runtime smoke success
- Vercel runtime blocker 0
- Auth/Admin E2E必要範囲完了
- actual device/browserで重大崩れ0
- Security重大blocker 0
- Public Data Gate維持
- AI Coach Generation OFF
- Release Decisionが`GO`
- ユーザーがProduction deploymentを明示許可

## Stop conditions

次の場合はProductionへ進まない:

- Previewで5xx/主要route failure
- draft/reviewed/unverified leakage
- Admin/Auth bypass
- Source/Patch/Verification表示の重大な誤り
- actual deviceで操作不能なレイアウト崩れ
- Production targetしか選択できない状態
- 環境変数の誤設定
- Release DecisionがConditional Go / No-Go

## Rollback方針

Productionをまだ実行していない現在はrollback対象なし。
将来Production後に重大問題が出た場合は、新しい推測修正を即公開するのではなく、直前の検証済みDeploymentへ戻す方針とする。

## 現在状態

- Vercel Project: 0
- Preview: 未成立
- Production: 未実施
- `main`: 未変更

したがって、本Runbook作成時点ではLaunch操作を実施していない。
