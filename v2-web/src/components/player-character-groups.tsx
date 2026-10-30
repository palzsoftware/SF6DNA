import Link from "next/link";
import type { PlayerCharacter } from "@/types/player";
import styles from "@/app/players/players.module.css";

const groups = [
  { title: "メイン", roles: ["main"] },
  { title: "サブ", roles: ["secondary", "sub"] },
  { title: "過去の使用", roles: ["historical", "former"] },
  { title: "大会での使用", roles: ["tournament"] },
] as const;

export function PlayerCharacterGroups({ characters }: { characters: PlayerCharacter[] }) {
  const knownRoles = new Set<string>(groups.flatMap(group => [...group.roles]));
  const sections = [...groups.map(group => ({ title: group.title, rows: characters.filter(row => (group.roles as readonly string[]).includes(row.role)) })),
    { title: "使用関係（区分未確認）", rows: characters.filter(row => !knownRoles.has(row.role)) }];
  return <>
    <p>掲載データの区分で表示しています。現在のメイン・サブは、確認済み情報がある場合に別途案内します。</p>
    {sections.map(section => <div className={styles.characterGroup} key={section.title}>
      <h3>{section.title}</h3>
      {section.rows.length ? <div className={styles.characterLinks}>{section.rows.map((row, index) =>
        <Link href={`/characters/${encodeURIComponent(row.characterSlug)}`} key={`${row.characterId}:${row.role}:${index}`}>{row.characterName}</Link>)}</div>
        : <p className={styles.filterNote}>確認できた情報はまだありません。</p>}
    </div>)}
  </>;
}
