"""Local candidate fill for all 32 characters' move cards from the official frame tables checked on 2026-11-24.

Inputs (read-only):
  --official-dir  SF6DNA_27CHAR_OFFICIAL_MOVES_ALL_20261124.csv, SF6DNA_RYU_JP_OFFICIAL_MOVES_20261124.csv,
                  SF6DNA_JAMIE/LUKE/JURI_OFFICIAL_MOVES_20261124.csv (2672 rows = the expected moves per character)
  --txt           SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json (keys the existing cards already carry)
  --arjun-draft   SF6DNA_ARJUN_CARD_DRAFT_20261117.json (Arjun's local cards)
Every official row is tied to an existing official source key: same webId first, otherwise the same official move
name (several rows with one name are paired by their values). The output keeps one compact record per official row;
src/lib/all32-official-move-fill.ts applies it when the page is built (local review only):
  fill    the card with that key exists: frame/damage values and Classic/Modern inputs are written only where the
          card has none (an official "ー" is shown as "—"); existing values are never replaced
  append  no card with that key (e.g. Ryu's common system rows, Arjun rows left out of its draft, rows without a key):
          a new local card built from the official row only
"""
import argparse
import csv
import hashlib
import json
import re
import unicodedata
from pathlib import Path

JA = {"C.ヴァイパー": "c-viper", "ディージェイ": "dee-jay", "舞": "mai", "エレナ": "elena", "豪鬼": "akuma", "マリーザ": "marisa",
      "ブランカ": "blanka", "キンバリー": "kimberly", "ダルシム": "dhalsim", "ガイル": "guile", "ラシード": "rashid", "キャミィ": "cammy",
      "アレックス": "alex", "ヤスミン": "yasmine", "春麗": "chun-li", "ケン": "ken", "ベガ": "m-bison", "アルジュン": "arjun", "サガット": "sagat",
      "イングリッド": "ingrid", "リリー": "lily", "エド": "ed", "ザンギエフ": "zangief", "エドモンド本田": "e-honda", "テリー": "terry",
      "A.K.I.": "aki", "マノン": "manon", "ジェイミー": "jamie", "ルーク": "luke", "ジュリ": "juri"}
TXT_SLUG = {"dee-jay": "deejay"}
FIELDS = ("startup", "active", "recovery", "onHit", "onBlock", "damage")
MOVE_TYPE = {"通常技": "normal", "特殊技": "normal", "必殺技": "special", "SA": "super_art", "共通システム": "system", "移動": "system",
             "投げ": "normal", "通常投げ": "normal"}
NO_INPUT = {"", "-", "－", "―", "　", "（モダン表に行なし）", "（クラシック表に行なし）"}
STATUS = "LOCAL_OFFICIAL_FRAME_20261124"  # applied by src/lib/all32-official-move-fill.ts


def nname(text):
    return re.sub(r"[\s　]", "", unicodedata.normalize("NFKC", text or ""))


