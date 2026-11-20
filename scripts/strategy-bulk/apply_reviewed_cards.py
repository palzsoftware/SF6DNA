"""Apply a bulk run to the local review RC: append generated cards, merge review entries, relink training.

Existing cards are never modified or reordered; the run stops if any existing card differs
from the file it was generated against. Publication gates are untouched (cards stay
"ローカル確認用・公開未承認").
"""
import argparse
import json
from collections import Counter
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("run", type=Path, help="bulk_strategy.py --out directory")
    parser.add_argument("--cards-file", type=Path, required=True, help="ws5-local-reviewed-strategy-cards.json")
    parser.add_argument("--reviews", type=Path, required=True, help="Current STRATEGY_SOURCE_REVIEWS.json")
    parser.add_argument("--training-links", type=Path, required=True, help="Current TRAINING_228_LINKS_PRIVATE.json")
    parser.add_argument("--out", type=Path, required=True, help="Directory for merged hand-off files")
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    existing = json.loads(args.cards_file.read_text(encoding="utf-8"))
    new_cards = json.loads((args.run / "BULK_NEW_CARDS.json").read_text(encoding="utf-8"))
    drafts = json.loads((args.run / "BULK_REVIEW_DRAFTS.json").read_text(encoding="utf-8"))
    reviews = json.loads(args.reviews.read_text(encoding="utf-8"))
    links = json.loads(args.training_links.read_text(encoding="utf-8"))

    ids = [card["id"] for card in existing]
    if len(ids) != len(set(ids)):
        raise ValueError("Existing local card IDs are not unique")
    overlap = set(drafts) & set(reviews)
    if overlap:
        raise ValueError(f"Draft review entries already exist: {sorted(overlap)[:3]}")
    clash = {card["id"] for card in new_cards} & set(ids)
    if clash:
        raise ValueError(f"Generated card IDs already present: {sorted(clash)[:3]}")
    if len(new_cards) != len(drafts):
        raise ValueError("Generated cards and review drafts differ in number")
    for card in new_cards:
        if card["referenceNotice"] != "ローカル確認用・公開未承認" or card["media"] is not None:
            raise ValueError(f"Generated card is not a local review card: {card['id']}")

    merged_cards = existing + new_cards
    args.cards_file.write_text(json.dumps(merged_cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if json.loads(args.cards_file.read_text(encoding="utf-8"))[:len(existing)] != existing:
        raise RuntimeError("Existing cards changed while writing")

    merged_reviews = {**reviews, **drafts}
    (args.out / "STRATEGY_SOURCE_REVIEWS.json").write_text(
        json.dumps(merged_reviews, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    before = Counter(link["status"] for link in links)
    for link in links:
        if link["status"] == "LINK_PENDING_STRATEGY" and link["provisionalId"] in drafts:
            link["status"] = "LINK_LOCAL_CARD"
    after = Counter(link["status"] for link in links)
    (args.out / "TRAINING_228_LINKS_PRIVATE.json").write_text(
        json.dumps(links, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    summary = {"existingLocalCards": len(existing), "addedLocalCards": len(new_cards),
               "localCardsAfter": len(merged_cards), "reviewEntriesAfter": len(merged_reviews),
               "addedByCategory": dict(Counter(card["category"] for card in new_cards)),
               "trainingLinksBefore": dict(before), "trainingLinksAfter": dict(after),
               "publicationApproved": 0}
    (args.out / "APPLY_SUMMARY.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
                                                encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
