import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getSetupBySlug } from "@/lib/content-detail";
import { releaseFeatures } from "@/lib/release-features";
import { isDevicePreviewRequest, normalizeDevicePreviewToken } from "@/lib/device-preview";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  if (!releaseFeatures.publicStrategyContent) return {};
  const { slug } = await params;
  const detail = await getSetupBySlug(slug);
  return { title: detail?.title ?? "セットプレイ", description: detail?.summary ?? undefined };
}

export default async function SetupPage({ params, searchParams }: DetailPageProps) {
  if (!releaseFeatures.publicStrategyContent) notFound();
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const previewToken = normalizeDevicePreviewToken(query.preview);
  const detail = await getSetupBySlug(slug, previewToken);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="セットプレイ" preview={isDevicePreviewRequest(previewToken)} />;
}
