# Source 30件の実適用準備

対象RC基準: `f0ef3991`。既存の個別判断 `LINK_ONLY=29`、`PUBLIC_WITH_ATTRIBUTION=1` を再利用します。今回は外部再調査・DB更新・公開overlay・relation採用変更を行いません。

`SOURCE_APPLICATION_PROPOSALS.json` は全30件の正確なSource ID、旧title/publisher、提案title/publisher、HTTPS URL、利用方法、未採用状態を持ちます。実動画名に対応した日本語の説明名を提案しています。ヤスミン1件は公式キャラクターガイドであり、元の「現行変更解説候補」やcommunity分類と異なることを記録しています。source_type / reliability_level の自動変更は提案に含めません。

## 実行前の照合

`scripts/source-application-plan.mjs` は純粋なオフライン照合です。対象が正確に30件、IDが重複しない、現在のSourceが存在する、title/publisher/url列が存在する、URLがHTTPS、帰属metadataが揃う、既存entity relationが存在する、という条件を照合します。

- `READY_TO_APPLY`: 個別metadata mappingと既存relation接続の準備が揃う状態。
- `HOLD`: title/publisher/URLが旧snapshotから変化、または既存relationがない状態。上書きせず差分を再確認します。
- `BLOCKED`: Source欠損・schema不適合・HTTPS違反・不正IDなど、具体的な入力の問題。

この行単位の準備判定とは別に、全30件のexecutionは `BLOCKED` です。DB_WRITE禁止と公開適用の承認待ちが理由で、`APPLIED=0` を維持します。READYの件数を公開済み件数として扱いません。

Fresh snapshotは `sources` 配列（id/title/publisher/url）、`relations` 配列（source_id/entity_type/entity_id/relationship、任意entity_label）、`schema.source_columns` 配列を入力します。SQLを実行する機能はありません。

```sh
node scripts/source-application-review.mjs docs/release-20260930-publication/SOURCE_APPLICATION_PROPOSALS.json /tmp/source-fresh-snapshot.json
node --test --test-isolation=none scripts/source-application-plan.test.mjs
```

## 既存表示への接続位置

| 表示位置 | Source名 | Publisher | 外部URL | 適用上の注意 |
|---|---|---|---|---|
| `/sources` / `src/app/sources/page.tsx` | strong | sourceProviderLabel | 外部リンクカード | RPC `list_public_sources` の既存metadataを消費します。現在はpublisherNULL時YouTube等のproviderへfallbackします。 |
| キャラクター情報源 / `src/components/character-detail-pilot.tsx` | strong | small | `関連動画を見る` | `relationship !== candidate` の既存filterを維持します。metadata更新だけではcandidateが採用済みになることはありません。 |
| キャラクター詳細 / `src/app/characters/[slug]/page.tsx` | strong | small | presentSource CTA | 既存Source配列の表示を使います。未知の採用情報をoverlayしません。 |
| 関連動画参考 / `src/components/character-video-reference-card.tsx` | 既存Sourceタイトル | p | 既存href | 動画の独自文章や画像をコピーしません。 |
| Player情報源 / `src/app/players/[slug]/page.tsx` | source.title | 同じspan内 | 既存外部リンク | 該当relationが存在する場合のみ影響します。新しいrelationを作りません。 |
| 一般詳細 / `src/components/simple-detail.tsx` | source.title | 同じ表示内 | 既存href | 公開対象entityのRPC gateを維持します。 |

公式ガイド1件も帰属表示はSource名＋「Street Fighter（CAPCOM公式）」＋元YouTube URLで成立します。独立した著作権footer、iframe、新API、画像を追加する必要はありません。29件のCommunity動画はMC MuraFGCの解説への補助リンクです。リンク採用はフレーム値・コンボ成立・現行パッチとの一致を検証したことにはなりません。

## 承認後の適用単位

公開metadataへ適用する場合も、更新範囲は既存 `sources.id` に一致する `title` と `publisher` に限定する案です。URLは現状HTTPSを保持し、entity_sourcesのentity_type/entity_id/relationship、source_type、reliability_level、entity公開statusを変更しません。

前提条件として旧title/publisher/urlがFresh snapshotと一致する行だけ適用する設計です。競合した行はHOLDへ戻します。実行用SQL・migrationは作成せず、DB_WRITEと公開範囲の承認が得られるまで実適用しません。

RootのFresh schema snapshotで `sources.title/publisher/url` はtext列、`sources.id` はuuid主キーと確認しました。`entity_sources` には `(entity_type, entity_id, source_id)` のUNIQUE制約とsourcesへの外部キーがあります。既存Source IDを更新するmetadata案はこれらを変えず、同じ動画URLを複数キャラクターのSource行で使っていることを理由にSource IDを統合しません。entity_sources.entity_idは多態的な参照なので、Source外部キーの存在だけで参照先entityの公開準備ができたとは判断しません。

適用後は30 Source IDのmetadata照合、8 unique HTTPS URLの到達性、`/sources` と対象entityのSourceカードを限定確認します。既存65route /86 URLの全再監査は必要ありません。
