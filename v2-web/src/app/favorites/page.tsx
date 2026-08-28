import { MyCharacterManager } from "@/components/my-character-manager";
import { listCharacters } from "@/lib/characters";

export const metadata = { title: "お気に入り" };

export default async function FavoritesPage() {
  const characters = await listCharacters();
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">FAVORITES</p>
        <h1>お気に入り</h1>
        <p>よく確認するキャラクターを端末内に保存します。</p>
      </section>
      <MyCharacterManager characters={characters} favoritesOnly />
    </div>
  );
}
