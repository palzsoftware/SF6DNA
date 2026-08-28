export const metadata = { title: "SF6DNAについて" };

export default function AboutPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">ABOUT</p>
        <h1>SF6DNAについて</h1>
        <p>Street Fighter 6の診断・キャラクター情報・プレイヤー情報・攻略データ・トレーニング・AIコーチングを1つにつなぐ総合プラットフォームです。</p>
      </section>
      <section className="character-columns">
        <article className="info-panel"><h2>目的</h2><p>初心者から上級者まで、必要な情報を探しやすくし、練習・対策・キャラクター選びを継続的に支援します。</p></article>
        <article className="info-panel"><h2>データ方針</h2><p>draftとpublished、reviewedとverifiedを分離し、出典・パッチ・検証状態を確認できない攻略情報を確定情報として公開しません。</p></article>
      </section>
      <section className="info-panel"><h2>主な機能</h2><ul><li>キャラクター辞典・技・フレーム</li><li>コンボ・セットプレイ・対策・トレーニング</li><li>診断・キャラクター適性基盤</li><li>プレイヤー・動画</li><li>統合検索</li><li>Source付きEvidenceを使うAI Coach Retrieval</li><li>お気に入り・マイキャラ・比較・ランク記録・診断履歴</li></ul></section>
    </div>
  );
}
