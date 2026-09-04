# SF6DNA Phase20 Final Audit

Date: 2026-08-28 JST
Phase: 20 `Verified Content Expansion`

## Final Status

**COMPLETE / Internal Verification Expansion PASS**

Phase20は、当初のstrict Source-link promotionだけで終了せず、CAPCOM公式Character Frame Dataとの日英照合、legacy整合性修復、Phase1〜20横断実装監査、Security cleanupまで実施した。

Phase21には進んでいない。

## Final Decision

- Phase20: **COMPLETE**
- Current Frame verification: **PASS**
- Active Move / Frame lifecycle integrity: **PASS**
- Public Gate regression: **PASS**
- Supabase Security Advisor: **0 lints**
- Phase1〜20 automated/internal implementation gap: **重大未実装 0**
- main: **unchanged**
- Production deploy: **not performed**

## P20 Status

| Task | Status |
|---|---|
| P20-00 Baseline | COMPLETE |
| P20-01 Strategy Verification Expansion | COMPLETE |
| P20-02 Current Patch Frame Verification Expansion | COMPLETE |
| P20-03 Character Guide Verification | COMPLETE |
| P20-04 Character Trait Score Verification | COMPLETE |
| P20-05 Public Coverage Report | COMPLETE |
| P20-06 Regression / Acceptance | COMPLETE |
| P20-07 Final Audit / Closure | COMPLETE |
| P20-08 Phase1〜20 Retrospective Gap Audit | COMPLETE |
| P20-09 Temporary Audit Surface Cleanup | COMPLETE |
| P20-10 Move / Frame Lifecycle Final Integrity | COMPLETE |

## 1. Canonical baseline

