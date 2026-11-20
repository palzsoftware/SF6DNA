"""Check intake move IDs against the official move master without guessing aliases.

An ID such as ``akuma:2+HP:web:110`` resolves to master key ``akuma:web:110``. The step
text is then compared with the master's Japanese move name or numeric command. A step is
never re-mapped to a different move: disagreement is reported for review.
"""
import re
import unicodedata

SLUG_ALIASES = {"dee-jay": "deejay"}  # Product slug -> move master slug (notation only).
STRENGTH = {"小": "弱", "大": "強"}
# Game-wide abbreviations only (identical for every character); character move aliases are not added here.
SYSTEM_EQUIVALENTS = (("キャンセルドライブラッシュ", ("cラッシュ", "キャンセルラッシュ", "cdr")),
                      ("パリィドライブラッシュ", ("生ラッシュ", "パリィラッシュ")),
                      ("ドライブインパクト", ("di", "インパクト", "di壁", "インパクト壁", "ドライブインパクト壁", "ドライブインパクト壁やられ")),
                      ("前方ステップ", ("前ステ", "前ステップ")),
                      ("後方ステップ", ("後ろステ", "バクステ", "バックステップ")))
ARROW_DIGITS = {"↓": "2", "↙": "1", "←": "4", "↘": "3", "→": "6", "↗": "9", "↑": "8", "↖": "7"}
SYSTEM_PREFIX = re.compile(r"^(?:cラッシュ|キャンセルラッシュ|キャンセルドライブラッシュ|cdr|dr|ドライブラッシュ|生ラッシュ|ラッシュ)(?=.)")
DIRECTIONS = {"前": "6", "後ろ": "4", "後": "4", "下": "2"}
BUTTONS = {"弱p": "lp", "中p": "mp", "強p": "hp", "弱k": "lk", "中k": "mk", "強k": "hk"}
# System actions recognised by name; they carry no move-master ID in the intake format.
SYSTEM_STEPS = re.compile(r"^(?:cラッシュ|キャンセルラッシュ|キャンセルドライブラッシュ|生ラッシュ|ラッシュ|ドライブラッシュ|cdr|dr|"
                          r"前ステ(?:ップ)?|前方ステップ|後ろステ(?:ップ)?|バクステ|バックステップ|微歩き|前歩き|歩き|"
                          r"パリィラッシュ|パリィ|ドライブパリィ|ジャンプ|垂直ジャンプ|前ジャンプ|(?:\(|（)?間(?:\)|）)?|ディレイ|"
                          r"空振り|ガード|様子見)$")


def master_key(management_id):
    parts = management_id.split(":")
    if len(parts) < 4 or parts[-2] != "web" or not parts[-1]:
        return None
    return f"{SLUG_ALIASES.get(parts[0], parts[0])}:web:{parts[-1]}"


def _strip_notes(text):
    return re.sub(r"[（(][^）)]*[）)]|\[[^\]]*\]", "", text)


def step_core(step):
    text = unicodedata.normalize("NFKC", step).casefold()
    text = _strip_notes(text)
    text = re.sub(r"\s+", "", text)
    for source, target in STRENGTH.items():
        text = text.replace(source, target)
    text = text.replace("しゃがみ", "屈").replace("しゃが", "屈")
    text = re.sub(r"^(?:屈|2)(?=[弱中強][pk])", "屈", text)
    text = re.sub(r"^(?:立ち|5|近|遠)(?=[弱中強][pk])", "立ち", text)
    text = re.sub(r"^(?:j|ジャンプ|跳び|飛び|8|9|7)(?=[弱中強][pk])", "ジャンプ", text)
    text = re.sub(r"(pc|ch|パニカン|パニッシュカウンター|カウンター)$", "", text)
    for canonical, variants in SYSTEM_EQUIVALENTS:
        if text in variants:
            return canonical
    return text


def master_core(skill):
    return step_core(skill or "")


def numeric_form(step):
    """'236強K' -> '236+hk', '2強P' -> '2+hp'. None when the step is not numeric notation."""
    text = unicodedata.normalize("NFKC", _strip_notes(step)).casefold().replace(" ", "")
    text = "".join(ARROW_DIGITS.get(ch, ch) for ch in text).replace("+", "")
    for source, target in STRENGTH.items():
        text = text.replace(source, target)
    for word, digit in DIRECTIONS.items():
        if text.startswith(word):
            text = digit + text[len(word):]
            break
    text = re.sub(r"(pc|ch)$", "", text)
    match = re.fullmatch(r"([1-9]{1,6})?\+?(弱|中|強)([pk])", text)
    if not match:
        return None
    motion = match.group(1) or ""
    button = BUTTONS[match.group(2) + match.group(3)]
    return f"{motion}+{button}" if motion and motion != "5" else button


