import { notFound, redirect } from "next/navigation";
import { arjunPreviewQaEnabled, hasArjunQaSession } from "@/lib/arjun-preview-qa-auth";
import { Arjun77PreviewQa } from "@/components/arjun-77-preview-qa";
import { Arjun142PreviewQa } from "@/components/arjun-142-preview-qa";
import { ArjunPlayerVideoPreviewQa } from "@/components/arjun-player-video-preview-qa";

export const dynamic = "force-dynamic";
export const metadata = { title: "アルジュン・認証付きPreview QA | SF6DNA", robots: { index: false, follow: false } };
/** Candidate QA route only; never serves content to Production or anonymous Preview visitors. */
export default async function ArjunPreviewQaPage() {
  if (!arjunPreviewQaEnabled()) notFound();
  if (!(await hasArjunQaSession())) redirect("/arjun-research-preview/login");
  return <>
    <Arjun77PreviewQa />
    <div className="site-shell"><Arjun142PreviewQa /></div>
    <ArjunPlayerVideoPreviewQa />
  </>;
}
