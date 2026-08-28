import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getMoveBySlug } from "@/lib/content-detail";
import { isMovePublicReady } from "@/lib/public-move-gate";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await isMovePublicReady(slug))) return { title: "技情報" };
  const detail = await getMoveBySlug(slug);
  return { title: detail?.title ?? "技情報", description: detail?.summary ?? undefined };
}

export default async function MovePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await isMovePublicReady(slug))) notFound();
  const detail = await getMoveBySlug(slug);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="MOVE" />;
}
