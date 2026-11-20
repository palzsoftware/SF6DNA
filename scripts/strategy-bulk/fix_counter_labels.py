"""Separate counter-hit (CH) from punish-counter (PC) wording on local review cards (matcher v1.1 tags).

Earlier generated text called every counter start "パニッシュカウンター". This rewrites only that generated
wording on cards whose first step the v1.1 matcher tags COUNTER_HIT. Card and review entry change together;
history is appended. Steps, IDs and every other field are untouched.
"""
import argparse
import csv
import json
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sf6dna_step_matcher_v1_1 import Matcher  # noqa: E402

REPLACEMENTS = {
    "title": [("パニッシュカウンター時の", "カウンターヒット時の")],
    "description": [("始動技がパニッシュカウンターで当たったときの手順。", "始動技がカウンターヒットしたときの手順。")],
    "condition": [("始動がパニッシュカウンター。", "始動がカウンターヒット。")],
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cards-file", type=Path, required=True)
    parser.add_argument("--displayed", type=Path, required=True)
    parser.add_argument("--reviews", type=Path, required=True)
    parser.add_argument("--audit", type=Path, required=True, help="CARD_AUDIT_1866.json (card -> provisional id)")
    parser.add_argument("--master", type=Path, required=True)
    parser.add_argument("--aliases", type=Path, required=True)
    parser.add_argument("--same-label-pairs", type=Path, required=True)
    parser.add_argument("--history", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    cards = json.loads(args.cards_file.read_text(encoding="utf-8"))
    displayed = json.loads(args.displayed.read_text(encoding="utf-8"))
    reviews = json.loads(args.reviews.read_text(encoding="utf-8"))
    audit = {r["card_id"]: r for r in json.loads(args.audit.read_text(encoding="utf-8"))}
    history = json.loads(args.history.read_text(encoding="utf-8"))
    master = json.loads(args.master.read_text(encoding="utf-8"))
    aliases = list(csv.DictReader(args.aliases.open(encoding="utf-8-sig")))
    matcher = Matcher(master, aliases, str(args.same_label_pairs))
    before = json.loads(json.dumps(cards))
    changed = Counter()
    for card in cards:
        _, steps = matcher.card(card["characterSlug"], card["commandJapanese"])
        if not steps or "COUNTER_HIT" not in steps[0][1]["tags"]:
            continue
        updates = {}
        for field, pairs in REPLACEMENTS.items():
            value = card.get(field) or ""
            for old, new in pairs:
                value = value.replace(old, new)
            if value != (card.get(field) or ""):
                updates[field] = value
        if not updates:
            continue
        history.append({"card_id": card["id"], "characterSlug": card["characterSlug"], "revision": "SPEC_V1_1_COUNTER_HIT",
                        **{f"{k}_before": card.get(k) for k in updates}, **{f"{k}_after": v for k, v in updates.items()}})
        card.update(updates)
        review = reviews[audit[card["id"]]["provisionalId"]]
        review.update(updates)
        changed.update(updates.keys())
        changed["cards"] += 1
    for old, new in zip(before, cards):
        if {k: v for k, v in old.items() if k not in ("title", "description", "condition")} != \
                {k: v for k, v in new.items() if k not in ("title", "description", "condition")}:
            raise RuntimeError(f"Non-text field changed: {old['id']}")
    titles = Counter((c["characterSlug"], c["title"]) for c in displayed + cards)
    duplicates = sum(1 for n in titles.values() if n > 1)
    if duplicates:
        raise RuntimeError(f"Title duplicates after counter-hit wording: {duplicates}")
    args.cards_file.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (args.out / "STRATEGY_SOURCE_REVIEWS.json").write_text(json.dumps(reviews, ensure_ascii=False, indent=2) + "\n",
                                                          encoding="utf-8")
    (args.out / "CARD_TEXT_REVISION_HISTORY.json").write_text(json.dumps(history, ensure_ascii=False, indent=1) + "\n",
                                                             encoding="utf-8")
    remaining = sum(1 for c in cards if "COUNTER_HIT" in (matcher.card(c["characterSlug"], c["commandJapanese"])[1] or
                                                         [("", {"tags": []})])[0][1]["tags"]
                    and any(old in (c.get(f) or "") for f, pairs in REPLACEMENTS.items() for old, _ in pairs))
    print(json.dumps({**changed, "titleDuplicates": duplicates, "counterHitCardsStillWordedAsPunish": remaining},
                     ensure_ascii=False))


if __name__ == "__main__":
    main()
