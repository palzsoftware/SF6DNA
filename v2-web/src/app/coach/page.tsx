import { notFound } from "next/navigation";
import { CoachRetrievalDemo } from "@/components/coach-retrieval-demo";
import { loadCoachInputFromSearchParams, type CoachSearchParams } from "@/lib/coach-input-loader";
import { releaseFeatures } from "@/lib/release-features";
import { isCoachSurfaceEnabled } from "@/lib/coach-preview-activation";

export const metadata = { title: "AIコーチ" };

export default async function CoachPage({ searchParams }: { searchParams: Promise<CoachSearchParams> }) {
  if (!isCoachSurfaceEnabled(releaseFeatures.aiCoach)) {
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
        <p className="muted">AIによる回答には誤りが含まれる可能性があります。表示された根拠・情報源・対象Patchを確認し、根拠が不足する内容は断定しません。</p>
      </section>
      <CoachRetrievalDemo initialQuestion={initialQuestion} initialContext={context} />
    </div>
  );
}
