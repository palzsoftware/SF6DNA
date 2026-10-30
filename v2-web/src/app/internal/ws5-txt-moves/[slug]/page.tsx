import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { CharacterUnifiedPage } from '@/components/character-unified-page';
import { connectOfficialTxtCharacterPageData, isWs5LocalCardRequest } from '@/lib/official-txt-character-page-connection.mjs';
import type { CharacterDetail } from '@/types/character';
import type { OfficialTxtPreviewResult } from '@/lib/official-txt-device-preview-adapter.mjs';
import type { CanonicalTxtRecord } from '@/lib/canonical-txt-connection.mjs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata = { title:'技カード・ローカル確認', robots:{ index:false, follow:false } };

/** New isolated route candidate only. Does not add a public character/DB identity. */
export default async function Ws5TxtMoveCards({ params }: {params:Promise<{slug:string}>}) {
  const h = await headers();
  const admission = {nodeEnv:process.env.NODE_ENV,vercelEnv:process.env.VERCEL_ENV,
    vercel:process.env.VERCEL,enabled:process.env.SF6DNA_WS5_TXT_PREVIEW,host:h.get('host')};
  if (!isWs5LocalCardRequest(admission)) notFound();
  const {slug} = await params;
  // Server-side dynamic imports happen after local admission; never a public JSON/API route.
  const [{default:snapshots},{default:records},{default:names},{default:mediaRegistry}] = await Promise.all([
    import('@/data/SF6DNA_WS5_DEVICE_PREVIEW_BUNDLES_R3_CANDIDATE_20261024.json'),
    import('@/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json'),
    import('@/data/SF6DNA_WS5_LOCAL_CHARACTER_NAMES_20261026.json'),
    import('@/data/SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json'),
  ]);
  if (!Object.prototype.hasOwnProperty.call(snapshots,slug) || !Object.prototype.hasOwnProperty.call(names,slug)) notFound();
  const candidate = snapshots[slug as keyof typeof snapshots] as unknown as OfficialTxtPreviewResult;
  const name = names[slug as keyof typeof names];
  // Namespace is a local view key, never a character UUID or a DB identity.
  const character:CharacterDetail = {id:`ws5-local-character:${slug}`,slug,name,nameEn:null,
    shortDescription:null,imageUrl:null,difficulty:null,rangeLabel:null,archetypeLabel:null,
    releaseDate:null,updatedAt:null,strengthsSummary:null,weaknessesSummary:null,guideSections:[],sources:[]};
  const view = connectOfficialTxtCharacterPageData({character,resolved:{bundle:null,source:'fixture'},
    candidate,records:records as unknown as Record<string,CanonicalTxtRecord>,admission,mediaRegistry});
  return <CharacterUnifiedPage character={character} bundle={view.bundle} players={[]} videos={[]}
    moveEvidence={view.moveEvidence} showPreferences={false} />;
}
