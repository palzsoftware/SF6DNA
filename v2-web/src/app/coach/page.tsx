import { notFound } from "next/navigation";
import { CoachRetrievalDemo } from "@/components/coach-retrieval-demo";
import { CoachLossAnalysisForm } from "@/components/coach-loss-analysis-form";
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
          質問と診断結果などをもとに、練習で試せることを整理します。
          コーチを切り替えても、参照する情報と検証状態は変わりません。
        </p>
        <p className="muted">現在はプレビューです。回答例は定型処理で作成し、外部AIによる回答生成は行いません。表示された情報源と対象の更新版も確認してください。</p>
      </section>
      <CoachRetrievalDemo initialQuestion={initialQuestion} initialContext={context} />
      <CoachLossAnalysisForm />
    </div>
  );
}
