# SF6DNA Phase19 Internal Integrity Audit

最終更新: 2026-08-28 JST

## Scope

Phase19 `Internal Data Integrity & Release Hardening` の内部監査記録。
Supabase実DB `SF6DNAPro` を正本とし、人力・Vercel・実デバイス・実認証セッションは対象外とする。

## Baseline

- Phase19開始HEAD: `5665063d193b9aa9bcafcd3563eb219863007413`
- main baseline: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`
- Current Patch: `2026.08.03`
- Current Patch count: 1
- playable + published Character: 31

## Referential Integrity

### PostgreSQL FK

`public` schemaのForeign Key constraintを監査し、全FKが`convalidated=true`であることを確認した。

### entity_sources polymorphic relation

発見:
- legacy `entity_type='guide_section'`: 16件
- 16件すべての`entity_id`が実在する`character_guide_sections.id`と一致
- 同一Source/relationshipの`character_guide_section`既存リンクとの競合: 0

構造上の旧表記と判断し、内容・status・verificationを変更せず以下へ正規化した。

- `guide_section` -> `character_guide_section`
- Supabase migration: `phase19_normalize_guide_section_source_type`
- repo migration: `supabase/migrations/20260828_phase19_normalize_guide_section_source_type.sql`

修正後:
- legacy guide_section type: 0
- unknown entity_source type: 0
- invalid entity_source target: 0
- duplicate entity_source group: 0

### その他polymorphic relation

- `entity_videos`: character 35 / valid 35 / invalid 0
- `training_relations`: counter 930 / valid 930
- `training_relations`: move 27 / valid 27

## Identifier / Required Field / Uniqueness

以下はすべて0件:

- Character / Move / Player / Video blank slug
- Character / Move / Player blank name
- Video blank title
- Character / Move / Player / Video duplicate slug group
- Combo / Setup / Sequence / Counter / Training duplicate slug group
- Combo / Setup / Sequence / Counter / Training blank required name/title/slug
- Move without Classic Command
- Move without open Current Frame
- Move with multiple open Current Frames
- exact duplicate Move Command group
- negative Move display_order
- negative Character Guide display_order

### combo_moves / setup_moves

単純な`parent_id + move_id`集計では同一Moveの反復が見つかったが、step_orderを含めて確認すると:

- Combo duplicate step_order: 0
- Setup duplicate step_order: 0
- Combo exact relation duplicate: 0
- Setup exact relation duplicate: 0

同じMoveを複数stepで使用する正当な連携をduplicateとして削除しない。

## Patch Lifecycle

以下はすべて0件:

- Frame valid_from / valid_to reversed
- Combo reversed
- Setup reversed
- Sequence reversed
- Counter reversed
- Training reversed
- Character Guide reversed
- Player Character reversed
- open Frame whose valid_from is not Current Patch

Current Patch recordは1件のみ。

## Source Integrity

- Source total: 329
- blank title: 0
- blank URL: 0
- blank source_type: 0
- blank reliability_level: 0
- non-http(s) URL: 0
- unknown reliability_level: 0
- blank publisher: 30

`publisher`はnullableであり、値を推測して埋めない。30件はnon-blocking metadata gapとして記録する。

### Reliability distribution

- official: 85
- primary: 2
- secondary: 137
- community: 104
- internal_candidate: 1

### Duplicate URL candidates

normalized URL重複group: 8

主に同一YouTube URLを異なるEvidence title/contextでSource化したもの。各groupでtitle variantが異なるため、自動統合・削除しない。

- 最大group: 6 records / 6 title variants
- 4 records / 4 title variants: 複数group
- 3 records / 3 title variants: 1 group
- frame-search Ed URL: 2 records / 2 title variants

これは品質改善候補でありRelease blockerではない。

## Exact Duplicate Content Audit

以下はすべて0 group:

- Character Alias
- Move Alias
- Player Alias
- Combo exact content
- Setup exact content
- Sequence exact content
- Counter exact content
- Training exact content
- Character Guide exact content

内容判断なしのbulk merge/deleteは実施していない。

## Public Gate Matrix

### Strategy

Combo / Setup / Sequence / Counter / Training:
- App list/detail: published + verified
- RLS: published + verified + Source
- Unified Search RPC: published + verified
- RLSが最終防御としてSourceなしPublic readを拒否

### Character Guide

- App: published + verified
- RLS: published + verified

### Trait Score Recommendation

- App: published + verified + Source
- RLS: published + verified
- SourceなしScoreはRecommendation側で拒否

### Move finding and hardening

Phase18ではApp側に厳格なPublic Move Gateがあったが、`moves` table RLSは`status='published'`のみだった。

Phase19でRLSもRelease Gateへ合わせた。

Supabase migrations:
- `phase19_strict_public_move_rls`
- `phase19_require_official_move_and_frame_sources`

Repo:
- `supabase/migrations/20260828_phase19_strict_public_move_rls.sql`
- `supabase/migrations/20260828_phase19_require_official_move_and_frame_sources.sql`

Public Moveは以下を要求する。

1. Move status = published
2. official Source付きClassic Command
3. Move本体official Source
4. Current Patch verified Frame
5. Current Frame official Source
6. Modern Commandは任意・推測禁止

`V2_RELEASE_READINESS.md`のMove Gateと一致させた。

307件のverified Current Frame候補は、Move / Frame / Classic Commandのofficial Evidenceをすべて満たすことをDBで確認済み。厳格化による候補件数減少はない。

### AI Coach

確認済み:
- invalid JSON -> 400
- question 2文字未満 -> 400
- 500文字超 -> 400
- SourceなしEvidenceを除外
- Current Patchを取得
- `generationEnabled=false`

### Auth / crawl controls

- Auth `next`は内部`/` pathのみ許可
- `//...` protocol-relative pathは拒否
- robots disallow: `/admin`, `/api/`, `/auth`

## Security / Performance Advisor

### Security

Supabase Security Advisor after Phase19 DDL:
- **0 lints**

### Performance

既知の非blocker:
- `unused_index` INFO
- `multiple_permissive_policies` WARN

実測なしのindex削除やRLS全面統合は行わない。

Remediation references:
- unused_index: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index
- multiple_permissive_policies: https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies

## Data mutations intentionally NOT performed

- status変更なし
- verification_status変更なし
- Modern Command推測なし
- Frame値推測なし
- Source publisher推測補完なし
- duplicate Source自動統合なし
- content自動削除なし
- bulk publish / verifyなし

## Interim conclusion

内部DB整合性に重大blockerは検出していない。
Phase19で確定した構造不整合とPublic Gate層差異は、内容判定を伴わない安全な範囲で修正した。
Final判定はPhase19 CI完了後に`PHASE19_FINAL_AUDIT_2026-08-28.md`へ固定する。
