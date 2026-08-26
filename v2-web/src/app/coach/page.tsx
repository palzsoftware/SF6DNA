import { CoachRetrievalDemo } from "@/components/coach-retrieval-demo";

export const metadata = { title: "AIコーチ | SF6DNA" };

export default function CoachPage() {
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
      <CoachRetrievalDemo />
    </div>
  );
}
