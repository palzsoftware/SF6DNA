#!/usr/bin/env python3
"""GIF同士のフレーム重複(同じ動作・同じ録画由来かの手がかり)を調べる共通ツール。読み取り専用。
各GIFを48x27のグレーに縮小し、フレームごとに『他方に平均差<2のフレームがあるか』を数える。
注意: 同じ技の動作は別テイクでも似るため、重複=同一録画の証明ではない。映像の同一性の『手がかり』としてのみ使う。
使い方: frame-overlap.py --blob-map map.json --files a.gif b.gif ... --out out.json"""
import json, argparse, itertools
from PIL import Image
import numpy as np

def sigs(path):
    im = Image.open(path); out = []
    for i in range(im.n_frames):
        im.seek(i); out.append(np.asarray(im.convert("L").resize((48, 27)), dtype=np.int16))
    return out

def match_mask(a, b, th=2.0):
    return [int(min(np.abs(x - y).mean() for y in b) < th) for x in a]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--blob-map", required=True); ap.add_argument("--files", nargs="+", required=True); ap.add_argument("--out", required=True)
    a = ap.parse_args(); bm = json.load(open(a.blob_map))
    S = {f: sigs(bm[f]) for f in a.files}
    pairs = []
    for x, y in itertools.permutations(a.files, 2):
        m = match_mask(S[x], S[y]); r = sum(m) / len(m)
        run = best = 0
        for v in m:
            run = run + 1 if v else 0; best = max(best, run)
        pairs.append(dict(a=x, inB=y, fractionOfAFramesFoundInB=round(r, 3), longestMatchedRun=best, framesA=len(m)))
    json.dump(dict(generated="2026-11-16", note="重複は同一録画の証明ではない(同じ動作は別テイクでも似る)", threshold=2.0, pairs=pairs), open(a.out, "w"), ensure_ascii=False, indent=1)
    for p in pairs:
        if p["fractionOfAFramesFoundInB"] > 0.1: print(p)

if __name__ == "__main__": main()
