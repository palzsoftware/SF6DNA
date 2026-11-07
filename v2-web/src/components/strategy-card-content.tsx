import type { ReactNode } from "react";
import styles from "./strategy-card-explorer.module.css";

/** Reusable presentational card; callers must authorize data before rendering. */
export function StrategyCardContent({ title, tag, media, facts, description, source }: {
  title: string;
  tag?: string | null;
  media?: { url: string; type: "video" | "gif" | "webp"; posterUrl?: string | null } | null;
  facts: Array<{ label: string; value: string | number | null | undefined | ReactNode }>;
  description?: string | null;
  source?: { label: string; url: string } | null;
}) {
  const trustedMedia = media?.url.startsWith("/media/") && !media.url.includes("..") ? media : null;
  const trustedSource = source?.url && /^https:\/\//.test(source.url) ? source : null;
  return <article className={styles.contentCard}>
    {tag ? <small className={styles.cardTag}>{tag}</small> : null}
    <h3>{title}</h3>
    <div className={styles.cardMedia}>{trustedMedia ? trustedMedia.type === "video"
      ? <video controls playsInline preload="none" poster={trustedMedia.posterUrl ?? undefined}><source src={trustedMedia.url} /></video>
      // eslint-disable-next-line @next/next/no-img-element -- verified media can be animated.
      : <img src={trustedMedia.url} alt={`${title}の動作`} loading="lazy" width={640} height={360} />
      : <p>動作メディア未登録</p>}</div>
    <details><summary>カードの詳細を見る</summary>
      <dl>{facts.map((entry, i) => <div key={`${entry.label}-${i}`} className={styles.fact}><dt>{entry.label}</dt><dd>{entry.value === null || entry.value === undefined || entry.value === "" ? "未確認" : entry.value}</dd></div>)}</dl>
      {description ? <p>{description}</p> : null}
      {trustedSource ? <p><a href={trustedSource.url} target="_blank" rel="noopener noreferrer">{trustedSource.label}</a></p> : null}
    </details>
  </article>;
}
