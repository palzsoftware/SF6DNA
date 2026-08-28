# Pre-Phase20 Legacy Parity Audit

Date: 2026-08-28 JST
Branch: `sf6dna-v2`

## Purpose

Phase20へ入る前に、旧GitHub Pages版に存在し、v2で同等機能がない項目を棚卸しし、重複・類似機能がないものを優先してv2へ再実装する。

旧静的データを無検証でコピーせず、現行v2のPublic Gate / Source / Patch / Verification方針を維持する。

## Implemented in this pass

### High priority / unique user-facing features

1. Favorites
   - route: `/favorites`
   - character detailからfavorite切替
   - browser localStorage保存

2. My Characters / Character usage status
   - route: `/my-characters`
   - `main / sub / learning / unset`
   - browser localStorage保存

3. Character Compare
   - route: `/compare`
   - published playable Characterの基本情報のみ比較
   - 未検証Strategyを比較材料として出さない

4. Rank Tracker
   - route: `/rank-tracker`
   - character別MR / LP
   - date / memo
   - history / change summary / delete
   - browser localStorage保存

5. Diagnosis History
   - route: `/diagnosis/history`
   - 診断完了時に上位傾向を最大50件保存
   - Recommendation Public Gateは変更しない

### Public information parity

6. `/about`
7. `/faq`
8. `/changelog`
9. `/sources`
   - public directoryでは`official / primary` Sourceのみ表示
   - `internal_candidate`は公開対象外

### Navigation

- main navigationに`/tools`を追加
- `/tools`をFavorites / My Characters / Compare / Rank Tracker / Diagnosis Historyのハブにした
- footerにAbout / FAQ / Sources / Changelogを追加

## Storage policy

今回追加した個人データは旧版の特徴を保ちつつ、Supabase Public Data Gateと混ぜないためbrowser localStorageだけに保存する。

Keys:
- `sf6dna_v2_favorite_characters`
- `sf6dna_v2_character_status`
- `sf6dna_v2_rank_history`
- `sf6dna_v2_diagnosis_history`

この実装はServer-side verified/publishedデータを書き換えない。

## Explicitly not copied from legacy

### PC / Mobile manual view switch

Not implemented.

Reason:
- v2 already uses responsive layout.
- manual PC/mobile mode is substantially overlapping behavior and would add duplicate complexity.

### Team directory / roster history

Deferred.

Reason:
- current Supabase has no `teams` table.
- old team data is time-sensitive and may be stale.
- unverified legacy roster data must not be treated as current production data.

### Act / event calendar

Deferred.

Reason:
- old static event data is time-sensitive.
- current tournament table exists but contains 0 rows at this audit.
- current official schedules should be sourced before public implementation.

### Contact form

Deferred.

Reason:
- requires an explicit current contact destination/provider.
- do not invent an address or silently reuse an unverified legacy Formspree destination.

### Legacy video-search retry implementation

Not ported as a separate feature.

Reason:
- v2 uses DB-managed Video and Unified Search architecture; copying the old backend query retry code would duplicate a different generation's design.

## Safety

- no `main` changes
- no Production deployment
- no status / verification_status promotion
- no guessed Modern Command
- no old team/event records copied into Supabase
- AI Coach Generation remains OFF

## Pre-Phase20 conclusion

The highest-value legacy-only features that can be migrated safely without stale external data have been restored in v2. Remaining legacy-only candidates require fresh source-backed external data or explicit external configuration and should not be fabricated before Phase20.
