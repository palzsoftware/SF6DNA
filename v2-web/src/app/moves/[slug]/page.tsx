import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getMoveBySlug } from "@/lib/content-detail";
import {
  isDevicePreviewRequest,
  normalizeDevicePreviewToken,
} from "@/lib/device-preview";
import { isMovePublicReady } from "@/lib/public-move-gate";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await isMovePublicReady(slug))) return { title: "技情報" };
  const detail = await getMoveBySlug(slug);
  return { title: detail?.title ?? "技情報", description: detail?.summary ?? undefined };
}

export default async function MovePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const previewToken = normalizeDevicePreviewToken(query.preview);
  const previewActive = isDevicePreviewRequest(previewToken);
  if (!previewActive && !(await isMovePublicReady(slug))) notFound();
  const detail = await getMoveBySlug(slug, previewToken);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="技・フレーム" preview={previewActive} />;
}
