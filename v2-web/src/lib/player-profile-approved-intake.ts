import { publicPlayerFacts, type PlayerDevice, type PlayerProfileFact } from "@/lib/player-profile-contract";
import type { PlayerDetail } from "@/types/player";

type ApprovedFact<T extends PlayerProfileFact> = { approval: "APPROVED"; fact: T };
type ApprovedBinding = {
  playerId: string;
  playerSlug: string;
  publicationApproval: "APPROVED";
  teams: readonly ApprovedFact<PlayerProfileFact>[];
  devices: readonly ApprovedFact<PlayerDevice>[];
};

// All 48 candidates remain draft / UNCONFIRMED. Do not import private payloads.
const approvedBindings: readonly ApprovedBinding[] = [];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const seasonTeamKey = (label: string) => label.replace(/^(SFL JAPAN 2026：|SFL2026出場チーム：)/, "SFL2026:").trim();

function approvedFacts<T extends PlayerProfileFact>(rows: readonly ApprovedFact<T>[], now: number): T[] {
  const facts = rows.filter(row => row.approval === "APPROVED" && row.fact.verified === true &&
    typeof row.fact.label === "string" && typeof row.fact.sourceDate === "string").map(row => row.fact);
  return publicPlayerFacts(facts, now);
}

/** Only call after getPlayerBySlug's unchanged published-only query succeeds. */
export function attachApprovedPlayerIntake(player: PlayerDetail, now = Date.now()): PlayerDetail {
  if (!uuid.test(player.id) || !player.slug) return player;
  const matches = approvedBindings.filter(row => row.playerId === player.id);
  if (matches.length !== 1 || matches[0].playerSlug !== player.slug ||
      matches[0].publicationApproval !== "APPROVED") return player;
  const existing = player.profileIntake;
  const visibleTeams = publicPlayerFacts(existing?.teams, now);
  const visibleDevices = publicPlayerFacts(existing?.devices, now);
  const teamKeys = new Set(visibleTeams.map(row => seasonTeamKey(row.label)));
  const deviceCategories = new Set(visibleDevices.map(row => row.category));
  const teams = approvedFacts(matches[0].teams, now).filter(row => {
    const key = seasonTeamKey(row.label);
    if (teamKeys.has(key)) return false;
    teamKeys.add(key);
    return true;
  });
  const devices = approvedFacts(matches[0].devices, now).filter(row => {
    if (deviceCategories.has(row.category)) return false;
    deviceCategories.add(row.category);
    return true;
  });
  if (!teams.length && !devices.length) return player;
  return { ...player, profileIntake: {
    ...existing,
    teams: [...(existing?.teams ?? []), ...teams],
    devices: [...(existing?.devices ?? []), ...devices],
  } };
}
