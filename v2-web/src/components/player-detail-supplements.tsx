import type { PlayerDetail } from "../types/player";
import { attachPlayerArchiveDisplay, type PlayerArchiveBinding } from "../lib/player-archive-display";
import teamBindings from "../data/player-research/team-bindings.json";
import { PlayerResearchSections, type PlayerResearchItem } from "./player-research-sections";
import { PlayerRecommendedVideos, type PlayerVideoRecommendation } from "./player-recommended-videos";
import { boundPlayerVideoRecommendations } from "../lib/player-video-binding";
import research from "../data/player-research/records.json";
import videos from "../data/player-research/videos.json";
import videoBindings from "../data/player-research/video-bindings.json";
import researchBindings from "../data/player-research/research-bindings.json";
/** Server-side selection. Unknown environments and unresolved identities stay empty. */
export function playerDetailSupplements(player: { id: string; slug: string }, environment: string) {
 const scope = environment === "wnuxaxbrpudyypzdbdho" ? "production" : environment === "vvsknbmlfvvnrmgtyhbf" ? "development" : null;
 const identities = researchBindings as Record<string, { production: string | null; development: string | null }>;
 const boundResearch = scope && identities[player.slug]?.[scope] === player.id ? research.filter(r => r.player_slug === player.slug && r.verification_status === "verified" && r.publication_approval === "APPROVED") : [];
 const boundVideos = boundPlayerVideoRecommendations(player, environment, videos as PlayerVideoRecommendation[], videoBindings).filter(v => v.publicationApproval === "APPROVED" && v.relationConfirmed);
 return {
  researchSection: boundResearch.length ? <PlayerResearchSections playerSlug={player.slug} items={boundResearch as PlayerResearchItem[]} /> : undefined,
  recommendedVideoSection: boundVideos.length ? <PlayerRecommendedVideos playerSlug={player.slug} items={boundVideos} /> : undefined,
 };
}

/** Pending team records remain hidden. Matching requires environment + real ID + slug. */
export function attachPlayerTeamResults<T extends PlayerDetail>(player: T, environment: string): T {
 const scoped = teamBindings.filter(row => row.environment === environment) as PlayerArchiveBinding[];
 return attachPlayerArchiveDisplay(player, scoped);
}
