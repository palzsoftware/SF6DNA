"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CharacterSummary } from "@/types/character";
import {
  getCharacterStatuses,
  getFavoriteCharacterSlugs,
  setCharacterStatus,
  setFavoriteCharacter,
  type CharacterUseStatus,
} from "@/lib/local-user-tools";

const STATUS_LABELS: Record<CharacterUseStatus, string> = {
  main: "メイン",
  sub: "サブ",
  learning: "練習中",
};

export function MyCharacterManager({
  characters,
  favoritesOnly = false,
}: {
  characters: CharacterSummary[];
  favoritesOnly?: boolean;
}) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Record<string, CharacterUseStatus>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(getFavoriteCharacterSlugs());
    setStatuses(getCharacterStatuses());
    setReady(true);
  }, []);

  const visible = useMemo(
    () => characters.filter((character) => !favoritesOnly || favorites.includes(character.slug)),
    [characters, favorites, favoritesOnly]
  );

  function toggleFavorite(slug: string) {
    const enabled = !favorites.includes(slug);
    setFavoriteCharacter(slug, enabled);
    setFavorites((current) => enabled ? [...current, slug] : current.filter((value) => value !== slug));
  }

  function changeStatus(slug: string, next: string) {
    const status = (next || null) as CharacterUseStatus | null;
    setCharacterStatus(slug, status);
    setStatuses((current) => {
      const updated = { ...current };
      if (status) updated[slug] = status;
      else delete updated[slug];
      return updated;
    });
  }

  if (!ready) return <div className="empty-state"><p>保存データを読み込んでいます。</p></div>;

  if (visible.length === 0) {
    return (
      <div className="empty-state">
        <h2>{favoritesOnly ? "お気に入りはまだありません" : "公開キャラクターがありません"}</h2>
        <p>{favoritesOnly ? "キャラクター詳細またはマイキャラ管理から登録できます。" : "公開データの準備後に利用できます。"}</p>
      </div>
    );
  }

  return (
    <div className="user-character-grid">
      {visible.map((character) => {
        const favorite = favorites.includes(character.slug);
        return (
          <article className="user-character-card" key={character.id}>
            <div className="user-character-card__head">
              <div>
                <h2><Link href={`/characters/${character.slug}`}>{character.name}</Link></h2>
                {character.nameEn ? <p>{character.nameEn}</p> : null}
              </div>
              <button type="button" className="secondary-button" onClick={() => toggleFavorite(character.slug)} aria-pressed={favorite}>
                {favorite ? "★" : "☆"}
              </button>
            </div>
            <div className="chip-row">
              {character.archetypeLabel ? <span className="chip">{character.archetypeLabel}</span> : null}
              {character.rangeLabel ? <span className="chip">{character.rangeLabel}</span> : null}
            </div>
            <label className="compact-field">
              <span>使用状況</span>
              <select value={statuses[character.slug] ?? ""} onChange={(event) => changeStatus(character.slug, event.target.value)}>
                <option value="">未設定</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option value={value} key={value}>{label}</option>
                ))}
              </select>
            </label>
          </article>
        );
      })}
    </div>
  );
}
