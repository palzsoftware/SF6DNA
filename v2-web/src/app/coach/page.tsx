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
          SF6DNA内で出典を確認できる情報を先に検索し、回答の根拠として使う設計です。
          現在は安全性を優先し、根拠が不足している攻略内容をAIが自由に補って断定しない形で提供しています。
        </p>
      </section>
      <CoachRetrievalDemo initialQuestion={initialQuestion} />
    </div>
  );
}
