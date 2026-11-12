import { notFound } from "next/navigation";
import { Arjun77LocalPreview } from "@/components/arjun-77-local-preview";
import { Arjun142LocalPreview } from "@/components/arjun-142-local-preview";
import { ArjunPlayerVideoLocalPreview } from "@/components/arjun-player-video-local-preview";

export const dynamic = "force-dynamic";
export const metadata = { title: "アルジュン ローカル検証専用 | SF6DNA", robots: { index: false, follow: false } };
/** Additive route: does not modify /characters/[slug], shared UI or release flags. */
export default function ArjunLocalResearchPage() {
  if (process.env.NODE_ENV !== "development" || process.env.VERCEL_ENV ||
      process.env.SF6DNA_ARJUN_LOCAL_PREVIEW !== "1") notFound();
  return <>
    <Arjun77LocalPreview />
    <div className="site-shell"><Arjun142LocalPreview /></div>
    <ArjunPlayerVideoLocalPreview />
  </>;
}
