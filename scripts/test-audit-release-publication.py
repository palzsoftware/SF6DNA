import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("audit", Path(__file__).with_name("audit-release-publication.py"))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class PublicationAuditTests(unittest.TestCase):
    def row(self, **changes):
        row = dict(character="test", status="draft", sql_gate=True,
                   command_evidence=True, frame_evidence=True, move_evidence=True, current_verified=True)
        row.update(changes)
        return row

    def test_status_is_separate_from_sql_gate(self):
        self.assertEqual(audit.classify(self.row())[0], "NEEDS_STATUS_PROMOTION")
        self.assertEqual(audit.classify(self.row(status="published"))[0], "READY_FOR_PUBLICATION")
        self.assertEqual(audit.classify(self.row(status="archived"))[0], "HOLD")

    def test_all_missing_reasons_preserved(self):
        primary, reasons = audit.classify(self.row(sql_gate=False, command_evidence=False, frame_evidence=False, move_evidence=False))
        self.assertEqual(primary, "NEEDS_COMMAND_AND_FRAME_EVIDENCE")
        self.assertEqual(len(reasons), 4)

    def test_unverified_frame_never_status_only(self):
        self.assertEqual(audit.classify(self.row(sql_gate=False, current_verified=False, frame_evidence=False))[0], "UNVERIFIED_DATA")

    def test_sql_disagreement_fails_closed(self):
        self.assertEqual(audit.classify(self.row(sql_gate=False))[0], "HOLD")

    def test_overlapping_counts_are_not_exclusive(self):
        result = audit.summary([self.row(sql_gate=False, command_evidence=False, move_evidence=False)])[0]
        self.assertEqual(result["total_moves"], 1)
        self.assertEqual(result["command_evidence_missing"], 1)
        self.assertEqual(result["source_relation_missing"], 1)
        self.assertEqual(result["status_only"], 0)


if __name__ == "__main__":
    unittest.main()
