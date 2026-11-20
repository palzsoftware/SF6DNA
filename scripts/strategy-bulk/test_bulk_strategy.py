"""Unit and fixture tests for the bulk strategy intake tool (stdlib unittest, offline)."""
import csv
import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
sys.path.insert(0, str(HERE))

from move_check import Resolver, auto_resolve, check_steps, numeric_form, step_core  # noqa: E402
from page_text import arrow_chains, extract_blocks  # noqa: E402
from source_cache import SourceCache, cache_key, validate_url  # noqa: E402
from source_match import compare, match_row, paired_sequences, split_steps, token_forms  # noqa: E402


def record(slug, web_id, command, skill):
    return {"characterSlug": slug, "raw": {"command": command, "skill": skill, "webId": web_id}}


MASTER = {
    "ryu:web:106": record("ryu", "106", "2 ＋ LP", "しゃがみ弱P（ジャブ）"),
    "ryu:web:109": record("ryu", "109", "2 ＋ MK", "しゃがみ中K（くるぶしキック）"),
    "ryu:web:104": record("ryu", "104", "HP", "立ち強P（正拳突き）"),
    "ryu:web:306": record("ryu", "306", "626 ＋ LP", "弱 昇龍拳"),
    "ryu:web:308": record("ryu", "308", "626 ＋ HP", "強 昇龍拳"),
    "ryu:web:310": record("ryu", "310", "214 ＋ LK", "弱 竜巻旋風脚"),
    "ryu:web:312": record("ryu", "312", "214 ＋ HK", "強 竜巻旋風脚"),
    "ryu:web:400": record("ryu", "400", "23626 | 26236 ＋ LP | MP | HP", "SA1 真空波動拳"),
    "ryu:web:500": record("ryu", "500", "（近距離で）N or 6 + LPLK", "背負い投げ"),
    "ryu:web:609": record("ryu", "609", "5656", "キャンセルドライブラッシュ"),
    "yasmine:web:310": record("yasmine", "310", "236 ＋ HK", "強 リパ・ン・アギラ"),
    "yasmine:web:311": record("yasmine", "311", "236 ＋ MK", "中 リパ・ン・アギラ"),
    "yasmine:web:320": record("yasmine", "320", "214 ＋ HP", "強 リパルス"),
    "deejay:web:106": record("deejay", "106", "2 ＋ LP", "しゃがみ弱P（ガード）"),
}


class MoveCheckTest(unittest.TestCase):
    def test_numeric_and_name_forms(self):
        self.assertEqual(step_core("2弱P"), step_core("しゃがみ弱P"))
        self.assertEqual(step_core("屈弱P"), step_core("しゃがみ弱P（ジャブ）"))
        self.assertEqual(numeric_form("↓↙←＋強K"), "214+hk")
        self.assertEqual(numeric_form("前強P"), "6+hp")
        self.assertEqual(step_core("Cラッシュ"), "キャンセルドライブラッシュ")

    def test_ok_review_and_missing(self):
        ok = check_steps("2弱P > 強 昇龍拳", "ryu:2+LP:web:106 > ryu:626+HP:web:308", MASTER)
        self.assertEqual(ok[0], "OK")
        wrong = check_steps("2弱P > 弱 昇龍拳", "ryu:2+LP:web:106 > ryu:626+HP:web:308", MASTER)
        self.assertEqual(wrong[0], "REVIEW", "a different strength must not pass as a match")
        self.assertEqual(check_steps("2弱P > 強 昇龍拳", "ryu:2+LP:web:106", MASTER)[0], "MISSING")
        self.assertEqual(check_steps("2弱P > 強 昇龍拳", "ryu:2+LP:web:106 > ryu:x:web:999", MASTER)[0], "MISSING")

    def test_slug_alias_is_notation_only(self):
        self.assertEqual(check_steps("2弱P > 2弱P", "dee-jay:2+LP:web:106 > dee-jay:2+LP:web:106", MASTER)[0], "OK")

    def test_abbreviation_requires_uniqueness(self):
        resolver = Resolver(MASTER)
        self.assertEqual(resolver.resolve("yasmine", "強リパ・ン"), "yasmine:web:310")
        # "強リパ" prefixes both 強 リパ・ン・アギラ and 強 リパルス: ambiguous, so unresolved.
        self.assertIsNone(resolver.resolve("yasmine", "強リパ"))
        self.assertIsNone(resolver.resolve("ryu", "昇龍拳"), "missing strength stays unresolved")
        self.assertEqual(resolver.resolve("ryu", "→↓↘+強P"), None, "626 notation in master differs: no guess")

    def test_auto_resolve_all_or_nothing(self):
        resolver = Resolver(MASTER)
        filled = auto_resolve("ryu", "2弱P > Cラッシュ > 強竜巻旋風脚", resolver, MASTER, split_steps)
        self.assertEqual(filled, "ryu:2+LP:web:106 >  > ryu:214+HK:web:312")
        self.assertIsNone(auto_resolve("ryu", "2弱P > 竜巻", resolver, MASTER, split_steps))


