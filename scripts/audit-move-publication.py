#!/usr/bin/env python3
"""Read-only move publication readiness audit. Does not promote or mutate records."""
import argparse
from collections import Counter, defaultdict
import json
import hashlib
from pathlib import Path
import re

CLASSES = ('PUBLISHABLE', 'FRAME_VERIFIED_BUT_MOVE_DRAFT', 'SOURCE_REQUIRED',
           'COMMAND_REQUIRED', 'DESCRIPTION_REQUIRED', 'DATA_INCONSISTENT', 'HOLD')
PUBLIC_SOURCE_TYPES = frozenset(('article character_guide community community_aggregator community_article community_combo_database community_discussion community_frame_database community_guide community_structured_data community_video community_wiki frame_data frame_database guide official official_esports_release official_frame_data official_movelist official_patch official_patch_notes official_store official_store_news official_video player_database player_reference social_post strategy strategy_guide structured_dataset tournament_report video video_guide video_playlist').split())
UNVERIFIED = re.compile(r'candidate|未検証|未実機|実機確認待ち|実機未確認|要実機|not[ -]verified|unverified|verification[ -]pending', re.I)


def pending_note(value):
    if not nonempty(value):
        return False
    # These exact existing notes scope uncertainty to omitted/uncaptured fields.
    # They do not negate the captured row; preserve the note without filling NULLs.
    scoped = re.sub(r'(?:omitted fields|Missing exact fields|exact uncaptured special properties) remain unverified(?:/review backlog)?', '', value, flags=re.I)
    return bool(UNVERIFIED.search(scoped))


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def audit(snapshot):
    required = ('moves', 'move_commands', 'move_frame_data', 'patches', 'entity_sources', 'sources')
    for key in required:
        if not isinstance(snapshot.get(key), list):
            raise ValueError('snapshot must contain array: ' + key)
    moves = snapshot['moves']
    current = [p for p in snapshot['patches'] if p.get('is_current') is True]
    current_id = current[0]['id'] if len(current) == 1 else None
    commands, frames, links = defaultdict(list), defaultdict(list), defaultdict(list)
    sources = {s['id']: s for s in snapshot['sources']}
    for c in snapshot['move_commands']:
        commands[c['move_id']].append(c)
    for f in snapshot['move_frame_data']:
        frames[f['move_id']].append(f)
    for link in snapshot['entity_sources']:
        links[(link.get('entity_type'), link.get('entity_id'))].append(link)
    id_counts, slug_counts = Counter(m['id'] for m in moves), Counter(m.get('slug') for m in moves)

    def evidence(types, ids):
        result = []
        for kind in types:
            for entity_id in ids:
                for link in links[(kind, entity_id)]:
                    source = sources.get(link.get('source_id'))
                    if source:
                        result.append({'entity_type': kind, 'entity_id': entity_id,
                                       'source_id': source['id'], 'title': source.get('title'), 'relationship': link.get('relationship'),
                                       'source_type': source.get('source_type'),
                                       'reliability_level': source.get('reliability_level'),
                                       'url': source.get('url'), 'source_notes': source.get('notes'),
                                       'relation_note': link.get('note')})
        return result

    result = []
    for move in sorted(moves, key=lambda m: str(m.get('slug', ''))):
        move_id = move['id']
        classic = [c for c in commands[move_id] if c.get('control_scheme') == 'classic']
        usable_classic = [c for c in classic if any(nonempty(c.get(k)) for k in ('command_text', 'numeric_notation', 'button_notation'))]
        active = [f for f in frames[move_id] if f.get('verification_status') == 'verified' and f.get('valid_to_patch_id') is None]
        verified = [f for f in active if current_id and f.get('valid_from_patch_id') == current_id]
        move_ev = evidence(['move'], [move_id])
        cmd_ev = evidence(['move_command'], [c['id'] for c in classic])
        frame_ev = evidence(['frame', 'move_frame_data'], [f['id'] for f in verified])
        all_ev = move_ev + cmd_ev + frame_ev
        official = lambda ev: any(e.get('reliability_level') == 'official' and e.get('source_type') in PUBLIC_SOURCE_TYPES and nonempty(e.get('title')) and nonempty(e.get('url')) for e in ev)
        credible = lambda ev: any(not pending_note(e.get('source_notes')) and not pending_note(e.get('relation_note')) and e.get('reliability_level') == 'official' and e.get('source_type') in PUBLIC_SOURCE_TYPES and nonempty(e.get('title')) and str(e.get('url') or '').startswith('https://') for e in ev)
        code_evidence = all(official(ev) for ev in (move_ev, cmd_ev, frame_ev))
        source_ready = all(credible(ev) for ev in (move_ev, cmd_ev, frame_ev))
        description = any(nonempty(move.get(k)) for k in ('description_ja', 'description', 'usage_summary_ja', 'usage_summary'))
        reasons, conflicts = [], []
        if len(current) != 1: reasons.append('CURRENT_PATCH_NOT_UNIQUE_OR_MISSING')
        if move.get('status') != 'published': reasons.append('MOVE_NOT_PUBLISHED')
        if not classic: reasons.append('CLASSIC_COMMAND_ROW_MISSING')
        elif not usable_classic: reasons.append('CLASSIC_COMMAND_TEXT_MISSING')
        if not verified: reasons.append('CURRENT_VERIFIED_FRAME_MISSING')
        for label, ev in (('MOVE', move_ev), ('CLASSIC_COMMAND', cmd_ev), ('CURRENT_FRAME', frame_ev)):
            if not official(ev): reasons.append(label + '_OFFICIAL_EVIDENCE_MISSING')
            elif not credible(ev): reasons.append(label + '_HTTPS_OFFICIAL_EVIDENCE_MISSING')
        if not description: reasons.append('DESCRIPTION_MISSING')
        if id_counts[move_id] > 1 or (move.get('slug') and slug_counts[move['slug']] > 1): conflicts.append('DUPLICATE_ID_OR_SLUG')
        if len(verified) > 1: conflicts.append('MULTIPLE_CURRENT_VERIFIED_FRAMES')
        if not move.get('slug') or not (move.get('name_ja') or move.get('name_en')): conflicts.append('IDENTITY_FIELDS_MISSING')
        texts = [('move.notes', move.get('notes'))]
        texts += [('frame:' + str(f['id']), f.get('notes')) for f in verified]
        texts += [('command:' + str(c['id']), c.get('notes')) for c in classic]
        source_pending = []
        for e in all_ev:
            for field in ('source_notes', 'relation_note'):
                if pending_note(e.get(field)):
                    source_pending.append({'entity_type': e['entity_type'], 'entity_id': e['entity_id'], 'source_id': e['source_id'], 'field': field, 'text': e[field]})
        if source_pending:
            reasons.append('SOURCE_SCOPED_PENDING_NOTES_REVIEW_REQUIRED')
        holds = [{'location': label, 'text': text} for label, text in texts if pending_note(text)]
        if holds: reasons.append('EXPLICIT_PENDING_OR_CANDIDATE_EVIDENCE')
        if conflicts: reasons += conflicts
        code_if_published = bool(current_id and classic and verified and code_evidence)
        code_ready = bool(move.get('status') == 'published' and current_id and classic and verified and code_evidence)
        if conflicts: category = 'DATA_INCONSISTENT'
        elif holds or not current_id or not verified: category = 'HOLD'
        elif not usable_classic: category = 'COMMAND_REQUIRED'
        elif not source_ready: category = 'SOURCE_REQUIRED'
        elif not description: category = 'DESCRIPTION_REQUIRED'
        elif move.get('status') != 'published': category = 'FRAME_VERIFIED_BUT_MOVE_DRAFT'
        else: category = 'PUBLISHABLE'
        result.append({'move_id': move_id, 'slug': move.get('slug'), 'character_id': move.get('character_id'),
                       'name_ja': move.get('name_ja'), 'status': move.get('status'), 'classification': category,
                       'reasons': reasons, 'code_gate_structural_candidate': code_ready, 'code_gate_if_status_published': code_if_published,
                       'current_verified_frame_ids': [f['id'] for f in verified],
                       'open_verified_noncurrent_frame_ids': [f['id'] for f in active if f not in verified],
                       'classic_command_ids': [c['id'] for c in classic],
                       'scoped_uncaptured_field_notes': [{'frame_id': f['id'], 'note': f['notes']} for f in verified if nonempty(f.get('notes')) and 'unverified' in f['notes'].lower() and not pending_note(f['notes'])], 'description_exists': description,
                       'source_evidence': all_ev, 'pending_evidence': holds, 'source_scoped_pending_evidence': source_pending})
    counts = Counter(row['classification'] for row in result)
    reason_counts = Counter(reason for row in result for reason in row['reasons'])
    return {'audit_type': 'READ_ONLY_PUBLICATION_PREPARATION', 'db_write': False,
            'snapshot_sha': snapshot.get('snapshot_sha'), 'snapshot_date': snapshot.get('snapshot_date', snapshot.get('fetched_at')),
            'current_patch_ids': [p['id'] for p in current], 'total': len(result),
            'classification_counts': {kind: counts[kind] for kind in CLASSES},
            'overlapping_reason_counts': dict(sorted(reason_counts.items())),
            'verified_frame_rows_total': sum(f.get('verification_status') == 'verified' for f in snapshot['move_frame_data']),
            'current_verified_frame_rows': sum(len(r['current_verified_frame_ids']) for r in result),
            'current_verified_frame_moves': sum(bool(r['current_verified_frame_ids']) for r in result),
            'frame_labelled_draft_moves': sum(bool(r['current_verified_frame_ids']) and r['status'] != 'published' for r in result),
            'command_present_no_conflict_frame_candidates': sum(bool(r['current_verified_frame_ids']) and not any(x in r['reasons'] for x in ('DUPLICATE_ID_OR_SLUG', 'MULTIPLE_CURRENT_VERIFIED_FRAMES', 'IDENTITY_FIELDS_MISSING', 'CLASSIC_COMMAND_ROW_MISSING', 'CLASSIC_COMMAND_TEXT_MISSING', 'EXPLICIT_PENDING_OR_CANDIDATE_EVIDENCE')) for r in result),
            'code_gate_structural_candidates': sum(r['code_gate_structural_candidate'] for r in result),
            'code_gate_if_status_published_candidates': sum(r['code_gate_if_status_published'] for r in result),
            'public_strategy_feature_enabled': False,
            'limitations': ['Official DB labels and HTTPS do not independently verify a source claim.',
                            'Code structural candidates are not proof of RPC eligibility or actual public visibility.',
                            'Pending/candidate notes block evidence-ready classification despite verified flags.',
                            'Description is a readiness requirement, not an existing code gate requirement.',
                            'No records are published and no game facts are generated.'],
            'moves': result}


