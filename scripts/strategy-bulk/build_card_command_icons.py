"""Build the command-icon input for strategy cards from the official move master (read-only on cards).

Each card step is matched with the shared step matcher v1.1 (plus, optionally, abbreviation candidates that map
to exactly one official name). Steps become:
  {"command", "moveKey"}  own move with an official classic command, or a fixed system input (DR/CDR/66, ×N)
  {"text"}                walking, guarding, hit-confirm and other non-input words: shown as supporting text
  {"opponent"}            the opponent's move (counter cards): shown as text, never as the player's input
A projectile part ("X(飛び道具)", no input of its own) uses its parent move's command only when exactly one parent row
exists. Only classic commands are used; Modern inputs are never filled in.
A card converts only when no step is an unidentified move or a move without an official command, and at least
one own input exists. Otherwise the whole card stays on HOLD: nothing is guessed. Card files are never modified.

Outputs:
  --out-json  {"cards": {cardId: [steps]}} for cards that convert
  --report    per-card status CSV (status, reasons) for every card
"""
import argparse
import csv
import json
import re
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sf6dna_step_matcher_v1_1 import Matcher  # noqa: E402

REPEAT = re.compile(r"[×xX＊*]\s*([2-9])\s*$")
STATE_LABELS = (("PUNISH_COUNTER", "パニッシュカウンター"), ("COUNTER_HIT", "カウンターヒット"), ("WHIFF", "空振り"),
                ("MEATY", "持続当て"), ("DELAY", "遅らせ"), ("WALL", "壁"))


def system_command(step, tags):
    """Input that the step text fixes by itself, or None."""
    count = int(REPEAT.search(step).group(1)) if REPEAT.search(step) else 1
    if "FORWARD_STEP" in tags:
        return ["66"] * count
    if any(t.startswith("DRIVE_RUSH") for t in tags):
        return ["CDR" if re.search(r"キャンセル|CDR", step, re.I) else "DR"] * count
    return None


PROJECTILE = re.compile(r"\s*[（(]飛び道具[）)]\s*$")


def projectile_parent(master, key):
    """Official row of the move that throws this projectile part ("X(飛び道具)" has no input of its own).
    Returned only when exactly one parent row with an input exists; e.g. three strengths stay unresolved."""
    record = master[key]
    skill = record["raw"].get("skill") or ""
    if not PROJECTILE.search(skill):
        return None
    base = PROJECTILE.sub("", skill).strip()
    od = base.startswith("OD")
    name = re.sub(r"^OD\s*", "", base)
    parents = []
    for other, row in master.items():
        if row["characterSlug"] != record["characterSlug"] or other == key:
            continue
        other_skill = (row["raw"].get("skill") or "").strip()
        other_od = other_skill.startswith("OD")
        stripped = re.sub(r"^(弱|中|強)\s*", "", re.sub(r"^OD\s*", "", other_skill))
        if stripped == name and other_od == od and (row["raw"].get("command") or "").strip():
            parents.append(other)
    return parents[0] if len(parents) == 1 else None


def load_abbreviations(path):
    table = {}
    if path:
        for row in csv.DictReader(path.open(encoding="utf-8-sig")):
            if row["status"] == "CC1_ADOPTED_ROUND16" and row["moveKey"]:
                table[(row["characterSlug"], row["abbreviation"])] = row["moveKey"]
    return table


