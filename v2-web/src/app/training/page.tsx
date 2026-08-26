import { KnowledgeList } from "@/components/knowledge-list";
import { listKnowledge } from "@/lib/knowledge";

export const metadata = { title: "トレーニング | SF6DNA" };

export default async function TrainingPage() {
  const items = await listKnowledge("training");
  return <div className="site-shell page-stack"><section className="hero"><p className="eyebrow">TRAINING</p><h1>トレーニング</h1><p>トレモの録画、再生、CPU設定、成功条件、回数まで再現可能な形で整理します。</p></section><KnowledgeList items={items} basePath="/training" /></div>;
}
