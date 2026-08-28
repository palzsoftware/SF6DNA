import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getComboBySlug } from "@/lib/content-detail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getComboBySlug(slug);
  return { title: detail?.title ?? "コンボ", description: detail?.summary ?? undefined };
}

export default async function ComboPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getComboBySlug(slug);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="COMBO" />;
}
