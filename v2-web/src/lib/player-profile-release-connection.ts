import { bindPlayerProfileIntake, type PlayerProfileBinding } from "@/lib/player-profile-binding";
import type { PlayerDetail } from "@/types/player";

export type PlayerReleaseBinding = PlayerProfileBinding & {
  publicationApproval: "APPROVED" | "PENDING";
};

// Add only reviewed, publication-approved bindings. Keep private Wiki drafts outside runtime imports.
const releaseBindings: readonly PlayerReleaseBinding[] = [];

/** Call after the existing published-player loader and its cohort checks. */
export function attachReleasePlayerProfile<T extends PlayerDetail>(
  player: T,
  bindings: readonly PlayerReleaseBinding[] = releaseBindings,
  now = Date.now(),
): T {
  const identityRows = bindings.filter(row => row.playerId === player.id);
  // Reject duplicate receipts even when only one of them is approved.
  if (identityRows.length !== 1 || identityRows[0].publicationApproval !== "APPROVED") return player;
  return bindPlayerProfileIntake(player, identityRows, now);
}
