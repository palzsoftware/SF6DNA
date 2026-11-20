"""Audit every local strategy card without changing it, and record one verdict per card.

Verdicts (judgement only; no card is deleted or edited):
  ADOPT      採用候補            independent card with no open issue
  VARIANT    派生として統合推奨  sub-route of, or starter/ender-only variant of, a representative card
  DUPLICATE  重複                same move-ID sequence (and PC/CH start) as an earlier card
  CHECK      要確認              patch, condition, category or practicality needs a person
  EXCLUDE    除外候補            re-extraction from the source clause does not give the card's moves

Titles and descriptions are proposed from the card's own moves and source heading only; no number
(damage, frame advantage, gauge amount) is added.
"""
import argparse
import csv
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlsplit

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from move_check import Resolver, load_confirmed_aliases, master_key, step_core  # noqa: E402
from sf6dna_step_matcher_v1 import Matcher  # noqa: E402  shared ①② matching spec v1 (STEP_MATCHING_SPEC_V1)
from sf6dna_step_matcher_v1_1 import Matcher as MatcherV11  # noqa: E402  spec v1.1 (kept separate from v1)
from page_text import arrow_chains  # noqa: E402
from source_match import split_steps  # noqa: E402

VERDICT_LABEL = {"ADOPT": "採用候補", "VARIANT": "派生として統合推奨", "DUPLICATE": "重複", "CHECK": "要確認",
                 "EXCLUDE": "除外候補"}
COUNTER_MARK = re.compile(r"（(PC|CH)）|PC|パニッシュ|パニカン")
SA_MARK = re.compile(r"^(?:\[[^\]]*\])?(SA[123]|CA)\b")
RUSH_MARK = re.compile(r"ラッシュ")
SYSTEM_START = ("前方ステップ", "後方ステップ")
# Characters whose 2026-10-13 fix impact the intake grading leaves unconfirmed (upstream keeps them at B).
PATCH_1013_ALL_MOVES = {"m-bison"}
PATCH_1013_MOVES = {"luke": {"luke:web:328"}, "chun-li": {"行雲流水"}}
TERMS = {"sf6-genten.com": "キュレーションサイト。記事の著作権は元の発信者、無断複製・再配布禁止（利用規約）",
         "sf6-lab.net": "運営者作成の文章の無断転載・大量複製・自動収集による再配布はご遠慮、引用は明示とリンク（免責事項）",
         "acqua-souken.com": "動画・配信の要約サイト。明示の禁止事項なし（about）"}


def step_keys(slug, card, review, resolver):
    tokens = split_steps(card["commandJapanese"])
    ids = []
    if review and review.get("management_ids"):
        raw = [i.strip() for i in review["management_ids"].split(" > ")]
        if len(raw) == len(tokens):
            ids = [master_key(i) if i else None for i in raw]
    if not ids:
        ids = [resolver.resolve(slug, t) for t in tokens]
    keys = []
    for token, key in zip(tokens, ids):
        keys.append("@" + key if key else "~" + step_core(token))
    marker = "PC" if tokens and COUNTER_MARK.search(tokens[0]) else ""
    return tuple(keys), marker, tokens


RUSH_ONLY = re.compile(r"^(?:パリィ|キャンセル|生)?(?:ドライブ)?ラッシュ$|^c?dr$|^cラッシュ$")
RUSH_LEAD = re.compile(r"^(?:パリィ|キャンセル|生)?(?:ドライブ)?ラッシュ\s*|^C?DR\s+|^Cラッシュ\s*", re.IGNORECASE)
PRE_PATCH_STATEMENT = re.compile(r"調整前|変更前|修正前|旧仕様")
UNIDENTIFIED = re.compile(r"特定できていない|特定できない|不明")
# Action conditions from the common vocabulary (技ではなく行動条件): must survive into the card's condition.
ACTION_CONDITIONS = {"空振り": "WHIFF", "持続重ね": "MEATY", "持続当て": "MEATY", "持続": "MEATY", "重ね": "OKI_OVERLAP",
                     "仕込み": "BUFFER", "最速": "FASTEST", "中段": "OVERHEAD_NOTE"}
