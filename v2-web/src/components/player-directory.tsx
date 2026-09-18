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
    ...player.characters.flatMap((character) => [character.characterName, character.characterSlug]),
  ];
  return fields.some((field) => field && normalizeSearch(field).includes(needle));
}

export function PlayerDirectory({ players }: { players: PlayerSummary[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const filteredPlayers = useMemo(
    () => players.filter((player) => playerMatchesQuery(player, deferredQuery)),
    [deferredQuery, players],
  );

  return <section className={styles.directory} aria-labelledby="player-directory-heading">
    <div className={styles.searchPanel}>
      <div>
        <h2 id="player-directory-heading">プレイヤーを検索</h2>
        <p>名前・別名・チーム・キャラクター・地域で絞り込めます。</p>
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
          {query ? <button type="button" onClick={() => setQuery("")}>クリア</button> : null}
        </div>
      </div>
      <p className={styles.resultCount} aria-live="polite">{filteredPlayers.length}件</p>
    </div>
    {filteredPlayers.length ? <div className={styles.playerGrid}>{filteredPlayers.map((player) => {
      const mainCharacter = player.characters.find((item) => item.role === "main") ?? player.characters[0];
      return <Link className={`${styles.playerCard}${player.imageUrl ? "" : " character-card--no-image"}`} href={`/players/${player.slug}`} key={player.id}><div className={styles.playerMark} aria-hidden="true">{Array.from(player.displayName)[0]}</div><div className={styles.cardBody}><p className="eyebrow">{playerTypeLabel(player.playerType)}</p><h2>{player.displayName}</h2><dl><div><dt>チーム</dt><dd>{player.teamName ?? "未登録"}</dd></div><div><dt>主なキャラクター</dt><dd>{mainCharacter?.characterName ?? "未登録"}</dd></div><div><dt>地域</dt><dd>{player.region ?? player.countryCode ?? "未登録"}</dd></div></dl><span>プロフィールを見る →</span></div></Link>;
    })}</div> : <div className="empty-state"><p>条件に一致するプレイヤーはいません。表記を変えるか、検索をクリアしてください。</p><button className="inline-button button-secondary" type="button" onClick={() => setQuery("")}>検索をクリア</button></div>}
  </section>;
}
