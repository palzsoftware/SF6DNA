export const metadata = {
  title: "利用規約",
  description: "SF6DNAの利用条件を定めます。",
};

export default function TermsPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">TERMS</p>
        <h1>利用規約</h1>
        <p>SF6DNAを利用する際の基本的な条件を定めます。</p>
      </section>

      <section>
        <h2>利用について</h2>
        <p>
          利用者は、法令および本規約に従ってSF6DNAを利用するものとします。
        </p>
      </section>

      <section>
        <h2>禁止事項</h2>
        <p>
          不正アクセス、サービス運営を妨害する行為、他者の権利を侵害する行為、
          不正な目的でデータを取得・利用する行為を禁止します。
        </p>
      </section>

      <section>
        <h2>コンテンツ</h2>
        <p>
          SF6DNAに掲載する攻略・キャラクター・プレイヤー等の情報は、
          正確性の確保に努めますが、完全性や恒久的な正確性を保証するものではありません。
        </p>
      </section>

      <section>
        <h2>サービスの変更・停止</h2>
        <p>
          保守、障害、仕様変更その他の理由により、予告なくサービス内容を変更または停止する場合があります。
        </p>
      </section>

      <section>
        <h2>規約の変更</h2>
        <p>
          必要に応じて本規約を変更する場合があります。変更後の内容はSF6DNA上で公開します。
        </p>
      </section>

      <p>制定日: 2026年9月4日</p>
    </div>
  );
}
