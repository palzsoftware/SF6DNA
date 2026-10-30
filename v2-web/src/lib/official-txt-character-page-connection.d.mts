import type { MediaKeyReference } from '@/lib/media-key-registry.mjs';
import type { CharacterDetailData } from '@/lib/character-detail-data';
import type { CharacterDetail } from '@/types/character';
import type { UnifiedMoveEvidence } from '@/lib/character-unified-contract';
import type { OfficialTxtPreviewResult } from '@/lib/official-txt-device-preview-adapter.mjs';
import type { CanonicalTxtRecord, connectCanonicalTxtCandidate } from '@/lib/canonical-txt-connection.mjs';
export type Ws5LocalAdmission = { nodeEnv?: string; vercelEnv?: string; vercel?: string; enabled?: string; host?: string | null };
export function isWs5LocalCardRequest(admission: Ws5LocalAdmission): boolean;
export function connectOfficialTxtCharacterPageData(input: {
 character: Pick<CharacterDetail,'id'|'slug'>; resolved:CharacterDetailData;
 moveEvidence?:Record<string,UnifiedMoveEvidence>; candidate:OfficialTxtPreviewResult;
 records:Record<string,CanonicalTxtRecord>; admission:Ws5LocalAdmission; mediaRegistry?:readonly MediaKeyReference[];
}): CharacterDetailData & {
 moveEvidence:Record<string,UnifiedMoveEvidence>;
 mediaKeyHolds?:Array<{moveId:string;reason:string}>;
 candidateConnection:ReturnType<typeof connectCanonicalTxtCandidate>|null;
};
