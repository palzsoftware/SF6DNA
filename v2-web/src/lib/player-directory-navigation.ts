import type { PlayerFilters } from "@/lib/player-directory-filter";

export type PlayerDirectoryState = PlayerFilters & { query: string; teams: string[] };
type SearchParams = Pick<URLSearchParams, "get" | "getAll">;

// Only directory controls are carried through navigation; arbitrary query keys
// and external return URLs are never forwarded to a Link.
function values(params: SearchParams, name: string) {
  return Array.from(new Set(params.getAll(name).slice(0, 48).filter(value =>
    value.length > 0 && value.length <= 128 && !/[\u0000-\u001f\u007f]/.test(value),
  )));
}

export function readPlayerDirectoryState(params: SearchParams): PlayerDirectoryState {
  const rawQuery = params.get("q") ?? "";
  return {
    query: /[\u0000-\u001f\u007f]/.test(rawQuery) ? "" : rawQuery.slice(0, 256),
    teams: values(params, "team"),
    categories: values(params, "type"),
    characters: values(params, "character"),
  };
}

export function playerDirectoryHref(state: PlayerDirectoryState): string {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  for (const [key, values] of [["team", state.teams], ["type", state.categories], ["character", state.characters]] as const) {
    for (const value of values ?? []) params.append(key, value);
  }
  // Apply the same limits to browser input and inbound URLs.
  const safe = readPlayerDirectoryState(params);
  const result = new URLSearchParams();
  if (safe.query) result.set("q", safe.query);
  for (const [key, values] of [["team", safe.teams], ["type", safe.categories], ["character", safe.characters]] as const) {
    for (const value of values) result.append(key, value);
  }
  return result.size ? `/players?${result.toString()}` : "/players";
}

export function safePlayerDirectoryReturn(value: unknown): string {
  if (typeof value !== "string" || value.length > 32768 || !/^\/players(?:\?|$)/.test(value) || /[\u0000-\u001f\u007f\\#]/.test(value)) return "/players";
  return playerDirectoryHref(readPlayerDirectoryState(new URLSearchParams(value.split("?").slice(1).join("?"))));
}

export function playerDetailHref(slug: string, state: PlayerDirectoryState): string {
  const path = `/players/${encodeURIComponent(slug)}`;
  const returnTo = playerDirectoryHref(state);
  return returnTo === "/players" ? path : `${path}?${new URLSearchParams({ returnTo })}`;
}
