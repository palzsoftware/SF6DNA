"""Bulk strategy intake: identity, duplicates, move IDs, source text, patch and conditions.

Read-only with respect to product data: it writes review artifacts to --out and never
changes existing cards, fixed management numbers, publication gates or the database.
Cards are produced only through scripts/generate-local-strategy-cards.py so the existing
card gate is applied unchanged.

Buckets (one per input row):
  READY      反映可能      all automatic checks passed; review entry drafted, card generated
  REVIEW     追加確認必要  evidence exists but a human decision is needed
  HOLD       HOLD          evidence missing (source not found, IDs missing, fetch failed, prior HOLD)
  DUPLICATE  重複除外      same identity, or same route as an existing / earlier card
"""
import argparse
import csv
import hashlib
import importlib.util
import io
import json
import re
import subprocess
import sys
import time
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
sys.path.insert(0, str(HERE))

from move_check import (SYSTEM_PREFIX, SYSTEM_STEPS, Resolver, auto_resolve, check_steps,  # noqa: E402
                        load_confirmed_aliases, management_id_for, step_core)
from page_text import extract_blocks, norm, page_dates  # noqa: E402
from source_cache import SourceCache  # noqa: E402
from source_match import match_row, paired_sequences, split_steps, token_forms  # noqa: E402

SYSTEM_NAMES = {"キャンセルドライブラッシュ", "パリィドライブラッシュ", "ドライブインパクト", "前方ステップ", "後方ステップ"}
# The only C grade that unique move resolution can lift: every other C/B reason stays as graded.
REGRADE_FROM = "C 要整備（技ID未特定の手順あり）"
REGRADE_TO = "A 自動再判定（技ID未特定→技マスター一意照合で全特定・要原文照合）"
PATCH_BASE_DATE = "2026-08-03"  # Balance adjustment that quality grade A is measured against.
BUCKET_LABELS = {"READY": "反映可能", "REVIEW": "追加確認必要", "HOLD": "HOLD", "DUPLICATE": "重複除外"}
REQUIRED_COLUMNS = ("character_slug", "category", "heading", "steps", "conditions_note", "source_url",
                    "page_updated", "quality")
POSITION_WORDS = (("画面端", "画面端"), ("端", "画面端"), ("画面中央", "画面中央"), ("中央", "画面中央"))


def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


RECONCILE = load_module("reconcile_strategy_intake", REPO / "scripts/reconcile-strategy-intake.py")
GENERATE = load_module("generate_local_strategy_cards", REPO / "scripts/generate-local-strategy-cards.py")


def read_rows(path):
    text = path.read_text(encoding="utf-8-sig")
    if path.suffix == ".json":
        data = json.loads(text)
        rows = data["rows"] if isinstance(data, dict) else data
    else:
        rows = list(csv.DictReader(io.StringIO(text, newline="")))
    for index, row in enumerate(rows):
        missing = [c for c in REQUIRED_COLUMNS if c not in row]
        if missing:
            raise ValueError(f"{path.name} row {index + 2}: missing columns {missing}")
        row.setdefault("management_ids", "")
        row.setdefault("duplicate", "なし")
        row.setdefault("game_qa", "NOT_RUN")
        row.setdefault("publication", "HOLD_NOT_APPROVED")
        row.setdefault("management_no", "")
    return rows