def official_rows(directory):
    rows = []
    for name in ("SF6DNA_27CHAR_OFFICIAL_MOVES_ALL_20261124.csv", "SF6DNA_JAMIE_OFFICIAL_MOVES_20261124.csv",
                 "SF6DNA_LUKE_OFFICIAL_MOVES_20261124.csv", "SF6DNA_JURI_OFFICIAL_MOVES_20261124.csv"):
        for r in csv.DictReader((directory / name).open(encoding="utf-8-sig")):
            rows.append({"char": JA[r["キャラ"]], "webId": r["公式webId"], "name": r["公式技名"], "category": r["分類"],
                         "classic": r["Classic入力（公式）"], "modern": r["Modern入力（公式）"], "startup": r["発生"],
                         "active": r.get("持続（公式の段別表記）") or r.get("持続（合算表示。段別表記から算出）") or r.get("持続（画面の合算表示）", ""),
                         "recovery": r["硬直"], "total": r.get("全体フレーム（公式記載時のみ）", ""), "onHit": r["ヒット時の有利不利"],
                         "onBlock": r["ガード時の有利不利"], "damage": r["ダメージ（Classic）"], "url": r.get("出典URL", ""), "file": name})
    for r in csv.DictReader((directory / "SF6DNA_RYU_JP_OFFICIAL_MOVES_20261124.csv").open(encoding="utf-8-sig")):
        rows.append({"char": r["character"], "webId": "", "name": r["official_name"], "category": r["category"], "classic": r["classic_input"],
                     "modern": r["modern_input"], "startup": r["startup"], "active": r["active_segments_official"] or r["active_official"],
                     "recovery": r["recovery"], "total": r["total_frames_official"], "onHit": r["on_hit"], "onBlock": r["on_block"],
                     "damage": r["damage"], "url": r["frame_url"], "file": "SF6DNA_RYU_JP_OFFICIAL_MOVES_20261124.csv"})
    return rows


def cell(value):
    value = (value or "").strip()
    if value in ("ー", "―", "－"):
        return "NA"
    return None if value in ("", "-") else re.sub(r"^LAND\((\d+)\)$", r"着地後\1", value)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--official-dir", type=Path, required=True)
    parser.add_argument("--txt", type=Path, required=True)
    parser.add_argument("--arjun-draft", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()
    txt = json.loads(args.txt.read_text(encoding="utf-8"))
    official = official_rows(args.official_dir)
    out, report = {}, []
    for char in sorted({r["char"] for r in official}):
        wk = TXT_SLUG.get(char, char)
        keys = [k for k, v in txt.items() if v["characterSlug"] == wk]
        by_name = {}
        for k in keys:
            by_name.setdefault(nname(txt[k]["raw"].get("skill")), []).append(k)
        used, records = set(), []
        for index, row in enumerate(r for r in official if r["char"] == char):
            key = f"{wk}:web:{row['webId']}" if row["webId"] and f"{wk}:web:{row['webId']}" in txt else None
            if key in used:
                key = None
            if key is None:
                options = [k for k in by_name.get(nname(row["name"]), []) if k not in used]
                def score(k):
                    raw = txt[k]["raw"]
                    return sum(1 for a, b in (("startup", "startup_frame"), ("damage", "damage"), ("onBlock", "block_frame"))
                               if cell(row[a]) and str(raw.get(b) or "").strip() == cell(row[a]))
                key = max(options, key=score) if options else None
            if key:
                used.add(key)
            values = {f: cell(row[f]) for f in (*FIELDS, "total")}
            inputs = {sc: row[sc].strip() for sc in ("classic", "modern") if row[sc].strip() not in NO_INPUT}
            records.append({"k": key, "n": row["name"], "t": MOVE_TYPE.get(row["category"], "special"),
                            "v": {f: v for f, v in values.items() if v}, "i": inputs, "u": row["url"],
                            "h": hashlib.sha256((row["file"] + row["webId"] + row["name"] + str(index)).encode()).hexdigest()[:12]})
            report.append({"character": char, "official": row["webId"] or row["name"], "name": row["name"], "key": key or "",
                           "matchedBy": "webId" if key and row["webId"] and key.endswith(f":web:{row['webId']}") else "name" if key else "none"})
        out[char] = records
    args.out.write_text(json.dumps({"source": "official frame tables checked 2026-11-24 (27CHAR/RYU_JP/JAMIE/LUKE/JURI CSV)",
                                    "status": STATUS, "byCharacter": out}, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    with args.report.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(report[0]))
        writer.writeheader()
        writer.writerows(report)
    print(json.dumps({"rows": sum(len(v) for v in out.values()), "withoutKey": {c: sum(1 for r in v if not r["k"]) for c, v in out.items() if any(not r["k"] for r in v)}}, ensure_ascii=False))


if __name__ == "__main__":
    main()
