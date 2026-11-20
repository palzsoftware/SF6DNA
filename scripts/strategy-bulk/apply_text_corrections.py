"""Apply audited text corrections to local review cards, character by character.

Changes only title, description, commandNotice and (for auto-extracted cards) the condition text.
Card IDs, steps, move IDs, sources and every other field are verified unchanged. The review
manifest receives the same values so generate-local-strategy-cards.py reproduces the cards.
A before/after history is written; nothing is deleted.
"""
import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

EDITABLE = ("title", "description", "commandNotice", "condition")
VERDICT_ORDER = {"採用候補": 0, "派生として統合推奨": 1, "要確認": 2, "重複": 3, "除外候補": 4}
FRAME = re.compile(r"[+＋\-−]?\d[\d,，]*\s*(?:F|ｆ|f)(?![A-Za-z])|[+＋\-−]\d+|\d{1,2},\d{3}")
NUMBER_IN_TEXT = re.compile(r"[+＋\-−]?\d+\s*(?:F|ｆ)(?![A-Za-z])|\d{1,2},\d{3}|[+＋\-−]\d+")
AUTO_MARK = "ページ内手順の自動抽出"


def without_frame_numbers(text):
    cleaned = FRAME.sub("", text)
    cleaned = re.sub(r"[（(]\s*[）)]", "", cleaned)
    cleaned = re.sub(r"\s{2,}", " ", cleaned)
    return cleaned.replace("「 ", "「").replace(" 」", "」").strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cards-file", type=Path, required=True)
    parser.add_argument("--displayed", type=Path, required=True)
    parser.add_argument("--reviews", type=Path, required=True)
    parser.add_argument("--audit", type=Path, required=True, help="CARD_AUDIT_1866.json")
    parser.add_argument("--candidates", type=Path, required=True, help="LOCAL_TEXT_CORRECTION_CANDIDATES.json")
    parser.add_argument("--out", type=Path, required=True, help="Directory for merged reviews and history")
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    cards = json.loads(args.cards_file.read_text(encoding="utf-8"))
    displayed = json.loads(args.displayed.read_text(encoding="utf-8"))
    reviews = json.loads(args.reviews.read_text(encoding="utf-8"))
    audit = {r["card_id"]: r for r in json.loads(args.audit.read_text(encoding="utf-8"))}
    candidates = {c["card_id"]: c for c in json.loads(args.candidates.read_text(encoding="utf-8"))}
    review_of = {audit[c["id"]]["provisionalId"]: c["id"] for c in cards if audit.get(c["id"], {}).get("provisionalId")}
    pid_of = {card_id: pid for pid, card_id in review_of.items()}
    before = json.loads(json.dumps(cards))

    titles = defaultdict(Counter)
    for card in displayed + cards:
        if card["id"] not in candidates or "title_proposed" not in candidates[card["id"]]:
            titles[card["characterSlug"]][card["title"]] += 1

    history, applied = [], Counter()
    order = sorted(cards, key=lambda c: (c["characterSlug"], VERDICT_ORDER.get(audit[c["id"]]["verdict_label"], 9),
                                         cards.index(c)))
    for card in order:
        candidate = candidates.get(card["id"])
        auto = AUTO_MARK in (card.get("caution") or "")
        changes = {}
        if candidate:
            if "title_proposed" in candidate:
                title = candidate["title_proposed"]
                if titles[card["characterSlug"]][title]:
                    title = f"{title}（{card['categoryLabel']}）"
                n = 2
                while titles[card["characterSlug"]][title]:
                    title = f"{candidate['title_proposed']}（{card['categoryLabel']}・{n}）"
                    n += 1
                titles[card["characterSlug"]][title] += 1
                changes["title"] = title
            if "description_proposed" in candidate:
                changes["description"] = candidate["description_proposed"]
            if "commandNotice_proposed" in candidate:
                changes["commandNotice"] = candidate["commandNotice_proposed"]
        if auto and FRAME.search(card.get("condition") or ""):
            changes["condition"] = without_frame_numbers(card["condition"])
        changes = {k: v for k, v in changes.items() if v != card.get(k)}
        if not changes:
            continue
        for field in ("title", "description", "condition"):
            if field in changes and NUMBER_IN_TEXT.search(changes[field]):
                raise ValueError(f"Unverified number would be written: {card['id']} {field}: {changes[field]}")
        history.append({"card_id": card["id"], "characterSlug": card["characterSlug"],
                        "verdict": audit[card["id"]]["verdict_label"],
                        **{f"{k}_before": card.get(k) for k in changes}, **{f"{k}_after": v for k, v in changes.items()}})
        card.update(changes)
        pid = pid_of.get(card["id"])
        if pid is None or pid not in reviews:
            raise ValueError(f"No review entry for {card['id']}")
        review = reviews[pid]
        for field, value in changes.items():
            review[field] = value
        applied.update(changes.keys())

    for old, new in zip(before, cards):
        if old["id"] != new["id"] or {k: v for k, v in old.items() if k not in EDITABLE} != \
                {k: v for k, v in new.items() if k not in EDITABLE}:
            raise RuntimeError(f"Non-text field changed: {old['id']}")
    final = Counter((c["characterSlug"], c["title"]) for c in displayed + cards)
    duplicates = [k for k, n in final.items() if n > 1]
    args.cards_file.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (args.out / "STRATEGY_SOURCE_REVIEWS.json").write_text(json.dumps(reviews, ensure_ascii=False, indent=2) + "\n",
                                                          encoding="utf-8")
    (args.out / "CARD_TEXT_REVISION_HISTORY.json").write_text(json.dumps(history, ensure_ascii=False, indent=1) + "\n",
                                                             encoding="utf-8")
    base_numbers = sum(1 for c in cards if AUTO_MARK not in (c.get("caution") or "") and NUMBER_IN_TEXT.search(c.get("condition") or ""))
    summary = {"cardsChanged": len(history), "fieldsChanged": dict(applied),
               "changedByVerdict": dict(Counter(h["verdict"] for h in history)),
               "changedByCharacter": dict(Counter(h["characterSlug"] for h in history)),
               "titleDuplicatesAfter": len(duplicates), "titleDuplicateExamples": duplicates[:5],
               "nonAutoCardsWithNumbersInConditionUnchanged": base_numbers}
    (args.out / "TEXT_CORRECTION_SUMMARY.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
                                                          encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
