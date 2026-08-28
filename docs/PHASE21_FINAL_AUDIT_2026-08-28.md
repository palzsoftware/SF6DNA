# SF6DNA Phase21 Final Audit

Date: 2026-08-28 JST
Phase: 21 `Modern Command Coverage & Pre-Release Integration`

## Final Status

**COMPLETE / PASS WITH DOCUMENTED SOURCE LIMITATION**

Phase21では、Current MoveのModern Command不足を実DBから再集計し、CAPCOM公式ムーブリスト31キャラ分を取得して全不足対象を監査対象に含めた。

推測Modern Commandは登録していない。

## Canonical baseline

- Repository: `palzsoftware/SF6DNA`
- Branch: `sf6dna-v2`
- Supabase: `SF6DNAPro`
- Current Patch: `2026.08.03`
- Current non-archived Move: **2052**
- Classic Command coverage: **2052 / 2052**
- Modern Command coverage: **1441 / 2052**
- Missing Modern: **611**

Phase21計画書の旧基準622件は後続データ修正前の値であり、Phase21開始時の実DB正本611件へ更新する。

## P21-01 Modern Command audit

### Official evidence acquisition

- CAPCOM Japanese official movelist: **31 / 31 characters fetched successfully**
- GitHub Actions run: `33183043892`
- Artifact: `phase21-official-movelist-snapshots-ja-jp`
- Permanent fetcher: `scripts/phase21-fetch-official-movelist-snapshots.mjs`
- Permanent audit workflow: `.github/workflows/phase21-modern-command-audit.yml`

### Missing 611 by move type

| Move type | Missing Modern |
|---|---:|
| normal | 151 |
| special | 114 |
| unique | 100 |
| taunt | 82 |
| target_combo | 74 |
| drive | 31 |
| throw | 28 |
| super | 24 |
| command_throw | 7 |
| **Total** | **611** |

### Source limitation

CAPCOM公式ムーブリストの取得可能なMarkdown表現では、Classic Commandは入力アイコンとして判読できる一方、Modern欄は `d1` / `d2` / `0` 等のUI画像参照に圧縮され、DBへ安全に格納できるModern Command文字列として取得できない。

追加でCAPCOM本体HTMLを直接取得して埋め込み構造を調査したがHTTP 403となり、Modern Command文字列を一次情報として抽出できなかった。

したがって:

- 611件を未監査のまま放置してはいない
- 31キャラ全公式ムーブリストを取得し、611件を全件監査対象として分類した
- 公式表示から一意に復元できないModern文字列を推測登録しない
- `d1` / `d2` / `0` の意味を推測してDBへ変換しない
- Modern欠落611件は**Source representation limitation**として記録して残す

これはPhase21 Exit Criteriaの「登録不能なら理由を残す」を満たす。

## Official movelist Source normalization

Phase21監査でSource管理の3件を修正した。

1. Akuma / 豪鬼
   - old: `/character/gouki/movelist`
   - current: `/character/gouki_akuma/movelist`
2. M. Bison / ベガ
   - old: `/character/vega/movelist`
   - current: `/character/vega_mbison/movelist`
3. JP
   - `official_movelist` Sourceが未登録だったためCAPCOM current URLを追加

Final official movelist Source: **31 / 31 characters**

Migration:
- `supabase/migrations/20260828_phase21_normalize_official_movelist_sources.sql`

## P21-02 Legacy parity integration

実機テスト前チェック対象として以下をPhase23 checklistへ維持・追加する。

- Favorites
- My Characters
- Character Compare
- Rank Tracker
- Diagnosis History
- About
- FAQ
- Sources
- Changelog
- Phase22 Improvement Loop
- Phase22 Matchup Knowledge Card

## P21-03 Policy / safety

維持:

- no guessed Modern Command
- reviewed ≠ verified
- draft ≠ published
- Current Patch / Source / verification gateを弱めない
- Production deployなし
- main変更なし

## Temporary audit cleanup

調査専用の以下はPhase21終了時に削除した。

- `.github/workflows/phase21-movelist-sample.yml`
- `.github/workflows/phase21-source-probe.yml`
- `scripts/phase21-probe-official-movelist-source.mjs`

31キャラ公式snapshot取得用のmain audit workflow/fetcherのみEvidence再取得用として維持する。

## Final Decision

Phase21の目的はModern不足を推測で埋めることではなく、Source付きで監査し、安全に確定できるものだけを登録すること。

現行公式Source表現からModern Command文字列を一意に確定できない611件は、理由を明示して未登録維持とした。

**Phase21 COMPLETE.**
