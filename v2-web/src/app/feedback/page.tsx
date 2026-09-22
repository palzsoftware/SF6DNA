import Link from "next/link";
import { PUBLIC_CONTACT_EMAIL, PUBLIC_CONTACT_MAILTO } from "@/lib/contact";

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
        <p>不具合・掲載情報・使い方に関するご連絡を送る前に、必要な内容を整理するための案内です。</p>
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
        <h2>送信先</h2>
        <p>このページに入力フォームや公開掲示板はありません。整理した内容は、次の受付先へお送りください。</p>
        <a className="button-primary inline-button" href={PUBLIC_CONTACT_MAILTO}>{PUBLIC_CONTACT_EMAIL}</a>
        <Link className="button-secondary inline-button" href="/contact">お問い合わせ案内を見る</Link>
      </section>
    </div>
  );
}
