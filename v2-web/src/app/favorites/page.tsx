import { MyCharacterManager } from "@/components/my-character-manager";
import Link from "next/link";
import { listCharacters } from "@/lib/characters";

export const metadata = {
  title: "お気に入り",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function FavoritesPage() {
  const characters = await listCharacters();
  return (
    <div className="site-shell page-stack experience-return">
      <section className="hero">
        <p className="eyebrow">FAVORITES</p>
        <h1>保存したキャラへ、すぐ戻る。</h1>
        <p>よく見るキャラクターをこの端末に保存します。</p>
      </section>
      <nav className="return-paths" aria-label="保存した情報へ"><Link href="#saved-characters">キャラクター</Link><Link href="/videos">動画のお気に入りは動画一覧の絞り込みへ</Link></nav>
      <section id="saved-characters"><h2>この端末のキャラクター</h2><MyCharacterManager characters={characters} favoritesOnly /></section>
    </div>
  );
}