def command_form(command):
    text = unicodedata.normalize("NFKC", command or "").casefold()
    text = re.sub(r"[（(][^）)]*[）)]", "", text).replace(" ", "")
    return text


def throw_matches(core, raw):
    command = command_form(raw.get("command"))
    if "lplk" not in command:
        return False
    if core == "前投げ":
        return "6+lplk" in command or "6lplk" in command
    if core in ("後ろ投げ", "後投げ"):
        return "4+lplk" in command or "4lplk" in command
    return False


_NAME_INDEX = {}


def _names_for(slug, master):
    index_key = (id(master), slug)
    if index_key not in _NAME_INDEX:
        names = {}
        for other_key, record in master.items():
            if record["characterSlug"] == slug:
                names.setdefault(master_core(record["raw"].get("skill")), set()).add(other_key)
        _NAME_INDEX[index_key] = names
    return _NAME_INDEX[index_key]


_LEVEL = re.compile(r"^(弱|中|強|od|sa[123]|ca)")


def _split_level(name):
    match = _LEVEL.match(name)
    return (match.group(1), name[match.end():]) if match else ("", name)


def abbreviation_target(core, names):
    """The single master name that core abbreviates (same strength, name prefix), else None."""
    level, rest = _split_level(core)
    if not rest:
        return None
    matches = [name for name in names if _split_level(name)[0] == level and _split_level(name)[1].startswith(rest)]
    return matches[0] if len(matches) == 1 else None


def abbreviation_unique(core, key, master):
    """True when core is a strength-aware prefix abbreviation naming exactly one master move."""
    if len(core) < 2:
        return False
    slug = key.split(":")[0]
    names = _names_for(slug, master)
    target = master_core(master[key]["raw"].get("skill"))
    strength = re.match(r"^(弱|中|強|od|sa[123]|ca)", core)
    def body(name):
        prefix = re.match(r"^(弱|中|強|od|sa[123]|ca)", name)
        return (prefix.group(1) if prefix else "", name[prefix.end():] if prefix else name)
    want = (strength.group(1) if strength else "", core[strength.end():] if strength else core)
    def hit(name):
        level, rest = body(name)
        return level == want[0] and rest.startswith(want[1])
    matches = [name for name in names if hit(name)]
    return matches == [target]


def load_confirmed_aliases(path, master):
    """{(master slug, step_core(alias)): ws5Key} from a CONFIRM_CANDIDATE* alias file; conflicts are dropped."""
    import csv
    found, conflicts = {}, set()
    with open(path, encoding="utf-8-sig", newline="") as source:
        for row in csv.DictReader(source):
            verdict = row.get("verdict") or row.get("basis") or ""
            # Only single-move confirmations; strength-unspecified families are never collapsed to one move.
            if (not verdict.startswith("CONFIRM_CANDIDATE") or "FAMILY" in verdict or "STRENGTH_UNSPECIFIED" in verdict
                    or "VOCAB" in verdict or row["ws5Key"] not in master):
                continue
            slug = master[row["ws5Key"]]["characterSlug"]
            key = (slug, step_core(row["alias"]))
            if key in found and found[key] != row["ws5Key"]:
                conflicts.add(key)
            found[key] = row["ws5Key"]
    for key in conflicts:
        found.pop(key, None)
    return found


