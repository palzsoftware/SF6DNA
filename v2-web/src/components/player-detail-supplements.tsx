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
import profileSupplements from "../data/player-research/profile-supplements.json";
import { boundProfileSupplement, PlayerProfileSupplementSection, type PlayerProfileSupplement } from "./player-profile-supplement";
/** Server-side selection. Unknown environments and unresolved identities stay empty. */
export function playerDetailSupplements(player: { id: string; slug: string }, environment: string, preview = false) {
 const scope = environment === "wnuxaxbrpudyypzdbdho" ? "production" : environment === "vvsknbmlfvvnrmgtyhbf" ? "development" : null;
 const identities = researchBindings as Record<string, { production: string | null; development: string | null }>;
 const boundResearch = scope && identities[player.slug]?.[scope] === player.id ? research.filter(r => r.player_slug === player.slug && (preview || (r.verification_status === "verified" && r.publication_approval === "APPROVED"))) : [];
 const boundVideos = boundPlayerVideoRecommendations(player, environment, videos as PlayerVideoRecommendation[], videoBindings).filter(v => (preview || v.publicationApproval === "APPROVED") && v.relationConfirmed);
 const profile = scope ? boundProfileSupplement(player, environment, profileSupplements as PlayerProfileSupplement[], preview) : null;
 return {
  profileSupplementSection: profile ? <PlayerProfileSupplementSection row={profile} draftPreview={preview} /> : undefined,
  researchSection: boundResearch.length ? <PlayerResearchSections playerSlug={player.slug} items={boundResearch as PlayerResearchItem[]} draftPreview={preview} /> : undefined,
  recommendedVideoSection: boundVideos.length ? <PlayerRecommendedVideos playerSlug={player.slug} items={boundVideos} draftPreview={preview} /> : undefined,
 };
}

type TeamIdentityVariant = { environment: string; playerId: string; playerSlug: string };
type TeamBindingRow = PlayerArchiveBinding & { environment: string; identityVariants?: readonly TeamIdentityVariant[] };

/** Resolve the recorded post-migration slug for the same environment and same UUID only. */
export function resolveTeamBindingIdentities(rows: readonly TeamBindingRow[], environment: string): PlayerArchiveBinding[] {
 const scope = environment === "wnuxaxbrpudyypzdbdho" ? "production" : environment === "vvsknbmlfvvnrmgtyhbf" ? "development" : null;
 return rows.filter(row => row.environment === environment).map(row => {
  const variants = scope ? (row.identityVariants ?? []).filter(v => v.environment === scope && v.playerId === row.playerId) : [];
  if (variants.length !== 1) return row;
  const slug = variants[0].playerSlug;
  return { ...row, playerSlug: slug, display: { ...row.display, slug } };
 });
}

/** Pending team records remain hidden. Matching requires environment + real ID + slug. */
export function attachPlayerTeamResults<T extends PlayerDetail>(player: T, environment: string, rows: readonly TeamBindingRow[] = teamBindings as TeamBindingRow[], preview = false): T {
 const resolved = resolveTeamBindingIdentities(rows, environment);
 // ローカル確認時だけ、承認待ちの行を「確認用」と明記して表示する(元データの publicationApproval は変えない)
 const shown = preview ? resolved.map(r => ({ ...r, publicationApproval: "APPROVED" as const,
  display: { ...r.display, intro: `【ローカル確認用・未公開】${r.display.intro ?? ""}` } })) : resolved;
 return attachPlayerArchiveDisplay(player, shown);
}
