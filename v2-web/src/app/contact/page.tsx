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

      <section>
        <h2>プレリリース期間中</h2>
        <p>
          現在、お問い合わせ窓口を準備しています。
          正式公開前に運営者が管理する連絡先またはお問い合わせフォームを設定します。
        </p>
      </section>

      <section>
        <h2>お問い合わせ対象</h2>
        <p>
          掲載情報の誤り、不具合、権利に関するご連絡、その他SF6DNAに関するお問い合わせを受け付ける予定です。
        </p>
      </section>
    </div>
  );
}
