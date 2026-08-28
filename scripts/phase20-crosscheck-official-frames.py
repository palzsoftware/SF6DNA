import hashlib
import json
import os
import re
import urllib.request
from pathlib import Path

ROOT = Path("artifacts/phase20-official-frame-snapshots")
OUT = Path("artifacts/phase20-frame-crosscheck")
OUT.mkdir(parents=True, exist_ok=True)

SECTIONS = {"通常技", "特殊技", "必殺技", "スーパーアーツ", "通常投げ", "投げ", "共通システム"}
IMG_RE = re.compile(r"!\[[^\]]*\]\([^)]*\)")
VARIANT_RE = re.compile(r"(?:段目|ホールド|ジャスト|Lv|不発|失敗|射出|チャージ|構え)")


def norm_space(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()


def clean_images(s):
    return IMG_RE.sub(" ", str(s or "")).replace("\u3000", " ").replace("\xa0", " ")


def norm_name(s):
    return re.sub(r"\s+", "", str(s or "")).replace("(", "（").replace(")", "）")


def base_name(s):
    s = norm_space(clean_images(s))
    m = re.search(r"（([^）]+)）$", s)
    if m and not VARIANT_RE.search(m.group(1)):
        s = s[:m.start()]
    return norm_name(s)


def normalize_recovery(v):
    v = norm_space(v)
    m = re.fullmatch(r"着地後\s*(\d+)", v)
    if m:
        return f"{m.group(1)} (landing)"
    m = re.fullmatch(r"全体\s*(\d+)", v)
    if m:
        return f"{m.group(1)} total"
    return v


def normalize_adv(v):
    v = str(v or "").strip()
    if not v:
        return ""
    if v == "D" or v.startswith("D+"):
        return v
    if re.fullmatch(r"[+-]?\d+", v):
        n = int(v)
        return f"+{n}" if n > 0 else str(n)
    return v


def extract_name_cell(cell):
    s = norm_space(clean_images(cell))
    s = re.sub(r"\s+（[^）]*）.*$", "", s)
    s = re.sub(r"\s+(?:弱|中|強|OD|投げ)$", "", s)
    return s.strip()


def table_rows(lines):
    section = None
    out = []
    for line in lines:
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) == 1 and cells[0] in SECTIONS:
            section = cells[0]
            continue
        if len(cells) < 8 or cells[0] in ("技名", "---") or cells[0].startswith("---"):
            continue
        if section is None:
            continue
        name = extract_name_cell(cells[0])
        if not name:
            continue
        damage = norm_space(clean_images(cells[7]))
        if damage and re.match(r"^\d+", damage):
            damage = re.sub(r"[^0-9].*$", "", damage)
        out.append({
            "section": section,
            "name": name,
            "startup": norm_space(clean_images(cells[1])),
            "active": norm_space(clean_images(cells[2])),
            "recovery": normalize_recovery(clean_images(cells[3])),
            "on_hit": normalize_adv(clean_images(cells[4])),
            "on_block": normalize_adv(clean_images(cells[5])),
            "damage": damage,
        })
    return out


def split_hitblock(tok):
    t = str(tok or "").lstrip("*")
    m = re.fullmatch(r"(\d+)-([0-9]+)-([0-9]+)", t)
    if m:
        return {"recovery": m.group(1), "on_hit": "-" + m.group(2), "on_block": "-" + m.group(3)}
    m = re.fullmatch(r"(\d+)D-([0-9]+)", t)
    if m:
        return {"recovery": m.group(1), "on_hit": "D", "on_block": "-" + m.group(2)}
    m = re.fullmatch(r"D-([0-9]+)", t)
    if m:
        return {"on_hit": "D", "on_block": "-" + m.group(1)}
    m = re.fullmatch(r"(\d+)-([0-9]+)", t)
    if m:
        return {"on_hit": normalize_adv(m.group(1)), "on_block": "-" + m.group(2)}
    return None