def check_steps(steps, management_ids, master, aliases=None):
    """Return (status, per-step details). Status: OK, REVIEW or MISSING."""
    tokens = [t.strip() for t in re.split(r"\s+>\s+|\s*→\s*", steps) if t.strip()]
    ids = [i.strip() for i in management_ids.split(" > ")] if management_ids.strip() else []
    if not tokens:
        return "NO_STEPS", []
    if len(ids) != len(tokens):
        return "MISSING", [{"step": t, "result": "COUNT_MISMATCH"} for t in tokens]
    details = []
    for token, identifier in zip(tokens, ids):
        core = step_core(token)
        if not identifier:
            result = "SYSTEM_STEP" if not core or SYSTEM_STEPS.match(core) else "UNRESOLVED"
            details.append({"step": token, "id": "", "result": result})
            continue
        key = master_key(identifier)
        record = master.get(key) if key else None
        if record is None:
            details.append({"step": token, "id": identifier, "result": "ID_NOT_IN_MASTER"})
            continue
        raw = record["raw"]
        skill = raw.get("skill") or ""
        name = master_core(skill)
        prefixed = SYSTEM_PREFIX.sub("", core)
        numeric = numeric_form(token) or (numeric_form(prefixed) if prefixed != core else None)
        alias_key = (aliases or {}).get((key.split(":")[0], core)) or (aliases or {}).get((key.split(":")[0], prefixed))
        if core and core == name:
            result = "NAME_MATCH"
        elif alias_key == key:
            result = "CONFIRMED_ALIAS_MATCH"
        elif prefixed != core and prefixed == name:
            result = "NAME_MATCH_AFTER_SYSTEM_PREFIX"
        elif throw_matches(core, raw):
            result = "THROW_COMMAND_MATCH"
        elif numeric and numeric in command_form(raw.get("command")).split("|"):
            result = "COMMAND_MATCH"
        elif numeric and numeric == command_form(raw.get("command")):
            result = "COMMAND_MATCH"
        elif abbreviation_unique(prefixed, key, master):
            result = "ABBREVIATION_UNIQUE"
        elif core and len(core) >= 2 and (core in name or name in core):
            result = "NAME_PARTIAL"
        else:
            result = "NAME_DIFFERS"
        details.append({"step": token, "id": identifier, "masterKey": key, "masterName": skill, "result": result})
    results = {d["result"] for d in details}
    if results & {"ID_NOT_IN_MASTER", "UNRESOLVED"}:
        return "MISSING", details
    if results <= {"NAME_MATCH", "COMMAND_MATCH", "NAME_MATCH_AFTER_SYSTEM_PREFIX", "THROW_COMMAND_MATCH", "CONFIRMED_ALIAS_MATCH",
                   "ABBREVIATION_UNIQUE", "SYSTEM_STEP"}:
        return "OK", details
    return "REVIEW", details


class Resolver:
    """Resolve a step to a move-master key only when exactly one move fits (no alias guessing)."""

    def __init__(self, master, aliases=None):
        self.master = master
        self.aliases = aliases or {}
        self.by_slug = {}
        for key, record in master.items():
            self.by_slug.setdefault(record["characterSlug"], []).append(key)
        self.cache = {}

    def resolve(self, slug, step):
        slug = SLUG_ALIASES.get(slug, slug)
        cache_key = (slug, step)
        if cache_key in self.cache:
            return self.cache[cache_key]
        keys = self.by_slug.get(slug, [])
        core = step_core(step)
        prefixed = SYSTEM_PREFIX.sub("", core)
        found = self.aliases.get((slug, core)) or self.aliases.get((slug, prefixed))
        for candidate in ((core, prefixed) if found is None else ()):
            exact = [k for k in keys if master_core(self.master[k]["raw"].get("skill")) == candidate]
            if len({master_core(self.master[k]["raw"].get("skill")) for k in exact}) == 1 and len(exact) == 1:
                found = exact[0]
                break
        if found is None:
            numeric = numeric_form(step) or (numeric_form(prefixed) if prefixed != core else None)
            if numeric:
                hits = [k for k in keys if numeric in command_form(self.master[k]["raw"].get("command")).split("|")
                        and not self.master[k]["raw"].get("skill", "").startswith("[")]
                if len(hits) == 1:
                    found = hits[0]
        if found is None and len(prefixed) >= 2:
            names = _names_for(slug, self.master)
            target = abbreviation_target(prefixed, names)
            if target is not None:
                plain = [k for k in names[target] if not self.master[k]["raw"].get("skill", "").startswith("[")]
                if len(plain) == 1:
                    found = plain[0]
        self.cache[cache_key] = found
        return found


# Timing words around a move ("5弱K重ね", "遅らせ強P") that do not change which move it is.
TIMING_PREFIX = re.compile(r"^(?:遅らせ|最速|ディレイ)\s*")
TIMING_SUFFIX = re.compile(r"(?:持続重ね|重ね|空振り|持続当て)$")


def management_id_for(slug, key, master):
    raw = master[key]["raw"]
    command = re.sub(r"\s+", "", unicodedata.normalize("NFKC", raw.get("command") or "")).replace("＋", "+")
    return f"{slug}:{command}:web:{raw['webId']}"


def auto_resolve(slug, steps, resolver, master, split):
    """Fill IDs for every step, or return None. System actions keep an empty ID as in the intake format."""
    ids = []
    for token in split(steps):
        core = step_core(token)
        if not core or SYSTEM_STEPS.match(core) or core in {"キャンセルドライブラッシュ", "パリィドライブラッシュ"}:
            ids.append("")
            continue
        plain = TIMING_SUFFIX.sub("", TIMING_PREFIX.sub("", token.strip()))
        key = resolver.resolve(slug, plain)
        if key is None:
            return None
        ids.append(management_id_for(slug, key, master))
    return " > ".join(ids)