- Repository: `palzsoftware/SF6DNA`
- Work branch: `sf6dna-v2`
- Current Patch: `2026.08.03`
- Supabase: `SF6DNAPro`
- Project ID: `wnuxaxbrpudyypzdbdho`
- main baseline: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`

Final auditでもmainは変更していない。

## 2. Current Frame final result

Phase20開始時:
- Current Frame: 2065
- verified: 307
- reviewed: 1752
- unverified: 6

当初strict pass:
- direct CAPCOM official Frame Source条件で501件をpromote
- 808 / 2065 = 39.1%

その後、ユーザー指示により照合を継続した。

追加実施:
- CAPCOM ja-jp / en-uk snapshot照合
- name + field exact match
- semantic field normalization
- strength / OD group 1:1 matching
- bilingual name matching
- category-independent exact official-name matching
- field-only unique matching
- wrapped / concatenated CAPCOM table parser hardening
- composite / multi-stage move manual reconciliation
- verified既存行も含む差分監査
- legacy / duplicate current row cleanup

### Final active set

- active Move: **2052**
- Current Frame: **2052**
- verified: **2020**
- reviewed: **32**
- unverified: **0**
- verified rate: **98.4%**
- verified rows with official CAPCOM `official_frame_data` Source: **2020 / 2020**

### Remaining reviewed 32

未監査ではなく、CAPCOM公式Character Frame Dataの直接比較対象外として分類済み。

- Taunt: 31
- Alex `Exit Prowler Stance`: 1

全32件はsecondary Evidenceのみであり、CAPCOM公式Frame Dataに対応する独立行を確認できない。
件数目的のverified化は行わない。

従って、**CAPCOM公式Frame Dataで直接照合可能なcurrent FrameのPhase20監査は完了**とする。

## 3. Corrective normalization

Phase20ではstatusだけを上げたのではなく、CAPCOM原文と不一致だったcanonical値も訂正した。

代表例:
- A.K.I SA2 damage 2600 -> 2500
- Lily OD Condor Spire block/damage +1/1200 -> -8/1000
- M.Bison Heavy Psycho Crusher damage 1400 -> 1600
- M.Bison OD Psycho Crusher startup 18 -> 16, damage 1200 -> 1300
- Cammy charged Heavy Spiral Arrow startup 27 -> 25
- Elena Trunk Slap 3 damage 370 -> 750
- Akuma OD Adamant Flame damage 1260 -> 1400

複数段・派生・高さ依存技はCAPCOM表現を失わない形でcanonical text fieldまたはnotesへ保持した。

## 4. Legacy / duplicate cleanup

CAPCOM現行表と一致しないlegacy/duplicate working rowsは削除せず履歴化した。

- Frame: `valid_to_patch_id = 2026.08.03`
- obsolete Move: `status = archived`

対象例:
- Terry legacy weak Burn Knuckle duplicate
- Ingrid non-current Monoid / Sunburst rows
- Ingrid legacy Sun Shot fragment rows
- archived Dhalsim Long Sliding duplicate Frame

Final lifecycle integrity:
- active Move: 2052
- active Current Frame: 2052
- active Move without Current Frame: 0
- active Move with multiple Current Frames: 0
- archived Move with open duplicate Frame: cleanup済み

## 5. Strategy / Guide / Trait decision

### Strategy

- Combo: 341 / verified 1
- Setup: 186 / verified 0
- Sequence: 186 / verified 0
- Counter: 1122 / verified 0
- Training: 1477 / verified 0

Source存在だけでは攻略手順を証明しないため、新規自動verified化なし。

### Character Guide

- total: 278
- Source linked: 278
- verified: 0

合成攻略本文をofficial patch/context Sourceだけでverifiedにしない。

### Character Trait Score

- total: 372
- Source linked: 372
- verified: 0

編集評価値を推測verified化しない。

## 6. Phase1〜20 implementation gap audit

Phase20 closure時にPhase1〜20の計画書・完了監査・現コード・実DBを横断確認した。

結論:
- **Phase1〜20のautomated/internal完了条件に対する重大な未実装: 0**
- 初期文書の「今後」記載のうち、後続Phaseで吸収されたものは実装済みとして確認
- 将来機能として明示されたReplay映像解析、AI自由生成等は未実装扱いにしない
- Vercel Preview / real Auth session / actual device / public network performance等は実装欠陥ではなく、正式にManual / External Acceptanceへ移管済み
- Audit LogはPhase17でRelease Gate必須ではないと正式判定済みのため勝手に新設しない

詳細:
- `docs/PHASE20_PHASE1_TO_20_RETROSPECTIVE_GAP_AUDIT_2026-08-28.md`

## 7. Temporary audit infrastructure cleanup

Phase20中にCAPCOM crosscheckを行うため一時的に使用した:
- `public._phase20_frame_audit_fingerprints()`
- `.github/workflows/phase20-frame-crosscheck.yml`

をPhase20終了時に撤去した。

DB migration:
- `phase20_remove_temporary_audit_rpc`

Repository:
- `supabase/migrations/20260828141745_phase20_remove_temporary_audit_rpc.sql`

最終Security Advisor:
- **0 lints**

## 8. Public Gate safety

維持:
- `reviewed ≠ verified`
- `draft ≠ published`
- no guessed Modern Command
- no Source-less Frame verification
- no bulk publish
- Strategy gateを弱めない
- Character Guide gateを弱めない
- Recommendation gateを弱めない
- Public MoveはCurrent verified Frame + official Move/Frame/Classic Evidenceを要求
- AI Coach Generation remains OFF

Phase20でMoveを自動publishしていない。

## 9. Regression / Acceptance

恒久Phase20 Acceptance:
- `.github/workflows/phase20-verified-content-acceptance.yml`

確認対象:
- Typecheck
- Lint
- Policy tests
- Build
- Phase20 verification policy
- Public Move Gate
- final Coverage document
- temporary audit RPC removal migration

Phase20終了時にはこの恒久Acceptanceを最新HEADで再実行し、PASSをFinal Evidenceとする。

## Final Conclusion

39.1%時点の旧Phase20監査結果は本書で上書きする。

Phase20最終結果:
- **Current active Frame 2052**
- **verified 2020 / 2052 = 98.4%**
- **reviewed exception 32**
- **unverified 0**
- **official-source coverage of verified rows 2020 / 2020**
- **Security Advisor 0 lints**
- **active Move / Frame lifecycle integrity PASS**
- **Phase1〜20 automated/internal重大実装漏れ 0**

Evidenceの無い32件を100%表示のためにverified化しないことを、最終的なデータ品質上の正しい判断とする。

**Phase20 COMPLETE. Phase21 is not started.**
