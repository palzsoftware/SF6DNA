import type { PlayerDetail } from "@/types/player";
export type PlayerArchiveDisplay = {
  slug: string; name: string; intro: string | null;
  facts: { label: string; value: string }[];
  sections: { title: string; items: { text: string; sourceUrl: string | null }[] }[];
};
export type PlayerArchiveBinding = { playerId: string; playerSlug: string; publicationApproval: "APPROVED" | "PENDING"; display: PlayerArchiveDisplay };
// Review data stays outside production imports. Add only independently approved receipts.
const approvedArchiveBindings: readonly PlayerArchiveBinding[] = [];
export function attachPlayerArchiveDisplay<T extends PlayerDetail>(player: T, bindings: readonly PlayerArchiveBinding[] = approvedArchiveBindings): T {
  const matches = bindings.filter(row => row.playerId === player.id || row.playerSlug === player.slug);
  if (matches.length !== 1) return player;
  const row = matches[0];
  if (row.publicationApproval !== "APPROVED" || row.playerId !== player.id || row.playerSlug !== player.slug || row.display.slug !== player.slug) return player;
  return { ...player, archiveDisplay: row.display };
}
