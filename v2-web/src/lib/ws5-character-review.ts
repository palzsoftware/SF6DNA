import { moveCardAnchorId } from '@/lib/move-card-reference';
import { connectOfficialTxtCharacterPageData, isWs5LocalCardRequest, type Ws5LocalAdmission } from '@/lib/official-txt-character-page-connection.mjs';
import { getPreReleaseLocalCardCharacter, preReleaseUnifiedProps } from '@/lib/pre-release-character';
import type { CharacterDetail } from '@/types/character';
import type { DevicePreviewBundle } from '@/lib/device-preview';
import type { CanonicalTxtRecord } from '@/lib/canonical-txt-connection.mjs';
export function withoutMotionMedia(bundle: DevicePreviewBundle | null) {
  if (!bundle) return null;
  return {
    ...bundle,
    moves: bundle.moves.map(move => ({
      ...move,
      media: null,
      motionMediaPresentation: undefined,
    })),
  };
}

export async function getWs5CharacterReview(slug: string, admission: Ws5LocalAdmission) {
  if (!isWs5LocalCardRequest(admission)) return null;
  const arjun = await getPreReleaseLocalCardCharacter(slug, admission);
  if (arjun) {
    const props = preReleaseUnifiedProps(arjun);
    return { ...props, bundle: withoutMotionMedia(props.bundle) };
  }
  // Server-side dynamic imports happen after local admission; never a public JSON/API route.
  const [{ getWs5TxtPreviewCandidate }, { default: records }, { default: names },
    { default: mediaRegistry }, { default: overviews }] = await Promise.all([
    import('@/lib/official-txt-preview-snapshot'),
    import('@/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json'),
    import('@/data/SF6DNA_WS5_LOCAL_CHARACTER_NAMES_20261026.json'),
    import('@/data/SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json'),
    import('@/data/ws5-local-character-overviews.json'),
  ]);
  if (!Object.hasOwn(overviews, slug)) return null;
  const candidate = getWs5TxtPreviewCandidate(slug);
  if (!candidate) return null;
  const nameKey = slug === 'dee-jay' ? 'deejay' : slug;
  if (!Object.hasOwn(names, nameKey)) return null;
  const name = names[nameKey as keyof typeof names];
  const overview = overviews[slug as keyof typeof overviews];
  // Namespace is a local view key, never a character UUID or a DB identity.
  const character:CharacterDetail = {id:`ws5-local-character:${slug}`,slug,name,nameEn:null,
    imageUrl:null,releaseDate:null,updatedAt:null,guideSections:[],sources:[],...overview};
  const view = connectOfficialTxtCharacterPageData({character,resolved:{bundle:null,source:'fixture'},
    candidate,records:records as unknown as Record<string,CanonicalTxtRecord>,admission,mediaRegistry});
  return { character, bundle: withoutMotionMedia(view.bundle), players: [], videos: [],
    moveEvidence: view.moveEvidence, showPreferences: false };
}

/** Shared by the normal detail route and the internal review route. */
export async function getWs5StrategyMoveLinks(bundle: DevicePreviewBundle | null, admission: Ws5LocalAdmission) {
  if (!bundle || !isWs5LocalCardRequest(admission)) return undefined;
  const { default: references } = await import('@/data/ws5-phase2-private-references.json');
  const movesById = new Map(bundle.moves.map(move => [move.id, move]));
  return Object.fromEntries(Object.entries(references).map(([cardId, rows]) => [
    cardId,
    rows.flatMap(row => {
      const move = movesById.get(row.reviewId);
      const anchor = move?.slug === row.moveSlug ? moveCardAnchorId(row.moveSlug) : null;
      return anchor ? [{ name: row.nameJa, href: `#${anchor}` }] : [];
    }),
  ]));
}

export async function getWs5StrategyReviewDescriptions(admission: Ws5LocalAdmission) {
  if (!isWs5LocalCardRequest(admission)) return undefined;
  const { default: descriptions } = await import('@/data/ws5-local-strategy-descriptions.json');
  return descriptions;
}

export async function getWs5ReviewedStrategyCards(slug: string, admission: Ws5LocalAdmission) {
  if (!isWs5LocalCardRequest(admission)) return undefined;
  const { default: cards } = await import('@/data/ws5-local-reviewed-strategy-cards.json');
  return (cards as readonly import('./strategy-research-contract').StrategyResearchCard[])
    .filter(card => card.characterSlug === slug);
}
