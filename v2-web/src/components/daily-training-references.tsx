import Link from "next/link";
import type { DailyTrainingDetail } from "@/lib/daily-training-details";
import { getPracticeReferences } from "@/lib/daily-training-references";

export function DailyTrainingReferences({ detail }: { detail: DailyTrainingDetail }) {
  const resources = getPracticeReferences(detail);
  if (!resources) return null;
  return <section aria-label="この課題に合う参考資料">
    <h3>この課題に合う参考資料</h3>
    <p>{resources.reason}</p>
    {resources.references.length ? <ul>{resources.references.map(reference => <li key={reference.url}>
      <a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.kind === "article" ? "記事" : "動画"}：{reference.title} ↗</a>
      <p>{reference.relevance}</p>
      <small>{reference.author}／案内確認：{reference.reviewedAt}</small>
    </li>)}</ul> : null}
    {resources.references.length ? <p>2025年の記事・掲載動画を参考にしています。技性能や機種別の操作は、現在お使いのゲーム内で確認してください。</p> : null}
    <p><Link href={resources.searchHref}>「{resources.topic}」の関連動画を探す →</Link></p>
    <p>資料の確認や初回設定は、5分の計測を始める前に済ませましょう。</p>
  </section>;
}
