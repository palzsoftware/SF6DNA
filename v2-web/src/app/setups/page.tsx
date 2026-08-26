import { KnowledgeList } from "@/components/knowledge-list";
import { listKnowledge } from "@/lib/knowledge";

export const metadata = { title: "セットプレイ | SF6DNA" };

export default async function SetupsPage() {
  const items = await listKnowledge("setup");
  return <div className="site-shell page-stack"><section className="hero"><p className="eyebrow">SETUPS</p><h1>セットプレイ</h1><p>起き攻め、設置、詐欺飛びなどを条件・位置・ゲージと合わせて整理します。</p></section><KnowledgeList items={items} basePath="/setups" /></div>;
}
