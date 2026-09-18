# GIF Pilot Capture Package — Ryu / JP

## Common recording contract

- Training mode, 1080p/60fps source, HUD/input display ON for evidence master; clean crop version may hide HUD only after verification.
- 3–6 seconds per move, 0.5秒静止→入力→回復まで→0.5秒静止。Loopは同じニュートラル姿勢で接続。
- Stage: 明るく輪郭が見える固定stage。Camera/side/positionを固定。相手は標準体格、Guardは用途別。
- Public derivative: 720p幅以内、30fps、MP4/WebM優先。GIFは互換用のみ。posterは動作開始直前。
- Cropで技・相手・接触点を切らない。原本はユーザー側にも保持。

## Pilot targets

| File stem | Character | Target | Start condition | Dummy |
|---|---|---|---|---|
| `ryu_hadoken_neutral_v1` | Ryu | 波動拳 | 中央・中距離・meter初期 | Stand / no guard |
| `ryu_shoryuken_antiair_v1` | Ryu | 昇龍拳対空 | 中央・相手forward jump記録 | Jump playback |
| `jp_torbalan_neutral_v1` | JP | トルバラン | 中央・遠距離 | Stand / guard after first take |
| `jp_triglav_ground_v1` | JP | トリグラフ | 中央・遠距離 | Stand / fixed position |
| `jp_vihart_set_v1` | JP | ヴィーハト設置 | 中央・遠距離 | Stand / no movement |

Mapping candidate: move card motion slot → poster + MP4/WebM; unavailable/corrupt → current compact fallback。公開前に権利、容量、永続URL、media relationの承認が必要。CAPCOM素材の再配布や第三者動画切り抜きは使用しない。
