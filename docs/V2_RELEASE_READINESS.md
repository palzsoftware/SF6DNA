# SF6DNA v2 Release Readiness

## 目的

コード完成と公開可能状態を分離して判定する。公開は「画面が動く」だけでなく、データ品質・認証・検索・SEO・実機確認まで満たした段階で行う。

## Gate A: Build / Runtime

- GitHub Actions: install / typecheck / lint / build が成功
- 主要Routeで500エラーがない
- Supabase未設定時に安全なfallback表示になる
- Backend API障害時にページ全体が落ちない

## Gate B: Security / Admin

- Supabase RLSが全管理対象テーブルで有効
- Admin writeは `requireAdmin()` + RLS の二重ガード
- 実AdminアカウントでCreate / Edit / Publish / ArchiveのE2E確認
- API key / service role keyをClientへ露出しない
- Security Advisorの重大項目0

## Gate C: Data quality

公開攻略データは以下を満たす。

- `status = published`
- `verification_status = verified`
- Sourceあり
- Patch依存データはvalid-from Patchあり
- 旧Patch情報を現行扱いしない
- Move公開時はCommand + Frame Dataを必須とする
- AI生成のみを根拠にframe / punish / true blockstring等を確定しない

## Gate D: Character encyclopedia

31プレイアブルキャラクターについて、公開開始時点の最低条件を次とする。

- 基本Characterレコードと公式Source
- Character Alias
- 主要Move / Command / Frameのverified投入
- 最低限の基本Combo
- 代表的なCounter / Training導線

全てを100%埋めるまで公開を止めるのではなく、未投入領域を明示し、誤情報を公開しないことを優先する。

## Gate E: Diagnosis

- 上達課題診断
- プレイスタイル診断
- キャラクター適性診断
- 総合簡易診断

各診断で質問数・選択肢数・結果表示・やり直し・検索導線を確認する。

キャラクター直接推薦は `character_trait_scores` のverified + publishedマッピングが十分に揃うまで解禁しない。

## Gate F: AI Coach

生成回答を有効化する前に以下を満たす。

- Current Patch取得
- Evidence取得
- Evidence Source表示
- verifiedデータ優先
- Evidence不足時に「情報不足」と返せる
- DBにない攻略知識を断定しない

初回リリースではEvidence表示のみでも可。生成回答は後から段階解禁する。

## Gate G: Deployment / UX

- Vercel Preview成功
- Supabase環境変数設定
- PCブラウザ確認
- iPhone幅確認
- ナビゲーション・検索・診断の実機確認
- 主要ページのmetadata / OGP / sitemap / robots確認
- 画像・動画の遅延読み込みとモバイル表示確認

## Gate H: Launch decision

正式公開前に `/admin/data-quality` を確認し、以下の3種類を明確に区別する。

1. 実装済み
2. データ投入済み
3. verified + published済み

「実装済み」を「コンテンツ完成」と扱わない。

---

## Phase14 Safe Demo Release Gate — 2026-08-27

Phase14では上記Gateをデモ公開判定へ具体化する。件数確保のための自動publishは行わない。

### Public Strategy Gate

Combo / Setup / Sequence / Counter / Training はPublic UI・Unified Search・AI Coach Retrievalの全経路で、最低限次を同時に満たすこと。

1. `status = published`
2. `verification_status = verified`
3. Source relationが存在する
4. Patch依存データは現行または明示した有効Patchを持つ
5. `draft / reviewed / unverified` は確定攻略情報としてPublicへ出さない

Phase14 P0-02でRLSと`search_sf6dna`へ `published + verified` を強制した。Web側もKnowledge list / Character section / Detailで同条件を明示する。
Phase18ではStrategy Public RLSをさらに`published + verified + Source relation`へ強化した。

### Public Move Gate

Moveには独立した`verification_status`列がないため、Moveの`status=published`だけを品質判定に使わない。

デモ公開候補Moveは最低限次を満たすこと。

1. Characterがplayable + published
2. Moveが公開候補としてレビュー済み
3. Current Frameが存在する
4. Current Frameが `verification_status = verified`
5. Current Frameの`valid_from_patch_id`がCurrent Patchと一致する
6. Classic Commandが存在する
7. Frameにofficial Sourceが存在する
8. Moveにofficial Sourceが存在する
9. Classic Commandにofficial Sourceが存在する
10. Modern Commandは存在する場合のみ表示し、欠損を推測補完しない

2026-08-27の実DB監査では、この機械条件を満たすdraft Move候補は **307件 / 4キャラ**。

- ジェイミー: 93
- キンバリー: 76
- ガイル: 70
- 春麗: 68
- 307件中Modern Commandあり: 295
- Modern Commandなし: 12

2026-08-28 Phase19で307候補すべてについて、Move / Current Frame / Classic Commandのofficial Evidenceを再確認した。App GateとMove RLSも同条件へ統一した。

これは**公開承認件数ではない**。Move本体は全件draftのため、候補抽出と表示基盤を先に整え、Source/名称/Command/Frameの最終公開チェックを通過したものだけを個別にpublish対象とする。

### Strategy candidate snapshot

2026-08-27時点で `verification_status=verified` のStrategyは、キンバリーのCombo 1件のみ確認済み。

- `kimberly-20260803-modern-assist2`
- `Modern アシストコンボ2（2026.08.03）`
- Patch: `2026.08.03`
- Source relation: 2
- Status: `draft`

Phase13クリーンアップ方針どおりdraftを維持し、監査だけを理由にpublishへ戻さない。

### Safe empty state

条件を満たすPublicデータが0件の場合、画面は未検証データを代替表示せず「公開済みデータはまだありません」等のempty stateを表示する。

### Release decision rule

- 機械Gate通過 ≠ 自動publish
- Sourceあり ≠ verified
- reviewed ≠ verified
- draft ≠ published
- 検証できない値をデモ都合で埋めない
- Production公開はユーザーの明示許可なしに実行しない

---

## Phase19 Internal Hardening — 2026-08-28

Phase19では外部AcceptanceをPhase20へ分離したまま、内部Release Gateを横断監査した。

- PostgreSQL FK: validated
- Current Patch: 1件
- duplicate / blank slug重大問題: 0
- Current Frame duplicate: 0
- Patch validity reversal: 0
- polymorphic Source invalid target: 0（legacy type 16件を構造正規化後）
- Supabase Security Advisor: 0 lints
- Public Move Gate: App + RLSをCurrent Patch verified Frame + official Move/Frame/Classic Evidenceへ統一
- Strategy Public RLS: published + verified + Source
- AI Coach Generation: OFF維持

Phase19の内部PASSは、Gate GのVercel Preview・実機・実認証E2Eを代替しない。Production Ready最終判定はPhase20で行う。
