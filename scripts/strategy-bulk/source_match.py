"""Match intake rows against move sequences extracted from the cached source page."""
import re

from move_check import master_key, numeric_form, step_core
from page_text import ARROW_SEPARATORS, GT_SEPARATORS, norm

LEVELS = ("SEQUENCE_MATCH", "SEQUENCE_PARTIAL", "SEQUENCE_SIMILAR", "TEXT_FOUND", "NOT_FOUND")


def split_steps(steps):
    steps = steps or ""
    separator = GT_SEPARATORS if GT_SEPARATORS.search(steps) else ARROW_SEPARATORS
    return [t.strip() for t in separator.split(steps) if t.strip()]


def token_forms(token, slug=None, resolver=None, management_id=None):
    forms = {step_core(token)}
    if management_id:
        key = master_key(management_id)
        if key:
            forms.add("@" + key)
    elif resolver is not None and slug:
        key = resolver.resolve(slug, token)
        if key:
            forms.add("@" + key)
    numeric = numeric_form(token)
    if numeric:
        forms.add("#" + numeric)
    # A parenthesised move name in the source ("→↓↘＋強P（強 昇龍拳）") is an alternative spelling.
    for note in re.findall(r"[（(]([^（）()]+)[）)]", token):
        note = re.sub(r"【[^】]*】", "", note)
        forms.add(step_core(note))
    forms.discard("")
    return forms


def paired_sequences(sequences, slug=None, resolver=None):
    """Pair a name list with the numeric-command list that follows it under the same heading."""
    output = []
    used = set()
    for index, seq in enumerate(sequences):
        if index in used:
            continue
        forms = [token_forms(t, slug, resolver) for t in seq["steps"]]
        for other in range(index + 1, min(index + 4, len(sequences))):
            candidate = sequences[other]
            if (other not in used and candidate["headingPath"] == seq["headingPath"]
                    and len(candidate["steps"]) == len(seq["steps"])
                    and "cmd" in (candidate.get("listClass") or "") and "cmd" not in (seq.get("listClass") or "")):
                forms = [a | token_forms(b, slug, resolver) for a, b in zip(forms, candidate["steps"])]
                used.add(other)
                break
        output.append({**seq, "forms": forms})
    return output


def _contiguous(needle, haystack):
    for start in range(len(haystack) - len(needle) + 1):
        if all(n & h for n, h in zip(needle, haystack[start:start + len(needle)])):
            return True
    return False


def compare(row_forms, page_forms):
    if len(row_forms) == len(page_forms) and all(a & b for a, b in zip(row_forms, page_forms)):
        return "SEQUENCE_MATCH", 1.0
    if len(row_forms) >= 2 and len(page_forms) >= 2:
        if len(row_forms) < len(page_forms) and _contiguous(row_forms, page_forms):
            return "SEQUENCE_PARTIAL", len(row_forms) / len(page_forms)
        if len(page_forms) < len(row_forms) and _contiguous(page_forms, row_forms):
            return "SEQUENCE_PARTIAL", len(page_forms) / len(row_forms)
    hits = sum(1 for a, b in zip(row_forms, page_forms) if a & b)
    ratio = hits / max(len(row_forms), len(page_forms))
    return ("SEQUENCE_SIMILAR", ratio) if ratio >= 0.6 and len(row_forms) >= 3 else ("NOT_FOUND", ratio)


def match_row(row, page):
    """page: {"blocks", "sequences" (paired), "normText"}. Returns a match record."""
    tokens = split_steps(row["steps"])
    best = {"level": "NOT_FOUND", "score": 0.0, "headingPath": [], "pageSteps": [], "sequenceIndex": None}
    if len(tokens) >= 2:
        ids = [i.strip() for i in (row.get("management_ids") or "").split(" > ")]
        ids = ids if len(ids) == len(tokens) else [None] * len(tokens)
        row_forms = [token_forms(t, management_id=i) for t, i in zip(tokens, ids)]
        for index, seq in enumerate(page["sequences"]):
            level, score = compare(row_forms, seq["forms"])
            if (LEVELS.index(level), -score) < (LEVELS.index(best["level"]), -best["score"]):
                best = {"level": level, "score": round(score, 3), "headingPath": seq["headingPath"],
                        "pageSteps": seq["steps"], "sequenceIndex": index}
    if best["level"] == "NOT_FOUND":
        probe = norm(row["steps"] if len(tokens) == 1 else "") or norm(row["heading"])
        probe = probe[:50]
        if len(probe) >= 4:
            for block in page["blocks"]:
                if probe in norm(block["text"]):
                    best = {"level": "TEXT_FOUND", "score": 1.0, "headingPath": block["headingPath"],
                            "pageSteps": [], "sequenceIndex": None}
                    break
    return best
