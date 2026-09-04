# SF6DNA Phase18 Data Quality Report

最終更新: 2026-08-28 JST

## Scope

Supabase実DB `SF6DNAPro` を正本として、Current Patch `2026.08.03` の公開候補品質を機械監査した。

この文書の候補件数は公開承認件数ではない。

- candidate ≠ verified
- candidate ≠ published
- reviewed ≠ verified
- draft ≠ published

## Current Patch

- version: `2026.08.03`
- current patch record: 1

## Character baseline

- playable + published Character: **31**
- Character Source coverage: **31 / 31**

## Move / Frame / Command aggregate

| 指標 | 件数 |
|---|---:|
| Move | 2065 |
| Classic Commandあり | 2065 |
| Modern Commandあり | 1443 |
| Modern Command欠損 | 622 |
| Current Patch Frameあり | 2065 |
| Current Patch verified Frame | 307 |
| Move Sourceあり | 1347 |
| Current Frame Sourceあり | 2065 |
| 機械的Public候補 | 307 |
| verified Frame不足でblocked | 1758 |

307件の機械的Public候補は、以下を同時に満たすdraft Moveを数えたもの。

1. playable + published Character
2. Move status = draft
3. Classic Commandあり
4. Current Patch verified Frameあり
5. Move Sourceあり
6. Current Frame Sourceあり

Move本体には`verification_status`がないため、これを公開承認とは扱わない。

Modern CommandはPublic候補条件に必須化しない。欠損時は表示しないだけとし、推測補完しない。

## 31 Character Move Quality

| Character | Move | Classic | Modern | Current Frame | Verified Current Frame | Move Source | Frame Source | Machine Candidate |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| A.K.I. | 52 | 52 | 23 | 52 | 0 | 20 | 52 | 0 |
| 豪鬼 | 61 | 61 | 24 | 61 | 0 | 4 | 61 | 0 |
| アレックス | 76 | 76 | 15 | 76 | 0 | 0 | 76 | 0 |
| ブランカ | 91 | 91 | 83 | 91 | 0 | 91 | 91 | 0 |
| C.ヴァイパー | 72 | 72 | 67 | 72 | 0 | 67 | 72 | 0 |
| キャミィ | 53 | 53 | 16 | 53 | 0 | 18 | 53 | 0 |
| 春麗 | 68 | 68 | 64 | 68 | 68 | 68 | 68 | 68 |
| ディージェイ | 105 | 105 | 102 | 105 | 0 | 105 | 105 | 0 |
| ダルシム | 89 | 89 | 77 | 89 | 0 | 89 | 89 | 0 |
| エドモンド本田 | 70 | 70 | 65 | 70 | 0 | 70 | 70 | 0 |
| エド | 49 | 49 | 18 | 49 | 0 | 20 | 49 | 0 |
| エレナ | 86 | 86 | 74 | 86 | 0 | 74 | 86 | 0 |
| ガイル | 70 | 70 | 66 | 70 | 70 | 70 | 70 | 70 |
| イングリッド | 83 | 83 | 32 | 83 | 0 | 0 | 83 | 0 |
| ジェイミー | 93 | 93 | 91 | 93 | 93 | 93 | 93 | 93 |
| JP | 59 | 59 | 55 | 59 | 0 | 59 | 59 | 0 |
| ジュリ | 46 | 46 | 43 | 46 | 0 | 10 | 46 | 0 |
| ケン | 59 | 59 | 53 | 59 | 0 | 12 | 59 | 0 |
| キンバリー | 76 | 76 | 74 | 76 | 76 | 76 | 76 | 76 |
| リリー | 47 | 47 | 14 | 47 | 0 | 17 | 47 | 0 |
| ルーク | 50 | 50 | 22 | 50 | 0 | 50 | 50 | 0 |
| ベガ | 47 | 47 | 14 | 47 | 0 | 20 | 47 | 0 |
| 不知火舞 | 95 | 95 | 89 | 95 | 0 | 89 | 95 | 0 |
| マノン | 49 | 49 | 17 | 49 | 0 | 10 | 49 | 0 |
| マリーザ | 53 | 53 | 13 | 53 | 0 | 20 | 53 | 0 |
| ラシード | 54 | 54 | 16 | 54 | 0 | 20 | 54 | 0 |
| リュウ | 57 | 57 | 51 | 57 | 0 | 57 | 57 | 0 |
| サガット | 69 | 69 | 58 | 69 | 0 | 0 | 69 | 0 |
| テリー | 54 | 54 | 15 | 54 | 0 | 20 | 54 | 0 |
| ヤスミン | 85 | 85 | 78 | 85 | 0 | 78 | 85 | 0 |
| ザンギエフ | 47 | 47 | 14 | 47 | 0 | 20 | 47 | 0 |

### Verified Current Frame coverage

307件は4キャラのみ。

- 春麗: 68
- ガイル: 70
- ジェイミー: 93
- キンバリー: 76

したがって、現時点でMove公開候補品質が機械条件上揃っているのはこの4キャラに限定される。

