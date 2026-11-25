"""Candidate DB change set: the 2026-11-24 official frame tables (2,672 rows) through the EXISTING public gate.

No gate is relaxed. A card is shown only when, as today: character published+playable / move published /
an input command with an official source / one verified frame on the site's current patch with an official
source / official source on the move / a grant in CHARACTER_PRODUCTION_RELEASE_APPROVAL.json bound by factDigest.
The site's current patch is NOT switched: the 2026-11-24 values are stored with official_checked_on=2026-11-24 and
version_status='unconfirmed', and the card says so.

Rows without a Classic input (139) are split by what the official table itself says:
  modern_only     Classic table has no row, Modern table gives the move's own input -> Modern command, grant
                  marked commandScheme=modern_only
  condition_only  listed in the Classic table with an empty / "-" input cell: no own input; the card states that
                  and the official row name's part label (e.g. 2段目, 射出) as the condition
  unidentified    not on the official table pages at all (internal data rows without webId): input/condition
                  cannot be identified -> kept as draft, reported with its row ID
First release scope: only rows on the official frame table PAGES (Classic or Modern table, or the Ryu/JP page table).
Rows that exist only in the page's embedded data (no webId, not on either table) are kept as draft whatever their input.
Damage written with a mark ("※1100", "2200※1850") is never turned into a number: damage stays NULL and the official
notation and the "※" lines of the official note are stored as written.

Identity with existing move IDs (only confirmed links; anything else becomes a separate draft/new move):
  1 reviewed TXT-key link (R15 overlay / R17 links)          2 exact normalized name, one-to-one
  3 exact name with duplicates: one unique best value match (>=3 values)
  4 name without bracketed sub-name / SA-CA prefix, one-to-one, startup and >=3 values equal
  5 Prod-only moves (read-only Prod query): exact name one-to-one with every listed official value equal, or rule 4

Inputs (read-only): --official-dir (5 official CSVs), --fill, --fixture, --links, --prod-pairs
Outputs (--out): base.sql (isolated prod-like start), candidate.sql, rows.csv, diff.csv
"""
import argparse, csv, hashlib, json, re, unicodedata, uuid
from collections import defaultdict
from pathlib import Path

