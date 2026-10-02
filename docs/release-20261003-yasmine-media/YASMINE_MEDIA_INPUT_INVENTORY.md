# Yasmine Media Input Inventory — readable same captures

Base: `634ad668e3c84eb51ddb0be643a07d9604cb52b6`. Input names with (2)/(1) are reattachments, not evidence of rerecording. Originals remain untouched, outside repository. Fresh ffprobe and decoded contact sheets were used. Total input: 1,062,356,731 bytes. All six: HEVC 2560×1440, audio present; output is silent H.264 640×360 60fps + still WebP. Capture patch is unverified.

| File | Bytes | Seconds | Average fps | Content / contamination |
|---|---:|---:|---:|---|
| yasmine-normals(2).mp4 | 136363686 | 47.533 | 60.015 | Standing/crouching punches and kicks; repeated takes. No isolated jumping attacks identified. |
| yasmine-unique-moves(2).mp4 | 170660328 | 60.050 | 50.339 | In-game list and six command/chain takes; failed attempts/reset gaps. DB categorizes these six as normal, preserved. |
| yasmine-specials1(1).mp4 | 335038696 | 116.811 | 59.943 | Menu, repeated/failed inputs. Family order: Daloy/Alon, Talim, Mukha/Ulan/Kulog, Lipad. Most strength/OD/stage variants unresolved. |
| yasmine-specials2(1).mp4 | 207373619 | 76.070 | 60.010 | Continuation; Kulog/Lipad, Pangil projectiles, menus and SA2 trial at end. No assumed full variant coverage. |
| yasmine-throws(2).mp4 | 54081443 | 18.774 | 60.032 | Forward and backward contact throws; reset between. |
| yasmine-super-arts(2).mp4 | 158838959 | 56.394 | 59.979 | SA1, SA2, SA3, low-health CA. Leading jumps and reset/refill at tails excluded by refined offsets. |

## Provenance SHA256

- `yasmine-normals(2).mp4`: `c20e61b210382cbfad62c62e71eb6425605b113b3bc91c146324803f0787381c`
- `yasmine-unique-moves(2).mp4`: `a77ff2e8793a9d72f213b9aa5fefe082c6d20164c30ef138d679bd5e6e404015`
- `yasmine-specials1(1).mp4`: `e786e494ca636c07bc97f44bf28badd2b5472351172b59e6743cde1069339556`
- `yasmine-specials2(1).mp4`: `0b782ac8fa8aa5031655641e2d87c22fcc14e2c0519b854485906575fc5bee97`
- `yasmine-throws(2).mp4`: `e198150a25f602f24a5695b90704a743703b4343a3e028d2d4e6aade3606857b`
- `yasmine-super-arts(2).mp4`: `7724987571065104a623c451c09832b2de015b1787ca538a6a2fa25e30cfc34b`

## Review and cut rules

Whole recordings were decoded into 1fps sheets, followed by detailed 4–10fps review around actions and finer boundary frames for SA. Candidate cuts were decoded independently and checked at start, action/poster and end. Semiautomatic timestamp selection; no automatic Move ID inference. CSV is the exact 73-row reconciliation and contains each confirmed interval/output or precise unresolved reason. Recording order is corroboration only.

SA final offsets: SA1 3.18–7.85; SA2 12.96–15.08; SA3 24.08–35.05; CA 43.08–53.98 seconds. Leading neutral jumps are excluded; SA2 ends before the training reset/refill. SA3 and CA are distinct takes.

Specials are treated as one category across both files. Do not map weak/medium/heavy/OD or SA2-enhanced rows from list position alone. Reviewed Kulog and Ulan use the selected menu entry plus distinct follow-up movement; unresolved variants remain unassigned.
