"""Fixture contracts for the read-only classifier; no external services."""
import copy
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('move_audit', Path(__file__).with_name('audit-move-publication.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

def snapshot():
    return {'moves': [{'id': 'm1', 'slug': 'ryu-test', 'name_ja': 'fixture', 'status': 'published', 'description_ja': 'fixture only'}],
            'move_commands': [{'id': 'c1', 'move_id': 'm1', 'control_scheme': 'classic', 'command_text': '236P'}],
            'move_frame_data': [{'id': 'f1', 'move_id': 'm1', 'verification_status': 'verified', 'valid_from_patch_id': 'p1', 'valid_to_patch_id': None}],
            'patches': [{'id': 'p1', 'is_current': True}],
            'sources': [{'id': 's1', 'reliability_level': 'official', 'source_type': 'official', 'title': 'fixture', 'url': 'https://example.invalid/fixture'}],
            'entity_sources': [{'entity_type': kind, 'entity_id': id_, 'source_id': 's1'} for kind, id_ in [('move','m1'),('move_command','c1'),('frame','f1')]]}

class AuditContract(unittest.TestCase):
    def row(self, data):
        original = copy.deepcopy(data)
        result = module.audit(data)['moves'][0]
        self.assertEqual(data, original, 'audit must not mutate the input')
        return result

    def test_publishable_requires_all_three_evidence_targets(self):
        data = snapshot()
        self.assertEqual(self.row(data)['classification'], 'PUBLISHABLE')
        data['entity_sources'].pop()
        self.assertEqual(self.row(data)['classification'], 'SOURCE_REQUIRED')

    def test_verified_flag_does_not_override_pending_note(self):
        data = snapshot()
        data['move_frame_data'][0]['notes'] = 'candidate: 実機確認待ち'
        row = self.row(data)
        self.assertTrue(row['code_gate_structural_candidate'])
        self.assertEqual(row['classification'], 'HOLD')
        self.assertEqual(len(row['pending_evidence']), 1)

    def test_scoped_omitted_field_note_does_not_invalidate_captured_fields(self):
        data = snapshot()
        data['move_frame_data'][0]['notes'] = 'UFD August 2026 reviewed; omitted fields remain unverified where not directly captured.'
        row = self.row(data)
        self.assertEqual(row['classification'], 'PUBLISHABLE')
        self.assertEqual(len(row['scoped_uncaptured_field_notes']), 1)
        data['move_frame_data'][0]['notes'] += ' Direct game verification pending; candidate.'
        self.assertEqual(self.row(data)['classification'], 'HOLD')

    def test_old_patch_cannot_be_current(self):
        data = snapshot()
        data['move_frame_data'][0]['valid_from_patch_id'] = 'p0'
        row = self.row(data)
        self.assertEqual(row['classification'], 'HOLD')
        self.assertEqual(row['open_verified_noncurrent_frame_ids'], ['f1'])

    def test_duplicate_frames_are_conflict(self):
        data = snapshot()
        data['move_frame_data'].append(dict(data['move_frame_data'][0], id='f2'))
        self.assertEqual(self.row(data)['classification'], 'DATA_INCONSISTENT')

    def test_empty_command_is_not_readiness_even_if_code_accepts_row(self):
        data = snapshot()
        data['move_commands'][0]['command_text'] = ' '
        row = self.row(data)
        self.assertTrue(row['code_gate_structural_candidate'])
        self.assertEqual(row['classification'], 'COMMAND_REQUIRED')

    def test_modern_only_is_not_substituted_for_classic(self):
        data = snapshot()
        data['move_commands'][0]['control_scheme'] = 'modern'
        self.assertEqual(self.row(data)['classification'], 'COMMAND_REQUIRED')

    def test_rpc_source_type_allowlist_remains_required(self):
        data = snapshot()
        data['sources'][0]['source_type'] = 'private_unknown_type'
        row = self.row(data)
        self.assertFalse(row['code_gate_structural_candidate'])
        self.assertEqual(row['classification'], 'SOURCE_REQUIRED')

    def test_http_is_not_https_evidence(self):
        data = snapshot()
        data['sources'][0]['url'] = 'http://example.invalid/'
        self.assertEqual(self.row(data)['classification'], 'SOURCE_REQUIRED')

    def test_draft_is_ready_to_prepare_only(self):
        data = snapshot()
        data['moves'][0]['status'] = 'draft'
        row = self.row(data)
        self.assertEqual(row['classification'], 'FRAME_VERIFIED_BUT_MOVE_DRAFT')
        self.assertFalse(row['code_gate_structural_candidate'])

    def test_description_requirement_is_separate_from_existing_gate(self):
        data = snapshot()
        data['moves'][0].pop('description_ja')
        row = self.row(data)
        self.assertEqual(row['classification'], 'DESCRIPTION_REQUIRED')
        self.assertTrue(row['code_gate_structural_candidate'])

    def test_primary_and_overlapping_counts_preserve_all_blockers(self):
        data = snapshot()
        data['moves'][0]['status'] = 'draft'
        data['entity_sources'] = []
        result = module.audit(data)
        self.assertEqual(result['classification_counts']['SOURCE_REQUIRED'], 1)
        self.assertEqual(result['frame_labelled_draft_moves'], 1)
        self.assertEqual(result['overlapping_reason_counts']['MOVE_NOT_PUBLISHED'], 1)
        self.assertEqual(sum(result['classification_counts'].values()), result['total'])

    def test_relation_pending_note_is_preserved_with_exact_id(self):
        data = snapshot()
        data['entity_sources'][0]['note'] = '未検証'
        row = self.row(data)
        self.assertEqual(row['classification'], 'SOURCE_REQUIRED')
        self.assertEqual(row['source_scoped_pending_evidence'][0]['entity_id'], 'm1')

    def test_optional_candidate_does_not_veto_complete_official_evidence(self):
        data = snapshot()
        data['sources'].append({'id': 'weak', 'title': 'fixture candidate', 'url': 'https://example.invalid/secondary', 'source_type': 'community_guide', 'reliability_level': 'community', 'notes': 'Candidate data only; retain draft until direct official/game verification.'})
        data['entity_sources'].append({'entity_type': 'move', 'entity_id': 'm1', 'source_id': 'weak', 'relationship': 'candidate'})
        row = self.row(data)
        self.assertEqual(row['classification'], 'PUBLISHABLE')
        self.assertEqual(len(row['source_scoped_pending_evidence']), 1)
        data['moves'][0]['notes'] = 'candidate: do not publish until direct verification'
        self.assertEqual(self.row(data)['classification'], 'HOLD')

    def test_compact_report_round_trip_preserves_all_diagnostics(self):
        import json
        data = snapshot()
        data['move_frame_data'][0]['notes'] = 'candidate: 未検証'
        report = module.audit(data)
        packed = json.loads(json.dumps(module.compact_report(report)))
        self.assertEqual(module.expand_report(packed), report)

    def test_missing_snapshot_fails_closed(self):
        with self.assertRaises(ValueError): module.audit({'moves': []})

    def test_multiple_current_patches_fail_closed(self):
        data = snapshot()
        data['patches'].append({'id': 'p2', 'is_current': True})
        self.assertEqual(self.row(data)['classification'], 'HOLD')

if __name__ == '__main__': unittest.main()