CHARS = {  # slug: (id, name_ja, display_order) - Prod characters table, read 2026-11-25
 "ryu":("9c3a7aaa-e090-40a6-b598-f63afb761b77","リュウ",1),"luke":("1e4e3f57-7ba0-454c-86d7-72b1deeb3713","ルーク",2),
 "jamie":("558f125c-3ddf-472c-9a15-7f9ce20c9580","ジェイミー",3),"chun-li":("8c5af70c-2e6a-4b6d-9e26-23c93c04c368","春麗",4),
 "guile":("dd1e6234-2542-4b70-8323-25818c5893cf","ガイル",5),"kimberly":("f4b6f449-6a81-47ba-be5b-196816c4c7f5","キンバリー",6),
 "juri":("e0b0bea4-b4b2-445f-b273-3a73e1c18827","ジュリ",7),"ken":("08c7dec3-a3b8-403e-92e0-488fab6afdfb","ケン",8),
 "blanka":("40b89dd5-38ba-4157-8f5f-0c4202c7d6aa","ブランカ",9),"dhalsim":("0e62ecec-f601-4859-86a6-3b968372a519","ダルシム",10),
 "e-honda":("9e31dc2b-b281-4c39-b9f8-45af62a8117e","エドモンド本田",11),"dee-jay":("62679029-3025-45b2-8e3f-a4a6d119485e","ディージェイ",12),
 "manon":("efc5d359-27ec-4660-937c-dc0d84e862f8","マノン",13),"marisa":("e224c371-84b8-4bf4-bde9-3b65d8d8a3b9","マリーザ",14),
 "jp":("87077ba6-e9da-48b7-b3bd-2499ea4f6d86","JP",15),"zangief":("459e874a-1b6e-4a3e-9b9a-86fcb31df559","ザンギエフ",16),
 "lily":("b004c66a-f5ad-483c-a163-21773223024a","リリー",17),"cammy":("08c200c1-c205-4934-9184-8b85a06bc7e5","キャミィ",18),
 "rashid":("56ed72aa-20ba-4c21-9bfd-c367cc40ca7d","ラシード",19),"aki":("92aa12c9-d4b0-4384-9ef8-a6d1d0115989","A.K.I.",20),
 "ed":("c11bc1ca-6c91-41de-9700-2ea9de8f719e","エド",21),"akuma":("4b6afb51-f50e-48cf-9115-896b5f4a5042","豪鬼",22),
 "m-bison":("2f694c43-640b-43f1-b79a-d00beff0ad2b","ベガ",23),"terry":("60875143-700c-4734-bfca-0eb3d20764c4","テリー",24),
 "mai":("c0bad241-355d-492d-9868-f69e311cac0f","不知火舞",25),"elena":("f5a76b4e-cd2c-44e6-9b09-d3f1f0e82f9d","エレナ",26),
 "sagat":("1d9817cf-beb9-497c-a77f-c08a4a2e9ac2","サガット",27),"c-viper":("77f7116b-8d7e-4cc0-885b-7b5a3ac27f3b","C.ヴァイパー",28),
 "alex":("0a82075f-b2c3-4a3d-9267-89f3da1543dd","アレックス",29),"ingrid":("57c3cd53-a5c1-4c3a-a933-6b2efa3b8378","イングリッド",30),
 "yasmine":("a9f61f3f-d6e0-4f98-8f1f-6fb94fae7baa","ヤスミン",31),"arjun":("d8d0fac8-c6af-485f-89b6-b3593ff1d38c","アルジュン",32),
}
CURRENT_PATCH = "ecff9a58-d023-43ae-9962-79d25adfc1f3"  # Prod is_current (2026.08.03); not changed
CHECKED_ON = "2026-11-24"
AUTO = re.compile(r"^（(.+自動派生)）$")
AUTO_TEXT = "自動派生（個別入力なし）"
NO_OWN_INPUT = "個別入力なし"
NO_INPUT = {"", "-", "－", "―", "　", "（モダン表に行なし）", "（クラシック表に行なし）"}
FRAME_FIELDS = (("startup", "startup"), ("active", "active"), ("recovery", "recovery"), ("on_hit", "onHit"), ("on_block", "onBlock"))
NS = uuid.UUID("6f1e2d3c-4b5a-4968-8776-655443322110")
JA = {"C.ヴァイパー": "c-viper", "ディージェイ": "dee-jay", "舞": "mai", "エレナ": "elena", "豪鬼": "akuma", "マリーザ": "marisa",
      "ブランカ": "blanka", "キンバリー": "kimberly", "ダルシム": "dhalsim", "ガイル": "guile", "ラシード": "rashid", "キャミィ": "cammy",
      "アレックス": "alex", "ヤスミン": "yasmine", "春麗": "chun-li", "ケン": "ken", "ベガ": "m-bison", "アルジュン": "arjun", "サガット": "sagat",
      "イングリッド": "ingrid", "リリー": "lily", "エド": "ed", "ザンギエフ": "zangief", "エドモンド本田": "e-honda", "テリー": "terry",
      "A.K.I.": "aki", "マノン": "manon", "ジェイミー": "jamie", "ルーク": "luke", "ジュリ": "juri"}
CSV27 = ("SF6DNA_27CHAR_OFFICIAL_MOVES_ALL_20261124.csv", "SF6DNA_JAMIE_OFFICIAL_MOVES_20261124.csv",
         "SF6DNA_LUKE_OFFICIAL_MOVES_20261124.csv", "SF6DNA_JURI_OFFICIAL_MOVES_20261124.csv")
RYUJP = "SF6DNA_RYU_JP_OFFICIAL_MOVES_20261124.csv"

