# JP完成テンプレート → 残り30キャラ展開方針

## 方針

残り30キャラへ先に横展開しない。まずJPをSF6DNAの完成サンプルとして、データ構造・検証フロー・公開ゲート・検索Alias・トレモ連携まで仕上げる。

## JP完成条件

### Objective data
- Move roster
- Classic Command
- Modern Command
- Frame Data
- Damage / Hit Level / Cancel / Invincibility
- Patch validity
- Source relation
- Alias / numeric notation
- objective conflict resolution

### Strategy data
- Character guide sections
- Combo
- Setup
- Sequence
- Counter
- Training
- Video relations
- Player references

### Quality gates
- Current Patchを明示
- publishedはSource必須
- Frame/Combo/Setup/Sequence/Counter/Trainingはverifiedのみ公開
- 二次資料のみの項目はreviewed/draftに留める
- Source間で矛盾した項目はunverifiedのままConflictとして残す
- Modern Commandは公式/ゲーム内確認前に推測しない

## 2026-08-26 JP現状

- Move: 49 draft candidates
- Current frame candidates: 49
- reviewed: 48
- unverified conflict: 1（`jp-shalosti` command/display conflict）
- JP Move Alias: 76追加
- Training candidates: 10 draft
- Published Move: 0
- Verified Frame: 0

Current secondary corroboration:
- frame-search JP, Ver.2.0401.001
- Ultimate Frame Data JP, August 2026 update済み

CAPCOM official frame URLは把握しているが取得環境では403。直接公式確認またはゲーム内確認まではverified/publishedへ昇格しない。

## JPで次に埋める順序

1. Move roster差分監査（公式表示名、特殊技/Target Combo/OD/SA/Throw）
2. Modern Command
3. Frame conflict解消
4. Basic / confirm / punish / corner / SA / burnout Combo
5. Knockdown別Setup
6. true blockstring / gap / throw / shimmyを分けたSequence
7. system counter + matchup counter
8. Training relation
9. Player / Video / Tournament relation
10. Character Trait Score
11. 公開可能データのみverified + published

## 残り30キャラへの展開

JP完成後、同じ順序・同じ公開ゲートで1キャラずつ展開する。

展開単位:
1. Objective pack: Move / Command / Frame / Alias / Patch / Source
2. Strategy pack: Combo / Setup / Sequence / Counter / Training
3. Reference pack: Player / Video / Tournament / Match
4. Recommendation pack: Character Trait Score
5. Data Quality確認
6. published解禁

全30キャラで、JPと異なる簡易ルールを作らない。共通Repository・Schema・Admin・Quality Gateを使用する。
