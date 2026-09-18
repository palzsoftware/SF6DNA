import Link from "next/link";

export const metadata = {
  title: "フィードバック",
  description: "SF6DNAへの不具合報告・情報修正・ご意見の送り方をご案内します。",
};

const feedbackTypes = [
  ["表示・操作の不具合", "URL、端末、ブラウザ、画面幅、発生した操作を控えてください。個人情報は含めないでください。"],
  ["掲載情報の修正", "対象ページ、該当箇所、正しいと考える内容、確認できる公式・一次情報を控えてください。"],
  ["機能・使い方のご意見", "利用したページ、困ったこと、期待する状態を簡潔に整理してください。"],
];

export default function FeedbackPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">FEEDBACK</p>
        <h1>フィードバック</h1>
        <p>不具合・掲載情報・使い方に関する内容を、正式な受付先の公開前に安全に整理するための案内です。</p>
      </section>

      <section className="card-grid" aria-label="フィードバックの種類">
        {feedbackTypes.map(([title, description]) => (
          <article className="info-panel" key={title}>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="data-notice">
        <h2>現在の受付状況</h2>
        <p>プレリリース期間中のため、このページから送信・公開されるフォームや掲示板はありません。連絡先の準備状況はお問い合わせページで確認できます。</p>
        <Link className="button-secondary inline-button" href="/contact">お問い合わせ案内を見る</Link>
      </section>
    </div>
  );
}
