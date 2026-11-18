#!/usr/bin/env python3
"""撮影動画から技カード用GIFを一括で切り出す(ローカル作業用・製品コードではない)。

使い方:
  python3 -I clip-to-gif.py --jobs jobs.json --out-dir OUT [--known-sha a.json,b.json] [--max-bytes 10000000]

jobs.json の形式(1要素=1GIF。CSVなら同じ列名の見出し行):
  [{"source": "動画のパス", "start": 12.30, "end": 13.95, "name": "lily-standing-lp", "moveId": "任意", "note": "任意"}]

やること:
  1. 開始時刻・終了時刻で切り出す。-ss を入力の前に置くので、動画を最初から全部デコードしない(要点: 高速シーク)
  2. 480x270・20fps に変換し、パレットを作り直して色を最適化する
  3. 10MB(既定)を超えたら、色数→ディザの順(20fpsは維持)に段階的に軽くして作り直す
  4. SHA256を計算し、Manifest(OUT/manifest.json)へ自動で追記する
  5. 途中で止まっても、manifest に記録済みで実ファイルのSHAが一致するものは飛ばす(再開)
  6. 既存GIFと同じ内容(SHA一致)や、同じ切り出し(元動画+開始+終了が一致)は作らない(重複防止)
"""
import argparse, csv, hashlib, json, os, subprocess, sys

# 容量オーバー時に順に試す設定(後ろほど軽い)。強度や技の判定には影響しない画質設定のみ
PROFILES = [
    {"colors": 256, "dither": "sierra2_4a", "fps": 20},
    {"colors": 128, "dither": "sierra2_4a", "fps": 20},
    {"colors": 128, "dither": "none", "fps": 20},
    {"colors": 64, "dither": "none", "fps": 20},  # 20fps は要件なので落とさない
]


def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def load_known_sha(paths):
    """既存GIFのSHA一覧を集める(ローカルQAデータJSON・差分受入JSON・復元表など、sha256 を持つJSONなら何でも)。"""
    known = {}

    def walk(o, src):
        if isinstance(o, dict):
            s = o.get("sha256")
            if isinstance(s, str) and len(s) == 64:
                known[s] = f"{src}:{o.get('moveSlug') or o.get('fileName') or ''}"
            for v in o.values():
                walk(v, src)
        elif isinstance(o, list):
            for v in o:
                walk(v, src)

    for p in paths:
        if p and os.path.exists(p):
            walk(json.load(open(p, encoding="utf-8")), os.path.basename(p))
    return known


FFMPEG = "ffmpeg"  # --ffmpeg で上書き(Windowsで PATH に無い場合など)


def load_jobs(path):
    """jobs を JSON(配列) または CSV(見出し: source,start,end,name,moveId,note) から読む。"""
    if path.lower().endswith(".csv"):
        with open(path, encoding="utf-8-sig", newline="") as f:  # Excel保存のBOM付きUTF-8も読める
            return [r for r in csv.DictReader(f) if (r.get("name") or "").strip()]
    return json.load(open(path, encoding="utf-8"))


def encode(job, out_path, prof):
    dur = float(job["end"]) - float(job["start"])
    vf = (f"fps={prof['fps']},scale=480:270:flags=lanczos,split[a][b];"
          f"[a]palettegen=max_colors={prof['colors']}:stats_mode=diff[p];"
          f"[b][p]paletteuse=dither={prof['dither']}")
    cmd = [FFMPEG, "-y", "-v", "error",
           "-ss", f"{float(job['start']):.3f}",  # 入力より前 = 高速シーク(全尺デコードしない)
           "-t", f"{dur:.3f}", "-i", job["source"],
           "-vf", vf, "-loop", "0", out_path]
    subprocess.run(cmd, check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--jobs", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--known-sha", default="", help="カンマ区切り。sha256 を含むJSON")
    ap.add_argument("--max-bytes", type=int, default=10_000_000)
    ap.add_argument("--ffmpeg", default="ffmpeg", help="ffmpeg 実行ファイルのパス")
    a = ap.parse_args()
    global FFMPEG
    FFMPEG = a.ffmpeg

    os.makedirs(a.out_dir, exist_ok=True)
    man_path = os.path.join(a.out_dir, "manifest.json")
    manifest = json.load(open(man_path, encoding="utf-8")) if os.path.exists(man_path) else {"schemaVersion": 1, "approval": "NOT_APPROVED", "items": []}
    done = {i["name"]: i for i in manifest["items"]}
    cut_keys = {(i["source"], i["start"], i["end"]): i["name"] for i in manifest["items"]}
    known = load_known_sha([p for p in a.known_sha.split(",") if p])

    jobs = load_jobs(a.jobs)
    failed = 0  # 失敗件数(終了コードに反映。再実行すれば成功分は飛ばして続きから作る)
    for job in jobs:
        name = job["name"]
        out = os.path.join(a.out_dir, name + ".gif")
        # 再開: 記録済み かつ 実ファイルのSHAが一致 → 飛ばす
        if name in done and os.path.exists(out) and sha256_of(out) == done[name]["sha256"]:
            print(f"SKIP(done) {name}")
            continue
        key = (job["source"], float(job["start"]), float(job["end"]))
        if key in cut_keys and cut_keys[key] != name:
            print(f"SKIP(same cut as {cut_keys[key]}) {name}")
            continue
        if not os.path.exists(job["source"]):
            print(f"FAIL(source missing) {name}")
            failed += 1
            continue
        tmp = out + ".part.gif"
        used = None
        try:
            for prof in PROFILES:
                encode(job, tmp, prof)
                if os.path.getsize(tmp) < a.max_bytes:
                    used = prof
                    break
        except subprocess.CalledProcessError as e:
            print(f"FAIL(ffmpeg) {name}: {e}")
            failed += 1
            if os.path.exists(tmp):
                os.remove(tmp)
            continue
        if used is None:
            print(f"FAIL(over {a.max_bytes} bytes) {name}")
            failed += 1
            os.remove(tmp)
            continue
        sha = sha256_of(tmp)
        if sha in known:
            print(f"SKIP(duplicate of {known[sha]}) {name}")
            os.remove(tmp)
            continue
        os.replace(tmp, out)  # 完成してから正式名にする(途中失敗で壊れたGIFを残さない)
        item = {"name": name, "fileName": name + ".gif", "sha256": sha, "bytes": os.path.getsize(out),
                "width": 480, "height": 270, "fps": used["fps"], "colors": used["colors"], "dither": used["dither"],
                "source": job["source"], "start": float(job["start"]), "end": float(job["end"]),
                "moveId": job.get("moveId"), "note": job.get("note"),
                "visualQa": "NOT_DONE", "publicCandidate": False}
        manifest["items"] = [i for i in manifest["items"] if i["name"] != name] + [item]
        known[sha] = f"manifest:{name}"
        cut_keys[key] = name
        # 1本ごとに保存 = 途中で止まっても再開できる
        json.dump(manifest, open(man_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"OK {name} {item['bytes']}B fps={used['fps']} colors={used['colors']}")
    print(f"done: failed={failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
