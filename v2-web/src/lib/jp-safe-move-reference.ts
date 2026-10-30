import type { Relation } from './character-consultation';
import type { ConsultationCardPayload } from './consultation-card-payload';
import type { DevicePreviewBundle } from './device-preview';

export type JpLocalMoveReference = {
  scope: 'RC_PREVIEW_LOCAL_CANDIDATE_ONLY'; acceptance: 'ACCEPTED_LOCAL_CANDIDATE';
  character_slug: 'jp'; character_id: '87077ba6-e9da-48b7-b3bd-2499ea4f6d86';
  move_id: '0afd12fb-5c7a-4799-b222-21daa7ca18f3'; move_slug: 'jp-crouching-mp';
  safe_href: '/characters/jp#move-jp-crouching-mp'; control: 'CLASSIC'; input_path: 'manual';
  verification: 'SOURCE_SUPPORTED'; patch_state: 'CURRENT_DB_ONLY';
  media_state: 'PENDING'; modern_state: 'LOCAL_HOLD_NOT_ADMITTED';
  anchor_state: 'IMPLEMENTED_LOCAL_CANDIDATE';
};

const source = 'JP-SAVED-CLASSIC-FIXTURE:5bec9e6:jp-crouching-mp:2MP';
const frameSource = 'CAPCOM:JP-FRAME:INDEXED-ROW:20261012:jp-crouching-mp';
const condition = 'Classic・しゃがみ中P・保存Frame表の通常行';
const moveId = '0afd12fb-5c7a-4799-b222-21daa7ca18f3';
const safeHref = '/characters/jp#move-jp-crouching-mp';

export const jpSafeMoveRelation: Relation = {
  id: moveId, revision: 'ws3-jp-crouching-mp-classic-source-20261012', kind: 'Move',
  character: 'jp', control: 'CLASSIC', inputPath: 'manual', patch: '2026.08.03',
  issue: 'combo', detail: 'medium', condition, verification: 'SOURCE_SUPPORTED',
  sourceRefs: [source, frameSource], fieldEvidenceComplete: false,
  publicationAllowed: false, routeConfirmed: false, href: safeHref,
};

export const jpSafeMovePayload: ConsultationCardPayload = {
  characterId: 'jp', cardType: 'Move', cardId: moveId, moveId,
  revision: jpSafeMoveRelation.revision, title: 'しゃがみ中P（ズミヤー）',
  reason: '中技始動の入力確認として、しゃがみ中Pのコマンドと技データを確認しましょう。',
  verification: 'SOURCE_SUPPORTED', control: 'CLASSIC', inputPath: 'manual',
  condition, patch: '2026.08.03', mediaState: 'PENDING',
  input: { patch: '2026.08.03', commandEvidence: source, context: {
    characterId: 'jp', moveId, formalMoveName: 'しゃがみ中P（ズミヤー）',
    control: 'classic', inputPath: 'manual', condition: { state: 'EXACT', text: condition },
    rawCommand: '↓ + 中P', spokenCommand: null, evidenceState: 'VERIFIED',
    tokenizationState: 'NOT_TOKENIZED', officialSourceVerified: false, identityMatch: true,
  } },
  localJpReference: {
    scope: 'RC_PREVIEW_LOCAL_CANDIDATE_ONLY', acceptance: 'ACCEPTED_LOCAL_CANDIDATE',
    character_slug: 'jp', character_id: '87077ba6-e9da-48b7-b3bd-2499ea4f6d86',
    move_id: moveId, move_slug: 'jp-crouching-mp', safe_href: safeHref,
    control: 'CLASSIC', input_path: 'manual', verification: 'SOURCE_SUPPORTED',
    patch_state: 'CURRENT_DB_ONLY', media_state: 'PENDING', modern_state: 'LOCAL_HOLD_NOT_ADMITTED',
    anchor_state: 'IMPLEMENTED_LOCAL_CANDIDATE',
  },
};

/** Project this one admitted source-supported row into the existing local Card. */
export function projectJpSafeMoveCard(move: DevicePreviewBundle['moves'][number], environment: string | undefined) {
  if ((environment !== 'preview' && environment !== 'development') ||
      move.id !== moveId || move.slug !== 'jp-crouching-mp') return move;
  return { ...move, releaseFixture: true,
    frame: { ...move.frame, startup: '7', onHit: '+6', onBlock: '-2', damage: 600,
      verificationStatus: 'source_supported' },
  };
}

/** Exact one-record local admission. No broader public or Modern allowance. */
export function isLocalJpSafeMoveReference(r: Relation, p: ConsultationCardPayload): boolean {
  const ref = p?.localJpReference;
  return !!r && !!ref && !p.localReference && !p.localComboReference && r.kind === 'Move' && p.cardType === 'Move' &&
    ref.scope === 'RC_PREVIEW_LOCAL_CANDIDATE_ONLY' && ref.acceptance === 'ACCEPTED_LOCAL_CANDIDATE' &&
    ref.character_slug === 'jp' && ref.character_id === '87077ba6-e9da-48b7-b3bd-2499ea4f6d86' &&
    ref.move_id === moveId && ref.move_slug === 'jp-crouching-mp' && ref.safe_href === safeHref &&
    r.id === moveId && p.moveId === moveId && r.href === safeHref && r.character === 'jp' &&
    r.revision === jpSafeMoveRelation.revision && r.issue === 'combo' && r.detail === 'medium' &&
    r.condition === condition && p.input?.context?.rawCommand === '↓ + 中P' &&
    p.input?.commandEvidence === source && r.sourceRefs?.length === 2 &&
    r.sourceRefs[0] === source && r.sourceRefs[1] === frameSource &&
    ref.control === 'CLASSIC' && ref.input_path === 'manual' && r.control === ref.control && r.inputPath === ref.input_path &&
    ref.verification === 'SOURCE_SUPPORTED' && r.verification === ref.verification &&
    ref.patch_state === 'CURRENT_DB_ONLY' && r.patch === '2026.08.03' &&
    ref.media_state === 'PENDING' && p.mediaState === 'PENDING' && ref.modern_state === 'LOCAL_HOLD_NOT_ADMITTED' &&
    ref.anchor_state === 'IMPLEMENTED_LOCAL_CANDIDATE' &&
    r.publicationAllowed === false && r.routeConfirmed === false && r.fieldEvidenceComplete === false;
}
