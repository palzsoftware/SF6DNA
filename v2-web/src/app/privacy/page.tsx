export const metadata = {
  title: "プライバシーポリシー",
  description: "SF6DNAの個人情報・利用情報の取り扱いについて説明します。",
};

export default function PrivacyPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">PRIVACY</p>
        <h1>プライバシーポリシー</h1>
        <p>SF6DNAにおける利用者情報の取り扱いについて定めます。</p>
      </section>

      <section>
        <h2>取得する情報</h2>
        <p>
          アカウント機能を利用する場合、認証に必要な情報やプロフィール情報を取り扱う場合があります。
          また、診断結果や保存機能など、利用者自身がSF6DNAへ登録・保存した情報を取り扱う場合があります。
        </p>
      </section>

      <section>
        <h2>利用目的</h2>
        <p>
          サービスの提供、保存機能の実現、不具合調査、セキュリティ確保、
          利便性向上のために必要な範囲で利用します。
        </p>
      </section>

      <section>
        <h2>外部サービス</h2>
        <p>
          SF6DNAでは、ホスティング、データベース、認証などの提供に外部サービスを利用する場合があります。
          その場合、サービス提供に必要な範囲で各事業者により情報が処理されることがあります。
        </p>
      </section>

      <section>
        <h2>保存期間</h2>
        <p>
          情報はサービス提供・安全性確保・法令上必要な期間などを考慮して保持し、
          不要となった情報は適切な方法で削除または匿名化する方針です。
        </p>
      </section>

      <section>
        <h2>変更</h2>
        <p>
          本ポリシーは、サービス内容や利用する外部サービスの変更に応じて更新する場合があります。
        </p>
      </section>

      <p>制定日: 2026年9月4日</p>
    </div>
  );
}
