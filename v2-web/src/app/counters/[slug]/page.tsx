import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getCounterBySlug } from "@/lib/content-detail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getCounterBySlug(slug);
  return { title: detail?.title ?? "対策", description: detail?.summary ?? undefined };
}

export default async function CounterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getCounterBySlug(slug);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="COUNTER" />;
}
