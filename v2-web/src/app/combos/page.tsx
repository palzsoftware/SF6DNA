import { KnowledgeList } from "@/components/knowledge-list";
import { listKnowledge } from "@/lib/knowledge";

export const metadata = { title: "コンボ | SF6DNA" };

export default async function CombosPage() {
  const items = await listKnowledge("combo");
  return <div className="site-shell page-stack"><section className="hero"><p className="eyebrow">COMBOS</p><h1>コンボ</h1><p>始動、ダメージ、ゲージ、位置、難易度、用途を整理します。</p></section><KnowledgeList items={items} basePath="/combos" /></div>;
}
