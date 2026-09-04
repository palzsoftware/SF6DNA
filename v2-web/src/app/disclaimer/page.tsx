export const metadata = {
  title: "免責事項",
  description: "SF6DNAの情報利用に関する免責事項です。",
};

export default function DisclaimerPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">DISCLAIMER</p>
        <h1>免責事項</h1>
      </section>

      <section>
        <h2>掲載情報について</h2>
        <p>
          SF6DNAでは、対象パッチ、出典、公開状態などを確認しながら情報を掲載しますが、
          情報の完全性、最新性、正確性を恒久的に保証するものではありません。
        </p>
      </section>

      <section>
        <h2>ゲームアップデート</h2>
        <p>
          Street Fighter 6のアップデートにより、フレーム、コンボ、対策、仕様等が変更される場合があります。
          実際のゲーム内情報および公式情報もあわせて確認してください。
        </p>
      </section>

      <section>
        <h2>損害について</h2>
        <p>
          SF6DNAの掲載情報を利用したこと、または利用できなかったことによって生じた損害について、
          運営者は法令上認められる範囲で責任を負わないものとします。
        </p>
      </section>

      <section>
        <h2>権利表記</h2>
        <p>
          Street Fighter、Street Fighter 6および関連する名称・画像・商標等の権利は、
          それぞれの権利者に帰属します。
          SF6DNAは非公式のファン向け支援サイトであり、株式会社カプコンの公式サービスではありません。
        </p>
      </section>

      <p>制定日: 2026年9月4日</p>
    </div>
  );
}
