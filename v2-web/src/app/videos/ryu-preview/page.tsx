import { notFound } from "next/navigation";
import Link from "next/link";
import { VideoLibrary } from "@/components/video-library";
import { RYU_VIDEO_PREVIEW } from "@/lib/ryu-video-preview";
export const dynamic = "force-dynamic";
export const metadata = { title: "リュウ動画カード | SF6DNA Preview", robots: { index: false, follow: false } };
export default function RyuVideoPreviewPage() {
  if (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development") notFound();
  return <div className="site-shell page-stack experience-video">
    <section className="hero"><p className="eyebrow">VIDEOS / PREVIEW ONLY</p>
      <h1>リュウの動画カード（確認用）</h1>
      <p>既存の動画カードを使った候補9件です。DBの公開ステータスは変更していません。</p>
      <p>使用キャラ・出演・公開日・パッチ適合性は最終確認前です。攻略内容をSF6DNAが保証するものではありません。</p>
      <p><Link href="/videos">通常の動画一覧に戻る</Link></p>
    </section>
    <VideoLibrary videos={RYU_VIDEO_PREVIEW} learningRecords={[]} previewCandidates />
  </div>;
}
