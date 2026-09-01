import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getSequenceBySlug } from "@/lib/content-detail";
import { isDevicePreviewRequest, normalizeDevicePreviewToken } from "@/lib/device-preview";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getSequenceBySlug(slug);
  return { title: detail?.title ?? "連携", description: detail?.summary ?? undefined };
}

export default async function SequencePage({ params, searchParams }: DetailPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const previewToken = normalizeDevicePreviewToken(query.preview);
  const detail = await getSequenceBySlug(slug, previewToken);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="連携" preview={isDevicePreviewRequest(previewToken)} />;
}
