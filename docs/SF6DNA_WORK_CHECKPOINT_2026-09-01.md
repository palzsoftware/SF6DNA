# SF6DNA Work Checkpoint — 2026-09-01

この文書は、31キャラの文言・画像Source収集完了後の再開用チェックポイントである。会話履歴ではなく、記録時点のGit作業ツリーとSupabase実DBを根拠に作成した。

## Repository state

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- Strategy audit baseline: `f8b70beef957719f3e7291caccc073fea930bae5`
- Baseline subject: `docs: refresh 31-character readiness audit`
- このチェックポイント自体は`docs: checkpoint completed character collection`として直後にコミットする
- `main`: 未変更。ユーザー明示許可までmerge・変更禁止
- Production: 未デプロイ
- ローカル固有の未追跡物: `supabase/.temp/`のみ。作業対象外

チェックポイント作成直前、ローカル`sf6dna-v2`は追跡中の`origin/sf6dna-v2`より36コミット先行していた。この記録コミットを含めると37コミット相当になる。通常のHTTPS pushは認証情報がないため失敗しており、GitHub同期を別経路で完了させる必要がある。

## Supabase source-of-truth snapshot

- Project: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Current Patch: `2026.08.03`
- Character Content Package: 31 / 31 complete
- open package: 0
- `auth.users`: 0

| Entity | Active | Draft | Unverified | Reviewed | Verified | Published |
|---|---:|---:|---:|---:|---:|---:|
| Combo | 1213 | 1213 | 1078 | 134 | 1 | 0 |
| Setup | 792 | 792 | 703 | 89 | 0 | 0 |
| Sequence | 475 | 475 | 439 | 36 | 0 | 0 |
| Training | 2974 | 2974 | - | - | 0 | 0 |

Active Strategy合計は2480件。

## Integrity state

- Active StrategyのSource欠損: 0
- Active StrategyのTraining relation欠損: 0
- Active Strategyのpending capture欠損: 0
- Combo notation重複group: 0
- capture_backlogのTraining参照切れ: 0
- capture_backlogのCharacter参照切れ: 0
- capture_backlogのCharacter不一致: 0
- Supabase Security Advisor: 0 lints
- Web tests: 55 / 55 PASS

## Capture backlog policy

- total: 2554
- pending: 2553
- not needed: 1
- provided / confirmed: 0 / 0

撮影待ちの詳細は通常報告では表示しない。ユーザーが「撮影作業できます」と明示した時点で、DBの最新状態からキャラ別・優先度順の撮影リストを作成する。

撮影前のStrategyは原則として`draft / unverified`または`draft / reviewed`を維持する。Sourceがあるだけで`verified`または`published`へ昇格しない。

## Completed scope

- 31キャラのMove / Frame / Command等の既存基盤整備
- 31キャラのCombo / Setup / Sequence文言・画像Source収集
- Classic / Modern、位置・ゲージ・始動・キャラ固有分岐の候補整理
- 各Active Strategyの再現用Training接続
- 各Active Strategyの撮影待ち管理
- 全体重複・Source・関係・公開漏れ監査
- 公開準備資料の更新

## Explicitly incomplete scope

- 実機撮影と現行パッチ成立確認
- 不成立候補のarchive判定
- verified化とPublication approval
- Real Auth / Admin E2E
- Player残画像の人物確認
- Final RC freeze
- PC / iPhone実機Acceptance
- Production readiness判定
- Production deploy

## Resume order

1. このチェックポイントとSupabase実DBを照合する
2. `sf6dna-v2`のGitHub同期状態を確認する
3. 撮影開始前はcapture backlogの参照整合・優先順位・撮影単位だけを整備する
4. ユーザーが撮影可能と明示したら、キャラ別の優先撮影リストを提示する
5. 撮影結果を`provided`へ記録し、成立判定後に`confirmed / rejected / not_needed`へ更新する
6. 全変更後にFinal RC、実機Acceptance、公開判断へ進む

## Related records

- `PROJECT_STATUS.md`
- `docs/PROJECT_COMPLETION_DASHBOARD.md`
- `docs/PHASE33_31_CHARACTER_STRATEGY_AUDIT_2026-09-01.md`
- `docs/PHASE34_CAPTURE_QUEUE_OPERATIONAL_AUDIT_2026-09-01.md`
- `scripts/export-pending-capture-queue.sql`
- `docs/PHASE23_FINAL_MANUAL_EXTERNAL_ACCEPTANCE_PLAN.md`
