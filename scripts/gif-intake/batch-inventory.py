#!/usr/bin/env python3
"""Luke/Manon/JP のGIF素材を一括で検査する共通バッチ(読み取り専用。素材は変更しない)。
検査内容: SHA-256 / GIFとして読込 / 解像度 / fps / 再生時間 / ループ / 容量 / 同一バイト重複 / 制作規格(480x270・20fps・ループ)との差。
入力: --blob-map JSON({ファイル名: ローカルのバイト列パス})  --inventory Drive在庫JSON(title,id,fileSize,parentId)
取得できない素材は ASSET_UNAVAILABLE として記録(合格扱いにしない)。"""
import json, sys, argparse, collections, importlib.util
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
sp = importlib.util.spec_from_file_location("gi", ROOT / "scripts/gif-intake/gif_intake.py"); gi = importlib.util.module_from_spec(sp); sp.loader.exec_module(gi)
CHARS = {"luke": "luke", "manon": "manon", "jp": "jp"}

def char_of(title):
    t = title.lower()
    for c in ("luke", "manon"):
        if c in t: return c
    return "jp" if ("-jp-" in t or t.startswith("jp-")) else None

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--blob-map", required=True); ap.add_argument("--inventory", required=True); ap.add_argument("--out", required=True)
    a = ap.parse_args()
    blobs = json.load(open(a.blob_map)); inv = json.load(open(a.inventory))
    recs = []
    for x in sorted(inv, key=lambda x: x["title"]):
        ch = char_of(x["title"])
        if not ch: continue
        r = dict(character=ch, file=x["title"], driveFileId=x["id"], driveBytes=int(x["fileSize"]))
        p = blobs.get(x["title"])
        if not p or not Path(p).exists():
            r.update(assetStatus="ASSET_UNAVAILABLE", reason="Driveコネクタの取得上限(10MB)超、または未取得" if int(x["fileSize"]) > 10 * 1024 * 1024 else "未取得")
        else:
            ins = gi.inspect_gif(p)
            fps = round(ins["frames"] / (ins["durationMs"] / 1000), 2) if ins.get("frames") and ins.get("durationMs") else None
            spec = dict(size480x270=(ins.get("width"), ins.get("height")) == (480, 270), fps20=fps == 20.0, loopForever=ins.get("loopCount") == 0)
            r.update(assetStatus="ASSET_VERIFIED" if not ins["errors"] and ins["bytes"] == r["driveBytes"] else "ASSET_CHECK_FAILED",
                     sha256=ins["sha256"], bytes=ins["bytes"], width=ins["width"], height=ins["height"], frames=ins["frames"], durationMs=ins["durationMs"], fps=fps,
                     loopCount=ins["loopCount"], errors=ins["errors"], spec=spec, specAllOk=all(spec.values()))
        recs.append(r)
    by = collections.defaultdict(list)
    for r in recs:
        if r.get("sha256"): by[r["sha256"]].append(r["file"])
    dups = [dict(sha256=k, files=v) for k, v in by.items() if len(v) > 1]
    per = {}
    for ch in CHARS:
        rs = [r for r in recs if r["character"] == ch]
        per[ch] = dict(driveGifs=len(rs), verified=sum(r["assetStatus"] == "ASSET_VERIFIED" for r in rs), unavailable=sum(r["assetStatus"] == "ASSET_UNAVAILABLE" for r in rs),
                       specAllOk=sum(bool(r.get("specAllOk")) for r in rs), specDeviation=sum(r["assetStatus"] == "ASSET_VERIFIED" and not r["specAllOk"] for r in rs),
                       duplicateGroups=[d for d in dups if any(f in d["files"] for f in [r["file"] for r in rs])])
    Path(a.out).write_text(json.dumps(dict(generated="2026-11-16", note="素材の静的検査。検査合格は映像QA・公開承認ではない", perCharacter=per, duplicateGroups=dups, records=recs), ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({k: {kk: vv for kk, vv in v.items() if kk != "duplicateGroups"} for k, v in per.items()}, ensure_ascii=False)); print("dups:", dups)

if __name__ == "__main__": main()
