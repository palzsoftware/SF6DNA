> The initial sections below are the preserved pre-integration audit baseline. The RC integration section supersedes its eight-candidate confidence and remote-write status.

# Alex 条件付きMotion Media — REVIEW ONLY

通常Mediaへの置換は0。すべて公開承認0。映像で条件が併存したことと、その条件が必須であることを区別する。

| 候補 | source / interval ms | observed trigger / preceding move / input | Punish Counter required | position / gauge / stock | resulting animation | DB / binding |
|---|---|---|---|---|---|---|
| 背面ヒット・ドライバーroute | alex-punish-counter-specials.mp4 / 3300–9550 | 強フラッシュチョップ成功236HP → 背面の相手へ成功4MK; PC表示 | UNRESOLVED（表示は確認、必須性は証明しない） | 地上中央、相手背面、SA3維持、stock未観測 | 映像上のドライバー演出 | 専用候補 alex-collapsing-driver-4mk-backturn。ゲーム「コラプス・ドライバー」vs DB「コラプシングドライバー」、特殊技vs normalを保持。RUNTIME_BINDING_HOLD |
| スタンス中PのPC投げroute | alex-punish-counter-specials.mp4 / 15100–20650 | スタンス → 中P SUCCESS → PC表示 → 投げ演出 | UNRESOLVED（観測のみ） | 地上中央、相手正面、SA3維持、stock未観測 | 空中に移行する特殊投げ。ムーンフォール名称はDB候補、ゲーム内実行名称は非表示 | alex-shoulder-launcher-br-falling-moon-2pp-mp は親技/別演出を併記した行。専用child rowとは断定しない。通常ショルダーランチャーのdefaultに使わない。RUNTIME_BINDING_HOLD |
| ハイパーボムroute | alex-specials2.mp4 / 53600–59500 | OD投げroute中 SUCCESS63214P → 前方入力SUCCESS。ゲームCommand List「ハイパーボム / ODパワードロップ中」 | NOT_ESTABLISHED（PC要否を推論しない） | 地上中央、OD表示、stock未観測。背面条件は独立検証待ち | 追加多段投げ | 専用候補 alex-od-hyper-bomb-63214pp-6-backturn。親技の必要区間を含む条件付きClip。RUNTIME_BINDING_HOLD |

この3組は条件付きレビューAssetであり、通常Mediaの穴を埋めるための流用は禁止。親技区間は条件を示すため意図的に保持する。

追加HOLD：SA source約84–90秒では、OD投げ後にPP SUCCESSと2本消費が見える。DBの alex-omega-wing-buster-pp-sa2 / PP(SA2) と親条件が一致するか未確定。名前・条件を推測せず、Asset化/公開しない。

PC source全編Timeline：0–3.3準備、3.3–9.55背面driver route、10–15準備、15.1–20.65スタンス中P投げ、21–28.5設定、28.5–39.5dummy再生/設定/試行、40.5–43スタンス強PのPCヒット、45.5–50背面driver再実行、51–56設定/準備。再実行は重複mappingしない。40.5–43秒はHP成功・PC表示のみ確認し、追加の独立条件付き演出とは断定しない。

## Runtime契約確認

Fresh RC 3c45c6a7981172ac7172a034c2d867555f0976a2 の move-motion-media.ts / preview-motion-media-pilot.ts をread-onlyで確認。取得・返却するMedia recordはmoveId/mediaUrl/posterUrl等で、trigger・preceding_move・PC条件を分ける専用欄はない。標準Preview manifestも move_id + variant のmappingだが、runtime返却では条件が失われる。専用Move rowへ正しく結び付ける場合を除き、条件付き動画をdefaultへ流し込まない。共通実装変更0、DB変更0。

GAME_SUCCESS表示はCommand Listの技入力テンプレートを表示する場合がある。「弱P or 中P」や汎用P/Kは押下ボタンの証拠ではない。menuの技名はruntime成功技名として記録しない。成功表示の残存も現在のactionの証拠と混同しない。

## RC integration re-review — 2026-10-03

User approved the eight default candidates for re-review and confirmed media only for RC Preview. Seven pass; OD Power Bomb is HOLD. Its opening OD SUCCESS belongs to an earlier execution; the new throw updates to normal SUCCESS. Previous crosscheck confidence is superseded. No OD Power Bomb asset is shipped.

Confirmed: heavy Flash Chop, OD Flash Chop, OD Aerial Knee Smash, SA1, SA2, SA3, CA. Non-attacking relocation jumps before heavy Flash Chop and SA clips were trimmed from derived RC copies; originals and the 17-pair review pack remain unchanged. Success labels are preserved. Three specials and four supers are Preview-only, with frames null and no publication grant. Six discrepant default candidates, three conditional candidates, Jump identities and all other unconfirmed items remain HOLD.

The Alex resolver refuses remote media overrides, wrong identities and conditional/default substitutions. Existing shared command formatter, Move Card, poster-first playback, preload none and lazy visibility playback are reused. No CSS, Yasmine assets, DB or strategy changes.
