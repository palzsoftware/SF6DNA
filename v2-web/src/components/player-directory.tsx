"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { playerTypeLabel } from "@/lib/player-labels";
import type { PlayerSummary } from "@/types/player";
import styles from "@/app/players/players.module.css";

const normalizeSearch = (value: string) => value
  .normalize("NFKC")
  .toLocaleLowerCase("ja")
  .replace(/[\s_-]+/g, "")
  .trim();

export function playerMatchesQuery(player: PlayerSummary, query: string) {
  const needle = normalizeSearch(query);
  if (!needle) return true;
  const fields = [
    player.displayName,
    ...player.aliases,
    player.teamName,
    player.region,
    player.countryCode,
    playerTypeLabel(player.playerType),
    ...player.characters.flatMap((character) => [character.characterName, character.characterSlug]),
  ];
  return fields.some((field) => field && normalizeSearch(field).includes(needle));
}

type PlayerFilters = {
  categories: string[];
  characters: string[];
};

export function playerMatchesFilters(player: PlayerSummary, filters: PlayerFilters) {
  const categoryMatch = !filters.categories.length ||
    (player.playerType !== null && filters.categories.includes(player.playerType));
  const characterMatch = !filters.characters.length || player.characters.some(
    (character) => filters.characters.includes(character.characterSlug),
  );
  return categoryMatch && characterMatch;
}

export function PlayerDirectory({ players }: { players: PlayerSummary[] }) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const deferredQuery = useDeferredValue(query);
  const categoryOptions = useMemo(() => Array.from(new Set(
    players.flatMap((player) => player.playerType ? [player.playerType] : []),
  )).sort((a, b) => playerTypeLabel(a).localeCompare(playerTypeLabel(b), "ja")), [players]);
  const characterOptions = useMemo(() => Array.from(new Map(
    players.flatMap((player) => player.characters.map((character) => [character.characterSlug, character.characterName] as const)),
  )).map(([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name, "ja")), [players]);
  const filteredPlayers = useMemo(
    () => players.filter((player) =>
      playerMatchesQuery(player, deferredQuery) && playerMatchesFilters(player, { categories, characters }),
    ),
    [categories, characters, deferredQuery, players],
  );
  const hasFilters = Boolean(query || categories.length || characters.length);
  const toggle = (value: string, selected: string[], setSelected: (values: string[]) => void) => {
    setSelected(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };
  const clearAll = () => {
    setQuery("");
    setCategories([]);
    setCharacters([]);
  };

  return <section className={styles.directory} aria-labelledby="player-directory-heading">
    <div className={styles.searchPanel}>
      <div>
        <h2 id="player-directory-heading">プレイヤーを検索</h2>
        <p>名前・別名・チーム・キャラクター・カテゴリ・地域で絞り込めます。</p>
      </div>
      <div className={styles.searchControl}>
        <label htmlFor="player-search">検索キーワード</label>
        <div className={styles.searchRow}>
          <input
            id="player-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例：ときど、VARREL、JP"
            autoComplete="off"
          />
          {hasFilters ? <button type="button" onClick={clearAll}>検索をクリア</button> : null}
        </div>
      </div>
      <fieldset className={styles.filterGroup}>
        <legend>カテゴリ</legend>
        <div className={styles.filterOptions}>{categoryOptions.map((category) => <label key={category}>
          <input type="checkbox" checked={categories.includes(category)} onChange={() => toggle(category, categories, setCategories)} />
          <span>{playerTypeLabel(category)}</span>
        </label>)}</div>
      </fieldset>
      <fieldset className={styles.filterGroup}>
        <legend>使用キャラクター</legend>
        <div className={styles.filterOptions}>{characterOptions.map((character) => <label key={character.slug}>
          <input type="checkbox" checked={characters.includes(character.slug)} onChange={() => toggle(character.slug, characters, setCharacters)} />
          <span>{character.name}</span>
        </label>)}</div>
      </fieldset>
      <div className={styles.rankState}><strong>ランク</strong><span>確認日つきデータの連携後に利用できます</span></div>
      {(categories.length || characters.length) ? <div className={styles.filterChips} aria-label="選択中のフィルター">
        {categories.map((category) => <button type="button" key={category} onClick={() => toggle(category, categories, setCategories)}>{playerTypeLabel(category)} ×</button>)}
        {characters.map((slug) => <button type="button" key={slug} onClick={() => toggle(slug, characters, setCharacters)}>{characterOptions.find((item) => item.slug === slug)?.name ?? slug} ×</button>)}
      </div> : null}
      <p className={styles.resultCount} aria-live="polite">{filteredPlayers.length}件</p>
    </div>
    {filteredPlayers.length ? <div className={styles.playerGrid}>{filteredPlayers.map((player) => {
      const mainCharacter = player.characters.find((item) => item.role === "main") ?? player.characters[0];
      return <Link className={`${styles.playerCard}${player.imageUrl ? "" : " character-card--no-image"}`} href={`/players/${player.slug}`} key={player.id}><div className={styles.playerMark} aria-hidden="true">{Array.from(player.displayName)[0]}</div><div className={styles.cardBody}><p className="eyebrow">{playerTypeLabel(player.playerType)}</p><h2>{player.displayName}</h2><dl><div><dt>チーム</dt><dd>{player.teamName ?? "未登録"}</dd></div><div><dt>主なキャラクター</dt><dd>{mainCharacter?.characterName ?? "未登録"}</dd></div><div><dt>地域</dt><dd>{player.region ?? player.countryCode ?? "未登録"}</dd></div></dl><span>プロフィールを見る →</span></div></Link>;
    })}</div> : <div className="empty-state"><p>条件に一致するプレイヤーはいません。検索語またはフィルターを変更してください。</p><button className="inline-button button-secondary" type="button" onClick={clearAll}>条件をすべてクリア</button></div>}
  </section>;
}
