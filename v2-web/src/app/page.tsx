const pillars = [
  {
    title: "診断",
    description: "短時間でプレイ傾向・課題・相性の良いキャラクター候補を確認する。",
    href: "/diagnosis",
  },
  {
    title: "キャラクター情報",
    description: "技・フレーム・コンボ・セットプレイ・立ち回り・対策を横断して調べる。",
    href: "/characters",
  },
  {
    title: "プレイヤー情報",
    description: "プロ・強豪・キャラ職人・配信者から、参考になるプレイヤーを探す。",
    href: "/players",
  },
  {
    title: "AIコーチ",
    description: "SF6DNAの構造化データを根拠に、課題と次の練習を整理する。",
    href: "/coach",
  },
];

export default function HomePage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">SF6 TOTAL PLATFORM</p>
        <h1>SF6で困ったらSF6DNA</h1>
        <p>
          自分を知る、キャラクターを知る、相手を知る。初心者から上級者まで使える
          Street Fighter 6総合プラットフォームを構築中です。
        </p>
      </section>

      <section aria-labelledby="main-content-title">
        <div className="section-heading">
          <h2 id="main-content-title">4大メインコンテンツ</h2>
          <p>Phase4ではv2の共通レイアウトと導線のみを実装しています。</p>
        </div>
        <div className="card-grid">
          {pillars.map((pillar) => (
            <a className="feature-card" href={pillar.href} key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
              <span>準備中 →</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