def convert(matcher, master, card, abbreviations=None):
    _, steps = matcher.card(card["characterSlug"], card["commandJapanese"])
    if not steps:
        return None, ["NO_STEPS"]
    out, reasons = [], []
    for text, result in steps:
        kind = result["kind"]
        abbreviated = (abbreviations or {}).get((card["characterSlug"], text.strip()))
        if kind == "HOLD" and abbreviated:
            result = {"kind": "MOVE", "key": abbreviated, "tags": result.get("tags", [])}
            kind = "MOVE"
        if kind == "MOVE" and not (master[result["key"]]["raw"].get("command") or "").strip():
            parent = projectile_parent(master, result["key"])
            if parent:
                result = {**result, "key": parent}
        if kind == "MOVE":
            command = (master[result["key"]]["raw"].get("command") or "").strip()
            tags = result.get("tags") or []
            if not command or command in ("-", "－"):
                projectile = PROJECTILE.search(master[result["key"]]["raw"].get("skill") or "")
                reasons.append(f"{'PROJECTILE_PARENT_NOT_UNIQUE' if projectile else 'NO_OFFICIAL_COMMAND'}:{text}")
            else:
                # Keep what the matcher stripped from the step text: a rush prefix is its own input, a repeat
                # repeats the move, and hit/timing states are shown as supporting text next to the move.
                if "DRIVE_RUSH_CANCEL" in tags:
                    out.append({"command": "CDR", "moveKey": None})
                elif "DRIVE_RUSH_UNSPECIFIED" in tags:
                    out.append({"command": "DR", "moveKey": None})
                elif "DRIVE_RUSH_PARRY" in tags:
                    out.append({"text": "パリィラッシュ"})
                count = int(REPEAT.search(text).group(1)) if "REPEAT_N" in tags and REPEAT.search(text) else 1
                out += [{"command": command, "moveKey": result["key"]} for _ in range(count)]
                out += [{"text": label} for tag, label in STATE_LABELS if tag in tags]
        elif kind == "SYSTEM_ACTION" and system_command(text, result["tags"]):
            out += [{"command": c, "moveKey": None} for c in system_command(text, result["tags"])]
        elif kind == "OPPONENT_MOVE":
            out.append({"opponent": text.strip()})
        elif kind in ("SYSTEM_ACTION", "VOCAB_ONLY"):
            out.append({"text": text.strip()})
        else:
            reasons.append(f"MOVE_NOT_IDENTIFIED:{text}")
    if not reasons and not any("command" in step for step in out):
        reasons.append("NO_OWN_INPUT")
    return (None if reasons else out), reasons


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cards", type=Path, nargs="+", required=True)
    parser.add_argument("--master", type=Path, required=True)
    parser.add_argument("--aliases", type=Path, required=True)
    parser.add_argument("--same-label-pairs", type=Path, required=True)
    parser.add_argument("--abbreviations", type=Path, help="STRATEGY_ABBREVIATION_CANDIDATES csv (unique-prefix rows)")
    parser.add_argument("--hold-ids", type=Path, help="strategy-reference-source-hold JSON (reported, not skipped)")
    parser.add_argument("--out-json", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()
    master = json.loads(args.master.read_text(encoding="utf-8"))
    aliases = list(csv.DictReader(args.aliases.open(encoding="utf-8-sig")))
    matcher = Matcher(master, aliases, str(args.same_label_pairs))
    abbreviations = load_abbreviations(args.abbreviations)
    held = set(json.loads(args.hold_ids.read_text(encoding="utf-8"))["holdCardIds"]) if args.hold_ids else set()

    icons, rows, summary = {}, [], Counter()
    for path in args.cards:
        for card in json.loads(path.read_text(encoding="utf-8")):
            steps, reasons = convert(matcher, master, card, abbreviations)
            status = "CONVERTED" if steps else "HOLD"
            if steps:
                icons[card["id"]] = steps
            origin = "displayed" if path.name.startswith("strategy-research-cards") else "localReview"
            visibility = "SOURCE_HOLD" if card["id"] in held else "VISIBLE"
            rows.append({"cardId": card["id"], "characterSlug": card["characterSlug"], "category": card["category"],
                         "origin": origin, "visibility": visibility, "status": status, "reasons": " / ".join(reasons)})
            summary[f"{origin}:{visibility}:{status}"] += 1
    if len(icons) != sum(1 for r in rows if r["status"] == "CONVERTED"):
        raise SystemExit("Duplicate card IDs across inputs")
    doc = {"version": "2026-11-20", "matcher": "STEP_MATCHING_SPEC_V1.1",
           "rule": "自キャラの技は公式TXTのクラシック入力（略称は一意前方一致の候補のみ・①確認待ち）、DR/CDR/66は入力、歩き・ガード等は補助テキスト、相手の技は区別して表示。未特定の技・公式入力なしの技を含むカードはHOLD（推測しない）",
           "cards": dict(sorted(icons.items()))}
    args.out_json.write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    with args.report.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    print(json.dumps(dict(sorted(summary.items())), ensure_ascii=False))


if __name__ == "__main__":
    main()
