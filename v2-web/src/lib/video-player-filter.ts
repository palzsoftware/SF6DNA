export function videoPlayerFromQuery(value: string | string[] | undefined): string | null {
  const player = (Array.isArray(value) ? value[0] : value)?.trim();
  return player ? player.slice(0, 100) : null;
}

export function videoPlayerHref(displayName: string, playerId?: string, characterId?: string): string {
  const query = new URLSearchParams({ player: displayName });
  if (playerId) query.set("playerId", playerId);
  if (characterId) query.set("characterId", characterId);
  return `/videos?${query.toString()}`;
}

export function videoEntityIdFromQuery(value: string | string[] | undefined): string | null {
  const id = Array.isArray(value) ? value[0] : value;
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ? id : null;
}
