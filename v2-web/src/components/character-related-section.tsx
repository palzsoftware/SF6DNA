import { VideoCard } from "@/components/video-card";
import { formatVideoPublishedDate, type VideoSummary } from "@/lib/event-media";
import { uniqueCharacterVideos } from "@/lib/character-video-references";
import Link from "next/link";
import type { CharacterSectionItem } from "@/lib/character-sections";
import styles from "./character-related-section.module.css";

export function CharacterRelatedSection({ id, title, emptyText, href, items, videos = [] }: {
  id: string;
  title: string;
  emptyText: string;
  href: string;
  items: CharacterSectionItem[];
  videos?: VideoSummary[];
}) {
  const uniqueItems = Array.from(new Map(items.map((item) => [item.id, item])).values());
  const visibleItems = id === "related-videos" ? uniqueItems : uniqueItems.slice(0, 3);
  const videoCards = uniqueCharacterVideos(videos);
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>{title}</h2>
      {id === "related-videos" && videoCards.length ? <div className="video-grid">{videoCards.map(video => <VideoCard key={video.id} video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} />)}</div> : uniqueItems.length ? (
        <>
          <ul className={styles.list}>
            {visibleItems.map((item) => (
              <li key={item.id}>
                <Link className={styles.item} href={item.href}>
                  <strong>{item.title}</strong>
                  {item.subtitle ? <span>{item.subtitle}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
          {id !== "related-videos" && uniqueItems.length > 3 ? <Link className={styles.more} href={href}>{title}をすべて見る →</Link> : null}
        </>
      ) : <p className={styles.empty}>{emptyText}</p>}
    </section>
  );
}
