import { CharacterCompareTool } from "@/components/character-compare-tool";
import { listCharacters } from "@/lib/characters";

export const metadata = { title: "キャラクター比較" };

export default async function ComparePage() {
  const characters = await listCharacters();
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">COMPARE</p>
        <h1>キャラクター比較</h1>
        <p>公開済みの基本情報を2キャラクター並べて確認します。未検証攻略データは比較対象に含めません。</p>
      </section>
      <CharacterCompareTool characters={characters} />
    </div>
  );
}