class AliasTest(unittest.TestCase):
    def test_confirmed_alias_only(self):
        from move_check import load_confirmed_aliases
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory, "aliases.csv")
            path.write_text("verdict,alias,ws5Key\n"
                            "CONFIRM_CANDIDATE_NUMPAD_TO_OFFICIAL_LABEL_UNIQUE,昇竜,ryu:web:308\n"
                            "HOLD_NO_EXACT_MATCH,竜巻,ryu:web:310\n", encoding="utf-8")
            aliases = load_confirmed_aliases(path, MASTER)
        self.assertEqual(aliases, {("ryu", "昇竜"): "ryu:web:308"})
        self.assertEqual(Resolver(MASTER, aliases).resolve("ryu", "昇竜"), "ryu:web:308")
        self.assertIsNone(Resolver(MASTER, aliases).resolve("ryu", "竜巻"), "HOLD verdicts are never used")
        self.assertEqual(check_steps("2弱P > 昇竜", "ryu:2+LP:web:106 > ryu:626+HP:web:308", MASTER, aliases)[0], "OK")
        self.assertEqual(check_steps("2弱P > 昇竜", "ryu:2+LP:web:106 > ryu:626+HP:web:308", MASTER)[0], "REVIEW")


class GeneratorRetainedDuplicateTest(unittest.TestCase):
    """The existing generator keeps its duplicate check; only a declared historical duplicate passes."""

    def run_generator(self, directory, reviews):
        d = Path(directory)
        fields = ["management_no", "provisional_id", "character_slug", "category", "steps", "source_url", "page_updated",
                  "quality", "duplicate", "publication", "game_qa", "step_states", "management_ids", "unresolved_steps"]
        base = {"provisional_id": "", "character_slug": "ryu", "category": "combo", "steps": "2弱P → 強 昇龍拳",
                "source_url": "https://sf6-lab.net/fighters/ryu/combo", "page_updated": "2026-08-31",
                "quality": "A テスト", "duplicate": "なし", "publication": "HOLD_NOT_APPROVED", "game_qa": "NOT_RUN",
                "step_states": "RESOLVED RESOLVED", "management_ids": "ryu:2+LP:web:106 > ryu:626+HP:web:308",
                "unresolved_steps": ""}
        with (d / "batch.csv").open("w", encoding="utf-8", newline="") as target:
            writer = csv.DictWriter(target, fieldnames=fields)
            writer.writeheader()
            writer.writerow({**base, "management_no": "000001"})
            writer.writerow({**base, "management_no": "000002"})
        (d / "base.json").write_text("[]", encoding="utf-8")
        (d / "reviews.json").write_text(json.dumps(reviews, ensure_ascii=False), encoding="utf-8")
        return subprocess.run([sys.executable, "-I", str(REPO / "scripts/generate-local-strategy-cards.py"),
                               str(d / "base.json"), str(d / "reviews.json"), str(d / "batch.csv")],
                              capture_output=True, text=True)

    def review(self, **extra):
        return {"source_url": "https://sf6-lab.net/fighters/ryu/combo", "page_updated": "2026-08-31",
                "steps": "2弱P → 強 昇龍拳", "management_ids": "ryu:2+LP:web:106 > ryu:626+HP:web:308",
                "characterName": "リュウ", "title": "t", "condition": "c", "description": "d",
                "sourceLocator": "s", "controlLabel": "クラシック", **extra}

    def test_declared_duplicate_only(self):
        with tempfile.TemporaryDirectory() as directory:
            plain = self.run_generator(directory, {"000001": self.review(), "000002": self.review()})
            self.assertNotEqual(plain.returncode, 0)
            self.assertIn("Duplicate strategy route", plain.stderr)
            wrong = self.run_generator(directory, {"000001": self.review(),
                                                   "000002": self.review(retainedDuplicateOf="000009")})
            self.assertNotEqual(wrong.returncode, 0)
            ok = self.run_generator(directory, {"000001": self.review(),
                                                "000002": self.review(retainedDuplicateOf="000001")})
            self.assertEqual(ok.returncode, 0, ok.stderr)
            self.assertEqual(len(json.loads(ok.stdout)), 2)


