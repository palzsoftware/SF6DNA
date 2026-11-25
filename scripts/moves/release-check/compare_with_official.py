"""Production-mode display vs every official row (2,672): shown or held, frames, damage (+condition), input or condition,
patch/source evidence; nothing outside the grant ledger shown."""
import csv, json, sys, collections
disp, rows_p, ledger_p, fill_p, labels_p, out_p, held_p = sys.argv[1:8]
disp = json.load(open(disp)); rows = list(csv.DictReader(open(rows_p, encoding="utf-8-sig")))
ledger = json.load(open(ledger_p)); fill = json.load(open(fill_p))["byCharacter"]; labels = json.load(open(labels_p))
granted = {m["id"] for c in ledger["characters"] for m in c["moves"]}
byh = {(s, r["h"]): r for s, rs in fill.items() for r in rs}
FIELD = {"発生": "startup", "持続": "active", "硬直": "recovery", "ヒット時": "onHit", "ガード時": "onBlock", "ダメージ": "damage"}
def norm(v):
    v = (v or "").strip().removesuffix("F").lstrip("+")
    v = "D" if v == "ダウン" else v
    return "—" if v in ("NA", "—", "-", "ー") else v
per = collections.OrderedDict(); problems = []; held = []
for slug, page in disp.items():
    cards = {st["id"]: card for card in page["cards"] for st in card["sets"]}
    sets = {st["id"]: st for card in page["cards"] for st in card["sets"]}
    mine = [r for r in rows if r["character"] == slug]
    stat = collections.Counter()
    for r in mine:
        shown = r["moveId"] in sets
        if r["published"] != "yes":
            stat["held"] += 1
            held.append([r["rowId"], slug, r["name"], r["kind"], r["heldReason"], "表示なし" if not shown else "表示あり(問題)"])
            if shown: problems.append((r["rowId"], "held row shown"))
            continue
        if not shown:
            problems.append((r["rowId"], "missing")); stat["missing"] += 1; continue
        stat["shown"] += 1
        card, st = cards[r["moveId"]], sets[r["moveId"]]
        off = dict(byh[(slug, r["hash"])]["v"])
        for fix in filter(None, (r.get("screenCorrection") or "").split("／")):  # official table screen value wins (rows.csv)
            field, _, change = fix.partition(": "); off[field] = change.split(" -> ")[1]
        bad = []
        for label, key in FIELD.items():
            want = off.get(key)
            if key == "damage" and r["damageText"]:
                want = r["damageText"]
            got = st["frames"].get(label)
            if want and norm(got) != norm(want): bad.append(f"{label}:{got}!={want}")
        if r["damageText"]:
            conds = [d["text"] for d in card["damageCondition"] if d["id"] == r["moveId"]]
            if not conds or r["damageCondition"] not in conds[0]: bad.append("damage condition")
        scheme, _, text = r["command"].partition(": ")
        cell = card["classic"] if scheme == "classic" else card["modern"]
        # Same official text; the existing OD presentation may or may not join the three buttons with "または".
        plain = lambda x: x.replace("、または", "")
        if plain(labels[f"{slug}|{r['hash']}"]) not in [plain(x) for x in (cell or {}).get("labels", [])]: bad.append(f"{scheme} input")
        if r["condition"] and not any(r["condition"] in c for c in card["condition"]): bad.append("condition")
        if r["kind"] == "modern_only" and "Classic表に掲載なし" not in (card["classic"] or {}).get("text", ""): bad.append("classic not-listed label")
        if not any("対応バージョン未確定" in p and "2026-11-24" in p for p in card["patch"]): bad.append("patch label")
        if not any(u.startswith("https://www.streetfighter.com/6/") for u in card["sources"]): bad.append("official source link")
        if bad: problems.append((r["rowId"], "; ".join(bad))); stat["mismatch"] += 1
    extra = [i for i in sets if i not in {r["moveId"] for r in mine}]
    leaked = [i for i in sets if i not in granted]
    for i in extra: problems.append((slug, "unexpected card " + cards[i]["name"]))
    stat["unexpected"] = len(extra); stat["notGranted"] = len(leaked)
    per[slug] = {"officialRows": len(mine), **{k: stat[k] for k in ("shown", "held", "missing", "mismatch", "unexpected", "notGranted")}, "overflow": page["overflow"]}
tot = {k: sum(v[k] for v in per.values()) for k in ("officialRows", "shown", "held", "missing", "mismatch", "unexpected", "notGranted")}
print(json.dumps(tot, ensure_ascii=False)); print("characters", len(per), "overflow", [s for s, v in per.items() if v["overflow"]])
print("problems", len(problems)); [print(p) for p in problems[:30]]
with open(out_p, "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f); w.writerow(["character", "officialRows", "shownViaPublicPath", "held", "missing", "mismatch", "unexpectedCards", "notInLedger"])
    for s, v in per.items(): w.writerow([s, v["officialRows"], v["shown"], v["held"], v["missing"], v["mismatch"], v["unexpected"], v["notGranted"]])
with open(held_p, "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f); w.writerow(["rowId", "character", "name", "kind", "reason", "display"]); w.writerows(held)