def sha256_file(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


class Stages:
    def __init__(self):
        self.records = []
        self.started = time.monotonic()

    def run(self, name, function, *args):
        started = time.monotonic()
        result = function(*args)
        self.records.append({"stage": name, "seconds": round(time.monotonic() - started, 3)})
        return result

    def count(self, name, **counts):
        self.records[-1].update({"stage": name, **counts}) if self.records and self.records[-1]["stage"] == name \
            else self.records.append({"stage": name, **counts})


def position_of(*texts):
    joined = " ".join(t for t in texts if t)
    for word, label in POSITION_WORDS:
        if word in joined:
            return label
    return "指定なし"


def patch_check(row, dates):
    quality = row["quality"]
    updated = row["page_updated"]
    reasons = []
    if "2026-10-13" in quality:
        reasons.append("PATCH_20261013_FIX_TARGET")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", updated or ""):
        reasons.append("PAGE_DATE_MISSING")
    elif updated < PATCH_BASE_DATE:
        reasons.append("PAGE_DATE_BEFORE_PATCH_BASE")
    if not quality.startswith("A "):
        reasons.append("QUALITY_NOT_A")
    newer = [d for d in dates if updated and re.fullmatch(r"\d{4}-\d{2}-\d{2}", updated) and d > updated]
    return {"status": "OK" if not reasons else "REVIEW", "reasons": reasons,
            "pageDates": dates[-3:], "pageUpdatedAfterCollection": bool(newer)}


def category_hint(heading):
    """Reference only for sorting page candidates; never used to classify input rows."""
    for pattern, hint in (("モダン", "MODERN_RECIPE"), ("有利フレーム|フレームの計算", "FRAME_TABLE"),
                          ("セットプレイ|起き攻め|詐欺", "setplay"), ("連携|連係|固め", "pressure"),
                          ("対策|確定反撃|反撃", "counter")):
        if re.search(pattern, heading):
            return hint
    return "combo"


CANDIDATE_ROW_FIELDS = ["batch_id", "management_no", "official_no", "character_slug", "category", "heading", "steps",
                        "conditions_note", "step_states", "management_ids", "unresolved_steps", "source_url",
                        "page_updated", "patch_basis", "duplicate", "quality", "evidence", "game_qa", "publication"]
CANDIDATE_QUALITY = "A 新規候補自動判定（同一出典ページから抽出・技ID全一意・資料日8/3以降・要原文照合）"
URL_CATEGORY = (("/category/okizeme-setplay", "setplay"), ("/category/matchup", "counter"), ("/category/combo", "combo"))
FIX_20261013_NAMES = ("行雲流水",)  # 2026-10-13 bug-fix target named in the D1 hand-off; kept out of auto intake.
SYSTEM_DISPLAY = {"キャンセルドライブラッシュ": "キャンセルドライブラッシュ", "パリィドライブラッシュ": "パリィドライブラッシュ",
                  "前方ステップ": "前方ステップ", "後方ステップ": "後方ステップ", "ドライブインパクト": "ドライブインパクト",
                  "dr": "ドライブラッシュ", "ドライブラッシュ": "ドライブラッシュ", "cdr": "キャンセルドライブラッシュ",
                  "ラッシュ": "ラッシュ", "生ラッシュ": "パリィドライブラッシュ"}
PREFIX_DISPLAY = {"cラッシュ": "キャンセルドライブラッシュ", "キャンセルラッシュ": "キャンセルドライブラッシュ",
                  "キャンセルドライブラッシュ": "キャンセルドライブラッシュ", "cdr": "キャンセルドライブラッシュ",
                  "dr": "ドライブラッシュ", "ドライブラッシュ": "ドライブラッシュ", "生ラッシュ": "パリィドライブラッシュ",
                  "ラッシュ": "ラッシュ"}
NEGATIVE_STATEMENT = re.compile(r"割り込まれ|できない|つながらない|繋がらない|届かない|当たらない|入らない|成立しない|確定しない"
                                r"|ではなく|不可|NG|ダメ|負ける|負けて|やめ|避け|変更前|旧仕様")
GENERIC_STEP = re.compile(r"追撃|各種|締め|〆|など|派生|任意|好きな|お好み")
NOTE_SKIP = re.compile(r"^(?:PC|CH|パニッシュカウンター|カウンター|[\d,，]+)$")


def name_confirmed_by_source(result, page):
    """Every step whose name differs resolves, on the original page, uniquely to the same master move."""
    match = result["_match"]
    if result["sourceMatch"] != "SEQUENCE_MATCH" or page is None or match.get("sequenceIndex") is None:
        return False
    forms = page["sequences"][match["sequenceIndex"]]["forms"]
    tokens = split_steps(result["steps"])
    if len(forms) != len(tokens):
        return False
    for detail in result.get("moveDetails", []):
        if detail["result"] in ("NAME_PARTIAL", "NAME_DIFFERS"):
            position = next((i for i, t in enumerate(tokens) if t == detail["step"]), None)
            if position is None or "@" + detail.get("masterKey", "") not in forms[position]:
                return False
    return True


def is_system_display(step):
    plain = re.sub(r"（[^）]*）$", "", step)
    return plain in set(SYSTEM_DISPLAY.values()) | {"前方ステップ", "後方ステップ", "ドライブパリィ", "ジャストパリィ"} \
        or plain.startswith(("ドライブパリィ", "ジャストパリィ"))


def master_display(record):
    """Official move name without the nickname in brackets ('立ち中P（鉤突き）' -> '立ち中P')."""
    name = re.sub(r"\s*[（(][^（）()]*[）)]\s*$", "", record["raw"].get("skill") or "").strip()
    return name or (record["raw"].get("skill") or "")


def candidate_row(slug, url, seq, resolved, page_updated, master):
    heading = " / ".join(seq["headingPath"][-2:])
    span = seq.get("span") or " > ".join(seq["steps"])
    url_category = next((c for marker, c in URL_CATEGORY if marker in url), None)
    hint = category_hint(" ".join(seq["headingPath"]))
    category = hint if hint in ("setplay", "pressure", "counter") else (url_category or hint)
    steps, notes = [], []
    for key, raw_step in zip(resolved, seq["steps"]):
        marker = ("（PC）" if re.search(r"PC|パニッシュ|パニカン", raw_step)
                  else "（CH）" if re.search(r"CH|カウンターヒット", raw_step) else "")
        core = step_core(raw_step)
        if key:
            prefix = SYSTEM_PREFIX.match(core)
            lead = (PREFIX_DISPLAY.get(prefix.group(0), prefix.group(0)) + " ") if prefix else ""
            display = lead + master_display(master[key])
        else:
            display = SYSTEM_DISPLAY.get(core, core)
        steps.append(display + marker)
        for note in re.findall(r"[（(]([^（）()]+)[）)]", raw_step):
            note = note.strip()
            if note and not NOTE_SKIP.match(note) and step_core(note) != step_core(master_display(master[key]) if key else core) \
                    and not re.search(r"[↓↙←↘→↗↑↖]|[1-9]{2,}", note) and len(note) <= 20:
                notes.append(f"{display}（{note}）")
    dated = re.findall(r"(20\d\d)年(\d{1,2})月", " ".join(seq["headingPath"]))
    if hint in ("FRAME_TABLE", "MODERN_RECIPE"):
        eligibility = f"EXCLUDED_{hint}"
    elif re.search(r"[\d,，]+\s*(?:本|件)", span) or re.search(r"各種|など|いずれか", span) \
            or any(GENERIC_STEP.search(step) for step in seq["steps"]):
        eligibility = "EXCLUDED_AGGREGATE_OR_GENERIC_STEP"
    elif all(is_system_display(step) for step in steps):
        eligibility = "EXCLUDED_MOVEMENT_ONLY"
    elif category == "combo" and (not resolved[-1] or is_system_display(steps[-1])):
        eligibility = "EXCLUDED_ROUTE_ENDS_WITH_SYSTEM_ACTION"
    elif re.search(r"[〜～]|を使って|場合$|伸ばした|で締める|締めの形", span) or seq.get("truncatedStart"):
        eligibility = "EXCLUDED_FRAGMENT_OR_CONTINUATION"
    elif seq.get("referencedInSentence"):
        eligibility = "EXCLUDED_ROUTE_REFERENCED_IN_SENTENCE"
    elif NEGATIVE_STATEMENT.search(span):
        eligibility = "EXCLUDED_NEGATIVE_OR_CAUTION_STATEMENT"
    elif any((int(y), int(m)) < (2026, 8) for y, m in re.findall(r"(20\d\d)年(\d{1,2})月", span)):
        eligibility = "EXCLUDED_CLAUSE_DATED_BEFORE_PATCH_BASE"
    elif any(name in s for s in steps for name in FIX_20261013_NAMES):
        eligibility = "EXCLUDED_PATCH_20261013_FIX_TARGET"
    elif dated and (int(dated[-1][0]), int(dated[-1][1])) < (2026, 8):
        eligibility = "EXCLUDED_SECTION_DATED_BEFORE_PATCH_BASE"
    elif not page_updated or page_updated < PATCH_BASE_DATE:
        eligibility = "EXCLUDED_PAGE_DATE_UNCONFIRMED"
    elif not category or category not in ("combo", "setplay", "pressure", "counter"):
        eligibility = "EXCLUDED_CATEGORY_UNKNOWN"
    else:
        eligibility = "ELIGIBLE_FOR_INTAKE"
    ids = [management_id_for(slug, k, master) if k else "" for k in resolved]
    position = position_of(heading, span)
    condition = f"資料見出し「{heading}」の手順。" + (f"状況: {seq['leadNote']}。" if seq.get("leadNote") else "") \
        + (f"位置: {position}。" if position != "指定なし" else "")
    if steps and "（PC）" in steps[0]:
        condition += "始動がパニッシュカウンター。"
    if notes:
        condition += "手順の注記: " + "、".join(notes) + "。"
    digest = hashlib.sha256(json.dumps([url, heading, steps], ensure_ascii=False).encode()).hexdigest()[:12]
    return {"batch_id": f"PG-{slug}-{digest}", "management_no": "", "official_no": "未採番",
            "character_slug": slug, "category": category, "heading": seq["headingPath"][-1] if seq["headingPath"] else "",
            "steps": " > ".join(steps), "conditions_note": condition,
            "step_states": " ".join(["RESOLVED"] * len(steps)), "management_ids": " > ".join(ids),
            "unresolved_steps": "", "source_url": url, "page_updated": page_updated,
            "patch_basis": f"同一URLの品質A行の資料日 {page_updated}", "duplicate": "なし",
            "quality": CANDIDATE_QUALITY, "evidence": "Claude Code一括処理: 出典ページから手順列を抽出し技マスターで全手一意解決",
            "game_qa": "NOT_RUN", "publication": "HOLD_NOT_APPROVED", "_eligibility": eligibility, "_span": span}


def title_for(steps):
    tokens = split_steps(steps)
    first, last = tokens[0], tokens[-1]
    return f"{first}から{last}" if len(tokens) > 1 else first


def display_steps(steps):
    return " → ".join(re.sub(r"屈(?=[弱中強])", "しゃがみ", t) for t in re.split(r"\s+>\s+|\s*→\s*", steps) if t.strip())


def draft_review(row, match, character_name, control_label):
    heading = match["headingPath"][-1] if match["headingPath"] else row["heading"]
    extracted = row.get("batch_id", "").startswith("PG-")
    condition = row["conditions_note"].strip() or f"資料見出し「{heading}」の状況。資料に追加条件の記載なし。"
    first_last = title_for(row["steps"])
    return {
        "source_url": row["source_url"], "page_updated": row["page_updated"], "steps": row["steps"],
        "management_ids": row["management_ids"], "characterName": character_name,
        "title": first_last, "displaySteps": display_steps(row["steps"]),
        "condition": condition,
        "description": (f"資料記載の手順（{len(split_steps(row['steps']))}手）。"
                        + ("ページ内の手順から自動抽出した下書きで、文面は確認待ち。" if extracted else "自動照合の下書きで、文面は確認待ち。")),
        "sourceLocator": f"出典「{heading}」（{'ページ内手順の自動抽出・技マスター照合' if extracted else '自動照合: 手順一致'}）。",
        "position": position_of(row["conditions_note"], row["heading"], heading),
        "controlLabel": control_label,
        "reviewMethod": "bulk-auto-draft",
    }


def generator_row(row, pid):
    tokens = re.split(r"→|\s+>\s+", row["steps"])
    return {**row, "management_no": "", "provisional_id": pid, "duplicate": "なし",
            "step_states": " ".join(["RESOLVED"] * len(tokens)), "unresolved_steps": ""}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--rows", type=Path, nargs="+", required=True, help="Intake CSV/JSON files")
    parser.add_argument("--cards", type=Path, nargs="+", required=True, help="Existing card JSON lists")
    parser.add_argument("--reviews", type=Path, required=True, help="Existing STRATEGY_SOURCE_REVIEWS.json")
    parser.add_argument("--registry", type=Path, required=True, help="FIXED_STRATEGY_REGISTRY_PRIVATE.json")
    parser.add_argument("--prior-status", type=Path, nargs="*", default=[],
                        help="CSV files with provisional_id,status from earlier human review, oldest first")
    parser.add_argument("--master", type=Path, required=True, help="Official move master JSON")
    parser.add_argument("--character-names", type=Path, required=True)
    parser.add_argument("--cache", type=Path, required=True)
    parser.add_argument("--offline", action="store_true", help="Use only cached pages")
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--aliases", type=Path, help="Confirmed alias CSV (only CONFIRM_CANDIDATE* rows are used)")
    parser.add_argument("--span-audit", type=Path, help="Local-only file for source clauses of page candidates")
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    stages = Stages()

    # 1. Load
    def load():
        rows = []
        for path in args.rows:
            for line, row in enumerate(read_rows(path), start=2):
                rows.append({**row, "_input": f"{path.name}:{line}"})
        cards = [card for path in args.cards for card in json.loads(path.read_text(encoding="utf-8"))]
        return (rows, cards, json.loads(args.reviews.read_text(encoding="utf-8")),
                json.loads(args.master.read_text(encoding="utf-8")),
                json.loads(args.character_names.read_text(encoding="utf-8")))
    rows, cards, reviews, master, names = stages.run("load", load)
    registry_sha = sha256_file(args.registry)
    cards_sha = {str(p): sha256_file(p) for p in args.cards}
    stages.count("load", inputRows=len(rows), existingCards=len(cards), existingReviews=len(reviews))

    prior = {}
    for path in args.prior_status:
        with path.open(encoding="utf-8-sig", newline="") as source:
            for item in csv.DictReader(source):
                prior.setdefault(item["provisional_id"], []).append(f"{path.stem}:{item['status']}")

    results = []
    by_pid = {}
    existing_routes = {GENERATE.route(c["characterSlug"], c["category"], c["commandJapanese"]): c["id"] for c in cards}
    # Reviewed rows carry the raw notation ("2強K") while cards show the display form ("しゃがみ強K"):
    # compare both, as the generator does when it rebuilds from the review manifest.
    for pid, review in reviews.items():
        slug = next((c["characterSlug"] for c in cards if c.get("sourceUrl") == review.get("source_url")), None)
        category = next((c["category"] for c in cards if c.get("caution") == review.get("sourceLocator")
                         and c.get("sourceUrl") == review.get("source_url")), None)
        if slug and category and review.get("steps"):
            existing_routes.setdefault(GENERATE.route(slug, category, review["steps"]), pid)

    # 2. Identity and prior decisions
    def identity():
        for row in rows:
            pid = RECONCILE.provisional_id(row)
            result = {"input": row["_input"], "batch_id": row.get("batch_id", ""), "provisional_id": pid,
                      "character_slug": row["character_slug"], "category": row["category"],
                      "source_url": row["source_url"], "page_updated": row["page_updated"],
                      "quality": row["quality"][:1], "steps": row["steps"], "reasons": [], "bucket": None}
            if pid in by_pid:
                result["bucket"] = "DUPLICATE"
                result["reasons"].append(f"SAME_PROVISIONAL_ID_AS:{by_pid[pid]['input']}")
            else:
                by_pid[pid] = result
            if pid in reviews:
                result["bucket"] = result["bucket"] or "DUPLICATE"
                result["reasons"].append("ALREADY_LOCAL_REVIEWED_CARD")
            result["priorStatus"] = prior.get(pid, [])
            results.append((row, result))
    stages.run("identity", identity)
    stages.count("identity", uniqueProvisionalIds=len(by_pid),
                 sameIdentityRows=sum(1 for _, r in results if any(x.startswith("SAME_PROVISIONAL") for x in r["reasons"])),
                 alreadyLocal=sum(1 for _, r in results if "ALREADY_LOCAL_REVIEWED_CARD" in r["reasons"]))

    # 3. Existing card route duplicates (same character, category and normalised command)
    def existing_dupes():
        for row, result in results:
            if row["steps"].strip():
                key = GENERATE.route(row["character_slug"], row["category"], row["steps"])
                if key in existing_routes:
                    result["existingCardId"] = existing_routes[key]
                    if result["bucket"] is None:
                        result["bucket"] = "DUPLICATE"
                    result["reasons"].append("SAME_ROUTE_AS_EXISTING_CARD")
    stages.run("existing_card_duplicates", existing_dupes)
    stages.count("existing_card_duplicates",
                 rows=sum(1 for _, r in results if "SAME_ROUTE_AS_EXISTING_CARD" in r["reasons"]))

    # 4. Move IDs against the move master (+ unique-match resolution of steps left unresolved)
    aliases = load_confirmed_aliases(args.aliases, master) if args.aliases else {}
    resolver = Resolver(master, aliases)
    stages.count("confirmed_aliases", aliases=len(aliases))

    def moves():
        counter = Counter()
        for row, result in results:
            status, details = check_steps(row["steps"], row["management_ids"], master, aliases)
            if status == "MISSING" and row["steps"].strip():
                filled = auto_resolve(row["character_slug"], row["steps"], resolver, master,
                                      lambda text: [t for t in re.split(r"\s+>\s+|\s*→\s*", text) if t.strip()])
                if filled is not None:
                    status, details = check_steps(row["steps"], filled, master, aliases)
                    if status == "OK":
                        result["autoResolvedIds"] = {"before": row["management_ids"], "after": filled}
                        row["management_ids"] = filled
                        row["step_states"] = " ".join(["RESOLVED"] * len(filled.split(" > ")))
                        row["unresolved_steps"] = ""
                        counter["AUTO_RESOLVED"] += 1
                        if row["quality"].startswith(REGRADE_FROM):
                            result["originalQuality"] = row["quality"]
                            row["quality"] = REGRADE_TO
                            result["quality"] = "A"
                            counter["REGRADED_C_TO_A"] += 1
            result["moveCheck"] = status
            result["moveDetails"] = [d for d in details if d["result"] not in ("NAME_MATCH",)]
            counter[status] += 1
        return counter
    stages.count("move_ids", **stages.run("move_ids", moves))

    # 5. Source pages (one request per URL, cached)
    cache = SourceCache(args.cache, offline=args.offline)
    pages, ledger = {}, []

    slug_for_url = defaultdict(Counter)
    for row, _ in results:
        slug_for_url[row["source_url"]][row["character_slug"]] += 1

    def fetch():
        for url in sorted({row["source_url"] for row, _ in results}):
            try:
                meta, body = cache.get(url)
            except ValueError:
                # Terms, robots.txt and network access of this site have not been reviewed: no request is made.
                meta, body = {"url": url, "status": "SITE_NOT_REVIEWED", "cacheHit": False}, None
            entry = {k: meta.get(k) for k in ("url", "status", "sha256", "bytes", "fetchedAt", "lastModified", "cacheHit")}
            if body is not None:
                parsed = extract_blocks(body)
                slug = slug_for_url[url].most_common(1)[0][0]
                pages[url] = {"blocks": parsed["blocks"], "slug": slug,
                              "sequences": paired_sequences(parsed["sequences"], slug, resolver),
                              "dates": page_dates(body), "title": parsed["title"]}
                entry.update(blocks=len(parsed["blocks"]), sequences=len(pages[url]["sequences"]))
            ledger.append(entry)
    stages.run("fetch_and_extract", fetch)
    stages.count("fetch_and_extract", urls=len(ledger), networkRequests=cache.network_requests,
                 cacheHits=sum(1 for e in ledger if e["cacheHit"]),
                 fetched=sum(1 for e in ledger if e["status"] == 200))

    # 6. Original text match
    def source():
        counter = Counter()
        for row, result in results:
            page = pages.get(row["source_url"])
            match = match_row(row, page) if page else {"level": "PAGE_UNAVAILABLE", "headingPath": [], "pageSteps": []}
            result["sourceMatch"] = match["level"]
            result["sourceLocator"] = " / ".join(match["headingPath"][-2:])
            result["_match"] = match
            counter[match["level"]] += 1
        return counter
    stages.count("source_match", **stages.run("source_match", source))

    # 7. Patch and conditions
    def patch_and_conditions():
        for row, result in results:
            page = pages.get(row["source_url"], {"dates": []})
            result["patch"] = patch_check(row, page["dates"])
            heading = result["_match"]["headingPath"][-1] if result["_match"]["headingPath"] else ""
            result["position"] = position_of(heading, row["heading"], row["conditions_note"])
            result["conditionSource"] = ("INPUT_CONDITION" if row["conditions_note"].strip()
                                         else "SOURCE_HEADING" if heading else "NONE")
            result["counterHit"] = bool(re.search(r"PC|パニッシュ|パニカン|CH|カウンター", row["steps"] + row["heading"]))
            result["modernMentioned"] = "モダン" in (row["heading"] + row["conditions_note"] + row["steps"])
    stages.run("patch_and_conditions", patch_and_conditions)
    stages.count("patch_and_conditions",
                 patchOk=sum(1 for _, r in results if r["patch"]["status"] == "OK"),
                 patchReview=sum(1 for _, r in results if r["patch"]["status"] != "OK"))

    # 8. Classification
    ready_routes = {}

    def classify():
        for row, result in results:
            reasons = result["reasons"]
            if result["bucket"] == "DUPLICATE":
                continue
            hold, review = [], []
            if result["sourceMatch"] == "PAGE_UNAVAILABLE":
                status = next((e["status"] for e in ledger if e["url"] == row["source_url"]), "")
                hold.append("SOURCE_SITE_NOT_REVIEWED" if status == "SITE_NOT_REVIEWED" else "SOURCE_PAGE_UNAVAILABLE")
            elif result["sourceMatch"] == "NOT_FOUND":
                hold.append("NOT_FOUND_IN_SOURCE_TEXT")
            if not row["steps"].strip():
                (review if result["sourceMatch"] == "TEXT_FOUND" else hold).append("TEXT_ONLY_NO_STEPS")
            elif result["moveCheck"] == "MISSING":
                hold.append("MOVE_ID_MISSING_OR_COUNT_MISMATCH")
            elif result["moveCheck"] == "REVIEW":
                if name_confirmed_by_source(result, pages.get(row["source_url"])):
                    reasons.append("MOVE_NAME_CONFIRMED_BY_SOURCE_STEP")
                else:
                    review.append("MOVE_NAME_NEEDS_CONFIRMATION")
            if row["steps"].strip() and len(split_steps(row["steps"])) < 2:
                review.append("SINGLE_STEP")
            page_steps = result["_match"].get("pageSteps") or []
            if result["sourceMatch"] == "SEQUENCE_MATCH" and any(
                    bool(SYSTEM_PREFIX.match(step_core(a))) != bool(SYSTEM_PREFIX.match(step_core(b)))
                    for a, b in zip(split_steps(row["steps"]), page_steps)):
                review.append("SYSTEM_ACTION_DIFFERS_FROM_SOURCE")
            counter_mark = re.compile(r"PC|ＰＣ|CH|ＣＨ|パニッシュ|パニカン|カウンター")
            if result["sourceMatch"] == "SEQUENCE_MATCH" and any(
                    bool(counter_mark.search(a)) != bool(counter_mark.search(b))
                    for a, b in zip(split_steps(row["steps"]), page_steps)):
                review.append("COUNTER_HIT_MARK_DIFFERS_FROM_SOURCE")
            if result["sourceMatch"] in ("SEQUENCE_PARTIAL", "SEQUENCE_SIMILAR", "TEXT_FOUND") and row["steps"].strip():
                review.append(f"SOURCE_{result['sourceMatch']}")
            review += [f"PATCH_{r}" for r in result["patch"]["reasons"]]
            if row["quality"].startswith("X"):
                result["bucket"] = "DUPLICATE"
                reasons.append(f"INPUT_REPORTED_DUPLICATE:{row.get('duplicate', '')}")
                continue
            if row.get("duplicate", "なし") not in ("なし", ""):
                review.append("REPORTED_DUPLICATE_IN_INPUT")
            if result.get("autoResolvedIds"):
                reasons.append("AUTO_RESOLVED_MOVE_IDS")
            if row.get("publication") != "HOLD_NOT_APPROVED" or row.get("game_qa") != "NOT_RUN":
                hold.append("PUBLICATION_OR_QA_STATE_UNEXPECTED")
            heading_position = position_of(" ".join(result["_match"].get("headingPath", [])[-2:]))
            input_position = position_of(row["conditions_note"], row["heading"])
            if "指定なし" not in (heading_position, input_position) and heading_position != input_position:
                review.append("POSITION_CONFLICT_INPUT_VS_SOURCE_HEADING")
            if result["modernMentioned"]:
                review.append("MODERN_CONTROL_MENTIONED")
            latest = result["priorStatus"][-1].split(":", 1)[1] if result["priorStatus"] else ""
            if latest == "HOLD_SOURCE_REVIEW" and result["sourceMatch"] == "SEQUENCE_MATCH":
                # The earlier hold waited only for the original-text check this run has now done.
                reasons.append("PRIOR_HOLD_SOURCE_REVIEW_RESOLVED_BY_SEQUENCE_MATCH")
            elif latest.startswith("HOLD_") and latest != "HOLD_DAY_REVIEW":
                hold.append(f"PRIOR_HUMAN_{latest}")
            elif "PENDING" in latest or latest.startswith("MATCH_EXISTING"):
                review.append(f"PRIOR_{latest}")
            elif latest == "LINK_EXISTING_CARD":
                result["bucket"] = "DUPLICATE"
                reasons.append("PRIOR_LINK_EXISTING_CARD")
                continue
            reasons += hold + review
            result["bucket"] = "HOLD" if hold else "REVIEW" if review else "READY"
            if result["bucket"] == "READY":
                key = GENERATE.route(row["character_slug"], row["category"], row["steps"])
                if key in ready_routes:
                    earlier = ready_routes[key]
                    same_condition = norm(earlier[0]["conditions_note"]) == norm(row["conditions_note"])
                    result["bucket"] = "DUPLICATE" if same_condition else "REVIEW"
                    reasons.append(("SAME_ROUTE_IN_BATCH_AS:" if same_condition
                                    else "SAME_ROUTE_DIFFERENT_CONDITION_AS:") + earlier[1]["input"])
                else:
                    ready_routes[key] = (row, result)
    stages.run("classify", classify)
    buckets = Counter(r["bucket"] for _, r in results)
    stages.count("classify", **buckets)

    # 9. Review drafts and cards through the existing generator
    drafts, generated = {}, []

    def cards_stage():
        for row, result in results:
            if result["bucket"] != "READY":
                continue
            slug = row["character_slug"]
            character = names.get(slug) or names.get(slug.replace("-", ""))
            name = character if isinstance(character, str) else (character or {}).get("nameJa") if character else None
            if not name:
                result["bucket"] = "REVIEW"
                result["reasons"].append("CHARACTER_NAME_NOT_IN_LOCAL_NAMES")
                continue
            drafts[result["provisional_id"]] = draft_review(row, result["_match"], name, "クラシック")
        batch_path = args.out / "BULK_READY_BATCH.csv"
        fields = sorted({k for row, r in results if r["provisional_id"] in drafts for k in row if not k.startswith("_")}
                        | {"management_no", "provisional_id", "step_states", "unresolved_steps", "duplicate"})
        with batch_path.open("w", encoding="utf-8", newline="") as target:
            writer = csv.DictWriter(target, fieldnames=fields, extrasaction="ignore")
            writer.writeheader()
            for row, r in results:
                if r["provisional_id"] in drafts and r["bucket"] == "READY":
                    writer.writerow(generator_row(row, r["provisional_id"]))
        drafts_path = args.out / "BULK_REVIEW_DRAFTS.json"
        drafts_path.write_text(json.dumps(drafts, ensure_ascii=False, indent=2), encoding="utf-8")
        baseline_path = args.out / "_baseline_cards.json"
        baseline_path.write_text(json.dumps(cards, ensure_ascii=False), encoding="utf-8")
        if drafts:
            completed = subprocess.run([sys.executable, "-I", str(REPO / "scripts/generate-local-strategy-cards.py"),
                                        str(baseline_path), str(drafts_path), str(batch_path)],
                                       capture_output=True, text=True, encoding="utf-8")
            if completed.returncode:
                raise RuntimeError("Existing card generator refused the batch:\n" + completed.stderr[-2000:])
            generated.extend(json.loads(completed.stdout))
        baseline_path.unlink()
    stages.run("drafts_and_cards", cards_stage)
    stages.count("drafts_and_cards", drafts=len(drafts), generatedCards=len(generated))

    # 10. New candidates on the same source pages (not in any input row nor existing card)
    new_candidates, candidate_rows = [], []
    page_dates_by_url = {}
    for row, result in results:
        updated = row["page_updated"]
        if row["quality"].startswith("A ") and re.fullmatch(r"\d{4}-\d{2}-\d{2}", updated or ""):
            page_dates_by_url[row["source_url"]] = max(page_dates_by_url.get(row["source_url"], ""), updated)

    def candidates():
        known = defaultdict(list)
        for row, _ in results:
            if row["steps"].strip():
                tokens = split_steps(row["steps"])
                ids = [i.strip() for i in row["management_ids"].split(" > ")]
                ids = ids if len(ids) == len(tokens) else [None] * len(tokens)
                known[row["source_url"]].append([token_forms(t, management_id=i) for t, i in zip(tokens, ids)])
        existing_by_url = defaultdict(list)
        for card in cards:
            for url in card.get("sourceUrls") or [card.get("sourceUrl")]:
                existing_by_url[url].append([token_forms(t, card["characterSlug"], resolver)
                                             for t in split_steps(card["commandJapanese"])])
        seen = set()
        for url, page in pages.items():
            slug = page["slug"]
            for seq in page["sequences"]:
                if len(seq["steps"]) < 2:
                    continue
                forms = seq["forms"]
                resolved = [next((f[1:] for f in form if f.startswith("@")), "") for form in forms]
                system = [not r and bool(SYSTEM_STEPS.match(step_core(step)) or step_core(step) in SYSTEM_NAMES)
                          for r, step in zip(resolved, seq["steps"])]
                # Only sequences whose every step is a uniquely resolved move or a system action.
                if not all(r or s for r, s in zip(resolved, system)) or not any(resolved):
                    continue
                covered = any(len(k) == len(forms) and all(a & b for a, b in zip(k, forms))
                              for k in known[url] + existing_by_url[url])
                key = (url, tuple(f"@{r}" if r else step_core(st) for r, st in zip(resolved, seq["steps"])))
                if covered or key in seen:
                    continue
                seen.add(key)
                candidate_rows.append(candidate_row(slug, url, seq, resolved, page_dates_by_url.get(url, ""), master))
                new_candidates.append({
                    "candidate_id": "page-candidate:" + hashlib.sha256(json.dumps(key, ensure_ascii=False).encode()).hexdigest()[:16],
                    "character_slug": slug, "source_url": url, "source_heading": " / ".join(seq["headingPath"][-2:]),
                    "steps": " > ".join(seq["steps"]), "step_count": len(seq["steps"]),
                    "master_ids": " > ".join(r if r else "SYSTEM" for r in resolved),
                    "kind": seq["kind"], "category_hint": category_hint(" ".join(seq["headingPath"])),
                    "status": candidate_rows[-1]["_eligibility"], "publication": "HOLD_NOT_APPROVED",
                })
    stages.run("new_page_candidates", candidates)
    stages.count("new_page_candidates", candidates=len(new_candidates),
                 urlsWithCandidates=len({c["source_url"] for c in new_candidates}),
                 **{f"eligibility_{k}": v for k, v in Counter(r["_eligibility"] for r in candidate_rows).items()})

    # 11. Integrity: inputs that must not change
    if sha256_file(args.registry) != registry_sha or any(sha256_file(p) != h for p, h in cards_sha.items()):
        raise RuntimeError("Registry or existing card file changed during the run")

    # Outputs
    columns = ["input", "batch_id", "provisional_id", "character_slug", "category", "quality", "originalQuality",
               "bucket", "bucket_label",
               "reasons", "sourceMatch", "sourceLocator", "moveCheck", "patch_status", "patch_reasons", "position",
               "conditionSource", "existingCardId", "priorStatus", "source_url", "page_updated", "steps"]
    with (args.out / "BULK_RESULT_ROWS.csv").open("w", encoding="utf-8-sig", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        for _, r in results:
            writer.writerow({**r, "bucket_label": BUCKET_LABELS[r["bucket"]], "reasons": " ".join(r["reasons"]),
                             "patch_status": r["patch"]["status"], "patch_reasons": " ".join(r["patch"]["reasons"]),
                             "priorStatus": " ".join(r["priorStatus"]), "existingCardId": r.get("existingCardId", "")})
    detail = [{k: v for k, v in r.items() if k != "_match"} | {"pageSteps": r["_match"].get("pageSteps", [])}
              for _, r in results]
    (args.out / "BULK_RESULT_ROWS.json").write_text(json.dumps(detail, ensure_ascii=False, indent=1), encoding="utf-8")
    (args.out / "BULK_NEW_CARDS.json").write_text(json.dumps(generated, ensure_ascii=False, indent=2), encoding="utf-8")
    with (args.out / "NEW_PAGE_CANDIDATES.csv").open("w", encoding="utf-8-sig", newline="") as target:
        fields = list(new_candidates[0]) if new_candidates else ["candidate_id"]
        writer = csv.DictWriter(target, fieldnames=fields)
        writer.writeheader()
        writer.writerows(new_candidates)
    eligible = [r for r in candidate_rows if r["_eligibility"] == "ELIGIBLE_FOR_INTAKE"]
    with (args.out / "PAGE_CANDIDATE_INTAKE_ROWS.csv").open("w", encoding="utf-8-sig", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=CANDIDATE_ROW_FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(eligible)
    if args.span_audit:
        # Local-only audit of the source clause each candidate came from; never part of hand-off files.
        args.span_audit.write_text(json.dumps([{k: r[k] for k in ("batch_id", "steps", "_span", "_eligibility")}
                                               for r in candidate_rows], ensure_ascii=False, indent=1), encoding="utf-8")
    with (args.out / "SOURCE_FETCH_LEDGER.csv").open("w", encoding="utf-8-sig", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=["url", "status", "sha256", "bytes", "fetchedAt", "lastModified",
                                                    "cacheHit", "blocks", "sequences"])
        writer.writeheader()
        writer.writerows(ledger)
    summary = {
        "inputs": {str(p): sha256_file(p) for p in args.rows},
        "registrySha256": registry_sha, "existingCardFiles": cards_sha,
        "buckets": {BUCKET_LABELS[k]: v for k, v in Counter(r["bucket"] for _, r in results).items()},
        "bucketsByQuality": {f"{q}:{BUCKET_LABELS[b]}": n for (q, b), n in
                             sorted(Counter((r["quality"], r["bucket"]) for _, r in results).items())},
        "reasonCounts": dict(Counter(x.split(":")[0] for _, r in results for x in r["reasons"]).most_common()),
        "stages": stages.records, "totalSeconds": round(time.monotonic() - stages.started, 3),
        "officialNumbersAssigned": 0, "publicationApproved": 0,
    }
    (args.out / "BULK_METRICS.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"buckets": summary["buckets"], "generatedCards": len(generated),
                      "newPageCandidates": len(new_candidates), "totalSeconds": summary["totalSeconds"]},
                     ensure_ascii=False))


if __name__ == "__main__":
    main()
