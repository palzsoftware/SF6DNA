import Link from "next/link";
import type { KnowledgeListItem } from "@/types/knowledge";

export function KnowledgeList({ items, basePath }: { items: KnowledgeListItem[]; basePath: string }) {
  if (!items.length) return <div className="empty-state"><p>公開済みデータはまだありません。</p></div>;

  return (
    <div className="search-result-list">
      {items.map((item) => (
        <Link className="search-result" href={`${basePath}/${item.slug}`} key={item.id}>
          {item.characterName ? <span className="search-result__type">{item.characterName}</span> : null}
          <strong>{item.title}</strong>
          {item.summary ? <span>{item.summary}</span> : null}
          {item.difficulty ? <small>難易度 {item.difficulty}/5</small> : null}
        </Link>
      ))}
    </div>
  );
}
