import { KnowledgeList } from "@/components/knowledge-list";
import { notFound } from "next/navigation";
import { listKnowledge } from "@/lib/knowledge";
import { releaseFeatures } from "@/lib/release-features";

export const metadata = { title: "対策" };

export default async function CountersPage() {
  if (!releaseFeatures.publicStrategyContent) notFound();
  const items = await listKnowledge("counter");
  return <div className="site-shell page-stack"><section className="hero"><p className="eyebrow">COUNTERS</p><h1>対策</h1><p>キャラ・技・連携・状況ごとの対策を、使用キャラ側の具体的な回答まで整理します。</p></section><KnowledgeList items={items} basePath="/counters" /></div>;
}