# Move RLS (private.is_move_public_ready): unchanged except that an official Modern command is accepted when the
# move has no official Classic command (the official Classic table has no row). Preflight: only replace a known body.
KNOWN_READY_MD5 = ("e14ace8a58afde9d681915d6fe194c29", "3053fa72f8dcb1bdc7c373c033eeed54")  # Prod live / repo chain
READY_FN = """create or replace function private.is_move_public_ready(target_move_id uuid)
 returns boolean language sql stable security definer set search_path to 'public'
as $function$
  select
    (exists (
      select 1 from public.move_commands mc
      join public.entity_sources es on es.entity_type = 'move_command' and es.entity_id = mc.id
      join public.sources s on s.id = es.source_id
      where mc.move_id = target_move_id and mc.control_scheme = 'classic' and s.reliability_level = 'official')
     or (exists (
      select 1 from public.move_commands mc
      join public.entity_sources es on es.entity_type = 'move_command' and es.entity_id = mc.id
      join public.sources s on s.id = es.source_id
      where mc.move_id = target_move_id and mc.control_scheme = 'modern' and s.reliability_level = 'official')
     and not exists (
      select 1 from public.move_commands mc
      join public.entity_sources es on es.entity_type = 'move_command' and es.entity_id = mc.id
      join public.sources s on s.id = es.source_id
      where mc.move_id = target_move_id and mc.control_scheme = 'classic' and s.reliability_level = 'official')))
    and exists (
      select 1 from public.entity_sources es join public.sources s on s.id = es.source_id
      where es.entity_type = 'move' and es.entity_id = target_move_id and s.reliability_level = 'official')
    and exists (
      select 1 from public.move_frame_data f join public.patches p on p.id = f.valid_from_patch_id
      where f.move_id = target_move_id and f.verification_status = 'verified' and f.valid_to_patch_id is null and p.is_current = true
        and exists (select 1 from public.entity_sources es join public.sources s on s.id = es.source_id
                    where es.entity_id = f.id and es.entity_type in ('frame','move_frame_data') and s.reliability_level = 'official'));
$function$;"""
ROLLBACK_READY_FN = """create or replace function private.is_move_public_ready(target_move_id uuid)
 returns boolean language sql stable security definer set search_path to 'public'
as $function$
  select
    exists (
      select 1
      from public.move_commands mc
      join public.entity_sources es on es.entity_type = 'move_command' and es.entity_id = mc.id
      join public.sources s on s.id = es.source_id
      where mc.move_id = target_move_id
        and mc.control_scheme = 'classic'
        and s.reliability_level = 'official'
    )
    and exists (
      select 1
      from public.entity_sources es
      join public.sources s on s.id = es.source_id
      where es.entity_type = 'move'
        and es.entity_id = target_move_id
        and s.reliability_level = 'official'
    )
    and exists (
      select 1
      from public.move_frame_data f
      join public.patches p on p.id = f.valid_from_patch_id
      where f.move_id = target_move_id
        and f.verification_status = 'verified'
        and f.valid_to_patch_id is null
        and p.is_current = true
        and exists (
          select 1
          from public.entity_sources es
          join public.sources s on s.id = es.source_id
          where es.entity_id = f.id
            and es.entity_type in ('frame','move_frame_data')
            and s.reliability_level = 'official'
        )
    );
$function$;"""


def uid(*parts):
    return str(uuid.uuid5(NS, ":".join(parts)))


def nname(text):
    return re.sub(r"\s", "", unicodedata.normalize("NFKC", text or ""))


def base_key(name):
    t = nname(name)
    ca = bool(re.match(r"^CA", t) or "(CA)" in t)
    t = re.sub(r"\([^()]*\)", "", t)
    return re.sub(r"^(SA[0-9]|CA)", "", t), ca


def val(v):
    return unicodedata.normalize("NFKC", str(v if v is not None else "")).strip().lstrip("+")


def q(value):
    return "null" if value is None else "'" + str(value).replace("'", "''") + "'"


def frame_text(value):
    if not value:
        return None
    return "—" if value == "NA" else value


def official_raw(directory):
    """Same row order and hash as scripts/moves/build_all32_official_move_fill.py, plus the cells needed here."""
    rows = []
    for name in CSV27:
        for r in csv.DictReader((directory / name).open(encoding="utf-8-sig")):
            rows.append({"char": JA[r["キャラ"]], "webId": r["公式webId"], "name": r["公式技名"], "file": name,
                         "classic": r["Classic入力（公式）"], "modern": r["Modern入力（公式）"],
                         "classicListed": r.get("Classic表に掲載", ""), "modernListed": r.get("Modern表に掲載", ""),
                         "note": r.get("公式備考", ""), "damage": r["ダメージ（Classic）"]})
    for r in csv.DictReader((directory / RYUJP).open(encoding="utf-8-sig")):
        rows.append({"char": r["character"], "webId": "", "name": r["official_name"], "file": RYUJP,
                     "classic": r["classic_input"], "modern": r["modern_input"], "classicListed": "", "modernListed": "",
                     "note": r["notes_official"], "damage": r["damage"]})
    out = defaultdict(list)
    for char in sorted({r["char"] for r in rows}):
        for index, row in enumerate(r for r in rows if r["char"] == char):
            row["h"] = hashlib.sha256((row["file"] + row["webId"] + row["name"] + str(index)).encode()).hexdigest()[:12]
            out[char].append(row)
    return out


def on_official_page(raw):
    """Listed on the official frame table page (Classic or Modern table); the Ryu/JP CSV was read from the page table."""
    return raw["file"] == RYUJP or raw["classicListed"] != "掲載なし" or raw["modernListed"] != "掲載なし"


