export function videoPlayerFromQuery(value: string | string[] | undefined): string | null {
  const player = (Array.isArray(value) ? value[0] : value)?.trim();
  return player ? player.slice(0, 100) : null;
}

export function videoPlayerHref(displayName: string): string {
  return `/videos?${new URLSearchParams({ player: displayName }).toString()}`;
}
