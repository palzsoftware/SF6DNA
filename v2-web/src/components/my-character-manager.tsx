"use client";

import { MiniIllustration } from "@/components/mini-illustration";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CharacterSummary } from "@/types/character";
import {
  getCharacterStatuses,
  getFavoriteCharacterSlugs,
  setCharacterStatus,
  setFavoriteCharacter,
  type CharacterUseStatus,
  type PersonalOwner,
} from "@/lib/personalization-storage";
import { usePersonalizationOwner } from "@/lib/use-personalization-owner";

const STATUS_LABELS: Record<CharacterUseStatus, string> = {
  main: "メイン",
  sub: "サブ",
  learning: "練習中",
};

export function MyCharacterManager({ characters, favoritesOnly = false }: {
  characters: CharacterSummary[];
  favoritesOnly?: boolean;
}) {
  const { state, isCurrent } = usePersonalizationOwner();
  if (state.status === "error") return <div className="empty-state"><p>認証状態を確認できません。記録を表示せず保護しています。ページを再読み込みしてください。</p></div>;
  if (state.status !== "ready" || !isCurrent()) return <div className="empty-state"><p>お気に入りとマイキャラを読み込んでいます。</p></div>;
  return <ScopedMyCharacterManager key={state.owner} owner={state.owner} isCurrent={isCurrent} characters={characters} favoritesOnly={favoritesOnly} />;
}

function ScopedMyCharacterManager({ owner, isCurrent, characters, favoritesOnly }: {
  owner: PersonalOwner;
  isCurrent: () => boolean;
  characters: CharacterSummary[];
  favoritesOnly: boolean;
}) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Record<string, CharacterUseStatus>>({});
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!isCurrent()) return;
      setFavorites(getFavoriteCharacterSlugs(owner));
      setStatuses(getCharacterStatuses(owner));
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [owner, isCurrent]);

  const visible = useMemo(
    () => characters.filter((character) => !favoritesOnly || favorites.includes(character.slug)),
    [characters, favorites, favoritesOnly]
  );

  function toggleFavorite(slug: string) {
    if (!isCurrent()) return;
    const enabled = !favorites.includes(slug);
    if (!setFavoriteCharacter(owner, slug, enabled)) { setStorageError(true); return; }
    setStorageError(false);
    setFavorites((current) => enabled ? [...current, slug] : current.filter((value) => value !== slug));
  }

  function changeStatus(slug: string, next: string) {
    if (!isCurrent()) return;
    const status = (next || null) as CharacterUseStatus | null;
    if (!setCharacterStatus(owner, slug, status)) { setStorageError(true); return; }
    setStorageError(false);
    setStatuses((current) => {
      const updated = { ...current };
      if (status) updated[slug] = status;
      else delete updated[slug];
      return updated;
    });
  }

  if (!ready || !isCurrent()) return <div className="empty-state"><p>お気に入りとマイキャラを読み込んでいます。</p></div>;

  if (visible.length === 0) {
    return (
      <div className="empty-state">
        <MiniIllustration kind="saved" /><h2>{favoritesOnly ? "お気に入りはまだありません" : "公開キャラクターがありません"}</h2>
        <p>{favoritesOnly ? "キャラクターページの☆から追加できます。マイキャラからも選べます。" : "キャラクター情報が掲載されると、ここから選べます。"}</p>{favoritesOnly ? <Link className="button-secondary inline-button" href="/characters">キャラクターを探す</Link> : null}
        {storageError ? <p role="alert">端末への保存に失敗しました。</p> : null}
      </div>
    );
  }

  return (
    <div className="user-character-grid">
      {storageError ? <p role="alert">端末への保存に失敗しました。ブラウザの空き容量や設定をご確認ください。</p> : null}
      {visible.map((character) => {
        const favorite = favorites.includes(character.slug);
        return (
          <article className="user-character-card" key={character.id}>
            <div className="user-character-card__head">
              <div>
                <h2><Link href={`/characters/${character.slug}`}>{character.name}</Link></h2>
                {character.nameEn ? <p>{character.nameEn}</p> : null}
              </div>
              <button type="button" className="secondary-button" onClick={() => toggleFavorite(character.slug)} aria-pressed={favorite} aria-label={`${character.name}をお気に入り${favorite ? "から削除" : "に追加"}`}>
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