class SharedMatcherV1Test(unittest.TestCase):
    """The audit uses the shared ①② matcher (STEP_MATCHING_SPEC_V1) unchanged."""

    def test_card_verdicts(self):
        from sf6dna_step_matcher_v1 import Matcher
        master = {k: {**v, "raw": {**v["raw"], "name": v["raw"].get("name", "")}} for k, v in MASTER.items()}
        master["ryu:web:106"]["raw"]["name"] = "(2LP)"
        master["ryu:web:104"]["raw"]["name"] = "(5HP)"
        matcher = Matcher(master, [])
        self.assertEqual(matcher.card("ryu", "しゃがみ弱P（PC） → 強 昇龍拳")[0], "MATCHED")
        self.assertEqual(matcher.card("ryu", "2弱Pパニカン → 立ち強P → 強 昇龍拳")[0], "MATCHED")
        self.assertEqual(matcher.card("ryu", "2弱P → 強K")[0], "NOT_MATCHED", "a bare button is never taken as standing")
        self.assertEqual(matcher.card("ryu", "相手の技：SA3 なにか")[0], "COUNTER_TARGET_ONLY")
        self.assertEqual(matcher.card("ryu", "2弱P → 昇龍拳")[0], "NOT_MATCHED", "strength must be stated")


class SharedMatcherV11Test(unittest.TestCase):
    """Spec v1.1 is a separate matcher; v1 keeps its behaviour."""

    def master(self):
        master = {k: {**v, "raw": {**v["raw"], "name": v["raw"].get("name", "")}} for k, v in MASTER.items()}
        master["ryu:web:106"]["raw"]["name"] = "(2LP)"
        master["ryu:web:999"] = {"characterSlug": "ryu", "raw": {"skill": "強 昇龍拳（ホールド）", "command": "626 ＋ HP", "webId": "999", "name": ""}}
        return master

    def test_v11_changes_only(self):
        from sf6dna_step_matcher_v1 import Matcher as V1
        from sf6dna_step_matcher_v1_1 import Matcher as V11
        master = self.master()
        v1, v11 = V1(master, []), V11(master, [])
        # 1. full official name first: base name no longer collides with its (ホールド) version
        self.assertEqual(v1.card("ryu", "2弱P → 強 昇龍拳")[0], "NOT_MATCHED")
        self.assertEqual(v11.card("ryu", "2弱P → 強 昇龍拳")[0], "MATCHED")
        # 2. DR alone is a system action
        self.assertEqual(v11.card("ryu", "DR → 2弱P → 強 昇龍拳")[0], "MATCHED")
        # 3. CH and PC are separate conditions
        tags = lambda text: v11.card("ryu", text)[1][0][1]["tags"]
        self.assertIn("COUNTER_HIT", tags("2弱P（カウンター） → 強 昇龍拳"))
        self.assertIn("COUNTER_HIT", tags("2弱P（CH） → 強 昇龍拳"))
        self.assertIn("PUNISH_COUNTER", tags("2弱P（PC） → 強 昇龍拳"))
        self.assertNotIn("COUNTER_HIT", tags("2弱Pパニカン → 強 昇龍拳"))
        # unchanged rules
        self.assertEqual(v11.card("ryu", "2弱P → 強K")[0], "NOT_MATCHED")
        self.assertEqual(v11.card("ryu", "相手の技：SA3 なにか")[0], "COUNTER_TARGET_ONLY")


