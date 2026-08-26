import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getBasicEntityBySlug } from "@/lib/content-detail";

export default async function CounterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getBasicEntityBySlug("counters", slug);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="COUNTER" />;
}
