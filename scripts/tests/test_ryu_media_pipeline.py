"""Synthetic fixtures verify tools, never Ryu recordings or game identities."""
import copy
import importlib.util
import json
import shutil
import stat
import subprocess
import tempfile
import unittest
import zipfile
from pathlib import Path

SPEC = importlib.util.spec_from_file_location('pipeline', Path(__file__).parents[1] / 'ryu-media-pipeline.py')
pipeline = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(pipeline)


class PipelineTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.expected = {'character': 'ryu', 'moves': [{'move_id': 'fixture-id', 'move_slug': 'fixture-only', 'move_name': 'SYNTHETIC FIXTURE NOT A GAME MOVE', 'category': 'NORMAL', 'order': 1, 'expected_file': 'fixture.mp4'}]}

    def tearDown(self):
        self.tmp.cleanup()

    def archive(self, name, content=b'fixture'):
        z = self.root / 'capture.zip'
        with zipfile.ZipFile(z, 'w') as f:
            f.writestr(name, content)
        return z

    def test_intake_valid_hash_and_no_overwrite(self):
        z = self.archive('nested/fixture.mp4')
        out = self.root / 'captures'
        result = pipeline.intake(z, out)
        self.assertEqual(result['status'], 'CAPTURE_RECEIVED_NOT_VERIFIED')
        self.assertEqual(result['files'][0]['sha256'], pipeline.sha256(out / 'nested/fixture.mp4'))
        with self.assertRaises(ValueError): pipeline.intake(z, out)

    def test_path_traversal_rejected_before_extract(self):
        for name in ('../outside.mp4', '/absolute.mp4', 'x/../../outside.mp4', 'C:/capture.mp4', 'a\\outside.mp4'):
            z = self.archive(name)
            with self.assertRaises(ValueError): pipeline.intake(z, self.root / 'captures')
            self.assertFalse((self.root / 'captures').exists())

    def test_symlink_rejected(self):
        z = self.root / 'link.zip'
        with zipfile.ZipFile(z, 'w') as f:
            info = zipfile.ZipInfo('linked.mp4'); info.create_system = 3
            info.external_attr = (stat.S_IFLNK | 0o777) << 16
            f.writestr(info, '../secret')
        with self.assertRaises(ValueError): pipeline.intake(z, self.root / 'captures')

    def test_duplicate_case_paths_rejected(self):
        z = self.root / 'dup.zip'
        with zipfile.ZipFile(z, 'w') as f:
            f.writestr('A.mp4', b'a'); f.writestr('a.mp4', b'b')
        with self.assertRaises(ValueError): pipeline.intake(z, self.root / 'captures')

    def test_zip_bomb_and_count_limits(self):
        z = self.root / 'bomb.zip'
        with zipfile.ZipFile(z, 'w', compression=zipfile.ZIP_DEFLATED) as f: f.writestr('fixture.mp4', b'0' * (2 * 1024**2))
        with self.assertRaises(ValueError): pipeline.intake(z, self.root / 'captures')
        with zipfile.ZipFile(z, 'w') as f:
            for i in range(257): f.writestr(f'{i}.mp4', b'a')
        with self.assertRaises(ValueError): pipeline.intake(z, self.root / 'captures')

    def test_missing_order_and_cut_never_auto_approved(self):
        m = pipeline.checklist(self.expected)
        self.assertEqual(m['status'], 'ORDER_NOT_VERIFIED')
        self.assertEqual(m['moves'][0]['move_name'], self.expected['moves'][0]['move_name'])
        with self.assertRaisesRegex(ValueError, 'review required'): pipeline.validate_mapping(self.expected, m, self.root)

    def reviewed(self):
        m = pipeline.checklist(self.expected)
        m['moves'][0].update(start=0, end=1, order_reviewed=True, cut_reviewed=True, mapping_reviewed=True)
        (self.root / 'fixture.mp4').touch()
        m['moves'][0]['source_sha256'] = pipeline.sha256(self.root / 'fixture.mp4')
        return m

    def test_mapping_identity_mismatch(self):
        m = self.reviewed()
        for field, value in [('move_id', 'wrong'), ('move_slug', 'wrong'), ('move_name', 'wrong'), ('category', 'CA'), ('file', 'other.mp4')]:
            bad = copy.deepcopy(m); bad['moves'][0][field] = value
            with self.assertRaises(ValueError): pipeline.validate_mapping(self.expected, bad, self.root)

    def test_changed_recording_invalidates_review(self):
        m = self.reviewed()
        (self.root / 'fixture.mp4').write_bytes(b'changed after review')
        with self.assertRaisesRegex(ValueError, 'source hash mismatch'): pipeline.validate_mapping(self.expected, m, self.root)

    def test_invalid_ranges(self):
        m = self.reviewed()
        for start, end in [(-1, 1), (1, 1), (0, 21), (float('nan'), 1), (0, float('inf'))]:
            bad = copy.deepcopy(m); bad['moves'][0].update(start=start, end=end)
            with self.assertRaises(ValueError): pipeline.validate_mapping(self.expected, bad, self.root)

    def test_duplicate_expected_and_overlapping_ranges(self):
        bad = copy.deepcopy(self.expected); bad['moves'].append(copy.deepcopy(bad['moves'][0]))
        with self.assertRaises(ValueError): pipeline.checklist(bad)
        expected = copy.deepcopy(self.expected)
        expected['moves'].append(expected['moves'][0] | {'move_id': 'second', 'move_slug': 'second', 'order': 2})
        m = self.reviewed(); m['moves'].append(m['moves'][0] | {'move_id': 'second', 'move_slug': 'second', 'order': 2})
        with self.assertRaisesRegex(ValueError, 'overlapping'): pipeline.validate_mapping(expected, m, self.root)

    @unittest.skipUnless(shutil.which('ffmpeg') and shutil.which('ffprobe'), 'ffmpeg tools required')
    def test_synthetic_video_encoding_and_boundary_proposal(self):
        source = self.root / 'fixture.mp4'
        subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'testsrc2=size=96x64:rate=15:duration=2', '-c:v', 'libx264', '-threads', '1', str(source)], check=True)
        m = pipeline.checklist(self.expected)
        m['moves'][0].update(start=0, end=1, order_reviewed=True, cut_reviewed=True, mapping_reviewed=True)
        m['moves'][0]['source_sha256'] = pipeline.sha256(source)
        result = pipeline.render(self.expected, m, self.root, self.root / 'staged')
        self.assertEqual(result['webp_count'], 1)
        self.assertEqual(result['status'], 'NOT_BOUND_NOT_GAME_VERIFIED')
        asset = self.root / 'staged/ryu-fixture-only.webp'
        data = asset.read_bytes()
        self.assertEqual(data[:4], b'RIFF'); self.assertEqual(data[8:12], b'WEBP'); self.assertIn(b'ANIM', data)
        self.assertEqual(json.loads((self.root / 'staged/encoding-report.json').read_text())['total_bytes'], asset.stat().st_size)
        with self.assertRaises(ValueError): pipeline.render(self.expected, m, self.root, self.root / 'staged')
        p = pipeline.propose(source)
        self.assertEqual(p['status'], 'REVIEW_REQUIRED_NO_MOVE_IDENTITIES_INFERRED')
        self.assertTrue(all(x['move_id'] is None for x in p['proposals']))


if __name__ == '__main__':
    unittest.main()
