import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getVideoBySlug } from "@/lib/event-media";

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getVideoBySlug(slug);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="VIDEO" />;
}
