import Link from "next/link";
import type { CharacterSummary } from "@/types/character";

export function CharacterCard({ character }: { character: CharacterSummary }) {
  return (
    <Link className="character-card" href={`/characters/${character.slug}`}>
      <div className="character-card__media" aria-hidden="true">
        {character.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={character.imageUrl} alt="" width={720} height={480} loading="lazy" />
        ) : (
          <span>{character.name.slice(0, 1)}</span>
        )}
        <div className="character-card__scrim" />
        <div className="character-card__nameplate">
          <p className="eyebrow">FIGHTER</p>
          <h2>{character.name}</h2>
          {character.nameEn ? <p className="character-card__en">{character.nameEn}</p> : null}
        </div>
      </div>
      <div className="character-card__body">
        <p>
          {character.shortDescription ??
            "技・フレーム・コンボ・対策など、公開済みの検証データを確認できます。"}
        </p>
        <div className="chip-row">
          {character.archetypeLabel ? <span className="chip">{character.archetypeLabel}</span> : null}
          {character.rangeLabel ? <span className="chip">{character.rangeLabel}</span> : null}
          {character.difficulty ? <span className="chip">難易度 {character.difficulty}/5</span> : null}
          <span className="chip chip--accent">DATA →</span>
        </div>
      </div>
    </Link>
  );
}
