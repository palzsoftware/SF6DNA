import type { DevicePreviewBundle } from "@/lib/device-preview";
import type { UnifiedMoveEvidence } from "@/lib/character-unified-contract";

export type OfficialTxtCandidateRow = Record<string, string> & {
  record_type: string;
  character_slug: string;
  source_record_key: string;
  source_web_id: string;
  official_name: string;
  move_type_source: string;
  move_type_candidate: string;
  identity_state: string;
  candidate_move_uuid: string;
  candidate_move_slug: string;
  classic_input_raw: string;
  classic_input_state: string;
  modern_input_raw: string;
  modern_input_state: string;
  startup_raw: string;
  startup_state: string;
  active_raw: string;
  active_state: string;
  recovery_raw: string;
  recovery_state: string;
  on_hit_raw: string;
  on_hit_state: string;
  on_block_raw: string;
  on_block_state: string;
  damage_raw: string;
  damage_state: string;
};

export type OfficialTxtPreviewResult = {
  characterSlug: string;
  inputRows: number;
  namedMoveRows: number;
  excludedRows: number;
  excludedRyuScopeHolds: number;
  bundle: DevicePreviewBundle;
  moveEvidence: Record<string, UnifiedMoveEvidence>;
  identityByMoveId: Record<string, {
    sourceRecordKey: string;
    sourceWebId: string | null;
    sourceRecordSha256: string | null;
    sourceLocator: string | null;
    sourceUrl: string | null;
    sourceUrlState: string | null;
    sourceArtifact: string | null;
    sourceArtifactSha256: string | null;
    sourcePatchState: string | null;
    publicationState: string | null;
    idKind: "EXISTING_ID_CROSSWALK_CANDIDATE" | "ISOLATED_PREVIEW_ID";
    identityState: string;
    candidateSlug: string | null;
  }>;
  holds: Array<{ sourceRecordKey: string; reason: string }>;
  releaseEligible: false;
};

export declare function buildOfficialTxtDevicePreviewBundle(
  rows: OfficialTxtCandidateRow[], characterSlug: string,
): OfficialTxtPreviewResult;

export declare function connectOfficialTxtPreviewCandidate(
  existingBundle: DevicePreviewBundle | null,
  candidateResult: OfficialTxtPreviewResult,
): {
  bundle: DevicePreviewBundle;
  moveEvidence: Record<string, UnifiedMoveEvidence>;
  holds: Array<{ sourceRecordKey: string; reason: string }>;
  mergedExisting: number;
  appended: number;
  releaseEligible: false;
};

/** Local display projection; does not alter stored moveType or publication eligibility. */
export declare function getOfficialTxtPreviewDisplayCategory(
  move: DevicePreviewBundle["moves"][number],
): "normal" | "unique" | "special" | "super" | "throw" | null;