class StrictReferenceTest(unittest.TestCase):
    def test_strict_rules(self):
        from move_check import strict_resolve
        ok = lambda slug, token: strict_resolve(slug, token, MASTER, {})[0]
        self.assertTrue(ok("ryu", "2弱P"))
        self.assertTrue(ok("ryu", "しゃがみ弱P（PC）"))
        self.assertTrue(ok("ryu", "しゃがみ中Kパニカン"))
        self.assertTrue(ok("ryu", "CDR"))
        self.assertTrue(ok("ryu", "Cラッシュ しゃがみ中K"))
        self.assertTrue(ok("ryu", "歩き"))
        self.assertTrue(ok("ryu", "相手の技：SA3 ほげ"))
        self.assertTrue(ok("ryu", "214強K"))
        self.assertFalse(ok("yasmine", "強リパ"), "prefix short forms are not confirmed")
        # Round6: DI shorthand, direction word + button and command-unique throws are parser gaps.
        self.assertTrue(ok("ryu", "DI"))
        self.assertTrue(ok("ryu", "前投げ"))
        self.assertFalse(ok("ryu", "昇龍拳"), "strength must be stated")
        self.assertFalse(ok("ryu", "強K"), "a bare button is not a move name")


class AuditTest(unittest.TestCase):
    def test_sub_route_and_rush_recheck(self):
        from audit_cards import contiguous, split_rush, recheck_against_clause
        self.assertTrue(contiguous(("@a", "@b"), ("@x", "@a", "@b")))
        self.assertFalse(contiguous(("@a", "@b"), ("@a", "@x", "@b")))
        self.assertEqual(split_rush("ラッシュ"), (True, ""))
        self.assertEqual(split_rush("サンライズヒール（ドライブラッシュなし）"), (False, "サンライズヒール"))
        self.assertEqual(split_rush("パリィラッシュ ローハイド"), (True, "ローハイド"))
        card = {"characterSlug": "ryu"}
        rec = {"tokens": ["2弱P", "強 昇龍拳"], "keys": ("@ryu:web:106", "@ryu:web:308")}
        resolver = Resolver(MASTER)
        self.assertIsNone(recheck_against_clause(card, rec, "2弱P ＞ 強 昇龍拳", resolver))
        self.assertEqual(recheck_against_clause(card, rec, "ラッシュ 2弱P ＞ 強 昇龍拳", resolver),
                         "MISEXTRACTION_SYSTEM_ACTION_DROPPED")
        self.assertEqual(recheck_against_clause(card, rec, "2弱P ＞ 強 昇龍拳（8月3日の調整前）", resolver),
                         "SOURCE_CLAUSE_DESCRIBES_PRE_PATCH_STATE")

    def test_family_aliases_are_not_collapsed(self):
        from move_check import load_confirmed_aliases
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory, "v2.csv")
            path.write_text("character,alias,ws5Key,basis\n"
                            "ryu,昇竜,ryu:web:306;ryu:web:308,CONFIRM_CANDIDATE_OFFICIAL_FAMILY_STRENGTH_UNSPECIFIED\n"
                            "ryu,大昇竜,ryu:web:308,CONFIRM_CANDIDATE_EXACT_UNIQUE\n", encoding="utf-8")
            self.assertEqual(load_confirmed_aliases(path, MASTER), {("ryu", step_core("大昇竜")): "ryu:web:308"})


