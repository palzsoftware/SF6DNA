export const metadata = {
  title: "キャラクター情報",
};

export default function CharactersPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">CHARACTERS</p>
        <h1>キャラクター情報</h1>
        <p>
          技、フレーム、コンボ、セットプレイ、立ち回り、対策をキャラクター単位でつなぐ辞典機能です。
          データ接続はPhase5で実装します。
        </p>
      </section>
    </div>
  );
}
