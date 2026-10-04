#!/usr/bin/env python3
"""Offline read-only classification of SELECT exports; never connects or writes to DB."""
import argparse
import csv
import json
from collections import defaultdict
from pathlib import Path


def classify(row):
    """SQL gate is independent of status. Missing reasons overlap, primary is exclusive."""
    reasons = []
    if not row["command_evidence"]:
        reasons.append("NEEDS_OFFICIAL_COMMAND_EVIDENCE")
    if not row["frame_evidence"]:
        reasons.append("NEEDS_OFFICIAL_FRAME_EVIDENCE")
    if not row["move_evidence"]:
        reasons.append("NEEDS_SOURCE_RELATION")
    if not row["current_verified"]:
        reasons.append("UNVERIFIED_DATA")
    if row["status"] != "published":
        reasons.append("NEEDS_STATUS_PROMOTION" if row["status"] == "draft" else "HOLD")
    expected = all(row[k] for k in ("command_evidence", "frame_evidence", "move_evidence", "current_verified"))
    if bool(row["sql_gate"]) != expected:
        return "HOLD", ["SQL_GATE_REPRODUCTION_MISMATCH"] + reasons
    if not row["current_verified"]:
        primary = "UNVERIFIED_DATA"
    elif not row["command_evidence"] and not row["frame_evidence"]:
        primary = "NEEDS_COMMAND_AND_FRAME_EVIDENCE"
    elif not row["command_evidence"]:
        primary = "NEEDS_OFFICIAL_COMMAND_EVIDENCE"
    elif not row["frame_evidence"]:
        primary = "NEEDS_OFFICIAL_FRAME_EVIDENCE"
    elif not row["move_evidence"]:
        primary = "NEEDS_SOURCE_RELATION"
    elif row["status"] == "published":
        primary = "READY_FOR_PUBLICATION"
    elif row["status"] == "draft":
        primary = "NEEDS_STATUS_PROMOTION"
    else:
        primary = "HOLD"
    return primary, reasons


def summary(rows):
    grouped = defaultdict(list)
    for row in rows:
        grouped[row["character"]].append(row)
    result = []
    for character, group in sorted(grouped.items()):
        primary = [classify(r)[0] for r in group]
        result.append(dict(character=character, total_moves=len(group),
            ready=primary.count("READY_FOR_PUBLICATION"),
            status_only=primary.count("NEEDS_STATUS_PROMOTION"),
            command_evidence_missing=sum(not r["command_evidence"] for r in group),
            frame_evidence_missing=sum(not r["frame_evidence"] for r in group),
            source_relation_missing=sum(not r["move_evidence"] for r in group),
            other_hold=sum(p in ("UNVERIFIED_DATA", "HOLD", "CANONICAL_MISMATCH", "NOT_CURRENT_PATCH") for p in primary),
            sql_gate_reproduction_mismatch=sum("SQL_GATE_REPRODUCTION_MISMATCH" in classify(r)[1] for r in group)))
    return result


def write_csv(path, rows):
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("all_rows", type=Path)
    parser.add_argument("details", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    rows = json.loads(args.all_rows.read_text())
    details = json.loads(args.details.read_text())
    if len({r["id"] for r in rows}) != len(rows):
        raise ValueError("Duplicate move IDs")
    index = {r["id"]: r for r in rows}
    output = []
    for detail in details:
        row = index[detail["id"]]
        primary, reasons = classify(row)
        commands = detail.get("commands") or []
        frames = detail.get("frames") or []
        evidence = detail.get("evidence") or []
        actions = []
        if not row["command_evidence"]: actions.append("ACTION_LINK_COMMAND_SOURCE_AFTER_FACT_REVIEW")
        if not row["frame_evidence"]: actions.append("ACTION_LINK_FRAME_SOURCE_AFTER_FACT_REVIEW")
        if not row["move_evidence"]: actions.append("ACTION_CANONICAL_REVIEW_THEN_LINK_MOVE_SOURCE")
        if not row["current_verified"]: actions.append("ACTION_VERIFY_FRAME_OR_PATCH_VALIDITY_REVIEW")
        if row["status"] == "draft": actions.append("ACTION_STATUS_PROMOTION_AFTER_ALL_BLOCKERS_RESOLVED")
        output.append(dict(character=row["character"], move_id=row["id"], slug=row["slug"],
            name=detail["name_ja"], move_type=detail["move_type"],
            strength_variant=detail["strength_variant"], display_order=detail["display_order"],
            current_status=row["status"], target_status="published",
            primary_blocker=primary, secondary_blockers=";".join(r for r in reasons if r != primary),
            sql_gate=row["sql_gate"], move_evidence=row["move_evidence"],
            command_evidence=row["command_evidence"], frame_evidence=row["frame_evidence"],
            command_verification="NO_VERIFICATION_STATUS_COLUMN;OFFICIAL_RELATION_REQUIRED",
            canonical_fact_review="EXISTING_EVIDENCE_REUSED;NOT_FRESH_CANONICAL_CONFIRMATION",
            proposed_action=";".join(actions) or "NO_ACTION_READY",
            commands=json.dumps(commands, ensure_ascii=False, separators=(",", ":")),
            frames=json.dumps(frames, ensure_ascii=False, separators=(",", ":")),
            evidence=json.dumps(evidence, ensure_ascii=False, separators=(",", ":"))))
    args.output.mkdir(parents=True, exist_ok=True)
    write_csv(args.output / "PRIORITY_MOVE_PUBLICATION_AUDIT_20261004.csv", output)
    write_csv(args.output / "CHARACTER_PUBLICATION_AUDIT_20261004.csv", summary(rows))
    print(json.dumps(summary([r for r in rows if r["character"] in ("c-viper", "elena", "sagat")]), ensure_ascii=False))


if __name__ == "__main__":
    main()
