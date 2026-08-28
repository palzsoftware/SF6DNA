import { CoachRetrievalDemo } from "@/components/coach-retrieval-demo";

export const metadata = { title: "AIコーチ" };

export default async function CoachPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const initialQuestion = typeof params.q === "string" ? params.q.trim().slice(0, 500) : "";

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">AI COACH</p>
        <h1>AIコーチ</h1>
        <p>
          SF6DNAの構造化データを先に検索し、根拠となる情報だけをAIへ渡す設計です。
          現段階では安全のため生成回答を有効化せず、検索・根拠取得まで実装しています。
        </p>
      </section>
      <CoachRetrievalDemo initialQuestion={initialQuestion} />
    </div>
  );
}
