import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getCounterBySlug } from "@/lib/content-detail";
import { isDevicePreviewRequest, normalizeDevicePreviewToken } from "@/lib/device-preview";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: DetailPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const detail = await getCounterBySlug(slug, normalizeDevicePreviewToken(query.preview));
  return { title: detail?.title ?? "対策", description: detail?.summary ?? undefined };
}

export default async function CounterPage({ params, searchParams }: DetailPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const previewToken = normalizeDevicePreviewToken(query.preview);
  const detail = await getCounterBySlug(slug, previewToken);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="キャラ対策" preview={isDevicePreviewRequest(previewToken)} />;
}
