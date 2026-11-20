"""Reconcile provisional batches and write a read-only allocation proposal to stdout."""
import argparse
import csv
import hashlib
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path


def normalize(value):
    value = unicodedata.normalize("NFKC", value).casefold()
    value = value.replace(">", "→").replace("しゃがみ", "屈")
    return re.sub(r"\s+", "", value)


def route(row):
    return (row["character_slug"], row["category"], normalize(row["steps"]))


def provisional_id(row):
    identity = (*route(row), normalize(row["conditions_note"]), row["source_url"],
                row["page_updated"])
    return "provisional:" + hashlib.sha256(json.dumps(identity, ensure_ascii=False).encode()).hexdigest()


def read_csv(path):
    with path.open(encoding="utf-8-sig", newline="") as source:
        return list(csv.DictReader(source))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("registry", type=Path)
    parser.add_argument("provisional_batch", type=Path)
    parser.add_argument("numbered_batches", type=Path, nargs="+")
    parser.add_argument("--additional-batch", type=Path, action="append", default=[])
    parser.add_argument("--prior", type=Path, help="Prior reconciliation receipt")
    args = parser.parse_args()
    registry = json.loads(args.registry.read_text(encoding="utf-8"))
    reserved = {int(row["management_no"]) for row in registry["records"] if row["management_no"]}
    retired = {int(number) for number in registry["retired_reserved_numbers"]}
    prior = json.loads(args.prior.read_text(encoding="utf-8")) if args.prior else {}
    reserved.update(prior.get("existingNumbers", []))
    retired.update(prior.get("retiredNumbers", []))
    routes = defaultdict(list)
    for batch in args.numbered_batches:
        for row in read_csv(batch):
            number = row["management_no"]
            if not number:
                continue
            reserved.add(int(number))
            if row["steps"].strip():
                routes[route(row)].append(row)
    output = prior.get("records", [])
    seen = {row["provisional_id"] for row in output}
    if len(seen) != len(output):
        raise ValueError("Prior receipt contains duplicate provisional identities")
    for item in output:
        if item["steps"].strip():
            routes[route(item)].append({**item, "management_no": item["provisional_id"]})
    batches = [args.provisional_batch, *args.additional_batch]
    for row in (row for batch in batches for row in read_csv(batch)):
        identity = provisional_id(row)
        if identity in seen:
            continue
        seen.add(identity)
        number = row["management_no"]
        same_route = routes[route(row)] if row["steps"].strip() else []
        output.append({
            **row, "provisional_id": identity, "management_no": "",
            "incoming_number": number,
            "number_collision": bool(number) and int(number) in reserved | retired,
            "same_route_number_candidates": sorted({item["management_no"] for item in same_route}),
            "same_conditions_number_candidates": sorted({item["management_no"] for item in same_route
                if normalize(item["conditions_note"]) == normalize(row["conditions_note"])}),
            "official_number_assigned": False,
        })
        if row["steps"].strip():
            routes[route(row)].append({**row, "management_no": output[-1]["provisional_id"]})
    high = max(reserved | retired | {int(registry["high_water_mark"])})
    print(json.dumps({"existingNumbers": sorted(reserved), "retiredNumbers": sorted(retired),
                      "observedHighWaterMark": high, "firstPossibleNewNumber": high + 1,
                      "records": output}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
