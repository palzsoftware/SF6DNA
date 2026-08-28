import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getTrainingBySlug } from "@/lib/content-detail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getTrainingBySlug(slug);
  return { title: detail?.title ?? "トレーニング", description: detail?.summary ?? undefined };
}

export default async function TrainingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getTrainingBySlug(slug);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="TRAINING" />;
}
