import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getTrainingBySlug } from "@/lib/content-detail";
import { releaseFeatures } from "@/lib/release-features";
import { isDevicePreviewRequest, normalizeDevicePreviewToken } from "@/lib/device-preview";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  if (!releaseFeatures.training) return {};
  const { slug } = await params;
  const detail = await getTrainingBySlug(slug);
  return { title: detail?.title ?? "トレーニング", description: detail?.summary ?? undefined };
}

export default async function TrainingDetailPage({ params, searchParams }: DetailPageProps) {
  if (!releaseFeatures.training) notFound();
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const previewToken = normalizeDevicePreviewToken(query.preview);
  const detail = await getTrainingBySlug(slug, previewToken);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="TRAINING" preview={isDevicePreviewRequest(previewToken)} />;
}
