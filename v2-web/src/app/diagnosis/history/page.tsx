import { DiagnosisHistoryStorageNote, DiagnosisHistoryTool } from "@/components/diagnosis-history-tool";

export const metadata = {
  title: "診断履歴",
  robots: { index: false, follow: false, noarchive: true },
};

export default function DiagnosisHistoryPage() {
  return (
    <div className="site-shell page-stack experience-history">
      <section className="hero">
        <p className="eyebrow">DIAGNOSIS HISTORY</p>
        <h1>診断履歴</h1>
        <DiagnosisHistoryStorageNote />
      </section>
      <DiagnosisHistoryTool />
    </div>
  );
}
