"""Revise command notices from the latest audit: restore the original notice on cards whose unresolved
steps turned out to be parser misjudgments, and list only the truly unresolved steps on the rest.

Only commandNotice changes (card and review entry together). History is appended, nothing is deleted.
"""
import argparse
import json
from collections import Counter
from pathlib import Path

ORIGINAL = "資料原文と技参照を照合済み。現行Patchの成立は未検証。"
COUNTER_ONLY = "相手の技を示す対策手順（自キャラの技照合の対象外）。現行Patchの成立は未検証。"


def unresolved_notice(steps):
    return f"一部の手順は技IDを特定できていない（{'、'.join(steps)}）。現行Patchの成立は未検証。"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cards-file", type=Path, required=True)
    parser.add_argument("--reviews", type=Path, required=True)
    parser.add_argument("--audit", type=Path, required=True, help="CARD_AUDIT_1866.json from the latest audit")
    parser.add_argument("--history", type=Path, required=True, help="CARD_TEXT_REVISION_HISTORY.json to append to")
    parser.add_argument("--revision", default="NOTICE_REVISION", help="Label written to each history entry")
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    cards = json.loads(args.cards_file.read_text(encoding="utf-8"))
    reviews = json.loads(args.reviews.read_text(encoding="utf-8"))
    audit = {r["card_id"]: r for r in json.loads(args.audit.read_text(encoding="utf-8"))}
    history = json.loads(args.history.read_text(encoding="utf-8"))
    result = Counter()
    for card in cards:
        row = audit[card["id"]]
        steps = [s for s in row["unresolvedSteps"].split(" / ") if s]
        counter_only = row.get("matchVerdict") == "COUNTER_TARGET_ONLY"
        wanted = COUNTER_ONLY if counter_only else unresolved_notice(steps) if steps else ORIGINAL
        if card["commandNotice"] == wanted:
            continue
        if not steps and not counter_only and card["commandNotice"] not in (COUNTER_ONLY,) \
                and "特定できていない" not in card["commandNotice"]:
            continue  # never touch a notice this revision did not write
        review = reviews[row["provisionalId"]]
        history.append({"card_id": card["id"], "characterSlug": card["characterSlug"], "revision": args.revision,
                        "commandNotice_before": card["commandNotice"], "commandNotice_after": wanted})
        card["commandNotice"] = wanted
        if wanted != ORIGINAL:
            review["commandNotice"] = wanted
        else:
            review.pop("commandNotice", None)  # generator default is the original notice
        result["counterOnly" if counter_only else "restored" if not steps else "unresolved"] += 1
    args.cards_file.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (args.out / "STRATEGY_SOURCE_REVIEWS.json").write_text(json.dumps(reviews, ensure_ascii=False, indent=2) + "\n",
                                                          encoding="utf-8")
    (args.out / "CARD_TEXT_REVISION_HISTORY.json").write_text(json.dumps(history, ensure_ascii=False, indent=1) + "\n",
                                                             encoding="utf-8")
    summary = {**result, "cardsWithUnresolvedNotice": sum(1 for c in cards if "特定できていない" in c["commandNotice"]),
               "cardsWithCounterOnlyNotice": sum(1 for c in cards if c["commandNotice"] == COUNTER_ONLY),
               "wrongCheckedClaims": sum(1 for c in cards if audit[c["id"]]["unresolvedSteps"] and "照合済み" in c["commandNotice"])}
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
