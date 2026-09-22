import Link from "next/link";
import { PUBLIC_CONTACT_EMAIL, PUBLIC_CONTACT_MAILTO } from "@/lib/contact";

export const metadata = {
  title: "フィードバック",
  description: "SF6DNAへの不具合報告・情報修正・ご意見の送り方をご案内します。",
};

const feedbackTypes = [
  ["表示・操作の不具合", "不具合が起きたページのURL、使っていた端末・ブラウザ、直前に行った操作が分かると調査しやすくなります。個人情報は含めないでください。"],
  ["掲載情報の修正", "修正してほしい箇所と内容、確認できる公式情報があれば一緒にお知らせください。"],
  ["機能・使い方のご意見", "利用したページ、困ったこと、どのようになると使いやすいかをお知らせください。"],
];

export default function FeedbackPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">FEEDBACK</p>
        <h1>フィードバック</h1>
        <p>不具合や掲載情報の修正、機能へのご意見を送るときに役立つポイントをまとめています。</p>
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
        <p>お問い合わせページの案内に沿ってお送りください。</p>
        <a className="button-primary inline-button" href={PUBLIC_CONTACT_MAILTO}>{PUBLIC_CONTACT_EMAIL}</a>
        <Link className="button-secondary inline-button" href="/contact">お問い合わせページへ</Link>
      </section>
    </div>
  );
}