def compact_report(report):
    """Lossless columnar diagnostic tables; avoid repeating source paragraphs."""
    identifiers, notes, id_index, note_index = [], [], {}, {}
    tables = {'evidence': [], 'pending': [], 'source_pending': [], 'scoped': []}
    indexes = {key: {} for key in tables}
    source_registry = {}
    label_registry = []
    label_index = {}
    def label(value):
        if value not in label_index:
            label_index[value] = len(label_registry); label_registry.append(value)
        return label_index[value]
    def ident(value):
        if value is None: return None
        if value not in id_index:
            id_index[value] = len(identifiers); identifiers.append(value)
        return id_index[value]
    def note(value):
        if value not in note_index:
            note_index[value] = len(notes); notes.append(value)
        return note_index[value]
    def table(name, value):
        signature = json.dumps(value, ensure_ascii=False, sort_keys=True)
        if signature not in indexes[name]:
            indexes[name][signature] = len(tables[name]); tables[name].append(value)
        return indexes[name][signature]
    columns = list(report['moves'][0]) if report['moves'] else []
    rows = []
    for move in report['moves']:
        values = []
        for key in columns:
            value = move[key]
            if key in ('move_id', 'character_id'): value = ident(value)
            elif key in ('status', 'classification'): value = label(value)
            elif key == 'reasons': value = [label(item) for item in value]
            elif key in ('current_verified_frame_ids', 'open_verified_noncurrent_frame_ids', 'classic_command_ids'):
                value = [ident(item) for item in value]
            elif key == 'source_evidence':
                encoded = []
                for item in value:
                    source_id = ident(item['source_id'])
                    source_registry[source_id] = [item['title'], item['source_type'], item['reliability_level'], item['url'], note(item['source_notes'])]
                    encoded.append(table('evidence', [label(item['entity_type']), ident(item['entity_id']), source_id, label(item['relationship']), note(item['relation_note'])]))
                value = encoded
            elif key == 'pending_evidence':
                value = [table('pending', [item['location'], note(item['text'])]) for item in value]
            elif key == 'source_scoped_pending_evidence':
                value = [table('source_pending', [label(item['entity_type']), ident(item['entity_id']), ident(item['source_id']), label(item['field']), note(item['text'])]) for item in value]
            elif key == 'scoped_uncaptured_field_notes':
                value = [table('scoped', [ident(item['frame_id']), note(item['note'])]) for item in value]
            values.append(value)
        rows.append(values)
    output = {key: value for key, value in report.items() if key != 'moves'}
    output.update({'format': 'move-publication-columnar-v1', 'move_columns': columns, 'moves': rows,
                   'identifiers': identifiers, 'note_registry': notes, 'source_registry': source_registry,
                   'diagnostic_tables': tables, 'label_registry': label_registry})
    return output


