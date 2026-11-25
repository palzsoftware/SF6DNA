"""python3 -I -B scripts/moves/test_build_all32_public_candidate_sql.py  (no network, no DB)"""
import importlib.util, json, pathlib, unittest

spec = importlib.util.spec_from_file_location("gen", pathlib.Path(__file__).with_name("build_all32_public_candidate_sql.py"))
gen = importlib.util.module_from_spec(spec); spec.loader.exec_module(gen)


def raw(**kw):
    row = {"name": "技", "classic": "", "modern": "", "classicListed": "", "modernListed": "", "note": "", "damage": "", "file": "x"}
    row.update(kw); return row


class Classify(unittest.TestCase):
    def test_modern_only_needs_modern_input_and_no_classic_row(self):
        self.assertEqual(gen.classify(raw(classic="", modern="3＋強", classicListed="掲載なし", modernListed="あり（Modern表のみ）"))[0], "modern_only")
        self.assertEqual(gen.classify(raw(classic="（クラシック表に行なし）", modern="3+強"))[0], "modern_only")

    def test_condition_only_uses_the_official_name_part_and_never_an_input(self):
        kind, cond = gen.classify(raw(name="弱 アロン（2段目）", classic="-", modern="-", classicListed="あり", modernListed="あり"))
        self.assertEqual((kind, cond), ("condition_only", "公式表の入力欄は「-」。公式技名に記載の区分：2段目"))
        self.assertEqual(gen.classify(raw(name="息吹の震撼(飛び道具)", classic="　", classicListed="あり"))[1], "公式表の入力欄は空欄。公式技名に記載の区分：飛び道具")

    def test_rows_outside_the_table_pages_are_unidentified(self):
        self.assertEqual(gen.classify(raw(name="ODセイスモ", classicListed="掲載なし", modernListed="掲載なし"))[0], "unidentified")
        self.assertEqual(gen.classify(raw(name="サイコマイン", classic="-", classicListed="あり"))[0], "unidentified")


class Scope(unittest.TestCase):
    def test_only_rows_on_the_official_page_are_in_the_first_release(self):
        self.assertTrue(gen.on_official_page(raw(file="x", classicListed="あり", modernListed="あり")))
        self.assertTrue(gen.on_official_page(raw(file="x", classicListed="掲載なし", modernListed="あり（Modern表のみ）")))
        self.assertTrue(gen.on_official_page(raw(file=gen.RYUJP)))
        self.assertFalse(gen.on_official_page(raw(file="x", classicListed="掲載なし", modernListed="掲載なし", classic="6 + LPMPHP")))


class Review(unittest.TestCase):
    def test_nested_leading_condition_moves_whole_to_the_condition_cell(self):
        self.assertEqual(gen.split_leading_condition("（キルステップ（前方）中に）6 + LP | MP | HP"), ("6 + LP | MP | HP", "キルステップ（前方）中に"))
        self.assertEqual(gen.split_leading_condition("（百鬼襲中に） LK | MK | HK"), ("（百鬼襲中に） LK | MK | HK", None), "simple conditions stay as they were")
        self.assertEqual(gen.split_leading_condition("236 + LP"), ("236 + LP", None))

    def test_review_file_covers_the_33_off_page_rows(self):
        data = json.load(open(pathlib.Path(__file__).with_name("offpage33_official_review_20261125.json"), encoding="utf-8"))
        self.assertEqual((len(data["mergeInto"]), len(data["holdUnconfirmed"])), (29, 4))
        self.assertTrue(all(k.startswith("m-bison:") for k in data["holdUnconfirmed"]))
        self.assertEqual(data["mergeInto"]["cammy:sha:9782f286153045b2f6bd"], "cammy:web:502")  # air throw -> レッグシザースチョーク
        self.assertEqual(data["mergeInto"]["terry:sha:bf4c02fec75bed41ad97"], "terry:web:402")  # ダブルゲイザー -> ツインゲイザー
        self.assertNotIn("guile:web:328", [k for k, v in data["supplementCondition"].items() if any("4" == x or "6" == x for x in v)])
        self.assertFalse(any("6 +" in x or "6+" in x for v in data["supplementCondition"].values() for x in v), "internal inputs are never added")


class ScreenRecheck(unittest.TestCase):
    def test_only_the_two_rows_whose_screen_value_has_no_mark(self):
        data = json.load(open(pathlib.Path(__file__).with_name("official_screen_recheck_20261125.json"), encoding="utf-8"))["frameScreenValues"]
        self.assertEqual(sorted(data), ["kimberly:web:327", "zangief:web:122"])
        for fix in (v for row in data.values() for v in row.values()):
            self.assertEqual(fix["internal"], fix["screen"] + "※", "same number; only the mark that the table screen does not show")


class Damage(unittest.TestCase):
    def test_plain_number(self):
        self.assertEqual(gen.damage_notation(raw(damage="900")), (900, None, None))

    def test_marked_value_is_text_with_its_damage_lines_only(self):
        note = "ヒット時にメダルLvが1上昇／※メダルLvに応じてダメージが上昇／メダルLv1　2000（2300）／（）内はパニッシュカウンター時のダメージ／※メダルLvに応じてSAゲージ増加量が上昇／メダルLv1-2 3000"
        self.assertEqual(gen.damage_notation(raw(damage="※2000", note=note)),
                         (None, "※2000", "※メダルLvに応じてダメージが上昇／メダルLv1　2000（2300）／（）内はパニッシュカウンター時のダメージ"))

    def test_no_number_is_invented(self):
        self.assertEqual(gen.damage_notation(raw(damage="NaN")), (None, None, None))
        self.assertEqual(gen.damage_notation(raw(damage="2200※1850", note="※動作中に、下方向を入力し続けると性質が変化")),
                         (None, "2200※1850", "※動作中に、下方向を入力し続けると性質が変化"))


if __name__ == "__main__":
    unittest.main()
