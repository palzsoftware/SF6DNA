#!/usr/bin/env python3
"""ラベル付きコンタクトシート(技名・コマンド・強度・フレームデータ・GIF諸元 + 等間隔8フレーム)を作る共通ツール。読み取り専用。
使い方: make-contact-sheets.py --ledger X-ledger.json --blob-map map.json --status MATCHED_STATIC --out-dir DIR [--per-sheet 3]
同時に、各GIFの客観指標(動作量・開始/終了の一致・収録時間とフレームデータの比)を JSON に出す。"""
import json, argparse, re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np
ROOT = Path(__file__).resolve().parents[2]
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"

def game_frames(fr):
    """フレームデータから『動作全体のフレーム数(60fps)』を概算。解釈できない場合は None。"""
    def n(v):
        m = re.search(r"\d+", str(v)) if v is not None else None
        return int(m.group()) if m else None
    s = n(fr.get("startup")); rec = n(fr.get("recovery")); act = re.findall(r"\d+", str(fr.get("active") or ""))
    a = (int(act[-1]) - int(act[0]) + 1) if len(act) >= 2 else (1 if act else None)
    if s is None or rec is None or a is None: return None
    return s + a - 1 + rec

def main():
    ap = argparse.ArgumentParser()
    for k in ("--ledger", "--blob-map", "--status", "--out-dir"): ap.add_argument(k, required=True)
    ap.add_argument("--per-sheet", type=int, default=3); a = ap.parse_args()
    led = json.load(open(a.ledger)); ch = led["character"]; bm = json.load(open(a.blob_map))
    FIX = {m["slug"]: m for m in json.load(open(ROOT / "v2-web/src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json"))["characters"][ch]["moves"]}
    rows = [r for r in led["rows"] if r["static_status"] == a.status]
    out = Path(a.out_dir); out.mkdir(parents=True, exist_ok=True)
    f12, f16 = ImageFont.truetype(FONT, 13), ImageFont.truetype(FONT, 15)
    W, H, HEAD = 240, 135, 40
    metrics = []
    for si in range(0, len(rows), a.per_sheet):
        grp = rows[si:si + a.per_sheet]
        canvas = Image.new("RGB", (W * 4, (H * 2 + HEAD) * len(grp)), "white"); d = ImageDraw.Draw(canvas)
        for gi, r in enumerate(grp):
            m = FIX[r["move_slug"]]; cmd = next(c["commandText"] for c in m["commands"] if c["scheme"] == "classic")
            im = Image.open(bm[r["filename"]]); n = im.n_frames
            fr_list = []; 
            for i in range(n):
                im.seek(i); fr_list.append(np.asarray(im.convert("L").resize((48, 27)), dtype=np.int16))
            diffs = [float(np.abs(fr_list[i] - fr_list[i - 1]).mean()) for i in range(1, n)]
            gf = game_frames(m["frame"]); dur = r["frames"] / (r["fps"] or 20) * 1000
            met = dict(file=r["filename"], slug=r["move_slug"], frames=n, durationMs=round(dur), motionMean=round(float(np.mean(diffs)), 2), motionMax=round(max(diffs), 2),
                       startEndDiff=round(float(np.abs(fr_list[0] - fr_list[-1]).mean()), 2), gameFramesTotal=gf, moveMs=round(gf / 60 * 1000) if gf else None,
                       coverageRatio=round(dur / (gf / 60 * 1000), 2) if gf else None)
            metrics.append(met)
            y0 = gi * (H * 2 + HEAD)
            d.text((6, y0 + 3), f"{m['name']}  [{r['move_slug']}]  {cmd}", font=f16, fill="black")
            d.text((6, y0 + 22), f"F:{m['frame']['startup']}/{m['frame']['active']}/{m['frame']['recovery']}  GIF {n}f {round(dur)}ms  動作比{met['coverageRatio']}  {r['filename']}", font=f12, fill="#444")
            idx = [round(i * (n - 1) / 7) for i in range(8)]
            for k, i in enumerate(idx):
                im.seek(i); canvas.paste(im.convert("RGB").resize((W, H)), ((k % 4) * W, y0 + HEAD + (k // 4) * H))
        canvas.save(out / f"sheet-{si // a.per_sheet:02d}.jpg", quality=82)
    (out / "metrics.json").write_text(json.dumps(metrics, ensure_ascii=False, indent=1), encoding="utf-8")
    print(len(rows), "rows,", len(list(out.glob("sheet-*.jpg"))), "sheets")

if __name__ == "__main__": main()