def expand_report(report):
    """Return the exact original per-move dictionaries for consumers/tests."""
    identifiers, notes, tables = report['identifiers'], report['note_registry'], report['diagnostic_tables']
    source_registry = report['source_registry']
    def ident(value): return None if value is None else identifiers[value]
    result = {key: value for key, value in report.items() if key not in ('format', 'move_columns', 'moves', 'identifiers', 'note_registry', 'source_registry', 'diagnostic_tables', 'label_registry')}
    moves = []
    for values in report['moves']:
        move = dict(zip(report['move_columns'], values))
        for key, value in list(move.items()):
            if key in ('move_id', 'character_id'): move[key] = ident(value)
            elif key in ('status', 'classification'): move[key] = report['label_registry'][value]
            elif key == 'reasons': move[key] = [report['label_registry'][item] for item in value]
            elif key in ('current_verified_frame_ids', 'open_verified_noncurrent_frame_ids', 'classic_command_ids'):
                move[key] = [ident(item) for item in value]
            elif key == 'source_evidence':
                expanded = []
                for index in value:
                    kind, entity_id, source_id, relationship, relation_note = tables['evidence'][index]
                    source = source_registry.get(source_id, source_registry.get(str(source_id)))
                    expanded.append({'entity_type': report['label_registry'][kind], 'entity_id': ident(entity_id), 'source_id': ident(source_id), 'title': source[0], 'relationship': report['label_registry'][relationship], 'source_type': source[1], 'reliability_level': source[2], 'url': source[3], 'source_notes': notes[source[4]], 'relation_note': notes[relation_note]})
                move[key] = expanded
            elif key == 'pending_evidence':
                move[key] = [{'location': tables['pending'][index][0], 'text': notes[tables['pending'][index][1]]} for index in value]
            elif key == 'source_scoped_pending_evidence':
                move[key] = [{'entity_type': report['label_registry'][tables['source_pending'][index][0]], 'entity_id': ident(tables['source_pending'][index][1]), 'source_id': ident(tables['source_pending'][index][2]), 'field': report['label_registry'][tables['source_pending'][index][3]], 'text': notes[tables['source_pending'][index][4]]} for index in value]
            elif key == 'scoped_uncaptured_field_notes':
                move[key] = [{'frame_id': ident(tables['scoped'][index][0]), 'note': notes[tables['scoped'][index][1]]} for index in value]
        moves.append(move)
    result['moves'] = moves
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('snapshot', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    snapshot_bytes = args.snapshot.read_bytes()
    report = audit(json.loads(snapshot_bytes))
    report['source_snapshot_sha256'] = hashlib.sha256(snapshot_bytes).hexdigest()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(compact_report(report), ensure_ascii=False, separators=(',', ':')) + '\n')
    print(json.dumps({k: report[k] for k in ('total', 'classification_counts', 'current_verified_frame_moves', 'code_gate_structural_candidates')}, ensure_ascii=False))

if __name__ == '__main__':
    main()
