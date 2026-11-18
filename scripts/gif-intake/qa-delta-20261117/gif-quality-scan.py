#!/usr/bin/env python3
"""ローカルQA接続GIFの品質を機械的に検査する(読み取りのみ・製品コードは変更しない)。
検出項目:
  (TOP_CLIP/BANNER/NO_LOOP_MATCH は目視で誤検出と判明したため削除。2026-11-17)
  STATIC_HEAD  : 先頭の静止フレームが長い / STATIC_TAIL: 末尾の静止が長い
  LOW_MOTION   : ほぼ動いていない
  FPS_ODD      : フレーム間隔が一定でない or 10fps未満
  SMALL        : 解像度が 480x270 未満
  NO_LOOP_MATCH: 最終フレームと先頭フレームの差が大きい(ループ時に跳ぶ)
  BLACK_FRAME  : ほぼ黒のフレームがある
  BANNER       : 画面下部中央に「バトル再スタート」等の帯が出ている疑い(中央下部の暗帯)
使い方: python3 -I gif-quality-scan.py <repo_root> <out.json>
"""
import json, glob, sys, os
import numpy as np
from PIL import Image

root, out = sys.argv[1], sys.argv[2]
rows = []
for f in sorted(glob.glob(f"{root}/v2-web/src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_*.json")):
    d = json.load(open(f))
    for e in d.get("entries", []):
        ch = d["characterSlug"]
        p = f"{root}/v2-web/.sf6dna-local-qa-gif/{ch}/{e['fileName']}"
        im = Image.open(p)
        n = im.n_frames
        frames, durs = [], []
        for i in range(n):
            im.seek(i)
            frames.append(np.asarray(im.convert("L"), dtype=np.int16))
            durs.append(im.info.get("duration", 0))
        W, H = im.size
        # 画面の撮影領域(上のHUDを避けて y=14%〜92%)
        y0, y1 = int(H * 0.14), int(H * 0.92)
        diffs = [float(np.abs(frames[i][y0:y1] - frames[i - 1][y0:y1]).mean()) for i in range(1, n)]
        thr = 0.15
        moving = [i for i, v in enumerate(diffs, 1) if v > thr]
        head = (moving[0] - 1) if moving else n
        tail = (n - 1 - moving[-1]) if moving else n
        flags = []
        if head / n > 0.25: flags.append("STATIC_HEAD")
        if tail / n > 0.30: flags.append("STATIC_TAIL")
        if len(moving) / max(1, n - 1) < 0.5: flags.append("LOW_MOTION")
        if len(set(durs)) > 3 or (np.mean(durs) > 100): flags.append("FPS_ODD")
        if W < 480 or H < 270: flags.append("SMALL")
        loop = float(np.abs(frames[-1][y0:y1] - frames[0][y0:y1]).mean())
        # 末尾の完全な黒フレーム(フェードアウト残り)。SA暗転は途中で明るさが戻るので対象外
        tb = 0
        for fr in reversed(frames):
            if fr.mean() < 2: tb += 1
            else: break
        if tb: flags.append("TRAILING_BLACK")
        if any(fr.mean() < 2 for fr in frames[:-tb or None]): flags.append("MID_BLACK")
        rows.append({"character": ch, "moveSlug": e["moveSlug"], "file": e["fileName"], "frames": n, "w": W, "h": H,
                     "durationMs": sum(durs), "headStatic": head, "tailStatic": tail, "loopDiff": round(loop, 2),
                     "moveRatio": round(len(moving) / max(1, n - 1), 2), "trailingBlack": tb, "flags": flags,
                     "weak": e.get("publicCandidate") is False})
json.dump(rows, open(out, "w"), ensure_ascii=False, indent=1)
from collections import Counter
c = Counter(fl for r in rows for fl in r["flags"])
print(len(rows), "files;", dict(c), "flagged", sum(1 for r in rows if r["flags"]))
