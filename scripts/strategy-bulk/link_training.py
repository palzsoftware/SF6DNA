"""Build the practice-candidate link ledger (281 managed / valid subset) against local strategy cards.

Links are by provisional ID (the reviewed card made from the same intake row) or, failing that,
by identical route (same character, category and normalised steps through generate's route()).
Publication stays PENDING; nothing here approves or displays a candidate.
"""
import argparse
import sys
import hashlib
import importlib.util
import json
from collections import Counter
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


GENERATE = load("generate_local_strategy_cards", REPO / "scripts/generate-local-strategy-cards.py")
sys.path.insert(0, str(Path(__file__).resolve().parent))
from move_check import Resolver, load_confirmed_aliases  # noqa: E402
from source_match import split_steps  # noqa: E402


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--candidates", type=Path, required=True)
    parser.add_argument("--card-refs", type=Path, required=True)
    parser.add_argument("--cards", type=Path, nargs="+", required=True)
    parser.add_argument("--reviews", type=Path, required=True)
    parser.add_argument("--bulk-rows", type=Path, required=True, help="BULK_RESULT_ROWS.json (batch_id -> provisional_id)")
    parser.add_argument("--master", type=Path, help="Move master: enables linking by identical move-ID sequence")
    parser.add_argument("--aliases", type=Path)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    candidates = json.loads(args.candidates.read_text(encoding="utf-8"))["characters"]
    refs = json.loads(args.card_refs.read_text(encoding="utf-8"))["cards"]
    cards = [card for path in args.cards for card in json.loads(path.read_text(encoding="utf-8"))]
    reviews = json.loads(args.reviews.read_text(encoding="utf-8"))
    pid_by_batch = {}
    for row in json.loads(args.bulk_rows.read_text(encoding="utf-8")):
        pid_by_batch.setdefault(row["batch_id"], row["provisional_id"])
    resolver = None
    card_by_moves = {}
    if args.master:
        master = json.loads(args.master.read_text(encoding="utf-8"))
        resolver = Resolver(master, load_confirmed_aliases(args.aliases, master) if args.aliases else {})
        for c in cards:
            keys = [resolver.resolve(c["characterSlug"], s) for s in split_steps(c["commandJapanese"])]
            if all(keys):
                card_by_moves.setdefault((c["characterSlug"], tuple(keys)), c["id"])
    card_by_route = {GENERATE.route(c["characterSlug"], c["category"], c["commandJapanese"]): c["id"] for c in cards}
    links = []
    for slug, items in sorted(candidates.items()):
        for item in items:
            batch = item.get("strategyBatchId", "")
            ref = refs.get(batch, {})
            pid = pid_by_batch.get(batch, "")
            category = ref.get("category", "combo")
            route = GENERATE.route(slug, category, " → ".join(item["steps"]))
            if pid and pid in reviews:
                card_id = "local-review:" + hashlib.sha256(f"{slug}:{pid}".encode()).hexdigest()[:16]
                status, method = "LINK_LOCAL_CARD", "PROVISIONAL_ID"
            elif route in card_by_route:
                card_id, status, method = card_by_route[route], "LINK_LOCAL_CARD", "SAME_ROUTE"
            elif resolver and all(keys := [resolver.resolve(slug, s) for s in item["steps"]]) \
                    and (slug, tuple(keys)) in card_by_moves:
                # Same moves in the same order (each step uniquely resolved; no strength guessing).
                card_id, status, method = card_by_moves[(slug, tuple(keys))], "LINK_LOCAL_CARD", "SAME_MOVE_IDS"
            else:
                card_id, status, method = "", "LINK_PENDING_STRATEGY", ""
            # v4 candidateStatus (ACTIVE / PATCH_HOLD / EXCLUDED_DUPLICATE) wins; older files fall back to refs.
            status_v4 = item.get("candidateStatus")
            validity = ("VALID" if status_v4 == "ACTIVE" else status_v4) if status_v4 \
                else ("EXCLUDED_AFTER_DAY_REAGG" if ref.get("qualityAfterDayReagg") else "VALID")
            links.append({"id": item["id"], "slug": slug, "batchId": batch, "provisionalId": pid, "status": status,
                          "linkMethod": method, "cardId": card_id, "validity": validity,
                          "publication": item["publicationApproval"]})
    known = {c["id"] for c in cards}
    missing = [l["cardId"] for l in links if l["cardId"] and l["cardId"] not in known]
    if missing:
        raise ValueError(f"Linked card IDs not found: {missing[:3]}")
    if any(l["publication"] != "PENDING" for l in links):
        raise ValueError("Unexpected non-PENDING training candidate")
    args.out.write_text(json.dumps(links, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = {"managedTotal": len(links), "valid": sum(l["validity"] == "VALID" for l in links),
               "status": dict(Counter(l["status"] for l in links)),
               "validLinked": sum(l["validity"] == "VALID" and l["status"] == "LINK_LOCAL_CARD" for l in links),
               "linkMethod": dict(Counter(l["linkMethod"] for l in links if l["linkMethod"]))}
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
