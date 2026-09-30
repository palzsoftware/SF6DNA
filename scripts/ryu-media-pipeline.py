#!/usr/bin/env python3
"""Offline, fail-closed user-capture preparation. No DB/network/asset assignment.
Outputs are review artifacts; rendered files are staged, never copied to public/.
"""
import argparse
import hashlib
import json
import math
import re
import shutil
import stat
import subprocess
import zipfile
from pathlib import Path, PurePosixPath

CATEGORIES = {'NORMAL', 'UNIQUE', 'SPECIAL', 'SUPER', 'CA'}
SLUG = re.compile(r'[a-z0-9]+(?:-[a-z0-9]+)*\Z')
MAX_FILES = 256
MAX_FILE_BYTES = 2 * 1024**3
MAX_TOTAL_BYTES = 8 * 1024**3
MAX_RECORDING_SECONDS = 3600
MAX_CLIP_SECONDS = 20


def require(condition, message):
    if not condition:
        raise ValueError(message)


def relative_file(value):
    require(isinstance(value, str) and value and '\\' not in value and ':' not in value and '\x00' not in value, 'unsafe file name')
    p = PurePosixPath(value)
    require(not p.is_absolute() and all(x not in {'..', '.'} for x in value.split('/')) and not value.startswith('/'), 'unsafe file path')
    return p


