import { RankTrackerTool } from "@/components/rank-tracker-tool";
import { listCharacters } from "@/lib/characters";

export const metadata = { title: "ランク記録" };

export default async function RankTrackerPage() {
  const characters = await listCharacters();
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">RANK TRACKER</p>
        <h1>ランク記録</h1>
        <p>キャラクター別にMR/LPと短いメモを保存します。記録はこのブラウザ内だけに保持されます。</p>
      </section>
      <RankTrackerTool characters={characters} />
    </div>
  );
}
