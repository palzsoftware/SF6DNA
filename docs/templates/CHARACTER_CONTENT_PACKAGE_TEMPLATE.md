# Character Content Package Template

このテンプレートはJPで確立した構造を、残り30キャラへ同一品質で展開するための正本。

## 1. Character identity
- Character slug:
- 日本語名:
- 英語名:
- Current Patch:
- Official Source:
- Secondary Sources:
- Rollout owner/status:

## 2. Move / Frame / Command / Alias
- [ ] 地上通常技
- [ ] しゃがみ通常技
- [ ] ジャンプ通常技
- [ ] 特殊技
- [ ] ターゲットコンボ
- [ ] 必殺技
- [ ] OD必殺技
- [ ] SA1 / SA2 / SA3
- [ ] 投げ
- [ ] Classic command
- [ ] Modern command
- [ ] startup / active / recovery
- [ ] on hit / on block
- [ ] damage / cancel / hit level / invincibility
- [ ] aliases
- [ ] valid_from_patch_id
- [ ] entity_sources

公開条件: `verified + Source + Patch`。不明値はnull。推測禁止。

## 3. Combo
最低限の分類:
- [ ] 4F/小技始動
- [ ] 中技始動
- [ ] 強技始動
- [ ] Punish Counter
- [ ] Drive Rush
- [ ] Drive Impact wall/punish
- [ ] Corner
- [ ] SA1
- [ ] SA2
- [ ] SA3/CA
- [ ] Burnout向け

各行に notation / starter / damage / drive cost / SA cost / position / conditions / source / patch / verification を持たせる。

## 4. Setup
- [ ] midscreen oki
- [ ] corner oki
- [ ] knockdown-specific setup
- [ ] throw setup
- [ ] DI setup
- [ ] install / stock / projectile / trap setup（該当キャラのみ）

## 5. Sequence
- [ ] pressure string
- [ ] true blockstring判定
- [ ] mash point
- [ ] throw point
- [ ] shimmy point
- [ ] jump option
- [ ] parry option
- [ ] drive reversal option
- [ ] invincible option

## 6. Counter / Matchup knowledge
- [ ] representative punish
- [ ] anti-air interaction
- [ ] Drive Rush stop
- [ ] Drive Impact response
- [ ] projectile / anti-projectile
- [ ] corner defense
- [ ] burnout offense/defense
- [ ] matchup-specific counter rows

## 7. Training
- [ ] execution drill
- [ ] anti-air drill
- [ ] punish drill
- [ ] Drive Rush response
- [ ] Impact response
- [ ] defensive rotation
- [ ] character-specific system drill
- [ ] combo confirmation
- [ ] corner escape
- [ ] resource management

各Trainingに recording / playback / method / success criteria / reps / next step を記録する。

## 8. Player / Tournament / Match / Video
- [ ] current specialist player(s)
- [ ] player-character relation
- [ ] current tournament reference
- [ ] match reference
- [ ] instructional video
- [ ] tournament video
- [ ] entity_videos relation

## 9. Character Trait Score
12 traitsすべてを0〜5で評価する。
- aggression
- patience
- keepout
- rushdown
- grappling
- setup
- footsies
- mobility
- simplicity
- technicality
- defense_preference
- explosive

公開条件: `verified + Source`。

## 10. Verification gate
`not_started -> in_progress -> review -> complete`

`complete`にする条件:
1. Current Patch確認済み
2. Sourceリンク済み
3. Move/Frame/Command/Aliasが網羅
4. Core Comboが存在
5. Setup/Sequence/Counter/Trainingが存在
6. Player/Video参照が存在
7. Trait Score 12件が存在
8. Data Qualityで重大欠落なし
9. verified/published対象だけがPublic/AIに出る
10. 不一致・未確認項目は明示的にblockedまたはreviewのまま保持
