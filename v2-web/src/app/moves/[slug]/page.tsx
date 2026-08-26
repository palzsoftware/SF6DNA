import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getMoveBySlug } from "@/lib/content-detail";

export default async function MovePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getMoveBySlug(slug);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="MOVE" />;
}
