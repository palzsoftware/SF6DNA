import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getCharacterBySlug } from '@/lib/characters';
import { listCharacterSectionItems } from '@/lib/character-sections';
import { getPlayerBySlug } from '@/lib/players';
import { listVideos } from '@/lib/event-media';
import { playerDirectoryHref } from '@/lib/player-directory-navigation';
import { videoEntityIdFromQuery } from '@/lib/video-player-filter';
import { CharacterUnifiedPage } from '@/components/character-unified-page';
import { getWs5CharacterReview, getWs5StrategyMoveLinks, getWs5StrategyReviewDescriptions, getWs5ReviewedStrategyCards } from '@/lib/ws5-character-review';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata = { title: '技カード・ローカル確認', robots: { index: false, follow: false } };

export default async function Ws5TxtMoveCards({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const admission = {
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    vercel: process.env.VERCEL,
    enabled: process.env.SF6DNA_WS5_TXT_PREVIEW,
    host: (await headers()).get('host'),
  };
  const props = await getWs5CharacterReview(slug, admission);
  if (!props) notFound();
  const [strategyMoveLinks, liveCharacter] = await Promise.all([
    getWs5StrategyMoveLinks(props.bundle, admission),
    getCharacterBySlug(slug),
  ]);
  const characterId = liveCharacter?.slug === slug ? videoEntityIdFromQuery(liveCharacter.id) : null;
  const [relatedPlayers, videos] = characterId ? await Promise.all([
    listCharacterSectionItems(characterId, 'players'),
    listVideos({ characterId }),
  ]) : [[], []];
  const players = (await Promise.all(relatedPlayers.map(async item => {
    const player = await getPlayerBySlug(item.href.split('/').at(-1) ?? '');
    return player?.id === item.id ? player : null;
  }))).filter(player => player !== null);
  const character = characterId ? { ...props.character, id: characterId } : props.character;
  const playerDirectoryUrl = playerDirectoryHref({ query: '', teams: [], categories: [], characters: [slug] });
  return <CharacterUnifiedPage {...props} character={character} players={players} videos={videos}
    strategyMoveLinks={strategyMoveLinks} strategyReviewDescriptions={await getWs5StrategyReviewDescriptions(admission)} reviewedStrategyCards={await getWs5ReviewedStrategyCards(slug, admission)} playerDirectoryUrl={playerDirectoryUrl}
    videoDirectoryUrl={characterId ? `/videos?${new URLSearchParams({ characterId })}` : undefined} />;
}
