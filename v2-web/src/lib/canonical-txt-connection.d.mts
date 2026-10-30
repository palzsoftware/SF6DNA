import type { DevicePreviewBundle } from '@/lib/device-preview';
import type { OfficialTxtPreviewResult, connectOfficialTxtPreviewCandidate } from '@/lib/official-txt-device-preview-adapter.mjs';
export type CanonicalTxtRecord = {
  characterSlug: string; sourceRecordKey: string; sourceWebId: string;
  sourceArtifact: string; sourceArtifactSha256: string; sourceRecordSha256: string;
  sourceLocator: string; sourceUrl: string; sourceUrlState: string; captureDate: string;
  raw: Record<string, unknown>;
};
export function connectCanonicalTxtCandidate(
  base: DevicePreviewBundle | null,
  candidate: OfficialTxtPreviewResult,
  records: Record<string, CanonicalTxtRecord>,
  options?: { characterSlug?: string; bundleCharacterSlug?: string; characterId?: string; connectExisting?: typeof connectOfficialTxtPreviewCandidate }
): {
  bundle: DevicePreviewBundle | null;
  moveEvidence: Record<string, import('@/lib/character-unified-contract').UnifiedMoveEvidence>;
  holds: Array<{ sourceRecordKey?: string; reason: string }>;
  mergedExisting: number; appended: number; releaseEligible: false;
  sourcePriorityChanges: Array<{ id: string; sourceRecordKey: string; fields: string[]; reason: string }>;
};
