"""Tests for build_card_command_icons.py (kept separate from test_bulk_strategy.py to avoid patch overlap)."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
class CardCommandIconsTest(unittest.TestCase):
    def test_only_fixed_system_inputs(self):
        from build_card_command_icons import system_command
        self.assertEqual(system_command("前ステップ×2", ["REPEAT_N", "FORWARD_STEP"]), ["66", "66"])
        self.assertEqual(system_command("キャンセルドライブラッシュ", ["DRIVE_RUSH_UNSPECIFIED"]), ["CDR"])
        self.assertEqual(system_command("ドライブラッシュ", ["DRIVE_RUSH_UNSPECIFIED"]), ["DR"])
        for step, tags in (("前歩き", ["WALK_FORWARD"]), ("ガード", ["GUARD"]), ("歩き", ["WALK"])):
            self.assertIsNone(system_command(step, tags), step)

    def test_unidentified_step_holds_whole_card(self):
        from build_card_command_icons import convert

        class FakeMatcher:
            def card(self, slug, command):
                return "NOT_MATCHED", [("しゃがみ中P", {"kind": "MOVE", "key": "k1", "tags": []}),
                                       ("中ダロイ", {"kind": "HOLD", "key": None, "tags": []})]
        steps, reasons = convert(FakeMatcher(), {"k1": {"raw": {"command": "2 + MP"}}}, {"characterSlug": "x", "commandJapanese": ""})
        self.assertIsNone(steps)
        self.assertEqual(reasons, ["MOVE_NOT_IDENTIFIED:中ダロイ"])
        # The same step converts only through a verified abbreviation row.
        steps, reasons = convert(FakeMatcher(), {"k1": {"raw": {"command": "2 + MP"}}, "k2": {"raw": {"command": "236 + MP"}}},
                                 {"characterSlug": "x", "commandJapanese": ""}, {("x", "中ダロイ"): "k2"})
        self.assertEqual([s["command"] for s in steps], ["2 + MP", "236 + MP"])

    def test_supporting_text_and_opponent(self):
        from build_card_command_icons import convert

        class FakeMatcher:
            def card(self, slug, command):
                return "", [("立ち強K", {"kind": "OPPONENT_MOVE", "key": None, "tags": []}),
                            ("ガード", {"kind": "SYSTEM_ACTION", "key": None, "tags": ["GUARD"]}),
                            ("しゃがみ中K", {"kind": "MOVE", "key": "k1", "tags": []})]
        steps, _ = convert(FakeMatcher(), {"k1": {"raw": {"command": "2 + MK"}}}, {"characterSlug": "x", "commandJapanese": ""})
        self.assertEqual(steps, [{"opponent": "立ち強K"}, {"text": "ガード"}, {"command": "2 + MK", "moveKey": "k1"}])

    def test_tags_stripped_by_the_matcher_are_kept(self):
        from build_card_command_icons import convert

        class FakeMatcher:
            def card(self, slug, command):
                return "", [("ドライブラッシュ しゃがみ中P", {"kind": "MOVE", "key": "k1", "tags": ["DRIVE_RUSH_UNSPECIFIED"]}),
                            ("立ち弱P×2", {"kind": "MOVE", "key": "k2", "tags": ["REPEAT_N"]}),
                            ("強P（パニカン）", {"kind": "MOVE", "key": "k3", "tags": ["PUNISH_COUNTER"]})]
        master = {"k1": {"raw": {"command": "2 + MP"}}, "k2": {"raw": {"command": "LP"}}, "k3": {"raw": {"command": "HP"}}}
        steps, _ = convert(FakeMatcher(), master, {"characterSlug": "x", "commandJapanese": ""})
        self.assertEqual([s.get("command") or s.get("text") for s in steps], ["DR", "2 + MP", "LP", "LP", "HP", "パニッシュカウンター"])

    def test_projectile_part_uses_parent_only_when_unique(self):
        from build_card_command_icons import projectile_parent
        master = {"a:1": {"characterSlug": "a", "raw": {"skill": "弱 岩", "command": "214 + LK"}},
                  "a:2": {"characterSlug": "a", "raw": {"skill": "中 岩", "command": "214 + MK"}},
                  "a:3": {"characterSlug": "a", "raw": {"skill": "岩(飛び道具)", "command": "\u3000"}},
                  "b:1": {"characterSlug": "b", "raw": {"skill": "OD 波", "command": "236 + LPMP"}},
                  "b:2": {"characterSlug": "b", "raw": {"skill": "波", "command": "236 + P"}},
                  "b:3": {"characterSlug": "b", "raw": {"skill": "OD 波(飛び道具)", "command": ""}}}
        self.assertIsNone(projectile_parent(master, "a:3"), "two strengths: not unique")
        self.assertEqual(projectile_parent(master, "b:3"), "b:1", "the only OD parent")
        self.assertIsNone(projectile_parent(master, "a:1"), "not a projectile part")

    def test_opponent_only_is_hold(self):
        from build_card_command_icons import convert

        class FakeMatcher:
            def card(self, slug, command):
                return "", [("立ち強K", {"kind": "OPPONENT_MOVE", "key": None, "tags": []})]
        steps, reasons = convert(FakeMatcher(), {}, {"characterSlug": "x", "commandJapanese": ""})
        self.assertIsNone(steps)
        self.assertEqual(reasons, ["NO_OWN_INPUT"])



if __name__ == "__main__":
    unittest.main()