class PageTextTest(unittest.TestCase):
    def test_arrow_chain_inside_prose(self):
        chains = arrow_chains("当たったら 2弱P ＞ 立ち強P ＞ →↓↘＋強P（強 昇龍拳）（2,960）。締めたあとは前へ")
        self.assertEqual([c["steps"] for c in chains], [["2弱P", "立ち強P", "→↓↘＋強P（強 昇龍拳）"]])

    def test_aggregate_list_is_split_per_route(self):
        chains = arrow_chains("しゃがみ中P ＞ 中 パワーチャージ 32本、立ち中K ＞ 立ち弱K ＞ 弱 パワーチャージ 25本。")
        self.assertEqual([c["steps"] for c in chains],
                         [["しゃがみ中P", "中 パワーチャージ"], ["立ち中K", "立ち弱K", "弱 パワーチャージ"]])

    def test_chain_flags(self):
        ref = arrow_chains("立ち中P ＞ しゃがみ中P をガードさせた後の 強 エアスラッシャー から")[0]
        self.assertTrue(ref["referencedInSentence"])
        cut = arrow_chains("中P中K →→ →＋中K（ギリオチーナ）＞ ↓＋中P ＞ ↓↘→＋中P。")[0]
        self.assertTrue(cut["truncatedStart"])
        lead = arrow_chains("（ガード）ドライブインパクト ＞ しゃがみ強P ＞ 中 バックフィストコンボ")[0]
        self.assertEqual(lead["leadNote"], "ガード")
        self.assertFalse(lead["referencedInSentence"] or lead["truncatedStart"])

    def test_direction_arrow_is_not_separator_without_gt(self):
        self.assertEqual([c["steps"] for c in arrow_chains("しゃがみ中K → 強 昇龍拳")], [["しゃがみ中K", "強 昇龍拳"]])
        self.assertEqual(arrow_chains("→↓↘＋P だけ"), [])

    def test_list_recipe_and_command_pairing(self):
        html = ("<h2>基礎</h2><h4>暴れ</h4><ol class='kcombo'><li>しゃがみ弱P</li><li>強 昇龍拳</li></ol>"
                "<ol class='kcmd'><li>2弱P</li><li>626強P</li></ol><p>説明</p><script>x→y</script>")
        page = extract_blocks(html)
        self.assertEqual([s["steps"] for s in page["sequences"]], [["しゃがみ弱P", "強 昇龍拳"], ["2弱P", "626強P"]])
        paired = paired_sequences(page["sequences"])
        self.assertEqual(len(paired), 1)
        self.assertEqual(paired[0]["headingPath"], ["基礎", "暴れ"])


class SourceMatchTest(unittest.TestCase):
    def page(self, html, slug="ryu"):
        parsed = extract_blocks(html)
        return {"blocks": parsed["blocks"], "sequences": paired_sequences(parsed["sequences"], slug, Resolver(MASTER))}

    def test_levels(self):
        page = self.page("<h3>端</h3><p>2弱P ＞ 立ち強P ＞ 強 昇龍拳（2,000）。</p>")
        row = {"steps": "しゃがみ弱P > 立ち強P > 強 昇龍拳", "heading": "x",
               "management_ids": "ryu:2+LP:web:106 > ryu:HP:web:104 > ryu:626+HP:web:308"}
        self.assertEqual(match_row(row, page)["level"], "SEQUENCE_MATCH")
        self.assertEqual(match_row({**row, "steps": "しゃがみ弱P > 立ち強P", "management_ids": ""}, page)["level"],
                         "SEQUENCE_PARTIAL")
        self.assertEqual(match_row({**row, "steps": "しゃがみ弱P > 弱 昇龍拳", "management_ids": ""}, page)["level"],
                         "NOT_FOUND")

    def test_compare_requires_every_position(self):
        a = [token_forms("2弱P"), token_forms("強 昇龍拳")]
        b = [token_forms("2弱P"), token_forms("弱 昇龍拳")]
        self.assertEqual(compare(a, b)[0], "NOT_FOUND")


