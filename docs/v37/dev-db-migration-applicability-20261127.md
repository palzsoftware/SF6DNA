# V37: 開発DB(vvsknbmlfvvnrmgtyhbf)への 115000/116000/117000/120000 適用条件（読み取り調査のみ・未適用）

| Migration | 本文の前提 | 開発DBの実状態 | 判定 |
|---|---|---|---|
| 115000 move_commands policy | policy "public read move commands" が存在 | 存在。ただし開発DBの policy は source テーブルを inline 参照していない／private.move_command_has_official_source が既に存在 | 適用不要（効果は既に実現済み）。適用すると公式source付き公開moveのcommandが匿名で見える挙動変更になるため非推奨 |
| 116000 preview RPC | get_phase39/42/44 の本番MD5一致が必須 | 3関数とも開発DBに存在しない（phase23系のみ）。get_public_entity_sources のMD5も本番値(47c8…)と不一致(ec0b…) | preflightで必ずabort。適用不可・不要 |
| 117000 公開policy | combos等5表に inline参照policyが5つ(開発想定) | inline参照policyは0件。private.content_has_source は既に存在 | 実質no-op。適用不要 |
| 120000 本番整合 | list_public_sources のMD5が3値のいずれか | 開発は f0d7f4a7…（許可リスト外） | preflightでabort。開発固有の定義を広げないための設計通り |

## 結論
- 4本とも開発DBへ無条件適用しない方針で確定。いずれも適用すべき状態差分はなく、適用してもabortまたはno-op。
- 唯一の残差分は anon/authenticated に残る TRUNCATE/REFERENCES/TRIGGER 付与（sources, entity_sources ほか）。PostgRESTはTRUNCATE等を公開しないため実害は低いが、閉じるなら開発DB専用の「REVOKEのみ」の小SQLを別途作る（要承認・未作成）。
- 適用・書込みは未実施。承認待ち。
