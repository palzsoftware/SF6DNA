"""Synthetic contracts for publication classification; no live DB or network calls."""
import importlib.util
import json
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'audit-player-video-publication.py'
spec = importlib.util.spec_from_file_location('publication_audit', SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PublicationAuditTest(unittest.TestCase):
    def snapshot(self):
        return {'characters': [{'id': 'c', 'slug': 'synthetic', 'status': 'published'}],
                'players': [{'id': 'p', 'slug': 'person', 'display_name': 'Synthetic Person', 'status': 'draft'}],
                'videos': [{'id': 'v', 'slug': 'video', 'title': 'Synthetic Video', 'url': 'https://www.youtube.com/watch?v=abcdefghijk', 'status': 'draft'}],
                'sources': [{'id': 's', 'title': 'Synthetic official reference', 'url': 'https://example.org/profile'}],
                'entity_sources': [{'entity_type': 'player', 'entity_id': 'p', 'source_id': 's', 'relationship': 'supporting'},
                                   {'entity_type': 'video', 'entity_id': 'v', 'source_id': 's', 'relationship': 'supporting'}],
                'player_characters': [{'player_id': 'p', 'character_id': 'c'}],
                'entity_videos': [{'video_id': 'v', 'entity_type': 'character', 'entity_id': 'c'}]}

    def test_supporting_relation_alone_does_not_approve(self):
        result = module.audit(self.snapshot())
        self.assertEqual(result['players'][0]['classification'], 'SOURCE_REQUIRED')
        self.assertEqual(result['videos'][0]['classification'], 'METADATA_INCOMPLETE')
        self.assertFalse(result['applied'])

    def test_verified_reference_image_optional_and_metadata_stays_null(self):
        snapshot = self.snapshot()
        snapshot['evidence_assessments'] = {'player:p': {'source_id': 's', 'supported_claims': 'displayed_profile_claims', 'evidence_ref': 'review://synthetic-identity'},
                                            'video:v': {'source_id': 's', 'supported_claims': 'title_url_and_relations', 'evidence_ref': 'review://synthetic-video'}}
        result = module.audit(snapshot)
        self.assertEqual(result['players'][0]['classification'], 'READY')
        self.assertFalse(result['players'][0]['image_required'])
        self.assertEqual(result['videos'][0]['classification'], 'READY')
        self.assertIsNone(result['videos'][0]['optional_metadata_not_inferred']['language'])
        self.assertEqual(result['coverage'][0]['ready_draft_player_ids'], ['p'])

    def test_url_credentials_and_non_https_fail(self):
        for value in ('http://example.org', 'https://user:secret@example.org', 'javascript:alert(1)', 'https://localhost/', 'https://example.org:9000/', 'https://example.org/a\n'):
            self.assertFalse(module.safe_https(value), value)
        self.assertTrue(module.safe_https('https://www.youtube.com/watch?v=abcdefghijk'))

    def test_missing_title_and_unsupported_relations_are_not_ready(self):
        snapshot = self.snapshot()
        snapshot['videos'][0]['title'] = ''
        snapshot['entity_videos'][0]['entity_id'] = 'missing'
        result = module.audit(snapshot)
        self.assertEqual(result['videos'][0]['classification'], 'HOLD')
        self.assertIn('UNRESOLVED_ENTITY_RELATION', result['videos'][0]['reasons'])

    def test_duplicate_youtube_urls_are_same_entity_identity(self):
        snapshot = self.snapshot()
        snapshot['videos'].append({'id': 'v2', 'slug': 'different', 'title': 'Other', 'status': 'draft', 'url': 'https://youtu.be/abcdefghijk?t=20'})
        result = module.audit(snapshot)
        self.assertTrue(all(x['classification'] == 'HOLD' for x in result['videos']))
        self.assertEqual(sum(result['summary']['videos']['draft_classification'].values()), 2)

    def test_relation_only_profile_and_current_public_count_are_separate(self):
        snapshot = self.snapshot()
        snapshot['entity_sources'] = []
        snapshot['players'][0]['status'] = 'published'
        result = module.audit(snapshot)
        self.assertEqual(result['players'][0]['classification'], 'RELATION_ONLY')
        self.assertEqual(result['summary']['players']['published_current'], 1)
        self.assertEqual(result['summary']['players']['draft'], 0)
        self.assertEqual(result['coverage'][0]['current_public_player_ids'], ['p'])

    def test_external_id_mismatch_and_fake_youtube_host_are_detected(self):
        snapshot = self.snapshot()
        snapshot['videos'][0]['external_id'] = 'xxxxxxxxxxx'
        result = module.audit(snapshot)
        self.assertIn('EXTERNAL_ID_URL_MISMATCH', result['videos'][0]['reasons'])
        self.assertIsNone(module.video_key('https://evil-youtube.com/watch?v=abcdefghijk'))

    def test_snapshot_not_mutated_and_dimensions_are_overlapping(self):
        snapshot = self.snapshot()
        before = json.dumps(snapshot, sort_keys=True)
        result = module.audit(snapshot)
        self.assertEqual(json.dumps(snapshot, sort_keys=True), before)
        self.assertEqual(sum(result['summary']['videos']['draft_classification'].values()), 1)
        self.assertEqual(sum(result['summary']['videos']['draft_dimensions'].values()), 4)

    def test_unattached_review_reference_never_marks_ready(self):
        snapshot = self.snapshot()
        snapshot['evidence_assessments'] = {'player:p': {'source_id': 'missing', 'supported_claims': 'displayed_profile_claims', 'evidence_ref': 'review://unattached'}}
        result = module.audit(snapshot)
        self.assertNotEqual(result['players'][0]['classification'], 'READY')

    def test_existing_source_url_match_is_binding_gap_not_publication_approval(self):
        snapshot = self.snapshot()
        snapshot['sources'][0]['url'] = snapshot['videos'][0]['url']
        snapshot['entity_sources'] = []
        result = module.audit(snapshot)
        self.assertTrue(result['videos'][0]['source_binding_gap'])
        self.assertEqual(result['summary']['videos']['existing_source_url_matches_draft'], 1)
        self.assertEqual(result['videos'][0]['classification'], 'METADATA_INCOMPLETE')
        self.assertFalse(result['videos'][0]['dimensions']['SOURCE_OK'])

    def test_null_aggregated_table_is_empty(self):
        snapshot = self.snapshot()
        snapshot['tournament_results'] = None
        self.assertEqual(module.audit(snapshot)['players'][0]['tournament_result_count'], 0)


if __name__ == '__main__':
    unittest.main()