class CacheTest(unittest.TestCase):
    def test_offline_and_tamper(self):
        with tempfile.TemporaryDirectory() as directory:
            cache = SourceCache(directory, offline=True)
            url = "https://sf6-lab.net/fighters/ryu/combo"
            meta, body = cache.get(url)
            self.assertEqual(meta["status"], "NOT_CACHED_OFFLINE")
            self.assertEqual(cache.network_requests, 0)
            text = "<p>x</p>"
            Path(directory, cache_key(url) + ".html").write_text(text, encoding="utf-8")
            Path(directory, cache_key(url) + ".json").write_text(json.dumps(
                {"url": url, "status": 200, "sha256": hashlib.sha256(text.encode()).hexdigest()}), encoding="utf-8")
            self.assertEqual(cache.get(url)[1], text)
            Path(directory, cache_key(url) + ".html").write_text("<p>changed</p>", encoding="utf-8")
            with self.assertRaises(ValueError):
                cache.get(url)

    def test_only_reviewed_sites(self):
        validate_url("https://sf6-genten.com/character/ken/category/combo")
        for url in ("http://sf6-lab.net/a", "https://example.com/a", "https://u:p@sf6-lab.net/a"):
            with self.assertRaises(ValueError):
                validate_url(url)


class ProvisionalIdParityTest(unittest.TestCase):
    def test_same_identity_as_reconcile_script(self):
        import importlib.util
        spec = importlib.util.spec_from_file_location("rec", REPO / "scripts/reconcile-strategy-intake.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        row = {"character_slug": "ryu", "category": "combo", "steps": "2弱P > 強 昇龍拳", "conditions_note": "",
               "source_url": "https://sf6-lab.net/fighters/ryu/combo", "page_updated": "2026-08-31"}
        expected = module.provisional_id(row)
        self.assertRegex(expected, r"^provisional:[0-9a-f]{64}$")
        self.assertEqual(module.provisional_id({**row, "steps": "2弱P  >  強 昇龍拳"}), expected)


