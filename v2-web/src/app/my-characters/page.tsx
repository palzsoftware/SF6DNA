import { MyCharacterManager } from "@/components/my-character-manager";
import { listCharacters } from "@/lib/characters";

export const metadata = { title: "マイキャラ" };

export default async function MyCharactersPage() {
  const characters = await listCharacters();
  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">MY CHARACTERS</p>
        <h1>マイキャラ</h1>
        <p>メイン・サブ・練習中のキャラクターを管理できます。お気に入り登録もここから変更できます。</p>
      </section>
      <MyCharacterManager characters={characters} />
    </div>
  );
}