FRAGMENT_TAIL = re.compile(r"から入れる|という形|が挙げられ|を挙げ")


def split_rush(step):
    """('RUSH', rest) for a rush step or rush-led step; notes in brackets never count as a rush."""
    plain = re.sub(r"[（(][^）)]*[）)]", "", step).strip()
    if RUSH_ONLY.match(step_core(plain)) or step_core(plain) in ("キャンセルドライブラッシュ", "パリィドライブラッシュ"):
        return True, ""
    rest = RUSH_LEAD.sub("", plain)
    return rest != plain, rest


def recheck_against_clause(card, rec, span, resolver):
    """Re-extract the clause and compare step by step. Returns a reason when the card misrepresents it."""
    if PRE_PATCH_STATEMENT.search(span):
        return "SOURCE_CLAUSE_DESCRIBES_PRE_PATCH_STATE"
    if UNIDENTIFIED.search(span):
        return "SOURCE_CLAUSE_HAS_UNIDENTIFIED_STEP"
    slug = card["characterSlug"]
    tokens = rec["tokens"]
    found = None
    for chain in arrow_chains(span):
        raw = chain["steps"]
        if len(raw) != len(tokens):
            continue
        moves_ok = rush_ok = True
        for r, t, key in zip(raw, tokens, rec["keys"]):
            r_rush, r_rest = split_rush(r)
            t_rush, t_rest = split_rush(re.sub(r"（(PC|CH)）", "", t))
            rush_ok &= r_rush == t_rush
            if r_rest or t_rest:
                same = step_core(r_rest) == step_core(t_rest) or (
                    key.startswith("@") and resolver.resolve(slug, r_rest or r) == key[1:])
                moves_ok &= bool(same)
        if moves_ok and rush_ok:
            return None
        found = found or ("MISEXTRACTION_SYSTEM_ACTION_DROPPED" if moves_ok else "RE_EXTRACTION_DIFFERS_FROM_CARD")
    return found or "RE_EXTRACTION_DIFFERS_FROM_CARD"


def contiguous(short, long):
    return len(short) < len(long) and any(long[i:i + len(short)] == short for i in range(len(long) - len(short) + 1))


def gauge(tokens):
    od = sum(1 for t in tokens if re.match(r"^OD\s", t) or " OD " in f" {t} ")
    rush = sum(1 for t in tokens if RUSH_MARK.search(t))
    impact = sum(1 for t in tokens if "ドライブインパクト" in t)
    sa = sorted({m.group(1) for t in tokens for m in [SA_MARK.match(t.replace("（PC）", ""))] if m})
    return od, rush, impact, sa


