# SF6DNA Data Issues

最終更新: 2026-08-29 JST

## 対象

この文書は、現行 `sf6dna-v2` / Supabase と旧静的版データを分離して扱う。

Release判定の正本は以下。

- GitHub: `palzsoftware/SF6DNA`
- Branch: `sf6dna-v2`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- Patch baseline: `2026.08.03`

## 現行v2の参照整合性

2026-08-29の実DB read-only監査:

- `player_characters -> players` orphan: **0**
- `player_characters -> characters` orphan: **0**
- `player_aliases -> players` orphan: **0**

したがって、旧 `character-data.js` / `pro.js` / `streamer.js` / `vtuber.js` / `youtuber.js` の文字列ID参照切れは、現行v2のPlayer参照整合性Blockerとして扱わない。

## 現行v2で残るデータ課題

### 1. Public攻略データ

現時点では次の公開statusは0件。

- Move
- Combo
- Setup
- Sequence
- Counter
- Training

未確認データを公開する代わりにsafe empty stateを使用する。

Moveは2052件のdraftのうち701件が現行Public Move Gateの機械条件を満たすが、`Machine Gate PASS != publish approval` のため自動publishしない。

### 2. Modern Command

- Current Move: 2052
- Classic Command: 2052 / 2052
- Modern Command: 1441 / 2052
- Missing Modern: 611

611件は公式情報から安全に取得できないものを含む。Classicから推測補完しない。

### 3. Player image

published Playerは41名。DB `image_url` は未登録。

旧画像と現行Player slugが完全一致する17名のみv2 fallbackで接続済み。残りは人物同定を推測しない。

## Legacy static-site issues

以下は2026年7月時点の旧静的版監査で検出された履歴であり、v2 Release Gateとは分離する。

- `character-data.js` の選手ID参照切れ: 20件
- `assets/js/pro.js` の `itabashizangief` 重複
- 旧JSオブジェクトIDと画像名の不一致

旧版を保守する場合のみ `scripts/check-data-integrity.js` で再監査する。

## Releaseルール

- `reviewed != verified`
- `draft != published`
- Sourceありだけでverifiedへ昇格しない
- SourceなしFrameを確定扱いしない
- 推測Modern Commandを登録しない
- 件数目的でbulk publishしない

関連:

- `docs/PHASE23_PUBLICATION_READINESS_2026-08-29.md`
- `docs/PHASE23_PRE_DEVICE_POLISH_AUDIT_2026-08-29.md`
- `docs/KNOWN_ISSUES.md`
- `docs/TECH_DEBT.md`
