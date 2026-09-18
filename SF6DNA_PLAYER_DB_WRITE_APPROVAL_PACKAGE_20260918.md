# Player DB Write Approval Package

作成日: 2026-09-18  
状態: `PLAYER_DB_WRITE_APPROVAL_REQUIRED`  
本パッケージ作成時点のDB変更: `NO`

## 推奨対象

### 1. Kakeru新規Player候補

| Field | Old | Candidate | Confidence |
| --- | --- | --- | --- |
| slug | none | `kakeru` | HIGH |
| display_name | none | `Kakeru` | PRIMARY |
| country_code / region | none | `JP / Japan` | PRIMARY |
| player_type | none | `pro` | PRIMARY |
| bio | none | `CAPCOM CUP 11でJPを使用して優勝した日本の競技プレイヤーです。` | PRIMARY |
| Character relation | none | `JP / main` | PRIMARY |
| Tournament result | none | `CAPCOM CUP 11 / 2025 / 1st` | PRIMARY |

Alias候補: `翔`, `Sho`, `Kakerugo`, `Uzura`。  
根拠: CAPCOM公式CAPCOM CUP 11 RECAP。  
Rollback: 新規Player、Alias、Character relation、Tournament resultを同一transactionで削除。

### 2. 如月れん新規Player候補

| Field | Old | Candidate | Confidence |
| --- | --- | --- | --- |
| slug | none | `kisaragi-ren` | HIGH |
| display_name | none | `如月れん` | PRIMARY |
| player_type | none | `creator` | PRIMARY |
| team_name | none | `ぶいすぽっ！ / Iris Black Games` | PRIMARY |
| bio | none | `ぶいすぽっ！Iris Black Games所属の配信者。SF6の大会・配信活動を確認できます。` | PRIMARY_FOR_PROFILE |
| YouTube | none | `https://www.youtube.com/@ren_kisaragi__` | PRIMARY |
| Twitch | none | `https://www.twitch.tv/ren_kisaragi__` | PRIMARY |
| Website | none | `https://store.vspo.jp/pages/kisaragi-ren` | PRIMARY |

Character relationとTournament resultは今回のwrite対象外。  
Rollback: 新規Player、Alias、外部リンクを同一transactionで削除。

### 3. 既存Player Alias候補

`SF6DNA_PLAYER_ALIAS_DICTIONARY_20260918.csv`の`APPROVAL_QUEUE`のみ対象。`NEEDS_CROSSCHECK`は除外する。

### 4. Video relation候補

`SF6DNA_PLAYER_VIDEO_RELATION_CANDIDATES_V2_20260918.csv`の`RELATION_READY`のみ対象。ただし`public_probe=FETCH_BLOCKED`は適用直前にURLを再確認する。

## Apply前条件

1. ユーザー承認
2. 対象URLの再probe
3. 重複Player / Alias / relation確認
4. transaction SQLレビュー
5. rollback SQL同梱

Migration / DB write / RLS変更は本パッケージでは実施していない。
