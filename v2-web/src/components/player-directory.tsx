"use client";

import { playerTeamAccent } from "@/lib/player-team-accent";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { playerDetailHref, playerDirectoryHref, readPlayerDirectoryState, type PlayerDirectoryState } from "@/lib/player-directory-navigation";
import { Suspense, useDeferredValue, useMemo } from "react";
import { playerMatchesQuery, playerMatchesFilters } from "@/lib/player-directory-filter";
import { playerRoleLabel } from "@/lib/player-labels";
import { playerTypeLabel } from "@/lib/player-labels";
import type { PlayerSummary } from "@/types/player";
import styles from "@/app/players/players.module.css";

export function PlayerDirectory({ players }: { players: PlayerSummary[] }) {
  return <Suspense fallback={<p role="status">プレイヤー一覧を読み込んでいます。</p>}>
    <PlayerDirectoryControls players={players} />
  </Suspense>;
}

function PlayerDirectoryControls({ players }: { players: PlayerSummary[] }) {
  const searchParams = useSearchParams();
  const state = useMemo(() => readPlayerDirectoryState(searchParams), [searchParams]);
  const { query, categories, teams, characters } = state;
  const update = (change: Partial<PlayerDirectoryState>) => {
    // Native History updates keep filtering local and replace the current entry.
    // Reading the URL here also preserves edits from rapid consecutive events.
    const current = readPlayerDirectoryState(new URLSearchParams(window.location.search));
    window.history.replaceState(null, "", playerDirectoryHref({ ...current, ...change }));
  };
  const setQuery = (query: string) => update({ query });
  const setCategories = (categories: string[]) => update({ categories });
  const setTeams = (teams: string[]) => update({ teams });
  const setCharacters = (characters: string[]) => update({ characters });
  const deferredQuery = useDeferredValue(query);
  const categoryOptions = useMemo(() => Array.from(new Set(
    players.flatMap((player) => player.playerType ? [player.playerType] : []),
  )).sort((a, b) => playerTypeLabel(a).localeCompare(playerTypeLabel(b), "ja")), [players]);
  const teamOptions = useMemo(() => Array.from(new Set(players.flatMap(player => player.teamName ? [player.teamName] : []))).sort((a, b) => a.localeCompare(b, "ja")), [players]);
  const characterOptions = useMemo(() => Array.from(new Map(
    players.flatMap((player) => player.characters.map((character) => [character.characterSlug, character.characterName] as const)),
  )).map(([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name, "ja")), [players]);
  const filteredPlayers = useMemo(
    () => players.filter((player) =>
      playerMatchesQuery(player, deferredQuery) && playerMatchesFilters(player, { categories, characters, teams }),
    ),
    [categories, characters, teams, deferredQuery, players],
  );
  const hasFilters = Boolean(query || categories.length || characters.length || teams.length);
  const toggle = (value: string, selected: string[], setSelected: (values: string[]) => void) => {
    setSelected(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };
  const clearAll = () => {
    update({ query: "", categories: [], characters: [], teams: [] });
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
            maxLength={256}
            autoComplete="off"
          />
          {hasFilters ? <button type="button" onClick={clearAll}>絞り込みを解除</button> : null}
        </div>
      </div>
      {categoryOptions.length ? <fieldset className={styles.filterGroup}>
        <legend>カテゴリ</legend>
        <div className={styles.filterOptions}>{categoryOptions.map((category) => <label key={category}>
          <input type="checkbox" checked={categories.includes(category)} onChange={() => toggle(category, categories, setCategories)} />
          <span>{playerTypeLabel(category)}</span>
        </label>)}</div>
      </fieldset> : null}
      {teamOptions.length ? <fieldset className={styles.filterGroup}>
        <legend>掲載チーム</legend>
        <div className={styles.filterOptions}>{teamOptions.map(team => <label key={team}>
          <input type="checkbox" checked={teams.includes(team)} onChange={() => toggle(team, teams, setTeams)} />
          <span>{team}</span>
        </label>)}</div>
      </fieldset> : null}
      {characterOptions.length ? <fieldset className={styles.filterGroup}>
        <legend>使用キャラクター</legend>
        <div className={styles.filterOptions}>{characterOptions.map((character) => <label key={character.slug}>
          <input type="checkbox" checked={characters.includes(character.slug)} onChange={() => toggle(character.slug, characters, setCharacters)} />
          <span>{character.name}</span>
        </label>)}</div>
      </fieldset> : null}
      <div className={styles.rankState}><strong>ランク</strong><span>ランクでの絞り込みは現在利用できません</span></div>
      {(categories.length || characters.length || teams.length) ? <div className={styles.filterChips} aria-label="選択中のフィルター">
        {teams.map(team => <button type="button" key={`team:${team}`} aria-label={`${team}の絞り込みを解除`} onClick={() => toggle(team, teams, setTeams)}>{team} ×</button>)}
        {categories.map((category) => <button type="button" key={category} onClick={() => toggle(category, categories, setCategories)}>{playerTypeLabel(category)} ×</button>)}
        {characters.map((slug) => <button type="button" key={slug} onClick={() => toggle(slug, characters, setCharacters)}>{characterOptions.find((item) => item.slug === slug)?.name ?? slug} ×</button>)}
      </div> : null}
      <p className={styles.filterNote}>チーム・キャラの各項目は掲載情報に基づきます。過去の使用を含み、現在の所属やメインを断定しません。</p>
      <p className={styles.resultCount} aria-live="polite">{filteredPlayers.length}件</p>
    </div>
    {filteredPlayers.length ? <div className={styles.playerGrid}>{filteredPlayers.map((player) => {
      const characterLabels = player.characters.map(item => `${item.characterName}（${playerRoleLabel(item.role)}）`);
      return <Link className={`${styles.playerCard}${player.imageUrl ? "" : " character-card--no-image"}`} style={{ borderColor: playerTeamAccent(player.teamName) }} href={playerDetailHref(player.slug, state)} key={player.id}><div className={styles.playerMark} aria-hidden="true">{Array.from(player.displayName)[0]}</div><div className={styles.cardBody}><p className="eyebrow">{playerTypeLabel(player.playerType)}</p><h2>{player.displayName}</h2><dl><div><dt>掲載チーム</dt><dd style={{ color: playerTeamAccent(player.teamName) }}>{player.teamName ?? "掲載情報は確認できていません。"}</dd></div><div><dt>使用キャラクター</dt><dd>{characterLabels.join(" / ") || "確認中"}</dd></div><div><dt>地域</dt><dd>{player.region ?? player.countryCode ?? "未登録"}</dd></div></dl><span>プロフィールを見る →</span></div></Link>;
    })}</div> : <div className="empty-state"><p>条件に一致するプレイヤーはいません。名前や絞り込み条件を変えて探せます。</p><button className="inline-button button-secondary" type="button" onClick={clearAll}>絞り込みを解除</button></div>}
  </section>;
}
