export const metadata = {
  title: "お問い合わせ",
  description: "SF6DNAへのお問い合わせについてご案内します。",
};

export default function ContactPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">CONTACT</p>
        <h1>お問い合わせ</h1>
        <p>SF6DNAへのご意見・不具合報告・掲載情報に関するお問い合わせ窓口です。</p>
      </section>

      <section className="info-panel">
        <h2>メールでお問い合わせ</h2>
        <p>次のメールアドレスで受け付けています。</p>
        <a className="button-primary inline-button" href={PUBLIC_CONTACT_MAILTO}>
          {PUBLIC_CONTACT_EMAIL}
        </a>
      </section>

      <section>
        <h2>お問い合わせ対象</h2>
        <p>
          掲載情報の誤り、不具合、権利に関するご連絡、その他SF6DNAに関するお問い合わせを受け付けています。
        </p>
        <p>不具合をご連絡いただく場合は、対象URL、端末、ブラウザ、発生した操作を添えてください。</p>
      </section>
    </div>
  );
}
import { PUBLIC_CONTACT_EMAIL, PUBLIC_CONTACT_MAILTO } from "@/lib/contact";
