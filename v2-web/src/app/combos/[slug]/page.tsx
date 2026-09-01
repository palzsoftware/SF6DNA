import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getComboBySlug } from "@/lib/content-detail";
import { isDevicePreviewRequest, normalizeDevicePreviewToken } from "@/lib/device-preview";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getComboBySlug(slug);
  return { title: detail?.title ?? "コンボ", description: detail?.summary ?? undefined };
}

export default async function ComboPage({ params, searchParams }: DetailPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const previewToken = normalizeDevicePreviewToken(query.preview);
  const detail = await getComboBySlug(slug, previewToken);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="COMBO" preview={isDevicePreviewRequest(previewToken)} />;
}
