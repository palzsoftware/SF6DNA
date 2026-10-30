/** Local candidate presentation. No ID, frame value or publication status changes. */
export function officialMoveDisplayNotes(move: unknown): string[] {
  if (!move || typeof move !== 'object') return [];
  const raw = (move as { ws5OfficialRawRecord?: { note?: unknown } }).ws5OfficialRawRecord;
  if (!Array.isArray(raw?.note)) return [];
  return [...new Set(raw.note.filter((line): line is string => typeof line === 'string' && Boolean(line.trim())).map(line => line.trim()))];
}
export function trailingCommandCondition(value: string): { value: string; condition: string | null } {
  const match = value.match(/^\s*[（(]([^）)]+)[）)]\s*([\s\S]+)$/);
  return match ? { value: match[2], condition: match[1] } : { value, condition: null };
}
export function simultaneousButtonHint(value: string, scheme: string): string | null {
  if (scheme !== 'classic') return null;
  if (/\bLP\s*[|｜]\s*MP\s*[|｜]\s*HP\b/i.test(value)) return '弱P・中P・強Pのうち、いずれか1つ';
  if (/\bLK\s*[|｜]\s*MK\s*[|｜]\s*HK\b/i.test(value)) return '弱K・中K・強Kのうち、いずれか1つ';
  if (/PPP\s*$/.test(value)) return '弱P・中P・強Pを3つ同時押し';
  if (/LPMPHP\s*$/.test(value)) return '弱P・中P・強Pのうち、いずれか2つを同時押し';
  if (/LKMKHK\s*$/.test(value)) return '弱K・中K・強Kのうち、いずれか2つを同時押し';
  return null;
}
