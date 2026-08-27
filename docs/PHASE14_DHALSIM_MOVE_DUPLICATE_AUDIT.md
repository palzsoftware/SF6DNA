# Phase14 Dhalsim Move Duplicate Audit

最終更新: 2026-08-28 JST

## 対象

Supabase正本 `SF6DNAPro` (`wnuxaxbrpudyypzdbdho`) にある以下の2 Move Entityをread-onlyで比較した。

| Move | ID | Slug | Type |
|---|---|---|---|
| しゃがみ強K（ロングスライディング） | `7ab03e6f-a949-4953-b7f0-3e76828b6645` | `dhalsim-crouching-hk` | normal |
| ロングスライディング | `7fd07bc7-bfa9-49dd-aafd-4d40613bdc5c` | `dhalsim-capcom-frame-031` | unique |

## 一致内容

- Frame: 発生12 / 持続12-27 / 硬直20 / Hit D / Block -16 / Damage 900 / 下段
- Frame Verification: 両方`reviewed`
- Current Patch relation: 両方同一Patch
- Classic Command: 両方`2+HK`
- Move Source: 両方同じCAPCOM公式Frame Source
- Move status: 両方`draft`

## 差分

- `dhalsim-crouching-hk`には`2HK`、英語名、しゃがみ強KのAliasがある。
- `dhalsim-capcom-frame-031`にだけModern `3+H`がある。
- 後者は公式Frame行取り込み時に作られた別Entityで、説明文を持つ。

## 参照影響

- `combo_moves`: 両Entityとも参照0
- `setup_moves`: 両Entityとも参照0
- GitHub実コード・seed・docs内のID/Slug直接参照: 0
- Command Sourceは各Commandへ公式Source relationあり

## 判定

同じ実技を表す重複Entityである可能性が極めて高い。ただし、現時点では次の変更を行わない。

- Entity削除
- 自動archive
- Modern Commandの複製
- reviewed / draftの昇格

推奨する整理案は、`dhalsim-crouching-hk`をcanonical候補としてModern CommandとSource relationを移し、別Entityを削除せずarchiveする方法。ただしMove総数・coverage・検索結果が変わるため、実行前にユーザー確認と再計算が必要。