OFF_PAGE_REASON = "公式フレーム表のページに掲載なし（公式データ内部の行）：初回公開は公式ページ掲載分のみ"


def classify(raw):
    """Classic present / modern_only / condition_only / unidentified, from the official table cells only."""
    classic, modern = raw["classic"].strip(), raw["modern"].strip()
    if classic not in NO_INPUT:
        return "classic", None
    classic_row_missing = raw["classicListed"] == "掲載なし" or raw["classic"].strip() == "（クラシック表に行なし）"
    if classic_row_missing and modern not in NO_INPUT:
        return "modern_only", None
    part = re.findall(r"[（(]([^（）()]+)[）)]\s*$", raw["name"].strip())
    if raw["classicListed"] == "あり" and part:
        cell = "「-」" if raw["classic"].strip() == "-" else "空欄"
        return "condition_only", f"公式表の入力欄は{cell}。公式技名に記載の区分：{part[-1]}"
    reason = ("公式フレーム表のページに行がない（公式データ内部の行・webIdなし）" if raw["classicListed"] == "掲載なし" and raw["modernListed"] == "掲載なし"
              else "公式表の入力欄が空欄で、技名にも区分の記載がない")
    return "unidentified", reason


def split_leading_condition(text):
    """A leading condition that itself contains parentheses, e.g. "（キルステップ（前方）中に）6 + LP | MP | HP", is moved whole
    to the condition cell (the card's own parser stops at the inner "）"). Other inputs are returned unchanged."""
    if not text.startswith("（"):
        return text, None
    depth = 0
    for i, ch in enumerate(text):
        depth += ch == "（"
        depth -= ch == "）"
        if depth == 0:
            inner = text[1:i]
            return (text[i + 1:].strip(), inner) if "（" in inner else (text, None)
    return text, None


def damage_notation(raw):
    """(int damage, official text, official condition). A marked value stays text; NaN or unclear values are never numbers."""
    d = unicodedata.normalize("NFKC", raw["damage"] or "").strip()
    if re.fullmatch(r"\d+", d):
        return int(d), None, None
    if "※" not in d:
        return None, None, None
    segments = [x.strip() for x in re.split(r"[／]", raw["note"] or "") if x.strip()]
    if len(segments) <= 1:  # Ryu/JP notes are space separated
        segments = re.split(r"\s+(?=※)", (raw["note"] or "").strip())
    groups, follow = [], False  # a "※" line plus the lines that continue it (・…, メダルLv…, （）内は…)
    for seg in segments:
        if seg.startswith("※"):
            groups.append([seg]); follow = True
        elif follow and re.match(r"^(・|メダルLv\d|（）内は)", seg):
            groups[-1].append(seg)
        else:
            follow = False
    damage_groups = [g for g in groups if any("ダメージ" in x for x in g)]
    picked = [x for g in (damage_groups or groups) for x in g]
    return None, raw["damage"].strip(), "／".join(picked) or None


