import { notFound } from "next/navigation";
import { CharacterTabs } from "@/components/character-tabs";
import { getCharacterBySlug } from "@/lib/characters";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);

  if (!character) return { title: "キャラクター情報 | SF6DNA" };

  return {
    title: `${character.name} | キャラクター情報 | SF6DNA`,
    description:
      character.shortDescription ?? `${character.name}の攻略・技・コンボ・対策情報をまとめています。`,
  };
}

export default async function CharacterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);

  if (!character) notFound();

  return (
    <div className="site-shell page-stack">
      <section className="character-hero">
        <div>
          <p className="eyebrow">CHARACTER</p>
          <h1>{character.name}</h1>
          {character.nameEn ? <p className="character-subtitle">{character.nameEn}</p> : null}
          <p>{character.shortDescription ?? "概要情報を準備中です。"}</p>
          <div className="chip-row">
            {character.archetypeLabel ? <span className="chip">{character.archetypeLabel}</span> : null}
            {character.rangeLabel ? <span className="chip">{character.rangeLabel}</span> : null}
            {character.difficulty ? <span className="chip">難易度 {character.difficulty}/5</span> : null}
          </div>
        </div>
        {character.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="character-hero__image" src={character.imageUrl} alt={character.name} />
        ) : null}
      </section>

      <CharacterTabs slug={character.slug} active="overview" />

      <section className="character-columns">
        <article className="info-panel">
          <h2>強み</h2>
          <p className="preline">{character.strengthsSummary ?? "検証済みデータを準備中です。"}</p>
        </article>
        <article className="info-panel">
          <h2>弱み</h2>
          <p className="preline">{character.weaknessesSummary ?? "検証済みデータを準備中です。"}</p>
        </article>
      </section>

      <section>
        <div className="section-heading">
          <h2>立ち回り・考え方</h2>
          <p>攻略本文はパッチと出典を確認した上で公開します。</p>
        </div>
        <div className="guide-stack">
          {character.guideSections.length ? (
            character.guideSections.map((section) => (
              <article className="info-panel" key={section.id}>
                <h3>{section.title}</h3>
                <p className="preline">{section.body}</p>
              </article>
            ))
          ) : (
            <div className="empty-state"><p>公開済み攻略セクションはまだありません。</p></div>
          )}
        </div>
      </section>
    </div>
  );
}
