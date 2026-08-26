export const metadata = {
  title: "プレイヤー情報",
};

export default function PlayersPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">PLAYERS</p>
        <h1>プレイヤー情報</h1>
        <p>
          プロ、強豪、キャラ職人、配信者、攻略投稿者をキャラクター・大会・試合・動画と関連付ける機能です。
          正式DB接続はPhase8で実装します。
        </p>
      </section>
    </div>
  );
}
