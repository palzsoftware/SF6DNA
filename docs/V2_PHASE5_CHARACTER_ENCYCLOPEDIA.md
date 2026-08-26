# SF6DNA v2 Phase5 キャラクター辞典 実装記録

更新日: 2026-08-26
対象ブランチ: `sf6dna-v2`

## 1. Phase5の目的

SF6DNAの最大情報資産となるキャラクター辞典について、旧版の巨大な静的JavaScriptデータへ依存せず、Phase3で定義したPostgreSQLデータモデルを参照するNext.js側の表示基盤を作る。

## 2. 今回実装した範囲

### 一覧

`/characters`

- Supabase `characters` テーブルから公開キャラクターを取得するRepositoryを追加
- `status = published` かつ `is_playable = true` のデータだけを表示
- `display_order` を優先して並べる
- キャラクターカードを共通Component化
- DB未設定時は未検証の旧データを代替表示せず、接続待ち状態を表示

### 詳細

`/characters/[slug]`

- slugでキャラクターを取得
- 概要
- 日本語名 / 英語名
- キャラクター画像
- archetype
- preferred range
- difficulty
- strengths summary
- weaknesses summary
- character guide sections
- 個別metadata/description

を表示できる構造を追加した。

### 子URL

以下を同一キャラクター情報から移動できるようにした。

- `/characters/[slug]/moves`
- `/characters/[slug]/combos`
- `/characters/[slug]/setups`
- `/characters/[slug]/matchups`
- `/characters/[slug]/training`
- `/characters/[slug]/players`
- `/characters/[slug]/videos`

現時点では各子ページは正式DB接続の受け皿までを実装しており、Phase6以降の検索やPhase9の詳細攻略データと連携して拡張する。

## 3. 追加した主要ファイル

```text
v2-web/src/
├─ app/characters/
│  ├─ page.tsx
│  └─ [slug]/
│     ├─ page.tsx
│     └─ [section]/page.tsx
├─ components/
│  ├─ character-card.tsx
│  └─ character-tabs.tsx
├─ lib/
│  └─ characters.ts
└─ types/
   └─ character.ts
```

## 4. データ精度方針

旧 `assets/js/character-data.js` は自動的に公開データへ昇格させない。

v2では以下を確認したデータからDBへ投入する。

1. キャラクターが現行版で利用可能か
2. 名称・表記
3. パッチ適用範囲
4. 出典
5. 客観情報かSF6DNA編集情報か
6. verification status

未確認データを画面の穴埋め目的で作成しない。

## 5. Phase3 schemaとの整合

Character Repositoryは `docs/V2_SCHEMA_DRAFT.sql` の以下の列名を基準にした。

- `name_ja`
- `name_en`
- `summary`
- `image_url`
- `difficulty`
- `preferred_range`
- `archetype`
- `strengths_summary`
- `weaknesses_summary`
- `display_order`
- `status`

CharacterGuideSectionは以下を使用する。

- `section_type`
- `title`
- `body`
- `display_order`
- `status`

## 6. 未実施

- Supabase Projectへのschema migration
- キャラクター実データ投入
- 旧データの検証・移行
- CharacterAliasの検索接続
- Moves / FrameDataの実表示
- Comboの実表示
- Setup/Sequence/Counterの実表示
- Player/Videoとの実JOIN
- build/typecheck/lint実行

これらはDB実環境と各後続Phaseで実施する。

## 7. Phase5判定

キャラクター辞典の「画面・URL・型・Repository・DB接続設計」は完了。

実データについては正確性を優先し、未検証の旧データを自動公開しないため、データ投入は別途継続作業とする。

次はPhase6で横断検索・Alias検索の基盤を作る。
