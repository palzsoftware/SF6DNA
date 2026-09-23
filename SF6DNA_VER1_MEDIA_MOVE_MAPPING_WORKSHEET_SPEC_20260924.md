# SF6DNA Ver.1.0 Motion Media Move Mapping Worksheet

Date: 2026-09-24  
Scope: Ver.1.0 RC / motion media ingest preparation  
Status: READY_FOR_REUSE

## Purpose

Ryu / JPで確立したMotion Media Pilotを、残り29キャラクターへ同じ手順で展開するためのMove mapping worksheet仕様。動画がまだ無いキャラクターでも、DB正本からMove行だけ先に生成し、録画受領後はsource/mapping列を埋める方式にする。

このworksheetは攻略データを公開・昇格するものではない。Moveとユーザー録画素材の対応関係だけを管理する。

## Fresh baseline

2026-09-24のSupabase read-only確認結果:

- playable characters: 31
- playable character move rows: 2065
- JP move rows: 59
- Ryu move rows: 57
- DB write: なし
- Production変更: なし

RC baseline at preparation start:

`5e7749f43fa3e39f4a5c8fed740687848ff21336`

既存JP Pilotは7 media mappingのみ。59 Moveすべてが動画済みという意味ではない。

## Worksheet columns

```csv
character_slug,character_name,move_order,move_id,move_slug,move_name,move_type,strength_variant,classic_command,recorded_category,source_file,source_start_ms,source_end_ms,variant,media_type,media_url,poster_url,mapping_status,cut_review_status,verification_status,notes
```

### DB正本列

以下は必ずFresh DBから生成し、手入力で過去値を復元しない。

- `character_slug`
- `character_name`
- `move_order`
- `move_id`
- `move_slug`
- `move_name`
- `move_type`
- `strength_variant`
- `classic_command`

### 録画受領後に埋める列

- `recorded_category`
- `source_file`
- `source_start_ms`
- `source_end_ms`
- `variant`
- `media_type`
- `media_url`
- `poster_url`
- `mapping_status`
- `cut_review_status`
- `verification_status`
- `notes`

## Fresh read-only export query

`<CHARACTER_SLUG>`だけ対象キャラクターへ置換する。SELECTのみで使用する。

```sql
select
  c.slug as character_slug,
  c.name_ja as character_name,
  m.display_order as move_order,
  m.id::text as move_id,
  m.slug as move_slug,
  m.name_ja as move_name,
  m.move_type,
  coalesce(m.strength_variant, '') as strength_variant,
  coalesce((
    select string_agg(
      coalesce(mc.command_text, mc.numeric_notation, mc.button_notation, ''),
      ' / '
      order by mc.sort_order, mc.id
    )
    from move_commands mc
    where mc.move_id = m.id
      and mc.control_scheme = 'classic'
  ), '') as classic_command
from moves m
join characters c on c.id = m.character_id
where c.slug = '<CHARACTER_SLUG>'
order by m.display_order, m.name_ja;
```

## Mapping status contract

| status | 意味 | 次工程 |
|---|---|---|
| `unmapped` | 録画未受領または未照合 | 待機 |
| `candidate` | 候補clipはあるが技一致未確定 | 目視照合 |
| `safe` | 技名・動作・source区間が一致 | encode候補 |
| `mapping_hold` | 曖昧、派生/強度/順序だけでは確定不可 | 公開しない |
| `rejected` | 誤紐付けまたは不適切clip | 再cut/再録候補 |

## Cut review contract

| status | 意味 |
|---|---|
| `pending` | 未確認 |
| `cut_reviewed` | 技開始前後の余分な歩き・待機を除去して確認済み |
| `derived_from_uncut_master` | 元動画由来の暫定clip。Ver.1.0公開候補へ昇格する前に再cut必須 |

距離調整の前後歩きが入ったclipは `cut_reviewed` にしない。歩きが技成立条件そのものではない限り、技開始直前から技終了直後までへ再cutする。

## Mapping rules

1. **録画順だけでMoveへ紐付けない。** 名前・コマンド・見た目・派生条件を照合する。
2. `move_id` / `move_slug`はFresh DB値のみ使用する。
3. 弱/中/強/ODがDB上で別Moveなら別行。DB上で同一Moveなら、勝手にMoveを増やさず`variant`で管理する。
4. SA/CAや派生は、DB構造と録画内容が一致しない場合 `mapping_hold` にする。
5. `source_start_ms` / `source_end_ms`は原本から再現できる値を保持する。
6. 技名と映像が一致しない疑いが1件でもあれば、そのclipだけを隔離し、他clipを巻き込んだ全件再エンコードはしない。
7. `safe`はMedia mappingの安全性を示すだけで、攻略情報・Frame・Strategyのverified昇格を意味しない。

## Character rollout procedure

### Batch A — source audit + worksheet

1. Fresh DBから対象キャラのMove行を出力。
2. 元動画のfilename / SHA256 / duration / fps / resolutionを記録。
3. 録画カテゴリとMove候補を照合。
4. 不確実なものは `mapping_hold`。

### Batch B — cut + encode

1. `safe`候補だけcut。
2. 距離調整の歩き・不要な静止を除去。
3. 軽量MP4 + poster生成。
4. validator実行。

### Batch C — integration

1. manifest / asset pathへ統合。
2. duplicate / missing / size検査。
3. Character Detailのno-media fallbackを維持。
4. targeted test → full regression。

### Batch D — Preview QA

1. Desktop。
2. 375px。
3. playback / loop / overflow。
4. reduced-motion。
5. 技名と映像の一致。

## Ryu / JP applicability

### JP

現行7件をこのcontractへ合わせて監査する。ユーザー確認で「ジラント周辺に誤紐付け疑い」「距離調整用の前後歩き混入」があるため、該当clipはFresh目視確認なしに`safe/cut_reviewed`へ固定しない。

### Ryu

Fresh DBは57 Move。録画素材は既にユーザー側で用意済みだが、巨大素材の転送方法が確定するまでworksheetを先行生成できる。転送後は同じBatch A→Dを使用する。

### 残り29キャラクター

録画未受領でもFresh DBからworksheetだけ先に生成可能。動画受領時はUIやschemaをキャラごとに再実装せず、同じcontractへ素材を投入する。

## Stop conditions

次の場合はそのMoveだけ停止する。

- 技名と映像が一致しない
- 録画順以外の根拠がない
- 派生/強度をDB上で区別できない
- source区間が再現不能
- 歩きや別技がclipへ混入し、再cutでも除去できない
- manifest validator error

停止したMoveは `mapping_hold` または `rejected` とし、他の安全なMove処理は継続する。

## Release boundary

Motion Mediaは9/26 Ver.1.0のRelease blockerにしない。375px / reduced-motion / 技一致のユーザー実機確認が完了していないMediaはPreview-onlyまたは1.0.x候補として扱う。
