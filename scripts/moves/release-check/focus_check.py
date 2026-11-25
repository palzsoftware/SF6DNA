"""Focus checks on the scraped production-mode pages (scrape_pages.cjs output) against rows.csv.
python3 -I focus_check.py <display.json> <rows.csv>   -> prints one line per check and exits 1 on any failure."""
import csv, json, sys
disp = json.load(open(sys.argv[1])); rows = list(csv.DictReader(open(sys.argv[2], encoding="utf-8-sig")))
fails = []
def card_of(r):
    for c in disp[r["character"]]["cards"]:
        if any(s["id"] == r["moveId"] for s in c["sets"]):
            return c
def check(label, ok, detail=""):
    print(("OK  " if ok else "NG  ") + label + (f"  {detail}" if detail else "")); ok or fails.append(label)
pub = [r for r in rows if r["published"] == "yes"]
check("all 32 characters render", len(disp) == 32 and all(p["status"] == 200 for p in disp.values()))
check("2,549 published rows each shown once", sum(1 for r in pub if card_of(r)) == len(pub) == 2549)
mo = [r for r in pub if r["kind"] == "modern_only"]
check("Modern-only 31: Classic says not listed, Modern input shown", len(mo) == 31 and all(
    "Classic表に掲載なし" in (card_of(r)["classic"] or {}).get("text", "") and (card_of(r)["modern"] or {}).get("labels") for r in mo))
co = [r for r in pub if r["kind"] == "condition_only"]
check("no own input 18: 個別入力なし + official condition", len(co) == 18 and all(
    any(r["condition"] in c for c in card_of(r)["condition"]) for r in co))
auto = [r for r in pub if r["command"].startswith("classic: 自動派生")]
check("auto-derived 4 (Arjun/Kimberly): 自動派生（個別入力なし） + condition", len(auto) == 4 and all(
    any(r["condition"] in c for c in card_of(r)["condition"]) for r in auto))
dm = [r for r in pub if r["damageText"]]
check("conditional damage 36: notation kept as written + official condition", len(dm) == 36 and all(
    any(s["frames"].get("ダメージ") == r["damageText"] for s in card_of(r)["sets"] if s["id"] == r["moveId"])
    and any(r["damageCondition"] in d["text"] for d in card_of(r)["damageCondition"]) for r in dm))
arjun = [r for r in pub if r["character"] == "arjun"]
check("Arjun page shows all its published rows", bool(arjun) and all(card_of(r) for r in arjun), f"{len(arjun)} rows")
warp = [r for r in rows if r["character"] == "m-bison" and "ベガワープ" in r["name"]]
check("ベガワープ 4 rows held and not shown", len(warp) == 4 and all(r["published"] == "no" and not card_of(r) for r in warp))
held = [r for r in rows if r["published"] == "no"]
check("123 held rows not shown", len(held) == 123 and not any(card_of(r) for r in held))
check("every shown card says version unconfirmed + checked date", all(
    any("対応バージョン未確定" in p and "2026-11-24" in p for p in card_of(r)["patch"]) for r in pub))
sys.exit(1 if fails else 0)
