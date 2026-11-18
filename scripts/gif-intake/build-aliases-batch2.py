#!/usr/bin/env python3
"""別表記16本(Manon5 / JP7 / Luke3 / Juri1)の技ID対応表を生成する(読み取り専用の静的照合)。

入力(すべて既存ファイルを読むだけ。書き換えない):
  - v2-web/src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json  公開用データ
  - v2-web/src/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json 公式コマンド一覧
  - scripts/gif-intake/remaining-53-classification-20261116.json   対象16本の正本候補
  - scripts/gif-intake/asset-inspection-38-20261116.json           素材SHA-256など
出力(新規ファイルのみ):
  - v2-web/src/data/gif-intake/move-aliases-batch2.ts
  - scripts/gif-intake/move-aliases-batch2-20261116.json (同内容 + 照合の内訳)

判定ルール(名前だけ・コマンドだけの一致は自動確定しない):
  MATCHED_STATIC  : 区分タグ(弱/中/強/OD/SA)が一致 + 基本名が一致 + コマンド整合 + 公開用データ内で一意
  NEEDS_VISUAL_QA : 一意の候補はあるが、名称が違う等の理由で映像確認が必要
  HOLD            : 候補がない/複数/コマンド矛盾
  APPROVED        : このスクリプトでは絶対に設定しない
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = ROOT / "v2-web/src/data"
FIX = json.load(open(D / "ALL_CHARACTER_RELEASE_FIXTURE_20261004.json"))["characters"]
OFF = json.load(open(D / "SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json"))
CLS = json.load(open(ROOT / "scripts/gif-intake/remaining-53-classification-20261116.json"))["rows"]
ASSET = {a["file"]: a for a in json.load(open(ROOT / "scripts/gif-intake/asset-inspection-38-20261116.json"))["assets"]}

TAGS = ["OD", "弱", "中", "強", "CA", "SA1", "SA2", "SA3"]
STRENGTH_OF_TAG = {"弱": "light", "中": "medium", "強": "heavy", "OD": "od", "SA1": "sa1", "SA2": "sa2", "SA3": "sa3"}
ARROW = {"↓": "2", "↙": "1", "←": "4", "↖": "7", "↑": "8", "↗": "9", "→": "6", "↘": "3"}


def parse_name(name):
    """技名 → (区分タグ集合, 基本名)。括弧注記・英語名は除くが、弱/中/強/OD/SAは必ず残す。"""
    tags = set(re.findall(r"（(SA[123]|CA)）", name))
    rest = re.sub(r"（(SA[123]|CA)）", "", name)
    rest = re.sub(r"（メダルLvに応じて動作が変化）", "", rest)  # 公式側の注記のみ除去(区分は残る)
    rest = re.sub(r"\s*/\s*[A-Za-z].*$", "", rest)
    toks = rest.replace("　", " ").split()
    while toks and toks[0] in TAGS:
        tags.add(toks.pop(0))
    return tags, "".join(toks)


BTN_WORDS = {"弱P": "LP", "中P": "MP", "強P": "HP", "弱K": "LK", "中K": "MK", "強K": "HK"}


def split_cmd(cmd):
    """コマンド文字列 → (方向入力の候補集合, ボタン表記)。条件の括弧書き・「近距離で」は除く。
    例: 「6314 | 6214 | 6324 + LP」→ ({6314,6214,6324}, 'LP') / 「63214LP」→ ({63214}, 'LP') / 「弱P + 弱K」→ (set(), 'LPLK')"""
    c = re.sub(r"（[^）]*）", "", cmd or "").replace("近距離で", "")
    for k, v in ARROW.items():
        c = c.replace(k, v)
    for k, v in BTN_WORDS.items():
        c = c.replace(k, v)
    c = c.replace("＋", "+").replace("＞", ">").replace("~", ">").replace(" ", "")
    m = re.search(r"LP|MP|HP|LK|MK|HK|PP|KK|P|K", c)
    motion, btn = (c[:m.start()], c[m.start():]) if m else (c, "")
    mot = {x for x in re.split(r"\||or|/", motion.strip("+")) if x}
    btn = re.sub(r"\+(?=[LMH][PK])", "", btn)  # 「LP+LK」→「LPLK」(ただし「>」「|」は残す)
    return mot, btn


def collapse_all(m):
    """236236 → {23626, 26236} / 214214 → {21424, 24214} (公式表記は重なる入力を省略した2通り)。"""
    if len(m) == 6 and m[:3] == m[3:]:
        x = m[:3]
        return {x + x[0] + x[2], x[0] + x[2] + x}
    return {m}


def is_subseq(s, t):
    it = iter(t)
    return all(ch in it for ch in s)


def btn_norm(b):
    """ボタン表記を (種類P/K, 強度) に正規化。弱P/中P/強P/LP/MP/HP/PP/KK を同じ尺度で比較。"""
    b = b.replace("弱P", "LP").replace("中P", "MP").replace("強P", "HP").replace("弱K", "LK").replace("中K", "MK").replace("強K", "HK")
    b = b.replace("LP+MP", "LPMP").replace("LP+HP", "LPHP").replace("MP+HP", "MPHP")
    if b in ("LPMPHP", "PP"): return ("P", "OD")
    if b in ("LKMKHK", "KK"): return ("K", "OD")
    if re.fullmatch(r"(LP|MP|HP|LK|MK|HK)(\|(LP|MP|HP|LK|MK|HK))*", b) and "|" in b: return (b[1], "ANY")
    return (b[1] if len(b) > 1 and b[0] in "LMH" else b, b[0] if b and b[0] in "LMH" else "ANY")


def command_compat(off_cmd, fix_cmd, throw_or_combo=False):
    """公式コマンドと公開用データ(Classic)のコマンドが両立するか。 → (ok, 理由)"""
    om, ob = split_cmd(off_cmd)
    fm, fb = split_cmd(fix_cmd)
    if ">" in ob or ">" in fb:  # ターゲットコンボ: 方向もボタン列(段数)も完全一致
        return (om == fm and ob == fb, f"段数付きコマンド: 公式 {off_cmd} / 公開用 {fix_cmd}")
    # 投げ: 方向(N/6 か 4)と弱P+弱K
    if throw_or_combo:
        od = "forward" if om & {"N", "6"} else "back"
        fd = "back" if "4" in fm else "forward"  # 公開用: 前投げは方向なし/→/N、後ろ投げは←
        return (od == fd and ob == "LPLK", f"投げ入力: 公式 {off_cmd} / 公開用 {fix_cmd}")
    # 通常の必殺技/SA
    mot_ok = False
    for o in om:
        for f in fm:
            if o == f or o in collapse_all(f) or (is_subseq(o, f) and len(o) >= 4):
                mot_ok = True
    fb_k, fb_s = btn_norm(fb)
    ob_k, ob_s = btn_norm(ob)
    btn_ok = fb_k == ob_k and (fb_s == ob_s or "ANY" in (fb_s, ob_s))
    return (mot_ok and btn_ok, f"方向 公式{sorted(om)}/公開用{sorted(fm)} ボタン 公式{ob}/公開用{fb}")


def off_rec(ch, oid):
    r = OFF.get(f"{ch}:web:{oid}", {})
    raw = r.get("raw", r)
    return raw


def official_name(ch, oid):
    reg = json.load(open(D / "SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json"))
    for x in reg:
        if x["characterSlug"] == ch and x["sourceRecordKey"] == f"{ch}:web:{oid}":
            return x["officialMoveName"]


def fixture_move(ch, slug):
    return [m for m in FIX[ch]["moves"] if m["slug"] == slug]


def classic(m):
    return next((c["commandText"] for c in m["commands"] if c["scheme"] == "classic"), "")


def modern(m):
    return next((c["commandText"] for c in m["commands"] if c["scheme"] == "modern"), "")


# 素材ファイル → (キャラ, 公式一覧の通番, 候補slug) 。候補slugは分類ファイルの値を検算に使う(下で一致を確認する)
# 公式通番は公式一覧(キー char:web:<通番>)から名前・コマンドを引く。JP OD ヴィーハトはボタン対で一意に引く。
ROWS = {
    "manon-light-manege-dore.gif": ("manon", "300", "manon-manege-l"),
    "manon-medium-manege-dore.gif": ("manon", "301", "manon-manege-m"),
    "manon-heavy-manege-dore.gif": ("manon", "302", "manon-manege-h"),
    "manon-od-manege-dore.gif": ("manon", "303", "manon-manege-od"),
    "manon-od-renverse.gif": ("manon", "315", "manon-renverse-od"),
    "jp-abnimach.gif": ("jp", "324", "jp-embrace"),
    "jp-od-abnimach.gif": ("jp", "325", "jp-embrace-od"),
    "jp-od-departure-lp-mp.gif": ("jp", "313", "jp-departure-od-l"),
    "jp-od-departure-lp-hp.gif": ("jp", "314", "jp-departure-od-m"),
    "jp-od-departure-mp-hp.gif": ("jp", "315", "jp-departure-od-h"),
    "9_57-jp-ravina.gif": ("jp", "500", "jp-forward-throw"),
    "9_58-jp-uragan.gif": ("jp", "501", "jp-back-throw"),
    "22_23-luke-double-impact-followup.gif": ("luke", "205", "luke-forward-hp-hp"),
    "22_65-luke-sweeper.gif": ("luke", "500", "luke-forward-throw"),
    "22_66-luke-scrapper.gif": ("luke", "501", "luke-back-throw"),
    "17_70-juri-sa1-sakkai-fuhazan.gif": ("juri", "400", "juri-sa1"),
}


def main():
    targets = {r["file"]: r for r in CLS if r["subcategory"].startswith("A")}
    assert set(targets) == set(ROWS), "対象16本が分類ファイルと一致しない"
    out = []
    for f, (ch, oid, slug) in ROWS.items():
        cls = targets[f]
        mv = fixture_move(ch, slug)
        evidence, mism, hold, vq = [], [], [], []
        status = "HOLD"
        assert len(mv) == 1, f"{f}: 候補slugが公開用データで一意でない"
        m = mv[0]
        assert m["id"] == cls["candidateMoveId"], f"{f}: 分類ファイルの候補IDと不一致"
        oname, raw = official_name(ch, oid), off_rec(ch, oid)
        ocmd, otype = raw.get("command", ""), raw.get("type", "")
        fcmd, mcmd = classic(m), modern(m)
        otags, obase = parse_name(oname)
        ftags, fbase = parse_name(m["name"])
        is_throw = m["moveType"] == "throw"
        ok_cmd, why = command_compat(ocmd, fcmd, throw_or_combo=is_throw)
        evidence.append(f"公式一覧 #{oid}: 「{oname}」/ 公式コマンド {ocmd} / 種別 {otype}")
        evidence.append(f"公開用データ: 「{m['name']}」({m['moveType']}) slug={slug} Classic「{fcmd}」Modern「{mcmd}」")
        # 候補が一意か(同キャラ内で、同じ区分+基本名の技が1つだけ / 公式側で同コマンドが他にない)
        same_name = [x for x in FIX[ch]["moves"] if parse_name(x["name"]) == (ftags, fbase)]
        name_unique = len(same_name) == 1
        same_cmd_fix = [x["slug"] for x in FIX[ch]["moves"] if x["slug"] != slug and classic(x) == fcmd and fcmd]
        same_cmd_off = [k.split(":")[-1] for k, v in OFF.items()
                        if k.startswith(f"{ch}:web:") and k != f"{ch}:web:{oid}" and (v.get("raw", v).get("command") == ocmd)]
        evidence.append(f"コマンド整合: {'一致' if ok_cmd else '不一致'} ({why})")
        evidence.append(f"同コマンドの他の技: 公式{len(same_cmd_off)}件 / 公開用{len(same_cmd_fix)}件")
        if not ok_cmd: hold.append("コマンドが両立しない")
        if same_cmd_fix: hold.append(f"公開用データに同コマンドの別技あり: {same_cmd_fix}")
        name_equal = (otags, obase) == (ftags, fbase)

        if f.startswith("manon-"):
            # 括弧注記(メダルLv)だけを除去し、弱/中/強/OD は保持して比較済み
            evidence.append(f"区分タグ保持: 公式{sorted(otags)} / 公開用{sorted(ftags)} / 基本名「{obase}」=「{fbase}」")
            evidence.append("公式の複数入力(6314|6214|6324)は公開用の63214を省略した入力として両立(部分列)")
            if name_equal and name_unique and ok_cmd and not hold:
                status = "MATCHED_STATIC"
            vq.append("メダルLvにより動作が変化する技。映像のLvと、技の見た目・強度(弱/中/強/OD)を確認")
        elif f.startswith("17_70-juri"):
            # SA1: 公式の日本語名と公開用のローマ字名は表記系が違う。ファイル名のローマ字・SA区分・Classicコマンドで裏付ける
            fname_roman = re.sub(r"^\d+_\d+-juri-sa1-", "", f).replace(".gif", "").replace("-", " ").lower()
            roman_ok = fname_roman in m["name"].lower()
            sa_ok = otags == ftags == {"SA1"} or ("SA1" in otags and "SA1" in ftags)
            evidence.append(f"SA区分: 公式{sorted(otags)} / 公開用{sorted(ftags)} / ファイル名ローマ字「{fname_roman}」⊂ 公開用名: {roman_ok}")
            ms = [c for c in m["commands"] if c["scheme"] == "modern"]
            evidence.append(f"Classic/Modern差異の説明: 公式Classic「{ocmd}」=公開用Classic「{fcmd}」。公開用Modern「{mcmd}」は公式Modern「{raw.get('command_modern', '')}」の「強SP」入力と対応")
            mism.append("公開用データの SP+H は Modernの入力。公式の236236+K(Classic)とは別の入力経路で、差異ではなく操作方式の違い")
            modern_ok = "強SP" in raw.get("command_modern", "") and "SP+H" in mcmd
            if roman_ok and sa_ok and ok_cmd and modern_ok and name_unique:
                status = "MATCHED_STATIC"
            else:
                hold.append("Classic/Modernの入力経路で差異を説明できない")
            vq.append("SA1の演出・暗転・ヒット表示を映像で確認")
        elif ch == "luke" and slug == "luke-forward-hp-hp":
            first = [x for x in FIX["luke"]["moves"] if classic(x).startswith("→ + 強P") and "＞" not in classic(x)]
            evidence.append(f"段数: 公式「2段目」=HP>HP(2打)/公開用 target_combo の強P＞強P。1段目に当たる公開用技: {[x['slug'] for x in first]}")
            mism.append("技名不一致: 公式『ダブルインパクト（2段目）』/ 公開用『前強P・強P』(公開用は入力ベースの呼称)")
            if ok_cmd and not hold: status = "NEEDS_VISUAL_QA"
            vq.append("1段目(前強P単発)ではなく2段目まで出ていること、1段目がヒット/パニカンで派生した映像であることを確認")
        elif is_throw:
            side = "前(N/6)" if "N" in ocmd or "6" in ocmd.split("+")[0] else "後ろ(4)"
            evidence.append(f"投げ方向: 公式{side}。公開用の投げ種別={m['moveType']}。ターゲットコンボではない")
            mism.append(f"技名不一致: 公式『{oname}』/ 公開用『{m['name']}』(公開用は方向のみの呼称)")
            if ok_cmd and not hold: status = "NEEDS_VISUAL_QA"
            vq.append("投げの方向(前/後ろ)と、通常技の誤登録でないことを映像で確認")
        elif f.startswith("jp-od-departure"):
            pair = re.search(r"departure-(\w\w)-(\w\w)", f).groups()
            evidence.append(f"ファイル名の入力ボタン対 {pair[0].upper()}+{pair[1].upper()} は公式 #{oid} のコマンド({ocmd})と一致。ファイル名に技名は無くボタンのみ")
            mism.append("素材識別子に技名が無く、入力ボタンのみ(OD弱/中/強の区別をファイル名の入力対から推定)")
            if ok_cmd and not hold: status = "NEEDS_VISUAL_QA"
            vq.append("OD版(ゲージ消費・演出)か、弱/中/強どの組合せの入力かを映像で確認")
        elif f.startswith("jp-") and "abnimach" in f:
            om_ = raw.get("command_modern", "")  # 公式Modern「4 ＋ SP」(ODは「4 ＋ AUTO＋SP」) ↔ 公開用「← + 必殺技」(ODは「← + アシスト + 必殺技」)
            ms_ok = om_.startswith("4") and "←" in mcmd and "SP" in om_ and "必殺技" in mcmd and (("AUTO" in om_) == ("アシスト" in mcmd))
            evidence.append(f"Modern入力も対応: 公式「{raw.get('command_modern', '')}」/ 公開用「{mcmd}」: {ms_ok}")
            mism.append(f"技名不一致: 公式『{oname}』/ 公開用『{m['name']}』。両者とも当該入力の技はこの1系統のみで、名称対応の公式資料は無い")
            if ok_cmd and ms_ok and not hold: status = "NEEDS_VISUAL_QA"
            vq.append("映像の技が当該の技か(214+Kの投げ/特殊技)と、OD版の区別を確認")
        if status == "HOLD" and not hold:
            hold.append("一意に対応する根拠が不足")
        out.append({
            "character": ch, "sourceFile": f, "sha256": ASSET[f]["sha256"],
            "moveId": m["id"], "moveSlug": slug, "fixtureName": m["name"], "officialName": oname,
            "officialCommand": ocmd, "fixtureCommand": fcmd, "fixtureModernCommand": mcmd,
            "category": m["moveType"], "strength": next((STRENGTH_OF_TAG[t] for t in ["OD", "SA1", "SA2", "SA3", "弱", "中", "強"] if t in ftags), "none"),
            "existingMp4": False,  # 実際の値は検証スクリプトがMP4台帳から再計算して照合する
            "status": status, "evidence": evidence, "mismatches": mism, "holdReasons": hold, "visualQaNotes": vq,
        })
    # 公開用データの既存MP4を読み、existingMp4を実値に更新(読み取りのみ)
    mp4 = set()
    for p in D.glob("SF6DNA_VER1_*_MEDIA_MANIFEST_*.json"):
        try:
            j = json.load(open(p))
        except Exception:
            continue
        for c in (j.get("clips") or j.get("media") or []) if isinstance(j, dict) else []:
            if isinstance(c, dict) and c.get("media_type", c.get("mediaType")) == "mp4" and c.get("move_id"):
                mp4.add(c["move_id"])
    for r in out: r["existingMp4"] = r["moveId"] in mp4

    summary = {s: sum(1 for r in out if r["status"] == s) for s in ["MATCHED_STATIC", "NEEDS_VISUAL_QA", "HOLD", "APPROVED"]}
    (ROOT / "scripts/gif-intake/move-aliases-batch2-20261116.json").write_text(
        json.dumps({"generated": "2026-11-16", "summary": summary, "rows": out}, ensure_ascii=False, indent=1), encoding="utf-8")
    ts = ["// 別表記16本(Manon/JP/Luke/Juri)の技ID対応表。複数キャラクターに再利用できる形式(jp-move-aliases.ts の項目を含む上位互換)。",
          "// 生成: scripts/gif-intake/build-aliases-batch2.py (読み取り専用の静的照合。新規技データは作らない)",
          "// 状態: MATCHED_STATIC=静的に一意対応 / NEEDS_VISUAL_QA=一意の候補はあるが映像確認が必要 / HOLD=確定不可 / APPROVED=別途明示承認のみ(この表では0件)",
          "// 注意: 静的一致は映像QA完了ではない。どの行も APPROVED へ自動昇格しない。既存の表示経路からは参照しない(未接続)。",
          'export type MoveAliasStatus = "MATCHED_STATIC" | "NEEDS_VISUAL_QA" | "HOLD" | "APPROVED";', "",
          "export type MoveAlias = {", "  character: string; // 素材とmoveIdの所属キャラクター(他キャラのmoveIdは不可)",
          "  sourceFile: string; sha256: string; moveId: string; moveSlug: string;",
          "  fixtureName: string; officialName: string; officialCommand: string; fixtureCommand: string; fixtureModernCommand: string;",
          "  category: string;", '  strength: "light" | "medium" | "heavy" | "od" | "sa1" | "sa2" | "sa3" | "none";',
          "  existingMp4: boolean; // trueなら表示はMP4優先(GIFは上乗せしない)", "  status: MoveAliasStatus;",
          "  evidence: readonly string[]; mismatches: readonly string[]; holdReasons: readonly string[]; visualQaNotes: readonly string[];", "};", "",
          "export const MOVE_ALIASES_BATCH2: readonly MoveAlias[] = ["]
    ts += ["  " + json.dumps(r, ensure_ascii=False) + "," for r in out] + ["];", ""]
    (D / "gif-intake/move-aliases-batch2.ts").write_text("\n".join(ts), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False))
    for r in out:
        print(r["character"], r["sourceFile"], "->", r["moveSlug"], r["status"], "MP4" if r["existingMp4"] else "", r["holdReasons"])


if __name__ == "__main__":
    main()
