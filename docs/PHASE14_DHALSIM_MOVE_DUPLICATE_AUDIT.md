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

## 判定と実施結果

同じ実技を表す重複Entityと判定し、2026-08-28に次の限定変更を実施した。

- `dhalsim-crouching-hk`をcanonicalとして維持
- 既存Modern Command `3+H`の同じIDをcanonical Moveへ付け替え
- canonicalへ「ロングスライディング」Aliasを追加
- `dhalsim-capcom-frame-031`を削除せず`archived`
- 両Frame、Classic Command、Source relationは監査履歴として保持
- reviewed / draftの昇格なし

実DB再計算後はActive Move 2,064、Modern 1,442、Modern未登録622。ダルシムはActive Move 88、Modern 77、未登録11。変更SQLは`supabase/seeds/20260828_phase14_dhalsim_long_slide_canonicalization.sql`へ記録し、再実行可能な条件検証付きとした。
