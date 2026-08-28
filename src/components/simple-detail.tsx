import type { SimpleDetail } from "@/lib/content-detail";

export function SimpleDetailView({ detail, eyebrow }: { detail: SimpleDetail; eyebrow: string }) {
  const rows = detail.body.filter(([, value]) => value !== null && value !== "");
  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{detail.title}</h1>
        {detail.summary ? <p>{detail.summary}</p> : null}
      </section>
      <section className="info-panel">
        <dl className="detail-list">
          {rows.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{String(value)}</dd></div>
          ))}
        </dl>
      </section>
      {detail.sources?.length ? (
        <section className="info-panel">
          <h2>Sources</h2>
          <ul>
            {detail.sources.map((source) => (
              <li key={`${source.id}-${source.relationship}`}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                {source.publisher ? ` / ${source.publisher}` : ""}
                {` / ${source.sourceType} / ${source.relationship}`}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
