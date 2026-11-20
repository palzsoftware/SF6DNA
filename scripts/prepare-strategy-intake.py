"""Classify Claude strategy handoffs for local review without importing product data."""
import argparse
import csv
import json
from pathlib import Path
from collections import Counter
import re
import unicodedata

SLOTS = {"combo": "combo", "setplay": "setplay", "pressure": "sequence", "counter": "counter"}


def normalized(text):
    return re.sub(r"\s+", "", unicodedata.normalize("NFKC", text).casefold())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("registry", type=Path)
    parser.add_argument("shapes", type=Path)
    parser.add_argument("web_batches", type=Path, nargs="+")
    args = parser.parse_args()
    registry = json.loads(args.registry.read_text())["records"]
    numbers = {row["candidate_id"]: row["management_no"] for row in registry}
    known = set()
    seen_routes = set()
    output = []

    def add(namespace, candidate, number, character, category, title, steps, condition,
            source, patch, verification, publication, quality, reported_duplicate):
        identity = (namespace, number)
        if number and identity in known:
            raise ValueError(f"Missing or repeated management number: {identity}")
        if number:
            known.add(identity)
        slot = SLOTS.get(category)
        # Exact textual matches are hints. Different conditions or patches remain separate.
        route = (character, slot, normalized(steps), normalized(condition), normalized(patch))
        repeated = bool(route[2]) and route in seen_routes
        if route[2]:
            seen_routes.add(route)
        output.append({
            "namespace": namespace, "candidateId": candidate, "managementNo": number,
            "characterSlug": character, "slot": slot, "title": title, "commandText": steps,
            "condition": condition, "source": source, "patchEvidence": patch,
            "gameQA": verification, "sourcePublication": publication, "quality": quality,
            "reportedDuplicate": reported_duplicate, "sameTextRoute": repeated,
            "localListing": "HOLD", "publicationApproved": False,
            "reviewClass": ("overlap" if reported_duplicate or repeated else
                            "source-review" if isinstance(quality, str) and quality.startswith("A ")
                            else "content-review"),
        })

    for r in json.loads(args.shapes.read_text())["records"]:
        card = r["reference_card"]
        add("fixed", r["candidate_id"], numbers[r["candidate_id"]], r["character_slug"],
            r["category"], card["title"], card["commandJapanese"], card["condition"], r["source_trace"],
            str(r["target_patch"] or card["referenceVersion"]), r["game_qa"], r["publication"],
            r["quality"], r["overlap_defer"])

    for batch in args.web_batches:
        with batch.open(encoding="utf-8-sig", newline="") as source:
            for line, r in enumerate(csv.DictReader(source), start=2):
                add(batch.stem, f"line:{line}", r["management_no"], r["character_slug"], r["category"],
                    r["heading"], r["steps"], r["conditions_note"], r["source_url"], r["quality"],
                    r["game_qa"], r["publication"], r["quality"],
                    None if r["duplicate"] == "なし" else r["duplicate"])

    print(json.dumps({"rows": output, "slotCounts": Counter(r["slot"] for r in output),
                      "reportedOverlapRows": sum(bool(r["reportedDuplicate"]) for r in output),
                      "sameTextRouteRows": sum(r["sameTextRoute"] for r in output),
                      "reviewCounts": Counter(r["reviewClass"] for r in output)},
                     ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
