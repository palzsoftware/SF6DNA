import { KnowledgeList } from "@/components/knowledge-list";
import { listKnowledge } from "@/lib/knowledge";

export const metadata = { title: "連携" };

export default async function SequencesPage() {
  const items = await listKnowledge("sequence");
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">SEQUENCES</p>
        <h1>連携</h1>
        <p>連続ガード、暴れどころ、投げ・シミー、パリィ、Dリバーサル、無敵技などの対応を整理します。</p>
      </section>
      <KnowledgeList items={items} basePath="/sequences" />
    </div>
  );
}