def proposed_text(card, tokens, heading, od, rush, impact, sa, position, marker):
    plain = [re.sub(r"（(PC|CH)）", "", t) for t in tokens]
    start, end = plain[0], plain[-1]
    lead = {"PC": "パニッシュカウンター時の", "CH": "カウンターヒット時の"}.get(marker, "パニッシュカウンター時の" if marker else "")
    kind = {"combo": "コンボ", "setplay": "セットプレイ", "pressure": "連携", "counter": "反撃"}[card["category"]]
    title = f"{lead}{start}始動・{end}締め" if card["category"] in ("combo", "counter") else f"{start}からの{kind}（{end}）"
    parts = [f"{start}から{len(tokens)}手で{end}までつなぐ{kind}。"]
    if marker == "CH":
        parts.append("始動技がカウンターヒットしたときの手順。")
    elif marker:
        parts.append("始動技がパニッシュカウンターで当たったときの手順。")
    if position != "指定なし":
        parts.append(f"{position}での手順。")
    resources = []
    if od:
        resources.append(f"OD技{od}回")
    if rush:
        resources.append("ドライブラッシュ")
    if impact:
        resources.append("ドライブインパクト")
    if resources:
        parts.append("ドライブゲージを使う要素: " + "、".join(resources) + "。")
    if sa:
        parts.append("SAゲージを使う技: " + "、".join(sa) + "。")
    # Frame / damage figures quoted in the source heading are not verified: keep them out of the description.
    clean = re.sub(r"[+＋\-−]?\d[\d,，]*\s*(?:F|ｆ|f)(?![A-Za-z])|[+＋\-−]\d+|\d{1,2},\d{3}", "", heading)
    clean = re.sub(r"[（(]\s*[）)]", "", re.sub(r"\s{2,}", " ", clean)).strip(" ・/／")
    if clean:
        parts.append(f"資料の見出し「{clean}」の手順。")
    parts.append("ダメージ・有利フレームは未確認のため記載していない。")
    return title, "".join(parts)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--displayed", type=Path, required=True, help="strategy-research-cards-20261118.json (384)")
    parser.add_argument("--local", type=Path, required=True, help="ws5-local-reviewed-strategy-cards.json")
    parser.add_argument("--base-local-count", type=int, required=True, help="Local cards that belong to the 628 set")
    parser.add_argument("--reviews", type=Path, required=True)
    parser.add_argument("--master", type=Path, required=True)
    parser.add_argument("--aliases", type=Path)
    parser.add_argument("--bulk-rows", type=Path, nargs="+", required=True, help="BULK_RESULT_ROWS.json with batch ids")
    parser.add_argument("--span-audit", type=Path, nargs="*", default=[], help="Local-only span files (not exported)")
    parser.add_argument("--matcher-version", choices=("1.0", "1.1"), default="1.0",
                        help="Step matching spec: 1.0 (STEP_MATCHING_SPEC_V1) or 1.1 (V1.1, separates CH from PC)")
    parser.add_argument("--same-label-pairs", type=Path, help="TXT_SAME_LABEL_PAIRS csv (spec 1.1 duplicate listings)")
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    displayed = json.loads(args.displayed.read_text(encoding="utf-8"))
    local = json.loads(args.local.read_text(encoding="utf-8"))
    reviews = json.loads(args.reviews.read_text(encoding="utf-8"))
    master = json.loads(args.master.read_text(encoding="utf-8"))
    aliases = load_confirmed_aliases(args.aliases, master) if args.aliases else {}
    resolver = Resolver(master, aliases)
    alias_rows = list(csv.DictReader(args.aliases.open(encoding="utf-8-sig"))) if args.aliases else []
    matcher = (MatcherV11(master, alias_rows, str(args.same_label_pairs) if args.same_label_pairs else None)
               if args.matcher_version == "1.1" else Matcher(master, alias_rows))
    batch_by_pid = {}
    for path in args.bulk_rows:
        for row in json.loads(path.read_text(encoding="utf-8")):
            batch_by_pid.setdefault(row["provisional_id"], row["batch_id"])
    spans = {}
    for path in args.span_audit:
        for item in json.loads(path.read_text(encoding="utf-8")):
            spans.setdefault(item["batch_id"], item["_span"])
    import hashlib
    card_ids = {c["id"] for c in local}
    # Card id is sha256(f"{slug}:{pid}")[:16]; build the reverse map from local cards.
    by_slug_pid = {}
    for pid in reviews:
        for slug in set(c["characterSlug"] for c in local):
            by_slug_pid["local-review:" + hashlib.sha256(f"{slug}:{pid}".encode()).hexdigest()[:16]] = pid
    pid_by_card = {cid: by_slug_pid[cid] for cid in card_ids if cid in by_slug_pid}

    records = []
    for index, card in enumerate(displayed + local):
        is_displayed = index < len(displayed)
        local_index = index - len(displayed)
        group = "BASE628" if is_displayed or local_index < args.base_local_count else "NEW1238"
        pid = pid_by_card.get(card["id"])
        review = reviews.get(pid) if pid else None
        batch = batch_by_pid.get(pid, "") if pid else ""
        origin = ("DISPLAYED384" if is_displayed else "AUTO_EXTRACT" if batch.startswith("PG-")
                  else "LOCAL_REVIEWED")
        slug = card["characterSlug"]
        keys, marker, tokens = step_keys(slug, card, review, resolver)
        if args.matcher_version == "1.1":
            first = matcher.card(slug, card["commandJapanese"])[1][:1]
            tags = first[0][1]["tags"] if first else []
            marker = "PC" if "PUNISH_COUNTER" in tags else "CH" if "COUNTER_HIT" in tags else ""
        records.append({"card": card, "group": group, "origin": origin, "pid": pid or "", "batch": batch,
                        "review": review, "keys": keys, "marker": marker, "tokens": tokens, "order": index,
                        "reasons": [], "verdict": None, "representative": ""})

    # Duplicates: same character, same move sequence and counter start (category-agnostic).
    first_seen = {}
    for rec in records:
        identity = (rec["card"]["characterSlug"], rec["keys"], rec["marker"])
        if identity in first_seen:
            rec["verdict"] = "DUPLICATE"
            rec["representative"] = first_seen[identity]["card"]["id"]
            rec["reasons"].append("SAME_MOVES_AS_EARLIER_CARD")
        else:
            first_seen[identity] = rec

    # Re-extract each auto-extracted card from its source clause (local span file) and compare IDs.
    for rec in records:
        card = rec["card"]
        tokens = rec["tokens"]
        heading = (rec["review"] or {}).get("sourceLocator", card.get("caution") or "")
        span = spans.get(rec["batch"], "")
        rec["spanChecked"] = bool(span)
        if rec["origin"] == "AUTO_EXTRACT" and span:
            verdict = recheck_against_clause(card, rec, span, resolver)
            if verdict:
                rec["reasons"].append(verdict)
                rec["verdict"] = rec["verdict"] or "EXCLUDE"
    # Variant relations are direct (never transitive): a sub-route points to the longest card containing
    # it; same-length routes differing only in the starter (or only in the ender) form one class each.
    by_slug = defaultdict(list)
    for rec in records:
        if rec["verdict"] is None:
            by_slug[rec["card"]["characterSlug"]].append(rec)

    def preference(r):
        return (r["group"] != "BASE628", -len(r["keys"]), r["order"])

    for slug, items in by_slug.items():
        for rec in items:
            if rec["group"] != "NEW1238" or rec["verdict"] is not None or len(rec["keys"]) < 2:
                continue
            containers = [o for o in items if o is not rec and o["verdict"] != "EXCLUDE" and contiguous(rec["keys"], o["keys"])]
            if containers:
                rep = sorted(containers, key=preference)[0]
                rec.update(verdict="VARIANT", representative=rep["card"]["id"], family=rep["card"]["id"])
                rec["reasons"].append("SUB_ROUTE_OF")
        for label, part in (("SAME_ROUTE_EXCEPT_STARTER", lambda k: ("S",) + k[1:]),
                            ("SAME_ROUTE_EXCEPT_ENDER", lambda k: ("E",) + k[:-1])):
            classes = defaultdict(list)
            for rec in items:
                if rec["verdict"] is None and len(rec["keys"]) >= 3:
                    classes[(part(rec["keys"]), rec["marker"])].append(rec)
            for members in classes.values():
                if len(members) < 2:
                    continue
                rep = sorted(members, key=preference)[0]
                for rec in members:
                    rec.setdefault("family", rep["card"]["id"])
                    if rec is not rep and rec["group"] == "NEW1238":
                        rec.update(verdict="VARIANT", representative=rep["card"]["id"], family=rep["card"]["id"])
                        rec["reasons"].append(label)

    for rec in records:
        card = rec["card"]
        tokens = rec["tokens"]
        od, rush, impact, sa = gauge(tokens)
        rec.update(od=od, rush=rush, impact=impact, sa=",".join(sa))
        position = card.get("position", "指定なし")
        heading_text = re.sub(r"^出典「|」.*$", "", card.get("caution") or "")
        rec["proposedTitle"], rec["proposedDescription"] = proposed_text(
            card, tokens, heading_text, od, rush, impact, sa, position, rec["marker"])
        host = urlsplit(card.get("sourceUrl") or "").hostname or ""
        rec["host"] = host
        rec["terms"] = TERMS.get(host.replace("www.", ""), "未審査")

        checks = []
        slug = card["characterSlug"]
        verdict_v1, step_results = matcher.card(slug, card["commandJapanese"])
        unresolved = [step for step, result in step_results if result["kind"] == "HOLD"]
        rec["unresolvedSteps"] = unresolved
        rec["matchVerdict"] = verdict_v1
        if verdict_v1 == "COUNTER_TARGET_ONLY":
            rec["reasons"].append("COUNTER_TARGET_ONLY")  # 相手の技のみ: 対策対象として管理（技照合の対象外）
        if unresolved and rec["origin"] != "DISPLAYED384":  # flagged whether or not the notice was corrected
            checks.append("MOVE_REFERENCE_UNRESOLVED")
        move_keys = {k[1:] for k in rec["keys"] if k.startswith("@")}
        if rec["group"] == "NEW1238":
            if slug in PATCH_1013_ALL_MOVES:
                checks.append("PATCH_20261013_IMPACT_UNCONFIRMED_CHARACTER")
            elif move_keys & PATCH_1013_MOVES.get(slug, set()) or any(
                    name in card["commandJapanese"] for name in PATCH_1013_MOVES.get(slug, set())):
                checks.append("PATCH_20261013_FIX_TARGET_MOVE")
            if card["category"] == "combo" and len(tokens) == 2 and not any(
                    master.get(k, {}).get("raw", {}).get("type") in ("SPECIAL", "SUPER") for k in move_keys):
                checks.append("LOW_VALUE_TWO_STEP_NORMAL_LINK")
            if card["category"] == "combo" and tokens[0].startswith(SYSTEM_START):
                checks.append("COMBO_STARTS_WITH_MOVEMENT_CATEGORY_CHECK")
            super_positions = [i for i, t in enumerate(tokens) if SA_MARK.match(re.sub(r"（(PC|CH)）", "", t))]
            if card["category"] == "combo" and super_positions and super_positions[0] < len(tokens) - 1:
                checks.append("SUPER_ART_BEFORE_END_CHECK_CONTINUATION")
            if "ドライブインパクト" in tokens[0] and position == "指定なし" and not rec["marker"] \
                    and "壁" not in card["commandJapanese"] + (card.get("condition") or ""):
                checks.append("DRIVE_IMPACT_START_CONDITION_UNSTATED")
            clause = spans.get(rec["batch"], "")
            if rec["spanChecked"] and FRAGMENT_TAIL.search(clause):
                checks.append("SOURCE_CLAUSE_READS_AS_FRAGMENT")
            if rec["spanChecked"] and re.search(r"[＞>]", clause) and re.search(r"(?<![↓↙←↘↗↑↖→])\s→\s(?![↓↙←↘↗↑↖→])", clause):
                checks.append("MIXED_SEPARATORS_ROUTE_MAY_CONTINUE")
            notes = " ".join(re.findall(r"[（(]([^（）()]+)[）)]", clause))
            lost = sorted({tag for word, tag in ACTION_CONDITIONS.items() if word in notes
                           and word not in (card.get("condition") or "") + card["commandJapanese"]})
            if rec["spanChecked"] and lost:
                checks.append("ACTION_CONDITION_NOT_CARRIED:" + "+".join(lost))
            if not rec["spanChecked"] and rec["origin"] == "AUTO_EXTRACT":
                checks.append("SOURCE_CLAUSE_NOT_AVAILABLE_FOR_RECHECK")
        rec["reasons"] += checks
        if rec["verdict"] is None:
            rec["verdict"] = "CHECK" if checks else "ADOPT"
        notice = card.get("commandNotice") or ""
        rec["proposedCommandNotice"] = (
            f"一部の手順は技IDを特定できていない（{'、'.join(unresolved)}）。現行Patchの成立は未検証。"
            if unresolved and "照合済み" in notice else notice)

    # Title duplicates (current titles) and the proposed replacement's uniqueness per character.
    current = Counter((r["card"]["characterSlug"], r["card"]["title"]) for r in records)
    proposed = defaultdict(list)
    for rec in records:
        rec["currentTitleDuplicates"] = current[(rec["card"]["characterSlug"], rec["card"]["title"])] - 1
        proposed[(rec["card"]["characterSlug"], rec["proposedTitle"])].append(rec)
    for (_, title), items in proposed.items():
        if len(items) > 1:
            for n, rec in enumerate(sorted(items, key=lambda r: r["order"]), start=1):
                middle = [re.sub(r"（(PC|CH)）", "", t) for t in rec["tokens"][1:-1]]
                hint = f"・{middle[0]}経由" if middle else ""
                rec["proposedTitle"] = f"{title}{hint}（ルート{n}）" if len(items) > 1 else title

    fields = ["card_id", "group", "origin", "characterSlug", "category", "verdict", "verdict_label", "reasons",
              "representative", "family", "title", "currentTitleDuplicates", "proposedTitle", "proposedDescription",
              "commandJapanese", "steps", "counterStart", "position", "od", "rush", "impact", "sa", "condition",
              "sourceUrl", "host", "terms", "spanChecked", "provisionalId", "batchId", "unresolvedSteps",
              "commandNotice", "proposedCommandNotice", "matchVerdict"]
    rows = []
    for rec in records:
        card = rec["card"]
        rows.append({"card_id": card["id"], "group": rec["group"], "origin": rec["origin"],
                     "characterSlug": card["characterSlug"], "category": card["category"], "verdict": rec["verdict"],
                     "verdict_label": VERDICT_LABEL[rec["verdict"]], "reasons": " ".join(rec["reasons"]),
                     "representative": rec["representative"], "family": rec.get("family", ""),
                     "title": card["title"], "currentTitleDuplicates": rec["currentTitleDuplicates"],
                     "proposedTitle": rec["proposedTitle"], "proposedDescription": rec["proposedDescription"],
                     "commandJapanese": card["commandJapanese"], "steps": len(rec["tokens"]),
                     "counterStart": rec["marker"], "position": card.get("position", ""), "od": rec["od"],
                     "rush": rec["rush"], "impact": rec["impact"], "sa": rec["sa"], "condition": card.get("condition") or "",
                     "sourceUrl": card.get("sourceUrl", ""), "host": rec["host"], "terms": rec["terms"],
                     "spanChecked": rec["spanChecked"], "provisionalId": rec["pid"], "batchId": rec["batch"],
                     "unresolvedSteps": " / ".join(rec.get("unresolvedSteps", [])),
                     "commandNotice": card.get("commandNotice") or "", "proposedCommandNotice": rec["proposedCommandNotice"],
                     "matchVerdict": rec.get("matchVerdict", "")})
    with (args.out / "CARD_AUDIT_1866.csv").open("w", encoding="utf-8-sig", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    (args.out / "CARD_AUDIT_1866.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")

    # Parent-link candidates for variants: compare starter, ender, position, counter start, gauge, condition.
    by_id = {r["card_id"]: r for r in rows}
    links = []
    for child in rows:
        if child["verdict"] != "VARIANT":
            continue
        parent = by_id[child["representative"]]
        c_steps, p_steps = child["commandJapanese"].split(" → "), parent["commandJapanese"].split(" → ")
        diff = {
            "starterDiffers": c_steps[0] != p_steps[0], "enderDiffers": c_steps[-1] != p_steps[-1],
            "positionDiffers": child["position"] != parent["position"],
            "counterStartDiffers": child["counterStart"] != parent["counterStart"],
            "gaugeDiffers": (child["od"], child["rush"], child["impact"], child["sa"]) != (parent["od"], parent["rush"], parent["impact"], parent["sa"]),
            "conditionDiffers": child["condition"] != parent["condition"],
        }
        # A different situation (position / PC start) or a different resource cost is a real alternative to keep linked.
        keep = diff["positionDiffers"] or diff["counterStartDiffers"] or diff["gaugeDiffers"]
        links.append({"child": child["card_id"], "parent": parent["card_id"], "characterSlug": child["characterSlug"],
                      "relation": child["reasons"].split()[0], "childSteps": child["commandJapanese"],
                      "parentSteps": parent["commandJapanese"], "parentVerdict": parent["verdict_label"],
                      **{k: v for k, v in diff.items()},
                      "childGauge": f"OD{child['od']} R{child['rush']} DI{child['impact']} {child['sa']}".strip(),
                      "parentGauge": f"OD{parent['od']} R{parent['rush']} DI{parent['impact']} {parent['sa']}".strip(),
                      "recommendation": "KEEP_LINKED_ALTERNATIVE（親に紐づく別ルートとして保持）" if keep
                      else "MERGE_INTO_PARENT（親カードの補足ルートとして統合）"})
    with (args.out / "VARIANT_PARENT_LINKS.csv").open("w", encoding="utf-8-sig", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=list(links[0]) if links else ["child"])
        writer.writeheader()
        writer.writerows(links)

    slugs = sorted({r["characterSlug"] for r in rows})
    with (args.out / "CARD_COUNTS_32x4.csv").open("w", encoding="utf-8-sig", newline="") as target:
        writer = csv.writer(target)
        cats = ["combo", "setplay", "pressure", "counter"]
        writer.writerow(["characterSlug"] + [f"{c}_{k}" for c in cats for k in ("base628", "new1238", "total", "adoptAfterAudit")]
                        + ["combo_adopt_ge30"])
        for slug in slugs:
            line = [slug]
            for c in cats:
                sel = [r for r in rows if r["characterSlug"] == slug and r["category"] == c]
                adopt = sum(1 for r in sel if r["verdict"] == "ADOPT")
                line += [sum(r["group"] == "BASE628" for r in sel), sum(r["group"] == "NEW1238" for r in sel), len(sel), adopt]
            line.append(line[4] >= 30)
            writer.writerow(line)
    summary = {
        "cards": len(rows), "byGroup": dict(Counter(r["group"] for r in rows)),
        "verdictByGroup": {g: dict(Counter(r["verdict_label"] for r in rows if r["group"] == g)) for g in ("BASE628", "NEW1238")},
        "verdictByOriginNew": {o: dict(Counter(r["verdict_label"] for r in rows if r["group"] == "NEW1238" and r["origin"] == o))
                               for o in ("AUTO_EXTRACT", "LOCAL_REVIEWED")},
        "reasonCountsNew": dict(Counter(x for r in rows if r["group"] == "NEW1238" for x in r["reasons"].split()).most_common()),
        "independentPractical": {
            "base628_adopt": sum(1 for r in rows if r["group"] == "BASE628" and r["verdict"] == "ADOPT"),
            "new1238_adopt": sum(1 for r in rows if r["group"] == "NEW1238" and r["verdict"] == "ADOPT"),
        },
        "currentTitleDuplicateCardsNew": sum(1 for r in rows if r["group"] == "NEW1238" and r["currentTitleDuplicates"] > 0),
        "proposedTitleDuplicates": sum(v - 1 for v in Counter((r["characterSlug"], r["proposedTitle"]) for r in rows).values() if v > 1),
        "sourceHostsNew": dict(Counter(r["host"] for r in rows if r["group"] == "NEW1238")),
        "mBisonNew": {"total": sum(1 for r in rows if r["group"] == "NEW1238" and r["characterSlug"] == "m-bison"),
                      "verdicts": dict(Counter(r["verdict_label"] for r in rows if r["group"] == "NEW1238" and r["characterSlug"] == "m-bison"))},
        "variantRecommendations": dict(Counter(l["recommendation"].split("（")[0] for l in links)),
        "matcherVersion": args.matcher_version,
        "matchVerdictLocal": dict(Counter(r["matchVerdict"] for r in rows if r["origin"] != "DISPLAYED384")),
        "moveReferenceUnresolvedLocalCards": sum(1 for r in rows if r["origin"] != "DISPLAYED384" and r["unresolvedSteps"]),
        "moveReferenceUnresolvedDisplayed384": sum(1 for r in rows if r["origin"] == "DISPLAYED384" and r["unresolvedSteps"]),
        "unresolvedByVerdict": dict(Counter(r["verdict_label"] for r in rows if r["origin"] != "DISPLAYED384" and r["unresolvedSteps"])),
        "familiesWithNewMembers": len({r["family"] for r in rows if r["family"] and r["group"] == "NEW1238"}),
        "variantRepresentatives": dict(Counter(next((x["verdict_label"] for x in rows if x["card_id"] == rep), "?")
                                              for rep in {r["representative"] for r in rows if r["verdict"] == "VARIANT"})),
    }
    summary["independentPractical"]["total"] = sum(summary["independentPractical"].values())
    (args.out / "CARD_AUDIT_SUMMARY.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
