import Link from "next/link";
import type { CharacterSectionItem } from "@/lib/character-sections";
import styles from "./character-related-section.module.css";

export function CharacterRelatedSection({ id, title, emptyText, href, items }: {
  id: string;
  title: string;
  emptyText: string;
  href: string;
  items: CharacterSectionItem[];
}) {
  const uniqueItems = Array.from(new Map(items.map((item) => [item.id, item])).values());
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>{title}</h2>
      {uniqueItems.length ? (
        <>
          <ul className={styles.list}>
            {uniqueItems.slice(0, 3).map((item) => (
              <li key={item.id}>
                <Link className={styles.item} href={item.href}>
                  <strong>{item.title}</strong>
                  {item.subtitle ? <span>{item.subtitle}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
          {uniqueItems.length > 3 ? <Link className={styles.more} href={href}>{title}をすべて見る →</Link> : null}
        </>
      ) : <p className={styles.empty}>{emptyText}</p>}
    </section>
  );
}