def write_json(path, data):
    with Path(path).open('x', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')


def sha256(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as f:
        for block in iter(lambda: f.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def intake(archive, destination):
    destination = Path(destination)
    require(not destination.exists(), 'destination must be new; existing assets are never overwritten')
    with zipfile.ZipFile(archive) as z:
        infos = z.infolist()
        require(0 < len(infos) <= MAX_FILES, 'ZIP entry count outside allowed range')
        names = set()
        total = 0
        for info in infos:
            relative_file(info.filename.rstrip('/'))
            key = info.filename.casefold().rstrip('/')
            require(key not in names, 'duplicate ZIP path')
            names.add(key)
            kind = stat.S_IFMT(info.external_attr >> 16)
            require(kind in {0, stat.S_IFREG, stat.S_IFDIR}, 'ZIP links or special files are forbidden')
            require(not info.flag_bits & 1, 'encrypted ZIP is unsupported')
            require(info.is_dir() or Path(info.filename).suffix.lower() in {'.mp4', '.json', '.txt', '.csv'}, 'unsupported ZIP file type')
            require(info.file_size <= MAX_FILE_BYTES, 'ZIP entry too large')
            require(info.file_size < 1024 * 1024 or info.file_size / max(info.compress_size, 1) <= 200, 'suspicious ZIP compression ratio')
            total += info.file_size
        require(total <= MAX_TOTAL_BYTES, 'ZIP expanded size too large')
        require(shutil.disk_usage(destination.parent).free >= total + 100 * 1024**2, 'insufficient disk space')
        destination.mkdir(mode=0o700)
        try:
            for info in infos:
                output = destination.joinpath(*PurePosixPath(info.filename).parts)
                if info.is_dir():
                    output.mkdir(parents=True, exist_ok=True)
                    continue
                output.parent.mkdir(parents=True, exist_ok=True)
                copied = 0
                with z.open(info) as src, output.open('xb') as dst:
                    for block in iter(lambda: src.read(1024 * 1024), b''):
                        copied += len(block)
                        require(copied <= info.file_size, 'ZIP size exceeded declaration')
                        dst.write(block)
                require(copied == info.file_size, 'ZIP size mismatch')
        except Exception:
            shutil.rmtree(destination)
            raise
    return {'status': 'CAPTURE_RECEIVED_NOT_VERIFIED', 'files': [{'file': str(p.relative_to(destination)), 'bytes': p.stat().st_size, 'sha256': sha256(p)} for p in sorted(destination.rglob('*')) if p.is_file()]}


def expected_moves(data):
    require(SLUG.fullmatch(data.get('character', '')) is not None, 'invalid character slug')
    rows = data.get('moves')
    require(isinstance(rows, list) and rows, 'expected moves must be nonempty')
    ids, slugs, orders = set(), set(), set()
    for row in rows:
        require(isinstance(row.get('move_id'), str) and row['move_id'], 'move_id required')
        require(SLUG.fullmatch(row.get('move_slug', '')) is not None, 'invalid move_slug')
        require(isinstance(row.get('move_name'), str) and row['move_name'], 'move_name required')
        require(row.get('category') in CATEGORIES, 'invalid category')
        require(type(row.get('order')) is int and row['order'] > 0, 'positive order required')
        relative_file(row.get('expected_file'))
        require(row['move_id'] not in ids and row['move_slug'] not in slugs, 'duplicate move ID or slug')
        require((row['expected_file'], row['order']) not in orders, 'duplicate file/order')
        ids.add(row['move_id']); slugs.add(row['move_slug']); orders.add((row['expected_file'], row['order']))
    return rows


def checklist(data):
    rows = expected_moves(data)
    return {'character': data['character'], 'status': 'ORDER_NOT_VERIFIED', 'expected_move_count': len(rows), 'moves': [{**r, 'file': r['expected_file'], 'start': None, 'end': None, 'order_reviewed': False, 'cut_reviewed': False, 'mapping_reviewed': False, 'source_sha256': None, 'status': 'RECORDING_NOT_RECEIVED'} for r in rows]}


def probe(path):
    result = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height', '-of', 'json', str(path)], check=True, capture_output=True, text=True, timeout=30)
    data = json.loads(result.stdout)
    duration = float(data['format']['duration'])
    require(math.isfinite(duration) and 0 < duration <= MAX_RECORDING_SECONDS, 'recording duration outside limits')
    video = next((s for s in data['streams'] if s.get('codec_type') == 'video'), None)
    require(video and 0 < video.get('width', 0) <= 4096 and 0 < video.get('height', 0) <= 4096, 'video dimensions outside limits')
    return duration


def propose(path):
    duration = probe(path)
    result = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-threads', '1', '-i', str(path), '-an', '-vf', 'scale=160:-2,freezedetect=n=-35dB:d=0.7', '-f', 'null', '-'], capture_output=True, text=True, check=True, timeout=600)
    starts = [float(x) for x in re.findall(r'freeze_start: ([0-9.]+)', result.stderr)]
    ends = [float(x) for x in re.findall(r'freeze_end: ([0-9.]+)', result.stderr)]
    freezes = [(start, next((end for end in ends if end >= start), duration)) for start in starts]
    clips = []
    previous = 0.0
    for start, end in freezes + [(duration, duration)]:
        if start - previous > 0.15:
            clips.append({'start': round(max(0, previous - 0.3), 3), 'end': round(min(duration, start + 0.3), 3), 'status': 'CUT_BOUNDARY_PROPOSAL_ONLY', 'move_id': None})
        previous = end
    return {'file': Path(path).name, 'duration': duration, 'method': 'whole-frame-freezedetect; moving background/HUD may prevent or create false boundaries', 'status': 'REVIEW_REQUIRED_NO_MOVE_IDENTITIES_INFERRED', 'stationary_intervals': freezes, 'proposals': clips}


def validate_mapping(expected, manifest, source_root):
    rows = expected_moves(expected)
    require(manifest.get('character') == expected['character'], 'character mismatch')
    supplied = manifest.get('moves', [])
    require(len(supplied) == len(rows), 'manifest count differs from expected list')
    lookup = {r['move_id']: r for r in rows}
    seen = set(); clips = []; file_intervals = {}
    root = Path(source_root).resolve()
    for row in supplied:
        ident = row.get('move_id')
        require(ident in lookup and ident not in seen, 'unknown or duplicate move ID')
        seen.add(ident)
        canonical = lookup[ident]
        for field in ('move_slug', 'move_name', 'category', 'order'):
            require(row.get(field) == canonical[field], f'{ident}: {field} mismatch')
        require(row.get('file') == canonical['expected_file'], f'{ident}: recording file mismatch')
        require(all(row.get(f) is True for f in ('order_reviewed', 'cut_reviewed', 'mapping_reviewed')), f'{ident}: order/cut/mapping review required')
        relative_file(row['file'])
        path = root.joinpath(*PurePosixPath(row['file']).parts)
        require(path.resolve().is_relative_to(root) and path.is_file() and not path.is_symlink(), 'source missing or escapes root')
        require(isinstance(row.get('source_sha256'), str) and row['source_sha256'] == sha256(path), f'{ident}: reviewed source hash mismatch')
        start, end = row.get('start'), row.get('end')
        require(type(start) in (int, float) and type(end) in (int, float) and math.isfinite(start) and math.isfinite(end) and 0 <= start < end and end - start <= MAX_CLIP_SECONDS, f'{ident}: invalid time range')
        intervals = file_intervals.setdefault(row['file'], [])
        require(all(end <= a or start >= b for a, b in intervals), f'{ident}: overlapping clip range')
        intervals.append((start, end))
        clips.append({**row, 'source_path': str(path)})
    return clips


def render(expected, manifest, source_root, destination):
    clips = validate_mapping(expected, manifest, source_root)
    out = Path(destination)
    require(not out.exists(), 'output must be a new staging directory')
    durations = {c['source_path']: probe(c['source_path']) for c in clips}
    require(all(c['end'] <= durations[c['source_path']] for c in clips), 'clip exceeds recording duration')
    out.mkdir(parents=True, mode=0o700)
    results = []
    try:
        for clip in clips:
            asset = out / f"{expected['character']}-{clip['move_slug']}.webp"
            subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-n', '-threads', '1', '-ss', str(clip['start']), '-t', str(clip['end'] - clip['start']), '-i', clip['source_path'], '-an', '-vf', "fps=15,scale='min(640,iw)':-2", '-c:v', 'libwebp_anim', '-quality', '75', '-loop', '0', '-threads', '1', str(asset)], check=True, timeout=180)
            require(0 < asset.stat().st_size <= 20 * 1024**2, 'encoded WebP outside size limit')
            results.append({k: v for k, v in clip.items() if k != 'source_path'} | {'asset_file': asset.name, 'bytes': asset.stat().st_size, 'sha256': sha256(asset), 'status': 'ENCODED_STAGING_ONLY_VISUAL_QA_REQUIRED'})
        report = {'character': expected['character'], 'status': 'NOT_BOUND_NOT_GAME_VERIFIED', 'expected_move_count': len(clips), 'webp_count': len(results), 'total_bytes': sum(r['bytes'] for r in results), 'moves': results}
        write_json(out / 'encoding-report.json', report)
        return report
    except Exception:
        shutil.rmtree(out)
        raise


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    subs = parser.add_subparsers(dest='command', required=True)
    p = subs.add_parser('intake'); p.add_argument('archive'); p.add_argument('destination'); p.add_argument('report')
    p = subs.add_parser('checklist'); p.add_argument('expected'); p.add_argument('output')
    p = subs.add_parser('propose'); p.add_argument('recording'); p.add_argument('output')
    p = subs.add_parser('render'); p.add_argument('expected'); p.add_argument('manifest'); p.add_argument('source_root'); p.add_argument('destination')
    args = parser.parse_args()
    load = lambda file: json.loads(Path(file).read_text(encoding='utf-8'))
    if args.command == 'intake': write_json(args.report, intake(args.archive, args.destination))
    elif args.command == 'checklist': write_json(args.output, checklist(load(args.expected)))
    elif args.command == 'propose': write_json(args.output, propose(args.recording))
    else: render(load(args.expected), load(args.manifest), args.source_root, args.destination)


if __name__ == '__main__':
    main()
