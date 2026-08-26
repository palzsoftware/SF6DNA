import { notFound } from "next/navigation";
import { SimpleDetailView } from "@/components/simple-detail";
import { getBasicEntityBySlug } from "@/lib/content-detail";

export default async function SetupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getBasicEntityBySlug("setups", slug);
  if (!detail) notFound();
  return <SimpleDetailView detail={detail} eyebrow="SETUP" />;
}
