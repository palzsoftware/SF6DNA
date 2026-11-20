import Link from "next/link";
import { publicPageMetadata } from "@/lib/public-page-metadata";
import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getVideoBySlug } from "@/lib/event-media";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getVideoBySlug(slug);
  return publicPageMetadata(`/videos/${encodeURIComponent(slug)}`, { title: detail?.title ?? "SF6動画", description: detail?.summary ?? undefined }, Boolean(detail));
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getVideoBySlug(slug);
  if (!detail) notFound();
  return (
    <SimpleDetailView detail={detail} eyebrow="VIDEO">
      {detail.relatedCharacters.length > 0 ? (
        <section className="info-panel">
          <h2>関連キャラクター</h2>
          <ul>{detail.relatedCharacters.map(character => (
            <li key={character.slug}><Link href={`/characters/${encodeURIComponent(character.slug)}`}>{character.name}</Link></li>
          ))}</ul>
        </section>
      ) : null}
    </SimpleDetailView>
  );
}
