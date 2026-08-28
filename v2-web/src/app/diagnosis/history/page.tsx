import { DiagnosisHistoryTool } from "@/components/diagnosis-history-tool";

export const metadata = { title: "診断履歴" };

export default function DiagnosisHistoryPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">DIAGNOSIS HISTORY</p>
        <h1>診断履歴</h1>
        <p>完了した診断の上位傾向をこのブラウザ内に最大50件保存します。</p>
      </section>
      <DiagnosisHistoryTool />
    </div>
  );
}