## Strategy readiness

| Entity | Total | Published | Verified | Current Patch | Sourceあり | Public Gate Ready | draft+verified candidate | Reviewed | Unverified |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Combo | 341 | 0 | 1 | 341 | 341 | 0 | 1 | 76 | 264 |
| Setup | 186 | 0 | 0 | 186 | 186 | 0 | 0 | 20 | 166 |
| Sequence | 186 | 0 | 0 | 186 | 186 | 0 | 0 | 17 | 169 |
| Counter | 1122 | 0 | 0 | 1122 | 1122 | 0 | 0 | 67 | 1055 |
| Training | 1477 | 0 | 0 | 1477 | 1477 | 0 | 0 | 8 | 1469 |

### Strategy Public Gate hardening

Phase18でStrategyのPublic RLSを再監査した結果、従来は`published + verified`までをRLSで要求し、Source要件はアプリ側のRelease Gate定義に依存していた。

将来のunsourced verified data公開を防ぐため、次の5テーブルのPublic SELECT RLSを **published + verified + Source relation** に強化した。

- `combos`
- `setups`
- `sequences`
- `counters`
- `trainings`

適用Migration:
- Supabase: `phase18_strategy_source_public_gate`
- Repository: `supabase/migrations/20260828055010_phase18_strategy_source_public_gate.sql`

実DBの`pg_policies`再確認でも5テーブルすべてに`entity_sources`存在条件が入っていることを確認済み。

### Strategy publish candidate

唯一の`draft + verified + Current Patch + Source`候補:

- Character: Kimberly
- slug: `kimberly-20260803-modern-assist2`
- name: `Modern アシストコンボ2（2026.08.03）`
- Patch: `2026.08.03`
- Source relation: 2
- status: `draft`

Phase18ではpublishへ昇格しない。

## Character Guide

- total: 278
- Current Patch: 278
- Sourceあり: 278
- published: 0
- verified: 0
- strict public ready: 0

全件draft/reviewed系の作業データとして扱い、Public Gateは`published + verified`を維持する。

## Trait / Diagnosis / Reference

### Character Trait Score

- total: 372
- Sourceあり: 372
- published: 0
- verified: 0

Recommendationは`published + verified + Source`のみ使用するため、現状は直接推薦用の公開スコアが0件。

### Diagnosis

公開済み4診断は、DB上の`question_count`と公開Question実数が一致。

- 上達課題診断: 12 / 12
- プレイスタイル診断: 10 / 10
- キャラクター適性診断: 10 / 10
- 総合簡易診断: 20 / 20

合計52問。

### Player

- total: 91
- published: 41
- Source relationあり: 91

### Video

- total: 13
- published: 5

VideoはURL自体が一次参照先となるため、`entity_sources` 0件を他EntityのSource不足と同一には扱わない。

## Phase18 Public Move Gate hardening

Moveは他Strategy Entityと異なりMove本体に`verification_status`がない。

既存コードでは将来Moveを`published`へした際に、以下の経路が`status=published`だけでMoveを候補表示できる余地があった。

- Unified Search
- Character Move section
- direct Move detail

2026-08-28時点のpublished Moveは0件のため実データ漏洩は発生していないが、将来の回帰リスクとしてPhase18で修正した。

Public Move Gateを以下に統一した。

1. Move status = published
2. Classic Commandあり
3. Current Patch verified Frameあり
4. Move Sourceあり
5. Current Frame Sourceあり
6. Modern Commandは任意。欠損時に推測しない

適用先:
- `v2-web/src/lib/public-move-gate.ts`
- direct Move detail
- Character Move section
- Unified Search

## Automated Acceptance

Phase18専用workflow:
- `.github/workflows/phase18-data-gate-acceptance.yml`

確認内容:
- Typecheck
- Lint
- Policy tests
- Build
- Public Move Gate static acceptance
- Character Guide verification gate
- Strategy list published+verified gate
- Recommendation published+verified+Source gate

Evidence:
- run `33145909173`: **success**
- migration適用後 run `33145974207`: **success**
- migration適用後 `SF6DNA v2 Web Check` run `33145974201`: **success**

## Supabase Advisor

Phase18 DDL適用後:
- Security Advisor: **0 lints**
- Performance Advisor: `unused_index` INFO / `multiple_permissive_policies` WARNを確認

Performance警告は実利用状況・RLS挙動を計測せずにblind fixしない。Phase18ではindex削除やRLS統合を実施していない。

参考:
- unused index remediation: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index
- multiple permissive policies remediation: https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies

## Conclusion

Phase18の公開候補整理では、データ量ではなくEvidence品質が主なblockerであることを再確認した。

- Move: 1758 / 2065 がCurrent Patch Frame未verified
- Strategy: Public Gate Ready 0
- Trait Score: Public Recommendation Ready 0
- Character Guide: Public Ready 0

一方、将来の公開操作に備えてMove Public GateとStrategy Source Gateを防御的に強化し、自動回帰検査を追加した。

これらの監査結果を理由にstatus/verificationを自動昇格していない。
