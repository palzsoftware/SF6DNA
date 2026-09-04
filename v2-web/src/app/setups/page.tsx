import { KnowledgeList } from "@/components/knowledge-list";
import { notFound } from "next/navigation";
import { listKnowledge } from "@/lib/knowledge";
import { releaseFeatures } from "@/lib/release-features";

export const metadata = { title: "セットプレイ" };

export default async function SetupsPage() {
  if (!releaseFeatures.publicStrategyContent) notFound();
  const items = await listKnowledge("setup");
  return <div className="site-shell page-stack"><section className="hero"><p className="eyebrow">SETUPS</p><h1>セットプレイ</h1><p>起き攻め、設置、詐欺飛びなどを条件・位置・ゲージと合わせて整理します。</p></section><KnowledgeList items={items} basePath="/setups" /></div>;
}
