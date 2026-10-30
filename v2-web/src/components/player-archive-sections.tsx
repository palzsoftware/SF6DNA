import type { PlayerArchiveDisplay } from "@/lib/player-archive-display";
function safeUrl(value: string | null): string | null {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.href : null; } catch { return null; }
}
export function PlayerArchiveSections({ display }: { display?: PlayerArchiveDisplay }) {
  if (!display) return null;
  return <>{display.intro ? <section className="info-panel"><h2>プレイヤー紹介</h2><p>{display.intro}</p></section> : null}
    {display.facts.length ? <section className="info-panel"><h2>基本情報</h2><dl>{display.facts.filter(row => row.value.trim() && row.value !== "確認中").map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl></section> : null}
    {display.sections.filter(section => section.items.length).map(section => <section className="info-panel" key={section.title}><h2>{section.title}</h2><ul>{section.items.map((row, index) => { const url = safeUrl(row.sourceUrl); return <li key={`${index}:${row.text}`}>{row.text}{url ? <> <a href={url} target="_blank" rel="noopener noreferrer">出典を見る ↗</a></> : null}</li>; })}</ul></section>)}
  </>;
}
