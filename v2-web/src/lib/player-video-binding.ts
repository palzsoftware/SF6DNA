import type { PlayerVideoRecommendation } from "../components/player-recommended-videos";
export type PlayerVideoBinding = { environment: string; playerId: string; playerSlug: string; recommendationKey: string };
export function boundPlayerVideoRecommendations(player: { id: string; slug: string }, environment: string,
 items: readonly PlayerVideoRecommendation[], bindings: readonly PlayerVideoBinding[]) {
 const keys = new Set(bindings.filter(b => b.environment === environment && b.playerId === player.id && b.playerSlug === player.slug).map(b => b.recommendationKey));
 return items.filter(item => item.playerSlug === player.slug && keys.has(item.key));
}
