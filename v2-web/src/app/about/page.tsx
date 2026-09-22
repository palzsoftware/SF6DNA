export const metadata = { title: "SF6DNAについて" };

export default function AboutPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">ABOUT</p>
        <h1>SF6DNAについて</h1>
        <p>スト6のプレイ傾向や課題を診断し、今日の練習につなげるサイトです。キャラクターの基本情報や、プレイヤー・動画も探せます。</p>
      </section>
      <section className="character-columns">
        <article className="info-panel"><h2>目的</h2><p>キャラクター選びから日々の練習まで、知りたい情報と次に取り組むことを見つけやすくします。</p></article>
        <article className="info-panel"><h2>情報の掲載方針</h2><p>出典と対象パッチを確かめ、十分に確認できていない攻略内容を確定情報として掲載しないことを重視しています。</p></article>
      </section>
      <section className="info-panel"><h2>主な機能</h2><ul><li>キャラクターの基本情報</li><li>4種類の診断・診断結果・診断履歴</li><li>今日の15分練習</li><li>診断結果に合わせたキャラクター候補</li><li>プレイヤー・動画</li><li>検索・情報源</li></ul></section>
    </div>
  );
}
