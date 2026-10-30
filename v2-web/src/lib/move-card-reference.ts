/** DOM identity only. A fragment never grants data access or publication. */
export type MoveCardReferenceItem = { id: string; anchorId?: string; aliasAnchorIds?: readonly string[] };
export type MoveCardReferenceGroup = { items: readonly MoveCardReferenceItem[] };

export function moveCardAnchorId(slug: string): string | null {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? `move-${slug}` : null;
}

export function resolveMoveCardReference(hash: string, groups: readonly MoveCardReferenceGroup[]) {
  if (!/^#move-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(hash)) return null;
  const anchorId = hash.slice(1);
  const matches = groups.flatMap(group => group.items).filter(item =>
    item.anchorId === anchorId || item.aliasAnchorIds?.includes(anchorId));
  if (matches.length !== 1 || !matches[0].anchorId) return null;
  return { id: matches[0].id, anchorId: matches[0].anchorId };
}

/** Call after React has restored filters and opened the matching details group. */
export function focusMoveCardReference(reference: { id: string; anchorId: string }, root: Document) {
  const target = root.getElementById(reference.anchorId);
  if (!target || target.dataset.moveId !== reference.id ||
      moveCardAnchorId(target.dataset.moveSlug ?? "") !== reference.anchorId) return false;
  // A user may have closed a details element while its React open prop stayed true.
  for (let parent = target.parentElement; parent; parent = parent.parentElement) {
    if (parent.tagName === "DETAILS") (parent as HTMLDetailsElement).open = true;
  }
  target.scrollIntoView({ block: "start", behavior: "auto" });
  target.focus({ preventScroll: true });
  return true;
}
