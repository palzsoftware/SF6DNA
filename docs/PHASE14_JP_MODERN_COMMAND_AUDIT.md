# Phase14 JP Modern Command Audit

最終更新: 2026-08-28 JST

## 対象

Supabase正本でModern Commandが未登録だったJPのActive Move 5件を、CAPCOM公式JP Command List / Frame DataのModern表示と照合した。

| Move | 公式確認 | 判定 |
|---|---|---|
| 立ち弱K（ニージニイ・ウダール） | Modern Frame Dataに当該行なし | 追加しない |
| しゃがみ中P（ズミヤー） | Modern Frame Dataに当該行があり、中攻撃表示 | `↓ + 中攻撃`（`2M`）を追加 |
| しゃがみ強K（ジョーキル） | Modern Frame Dataに当該行なし | 追加しない |
| 中 ストリボーグ | Frame行はあるが、簡易入力`↓ + SP`との強度対応を直接特定できない | 追加しない |
| 強 ストリボーグ | Frame行はあるが、簡易入力`↓ + SP`との強度対応を直接特定できない | 追加しない |

## 安全条件

- Moveは`draft`のまま。
- Frameは`reviewed`のまま。
- `verified` / `published`への昇格なし。
- 通常操作に表示されるストリボーグの簡易入力を、強度別Entityへ推測複製しない。
- 既存の弱ストリボーグModern行も、強度対応が直接確認できないため本作業では変更しない。

## 実施

- `jp-crouching-mp`へModern Command `↓ + 中攻撃`（`2M`）を追加。
- CAPCOM公式JP Frame Data Sourceを作成し、Move / Current Frame / Modern Commandへofficial relationを付与。
- 再実行可能なSQLを`supabase/seeds/20260828_phase14_jp_crouching_mp_modern.sql`へ記録。
