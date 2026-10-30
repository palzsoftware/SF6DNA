/** Display projection only. Does not rewrite source commands or infer missing inputs. */
export function commandDirectionDisplay(value: string): string {
  const arrows: Record<string, string> = { '1':'↙','2':'↓','3':'↘','4':'←','5':'N','6':'→','7':'↖','8':'↑','9':'↗' };
  // Known official shortcut pairs for double quarter-circle Super Arts.
  // Preserve the source string; present the standard motion once.
  value = value.replace(/\b(?:23626|26236)\s*\|\s*(?:23626|26236)(?=\s*[+＋])/g, '236236');
  value = value.replace(/\b2142[456]\s*\|\s*24214(?=\s*[+＋])/g, '214214');
  let depth = 0;
  return value.replace(/[（()）]|[1-9]+/g, (part, offset: number) => {
    if (part === '(' || part === '（') { depth++; return part; }
    if (part === ')' || part === '）') { depth = Math.max(0, depth - 1); return part; }
    const before = value.slice(0, offset), after = value.slice(offset + part.length);
    // Numbers in conditions, levels, stock counts, timings and named SA are prose.
    if (depth || /[A-Za-z0-9]/.test(before.slice(-1)) || /^[0-9A-Za-z%％回個つ段秒]/.test(after)) return part;
    const inputTail = /^(?:\s*(?:溜め|ため|[+＋|/]|or\b|$|[1-9](?:\s|$)))/i.test(after);
    if (!inputTail) return part;
    return Array.from(part, digit => arrows[digit]).join('');
  });
}