def link_existing(slug, rows, existing, key_links, prod_pairs):
    """Official row hash -> (existing move id, basis). Only confirmed links (see module doc)."""
    out, used = {}, set()
    by_id = {m["id"]: m for m in existing}
    def score(m, r):
        f = m.get("frame") or {}
        return sum(1 for a, b in (("startup", "startup"), ("onBlock", "onBlock"), ("onHit", "onHit"), ("damage", "damage"))
                   if r["v"].get(b) and val(f.get(a)) == val(r["v"].get(b)))
    def take(r, mid, basis):
        out[r["h"]] = (mid, basis); used.add(mid)
    for r in rows:  # 1
        for mid, key in key_links.items():
            if r["k"] and key == r["k"] and mid in by_id and mid not in used:
                take(r, mid, "reviewed TXT-key link"); break
    def free_rows():
        return [r for r in rows if r["h"] not in out]
    for keyf, label in ((nname, "exact name"), (lambda n: base_key(n), "name without sub-name/prefix")):
        groups_o, groups_e = defaultdict(list), defaultdict(list)
        for r in free_rows():
            groups_o[keyf(r["n"])].append(r)
        for m in existing:
            if m["id"] not in used:
                groups_e[keyf(m["name"])].append(m)
        for k, rs in groups_o.items():
            ms = groups_e.get(k, [])
            if not ms:
                continue
            if label == "exact name" and len(rs) == 1 and len(ms) == 1:  # 2
                take(rs[0], ms[0]["id"], "exact name one-to-one"); continue
            for r in rs:  # 3 / 4
                cands = [m for m in ms if m["id"] not in used]
                if not cands:
                    break
                scored = sorted(((score(m, r), m) for m in cands), key=lambda x: -x[0])
                best, m = scored[0]
                unique = len(scored) == 1 or scored[1][0] < best
                startup = bool(r["v"].get("startup")) and val((m.get("frame") or {}).get("startup")) == val(r["v"]["startup"])
                if label == "exact name" and best >= 3 and unique:
                    take(r, m["id"], "exact name, unique value match")
                elif label != "exact name" and len(rs) == 1 and len(cands) == 1 and startup and best >= 3:
                    take(r, m["id"], "name without sub-name/prefix, startup and >=3 values")
    # 5: Prod-only moves (not in the fixture), from the read-only Prod query
    by_h = {r["h"]: r for r in rows}
    cand = defaultdict(list)
    for c, mid, h, sc, pname in prod_pairs:  # the row hash is per character only: always compare within the character
        if c == slug and h in by_h and by_h[h]["h"] not in out and mid not in used:
            cand[h].append((mid, sc, pname))
    per_mid = defaultdict(set)
    for h, lst in cand.items():
        for mid, sc, pname in lst:
            if nname(pname) == nname(by_h[h]["n"]):
                per_mid[mid].add(h)
    for h, lst in cand.items():
        r = by_h[h]
        present = sum(1 for b in ("startup", "onBlock", "onHit", "damage") if r["v"].get(b))
        exact = [(mid, sc) for mid, sc, pname in lst if nname(pname) == nname(r["n"])]
        if len(exact) == 1 and per_mid[exact[0][0]] == {h} and exact[0][1] == present and present >= 2 and exact[0][0] not in used:
            take(r, exact[0][0], "Prod-only move: exact name one-to-one, every listed value equal")
        elif len(lst) == 1 and lst[0][1] >= 3 and lst[0][0] not in used:
            take(r, lst[0][0], "Prod-only move: name without sub-name/prefix, startup and >=3 values")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--official-dir", required=True, type=Path); ap.add_argument("--fill", required=True)
    ap.add_argument("--fixture", required=True); ap.add_argument("--links", nargs="*", default=[])
    ap.add_argument("--prod-pairs", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--screen-recheck", help="official frame-table screen values that differ from the embedded data (scripts/moves/official_screen_recheck_20261125.json)")
    ap.add_argument("--review", help="official command-list review of the off-page rows (scripts/moves/offpage33_official_review_20261125.json)")
    a = ap.parse_args()
    fill = json.load(open(a.fill, encoding="utf-8"))["byCharacter"]
    fixture = json.load(open(a.fixture, encoding="utf-8"))["characters"]
    raw = official_raw(a.official_dir)
    prod_pairs = json.load(open(a.prod_pairs, encoding="utf-8"))["pairs"]
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    review = json.load(open(a.review, encoding="utf-8")) if a.review else {"mergeInto": {}, "holdUnconfirmed": [], "supplementCondition": {}}
    screen = json.load(open(a.screen_recheck, encoding="utf-8"))["frameScreenValues"] if a.screen_recheck else {}
    assert set(fill) == set(CHARS) == set(raw), set(fill) ^ set(CHARS)
    for c in fill:
        assert [r["h"] for r in fill[c]] == [r["h"] for r in raw[c]], c
    key_links = {}
    for path in a.links:
        data = json.load(open(path, encoding="utf-8"))
        for mid, value in (data.get("links") or {}).items():
            key_links.setdefault(mid, value)
        for mid, fields in (data.get("byMoveId") or {}).items():
            keys = {v.get("txtKey") for v in fields.values() if isinstance(v, dict)} - {None}
            if len(keys) == 1:
                key_links.setdefault(mid, keys.pop())

    base = ["-- ISOLATED VERIFICATION ONLY: prod-like starting state (no publication). Not for any shared DB.", "begin;",
            f"insert into patches(id,version_label,name,is_current) values ({q(CURRENT_PATCH)},'2026.08.03','2026.08.03 全体バトルバランス調整',true);"]
    prod_only = {}
    for c, mid, h, sc, pname in prod_pairs:
        prod_only.setdefault(mid, (c, pname))
    for slug, (cid, name, order) in CHARS.items():
        status, playable = ("draft", "false") if slug == "arjun" else ("published", "true")
        base.append(f"insert into characters(id,slug,name_ja,is_playable,status,display_order) values ({q(cid)},{q(slug)},{q(name)},{playable},{q(status)},{order});")
        fixture_ids = set()
        for i, m in enumerate(fixture.get(slug, {}).get("moves", [])):
            fixture_ids.add(m["id"])
            base.append(f"insert into moves(id,character_id,slug,name_ja,move_type,status,display_order) values ({q(m['id'])},{q(cid)},{q(m['slug'])},{q(m['name'])},{q(m['moveType'])},'draft',{i});")
            for c in m.get("commands", []):
                if c["scheme"] == "classic":
                    base.append(f"insert into move_commands(id,move_id,control_scheme,command_text,numeric_notation,sort_order) values ({q(uid('base-cmd', m['id']))},{q(m['id'])},'classic',{q(c['commandText'] or '-')},{q(c['numericNotation'])},0);")
            f = m.get("frame") or {}
            base.append(f"insert into move_frame_data(id,move_id,startup,active,recovery,on_hit,on_block,damage,valid_from_patch_id,verification_status) values ({q(uid('base-frame', m['id']))},{q(m['id'])},{q(f.get('startup'))},{q(f.get('active'))},{q(f.get('recovery'))},{q(f.get('onHit'))},{q(f.get('onBlock'))},{q(f.get('damage')) if isinstance(f.get('damage'), int) else 'null'},{q(CURRENT_PATCH)},'verified');")
        for mid, (c, pname) in prod_only.items():  # Prod-only moves seen in the read-only query (draft, values not copied)
            if c == slug and mid not in fixture_ids:
                base.append(f"insert into moves(id,character_id,slug,name_ja,move_type,status,display_order) values ({q(mid)},{q(cid)},{q(slug + '-prod-only-' + mid[:8])},{q(pname)},'drive','draft',900);")
    base.append("commit;")
    (out / "base.sql").write_text("\n".join(base) + "\n", encoding="utf-8")

    cand = ["-- SF6DNA candidate change set (2026-11-24 official frame tables -> existing public gate). NOT APPLIED to any shared DB.",
            "-- Order: after 20261120115000 (required: anon command reads) / 116000 / 120000. Site current patch is NOT changed.",
            "begin;",
            "-- 1) additive, nullable evidence columns (no existing row changes meaning; rollback = drop these columns)",
            "alter table public.move_frame_data add column if not exists official_checked_on date, add column if not exists version_status text,"
            " add column if not exists damage_official_text text, add column if not exists damage_official_condition text;",
            "do $c$ begin if not exists (select 1 from pg_constraint where conname='move_frame_data_version_status_check') then"
            " alter table public.move_frame_data add constraint move_frame_data_version_status_check check (version_status is null or version_status in ('confirmed','unconfirmed')); end if; end $c$;",
            "comment on column public.move_frame_data.version_status is 'unconfirmed: values from an official table that states no game version (card shows the check date)';",
            "comment on column public.move_frame_data.damage_official_text is 'official damage notation kept as written when it is not a plain number (e.g. ※1100)';",
            "-- 2) move RLS: accept an official Modern command only where no official Classic command exists",
            "do $p$ begin if md5(pg_get_functiondef('private.is_move_public_ready'::regproc)) not in ("
            + ",".join(q(m) for m in KNOWN_READY_MD5) + ") then raise exception 'is_move_public_ready differs from the known body: abort'; end if; end $p$;",
            READY_FN,
            f"update characters set status='published', is_playable=true where id = {q(CHARS['arjun'][0])};"]
    report, diff = [], []
    for slug, rows in fill.items():
        cid = CHARS[slug][0]
        url = next((r["u"] for r in rows if r["u"]), f"https://www.streetfighter.com/6/ja-jp/character/{slug}/frame")
        sid = uid("source", slug)
        cand.append(f"insert into sources(id,title,url,source_type,publisher,accessed_at,reliability_level,notes) values ({q(sid)},{q('CAPCOM 公式フレームデータ（' + CHARS[slug][1] + '・' + CHECKED_ON + '確認）')},{q(url)},'official_frame_data','CAPCOM','{CHECKED_ON}T00:00:00Z','official','表に版の記載なし（対応バージョン未確定）');")
        existing = fixture.get(slug, {}).get("moves", []) + [{"id": mid, "name": pname, "frame": None, "slug": None}
                                                               for mid, (c, pname) in prod_only.items() if c == slug and mid not in {m["id"] for m in fixture.get(slug, {}).get("moves", [])}]
        links = link_existing(slug, rows, existing, key_links, prod_pairs)
        used = {mid for mid, _ in links.values()}
        for order, (row, rr) in enumerate(zip(rows, raw[slug])):
            linked = links.get(row["h"])
            mid = linked[0] if linked else uid("move", slug, row["h"])
            kind, reason = classify(rr)
            on_page = on_official_page(rr)
            publish = on_page and kind in ("classic", "modern_only", "condition_only")
            row_id = row["k"] or f"{slug}:{row['h']}"
            if not on_page and row_id in review["mergeInto"]:
                held_reason = f"公式コマンドリスト・フレーム表で既存カード {review['mergeInto'][row_id]} と同じ技と確認：別カードにせず統合"
            elif not on_page and row_id in review["holdUnconfirmed"]:
                held_reason = "公式コマンドリスト・フレーム表のどちらにも記載なし（確認できず）：保留"
            else:
                held_reason = "" if publish else (OFF_PAGE_REASON if not on_page else reason)
            if not linked:
                cand.append(f"insert into moves(id,character_id,slug,name_ja,move_type,status,display_order) values ({q(mid)},{q(cid)},{q(slug + '-official-20261124-' + row['h'])},{q(row['n'])},{q(row['t'])},'draft',{1000 + order});")
            cand.append(f"update moves set status={q('published' if publish else 'draft')}, display_order={1000 + order} where id={q(mid)};")
            cand.append(f"update move_frame_data set valid_to_patch_id={q(CURRENT_PATCH)} where move_id={q(mid)} and valid_to_patch_id is null;")
            fid = uid("frame", slug, row["h"])
            dmg, dtext, dcond = damage_notation(rr)
            values = dict(row["v"])
            for field, fix in screen.get(f"{slug}:{row['h']}" if not row["k"] else row["k"], {}).items():
                assert values.get(field) == fix["internal"], (row["k"], field, values.get(field))
                values[field] = fix["screen"]  # the official table's screen value wins over the embedded data
            vals = ",".join(q(frame_text(values.get(src))) for _, src in FRAME_FIELDS)
            cand.append(f"insert into move_frame_data(id,move_id,startup,active,recovery,on_hit,on_block,damage,damage_official_text,damage_official_condition,official_checked_on,version_status,valid_from_patch_id,verification_status) values ({q(fid)},{q(mid)},{vals},{'null' if dmg is None else dmg},{q(dtext)},{q(dcond)},'{CHECKED_ON}','unconfirmed',{q(CURRENT_PATCH)},'verified');")
            cand.append(f"insert into entity_sources(entity_type,entity_id,source_id,relationship) values ('move',{q(mid)},{q(sid)},'primary'),('move_frame_data',{q(fid)},{q(sid)},'primary');")
            command = None
            if kind == "classic":
                text = row["i"]["classic"]
                m = AUTO.match(text)
                if m:
                    command = ("classic", AUTO_TEXT, m.group(1))
                else:
                    ctext, ccond = split_leading_condition(text)
                    command = ("classic", ctext, ccond)
            elif kind == "modern_only":
                command = ("modern", rr["modern"].strip(), None)
            elif kind == "condition_only":
                command = ("classic", NO_OWN_INPUT, reason)
            extra = review["supplementCondition"].get(row_id, []) if publish else []
            if command and extra:
                kept = [x for x in (command[2] or "").split("／") if x]
                command = (command[0], command[1], "／".join(kept + [x for x in extra if x not in kept]))
            if command:
                cmd = uid("cmd", slug, row["h"])
                cand.append(f"insert into move_commands(id,move_id,control_scheme,command_text,condition_text,sort_order) values ({q(cmd)},{q(mid)},{q(command[0])},{q(command[1])},{q(command[2])},0);")
                cand.append(f"insert into entity_sources(entity_type,entity_id,source_id,relationship) values ('move_command',{q(cmd)},{q(sid)},'primary');")
            report.append({"rowId": row["k"] or f"{slug}:{row['h']}", "character": slug, "hash": row["h"], "name": row["n"], "moveId": mid,
                           "identity": linked[1] if linked else "new move (no confirmed existing ID)", "kind": kind,
                           "command": f"{command[0]}: {command[1]}" if command else "", "condition": (command[2] or "") if command else "",
                           "onOfficialPage": "yes" if on_page else "no",
                           "published": "yes" if publish else "no", "heldReason": held_reason,
                           "damageText": dtext or "", "damageCondition": dcond or "",
                           "officialSupplement": "／".join(extra),
                           "screenCorrection": "／".join(f"{k}: {v['internal']} -> {v['screen']}" for k, v in screen.get(row["k"] or "", {}).items())})
        for m in existing:
            if m["id"] not in used:
                diff.append({"character": slug, "moveId": m["id"], "name": m["name"],
                             "origin": "fixture (in Prod)" if m.get("slug") else "Prod-only",
                             "handling": "kept as draft: identity with a 2026-11-24 row not confirmed; not shown, not deleted"})
    assert len({r["moveId"] for r in report}) == len(report), "one official row per move ID"
    ids = {r["rowId"] for r in report}
    assert set(review["mergeInto"]) <= ids and set(review["mergeInto"].values()) <= {r["rowId"] for r in report if r["published"] == "yes"}
    assert set(screen) <= {r["rowId"] for r in report if r["published"] == "yes"}
    assert set(review["holdUnconfirmed"]) <= ids and set(review["supplementCondition"]) <= set(review["mergeInto"].values())
    linked_ids = sorted(r["moveId"] for r in report if not r["identity"].startswith("new"))
    new_ids = sorted(r["moveId"] for r in report if r["identity"].startswith("new"))
    preflight = ("do $pre$ begin"
                 f" if (select count(*) from public.patches where is_current) <> 1 or not exists (select 1 from public.patches where id = {q(CURRENT_PATCH)} and is_current)"
                 " then raise exception 'current patch differs: abort'; end if;"
                 f" if (select count(*) from public.characters where id in ({','.join(q(v[0]) for v in CHARS.values())})) <> {len(CHARS)}"
                 " then raise exception 'character ids differ: abort'; end if;"
                 f" if (select count(*) from public.moves where id = any(array[{','.join(q(i) for i in linked_ids)}]::uuid[])) <> {len(linked_ids)}"
                 " then raise exception 'linked existing move ids missing: abort'; end if;"
                 f" if exists (select 1 from public.moves where id = any(array[{','.join(q(i) for i in new_ids)}]::uuid[]))"
                 " then raise exception 'new move ids already present (already applied?): abort'; end if;"
                 " end $pre$;")
    cand.insert(cand.index("begin;") + 1, "-- 0) preflight: abort unless the target matches what this change set was generated for")
    cand.insert(cand.index("begin;") + 2, preflight)
    cand.append("commit;")
    (out / "candidate.sql").write_text("\n".join(cand) + "\n", encoding="utf-8")
    (out / "rollback.sql").write_text("\n".join([
        "-- Rollback of candidate.sql (data rows it added are identified by the deterministic IDs in rows.csv).",
        "begin;",
        "-- restore the Prod-live move RLS body (md5 e14ace8a58afde9d681915d6fe194c29)",
        ROLLBACK_READY_FN,
        "update moves set status='draft' where id in (" + ",".join(q(r["moveId"]) for r in report) + ");",
        f"update characters set status='draft', is_playable=false where id = {q(CHARS['arjun'][0])};",
        "delete from entity_sources where source_id in (" + ",".join(q(uid("source", c)) for c in CHARS) + ");",
        "delete from move_commands where id in (" + ",".join(q(uid("cmd", r["character"], r["hash"])) for r in report) + ");",
        "delete from move_frame_data where id in (" + ",".join(q(uid("frame", r["character"], r["hash"])) for r in report) + ");",
        f"update move_frame_data set valid_to_patch_id = null where valid_to_patch_id = {q(CURRENT_PATCH)} and valid_from_patch_id = {q(CURRENT_PATCH)};",
        "delete from moves where id in (" + ",".join(q(r["moveId"]) for r in report if r["identity"].startswith("new")) + ");",
        "delete from sources where id in (" + ",".join(q(uid("source", c)) for c in CHARS) + ");",
        "alter table public.move_frame_data drop constraint if exists move_frame_data_version_status_check, drop column if exists official_checked_on,"
        " drop column if exists version_status, drop column if exists damage_official_text, drop column if exists damage_official_condition;",
        "commit;"]) + "\n", encoding="utf-8")
    for name, data in (("rows.csv", report), ("diff.csv", diff)):
        with (out / name).open("w", encoding="utf-8-sig", newline="") as fh:
            w = csv.DictWriter(fh, fieldnames=list(data[0])); w.writeheader(); w.writerows(data)
    count = lambda k, v: sum(1 for r in report if r[k] == v)
    print(json.dumps({"officialRows": len(report), "published": count("published", "yes"), "classic": count("kind", "classic"),
                      "modern_only": count("kind", "modern_only"), "condition_only": count("kind", "condition_only"),
                      "unidentified": count("kind", "unidentified"), "linkedExisting": sum(1 for r in report if not r["identity"].startswith("new")),
                      "existingNotLinked": len(diff), "markedDamage": sum(1 for r in report if r["damageText"])}, ensure_ascii=False))


if __name__ == "__main__":
    main()
