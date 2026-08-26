# SF6DNA v2 - 30 Character Rollout Manifest

JPを完成テンプレートとして、以下30キャラへ同一構造を展開する。

共通テンプレート: `docs/templates/CHARACTER_CONTENT_PACKAGE_TEMPLATE.md`
Current Patch: `2026.08.03`

| # | slug | キャラクター | Rollout |
|---:|---|---|---|
| 1 | ryu | リュウ | not_started |
| 2 | luke | ルーク | not_started |
| 3 | jamie | ジェイミー | not_started |
| 4 | chun-li | 春麗 | not_started |
| 5 | guile | ガイル | not_started |
| 6 | kimberly | キンバリー | not_started |
| 7 | juri | ジュリ | not_started |
| 8 | ken | ケン | not_started |
| 9 | blanka | ブランカ | not_started |
| 10 | dhalsim | ダルシム | not_started |
| 11 | e-honda | エドモンド本田 | not_started |
| 12 | dee-jay | ディージェイ | not_started |
| 13 | manon | マノン | not_started |
| 14 | marisa | マリーザ | not_started |
| 15 | zangief | ザンギエフ | not_started |
| 16 | lily | リリー | not_started |
| 17 | cammy | キャミィ | not_started |
| 18 | rashid | ラシード | not_started |
| 19 | aki | A.K.I. | not_started |
| 20 | ed | エド | not_started |
| 21 | akuma | 豪鬼 | not_started |
| 22 | m-bison | ベガ | not_started |
| 23 | terry | テリー | not_started |
| 24 | mai | 不知火舞 | not_started |
| 25 | elena | エレナ | not_started |
| 26 | sagat | サガット | not_started |
| 27 | c-viper | C.ヴァイパー | not_started |
| 28 | alex | アレックス | not_started |
| 29 | ingrid | イングリッド | not_started |
| 30 | yasmine | ヤスミン | not_started |

## Per-character package requirements

各キャラは以下15ステージを個別追跡する。

1. Move
2. Frame
3. Classic/Modern Command
4. Alias
5. Combo
6. Setup
7. Sequence
8. Counter
9. Training
10. Player
11. Video
12. Character Trait Score
13. Source
14. Patch
15. Verification

DB `character_content_packages` で各ステージを `not_started / in_progress / review / complete / blocked` の5状態で管理する。

## Rollout rules

- JPと同じDB Entityを使用し、キャラ固有の別スキーマを作らない。
- Gameplay factをテンプレートからコピーしない。コピーするのは構造だけ。
- Move名、Frame、Combo、Setup、Counter等は各キャラの現行Sourceから新規に取得する。
- 二次Sourceのみの値は原則 `review` 以下。
- 不明値はnull、推測禁止。
- Public/AIへ出せるのは既存の品質ゲートを満たす情報のみ。
- 30キャラを同時に大量Publishせず、キャラ単位でData Qualityを通過してから昇格する。

## Recommended execution order

入力方式の安定性を優先し、まず比較的標準的なデータ構造のキャラ群から進め、その後ストック/構え/特殊リソース/設置等の固有システムを持つキャラへ展開する。キャラ固有仕様はSource確認後に判断し、テンプレート段階では決め打ちしない。
