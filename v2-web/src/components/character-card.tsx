import Link from "next/link";
import type { CharacterSummary } from "@/types/character";

export function CharacterCard({ character }: { character: CharacterSummary }) {
  return (
    <Link className="character-card" href={`/characters/${character.slug}`}>
      <div className="character-card__media" aria-hidden="true">
        {character.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={character.imageUrl} alt="" width={480} height={320} loading="lazy" />
        ) : (
          <span>{character.name.slice(0, 1)}</span>
        )}
      </div>
      <div className="character-card__body">
        <div>
          <p className="eyebrow">CHARACTER</p>
          <h2>{character.name}</h2>
          {character.nameEn ? <p className="character-card__en">{character.nameEn}</p> : null}
        </div>
        <p>{character.shortDescription ?? "詳細情報を準備中です。"}</p>
        <div className="chip-row">
          {character.archetypeLabel ? <span className="chip">{character.archetypeLabel}</span> : null}
          {character.rangeLabel ? <span className="chip">{character.rangeLabel}</span> : null}
          {character.difficulty ? <span className="chip">難易度 {character.difficulty}/5</span> : null}
        </div>
      </div>
    </Link>
  );
}
