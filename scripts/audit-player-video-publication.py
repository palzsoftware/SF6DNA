#!/usr/bin/env python3
"""Offline, read-only classification of an existing DB snapshot. Never publishes data."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import urlsplit, parse_qs


PLAYER_CLASSES = ('READY', 'SOURCE_REQUIRED', 'PROFILE_INCOMPLETE', 'RELATION_ONLY', 'IMAGE_REQUIRED', 'HOLD')
VIDEO_CLASSES = ('READY', 'METADATA_INCOMPLETE', 'HOLD')
SOCIAL_FIELDS = ('youtube_url', 'twitch_url', 'x_url', 'website_url')
PROFILE_FIELDS = ('display_name', 'real_name', 'team_name', 'region', 'country_code', 'player_type', 'bio', 'image_url') + SOCIAL_FIELDS


def present(value):
    return isinstance(value, str) and bool(value.strip())


def safe_https(value):
    if not present(value) or any(c.isspace() or ord(c) < 32 for c in value):
        return False
    try:
        url = urlsplit(value)
        return (url.scheme == 'https' and bool(url.hostname) and not url.username
                and not url.password and url.port in (None, 443)
                and url.hostname not in ('localhost', '127.0.0.1', '::1'))
    except ValueError:
        return False


def video_key(value):
    if not safe_https(value):
        return None
    url = urlsplit(value)
    host = url.hostname.lower()
    key = None
    if host == 'youtu.be':
        key = url.path.strip('/').split('/')[0]
    elif host in ('youtube.com', 'www.youtube.com', 'm.youtube.com'):
        key = parse_qs(url.query).get('v', [None])[0]
        if not key:
            match = re.match(r'^/(?:shorts|live|embed)/([^/]+)', url.path)
            key = match.group(1) if match else None
    return key if key and re.fullmatch(r'[A-Za-z0-9_-]{11}', key) else None


def counts(rows, classes):
    primary = Counter(row['classification'] for row in rows)
    return {name: primary[name] for name in classes}


def audit(snapshot):
    # PostgreSQL json_agg emits null for empty tables; normalize without mutating input.
    snapshot = {**snapshot, **{name: snapshot.get(name) or [] for name in (
        'players', 'videos', 'characters', 'player_characters', 'entity_videos',
        'sources', 'entity_sources', 'tournament_results', 'tournaments', 'matches')}}
    players = snapshot.get('players', [])
    videos = snapshot.get('videos', [])
    characters = snapshot.get('characters', [])
    pcs = snapshot.get('player_characters', [])
    evs = snapshot.get('entity_videos', [])
    source_map = {str(x['id']): x for x in snapshot.get('sources', [])}
    player_map = {str(x['id']): x for x in players}
    video_map = {str(x['id']): x for x in videos}
    character_map = {str(x['id']): x for x in characters}
    # Optional audit-only review annotations, never a required application/DB column.
    # A reviewer can record the concrete existing source and claims it actually supports.
    evidence = snapshot.get('evidence_assessments', {})

    def source_info(kind, entity_id):
        relations = [x for x in snapshot.get('entity_sources', [])
                     if x.get('entity_type') == kind and str(x.get('entity_id')) == entity_id]
        rows = []
        for link in relations:
            src = source_map.get(str(link.get('source_id')))
            rows.append({'source_id': link.get('source_id'), 'relationship': link.get('relationship'),
                         'relation_note': link.get('note'),
                         'title': src.get('title') if src else None,
                         'publisher': src.get('publisher') if src else None,
                         'source_type': src.get('source_type') if src else None,
                         'reliability_level': src.get('reliability_level') if src else None,
                         'url': src.get('url') if src else None,
                         'safe_https': safe_https(src.get('url')) if src else False,
                         'source_exists': src is not None})
        return rows

    def claim_supported(kind, row):
        entry = evidence.get(f'{kind}:{row["id"]}', {})
        attached_ids = {x['source_id'] for x in source_info(kind, str(row['id'])) if x['safe_https']}
        required = 'displayed_profile_claims' if kind == 'player' else 'title_url_and_relations'
        return (entry.get('supported_claims') == required and present(entry.get('evidence_ref'))
                and entry.get('source_id') in attached_ids)

    player_slug_counts = Counter(x.get('slug') for x in players)
    player_rows = []
    for player in players:
        pid = str(player['id'])
        links = [x for x in pcs if str(x.get('player_id')) == pid]
        sources = source_info('player', pid)
        invalid_urls = [key for key in SOCIAL_FIELDS if present(player.get(key)) and not safe_https(player[key])]
        unresolved = [x for x in links if str(x.get('character_id')) not in character_map]
        reasons = []
        identity_ok = present(player.get('slug')) and present(player.get('display_name'))
        source_ok = any(x['safe_https'] and x['source_exists'] and present(x['title']) for x in sources)
        profile_present = any(present(player.get(key)) for key in ('bio',) + SOCIAL_FIELDS)
        duplicate_slug = player_slug_counts[player.get('slug')] > 1
        if duplicate_slug or invalid_urls or unresolved or player.get('status') not in ('draft', 'published'):
            classification = 'HOLD'
            if duplicate_slug: reasons.append('DUPLICATE_SLUG')
            if invalid_urls: reasons.append('UNSAFE_SOCIAL_URL')
            if unresolved: reasons.append('UNRESOLVED_CHARACTER_RELATION')
            if player.get('status') not in ('draft', 'published'): reasons.append('NON_ACTIVE_STATUS')
        elif not identity_ok:
            classification = 'PROFILE_INCOMPLETE'
            reasons.append('IDENTITY_FIELD_MISSING')
        elif not profile_present and links and not source_ok:
            classification = 'RELATION_ONLY'
            reasons.append('CHARACTER_LINK_NOT_PROFILE_EVIDENCE')
        elif not source_ok:
            classification = 'SOURCE_REQUIRED'
            reasons.append('NO_SAFE_ATTACHED_SOURCE')
        elif not claim_supported('player', player):
            classification = 'SOURCE_REQUIRED'
            reasons.append('PROFILE_CLAIM_VERIFICATION_REQUIRED')
        else:
            classification = 'READY'
        results = [x for x in snapshot.get('tournament_results', []) if str(x.get('player_id')) == pid]
        player_rows.append({'id': pid, 'slug': player.get('slug'), 'display_name': player.get('display_name'),
                            'current_status': player.get('status'), 'classification': classification,
                            'reasons': reasons, 'field_presence': {key: present(player.get(key)) for key in PROFILE_FIELDS},
                            'unsafe_social_fields': invalid_urls, 'image_required': False,
                            'image_policy': 'OPTIONAL; use existing approved image gate or text fallback',
                            'character_relations': links, 'sources': sources,
                            'tournament_result_count': len(results),
                            'tournament_claims_review_required': bool(results) and not claim_supported('player', player),
                            'structural_candidate': identity_ok and source_ok and not (invalid_urls or unresolved or duplicate_slug),
                            'reviewed_claim_support': claim_supported('player', player)})

    video_slug_counts = Counter(x.get('slug') for x in videos)
    video_keys = Counter(video_key(x.get('url')) for x in videos if video_key(x.get('url')))
    video_rows = []
    for video in videos:
        vid = str(video['id'])
        links = [x for x in evs if str(x.get('video_id')) == vid]
        sources = source_info('video', vid)
        valid_links = []
        unresolved = []
        for link in links:
            kind, eid = link.get('entity_type'), str(link.get('entity_id'))
            target = {'character': character_map, 'player': player_map,
                      'tournament': {str(x['id']): x for x in snapshot.get('tournaments', [])},
                      'match': {str(x['id']): x for x in snapshot.get('matches', [])}}.get(kind, {})
            (valid_links if eid in target else unresolved).append(link)
        url_ok = safe_https(video.get('url'))
        title_ok = present(video.get('title')) and present(video.get('slug'))
        source_ok = any(x['safe_https'] and x['source_exists'] and present(x['title']) for x in sources)
        relation_ok = bool(valid_links) and not unresolved
        key = video_key(video.get('url'))
        matching_sources = [{'source_id': x['id'], 'title': x.get('title'), 'publisher': x.get('publisher'),
                             'url': x.get('url'), 'source_type': x.get('source_type'),
                             'reliability_level': x.get('reliability_level'),
                             'match_basis': 'EXACT_URL' if x.get('url') == video.get('url') else 'SAME_YOUTUBE_VIDEO_ID'}
                            for x in snapshot['sources'] if safe_https(x.get('url')) and
                            (x.get('url') == video.get('url') or bool(key and video_key(x.get('url')) == key))]
        ext = video.get('external_id')
        duplicate = video_slug_counts[video.get('slug')] > 1 or bool(key and video_keys[key] > 1)
        mismatch = bool(key and present(ext) and key != ext)
        reasons = []
        if not url_ok or duplicate or mismatch or unresolved or video.get('status') not in ('draft', 'published'):
            classification = 'HOLD'
            if not url_ok: reasons.append('UNSAFE_VIDEO_URL')
            if duplicate: reasons.append('DUPLICATE_SLUG_OR_VIDEO_ID')
            if mismatch: reasons.append('EXTERNAL_ID_URL_MISMATCH')
            if unresolved: reasons.append('UNRESOLVED_ENTITY_RELATION')
            if video.get('status') not in ('draft', 'published'): reasons.append('NON_ACTIVE_STATUS')
        elif title_ok and source_ok and relation_ok and claim_supported('video', video):
            classification = 'READY'
        else:
            classification = 'METADATA_INCOMPLETE'
            if not title_ok: reasons.append('TITLE_OR_SLUG_MISSING')
            if not source_ok: reasons.append('SOURCE_REQUIRED')
            if not relation_ok: reasons.append('RELATION_REQUIRED')
            if not claim_supported('video', video): reasons.append('TITLE_CONTENT_AND_RELATION_VERIFICATION_REQUIRED')
        video_rows.append({'id': vid, 'slug': video.get('slug'), 'title': video.get('title'),
                           'url': video.get('url'), 'current_status': video.get('status'),
                           'classification': classification, 'reasons': reasons,
                           'dimensions': {'SOURCE_OK': source_ok, 'URL_OK': url_ok, 'TITLE_OK': title_ok,
                                          'RELATION_OK': relation_ok},
                           'relations': links, 'sources': sources,
                           'existing_url_matching_sources': matching_sources,
                           'source_binding_gap': bool(matching_sources) and not sources,
                           'duplicate_or_conflicting_identity': duplicate or mismatch,
                           'reviewed_claim_support': claim_supported('video', video),
                           'optional_metadata_not_inferred': {'channelName': None, 'durationSeconds': None,
                                'language': None, 'controlTypes': [], 'viewCount': None},
                           'structural_candidate': url_ok and title_ok and relation_ok and source_ok and not (duplicate or mismatch)})

    player_ready = {x['id'] for x in player_rows if x['classification'] == 'READY' and x['current_status'] == 'draft'}
    video_ready = {x['id'] for x in video_rows if x['classification'] == 'READY' and x['current_status'] == 'draft'}
    coverage = []
    for character in characters:
        if character.get('status') != 'published':
            continue
        cid = str(character['id'])
        player_ids = {str(x['player_id']) for x in pcs if str(x.get('character_id')) == cid}
        video_ids = {str(x['video_id']) for x in evs if x.get('entity_type') == 'character' and str(x.get('entity_id')) == cid}
        current_players = [pid for pid in sorted(player_ids) if player_map.get(pid, {}).get('status') == 'published']
        current_videos = [vid for vid in sorted(video_ids) if video_map.get(vid, {}).get('status') == 'published']
        coverage.append({'character_id': cid, 'slug': character.get('slug'), 'name': character.get('name_ja'),
                         'player_relation_count': len([x for x in pcs if str(x.get('character_id')) == cid]),
                         'current_public_player_ids': current_players,
                         'draft_player_ids': sorted(pid for pid in player_ids if player_map.get(pid, {}).get('status') == 'draft'),
                         'ready_draft_player_ids': sorted(player_ids & player_ready),
                         'video_relation_count': len([x for x in evs if x.get('entity_type') == 'character' and str(x.get('entity_id')) == cid]),
                         'current_public_video_ids': current_videos,
                         'draft_video_ids': sorted(vid for vid in video_ids if video_map.get(vid, {}).get('status') == 'draft'),
                         'ready_draft_video_ids': sorted(video_ids & video_ready),
                         'zero_public_player_gap_has_existing_draft_candidates': not current_players and any(player_map.get(pid, {}).get('status') == 'draft' for pid in player_ids),
                         'zero_public_player_gap_can_close_with_ready_candidates': not current_players and bool(player_ids & player_ready)})
    draft_players = [x for x in player_rows if x['current_status'] == 'draft']
    draft_videos = [x for x in video_rows if x['current_status'] == 'draft']
    return {'schema_version': 1, 'read_only': True, 'applied': False,
            'policy': {'READY': 'Existing identity + safe attached source + concrete source support for displayed claims + consistent relations; recommendation only. Optional evidence_assessments are audit annotations, not new DB fields or a publication gate.',
                       'source_relation': 'Presence is not claim verification; candidate/supporting labels are not approval.',
                       'images': 'Optional, never blocks a text profile.',
                       'video_dimensions': 'SOURCE_OK/URL_OK/TITLE_OK/RELATION_OK overlap; do not sum them as partitions.',
                       'current_public': 'Current published counts are reported independently; audit does not unpublish.'},
            'summary': {'players': {'total': len(players), 'published_current': sum(x.get('status') == 'published' for x in players),
                        'draft': len(draft_players), 'all_classification': counts(player_rows, PLAYER_CLASSES),
                        'draft_classification': counts(draft_players, PLAYER_CLASSES),
                        'draft_structural_candidates': sum(x['structural_candidate'] for x in draft_players)},
                        'videos': {'total': len(videos), 'published_current': sum(x.get('status') == 'published' for x in videos),
                        'draft': len(draft_videos), 'all_classification': counts(video_rows, VIDEO_CLASSES),
                        'draft_classification': counts(draft_videos, VIDEO_CLASSES),
                        'draft_dimensions': {k: sum(x['dimensions'][k] for x in draft_videos) for k in ('SOURCE_OK', 'URL_OK', 'TITLE_OK', 'RELATION_OK')},
                        'draft_structural_candidates': sum(x['structural_candidate'] for x in draft_videos),
                        'existing_source_url_matches_all': sum(bool(x['existing_url_matching_sources']) for x in video_rows),
                        'existing_source_url_matches_draft': sum(bool(x['existing_url_matching_sources']) for x in draft_videos),
                        'draft_source_binding_gaps': sum(x['source_binding_gap'] for x in draft_videos)},
                        'relations': {'player_characters': len(pcs), 'entity_videos': len(evs)},
                        'coverage': {'published_characters': len(coverage), 'zero_public_player_characters': sum(not x['current_public_player_ids'] for x in coverage),
                        'zero_player_gaps_with_existing_draft_candidates': sum(x['zero_public_player_gap_has_existing_draft_candidates'] for x in coverage),
                        'ready_candidate_zero_player_gap_closures': sum(x['zero_public_player_gap_can_close_with_ready_candidates'] for x in coverage)}},
            'players': player_rows, 'videos': video_rows, 'coverage': coverage}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('snapshot', type=Path)
    parser.add_argument('--output-dir', type=Path, required=True)
    args = parser.parse_args()
    raw = args.snapshot.read_bytes()
    result = audit(json.loads(raw))
    result['snapshot_sha256'] = hashlib.sha256(raw).hexdigest()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for name, key in (('PLAYER_PUBLICATION_AUDIT', 'players'), ('VIDEO_PUBLICATION_AUDIT', 'videos'), ('COVERAGE_PUBLICATION_AUDIT', 'coverage')):
        doc = {k: v for k, v in result.items() if k not in ('players', 'videos', 'coverage')}
        doc['rows'] = result[key]
        (args.output_dir / f'{name}.json').write_text(json.dumps(doc, ensure_ascii=False, indent=2) + '\n')
    bindings = [{'video_id': x['id'], 'slug': x['slug'], 'current_status': x['current_status'],
                 'url': x['url'], 'existing_source_candidates': x['existing_url_matching_sources'],
                 'status': 'REVIEW_THEN_BIND_EXISTING_SOURCE',
                 'required_review': ['title correctness', 'publisher attribution', 'relationship and claim scope'],
                 'applied': False} for x in result['videos'] if x['source_binding_gap']]
    binding_report = {'schema_version': 1, 'snapshot_sha256': result['snapshot_sha256'],
                      'read_only': True, 'applied': False, 'new_source_creation_required': False,
                      'counts': {'all': len(bindings), 'draft': sum(x['current_status'] == 'draft' for x in bindings),
                                 'published': sum(x['current_status'] == 'published' for x in bindings)}, 'rows': bindings}
    (args.output_dir / 'VIDEO_SOURCE_BINDING_PROPOSALS.json').write_text(json.dumps(binding_report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result['summary'], ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
