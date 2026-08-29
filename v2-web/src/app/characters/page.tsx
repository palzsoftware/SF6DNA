import { CharacterCard } from "@/components/character-card";
import { characterDataSourceStatus, listCharacters } from "@/lib/characters";

export const metadata = {
  title: "キャラクター情報",
  description: "SF6のキャラクター情報を、技・フレーム・コンボ・セットプレイ・対策・トレーニングまで横断して確認できる辞典です。",
};

export default async function CharactersPage() {
  const characters = await listCharacters();
  const sourceStatus = characterDataSourceStatus();

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">CHARACTERS</p>
        <h1>キャラクター辞典</h1>
        <p>
          キャラクター概要から技、フレーム、コンボ、セットプレイ、対策、トレーニング、参考プレイヤーまでを1つにつなぐSF6DNAの中核コンテンツです。
        </p>
      </section>

      {sourceStatus === "unconfigured" ? (
        <section className="data-notice" aria-live="polite">
          <strong>キャラクターデータを取得できません</strong>
          <p>現在データを読み込めません。接続状態を確認して、時間をおいて再読み込みしてください。</p>
        </section>
      ) : null}

      {characters.length > 0 ? (
        <section>
          <div className="section-heading">
            <h2>キャラクター一覧</h2>
            <p>{characters.length}件の公開データ</p>
          </div>
          <div className="character-grid">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </section>
      ) : (
        <section className="empty-state">
          <h2>公開データはまだありません</h2>
          <p>出典・対象パッチ・確認状態を確認できた情報から順に公開します。</p>
        </section>
      )}
    </div>
  );
}
