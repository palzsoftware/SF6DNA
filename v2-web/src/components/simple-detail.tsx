import type { SimpleDetail } from "@/lib/content-detail";
import { localizeSourceRelationship, localizeSourceType } from "@/lib/detail-localization";

export function SimpleDetailView({
  detail,
  eyebrow,
  preview = false,
}: {
  detail: SimpleDetail;
  eyebrow: string;
  preview?: boolean;
}) {
  const rows = detail.body.filter(([, value]) => value !== null && value !== "");
  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{detail.title}</h1>
        {detail.summary ? <p>{detail.summary}</p> : null}
      </section>
      {preview ? (
        <section className="data-notice character-preview-notice">
          <strong>実機確認プレビュー</strong>
          <p>未公開データの確認画面です。表示している項目は公開済みとは限らず、DBの公開状態も変更していません。</p>
        </section>
      ) : null}
      {detail.media?.length ? (
        <section className="info-panel move-motion-panel">
          <h2>技の動き</h2>
          <div className="move-motion-grid">
            {detail.media.map((media) => (
              <figure className="move-motion-item" key={media.id}>
                {media.mediaType === "gif" ? (
                  // External motion assets are validated and registered by an administrator.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={media.mediaUrl} alt={`${detail.title}の動き`} width={640} height={360} loading="lazy" />
                ) : (
                  <video src={media.mediaUrl} poster={media.posterUrl ?? undefined} controls loop muted playsInline preload="metadata" />
                )}
                {media.sourceUrl ? (
                  <figcaption><a href={media.sourceUrl} target="_blank" rel="noopener noreferrer">{media.sourceLabel ?? "素材の情報源"}</a></figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}
      <section className="info-panel">
        <dl className="detail-list">
          {rows.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{String(value)}</dd></div>
          ))}
        </dl>
      </section>
      {detail.sources?.length ? (
        <section className="info-panel">
          <h2>情報源</h2>
          <ul>
            {detail.sources.map((source) => (
              <li key={`${source.id}-${source.relationship}`}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                {source.publisher ? ` / ${source.publisher}` : ""}
                {` / ${localizeSourceType(source.sourceType)} / ${localizeSourceRelationship(source.relationship)}`}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
