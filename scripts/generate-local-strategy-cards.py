"""Generate review-only cards from Claude's CSV and an explicit source-review manifest."""
import csv
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import urlsplit

LABELS = {"combo": "コンボ", "setplay": "セットプレイ", "pressure": "連携", "counter": "対策"}
EMPTY_STATS = dict.fromkeys(("damage", "drive", "sa", "knockdownAdvantage"))


def route(slug, category, command):
    text = unicodedata.normalize("NFKC", command)
    text = re.sub(r"\s+>\s+", "→", text)
    text = re.sub(r"屈(?=[弱中強])", "しゃがみ", text)
    text = text.replace("スピバ", "スピニングバードキック").replace("キャンセルドライブラッシュ", "キャンセルラッシュ")
    return slug, category, re.sub(r"\s+", "", text)


def main():
    baseline_path, review_path, *batches = map(Path, sys.argv[1:])
    baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
    reviews = json.loads(review_path.read_text(encoding="utf-8"))
    seen = {route(c["characterSlug"], c["category"], c["commandJapanese"]) for c in baseline}
    # Which card owns each route, so a duplicate kept as history can name the card it repeats.
    route_owner = {route(c["characterSlug"], c["category"], c["commandJapanese"]): c["id"] for c in baseline}
    existing_cards = {card["id"]: card for card in baseline}
    matched_reviews = set()
    cards = []
    numbers = set()
    for batch in batches:
        with batch.open(encoding="utf-8-sig", newline="") as source:
            for row in csv.DictReader(source):
                number = row["management_no"]
                provisional = row.get("provisional_id", "")
                if provisional and (number or not re.fullmatch(r"provisional:[a-f0-9]{64}", provisional)):
                    raise ValueError("Invalid provisional identity")
                number = number or provisional
                if not number:
                    continue
                if number in numbers:
                    raise ValueError(f"Duplicate management number: {number}")
                numbers.add(number)
                review = reviews.get(number)
                if not review:
                    continue
                slug, category = row["character_slug"], row["category"]
                steps = row["steps"]
                step_count = len(re.split(r"→|\s+>\s+", steps))
                key = route(slug, category, steps)
                url = urlsplit(row["source_url"])
                checks = (
                    row["quality"].startswith("A "), row["duplicate"] == "なし",
                    row["publication"] == "HOLD_NOT_APPROVED", row["game_qa"] == "NOT_RUN",
                    row["step_states"].split() == ["RESOLVED"] * step_count,
                    len(row["management_ids"].split(" > ")) == step_count,
                    not row["unresolved_steps"],
                    url.scheme == "https" and url.hostname and not url.username and not url.password,
                    all(row[key] == review[key] for key in ("source_url", "page_updated", "steps", "management_ids")),
                    bool(re.fullmatch(r"\d{4}-\d{2}-\d{2}", review["page_updated"])),
                    all(review[key].strip() for key in ("sourceLocator", "condition", "title", "characterName")),
                )
                if not all(checks):
                    raise ValueError(f"Review evidence mismatch: {number} {checks}")
                card = {
                    "id": "local-review:" + hashlib.sha256(f"{slug}:{number}".encode()).hexdigest()[:16], "characterSlug": slug,
                    "characterName": review["characterName"], "category": category,
                    "categoryLabel": LABELS[category], "title": review["title"],
                    "controlLabel": review["controlLabel"], "commandRaw": "",
                    "commandJapanese": review.get("displaySteps", re.sub(r"屈(?=[弱中強])", "しゃがみ", steps)),
                    "description": review["description"], "condition": review["condition"],
                    "position": review.get("position", "指定なし"),
                    "reportedStats": {**EMPTY_STATS, **review.get("reportedStats", {})},
                    "verifiedStats": EMPTY_STATS, "referenceVersion": review.get("sourceVersion", f"資料 {review['page_updated']} 時点"),
                    "sourceUrl": row["source_url"], "sourceUrls": [row["source_url"]],
                    "media": None, "referenceNotice": "ローカル確認用・公開未承認",
                    # A review entry may correct the notice (e.g. steps whose move ID is not identified).
                    "commandNotice": review.get("commandNotice", "資料原文と技参照を照合済み。現行Patchの成立は未検証。"),
                    "caution": review["sourceLocator"],
                }
                matched_reviews.add(number)
                existing_card = existing_cards.get(card["id"])
                if existing_card is not None:
                    if existing_card != card:
                        raise ValueError(f"Existing card differs from review: {number}")
                    continue
                if key in seen:
                    # Only an explicitly declared historical duplicate of the card that owns the route may pass.
                    declared = review.get("retainedDuplicateOf")
                    if not declared or declared != route_owner.get(key):
                        raise ValueError(f"Duplicate strategy route: {number}")
                seen.add(key)
                route_owner.setdefault(key, number)
                cards.append(card)
    if matched_reviews != reviews.keys():
        raise ValueError("Review manifest contains unmatched management numbers")
    print(json.dumps(cards, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
