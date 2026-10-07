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
  return <SimpleDetailView detail={detail} eyebrow="VIDEO" />;
}
