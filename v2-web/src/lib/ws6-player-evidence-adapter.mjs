import { createHash } from 'node:crypto';

// Server/build-time staging adapter. No DB, network, UUID generation or publication.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const READY = new Set(['CONFIRMED_MATCH', 'CONFIRMED_NEW_CANDIDATE']);
const PLATFORMS = { X: ['x.com', 'twitter.com'], YouTube: ['youtube.com', 'www.youtube.com'], Twitch: ['twitch.tv', 'www.twitch.tv'] };
function url(value, hosts) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && (!hosts || hosts.includes(u.hostname)) ? u.href : null; }
  catch { return null; }
}
function day(value, now) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = Date.parse(value + 'T00:00:00Z');
  return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value && parsed <= now;
}
function text(value) { return typeof value === 'string' && value.trim().length > 0; }
function key(value) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }

export function buildSfl48EvidenceBundle(input, now = Date.now()) {
  if (!Number.isFinite(now)) throw new Error('INVALID_NOW');
  const identities = input.identity?.rows;
  const profiles = input.profiles?.candidates;
  if (!Array.isArray(identities) || !Array.isArray(profiles) || identities.length !== 48 || profiles.length !== 48) throw new Error('EXPECTED_SFL48');
  const ids = new Map(), names = new Map(), teams = new Map(), uuids = new Set();
  for (const row of identities) {
    if (!/^SFL2026-\d{2}$/.test(row.roster_key) || ids.has(row.roster_key) || !text(row.player) || names.has(row.player)) throw new Error('DUPLICATE_OR_INVALID_IDENTITY');
    if (!READY.has(row.status) && row.status !== 'MATCH_CANDIDATE') throw new Error('UNKNOWN_IDENTITY_STATE');
    if (row.status === 'CONFIRMED_NEW_CANDIDATE' && row.player_id_candidate !== null) throw new Error('NEW_UUID_NOT_ALLOWED');
    if (row.status !== 'CONFIRMED_NEW_CANDIDATE' && (!UUID.test(row.player_id_candidate || '') || uuids.has(row.player_id_candidate))) throw new Error('INVALID_EXISTING_UUID');
    if (row.player_id_candidate) uuids.add(row.player_id_candidate);
    ids.set(row.roster_key, row); names.set(row.player, row);
  }
  const records = [], holds = [], seenProfiles = new Set();
  for (const p of profiles) {
    const identity = ids.get(p.roster_key);
    if (!identity || seenProfiles.has(p.roster_key) || identity.player_id_candidate !== p.player_id_candidate || identity.status !== p.identity_status || identity.player !== p.player_detail_candidate?.displayName) throw new Error('PROFILE_IDENTITY_MISMATCH');
    seenProfiles.add(p.roster_key);
    if (!text(p.league_roster_affiliation) || p.league_season !== 2026) throw new Error('INVALID_SEASON_ROSTER');
    teams.set(p.league_roster_affiliation, (teams.get(p.league_roster_affiliation) || 0) + 1);
    if (!READY.has(identity.status)) { holds.push({ rosterKey: p.roster_key, player: identity.player, reason: 'EXISTING_UUID_HOLD' }); continue; }
    records.push({ rosterKey: p.roster_key, playerId: p.player_id_candidate, displayName: identity.player,
      identityStatus: identity.status, leagueRoster: { team: p.league_roster_affiliation, season: 2026 },
      // League membership must not become primary organization; no Main/Sub guesses.
      currentMain: null, currentSub: null, primaryTeamName: null,
      profileIntake: { teams: [], characters: [], devices: [], recommendedVideos: [] },
      socialCandidates: [], tournamentCandidates: [], publicationReady: false, writeAllowed: false });
  }
  if (teams.size !== 12 || [...teams.values()].some(n => n !== 4)) throw new Error('INVALID_TEAM_COVERAGE');
  const recordByKey = new Map(records.map(r => [r.rosterKey, r]));
  const used = new Set();
  for (const c of input.characters?.previous_tournament_usage || []) {
    const identity = ids.get(c.roster_key), record = recordByKey.get(c.roster_key);
    if (!identity || identity.player !== c.player) throw new Error('CHARACTER_IDENTITY_MISMATCH');
    if (!record) continue;
    if (c.role !== 'TOURNAMENT_CHARACTER' || c.state !== 'PRIMARY_EVENT_RECORD_SUPPORTED' || c.main_promotion !== false || !text(c.event) || !text(c.character) || !day(c.date, now) || !url(c.source)) {
      holds.push({ rosterKey: c.roster_key, reason: 'CHARACTER_SOURCE_OR_SCOPE_HOLD' }); continue;
    }
    const evidenceKey = key([c.roster_key, c.character, c.event, c.date, c.source]);
    if (used.has(evidenceKey)) continue; used.add(evidenceKey);
    record.profileIntake.characters.push({ label: `${c.event}：${c.character}（大会使用）`, state: 'HISTORICAL', sourceUrl: url(c.source), sourceDate: c.date, verified: false });
  }
  for (const s of input.socials || []) {
    const identity = names.get(s.player), record = identity && recordByKey.get(identity.roster_key);
    if (!identity) throw new Error('SOCIAL_IDENTITY_MISMATCH');
    if (!record) continue;
    const hosts = PLATFORMS[s.platform];
    const sourceUrls = [...new Set([s.source, ...(s.evidence_references || []).map(ref => ref.source?.url)].filter(v => url(v)))];
    if (!hosts || !url(s.url, hosts) || s.source_reference_resolved !== true || !sourceUrls.length) {
      holds.push({ rosterKey: record.rosterKey, reason: 'SOCIAL_SOURCE_OR_URL_HOLD' }); continue;
    }
    const evidenceKey = key([record.rosterKey, s.platform, url(s.url, hosts)]);
    if (used.has(evidenceKey)) continue; used.add(evidenceKey);
    record.socialCandidates.push({ platform: s.platform, url: url(s.url, hosts), sourceUrls,
      sourceDate: s.source_date || null, freshness: s.current_freshness || 'NOT_INDEPENDENTLY_CONFIRMED_CURRENT', verified: false });
  }
  const officialResults = [ ...(input.results?.previous?.new_primary_result || []).filter(r => r.state === 'CAPCOM_RESULT_SUPPORTED'), ...(input.results?.new_organizer_confirmed || []).filter(r => r.organizer_verified === true) ];
  for (const result of officialResults) {
    const identity = names.get(result.player), record = identity && recordByKey.get(identity.roster_key);
    if (!identity) throw new Error('RESULT_IDENTITY_MISMATCH');
    if (!record) continue;
    if (!url(result.source) || !Number.isInteger(result.placement) || result.placement < 1 || !text(result.event)) { holds.push({ rosterKey: record.rosterKey, reason: 'RESULT_SOURCE_HOLD' }); continue; }
    const evidenceKey = key([record.rosterKey, result.event, result.placement, result.source]);
    if (used.has(evidenceKey)) continue; used.add(evidenceKey);
    record.tournamentCandidates.push({ event: result.event, resultType: result.result_type || 'TOURNAMENT_PLACEMENT', placement: result.placement,
      sourceUrl: url(result.source), sourceDate: result.source_date || null, eventDate: result.event_date_jst || null,
      cptPoints: null, sflIndividualPoints: null, character: null, verified: false });
  }
  records.sort((a, b) => a.rosterKey.localeCompare(b.rosterKey));
  return { schema: 'SF6DNA_WS6_EVIDENCE_BUNDLE_V1', records, holds,
    summary: { roster: 48, identityReady: records.length, identityHolds: holds.filter(h => h.reason === 'EXISTING_UUID_HOLD').length,
      tournamentCharacterFacts: records.reduce((n, r) => n + r.profileIntake.characters.length, 0), socialCandidates: records.reduce((n, r) => n + r.socialCandidates.length, 0), tournamentCandidates: records.reduce((n, r) => n + r.tournamentCandidates.length, 0), publishedFacts: 0 },
    publicationReady: false, writeAllowed: false };
}
