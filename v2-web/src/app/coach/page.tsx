import { notFound } from "next/navigation";
import { CoachRetrievalDemo } from "@/components/coach-retrieval-demo";
import { loadCoachInputFromSearchParams, type CoachSearchParams } from "@/lib/coach-input-loader";
import { releaseFeatures } from "@/lib/release-features";

export const metadata = { title: "AIコーチ" };

export default async function CoachPage({ searchParams }: { searchParams: Promise<CoachSearchParams> }) {
  if (!releaseFeatures.aiCoach) {
    notFound();
  }
  const params = await searchParams;
  const context = await loadCoachInputFromSearchParams(params);
  const initialQuestion = context.userMessage?.rawText ?? "";

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">AI COACH</p>
        <h1>AIコーチ</h1>
        <p>
          SF6DNAの診断・今日の練習・公開情報を共通Contextへ整理し、Evidenceにないゲーム事実を補わずにコーチング材料を組み立てます。
          Personaは説明の順番や詳しさだけを変え、根拠・Patch・検証状態は変更しません。
        </p>
      </section>
      <CoachRetrievalDemo initialQuestion={initialQuestion} initialContext={context} />
    </div>
  );
}
