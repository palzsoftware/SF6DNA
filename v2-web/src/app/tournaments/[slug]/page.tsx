import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getTournamentBySlug } from "@/lib/event-media";

export default async function TournamentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getTournamentBySlug(slug);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="TOURNAMENT" />;
}
