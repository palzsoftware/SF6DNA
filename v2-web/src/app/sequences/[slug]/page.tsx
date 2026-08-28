import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getSequenceBySlug } from "@/lib/content-detail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getSequenceBySlug(slug);
  return { title: detail?.title ?? "連携", description: detail?.summary ?? undefined };
}

export default async function SequencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getSequenceBySlug(slug);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="SEQUENCE" />;
}
