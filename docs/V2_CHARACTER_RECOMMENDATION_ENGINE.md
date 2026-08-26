# SF6DNA v2 Character Recommendation Engine

## Purpose

キャラクター適性診断・総合簡易診断の回答を、検証済みの `character_trait_scores` と照合して実キャラクター候補へ変換する。

## Safety / quality rules

- 診断回答はプレイヤーの好み・自己認識であり、客観的な強さ評価ではない。
- 推薦対象に使う Character Trait Score は `status = published` かつ `verification_status = verified` のみ。
- Character Trait Score は Source 必須の公開ゲートを通す。
- 不足データをAIで補完しない。
- active trait の75%以上がマッピングされていないキャラクターは推薦候補から除外する。
- 推薦結果が0件の場合は「データ不足」を明示し、架空の推薦を返さない。

## Scoring

診断結果の各Traitをユーザー重み `u`、キャラクター側Trait Scoreを0〜5の `c` とする。

`weighted = Σ(u × c)`

`denominator = Σ(u × 5)`

`matchPercent = round(weighted / denominator × 100)`

表示時は一致度に加えて、寄与が大きいTrait上位3件を理由として示す。

## Runtime flow

```text
Diagnosis Runner
  ↓ score_payload集計
POST /api/diagnosis/recommend
  ↓
character_traits (published)
  ↓
character_trait_scores (published + verified)
  ↓
characters (published + playable)
  ↓
coverage gate
  ↓
weighted scoring
  ↓
TOP 5 recommendations
```

## Current state

- Recommendation API: implemented
- Diagnosis Runner connection: implemented for `character_fit` and `comprehensive`
- Common traits: 12 published
- Character Trait Scores: 0 at implementation time
- Therefore runtime correctly returns a data-insufficient message until verified mappings are added.

## Next data work

1. 31 characters × 12 traitsの候補評価を作成
2. Sourceと評価根拠を記録
3. review
4. verified
5. published
6. Data Qualityでcoverage確認
7. 診断E2Eで推薦結果を確認
