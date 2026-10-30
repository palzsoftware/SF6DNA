import { jpSafeMoveRelation, jpSafeMovePayload } from './jp-safe-move-reference';
import type { ConsultationCardCatalog } from './consultation-card-payload';
import { lukeLocalComboRelation, lukeLocalComboPayload } from './luke-local-combo-reference';
import { lukeSafeMoveRelation, lukeSafeMovePayload } from './luke-safe-move-reference';
export const consultationCardCatalog: ConsultationCardCatalog = { patch: null, relations: [], payloads: [] };
/** Server-selected candidate environment only; no query/storage admission. */
export function consultationCatalogForEnvironment(environment: string | undefined): ConsultationCardCatalog {
  if (environment !== 'preview' && environment !== 'development') return consultationCardCatalog;
  return { patch: '2026.08.03', relations: [], localRelations: [lukeSafeMoveRelation, lukeLocalComboRelation, jpSafeMoveRelation], payloads: [lukeSafeMovePayload, lukeLocalComboPayload, jpSafeMovePayload] };
}