# --- Strict reference check (move-master team's rules + common vocabulary v3) -----------------------
# Allowed: exact official name, numpad -> official command, unique SA level, system action, single-move
# alias. Never: prefix short forms, abbreviations not in the vocabulary, strength-unspecified families.
VOCAB_CONDITION = re.compile(r"(?:pc|ch|パニカン|パニッシュカウンター|カウンターヒット|カウンター|空振り|持続重ね|持続当て|持続|重ね|最速|仕込み"
                             r"|×\d+|x\d+)$")
VOCAB_SYSTEM = {"前方ステップ", "前ステ", "前ステップ", "歩き", "前歩き", "微歩き", "ジャンプ", "前ジャンプ", "垂直ジャンプ",
                "後ろジャンプ", "キャンセルドライブラッシュ", "パリィドライブラッシュ", "ドライブラッシュ", "ラッシュ",
                "cラッシュ", "キャンセルラッシュ", "cdr", "dr", "生ラッシュ", "パリィラッシュ", "ドライブインパクト"}
RUSH_PREFIX_STRICT = re.compile(r"^(?:キャンセルドライブラッシュ|パリィドライブラッシュ|ドライブラッシュ|キャンセルラッシュ|パリィラッシュ"
                                r"|生ラッシュ|cラッシュ|cdr|dr|ラッシュ)(?=.)")


def strict_core(token):
    text = unicodedata.normalize("NFKC", token).casefold()
    text = re.sub(r"[（(][^）)]*[）)]|\[[^\]]*\]", "", text)
    text = re.sub(r"\s+", "", text)
    for _ in range(3):
        text = VOCAB_CONDITION.sub("", text)
    return text


def strict_resolve(slug, token, master, aliases):
    """Return (True, key-or-SYSTEM) or (False, token) under the strict rules."""
    slug = SLUG_ALIASES.get(slug, slug)
    core = strict_core(token)
    if not core or core.startswith("相手の技"):  # the opponent's move is the situation, not a step of ours
        return True, "CONDITION_ONLY"
    # Round6 (move-master team): these are parser gaps, not unidentified moves.
    if re.fullmatch(r"di(?:壁|pc|壁やられ)?", core):
        return True, "SYSTEM"  # ドライブインパクト略記（＋条件）
    if core in ("ガード", "ガードさせる"):
        return True, "SYSTEM"  # 防御のシステム行動
    exact = [k for k, r in master.items() if r["characterSlug"] == slug and not (r["raw"].get("skill") or "").startswith("[")
             and re.sub(r"\s+", "", unicodedata.normalize("NFKC", r["raw"].get("skill") or "")).casefold()
             == re.sub(r"\s+", "", unicodedata.normalize("NFKC", RUSH_PREFIX_STRICT.sub("", re.sub(r"(?:pc|ch|パニカン)$", "",
                 unicodedata.normalize("NFKC", token).casefold().replace(" ", ""))))).casefold()]
    if len(exact) == 1:
        return True, exact[0]  # official name including its bracketed variant (ホールド/ジャスト/段)
    if core in ("前投げ", "後ろ投げ", "後投げ"):
        hits = [k for k, r in master.items() if r["characterSlug"] == slug and throw_matches(core, r["raw"])]
        if len(hits) == 1:
            return True, hits[0]  # 公式コマンド（N or 6 / 4 + LPLK）で一意
    if core in VOCAB_SYSTEM:
        return True, "SYSTEM"
    core = RUSH_PREFIX_STRICT.sub("", core)
    if core in VOCAB_SYSTEM:
        return True, "SYSTEM"
    names = _names_for(slug, master)
    plain_name = step_core(core)  # notation-only normalisation (2弱P = しゃがみ弱P); no prefix matching
    keys = [k for name, ks in names.items() if name == plain_name for k in ks
            if not master[k]["raw"].get("skill", "").startswith("[")]
    if len(keys) == 1:
        return True, keys[0]
    key = aliases.get((slug, step_core(token))) or aliases.get((slug, core))
    if key:
        return True, key
    numeric = numeric_form(core) if re.match(r"^(?:[1-9↓↙←↘→↗↑↖]|前|後ろ|後|下)", core) else None  # 方向語→テンキー
    if numeric:
        hits = [k for k, r in master.items() if r["characterSlug"] == slug and not r["raw"].get("skill", "").startswith("[")
                and numeric in command_form(r["raw"].get("command")).split("|")]
        if len(hits) == 1:
            return True, hits[0]
    level = re.fullmatch(r"(sa[123]|ca)", core)
    if level:
        hits = [k for name, ks in names.items() if name.startswith(level.group(1)) and "lv" not in name for k in ks
                if not master[k]["raw"].get("skill", "").startswith("[")]
        if len(hits) == 1:
            return True, hits[0]
    return False, token