def parse_stat_line(raw):
    s = norm_space(clean_images(raw)).replace("※", "*")
    s = re.sub(r"^（[^）]*）\s*", "", s)
    toks = s.split()
    start_idx = None
    for i, t in enumerate(toks):
        if re.fullmatch(r"\*?\d+", t) and i + 1 < len(toks):
            nxt = toks[i + 1]
            if re.fullmatch(r"\*?\d+(?:-\d+)?(?:,\d+-\d+)*(?:\*\d+)?", nxt) or nxt == "全体":
                start_idx = i
                break
    if start_idx is None:
        return None
    toks = toks[start_idx:]
    d = {"startup": toks[0].lstrip("*"), "active": "", "recovery": "", "on_hit": "", "on_block": "", "damage": ""}
    idx = 1
    if idx < len(toks):
        t = toks[idx]
        m = re.fullmatch(r"\*?(\d+(?:-\d+)?(?:,\d+-\d+)*)\*(\d+)", t)
        if m:
            d["active"], d["recovery"] = m.group(1), m.group(2)
            idx += 1
        elif re.fullmatch(r"\*?\d+(?:-\d+)?(?:,\d+-\d+)*", t):
            d["active"] = t.lstrip("*")
            idx += 1
    if not d["recovery"] and idx < len(toks):
        t = toks[idx]
        if re.fullmatch(r"\*?\d+", t):
            d["recovery"] = t.lstrip("*")
            idx += 1
        elif t.startswith("着地後"):
            d["recovery"] = normalize_recovery(t)
            idx += 1
        elif re.fullmatch(r"\d+\+着地後\d+", t):
            d["recovery"] = t
            idx += 1
        elif t == "全体" and idx + 1 < len(toks) and toks[idx + 1].isdigit():
            d["recovery"] = normalize_recovery("全体 " + toks[idx + 1])
            idx += 2
        else:
            comp = split_hitblock(t)
            if comp and "recovery" in comp:
                d.update(comp)
                idx += 1
    if not d["on_hit"] and idx < len(toks):
        comp = split_hitblock(toks[idx])
        if comp:
            d.update(comp)
            idx += 1
        elif toks[idx] in ("D", "-") or re.fullmatch(r"D\+\d+|[+-]?\d+", toks[idx]):
            h = toks[idx]
            if idx + 1 < len(toks) and re.fullmatch(r"[+-]?\d+", toks[idx + 1]):
                d["on_hit"] = normalize_adv(h) if h != "-" else ""
                d["on_block"] = normalize_adv(toks[idx + 1])
                idx += 2
            elif h == "D" or h.startswith("D+"):
                d["on_hit"] = h
                idx += 1
    for t in toks[idx:]:
        m = re.match(r"^[※*]?(\d+)", t)
        if m and int(m.group(1)) >= 100:
            d["damage"] = m.group(1)
            break
    return d


def line_rows(lines):
    out = []
    section = None
    for i, line in enumerate(lines):
        st = line.strip()
        if st in SECTIONS:
            section = st
            continue
        if section is None or not st or st.startswith("*") or st.startswith("![") or st.startswith("|") or st.startswith("Title:") or st.startswith("URL Source:") or st in ("Markdown Content:", "FRAME DATA") or re.match(r"^\d", st):
            continue
        j = i + 1
        while j < len(lines) and not lines[j].strip():
            j += 1
        if j >= len(lines):
            continue
        nxt = lines[j].strip()
        if "![" not in nxt and not nxt.startswith("（"):
            continue
        parsed = parse_stat_line(nxt)
        if parsed:
            out.append({"section": section, "name": st, **parsed})
    return out


def parse_file(path):
    lines = path.read_text(encoding="utf-8").splitlines()
    if any(l.startswith("| 技名 |") for l in lines):
        return table_rows(lines)
    return line_rows(lines)


def canonical_for_mask(row, mask):
    values = [row.get("startup", ""), row.get("active", ""), normalize_recovery(row.get("recovery", "")), normalize_adv(row.get("on_hit", "")), normalize_adv(row.get("on_block", "")), str(row.get("damage", "") or "")]
    selected = [values[i] if mask[i] == "1" else "~" for i in range(6)]
    return hashlib.md5("|".join(selected).encode()).hexdigest()


def get_db_fingerprints():
    url = os.environ["SUPABASE_URL"].rstrip("/") + "/rest/v1/rpc/_phase20_frame_audit_fingerprints"
    req = urllib.request.Request(url, data=b"{}", method="POST", headers={"apikey": os.environ["SUPABASE_PUBLISHABLE_KEY"], "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def main():
    official = {}
    for p in sorted(ROOT.glob("*.md")):
        official[p.stem] = [r for r in parse_file(p) if r["section"] != "共通システム"]
    db = get_db_fingerprints()
    matches = []
    unresolved = []
    summaries = {}
    for item in db:
        slug = item["slug"]
        rows = official.get(slug, [])
        mask = item["mask"]
        direct = []
        for r in rows:
            nh = hashlib.md5(norm_name(r["name"]).encode()).hexdigest()
            bh = hashlib.md5(base_name(r["name"]).encode()).hexdigest()
            if item["name_hash"] in (nh, bh) and canonical_for_mask(r, mask) == item["fp"]:
                direct.append(r)
        method = None
        if direct:
            method = "name+fields"
        else:
            field_only = [r for r in rows if canonical_for_mask(r, mask) == item["fp"]]
            if len(field_only) == 1:
                method = "unique-fields"
        target = matches if method else unresolved
        target.append({"slug": slug, "name_hash": item["name_hash"], "mask": mask, "fp": item["fp"], "verification_status": item["verification_status"], "method": method})
    for slug in sorted({x["slug"] for x in db}):
        d = [x for x in db if x["slug"] == slug]
        m = [x for x in matches if x["slug"] == slug]
        u = [x for x in unresolved if x["slug"] == slug]
        summaries[slug] = {"db_total": len(d), "official_parsed": len(official.get(slug, [])), "concordant": len(m), "unresolved": len(u), "verified_before": sum(x["verification_status"] == "verified" for x in d), "verified_conflict_or_unresolved": sum(x["verification_status"] == "verified" for x in u)}
    result = {"total_db": len(db), "total_concordant": len(matches), "total_unresolved": len(unresolved), "verified_unresolved": sum(x["verification_status"] == "verified" for x in unresolved), "summary": summaries, "matches": matches, "unresolved": unresolved}
    (OUT / "crosscheck.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({k: result[k] for k in ("total_db", "total_concordant", "total_unresolved", "verified_unresolved")}, ensure_ascii=False))
    for slug, s in summaries.items():
        print(slug, s)


if __name__ == "__main__":
    main()