class EndToEndFixtureTest(unittest.TestCase):
    """Runs bulk_strategy.py offline on a two-row fixture through the real card generator."""

    def test_ready_duplicate_and_hold(self):
        with tempfile.TemporaryDirectory() as directory:
            d = Path(directory)
            url = "https://sf6-lab.net/fighters/ryu/combo"
            html = "<h2>コンボ</h2><h3>1 小技</h3><p>2弱P ＞ 2中K ＞ 強竜巻旋風脚。</p>"
            cache = d / "cache"
            cache.mkdir()
            (cache / f"{cache_key(url)}.html").write_text(html, encoding="utf-8")
            (cache / f"{cache_key(url)}.json").write_text(json.dumps(
                {"url": url, "status": 200, "sha256": hashlib.sha256(html.encode()).hexdigest()}), encoding="utf-8")
            base = {"category": "combo", "character_slug": "ryu", "conditions_note": "", "source_url": url,
                    "page_updated": "2026-08-31", "quality": "A 掲載候補（テスト）", "duplicate": "なし",
                    "game_qa": "NOT_RUN", "publication": "HOLD_NOT_APPROVED", "management_no": ""}
            rows = [
                {**base, "heading": "小技", "steps": "2弱P > 2中K > 強竜巻旋風脚",
                 "management_ids": "ryu:2+LP:web:106 > ryu:2+MK:web:109 > ryu:214+HK:web:312", "batch_id": "T1"},
                {**base, "heading": "小技", "steps": "2弱P > 2中K > 強竜巻旋風脚",
                 "management_ids": "ryu:2+LP:web:106 > ryu:2+MK:web:109 > ryu:214+HK:web:312", "batch_id": "T2"},
                {**base, "heading": "無い", "steps": "2弱P > 弱 昇龍拳",
                 "management_ids": "ryu:2+LP:web:106 > ryu:626+LP:web:306", "batch_id": "T3"},
            ]
            with (d / "rows.csv").open("w", encoding="utf-8", newline="") as target:
                writer = csv.DictWriter(target, fieldnames=list(rows[0]))
                writer.writeheader()
                writer.writerows(rows)
            (d / "cards.json").write_text("[]", encoding="utf-8")
            (d / "reviews.json").write_text("{}", encoding="utf-8")
            (d / "registry.json").write_text('{"records": []}', encoding="utf-8")
            (d / "master.json").write_text(json.dumps(MASTER, ensure_ascii=False), encoding="utf-8")
            (d / "names.json").write_text('{"ryu": "リュウ"}', encoding="utf-8")
            completed = subprocess.run(
                [sys.executable, "-I", str(HERE / "bulk_strategy.py"), "--rows", str(d / "rows.csv"),
                 "--cards", str(d / "cards.json"), "--reviews", str(d / "reviews.json"),
                 "--registry", str(d / "registry.json"), "--master", str(d / "master.json"),
                 "--character-names", str(d / "names.json"), "--cache", str(cache), "--offline",
                 "--out", str(d / "out")], capture_output=True, text=True)
            self.assertEqual(completed.returncode, 0, completed.stderr)
            result = {r["batch_id"]: r for r in json.loads((d / "out/BULK_RESULT_ROWS.json").read_text(encoding="utf-8"))}
            self.assertEqual(result["T1"]["bucket"], "READY")
            self.assertEqual(result["T2"]["bucket"], "DUPLICATE")
            self.assertEqual(result["T3"]["bucket"], "HOLD")
            cards = json.loads((d / "out/BULK_NEW_CARDS.json").read_text(encoding="utf-8"))
            self.assertEqual(len(cards), 1)
            self.assertEqual(cards[0]["referenceNotice"], "ローカル確認用・公開未承認")
            self.assertEqual(cards[0]["commandNotice"], "資料原文と技参照を照合済み。現行Patchの成立は未検証。")
            # A corrected notice in the review entry is carried into the regenerated card.
            drafts = json.loads((d / "out/BULK_REVIEW_DRAFTS.json").read_text(encoding="utf-8"))
            for entry in drafts.values():
                entry["commandNotice"] = "一部の手順は技IDを特定できていない（テスト）。現行Patchの成立は未検証。"
            (d / "drafts2.json").write_text(json.dumps(drafts, ensure_ascii=False), encoding="utf-8")
            regenerated = subprocess.run(
                [sys.executable, "-I", str(REPO / "scripts/generate-local-strategy-cards.py"), str(d / "cards.json"),
                 str(d / "drafts2.json"), str(d / "out/BULK_READY_BATCH.csv")], capture_output=True, text=True)
            self.assertEqual(regenerated.returncode, 0, regenerated.stderr)
            self.assertIn("特定できていない", json.loads(regenerated.stdout)[0]["commandNotice"])
            metrics = json.loads((d / "out/BULK_METRICS.json").read_text(encoding="utf-8"))
            self.assertEqual(metrics["officialNumbersAssigned"], 0)
            ledger = (d / "out/SOURCE_FETCH_LEDGER.csv").read_text(encoding="utf-8-sig")
            self.assertNotIn("強竜巻旋風脚。", ledger, "page text must not be written to hand-off files")


if __name__ == "__main__":
    unittest.main()
