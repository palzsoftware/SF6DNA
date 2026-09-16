"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./player-identity.module.css";

type Props = { name: string; imageUrl: string | null; team: string | null; region: string | null; characters: string[] };
export function PlayerIdentity({ name, imageUrl, team, region, characters }: Props) {
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const visible = Boolean(imageUrl && loaded === imageUrl && failed !== imageUrl);
  return <div className={`${styles.card} ${imageUrl ? styles.withPhoto : styles.withoutPhoto}`}>
    <div className={styles.summary} aria-hidden={visible || undefined}>
      <span className={styles.initial} aria-hidden="true">{Array.from(name)[0]}</span>
      <p className={styles.name}>{name}</p>
      {team ? <p>{team}</p> : null}
      {region ? <p>{region}</p> : null}
      {characters.length ? <p>使用キャラクター：{characters.join(" / ")}</p> : null}
      {!imageUrl ? <p className={styles.mediaNote}>選手ビジュアルは今後のアップデートで追加予定です</p> : null}
    </div>
    {imageUrl && failed !== imageUrl ? <Image src={imageUrl} alt={name} fill
      className={`${styles.photo} ${visible ? styles.loaded : ""}`}
      sizes="(max-width: 720px) 100vw, 42vw"
      onLoad={() => setLoaded(imageUrl)} onError={() => setFailed(imageUrl)} /> : null}
  </div>;
}
