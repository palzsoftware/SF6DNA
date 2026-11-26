/** V1.0 offline intake gate. No database writes, no public rendering. */
export type Environment = 'production' | 'development';
export type Evidence = {
  environment: Environment;
  tournamentId: string;
  playerId: string;
  playerSlug: string;
  identityConfirmed: boolean;
  tournamentConfirmed: boolean;
  divisionCompatible: boolean;
  sourceConfirmed: boolean;
  publicationApproved: boolean;
  playerPublished: boolean;
  tournamentPublished: boolean;
  publicPlayerGatePassed: boolean;
};
export type Candidate = {
  environment: Environment;
  tournamentId: string | null;
  playerId: string | null;
  playerSlug: string | null;
  divisionKey: string;
  placement: number | null;
  kind: 'individual' | 'team';
};
export type Decision = { state: 'READY_FOR_REVIEW' | 'HOLD'; reason: string };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const slug = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const hold = (reason: string): Decision => ({state:'HOLD', reason});
/** Evidence must come from independently verified target-environment records, never from the candidate CSV itself. */
export function classifyTournamentIntake(candidate: Candidate, evidence: Evidence | null, target: Environment): Decision {
  if (target !== 'production' && target !== 'development') return hold('UNKNOWN_ENVIRONMENT');
  if (!candidate || candidate.environment !== target || evidence?.environment !== target) return hold('ENVIRONMENT_OR_EVIDENCE_MISSING');
  if (!candidate.playerId || !uuid.test(candidate.playerId) || !candidate.playerSlug || !slug.test(candidate.playerSlug)) return hold('PLAYER_UNRESOLVED');
  if (!candidate.tournamentId || !uuid.test(candidate.tournamentId)) return hold('TOURNAMENT_UNRESOLVED');
  if (candidate.playerId !== evidence.playerId || candidate.playerSlug !== evidence.playerSlug || evidence.identityConfirmed !== true) return hold('IDENTITY_MISMATCH');
  if (candidate.tournamentId !== evidence.tournamentId || evidence.tournamentConfirmed !== true) return hold('TOURNAMENT_MISMATCH');
  // V1.0 table cannot encode independent divisions or team placement semantics without explicit review.
  if (candidate.kind !== 'individual' || typeof candidate.divisionKey !== 'string' || !candidate.divisionKey.trim() || evidence.divisionCompatible !== true) return hold('DIVISION_OR_TEAM_UNSUPPORTED');
  if (typeof candidate.placement !== 'number' || !Number.isSafeInteger(candidate.placement) || candidate.placement < 1) return hold('PLACEMENT_UNCONFIRMED');
  if (evidence.sourceConfirmed !== true) return hold('SOURCE_UNCONFIRMED');
  if (evidence.publicationApproved !== true || evidence.playerPublished !== true || evidence.tournamentPublished !== true || evidence.publicPlayerGatePassed !== true) return hold('PUBLICATION_NOT_CLEARED');
  return {state:'READY_FOR_REVIEW',reason:'ALL_CHECKS_MET_NOT_WRITE_AUTHORIZATION'};
}
/** Reject ALL candidates sharing a legacy PK until deduplication/division reconciliation is reviewed. */
export function classifyBatch(rows: readonly {candidate: Candidate; evidence: Evidence | null}[], target: Environment): Decision[] {
  const counts = new Map<string,number>();
  const key = (c: Candidate) => c && c.tournamentId && c.playerId ? JSON.stringify([c.tournamentId.toLowerCase(),c.playerId.toLowerCase()]) : null;
  for (const {candidate} of rows) {const k=key(candidate); if(k) counts.set(k,(counts.get(k)??0)+1);}
  return rows.map(({candidate,evidence})=>{const result=classifyTournamentIntake(candidate,evidence,target); const k=key(candidate); return result.state==='READY_FOR_REVIEW' && k && (counts.get(k)??0)>1 ? hold('LEGACY_KEY_COLLISION') : result;});
}
