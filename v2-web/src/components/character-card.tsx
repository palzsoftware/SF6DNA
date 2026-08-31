import Image from "next/image";
import Link from "next/link";
import type { CharacterSummary } from "@/types/character";

export function CharacterCard({ character }: { character: CharacterSummary }) {
  return (
    <Link className="character-card" href={`/characters/${character.slug}`}>
      <div className="character-card__media" aria-hidden="true">
        {character.imageUrl ? (
          <Image
            src={character.imageUrl}
            alt=""
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
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
        {character.shortDescription ? (
          <p>{character.shortDescription}</p>
        ) : (
          <div className="character-card__topics" aria-label="収録カテゴリ">
            <span>技・フレーム</span>
            <span>対策</span>
            <span>トレーニング</span>
          </div>
        )}
        <div className="chip-row">
          {character.archetypeLabel ? <span className="chip">{character.archetypeLabel}</span> : null}
          {character.rangeLabel ? <span className="chip">{character.rangeLabel}</span> : null}
          {character.difficulty ? <span className="chip">難易度 {character.difficulty}/5</span> : null}
          <span className="chip chip--accent">データを見る →</span>
        </div>
      </div>
    </Link>
  );
}
